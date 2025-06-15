// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../Api';

interface User {
  [x: string]: string | null | undefined;
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  role: string;
  total_points: number;
  municipality: string | null;
  municipality_name: string | null;
  date_joined: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearAuthData = () => {
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
          const response = await apiClient.get<User>('/auth/profile/');
          setUser(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          setIsAuthenticated(true);
        } catch (error: any) {
          console.warn("Auth check failed:", error.response?.data || error.message);
          if (error.response?.status === 401) {
            clearAuthData();
          }
        }
      } else {
        clearAuthData();
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);


  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    try {
        const response = await apiClient.get<User>('/auth/profile/');
        localStorage.setItem('userData', JSON.stringify(response.data));
        setUser(response.data);
        setIsAuthenticated(true);
    } catch (error) {
        console.error("Failed to fetch user profile after login:", error);
        clearAuthData();
        throw new Error("Login succeeded but failed to fetch user profile.");
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthData();
      setIsLoading(false);
      window.location.href = '/auth/login'; 
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {!isLoading ? children : <div className="min-h-screen flex items-center justify-center">Loading Authentication...</div>}
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