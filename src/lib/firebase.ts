import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export function handleFirestoreError(error: any, operationType: string, path: string | null): never {
  const user = auth.currentUser;
  const errorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: { userId: user?.uid || 'anonymous' }
  };
  throw new Error(JSON.stringify(errorInfo));
}
