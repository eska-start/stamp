import { AppUser } from '../types';

const USERS_KEY = 'stamp_book_users';
const CURRENT_USER_KEY = 'stamp_book_current_user';
const CURRENT_CHILD_KEY = 'stamp_book_current_child';

export function getUsers(): AppUser[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: AppUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(id: string | null): void {
  if (id) localStorage.setItem(CURRENT_USER_KEY, id);
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentChildId(): string | null {
  return localStorage.getItem(CURRENT_CHILD_KEY);
}

export function setCurrentChildId(id: string | null): void {
  if (id) localStorage.setItem(CURRENT_CHILD_KEY, id);
  else localStorage.removeItem(CURRENT_CHILD_KEY);
}

export function getCurrentUser(): AppUser | null {
  const id = getCurrentUserId();
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}

export function updateUser(user: AppUser): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  saveUsers(users);
}
