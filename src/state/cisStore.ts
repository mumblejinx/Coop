import { create } from 'zustand';
import { 
  doc, 
  collection, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  updateDoc,
  increment,
  query,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';

export type Theme = 'kindness' | 'trust' | 'fun' | 'teamwork';

export interface Reflection {
  id?: string;
  input: string;
  reflection: string;
  question?: string;
  theme: Theme;
  timestamp: number;
}

interface CISState {
  xp: number;
  level: number;
  reflections: Reflection[];
  globalStats: {
    totalXp: number;
    totalReflections: number;
  } | null;
  isLoaded: boolean;

  setStats: (xp: number, level: number) => void;
  setReflections: (reflections: Reflection[]) => void;
  setGlobalStats: (stats: CISState['globalStats']) => void;
  setLoaded: (val: boolean) => void;

  addReflectionToFirebase: (userId: string, r: Omit<Reflection, 'id' | 'timestamp'>) => Promise<void>;
  updateXPInFirebase: (userId: string, amount: number) => Promise<void>;

  getThemeStats: () => Record<Theme, number>;
  getHeuristicModifiers: () => {
    positivityBoost: number;
    depthLevel: number;
  };
}

export const useCIS = create<CISState>((set, get) => ({
  xp: 0,
  level: 1,
  reflections: [],
  globalStats: null,
  isLoaded: false,

  setStats: (xp, level) => set({ xp, level }),
  setReflections: (reflections) => set({ reflections }),
  setGlobalStats: (globalStats) => set({ globalStats }),
  setLoaded: (isLoaded) => set({ isLoaded }),

  addReflectionToFirebase: async (userId, r) => {
    const reflectionsRef = collection(db, 'users', userId, 'reflections');
    const globalRef = doc(db, 'global', 'stats');
    const path = `users/${userId}/reflections`;
    
    try {
      // 1. Add individual reflection
      await addDoc(reflectionsRef, {
        ...r,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp()
      });

      // 2. Contribute to Global Matrix (Public)
      await setDoc(globalRef, {
        totalXp: increment(50),
        totalReflections: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      handleFirestoreError(error, 'create', path);
    }
  },

  updateXPInFirebase: async (userId, amount) => {
    const userRef = doc(db, 'users', userId);
    const path = `users/${userId}`;
    const { xp } = get();
    const newXP = xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    try {
      await updateDoc(userRef, {
        xp: newXP,
        level: newLevel,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', path);
    }
  },

  getThemeStats: () => {
    const reflections = get().reflections;
    const counts: Record<Theme, number> = { kindness: 0, trust: 0, fun: 0, teamwork: 0 };

    if (reflections.length === 0) {
      return { kindness: 25, trust: 25, fun: 25, teamwork: 25 };
    }

    reflections.forEach((r) => {
       counts[r.theme]++;
    });

    const total = reflections.length;

    return {
      kindness: Math.round((counts.kindness / total) * 100),
      trust: Math.round((counts.trust / total) * 100),
      fun: Math.round((counts.fun / total) * 100),
      teamwork: Math.round((counts.teamwork / total) * 100),
    };
  },

  getHeuristicModifiers: () => {
    const reflections = get().reflections;

    const positivityBoost = reflections.length > 5 ? 1.2 : 1;
    const depthLevel = reflections.length > 10 ? 2 : 1;

    return { positivityBoost, depthLevel };
  },
}));
