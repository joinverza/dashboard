# Frontend Security & Auth Update Specification

## 1. Purpose

This document is the frontend implementation guide for the latest backend security changes, including:

- Admin analytics authorization hardening
- Step-up authentication for sensitive admin operations
- Nonce/timestamp anti-replay requirements for high-risk requests
- JWKS lifecycle visibility and key management operations
- Machine identity management for service-to-service access
- Policy monitor/enforce toggles for safe rollout

This guide catalogs:

- Frontend modules that must be changed
- Full endpoint list with HTTP methods and URLs
- Request/response schemas
- Authentication and permission requirements
- Error handling behavior
- Environment variable requirements for API URLs
- Integration code examples
- Testing/acceptance criteria

---

## 2. API Base URLs and Required Environment Variables

Use explicit base URLs in frontend configuration.

### Required Frontend Environment Variables

```bash
# Core API base used by browser clients
VITE_ONTIVER_API_BASE_URL=https://api.yourdomain.com

# Optional explicit auth base (if different from core API host)
VITE_ONTIVER_AUTH_BASE_URL=${VITE_ONTIVER_API_BASE_URL}

# Optional explicit banking base (if different)
VITE_ONTIVER_BANKING_BASE_URL=${VITE_ONTIVER_API_BASE_URL}

# Frontend feature flags for rollout UX behavior
VITE_SECURITY_STEP_UP_ENABLED=true
VITE_SECURITY_NONCE_ENABLED=true
VITE_SECURITY_POLICY_UI_ENABLED=true
```

### Derived Base Paths

- Auth base path: `${VITE_ONTIVER_AUTH_BASE_URL}`
- Banking base path: `${VITE_ONTIVER_BANKING_BASE_URL}/api/v1/banking`

### URL Construction Rules

- Auth endpoints are mounted at `/auth/...`
- Banking endpoints are mounted at `/api/v1/banking/...`
- Never hardcode hostnames in components; always resolve from env.

---

## 3. Frontend Modules Requiring Modification

The frontend should be updated in these logical modules (rename to match your project layout):

1. `src/config/env.ts`
- Add and validate all new env vars.

2. `src/api/httpClient.ts`
- Add high-risk request middleware for nonce/timestamp headers.
- Add request/response interceptors for 401/403 handling and requestId extraction.

3. `src/auth/sessionStore.ts`
- Persist `role`, `permissions`, and step-up state.
- Track `stepUpVerifiedAt` and computed `stepUpExpiresAt`.

4. `src/auth/stepUp.ts`
- New API helper for `POST /auth/step-up`.
- Expose `performStepUp(code)` and `isStepUpFresh()`.

5. `src/security/policyClient.ts`
- New API helpers for policy mode reads/writes used by admin security UI.

6. `src/security/jwksClient.ts`
- New API helpers for JWKS metadata, rotate, and revoke operations.

7. `src/security/machineIdentityClient.ts`
- New API helpers for machine identity creation and token issuance.

8. `src/features/admin/security/*`
- New UI screens/components:
  - JWKS metadata panel
  - Policy mode editor
  - Machine identity manager
  - One-time machine token reveal modal

9. `src/features/admin/analytics/*`
- Gate analytics screens by required permissions (`admin:read` + `analytics:read`).
- Keep graceful fallback handling for 403.

10. `src/features/admin/disputes`, `governance`, `enterprise`, `reports`
- Add step-up prompts and nonce header support for high-risk mutations.

11. `src/types/security.ts` and `src/types/api.ts`
- Add all schemas from this document.

12. `src/tests/*` (unit/e2e)
- Add verification tests listed in section 12.

---

## 4. Authentication and Authorization Model (Frontend Mapping)

### Access Principals

1. Human dashboard user (Bearer access token from `/auth/login`)
2. Machine identity token (`svc_...`) for service workloads (not for browser sessions)

### Permission Behavior

- Authorization is explicit and permission-based (deny by default).
- For admin analytics endpoints, frontend must assume both permissions are required:
  - `admin:read`
  - `analytics:read`

### Step-up Requirement

Sensitive operations now require a recent step-up authentication for admin user sessions.
Frontend must:

1. Trigger MFA step-up modal
2. Call `POST /auth/step-up`
3. Retry protected action once on success

### Anti-Replay Requirement

High-risk requests must include:

- `X-Ontiver-Nonce`: unique random value per request attempt
- `X-Ontiver-Timestamp`: unix timestamp (seconds)

---

## 5. Endpoint Catalog (Methods, URLs, Auth, Schemas)

## 5.1 Auth and Security Management Endpoints

### 5.1.1 Step-Up Auth

- Method: `POST`
- URL: `${AUTH_BASE}/auth/step-up`
- Auth: `Authorization: Bearer <accessToken>` (admin user)
- Headers:
  - `Content-Type: application/json`
- Request:

```json
{
  "code": "123456"
}
```

- Success `200`:

```json
{
  "success": true,
  "data": {
    "stepUp": true,
    "reauthenticatedAt": "2026-04-06T12:00:00Z"
  },
  "requestId": "req_xxx"
}
```

- Error:
  - `401` invalid token or invalid MFA code
  - `403` insufficient permissions

---

### 5.1.2 JWKS Metadata

- Method: `GET`
- URL: `${AUTH_BASE}/auth/.well-known/jwks.json`
- Auth: none (metadata endpoint)
- Success `200`:

```json
{
  "keys": [
    {
      "kty": "oct",
      "kid": "auth-kid-xxxxx",
      "alg": "HS256",
      "use": "sig",
      "status": "active",
      "createdAt": "2026-04-06T12:00:00Z",
      "rotatedAt": null,
      "revokedAt": null
    }
  ]
}
```

---

### 5.1.3 Rotate Signing Key

- Method: `POST`
- URL: `${AUTH_BASE}/auth/jwks/rotate`
- Auth: `x-ontiver-admin-token` header (ops/admin backend token flow)
- Success `200`:

```json
{
  "success": true,
  "data": {
    "rotated": true,
    "kid": "auth-kid-new"
  },
  "requestId": "req_xxx"
}
```

---

### 5.1.4 Revoke Signing Key

- Method: `POST`
- URL: `${AUTH_BASE}/auth/jwks/revoke/{kid}`
- Auth: `x-ontiver-admin-token`
- Success `200`:

```json
{
  "success": true,
  "data": {
    "revoked": true,
    "kid": "auth-kid-old"
  },
  "requestId": "req_xxx"
}
```

- Error:
  - `409` key cannot be revoked (example: active key)

---

### 5.1.5 Create Machine Identity

- Method: `POST`
- URL: `${AUTH_BASE}/auth/machine-identities`
- Auth: `x-ontiver-admin-token`
- Request:

```json
{
  "name": "analytics-worker",
  "tenantId": "usr_123",
  "permissions": ["admin:read", "analytics:read"]
}
```

- Success `201`:

```json
{
  "success": true,
  "data": {
    "identityId": "svc_id_xxx",
    "tenantId": "usr_123",
    "name": "analytics-worker",
    "permissions": ["admin:read", "analytics:read"]
  },
  "requestId": "req_xxx"
}
```

---

### 5.1.6 Issue Machine Token

- Method: `POST`
- URL: `${AUTH_BASE}/auth/machine-identities/{identityId}/tokens/issue`
- Auth: `x-ontiver-admin-token`
- Request:

```json
{
  "ttlSeconds": 900
}
```

- Success `201`:

```json
{
  "success": true,
  "data": {
    "identityId": "svc_id_xxx",
    "tokenId": "tok_xxx",
    "token": "svc_kid.body",
    "expiresAt": "2026-04-06T12:30:00Z"
  },
  "requestId": "req_xxx"
}
```

---

### 5.1.7 Set Security Policy Mode

- Method: `POST`
- URL: `${AUTH_BASE}/auth/policies/{policyKey}/mode`
- Auth: `x-ontiver-admin-token`
- Request:

```json
{
  "mode": "enforce"
}
```

- Allowed modes: `enforce | monitor | off`
- Success `200`:

```json
{
  "success": true,
  "data": {
    "policyKey": "stepup.disputes.resolve",
    "mode": "enforce",
    "updatedAt": "2026-04-06T12:00:00Z"
  },
  "requestId": "req_xxx"
}
```

---

## 5.2 Sensitive Banking Endpoints (Now Protected by Step-Up + Nonce)

For all endpoints below:

- Auth: `Authorization: Bearer <accessToken>`
- Required permissions:
  - `admin:write` (or route-defined write scope)
- Required headers for anti-replay:
  - `X-Ontiver-Nonce`
  - `X-Ontiver-Timestamp`

### 5.2.1 Resolve Dispute

- Method: `POST`
- URL: `${BANKING_BASE}/disputes/{disputeId}/resolve`
- Request:

```json
{
  "resolution": "reject",
  "notes": "No refund approved"
}
```

---

### 5.2.2 Create Governance Proposal

- Method: `POST`
- URL: `${BANKING_BASE}/governance/proposals`
- Request:

```json
{
  "title": "Policy Update",
  "summary": "Adjust risk thresholds",
  "changes": [{"field": "riskThreshold", "from": 70, "to": 75}],
  "votingEndsAt": "2030-01-01T00:00:00Z"
}
```

---

### 5.2.3 Patch Enterprise

- Method: `PATCH`
- URL: `${BANKING_BASE}/admin/enterprises/{tenantId}`
- Request:

```json
{
  "status": "suspended",
  "contactEmail": "risk@example.com"
}
```

---

### 5.2.4 Create Report

- Method: `POST`
- URL: `${BANKING_BASE}/reports/create`
- Request:

```json
{
  "reportType": "compliance_summary",
  "dateRange": {
    "from": "2026-03-01T00:00:00Z",
    "to": "2026-04-01T23:59:59Z"
  },
  "filters": {},
  "format": "csv",
  "includeCharts": false
}
```

---

## 5.3 Admin Analytics Endpoints (Permission Hardening)

### 5.3.1 Verification Stats

- Method: `GET`
- URL: `${BANKING_BASE}/analytics/verification-stats`
- Required permissions:
  - `admin:read`
  - `analytics:read`

### 5.3.2 Geographic Distribution

- Method: `GET`
- URL: `${BANKING_BASE}/analytics/geographic-distribution`
- Required permissions:
  - `admin:read`
  - `analytics:read`

### 5.3.3 Legacy Geographic Alias (if used by old UI routes)

- Method: `GET`
- URL: `${BANKING_BASE}/analytics/geographical`
- Required permissions:
  - `admin:read`
  - `analytics:read`

---

## 6. Frontend Data Schemas (TypeScript Contracts)

Create/extend `src/types/security.ts` with the following:

```ts
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
  token: string; // one-time reveal
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
```

### High-Risk Operation Registry Schema

```ts
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
```

---

## 7. Auth and Header Requirements Matrix

| Endpoint Group | Auth Header | Extra Headers | Notes |
|---|---|---|---|
| `/auth/step-up` | `Authorization: Bearer <accessToken>` | none | Admin user session only |
| `/auth/.well-known/jwks.json` | none | none | Metadata endpoint |
| `/auth/jwks/*` | `x-ontiver-admin-token` | none | Ops/admin flow, not regular dashboard token |
| `/auth/machine-identities*` | `x-ontiver-admin-token` | none | Returns one-time machine secrets |
| `/auth/policies/*/mode` | `x-ontiver-admin-token` | none | Rollout control |
| High-risk banking mutations | `Authorization: Bearer <accessToken>` | `X-Ontiver-Nonce`, `X-Ontiver-Timestamp` | Step-up + replay control |
| Admin analytics endpoints | `Authorization: Bearer <accessToken>` | none | Require `admin:read` + `analytics:read` |

---

## 8. Error Handling Specification

### Common Status Handling

- `400`: validation errors, malformed payload/fields
- `401`: missing/invalid token, expired session, invalid MFA code
- `403`: insufficient permissions, step-up/nonce denied in enforce mode
- `409`: conflict (for example invalid key revoke target)
- `429`: rate limiting
- `5xx`: transient server failures

### Frontend Error Mapping

1. `401` on protected request:
- attempt refresh once (if flow supports refresh)
- otherwise force sign-out and redirect to login

2. `403` on high-risk operation:
- if operation requires step-up, show step-up modal and retry once
- if retry still fails, show generic permission denied toast/dialog

3. `403` on analytics reads:
- fallback gracefully to empty/zero state where applicable

4. `429`:
- show retry guidance and debounce repeated actions

### Security Rule

- Never render backend internals in UI.
- Keep messaging generic: "You do not have access to perform this action."

---

## 9. Integration Code Examples

## 9.1 HTTP Client Nonce Interceptor

```ts
import { randomUUID } from "crypto";

const HIGH_RISK_ROUTES: Array<{ method: string; pattern: RegExp }> = [
  { method: "POST", pattern: /\/api\/v1\/banking\/disputes\/[^/]+\/resolve$/ },
  { method: "POST", pattern: /\/api\/v1\/banking\/governance\/proposals$/ },
  { method: "PATCH", pattern: /\/api\/v1\/banking\/admin\/enterprises\/[^/]+$/ },
  { method: "POST", pattern: /\/api\/v1\/banking\/reports\/create$/ },
];

function requiresNonce(method: string, url: string): boolean {
  return HIGH_RISK_ROUTES.some(
    (r) => r.method === method.toUpperCase() && r.pattern.test(url)
  );
}

export function addSecurityHeaders(
  method: string,
  url: string,
  headers: Record<string, string>
) {
  if (!requiresNonce(method, url)) return headers;
  return {
    ...headers,
    "X-Ontiver-Nonce": randomUUID(),
    "X-Ontiver-Timestamp": String(Math.floor(Date.now() / 1000)),
  };
}
```

## 9.2 Step-Up Retry Wrapper

```ts
export async function runWithStepUpRetry<T>(
  op: () => Promise<T>,
  performStepUp: () => Promise<void>,
  isHighRisk: boolean
): Promise<T> {
  try {
    return await op();
  } catch (err: any) {
    const status = err?.response?.status;
    if (!isHighRisk || status !== 403) throw err;
    await performStepUp(); // prompts for MFA code and calls /auth/step-up
    return await op(); // retry once
  }
}
```

## 9.3 Security API Client

```ts
const AUTH_BASE = import.meta.env.VITE_ONTIVER_AUTH_BASE_URL;

export async function fetchJwks() {
  const res = await fetch(`${AUTH_BASE}/auth/.well-known/jwks.json`);
  if (!res.ok) throw new Error("Failed to fetch JWKS metadata");
  return (await res.json()) as { keys: Array<any> };
}

export async function rotateSigningKey(adminToken: string) {
  const res = await fetch(`${AUTH_BASE}/auth/jwks/rotate`, {
    method: "POST",
    headers: { "x-ontiver-admin-token": adminToken },
  });
  if (!res.ok) throw new Error("Rotate failed");
  return await res.json();
}
```

---

## 10. Component-by-Component Data Contracts

## 10.1 Admin Security Console

### Consumes

- `GET /auth/.well-known/jwks.json` -> `JwksMetadataResponse`
- `POST /auth/jwks/rotate`
- `POST /auth/jwks/revoke/{kid}`
- `POST /auth/policies/{policyKey}/mode`

### Produces

- `PolicyModeUpdateRequest`
- key rotation/revocation command actions

---

## 10.2 Step-Up Modal Component

### Consumes

- user entered 6-digit code
- `POST /auth/step-up`

### Produces

- `StepUpRequest`
- local state update (`stepUpVerifiedAt`)

---

## 10.3 Admin Analytics Dashboard

### Consumes

- `GET /api/v1/banking/analytics/verification-stats`
- `GET /api/v1/banking/analytics/geographic-distribution`

### Produces

- no writes
- fallback UI states on `403`

---

## 10.4 Dispute / Governance / Enterprise / Reports Mutations

### Consumes

- High-risk endpoint responses + standard envelopes

### Produces

- mutation payloads listed in section 5.2
- nonce/timestamp headers
- optional step-up prompt flow

---

## 11. Implementation Sequence (Frontend)

1. Add env vars + centralized API URL builder.
2. Add schemas/types in `types/security.ts`.
3. Add HTTP interceptor for nonce/timestamp.
4. Add step-up API and modal flow.
5. Integrate high-risk action wrapper with retry-once behavior.
6. Integrate admin analytics permission gating/fallback handling.
7. Build Security Console pages for JWKS/policies/machine identities.
8. Add test coverage from section 12.
9. Roll out with monitor-mode messaging first.
10. Enable enforce-mode per policy after validating telemetry.

---

## 12. Frontend Testing and Acceptance Criteria

## 12.1 Unit Tests

1. Nonce middleware:
- Adds nonce/timestamp only on high-risk routes.
- Regenerates nonce for each retry.

2. Step-up flow:
- On `403` for high-risk op, opens modal and calls `/auth/step-up`.
- Retries original call exactly once.

3. Permission gating:
- Analytics components hidden/disabled if required permissions missing.

4. Schema validation:
- Runtime guards (if used) reject malformed security API responses.

## 12.2 Integration Tests

1. JWKS panel:
- Successfully lists keys from metadata endpoint.

2. Policy editor:
- Updates mode and reflects latest state in UI.

3. Machine identity flow:
- Create identity -> issue token -> show one-time token reveal.

4. Sensitive admin operations:
- Without step-up in enforce mode: blocked with `403`.
- After step-up: operation succeeds.

5. Anti-replay:
- Missing nonce/timestamp in enforce mode: blocked.
- Valid nonce/timestamp request: succeeds.

## 12.3 E2E Acceptance

1. Admin analytics:
- Admin token with `admin:read` + `analytics:read` gets `200`.
- Non-admin token gets `403` and UI remains stable.

2. Security rollout behavior:
- Monitor mode logs do not block UI.
- Enforce mode blocks non-compliant requests and triggers expected UX.

3. Error handling:
- Request IDs are captured and surfaced in debug logs.
- No raw backend internals are shown to end users.

---

## 13. Open Notes for Future RSA/EC JWKS Migration

Current JWKS metadata is operationally useful for key lifecycle tracking with HS256.
To support fully public-verifiable JWT verification by external clients, backend should migrate to RSA/EC signing and expose public JWK fields (`n/e` or `x/y`) in JWKS.

Frontend impact for future migration is minimal if it already treats JWKS panel as metadata-driven and does not assume HS256-specific behavior.
