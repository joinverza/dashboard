/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { env } from "@/config/env";
import {
  DEV_ROUTE_UNLOCK_PERMISSIONS,
  type AuthSession,
  type LoginMfaChallenge,
  type LoginPayload,
  type MfaEnrollment,
  type SignupPayload,
  AuthApiError,
  enrollMfaRequest,
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
  verifyMfaRecoveryCodeRequest,
  verifyMfaEnrollRequest,
} from "@/services/authService";

export type UserRole = "user" | "verifier" | "enterprise" | "manager" | "admin";

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
  mfaEnrollment: MfaEnrollment | null;
  mfaBackupCodes: string[];
  login: (payload: LoginPayload) => Promise<"authenticated" | "mfa_required">;
  verifyMfa: (code: string) => Promise<void>;
  verifyMfaRecoveryCode: (code: string) => Promise<void>;
  verifyMfaEnrollment: (code: string) => Promise<void>;
  dismissMfaBackupCodes: () => void;
  signup: (payload: SignupPayload) => Promise<string>;
  logout: (allSessions?: boolean) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  isBootstrapping: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const MFA_FIRST_LOGIN_PENDING_STORAGE_KEY = "verza:auth:mfa:firstLoginPending";

// TEMPORARY DEVELOPMENT ONLY:
// This file currently supports mock-auth and temporary role/permission overrides for local editing.
// Future live auth work should be added against the normal session flow, not layered into the temporary bypasses.

const getMfaPendingMap = (): Record<string, true> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MFA_FIRST_LOGIN_PENDING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.entries(parsed as Record<string, unknown>).reduce<Record<string, true>>((acc, [key, value]) => {
      if (value === true) acc[key] = true;
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const saveMfaPendingMap = (value: Record<string, true>): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MFA_FIRST_LOGIN_PENDING_STORAGE_KEY, JSON.stringify(value));
};

const getMfaFirstLoginKey = (role: UserRole, email: string): string => `${role}:${email.trim().toLowerCase()}`;

const markMfaEnrollmentPendingForFirstLogin = (role: UserRole, email: string): void => {
  if (!email.trim()) return;
  const next = getMfaPendingMap();
  next[getMfaFirstLoginKey(role, email)] = true;
  saveMfaPendingMap(next);
};

const consumeMfaEnrollmentPendingForFirstLogin = (role: UserRole, email: string): boolean => {
  if (!email.trim()) return false;
  const key = getMfaFirstLoginKey(role, email);
  const next = getMfaPendingMap();
  if (!next[key]) return false;
  delete next[key];
  saveMfaPendingMap(next);
  return true;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [mfaChallenge, setMfaChallenge] = useState<LoginMfaChallenge | null>(null);
  const [mfaEnrollment, setMfaEnrollment] = useState<MfaEnrollment | null>(null);
  const [mfaBackupCodes, setMfaBackupCodes] = useState<string[]>([]);
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
    setMfaEnrollment(null);
    setMfaBackupCodes([]);
  }, []);

  const startMfaEnrollment = useCallback(async (accessToken: string) => {
    try {
      const enrollment = await enrollMfaRequest(accessToken);
      if (enrollment.backupCodes.length > 0) {
        setMfaBackupCodes(enrollment.backupCodes);
      }
      if (enrollment.qrCodeImageUrl || enrollment.otpauthUri) {
        setMfaEnrollment(enrollment);
      }
    } catch (error) {
      if (
        error instanceof AuthApiError &&
        (error.code === "validation_error" ||
          error.code === "mfa_failed" ||
          error.code === "token_invalid" ||
          /already|enrolled|enabled/i.test(error.message))
      ) {
        return;
      }
      toast.error(mapAuthErrorToMessage(error, "mfa_enroll"));
    }
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
    if (role === "manager") {
      setLocation("/manager");
      return;
    }
    setLocation("/app");
  }, [setLocation]);

  const completeAuthSuccess = useCallback(async (nextSession: AuthSession) => {
    applySession(nextSession);
    const shouldStartMfaEnrollment = consumeMfaEnrollmentPendingForFirstLogin(nextSession.user.role, nextSession.user.email);
    if (shouldStartMfaEnrollment) {
      await startMfaEnrollment(nextSession.accessToken);
    } else {
      setMfaEnrollment(null);
      setMfaBackupCodes([]);
    }
    setMfaChallenge(null);
    redirectByRole(nextSession.user.role);
  }, [applySession, redirectByRole, startMfaEnrollment]);

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
      await completeAuthSuccess(toSession(result.data));
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
      await completeAuthSuccess(toSession(tokens));
      toast.success("MFA verified.");
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "mfa_verify"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfaRecoveryCode = async (code: string): Promise<void> => {
    if (!mfaChallenge) {
      throw new AuthApiError(400, "mfa_failed", "No MFA challenge is active.");
    }
    setIsLoading(true);
    try {
      const tokens = await verifyMfaRecoveryCodeRequest({
        challengeId: mfaChallenge.challengeId,
        code,
      });
      await completeAuthSuccess(toSession(tokens));
      toast.success("Recovery code verified.");
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "mfa_recovery_verify"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: SignupPayload): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await signupRequest(payload);
      markMfaEnrollmentPendingForFirstLogin(payload.role, payload.email);
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
      setMfaEnrollment(null);
      setMfaBackupCodes([]);
      setLocation("/login");
    }
  };

  const verifyMfaEnrollment = async (code: string): Promise<void> => {
    if (!session?.accessToken) {
      throw new AuthApiError(401, "token_invalid", "Missing active access token for MFA enrollment.");
    }
    setIsLoading(true);
    try {
      await verifyMfaEnrollRequest(session.accessToken, code);
      setMfaEnrollment(null);
      toast.success("MFA enrollment completed.");
    } catch (error) {
      toast.error(mapAuthErrorToMessage(error, "mfa_enroll_verify"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const dismissMfaBackupCodes = (): void => {
    setMfaBackupCodes([]);
  };

  // Temporary development bypass: expose a wide permission set while cross-role route unlock is enabled.
  // Set `VITE_DEV_UNLOCK_ALL_ROUTES=false` later to go back to the session's real role permissions.
  const effectivePermissions = env.devUnlockAllRoutes ? DEV_ROUTE_UNLOCK_PERMISSIONS : permissions;
  const hasPermission = (permission: string): boolean =>
    env.devUnlockAllRoutes || effectivePermissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions: effectivePermissions,
        mfaChallenge,
        mfaEnrollment,
        mfaBackupCodes,
        login,
        verifyMfa,
        verifyMfaRecoveryCode,
        verifyMfaEnrollment,
        dismissMfaBackupCodes,
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
