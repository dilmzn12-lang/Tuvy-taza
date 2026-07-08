import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0907948855",
  appId: "1:525366296558:web:43683c9884f57547f418ff",
  apiKey: "AIzaSyBq6FjDsEUVqi3njBJAGzJD2ziI87ywmGg",
  authDomain: "gen-lang-client-0907948855.firebaseapp.com",
  storageBucket: "gen-lang-client-0907948855.firebasestorage.app",
  messagingSenderId: "525366296558",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connected successfully");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.", error);
    } else {
      console.error("Firebase connection test failed:", error);
    }
    return false;
  }
}
