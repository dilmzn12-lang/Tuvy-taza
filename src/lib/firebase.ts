import { initializeApp } from 'firebase/app';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyBq6FjDsEUVqi3njBJAGzJD2ziI87ywmGg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'gen-lang-client-0907948855.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'gen-lang-client-0907948855',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'gen-lang-client-0907948855.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '525366296558',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:525366296558:web:43683c9884f57547f418ff',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connected successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    } else {
      console.error('Firebase connection test failed:', error);
    }
  }
}
