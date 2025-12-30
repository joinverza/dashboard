/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { 
    user: auth0User, 
    isAuthenticated, 
    loginWithRedirect, 
    logout: auth0Logout,
    isLoading 
  } = useAuth0();

  // Map Auth0 user to our User interface
  // In a real app, you might fetch additional user details (like role) from your API
  // based on the Auth0 user ID.
  const user: User | null = isAuthenticated && auth0User ? {
    id: auth0User.sub!,
    name: auth0User.name || auth0User.email || "User",
    email: auth0User.email!,
    // Default to 'user' role. In production, this should come from Auth0 app_metadata or your backend
    role: (auth0User['https://verza.com/roles']?.[0] as UserRole) || 'user', 
    avatar: auth0User.picture,
  } : null;

  const login = (role?: UserRole) => {
    // For now, we redirect to Auth0 login page.
    // If you need to support specific roles, you might handle that via Auth0 actions
    // or by passing parameters if supported.
    console.log("Logging in, requested role:", role);
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  const signup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
      },
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  const logout = () => {
    auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
