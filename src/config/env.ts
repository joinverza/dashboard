const sanitize = (value: string | undefined): string =>
  (value || "")
    .trim()
    .replace(/[`"'“”‘’]/g, "")
    .replace(/\s+/g, "")
    .replace(/\/+$/, "");

const asBool = (value: string | undefined, fallback: boolean): boolean => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return fallback;
};

const API_PATH = "/api/v1/banking";

const rawApiBase = sanitize(import.meta.env.VITE_ONTIVER_API_BASE_URL || import.meta.env.VITE_BANKING_API_BASE_URL || "");
const rawAuthBase = sanitize(import.meta.env.VITE_ONTIVER_AUTH_BASE_URL || rawApiBase);
const rawBankingBase = sanitize(import.meta.env.VITE_ONTIVER_BANKING_BASE_URL || rawApiBase);

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
} as const;

export const envValidationWarnings = (() => {
  const warnings: string[] = [];
  if (!env.ontiverAuthBaseUrl) warnings.push("Missing VITE_ONTIVER_AUTH_BASE_URL (or VITE_ONTIVER_API_BASE_URL).");
  if (!env.ontiverBankingBaseUrl) warnings.push("Missing VITE_ONTIVER_BANKING_BASE_URL (or VITE_ONTIVER_API_BASE_URL).");
  return warnings;
})();

