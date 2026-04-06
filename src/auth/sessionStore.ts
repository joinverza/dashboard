import type { UserRole } from "@/features/auth/AuthContext";

export const AUTH_SESSION_STORAGE_KEY = "verza:auth:session";
const STEP_UP_TTL_MS = 5 * 60 * 1000;

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export type SessionStepUpState = {
  stepUpVerifiedAt?: string;
  stepUpExpiresAt?: string;
};

export type SessionState = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: SessionUser;
  permissions: string[];
} & SessionStepUpState;

export const readSession = (): SessionState | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
};

export const writeSession = (session: SessionState | null): void => {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const markStepUpVerified = (reauthenticatedAtIso: string): SessionState | null => {
  const current = readSession();
  if (!current) return null;
  const verifiedAt = new Date(reauthenticatedAtIso);
  const expiresAt = new Date(verifiedAt.getTime() + STEP_UP_TTL_MS);
  const next: SessionState = {
    ...current,
    stepUpVerifiedAt: verifiedAt.toISOString(),
    stepUpExpiresAt: expiresAt.toISOString(),
  };
  writeSession(next);
  return next;
};

export const isStepUpFreshFromSession = (): boolean => {
  const current = readSession();
  if (!current?.stepUpExpiresAt) return false;
  return Date.now() < new Date(current.stepUpExpiresAt).getTime();
};

