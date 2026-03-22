# Complete API Endpoint Technical Specification

This document scans the entire backend codebase and documents all discovered API endpoints.

- Total endpoints documented: **132**

## Table of Contents

- [1. Global Conventions](#1-global-conventions)
- [2. Endpoint Index](#2-endpoint-index)
- [3. Endpoint Specifications](#3-endpoint-specifications)

## 1. Global Conventions

### 1.1 Base URLs
- Banking APIs: `/api/v1/banking/*`
- Verification APIs: `/verification/*`
- Utility APIs: `/` and `/health`

### 1.2 Authentication and Authorization
- Banking endpoints use bearer API key auth (`Authorization: Bearer <api_key>`).
- Permissions are enforced per endpoint and listed in each endpoint section.
- API key bootstrap exception: `POST /api/v1/banking/api-keys/create` supports `x-verza-admin-token` when no active keys exist.

### 1.3 Request Headers
- `Authorization` for secured banking endpoints.
- `X-Request-Id` optional correlation id.
- `Idempotency-Key` recommended for safe retries on mutating banking endpoints.

### 1.4 Response Headers
- `X-Request-Id` always returned.
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.

### 1.5 Success/Error Formats
- Banking success envelope generally follows: `{"success": true, "data": ..., "timestamp": ...}`.
- Authentication/authorization/rate-limit failures may return FastAPI detail payload: `{"detail": "..."}`.

### 1.6 Status Codes
| Code | Meaning |
|---|---|
| 200 | Success (includes some business `status: not_found` outcomes). |
| 400 | Validation or domain error (banking error envelope). |
| 401 | Authentication failure. |
| 403 | Authorization/IP restriction failure. |
| 429 | Rate limit exceeded. |
| 500 | Unhandled server error. |

## 2. Endpoint Index

| Method | Path | Permission (banking) | Summary |
|---|---|---|---|
| `GET` | `/` | `-` | Root Redirect |
| `POST` | `/api/v1/banking/account/instant-verify` | `account:write` | Instant Verify |
| `POST` | `/api/v1/banking/account/micro-deposits` | `account:write` | Micro Deposits |
| `POST` | `/api/v1/banking/account/mono/exchange` | `account:write` | Mono Exchange |
| `GET` | `/api/v1/banking/account/mono/{monoAccountId}/details` | `account:read` | Mono Account Details |
| `GET` | `/api/v1/banking/account/mono/{monoAccountId}/identity` | `account:read` | Mono Account Identity |
| `GET` | `/api/v1/banking/account/mono/{monoAccountId}/transactions` | `account:read` | Mono Account Transactions |
| `POST` | `/api/v1/banking/account/verify` | `account:write` | Verify Account |
| `GET` | `/api/v1/banking/alerts` | `alerts:read` | List Alerts |
| `GET` | `/api/v1/banking/alerts/{alertId}` | `alerts:read` | Get Alert |
| `POST` | `/api/v1/banking/alerts/{alertId}/investigate` | `alerts:write` | Investigate Alert |
| `POST` | `/api/v1/banking/alerts/{alertId}/resolve` | `alerts:write` | Resolve Alert |
| `POST` | `/api/v1/banking/aml/risk-score` | `aml:write` | Risk Score |
| `POST` | `/api/v1/banking/aml/transaction-monitoring` | `aml:write` | Transaction Monitoring |
| `GET` | `/api/v1/banking/analytics/compliance-metrics` | `analytics:read` | Compliance Metrics |
| `GET` | `/api/v1/banking/analytics/fraud-trends` | `analytics:read` | Fraud Trends |
| `GET` | `/api/v1/banking/analytics/geographical` | `analytics:read` | Geographical Distribution |
| `GET` | `/api/v1/banking/analytics/processing-times` | `analytics:read` | Processing Times |
| `GET` | `/api/v1/banking/analytics/risk-distribution` | `analytics:read` | Risk Distribution |
| `GET` | `/api/v1/banking/analytics/verification-stats` | `analytics:read` | Verification Stats |
| `GET` | `/api/v1/banking/api-keys` | `api_keys:read` | List Api Keys |
| `POST` | `/api/v1/banking/api-keys/create` | `api_keys:write` | Create Api Key |
| `DELETE` | `/api/v1/banking/api-keys/{keyId}` | `api_keys:write` | Revoke Api Key |
| `GET` | `/api/v1/banking/audit/customer/{customerId}` | `audit:read` | Audit By Customer |
| `POST` | `/api/v1/banking/audit/export` | `audit:write` | Audit Export |
| `GET` | `/api/v1/banking/audit/verification/{verificationId}` | `audit:read` | Audit By Verification |
| `POST` | `/api/v1/banking/biometrics/behavioral` | `biometrics:write` | Behavioral Biometrics |
| `POST` | `/api/v1/banking/biometrics/face-match` | `biometrics:write` | Face Match |
| `POST` | `/api/v1/banking/biometrics/fingerprint` | `biometrics:write` | Fingerprint Verification |
| `POST` | `/api/v1/banking/biometrics/liveness` | `biometrics:write` | Liveness |
| `POST` | `/api/v1/banking/biometrics/voice-verification` | `biometrics:write` | Voice Verification |
| `POST` | `/api/v1/banking/blockchain/anchor` | `blockchain:write` | Anchor Verification |
| `POST` | `/api/v1/banking/blockchain/proof` | `blockchain:read` | Get Anchor Proof |
| `GET` | `/api/v1/banking/blockchain/proof/{verificationId}` | `blockchain:read` | Get Proof By Verification |
| `GET` | `/api/v1/banking/cases` | `cases:read` | List Cases |
| `POST` | `/api/v1/banking/cases/create` | `cases:write` | Create Case |
| `GET` | `/api/v1/banking/cases/{caseId}` | `cases:read` | Get Case |
| `PATCH` | `/api/v1/banking/cases/{caseId}` | `cases:write` | Update Case |
| `POST` | `/api/v1/banking/cases/{caseId}/assign` | `cases:write` | Assign Case |
| `POST` | `/api/v1/banking/cases/{caseId}/close` | `cases:write` | Close Case |
| `POST` | `/api/v1/banking/compliance/ctr/create` | `compliance:write` | Ctr Create |
| `GET` | `/api/v1/banking/compliance/reports` | `compliance:read` | List Compliance Reports |
| `POST` | `/api/v1/banking/compliance/reports/schedule` | `compliance:write` | Schedule Compliance Report |
| `POST` | `/api/v1/banking/compliance/sar/create` | `compliance:write` | Sar Create |
| `POST` | `/api/v1/banking/compliance/sar/submit` | `compliance:write` | Sar Submit |
| `POST` | `/api/v1/banking/credit/check` | `credit:write` | Credit Check |
| `POST` | `/api/v1/banking/credit/score` | `credit:write` | Credit Score |
| `POST` | `/api/v1/banking/did/create` | `did:write` | Create Did |
| `GET` | `/api/v1/banking/did/credentials/customer/{customerId}` | `did:read` | List Credentials |
| `POST` | `/api/v1/banking/did/credentials/issue` | `did:write` | Issue Credential |
| `POST` | `/api/v1/banking/did/credentials/present` | `did:read` | Present Credential |
| `POST` | `/api/v1/banking/did/credentials/verify` | `did:read` | Verify Credential |
| `GET` | `/api/v1/banking/did/credentials/{credentialId}` | `did:read` | Get Credential |
| `POST` | `/api/v1/banking/did/verify` | `did:read` | Verify Did |
| `GET` | `/api/v1/banking/did/{customerId}` | `did:read` | Get Did |
| `POST` | `/api/v1/banking/documents/classify` | `documents:write` | Classify Document |
| `POST` | `/api/v1/banking/documents/compare` | `documents:write` | Compare Documents |
| `POST` | `/api/v1/banking/documents/extract` | `documents:write` | Extract Document |
| `GET` | `/api/v1/banking/documents/supported-types` | `documents:read` | Supported Types |
| `POST` | `/api/v1/banking/documents/verify` | `documents:write` | Verify Document |
| `GET` | `/api/v1/banking/health` | `-` | Health |
| `POST` | `/api/v1/banking/kyb/business/directors` | `kyb:write` | Kyb Business Directors |
| `POST` | `/api/v1/banking/kyb/business/financial-health` | `kyb:write` | Kyb Financial Health |
| `POST` | `/api/v1/banking/kyb/business/ownership` | `kyb:write` | Kyb Business Ownership |
| `POST` | `/api/v1/banking/kyb/business/registry-check` | `kyb:write` | Kyb Registry Check |
| `POST` | `/api/v1/banking/kyb/business/verify` | `kyb:write` | Kyb Business Verify |
| `POST` | `/api/v1/banking/kyc/individual/basic` | `kyc:write` | Kyc Individual Basic |
| `POST` | `/api/v1/banking/kyc/individual/batch` | `kyc:write` | Kyc Individual Batch |
| `POST` | `/api/v1/banking/kyc/individual/enhanced` | `kyc:write` | Kyc Individual Enhanced |
| `POST` | `/api/v1/banking/kyc/individual/verify` | `kyc:write` | Kyc Individual Verify |
| `GET` | `/api/v1/banking/kyc/individual/{verificationId}` | `kyc:read` | Get Kyc Status |
| `POST` | `/api/v1/banking/kyc/individual/{verificationId}/refresh` | `kyc:write` | Kyc Individual Refresh |
| `POST` | `/api/v1/banking/localization/currency-convert` | `localization:read` | Currency Convert |
| `GET` | `/api/v1/banking/localization/regulations/{country}` | `localization:read` | Regulations |
| `GET` | `/api/v1/banking/monitoring/rules` | `monitoring:read` | List Rules |
| `POST` | `/api/v1/banking/monitoring/rules/create` | `monitoring:write` | Create Rule |
| `DELETE` | `/api/v1/banking/monitoring/rules/{ruleId}` | `monitoring:write` | Delete Rule |
| `PATCH` | `/api/v1/banking/monitoring/rules/{ruleId}` | `monitoring:write` | Update Rule |
| `POST` | `/api/v1/banking/ongoing/disable` | `monitoring:write` | Disable Monitoring |
| `GET` | `/api/v1/banking/ongoing/due-reviews` | `monitoring:read` | Due Reviews |
| `POST` | `/api/v1/banking/ongoing/enable` | `monitoring:write` | Enable Monitoring |
| `GET` | `/api/v1/banking/ongoing/{customerId}/changes` | `monitoring:read` | Monitoring Changes |
| `GET` | `/api/v1/banking/ongoing/{customerId}/status` | `monitoring:read` | Monitoring Status |
| `POST` | `/api/v1/banking/privacy/consent/record` | `privacy:write` | Record Consent |
| `GET` | `/api/v1/banking/privacy/consent/{customerId}` | `privacy:read` | Get Consent |
| `POST` | `/api/v1/banking/privacy/data-deletion` | `privacy:write` | Data Deletion |
| `POST` | `/api/v1/banking/privacy/data-export` | `privacy:write` | Data Export |
| `POST` | `/api/v1/banking/reports/create` | `reports:write` | Create Report |
| `GET` | `/api/v1/banking/reports/{reportId}` | `reports:read` | Get Report |
| `POST` | `/api/v1/banking/sandbox/generate-test-data` | `sandbox:write` | Generate Test Data |
| `POST` | `/api/v1/banking/screening/adverse-media/check` | `screening:write` | Adverse Media Check |
| `POST` | `/api/v1/banking/screening/adverse-media/ongoing` | `screening:write` | Adverse Media Ongoing |
| `POST` | `/api/v1/banking/screening/pep/check` | `screening:write` | Pep Check |
| `POST` | `/api/v1/banking/screening/pep/family-associates` | `screening:write` | Pep Family Associates |
| `POST` | `/api/v1/banking/screening/pep/ongoing` | `screening:write` | Pep Ongoing |
| `POST` | `/api/v1/banking/screening/sanctions/check` | `screening:write` | Sanctions Check |
| `GET` | `/api/v1/banking/screening/sanctions/lists` | `screening:read` | Sanctions Lists |
| `POST` | `/api/v1/banking/screening/sanctions/ongoing` | `screening:write` | Sanctions Ongoing |
| `POST` | `/api/v1/banking/source-of-funds/analyze` | `source_of_funds:write` | Analyze Source Of Funds |
| `POST` | `/api/v1/banking/source-of-funds/verify` | `source_of_funds:write` | Verify Source Of Funds |
| `POST` | `/api/v1/banking/source-of-wealth/verify` | `source_of_wealth:write` | Verify Source Of Wealth |
| `GET` | `/api/v1/banking/source-of-wealth/{customerId}/assessment` | `source_of_wealth:read` | Get Source Of Wealth Assessment |
| `POST` | `/api/v1/banking/transactions/screen` | `transactions:write` | Transaction Screen |
| `POST` | `/api/v1/banking/translation/document` | `translation:write` | Translate Document |
| `POST` | `/api/v1/banking/translation/text` | `translation:write` | Translate Text |
| `GET` | `/api/v1/banking/watchlist` | `watchlist:read` | List Watchlist |
| `POST` | `/api/v1/banking/watchlist/add` | `watchlist:write` | Add Watchlist |
| `GET` | `/api/v1/banking/webhooks` | `webhooks:read` | List Webhooks |
| `POST` | `/api/v1/banking/webhooks/register` | `webhooks:write` | Register Webhook |
| `POST` | `/api/v1/banking/webhooks/test` | `webhooks:write` | Test Webhook |
| `DELETE` | `/api/v1/banking/webhooks/{webhookId}` | `webhooks:write` | Delete Webhook |
| `POST` | `/api/v1/banking/zk-proof/generate` | `zk:write` | Generate Proof |
| `POST` | `/api/v1/banking/zk-proof/verify` | `zk:read` | Verify Proof |
| `GET` | `/health` | `-` | Health |
| `GET` | `/verification/cameras` | `-` | Cameras |
| `GET` | `/verification/config` | `-` | Verification Config |
| `GET` | `/verification/demo/document-webcam` | `-` | Demo Document Webcam |
| `GET` | `/verification/demo/mobile` | `-` | Demo Mobile |
| `GET` | `/verification/demo/mobile-liveness` | `-` | Demo Mobile Liveness |
| `GET` | `/verification/demo/webcam` | `-` | Demo Webcam |
| `GET` | `/verification/health` | `-` | Health Check |
| `POST` | `/verification/model/reload` | `-` | Reload Model |
| `GET` | `/verification/model/status` | `-` | Model Status |
| `POST` | `/verification/predict` | `-` | Predict Score |
| `POST` | `/verification/proxy/document-ocr-check` | `-` | Proxy Document Ocr Check |
| `POST` | `/verification/proxy/token` | `-` | Issue Proxy Token |
| `POST` | `/verification/proxy/verify-document` | `-` | Proxy Verify Document |
| `GET` | `/verification/result` | `-` | Verification Result |
| `POST` | `/verification/verify` | `-` | Verify Id |
| `POST` | `/verification/verify-document` | `-` | Verify Document |
| `POST` | `/verification/verify-mobile-liveness` | `-` | Verify Mobile Liveness |
| `POST` | `/verification/verify-webcam` | `-` | Verify Webcam |

## 3. Endpoint Specifications

### GET /

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |

Example response `200` (application/json):

```json
{}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/account/instant-verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `InstantVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `publicToken` | Yes | `string` | - |
| `accountHolderName` | No | `string | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "publicToken": "string",
  "accountHolderName": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/account/micro-deposits

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `MicroDepositsBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `accountNumber` | Yes | `string` | - |
| `routingNumber` | Yes | `string` | - |
| `accountHolderName` | Yes | `string` | - |

Example request body:

```json
{
  "customerId": "string",
  "accountNumber": "string",
  "routingNumber": "string",
  "accountHolderName": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/account/mono/exchange

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `MonoExchangeBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `code` | Yes | `string` | - |
| `metadata` | No | `object | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "code": "string",
  "metadata": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/account/mono/{monoAccountId}/details

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `monoAccountId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/account/mono/{monoAccountId}/identity

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `monoAccountId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/account/mono/{monoAccountId}/transactions

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `monoAccountId` | `path` | Yes | `string` | - |
| `fromDate` | `query` | No | `string | null` | - |
| `toDate` | `query` | No | `string | null` | - |
| `page` | `query` | No | `integer | null` | - |
| `limit` | `query` | No | `integer | null` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/account/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `account:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `AccountVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `accountNumber` | Yes | `string` | - |
| `routingNumber` | Yes | `string` | - |
| `accountHolderName` | Yes | `string` | - |
| `verificationMethod` | Yes | `string` | pattern=^(micro_deposits|instant_verification|plaid)$ |

Example request body:

```json
{
  "customerId": "string",
  "accountNumber": "string",
  "routingNumber": "string",
  "accountHolderName": "string",
  "verificationMethod": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/alerts

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `alerts:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/alerts/{alertId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `alerts:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `alertId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/alerts/{alertId}/investigate

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `alerts:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `alertId` | `path` | Yes | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `AlertInvestigateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `analyst` | No | `string | null` | - |
| `notes` | No | `string | null` | - |

Example request body:

```json
{
  "analyst": "string",
  "notes": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/alerts/{alertId}/resolve

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `alerts:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `alertId` | `path` | Yes | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `AlertResolveBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `resolution` | Yes | `string` | minLength=3 |
| `notes` | No | `string | null` | - |

Example request body:

```json
{
  "resolution": "string",
  "notes": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/aml/risk-score

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `aml:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `RiskScoreBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `customerProfile` | Yes | `object` | - |
| `verificationResults` | No | `object | null` | - |
| `transactionProfile` | No | `object | null` | - |
| `relationshipFactors` | No | `object | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "customerProfile": {},
  "verificationResults": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/aml/transaction-monitoring

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `aml:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `TransactionMonitoringBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `transactionId` | Yes | `string` | - |
| `customerId` | Yes | `string` | - |
| `transaction` | Yes | `object` | - |
| `customerRiskProfile` | Yes | `object` | - |

Example request body:

```json
{
  "transactionId": "string",
  "customerId": "string",
  "transaction": {},
  "customerRiskProfile": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/analytics/compliance-metrics

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `analytics:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/analytics/fraud-trends

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `analytics:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `startDate` | `query` | No | `string | null` | - |
| `endDate` | `query` | No | `string | null` | - |
| `groupBy` | `query` | No | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/analytics/geographical

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `analytics:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/analytics/processing-times

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `analytics:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/analytics/risk-distribution

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `analytics:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/analytics/verification-stats

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `analytics:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `startDate` | `query` | No | `string | null` | - |
| `endDate` | `query` | No | `string | null` | - |
| `groupBy` | `query` | No | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/api-keys

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `api_keys:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/api-keys/create

**Authentication & Authorization**
- Auth: Bearer API key or bootstrap admin token flow.
- Permission: `api_keys:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ApiKeyCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `keyName` | Yes | `string` | minLength=1; maxLength=128 |
| `permissions` | No | `array<string>` | - |
| `expiresAt` | No | `string | null` | - |
| `ipWhitelist` | No | `array<string> | null` | - |
| `rateLimit` | No | `integer | null` | - |

Example request body:

```json
{
  "keyName": "string",
  "permissions": [
    "string"
  ],
  "expiresAt": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### DELETE /api/v1/banking/api-keys/{keyId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `api_keys:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `keyId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/audit/customer/{customerId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `audit:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/audit/export

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `audit:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `AuditExportBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `startDate` | No | `string | null` | - |
| `endDate` | No | `string | null` | - |
| `format` | No | `string` | pattern=^(json|csv)$ |

Example request body:

```json
{
  "startDate": "string",
  "endDate": "string",
  "format": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/audit/verification/{verificationId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `audit:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `verificationId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/biometrics/behavioral

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `biometrics:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `BehavioralBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `signals` | Yes | `object` | - |

Example request body:

```json
{
  "customerId": "string",
  "signals": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/biometrics/face-match

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `biometrics:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `FaceMatchBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `selfieImage` | Yes | `string` | minLength=1 |
| `idPhotoImage` | Yes | `string` | minLength=1 |
| `threshold` | No | `number | null` | - |

Example request body:

```json
{
  "selfieImage": "string",
  "idPhotoImage": "string",
  "threshold": 0.0
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/biometrics/fingerprint

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `biometrics:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `FingerprintBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `fingerprintTemplate` | Yes | `string` | minLength=1 |

Example request body:

```json
{
  "customerId": "string",
  "fingerprintTemplate": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/biometrics/liveness

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `biometrics:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `LivenessBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `selfieImage` | No | `string | array<string> | null` | - |
| `videoUrl` | No | `string | null` | - |
| `livenessType` | Yes | `string` | pattern=^(passive|active)$ |

Example request body:

```json
{
  "selfieImage": "string",
  "videoUrl": "string",
  "livenessType": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/biometrics/voice-verification

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `biometrics:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `VoiceVerificationBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `voiceSample` | Yes | `string` | minLength=1 |
| `phrase` | No | `string | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "voiceSample": "string",
  "phrase": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/blockchain/anchor

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `blockchain:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `BlockchainAnchorBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `verificationId` | Yes | `string` | - |
| `chain` | No | `string` | - |
| `anchorData` | Yes | `object` | - |

Example request body:

```json
{
  "verificationId": "string",
  "chain": "string",
  "anchorData": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/blockchain/proof

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `blockchain:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `BlockchainProofBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `anchorId` | Yes | `string` | - |

Example request body:

```json
{
  "anchorId": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/blockchain/proof/{verificationId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `blockchain:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `verificationId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/cases

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `cases:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `status` | `query` | No | `string | null` | - |
| `assignedTo` | `query` | No | `string | null` | - |
| `caseType` | `query` | No | `string | null` | - |
| `limit` | `query` | No | `integer` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/cases/create

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `cases:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CaseCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `caseType` | Yes | `string` | - |
| `title` | No | `string | null` | - |
| `description` | No | `string | null` | - |
| `priority` | No | `string | null` | - |
| `entityType` | No | `string | null` | - |
| `entityId` | No | `string | null` | - |
| `alertId` | No | `string | null` | - |
| `assignedTo` | No | `string | null` | - |
| `metadata` | No | `object | null` | - |

Example request body:

```json
{
  "caseType": "string",
  "title": "string",
  "description": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/cases/{caseId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `cases:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `caseId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### PATCH /api/v1/banking/cases/{caseId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `cases:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `caseId` | `path` | Yes | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CaseUpdateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `title` | No | `string | null` | - |
| `description` | No | `string | null` | - |
| `priority` | No | `string | null` | - |
| `status` | No | `string | null` | - |
| `metadata` | No | `object | null` | - |

Example request body:

```json
{
  "title": "string",
  "description": "string",
  "priority": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/cases/{caseId}/assign

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `cases:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `caseId` | `path` | Yes | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CaseAssignBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `analyst` | Yes | `string` | - |

Example request body:

```json
{
  "analyst": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/cases/{caseId}/close

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `cases:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `caseId` | `path` | Yes | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CaseCloseBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `resolution` | No | `string | null` | - |
| `notes` | No | `string | null` | - |

Example request body:

```json
{
  "resolution": "string",
  "notes": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/compliance/ctr/create

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `compliance:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CtrCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `requestId` | Yes | `string` | - |
| `customerId` | No | `string | null` | - |
| `transaction` | Yes | `object` | - |

Example request body:

```json
{
  "requestId": "string",
  "customerId": "string",
  "transaction": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/compliance/reports

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `compliance:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `kind` | `query` | No | `string | null` | - |
| `status` | `query` | No | `string | null` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/compliance/reports/schedule

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `compliance:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ComplianceReportScheduleBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `reportType` | Yes | `string` | - |
| `cron` | Yes | `string` | - |
| `params` | No | `object | null` | - |

Example request body:

```json
{
  "reportType": "string",
  "cron": "string",
  "params": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/compliance/sar/create

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `compliance:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SarCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `requestId` | Yes | `string` | - |
| `customerId` | No | `string | null` | - |
| `narrative` | Yes | `string` | - |
| `activity` | Yes | `object` | - |

Example request body:

```json
{
  "requestId": "string",
  "customerId": "string",
  "narrative": "string",
  "activity": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/compliance/sar/submit

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `compliance:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SarSubmitBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `reportId` | Yes | `string` | - |
| `submissionChannel` | No | `string | null` | - |

Example request body:

```json
{
  "reportId": "string",
  "submissionChannel": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/credit/check

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `credit:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CreditCheckBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `personalInfo` | Yes | `object` | - |
| `address` | Yes | `object` | - |
| `purpose` | Yes | `string` | pattern=^(loan_application|credit_card|account_opening)$ |
| `bureaus` | No | `array<string>` | - |

Example request body:

```json
{
  "customerId": "string",
  "personalInfo": {},
  "address": {},
  "purpose": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/credit/score

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `credit:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CreditScoreBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `bureaus` | No | `array<string>` | - |

Example request body:

```json
{
  "customerId": "string",
  "bureaus": [
    "string"
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/did/create

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DidCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `method` | No | `string` | - |
| `metadata` | No | `object | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "method": "string",
  "metadata": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/did/credentials/customer/{customerId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/did/credentials/issue

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CredentialIssueBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `verificationId` | No | `string | null` | - |
| `did` | No | `string | null` | - |
| `credentialType` | No | `string` | - |
| `schema` | No | `string | null` | - |
| `claims` | No | `object | null` | - |
| `expiresAt` | No | `string | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "verificationId": "string",
  "did": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/did/credentials/present

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CredentialPresentBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `credentialId` | Yes | `string` | - |
| `challenge` | Yes | `string` | - |
| `verifier` | No | `string | null` | - |

Example request body:

```json
{
  "credentialId": "string",
  "challenge": "string",
  "verifier": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/did/credentials/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CredentialVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `presentationId` | No | `string | null` | - |
| `presentation` | No | `object | null` | - |
| `challenge` | No | `string | null` | - |

Example request body:

```json
{
  "presentationId": "string",
  "presentation": {},
  "challenge": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/did/credentials/{credentialId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `credentialId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/did/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DidVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `did` | Yes | `string` | - |
| `challenge` | Yes | `string` | - |
| `signature` | Yes | `string` | - |

Example request body:

```json
{
  "did": "string",
  "challenge": "string",
  "signature": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/did/{customerId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `did:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/documents/classify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `documents:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DocumentClassifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `documentImage` | Yes | `string` | minLength=1 |
| `documentBackImage` | No | `string | null` | - |
| `language` | No | `string | null` | - |

Example request body:

```json
{
  "documentImage": "string",
  "documentBackImage": "string",
  "language": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/documents/compare

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `documents:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DocumentCompareBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `documents` | Yes | `array<DocumentCompareItem>` | - |
| `fieldsToCompare` | No | `array<string> | null` | - |
| `useOcr` | No | `boolean | null` | - |

Example request body:

```json
{
  "documents": [
    null
  ],
  "fieldsToCompare": [
    null
  ],
  "useOcr": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/documents/extract

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `documents:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DocumentExtractBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `documentImage` | Yes | `string` | minLength=1 |
| `documentType` | No | `string | null` | - |
| `language` | No | `string | null` | - |

Example request body:

```json
{
  "documentImage": "string",
  "documentType": "string",
  "language": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/documents/supported-types

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `documents:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `country` | `query` | No | `string | null` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/documents/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `documents:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DocumentVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `documentType` | Yes | `string` | - |
| `documentImage` | Yes | `string` | minLength=1 |
| `documentBackImage` | No | `string | null` | - |
| `issuingCountry` | No | `string | null` | - |
| `expectedData` | No | `object | null` | - |
| `useOcr` | No | `boolean | null` | - |

Example request body:

```json
{
  "documentType": "string",
  "documentImage": "string",
  "documentBackImage": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/health

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `-`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyb/business/directors

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyb:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KybDirectorsBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `business` | Yes | `BusinessInfo` | - |
| `directors` | Yes | `array<object>` | - |
| `matchThreshold` | No | `integer` | minimum=50.0; maximum=100.0 |
| `fuzzyMatching` | No | `boolean` | - |

Example request body:

```json
{
  "business": {
    "businessRef": null,
    "name": null,
    "country": null
  },
  "directors": [
    {}
  ],
  "matchThreshold": 0
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyb/business/financial-health

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyb:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KybFinancialHealthBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `business` | Yes | `BusinessInfo` | - |
| `financials` | Yes | `object` | - |

Example request body:

```json
{
  "business": {
    "businessRef": null,
    "name": null,
    "country": null
  },
  "financials": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyb/business/ownership

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyb:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KybOwnershipBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `business` | Yes | `BusinessInfo` | - |
| `uboList` | Yes | `array<object>` | - |

Example request body:

```json
{
  "business": {
    "businessRef": null,
    "name": null,
    "country": null
  },
  "uboList": [
    {}
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyb/business/registry-check

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyb:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KybRegistryCheckBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `business` | Yes | `BusinessInfo` | - |

Example request body:

```json
{
  "business": {
    "businessRef": null,
    "name": null,
    "country": null
  }
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyb/business/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyb:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KybVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `requestId` | Yes | `string` | - |
| `business` | Yes | `BusinessInfo` | - |
| `uboList` | No | `array<object> | null` | - |
| `callbackUrl` | No | `string | null` | - |

Example request body:

```json
{
  "requestId": "string",
  "business": {
    "businessRef": null,
    "name": null,
    "country": null
  },
  "uboList": [
    null
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyc/individual/basic

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyc:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KycIndividualBasicBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `requestId` | Yes | `string` | - |
| `customerId` | Yes | `string` | - |
| `personalInfo` | Yes | `object` | - |
| `contactInfo` | Yes | `object` | - |
| `identityDocuments` | Yes | `array<object>` | - |

Example request body:

```json
{
  "requestId": "string",
  "customerId": "string",
  "personalInfo": {},
  "contactInfo": {},
  "identityDocuments": [
    {}
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyc/individual/batch

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyc:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KycBatchBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `items` | Yes | `array<KycBatchItem>` | minItems=1; maxItems=1000 |

Example request body:

```json
{
  "items": [
    null
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyc/individual/enhanced

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyc:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KycIndividualEnhancedBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `requestId` | Yes | `string` | - |
| `customerId` | Yes | `string` | - |
| `personalInfo` | Yes | `object` | - |
| `contactInfo` | Yes | `object` | - |
| `identityDocuments` | Yes | `array<object>` | - |
| `additionalChecks` | No | `object | null` | - |
| `callbackUrl` | No | `string | null` | - |
| `priority` | No | `string | null` | - |

Example request body:

```json
{
  "requestId": "string",
  "customerId": "string",
  "personalInfo": {},
  "contactInfo": {},
  "identityDocuments": [
    {}
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyc/individual/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyc:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `KycIndividualVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `requestId` | Yes | `string` | - |
| `customerId` | Yes | `string` | - |
| `verificationType` | Yes | `string` | pattern=^(basic|full|enhanced_due_diligence)$ |
| `personalInfo` | Yes | `object` | - |
| `contactInfo` | Yes | `object` | - |
| `identityDocuments` | Yes | `array<object>` | - |
| `proofOfAddress` | No | `object | null` | - |
| `biometricData` | No | `object | null` | - |
| `additionalChecks` | No | `object | null` | - |
| `callbackUrl` | No | `string | null` | - |
| `priority` | No | `string | null` | - |

Example request body:

```json
{
  "requestId": "string",
  "customerId": "string",
  "verificationType": "string",
  "personalInfo": {},
  "contactInfo": {},
  "identityDocuments": [
    {}
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/kyc/individual/{verificationId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyc:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `verificationId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/kyc/individual/{verificationId}/refresh

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `kyc:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `verificationId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/localization/currency-convert

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `localization:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `CurrencyConvertBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `fromCurrency` | Yes | `string` | minLength=3; maxLength=3 |
| `toCurrency` | Yes | `string` | minLength=3; maxLength=3 |
| `amount` | Yes | `number` | minimum=0.0 |

Example request body:

```json
{
  "fromCurrency": "string",
  "toCurrency": "string",
  "amount": 0.0
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/localization/regulations/{country}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `localization:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `country` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/monitoring/rules

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/monitoring/rules/create

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `MonitoringRuleCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `name` | Yes | `string` | - |
| `rule` | Yes | `object` | - |
| `active` | No | `boolean` | - |

Example request body:

```json
{
  "name": "string",
  "rule": {},
  "active": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### DELETE /api/v1/banking/monitoring/rules/{ruleId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `ruleId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### PATCH /api/v1/banking/monitoring/rules/{ruleId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `ruleId` | `path` | Yes | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `MonitoringRuleUpdateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `name` | No | `string | null` | - |
| `rule` | No | `object | null` | - |
| `active` | No | `boolean | null` | - |

Example request body:

```json
{
  "name": "string",
  "rule": {},
  "active": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/ongoing/disable

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `OngoingDisableBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `monitoringType` | No | `string` | - |

Example request body:

```json
{
  "customerId": "string",
  "monitoringType": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/ongoing/due-reviews

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `limit` | `query` | No | `integer` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/ongoing/enable

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `OngoingEnableBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `monitoringType` | No | `string` | - |
| `frequencyDays` | No | `integer | null` | - |
| `nextReviewAt` | No | `string | null` | - |
| `callbackUrl` | No | `string | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "monitoringType": "string",
  "frequencyDays": 0
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/ongoing/{customerId}/changes

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |
| `limit` | `query` | No | `integer` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/ongoing/{customerId}/status

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `monitoring:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/privacy/consent/record

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `privacy:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ConsentRecordBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `consentType` | Yes | `string` | - |
| `granted` | Yes | `boolean` | - |
| `metadata` | No | `object | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "consentType": "string",
  "granted": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/privacy/consent/{customerId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `privacy:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/privacy/data-deletion

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `privacy:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DataDeletionBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `reason` | No | `string | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "reason": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/privacy/data-export

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `privacy:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DataExportBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `reason` | No | `string | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "reason": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/reports/create

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `reports:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ReportCreateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `reportType` | Yes | `string` | pattern=^(verification_summary|compliance_summary|risk_distribution)$ |
| `dateRange` | Yes | `object` | - |
| `filters` | No | `object | null` | - |
| `format` | No | `string` | pattern=^(pdf|csv|excel)$ |
| `includeCharts` | No | `boolean` | - |

Example request body:

```json
{
  "reportType": "string",
  "dateRange": {},
  "filters": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/reports/{reportId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `reports:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `reportId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/sandbox/generate-test-data

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `sandbox:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SandboxGenerateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `scenario` | Yes | `string` | pattern=^(customers|transactions|kyc_checks)$ |
| `count` | No | `integer` | minimum=1.0; maximum=50.0 |

Example request body:

```json
{
  "scenario": "string",
  "count": 0
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/adverse-media/check

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `AdverseMediaBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `firstName` | Yes | `string` | - |
| `lastName` | Yes | `string` | - |
| `fuzzyMatching` | No | `boolean` | - |
| `matchThreshold` | No | `integer` | minimum=0.0; maximum=100.0 |

Example request body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "fuzzyMatching": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/adverse-media/ongoing

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `OngoingBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `active` | No | `boolean` | - |

Example request body:

```json
{
  "customerId": "string",
  "active": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/pep/check

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `PepCheckBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `firstName` | Yes | `string` | - |
| `lastName` | Yes | `string` | - |
| `dateOfBirth` | No | `string | null` | - |
| `nationality` | No | `string | null` | - |
| `fuzzyMatching` | No | `boolean` | - |
| `matchThreshold` | No | `integer` | minimum=0.0; maximum=100.0 |

Example request body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/pep/family-associates

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `PepFamilyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `firstName` | Yes | `string` | - |
| `lastName` | Yes | `string` | - |
| `fuzzyMatching` | No | `boolean` | - |
| `matchThreshold` | No | `integer` | minimum=0.0; maximum=100.0 |

Example request body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "fuzzyMatching": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/pep/ongoing

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `OngoingBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `active` | No | `boolean` | - |

Example request body:

```json
{
  "customerId": "string",
  "active": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/sanctions/check

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SanctionsCheckBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `firstName` | Yes | `string` | - |
| `lastName` | Yes | `string` | - |
| `dateOfBirth` | No | `string | null` | - |
| `nationality` | No | `string | null` | - |
| `fuzzyMatching` | No | `boolean` | - |
| `matchThreshold` | No | `integer` | minimum=0.0; maximum=100.0 |

Example request body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/screening/sanctions/lists

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/screening/sanctions/ongoing

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `screening:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `OngoingBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `active` | No | `boolean` | - |

Example request body:

```json
{
  "customerId": "string",
  "active": true
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/source-of-funds/analyze

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `source_of_funds:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SourceOfFundsAnalyzeBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `lookbackDays` | No | `integer` | minimum=1.0 |
| `transactions` | No | `array<object> | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "lookbackDays": 0,
  "transactions": [
    null
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/source-of-funds/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `source_of_funds:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SourceOfFundsVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `transactionId` | No | `string | null` | - |
| `amount` | Yes | `number` | - |
| `claimedSource` | Yes | `string` | pattern=^(employment|investment|inheritance|gift|business_sale|loan)$ |
| `supportingDocuments` | No | `array<SupportingDocument>` | - |

Example request body:

```json
{
  "customerId": "string",
  "transactionId": "string",
  "amount": 0.0,
  "claimedSource": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/source-of-wealth/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `source_of_wealth:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `SourceOfWealthVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `declaredSources` | No | `array<string>` | - |
| `supportingDocuments` | No | `array<object> | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "declaredSources": [
    "string"
  ],
  "supportingDocuments": [
    null
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/source-of-wealth/{customerId}/assessment

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `source_of_wealth:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `customerId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/transactions/screen

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `transactions:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `TransactionScreenBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `transactionId` | Yes | `string` | - |
| `customerId` | No | `string | null` | - |
| `transaction` | Yes | `object` | - |
| `customerRiskProfile` | No | `object | null` | - |
| `rules` | No | `array<object> | null` | - |

Example request body:

```json
{
  "transactionId": "string",
  "customerId": "string",
  "transaction": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Base risk score starts at 10; +25 for amount >= 10000; +40 for destination IR/KP/SY.
- Custom rules can add score; final score capped to 0..100.
- Decision: approve (<30), review (30-69.99), reject (>=70).
- Review/reject decisions trigger alert creation.

---

### POST /api/v1/banking/translation/document

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `translation:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `DocumentTranslationBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `documentText` | Yes | `string` | minLength=1 |
| `sourceLang` | Yes | `string` | minLength=2; maxLength=8 |
| `targetLang` | Yes | `string` | minLength=2; maxLength=8 |
| `format` | No | `string | null` | - |

Example request body:

```json
{
  "documentText": "string",
  "sourceLang": "string",
  "targetLang": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/translation/text

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `translation:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `TextTranslationBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `text` | Yes | `string` | minLength=1 |
| `sourceLang` | Yes | `string` | minLength=2; maxLength=8 |
| `targetLang` | Yes | `string` | minLength=2; maxLength=8 |

Example request body:

```json
{
  "text": "string",
  "sourceLang": "string",
  "targetLang": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/watchlist

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `watchlist:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `riskLevel` | `query` | No | `string | null` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/watchlist/add

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `watchlist:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `WatchlistAddBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `customerId` | Yes | `string` | - |
| `reason` | Yes | `string` | - |
| `riskLevel` | No | `string` | pattern=^(low|medium|high)$ |
| `sources` | No | `array<string> | null` | - |

Example request body:

```json
{
  "customerId": "string",
  "reason": "string",
  "riskLevel": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /api/v1/banking/webhooks

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `webhooks:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `active` | `query` | No | `boolean | null` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/webhooks/register

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `webhooks:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `WebhookRegisterBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `webhookUrl` | Yes | `string` | minLength=1; maxLength=2083; format=uri |
| `events` | No | `array<string>` | - |
| `secret` | Yes | `string` | minLength=8; maxLength=256 |
| `active` | No | `boolean` | - |

Example request body:

```json
{
  "webhookUrl": "https://example.com",
  "events": [
    "string"
  ],
  "secret": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/webhooks/test

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `webhooks:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `WebhookTestBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `webhookId` | No | `string | null` | - |
| `webhookUrl` | No | `string | null` | - |
| `eventType` | Yes | `string` | - |
| `payload` | No | `object | null` | - |

Example request body:

```json
{
  "webhookId": "string",
  "webhookUrl": "https://example.com",
  "eventType": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### DELETE /api/v1/banking/webhooks/{webhookId}

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `webhooks:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `webhookId` | `path` | Yes | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/zk-proof/generate

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `zk:write`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ZkGenerateBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `proofType` | Yes | `string` | pattern=^(age_over|income_over|residency)$ |
| `statement` | Yes | `object` | - |
| `witness` | No | `object | null` | - |

Example request body:

```json
{
  "proofType": "string",
  "statement": {},
  "witness": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /api/v1/banking/zk-proof/verify

**Authentication & Authorization**
- Auth: Bearer API key required.
- Permission: `zk:read`

**Required Headers**
- `X-Request-Id` optional request header.
- `Authorization: Bearer <api_key>`.
- `Idempotency-Key` recommended for retries.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ZkVerifyBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `proofId` | Yes | `string` | - |
| `proof` | No | `object | null` | - |

Example request body:

```json
{
  "proofId": "string",
  "proof": {}
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `Banking success envelope` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-17T13:40:00Z"
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /health

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |

Example response `200` (application/json):

```json
{}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/cameras

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |

Example response `200` (application/json):

```json
{}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/config

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |

Example response `200` (application/json):

```json
{}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/demo/document-webcam

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `string` |

Example response `200` (text/html):

```json
"string"
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/demo/mobile

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `string` |

Example response `200` (text/html):

```json
"string"
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/demo/mobile-liveness

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `string` |

Example response `200` (text/html):

```json
"string"
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/demo/webcam

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `string` |

Example response `200` (text/html):

```json
"string"
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/health

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |

Example response `200` (application/json):

```json
{}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/model/reload

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- Required: Yes
- Content-Type: `application/json`
- Schema: `ReloadBody`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `model_path` | No | `string | null` | - |

Example request body:

```json
{
  "model_path": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/model/status

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |

Example response `200` (application/json):

```json
{}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/predict

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_predict_score_verification_predict_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `id_image` | Yes | `string` | format=binary |
| `live_image` | Yes | `string` | format=binary |

Example request body:

```json
{
  "id_image": "string",
  "live_image": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/proxy/document-ocr-check

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `document_type` | `query` | No | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_proxy_document_ocr_check_verification_proxy_document_ocr_check_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `document_image` | Yes | `string` | format=binary |
| `document_back_image` | No | `string | null` | - |
| `first_name` | Yes | `string` | - |
| `last_name` | Yes | `string` | - |
| `other_name` | No | `string` | - |
| `document_number` | No | `string` | - |

Example request body:

```json
{
  "document_image": "string",
  "document_back_image": "string",
  "first_name": "string",
  "last_name": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `OcrCheckResponse` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "ok": true,
  "message": "string",
  "ocr_enabled": true
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/proxy/token

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `document_type` | `query` | No | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `None` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/proxy/verify-document

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `use_webcam` | `query` | No | `boolean` | - |
| `device_index` | `query` | No | `integer` | - |
| `liveness` | `query` | No | `boolean` | - |
| `show_window` | `query` | No | `boolean` | - |
| `document_type` | `query` | No | `string` | - |
| `html` | `query` | No | `boolean` | - |
| `return_url` | `query` | No | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_proxy_verify_document_verification_proxy_verify_document_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `document_image` | Yes | `string` | format=binary |
| `document_back_image` | No | `string | null` | - |
| `live_image` | No | `string | null` | - |
| `live_images` | No | `array<string> | null` | - |

Example request body:

```json
{
  "document_image": "string",
  "document_back_image": "string",
  "live_image": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `VerificationResponse` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "score": 0.0,
  "threshold": 0.0,
  "passed": true,
  "verdict": "string",
  "message": "string",
  "allow_retry": true
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### GET /verification/result

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `passed` | `query` | No | `boolean` | - |
| `message` | `query` | No | `string` | - |
| `score` | `query` | No | `number | null` | - |
| `threshold` | `query` | No | `number | null` | - |
| `return_url` | `query` | No | `string` | - |

**Request Body Schema**
- None

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `string` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (text/html):

```json
"string"
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/verify

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `html` | `query` | No | `boolean` | - |
| `return_url` | `query` | No | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_verify_id_verification_verify_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `id_image` | Yes | `string` | format=binary |
| `live_image` | Yes | `string` | format=binary |

Example request body:

```json
{
  "id_image": "string",
  "live_image": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `VerificationResponse` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "score": 0.0,
  "threshold": 0.0,
  "passed": true,
  "verdict": "string",
  "message": "string",
  "allow_retry": true
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/verify-document

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `use_webcam` | `query` | No | `boolean` | - |
| `device_index` | `query` | No | `integer` | - |
| `liveness` | `query` | No | `boolean` | - |
| `show_window` | `query` | No | `boolean` | - |
| `document_type` | `query` | No | `string` | - |
| `html` | `query` | No | `boolean` | - |
| `return_url` | `query` | No | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_verify_document_verification_verify_document_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `document_image` | Yes | `string` | format=binary |
| `document_back_image` | No | `string | null` | - |
| `live_image` | No | `string | null` | - |
| `live_images` | No | `array<string> | null` | - |

Example request body:

```json
{
  "document_image": "string",
  "document_back_image": "string",
  "live_image": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `VerificationResponse` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "score": 0.0,
  "threshold": 0.0,
  "passed": true,
  "verdict": "string",
  "message": "string",
  "allow_retry": true
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/verify-mobile-liveness

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `html` | `query` | No | `boolean` | - |
| `return_url` | `query` | No | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_verify_mobile_liveness_verification_verify_mobile_liveness_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `id_image` | Yes | `string` | format=binary |
| `live_images` | Yes | `array<string>` | - |

Example request body:

```json
{
  "id_image": "string",
  "live_images": [
    "string"
  ]
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `VerificationResponse` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "score": 0.0,
  "threshold": 0.0,
  "passed": true,
  "verdict": "string",
  "message": "string",
  "allow_retry": true
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---

### POST /verification/verify-webcam

**Authentication & Authorization**
- Auth: endpoint-specific/public verification flow (no banking API key contract).

**Required Headers**
- `X-Request-Id` optional request header.

**Path/Query Parameters**
| Name | In | Required | Type | Description |
|---|---|---|---|---|
| `device_index` | `query` | No | `integer` | - |
| `liveness` | `query` | No | `boolean` | - |
| `show_window` | `query` | No | `boolean` | - |
| `html` | `query` | No | `boolean` | - |
| `return_url` | `query` | No | `string` | - |

**Request Body Schema**
- Required: Yes
- Content-Type: `multipart/form-data`
- Schema: `Body_verify_webcam_verification_verify_webcam_post`

| Field | Required | Type | Constraints |
|---|---|---|---|
| `id_image` | Yes | `string` | format=binary |

Example request body:

```json
{
  "id_image": "string"
}
```

**Response Specification**
| Status | Description | Response Body Schema |
|---|---|---|
| `200` | Successful Response | `VerificationResponse` |
| `422` | Validation Error | `HTTPValidationError` |

Example response `200` (application/json):

```json
{
  "score": 0.0,
  "threshold": 0.0,
  "passed": true,
  "verdict": "string",
  "message": "string",
  "allow_retry": true
}
```

Example response `422` (application/json):

```json
{
  "detail": [
    null
  ]
}
```

**Error Handling**
- Typical errors: 400, 401, 403, 429, 500.
- Validation errors may appear as framework validation payload or banking error envelope depending on handler path.

**Business Logic Constraints**
- Enforced by request validation, permission checks, and endpoint-specific persistence/processing logic.

---
