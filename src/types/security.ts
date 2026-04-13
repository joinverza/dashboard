export type ApiEnvelopeSuccess<T> = {
  success: true;
  data: T;
  requestId?: string;
};

export type ApiEnvelopeError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
  requestId?: string;
};

export type SecurityPolicyMode = "enforce" | "monitor" | "off";

export type JwksKeyMeta = {
  kty: string;
  kid: string;
  alg: string;
  use: string;
  status: "active" | "rotated" | "revoked";
  createdAt: string;
  rotatedAt: string | null;
  revokedAt: string | null;
};

export type JwksMetadataResponse = {
  keys: JwksKeyMeta[];
};

export type StepUpRequest = {
  code: string;
};

export type StepUpResponse = {
  stepUp: true;
  reauthenticatedAt: string;
};

export type ServiceIdentityCreateRequest = {
  name: string;
  tenantId: string;
  permissions: string[];
};

export type ServiceIdentityCreateResponse = {
  identityId: string;
  tenantId: string;
  name: string;
  permissions: string[];
};

export type ServiceTokenIssueRequest = {
  ttlSeconds?: number;
};

export type ServiceTokenIssueResponse = {
  identityId: string;
  tokenId: string;
  token: string;
  expiresAt: string;
};

export type PolicyModeUpdateRequest = {
  mode: SecurityPolicyMode;
};

export type PolicyModeUpdateResponse = {
  policyKey: string;
  mode: SecurityPolicyMode;
  updatedAt: string;
};

export type HighRiskOperationKey =
  | "disputes.resolve"
  | "governance.proposals.create"
  | "enterprises.patch"
  | "reports.create";

export type HighRiskOperationConfig = {
  key: HighRiskOperationKey;
  requiresStepUp: boolean;
  requiresNonce: boolean;
  requiredPermissions: string[];
  method: "POST" | "PATCH";
  pathPattern: string;
};

export const HIGH_RISK_OPERATIONS: HighRiskOperationConfig[] = [
  {
    key: "disputes.resolve",
    requiresStepUp: true,
    requiresNonce: true,
    requiredPermissions: ["admin:write"],
    method: "POST",
    pathPattern: "/disputes/:disputeId/resolve",
  },
  {
    key: "governance.proposals.create",
    requiresStepUp: true,
    requiresNonce: true,
    requiredPermissions: ["admin:write"],
    method: "POST",
    pathPattern: "/governance/proposals",
  },
  {
    key: "enterprises.patch",
    requiresStepUp: true,
    requiresNonce: true,
    requiredPermissions: ["admin:write"],
    method: "PATCH",
    pathPattern: "/enterprises/:tenantId",
  },
  {
    key: "reports.create",
    requiresStepUp: true,
    requiresNonce: true,
    requiredPermissions: ["admin:write"],
    method: "POST",
    pathPattern: "/reports/create",
  },
];

