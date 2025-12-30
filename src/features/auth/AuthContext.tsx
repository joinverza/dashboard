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
  login: (email: string, role?: UserRole, authKey?: string) => void;
  signup: (name: string, email: string, role?: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const login = (email: string, role: UserRole = "user", authKey?: string) => {
    setIsLoading(true);
    if (authKey) {
      console.log("Verifying enterprise auth key:", authKey);
    }
    // Simulate API call
    setTimeout(() => {
      // Create a simulated name from email if not "alex@verza.com"
      const name = email === "alex@verza.com" ? "Alex Morgan" : email.split('@')[0];
      
      setUser({
        id: "1",
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        email: email,
        role: role,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      
      // Redirect based on role
      if (role === "admin") setLocation("/admin");
      else if (role === "verifier") setLocation("/verifier");
      else if (role === "enterprise") setLocation("/enterprise");
      else setLocation("/app");
    }, 1000);
  };

  const signup = (name: string, email: string, role: UserRole = "user") => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: "1",
        name: name,
        email: email,
        role: role,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      
      // Redirect based on role
      if (role === "admin") setLocation("/admin");
      else if (role === "verifier") setLocation("/verifier");
      else if (role === "enterprise") setLocation("/enterprise");
      else setLocation("/app");
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
