/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  type AuthSession,
  type LoginMfaChallenge,
  type LoginPayload,
  type SignupPayload,
  AuthApiError,
  forgotPasswordRequest,
  getMeRequest,
  getStoredSession,
  loginRequest,
  logoutRequest,
  mapAuthErrorToMessage,
  refreshRequest,
  resetPasswordRequest,
  saveSession,
  signupRequest,
  toSession,
  verifyMfaRequest,
} from "@/services/authService";

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
  permissions: string[];
  mfaChallenge: LoginMfaChallenge | null;
  login: (payload: LoginPayload) => Promise<"authenticated" | "mfa_required">;
  verifyMfa: (code: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<string>;
  logout: (allSessions?: boolean) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  isBootstrapping: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [mfaChallenge, setMfaChallenge] = useState<LoginMfaChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [, setLocation] = useLocation();

  const applySession = useCallback((nextSession: AuthSession | null) => {
    setSession(nextSession);
    saveSession(nextSession);
    if (nextSession) {
      setUser({
        id: nextSession.user.id,
        name: nextSession.user.name,
        email: nextSession.user.email,
        role: nextSession.user.role,
      });
      setPermissions(nextSession.permissions);
      return;
    }
    setUser(null);
    setPermissions([]);
  }, []);

  const redirectByRole = useCallback((role: UserRole) => {
    if (role === "admin") {
      setLocation("/admin");
      return;
    }
    if (role === "verifier") {
      setLocation("/verifier");
      return;
    }
    if (role === "enterprise") {
      setLocation("/enterprise");
      return;
    }
    setLocation("/app");
  }, [setLocation]);

  const refreshSession = useCallback(async (): Promise<AuthSession | null> => {
    const current = getStoredSession();
    if (!current?.refreshToken) {
      applySession(null);
      return null;
    }
    const refreshed = await refreshRequest(current.refreshToken);
    const refreshedSession = toSession(refreshed);
    const me = await getMeRequest(refreshedSession.accessToken);
    refreshedSession.permissions = me.permissions;
    applySession(refreshedSession);
    return refreshedSession;
  }, [applySession]);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = getStoredSession();
      if (!stored) {
        setIsBootstrapping(false);
        return;
      }
      try {
        if (Date.now() >= stored.expiresAt) {
          await refreshSession();
        } else {
          const me = await getMeRequest(stored.accessToken);
          stored.permissions = me.permissions;
          applySession(stored);
        }
      } catch {
        applySession(null);
      } finally {
        setIsBootstrapping(false);
      }
    };
    void bootstrap();
  }, [applySession, refreshSession]);

  useEffect(() => {
    if (!session?.refreshToken) return;
    const interval = window.setInterval(() => {
      if (Date.now() > session.expiresAt - 60_000) {
        void refreshSession().catch(() => {
          applySession(null);
          setLocation("/login");
          toast.error("Session expired. Please sign in again.");
        });
      }
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [applySession, refreshSession, session?.expiresAt, session?.refreshToken, setLocation]);

  const login = async (payload: LoginPayload): Promise<"authenticated" | "mfa_required"> => {
    setIsLoading(true);
    setMfaChallenge(null);
    try {
      const result = await loginRequest(payload);
      if (result.type === "mfa_required") {
        setMfaChallenge(result.data);
        toast.info("MFA verification is required.");
        return "mfa_required";
      }
      const nextSession = toSession(result.data);
      applySession(nextSession);
      redirectByRole(nextSession.user.role);
      toast.success("Signed in successfully.");
      return "authenticated";
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "login"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (code: string): Promise<void> => {
    if (!mfaChallenge) {
      throw new AuthApiError(400, "mfa_failed", "No MFA challenge is active.");
    }
    setIsLoading(true);
    try {
      const tokens = await verifyMfaRequest({
        challengeId: mfaChallenge.challengeId,
        method: "totp",
        code,
      });
      const nextSession = toSession(tokens);
      applySession(nextSession);
      setMfaChallenge(null);
      redirectByRole(nextSession.user.role);
      toast.success("MFA verified.");
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "mfa_verify"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: SignupPayload): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await signupRequest(payload);
      toast.success("Signup completed. Save your auth key.");
      return response.generatedAuthKey;
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "signup"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      await forgotPasswordRequest(email);
      toast.success("If the email exists, a reset link has been sent.");
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "forgot_password"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    try {
      await resetPasswordRequest(token, newPassword);
      toast.success("Password reset successful.");
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "reset_password"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (allSessions = false): Promise<void> => {
    try {
      if (session?.refreshToken) {
        await logoutRequest(session.refreshToken, allSessions);
      }
    } catch {
      toast.error("Logout request failed. Clearing local session.");
    } finally {
      applySession(null);
      setMfaChallenge(null);
      setLocation("/login");
    }
  };

  const hasPermission = (permission: string): boolean => permissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        mfaChallenge,
        login,
        verifyMfa,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        hasPermission,
        isLoading,
        isBootstrapping,
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
