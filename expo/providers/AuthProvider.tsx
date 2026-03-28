import { useState, useEffect, useMemo, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  avatar?: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const STORAGE_KEY = "user_auth";

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const saveUser = useCallback(async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      setUser(userData);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email.includes("@")) {
        return { success: false, error: "Please enter a valid email address" };
      }
      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      // Create user object
      const userData: User = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0],
        email,
        isGuest: false,
        joinedDate: new Date().toISOString(),
      };

      await saveUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." };
    }
  }, [saveUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (name.trim().length < 2) {
        return { success: false, error: "Name must be at least 2 characters" };
      }
      if (!email.includes("@")) {
        return { success: false, error: "Please enter a valid email address" };
      }
      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      // Create user object
      const userData: User = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email,
        isGuest: false,
        joinedDate: new Date().toISOString(),
      };

      await saveUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Signup failed. Please try again." };
    }
  }, [saveUser]);

  const loginAsGuest = useCallback(async () => {
    try {
      const guestUser: User = {
        id: `guest_${Date.now()}`,
        name: "Guest User",
        email: "guest@example.com",
        isGuest: true,
        joinedDate: new Date().toISOString(),
      };

      await saveUser(guestUser);
    } catch (error) {
      console.error("Error creating guest user:", error);
    }
  }, [saveUser]);

  const logout = useCallback(async () => {
    try {
      await saveUser(null);
      // Clear course progress for guest users
      if (user?.isGuest) {
        await AsyncStorage.removeItem("userProgress");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [saveUser, user]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      await saveUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [user, saveUser]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    loginAsGuest,
    logout,
    updateProfile,
  }), [user, isLoading, isAuthenticated, login, signup, loginAsGuest, logout, updateProfile]);
});