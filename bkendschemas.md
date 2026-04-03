# Backend Schemas Not Documented In `requiredfrontendschemas.md`

## Scope
- Source inventory compared:
  - `requiredfrontendschemas.md` (frontend-mapped contract)
  - Backend routers and auth API under `banking/`
- Goal:
  - Identify backend-implemented schemas and validation models that are currently not represented in `requiredfrontendschemas.md`
  - Provide frontend-ready integration guidance for each gap

## Global API Contract Notes
- Banking base path: `/api/v1/banking`
- Auth base paths:
  - `/auth/*`
  - `/{role}/auth/*` where role is one of `user|enterprise|verifier|manager|admin`
- Success envelope:
  ```json
  {
    "success": true,
    "data": { "...": "..." },
    "timestamp": "ISO-8601"
  }
  ```
- Error envelope:
  ```json
  {
    "success": false,
    "error": {
      "code": "validation_error|...",
      "message": "Human-readable message",
      "details": []
    },
    "timestamp": "ISO-8601"
  }
  ```

## Undocumented Schema Inventory

### 1) Auth MFA Enrollment (GET)
#### Endpoint
- `GET /auth/mfa/enroll`
- `GET /{role}/auth/mfa/enroll` (segmented alias)

#### Request
- Header:
  - `Authorization: Bearer <accessToken>`

#### Response Data Schema
```json
{
  "qrCodeImageUrl": "string",
  "otpauthUri": "string",
  "backupCodes": ["string"]
}
```

#### Frontend Integration Guidelines
- Build an MFA-enrollment screen that renders:
  - QR code image from `qrCodeImageUrl`
  - Manual setup fallback using `otpauthUri`
  - One-time display + secure local handling for `backupCodes`
- Immediately chain to `POST /auth/mfa/enroll/verify` after user enters a TOTP code.
- Treat backup codes as sensitive secrets; never log to analytics.

---

### 2) Team Invitation Lifecycle Extensions
#### Endpoints
- `POST /team/invitations/{invitationId}/resend`
- `POST /team/invitations/accept`

#### Request Schemas
- `InvitationAcceptBody`
  ```json
  { "token": "string(minLength=32)" }
  ```

#### Validation Rules
- Accept token must be HMAC-valid and not expired.
- Resend is rate-limited server-side.

#### Response Data Examples
- Resend:
  ```json
  { "invitationId": "inv_xxx", "status": "sent" }
  ```
- Accept:
  ```json
  { "invitationId": "inv_xxx", "status": "accepted" }
  ```

#### Frontend Integration Guidelines
- Add `Resend invitation` action in team management UI.
- Add dedicated invite-accept page consuming token from URL query parameter.
- Handle error codes explicitly:
  - `invitation_token_expired`
  - `invitation_already_accepted`
  - `invitation_token_replayed`

---

### 3) API Security Settings
#### Endpoints
- `GET /api/settings`
- `PATCH /api/settings`

#### Request Schema (`PATCH`)
```json
{
  "autoRotateSecrets": true,
  "ipWhitelistEnabled": false,
  "allowedIps": ["203.0.113.0/24", "198.51.100.10/32"]
}
```

#### Validation Rules
- If `ipWhitelistEnabled=true`, all `allowedIps` values must be valid IPv4/IPv6 CIDR/IP.

#### Response Data
```json
{
  "autoRotateSecrets": true,
  "ipWhitelistEnabled": false,
  "allowedIps": []
}
```

#### Frontend Integration Guidelines
- Use chip-input with CIDR/IP validation before submit.
- Disable submit when whitelist enabled and list is empty.
- Add confirmation dialog before enabling IP whitelist in production.

---

### 4) Billing Plan + Checkout + Provider Webhook
#### Endpoints
- `GET /billing/plans`
- `POST /billing/checkout/session`
- `POST /billing/webhooks/provider` (server-to-server, not browser-call)

#### Request Schemas
- `CheckoutSessionBody`
  ```json
  { "targetPlan": "starter|business|...", "billingInterval": "monthly|yearly" }
  ```
- `BillingWebhookEvent` (backend callback payload)
  ```json
  {
    "provider": "stripe",
    "eventId": "string",
    "status": "payment_success|payment_failed",
    "checkoutSessionId": "cs_xxx",
    "targetPlan": "optional"
  }
  ```

#### Frontend Integration Guidelines
- Frontend only needs:
  - `GET /billing/plans` for plan cards.
  - `POST /billing/checkout/session`, then redirect browser to `checkoutUrl`.
- Do not call webhook endpoint from frontend.

---

### 5) Company Logo Upload
#### Endpoint
- `POST /settings/company/logo` (multipart/form-data)

#### Request
- Form field:
  - `file` (image/*, max size from backend config)

#### Response Data
```json
{ "logoUrl": "/static/company-logos/<filename>" }
```

#### Frontend Integration Guidelines
- Use file uploader with pre-check:
  - MIME starts with `image/`
  - client-side size cap aligned with backend max
- Persist returned `logoUrl` in company settings view model.

---

### 6) Mono Account Linking + Read APIs
#### Endpoints
- `POST /account/mono/exchange`
- `GET /account/mono/{monoAccountId}/details`
- `GET /account/mono/{monoAccountId}/identity`
- `GET /account/mono/{monoAccountId}/transactions`

#### Request Schema (`mono/exchange`)
```json
{
  "customerId": "string",
  "code": "string",
  "metadata": {}
}
```

#### Frontend Integration Guidelines
- Add bank-link callback handler page that exchanges provider `code`.
- Save `monoAccountId` for subsequent details/identity/transactions views.
- Treat provider response as semi-structured JSON; render with defensive optional chaining.

---

### 7) Advanced Biometrics Schemas
#### Endpoints
- `POST /biometrics/voice-verification`
- `POST /biometrics/behavioral`
- `POST /biometrics/fingerprint`

#### Request Schemas
- `VoiceVerificationBody`
  ```json
  { "customerId": "string", "voiceSample": "string", "phrase": "optional" }
  ```
- `BehavioralBody`
  ```json
  { "customerId": "string", "signals": { "keystroke": {}, "pointer": {} } }
  ```
- `FingerprintBody`
  ```json
  { "customerId": "string", "fingerprintTemplate": "string" }
  ```

#### Response Data Patterns
- Voice/Fingerprint:
  - `verificationId`, `status`, `score`, `privacyProof`
- Behavioral:
  - `sessionId`, `status`, `riskScore`, `privacyProof`

#### Frontend Integration Guidelines
- Normalize status values into UI enums:
  - `verified|review|ok`
- Show `privacyProof` metadata in trust/compliance panels, not in basic flow.

---

### 8) KYB Domain Schemas
#### Endpoints
- `POST /kyb/business/verify`
- `POST /kyb/business/registry-check`
- `POST /kyb/business/ownership`
- `POST /kyb/business/directors`
- `POST /kyb/business/financial-health`

#### Core Request Models
- `BusinessInfo`
  ```json
  {
    "businessRef": "string",
    "name": "string",
    "country": "string",
    "registrationNumber": "optional",
    "address": {}
  }
  ```
- Directors validation:
  - `matchThreshold` constrained to `50..100`
  - `fuzzyMatching` boolean

#### Response Data Patterns
- Verify: `{ verificationId, status }`
- Registry/Ownership: `{ status, recommendation }`
- Directors: `{ status, overallRecommendation, results[] }`
- Financial health: `{ status, score, details }`

#### Frontend Integration Guidelines
- Build KYB as a multi-step wizard:
  1. Business verify
  2. Registry
  3. Ownership
  4. Directors screening
  5. Financial health
- Persist a shared `businessRef` across all steps.
- Render director-level screening results with expandable detail cards.

---

### 9) KYC Extended Schemas
#### Endpoints
- `POST /kyc/individual/enhanced`
- `POST /kyc/individual/batch`
- `POST /kyc/individual/{verificationId}/refresh`

#### Request Models
- `KycIndividualEnhancedBody`: includes `additionalChecks`, optional `callbackUrl`, and `priority` enum `low|standard|high|urgent`.
- `KycBatchBody`: `items` with min 1 and max 1000.

#### Frontend Integration Guidelines
- Add advanced KYC mode toggle for enhanced due diligence.
- For batch, implement file-to-record mapping with chunking and retry.
- Poll resulting verification IDs from batch and refresh actions.

---

### 10) DID Advanced Schemas
#### Endpoints
- `POST /did/verify`
- `POST /did/credentials/issue`

#### Request Schemas
- `DidVerifyBody`
  ```json
  { "did": "string", "challenge": "string", "signature": "string" }
  ```
- `CredentialIssueBody`
  ```json
  {
    "customerId": "string",
    "verificationId": "optional",
    "did": "optional",
    "credentialType": "string",
    "schema": "optional",
    "claims": {},
    "expiresAt": "optional ISO datetime"
  }
  ```

#### Response Data
- DID verify: `{ did, verified }`
- Credential issue: `{ credentialId, status, credential }`

#### Frontend Integration Guidelines
- Add credential issuance form that can prefill from verification results.
- Enforce JSON-schema validity for `claims` before submit.
- Expose credential preview pane showing VC structure.

---

### 11) Blockchain Proof By Anchor
#### Endpoint
- `POST /blockchain/proof`

#### Request Schema
```json
{ "anchorId": "string" }
```

#### Response
```json
{
  "anchorId": "string",
  "status": "anchored|not_found",
  "proof": {
    "chain": "string",
    "txHash": "string",
    "anchorData": {},
    "anchoredAt": "ISO datetime"
  }
}
```

#### Frontend Integration Guidelines
- Support two retrieval flows:
  - by `verificationId` (existing GET)
  - by `anchorId` (this POST)
- Use this endpoint in admin/debug proof explorer tools.

---

### 12) Ongoing Monitoring Read Extensions
#### Endpoints
- `GET /ongoing/{customerId}/status`
- `GET /ongoing/{customerId}/changes`

#### Response Data
- Status:
  - `subscriptionId`, `active`, `monitoringType`, `frequencyDays`, `nextReviewAt`, `callbackUrl`
- Changes:
  - `items[]` with `changeId`, `changeType`, `details`, `detectedAt`

#### Frontend Integration Guidelines
- Add customer-level monitoring timeline component.
- Implement polling for status and lazy-load for changes history.

---

### 13) Compliance SAR/CTR Workflows
#### Endpoints
- `POST /compliance/sar/create`
- `POST /compliance/sar/submit`
- `POST /compliance/ctr/create`

#### Request Schemas
- `SarCreateBody`
  ```json
  { "requestId": "string", "customerId": "optional", "narrative": "string", "activity": {} }
  ```
- `SarSubmitBody`
  ```json
  { "reportId": "string", "submissionChannel": "electronic|manual" }
  ```
- `CtrCreateBody`
  ```json
  { "requestId": "string", "customerId": "optional", "transaction": {} }
  ```

#### Frontend Integration Guidelines
- Implement draft-and-submit UX:
  1. Create SAR/CTR draft
  2. Review payload
  3. Submit SAR
- Track `reportId` in case/compliance workspace state.

---

### 14) Screening Specialized Endpoints
#### Endpoints
- `POST /screening/pep/family-associates`
- `POST /screening/sanctions/ongoing`
- `POST /screening/pep/ongoing`
- `POST /screening/adverse-media/ongoing`

#### Request Schemas
- `PepFamilyBody`
  - `firstName`, `lastName`, `fuzzyMatching`, `matchThreshold(0..100)`
- `OngoingBody`
  - `customerId`, `active`

#### Frontend Integration Guidelines
- Expose family/associates as an advanced PEP option.
- Use specific ongoing endpoints for explicit UX controls; use generic endpoint only for dynamic integrations.

---

### 15) Reports Detail Fetch
#### Endpoint
- `GET /reports/{reportId}`

#### Response Data
```json
{
  "reportId": "string",
  "reportType": "verification_summary|compliance_summary|risk_distribution",
  "status": "generating|ready|failed|not_found",
  "format": "pdf|csv|excel",
  "downloadUrl": "string|null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime",
  "readyAt": "ISO datetime|null"
}
```

#### Frontend Integration Guidelines
- After report creation, poll this endpoint until `status=ready`.
- Show progress state and retry controls for `failed`.

---

### 16) Analytics Verification Stats
#### Endpoint
- `GET /analytics/verification-stats`

#### Query Params
- `startDate`, `endDate`
- `groupBy` enum: `day|week|month`

#### Response Data
```json
{
  "totalVerifications": 0,
  "approved": 0,
  "rejected": 0,
  "manualReview": 0,
  "averageProcessingTime": 0,
  "successRate": 0,
  "breakdown": [
    {
      "period": "2026-04",
      "total": 0,
      "approved": 0,
      "rejected": 0,
      "manualReview": 0
    }
  ]
}
```

#### Frontend Integration Guidelines
- Add chart mode switch for day/week/month.
- Apply UTC normalization in date filters to match backend bucketing.

---

### 17) Marketplace Verifiers
#### Endpoint
- `GET /marketplace/verifiers`

#### Query Params
- `search`, `service`, `rating` (`gte:<number>`), `sort`, `page`, `limit`

#### Response Data
- `items[]` with:
  - `id`, `name`, `category`, `rating`, `verified`, optional `reviewCount`, optional `priceFrom`, `currency`
- `meta` pagination object

#### Frontend Integration Guidelines
- Build faceted marketplace list with search/rating/sort controls.
- Keep optional fields nullable in UI because feature flags can hide them.

## Data Transformation Requirements (Frontend)
- Normalize path/output enums:
  - Example: verification/report statuses should be mapped into strict UI unions.
- Preserve backend casing:
  - Most payloads use camelCase; avoid auto snake_case transforms.
- Treat dynamic dictionaries as unknown-safe:
  - `claims`, `metadata`, `activity`, `signals`, and other open objects should be typed as `Record<string, unknown>`.
- Parse timestamps as UTC:
  - Fields ending with `At` are ISO strings and should be handled consistently for charting and SLA timers.

## Validation + Error Handling Checklist
- Always surface backend validation codes/messages directly in form-level errors.
- Add client-side mirrors for server constraints where explicit:
  - `matchThreshold` ranges
  - enum fields (`billingInterval`, `submissionChannel`, `priority`, etc.)
  - token and string minimum lengths where defined
- Use idempotency key for all write operations that users can retry from UI.

## Step-By-Step Frontend Implementation Plan
1. Add missing TypeScript interfaces for all schemas listed above.
2. Add API client methods for each undocumented endpoint with typed request/response wrappers.
3. Add runtime guards (zod/io-ts/custom) for dynamic object payloads before rendering.
4. Integrate flows per domain: MFA, billing, KYB, advanced biometrics, compliance, monitoring.
5. Add UI validation rules matching backend model constraints.
6. Add error-code based UX branches for token expiry, replay, not found, and validation failures.
7. Add E2E tests for each newly integrated flow using representative payloads and error states.
