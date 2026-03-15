import { createContext, useContext, useState } from 'react';
import { logout as authLogout } from '../services/authService';
import { setToken } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  function login(token) {
    setToken(token);      // keep apiClient in sync
    setAccessToken(token);
  }

  function logout() {
    setToken(null);       // clear token from apiClient
    setAccessToken(null);
    authLogout();
  }

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated: !!accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
