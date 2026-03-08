import CryptoJS from 'crypto-js';

export function hashPassword(password: string, algorithm: 'md5' | 'sha256' = 'md5'): string {
  if (algorithm === 'sha256') {
    return CryptoJS.SHA256(password).toString();
  }
  return CryptoJS.MD5(password).toString();
}

export function validateCredentials(
  username: string,
  password: string,
  targetUsername: string,
  targetPasswordHash: string
): boolean {
  // Try MD5 first (easy), then SHA256 (medium/hard)
  const md5Hash = CryptoJS.MD5(password).toString();
  const sha256Hash = CryptoJS.SHA256(password).toString();
  return (
    username === targetUsername &&
    (md5Hash === targetPasswordHash || sha256Hash === targetPasswordHash)
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
