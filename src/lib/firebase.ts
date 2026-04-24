import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); 
export const auth = getAuth(app);

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
