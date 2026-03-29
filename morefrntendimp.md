# Dashboard API Component Mapping and Noir/ZK Integration Reference

## 1. Purpose

This document maps the live backend API surface to the frontend dashboard after the recent privacy-layer, Noir, and zero-knowledge changes.

It is written for frontend, product, and platform engineers who need one implementation reference for:

- dashboard-to-endpoint mapping
- request and response contracts
- auth and rate-limit behavior
- polling and real-time update strategy
- Noir and privacy-proof handling
- admin/system-health monitoring

This guide is based on the current implemented backend routes in:

- `app.py`
- `banking/api.py`
- `banking/auth_api.py`
- `banking/routers/*.py`
- `verification/api.py`

## 2. Base URLs and Namespaces

### 2.1 Production Base URL

Use the Render production URL you deploy from. Existing docs currently reference:

- `https://livelinesscheck-sucf.onrender.com`

Use environment-specific values in frontend config:

```ts
type ApiConfig = {
  appBaseUrl: string;
  bankingBaseUrl: string;
  verificationBaseUrl: string;
};

const config: ApiConfig = {
  appBaseUrl: "https://verzaml-verification.onrender.com",
  bankingBaseUrl: "https://verzaml-verification.onrender.com/api/v1/banking",
  verificationBaseUrl: "https://verzaml-verification.onrender.com/verification",
};
```

### 2.2 Namespace Summary

| Namespace | Purpose | Frontend Usage |
|---|---|---|
| `/auth` and `/{role}/auth/*` | user/admin/verifier/enterprise authentication | login, signup, MFA, refresh, profile |
| `/api/v1/banking/*` | main product API | dashboard, KYC, admin, analytics, privacy, Noir |
| `/verification/*` | raw primitive verification endpoints | hosted/demo flows, browser capture, mobile liveness |
| `/health` | service liveness | deployment health checks |

## 3. Global Contracts

### 3.1 Banking API Auth

Banking routes use:

```http
Authorization: Bearer <banking_api_key_or_auth_access_token>
```

Accepted bearer token types:

- banking API key
- auth JWT access token

### 3.2 Verification Primitive Auth

Verification primitive endpoints use:

- `X-API-Key: <legacy_api_key>` for direct `/verification/*` access when configured
- `X-Proxy-Token: <short-lived-token>` for browser-safe proxy flows

### 3.3 Required/Recommended Headers

| Header | Required | Applies To | Notes |
|---|---|---|---|
| `Authorization` | yes | `/api/v1/banking/*`, `/auth/me` | bearer API key or auth token |
| `Idempotency-Key` | recommended | POST, PATCH, DELETE banking routes | safe retries |
| `Content-Type: application/json` | yes | JSON body routes | omit for multipart upload routes |
| `X-Request-Id` | optional | all routes | request tracing |
| `X-Correlation-Id` | optional | banking routes | echoed by middleware |
| `X-API-Key` | conditional | `/verification/*` | raw verification namespace |
| `X-Proxy-Token` | required for proxy routes | `/verification/proxy/*` | browser-safe token |

### 3.4 Success Envelope

#### Banking APIs

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-28T12:00:00Z"
}
```

#### Auth APIs

```json
{
  "success": true,
  "data": {},
  "requestId": "req_123"
}
```

#### Verification Primitive APIs

Most primitive verification endpoints return direct payloads or typed response models rather than the banking envelope.

### 3.5 Error Envelope

#### Banking/Auth Validation Error

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email",
        "type": "value_error"
      }
    ]
  },
  "requestId": "req_123"
}
```

#### Banking/Auth Domain Error

```json
{
  "success": false,
  "error": {
    "code": "rate_limited",
    "message": "Too many login attempts. Try again in 120 seconds.",
    "details": [
      {
        "retryAfterSeconds": 120,
        "limit": 10,
        "windowSeconds": 300
      }
    ]
  },
  "requestId": "req_123"
}
```

#### Verification Primitive Error

```json
{
  "detail": "Invalid image"
}
```

### 3.6 Status Codes

| HTTP | Meaning | Frontend Action |
|---|---|---|
| `200` | success | consume payload |
| `201` | resource created | persist identifiers and continue |
| `202` | MFA challenge or async accepted | route to next step |
| `204` | no-content success | treat as success without body |
| `400` | validation/domain issue | highlight fields |
| `401` | invalid token/credentials | sign in again or refresh once |
| `403` | permission/IP/policy denied | block UI path |
| `404` | not found | show missing/empty state |
| `409` | conflict | duplicate signup/email or resource collision |
| `423` | account locked | show lockout UX |
| `429` | rate-limited | respect retry info, backoff |
| `500` | internal error | show recoverable error |
| `503` | dependency/toolchain unavailable | show service degraded |

## 4. Rate Limiting and Retry Strategy

### 4.1 Auth Rate Limits

Default auth route limits:

| Endpoint | Default Limit | Window |
|---|---|---|
| `POST /auth/signup` | 5 | 3600 seconds |
| `POST /auth/login` | 10 | 300 seconds |

These are configurable with:

- `AUTH_SIGNUP_RATE_LIMIT_MAX`
- `AUTH_SIGNUP_RATE_LIMIT_WINDOW_SECONDS`

Auth returns structured `429` details with retry seconds.

### 4.2 Banking API Key Rate Limits

Banking API keys may carry a per-key hourly rate limit via:

- `rateLimit` on API key creation

If exceeded, banking auth raises `429 Rate limit exceeded`.

### 4.3 Frontend Retry Guidance

- Auth routes: respect `retryAfterSeconds`
- Banking routes: use exponential backoff when `429` has no header
- Suggested backoff: `5s → 15s → 30s → 60s`
- Async verification polling should not exceed 1 request per 2 seconds per item

## 5. Real-Time Update Model

### 5.1 WebSockets

There are no implemented WebSocket endpoints in the backend.

### 5.2 Polling

Use polling for:

- KYC and KYB status
- reports
- queued or processing verification dashboards
- alerts and admin health refresh widgets

Recommended frontend polling intervals:

| UI Use Case | Interval |
|---|---|
| KYC/KYB detail after submit | every 2–3 seconds until terminal status |
| Reports detail | every 5 seconds |
| Admin system health | every 30–60 seconds |
| Notifications | every 30–60 seconds |
| Analytics cards | on load + manual refresh |

### 5.3 Webhooks

Use webhooks for server-to-server completion events:

- `verification.completed`
- screening or alert workflows
- monitoring changes

Frontend should not directly consume webhooks; your backend or notification layer should fan out to the UI.

## 6. Dashboard Section Map

### 6.1 Auth Screens

Suggested components:

- `LoginForm`
- `SignupWizard`
- `MfaChallengePanel`
- `RecoveryCodeFallback`
- `ProfileHeader`

Endpoints:

| Component | Endpoint(s) | Purpose |
|---|---|---|
| `SignupWizard` | `POST /auth/signup`, `POST /{role}/auth/signup` | create enterprise/verifier/admin/manager/user accounts |
| `LoginForm` | `POST /auth/login`, `POST /{role}/auth/login` | primary sign-in |
| `MfaChallengePanel` | `POST /auth/mfa/verify`, `POST /{role}/auth/mfa/verify` | resolve login MFA |
| `MfaEnrollmentCard` | `GET /auth/mfa/enroll`, `POST /auth/mfa/enroll/verify` | enroll TOTP |
| `ForgotPasswordModal` | `POST /auth/forgot-password`, `POST /{role}/auth/forgot-password` | start reset |
| `ResetPasswordForm` | `POST /auth/reset-password`, `POST /{role}/auth/reset-password` | complete reset |
| `ProfileHeader` | `GET /auth/me`, `GET /{role}/auth/me` | current user summary |

### 6.2 User Dashboard

Suggested components:

- `VerificationHistoryTable`
- `WalletCard`
- `NotificationCenter`
- `MonitoringStatusCard`

Endpoints:

| Component | Endpoint(s) | Purpose |
|---|---|---|
| `VerificationHistoryTable` | `GET /api/v1/banking/user/verifications` | paged verification history |
| `WalletCard` | `GET /api/v1/banking/user/wallet` | wallet summary |
| `NotificationCenter` | `GET /api/v1/banking/notifications` | notifications feed |
| `MonitoringStatusCard` | `GET /api/v1/banking/ongoing/{customerId}/status` | ongoing verification state |
| `ChangeFeedDrawer` | `GET /api/v1/banking/ongoing/{customerId}/changes` | monitoring change log |

### 6.3 Verification Operations Dashboard

Suggested components:

- `KycSubmissionForm`
- `VerificationQueueTable`
- `VerificationDetailPanel`
- `DocumentCapturePanel`
- `BiometricsPanel`
- `ScreeningResultPanel`
- `RiskDecisionCard`

Key endpoints:

| Component | Endpoint(s) | Purpose |
|---|---|---|
| `KycSubmissionForm` | `POST /api/v1/banking/kyc/individual/basic`, `POST /api/v1/banking/kyc/individual/verify`, `POST /api/v1/banking/kyc/individual/enhanced` | submit KYC |
| `VerificationQueueTable` | `GET /api/v1/banking/requests` | operational list view |
| `VerificationDetailPanel` | `GET /api/v1/banking/kyc/individual/{verificationId}` | status, result, privacyProof, privacyClaims |
| `BulkUploadPanel` | `POST /api/v1/banking/kyc/individual/batch`, `POST /api/v1/banking/bulk/verify` | batch onboarding |
| `RefreshVerificationButton` | `POST /api/v1/banking/kyc/individual/{verificationId}/refresh` | rerun |
| `DocumentCapturePanel` | document endpoints below | classify, OCR, verify, compare |
| `BiometricsPanel` | biometric endpoints below | match, liveness, voice, behavior, fingerprint |
| `ScreeningResultPanel` | screening endpoints | sanctions, PEP, adverse media |
| `RiskDecisionCard` | AML endpoints | profile risk and transaction decisions |

### 6.4 Admin Dashboard

Suggested components:

- `SystemHealthBoard`
- `OpsAlertsTable`
- `ApiKeyManager`
- `WebhookManager`
- `ReportBuilder`
- `MonitoringRuleManager`
- `CaseManager`

### 6.5 Analytics Dashboard

Suggested components:

- `VerificationStatsChart`
- `FraudTrendChart`
- `RiskDistributionChart`
- `ComplianceMetricsCard`
- `GeoMap`
- `ProcessingTimeChart`
- `GeoDistributionTable`

### 6.6 Privacy and Noir Dashboard

Suggested components:

- `PrivacyProofBadge`
- `SelectiveDisclosureModal`
- `NoirCircuitCatalog`
- `NoirClaimGenerator`
- `NoirProofVerifier`
- `BlockchainAnchorPanel`

## 7. Detailed Contracts by Dashboard Section

## 7A. Authentication and Session Management

### 7A.1 `POST /auth/signup`

- **Method:** `POST`
- **Auth:** none
- **Rate limit:** default 5 requests per IP per hour
- **Frontend components:** `SignupWizard`
- **Business logic:** creates a role-based auth user and returns a one-time `generatedAuthKey`

#### Request body

Enterprise example:

```json
{
  "role": "enterprise",
  "organizationName": "Acme Corp",
  "contactName": "Jane Doe",
  "email": "ops@acme.com",
  "password": "V3rza!Auth#789",
  "countryCode": "US",
  "registrationNumber": "REG-12345",
  "consentAccepted": true
}
```

Verifier example:

```json
{
  "role": "verifier",
  "fullName": "John Verifier",
  "email": "john@verifier.com",
  "password": "V3rza!Auth#789",
  "verificationLicenseId": "LIC-98765",
  "jurisdiction": "US",
  "consentAccepted": true
}
```

Admin example:

```json
{
  "role": "admin",
  "fullName": "Ops Admin",
  "email": "admin@company.com",
  "password": "V3rza!Auth#789",
  "department": "Operations",
  "authorizationCode": "VERZA_ADMIN_CODE",
  "consentAccepted": true
}
```

#### Success response

```json
{
  "success": true,
  "data": {
    "userId": "usr_123",
    "role": "enterprise",
    "status": "pending_email_verification",
    "generatedAuthKey": "vz_auth_..."
  },
  "requestId": "req_123"
}
```

#### Error cases

- `400 validation_error`
- `409 email_conflict`
- `429 rate_limited`

### 7A.2 `POST /auth/login`

- **Method:** `POST`
- **Auth:** none
- **Rate limit:** default 10 requests per IP per 300 seconds
- **Frontend components:** `LoginForm`, `MfaChallengePanel`
- **Business logic:** validates email, password, auth key, role, and MFA policy

#### Request body

```json
{
  "email": "ops@acme.com",
  "password": "V3rza!Auth#789",
  "role": "enterprise",
  "authKey": "vz_auth_..."
}
```

#### Success response without MFA

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "usr_123",
      "email": "ops@acme.com",
      "role": "enterprise"
    },
    "permissions": ["kyc:write", "kyc:read"]
  },
  "requestId": "req_123"
}
```

#### MFA challenge response

```json
{
  "success": true,
  "data": {
    "mfaRequired": true,
    "challengeId": "mfa_123",
    "methods": ["totp", "webauthn"]
  },
  "requestId": "req_123"
}
```

#### Error cases

- `401 invalid_credentials`
- `403 role_mismatch`
- `423 account_locked`
- `429 rate_limited`

### 7A.3 Other Auth Routes

| Endpoint | Method | UI Component | Request Body | Success Shape | Notes |
|---|---|---|---|---|---|
| `/auth/mfa/verify` | POST | `MfaChallengePanel` | `{ challengeId, method, code }` | token bundle | resolves TOTP challenge |
| `/auth/mfa/enroll` | GET | `MfaEnrollmentCard` | none | enrollment payload | protected route |
| `/auth/mfa/enroll/verify` | POST | `MfaEnrollmentCard` | `{ code }` | enrollment confirmed | protected route |
| `/auth/mfa/recovery-code/verify` | POST | `RecoveryCodeFallback` | `{ challengeId, recoveryCode }` | token bundle | backup path |
| `/auth/refresh` | POST | auth interceptor | `{ refreshToken }` | token bundle | retry once on 401 |
| `/auth/logout` | POST | sign-out action | `{ refreshToken, allSessions }` | `204` | clear client state regardless |
| `/auth/forgot-password` | POST | `ForgotPasswordModal` | `{ email }` | recovery accepted | UX should avoid user enumeration assumptions |
| `/auth/reset-password` | POST | `ResetPasswordForm` | `{ token, password }` | reset completed | enforce strong password |
| `/auth/me` | GET | `ProfileHeader` | none | user summary | protected |

Segmented auth routes are also implemented for:

- `/user/auth/*`
- `/verifier/auth/*`
- `/enterprise/auth/*`
- `/manager/auth/*`
- `/admin/auth/*`

Use them when the dashboard is role-scoped by route namespace.

## 7B. Verification and KYC

### 7B.1 `POST /api/v1/banking/kyc/individual/verify`

- **Method:** `POST`
- **Auth:** `Authorization: Bearer <api_key_or_access_token>`
- **Permission:** `kyc:write`
- **Idempotency:** recommended
- **Frontend components:** `KycSubmissionForm`
- **Business logic:** creates an async KYC request and triggers downstream screening, document handling, identity resolution, privacy proof generation, and automatic Noir claim issuance when possible

#### Request body schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `requestId` | string | yes | caller reference |
| `customerId` | string | yes | dashboard/customer identifier |
| `verificationType` | `"basic" \| "full" \| "enhanced_due_diligence"` | yes | flow level |
| `personalInfo` | object | yes | firstName, lastName, dateOfBirth, nationality, etc. |
| `contactInfo` | object | yes | email, phone, address, countryCode |
| `identityDocuments` | object[] | yes | NIN, BVN, passport, national ID, etc. |
| `proofOfAddress` | object | no | optional |
| `biometricData` | object | no | optional selfie/liveness inputs |
| `additionalChecks` | object | no | NIN, BVN, screening toggles |
| `callbackUrl` | string | no | webhook override |
| `priority` | `"low" \| "standard" \| "high" \| "urgent"` | no | default `standard` |

#### Request example

```json
{
  "requestId": "req_kyc_001",
  "customerId": "cust_001",
  "verificationType": "full",
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "nationality": "US"
  },
  "contactInfo": {
    "email": "jane@example.com",
    "countryCode": "US"
  },
  "identityDocuments": [
    {
      "type": "passport",
      "documentNumber": "A12345678",
      "issuingCountry": "US"
    }
  ],
  "additionalChecks": {
    "bvn": {
      "number": "12345678901"
    }
  }
}
```

#### Success response

```json
{
  "success": true,
  "data": {
    "verificationId": "ver_123",
    "status": "pending",
    "overallResult": "pending"
  },
  "timestamp": "2026-03-28T12:00:00Z"
}
```

#### Status polling response

`GET /api/v1/banking/kyc/individual/{verificationId}`

```json
{
  "success": true,
  "data": {
    "verificationId": "ver_123",
    "status": "completed",
    "verificationType": "full",
    "overallResult": "approved",
    "confidenceScore": 0.97,
    "riskScore": 10.0,
    "riskLevel": "low",
    "extractedData": {},
    "result": {
      "identity": {
        "nin": {},
        "bvn": {}
      }
    },
    "privacyProof": {
      "proofId": "zkp_primary",
      "proofType": "kyc_individual_verification",
      "proofRole": "primary",
      "zkProof": null
    },
    "privacyClaims": [
      {
        "proofId": "zkp_claim_1",
        "proofType": "noir_age_over_threshold_claim",
        "proofRole": "claim",
        "zkProof": {
          "backend": "noir",
          "circuitId": "age_over_threshold"
        }
      }
    ]
  },
  "timestamp": "2026-03-28T12:00:04Z"
}
```

#### UI data transformations

- `privacyProof` → show `PrivacyProofBadge`
- `privacyClaims[]` → populate `NoirClaimsList`
- `result.identity.nin` and `result.identity.bvn` → normalize to verification cards
- `riskLevel` → badge color mapping

#### Polling

- start at 2 seconds
- stop when `status` is terminal (`completed`, `failed`, `cancelled`, `rejected` if present)

### 7B.2 Other KYC Routes

| Endpoint | Method | Component | Notes |
|---|---|---|---|
| `/api/v1/banking/kyc/individual/basic` | POST | `KycQuickStartForm` | reduced payload, still async |
| `/api/v1/banking/kyc/individual/enhanced` | POST | `EnhancedDueDiligenceForm` | forces enhanced flow |
| `/api/v1/banking/kyc/individual/batch` | POST | `BulkOnboardingPanel` | submit multiple requests |
| `/api/v1/banking/kyc/individual/{verificationId}/refresh` | POST | `RefreshVerificationButton` | reruns a previous verification |
| `/api/v1/banking/bulk/verify` | POST | `BulkUploadPanel` | bulk flow at banking root |
| `/api/v1/banking/requests` | GET | `VerificationQueueTable` | paged queue/list screen |

## 7C. Documents and Biometrics

### 7C.1 Document Endpoints

| Endpoint | Method | UI Component | Request Body | Response Highlights | Noir/Privacy Notes |
|---|---|---|---|---|---|
| `/api/v1/banking/documents/supported-types` | GET | `DocumentTypePicker` | query `country` optional | supported doc types | none |
| `/api/v1/banking/documents/extract` | POST | `OcrAutofillPanel` | `{ documentImage, documentType?, language? }` | `extractedData`, `confidence`, `mrz`, `privacyProof`, `privacyClaims[]` | auto-issues doc Noir claims when possible |
| `/api/v1/banking/documents/verify` | POST | `DocumentVerificationPanel` | `{ documentType, documentImage, documentBackImage?, issuingCountry?, expectedData?, useOcr? }` | authenticity, indicators, quality, `privacyProof`, `privacyClaims[]` | `document_number_last4`, `country_match` when derivable |
| `/api/v1/banking/documents/classify` | POST | `DocumentClassifierCard` | `{ documentImage, documentBackImage?, language? }` | inferred document type | no primary proof added |
| `/api/v1/banking/documents/compare` | POST | `DocumentCompareDrawer` | `{ documents[], fieldsToCompare?, useOcr? }` | consistency comparison | no Noir claim |

#### Document verify example

```json
{
  "documentType": "passport",
  "documentImage": "<base64-or-url>",
  "issuingCountry": "US",
  "expectedData": {
    "documentNumber": "A12345678"
  },
  "useOcr": false
}
```

#### Document verify success example

```json
{
  "success": true,
  "data": {
    "authentic": true,
    "confidenceScore": 0.94,
    "securityFeaturesDetected": [],
    "fraudIndicators": [],
    "qualityAssessment": {
      "imageQuality": "high",
      "blur": "none",
      "glare": "minimal",
      "orientation": "upright"
    },
    "expectedDataMatch": {},
    "mrz": {
      "detected": false
    },
    "signals": {},
    "privacyProof": {},
    "privacyClaims": []
  },
  "timestamp": "2026-03-28T12:00:00Z"
}
```

### 7C.2 Biometrics Endpoints

| Endpoint | Method | UI Component | Request Body | Response Highlights |
|---|---|---|---|---|
| `/api/v1/banking/biometrics/face-match` | POST | `FaceMatchPanel` | `{ selfieImage, idPhotoImage, threshold? }` | `match`, `matchScore`, `confidence`, `privacyProof` |
| `/api/v1/banking/biometrics/liveness` | POST | `LivenessPanel` | `{ livenessType, selfieImage?, videoUrl? }` | `live`, `livenessScore`, `confidence`, `privacyProof` |
| `/api/v1/banking/biometrics/voice-verification` | POST | `VoiceVerificationPanel` | `{ customerId, voiceSample, phrase? }` | verification ID + `privacyProof` |
| `/api/v1/banking/biometrics/behavioral` | POST | `BehavioralRiskPanel` | `{ customerId, signals }` | `riskScore`, session ID, `privacyProof` |
| `/api/v1/banking/biometrics/fingerprint` | POST | `FingerprintVerificationPanel` | `{ customerId, fingerprintTemplate }` | verification ID + `privacyProof` |

## 7D. Screening, AML, Privacy, and Compliance

### 7D.1 Screening Endpoints

| Endpoint | Method | Component | Request Body |
|---|---|---|---|
| `/api/v1/banking/screening/pep/check` | POST | `PepCheckForm` | `{ firstName, lastName, dateOfBirth?, nationality?, fuzzyMatching?, matchThreshold? }` |
| `/api/v1/banking/screening/sanctions/check` | POST | `SanctionsCheckForm` | same pattern |
| `/api/v1/banking/screening/adverse-media/check` | POST | `AdverseMediaCheckForm` | `{ firstName, lastName, fuzzyMatching?, matchThreshold? }` |
| `/api/v1/banking/screening/pep/family-associates` | POST | `PepAssociatesPanel` | same core person body |
| `/api/v1/banking/screening/sanctions/ongoing` | POST | `OngoingScreeningToggle` | `{ customerId, active }` |
| `/api/v1/banking/screening/pep/ongoing` | POST | `OngoingScreeningToggle` | `{ customerId, active }` |
| `/api/v1/banking/screening/adverse-media/ongoing` | POST | `OngoingScreeningToggle` | `{ customerId, active }` |
| `/api/v1/banking/screening/sanctions/lists` | GET | `SanctionsSourcesModal` | none |

### 7D.2 AML Endpoints

| Endpoint | Method | Component | Request Body | Response |
|---|---|---|---|---|
| `/api/v1/banking/aml/risk-score` | POST | `RiskDecisionCard` | `{ customerId, customerProfile, verificationResults?, transactionProfile?, relationshipFactors? }` | overall risk score, level, recommendations |
| `/api/v1/banking/aml/transaction-monitoring` | POST | `TransactionDecisionPanel` | `{ transactionId, customerId, transaction, customerRiskProfile }` | risk score, decision, flagged reasons |

### 7D.3 Privacy Endpoints

| Endpoint | Method | Component | Request Body | Notes |
|---|---|---|---|---|
| `/api/v1/banking/privacy/consent/record` | POST | `ConsentCapturePanel` | consent payload | store consent |
| `/api/v1/banking/privacy/consent/{customerId}` | GET | `ConsentHistoryDrawer` | none | fetch consent records |
| `/api/v1/banking/privacy/data-export` | POST | `DataExportAction` | export request | privacy operations |
| `/api/v1/banking/privacy/data-deletion` | POST | `DeletionRequestAction` | deletion request | privacy operations |

### 7D.4 Compliance Endpoints

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/compliance/sar/create` | POST | `SarDraftForm` |
| `/api/v1/banking/compliance/sar/submit` | POST | `SarSubmitAction` |
| `/api/v1/banking/compliance/ctr/create` | POST | `CtrDraftForm` |
| `/api/v1/banking/compliance/reports/schedule` | POST | `ComplianceScheduleForm` |
| `/api/v1/banking/compliance/reports` | GET | `ComplianceReportsTable` |

## 7E. Noir, ZK, Blockchain, and DID

### 7E.1 Noir and Privacy Proof Endpoints

| Endpoint | Method | Component | Purpose |
|---|---|---|---|
| `/api/v1/banking/zk-proof/generate` | POST | `PrivacyProofGenerator` | manual privacy proof generation |
| `/api/v1/banking/zk-proof/verify` | POST | `PrivacyProofVerifier` | integrity verification |
| `/api/v1/banking/zk-proof/verification/{verificationId}` | GET | `VerificationProofPanel` | fetch latest proof for a verification |
| `/api/v1/banking/zk-proof/disclose` | POST | `SelectiveDisclosureModal` | disclose approved fields only |
| `/api/v1/banking/zk-proof/circuits` | GET | `NoirCircuitCatalog` | fetch supported Noir circuits |
| `/api/v1/banking/zk-proof/noir/toolchain` | GET | `NoirRuntimeHealthCard` | check runtime readiness |
| `/api/v1/banking/zk-proof/noir/generate` | POST | `NoirClaimGenerator` | generate true Noir proof |
| `/api/v1/banking/zk-proof/noir/verify` | POST | `NoirProofVerifier` | verify true Noir proof |

#### Noir generate request

```json
{
  "circuitId": "age_over_threshold",
  "verificationId": "ver_123",
  "privateInputs": {
    "age_years": 27
  },
  "publicInputs": {
    "threshold": 18
  },
  "submittedData": {
    "customerId": "cust_001"
  },
  "publicSignals": {
    "claim": "adult_access"
  },
  "disclosureFields": [
    "resultData.zkProof.publicInputs.threshold",
    "resultData.zkProof.claims.passed"
  ],
  "verifierTarget": "evm"
}
```

#### Noir-specific frontend handling

- show `Noir Runtime` status before enabling manual proof generation
- use `circuits` catalog to render forms
- do not expose `privateInputs` in client logs
- display `proof.proofRole === "claim"` as reusable derived claim

### 7E.2 Blockchain Endpoints

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/blockchain/anchor` | POST | `BlockchainAnchorPanel` |
| `/api/v1/banking/blockchain/proof` | POST | `BlockchainProofGenerator` |
| `/api/v1/banking/blockchain/proof/{verificationId}` | GET | `BlockchainProofLookup` |

### 7E.3 DID Endpoints

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/did/create` | POST | `DidCreateAction` |
| `/api/v1/banking/did/{customerId}` | GET | `DidSummaryCard` |
| `/api/v1/banking/did/verify` | POST | `DidVerificationPanel` |
| `/api/v1/banking/did/credentials/issue` | POST | `CredentialIssuer` |
| `/api/v1/banking/did/credentials/{credentialId}` | GET | `CredentialViewer` |
| `/api/v1/banking/did/credentials/customer/{customerId}` | GET | `CredentialList` |
| `/api/v1/banking/did/credentials/present` | POST | `PresentationBuilder` |
| `/api/v1/banking/did/credentials/verify` | POST | `CredentialVerifier` |

## 7F. Admin, Alerts, API Keys, Monitoring, Cases, Reports

### 7F.1 Admin and Operations

| Endpoint | Method | Component | Notes |
|---|---|---|---|
| `/api/v1/banking/admin/system-health` | GET | `SystemHealthBoard` | now includes Noir runtime and bootstrap readiness |
| `/api/v1/banking/admin/alerts` | GET | `OpsAlertsTable` | paginated/filterable |
| `/api/v1/banking/alerts` | GET | `AlertList` | operational alerts |
| `/api/v1/banking/alerts/{alertId}` | GET | `AlertDetailDrawer` | single alert |
| `/api/v1/banking/alerts/{alertId}/investigate` | POST | `InvestigateAlertAction` | analyst workflow |
| `/api/v1/banking/alerts/{alertId}/resolve` | POST | `ResolveAlertAction` | resolution workflow |

### 7F.2 API Keys and Webhooks

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/api-keys/create` | POST | `ApiKeyCreateModal` |
| `/api/v1/banking/api-keys` | GET | `ApiKeyManager` |
| `/api/v1/banking/api-keys/{keyId}` | DELETE | `ApiKeyRevokeAction` |
| `/api/v1/banking/webhooks/register` | POST | `WebhookCreateForm` |
| `/api/v1/banking/webhooks` | GET | `WebhookList` |
| `/api/v1/banking/webhooks/{webhookId}` | DELETE | `WebhookDeleteAction` |
| `/api/v1/banking/webhooks/test` | POST | `WebhookTestAction` |

### 7F.3 Monitoring, Cases, Reports

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/monitoring/rules/create` | POST | `MonitoringRuleCreateForm` |
| `/api/v1/banking/monitoring/rules` | GET | `MonitoringRuleTable` |
| `/api/v1/banking/monitoring/rules/{ruleId}` | PATCH | `MonitoringRuleEditDrawer` |
| `/api/v1/banking/monitoring/rules/{ruleId}` | DELETE | `MonitoringRuleDeleteAction` |
| `/api/v1/banking/cases/create` | POST | `CaseCreateForm` |
| `/api/v1/banking/cases` | GET | `CaseTable` |
| `/api/v1/banking/cases/{caseId}` | GET | `CaseDetailPanel` |
| `/api/v1/banking/cases/{caseId}` | PATCH | `CaseUpdateAction` |
| `/api/v1/banking/cases/{caseId}/assign` | POST | `CaseAssignAction` |
| `/api/v1/banking/cases/{caseId}/close` | POST | `CaseCloseAction` |
| `/api/v1/banking/reports/create` | POST | `ReportBuilder` |
| `/api/v1/banking/reports/{reportId}` | GET | `ReportStatusPanel` |

## 7G. Analytics and Dashboard Summary Endpoints

### 7G.1 Banking Analytics Root Endpoints

| Endpoint | Method | Component | Pagination |
|---|---|---|---|
| `/api/v1/banking/analytics/geographic-distribution` | GET | `GeoDistributionTable` | query-driven |
| `/api/v1/banking/analytics/verification-stats` | GET | `VerificationStatsChart` | no pagination |
| `/api/v1/banking/analytics/fraud-trends` | GET | `FraudTrendChart` | no pagination |
| `/api/v1/banking/analytics/risk-distribution` | GET | `RiskDistributionChart` | no pagination |
| `/api/v1/banking/analytics/compliance-metrics` | GET | `ComplianceMetricsCard` | no pagination |
| `/api/v1/banking/analytics/geographical` | GET | `GeoMap` | no pagination |
| `/api/v1/banking/analytics/processing-times` | GET | `ProcessingTimeChart` | no pagination |

### 7G.2 Other Summary Cards

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/health` | GET | `ServiceStatusPill` |
| `/api/v1/banking/settings/company` | GET | `CompanySettingsPanel` |
| `/api/v1/banking/marketplace/verifiers` | GET | `VerifierMarketplaceTable` |

## 7H. Specialized Banking and Investigation Flows

| Endpoint | Method | Component |
|---|---|---|
| `/api/v1/banking/account/mono/exchange` | POST | `MonoExchangeConnect` |
| `/api/v1/banking/account/mono/{monoAccountId}/details` | GET | `MonoAccountDetailCard` |
| `/api/v1/banking/account/mono/{monoAccountId}/identity` | GET | `MonoIdentityPanel` |
| `/api/v1/banking/account/mono/{monoAccountId}/transactions` | GET | `MonoTransactionsTable` |
| `/api/v1/banking/account/verify` | POST | `BankAccountVerificationForm` |
| `/api/v1/banking/account/instant-verify` | POST | `InstantAccountVerificationForm` |
| `/api/v1/banking/account/micro-deposits` | POST | `MicroDepositVerificationForm` |
| `/api/v1/banking/transactions/screen` | POST | `TransactionScreeningPanel` |
| `/api/v1/banking/ongoing/enable` | POST | `MonitoringEnableAction` |
| `/api/v1/banking/ongoing/disable` | POST | `MonitoringDisableAction` |
| `/api/v1/banking/ongoing/due-reviews` | GET | `DueReviewsTable` |
| `/api/v1/banking/watchlist/add` | POST | `WatchlistAddForm` |
| `/api/v1/banking/watchlist` | GET | `WatchlistTable` |
| `/api/v1/banking/source-of-funds/verify` | POST | `SourceOfFundsForm` |
| `/api/v1/banking/source-of-funds/analyze` | POST | `SourceOfFundsAnalysisPanel` |
| `/api/v1/banking/source-of-wealth/verify` | POST | `SourceOfWealthForm` |
| `/api/v1/banking/source-of-wealth/{customerId}/assessment` | GET | `SourceOfWealthAssessmentCard` |
| `/api/v1/banking/credit/check` | POST | `CreditCheckForm` |
| `/api/v1/banking/credit/score` | POST | `CreditScoreCard` |
| `/api/v1/banking/translation/text` | POST | `TranslationWidget` |
| `/api/v1/banking/translation/document` | POST | `DocumentTranslationWidget` |
| `/api/v1/banking/localization/currency-convert` | POST | `CurrencyConverterWidget` |
| `/api/v1/banking/localization/regulations/{country}` | GET | `CountryRegulationPanel` |
| `/api/v1/banking/sandbox/generate-test-data` | POST | `SandboxSeederAction` |

## 7I. Verification Primitive API for Hosted or Low-Level Flows

Use these routes when the frontend integrates the low-level verification namespace directly.

| Endpoint | Method | Component | Notes |
|---|---|---|---|
| `/verification/health` | GET | `PrimitiveServiceStatus` | liveness |
| `/verification/cameras` | GET | `CameraSelector` | device list |
| `/verification/config` | GET | `VerificationConfigLoader` | client-side setup |
| `/verification/proxy/token` | POST | `ProxyTokenBootstrap` | required for browser-safe flows |
| `/verification/proxy/document-ocr-check` | POST | `DocumentOcrPrecheck` | multipart + proxy token |
| `/verification/result` | GET | hosted page | HTML |
| `/verification/demo/webcam` | GET | demo page | HTML |
| `/verification/demo/document-webcam` | GET | demo page | HTML |
| `/verification/demo/mobile` | GET | demo page | HTML |
| `/verification/demo/mobile-liveness` | GET | demo page | HTML |
| `/verification/verify` | POST | `PrimitiveIdPairVerifier` | low-level model verify |
| `/verification/predict` | POST | `ScorePreviewAction` | raw score |
| `/verification/verify-webcam` | POST | hosted webcam verification | multipart |
| `/verification/verify-document` | POST | browser or service doc verification | supports `NIN` and `Passport` |
| `/verification/proxy/verify-document` | POST | browser-safe doc verification | proxy-token protected |
| `/verification/verify-mobile-liveness` | POST | mobile selfie/liveness flow | multipart |
| `/verification/model/reload` | POST | model operations | admin/ops use |
| `/verification/model/status` | GET | model operations | admin/ops use |

## 8. Pagination and Filtering Details

Endpoints with paging/list semantics typically use:

| Param | Type | Notes |
|---|---|---|
| `page` | integer | 1-based |
| `limit` | integer | server-enforced caps where applicable |
| `sort` | string | route-specific values |
| `status` | string | optional filters |
| `range` | string | analytics date window |

Known paged endpoints:

- `/api/v1/banking/admin/alerts`
- `/api/v1/banking/user/verifications`
- `/api/v1/banking/notifications`
- `/api/v1/banking/cases`
- `/api/v1/banking/alerts`
- `/api/v1/banking/api-keys`
- `/api/v1/banking/compliance/reports`

Frontend should normalize paged responses to:

```ts
type PagedResult<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    [key: string]: unknown;
  };
};
```

## 9. Noir and Privacy Handling Rules for Frontend

### 9.1 Primary Privacy Proof vs Derived Claims

Every completed major verification may now include:

- `privacyProof` → the main encrypted privacy-layer proof
- `privacyClaims[]` → auto-issued or manually issued Noir-derived claims

UI rule:

- show the main privacy proof once per verification
- show claim proofs as reusable attestations beneath it

### 9.2 Circuit Catalog

Fetch:

- `GET /api/v1/banking/zk-proof/circuits`

Use it to render:

- circuit title
- private input fields
- public input fields
- default disclosure fields
- use case descriptions

### 9.3 Noir Toolchain Readiness

Fetch:

- `GET /api/v1/banking/zk-proof/noir/toolchain`

Expected UX:

- if `ready=false`, disable manual claim generation UI
- if `runtime=native`, show production-ready badge
- if `runtime=docker`, show local/self-hosted note

### 9.4 Selective Disclosure

Use:

- `POST /api/v1/banking/zk-proof/disclose`

Never expose raw `submittedData` by default. Only allow curated field selection.

## 10. Recommended Frontend Data Transformation Layer

Create a frontend API adapter layer that:

- converts snake-free backend fields into view-models
- converts timestamps to local display while storing UTC
- normalizes `privacyProof` and `privacyClaims`
- maps auth envelope and banking envelope to common client result types
- handles polling stop conditions centrally

Suggested normalized types:

```ts
type PrivacyProofSummary = {
  proofId: string;
  proofType: string;
  proofRole: "primary" | "claim";
  verificationId?: string;
  commitment: string;
  publicSignals: Record<string, unknown>;
  zkProof?: {
    backend: "noir";
    circuitId: string;
    verifierTarget?: string;
  } | null;
};

type VerificationViewModel = {
  verificationId: string;
  status: string;
  overallResult?: string;
  riskLevel?: string;
  privacyProof?: PrivacyProofSummary | null;
  privacyClaims: PrivacyProofSummary[];
};
```

## 11. Frontend Cross-Reference Summary

| Dashboard Section | Primary Endpoints |
|---|---|
| Login and Auth | `/auth/*`, `/{role}/auth/*` |
| User Home | `/api/v1/banking/user/verifications`, `/notifications`, `/user/wallet` |
| KYC Dashboard | `/kyc/*`, `/requests`, `/bulk/verify` |
| Document Intelligence | `/documents/*` |
| Biometrics | `/biometrics/*` |
| Screening & AML | `/screening/*`, `/aml/*`, `/transactions/screen` |
| Admin Ops | `/admin/system-health`, `/admin/alerts`, `/alerts/*`, `/monitoring/*`, `/cases/*` |
| Analytics | `/analytics/*`, `/analytics/geographic-distribution` |
| Privacy & Noir | `/zk-proof/*`, `/blockchain/*`, `/privacy/*` |
| API Management | `/api-keys/*`, `/webhooks/*` |
| Primitive Verification | `/verification/*` |

## 12. Implementation Notes

- Banking dashboard integrations should prefer `/api/v1/banking/*`
- Use `/verification/*` only for low-level hosted capture or special browser proxy flows
- No WebSocket transport exists today; use polling or backend webhook fan-out
- Banking responses use `timestamp`, auth responses use `requestId`
- Major completed verification responses now include privacy-layer and Noir claim metadata
- On Render production, expect Noir runtime mode to be `native`
