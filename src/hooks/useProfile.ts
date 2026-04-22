import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useProfile = () => {
  const getProfile = async (uid: string) => {
    const ref = doc(db, 'users', uid, 'profile', 'main');
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  };

  const saveProfile = async (uid: string, data: any) => {
    const ref = doc(db, 'users', uid, 'profile', 'main');
    await setDoc(ref, data, { merge: true });
  };

  return { getProfile, saveProfile };
};
