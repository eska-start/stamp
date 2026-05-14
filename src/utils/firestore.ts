import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs,
  setDoc, query, where,
} from 'firebase/firestore';
import { AppUser } from '../types';

const COL = 'users';

// Replaces lone surrogate code units with U+FFFD (replacement character).
// Firestore's JSON parser rejects lone surrogates with a 400 error.
function sanitizeSurrogates(value: unknown): unknown {
  if (typeof value === 'string') {
    let result = '';
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff) {
        const next = value.charCodeAt(i + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          result += value[i] + value[i + 1];
          i++;
        } else {
          result += '�';
        }
      } else if (code >= 0xdc00 && code <= 0xdfff) {
        result += '�';
      } else {
        result += value[i];
      }
    }
    return result;
  }
  if (Array.isArray(value)) return value.map(sanitizeSurrogates);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as object).map(([k, v]) => [k, sanitizeSurrogates(v)])
    );
  }
  return value;
}

function serialize(user: AppUser): object {
  return sanitizeSurrogates(user) as object;
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
