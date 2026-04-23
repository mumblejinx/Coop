import { create } from 'zustand';
import { doc, updateDoc, setDoc, onSnapshot, serverTimestamp, collection, addDoc, increment } from 'firebase/firestore';
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
  streak: number;
  lastReflectionDate: string | null;
  currentMission: any;

  reflections: Reflection[];
  globalStats: { totalXp: number; totalReflections: number; } | null;
  loaded: boolean;
  profile: any;

  setStats: (xp: number, level: number) => void;
  setReflections: (r: Reflection[]) => void;
  setGlobalStats: (g: CISState['globalStats']) => void;
  setLoaded: (v: boolean) => void;

  setMission: (m: any) => void;
  setStreak: (s: number) => void;

  initSync: (uid: string) => () => void;
  addReflectionToFirebase: (userId: string, r: Omit<Reflection, 'id' | 'timestamp'>) => Promise<void>;
  updateXPInFirebase: (userId: string, amount: number) => Promise<void>;

  getThemeStats: () => Record<Theme, number>;
}

export const useCIS = create<CISState>((set, get) => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastReflectionDate: null,
  currentMission: null,

  reflections: [],
  globalStats: null,
  loaded: false,
  profile: null,

  setStats: (xp, level) => set({ xp, level }),
  setReflections: (reflections) => set({ reflections }),
  setGlobalStats: (globalStats) => set({ globalStats }),
  setLoaded: (loaded) => set({ loaded }),

  setMission: (m) => set({ currentMission: m }),
  setStreak: (s) => set({ streak: s }),

  initSync: (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    const globalRef = doc(db, 'global', 'stats');
    const reflectionsRef = collection(db, 'users', uid, 'reflections');

    const unsubStats = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        set({
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
          lastReflectionDate: data.lastReflectionDate || null,
        });
      } else {
        setDoc(userRef, {
          xp: 0,
          level: 1,
          streak: 0,
          lastReflectionDate: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });

    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        set({ profile: snap.data() });
      }
    });

    const unsubGlobal = onSnapshot(globalRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        set({
          globalStats: {
            totalXp: data.totalXp,
            totalReflections: data.totalReflections,
          }
        });
      }
    });

    const unsubReflections = onSnapshot(reflectionsRef, (snap) => {
      const refs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Reflection[];
      set({ reflections: refs, loaded: true });
    });

    return () => {
      unsubStats();
      unsubProfile();
      unsubGlobal();
      unsubReflections();
    };
  },

  addReflectionToFirebase: async (userId, r) => {
    const reflectionsRef = collection(db, 'users', userId, 'reflections');
    const globalRef = doc(db, 'global', 'stats');

    try {
      // 🔥 STREAK LOGIC
      const today = new Date().toDateString();
      const { lastReflectionDate, streak } = get();

      let newStreak = streak;

      if (lastReflectionDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastReflectionDate === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        set({
          lastReflectionDate: today,
          streak: newStreak
        });

        await updateDoc(doc(db, 'users', userId), {
          lastReflectionDate: today,
          streak: newStreak,
          updatedAt: serverTimestamp(),
        });
      }

      await addDoc(reflectionsRef, {
        ...r,
        timestamp: Date.now(),
        serverTimestamp: serverTimestamp()
      });

      await setDoc(globalRef, {
        totalXp: increment(50),
        totalReflections: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (error) {
      handleFirestoreError(error, 'create', `users/${userId}/reflections`);
    }
  },

  updateXPInFirebase: async (userId, amount) => {
    const userRef = doc(db, 'users', userId);
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
      handleFirestoreError(error, 'update', `users/${userId}`);
    }
  },

  getThemeStats: () => {
    const { reflections } = get();

    const counts: Record<Theme, number> = {
      kindness: 0,
      trust: 0,
      fun: 0,
      teamwork: 0
    };

    if (reflections.length === 0) {
      return { kindness: 25, trust: 25, fun: 25, teamwork: 25 };
    }

    reflections.forEach((r) => {
      if (counts[r.theme] !== undefined) counts[r.theme]++;
    });

    const total = reflections.length;

    return {
      kindness: Math.round((counts.kindness / total) * 100),
      trust: Math.round((counts.trust / total) * 100),
      fun: Math.round((counts.fun / total) * 100),
      teamwork: Math.round((counts.teamwork / total) * 100),
    };
  },
}));