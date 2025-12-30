/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import { useLocation } from "wouter";

export type UserRole = "user" | "verifier" | "enterprise" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  signup: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const login = (role: UserRole = "user") => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: "1",
        name: "Alex Morgan",
        email: "alex@verza.com",
        role: role,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1000);
  };

  const signup = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: "1",
        name: "New User",
        email: "user@verza.com",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      setLocation("/onboarding");
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading
      }}
    >
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
