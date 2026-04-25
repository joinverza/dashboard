import { env } from "@/config/env";

// TEMPORARY DEVELOPMENT ONLY:
// This file contains short-term route/API RBAC bypasses used for local dashboard editing.
// Keep future production RBAC changes in the real policy rules, not inside the temporary bypass branches.

export type AppRole = "user" | "verifier" | "enterprise" | "manager" | "admin";

type Requirement = {
  anyOf?: string[];
  allOf?: string[];
};

type RoutePolicy = {
  pattern: string;
  roles: AppRole[];
  requirement?: Requirement;
};

type ApiPolicy = {
  methods: Array<"GET" | "POST" | "PATCH" | "DELETE">;
  pattern: string;
  roles: AppRole[];
  requirement?: Requirement;
};

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/user/signup",
  "/portal/login",
  "/portal/signup",
  "/verifier/login",
  "/verifier/signup",
  "/admin/login",
  "/admin/signup",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
  "/onboarding",
  "/invite/accept",
  "/forbidden",
]);

const hasPermissionRequirement = (permissions: string[], requirement?: Requirement): boolean => {
  if (!requirement) return true;
  if (requirement.allOf && !requirement.allOf.every((scope) => permissions.includes(scope))) {
    return false;
  }
  if (requirement.anyOf && !requirement.anyOf.some((scope) => permissions.includes(scope))) {
    return false;
  }
  return true;
};

const toRegex = (pattern: string): RegExp => {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:([A-Za-z0-9_]+)/g, "[^/]+")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`);
};

const routePolicies: RoutePolicy[] = [
  { pattern: "/app", roles: ["user"] },
  { pattern: "/app/*", roles: ["user"] },
  { pattern: "/enterprise", roles: ["enterprise"] },
  { pattern: "/enterprise/bulk", roles: ["enterprise"], requirement: { anyOf: ["kyc:write"] } },
  { pattern: "/enterprise/requests", roles: ["enterprise"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { pattern: "/enterprise/requests/:id", roles: ["enterprise"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { pattern: "/enterprise/verifications", roles: ["enterprise"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { pattern: "/enterprise/verifications/workbench", roles: ["enterprise"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { pattern: "/enterprise/email-verifications", roles: ["enterprise"], requirement: { anyOf: ["email_verification:read", "kyc:read", "verification:read"] } },
  { pattern: "/enterprise/users", roles: ["enterprise"], requirement: { anyOf: ["settings:read"] } },
  { pattern: "/enterprise/reports", roles: ["enterprise"], requirement: { anyOf: ["reports:write"] } },
  { pattern: "/enterprise/platform", roles: ["enterprise"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { pattern: "/enterprise/tools", roles: ["enterprise"], requirement: { anyOf: ["documents:write", "screening:write", "audit:read"] } },
  { pattern: "/enterprise/api", roles: ["enterprise"], requirement: { anyOf: ["api_keys:read", "webhooks:read"] } },
  { pattern: "/enterprise/api/docs", roles: ["enterprise"], requirement: { anyOf: ["api_keys:read", "webhooks:read"] } },
  { pattern: "/enterprise/team", roles: ["enterprise"], requirement: { anyOf: ["settings:read"] } },
  { pattern: "/enterprise/team/invite", roles: ["enterprise"], requirement: { anyOf: ["settings:read"] } },
  { pattern: "/enterprise/team/:id", roles: ["enterprise"], requirement: { anyOf: ["settings:read"] } },
  { pattern: "/enterprise/compliance", roles: ["enterprise"], requirement: { anyOf: ["audit:read"] } },
  { pattern: "/enterprise/audit", roles: ["enterprise"], requirement: { anyOf: ["audit:read"] } },
  { pattern: "/enterprise/analytics", roles: ["enterprise"], requirement: { anyOf: ["analytics:read"] } },
  { pattern: "/enterprise/billing", roles: ["enterprise"], requirement: { anyOf: ["license:read"] } },
  { pattern: "/enterprise/billing/checkout", roles: ["enterprise"], requirement: { anyOf: ["license:read"] } },
  { pattern: "/enterprise/cost-analysis", roles: ["enterprise"], requirement: { anyOf: ["license:read"] } },
  { pattern: "/enterprise/pricing", roles: ["enterprise"], requirement: { anyOf: ["license:read"] } },
  { pattern: "/enterprise/integrations", roles: ["enterprise"], requirement: { anyOf: ["webhooks:read"] } },
  { pattern: "/enterprise/integrations/setup", roles: ["enterprise"], requirement: { anyOf: ["webhooks:write"] } },
  { pattern: "/enterprise/integrations/setup/:id", roles: ["enterprise"], requirement: { anyOf: ["webhooks:write"] } },
  { pattern: "/enterprise/kyb", roles: ["enterprise"], requirement: { anyOf: ["kyc:write"] } },
  { pattern: "/enterprise/mono", roles: ["enterprise"], requirement: { anyOf: ["kyc:read"] } },
  { pattern: "/enterprise/compliance/workflows", roles: ["enterprise"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { pattern: "/enterprise/settings", roles: ["enterprise"], requirement: { anyOf: ["settings:read"] } },
  { pattern: "/verifier", roles: ["verifier"] },
  { pattern: "/verifier/jobs", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/jobs/:id", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/active", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/review/:id", roles: ["verifier"], requirement: { anyOf: ["documents:write", "verification:read"] } },
  { pattern: "/verifier/issue/:id", roles: ["verifier"], requirement: { anyOf: ["verification:write"] } },
  { pattern: "/verifier/earnings", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/withdraw", roles: ["verifier"], requirement: { anyOf: ["verification:write"] } },
  { pattern: "/verifier/completed", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/reputation", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/reviews", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/analytics", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/staking", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/profile", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/notifications", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/settings", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/verifier/help", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { pattern: "/manager", roles: ["manager"] },
  { pattern: "/manager/*", roles: ["manager"] },
  { pattern: "/admin", roles: ["admin"] },
  { pattern: "/admin/*", roles: ["admin"] },
];

const apiPolicies: ApiPolicy[] = [
  { methods: ["POST"], pattern: "/aml/*", roles: ["enterprise"], requirement: { anyOf: ["aml:write"] } },
  { methods: ["GET"], pattern: "/analytics/*", roles: ["enterprise"], requirement: { anyOf: ["analytics:read"] } },
  { methods: ["POST"], pattern: "/api-keys/create", roles: ["enterprise"], requirement: { anyOf: ["api_keys:write"] } },
  { methods: ["GET"], pattern: "/api-keys*", roles: ["enterprise"], requirement: { anyOf: ["api_keys:read"] } },
  { methods: ["DELETE"], pattern: "/api-keys/*", roles: ["enterprise"], requirement: { anyOf: ["api_keys:write"] } },
  { methods: ["GET"], pattern: "/audit/*", roles: ["enterprise"], requirement: { anyOf: ["audit:read"] } },
  { methods: ["POST"], pattern: "/audit/export", roles: ["enterprise"], requirement: { anyOf: ["audit:read"] } },
  { methods: ["POST"], pattern: "/biometrics/*", roles: ["enterprise"], requirement: { anyOf: ["biometrics:write"] } },
  { methods: ["GET"], pattern: "/blockchain/proof/*", roles: ["enterprise"], requirement: { anyOf: ["blockchain:read"] } },
  { methods: ["POST"], pattern: "/blockchain/proof", roles: ["enterprise"], requirement: { anyOf: ["blockchain:read"] } },
  { methods: ["GET"], pattern: "/diagnostics/requests", roles: ["enterprise"], requirement: { anyOf: ["diagnostics:read"] } },
  { methods: ["GET"], pattern: "/documents/supported-types*", roles: ["enterprise", "verifier"], requirement: { anyOf: ["documents:read"] } },
  { methods: ["POST"], pattern: "/documents/classify", roles: ["enterprise", "verifier"], requirement: { anyOf: ["documents:write"] } },
  { methods: ["POST"], pattern: "/documents/compare", roles: ["enterprise", "verifier"], requirement: { anyOf: ["documents:write"] } },
  { methods: ["POST"], pattern: "/documents/extract", roles: ["enterprise", "verifier"], requirement: { anyOf: ["documents:write"] } },
  { methods: ["POST"], pattern: "/documents/verify", roles: ["enterprise", "verifier"], requirement: { anyOf: ["documents:write"] } },
  { methods: ["POST"], pattern: "/documents/certificate/verify", roles: ["enterprise", "verifier"], requirement: { anyOf: ["documents:write"] } },
  { methods: ["POST"], pattern: "/documents/signature/validate", roles: ["enterprise"], requirement: { allOf: ["documents:write", "documents:financial:verify"] } },
  { methods: ["POST"], pattern: "/email-verifications/verify", roles: ["enterprise"], requirement: { anyOf: ["email_verification:write", "kyc:write"] } },
  { methods: ["POST"], pattern: "/email-verifications/bulk/verify", roles: ["enterprise"], requirement: { anyOf: ["email_verification:write", "kyc:write"] } },
  { methods: ["POST"], pattern: "/email-verifications/bulk/upload", roles: ["enterprise"], requirement: { anyOf: ["email_verification:write", "kyc:write"] } },
  { methods: ["GET"], pattern: "/email-verifications/*", roles: ["enterprise", "verifier"], requirement: { anyOf: ["email_verification:read", "kyc:read", "verification:read"] } },
  { methods: ["POST"], pattern: "/kyc/*", roles: ["enterprise"], requirement: { anyOf: ["kyc:write"] } },
  { methods: ["GET"], pattern: "/kyc/*", roles: ["enterprise"], requirement: { anyOf: ["kyc:read"] } },
  { methods: ["GET"], pattern: "/api/settings", roles: ["enterprise"], requirement: { anyOf: ["api_settings:read"] } },
  { methods: ["GET"], pattern: "/settings/company", roles: ["enterprise"], requirement: { anyOf: ["settings:read"] } },
  { methods: ["GET"], pattern: "/license/usage", roles: ["enterprise"], requirement: { anyOf: ["license:read"] } },
  { methods: ["POST"], pattern: "/reports/create", roles: ["enterprise"], requirement: { anyOf: ["reports:write"] } },
  { methods: ["POST"], pattern: "/screening/*", roles: ["enterprise"], requirement: { anyOf: ["screening:write"] } },
  { methods: ["POST"], pattern: "/requests/*/review", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:review", "admin:write", "kyc:write"] } },
  { methods: ["POST"], pattern: "/requests/*/revoke", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:review", "admin:write", "kyc:write"] } },
  { methods: ["GET"], pattern: "/verifier/profile", roles: ["verifier"], requirement: { anyOf: ["verification:read"] } },
  { methods: ["PATCH"], pattern: "/verifier/profile", roles: ["verifier"], requirement: { anyOf: ["verification:write"] } },
  { methods: ["GET"], pattern: "/verifier/jobs*", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read", "admin:read"] } },
  { methods: ["GET"], pattern: "/verifier/active", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read", "admin:read"] } },
  { methods: ["GET"], pattern: "/verifier/completed", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read", "admin:read"] } },
  { methods: ["GET"], pattern: "/verifier/reputation", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read"] } },
  { methods: ["GET"], pattern: "/verifier/reviews", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read"] } },
  { methods: ["GET"], pattern: "/verifier/staking", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read"] } },
  { methods: ["POST"], pattern: "/verifier/staking/actions", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:write"] } },
  { methods: ["POST"], pattern: "/verifier/withdrawals", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:write"] } },
  { methods: ["POST"], pattern: "/verification/workflows/*/claim", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:write", "kyc:write"] } },
  { methods: ["POST"], pattern: "/verification/workflows/*/release", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:write", "kyc:write"] } },
  { methods: ["PATCH"], pattern: "/verification/workflows/*/status", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:write", "kyc:write"] } },
  { methods: ["GET"], pattern: "/verification/workflows/queue", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { methods: ["GET"], pattern: "/verification/workflows/summary", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { methods: ["GET"], pattern: "/verification/workflows/*/timeline", roles: ["enterprise", "verifier"], requirement: { anyOf: ["verification:read", "kyc:read"] } },
  { methods: ["POST"], pattern: "/webhooks/*", roles: ["enterprise"], requirement: { anyOf: ["webhooks:write"] } },
  { methods: ["DELETE"], pattern: "/webhooks/*", roles: ["enterprise"], requirement: { anyOf: ["webhooks:write"] } },
  { methods: ["GET"], pattern: "/webhooks/retries", roles: ["enterprise"], requirement: { anyOf: ["webhooks:read"] } },
  { methods: ["GET"], pattern: "/webhooks*", roles: ["enterprise"], requirement: { anyOf: ["webhooks:read"] } },
  { methods: ["POST"], pattern: "/zk-proof/generate", roles: ["enterprise"], requirement: { anyOf: ["zk:write"] } },
  { methods: ["POST"], pattern: "/zk-proof/noir/generate", roles: ["enterprise"], requirement: { anyOf: ["zk:write"] } },
  { methods: ["GET"], pattern: "/zk-proof/*", roles: ["enterprise"], requirement: { anyOf: ["zk:read"] } },
  { methods: ["POST"], pattern: "/zk-proof/verify", roles: ["enterprise"], requirement: { anyOf: ["zk:read"] } },
  { methods: ["POST"], pattern: "/zk-proof/disclose", roles: ["enterprise"], requirement: { anyOf: ["zk:read"] } },
  { methods: ["POST"], pattern: "/zk-proof/noir/verify", roles: ["enterprise"], requirement: { anyOf: ["zk:read"] } },
];

const routeMatchers = routePolicies.map((policy) => ({
  policy,
  regex: toRegex(policy.pattern),
}));

const apiMatchers = apiPolicies.map((policy) => ({
  policy,
  regex: toRegex(policy.pattern),
}));

export const isPublicRoute = (path: string): boolean => PUBLIC_ROUTES.has(path);

export const canAccessRoute = (role: AppRole, permissions: string[], path: string): boolean => {
  if (env.devUnlockAllRoutes) {
    // Temporary development bypass: allow every dashboard route while you are editing cross-role screens.
    // Set `VITE_DEV_UNLOCK_ALL_ROUTES=false` later to restore the normal RBAC route checks below.
    void role;
    void permissions;
    void path;
    return true;
  }
  if (isPublicRoute(path)) return true;
  const match = routeMatchers.find((item) => item.regex.test(path));
  if (!match) return false;
  if (!match.policy.roles.includes(role)) return false;
  return hasPermissionRequirement(permissions, match.policy.requirement);
};

export const assertApiAccess = (
  role: AppRole | undefined,
  permissions: string[],
  method: string,
  path: string,
): string | null => {
  if (env.mockAuthEnabled || env.devUnlockAllRoutes) {
    // Temporary development bypass: keep banking calls reachable while auth is mocked so pages can still render their flows.
    // Set `VITE_MOCK_AUTH_ENABLED=false` and `VITE_DEV_UNLOCK_ALL_ROUTES=false` later to restore the live API RBAC checks below.
    void role;
    void permissions;
    void method;
    void path;
    return null;
  }
  const normalizedMethod = method.toUpperCase() as ApiPolicy["methods"][number];
  if (!role) return null;
  if (role === "user") {
    return `RBAC denied: role "${role}" cannot access dashboard banking APIs.`;
  }
  if (role === "manager" || role === "admin") {
    return `RBAC denied: role "${role}" is out of scope for the current roles matrix.`;
  }
  const match = apiMatchers.find(
    (item) => item.policy.methods.includes(normalizedMethod) && item.regex.test(path),
  );
  if (!match) {
    return `RBAC denied: no policy rule for ${normalizedMethod} ${path}.`;
  }
  if (!match.policy.roles.includes(role)) {
    return `RBAC denied: role "${role}" cannot call ${normalizedMethod} ${path}.`;
  }
  if (!hasPermissionRequirement(permissions, match.policy.requirement)) {
    return `RBAC denied: missing required permission for ${normalizedMethod} ${path}.`;
  }
  return null;
};

