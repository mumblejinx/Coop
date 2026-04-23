import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDlvsIeoRNbvsZxBYiQMrwjQFkWT2mqiNg",
  authDomain: "cooperativeintelligencesystems.firebaseapp.com",
  projectId: "cooperativeintelligencesystems",
  storageBucket: "cooperativeintelligencesystems.firebasestorage.app",
  messagingSenderId: "638085884789",
  appId: "1:638085884789:web:b1ac76ece8b0b1db9c813c"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// ✅ Firestore (THIS is the key fix)
export const db = getFirestore(app);

export function handleFirestoreError(
  error: any,
  operationType: string,
  path: string | null
): never {
  const user = auth.currentUser;

  const errorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: { userId: user?.uid || "anonymous" }
  };

  console.error("🔥 Firestore Error:", errorInfo);

  throw new Error(JSON.stringify(errorInfo));
}