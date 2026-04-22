import { useEffect } from 'react';
import { doc, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCIS, Reflection } from '../state/cisStore';

export const useSyncCIS = (userId: string | undefined) => {
  const { setStats, setReflections, setGlobalStats, setLoaded } = useCIS();

  useEffect(() => {
    // 1. Sync Global Stats (Public - always sync if possible)
    const globalRef = doc(db, 'global', 'stats');
    const unsubGlobal = onSnapshot(globalRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalStats({
          totalXp: data.totalXp || 0,
          totalReflections: data.totalReflections || 0
        });
      } else {
        setGlobalStats({ totalXp: 0, totalReflections: 0 });
      }
    }, (error) => console.warn("Global stats sync restricted or failed:", error));

    if (!userId) {
      setLoaded(false);
      return () => {
        unsubGlobal();
      };
    }

    // Sync Profile
    const userRef = doc(db, 'users', userId);
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats(data.xp || 0, data.level || 1);
      }
    }, (error) => console.error("User sync error:", error));

    // Sync Reflections
    const reflectionsRef = collection(db, 'users', userId, 'reflections');
    const q = query(reflectionsRef, orderBy('serverTimestamp', 'desc'), limit(50));
    const unsubReflections = onSnapshot(q, (querySnap) => {
      const refs = querySnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Reflection[];
      // We want internal state chronological, but sync is desc for limit
      setReflections([...refs].reverse()); 
      setLoaded(true);
    }, (error) => console.error("Reflections sync error:", error));

    return () => {
      unsubGlobal();
      unsubUser();
      unsubReflections();
    };
  }, [userId, setStats, setReflections, setGlobalStats, setLoaded]);
};
