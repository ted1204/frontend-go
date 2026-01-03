import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL, LOGOUT_URL } from '../config/url';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // At app root: check auth with backend.
    // If token exists in localStorage, validate it via Authorization header.
    // If no token, call backend with credentials included to allow cookie/session-based auth.
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const url = `${API_BASE_URL}/auth/status`;

    const options: RequestInit = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : { credentials: 'include' };

    fetch(url, options)
      .then((res) => {
        if (res.status === 200) {
          setIsAuthenticated(true);
          return;
        }
        // Token/cookie invalid: proactively clear server session cookie
        setIsAuthenticated(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('username');
        fetch(LOGOUT_URL, { method: 'POST', credentials: 'include' }).catch(() => {});
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('username');
        fetch(LOGOUT_URL, { method: 'POST', credentials: 'include' }).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
