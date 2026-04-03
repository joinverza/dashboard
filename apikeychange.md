# Frontend Handoff: API Key Management (Environment-Aware)

## Purpose

This document is the implementation handoff for frontend and design updates related to API key management.

It covers:

- Updated API contracts
- Request/response schemas
- UI/UX requirements
- Validation and error handling
- Frontend data models
- Migration and backward compatibility considerations

The goal is for frontend engineers and designers to implement the key management experience correctly for sandbox and production keys.

---

## 1) What Changed

### Environment-specific API keys are now enforced

- **Production keys** are generated with raw prefix: `prod_...`
- **Sandbox keys** are generated with raw prefix: `sb_...`

### API key metadata now includes environment

Each API key record now carries:

- `environment`: `"production"` or `"sandbox"`
- `keyPrefix`: masked display form of key prefix:
  - `prod_****`
  - `sb_****`

### New key validation endpoint

A new endpoint resolves whether current bearer credential is:

- an API key (`source = "api_key"`)
- an auth access token (`source = "access_token"`)

This is intended for dashboard credential status checks.

---

## 2) API Base and Auth

- **Base route for key management:** `/api/v1/banking/api-keys`
- **Auth header:** `Authorization: Bearer <credential>`
- **Credential can be:**
  - API key (for key-based integrations)
  - access token (for authenticated dashboard session context)

### Envelope format

#### Success envelope

```json
{
  "success": true,
  "data": {}
}
```

#### Error envelope

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Invalid request",
    "details": []
  }
}
```

---

## 3) Endpoints and Contracts

## 3.1 Create API Key

- **Method:** `POST /api/v1/banking/api-keys/create`
- **Permission:** `api_keys:write`
- **Purpose:** Create a new API key in selected environment

### Request Body

```json
{
  "keyName": "Dashboard Sandbox Key",
  "permissions": ["api_keys:read", "kyc:read"],
  "environment": "sandbox",
  "expiresAt": null,
  "ipWhitelist": ["203.0.113.10/32"],
  "rateLimit": 1000
}
```

### Field Details

- `keyName` (required): string, min 1, max 128
- `permissions` (optional): string[]
- `environment` (optional): `"production"` | `"sandbox"` (defaults to `"production"`)
- `expiresAt` (optional): ISO datetime string or null
- `ipWhitelist` (optional): array of IP/CIDR strings
- `rateLimit` (optional): integer >= 0

### Response (200)

```json
{
  "success": true,
  "data": {
    "id": "key_123",
    "keyId": "key_123",
    "name": "Dashboard Sandbox Key",
    "keyName": "Dashboard Sandbox Key",
    "apiKey": "sb_xxxxxxxxxxxxxxxxx",
    "keyPrefix": "sb_****",
    "permissions": ["api_keys:read", "kyc:read"],
    "scopes": ["api_keys:read", "kyc:read"],
    "environment": "sandbox",
    "createdAt": "2026-04-03T10:00:00Z",
    "lastUsed": "2026-04-03T10:00:00Z",
    "status": "active",
    "expiresAt": null
  }
}
```

### Frontend implications

- `apiKey` is visible once: must be shown in one-time reveal modal/drawer.
- Frontend must show environment badge at creation time.
- Frontend must not assume `ont_` prefix.

---

## 3.2 List API Keys

- **Method:** `GET /api/v1/banking/api-keys`
- **Permission:** `api_keys:read`
- **Purpose:** List all API keys for tenant

### Optional Query Params

- `environment=production|sandbox` (server-side filter)

### Example Requests

- `GET /api/v1/banking/api-keys`
- `GET /api/v1/banking/api-keys?environment=sandbox`

### Response (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "key_123",
        "keyId": "key_123",
        "name": "Dashboard Sandbox Key",
        "keyName": "Dashboard Sandbox Key",
        "keyPrefix": "sb_****",
        "permissions": ["api_keys:read"],
        "environment": "sandbox",
        "createdAt": "2026-04-01T10:00:00Z",
        "lastUsed": "2026-04-03T08:55:00Z",
        "expiresAt": null,
        "revokedAt": null,
        "rateLimit": 1000,
        "status": "active"
      }
    ]
  }
}
```

### Frontend implications

- Add tabs/chips/filter dropdown for environment:
  - All
  - Production
  - Sandbox
- Filter should call endpoint with query param.
- Display `keyPrefix` and `environment` in each row.

---

## 3.3 Validate Current Credential

- **Method:** `GET /api/v1/banking/api-keys/validate/current`
- **Auth:** Any valid bearer credential
- **Purpose:** Determine credential source and return resolved key metadata/environment

### Response when bearer is API key

```json
{
  "success": true,
  "data": {
    "valid": true,
    "source": "api_key",
    "id": "key_123",
    "keyId": "key_123",
    "name": "Dashboard Sandbox Key",
    "keyName": "Dashboard Sandbox Key",
    "keyPrefix": "sb_****",
    "permissions": ["api_keys:read"],
    "environment": "sandbox",
    "createdAt": "2026-04-01T10:00:00Z",
    "lastUsed": "2026-04-03T08:55:00Z",
    "expiresAt": null,
    "revokedAt": null,
    "rateLimit": 1000,
    "status": "active"
  }
}
```

### Response when bearer is access token

```json
{
  "success": true,
  "data": {
    "valid": true,
    "source": "access_token",
    "environment": "production"
  }
}
```

### Frontend implications

- Use this endpoint for key/session context card in dashboard settings.
- If `source = "api_key"`: show key-specific details.
- If `source = "access_token"`: show session context only.

---

## 3.4 Revoke API Key

- **Method:** `DELETE /api/v1/banking/api-keys/{keyId}`
- **Permission:** `api_keys:write`
- **Purpose:** Revoke key immediately

### Response (200)

```json
{
  "success": true,
  "data": {
    "keyId": "key_123",
    "revoked": true,
    "revokedAt": "2026-04-03T11:00:00Z"
  }
}
```

---

## 4) Frontend Type Definitions (Recommended)

```ts
export type ApiKeyEnvironment = "production" | "sandbox";

export type ApiKeyStatus = "active" | "revoked";

export type ApiKeyListItem = {
  id: string;
  keyId: string;
  name: string;
  keyName: string;
  keyPrefix: string; // "prod_****" | "sb_****"
  permissions: string[];
  environment: ApiKeyEnvironment;
  createdAt: string;
  lastUsed: string;
  expiresAt: string | null;
  revokedAt: string | null;
  rateLimit: number | null;
  status: ApiKeyStatus;
};

export type CreateApiKeyRequest = {
  keyName: string;
  permissions?: string[];
  environment?: ApiKeyEnvironment;
  expiresAt?: string | null;
  ipWhitelist?: string[] | null;
  rateLimit?: number | null;
};

export type CreateApiKeyResponseData = {
  id: string;
  keyId: string;
  name: string;
  keyName: string;
  apiKey: string;
  keyPrefix: string;
  permissions: string[];
  scopes: string[];
  environment: ApiKeyEnvironment;
  createdAt: string;
  lastUsed: string;
  status: "active";
  expiresAt: string | null;
};

export type ValidateCurrentKeyResponseData = {
  valid: true;
  source: "api_key" | "access_token";
  environment: ApiKeyEnvironment;
  id?: string;
  keyId?: string;
  name?: string;
  keyName?: string;
  keyPrefix?: string;
  permissions?: string[];
  createdAt?: string;
  lastUsed?: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  rateLimit?: number | null;
  status?: ApiKeyStatus;
};
```

---

## 5) Design Requirements (Key Management Page)

### 5.1 Create Key Modal

- Add required UI selection for environment:
  - Production
  - Sandbox
- Default selection: Production
- Include helper text:
  - Production keys access live workflows
  - Sandbox keys are for test/simulation

### 5.2 One-time Secret Reveal

- On successful create, open reveal modal:
  - Show full `apiKey`
  - Show environment badge
  - Show copy action
  - Show warning:
    - "This key is shown once. Save it now."
- Add "I copied this key" confirmation action before close (recommended).

### 5.3 List Table

Recommended columns:

- Key Name
- Environment
- Masked Prefix (`keyPrefix`)
- Permissions
- Created At
- Last Used
- Expires At
- Status
- Actions (Revoke)

### 5.4 Filters

- Add environment filter controls:
  - All
  - Production
  - Sandbox
- Filter must trigger API fetch with query `environment`.

### 5.5 Status and Badge System

- `environment` badge:
  - `production` => stronger/critical color token
  - `sandbox` => test/safe color token
- `status` badge:
  - `active`
  - `revoked`

---

## 6) Validation Rules for Frontend Forms

- `keyName`: required, 1..128 chars
- `environment`: enum `production | sandbox`
- `rateLimit`: integer, `>= 0`
- `expiresAt`: valid ISO datetime if provided
- `ipWhitelist`: array of valid IP/CIDR strings (optional client-side check)

### Important

- Do not enforce old format checks like `ont_`.
- Do not hardcode prefix validation strictly for business logic.
- Use server responses as source of truth (`environment`, `keyPrefix`).

---

## 7) Error Handling and UX Mapping

Common errors to support:

- `400` validation errors
- `401` invalid/missing auth
- `403` insufficient permissions
- `429` rate limited (especially create endpoint)
- `500` server error fallback

Recommended UI mapping:

- show `error.message` from error envelope
- optionally render structured `error.details`
- keep retry CTA for transient errors (`429`, `500`)

---

## 8) Backward Compatibility and Migration Considerations

- Existing legacy keys may still exist.
- Backend allows legacy raw keys without `prod_`/`sb_` for compatibility.
- Frontend should never infer environment solely by raw key format.
- Frontend should display `keyPrefix` returned by API.
- Frontend should rely on explicit `environment` field in list/create/validate responses.

---

## 9) Frontend Implementation Checklist

- Update API client methods for create/list/validate/revoke.
- Update request/response DTOs and domain models.
- Add environment selector to create form.
- Add one-time reveal modal with secure copy UX.
- Add environment filtering controls to list screen.
- Render environment and keyPrefix in table rows.
- Add `validate/current` integration where credential state is shown.
- Remove old assumptions about `ont_` key format.

---

## 10) QA Scenarios (Must Pass)

### Create Flows

- Create **sandbox** key:
  - raw key starts with `sb_`
  - `environment = sandbox`
  - `keyPrefix = sb_****`

- Create **production** key:
  - raw key starts with `prod_`
  - `environment = production`
  - `keyPrefix = prod_****`

### List Flows

- List all returns mixed environments.
- Filter with `environment=sandbox` returns only sandbox records.
- Filter with `environment=production` returns only production records.

### Validation Flow

- With API key bearer:
  - response has `source = api_key`
  - response includes key metadata/environment

- With access token bearer:
  - response has `source = access_token`
  - response may omit key metadata fields

### Revoke Flow

- Revoked key moves to `status = revoked`.
- `revokedAt` is populated.

---

## 11) Suggested Copy (Optional)

### Create Modal helper text

"Choose the environment for this key. Production keys are for live operations. Sandbox keys are for testing and simulations."

### One-time reveal warning

"For security reasons, this API key is shown only once. Copy and store it now."

### Environment badge descriptions

- Production: "Live traffic"
- Sandbox: "Test traffic"

---

## 12) Reference Summary for Engineering

- New raw key prefixes:
  - production: `prod_`
  - sandbox: `sb_`
- New/updated response fields:
  - `environment`
  - `keyPrefix`
  - `lastUsed`
- New endpoint:
  - `GET /api/v1/banking/api-keys/validate/current`
- List supports:
  - `?environment=production|sandbox`

