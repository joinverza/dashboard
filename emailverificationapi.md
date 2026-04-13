# Email Verification API Documentation

## Versioning Information
- Document version: `1.0.0`
- API namespace version: `/api/v1/banking`
- Module: `email-verifications`
- OpenAPI source: `openapi.generated.json`
- Last updated: `2026-04-08`

## Table Of Contents
1. [Overview](#overview)
2. [Changelog](#changelog)
3. [Authentication And Authorization](#authentication-and-authorization)
4. [Headers](#headers)
5. [Error Handling Pattern](#error-handling-pattern)
6. [Data Schemas](#data-schemas)
7. [Endpoint Index](#endpoint-index)
8. [Endpoint Specifications](#endpoint-specifications)
9. [Frontend Mapping Guide](#frontend-mapping-guide)
10. [Implementation Notes](#implementation-notes)

## Overview
This document covers all new email-related backend APIs implemented under:
- `POST /api/v1/banking/email-verifications/verify`
- `POST /api/v1/banking/email-verifications/bulk/verify`
- `POST /api/v1/banking/email-verifications/bulk/upload`
- `GET /api/v1/banking/email-verifications/{verificationId}`
- `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}`
- `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results`

Design characteristics:
- Async processing for single and bulk verification.
- Idempotent mutation handling via `Idempotency-Key`.
- Multi-tenant isolation enforced by bearer context.
- Standard envelope response shape for banking APIs.
- OpenAPI-compatible endpoint metadata and security declaration (`HTTPBearer`).

## Changelog
### `1.0.0` - `2026-04-08`
- Added single email verification submit endpoint.
- Added bulk verification submit endpoint (JSON payload).
- Added bulk verification submit endpoint (CSV upload).
- Added single verification result endpoint.
- Added bulk job status endpoint.
- Added bulk job paginated results endpoint.
- Added async worker processing and risk classification for email checks.
- Added DB schema and indexes for email verification and bulk jobs.

## Authentication And Authorization
All endpoints require:
- `Authorization: Bearer <token>`

Accepted bearer token types:
- API key
- Auth access token
- Service token

Permission model:
- Write endpoints accept `email_verification:write` or fallback `kyc:write`.
- Read endpoints accept `email_verification:read` or fallback `kyc:read`/`verification:read`.

## Headers
### Required Headers
```http
Authorization: Bearer <token>
```

### Conditionally Required Headers
```http
Idempotency-Key: <client-generated-unique-key>
```
Use on all `POST` endpoints to make retries safe.

### Optional Headers
```http
X-Request-Id: <client-request-id>
X-Correlation-Id: <client-correlation-id>
```

### Common Response Headers
```http
X-Request-Id: <server-or-client-request-id>
X-Correlation-Id: <echoed-if-sent>
```

## Error Handling Pattern
Banking endpoints return a normalized envelope:

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation error",
    "details": []
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

Common error codes for this module:
- `validation_error`
- `payload_too_large`
- `request_failed`
- `insufficient_permissions` (mapped from permission failures)
- `rate_limit_exceeded` (platform-wide safeguard)

Common statuses:
- `200` success response envelope.
- `400` request/validation/domain input errors.
- `401` missing or invalid bearer token.
- `403` permission denied.
- `413` CSV upload size exceeded.
- `422` FastAPI validation fallback.
- `429` rate-limited request.

## Data Schemas
### EnvelopeSuccess
```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-04-08T10:00:00Z"
}
```

### SingleEmailVerifyRequest
```json
{
  "requestId": "email_req_1001",
  "customerId": "cust_1001",
  "email": "alice@example.com",
  "metadata": {
    "channel": "onboarding"
  }
}
```

Field rules:
- `requestId`: optional, `2..128` chars.
- `customerId`: optional, `1..128` chars.
- `email`: required, `3..320` chars.
- `metadata`: optional object.

### BulkEmailVerifyRequest
```json
{
  "items": [
    {
      "requestId": "bulk_1",
      "customerId": "cust_1",
      "email": "user1@example.com",
      "metadata": {
        "segment": "retail"
      }
    },
    {
      "requestId": "bulk_2",
      "customerId": "cust_2",
      "email": "support@mailinator.com"
    }
  ]
}
```

Field rules:
- `items`: required array, `1..10000`.
- Each `email`: required, `3..320`.

### EmailVerificationResult
```json
{
  "verificationId": "evf_123",
  "requestId": "email_req_1001",
  "customerId": "cust_1001",
  "email": "Alice@Example.com",
  "normalizedEmail": "alice@example.com",
  "source": "single_api",
  "status": "completed",
  "verdict": "valid",
  "reasonCode": "passed_syntax_domain_checks",
  "riskScore": 10.0,
  "checks": {
    "normalizedEmail": "alice@example.com",
    "syntaxValid": true,
    "domainValid": true,
    "disposableDomain": false,
    "roleAccount": false,
    "highRiskTld": false,
    "domainSuggestion": null,
    "mailboxCheck": "not_performed"
  },
  "metadata": {
    "channel": "onboarding"
  },
  "bulkJobId": null,
  "createdAt": "2026-04-08T10:00:00Z",
  "updatedAt": "2026-04-08T10:00:02Z",
  "completedAt": "2026-04-08T10:00:02Z"
}
```

### BulkJobStatus
```json
{
  "bulkJobId": "ebj_123",
  "status": "processing",
  "sourceType": "csv",
  "sourceName": "emails.csv",
  "totalRecords": 2000,
  "processedRecords": 1400,
  "validCount": 1000,
  "invalidCount": 250,
  "riskyCount": 120,
  "unknownCount": 30,
  "failedCount": 0,
  "createdAt": "2026-04-08T10:00:00Z",
  "updatedAt": "2026-04-08T10:01:20Z",
  "completedAt": null
}
```

## Endpoint Index
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/banking/email-verifications/verify` | Submit single email for verification |
| `POST` | `/api/v1/banking/email-verifications/bulk/verify` | Submit bulk email list (JSON) |
| `POST` | `/api/v1/banking/email-verifications/bulk/upload` | Submit bulk email file (CSV) |
| `GET` | `/api/v1/banking/email-verifications/{verificationId}` | Fetch single verification result |
| `GET` | `/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}` | Fetch bulk job status and counters |
| `GET` | `/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results` | Fetch paginated bulk results |

## Endpoint Specifications
### 1) Verify Customer Email (Single)
**Method**: `POST`  
**Path**: `/api/v1/banking/email-verifications/verify`  
**OperationId**: `verify_email_single_api_v1_banking_email_verifications_verify_post`

#### Request Headers
- `Authorization` (required)
- `Idempotency-Key` (recommended)

#### Query Parameters
- None

#### Path Variables
- None

#### Request Body
`application/json`

```json
{
  "requestId": "email_req_1001",
  "customerId": "cust_1001",
  "email": "alice@example.com",
  "metadata": {
    "channel": "onboarding"
  }
}
```

#### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "verificationId": "evf_123",
    "status": "pending"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

#### Error Response Examples
`400` invalid payload:
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Email is required"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

`401` auth failure:
```json
{
  "success": false,
  "error": {
    "code": "request_failed",
    "message": "Invalid API key"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

### 2) Verify Customer Emails (Bulk JSON)
**Method**: `POST`  
**Path**: `/api/v1/banking/email-verifications/bulk/verify`  
**OperationId**: `verify_email_bulk_api_v1_banking_email_verifications_bulk_verify_post`

#### Request Headers
- `Authorization` (required)
- `Idempotency-Key` (recommended)

#### Query Parameters
- None

#### Path Variables
- None

#### Request Body
`application/json`

```json
{
  "items": [
    {
      "requestId": "bulk_001",
      "customerId": "cust_001",
      "email": "user@gmail.com"
    },
    {
      "requestId": "bulk_002",
      "customerId": "cust_002",
      "email": "bad email"
    }
  ]
}
```

#### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "bulkJobId": "ebj_123",
    "status": "pending",
    "acceptedCount": 2
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

#### Error Response Examples
`400` input validation:
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation error",
    "details": [
      {
        "loc": ["body", "items"],
        "msg": "List should have at least 1 item after validation",
        "type": "too_short"
      }
    ]
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

### 3) Verify Customer Emails (Bulk CSV Upload)
**Method**: `POST`  
**Path**: `/api/v1/banking/email-verifications/bulk/upload`  
**OperationId**: `verify_email_bulk_upload_api_v1_banking_email_verifications_bulk_upload_post`

#### Request Headers
- `Authorization` (required)
- `Idempotency-Key` (recommended)
- `Content-Type: multipart/form-data` (required)

#### Query Parameters
- None

#### Path Variables
- None

#### Multipart Body
- `file` (required): `.csv` file.

CSV columns:
- Required: `email`
- Optional: `requestId` or `request_id`
- Optional: `customerId` or `customer_id`

#### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "bulkJobId": "ebj_123",
    "status": "pending",
    "acceptedCount": 500
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

#### Error Response Examples
`400` wrong file extension:
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Only CSV files are supported"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

`413` file too large:
```json
{
  "success": false,
  "error": {
    "code": "payload_too_large",
    "message": "CSV upload exceeds 5MB limit"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

### 4) Get Email Verification Result
**Method**: `GET`  
**Path**: `/api/v1/banking/email-verifications/{verificationId}`  
**OperationId**: `get_single_verification_api_v1_banking_email_verifications__verificationId__get`

#### Request Headers
- `Authorization` (required)

#### Query Parameters
- None

#### Path Variables
- `verificationId` (required, `string`)

#### Success Response (`200`) - Completed
```json
{
  "success": true,
  "data": {
    "verificationId": "evf_123",
    "status": "completed",
    "verdict": "risky",
    "reasonCode": "disposable_domain",
    "riskScore": 88.0
  },
  "timestamp": "2026-04-08T10:00:02Z"
}
```

#### Success Response (`200`) - Not Found In Tenant Scope
```json
{
  "success": true,
  "data": {
    "verificationId": "evf_unknown",
    "status": "not_found"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

### 5) Get Bulk Email Verification Job
**Method**: `GET`  
**Path**: `/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}`  
**OperationId**: `get_bulk_verification_job_api_v1_banking_email_verifications_bulk_jobs__bulkJobId__get`

#### Request Headers
- `Authorization` (required)

#### Query Parameters
- None

#### Path Variables
- `bulkJobId` (required, `string`)

#### Success Response (`200`) - In Progress
```json
{
  "success": true,
  "data": {
    "bulkJobId": "ebj_123",
    "status": "processing",
    "totalRecords": 1000,
    "processedRecords": 450
  },
  "timestamp": "2026-04-08T10:01:00Z"
}
```

#### Success Response (`200`) - Not Found
```json
{
  "success": true,
  "data": {
    "bulkJobId": "ebj_unknown",
    "status": "not_found"
  },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

### 6) List Bulk Email Verification Results
**Method**: `GET`  
**Path**: `/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results`  
**OperationId**: `get_bulk_verification_results_api_v1_banking_email_verifications_bulk_jobs__bulkJobId__results_get`

#### Request Headers
- `Authorization` (required)

#### Query Parameters
- `page` (optional, integer, default `1`, min `1`)
- `limit` (optional, integer, default `100`, min `1`, max `1000`)

#### Path Variables
- `bulkJobId` (required, `string`)

#### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "bulkJobId": "ebj_123",
    "items": [
      {
        "verificationId": "evf_1",
        "status": "completed",
        "verdict": "valid"
      },
      {
        "verificationId": "evf_2",
        "status": "completed",
        "verdict": "invalid"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 100,
      "count": 2
    }
  },
  "timestamp": "2026-04-08T10:02:00Z"
}
```

## Frontend Mapping Guide
This section maps each API to pages and suggested components. Build only what is relevant to your frontend stack.

| Endpoint | Frontend Page | React Components | Vue Components | Angular Components |
|---|---|---|---|---|
| `POST /email-verifications/verify` | Single Email Verify | `EmailVerifyPage`, `EmailVerifyForm`, `VerificationSubmitButton` | `EmailVerifyView.vue`, `EmailVerifyForm.vue` | `email-verify-page`, `email-verify-form` |
| `GET /email-verifications/{verificationId}` | Single Result Detail | `EmailVerificationDetailPage`, `RiskBadge`, `ChecksTable` | `EmailVerificationDetail.vue`, `RiskBadge.vue` | `email-verification-detail`, `risk-badge` |
| `POST /email-verifications/bulk/verify` | Bulk Verify (JSON) | `BulkVerifyJsonPage`, `BulkJsonEditor`, `BulkSubmitPanel` | `BulkVerifyJsonView.vue`, `BulkJsonEditor.vue` | `bulk-verify-json-page`, `bulk-json-editor` |
| `POST /email-verifications/bulk/upload` | Bulk Verify Upload | `BulkUploadPage`, `CsvDropzone`, `UploadProgressPanel` | `BulkUploadView.vue`, `CsvDropzone.vue` | `bulk-upload-page`, `csv-dropzone` |
| `GET /email-verifications/bulk/jobs/{bulkJobId}` | Bulk Job Overview | `BulkJobStatusPage`, `JobCountersCard`, `JobTimeline` | `BulkJobStatusView.vue`, `JobCountersCard.vue` | `bulk-job-status-page`, `job-counters-card` |
| `GET /email-verifications/bulk/jobs/{bulkJobId}/results` | Bulk Job Results | `BulkResultsTable`, `ResultsPagination`, `ResultsFilters` | `BulkResultsTable.vue`, `ResultsPagination.vue` | `bulk-results-table`, `results-pagination` |

UI workflow guidance:
1. Submit single/bulk request.
2. Persist returned `verificationId` or `bulkJobId`.
3. Poll status endpoints until terminal states.
4. Render result tables/charts using returned `verdict` and `riskScore`.
5. Surface errors from envelope `error.code` and `error.message`.

## Implementation Notes
### Data Transformation Requirements
- Normalize user-entered emails to lowercase before display comparisons.
- Preserve original `email` for traceability, but use `normalizedEmail` for dedupe/search UX.
- Convert backend numeric scores (`riskScore`) to fixed decimals in UI.
- Render nullable fields (`verdict`, `completedAt`) safely for pending records.

### Pagination Details
- `GET /bulk/jobs/{bulkJobId}/results` supports `page` and `limit`.
- Current API returns `meta.count` as returned page item count, not global total.
- Client should:
1. Use `page` and `limit` to page forward.
2. Stop paging when `meta.count < limit`.

### Filtering Options
- No server-side filtering query parameters currently exposed on results endpoint.
- Recommended frontend filtering (client-side):
1. `status` (`pending`, `processing`, `completed`, `failed`)
2. `verdict` (`valid`, `invalid`, `risky`, `unknown`)
3. `reasonCode`

### Business Logic Constraints
- Single request supports soft dedupe by `requestId` within tenant scope.
- CSV constraints:
1. Extension must be `.csv`
2. Size max `5MB`
3. Effective row cap `10000`
4. Must include at least one non-empty `email`
- Verification classification behavior:
1. Invalid syntax/domain => `invalid`
2. Disposable/role/high-risk-heuristics => `risky`
3. Standard valid syntax/domain => `valid`
- Bulk processing is asynchronous and may transiently return `processing`.

### OpenAPI/Swagger Alignment Notes
- Security scheme: `HTTPBearer`.
- Path/query parameter contracts are reflected in `openapi.generated.json`.
- Request body schemas are validated in runtime via Pydantic model parsing.
- Response payload follows banking envelope convention and may include domain-specific fields inside `data`.

