import { createContext, useContext, useEffect, useState } from 'react';
import { logout as authLogout } from '../services/authService';
import { setToken } from '../services/apiClient';

const BACKEND_URL = 'http://localhost:8080';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app startup, silently restore session via RT cookie
    fetch(`${BACKEND_URL}/api/authn/refresh`, { method: 'POST', credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.accessToken) {
          setToken(data.accessToken);
          setAccessToken(data.accessToken);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function login(token) {
    setToken(token);
    setAccessToken(token);
  }

  function logout() {
    setToken(null);
    setAccessToken(null);
    authLogout();
  }

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated: !!accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
