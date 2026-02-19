import CryptoJS from 'crypto-js';

export function hashPassword(password: string): string {
  return CryptoJS.MD5(password).toString();
}

export function validateCredentials(
  username: string,
  password: string,
  targetUsername: string,
  targetPasswordHash: string
): boolean {
  const passwordHash = hashPassword(password);
  return (
    username === targetUsername &&
    passwordHash === targetPasswordHash
  );
}

export function setAuthSession(username: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', 'authenticated');
    localStorage.setItem('username', username);
  }
}

export function clearAuthSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') === 'authenticated';
  }
  return false;
}

export function getUsername(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('username');
  }
  return null;
}
