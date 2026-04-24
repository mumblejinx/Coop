import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  signOut, 
  User 
} from 'firebase/auth';
import { doc, getDocFromServer, setDoc, Timestamp } from 'firebase/firestore';
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

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
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
          console.warn("User profile check skipped:", e);
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
      console.error("Google Sign-In Error:", error.code, error.message);
      if (error.code === 'auth/unauthorized-domain') {
        alert(`Sign-in failed: This domain is not authorized in the Firebase Console. Please add mumblejinx.github.io to the Authorized Domains list in the Firebase Console under Authentication > Settings.`);
      } else if (error.code === 'auth/popup-blocked') {
        alert(`Sign-in failed: The browser blocked the authentication popup. Please allow popups for this site.`);
      } else {
        alert(`Sign-in failed [${error.code}]: ${error.message}`);
      }
    }
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest Sign-In Error:", error.code, error.message);
      if (error.code === 'auth/operation-not-allowed') {
        alert("Guest Mode is not active yet. Please ensure the 'Anonymous' provider is enabled in your Firebase Authentication settings (Authentication > Sign-in method).");
      } else {
        alert(`Guest sign-in failed [${error.code}]: ${error.message}`);
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
