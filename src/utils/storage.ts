const USER_KEY  = 'stamp_session_user';
const CHILD_KEY = 'stamp_session_child';

export function getCurrentUserId(): string | null {
  return localStorage.getItem(USER_KEY);
}
export function setCurrentUserId(id: string | null): void {
  if (id) localStorage.setItem(USER_KEY, id);
  else     localStorage.removeItem(USER_KEY);
}
export function getCurrentChildId(): string | null {
  return localStorage.getItem(CHILD_KEY);
}
export function setCurrentChildId(id: string | null): void {
  if (id) localStorage.setItem(CHILD_KEY, id);
  else     localStorage.removeItem(CHILD_KEY);
}
