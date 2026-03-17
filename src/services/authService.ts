import type { UserRole } from "@/features/auth/AuthContext";

const AUTH_PATH = "/auth";
const AUTH_STORAGE_KEY = "verza:auth:session";

type BackendRole = Exclude<UserRole, "user">;
type MfaMethod = "totp" | "webauthn";

type ApiSuccess<T> = {
  success: true;
  data?: T;
  requestId: string;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
  requestId: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: BackendRole;
  };
  permissions: string[];
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  permissions: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
  role: BackendRole;
  authKey: string;
  mfa?: {
    method: "totp";
    code: string;
  };
};

export type LoginMfaChallenge = {
  mfaRequired: true;
  challengeId: string;
  methods: MfaMethod[];
};

export type SignupPayload =
  | {
      role: "enterprise";
      organizationName: string;
      contactName: string;
      email: string;
      password: string;
      countryCode: string;
      registrationNumber: string;
      consentAccepted: boolean;
    }
  | {
      role: "verifier";
      organizationName: string;
      contactName: string;
      email: string;
      password: string;
      verificationLicenseId: string;
      jurisdiction: string;
      consentAccepted: boolean;
    }
  | {
      role: "admin";
      fullName: string;
      email: string;
      password: string;
      department: string;
      authorizationCode: string;
      consentAccepted: boolean;
    };

export type SignupResponse = {
  userId: string;
  role: BackendRole;
  status: string;
  generatedAuthKey: string;
};

export type AuthApiErrorCode =
  | "validation_error"
  | "invalid_credentials"
  | "mfa_failed"
  | "token_invalid"
  | "role_mismatch"
  | "account_disabled"
  | "ip_blocked"
  | "email_conflict"
  | "account_locked"
  | "rate_limited"
  | "auth_internal_error"
  | string;

export class AuthApiError extends Error {
  status: number;
  code: AuthApiErrorCode;
  requestId?: string;
  details?: unknown[];

  constructor(status: number, code: AuthApiErrorCode, message: string, requestId?: string, details?: unknown[]) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}

const generateRequestId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
};

const sanitizeUrlString = (value: string): string =>
  value
    .trim()
    .replace(/[`"'“”‘’]/g, "")
    .replace(/\s+/g, "")
    .replace(/\/+$/, "");

const normalizeEndpointPath = (value: string): string => {
  const clean = sanitizeUrlString(value);
  if (!clean) return "/";
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const normalizeAuthBaseUrl = (value: string): string => {
  const cleaned = sanitizeUrlString(value);
  if (!cleaned) return AUTH_PATH;
  const withoutBankingPath = cleaned.endsWith("/api/v1/banking")
    ? cleaned.slice(0, -"/api/v1/banking".length)
    : cleaned;
  if (withoutBankingPath.endsWith(AUTH_PATH)) return withoutBankingPath;
  return `${withoutBankingPath}${AUTH_PATH}`;
};

const AUTH_BASE_URL = normalizeAuthBaseUrl(import.meta.env.VITE_BANKING_API_BASE_URL || "");

const request = async <T>(method: string, path: string, body?: unknown, accessToken?: string): Promise<{ status: number; payload: ApiSuccess<T> | ApiFailure | null }> => {
  const normalizedPath = normalizeEndpointPath(path);
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Request-Id": generateRequestId(),
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const response = await fetch(`${AUTH_BASE_URL}${normalizedPath}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiSuccess<T> | ApiFailure) : null;
  return { status: response.status, payload };
};

const toAuthApiError = (status: number, payload: ApiSuccess<unknown> | ApiFailure | null): AuthApiError => {
  if (payload && "success" in payload && payload.success === false) {
    return new AuthApiError(status, payload.error.code, payload.error.message, payload.requestId, payload.error.details);
  }
  return new AuthApiError(status, "auth_internal_error", `Authentication request failed with status ${status}`);
};

const assertSuccess = <T>(status: number, payload: ApiSuccess<T> | ApiFailure | null): T => {
  if (!payload || !("success" in payload) || payload.success !== true) {
    throw toAuthApiError(status, payload);
  }
  return payload.data as T;
};

const toDisplayName = (email: string): string => {
  const base = email.split("@")[0] || "User";
  return base.charAt(0).toUpperCase() + base.slice(1);
};

export const saveSession = (session: AuthSession | null): void => {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const getStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const toSession = (tokens: AuthTokenResponse): AuthSession => ({
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  expiresAt: Date.now() + tokens.expiresIn * 1000,
  user: {
    id: tokens.user.id,
    email: tokens.user.email,
    role: tokens.user.role,
    name: toDisplayName(tokens.user.email),
  },
  permissions: tokens.permissions,
});

export const loginRequest = async (payload: LoginPayload): Promise<{ type: "tokens"; data: AuthTokenResponse } | { type: "mfa_required"; data: LoginMfaChallenge }> => {
  const { status, payload: response } = await request<AuthTokenResponse | LoginMfaChallenge>("POST", "/login", payload);
  if (status === 202) {
    return {
      type: "mfa_required",
      data: assertSuccess<LoginMfaChallenge>(status, response as ApiSuccess<LoginMfaChallenge> | ApiFailure | null),
    };
  }
  if (status !== 200) {
    throw toAuthApiError(status, response);
  }
  return {
    type: "tokens",
    data: assertSuccess<AuthTokenResponse>(status, response as ApiSuccess<AuthTokenResponse> | ApiFailure | null),
  };
};

export const verifyMfaRequest = async (payload: { challengeId: string; method: "totp"; code: string }): Promise<AuthTokenResponse> => {
  const { status, payload: response } = await request<AuthTokenResponse>("POST", "/mfa/verify", payload);
  if (status !== 200) {
    throw toAuthApiError(status, response);
  }
  return assertSuccess<AuthTokenResponse>(status, response);
};

export const signupRequest = async (payload: SignupPayload): Promise<SignupResponse> => {
  const { status, payload: response } = await request<SignupResponse>("POST", "/signup", payload);
  if (status !== 201) {
    throw toAuthApiError(status, response);
  }
  return assertSuccess<SignupResponse>(status, response);
};

export const refreshRequest = async (refreshToken: string): Promise<AuthTokenResponse> => {
  const { status, payload: response } = await request<AuthTokenResponse>("POST", "/refresh", { refreshToken });
  if (status !== 200) {
    throw toAuthApiError(status, response);
  }
  return assertSuccess<AuthTokenResponse>(status, response);
};

export const logoutRequest = async (refreshToken: string, allSessions: boolean): Promise<void> => {
  const { status, payload: response } = await request<undefined>("POST", "/logout", { refreshToken, allSessions });
  if (status !== 204) {
    throw toAuthApiError(status, response);
  }
};

export const forgotPasswordRequest = async (email: string): Promise<void> => {
  const { status, payload } = await request("POST", "/forgot-password", { email });
  if (status !== 202) {
    throw toAuthApiError(status, payload);
  }
};

export const resetPasswordRequest = async (token: string, newPassword: string): Promise<void> => {
  const { status, payload } = await request("POST", "/reset-password", { token, newPassword });
  if (status !== 200) {
    throw toAuthApiError(status, payload);
  }
};

export const getMeRequest = async (accessToken: string): Promise<{ id: string; email: string; role: BackendRole; permissions: string[] }> => {
  const { status, payload } = await request<{ id: string; email: string; role: BackendRole; permissions: string[] }>("GET", "/me", undefined, accessToken);
  if (status !== 200) {
    throw toAuthApiError(status, payload);
  }
  return assertSuccess(status, payload);
};

const detailsToMessage = (details?: unknown[]): string => {
  if (!details || details.length === 0) return "";
  const normalized = details
    .map((detail) => {
      if (typeof detail === "string") return detail;
      if (detail && typeof detail === "object") {
        const record = detail as Record<string, unknown>;
        const message = typeof record.message === "string" ? record.message : "";
        const field = typeof record.field === "string" ? record.field : typeof record.path === "string" ? record.path : "";
        if (field && message) return `${field}: ${message}`;
        if (message) return message;
        if (field) return field;
      }
      return "";
    })
    .filter(Boolean);
  return normalized.length > 0 ? normalized.join(" | ") : "";
};

const withRequestId = (message: string, requestId?: string): string =>
  requestId ? `${message} (request: ${requestId})` : message;

export type AuthOperation =
  | "signup"
  | "login"
  | "mfa_verify"
  | "refresh"
  | "logout"
  | "forgot_password"
  | "reset_password"
  | "me";

const fallbackByOperation: Record<AuthOperation, string> = {
  signup: "Signup failed. Please review your registration details and try again.",
  login: "Login failed. Please check your credentials and try again.",
  mfa_verify: "MFA verification failed. Please retry with a valid code.",
  refresh: "Session refresh failed. Please sign in again.",
  logout: "Logout request failed.",
  forgot_password: "Password reset request failed.",
  reset_password: "Password reset failed. Please request a new reset link.",
  me: "Could not load account profile. Please sign in again.",
};

const mapKnownAuthError = (error: AuthApiError, operation?: AuthOperation): string => {
  if (error.code === "validation_error") {
    if (operation === "login") {
      return withRequestId(
        detailsToMessage(error.details) || "Invalid login request. Check email, role, and auth key.",
        error.requestId,
      );
    }
    if (operation === "signup") {
      return withRequestId(
        detailsToMessage(error.details) || "Invalid signup data. Check email, role fields, consent, and password policy.",
        error.requestId,
      );
    }
    if (operation === "reset_password") {
      return withRequestId(
        detailsToMessage(error.details) || "Password does not meet policy or was previously used.",
        error.requestId,
      );
    }
    if (operation === "logout" || operation === "forgot_password") {
      return withRequestId(
        detailsToMessage(error.details) || "Request body is malformed. Please retry.",
        error.requestId,
      );
    }
    return withRequestId(
      detailsToMessage(error.details) || error.message || "Please check your inputs and try again.",
      error.requestId,
    );
  }
  if (error.code === "rate_limited") {
    return withRequestId(
      operation === "signup"
        ? "Too many signup attempts. Please wait and try again."
        : operation === "login"
          ? "Too many login attempts. Please wait and try again."
          : "Too many attempts. Please wait and try again.",
      error.requestId,
    );
  }
  if (error.code === "invalid_credentials") {
    return withRequestId("Email, password, or auth key is incorrect.", error.requestId);
  }
  if (error.code === "mfa_failed") {
    return withRequestId(
      operation === "login"
        ? "MFA method is unsupported or MFA code is invalid."
        : "The MFA challenge or code is invalid, used, or expired.",
      error.requestId,
    );
  }
  if (error.code === "role_mismatch") {
    return withRequestId("Requested role does not match account role.", error.requestId);
  }
  if (error.code === "account_disabled") {
    return withRequestId("Account is disabled, suspended, or verifier approval is pending.", error.requestId);
  }
  if (error.code === "ip_blocked") {
    return withRequestId("Access from this network is blocked by policy.", error.requestId);
  }
  if (error.code === "account_locked") {
    return withRequestId("Account is temporarily locked due to failed attempts.", error.requestId);
  }
  if (error.code === "email_conflict") {
    return withRequestId("Email is already registered.", error.requestId);
  }
  if (error.code === "token_invalid") {
    return withRequestId(
      operation === "reset_password"
        ? "Reset token is invalid, used, or expired."
        : "Token is invalid or expired. Please sign in again.",
      error.requestId,
    );
  }
  return withRequestId(error.message || (operation ? fallbackByOperation[operation] : "Authentication request failed."), error.requestId);
};

export const mapAuthErrorToMessage = (error: unknown, operation?: AuthOperation): string => {
  if (error instanceof AuthApiError) {
    return mapKnownAuthError(error, operation);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return operation ? fallbackByOperation[operation] : "Authentication request failed.";
};
