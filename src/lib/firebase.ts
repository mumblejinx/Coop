import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlvsIeoRNbvsZxBYiQMrwjQFkWT2mqiNg",
  authDomain: "cooperativeintelligencesystems.firebaseapp.com",
  projectId: "cooperativeintelligencesystems",
  storageBucket: "cooperativeintelligencesystems.appspot.com",
  messagingSenderId: "638085884789",
  appId: "1:638085884789:web:b1ac76ece8b0b1db9c813c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app "ai-studio-c4ff6291-23dc-4510-b9a3-5873f24e7532");

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
