import { create } from 'zustand';
import { 
  doc, collection, setDoc, addDoc, serverTimestamp, updateDoc, increment, Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';

export type Theme = 'kindness' | 'trust' | 'fun' | 'teamwork';
export interface Reflection { id?: string; input: string; reflection: string; question?: string; theme: Theme; timestamp: number; }

interface CISState {
  xp: number; level: number; reflections: Reflection[]; globalStats: { totalXp: number; totalReflections: number; } | null;
  addReflectionToFirebase: (userId: string, r: Omit<Reflection, 'id' | 'timestamp'>) => Promise<void>;
  updateXPInFirebase: (userId: string, amount: number) => Promise<void>;
  getThemeStats: () => Record<Theme, number>;
  getHeuristicModifiers: () => { positivityBoost: number; depthLevel: number; };
  setStats: (xp: number, level: number) => void;
  setReflections: (reflections: Reflection[]) => void;
  setGlobalStats: (globalStats: { totalXp: number; totalReflections: number; } | null) => void;
  setLoaded: (loaded: boolean) => void;
  loaded: boolean;
}

export const useCIS = create<CISState>((set, get) => ({
  xp: 0, level: 1, reflections: [], globalStats: null, loaded: false,
  setStats: (xp: number, level: number) => set({ xp, level }),
  setReflections: (reflections: Reflection[]) => set({ reflections }),
  setGlobalStats: (globalStats: CISState['globalStats']) => set({ globalStats }),
  setLoaded: (loaded: boolean) => set({ loaded }),

  addReflectionToFirebase: async (userId, r) => {
    const reflectionsRef = collection(db, 'users', userId, 'reflections');
    const globalRef = doc(db, 'global', 'stats');
    try {
      await addDoc(reflectionsRef, { ...r, timestamp: Date.now(), serverTimestamp: serverTimestamp() });
      await setDoc(globalRef, { totalXp: increment(50), totalReflections: increment(1), updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) { handleFirestoreError(error, 'create', `users/${userId}/reflections`); }
  },

  updateXPInFirebase: async (userId, amount) => {
    const userRef = doc(db, 'users', userId);
    const { xp } = get();
    const newXP = xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    try {
      await updateDoc(userRef, { xp: newXP, level: newLevel, updatedAt: serverTimestamp() });
    } catch (error) { handleFirestoreError(error, 'update', `users/${userId}`); }
  },

  getThemeStats: () => {
    const { reflections } = get();
    const counts: Record<Theme, number> = { kindness: 0, trust: 0, fun: 0, teamwork: 0 };
    if (reflections.length === 0) return { kindness: 25, trust: 25, fun: 25, teamwork: 25 };
    reflections.forEach((r) => { counts[r.theme]++; });
    const total = reflections.length;
    return {
      kindness: Math.round((counts.kindness / total) * 100),
      trust: Math.round((counts.trust / total) * 100),
      fun: Math.round((counts.fun / total) * 100),
      teamwork: Math.round((counts.teamwork / total) * 100),
    };
  },

  getHeuristicModifiers: () => {
    const { reflections } = get();
    return { positivityBoost: reflections.length > 5 ? 1.2 : 1, depthLevel: reflections.length > 10 ? 2 : 1 };
  },
}));
