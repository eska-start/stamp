import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs,
  setDoc, query, where,
} from 'firebase/firestore';
import { AppUser } from '../types';

const COL = 'users';

function serialize(user: AppUser): object {
  return JSON.parse(JSON.stringify(user));
}

export async function findUserByCredentials(
  username: string,
  pin: string
): Promise<AppUser | null> {
  try {
    const q = query(
      collection(db, COL),
      where('username', '==', username),
      where('parentPin', '==', pin)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as AppUser;
  } catch {
    return null;
  }
}

export async function getUserById(id: string): Promise<AppUser | null> {
  try {
    const snap = await getDoc(doc(db, COL, id));
    return snap.exists() ? (snap.data() as AppUser) : null;
  } catch {
    return null;
  }
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  try {
    const q = query(collection(db, COL), where('username', '==', username));
    const snap = await getDocs(q);
    return snap.empty;
  } catch {
    return true;
  }
}

export async function saveUser(user: AppUser): Promise<boolean> {
  try {
    await setDoc(doc(db, COL, user.id), serialize(user));
    return true;
  } catch {
    return false;
  }
}

export function syncUser(user: AppUser): void {
  setDoc(doc(db, COL, user.id), serialize(user)).catch(console.error);
}
