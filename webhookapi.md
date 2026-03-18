# API Keys & Webhooks — Backend Implementation Contract (Frontend Mapping)

This document is based on the current backend implementation in:

- `banking/routers/api_keys.py`
- `banking/routers/webhooks.py`
- `banking/auth.py`
- `banking/envelope.py`
- `banking/audit.py`
- `banking/jobs.py`
- `banking/api.py`

It describes the exact request/response behavior for all API Key and Webhook endpoints so frontend integration can be mapped accurately.

## Base Route

All routes below are mounted under:

`/api/v1/banking`

So, for example:

- `POST /api-keys/create` becomes `POST /api/v1/banking/api-keys/create`
- `GET /webhooks` becomes `GET /api/v1/banking/webhooks`

## Authentication and Permission Model

Most endpoints require:

- `Authorization: Bearer <api_key>`

Permission checks:

- API Keys:
  - `api_keys:read` for listing
  - `api_keys:write` for create/revoke (except first bootstrap create)
- Webhooks:
  - `webhooks:read` for listing
  - `webhooks:write` for register/delete/test

### Special Bootstrap Rule for First API Key

`POST /api/v1/banking/api-keys/create` has a first-time bootstrap flow:

- If there are **no active API keys** yet, bearer auth is **not used**.
- Instead, backend expects header: `x-verza-admin-token: <token>`
- If admin token is missing/invalid, request fails.

After at least one active key exists, create endpoint requires bearer auth + `api_keys:write`.

## Envelope and Error Formats

### Standard Success Envelope

Most successful responses are returned as:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-18T12:34:56Z"
}
```

### Validation Error (Request Body/Query Validation)

Validation errors are normalized to status `400`:

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation error",
    "details": [
      {
        "loc": ["body", "fieldName"],
        "msg": "validation message",
        "type": "validation_type"
      }
    ]
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

### Auth/Permission/Rate-Limit Errors

Auth/permission/rate-limit failures are raised as `HTTPException` and returned in FastAPI default format:

```json
{
  "detail": "Error message"
}
```

Common statuses:

- `401`: missing/invalid/expired API key, invalid admin token
- `403`: insufficient permissions, IP not allowed
- `429`: rate limit exceeded
- `503`: admin token not configured (bootstrap only)

## Idempotency Behavior (Important for Frontend Retries)

Supported on mutating endpoints below via header:

- `Idempotency-Key: <string>`

When a duplicate `(tenant_id, api_key_id, method, path, idempotency_key)` is detected:

- backend returns the **original stored response body**
- with the **original status code**

Idempotency-enabled endpoints:

- `POST /api/v1/banking/api-keys/create`
- `DELETE /api/v1/banking/api-keys/{keyId}`
- `POST /api/v1/banking/webhooks/register`
- `DELETE /api/v1/banking/webhooks/{webhookId}`
- `POST /api/v1/banking/webhooks/test`

## API Keys Endpoints

---

## 1) Create API Key

**Endpoint**

`POST /api/v1/banking/api-keys/create`

**Auth**

- Bootstrap mode (no active keys): `x-verza-admin-token` required
- Normal mode: `Authorization: Bearer <api_key>` + permission `api_keys:write`

**Request Body**

```json
{
  "keyName": "Frontend Server Key",
  "permissions": ["api_keys:read", "webhooks:write"],
  "expiresAt": "2026-12-31T23:59:59Z",
  "ipWhitelist": ["203.0.113.10", "10.0.0.0/24"],
  "rateLimit": 1200
}
```

**Field Rules**

- `keyName`: required string, min 1, max 128
- `permissions`: optional array of strings, default `[]`
- `expiresAt`: optional string, parsed as ISO datetime
  - if parse fails, backend stores `null` (it does not throw validation error for bad ISO format)
- `ipWhitelist`: optional array of strings (CIDR/IP checks happen at runtime when key is used)
- `rateLimit`: optional integer, must be `>= 0`
  - `0` effectively means unlimited in enforcement logic

**200 Response**

```json
{
  "success": true,
  "data": {
    "keyId": "key_01ABC...",
    "apiKey": "vz_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "permissions": ["api_keys:read", "webhooks:write"],
    "createdAt": "2026-03-18T12:34:56Z",
    "expiresAt": "2026-12-31T23:59:59Z"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**Important Notes**

- `apiKey` raw value is returned at creation time only (frontend should treat it as one-time display/clipboard flow).
- `expiresAt` can return `null`.

---

## 2) List API Keys

**Endpoint**

`GET /api/v1/banking/api-keys`

**Auth**

- `Authorization: Bearer <api_key>`
- permission `api_keys:read`

**Query**

- none

**200 Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "keyId": "key_01ABC...",
        "keyName": "Frontend Server Key",
        "permissions": ["api_keys:read", "webhooks:write"],
        "createdAt": "2026-03-18T12:34:56Z",
        "expiresAt": "2026-12-31T23:59:59Z",
        "revokedAt": null,
        "rateLimit": 1200,
        "status": "active"
      },
      {
        "keyId": "key_01DEF...",
        "keyName": "Old Key",
        "permissions": ["*"],
        "createdAt": "2026-01-01T00:00:00Z",
        "expiresAt": null,
        "revokedAt": "2026-02-01T00:00:00Z",
        "rateLimit": null,
        "status": "revoked"
      }
    ]
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**Frontend Notes**

- `status` is computed by backend from `revokedAt`.
- `rateLimit` can be `null`.
- list is sorted by `createdAt DESC`.

---

## 3) Revoke API Key

**Endpoint**

`DELETE /api/v1/banking/api-keys/{keyId}`

**Auth**

- `Authorization: Bearer <api_key>`
- permission `api_keys:write`

**Path Params**

- `keyId` (string)

**Request Body**

- none

**200 Response**

```json
{
  "success": true,
  "data": {
    "keyId": "key_01ABC...",
    "revoked": true,
    "revokedAt": "2026-03-18T12:34:56Z"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**Behavior Detail**

- If `keyId` does not exist (or already revoked), backend still returns success payload above.
- There is no explicit 404 path for missing key in current implementation.

## Webhooks Endpoints

---

## 4) Register Webhook

**Endpoint**

`POST /api/v1/banking/webhooks/register`

**Auth**

- `Authorization: Bearer <api_key>`
- permission `webhooks:write`

**Request Body**

```json
{
  "webhookUrl": "https://example.com/verza/webhooks",
  "events": ["verification.completed", "api_key.created", "*"],
  "secret": "your-signing-secret",
  "active": true
}
```

**Field Rules**

- `webhookUrl`: required, valid URL (Pydantic `HttpUrl`)
- `events`: optional array of strings, default `[]`
- `secret`: required string, min 8, max 256
- `active`: optional boolean, default `true`

**200 Response**

```json
{
  "success": true,
  "data": {
    "webhookId": "wh_01ABC...",
    "status": "active",
    "createdAt": "2026-03-18T12:34:56Z"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

`status` is:

- `"active"` when `active=true`
- `"inactive"` when `active=false`

---

## 5) List Webhooks

**Endpoint**

`GET /api/v1/banking/webhooks`

**Auth**

- `Authorization: Bearer <api_key>`
- permission `webhooks:read`

**Query Params**

- `active` (optional boolean)

Examples:

- `/api/v1/banking/webhooks`
- `/api/v1/banking/webhooks?active=true`
- `/api/v1/banking/webhooks?active=false`

**200 Response**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "webhookId": "wh_01ABC...",
        "webhookUrl": "https://example.com/verza/webhooks",
        "events": ["verification.completed", "*"],
        "active": true,
        "createdAt": "2026-03-18T12:34:56Z"
      }
    ]
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**Frontend Notes**

- Deleted webhooks are excluded.
- list is sorted by `createdAt DESC`.

---

## 6) Delete Webhook

**Endpoint**

`DELETE /api/v1/banking/webhooks/{webhookId}`

**Auth**

- `Authorization: Bearer <api_key>`
- permission `webhooks:write`

**Path Params**

- `webhookId` (string)

**Request Body**

- none

**200 Response**

```json
{
  "success": true,
  "data": {
    "webhookId": "wh_01ABC...",
    "deleted": true,
    "deletedAt": "2026-03-18T12:34:56Z"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**Behavior Detail**

- If webhook does not exist/already deleted, endpoint still returns success payload.
- There is no explicit 404 in current implementation.

---

## 7) Test Webhook

**Endpoint**

`POST /api/v1/banking/webhooks/test`

**Auth**

- `Authorization: Bearer <api_key>`
- permission `webhooks:write`

**Request Body**

```json
{
  "webhookId": "wh_01ABC...",
  "webhookUrl": "https://example.com/verza/test-target",
  "eventType": "verification.completed",
  "payload": {
    "sample": true
  }
}
```

**Field Rules**

- `webhookId`: optional string
- `webhookUrl`: optional URL (`HttpUrl`)
- `eventType`: required string
- `payload`: optional object (currently accepted but not returned or sent by this endpoint)

**Resolution Logic**

1. If `webhookId` is provided, backend tries to resolve stored webhook URL.
2. If found but inactive -> returns status `inactive`.
3. If not found -> returns status `not_found`.
4. If `webhookUrl` is provided, it overrides `targetUrl`.
5. Final status:
   - `delivered` if a target URL exists
   - `invalid_target` if no target URL resolved

**200 Response (Delivered case)**

```json
{
  "success": true,
  "data": {
    "webhookId": "wh_01ABC...",
    "status": "delivered",
    "eventType": "verification.completed",
    "targetUrl": "https://example.com/verza/test-target",
    "sentAt": "2026-03-18T12:34:56Z"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**200 Response (Not found by webhookId)**

```json
{
  "success": true,
  "data": {
    "webhookId": "wh_missing",
    "status": "not_found"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**200 Response (Inactive webhook)**

```json
{
  "success": true,
  "data": {
    "webhookId": "wh_inactive",
    "status": "inactive"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

**200 Response (Invalid target)**

```json
{
  "success": true,
  "data": {
    "webhookId": null,
    "status": "invalid_target",
    "eventType": "verification.completed",
    "targetUrl": null,
    "sentAt": "2026-03-18T12:34:56Z"
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

## Outbound Webhook Delivery Contract (What Your Frontend/Backend Receiver Gets)

When events are emitted, backend writes delivery records and sends HTTP POST to registered webhook URLs.

A registered webhook receives:

- Method: `POST`
- Header: `Content-Type: application/json`
- Header: `X-Verza-Event: <event_type>`
- Header: `X-Verza-Delivery-Id: <delivery_id>`
- Header: `X-Verza-Event-Id: <event_id>`
- Header: `X-Verza-Signature: sha256=<hmac_hex>`

Signature generation:

- HMAC SHA-256
- key: webhook `secret`
- message: exact raw JSON string body

### Outbound Body Shape

```json
{
  "event": "webhook.registered",
  "eventId": "evt_01ABC...",
  "deliveryId": "dlv_01ABC...",
  "requestId": "req_01ABC...",
  "actor": "api_key:key_01ABC...",
  "targetType": "webhook",
  "targetId": "wh_01ABC...",
  "data": {
    "url": "https://example.com/verza/webhooks",
    "events": ["*"],
    "active": true
  },
  "timestamp": "2026-03-18T12:34:56Z"
}
```

## Frontend Mapping Cheatsheet

Use these enums directly in UI logic:

- API key status:
  - `active`
  - `revoked`
- Webhook status in list/register:
  - `active`
  - `inactive`
- Webhook test status:
  - `delivered`
  - `invalid_target`
  - `inactive`
  - `not_found`

Use these response fields as canonical IDs:

- API key primary id: `data.keyId`
- Webhook primary id: `data.webhookId`

Use these timestamps for UI sorting/display:

- `createdAt`, `revokedAt`, `deletedAt`, `sentAt`, plus envelope `timestamp`

