import { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_EVENT, getAuthSession, clearAuthSession } from '../utils/authSession';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(getAuthSession);
  useEffect(() => {
    const update = () => setSession(getAuthSession());
    window.addEventListener(AUTH_EVENT, update);
    return () => window.removeEventListener(AUTH_EVENT, update);
  }, []);
  useEffect(() => {
    if (!session) return undefined;
    const timeout = window.setTimeout(clearAuthSession, Math.max(0, session.expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [session]);
  return <AuthContext.Provider value={{ session, logout: clearAuthSession }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
