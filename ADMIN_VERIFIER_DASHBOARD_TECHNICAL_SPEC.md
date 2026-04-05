# Admin & Verifier Dashboard Backend Technical Specification

## 1. Scope

This specification defines backend requirements to support fully functional **Admin Dashboard** and **Verifier Dashboard** systems.

It covers:
- REST API contracts
- Authentication and authorization
- Database schema and relationships
- Realtime synchronization
- Pagination/filtering/search
- Audit logging and compliance
- Analytics and reporting
- External integrations
- Performance and security controls

Primary API namespace:
- `Auth`: role-specific auth roots (`/admin/auth`, `/verifier/auth`, `/enterprise/auth`, `/user/auth`)
- `Banking`: `/api/v1/banking/*`

## 2. Global API Standards

### 2.1 HTTP and Headers
- Content type: `application/json`
- Auth: `Authorization: Bearer <access_token_or_api_key>`
- Correlation: `X-Request-Id` (required in production)
- Idempotency: `Idempotency-Key` required for non-idempotent writes (`POST/PATCH/DELETE` creating side effects)

### 2.2 Envelope Contract

Success:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-04-05T10:00:00Z",
  "requestId": "req_abc123"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Invalid request",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "timestamp": "2026-04-05T10:00:00Z",
  "requestId": "req_abc123"
}
```

### 2.3 Error Handling Standard
- `400` validation/domain rule error
- `401` unauthenticated/token invalid
- `403` authenticated but unauthorized (RBAC/policy)
- `404` resource not found
- `409` conflict/version mismatch/duplicate
- `422` semantic validation failure (optional if used by framework)
- `429` rate limited
- `500` internal server error
- `503` dependency unavailable

Error codes (minimum set):
- `validation_error`, `invalid_credentials`, `mfa_failed`, `token_invalid`, `role_mismatch`
- `account_disabled`, `rate_limited`, `permission_denied`, `resource_not_found`
- `duplicate_resource`, `state_transition_invalid`, `optimistic_lock_failed`, `integration_error`

## 3. Authentication & Authorization

## 3.1 Auth Flows
- Signup returns one-time `generatedAuthKey`
- Login requires `email + password + role + authKey`
- MFA challenge/verify supported (`totp`, optional `webauthn`, recovery code)
- Access token TTL: 15 minutes
- Refresh token TTL: 30 days (rotating, reuse-detection enabled)

### 3.2 Required Auth Endpoints
- `POST /{role}/auth/signup`
- `POST /{role}/auth/login`
- `POST /auth/mfa/verify`
- `POST /auth/mfa/recovery-code/verify`
- `GET /auth/mfa/enroll`
- `POST /auth/mfa/enroll/verify`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### 3.3 RBAC Model
Roles:
- `admin`
- `verifier`
- `enterprise`
- `manager`
- `user`

Permissions (admin + verifier critical):
- `users:read`, `users:write`, `users:disable`
- `verifiers:read`, `verifiers:write`, `verifiers:approve`
- `requests:read`, `requests:write`, `requests:revoke`
- `credentials:read`, `credentials:issue`, `credentials:revoke`, `credentials:verify`
- `analytics:read`, `reports:read`, `reports:write`
- `audit:read`, `audit:export`
- `integrations:read`, `integrations:write`
- `zk:read`, `zk:write`

Authorization enforcement:
- Endpoint-level permission check + row-level tenancy restrictions
- Admin has cross-tenant visibility (configurable)
- Verifier restricted to assigned tenant/org scope unless elevated

## 4. Core Data Models (API DTOs)

### 4.1 User
| Field | Type | Required | Validation |
|---|---|---|---|
| `id` | `string` (ULID/UUID) | Yes | immutable |
| `email` | `string` | Yes | RFC email, lowercase, unique |
| `fullName` | `string` | Yes | 2..120 chars |
| `role` | enum | Yes | allowed role enum |
| `status` | enum | Yes | `active|disabled|pending|locked` |
| `mfaEnabled` | `boolean` | Yes | default false |
| `createdAt` | ISO datetime | Yes | server-generated |
| `updatedAt` | ISO datetime | Yes | server-generated |

### 4.2 VerificationRequest
| Field | Type | Required | Validation |
|---|---|---|---|
| `verificationId` | `string` | Yes | immutable |
| `type` | enum | Yes | `kyc_individual|kyb_business|document|pep|sanctions|aml` |
| `subjectId` | `string` | Yes | existing customer/user |
| `status` | enum | Yes | `pending|in_progress|review_needed|verified|rejected|revoked` |
| `riskScore` | enum/int | No | `low|medium|high` or 0..100 |
| `assignedVerifierId` | `string|null` | No | foreign key |
| `createdAt` | datetime | Yes | server-generated |
| `updatedAt` | datetime | Yes | server-generated |
| `revokedAt` | datetime/null | No | set on revoke |
| `revokeReason` | string/null | No | 3..500 chars |

### 4.3 CredentialRecord
| Field | Type | Required | Validation |
|---|---|---|---|
| `credentialId` | `string` | Yes | immutable |
| `verificationId` | `string` | Yes | FK verification |
| `holderDid` | `string` | Yes | DID format |
| `issuerDid` | `string` | Yes | DID format |
| `status` | enum | Yes | `issued|revoked|expired` |
| `issuedAt` | datetime | Yes | server-generated |
| `revokedAt` | datetime/null | No | set on revoke |
| `proofHash` | `string` | No | hex/base58 digest |

### 4.4 AuditEvent
| Field | Type | Required | Validation |
|---|---|---|---|
| `eventId` | `string` | Yes | immutable |
| `eventType` | `string` | Yes | namespaced (`auth.login.success`) |
| `actorId` | `string|null` | No | FK user |
| `actorRole` | enum/null | No | role enum |
| `resourceType` | `string` | Yes | `user|verification|credential|report` |
| `resourceId` | `string` | Yes | target id |
| `action` | `string` | Yes | create/update/delete/revoke/... |
| `outcome` | enum | Yes | `success|failure` |
| `requestId` | `string` | Yes | trace id |
| `ipAddress` | `string` | No | IPv4/IPv6 |
| `userAgent` | `string` | No | <=1024 |
| `metadata` | `jsonb` | No | structured payload |
| `createdAt` | datetime | Yes | server-generated |

## 5. Database Schema (PostgreSQL)

## 5.1 Tables

### `users`
- `id uuid pk`
- `email citext unique not null`
- `password_hash text not null`
- `auth_key_hash text not null`
- `full_name varchar(120) not null`
- `role varchar(32) not null`
- `status varchar(32) not null default 'pending'`
- `mfa_enabled boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `version int not null default 1`

Indexes:
- `ux_users_email`
- `ix_users_role_status`
- `ix_users_created_at`

### `user_permissions`
- `user_id uuid fk users(id)`
- `permission varchar(64) not null`
- `granted_by uuid fk users(id)`
- `granted_at timestamptz not null`
- PK: `(user_id, permission)`

### `verification_requests`
- `id uuid pk`
- `tenant_id uuid not null`
- `subject_id uuid not null`
- `type varchar(32) not null`
- `status varchar(32) not null`
- `risk_score smallint null`
- `assigned_verifier_id uuid null fk users(id)`
- `payload jsonb not null`
- `result jsonb null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `revoked_at timestamptz null`
- `revoke_reason text null`
- `version int not null default 1`

Indexes:
- `ix_vr_tenant_status_created_at (tenant_id, status, created_at desc)`
- `ix_vr_assigned_verifier_status (assigned_verifier_id, status)`
- `ix_vr_type_created_at (type, created_at desc)`
- GIN `ix_vr_payload_gin` on `payload`

### `verification_documents`
- `id uuid pk`
- `verification_id uuid fk verification_requests(id)`
- `document_type varchar(32) not null`
- `storage_provider varchar(32) not null`
- `storage_key text not null`
- `checksum_sha256 char(64) not null`
- `mime_type varchar(128) not null`
- `size_bytes bigint not null`
- `uploaded_by uuid fk users(id)`
- `uploaded_at timestamptz not null`

Indexes:
- `ix_docs_verification_id`
- `ux_docs_checksum` (optional global dedupe)

### `credentials`
- `id uuid pk`
- `verification_id uuid fk verification_requests(id)`
- `holder_did text not null`
- `issuer_did text not null`
- `vc_json jsonb not null`
- `status varchar(32) not null`
- `issued_at timestamptz not null`
- `revoked_at timestamptz null`
- `proof_hash text null`

Indexes:
- `ix_credentials_verification`
- `ix_credentials_holder_did`
- `ix_credentials_status`

### `zk_proofs`
- `id uuid pk`
- `verification_id uuid fk verification_requests(id)`
- `circuit_id varchar(64) not null`
- `proof_blob bytea/text not null`
- `public_signals jsonb not null`
- `proof_hash text not null`
- `verification_status varchar(32) not null`
- `verified_at timestamptz null`
- `created_at timestamptz not null`

Indexes:
- `ux_zk_proof_hash`
- `ix_zk_verification_id`
- `ix_zk_status_created_at`

### `reports`
- `id uuid pk`
- `tenant_id uuid not null`
- `report_type varchar(32) not null`
- `status varchar(32) not null`
- `filters jsonb not null`
- `file_url text null`
- `requested_by uuid fk users(id)`
- `created_at timestamptz not null`
- `completed_at timestamptz null`

Indexes:
- `ix_reports_tenant_type_created_at`
- `ix_reports_status`

### `audit_events`
- `id uuid pk`
- `event_type varchar(96) not null`
- `actor_id uuid null`
- `actor_role varchar(32) null`
- `resource_type varchar(64) not null`
- `resource_id text not null`
- `action varchar(64) not null`
- `outcome varchar(16) not null`
- `request_id varchar(64) not null`
- `ip inet null`
- `user_agent text null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null`

Indexes:
- `ix_audit_created_at_desc`
- `ix_audit_actor_created_at`
- `ix_audit_resource_created_at`
- `ix_audit_event_type`
- GIN `ix_audit_metadata_gin`

## 5.2 Relationship Summary
- `users` 1..N `verification_requests` (`assigned_verifier_id`)
- `verification_requests` 1..N `verification_documents`
- `verification_requests` 1..N `credentials`
- `verification_requests` 1..N `zk_proofs`
- `users` 1..N `reports` (`requested_by`)
- all critical mutations -> `audit_events`

## 6. REST API Specification (Required)

## 6.1 User Management (Admin)
- `GET /api/v1/banking/admin/users`
  - Query: `page`, `limit`, `search`, `role`, `status`, `sortBy`, `sortDir`
- `GET /api/v1/banking/admin/users/{userId}`
- `POST /api/v1/banking/admin/users`
- `PATCH /api/v1/banking/admin/users/{userId}`
- `POST /api/v1/banking/admin/users/{userId}/disable`
- `POST /api/v1/banking/admin/users/{userId}/enable`
- `POST /api/v1/banking/admin/users/{userId}/permissions`
- `DELETE /api/v1/banking/admin/users/{userId}/permissions/{permission}`

Validation:
- email unique, normalized
- role transition policies enforced
- permission grants must map to allowed permission catalog

## 6.2 Verifier Management (Admin)
- `GET /api/v1/banking/admin/verifiers`
- `GET /api/v1/banking/admin/verifiers/{verifierId}`
- `POST /api/v1/banking/admin/verifiers/{verifierId}/approve`
- `POST /api/v1/banking/admin/verifiers/{verifierId}/suspend`
- `POST /api/v1/banking/admin/verifiers/{verifierId}/assign`

## 6.3 Verification Operations (Verifier + Admin)
- `POST /api/v1/banking/requests`
  - create verification request
- `GET /api/v1/banking/requests`
  - list with filters
- `GET /api/v1/banking/requests/{verificationId}`
- `PATCH /api/v1/banking/requests/{verificationId}`
  - status transitions: `pending -> in_progress -> review_needed|verified|rejected`
- `POST /api/v1/banking/requests/{verificationId}/revoke`
- `POST /api/v1/banking/requests/{verificationId}/assign`
- `POST /api/v1/banking/requests/{verificationId}/documents`
  - multipart upload metadata registration
- `GET /api/v1/banking/requests/{verificationId}/documents`

Revoke request body:

```json
{
  "reason": "Subject requested cancellation",
  "note": "Optional audit note"
}
```

## 6.4 Credential + DID Operations
- `POST /api/v1/banking/did/create`
- `POST /api/v1/banking/did/credentials/issue`
- `POST /api/v1/banking/did/credentials/verify`
- `GET /api/v1/banking/did/credentials/{credentialId}`
- `POST /api/v1/banking/did/credentials/{credentialId}/revoke`

## 6.5 ZK Proof / Hash Verification
- `POST /api/v1/banking/zk-proof/generate`
- `POST /api/v1/banking/zk-proof/verify`
- `GET /api/v1/banking/zk-proof/verification/{verificationId}`
- `GET /api/v1/banking/blockchain/proof/{verificationId}` (if chain anchoring enabled)

`POST /zk-proof/verify` request:

```json
{
  "proof": "base64_or_hex",
  "publicSignals": ["..."],
  "verificationId": "vrf_123",
  "circuitId": "kyc_age_over_18_v1"
}
```

## 6.6 Analytics APIs
- `GET /api/v1/banking/analytics/verification-stats`
- `GET /api/v1/banking/analytics/fraud-trends`
- `GET /api/v1/banking/analytics/risk-distribution`
- `GET /api/v1/banking/analytics/compliance-metrics`
- `GET /api/v1/banking/analytics/processing-times`
- `GET /api/v1/banking/analytics/geographical`

All analytics endpoints must support:
- `from`, `to` (ISO datetime, UTC)
- `tenantId` (admin may aggregate)
- `groupBy` (day/week/month where relevant)

## 6.7 Reports APIs
- `POST /api/v1/banking/reports/create`
- `GET /api/v1/banking/reports/{reportId}`
- `GET /api/v1/banking/reports`
- `POST /api/v1/banking/reports/{reportId}/cancel`
- `GET /api/v1/banking/audit/export`

Report types:
- `verification_summary`
- `compliance_audit`
- `verifier_performance`
- `fraud_risk_distribution`
- `credential_issuance`

## 6.8 Audit and System Operations
- `GET /api/v1/banking/audit/events`
- `GET /api/v1/banking/audit/verification/{verificationId}`
- `GET /api/v1/banking/audit/customer/{customerId}`
- `GET /api/v1/banking/admin/system/health`
- `GET /api/v1/banking/admin/system/queues`

## 6.9 External Integration APIs
- Webhooks:
  - `POST /api/v1/banking/webhooks/register`
  - `GET /api/v1/banking/webhooks`
  - `POST /api/v1/banking/webhooks/test`
  - `DELETE /api/v1/banking/webhooks/{webhookId}`
- API Keys:
  - `POST /api/v1/banking/api-keys/create`
  - `GET /api/v1/banking/api-keys`
  - `GET /api/v1/banking/api-keys/validate/current`
  - `DELETE /api/v1/banking/api-keys/{keyId}`

## 7. Pagination, Filtering, and Sorting

Standard query contract:
- `page` (default 1, min 1)
- `limit` (default 20, max 200)
- `sortBy` (whitelisted per endpoint)
- `sortDir` (`asc|desc`)
- `search` (full-text where available)
- endpoint-specific filters (`status`, `type`, `assignedVerifierId`, `riskLevel`, `from`, `to`)

Paged response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "meta": {
      "total": 1200,
      "page": 2,
      "limit": 20,
      "totalPages": 60
    }
  }
}
```

## 8. Realtime Data Synchronization

Transport:
- WebSocket (`/ws`) or SSE (`/events`)

Channels/topics:
- `verification.status.changed`
- `verification.assigned`
- `verification.revoked`
- `credential.issued`
- `zk.verification.completed`
- `report.completed`
- `system.alert.raised`

Requirements:
- token-authenticated connection
- tenant-scoped subscriptions
- replay support via `lastEventId`
- at-least-once delivery + dedupe key (`eventId`)

## 9. Dashboard Analytics & Visualization Data Requirements

Admin dashboard requires:
- total users, active users, locked users
- verifier approval pipeline counts
- verification throughput by day/week
- fraud hit rate, false positive rate
- SLA metrics (P50/P95 processing time)
- queue depth and failure rates

Verifier dashboard requires:
- assigned verifications count by state
- completion rate and average handling time
- rejection reasons distribution
- credential issuance and revocation counts
- workload and backlog trend

Each metric should expose:
- `value`, `previousValue`, `changePct`, `trend`
- optional `series: [{ts, value}]`

## 10. Audit Logging Requirements

Mandatory for every sensitive operation:
- auth lifecycle events
- user create/update/disable
- permission grant/revoke
- verification create/update/assign/revoke
- credential issue/verify/revoke
- report create/export/download
- api key + webhook changes

Audit retention:
- hot storage: 90 days
- warm storage: 1 year
- archive: 7 years (compliance configurable)

Tamper controls:
- append-only audit table or WORM stream
- hash-chain/signature over event batches (recommended)

## 11. Performance and Scalability Strategy

Database:
- partition `audit_events` and high-volume `verification_requests` by month
- use covering indexes for common filters
- GIN indexes for searchable JSONB
- enforce query timeouts and pagination limits

API:
- cursor pagination for large streams (>1M rows)
- endpoint-level caching for analytics (30s to 5m)
- async report generation via queue workers
- idempotent mutation handlers and dedupe store

Infra:
- horizontal stateless API pods
- background worker pool for verification/report pipelines
- Redis for rate limit/session cache/event fanout
- object storage + CDN for report artifacts

SLO targets:
- p95 read endpoints < 400ms
- p95 write endpoints < 700ms
- realtime event propagation < 3s

## 12. Security Requirements by Component

Auth:
- Argon2id password hashing
- refresh token rotation + reuse detection
- MFA mandatory for admin, first-login enrollment for verifier
- device/IP risk policies

API:
- strict RBAC and tenant scoping
- schema validation at edge
- output encoding and sensitive field redaction
- signed webhook payloads (`HMAC-SHA256`)

Data:
- encryption at rest (KMS)
- TLS 1.2+ in transit
- PII field classification and masking policy
- least-privilege DB roles

Files/uploads:
- malware scan before processing
- content-type + magic-byte validation
- size limits and checksum enforcement
- short-lived signed URLs only

## 13. Implementation Checklist

- [ ] Implement canonical envelope + error code registry
- [ ] Implement auth + MFA endpoints and token rotation
- [ ] Implement admin user/verifier management APIs
- [ ] Implement verification lifecycle + revoke APIs
- [ ] Implement credentials + DID + zk verification APIs
- [ ] Implement analytics aggregation endpoints
- [ ] Implement async report generation and exports
- [ ] Implement realtime channel delivery and replay
- [ ] Implement audit logging pipeline with retention policies
- [ ] Apply indexes/partitions and load-test for SLO conformance

## 14. Open Backend Dependencies

To complete frontend parity for admin/verifier experiences, backend must finalize:
- consistent `requests` resource contract (`create/list/detail/update/revoke`)
- verifier assignment ownership model
- upload metadata + secure file retrieval contract
- zk proof verify response schema standardization
- admin-level cross-tenant analytics permission model
- report job orchestration and signed download URLs
- webhook retry + DLQ behavior contract

