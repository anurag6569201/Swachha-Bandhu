// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import apiClient from '../Api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  profile_picture_url: string | null; // ADDED
  role: 'CITIZEN' | 'MODERATOR' | 'MUNICIPAL_ADMIN' | 'SUPER_ADMIN';
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
  refetchUser: () => Promise<void>; // ADDED
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

  const fetchUser = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        try {
          const response = await apiClient.get<User>('/auth/profile/');
          setUser(response.data);
          localStorage.setItem('userData', JSON.stringify(response.data));
          setIsAuthenticated(true);
          return response.data;
        } catch (error: any) {
          console.warn("Auth check failed:", error.response?.data || error.message);
          if (error.response?.status === 401) clearAuthData();
          throw error;
        }
    } else {
        clearAuthData();
        throw new Error("No access token found");
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchUser().catch(() => {}).finally(() => setIsLoading(false));
  }, [fetchUser]);

  const login = async (accessToken: string, refreshToken: string) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      await fetchUser();
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

  const refetchUser = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Failed to refetch user", error)
      }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, refetchUser }}>
      {children}
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