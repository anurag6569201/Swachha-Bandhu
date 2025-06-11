// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../Api';

interface User {
  id: number;
  email: string;
  full_name: string;
  // Add other user properties from your backend UserSerializer
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string, userDataFromToken?: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearAuthData = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        try {
          // Attempt to fetch user profile to verify token and get fresh user data
          const response = await apiClient.get<User>('/profile/'); // Backend UserProfileView
          setUser(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          setIsAuthenticated(true);
        } catch (error: any) {
          console.warn("Auth check failed (token might be expired/invalid):", error.response?.data || error.message);
          if (error.response?.status === 401) { // Specifically handle 401
            await clearAuthData(); // Clear if token is invalid
          }
          // For other errors, you might decide to keep the user authenticated optimistically
          // or also clear. For now, only 401 clears.
        }
      } else {
        // No token, ensure auth state is cleared (though it should be by default)
        await clearAuthData();
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);


  const login = async (accessToken: string, refreshToken: string, userDataFromToken?: Partial<User>) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    try {
        // Fetch fresh user profile data after login
        const response = await apiClient.get<User>('/profile/');
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUser(response.data);
        setIsAuthenticated(true);
    } catch (error) {
        console.error("Failed to fetch user profile after login:", error);
        // If profile fetch fails, it's a critical issue, so clear tokens and logout
        await clearAuthData();
        throw new Error("Login succeeded but failed to fetch user profile.");
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await apiClient.post('/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await clearAuthData();
      setIsLoading(false);
      window.location.href = '/auth/login'; 
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {!isLoading ? children : <div>Loading Authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};