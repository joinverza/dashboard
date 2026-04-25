const sanitize = (value: string | undefined): string =>
  (value || "")
    .trim()
    .replace(/[`"'“”‘’]/g, "")
    .replace(/\s+/g, "")
    .replace(/\/+$/, "");

const isLikelyPlaceholder = (value: string): boolean => value.includes("${") || value.includes("}");
const isAbsoluteHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const normalizeUrlEnv = (value: string | undefined): string => {
  const cleaned = sanitize(value);
  if (!cleaned) return "";
  if (isLikelyPlaceholder(cleaned)) return "";
  if (!isAbsoluteHttpUrl(cleaned)) return "";
  return cleaned;
};

const asBool = (value: string | undefined, fallback: boolean): boolean => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return fallback;
};

const API_PATH = "/api/v1/banking";

const rawApiBase = normalizeUrlEnv(import.meta.env.VITE_ONTIVER_API_BASE_URL || import.meta.env.VITE_BANKING_API_BASE_URL || "");
const rawAuthBase = normalizeUrlEnv(import.meta.env.VITE_ONTIVER_AUTH_BASE_URL) || rawApiBase;
const rawBankingBase = normalizeUrlEnv(import.meta.env.VITE_ONTIVER_BANKING_BASE_URL) || rawApiBase;

const normalizeBankingBase = (base: string): string => {
  if (!base) return API_PATH;
  if (base.endsWith(API_PATH)) return base;
  return `${base}${API_PATH}`;
};

export const env = {
  ontiverApiBaseUrl: rawApiBase,
  ontiverAuthBaseUrl: rawAuthBase || rawApiBase,
  ontiverBankingBaseUrl: normalizeBankingBase(rawBankingBase || rawApiBase),
  securityStepUpEnabled: asBool(import.meta.env.VITE_SECURITY_STEP_UP_ENABLED, true),
  securityNonceEnabled: asBool(import.meta.env.VITE_SECURITY_NONCE_ENABLED, true),
  securityPolicyUiEnabled: asBool(import.meta.env.VITE_SECURITY_POLICY_UI_ENABLED, true),
  // TEMPORARY DEVELOPMENT ONLY:
  // `mockAuthEnabled` and `devUnlockAllRoutes` exist only to support local editing before the live auth/RBAC flow is ready.
  // Future production logic should not depend on these flags; keep live behavior separate from this mock/dev path.
  // Mock auth stays on in local Vite development so dashboard pages remain reachable while the real auth backend is in progress.
  // Set `VITE_MOCK_AUTH_ENABLED=false` later to restore the live auth requests without changing this file again.
  mockAuthEnabled: asBool(import.meta.env.VITE_MOCK_AUTH_ENABLED, import.meta.env.DEV),
  // Temporary route unlock for development: lets one signed-in session open user, verifier, enterprise, manager, and admin pages.
  // Set `VITE_DEV_UNLOCK_ALL_ROUTES=false` later to restore the normal role-based route guards.
  devUnlockAllRoutes: asBool(import.meta.env.VITE_DEV_UNLOCK_ALL_ROUTES, import.meta.env.DEV),
} as const;

export const envValidationWarnings = (() => {
  const warnings: string[] = [];
  const authRaw = sanitize(import.meta.env.VITE_ONTIVER_AUTH_BASE_URL);
  const bankingRaw = sanitize(import.meta.env.VITE_ONTIVER_BANKING_BASE_URL);
  if (authRaw && isLikelyPlaceholder(authRaw)) {
    warnings.push("VITE_ONTIVER_AUTH_BASE_URL contains an unresolved placeholder. Use a full URL value.");
  }
  if (bankingRaw && isLikelyPlaceholder(bankingRaw)) {
    warnings.push("VITE_ONTIVER_BANKING_BASE_URL contains an unresolved placeholder. Use a full URL value.");
  }
  if (!env.mockAuthEnabled && !env.ontiverAuthBaseUrl) warnings.push("Missing VITE_ONTIVER_AUTH_BASE_URL (or VITE_ONTIVER_API_BASE_URL).");
  if (!env.ontiverBankingBaseUrl) warnings.push("Missing VITE_ONTIVER_BANKING_BASE_URL (or VITE_ONTIVER_API_BASE_URL).");
  if (env.mockAuthEnabled) warnings.push("Mock auth is enabled for local development. Set VITE_MOCK_AUTH_ENABLED=false to use live auth.");
  if (env.devUnlockAllRoutes) warnings.push("All dashboard routes are temporarily unlocked for development. Set VITE_DEV_UNLOCK_ALL_ROUTES=false to restore role guards.");
  return warnings;
})();
