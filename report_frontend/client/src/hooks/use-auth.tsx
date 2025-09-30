import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AUTH_STORAGE } from "@/lib/config";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  role: "developer" | "manager" | "admin";
  githubId: string | null;
  isOnboarded: boolean;
  createdAt: Date;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token?: string) => void;
  loginWithToken: (authResponse: AuthResponse) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize user from localStorage or null
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE.USER);
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        // Convert createdAt string back to Date
        if (userData.createdAt) {
          userData.createdAt = new Date(userData.createdAt);
        }
        return userData;
      } catch {
        // If parsing fails, clear invalid data
        localStorage.removeItem(AUTH_STORAGE.USER);
        localStorage.removeItem(AUTH_STORAGE.TOKEN);
        return null;
      }
    }
    return null;
  });

  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_STORAGE.TOKEN);
  });

  const [, setLocation] = useLocation();

  // Persist user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE.USER);
    }
  }, [user]);

  // Persist token to localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_STORAGE.TOKEN, token);
    } else {
      localStorage.removeItem(AUTH_STORAGE.TOKEN);
    }
  }, [token]);

  const login = (userData: User, userToken?: string) => {
    setUser(userData);
    if (userToken) {
      setToken(userToken);
    }
    
    // Check if user needs onboarding
    if (!userData.isOnboarded) {
      setLocation("/onboarding");
    } else {
      setLocation("/dashboard");
    }
  };

  const loginWithToken = (authResponse: AuthResponse) => {
    setUser(authResponse.user);
    setToken(authResponse.token);
    
    // Check if user needs onboarding
    if (!authResponse.user.isOnboarded) {
      setLocation("/onboarding");
    } else {
      setLocation("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE.USER);
    localStorage.removeItem(AUTH_STORAGE.TOKEN);
    setLocation("/login");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Immediately persist the updated user
      localStorage.setItem(AUTH_STORAGE.USER, JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user && !!token;
  const needsOnboarding = !!user && !user.isOnboarded;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithToken,
      logout, 
      updateUser, 
      isAuthenticated, 
      needsOnboarding,
      token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
