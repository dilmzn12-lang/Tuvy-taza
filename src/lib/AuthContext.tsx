import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { authErrorMessage } from './authErrors';
import { auth, db } from './firebase';
import type { Role, UserProfile } from './types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  restaurantId: string | null;
  role: Role | null;
  emailVerified: boolean;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  reloadUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setRestaurantId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';
  return code ? authErrorMessage(code) : 'Something went wrong. Please try again.';
}

async function createOrMergeUserProfile(
  user: User,
  role: Role,
  restaurantId: string | null,
  extra: Partial<UserProfile> = {},
) {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      email: user.email ?? '',
      name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
      role,
      restaurantId,
      createdAt: serverTimestamp(),
      ...extra,
    },
    { merge: true },
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantIdState] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const syncProfile = async (currentUser: User) => {
    const snap = await getDoc(doc(db, 'users', currentUser.uid));

    if (!snap.exists()) {
      setProfile(null);
      setRestaurantIdState(null);
      setRole(null);
      return;
    }

    const data = snap.data() as Partial<UserProfile>;
    const nextProfile: UserProfile = {
      uid: currentUser.uid,
      email: data.email ?? currentUser.email ?? '',
      name: data.name ?? currentUser.displayName ?? currentUser.email?.split('@')[0] ?? 'User',
      role: (data.role ?? 'customer') as Role,
      restaurantId: data.restaurantId ?? null,
      createdAt: data.createdAt,
    };

    setProfile(nextProfile);
    setRestaurantIdState(nextProfile.restaurantId);
    setRole(nextProfile.role);
  };

  const refreshProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfile(null);
      setRestaurantIdState(null);
      setRole(null);
      return;
    }

    await syncProfile(currentUser);
  };

  useEffect(() => {
    let active = true;

    void setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Unable to set auth persistence', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;

      setUser(currentUser);
      setEmailVerified(currentUser?.emailVerified ?? false);

      if (!currentUser) {
        setProfile(null);
        setRestaurantIdState(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        await syncProfile(currentUser);
      } catch (error) {
        console.error('Error fetching user data', error);
        setProfile(null);
        setRestaurantIdState(null);
        setRole(null);
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await sendEmailVerification(credential.user);
      await createOrMergeUserProfile(credential.user, 'customer', null, { name });
      await refreshProfile();
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      const googleUser = credential.user;
      const snap = await getDoc(doc(db, 'users', googleUser.uid));

      if (!snap.exists()) {
        await createOrMergeUserProfile(googleUser, 'customer', null, {
          name: googleUser.displayName ?? googleUser.email?.split('@')[0] ?? 'User',
        });
      }

      await refreshProfile();
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const sendVerificationEmail = async () => {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user found.');
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      if (error instanceof Error && error.message === 'No authenticated user found.') {
        throw error;
      }
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const reloadUser = async () => {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user found.');
      await reload(auth.currentUser);
      setUser(auth.currentUser);
      setEmailVerified(auth.currentUser.emailVerified);
      await refreshProfile();
    } catch (error) {
      if (error instanceof Error && error.message === 'No authenticated user found.') {
        throw error;
      }
      throw new Error(getAuthErrorMessage(error));
    }
  };

  const setRestaurantId = (id: string | null) => {
    setRestaurantIdState(id);
    setProfile((current) => (current ? { ...current, restaurantId: id } : current));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        restaurantId,
        role,
        emailVerified,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        logOut,
        sendVerificationEmail,
        resetPassword,
        reloadUser,
        refreshProfile,
        setRestaurantId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
