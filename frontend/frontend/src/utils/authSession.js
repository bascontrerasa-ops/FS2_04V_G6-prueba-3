const STORAGE_KEY = 'pasteleria.auth';
export const AUTH_EVENT = 'pasteleria-auth-changed';

export function getAuthSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (typeof session?.accessToken === 'string' && Number.isFinite(session.expiresAt) && session.expiresAt > Date.now()) return session;
  } catch { /* sesión inválida: tratar como cerrada */ }
  return null;
}

export function saveAuthSession(response) {
  const session = {
    accessToken: response.accessToken,
    expiresAt: Date.now() + response.expiresIn * 1000,
    user: { nombre: response.nombre, email: response.email, rol: response.rol },
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
  return session;
}

export function clearAuthSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}
