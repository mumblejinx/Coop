import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  signOut, 
  User 
} from 'firebase/auth';
import { doc, getDocFromServer, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Mandatory Connection Test
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or internet connection.");
        }
      }
    };
    testConnection();

    // 2. Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Ensure user doc exists
        const userRef = doc(db, 'users', u.uid);
        try {
          const userDoc = await getDocFromServer(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              xp: 0,
              level: 1,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            });
          }
        } catch (e) {
          console.warn("User profile check skipped (expected for guest first-time or check failure):", e);
        }
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.message);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        console.error("Guest mode (Anonymous Auth) is not enabled in the Firebase Console.");
        alert("Guest Mode is not active yet. Please ensure 'Anonymous' provider is enabled in your Firebase Authentication settings.");
      } else {
        console.error("Guest Sign-In Error:", error.message);
        alert(`Guest sign-in failed: ${error.message}`);
      }
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, signIn, signInAsGuest, logOut }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) throw new Error('useFirebase must be used within FirebaseProvider');
  return context;
};
