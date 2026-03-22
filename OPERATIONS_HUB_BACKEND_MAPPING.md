# Operations Hub & Verifications Backend Mapping Guide

## 1) Scope and Intent

This document provides implementation-ready API contracts for the newly introduced enterprise pages and endpoints:

- **New page:** `/enterprise/operations-hub`
- **New page (migrated tooling):** `/enterprise/verifications`
- **New endpoint families:** bulk onboarding, risk sandbox, audit explorer, webhook manager, license usage & plan control

Use this as the source of truth to map controllers, services, validation, persistence, and error handling in a production backend.

---

## 2) Base API Contract

- **Base path:** `/api/v1/banking`
- **Auth scheme:** `Authorization: Bearer <JWT>`
- **Content type:** `application/json`
- **Date-time format:** ISO-8601 UTC (example: `2026-03-18T10:04:00Z`)
- **Error envelope (standardized):**

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Missing required scope risk:write"
  }
}
```

### Recommended common backend middleware

1. JWT authentication
2. Scope authorization
3. Request validation (schema + business rules)
4. Request-id correlation (`x-request-id`)
5. Structured audit logging
6. Rate-limiting on write-heavy endpoints

---

## 3) Page-to-Endpoint Mapping

## 3.1 Operations Hub (`/enterprise/operations-hub`)

### Bulk KYC module
- `POST /onboarding/bulk/validate`
- `POST /onboarding/bulk/import`
- `GET /onboarding/bulk/errors/{validationId}` *(frontend service expects this for downloadable error CSV URL)*

### Risk Sandbox module
- `POST /risk/sandbox/simulate`
- `POST /risk/sandbox/report`

### Audit Explorer module
- `GET /audit/logs/search`
- `POST /audit/logs/export-signed`

### Webhook Manager module
- `POST /webhooks/{webhookId}/test`
- `POST /webhooks/{webhookId}/rotate-secret`
- `GET /webhooks/retries`
- `GET /webhooks` *(used by UI refresh/register flow)*
- `POST /webhooks/register` *(existing endpoint reused by new page)*

### Usage & SLA module
- `GET /license/usage`
- `POST /license/plan/change`

## 3.2 Verifications (`/enterprise/verifications`, migrated existing APIs)

These remain existing contracts and were moved to a dedicated page:
- `POST /kyc/individual/verify`
- `POST /kyc/individual/basic`
- `POST /document/verify`
- `POST /document/extract`
- `POST /biometric/face-match`
- `POST /biometric/liveness`
- `POST /screening/sanctions/check`
- `POST /screening/pep/check`
- `POST /aml/risk-score`

---

## 4) Detailed API Contracts (New Endpoints)

## 4.1 Bulk Onboarding

### 4.1.1 Validate upload
- **Method/Path:** `POST /onboarding/bulk/validate`
- **Scope:** `kyc:write`
- **Purpose:** Validate up to 10,000 rows before import

**Request body**

```json
{
  "rows": [
    {
      "firstName": "Ada",
      "lastName": "Lovelace",
      "country": "GB",
      "idDocumentType": "passport",
      "idDocumentNumber": "P12345678"
    }
  ]
}
```

**Validation rules**
- `rows`: required, `1..10000`
- per row required: `firstName`, `lastName`, `country`, `idDocumentType`, `idDocumentNumber`
- `country`: `^[A-Z]{2}$`
- `idDocumentType`: `passport | drivers_license | national_id`
- `idDocumentNumber`: length `4..64`

**200 response**

```json
{
  "validationId": "val_01JZ5E6W80",
  "totalRows": 500,
  "validRows": 482,
  "invalidRows": 18,
  "progress": 100,
  "issues": [
    {
      "row": 14,
      "field": "country",
      "message": "Invalid ISO country code",
      "severity": "error"
    }
  ]
}
```

**Error codes**
- `400 INVALID_REQUEST | VALIDATION_FAILED`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `500 INTERNAL_ERROR`

### 4.1.2 Import validated rows
- **Method/Path:** `POST /onboarding/bulk/import`
- **Scope:** `kyc:write`
- **Purpose:** Queue validated rows for processing

**Request body**

```json
{
  "rows": [
    {
      "firstName": "Ada",
      "lastName": "Lovelace",
      "country": "GB",
      "idDocumentType": "passport",
      "idDocumentNumber": "P12345678"
    }
  ]
}
```

**202 response**

```json
{
  "importJobId": "imp_01JZ5E78D7",
  "acceptedRows": 482,
  "rejectedRows": 18,
  "status": "queued"
}
```

- `status`: `queued | processing | completed | failed`

### 4.1.3 Download validation error report
- **Method/Path:** `GET /onboarding/bulk/errors/{validationId}`
- **Scope:** `kyc:write` *(recommended)*
- **Purpose:** Return downloadable URL for CSV error report

**Path params**
- `validationId` (required string)

**200 response (recommended contract)**

```json
{
  "validationId": "val_01JZ5E6W80",
  "downloadUrl": "https://cdn.example.com/bulk-errors/val_01JZ5E6W80.csv",
  "expiresAt": "2026-03-18T12:00:00Z"
}
```

---

## 4.2 Risk Sandbox

### 4.2.1 Run simulation
- **Method/Path:** `POST /risk/sandbox/simulate`
- **Scope:** `risk:write`

**Request body**

```json
{
  "customerProfile": {
    "customerType": "retail",
    "country": "US",
    "transactionAmount": 2200,
    "sanctionsHits": 1,
    "priorAlerts": 2
  },
  "weights": {
    "identity": 20,
    "sanctions": 30,
    "transaction": 20,
    "geography": 15,
    "device": 15
  }
}
```

**200 response**

```json
{
  "score": 62,
  "riskLevel": "medium",
  "factors": [
    { "factor": "sanctions_hits", "contribution": 30 },
    { "factor": "transaction_amount", "contribution": 18 }
  ],
  "recommendation": "manual_review"
}
```

**Error codes**
- `400 INVALID_REQUEST`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `429 RATE_LIMITED` *(if enabled)*
- `500 INTERNAL_ERROR`

### 4.2.2 Generate PDF report metadata
- **Method/Path:** `POST /risk/sandbox/report`
- **Scope:** `risk:write`

**Request body**

```json
{
  "simulation": {
    "score": 62,
    "riskLevel": "medium",
    "factors": [{ "factor": "sanctions_hits", "contribution": 30 }],
    "recommendation": "manual_review"
  },
  "customerProfile": {
    "customerType": "retail",
    "country": "US",
    "transactionAmount": 2200,
    "sanctionsHits": 1,
    "priorAlerts": 2
  },
  "weights": {
    "identity": 20,
    "sanctions": 30,
    "transaction": 20,
    "geography": 15,
    "device": 15
  }
}
```

**201 response**

```json
{
  "reportId": "rpt_01JZ5E9Q2A",
  "generatedAt": "2026-03-18T10:00:00Z",
  "downloadUrl": "https://cdn.example.com/reports/rpt_01JZ5E9Q2A.pdf"
}
```

---

## 4.3 Audit Explorer

### 4.3.1 Search logs
- **Method/Path:** `GET /audit/logs/search`
- **Scope:** `audit:read`

**Query params**
- `from` (date-time, optional)
- `to` (date-time, optional)
- `entity` (string, optional)
- `eventType` (string, optional)

**200 response**

```json
{
  "items": [
    {
      "id": "log_01JZ5EB1",
      "action": "webhook.retry",
      "actorId": "svc_operations",
      "resourceId": "wh_0021",
      "timestamp": "2026-03-18T10:01:00Z",
      "details": { "attempt": 3 },
      "status": "success"
    }
  ]
}
```

### 4.3.2 Export signed logs
- **Method/Path:** `POST /audit/logs/export-signed`
- **Scope:** `audit:read`

**Request body**

```json
{
  "from": "2026-03-01T00:00:00Z",
  "to": "2026-03-18T23:59:59Z",
  "entity": "webhook",
  "eventType": "webhook.retry"
}
```

**200 response**

```json
{
  "exportId": "aexp_01JZ5EC3",
  "signature": "ed25519:d64ef3f1b34cc132eaaab7f4da139f72",
  "downloadUrl": "https://cdn.example.com/audit/aexp_01JZ5EC3.json"
}
```

**Error codes**
- `400 INVALID_FILTERS`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `500 INTERNAL_ERROR`

---

## 4.4 Webhook Manager

### 4.4.1 Trigger test delivery
- **Method/Path:** `POST /webhooks/{webhookId}/test`
- **Scope:** `webhooks:write`

**Path params**
- `webhookId` (required)

**200 response**

```json
{
  "requestId": "whreq_01JZ5EF4",
  "delivered": true,
  "statusCode": 200,
  "latencyMs": 124
}
```

### 4.4.2 Rotate secret
- **Method/Path:** `POST /webhooks/{webhookId}/rotate-secret`
- **Scope:** `webhooks:write`

**200 response**

```json
{
  "webhookId": "wh_0021",
  "previousSecretLast4": "c5d1",
  "newSecret": "whsec_6f8f7b75bbf0df7b",
  "rotatedAt": "2026-03-18T10:04:00Z"
}
```

### 4.4.3 Retry queue
- **Method/Path:** `GET /webhooks/retries`
- **Scope:** `webhooks:read`

**200 response**

```json
{
  "items": [
    {
      "id": "retry_001",
      "webhookId": "wh_0021",
      "eventType": "verification.completed",
      "nextRetryAt": "2026-03-18T10:06:00Z",
      "attempt": 2
    }
  ]
}
```

**Error codes**
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `404 WEBHOOK_NOT_FOUND` *(for per-webhook operations)*
- `500 INTERNAL_ERROR`

---

## 4.5 License Usage & SLA

### 4.5.1 Read usage metrics
- **Method/Path:** `GET /license/usage`
- **Scope:** `billing:read`

**200 response**

```json
{
  "planName": "Enterprise",
  "currentPeriodStart": "2026-03-01T00:00:00Z",
  "currentPeriodEnd": "2026-03-31T23:59:59Z",
  "monthlyQuota": 10000,
  "usedQuota": 4200,
  "slaUptime": 99.95,
  "anomalyAlerts": [
    {
      "id": "al_001",
      "message": "Volume spike above baseline in EU region",
      "severity": "medium"
    }
  ]
}
```

### 4.5.2 Change plan
- **Method/Path:** `POST /license/plan/change`
- **Scope:** `billing:write`

**Request body**

```json
{
  "targetPlan": "growth"
}
```

**202 response**

```json
{
  "status": "accepted"
}
```

**Error codes**
- `400 INVALID_PLAN`
- `401 UNAUTHORIZED`
- `403 FORBIDDEN`
- `409 PLAN_CHANGE_CONFLICT`
- `500 INTERNAL_ERROR`

---

## 5) Backend Layer Mapping (Controller/Service/DB)

## 5.1 Current implementation touchpoints

- **Controller:** `backend/controllers/operationsHubController.js`
- **Service:** `backend/services/operationsHubService.js`
- **Migration:** `backend/migrations/20260318_operations_hub.sql`

## 5.2 Table mapping

1. `kyc_bulk_upload_jobs`
   - maps to `/onboarding/bulk/import`
   - columns: `id`, `status`, `accepted_rows`, `rejected_rows`, `created_at`

2. `kyc_bulk_validation_issues`
   - maps to `/onboarding/bulk/validate` + `/onboarding/bulk/errors/{validationId}`
   - columns: `job_id`, `row_number`, `field_name`, `message`, `severity`

3. `webhook_retry_queue`
   - maps to `/webhooks/retries`
   - columns: `webhook_id`, `event_type`, `attempt`, `next_retry_at`

4. `license_usage_snapshots`
   - maps to `/license/usage`
   - columns: `plan_name`, `monthly_quota`, `used_quota`, `sla_uptime`, `captured_at`

---

## 6) Professional Backend Implementation Checklist

1. **Validation**
   - Enforce strict schema validation on every request body/query/path param.
   - Reject malformed ISO dates and non-2-letter countries.

2. **Authorization**
   - Enforce exact scopes:
     - `kyc:write`, `risk:write`, `audit:read`, `webhooks:write`, `webhooks:read`, `billing:read`, `billing:write`.

3. **Idempotency**
   - Require `Idempotency-Key` for:
     - `/onboarding/bulk/import`
     - `/risk/sandbox/report`
     - `/webhooks/{webhookId}/rotate-secret`
     - `/license/plan/change`

4. **Auditing**
   - Log actor, route, payload hash, response code, and decision.
   - Sign exported audit bundles with a server-side key.

5. **Observability**
   - Emit structured logs with `requestId`.
   - Track p95 latency and failure rate per endpoint.

6. **Security**
   - Never return full historic webhook secrets after rotation.
   - Use encryption at rest for generated reports and export artifacts.

7. **Async processing**
   - Process bulk imports and report generation through job queues.
   - Persist job states for polling/retry.

---

## 7) cURL Examples for Backend Contract Testing

### Validate bulk rows

```bash
curl -X POST "https://<host>/api/v1/banking/onboarding/bulk/validate" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"rows":[{"firstName":"Ada","lastName":"Lovelace","country":"GB","idDocumentType":"passport","idDocumentNumber":"P12345678"}]}'
```

### Run risk simulation

```bash
curl -X POST "https://<host>/api/v1/banking/risk/sandbox/simulate" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"customerProfile":{"customerType":"retail","country":"US","transactionAmount":2200,"sanctionsHits":1,"priorAlerts":2},"weights":{"identity":20,"sanctions":30,"transaction":20,"geography":15,"device":15}}'
```

### Rotate webhook secret

```bash
curl -X POST "https://<host>/api/v1/banking/webhooks/wh_0021/rotate-secret" \
  -H "Authorization: Bearer <jwt>"
```

### Change plan

```bash
curl -X POST "https://<host>/api/v1/banking/license/plan/change" \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"targetPlan":"growth"}'
```

---

## 8) Source References

- OpenAPI bulk onboarding: `openapi/operations-hub.bulk-kyc.yaml`
- OpenAPI risk sandbox: `openapi/operations-hub.risk-sandbox.yaml`
- OpenAPI audit explorer: `openapi/operations-hub.audit-explorer.yaml`
- OpenAPI webhook manager: `openapi/operations-hub.webhook-manager.yaml`
- OpenAPI license/SLA: `openapi/operations-hub.license-sla.yaml`
- Frontend API usage: `src/services/bankingService.ts`
- Operations Hub UI flow: `src/features/enterprise/pages/VerificationTools.tsx`
- Verifications UI flow: `src/features/enterprise/pages/Verifications.tsx`
- Backend scaffolding: `backend/controllers/operationsHubController.js`, `backend/services/operationsHubService.js`, `backend/migrations/20260318_operations_hub.sql`
