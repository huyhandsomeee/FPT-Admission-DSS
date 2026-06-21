import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const currentUser = authService.getCurrentUser();
        if (token && currentUser) {
          const isValid = await authService.validateToken();
          if (isValid) {
            const latestUser = await authService.getMe().catch(() => currentUser);
            authService.updateStoredUser(latestUser);
            setUser(latestUser);
            setIsAuthenticated(true);
          } else {
            authService.clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        authService.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (email, password, fullName, phone) => {
    const data = await authService.register(email, password, fullName, phone);
    setUser(data);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateAuthUser = (updates) => {
    const nextUser = authService.updateStoredUser(updates);
    setUser(nextUser);
    return nextUser;
  };

  const value = { user, isAuthenticated, isLoading, login, register, logout, updateAuthUser };

  if (isLoading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-3 text-sm">Đang tải hệ thống...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
