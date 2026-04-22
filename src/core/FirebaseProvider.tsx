import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';

const Ctx = createContext<any>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      
      // Auto-signin if no user exists and not loading
      if (!u) {
        signInAnonymously(auth).catch(err => console.error("Auto guest sign-in failed:", err));
      }
    });
    return () => unsub();
  }, []);

  const logOut = () => signOut(auth);

  return <Ctx.Provider value={{ user, loading, logOut }}>{children}</Ctx.Provider>;
}

export const useFirebase = () => useContext(Ctx);
