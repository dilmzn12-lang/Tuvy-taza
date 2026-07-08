import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, Store } from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { homeRouteForRole } from '@/lib/roles';

function toSlug(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'restaurant'
  );
}

export function Onboarding() {
  const { user, loading, restaurantId, setRestaurantId, logOut, refreshProfile, role } = useAuth();
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (restaurantId) {
    return <Navigate to={homeRouteForRole(role)} replace />;
  }

  const handleCreateRestaurant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const name = restaurantName.trim();
    if (!name) return;

    setCreating(true);
    try {
      const newRestaurantId = `rest_${Date.now()}`;
      const slug = toSlug(name);

      await setDoc(doc(db, 'restaurants', newRestaurantId), {
        name,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        slug,
      });

      await setDoc(
        doc(db, 'users', user.uid),
        {
          role: 'owner',
          restaurantId: newRestaurantId,
        },
        { merge: true },
      );

      setRestaurantId(newRestaurantId);
      await refreshProfile();
      navigate('/dashboard', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to create your restaurant.');
    } finally {
      setCreating(false);
    }
  };

  const handleCustomer = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#050505] p-4 font-sans text-slate-300 selection:bg-amber-500/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#080808] p-8 shadow-2xl"
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">Create your restaurant</h1>
        <p className="mb-6 text-sm text-slate-400">Set up your first tenant workspace or continue as a customer.</p>

        <form onSubmit={handleCreateRestaurant} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Restaurant Name</label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(event) => setRestaurantName(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-500"
              placeholder="e.g. Cafe Milano"
            />
          </div>

          {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={creating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Complete setup
          </button>
        </form>

        <button
          onClick={handleCustomer}
          className="mt-4 w-full rounded-xl border border-slate-800 bg-transparent py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
        >
          Continue as customer
        </button>

        <button onClick={logOut} className="mt-6 w-full text-center text-sm text-slate-500 transition-colors hover:text-white">
          Sign out
        </button>
      </motion.div>
    </div>
  );
}
