# Frontend Dashboard API Integration Documentation

This document covers frontend-facing endpoints used by the dashboard, including authentication, verification workflows, team management, billing, settings, and analytics.

## Table of Contents

- [Global Conventions](#global-conventions)
- [Rate Limiting](#rate-limiting)
- [Error Handling Pattern](#error-handling-pattern)
- [Frontend Feature Mapping Guide](#frontend-feature-mapping-guide)
- [Admin Operations](#admin-operations)
- [Authentication & Session Management](#authentication--session-management)
- [Billing & License](#billing--license)
- [Dashboard Core](#dashboard-core)
- [Organization Settings](#organization-settings)
- [Risk & Onboarding](#risk--onboarding)
- [Team Management](#team-management)
- [Verifier Workspace](#verifier-workspace)

## Global Conventions

- Base URL (env-specific): `https://<host>`
- Primary namespace: `/api/v1/banking`
- Auth namespaces: `/auth/*` and `/{role}/auth/*`
- Success envelope (banking/auth):

```json
{
  "success": true,
  "data": {
    "...": "..."
  },
  "timestamp": "2026-01-01T00:00:00Z"
}
```
- Request tracing headers: `X-Request-Id` (optional request, always response), `X-Correlation-Id` (echoed when provided)
- Idempotency for many mutation endpoints: `Idempotency-Key`

## Rate Limiting

- Auth signup: `AUTH_SIGNUP_RATE_LIMIT_MAX` per `AUTH_SIGNUP_RATE_LIMIT_WINDOW_SECONDS` (defaults: `5`/`3600s`) per IP
- Auth login: `10` requests per `300s` per IP
- Banking API key traffic: per-key hourly quota via `rate_limit_per_hour`
- Team invitation anti-abuse: org-level and recipient-level rolling 15-minute limits, plus resend cooldown
- Exceeded limits return `429` and should trigger frontend retry/backoff UX

## Error Handling Pattern

- Standard envelope:

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation error",
    "details": [
      {
        "field": "email",
        "message": "Invalid email"
      }
    ]
  },
  "requestId": "<request-id>"
}
```
- Common status codes: `400`, `401`, `403`, `404`, `409`, `410`, `413`, `422`, `429`, `500`, `503`
- Validation failures from FastAPI are normalized to `400 validation_error` in this app.

## Frontend Feature Mapping Guide

| Endpoint | Dashboard Feature | UI Components |
|---|---|---|
| `/api/v1/banking/account/instant-verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/account/micro-deposits` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/account/mono/exchange` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/account/mono/{monoAccountId}/details` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/account/mono/{monoAccountId}/identity` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/account/mono/{monoAccountId}/transactions` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/account/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/alerts` | Notifications Center | Alert list, unread badge, filters |
| `/api/v1/banking/admin/content` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/content/{contentId}/moderate` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/credentials` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/credentials/{credentialId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/enterprises` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/enterprises/{tenantId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/financial` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/financial/revenue` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/logs` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/system-health` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/users` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/verifications` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/verifications/{verificationId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/verifiers` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/admin/verifiers/{id}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/alerts` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/alerts/{alertId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/alerts/{alertId}/investigate` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/alerts/{alertId}/resolve` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/aml/risk-score` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/aml/transaction-monitoring` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/analytics` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/compliance-metrics` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/fraud-trends` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/geographic-distribution` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/geographical` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/processing-times` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/risk-distribution` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/analytics/verification-stats` | Analytics Dashboard | Geo chart, KPI cards |
| `/api/v1/banking/api-keys` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/api-keys/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/api-keys/validate/current` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/api-keys/{keyId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/api/settings` | API Security Settings | IP whitelist form, auto-rotation toggle |
| `/api/v1/banking/audit/customer/{customerId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/audit/export` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/audit/logs` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/audit/logs/search` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/audit/verification/{verificationId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/billing/checkout/session` | Billing & Plan | Plan cards, usage meter, checkout actions |
| `/api/v1/banking/billing/plans` | Billing & Plan | Plan cards, usage meter, checkout actions |
| `/api/v1/banking/billing/webhooks/provider` | Billing & Plan | Plan cards, usage meter, checkout actions |
| `/api/v1/banking/biometrics/behavioral` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/biometrics/face-match` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/biometrics/fingerprint` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/biometrics/liveness` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/biometrics/voice-verification` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/blockchain/anchor` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/blockchain/proof` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/blockchain/proof/{verificationId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/bulk/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/cases` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/cases/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/cases/{caseId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/cases/{caseId}/assign` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/cases/{caseId}/close` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/compliance/ctr/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/compliance/reports` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/compliance/reports/schedule` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/compliance/sar/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/compliance/sar/submit` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/credit/check` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/credit/score` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/diagnostics/requests` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/diagnostics/requests/{requestId}/cancel` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/diagnostics/requests/{requestId}/retry` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/credentials/customer/{customerId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/credentials/issue` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/credentials/present` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/credentials/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/credentials/{credentialId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/did/{customerId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/disputes` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/disputes/{disputeId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/disputes/{disputeId}/resolve` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/certificate/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/classify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/compare` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/extract` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/signature/validate` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/supported-types` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/documents/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/email-verifications/bulk/upload` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/email-verifications/bulk/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/email-verifications/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/email-verifications/{verificationId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/governance/proposals` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/governance/proposals/{proposalId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/health` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyb/business/directors` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyb/business/financial-health` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyb/business/ownership` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyb/business/registry-check` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyb/business/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyc/individual/basic` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyc/individual/batch` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyc/individual/enhanced` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyc/individual/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyc/individual/{verificationId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/kyc/individual/{verificationId}/refresh` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/license/plan/change` | Billing & Plan | Plan cards, usage meter, checkout actions |
| `/api/v1/banking/license/usage` | Billing & Plan | Plan cards, usage meter, checkout actions |
| `/api/v1/banking/localization/currency-convert` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/localization/regulations/{country}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/marketplace/verifiers` | Verifier Marketplace | Search/filter listing |
| `/api/v1/banking/monitoring/rules` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/monitoring/rules/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/monitoring/rules/{ruleId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/notifications` | Notifications Center | Alert list, unread badge, filters |
| `/api/v1/banking/notifications/mark-all-read` | Notifications Center | Alert list, unread badge, filters |
| `/api/v1/banking/notifications/{notificationId}/read` | Notifications Center | Alert list, unread badge, filters |
| `/api/v1/banking/onboarding/bulk/errors/{validationId}` | Bulk Onboarding | CSV upload + validation/import screens |
| `/api/v1/banking/onboarding/bulk/import` | Bulk Onboarding | CSV upload + validation/import screens |
| `/api/v1/banking/onboarding/bulk/validate` | Bulk Onboarding | CSV upload + validation/import screens |
| `/api/v1/banking/ongoing/disable` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/ongoing/due-reviews` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/ongoing/enable` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/ongoing/{customerId}/changes` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/ongoing/{customerId}/status` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/privacy/consent/record` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/privacy/consent/{customerId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/privacy/data-deletion` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/privacy/data-export` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/reports` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/reports/create` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/reports/{reportId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/requests` | Verification Queue | Requests table, review drawer, revoke dialog |
| `/api/v1/banking/requests/{verificationId}/review` | Verification Queue | Requests table, review drawer, revoke dialog |
| `/api/v1/banking/requests/{verificationId}/revoke` | Verification Queue | Requests table, review drawer, revoke dialog |
| `/api/v1/banking/risk/sandbox/report` | Risk Sandbox | Simulation form and results panel |
| `/api/v1/banking/risk/sandbox/simulate` | Risk Sandbox | Simulation form and results panel |
| `/api/v1/banking/sandbox/generate-test-data` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/adverse-media/check` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/adverse-media/ongoing` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/pep/check` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/pep/family-associates` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/pep/ongoing` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/sanctions/check` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/sanctions/lists` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/sanctions/ongoing` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/screening/{screeningType}/ongoing` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/settings/company` | Company Profile | Settings form, logo uploader |
| `/api/v1/banking/settings/company/logo` | Company Profile | Settings form, logo uploader |
| `/api/v1/banking/source-of-funds/analyze` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/source-of-funds/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/source-of-wealth/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/source-of-wealth/{customerId}/assessment` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/team/invitations` | Team Administration | Invite modal, pending invites panel |
| `/api/v1/banking/team/invitations/accept` | Team Administration | Invite modal, pending invites panel |
| `/api/v1/banking/team/invitations/{invitationId}/resend` | Team Administration | Invite modal, pending invites panel |
| `/api/v1/banking/transactions/screen` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/translation/document` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/translation/text` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/user/verifications` | User Verification History | History table, status chips |
| `/api/v1/banking/user/wallet` | Wallet Widget | Balance cards |
| `/api/v1/banking/verification/workflows/queue` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/verification/workflows/summary` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/verification/workflows/{verificationId}/claim` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/verification/workflows/{verificationId}/release` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/verification/workflows/{verificationId}/status` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/verification/workflows/{verificationId}/timeline` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/verifier/active` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/completed` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/earnings` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/help` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/help/articles` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/help/tickets` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/issue-credential` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/jobs` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/jobs/{verificationId}` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/notifications` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/profile` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/reputation` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/review/{verificationId}` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/reviews` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/staking` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/staking/actions` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/withdraw` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/verifier/withdrawals` | Verifier Portal | Profile editor, credential issuing action |
| `/api/v1/banking/watchlist` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/watchlist/add` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks/register` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks/retries` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks/test` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks/{webhookId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks/{webhookId}/rotate-secret` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/webhooks/{webhookId}/test` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/circuits` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/disclose` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/generate` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/noir/generate` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/noir/toolchain` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/noir/verify` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/verification/{verificationId}` | General Dashboard | Shared dashboard components |
| `/api/v1/banking/zk-proof/verify` | General Dashboard | Shared dashboard components |
| `/auth/.well-known/jwks.json` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/forgot-password` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/jwks/revoke/{kid}` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/jwks/rotate` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/login` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/logout` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/machine-identities` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/machine-identities/{identityId}/tokens/issue` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/me` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/mfa/enroll` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/mfa/enroll/verify` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/mfa/recovery-code/verify` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/mfa/verify` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/policies/{policyKey}/mode` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/refresh` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/reset-password` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/signup` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/auth/step-up` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/forgot-password` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/login` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/logout` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/me` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/mfa/enroll` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/mfa/enroll/verify` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/mfa/recovery-code/verify` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/mfa/verify` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/refresh` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/reset-password` | Auth Pages | Login/Signup forms, MFA modal, Session manager |
| `/{role}/auth/signup` | Auth Pages | Login/Signup forms, MFA modal, Session manager |

## Admin Operations

### `GET /api/v1/banking/admin/alerts`

- Summary: Admin Alerts
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.severity` (required=False):

```json
{
  "title": "Severity",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(critical|warning|info)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.type` (required=False):

```json
{
  "title": "Type",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(alert|transaction|message|update|info)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.read` (required=False):

```json
{
  "title": "Read",
  "anyOf": [
    {
      "type": "boolean"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.sort` (required=False):

```json
{
  "type": "string",
  "title": "Sort",
  "default": "createdAt:desc",
  "pattern": "^(createdAt:desc|createdAt:asc)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/alerts' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/alerts', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/content`

- Summary: Admin Content
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(pending|approved|rejected)$"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/content' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/content', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/admin/content/{contentId}/moderate`

- Summary: Moderate Content
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.contentId` (required=True):

```json
{
  "type": "string",
  "title": "Contentid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "ModerationActionBody",
  "required": [
    "action"
  ],
  "properties": {
    "action": {
      "type": "string",
      "title": "Action",
      "pattern": "^(approve|reject)$"
    },
    "reason": {
      "title": "Reason",
      "anyOf": [
        {
          "type": "string",
          "maxLength": 500
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "action": "<action>",
  "reason": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/admin/content/{contentId}/moderate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/content/{contentId}/moderate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/credentials`

- Summary: Admin Credentials
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/credentials' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/credentials', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/credentials/{credentialId}`

- Summary: Admin Credential Detail
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.credentialId` (required=True):

```json
{
  "type": "string",
  "title": "Credentialid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/credentials/{credentialId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/credentials/{credentialId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/enterprises`

- Summary: Admin Enterprises
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/enterprises' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/enterprises', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/enterprises/{tenantId}`

- Summary: Admin Enterprise Detail
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.tenantId` (required=True):

```json
{
  "type": "string",
  "title": "Tenantid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/enterprises/{tenantId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/enterprises/{tenantId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/admin/enterprises/{tenantId}`

- Summary: Patch Enterprise
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.tenantId` (required=True):

```json
{
  "type": "string",
  "title": "Tenantid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "EnterprisePatchBody",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "title": "Status",
      "pattern": "^(active|suspended)$"
    },
    "contactEmail": {
      "title": "Contactemail",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "status": "<status>",
  "contactEmail": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/admin/enterprises/{tenantId}' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/enterprises/{tenantId}', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/financial`

- Summary: Admin Financial
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/financial' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/financial', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/financial/revenue`

- Summary: Admin Financial Revenue
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/financial/revenue' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/financial/revenue', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/logs`

- Summary: Admin Logs
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.level` (required=False):

```json
{
  "title": "Level",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(info|warning|error)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 50,
  "minimum": 1,
  "maximum": 200
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/logs' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/logs', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/system-health`

- Summary: Admin System Health
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.includeComponents` (required=False):

```json
{
  "type": "boolean",
  "title": "Includecomponents",
  "default": true
}
```
- `query.environment` (required=False):

```json
{
  "title": "Environment",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(prod|staging|dev)$"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/system-health' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/system-health', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/users`

- Summary: Admin Users
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/users' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/verifications`

- Summary: Admin Verifications
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifications' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/verifications', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/verifications/{verificationId}`

- Summary: Admin Verification Detail
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifications/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/verifications/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/verifiers`

- Summary: Admin Verifiers
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifiers' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/verifiers', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/admin/verifiers/{id}`

- Summary: Admin Verifier Detail
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.id` (required=True):

```json
{
  "type": "string",
  "title": "Id"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifiers/{id}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/admin/verifiers/{id}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

## Authentication & Session Management

### `GET /auth/.well-known/jwks.json`

- Summary: Jwks Metadata
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/auth/.well-known/jwks.json' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/.well-known/jwks.json', {
  method: 'GET',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `POST /auth/forgot-password`

- Summary: Forgot Password
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ForgotPasswordRequest",
  "required": [
    "email"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email"
    }
  }
}
```

Example payload:

```json
{
  "email": "<email>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/forgot-password' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/jwks/revoke/{kid}`

- Summary: Revoke Jwt Signing Key
- Authentication: Header `x-ontiver-admin-token` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.kid` (required=True):

```json
{
  "type": "string",
  "title": "Kid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/jwks/revoke/{kid}' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/jwks/revoke/{kid}', {
  method: 'POST',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `POST /auth/jwks/rotate`

- Summary: Rotate Jwt Signing Key
- Authentication: Header `x-ontiver-admin-token` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/jwks/rotate' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/jwks/rotate', {
  method: 'POST',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `POST /auth/login`

- Summary: Login
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "LoginRequest",
  "required": [
    "email",
    "password",
    "role",
    "authKey"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email"
    },
    "password": {
      "type": "string",
      "title": "Password"
    },
    "role": {
      "type": "string",
      "title": "Role"
    },
    "authKey": {
      "type": "string",
      "title": "Authkey"
    },
    "mfa": {
      "anyOf": [
        {
          "type": "object",
          "title": "LoginMFARequest",
          "required": [
            "method",
            "code"
          ],
          "properties": {
            "method": {
              "type": "string",
              "title": "Method"
            },
            "code": {
              "type": "string",
              "title": "Code"
            }
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "email": "<email>",
  "password": "<password>",
  "role": "<role>",
  "authKey": "<authKey>",
  "mfa": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/login' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/logout`

- Summary: Logout
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "LogoutRequest",
  "required": [
    "refreshToken"
  ],
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken"
    },
    "allSessions": {
      "type": "boolean",
      "title": "Allsessions",
      "default": false
    }
  }
}
```

Example payload:

```json
{
  "refreshToken": "<refreshToken>",
  "allSessions": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/logout' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/machine-identities`

- Summary: Create Machine Identity
- Authentication: Header `x-ontiver-admin-token` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ServiceIdentityCreateRequest",
  "required": [
    "name",
    "tenantId"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "minLength": 2,
      "maxLength": 120
    },
    "tenantId": {
      "type": "string",
      "title": "Tenantid"
    },
    "permissions": {
      "type": "array",
      "title": "Permissions",
      "items": {
        "type": "string"
      }
    }
  }
}
```

Example payload:

```json
{
  "name": "<name>",
  "tenantId": "<tenantId>",
  "permissions": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/machine-identities' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/machine-identities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/machine-identities/{identityId}/tokens/issue`

- Summary: Issue Machine Token
- Authentication: Header `x-ontiver-admin-token` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.identityId` (required=True):

```json
{
  "type": "string",
  "title": "Identityid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "ServiceTokenIssueRequest",
  "properties": {
    "ttlSeconds": {
      "title": "Ttlseconds",
      "anyOf": [
        {
          "type": "integer",
          "minimum": 60.0,
          "maximum": 86400.0
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "ttlSeconds": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/machine-identities/{identityId}/tokens/issue' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/machine-identities/{identityId}/tokens/issue', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /auth/me`

- Summary: Me
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/auth/me' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/me', {
  method: 'GET',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `GET /auth/mfa/enroll`

- Summary: Mfa Enroll
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/auth/mfa/enroll' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/mfa/enroll', {
  method: 'GET',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `POST /auth/mfa/enroll/verify`

- Summary: Mfa Enroll Verify
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "MFAEnrollVerifyRequest",
  "required": [
    "code"
  ],
  "properties": {
    "method": {
      "type": "string",
      "title": "Method",
      "default": "totp"
    },
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "method": "<method>",
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/mfa/enroll/verify' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/mfa/enroll/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/mfa/recovery-code/verify`

- Summary: Mfa Recovery Code Verify
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "MFARecoveryCodeVerifyRequest",
  "required": [
    "challengeId",
    "code"
  ],
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid"
    },
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "challengeId": "<challengeId>",
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/mfa/recovery-code/verify' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/mfa/recovery-code/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/mfa/verify`

- Summary: Mfa Verify
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "MFAVerifyRequest",
  "required": [
    "challengeId",
    "method",
    "code"
  ],
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid"
    },
    "method": {
      "type": "string",
      "title": "Method"
    },
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "challengeId": "<challengeId>",
  "method": "<method>",
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/mfa/verify' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/mfa/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/policies/{policyKey}/mode`

- Summary: Set Policy Mode
- Authentication: Header `x-ontiver-admin-token` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.policyKey` (required=True):

```json
{
  "type": "string",
  "title": "Policykey"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "PolicyModeUpdateRequest",
  "required": [
    "mode"
  ],
  "properties": {
    "mode": {
      "type": "string",
      "title": "Mode",
      "pattern": "^(enforce|monitor|off)$"
    }
  }
}
```

Example payload:

```json
{
  "mode": "<mode>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/policies/{policyKey}/mode' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/policies/{policyKey}/mode', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/refresh`

- Summary: Refresh
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "RefreshRequest",
  "required": [
    "refreshToken"
  ],
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken"
    }
  }
}
```

Example payload:

```json
{
  "refreshToken": "<refreshToken>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/refresh' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/reset-password`

- Summary: Reset Password
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ResetPasswordRequest",
  "required": [
    "token",
    "newPassword"
  ],
  "properties": {
    "token": {
      "type": "string",
      "title": "Token"
    },
    "newPassword": {
      "type": "string",
      "title": "Newpassword"
    }
  }
}
```

Example payload:

```json
{
  "token": "<token>",
  "newPassword": "<newPassword>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/reset-password' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/signup`

- Summary: Signup
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SignupRequest",
  "required": [
    "role",
    "email",
    "password",
    "consentAccepted"
  ],
  "properties": {
    "role": {
      "type": "string",
      "title": "Role"
    },
    "email": {
      "type": "string",
      "title": "Email"
    },
    "password": {
      "type": "string",
      "title": "Password"
    },
    "consentAccepted": {
      "type": "boolean",
      "title": "Consentaccepted"
    },
    "organizationName": {
      "title": "Organizationname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "contactName": {
      "title": "Contactname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "countryCode": {
      "title": "Countrycode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "registrationNumber": {
      "title": "Registrationnumber",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "verificationLicenseId": {
      "title": "Verificationlicenseid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "jurisdiction": {
      "title": "Jurisdiction",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fullName": {
      "title": "Fullname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "department": {
      "title": "Department",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "authorizationCode": {
      "title": "Authorizationcode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "role": "<role>",
  "email": "<email>",
  "password": "<password>",
  "consentAccepted": false,
  "organizationName": null,
  "contactName": null,
  "countryCode": null,
  "registrationNumber": null,
  "verificationLicenseId": null,
  "jurisdiction": null,
  "fullName": null,
  "department": null,
  "authorizationCode": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/signup' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /auth/step-up`

- Summary: Step Up
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "StepUpRequest",
  "required": [
    "code"
  ],
  "properties": {
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/auth/step-up' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/auth/step-up', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/forgot-password`

- Summary: Segmented Forgot Password
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "ForgotPasswordRequest",
  "required": [
    "email"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email"
    }
  }
}
```

Example payload:

```json
{
  "email": "<email>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/forgot-password' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/login`

- Summary: Segmented Login
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "SegmentedLoginRequest",
  "required": [
    "email",
    "password",
    "authKey"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email"
    },
    "password": {
      "type": "string",
      "title": "Password"
    },
    "role": {
      "title": "Role",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "authKey": {
      "type": "string",
      "title": "Authkey"
    },
    "mfa": {
      "anyOf": [
        {
          "type": "object",
          "title": "LoginMFARequest",
          "required": [
            "method",
            "code"
          ],
          "properties": {
            "method": {
              "type": "string",
              "title": "Method"
            },
            "code": {
              "type": "string",
              "title": "Code"
            }
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "email": "<email>",
  "password": "<password>",
  "role": null,
  "authKey": "<authKey>",
  "mfa": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/login' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/logout`

- Summary: Segmented Logout
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "LogoutRequest",
  "required": [
    "refreshToken"
  ],
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken"
    },
    "allSessions": {
      "type": "boolean",
      "title": "Allsessions",
      "default": false
    }
  }
}
```

Example payload:

```json
{
  "refreshToken": "<refreshToken>",
  "allSessions": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/logout' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /{role}/auth/me`

- Summary: Segmented Me
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/{role}/auth/me' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/me', {
  method: 'GET',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `GET /{role}/auth/mfa/enroll`

- Summary: Segmented Mfa Enroll
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/{role}/auth/mfa/enroll' \
  -H 'X-Request-Id: <uuid>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/mfa/enroll', {
  method: 'GET',
  headers: {
    // add headers if needed
  },
});
const data = await response.json();
```

### `POST /{role}/auth/mfa/enroll/verify`

- Summary: Segmented Mfa Enroll Verify
- Authentication: Header `Authorization: Bearer <access_token>` is required.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```
- `header.authorization` (required=False):

```json
{
  "title": "Authorization",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "MFAEnrollVerifyRequest",
  "required": [
    "code"
  ],
  "properties": {
    "method": {
      "type": "string",
      "title": "Method",
      "default": "totp"
    },
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "method": "<method>",
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/mfa/enroll/verify' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/mfa/enroll/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/mfa/recovery-code/verify`

- Summary: Segmented Mfa Recovery Code Verify
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "MFARecoveryCodeVerifyRequest",
  "required": [
    "challengeId",
    "code"
  ],
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid"
    },
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "challengeId": "<challengeId>",
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/mfa/recovery-code/verify' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/mfa/recovery-code/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/mfa/verify`

- Summary: Segmented Mfa Verify
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "MFAVerifyRequest",
  "required": [
    "challengeId",
    "method",
    "code"
  ],
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid"
    },
    "method": {
      "type": "string",
      "title": "Method"
    },
    "code": {
      "type": "string",
      "title": "Code"
    }
  }
}
```

Example payload:

```json
{
  "challengeId": "<challengeId>",
  "method": "<method>",
  "code": "<code>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/mfa/verify' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/mfa/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/refresh`

- Summary: Segmented Refresh
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "RefreshRequest",
  "required": [
    "refreshToken"
  ],
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken"
    }
  }
}
```

Example payload:

```json
{
  "refreshToken": "<refreshToken>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/refresh' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/reset-password`

- Summary: Segmented Reset Password
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "ResetPasswordRequest",
  "required": [
    "token",
    "newPassword"
  ],
  "properties": {
    "token": {
      "type": "string",
      "title": "Token"
    },
    "newPassword": {
      "type": "string",
      "title": "Newpassword"
    }
  }
}
```

Example payload:

```json
{
  "token": "<token>",
  "newPassword": "<newPassword>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/reset-password' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /{role}/auth/signup`

- Summary: Segmented Signup
- Authentication: Public endpoint (no bearer token required).
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.role` (required=True):

```json
{
  "type": "string",
  "title": "Role"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "SegmentedSignupRequest",
  "required": [
    "email",
    "password",
    "consentAccepted"
  ],
  "properties": {
    "role": {
      "title": "Role",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "email": {
      "type": "string",
      "title": "Email"
    },
    "password": {
      "type": "string",
      "title": "Password"
    },
    "consentAccepted": {
      "type": "boolean",
      "title": "Consentaccepted"
    },
    "organizationName": {
      "title": "Organizationname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "contactName": {
      "title": "Contactname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "countryCode": {
      "title": "Countrycode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "registrationNumber": {
      "title": "Registrationnumber",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "verificationLicenseId": {
      "title": "Verificationlicenseid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "jurisdiction": {
      "title": "Jurisdiction",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fullName": {
      "title": "Fullname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "department": {
      "title": "Department",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "authorizationCode": {
      "title": "Authorizationcode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "role": null,
  "email": "<email>",
  "password": "<password>",
  "consentAccepted": false,
  "organizationName": null,
  "contactName": null,
  "countryCode": null,
  "registrationNumber": null,
  "verificationLicenseId": null,
  "jurisdiction": null,
  "fullName": null,
  "department": null,
  "authorizationCode": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/{role}/auth/signup' \
  -H 'X-Request-Id: <uuid>' \
  -H 'Content-Type: application/json' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/{role}/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

## Billing & License

### `POST /api/v1/banking/billing/checkout/session`

- Summary: Create Checkout Session
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `license:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CheckoutSessionBody",
  "required": [
    "targetPlan",
    "billingInterval"
  ],
  "properties": {
    "targetPlan": {
      "type": "string",
      "title": "Targetplan"
    },
    "billingInterval": {
      "type": "string",
      "title": "Billinginterval"
    }
  }
}
```

Example payload:

```json
{
  "targetPlan": "<targetPlan>",
  "billingInterval": "<billingInterval>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/billing/checkout/session' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/billing/checkout/session', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/billing/plans`

- Summary: Billing Plans
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/billing/plans' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/billing/plans', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/billing/webhooks/provider`

- Summary: Billing Provider Webhook
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `header.x-provider-signature` (required=False):

```json
{
  "title": "X-Provider-Signature",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "BillingWebhookEvent",
  "required": [
    "eventId",
    "status",
    "checkoutSessionId"
  ],
  "properties": {
    "provider": {
      "type": "string",
      "title": "Provider",
      "default": "paystack"
    },
    "eventId": {
      "type": "string",
      "title": "Eventid"
    },
    "status": {
      "type": "string",
      "title": "Status"
    },
    "checkoutSessionId": {
      "type": "string",
      "title": "Checkoutsessionid"
    },
    "targetPlan": {
      "title": "Targetplan",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "provider": "<provider>",
  "eventId": "<eventId>",
  "status": "<status>",
  "checkoutSessionId": "<checkoutSessionId>",
  "targetPlan": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/billing/webhooks/provider' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/billing/webhooks/provider', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/license/plan/change`

- Summary: Change License Plan
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `license:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "LicensePlanChangeBody",
  "required": [
    "targetPlan"
  ],
  "properties": {
    "targetPlan": {
      "type": "string",
      "title": "Targetplan"
    }
  }
}
```

Example payload:

```json
{
  "targetPlan": "<targetPlan>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/license/plan/change' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/license/plan/change', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/license/usage`

- Summary: License Usage
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `license:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/license/usage' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/license/usage', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

## Dashboard Core

### `POST /api/v1/banking/account/instant-verify`

- Summary: Instant Verify
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "InstantVerifyBody",
  "required": [
    "customerId",
    "publicToken"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "publicToken": {
      "type": "string",
      "title": "Publictoken"
    },
    "accountHolderName": {
      "title": "Accountholdername",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "publicToken": "<publicToken>",
  "accountHolderName": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/account/instant-verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/instant-verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/account/micro-deposits`

- Summary: Micro Deposits
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "MicroDepositsBody",
  "required": [
    "customerId",
    "accountNumber",
    "routingNumber",
    "accountHolderName"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "accountNumber": {
      "type": "string",
      "title": "Accountnumber"
    },
    "routingNumber": {
      "type": "string",
      "title": "Routingnumber"
    },
    "accountHolderName": {
      "type": "string",
      "title": "Accountholdername"
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "accountNumber": "<accountNumber>",
  "routingNumber": "<routingNumber>",
  "accountHolderName": "<accountHolderName>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/account/micro-deposits' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/micro-deposits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/account/mono/exchange`

- Summary: Mono Exchange
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "MonoExchangeBody",
  "required": [
    "customerId",
    "code"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "code": {
      "type": "string",
      "title": "Code"
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "code": "<code>",
  "metadata": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/account/mono/exchange' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/mono/exchange', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/account/mono/{monoAccountId}/details`

- Summary: Mono Account Details
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.monoAccountId` (required=True):

```json
{
  "type": "string",
  "title": "Monoaccountid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/account/mono/{monoAccountId}/details' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/mono/{monoAccountId}/details', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/account/mono/{monoAccountId}/identity`

- Summary: Mono Account Identity
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.monoAccountId` (required=True):

```json
{
  "type": "string",
  "title": "Monoaccountid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/account/mono/{monoAccountId}/identity' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/mono/{monoAccountId}/identity', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/account/mono/{monoAccountId}/transactions`

- Summary: Mono Account Transactions
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.monoAccountId` (required=True):

```json
{
  "type": "string",
  "title": "Monoaccountid"
}
```
- `query.fromDate` (required=False):

```json
{
  "title": "Fromdate",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.toDate` (required=False):

```json
{
  "title": "Todate",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "title": "Page",
  "anyOf": [
    {
      "type": "integer"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.limit` (required=False):

```json
{
  "title": "Limit",
  "anyOf": [
    {
      "type": "integer"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/account/mono/{monoAccountId}/transactions' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/mono/{monoAccountId}/transactions', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/account/verify`

- Summary: Verify Account
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `account:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "AccountVerifyBody",
  "required": [
    "customerId",
    "accountNumber",
    "routingNumber",
    "accountHolderName",
    "verificationMethod"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "accountNumber": {
      "type": "string",
      "title": "Accountnumber"
    },
    "routingNumber": {
      "type": "string",
      "title": "Routingnumber"
    },
    "accountHolderName": {
      "type": "string",
      "title": "Accountholdername"
    },
    "verificationMethod": {
      "type": "string",
      "title": "Verificationmethod",
      "pattern": "^(micro_deposits|instant_verification|plaid)$"
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "accountNumber": "<accountNumber>",
  "routingNumber": "<routingNumber>",
  "accountHolderName": "<accountHolderName>",
  "verificationMethod": "<verificationMethod>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/account/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/account/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/alerts`

- Summary: List Alerts
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `alerts:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/alerts' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/alerts', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/alerts/{alertId}`

- Summary: Get Alert
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `alerts:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.alertId` (required=True):

```json
{
  "type": "string",
  "title": "Alertid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/alerts/{alertId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/alerts/{alertId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/alerts/{alertId}/investigate`

- Summary: Investigate Alert
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `alerts:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.alertId` (required=True):

```json
{
  "type": "string",
  "title": "Alertid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "AlertInvestigateBody",
  "properties": {
    "analyst": {
      "title": "Analyst",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "analyst": null,
  "notes": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/alerts/{alertId}/investigate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/alerts/{alertId}/investigate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/alerts/{alertId}/resolve`

- Summary: Resolve Alert
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `alerts:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.alertId` (required=True):

```json
{
  "type": "string",
  "title": "Alertid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "AlertResolveBody",
  "required": [
    "resolution"
  ],
  "properties": {
    "resolution": {
      "type": "string",
      "title": "Resolution",
      "minLength": 3
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "resolution": "<resolution>",
  "notes": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/alerts/{alertId}/resolve' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/alerts/{alertId}/resolve', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/aml/risk-score`

- Summary: Risk Score
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `aml:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "RiskScoreBody",
  "properties": {
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "customerProfile": {
      "type": "object",
      "title": "Customerprofile",
      "additionalProperties": true
    },
    "verificationResults": {
      "title": "Verificationresults",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "transactionProfile": {
      "title": "Transactionprofile",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "relationshipFactors": {
      "title": "Relationshipfactors",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "customerData": {
      "title": "Customerdata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": null,
  "customerProfile": {},
  "verificationResults": null,
  "transactionProfile": null,
  "relationshipFactors": null,
  "customerData": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/aml/risk-score' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/aml/risk-score', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/aml/transaction-monitoring`

- Summary: Transaction Monitoring
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `aml:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "TransactionMonitoringBody",
  "required": [
    "transactionId"
  ],
  "properties": {
    "transactionId": {
      "type": "string",
      "title": "Transactionid"
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "amount": {
      "title": "Amount",
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ]
    },
    "currency": {
      "title": "Currency",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "senderId": {
      "title": "Senderid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "receiverId": {
      "title": "Receiverid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "timestamp": {
      "title": "Timestamp",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "transaction": {
      "type": "object",
      "title": "Transaction",
      "additionalProperties": true
    },
    "customerRiskProfile": {
      "type": "object",
      "title": "Customerriskprofile",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "transactionId": "<transactionId>",
  "customerId": null,
  "amount": null,
  "currency": null,
  "senderId": null,
  "receiverId": null,
  "timestamp": null,
  "transaction": {},
  "customerRiskProfile": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/aml/transaction-monitoring' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/aml/transaction-monitoring', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics`

- Summary: Analytics Overview
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `analytics:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.timeRange` (required=False):

```json
{
  "type": "string",
  "title": "Timerange",
  "default": "30d",
  "pattern": "^(7d|30d|90d)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/compliance-metrics`

- Summary: Compliance Metrics
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `analytics:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/compliance-metrics' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/compliance-metrics', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/fraud-trends`

- Summary: Fraud Trends
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `analytics:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.startDate` (required=False):

```json
{
  "title": "Startdate",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.endDate` (required=False):

```json
{
  "title": "Enddate",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.groupBy` (required=False):

```json
{
  "type": "string",
  "title": "Groupby",
  "default": "month",
  "pattern": "^(day|week|month)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/fraud-trends' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/fraud-trends', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/geographic-distribution`

- Summary: Geographic Distribution Alias
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/geographic-distribution' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/geographic-distribution', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/geographical`

- Summary: Geographical Distribution
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/geographical' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/geographical', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/processing-times`

- Summary: Processing Times
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `analytics:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/processing-times' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/processing-times', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/risk-distribution`

- Summary: Risk Distribution
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `analytics:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/risk-distribution' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/risk-distribution', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/analytics/verification-stats`

- Summary: Verification Stats
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.startDate` (required=False):

```json
{
  "title": "Startdate",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.endDate` (required=False):

```json
{
  "title": "Enddate",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.groupBy` (required=False):

```json
{
  "type": "string",
  "title": "Groupby",
  "default": "month",
  "pattern": "^(day|week|month)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/verification-stats' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/analytics/verification-stats', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/api-keys`

- Summary: List Api Keys
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `api_keys:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.environment` (required=False):

```json
{
  "title": "Environment",
  "anyOf": [
    {
      "type": "string",
      "enum": [
        "production",
        "sandbox"
      ]
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.includeRevoked` (required=False):

```json
{
  "type": "boolean",
  "title": "Includerevoked",
  "default": false
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/api-keys' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/api-keys', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/api-keys/create`

- Summary: Create Api Key
- Authentication: Header `x-ontiver-admin-token` is required.
- Required permission(s) (all): `api_keys:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ApiKeyCreateBody",
  "properties": {
    "keyName": {
      "title": "Keyname",
      "anyOf": [
        {
          "type": "string",
          "minLength": 1,
          "maxLength": 128
        },
        {
          "type": "null"
        }
      ]
    },
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string",
          "minLength": 1,
          "maxLength": 128
        },
        {
          "type": "null"
        }
      ]
    },
    "permissions": {
      "type": "array",
      "title": "Permissions",
      "items": {
        "type": "string"
      }
    },
    "scopes": {
      "type": "array",
      "title": "Scopes",
      "items": {
        "type": "string"
      }
    },
    "environment": {
      "type": "string",
      "title": "Environment",
      "enum": [
        "production",
        "sandbox"
      ],
      "default": "production"
    },
    "expiresAt": {
      "title": "Expiresat",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "ipWhitelist": {
      "title": "Ipwhitelist",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "rateLimit": {
      "title": "Ratelimit",
      "anyOf": [
        {
          "type": "integer",
          "minimum": 0.0
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "keyName": null,
  "name": null,
  "permissions": [],
  "scopes": [],
  "environment": "production",
  "expiresAt": null,
  "ipWhitelist": null,
  "rateLimit": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/api-keys/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/api-keys/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/api-keys/validate/current`

- Summary: Validate Current Api Key
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/api-keys/validate/current' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/api-keys/validate/current', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `DELETE /api/v1/banking/api-keys/{keyId}`

- Summary: Revoke Api Key
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `api_keys:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.keyId` (required=True):

```json
{
  "type": "string",
  "title": "Keyid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X DELETE 'https://<host>/api/v1/banking/api-keys/{keyId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/api-keys/{keyId}', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/audit/customer/{customerId}`

- Summary: Audit By Customer
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `audit:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/customer/{customerId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/audit/customer/{customerId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/audit/export`

- Summary: Audit Export
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `audit:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "AuditExportBody",
  "properties": {
    "startDate": {
      "title": "Startdate",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "endDate": {
      "title": "Enddate",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "format": {
      "type": "string",
      "title": "Format",
      "default": "json",
      "pattern": "^(json|csv)$"
    }
  }
}
```

Example payload:

```json
{
  "startDate": null,
  "endDate": null,
  "format": "<format>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/audit/export' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/audit/export', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/audit/logs`

- Summary: List Audit Logs
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `audit:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.actorId` (required=False):

```json
{
  "title": "Actorid",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.action` (required=False):

```json
{
  "title": "Action",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.from` (required=False):

```json
{
  "title": "From",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.to` (required=False):

```json
{
  "title": "To",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/logs' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/audit/logs', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/audit/logs/search`

- Summary: Search Audit Logs
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `audit:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.from` (required=False):

```json
{
  "title": "From",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.to` (required=False):

```json
{
  "title": "To",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.entity` (required=False):

```json
{
  "title": "Entity",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.eventType` (required=False):

```json
{
  "title": "Eventtype",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/logs/search' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/audit/logs/search', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/audit/verification/{verificationId}`

- Summary: Audit By Verification
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `audit:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/verification/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/audit/verification/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/biometrics/behavioral`

- Summary: Behavioral Biometrics
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `biometrics:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "BehavioralBody",
  "required": [
    "customerId",
    "signals"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "signals": {
      "type": "object",
      "title": "Signals",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "signals": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/behavioral' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/biometrics/behavioral', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/biometrics/face-match`

- Summary: Face Match
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `biometrics:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "FaceMatchBody",
  "required": [
    "selfieImage"
  ],
  "properties": {
    "selfieImage": {
      "type": "string",
      "title": "Selfieimage",
      "minLength": 1
    },
    "idPhotoImage": {
      "title": "Idphotoimage",
      "anyOf": [
        {
          "type": "string",
          "minLength": 1
        },
        {
          "type": "null"
        }
      ]
    },
    "documentImage": {
      "title": "Documentimage",
      "anyOf": [
        {
          "type": "string",
          "minLength": 1
        },
        {
          "type": "null"
        }
      ]
    },
    "threshold": {
      "title": "Threshold",
      "anyOf": [
        {
          "type": "number",
          "minimum": 0.0,
          "maximum": 1.0
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "selfieImage": "<selfieImage>",
  "idPhotoImage": null,
  "documentImage": null,
  "threshold": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/face-match' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/biometrics/face-match', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/biometrics/fingerprint`

- Summary: Fingerprint Verification
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `biometrics:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "FingerprintBody",
  "required": [
    "customerId",
    "fingerprintTemplate"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "fingerprintTemplate": {
      "type": "string",
      "title": "Fingerprinttemplate",
      "minLength": 1
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "fingerprintTemplate": "<fingerprintTemplate>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/fingerprint' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/biometrics/fingerprint', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/biometrics/liveness`

- Summary: Liveness
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `biometrics:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "LivenessBody",
  "properties": {
    "selfieImage": {
      "title": "Selfieimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "videoUrl": {
      "title": "Videourl",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "livenessType": {
      "type": "string",
      "title": "Livenesstype",
      "default": "passive",
      "pattern": "^(passive|active)$"
    }
  }
}
```

Example payload:

```json
{
  "selfieImage": null,
  "videoUrl": null,
  "livenessType": "<livenessType>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/liveness' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/biometrics/liveness', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/biometrics/voice-verification`

- Summary: Voice Verification
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `biometrics:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "VoiceVerificationBody",
  "required": [
    "customerId",
    "voiceSample"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "voiceSample": {
      "type": "string",
      "title": "Voicesample",
      "minLength": 1
    },
    "phrase": {
      "title": "Phrase",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "voiceSample": "<voiceSample>",
  "phrase": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/voice-verification' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/biometrics/voice-verification', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/blockchain/anchor`

- Summary: Anchor Verification
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `blockchain:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "BlockchainAnchorBody",
  "required": [
    "verificationId",
    "anchorData"
  ],
  "properties": {
    "verificationId": {
      "type": "string",
      "title": "Verificationid"
    },
    "chain": {
      "type": "string",
      "title": "Chain",
      "default": "ethereum"
    },
    "anchorData": {
      "type": "object",
      "title": "Anchordata",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "verificationId": "<verificationId>",
  "chain": "<chain>",
  "anchorData": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/blockchain/anchor' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/blockchain/anchor', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/blockchain/proof`

- Summary: Get Anchor Proof
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `blockchain:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "BlockchainProofBody",
  "required": [
    "anchorId"
  ],
  "properties": {
    "anchorId": {
      "type": "string",
      "title": "Anchorid"
    }
  }
}
```

Example payload:

```json
{
  "anchorId": "<anchorId>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/blockchain/proof' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/blockchain/proof', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/blockchain/proof/{verificationId}`

- Summary: Get Proof By Verification
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `blockchain:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/blockchain/proof/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/blockchain/proof/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/bulk/verify`

- Summary: Bulk Verify
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/bulk/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/bulk/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/cases`

- Summary: List Cases
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `cases:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.assignedTo` (required=False):

```json
{
  "title": "Assignedto",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.caseType` (required=False):

```json
{
  "title": "Casetype",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 100,
  "minimum": 1,
  "maximum": 200
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/cases' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/cases', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/cases/create`

- Summary: Create Case
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `cases:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CaseCreateBody",
  "required": [
    "caseType"
  ],
  "properties": {
    "caseType": {
      "type": "string",
      "title": "Casetype"
    },
    "title": {
      "title": "Title",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "description": {
      "title": "Description",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "priority": {
      "title": "Priority",
      "default": "medium",
      "anyOf": [
        {
          "type": "string",
          "pattern": "^(low|medium|high|urgent)$"
        },
        {
          "type": "null"
        }
      ]
    },
    "entityType": {
      "title": "Entitytype",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "entityId": {
      "title": "Entityid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "alertId": {
      "title": "Alertid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "assignedTo": {
      "title": "Assignedto",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "caseType": "<caseType>",
  "title": null,
  "description": null,
  "priority": null,
  "entityType": null,
  "entityId": null,
  "alertId": null,
  "assignedTo": null,
  "metadata": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/cases/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/cases/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/cases/{caseId}`

- Summary: Get Case
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `cases:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.caseId` (required=True):

```json
{
  "type": "string",
  "title": "Caseid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/cases/{caseId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/cases/{caseId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/cases/{caseId}`

- Summary: Update Case
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `cases:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.caseId` (required=True):

```json
{
  "type": "string",
  "title": "Caseid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "CaseUpdateBody",
  "properties": {
    "title": {
      "title": "Title",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "description": {
      "title": "Description",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "priority": {
      "title": "Priority",
      "anyOf": [
        {
          "type": "string",
          "pattern": "^(low|medium|high|urgent)$"
        },
        {
          "type": "null"
        }
      ]
    },
    "status": {
      "title": "Status",
      "anyOf": [
        {
          "type": "string",
          "pattern": "^(open|in_progress|closed)$"
        },
        {
          "type": "null"
        }
      ]
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "title": null,
  "description": null,
  "priority": null,
  "status": null,
  "metadata": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/cases/{caseId}' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/cases/{caseId}', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/cases/{caseId}/assign`

- Summary: Assign Case
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `cases:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.caseId` (required=True):

```json
{
  "type": "string",
  "title": "Caseid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "CaseAssignBody",
  "required": [
    "analyst"
  ],
  "properties": {
    "analyst": {
      "type": "string",
      "title": "Analyst"
    }
  }
}
```

Example payload:

```json
{
  "analyst": "<analyst>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/cases/{caseId}/assign' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/cases/{caseId}/assign', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/cases/{caseId}/close`

- Summary: Close Case
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `cases:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.caseId` (required=True):

```json
{
  "type": "string",
  "title": "Caseid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "CaseCloseBody",
  "properties": {
    "resolution": {
      "title": "Resolution",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "resolution": null,
  "notes": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/cases/{caseId}/close' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/cases/{caseId}/close', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/compliance/ctr/create`

- Summary: Ctr Create
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `compliance:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CtrCreateBody",
  "required": [
    "requestId",
    "transaction"
  ],
  "properties": {
    "requestId": {
      "type": "string",
      "title": "Requestid"
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "transaction": {
      "type": "object",
      "title": "Transaction",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "requestId": "<requestId>",
  "customerId": null,
  "transaction": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/ctr/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/compliance/ctr/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/compliance/reports`

- Summary: List Compliance Reports
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `compliance:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.kind` (required=False):

```json
{
  "title": "Kind",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/compliance/reports' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/compliance/reports', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/compliance/reports/schedule`

- Summary: Schedule Compliance Report
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `compliance:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ComplianceReportScheduleBody",
  "required": [
    "reportType",
    "cron"
  ],
  "properties": {
    "reportType": {
      "type": "string",
      "title": "Reporttype"
    },
    "cron": {
      "type": "string",
      "title": "Cron"
    },
    "params": {
      "title": "Params",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "reportType": "<reportType>",
  "cron": "<cron>",
  "params": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/reports/schedule' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/compliance/reports/schedule', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/compliance/sar/create`

- Summary: Sar Create
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `compliance:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SarCreateBody",
  "required": [
    "requestId",
    "narrative",
    "activity"
  ],
  "properties": {
    "requestId": {
      "type": "string",
      "title": "Requestid"
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "narrative": {
      "type": "string",
      "title": "Narrative"
    },
    "activity": {
      "type": "object",
      "title": "Activity",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "requestId": "<requestId>",
  "customerId": null,
  "narrative": "<narrative>",
  "activity": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/sar/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/compliance/sar/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/compliance/sar/submit`

- Summary: Sar Submit
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `compliance:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SarSubmitBody",
  "required": [
    "reportId"
  ],
  "properties": {
    "reportId": {
      "type": "string",
      "title": "Reportid"
    },
    "submissionChannel": {
      "title": "Submissionchannel",
      "default": "electronic",
      "anyOf": [
        {
          "type": "string",
          "pattern": "^(electronic|manual)$"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "reportId": "<reportId>",
  "submissionChannel": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/sar/submit' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/compliance/sar/submit', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/credit/check`

- Summary: Credit Check
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `credit:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CreditCheckBody",
  "required": [
    "customerId",
    "personalInfo",
    "address",
    "purpose"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "personalInfo": {
      "type": "object",
      "title": "Personalinfo",
      "additionalProperties": true
    },
    "address": {
      "type": "object",
      "title": "Address",
      "additionalProperties": true
    },
    "purpose": {
      "type": "string",
      "title": "Purpose",
      "pattern": "^(loan_application|credit_card|account_opening)$"
    },
    "bureaus": {
      "type": "array",
      "title": "Bureaus",
      "items": {
        "type": "string"
      }
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "personalInfo": {},
  "address": {},
  "purpose": "<purpose>",
  "bureaus": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/credit/check' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/credit/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/credit/score`

- Summary: Credit Score
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `credit:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CreditScoreBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "bureaus": {
      "type": "array",
      "title": "Bureaus",
      "items": {
        "type": "string"
      }
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "bureaus": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/credit/score' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/credit/score', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/diagnostics/requests`

- Summary: List Request Diagnostics
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `diagnostics:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 50,
  "minimum": 1,
  "maximum": 200
}
```
- `query.cursor` (required=False):

```json
{
  "title": "Cursor",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.from` (required=False):

```json
{
  "title": "From",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.to` (required=False):

```json
{
  "title": "To",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.stage` (required=False):

```json
{
  "title": "Stage",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.requestId` (required=False):

```json
{
  "title": "Requestid",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/diagnostics/requests' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/diagnostics/requests', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/diagnostics/requests/{requestId}/cancel`

- Summary: Cancel Request Retry
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `diagnostics:cancel`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.requestId` (required=True):

```json
{
  "type": "string",
  "title": "Requestid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "CancelRequestBody",
  "properties": {
    "message": {
      "title": "Message",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "message": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/diagnostics/requests/{requestId}/cancel' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/diagnostics/requests/{requestId}/cancel', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/diagnostics/requests/{requestId}/retry`

- Summary: Retry Request
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `diagnostics:retry`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.requestId` (required=True):

```json
{
  "type": "string",
  "title": "Requestid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "RetryRequestBody",
  "properties": {
    "retryInMs": {
      "type": "integer",
      "title": "Retryinms",
      "default": 0,
      "minimum": 0.0,
      "maximum": 86400000.0
    },
    "message": {
      "title": "Message",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "retryInMs": 0,
  "message": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/diagnostics/requests/{requestId}/retry' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/diagnostics/requests/{requestId}/retry', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/did/create`

- Summary: Create Did
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DidCreateBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "method": {
      "type": "string",
      "title": "Method",
      "default": "key"
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "method": "<method>",
  "metadata": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/did/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/did/credentials/customer/{customerId}`

- Summary: List Credentials
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/did/credentials/customer/{customerId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/credentials/customer/{customerId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/did/credentials/issue`

- Summary: Issue Credential
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CredentialIssueBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "verificationId": {
      "title": "Verificationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "did": {
      "title": "Did",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "credentialType": {
      "type": "string",
      "title": "Credentialtype",
      "default": "KYC"
    },
    "schema": {
      "title": "Schema",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "claims": {
      "title": "Claims",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "expiresAt": {
      "title": "Expiresat",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "verificationId": null,
  "did": null,
  "credentialType": "<credentialType>",
  "schema": null,
  "claims": null,
  "expiresAt": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/did/credentials/issue' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/credentials/issue', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/did/credentials/present`

- Summary: Present Credential
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CredentialPresentBody",
  "required": [
    "credentialId",
    "challenge"
  ],
  "properties": {
    "credentialId": {
      "type": "string",
      "title": "Credentialid"
    },
    "challenge": {
      "type": "string",
      "title": "Challenge"
    },
    "verifier": {
      "title": "Verifier",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "credentialId": "<credentialId>",
  "challenge": "<challenge>",
  "verifier": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/did/credentials/present' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/credentials/present', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/did/credentials/verify`

- Summary: Verify Credential
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CredentialVerifyBody",
  "properties": {
    "presentationId": {
      "title": "Presentationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "presentation": {
      "title": "Presentation",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "challenge": {
      "title": "Challenge",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "presentationId": null,
  "presentation": null,
  "challenge": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/did/credentials/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/credentials/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/did/credentials/{credentialId}`

- Summary: Get Credential
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.credentialId` (required=True):

```json
{
  "type": "string",
  "title": "Credentialid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/did/credentials/{credentialId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/credentials/{credentialId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/did/verify`

- Summary: Verify Did
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DidVerifyBody",
  "required": [
    "did",
    "challenge",
    "signature"
  ],
  "properties": {
    "did": {
      "type": "string",
      "title": "Did"
    },
    "challenge": {
      "type": "string",
      "title": "Challenge"
    },
    "signature": {
      "type": "string",
      "title": "Signature"
    }
  }
}
```

Example payload:

```json
{
  "did": "<did>",
  "challenge": "<challenge>",
  "signature": "<signature>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/did/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/did/{customerId}`

- Summary: Get Did
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/did/{customerId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/did/{customerId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/disputes`

- Summary: List Disputes
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(open|investigating|resolved)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.priority` (required=False):

```json
{
  "title": "Priority",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(low|medium|high)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/disputes' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/disputes', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/disputes/{disputeId}`

- Summary: Get Dispute
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.disputeId` (required=True):

```json
{
  "type": "string",
  "title": "Disputeid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/disputes/{disputeId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/disputes/{disputeId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/disputes/{disputeId}/resolve`

- Summary: Resolve Dispute
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.disputeId` (required=True):

```json
{
  "type": "string",
  "title": "Disputeid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "DisputeResolveBody",
  "required": [
    "resolution",
    "notes"
  ],
  "properties": {
    "resolution": {
      "type": "string",
      "title": "Resolution",
      "pattern": "^(approve_refund|reject|partial)$"
    },
    "notes": {
      "type": "string",
      "title": "Notes",
      "minLength": 1,
      "maxLength": 2000
    }
  }
}
```

Example payload:

```json
{
  "resolution": "<resolution>",
  "notes": "<notes>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/disputes/{disputeId}/resolve' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/disputes/{disputeId}/resolve', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/documents/certificate/verify`

- Summary: Verify Education Certificate
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentCertificateVerifyBody",
  "required": [
    "documentType",
    "documentImage"
  ],
  "properties": {
    "documentType": {
      "type": "string",
      "title": "Documenttype"
    },
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "minLength": 1
    },
    "institutionName": {
      "title": "Institutionname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "candidateName": {
      "title": "Candidatename",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "certificateNumber": {
      "title": "Certificatenumber",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "expectedData": {
      "title": "Expecteddata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documentType": "<documentType>",
  "documentImage": "<documentImage>",
  "institutionName": null,
  "candidateName": null,
  "certificateNumber": null,
  "expectedData": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/certificate/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/certificate/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/documents/classify`

- Summary: Classify Document
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentClassifyBody",
  "required": [
    "documentImage"
  ],
  "properties": {
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "minLength": 1
    },
    "documentBackImage": {
      "title": "Documentbackimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "language": {
      "title": "Language",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documentImage": "<documentImage>",
  "documentBackImage": null,
  "language": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/classify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/classify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/documents/compare`

- Summary: Compare Documents
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentCompareBody",
  "required": [
    "documents"
  ],
  "properties": {
    "documents": {
      "type": "array",
      "title": "Documents",
      "items": {
        "type": "object",
        "title": "DocumentCompareItem",
        "required": [
          "documentImage"
        ],
        "properties": {
          "documentType": {
            "title": "Documenttype",
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "documentImage": {
            "type": "string",
            "title": "Documentimage",
            "minLength": 1
          },
          "documentBackImage": {
            "title": "Documentbackimage",
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "expectedData": {
            "title": "Expecteddata",
            "anyOf": [
              {
                "type": "object",
                "additionalProperties": true
              },
              {
                "type": "null"
              }
            ]
          },
          "useOcr": {
            "title": "Useocr",
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ]
          }
        }
      }
    },
    "fieldsToCompare": {
      "title": "Fieldstocompare",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "useOcr": {
      "title": "Useocr",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documents": [],
  "fieldsToCompare": null,
  "useOcr": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/compare' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/compare', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/documents/extract`

- Summary: Extract Document
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentExtractBody",
  "required": [
    "documentImage"
  ],
  "properties": {
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "minLength": 1
    },
    "documentType": {
      "title": "Documenttype",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "language": {
      "title": "Language",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documentImage": "<documentImage>",
  "documentType": null,
  "language": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/extract' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/extract', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/documents/signature/validate`

- Summary: Validate Document Signature
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentSignatureValidateBody",
  "required": [
    "documentType",
    "documentImage"
  ],
  "properties": {
    "documentType": {
      "type": "string",
      "title": "Documenttype"
    },
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "minLength": 1
    },
    "signatureBlock": {
      "title": "Signatureblock",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "signingCertificate": {
      "title": "Signingcertificate",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "expectedSigner": {
      "title": "Expectedsigner",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documentType": "<documentType>",
  "documentImage": "<documentImage>",
  "signatureBlock": null,
  "signingCertificate": null,
  "expectedSigner": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/signature/validate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/signature/validate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/documents/supported-types`

- Summary: Supported Types
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.country` (required=False):

```json
{
  "title": "Country",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/documents/supported-types' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/supported-types', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/documents/verify`

- Summary: Verify Document
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `documents:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentVerifyBody",
  "required": [
    "documentType",
    "documentImage"
  ],
  "properties": {
    "documentType": {
      "type": "string",
      "title": "Documenttype"
    },
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "minLength": 1
    },
    "documentBackImage": {
      "title": "Documentbackimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "issuingCountry": {
      "title": "Issuingcountry",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "expectedData": {
      "title": "Expecteddata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "useOcr": {
      "title": "Useocr",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documentType": "<documentType>",
  "documentImage": "<documentImage>",
  "documentBackImage": null,
  "issuingCountry": null,
  "expectedData": null,
  "useOcr": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/documents/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}`

- Summary: Get Bulk Email Verification Job
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.bulkJobId` (required=True):

```json
{
  "type": "string",
  "title": "Bulkjobid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results`

- Summary: List Bulk Email Verification Results
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.bulkJobId` (required=True):

```json
{
  "type": "string",
  "title": "Bulkjobid"
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 100,
  "minimum": 1,
  "maximum": 1000
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/email-verifications/bulk/upload`

- Summary: Verify Customer Emails (Bulk CSV Upload)
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body_verify_email_bulk_upload_api_v1_banking_email_verifications_bulk_upload_post",
  "required": [
    "file"
  ],
  "properties": {
    "file": {
      "type": "string",
      "title": "File",
      "format": "binary"
    }
  }
}
```

Example payload:

```json
{
  "file": "<file>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/email-verifications/bulk/upload' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/email-verifications/bulk/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/email-verifications/bulk/verify`

- Summary: Verify Customer Emails (Bulk JSON)
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/email-verifications/bulk/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/email-verifications/bulk/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/email-verifications/verify`

- Summary: Verify Customer Email (Single)
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/email-verifications/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/email-verifications/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/email-verifications/{verificationId}`

- Summary: Get Email Verification Result
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/email-verifications/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/email-verifications/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/governance/proposals`

- Summary: List Governance Proposals
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(open|closed)$"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/governance/proposals' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/governance/proposals', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/governance/proposals`

- Summary: Create Governance Proposal
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "GovernanceProposalBody",
  "required": [
    "title",
    "summary",
    "votingEndsAt"
  ],
  "properties": {
    "title": {
      "type": "string",
      "title": "Title",
      "minLength": 1,
      "maxLength": 160
    },
    "summary": {
      "type": "string",
      "title": "Summary",
      "minLength": 1,
      "maxLength": 2000
    },
    "changes": {
      "type": "array",
      "title": "Changes",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    },
    "votingEndsAt": {
      "type": "string",
      "title": "Votingendsat"
    }
  }
}
```

Example payload:

```json
{
  "title": "<title>",
  "summary": "<summary>",
  "changes": [],
  "votingEndsAt": "<votingEndsAt>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/governance/proposals' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/governance/proposals', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/governance/proposals/{proposalId}`

- Summary: Get Governance Proposal
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `admin:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.proposalId` (required=True):

```json
{
  "type": "string",
  "title": "Proposalid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/governance/proposals/{proposalId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/governance/proposals/{proposalId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/health`

- Summary: Health
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/health' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/health', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/kyb/business/directors`

- Summary: Kyb Business Directors
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyb:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "KybDirectorsBody",
  "required": [
    "business",
    "directors"
  ],
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "required": [
        "businessRef",
        "name",
        "country"
      ],
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref"
        },
        "name": {
          "type": "string",
          "title": "Name"
        },
        "country": {
          "type": "string",
          "title": "Country"
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object",
              "additionalProperties": true
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "directors": {
      "type": "array",
      "title": "Directors",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90,
      "minimum": 50.0,
      "maximum": 100.0
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "business": {},
  "directors": [],
  "matchThreshold": 0,
  "fuzzyMatching": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/directors' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyb/business/directors', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyb/business/financial-health`

- Summary: Kyb Financial Health
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyb:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "KybFinancialHealthBody",
  "required": [
    "business",
    "financials"
  ],
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "required": [
        "businessRef",
        "name",
        "country"
      ],
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref"
        },
        "name": {
          "type": "string",
          "title": "Name"
        },
        "country": {
          "type": "string",
          "title": "Country"
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object",
              "additionalProperties": true
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "financials": {
      "type": "object",
      "title": "Financials",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "business": {},
  "financials": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/financial-health' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyb/business/financial-health', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyb/business/ownership`

- Summary: Kyb Business Ownership
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyb:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "KybOwnershipBody",
  "required": [
    "business",
    "uboList"
  ],
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "required": [
        "businessRef",
        "name",
        "country"
      ],
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref"
        },
        "name": {
          "type": "string",
          "title": "Name"
        },
        "country": {
          "type": "string",
          "title": "Country"
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object",
              "additionalProperties": true
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "uboList": {
      "type": "array",
      "title": "Ubolist",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    }
  }
}
```

Example payload:

```json
{
  "business": {},
  "uboList": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/ownership' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyb/business/ownership', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyb/business/registry-check`

- Summary: Kyb Registry Check
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyb:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "KybRegistryCheckBody",
  "required": [
    "business"
  ],
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "required": [
        "businessRef",
        "name",
        "country"
      ],
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref"
        },
        "name": {
          "type": "string",
          "title": "Name"
        },
        "country": {
          "type": "string",
          "title": "Country"
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object",
              "additionalProperties": true
            },
            {
              "type": "null"
            }
          ]
        }
      }
    }
  }
}
```

Example payload:

```json
{
  "business": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/registry-check' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyb/business/registry-check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyb/business/verify`

- Summary: Kyb Business Verify
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyb:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "KybVerifyBody",
  "required": [
    "requestId",
    "business"
  ],
  "properties": {
    "requestId": {
      "type": "string",
      "title": "Requestid"
    },
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "required": [
        "businessRef",
        "name",
        "country"
      ],
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref"
        },
        "name": {
          "type": "string",
          "title": "Name"
        },
        "country": {
          "type": "string",
          "title": "Country"
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object",
              "additionalProperties": true
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "uboList": {
      "title": "Ubolist",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "callbackUrl": {
      "title": "Callbackurl",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "requestId": "<requestId>",
  "business": {},
  "uboList": null,
  "callbackUrl": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyb/business/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyc/individual/basic`

- Summary: Kyc Individual Basic
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/basic' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyc/individual/basic', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyc/individual/batch`

- Summary: Kyc Individual Batch
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/batch' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyc/individual/batch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyc/individual/enhanced`

- Summary: Kyc Individual Enhanced
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/enhanced' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyc/individual/enhanced', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/kyc/individual/verify`

- Summary: Kyc Individual Verify
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyc/individual/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/kyc/individual/{verificationId}`

- Summary: Get Kyc Status
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/kyc/individual/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyc/individual/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/kyc/individual/{verificationId}/refresh`

- Summary: Kyc Individual Refresh
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/{verificationId}/refresh' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/kyc/individual/{verificationId}/refresh', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/localization/currency-convert`

- Summary: Currency Convert
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `localization:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CurrencyConvertBody",
  "required": [
    "fromCurrency",
    "toCurrency",
    "amount"
  ],
  "properties": {
    "fromCurrency": {
      "type": "string",
      "title": "Fromcurrency",
      "minLength": 3,
      "maxLength": 3
    },
    "toCurrency": {
      "type": "string",
      "title": "Tocurrency",
      "minLength": 3,
      "maxLength": 3
    },
    "amount": {
      "type": "number",
      "title": "Amount",
      "minimum": 0.0
    }
  }
}
```

Example payload:

```json
{
  "fromCurrency": "<fromCurrency>",
  "toCurrency": "<toCurrency>",
  "amount": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/localization/currency-convert' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/localization/currency-convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/localization/regulations/{country}`

- Summary: Regulations
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `localization:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.country` (required=True):

```json
{
  "type": "string",
  "title": "Country"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/localization/regulations/{country}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/localization/regulations/{country}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/marketplace/verifiers`

- Summary: Marketplace Verifiers
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.search` (required=False):

```json
{
  "title": "Search",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.service` (required=False):

```json
{
  "title": "Service",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.rating` (required=False):

```json
{
  "title": "Rating",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.sort` (required=False):

```json
{
  "type": "string",
  "title": "Sort",
  "default": "rating:desc",
  "pattern": "^(rating:desc|rating:asc|name:asc|name:desc)$"
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/marketplace/verifiers' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/marketplace/verifiers', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/monitoring/rules`

- Summary: List Rules
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/monitoring/rules' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/monitoring/rules', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/monitoring/rules/create`

- Summary: Create Rule
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "MonitoringRuleCreateBody",
  "required": [
    "name",
    "rule"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name"
    },
    "rule": {
      "type": "object",
      "title": "Rule",
      "additionalProperties": true
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "name": "<name>",
  "rule": {},
  "active": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/monitoring/rules/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/monitoring/rules/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `DELETE /api/v1/banking/monitoring/rules/{ruleId}`

- Summary: Delete Rule
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.ruleId` (required=True):

```json
{
  "type": "string",
  "title": "Ruleid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X DELETE 'https://<host>/api/v1/banking/monitoring/rules/{ruleId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/monitoring/rules/{ruleId}', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/monitoring/rules/{ruleId}`

- Summary: Update Rule
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.ruleId` (required=True):

```json
{
  "type": "string",
  "title": "Ruleid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "MonitoringRuleUpdateBody",
  "properties": {
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "rule": {
      "title": "Rule",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "active": {
      "title": "Active",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "name": null,
  "rule": null,
  "active": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/monitoring/rules/{ruleId}' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/monitoring/rules/{ruleId}', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/notifications`

- Summary: Notifications
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.type` (required=False):

```json
{
  "title": "Type",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(alert|transaction|message|update|info)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.read` (required=False):

```json
{
  "title": "Read",
  "anyOf": [
    {
      "type": "boolean"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.sort` (required=False):

```json
{
  "type": "string",
  "title": "Sort",
  "default": "createdAt:desc",
  "pattern": "^(createdAt:desc|createdAt:asc)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/notifications' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/notifications', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/notifications/mark-all-read`

- Summary: Mark All Notifications Read
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/notifications/mark-all-read' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/notifications/mark-all-read', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/notifications/{notificationId}/read`

- Summary: Mark Notification Read
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.notificationId` (required=True):

```json
{
  "type": "string",
  "title": "Notificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/notifications/{notificationId}/read' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/notifications/{notificationId}/read', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/ongoing/disable`

- Summary: Disable Monitoring
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "OngoingDisableBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "monitoringType": {
      "type": "string",
      "title": "Monitoringtype",
      "default": "kyc"
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "monitoringType": "<monitoringType>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/ongoing/disable' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/ongoing/disable', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/ongoing/due-reviews`

- Summary: Due Reviews
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 50,
  "minimum": 1,
  "maximum": 200
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/ongoing/due-reviews' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/ongoing/due-reviews', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/ongoing/enable`

- Summary: Enable Monitoring
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "OngoingEnableBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "monitoringType": {
      "type": "string",
      "title": "Monitoringtype",
      "default": "kyc"
    },
    "frequencyDays": {
      "title": "Frequencydays",
      "default": 30,
      "anyOf": [
        {
          "type": "integer",
          "minimum": 1.0
        },
        {
          "type": "null"
        }
      ]
    },
    "nextReviewAt": {
      "title": "Nextreviewat",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "callbackUrl": {
      "title": "Callbackurl",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "monitoringType": "<monitoringType>",
  "frequencyDays": null,
  "nextReviewAt": null,
  "callbackUrl": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/ongoing/enable' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/ongoing/enable', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/ongoing/{customerId}/changes`

- Summary: Monitoring Changes
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 50,
  "minimum": 1,
  "maximum": 200
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/ongoing/{customerId}/changes' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/ongoing/{customerId}/changes', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/ongoing/{customerId}/status`

- Summary: Monitoring Status
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `monitoring:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/ongoing/{customerId}/status' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/ongoing/{customerId}/status', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/privacy/consent/record`

- Summary: Record Consent
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `privacy:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ConsentRecordBody",
  "required": [
    "customerId",
    "consentType",
    "granted"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "consentType": {
      "type": "string",
      "title": "Consenttype"
    },
    "granted": {
      "type": "boolean",
      "title": "Granted"
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "consentType": "<consentType>",
  "granted": false,
  "metadata": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/privacy/consent/record' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/privacy/consent/record', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/privacy/consent/{customerId}`

- Summary: Get Consent
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `privacy:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/privacy/consent/{customerId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/privacy/consent/{customerId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/privacy/data-deletion`

- Summary: Data Deletion
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `privacy:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DataDeletionBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "reason": {
      "title": "Reason",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "reason": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/privacy/data-deletion' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/privacy/data-deletion', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/privacy/data-export`

- Summary: Data Export
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `privacy:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DataExportBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "reason": {
      "title": "Reason",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "reason": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/privacy/data-export' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/privacy/data-export', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/reports`

- Summary: List Reports
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/reports' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/reports', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/reports/create`

- Summary: Create Report
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `reports:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ReportCreateBody",
  "required": [
    "dateRange"
  ],
  "properties": {
    "reportType": {
      "title": "Reporttype",
      "anyOf": [
        {
          "type": "string",
          "pattern": "^(verification_summary|compliance_summary|risk_distribution)$"
        },
        {
          "type": "null"
        }
      ]
    },
    "type": {
      "title": "Type",
      "anyOf": [
        {
          "type": "string",
          "pattern": "^(compliance|audit|activity)$"
        },
        {
          "type": "null"
        }
      ]
    },
    "dateRange": {
      "type": "object",
      "title": "Daterange",
      "additionalProperties": true
    },
    "filters": {
      "title": "Filters",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "format": {
      "type": "string",
      "title": "Format",
      "default": "csv",
      "pattern": "^(pdf|csv|excel)$"
    },
    "includeCharts": {
      "type": "boolean",
      "title": "Includecharts",
      "default": false
    }
  }
}
```

Example payload:

```json
{
  "reportType": null,
  "type": null,
  "dateRange": {},
  "filters": null,
  "format": "<format>",
  "includeCharts": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/reports/create' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/reports/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/reports/{reportId}`

- Summary: Get Report
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.reportId` (required=True):

```json
{
  "type": "string",
  "title": "Reportid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/reports/{reportId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/reports/{reportId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/requests`

- Summary: Verification Requests
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.type` (required=False):

```json
{
  "title": "Type",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.assigneeId` (required=False):

```json
{
  "title": "Assigneeid",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.sort` (required=False):

```json
{
  "type": "string",
  "title": "Sort",
  "default": "updatedAt:desc",
  "pattern": "^(updatedAt:desc|updatedAt:asc|createdAt:desc|createdAt:asc)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/requests' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/requests', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/requests/{verificationId}/review`

- Summary: Review Verification Request
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:write, kyc:write, verification:review`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/requests/{verificationId}/review' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/requests/{verificationId}/review', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/requests/{verificationId}/revoke`

- Summary: Revoke Verification Request
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:write, kyc:write, verification:review`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "Body",
  "additionalProperties": true
}
```

Example payload:

```json
{}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/requests/{verificationId}/revoke' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/requests/{verificationId}/revoke', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/sandbox/generate-test-data`

- Summary: Generate Test Data
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `sandbox:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SandboxGenerateBody",
  "required": [
    "scenario"
  ],
  "properties": {
    "scenario": {
      "type": "string",
      "title": "Scenario",
      "pattern": "^(customers|transactions|kyc_checks)$"
    },
    "count": {
      "type": "integer",
      "title": "Count",
      "default": 5,
      "minimum": 1.0,
      "maximum": 50.0
    }
  }
}
```

Example payload:

```json
{
  "scenario": "<scenario>",
  "count": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/sandbox/generate-test-data' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/sandbox/generate-test-data', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/adverse-media/check`

- Summary: Adverse Media Check
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "AdverseMediaBody",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "Firstname"
    },
    "lastName": {
      "type": "string",
      "title": "Lastname"
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90,
      "minimum": 0.0,
      "maximum": 100.0
    }
  }
}
```

Example payload:

```json
{
  "firstName": "<firstName>",
  "lastName": "<lastName>",
  "fuzzyMatching": false,
  "matchThreshold": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/adverse-media/check' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/adverse-media/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/adverse-media/ongoing`

- Summary: Adverse Media Ongoing
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "OngoingBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "active": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/adverse-media/ongoing' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/adverse-media/ongoing', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/pep/check`

- Summary: Pep Check
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "PepCheckBody",
  "properties": {
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "firstName": {
      "title": "Firstname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "lastName": {
      "title": "Lastname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dateOfBirth": {
      "title": "Dateofbirth",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dob": {
      "title": "Dob",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "nationality": {
      "title": "Nationality",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "country": {
      "title": "Country",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90,
      "minimum": 0.0,
      "maximum": 100.0
    }
  }
}
```

Example payload:

```json
{
  "name": null,
  "firstName": null,
  "lastName": null,
  "dateOfBirth": null,
  "dob": null,
  "nationality": null,
  "country": null,
  "fuzzyMatching": false,
  "matchThreshold": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/pep/check' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/pep/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/pep/family-associates`

- Summary: Pep Family Associates
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "PepFamilyBody",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "Firstname"
    },
    "lastName": {
      "type": "string",
      "title": "Lastname"
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90,
      "minimum": 0.0,
      "maximum": 100.0
    }
  }
}
```

Example payload:

```json
{
  "firstName": "<firstName>",
  "lastName": "<lastName>",
  "fuzzyMatching": false,
  "matchThreshold": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/pep/family-associates' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/pep/family-associates', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/pep/ongoing`

- Summary: Pep Ongoing
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "OngoingBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "active": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/pep/ongoing' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/pep/ongoing', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/sanctions/check`

- Summary: Sanctions Check
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SanctionsCheckBody",
  "properties": {
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "firstName": {
      "title": "Firstname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "lastName": {
      "title": "Lastname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dateOfBirth": {
      "title": "Dateofbirth",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dob": {
      "title": "Dob",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "nationality": {
      "title": "Nationality",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "country": {
      "title": "Country",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90,
      "minimum": 0.0,
      "maximum": 100.0
    }
  }
}
```

Example payload:

```json
{
  "name": null,
  "firstName": null,
  "lastName": null,
  "dateOfBirth": null,
  "dob": null,
  "nationality": null,
  "country": null,
  "fuzzyMatching": false,
  "matchThreshold": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/sanctions/check' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/sanctions/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/screening/sanctions/lists`

- Summary: Sanctions Lists
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/screening/sanctions/lists' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/sanctions/lists', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/sanctions/ongoing`

- Summary: Sanctions Ongoing
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `screening:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "OngoingBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "active": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/sanctions/ongoing' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/sanctions/ongoing', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/screening/{screeningType}/ongoing`

- Summary: Screening Ongoing
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.screeningType` (required=True):

```json
{
  "type": "string",
  "title": "Screeningtype"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "OngoingBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "active": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/{screeningType}/ongoing' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/screening/{screeningType}/ongoing', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/source-of-funds/analyze`

- Summary: Analyze Source Of Funds
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `source_of_funds:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SourceOfFundsAnalyzeBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "lookbackDays": {
      "type": "integer",
      "title": "Lookbackdays",
      "default": 90,
      "minimum": 1.0
    },
    "transactions": {
      "title": "Transactions",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "lookbackDays": 0,
  "transactions": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/source-of-funds/analyze' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/source-of-funds/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/source-of-funds/verify`

- Summary: Verify Source Of Funds
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `source_of_funds:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SourceOfFundsVerifyBody",
  "required": [
    "customerId",
    "amount",
    "claimedSource"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "transactionId": {
      "title": "Transactionid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "amount": {
      "type": "number",
      "title": "Amount"
    },
    "claimedSource": {
      "type": "string",
      "title": "Claimedsource",
      "pattern": "^(employment|investment|inheritance|gift|business_sale|loan)$"
    },
    "supportingDocuments": {
      "type": "array",
      "title": "Supportingdocuments",
      "items": {
        "type": "object",
        "title": "SupportingDocument",
        "required": [
          "type",
          "fileUrl"
        ],
        "properties": {
          "type": {
            "type": "string",
            "title": "Type"
          },
          "fileUrl": {
            "type": "string",
            "title": "Fileurl"
          }
        }
      }
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "transactionId": null,
  "amount": 0,
  "claimedSource": "<claimedSource>",
  "supportingDocuments": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/source-of-funds/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/source-of-funds/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/source-of-wealth/verify`

- Summary: Verify Source Of Wealth
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `source_of_wealth:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "SourceOfWealthVerifyBody",
  "required": [
    "customerId"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "declaredSources": {
      "type": "array",
      "title": "Declaredsources",
      "items": {
        "type": "string"
      }
    },
    "supportingDocuments": {
      "title": "Supportingdocuments",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "declaredSources": [],
  "supportingDocuments": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/source-of-wealth/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/source-of-wealth/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/source-of-wealth/{customerId}/assessment`

- Summary: Get Source Of Wealth Assessment
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `source_of_wealth:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.customerId` (required=True):

```json
{
  "type": "string",
  "title": "Customerid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/source-of-wealth/{customerId}/assessment' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/source-of-wealth/{customerId}/assessment', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/transactions/screen`

- Summary: Transaction Screen
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `transactions:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "TransactionScreenBody",
  "required": [
    "transactionId",
    "transaction"
  ],
  "properties": {
    "transactionId": {
      "type": "string",
      "title": "Transactionid"
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "transaction": {
      "type": "object",
      "title": "Transaction",
      "additionalProperties": true
    },
    "customerRiskProfile": {
      "title": "Customerriskprofile",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "rules": {
      "title": "Rules",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": true
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "transactionId": "<transactionId>",
  "customerId": null,
  "transaction": {},
  "customerRiskProfile": null,
  "rules": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/transactions/screen' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/transactions/screen', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/translation/document`

- Summary: Translate Document
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `translation:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "DocumentTranslationBody",
  "required": [
    "documentText",
    "sourceLang",
    "targetLang"
  ],
  "properties": {
    "documentText": {
      "type": "string",
      "title": "Documenttext",
      "minLength": 1
    },
    "sourceLang": {
      "type": "string",
      "title": "Sourcelang",
      "minLength": 2,
      "maxLength": 8
    },
    "targetLang": {
      "type": "string",
      "title": "Targetlang",
      "minLength": 2,
      "maxLength": 8
    },
    "format": {
      "title": "Format",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "documentText": "<documentText>",
  "sourceLang": "<sourceLang>",
  "targetLang": "<targetLang>",
  "format": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/translation/document' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/translation/document', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/translation/text`

- Summary: Translate Text
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `translation:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "TextTranslationBody",
  "required": [
    "text",
    "sourceLang",
    "targetLang"
  ],
  "properties": {
    "text": {
      "type": "string",
      "title": "Text",
      "minLength": 1
    },
    "sourceLang": {
      "type": "string",
      "title": "Sourcelang",
      "minLength": 2,
      "maxLength": 8
    },
    "targetLang": {
      "type": "string",
      "title": "Targetlang",
      "minLength": 2,
      "maxLength": 8
    }
  }
}
```

Example payload:

```json
{
  "text": "<text>",
  "sourceLang": "<sourceLang>",
  "targetLang": "<targetLang>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/translation/text' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/translation/text', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/user/verifications`

- Summary: User Verifications
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(pending|verified|rejected|requires_action|in_progress|review_needed|not_found)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.sort` (required=False):

```json
{
  "type": "string",
  "title": "Sort",
  "default": "updatedAt:desc",
  "pattern": "^(createdAt:desc|createdAt:asc|updatedAt:desc|updatedAt:asc)$"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/user/verifications' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/user/verifications', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/user/wallet`

- Summary: User Wallet
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/user/wallet' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/user/wallet', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verification/workflows/queue`

- Summary: Workflow Queue
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(pending|in_progress|manual_review|completed|rejected|verified)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.domain` (required=False):

```json
{
  "title": "Domain",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(academic|financial|general|mixed)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verification/workflows/queue' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verification/workflows/queue', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verification/workflows/summary`

- Summary: Workflow Summary
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verification/workflows/summary' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verification/workflows/summary', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/verification/workflows/{verificationId}/claim`

- Summary: Claim Workflow
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verification/workflows/{verificationId}/claim' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verification/workflows/{verificationId}/claim', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/verification/workflows/{verificationId}/release`

- Summary: Release Workflow
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verification/workflows/{verificationId}/release' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verification/workflows/{verificationId}/release', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/verification/workflows/{verificationId}/status`

- Summary: Update Workflow Status
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "WorkflowStatusUpdateBody",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "title": "Status",
      "pattern": "^(pending|in_progress|manual_review|completed|rejected|verified)$"
    },
    "overallResult": {
      "title": "Overallresult",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "status": "<status>",
  "overallResult": null,
  "notes": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/verification/workflows/{verificationId}/status' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verification/workflows/{verificationId}/status', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/verification/workflows/{verificationId}/timeline`

- Summary: Workflow Timeline
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verification/workflows/{verificationId}/timeline' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verification/workflows/{verificationId}/timeline', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/watchlist`

- Summary: List Watchlist
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `watchlist:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.riskLevel` (required=False):

```json
{
  "title": "Risklevel",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/watchlist' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/watchlist', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/watchlist/add`

- Summary: Add Watchlist
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `watchlist:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "WatchlistAddBody",
  "required": [
    "customerId",
    "reason"
  ],
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid"
    },
    "reason": {
      "type": "string",
      "title": "Reason"
    },
    "riskLevel": {
      "type": "string",
      "title": "Risklevel",
      "default": "medium",
      "pattern": "^(low|medium|high)$"
    },
    "sources": {
      "title": "Sources",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "customerId": "<customerId>",
  "reason": "<reason>",
  "riskLevel": "<riskLevel>",
  "sources": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/watchlist/add' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/watchlist/add', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/webhooks`

- Summary: List Webhooks
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `webhooks:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.active` (required=False):

```json
{
  "title": "Active",
  "anyOf": [
    {
      "type": "boolean"
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/webhooks' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/webhooks/register`

- Summary: Register Webhook
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `webhooks:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "WebhookRegisterBody",
  "properties": {
    "webhookUrl": {
      "title": "Webhookurl",
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "minLength": 1,
          "maxLength": 2083
        },
        {
          "type": "null"
        }
      ]
    },
    "url": {
      "title": "Url",
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "minLength": 1,
          "maxLength": 2083
        },
        {
          "type": "null"
        }
      ]
    },
    "events": {
      "type": "array",
      "title": "Events",
      "items": {
        "type": "string"
      }
    },
    "secret": {
      "title": "Secret",
      "anyOf": [
        {
          "type": "string",
          "minLength": 8,
          "maxLength": 256
        },
        {
          "type": "null"
        }
      ]
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```

Example payload:

```json
{
  "webhookUrl": null,
  "url": null,
  "events": [],
  "secret": null,
  "active": false
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/register' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks/register', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/webhooks/retries`

- Summary: Webhook Retries
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `webhooks:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/webhooks/retries' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks/retries', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/webhooks/test`

- Summary: Test Webhook
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `webhooks:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "WebhookTestBody",
  "required": [
    "eventType"
  ],
  "properties": {
    "webhookId": {
      "title": "Webhookid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "webhookUrl": {
      "title": "Webhookurl",
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "minLength": 1,
          "maxLength": 2083
        },
        {
          "type": "null"
        }
      ]
    },
    "eventType": {
      "type": "string",
      "title": "Eventtype"
    },
    "payload": {
      "title": "Payload",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "webhookId": null,
  "webhookUrl": null,
  "eventType": "<eventType>",
  "payload": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/test' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks/test', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `DELETE /api/v1/banking/webhooks/{webhookId}`

- Summary: Delete Webhook
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `webhooks:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.webhookId` (required=True):

```json
{
  "type": "string",
  "title": "Webhookid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X DELETE 'https://<host>/api/v1/banking/webhooks/{webhookId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks/{webhookId}', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/webhooks/{webhookId}/rotate-secret`

- Summary: Rotate Webhook Secret
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `webhooks:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.webhookId` (required=True):

```json
{
  "type": "string",
  "title": "Webhookid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/{webhookId}/rotate-secret' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks/{webhookId}/rotate-secret', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/webhooks/{webhookId}/test`

- Summary: Test Webhook By Id
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.webhookId` (required=True):

```json
{
  "type": "string",
  "title": "Webhookid"
}
```

#### Request Body
```json
{
  "type": "object",
  "title": "WebhookTestBody",
  "required": [
    "eventType"
  ],
  "properties": {
    "webhookId": {
      "title": "Webhookid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "webhookUrl": {
      "title": "Webhookurl",
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "minLength": 1,
          "maxLength": 2083
        },
        {
          "type": "null"
        }
      ]
    },
    "eventType": {
      "type": "string",
      "title": "Eventtype"
    },
    "payload": {
      "title": "Payload",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "webhookId": null,
  "webhookUrl": null,
  "eventType": "<eventType>",
  "payload": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/{webhookId}/test' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/webhooks/{webhookId}/test', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/zk-proof/circuits`

- Summary: Get Zk Circuits
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/zk-proof/circuits' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/circuits', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/zk-proof/disclose`

- Summary: Disclose Proof
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ZkDiscloseBody",
  "required": [
    "proofId"
  ],
  "properties": {
    "proofId": {
      "type": "string",
      "title": "Proofid"
    },
    "fields": {
      "title": "Fields",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "proofId": "<proofId>",
  "fields": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/disclose' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/disclose', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/zk-proof/generate`

- Summary: Generate Proof
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ZkGenerateBody",
  "required": [
    "proofType",
    "statement"
  ],
  "properties": {
    "proofType": {
      "type": "string",
      "title": "Prooftype",
      "minLength": 1,
      "maxLength": 64
    },
    "verificationId": {
      "title": "Verificationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "statement": {
      "type": "object",
      "title": "Statement",
      "additionalProperties": true
    },
    "witness": {
      "title": "Witness",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "publicSignals": {
      "title": "Publicsignals",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "disclosureFields": {
      "title": "Disclosurefields",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "proofType": "<proofType>",
  "verificationId": null,
  "statement": {},
  "witness": null,
  "publicSignals": null,
  "disclosureFields": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/generate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/zk-proof/noir/generate`

- Summary: Generate Noir Claim
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ZkNoirGenerateBody",
  "required": [
    "circuitId",
    "privateInputs",
    "publicInputs"
  ],
  "properties": {
    "circuitId": {
      "type": "string",
      "title": "Circuitid",
      "minLength": 1,
      "maxLength": 64
    },
    "verificationId": {
      "title": "Verificationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "privateInputs": {
      "type": "object",
      "title": "Privateinputs",
      "additionalProperties": true
    },
    "publicInputs": {
      "type": "object",
      "title": "Publicinputs",
      "additionalProperties": true
    },
    "submittedData": {
      "title": "Submitteddata",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "publicSignals": {
      "title": "Publicsignals",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    },
    "disclosureFields": {
      "title": "Disclosurefields",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "verifierTarget": {
      "type": "string",
      "title": "Verifiertarget",
      "default": "evm",
      "pattern": "^(evm|noir-recursive)$"
    }
  }
}
```

Example payload:

```json
{
  "circuitId": "<circuitId>",
  "verificationId": null,
  "privateInputs": {},
  "publicInputs": {},
  "submittedData": null,
  "publicSignals": null,
  "disclosureFields": null,
  "verifierTarget": "<verifierTarget>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/noir/generate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/noir/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/zk-proof/noir/toolchain`

- Summary: Get Noir Toolchain
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/zk-proof/noir/toolchain' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/noir/toolchain', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/zk-proof/noir/verify`

- Summary: Verify Noir Claim
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ZkNoirVerifyBody",
  "properties": {
    "proofId": {
      "title": "Proofid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "circuitId": {
      "title": "Circuitid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "proofData": {
      "title": "Proofdata",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "publicInputsData": {
      "title": "Publicinputsdata",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "verificationKeyData": {
      "title": "Verificationkeydata",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "proofId": null,
  "circuitId": null,
  "proofData": null,
  "publicInputsData": null,
  "verificationKeyData": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/noir/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/noir/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/zk-proof/verification/{verificationId}`

- Summary: Get Verification Proof
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/zk-proof/verification/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/verification/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/zk-proof/verify`

- Summary: Verify Proof
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `zk:read`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ZkVerifyBody",
  "required": [
    "proofId"
  ],
  "properties": {
    "proofId": {
      "type": "string",
      "title": "Proofid"
    },
    "proof": {
      "title": "Proof",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "proofId": "<proofId>",
  "proof": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/verify' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/zk-proof/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

## Organization Settings

### `GET /api/v1/banking/api/settings`

- Summary: Get Api Settings
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `api_settings:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/api/settings' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/api/settings', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/api/settings`

- Summary: Patch Api Settings
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `api_settings:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "ApiSettingsPatchBody",
  "required": [
    "autoRotateSecrets",
    "ipWhitelistEnabled"
  ],
  "properties": {
    "autoRotateSecrets": {
      "type": "boolean",
      "title": "Autorotatesecrets"
    },
    "ipWhitelistEnabled": {
      "type": "boolean",
      "title": "Ipwhitelistenabled"
    },
    "allowedIps": {
      "type": "array",
      "title": "Allowedips",
      "items": {
        "type": "string"
      }
    }
  }
}
```

Example payload:

```json
{
  "autoRotateSecrets": false,
  "ipWhitelistEnabled": false,
  "allowedIps": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/api/settings' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/api/settings', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/settings/company`

- Summary: Get Company Settings
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `settings:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/settings/company' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/settings/company', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/settings/company`

- Summary: Patch Company Settings
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `settings:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "CompanySettingsPatchBody",
  "required": [
    "companyName",
    "email"
  ],
  "properties": {
    "companyName": {
      "type": "string",
      "title": "Companyname",
      "minLength": 1,
      "maxLength": 160
    },
    "email": {
      "type": "string",
      "title": "Email"
    },
    "industry": {
      "title": "Industry",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "website": {
      "title": "Website",
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "minLength": 1,
          "maxLength": 2083
        },
        {
          "type": "null"
        }
      ]
    },
    "taxId": {
      "title": "Taxid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "phone": {
      "title": "Phone",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "address": {
      "title": "Address",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notifications": {
      "title": "Notifications",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": {
            "type": "boolean"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "security": {
      "title": "Security",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": true
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "companyName": "<companyName>",
  "email": "<email>",
  "industry": null,
  "website": null,
  "taxId": null,
  "phone": null,
  "address": null,
  "notifications": null,
  "security": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/settings/company' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/settings/company', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/settings/company/logo`

- Summary: Upload Company Logo
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `settings:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "Body_upload_company_logo_api_v1_banking_settings_company_logo_post",
  "required": [
    "file"
  ],
  "properties": {
    "file": {
      "type": "string",
      "title": "File",
      "format": "binary"
    }
  }
}
```

Example payload:

```json
{
  "file": "<file>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/settings/company/logo' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/settings/company/logo', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

## Risk & Onboarding

### `GET /api/v1/banking/onboarding/bulk/errors/{validationId}`

- Summary: Onboarding Bulk Errors
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.validationId` (required=True):

```json
{
  "type": "string",
  "title": "Validationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/onboarding/bulk/errors/{validationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/onboarding/bulk/errors/{validationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/onboarding/bulk/import`

- Summary: Onboarding Bulk Import
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "BulkOnboardingBody",
  "properties": {
    "items": {
      "type": "array",
      "title": "Items",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    }
  }
}
```

Example payload:

```json
{
  "items": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/onboarding/bulk/import' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/onboarding/bulk/import', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/onboarding/bulk/validate`

- Summary: Onboarding Bulk Validate
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `kyc:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "BulkOnboardingBody",
  "properties": {
    "items": {
      "type": "array",
      "title": "Items",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    }
  }
}
```

Example payload:

```json
{
  "items": []
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/onboarding/bulk/validate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/onboarding/bulk/validate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/risk/sandbox/report`

- Summary: Risk Sandbox Report
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `sandbox:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/risk/sandbox/report' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/risk/sandbox/report', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/risk/sandbox/simulate`

- Summary: Risk Sandbox Simulate
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `sandbox:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "RiskSandboxBody",
  "properties": {
    "customerProfile": {
      "type": "object",
      "title": "Customerprofile",
      "additionalProperties": true
    },
    "weights": {
      "type": "object",
      "title": "Weights",
      "additionalProperties": true
    }
  }
}
```

Example payload:

```json
{
  "customerProfile": {},
  "weights": {}
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/risk/sandbox/simulate' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/risk/sandbox/simulate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

## Team Management

### `POST /api/v1/banking/team/invitations`

- Summary: Create Team Invitation
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `team:invite`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "TeamInviteBody",
  "required": [
    "email",
    "role"
  ],
  "properties": {
    "email": {
      "type": "string",
      "title": "Email"
    },
    "role": {
      "type": "string",
      "title": "Role"
    },
    "message": {
      "title": "Message",
      "anyOf": [
        {
          "type": "string",
          "maxLength": 1000
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "email": "<email>",
  "role": "<role>",
  "message": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/team/invitations' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/team/invitations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/team/invitations/accept`

- Summary: Accept Team Invitation
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "InvitationAcceptBody",
  "required": [
    "token"
  ],
  "properties": {
    "token": {
      "type": "string",
      "title": "Token",
      "minLength": 32
    }
  }
}
```

Example payload:

```json
{
  "token": "<token>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/team/invitations/accept' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/team/invitations/accept', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/team/invitations/{invitationId}/resend`

- Summary: Resend Team Invitation
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `team:invite`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- `path.invitationId` (required=True):

```json
{
  "type": "string",
  "title": "Invitationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/team/invitations/{invitationId}/resend' \
  -H 'Authorization: Bearer <token>' \
  -H 'Idempotency-Key: <uuid-v4>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/team/invitations/{invitationId}/resend', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Idempotency-Key': '<uuid-v4>'
  },
});
const data = await response.json();
```

## Verifier Workspace

### `GET /api/v1/banking/verifier/active`

- Summary: Verifier Active
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/active' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/active', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/completed`

- Summary: Verifier Completed
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/completed' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/completed', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/earnings`

- Summary: Verifier Earnings
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/earnings' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/earnings', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/help`

- Summary: Verifier Help
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/help' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/help', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/help/articles`

- Summary: Verifier Help Articles
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/help/articles' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/help/articles', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/help/tickets`

- Summary: List Help Tickets
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/help/tickets' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/help/tickets', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/verifier/help/tickets`

- Summary: Create Help Ticket
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:write, verification:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "HelpTicketBody",
  "required": [
    "subject",
    "message"
  ],
  "properties": {
    "subject": {
      "type": "string",
      "title": "Subject",
      "minLength": 3,
      "maxLength": 160
    },
    "message": {
      "type": "string",
      "title": "Message",
      "minLength": 5,
      "maxLength": 5000
    }
  }
}
```

Example payload:

```json
{
  "subject": "<subject>",
  "message": "<message>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/help/tickets' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/help/tickets', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/verifier/issue-credential`

- Summary: Verifier Issue Credential
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `did:write`
- Idempotency: Supported via `Idempotency-Key`.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "VerifierIssueCredentialBody",
  "required": [
    "verificationId",
    "recipientDid",
    "credentialType"
  ],
  "properties": {
    "verificationId": {
      "type": "string",
      "title": "Verificationid"
    },
    "recipientDid": {
      "type": "string",
      "title": "Recipientdid"
    },
    "credentialType": {
      "type": "string",
      "title": "Credentialtype"
    },
    "data": {
      "type": "object",
      "title": "Data",
      "additionalProperties": true
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "verificationId": "<verificationId>",
  "recipientDid": "<recipientDid>",
  "credentialType": "<credentialType>",
  "data": {},
  "notes": null
}
```

#### Responses
- `201`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/issue-credential' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/issue-credential', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/jobs`

- Summary: Verifier Jobs
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.status` (required=False):

```json
{
  "title": "Status",
  "anyOf": [
    {
      "type": "string",
      "pattern": "^(pending|in_progress|manual_review|completed|rejected|verified)$"
    },
    {
      "type": "null"
    }
  ]
}
```
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/jobs' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/jobs', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/jobs/{verificationId}`

- Summary: Verifier Job Detail
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/jobs/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/jobs/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/notifications`

- Summary: Verifier Notifications
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (any): `admin:read, kyc:read, verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/notifications' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/notifications', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/profile`

- Summary: Verifier Profile
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/profile' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/profile', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `PATCH /api/v1/banking/verifier/profile`

- Summary: Patch Verifier Profile
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "VerifierProfilePatchBody",
  "properties": {
    "title": {
      "title": "Title",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "description": {
      "title": "Description",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "website": {
      "title": "Website",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "location": {
      "title": "Location",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "languages": {
      "title": "Languages",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "specializations": {
      "title": "Specializations",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```

Example payload:

```json
{
  "title": null,
  "description": null,
  "website": null,
  "location": null,
  "languages": null,
  "specializations": null
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X PATCH 'https://<host>/api/v1/banking/verifier/profile' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/reputation`

- Summary: Verifier Reputation
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/reputation' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/reputation', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/review/{verificationId}`

- Summary: Verifier Review Detail
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- `path.verificationId` (required=True):

```json
{
  "type": "string",
  "title": "Verificationid"
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/review/{verificationId}' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/review/{verificationId}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/reviews`

- Summary: Verifier Reviews
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- `query.page` (required=False):

```json
{
  "type": "integer",
  "title": "Page",
  "default": 1,
  "minimum": 1
}
```
- `query.limit` (required=False):

```json
{
  "type": "integer",
  "title": "Limit",
  "default": 20,
  "minimum": 1,
  "maximum": 100
}
```
- `query.rating` (required=False):

```json
{
  "title": "Rating",
  "anyOf": [
    {
      "type": "integer",
      "minimum": 1,
      "maximum": 5
    },
    {
      "type": "null"
    }
  ]
}
```

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/reviews' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/reviews', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `GET /api/v1/banking/verifier/staking`

- Summary: Verifier Staking
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:read`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
- None

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```

#### cURL Example

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/staking' \
  -H 'Authorization: Bearer <token>'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/staking', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  },
});
const data = await response.json();
```

### `POST /api/v1/banking/verifier/staking/actions`

- Summary: Verifier Staking Action
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "StakingActionBody",
  "required": [
    "action"
  ],
  "properties": {
    "action": {
      "type": "string",
      "title": "Action",
      "pattern": "^(stake|unstake|claim)$"
    },
    "amount": {
      "type": "number",
      "title": "Amount",
      "default": 0,
      "minimum": 0.0
    }
  }
}
```

Example payload:

```json
{
  "action": "<action>",
  "amount": 0
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/staking/actions' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/staking/actions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/verifier/withdraw`

- Summary: Create Verifier Withdrawal Alias
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "WithdrawalBody",
  "required": [
    "amount",
    "destinationId"
  ],
  "properties": {
    "amount": {
      "type": "number",
      "title": "Amount"
    },
    "currency": {
      "type": "string",
      "title": "Currency",
      "default": "USD",
      "minLength": 3,
      "maxLength": 8
    },
    "destinationId": {
      "type": "string",
      "title": "Destinationid",
      "minLength": 2,
      "maxLength": 128
    }
  }
}
```

Example payload:

```json
{
  "amount": 0,
  "currency": "<currency>",
  "destinationId": "<destinationId>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/withdraw' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/withdraw', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```

### `POST /api/v1/banking/verifier/withdrawals`

- Summary: Create Verifier Withdrawal
- Authentication: Header `Authorization: Bearer <token>` is required. Token can be a banking API key, auth access token, or service token.
- Required permission(s) (all): `verification:write`
- Idempotency: Not explicitly idempotent.

#### Parameters
- None

#### Request Body
```json
{
  "type": "object",
  "title": "WithdrawalBody",
  "required": [
    "amount",
    "destinationId"
  ],
  "properties": {
    "amount": {
      "type": "number",
      "title": "Amount"
    },
    "currency": {
      "type": "string",
      "title": "Currency",
      "default": "USD",
      "minLength": 3,
      "maxLength": 8
    },
    "destinationId": {
      "type": "string",
      "title": "Destinationid",
      "minLength": 2,
      "maxLength": 128
    }
  }
}
```

Example payload:

```json
{
  "amount": 0,
  "currency": "<currency>",
  "destinationId": "<destinationId>"
}
```

#### Responses
- `200`: Successful Response
  - `application/json` schema:

```json
{}
```
- `422`: Validation Error
  - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            }
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```

#### cURL Example

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/withdrawals' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"replace-with-request-body"}'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('https://<host>/api/v1/banking/verifier/withdrawals', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
    'Idempotency-Key': '<uuid-v4>'
  },
  body: JSON.stringify({
    example: 'replace-with-request-body'
  })
});
const data = await response.json();
```
