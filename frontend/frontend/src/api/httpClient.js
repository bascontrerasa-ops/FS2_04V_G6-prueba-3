import { getAuthSession, clearAuthSession } from '../utils/authSession';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export async function httpRequest(path, options = {}) {
  const session = getAuthSession();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (session?.accessToken && path !== '/auth/login') {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 401 && session?.accessToken) clearAuthSession();
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensaje || data.message || data.detail || `Error HTTP ${response.status}`);
  return data;
}
