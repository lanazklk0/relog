import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = '/auth';
const SESSION_CHECK_INTERVAL = 30 * 1000; // 30 seconds

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const userRef = useRef(null);

  // Keep userRef in sync so silent polling can read the latest value
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchUser = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSessionExpired(false);
        setError(null);
      } else if (res.status === 401) {
        // Session expired or not logged in
        if (userRef.current) {
          // Was logged in before → session expired
          setSessionExpired(true);
        }
        setUser(null);
      }
    } catch (err) {
      if (userRef.current) {
        setSessionExpired(true);
      }
      setError(`Erro ao verificar sessão. Verifique sua conexão. (${err.message})`);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Check for OAuth error in URL
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      setError(`Erro de autenticação: ${oauthError}`);
      window.history.replaceState({}, '', window.location.pathname);
    }

    fetchUser();
  }, [fetchUser]);

  // Periodic session check every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchUser(true);
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [fetchUser]);

  const login = useCallback(() => {
    window.location.href = `${API_BASE}/github`;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      window.location.href = `${API_BASE}/logout`;
    } catch {
      setLoading(false);
    }
  }, []);

  const relogin = useCallback(() => {
    setSessionExpired(false);
    window.location.href = `${API_BASE}/github`;
  }, []);

  return {
    user,
    loading,
    sessionExpired,
    error,
    login,
    logout,
    relogin,
    refetch: () => fetchUser(false),
  };
}
