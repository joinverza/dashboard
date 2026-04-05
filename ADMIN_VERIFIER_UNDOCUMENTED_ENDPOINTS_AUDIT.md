# Admin & Verifier Dashboard API Documentation Gap Audit

## 1) Scope and Approach
- **Frontend scope audited:** all routes under `/admin/*` and `/verifier/*` from `src/App.tsx`.
- **Source documentation baseline:** `adminveriferapi.md`.
- **Gap definition:** page feature is considered undocumented when no endpoint contract exists in `adminveriferapi.md` for the required backend behavior, or only partial behavior is documented.
- **Frontend implementation signal:** usages in `src/features/admin/pages/*`, `src/features/verifier/pages/*`, and `src/services/bankingService.ts`.

## 2) API Coverage Summary

### Documented and In Use
- `GET /api/v1/banking/admin/system-health`
- `GET /api/v1/banking/admin/alerts`
- `GET /api/v1/banking/admin/users`
- `GET /api/v1/banking/admin/verifiers`
- `GET /api/v1/banking/admin/verifiers/{id}`
- `GET /api/v1/banking/license/usage`
- `POST /api/v1/banking/license/plan/change`
- `GET /api/v1/banking/api/settings`
- `PATCH /api/v1/banking/api/settings`
- `GET /api/v1/banking/settings/company`
- `PATCH /api/v1/banking/settings/company`
- `POST /api/v1/banking/reports/create`
- `GET /api/v1/banking/verifier/profile`
- `PATCH /api/v1/banking/verifier/profile`
- Shared endpoints (`/user/verifications`, `/notifications`, `/marketplace/verifiers`, `/user/wallet`)

### Undocumented / Partially Documented Features by Route

#### Admin
- `/admin/verifications`, `/admin/verifications/:id`: verification queue and moderation workflow contracts are not documented (`/requests*` paths used in frontend service).
- `/admin/analytics`: analytics trend contracts are incomplete (`/analytics/verification-stats`, risk/fraud trend families).
- `/admin/audit`: list/search log contracts are incomplete (`/audit/logs`, `/audit/logs/search`).
- `/admin/compliance`: report listing contract is missing (`GET /reports`).
- `/admin/disputes`, `/admin/disputes/:id`: no dispute lifecycle endpoints documented.
- `/admin/governance`, `/admin/governance/create`, `/admin/governance/:id`: no proposal/governance endpoints documented.
- `/admin/credentials`, `/admin/credentials/:id`: credential registry/admin moderation endpoints missing.
- `/admin/financial`, `/admin/financial/revenue`: finance/revenue analytics endpoints missing.
- `/admin/logs`: application/system error log APIs missing.
- `/admin/content`: moderation queue/action endpoints missing.
- `/admin/enterprises`, `/admin/enterprises/:id`: enterprise management list/detail/update contracts missing.

#### Verifier
- `/verifier/jobs`, `/verifier/jobs/:id`, `/verifier/active`, `/verifier/review/:id`, `/verifier/completed`: verifier work queue endpoints are only indirectly represented.
- `/verifier/issue/:id`: credential issuance endpoint exists in code but is not fully documented for request/response and permission model.
- `/verifier/earnings`, `/verifier/withdraw`: payout and withdrawal endpoints missing.
- `/verifier/reputation`, `/verifier/reviews`: reputation and review APIs missing.
- `/verifier/staking`: staking portfolio/action APIs missing.
- `/verifier/notifications`: read/ack/mark-all notification lifecycle contracts missing.
- `/verifier/help`: support ticket/knowledge-base APIs missing.

## 3) Undocumented Endpoint Specifications (Proposed)

The following contracts are proposed to align implemented frontend behaviors with RESTful best practices.

---

### 3.1 Verification Queue

#### `GET /api/v1/banking/requests`
- **Purpose:** list verification jobs for admin and verifier work queues.
- **Auth:** Bearer JWT or API key.
- **Permission:** `verification:read` or `admin:read`.
- **Query params:** `status`, `type`, `page`, `limit`, `assigneeId`, `sort`.
- **Success 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "verificationId": "ver_123",
        "type": "kyc_individual",
        "status": "pending",
        "subject": "Jane Doe",
        "createdAt": "2026-04-05T12:00:00Z",
        "updatedAt": "2026-04-05T12:05:00Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  },
  "timestamp": "2026-04-05T12:05:00Z"
}
```
- **Errors:** `401 token_invalid`, `403 insufficient_permissions`, `422 validation_error`.
- **Business rules:** default sort `updatedAt desc`; max `limit=100`.

#### `POST /api/v1/banking/requests/{verificationId}/review`
- **Purpose:** approve/reject/manual-review transition.
- **Auth:** Bearer JWT/API key.
- **Permission:** `verification:review` or `admin:write`.
- **Request body:**
```json
{
  "status": "verified",
  "notes": "Document integrity checks passed."
}
```
- **Success 200:** updated verification resource.
- **Errors:** `404 not_found`, `409 invalid_transition`, `422 validation_error`.
- **Business rules:** state transitions must be monotonic and auditable; `notes` required for rejection.

---

### 3.2 Verification Detail

#### `GET /api/v1/banking/kyc/individual/{verificationId}`
- **Purpose:** fetch full verification details for review screens.
- **Auth:** Bearer JWT/API key.
- **Permission:** `verification:read` or `admin:read`.
- **Success 200:**
```json
{
  "success": true,
  "data": {
    "verificationId": "ver_123",
    "status": "in_progress",
    "overallResult": "manual_review_required",
    "verificationType": "kyc_individual",
    "result": {
      "firstName": "Jane",
      "lastName": "Doe",
      "dob": "1993-08-20",
      "documentType": "passport",
      "idDocumentNumber": "P1234567",
      "aiScore": 94
    },
    "createdAt": "2026-04-05T11:00:00Z",
    "updatedAt": "2026-04-05T11:20:00Z"
  },
  "timestamp": "2026-04-05T11:20:00Z"
}
```
- **Errors:** `404 not_found`, `403 insufficient_permissions`.
- **Business rules:** PII fields may be masked based on role and jurisdiction.

---

### 3.3 Analytics

#### `GET /api/v1/banking/analytics/verification-stats`
- **Purpose:** KPI cards and trend charts.
- **Auth:** Bearer JWT/API key.
- **Permission:** `admin:read` or `verification:read`.
- **Query params:** `startDate`, `endDate`, `groupBy=day|week|month`.
- **Success 200:** totals, success ratios, `dailyBreakdown[]`.
- **Errors:** `422 validation_error`.
- **Business rules:** date window max 365 days.

#### `GET /api/v1/banking/analytics/fraud-trends`
- **Purpose:** fraud trajectory charting.
- **Permission:** `admin:read`.
- **Query params:** `range`.
- **Success 200:** `{ items: [{ period, count, severity }] }`.

#### `GET /api/v1/banking/analytics/risk-distribution`
- **Purpose:** risk bucket distribution.
- **Permission:** `admin:read`.
- **Success 200:** `{ items: [{ bucket, count, percentage }] }`.

#### `GET /api/v1/banking/analytics/processing-times`
- **Purpose:** latency/processing performance.
- **Permission:** `admin:read` or `diagnostics:read`.
- **Success 200:** `{ items: [{ period, averageSeconds, p95Seconds }] }`.

---

### 3.4 Audit and Reports

#### `GET /api/v1/banking/audit/logs`
- **Purpose:** list audit events.
- **Permission:** `audit:read`.
- **Query params:** `page`, `limit`, `actorId`, `action`, `from`, `to`.
- **Success 200:** paginated audit records with immutable timestamps and request IDs.

#### `GET /api/v1/banking/audit/logs/search`
- **Purpose:** filtered audit explorer.
- **Permission:** `audit:read`.
- **Query params:** `from`, `to`, `entity`, `eventType`.
- **Business rules:** index-backed filters required; reject unbounded full-text scans.

#### `GET /api/v1/banking/reports`
- **Purpose:** list generated compliance/audit reports.
- **Permission:** `reports:read` (recommended) or scoped `reports:write`.
- **Success 200:** report summaries with status and download URLs when ready.
- **Business rules:** signed URLs should expire (e.g., 5-15 min TTL).

---

### 3.5 Credential Issuance

#### `POST /api/v1/banking/verifier/issue-credential`
- **Purpose:** issue verifiable credential after successful review.
- **Permission:** `did:write` (or introduce `credential:issue`).
- **Request body:**
```json
{
  "verificationId": "ver_123",
  "recipientDid": "did:example:abc123",
  "credentialType": "KYCVerifiedCredential",
  "data": {
    "fullName": "Jane Doe",
    "verificationLevel": "enhanced"
  },
  "notes": "Issued after manual verification"
}
```
- **Success 201:**
```json
{
  "success": true,
  "data": {
    "credentialId": "cred_456",
    "transactionHash": "0xabc...",
    "issuedAt": "2026-04-05T12:30:00Z",
    "status": "issued"
  },
  "timestamp": "2026-04-05T12:30:00Z"
}
```
- **Errors:** `403 insufficient_permissions`, `409 already_issued`, `422 validation_error`.
- **Business rules:** idempotent on `(verificationId, recipientDid, credentialType)`.

---

### 3.6 Disputes (Admin)

#### `GET /api/v1/banking/disputes`
- **Purpose:** disputes table in admin dashboard.
- **Permission:** `admin:read`.
- **Query params:** `status`, `page`, `limit`, `priority`.

#### `GET /api/v1/banking/disputes/{disputeId}`
- **Purpose:** dispute detail timeline.
- **Permission:** `admin:read`.

#### `POST /api/v1/banking/disputes/{disputeId}/resolve`
- **Purpose:** close dispute with outcome.
- **Permission:** `admin:write`.
- **Request:** `{ "resolution": "approve_refund|reject|partial", "notes": "..." }`.
- **Business rules:** resolution writes immutable audit entry.

---

### 3.7 Governance (Admin)

#### `GET /api/v1/banking/governance/proposals`
- **Permission:** `admin:read`.

#### `POST /api/v1/banking/governance/proposals`
- **Permission:** `admin:write`.
- **Request:** `{ "title": "...", "summary": "...", "changes": [...], "votingEndsAt": "ISO-8601" }`.

#### `GET /api/v1/banking/governance/proposals/{proposalId}`
- **Permission:** `admin:read`.

---

### 3.8 Verifier Earnings and Withdrawals

#### `GET /api/v1/banking/verifier/earnings`
- **Purpose:** earnings dashboards.
- **Permission:** `verification:read`.
- **Response:** totals, pending payouts, period breakdown.

#### `POST /api/v1/banking/verifier/withdrawals`
- **Purpose:** create withdrawal request.
- **Permission:** `verification:write`.
- **Request:** `{ "amount": 250.50, "currency": "USD", "destinationId": "bank_123" }`.
- **Errors:** `409 insufficient_balance`, `422 below_minimum`.

---

### 3.9 Reputation and Reviews

#### `GET /api/v1/banking/verifier/reputation`
- **Permission:** `verification:read`.
- **Response:** current score, trend, components.

#### `GET /api/v1/banking/verifier/reviews`
- **Permission:** `verification:read`.
- **Query params:** `page`, `limit`, `rating`.
- **Response:** paginated feedback items and aggregate rating.

---

### 3.10 Notifications Lifecycle

#### `PATCH /api/v1/banking/notifications/{notificationId}/read`
- **Purpose:** mark one notification as read.
- **Permission:** `verification:read` or `admin:read`.

#### `POST /api/v1/banking/notifications/mark-all-read`
- **Purpose:** bulk read acknowledgement.
- **Permission:** same as above.

---

## 4) Standard Error Model (Recommended for All New Endpoints)
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Human-readable summary",
    "details": [
      { "field": "amount", "message": "must be greater than 0" }
    ]
  },
  "requestId": "req_123"
}
```

## 5) Authentication and Authorization Requirements
- Use `Authorization: Bearer <jwt-or-api-key>`.
- Enforce permission checks per endpoint.
- Return `403` for permission failures, `401` for invalid/expired credentials.
- Capture `requestId` and actor in audit logs for all state-changing endpoints.

## 6) Immediate Backlog Priorities
1. Publish OpenAPI contracts for `requests`, `analytics`, `audit logs`, and `reports list` first (already used in production UI paths).
2. Publish `verifier/issue-credential` with explicit permission model and idempotency rules.
3. Add missing admin operational contracts: disputes, governance, financial, moderation.
4. Add verifier economic contracts: earnings, withdrawals, reputation, reviews.
