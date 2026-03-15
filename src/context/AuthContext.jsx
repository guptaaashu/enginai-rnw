import { createContext, useContext, useState } from 'react';
import { logout as authLogout } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  function login(token) {
    setAccessToken(token);
  }

  function logout() {
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
