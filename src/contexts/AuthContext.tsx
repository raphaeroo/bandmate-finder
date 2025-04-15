import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Define types
export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'musician' | 'band';
  instrument?: string;
  genres?: string[];
  location?: Location;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (userData: Partial<User>) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<User>;
  clearError: () => void;
}

// Create the context with default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data from AsyncStorage when the app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (storedToken && storedUserData) {
          // TODO: Validate token with server
          setUser(JSON.parse(storedUserData));
        }
      } catch (e) {
        console.error('Failed to load user data:', e);
        setError('Failed to load user data. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData: Partial<User>): Promise<User> => {
    try {
      setLoading(true);
      // TODO: API call to register user
      
      // Mock implementation for now
      const token = 'mock-token-' + Date.now();
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || '',
        name: userData.name || '',
        type: userData.type || 'musician',
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
      
      setUser(newUser);
      return newUser;
    } catch (e) {
      console.error('Registration failed:', e);
      setError('Registration failed. Please try again.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      // TODO: API call to login user
      
      // Mock implementation for now
      const token = 'mock-token-' + Date.now();
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: 'Test User',
        type: 'musician',
        instrument: 'guitar',
        genres: ['rock', 'blues'],
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          city: 'San Francisco',
          state: 'CA',
        },
      };
      
      // Store auth data
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
      
      setUser(mockUser);
      return mockUser;
    } catch (e) {
      console.error('Login failed:', e);
      setError('Login failed. Please check your credentials and try again.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // TODO: API call to logout if needed
      
      // Clear storage
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      setUser(null);
    } catch (e) {
      console.error('Logout failed:', e);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updatedData: Partial<User>): Promise<User> => {
    try {
      setLoading(true);
      // TODO: API call to update user profile
      
      if (!user) {
        throw new Error('No user logged in');
      }

      // Mock implementation for now
      const updatedUser: User = {
        ...user,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return updatedUser;
    } catch (e) {
      console.error('Profile update failed:', e);
      setError('Profile update failed. Please try again.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = (): void => setError(null);

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 