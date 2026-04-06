# Frontend Schemas + Endpoint Mapping (Complete)

This document is generated from frontend source code to provide an exhaustive backend mapping contract.

## 1) Endpoint Inventory Used By Frontend Services

| Service File | Line | Method | Endpoint Path (as used in frontend) | Request/Response Generic Schema |
|---|---:|---|---|---|
| bankingService.ts | 1152 | GET | `/requests${query}` | `unknown` |
| bankingService.ts | 1169 | POST | `/requests/${verificationId}/review` | `JsonRecord` |
| bankingService.ts | 1203 | POST | `/kyc/individual/verify` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 1214 | GET | `/kyc/individual/${verificationId}` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 1270 | POST | `/kyc/individual/basic` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 1295 | POST | `/documents/verify` | `unknown` |
| bankingService.ts | 1301 | POST | `/documents/extract` | `DocumentExtractApiData` |
| bankingService.ts | 1315 | POST | `/biometrics/face-match` | `BiometricFaceMatchApiData` |
| bankingService.ts | 1335 | POST | `/biometrics/liveness` | `BiometricLivenessApiData` |
| bankingService.ts | 1349 | POST | `/screening/sanctions/check` | `SanctionsCheckApiData` |
| bankingService.ts | 1366 | POST | `/screening/pep/check` | `PEPCheckApiData` |
| bankingService.ts | 1392 | POST | `/aml/risk-score` | `AMLRiskScoreApiData` |
| bankingService.ts | 1403 | POST | `/risk/sandbox/simulate` | `JsonRecord` |
| bankingService.ts | 1446 | POST | `/risk/sandbox/report` | `JsonRecord` |
| bankingService.ts | 1465 | POST | `/aml/transaction-monitoring` | `TransactionMonitoringApiData` |
| bankingService.ts | 1479 | POST | `/webhooks/register` | `JsonRecord` |
| bankingService.ts | 1498 | POST | `/webhooks/test` | `JsonRecord` |
| bankingService.ts | 1511 | POST | `/webhooks/${input.webhookId}/test` | `JsonRecord` |
| bankingService.ts | 1525 | GET | `/webhooks${query}` | `JsonRecord` |
| bankingService.ts | 1534 | DELETE | `/webhooks/${webhookId}` | `(implicit/none)` |
| bankingService.ts | 1538 | POST | `/webhooks/${webhookId}/rotate-secret` | `JsonRecord` |
| bankingService.ts | 1549 | GET | `/webhooks/retries` | `unknown` |
| bankingService.ts | 1586 | POST | `/api-keys/create` | `JsonRecord` |
| bankingService.ts | 1596 | GET | `/api-keys${query}` | `JsonRecord` |
| bankingService.ts | 1605 | DELETE | `/api-keys/${keyId}` | `(implicit/none)` |
| bankingService.ts | 1609 | GET | `/audit/customer/${customerId}` | `JsonRecord` |
| bankingService.ts | 1614 | GET | `/audit/verification/${verificationId}` | `JsonRecord` |
| bankingService.ts | 1619 | GET | `/audit/logs` | `unknown` |
| bankingService.ts | 1650 | POST | `/audit/export` | `JsonRecord` |
| bankingService.ts | 1691 | POST | `/reports/create` | `JsonRecord` |
| bankingService.ts | 1711 | GET | `/reports` | `unknown` |
| bankingService.ts | 1722 | GET | `/analytics?timeRange=${encodeURIComponent(timeRange)}` | `AnalyticsData` |
| bankingService.ts | 1814 | GET | `/user/wallet` | `unknown` |
| bankingService.ts | 1833 | GET | `/admin/system-health` | `unknown` |
| bankingService.ts | 1851 | GET | `/admin/alerts` | `unknown` |
| bankingService.ts | 1869 | GET | `/analytics/geographic-distribution` | `unknown` |
| bankingService.ts | 1886 | POST | `/onboarding/bulk/validate` | `JsonRecord` |
| bankingService.ts | 1904 | POST | `/onboarding/bulk/import` | `JsonRecord` |
| bankingService.ts | 1914 | GET | `/onboarding/bulk/errors/${validationId}` | `JsonRecord` |
| bankingService.ts | 1920 | GET | `/license/usage` | `JsonRecord` |
| bankingService.ts | 1953 | POST | `/license/plan/change` | `JsonRecord` |
| bankingService.ts | 1965 | POST | `/bulk/verify` | `unknown` |
| bankingService.ts | 1970 | GET | `/settings/company` | `CompanySettings` |
| bankingService.ts | 1974 | PATCH | `/settings/company` | `CompanySettings` |
| bankingService.ts | 1979 | POST | `/team/invitations` | `JsonRecord` |
| bankingService.ts | 1993 | POST | `/team/invitations/${invitationId}/resend` | `JsonRecord` |
| bankingService.ts | 2001 | POST | `/team/invitations/accept` | `JsonRecord` |
| bankingService.ts | 2009 | GET | `/api/settings` | `JsonRecord` |
| bankingService.ts | 2018 | PATCH | `/api/settings` | `JsonRecord` |
| bankingService.ts | 2027 | GET | `/billing/plans` | `unknown` |
| bankingService.ts | 2034 | POST | `/billing/checkout/session` | `JsonRecord` |
| bankingService.ts | 2052 | POST | `/account/mono/exchange` | `JsonRecord` |
| bankingService.ts | 2061 | GET | `/account/mono/${monoAccountId}/details` | `unknown` |
| bankingService.ts | 2066 | GET | `/account/mono/${monoAccountId}/identity` | `unknown` |
| bankingService.ts | 2071 | GET | `/account/mono/${monoAccountId}/transactions` | `unknown` |
| bankingService.ts | 2076 | POST | `/biometrics/voice-verification` | `JsonRecord` |
| bankingService.ts | 2087 | POST | `/biometrics/behavioral` | `JsonRecord` |
| bankingService.ts | 2098 | POST | `/biometrics/fingerprint` | `JsonRecord` |
| bankingService.ts | 2109 | POST | `/kyb/business/verify` | `KybWorkflowResponse` |
| bankingService.ts | 2113 | POST | `/kyb/business/registry-check` | `KybWorkflowResponse` |
| bankingService.ts | 2117 | POST | `/kyb/business/ownership` | `KybWorkflowResponse` |
| bankingService.ts | 2121 | POST | `/kyb/business/directors` | `KybWorkflowResponse` |
| bankingService.ts | 2125 | POST | `/kyb/business/financial-health` | `KybWorkflowResponse` |
| bankingService.ts | 2129 | POST | `/kyc/individual/enhanced` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 2140 | POST | `/kyc/individual/batch` | `JsonRecord` |
| bankingService.ts | 2149 | POST | `/kyc/individual/${verificationId}/refresh` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 2154 | POST | `/did/verify` | `JsonRecord` |
| bankingService.ts | 2162 | POST | `/did/credentials/issue` | `JsonRecord` |
| bankingService.ts | 2172 | POST | `/blockchain/proof` | `BlockchainProofByAnchorResponse` |
| bankingService.ts | 2176 | GET | `/ongoing/${customerId}/status` | `OngoingMonitoringStatusResponse` |
| bankingService.ts | 2180 | GET | `/ongoing/${customerId}/changes` | `unknown` |
| bankingService.ts | 2197 | POST | `/compliance/sar/create` | `JsonRecord` |
| bankingService.ts | 2206 | POST | `/compliance/sar/submit` | `JsonRecord` |
| bankingService.ts | 2215 | POST | `/compliance/ctr/create` | `JsonRecord` |
| bankingService.ts | 2224 | POST | `/screening/pep/family-associates` | `PEPCheckApiData` |
| bankingService.ts | 2232 | GET | `/reports/${reportId}` | `JsonRecord` |
| bankingService.ts | 2247 | GET | `/admin/users?${query}` | `User[]` |
| bankingService.ts | 2251 | GET | `/admin/users/${userId}` | `JsonRecord` |
| bankingService.ts | 2277 | PATCH | `/admin/users/${userId}` | `JsonRecord` |
| bankingService.ts | 2282 | DELETE | `/admin/users/${userId}` | `JsonRecord` |
| bankingService.ts | 2287 | POST | `/admin/users/${userId}/reset-password` | `JsonRecord` |
| bankingService.ts | 2292 | POST | `/admin/users/${userId}/impersonate` | `JsonRecord` |
| bankingService.ts | 2297 | GET | `/admin/users/${userId}/activity` | `unknown` |
| bankingService.ts | 2310 | GET | `/admin/users/${userId}/credentials` | `unknown` |
| bankingService.ts | 2322 | GET | `/admin/users/${userId}/transactions` | `unknown` |
| bankingService.ts | 2338 | GET | `/admin/verifiers?${query}` | `Verifier[]` |
| bankingService.ts | 2342 | GET | `/admin/verifiers/${id}` | `Verifier` |
| bankingService.ts | 2346 | PATCH | `/admin/verifiers/${id}` | `JsonRecord` |
| bankingService.ts | 2351 | GET | `/admin/verifiers/${verifierId}/credentials` | `unknown` |
| bankingService.ts | 2363 | GET | `/admin/verifiers/${verifierId}/reviews` | `unknown` |
| bankingService.ts | 2375 | GET | `/verifier/profile` | `VerifierProfile` |
| bankingService.ts | 2379 | PATCH | `/verifier/profile` | `VerifierProfile` |
| bankingService.ts | 2384 | GET | `/user/verifications${query}` | `unknown` |
| bankingService.ts | 2390 | GET | `/notifications${query}` | `unknown` |
| bankingService.ts | 2396 | GET | `/analytics/fraud-trends${query}` | `unknown` |
| bankingService.ts | 2404 | GET | `/analytics/risk-distribution${query}` | `unknown` |
| bankingService.ts | 2412 | GET | `/analytics/compliance-metrics${query}` | `unknown` |
| bankingService.ts | 2425 | GET | `/analytics/geographical` | `unknown` |
| bankingService.ts | 2433 | GET | `/analytics/processing-times${query}` | `unknown` |
| bankingService.ts | 2440 | GET | `/health` | `JsonRecord` |
| bankingService.ts | 2450 | GET | `/admin/alerts${query}` | `unknown` |
| bankingService.ts | 2456 | GET | `/alerts${query}` | `unknown` |
| bankingService.ts | 2461 | GET | `/alerts/${alertId}` | `JsonRecord` |
| bankingService.ts | 2466 | POST | `/alerts/${alertId}/investigate` | `JsonRecord` |
| bankingService.ts | 2471 | POST | `/alerts/${alertId}/resolve` | `JsonRecord` |
| bankingService.ts | 2476 | POST | `/privacy/consent/record` | `JsonRecord` |
| bankingService.ts | 2488 | GET | `/privacy/consent/${customerId}` | `unknown` |
| bankingService.ts | 2501 | POST | `/privacy/data-export` | `JsonRecord` |
| bankingService.ts | 2510 | POST | `/privacy/data-deletion` | `JsonRecord` |
| bankingService.ts | 2518 | POST | `/compliance/reports/schedule` | `JsonRecord` |
| bankingService.ts | 2528 | GET | `/compliance/reports${query}` | `unknown` |
| bankingService.ts | 2533 | GET | `/kyc/individual/${verificationId}` | `unknown` |
| bankingService.ts | 2538 | POST | `/zk-proof/generate` | `unknown` |
| bankingService.ts | 2549 | POST | `/zk-proof/verify` | `JsonRecord` |
| bankingService.ts | 2558 | GET | `/zk-proof/verification/${verificationId}` | `unknown` |
| bankingService.ts | 2563 | POST | `/zk-proof/disclose` | `JsonRecord` |
| bankingService.ts | 2572 | GET | `/zk-proof/circuits` | `unknown` |
| bankingService.ts | 2585 | GET | `/zk-proof/noir/toolchain` | `JsonRecord` |
| bankingService.ts | 2597 | POST | `/zk-proof/noir/generate` | `unknown` |
| bankingService.ts | 2608 | POST | `/zk-proof/noir/verify` | `JsonRecord` |
| bankingService.ts | 2617 | POST | `/blockchain/anchor` | `JsonRecord` |
| bankingService.ts | 2627 | GET | `/blockchain/proof/${verificationId}` | `JsonRecord` |
| bankingService.ts | 2637 | POST | `/did/create` | `JsonRecord` |
| bankingService.ts | 2648 | GET | `/did/${customerId}` | `JsonRecord` |
| bankingService.ts | 2659 | GET | `/did/credentials/${credentialId}` | `JsonRecord` |
| bankingService.ts | 2672 | GET | `/did/credentials/customer/${customerId}` | `unknown` |
| bankingService.ts | 2686 | POST | `/did/credentials/present` | `JsonRecord` |
| bankingService.ts | 2695 | POST | `/did/credentials/verify` | `JsonRecord` |
| bankingService.ts | 2704 | GET | `/monitoring/rules` | `unknown` |
| bankingService.ts | 2717 | POST | `/monitoring/rules/create` | `JsonRecord` |
| bankingService.ts | 2729 | PATCH | `/monitoring/rules/${ruleId}` | `JsonRecord` |
| bankingService.ts | 2741 | DELETE | `/monitoring/rules/${ruleId}` | `(implicit/none)` |
| bankingService.ts | 2746 | GET | `/cases${query}` | `unknown` |
| bankingService.ts | 2759 | POST | `/cases/create` | `JsonRecord` |
| bankingService.ts | 2772 | GET | `/cases/${caseId}` | `JsonRecord` |
| bankingService.ts | 2785 | PATCH | `/cases/${caseId}` | `JsonRecord` |
| bankingService.ts | 2798 | POST | `/cases/${caseId}/assign` | `JsonRecord` |
| bankingService.ts | 2803 | POST | `/cases/${caseId}/close` | `JsonRecord` |
| bankingService.ts | 2809 | GET | `/documents/supported-types${query}` | `unknown` |
| bankingService.ts | 2816 | POST | `/documents/classify` | `JsonRecord` |
| bankingService.ts | 2824 | POST | `/documents/compare` | `JsonRecord` |
| bankingService.ts | 2832 | POST | `/screening/adverse-media/check` | `JsonRecord` |
| bankingService.ts | 2841 | GET | `/screening/sanctions/lists` | `unknown` |
| bankingService.ts | 2848 | POST | `/screening/${screeningType}/ongoing` | `JsonRecord` |
| bankingService.ts | 2858 | POST | `/account/verify` | `JsonRecord` |
| bankingService.ts | 2869 | POST | `/account/instant-verify` | `JsonRecord` |
| bankingService.ts | 2880 | POST | `/account/micro-deposits` | `JsonRecord` |
| bankingService.ts | 2891 | POST | `/transactions/screen` | `JsonRecord` |
| bankingService.ts | 2901 | POST | `/ongoing/enable` | `JsonRecord` |
| bankingService.ts | 2911 | POST | `/ongoing/disable` | `JsonRecord` |
| bankingService.ts | 2921 | GET | `/ongoing/due-reviews` | `unknown` |
| bankingService.ts | 2933 | POST | `/watchlist/add` | `JsonRecord` |
| bankingService.ts | 2944 | GET | `/watchlist` | `unknown` |
| bankingService.ts | 2956 | POST | `/source-of-funds/verify` | `JsonRecord` |
| bankingService.ts | 2966 | POST | `/source-of-funds/analyze` | `JsonRecord` |
| bankingService.ts | 2976 | POST | `/source-of-wealth/verify` | `JsonRecord` |
| bankingService.ts | 2986 | GET | `/source-of-wealth/${customerId}/assessment` | `JsonRecord` |
| bankingService.ts | 2996 | POST | `/credit/check` | `JsonRecord` |
| bankingService.ts | 3006 | POST | `/credit/score` | `JsonRecord` |
| bankingService.ts | 3016 | POST | `/translation/text` | `JsonRecord` |
| bankingService.ts | 3025 | POST | `/translation/document` | `JsonRecord` |
| bankingService.ts | 3034 | POST | `/localization/currency-convert` | `JsonRecord` |
| bankingService.ts | 3045 | GET | `/localization/regulations/${country}` | `unknown` |
| bankingService.ts | 3065 | POST | `/sandbox/generate-test-data` | `JsonRecord` |
| bankingService.ts | 3074 | GET | `/verification/health` | `JsonRecord` |
| bankingService.ts | 3083 | GET | `/verification/cameras` | `unknown` |
| bankingService.ts | 3090 | GET | `/verification/config` | `unknown` |
| bankingService.ts | 3095 | POST | `/verification/proxy/token` | `unknown` |
| bankingService.ts | 3100 | GET | `/verification/model/status` | `JsonRecord` |
| bankingService.ts | 3109 | POST | `/verification/model/reload` | `JsonRecord` |
| bankingService.ts | 3119 | GET | `/disputes${query}` | `unknown` |
| bankingService.ts | 3134 | GET | `/disputes/${disputeId}` | `JsonRecord` |
| bankingService.ts | 3186 | POST | `/disputes/${disputeId}/assign` | `JsonRecord` |
| bankingService.ts | 3192 | GET | `/governance/proposals${query}` | `unknown` |
| bankingService.ts | 3210 | POST | `/governance/proposals` | `JsonRecord` |
| bankingService.ts | 3228 | GET | `/governance/proposals/${proposalId}` | `JsonRecord` |
| bankingService.ts | 3255 | POST | `/governance/proposals/${proposalId}/execute` | `JsonRecord` |
| bankingService.ts | 3260 | GET | `/financial/overview${buildQueryString({ range })}` | `JsonRecord` |
| bankingService.ts | 3281 | GET | `/financial/revenue/customers${query}` | `unknown` |
| bankingService.ts | 3294 | GET | `/financial/treasury/transactions${query}` | `unknown` |
| bankingService.ts | 3307 | GET | `/admin/content${query}` | `unknown` |
| bankingService.ts | 3322 | GET | `/admin/content${query}` | `unknown` |
| bankingService.ts | 3336 | GET | `/admin/content` | `unknown` |
| bankingService.ts | 3355 | POST | `/admin/content/${contentId}/moderate` | `JsonRecord` |
| bankingService.ts | 3360 | GET | `/verifier/reputation` | `JsonRecord` |
| bankingService.ts | 3373 | GET | `/verifier/reviews${query}` | `unknown` |
| bankingService.ts | 3387 | POST | `/verifier/reviews/${reviewId}/reply` | `JsonRecord` |
| bankingService.ts | 3392 | GET | `/verifier/earnings${buildQueryString({ range })}` | `JsonRecord` |
| bankingService.ts | 3405 | GET | `/verifier/withdrawals${query}` | `unknown` |
| bankingService.ts | 3418 | POST | `/verifier/withdrawals` | `JsonRecord` |
| bankingService.ts | 3431 | GET | `/verifier/staking` | `JsonRecord` |
| bankingService.ts | 3452 | GET | `/verifier/staking` | `unknown` |
| bankingService.ts | 3471 | POST | `/verifier/staking/actions` | `JsonRecord` |
| bankingService.ts | 3476 | POST | `/verifier/staking/actions` | `JsonRecord` |
| bankingService.ts | 3482 | GET | `/verifier/help/articles${query}` | `unknown` |
| bankingService.ts | 3493 | POST | `/verifier/help/tickets` | `JsonRecord` |
| bankingService.ts | 3504 | GET | `/verifier/help/tickets${query}` | `unknown` |
| bankingService.ts | 3514 | PATCH | `/notifications/${notificationId}/read` | `JsonRecord` |
| bankingService.ts | 3519 | POST | `/notifications/mark-all-read` | `JsonRecord` |
| bankingService.ts | 3525 | GET | `/credentials${query}` | `unknown` |
| bankingService.ts | 3538 | GET | `/credentials/${credentialId}` | `JsonRecord` |
| bankingService.ts | 3560 | POST | `/credentials/${credentialId}/revoke` | `JsonRecord` |
| bankingService.ts | 3566 | GET | `/enterprises${query}` | `unknown` |
| bankingService.ts | 3580 | GET | `/enterprises/${enterpriseId}` | `JsonRecord` |
| bankingService.ts | 3607 | GET | `/enterprises/${enterpriseId}/team` | `unknown` |
| bankingService.ts | 3628 | GET | `/logs/errors${query}` | `unknown` |
| bankingService.ts | 3640 | POST | `/logs/errors/${errorId}/resolve` | `JsonRecord` |
| bankingService.ts | 3645 | POST | `/verifier/issue-credential` | `CredentialIssuanceResponse` |
| authService.ts | 290 | POST | `/login` | `AuthTokenResponse \| LoginMfaChallenge` |
| authService.ts | 307 | POST | `/mfa/verify` | `AuthTokenResponse` |
| authService.ts | 315 | POST | `/mfa/recovery-code/verify` | `AuthTokenResponse` |
| authService.ts | 340 | POST | `/mfa/enroll/verify` | `(implicit/none)` |
| authService.ts | 347 | POST | `/signup` | `SignupResponse` |
| authService.ts | 355 | POST | `/refresh` | `AuthTokenResponse` |
| authService.ts | 363 | POST | `/logout` | `undefined` |
| authService.ts | 370 | POST | `/forgot-password` | `(implicit/none)` |
| authService.ts | 377 | POST | `/reset-password` | `(implicit/none)` |
| authService.ts | 384 | GET | `/me` | `{ id: string; email: string; role: BackendRole; permissions: string[] }` |

## 2) Frontend Schema Source Of Truth (Banking Domain)

Verbatim schema definitions from `src/types/banking.ts`:

```ts

export interface IndividualKYCRequest {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  idDocumentType: 'passport' | 'drivers_license' | 'national_id';
  idDocumentNumber: string;
}

export interface IndividualKYCResponse {
  verificationId: string;
  status: 'pending' | 'verified' | 'rejected' | 'requires_action' | 'in_progress' | 'review_needed';
  riskScore: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface VerificationStatusResponse {
  verificationId: string;
  type?: 'kyc_individual' | 'kyc_business' | 'sanctions' | 'pep' | 'document' | 'aml';
  status: 'pending' | 'verified' | 'rejected' | 'requires_action' | 'in_progress' | 'review_needed' | 'not_found';
  details?: VerificationDetails;
  updatedAt: string;
  createdAt: string; // Ensure createdAt is included as it is used in UI
}

export interface VerificationDetails {
  firstName?: string;
  lastName?: string;
  dob?: string;
  country?: string;
  email?: string;
  documentType?: string;
  documentNumber?: string;
  idDocumentNumber?: string;
  expiryDate?: string;
  nationality?: string;
  aiScore?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  extractedData?: Record<string, string | number | boolean | null>;
  [key: string]: unknown;
}

export interface DocumentVerifyRequest {
  documentType: 'passport' | 'drivers_license' | 'national_id';
  documentImage: string;
  documentBackImage?: string;
  issuingCountry: string;
  expectedData?: {
    firstName?: string;
    lastName?: string;
    documentNumber?: string;
    [key: string]: string | undefined;
  };
  useOcr?: boolean;
}

export interface DocumentVerifyResponse {
  authentic: boolean;
  confidenceScore: number;
  securityFeaturesDetected: Array<{
    type: string;
    status: string;
    valid?: boolean;
  }>;
  fraudIndicators: {
    forgery: string;
    manipulation: string;
    photoSubstitution: string;
  };
  qualityAssessment: {
    imageQuality: string;
    blur: string;
    glare: string;
    orientation: string;
  };
  expectedDataMatch?: {
    checked: number;
    matched: number;
    matchRate: number;
    details: Array<{
      field: string;
      expected: string;
      matched: boolean;
    }>;
  };
  mrz?: {
    detected: boolean;
    parsed?: Record<string, unknown>;
    valid?: boolean;
  };
  signals?: {
    imageSize?: {
      width: number;
      height: number;
    };
    textCoverage?: number;
    blockCount?: number;
    brightness?: number;
    contrast?: number;
    edgeDensity?: number;
  };
}

export interface DocumentExtractRequest {
  documentImage: string; // Base64 or URL
}

export interface DocumentExtractResponse {
  fields: Record<string, string>;
  confidence: number;
}

export interface BiometricFaceMatchRequest {
  selfieImage: string; // Base64
  documentImage?: string; // Base64
  idPhotoImage?: string; // Base64
  threshold?: number;
}

export interface BiometricFaceMatchResponse {
  match: boolean;
  score: number; // 0-100
}

export interface BiometricLivenessRequest {
  livenessType?: 'passive' | 'active';
  selfieImage?: string | string[];
  videoUrl?: string;
  imageSequence?: string[];
}

export interface BiometricLivenessResponse {
  isLive: boolean;
  score: number;
}

export interface SanctionsCheckRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  dob?: string;
  nationality?: string;
  country?: string;
  fuzzyMatching?: boolean;
  matchThreshold?: number;
}

export interface SanctionsCheckResponse {
  matchFound: boolean;
  hits: SanctionsHit[];
}

export interface SanctionsHit {
  name?: string;
  listName?: string;
  score?: number;
  [key: string]: unknown;
}

export interface PEPCheckRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  country?: string;
  fuzzyMatching?: boolean;
  matchThreshold?: number;
}

export interface PEPCheckResponse {
  isPEP: boolean;
  details?: Record<string, unknown>;
}

export interface AMLRiskScoreRequest {
  customerId?: string;
  customerProfile?: Record<string, unknown>;
  verificationResults?: Record<string, unknown>;
  transactionProfile?: Record<string, unknown>;
  relationshipFactors?: Record<string, unknown>;
  customerData?: IndividualKYCRequest;
}

export interface AMLRiskScoreResponse {
  score: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  factors: string[];
}

export interface TransactionMonitoringRequest {
  transactionId: string;
  customerId?: string;
  amount?: number;
  currency?: string;
  senderId?: string;
  receiverId?: string;
  timestamp?: string;
  transaction?: {
    amount: number;
    destinationCountry?: string;
    highRiskCountries?: string[];
  };
  customerRiskProfile?: {
    typicalTransactionSize?: number;
    riskLevel?: string;
  };
}

export interface TransactionMonitoringResponse {
  isSuspicious: boolean;
  riskScore: number;
  action: 'approve' | 'manual_review' | 'block';
}

export interface WebhookRegisterRequest {
  url?: string;
  webhookUrl?: string;
  events: string[];
  secret?: string;
  active?: boolean;
}

export interface ApiValidationErrorDetail {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface ApiValidationError {
  code: 'validation_error';
  message: string;
  details: ApiValidationErrorDetail[];
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: ApiValidationError;
  timestamp: string;
}

export interface ApiErrorShape {
  success?: false;
  error?: {
    code?: string;
    message?: string;
  };
  detail?: string;
}

export interface BankingRetryEventDetail {
  requestId: string;
  path: string;
  status: number;
  attempt: number;
  retryInMs: number;
}

export interface BankingRequestDiagnosticEvent {
  requestId: string;
  path: string;
  method: string;
  stage: 'started' | 'retrying' | 'failed' | 'succeeded';
  status?: number;
  attempt?: number;
  retryInMs?: number;
  message?: string;
  occurredAt: string;
}

export interface IndividualKYCVerifyApiData {
  verificationId?: string;
  id?: string;
  status?: string;
  overallResult?: string;
  verificationType?: string;
  type?: string;
  result?: VerificationDetails;
  details?: VerificationDetails;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentExtractApiData {
  extractedData?: {
    fields?: Record<string, unknown>;
  };
  confidence?: {
    overall?: number;
  };
}

export interface BiometricFaceMatchApiData {
  match?: boolean;
  matchScore?: number;
}

export interface BiometricLivenessApiData {
  live?: boolean;
  livenessScore?: number;
}

export interface SanctionsCheckApiData {
  status?: string;
  matches?: SanctionsHit[];
}

export interface PEPCheckApiData {
  status?: string;
  totalMatches?: number;
  [key: string]: unknown;
}

export interface AMLRiskScoreApiData {
  overallRiskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  riskFactors?: Array<{ factor?: string }>;
}

export interface TransactionMonitoringApiData {
  decision?: 'approve' | 'manual_review' | 'block' | string;
  transactionRiskScore?: number;
}

export interface WebhookResponse {
  id: string;
  webhookId?: string;
  url: string;
  webhookUrl?: string;
  events: string[];
  isActive: boolean;
  active?: boolean;
  createdAt: string;
}

export interface ApiKeyCreateRequest {
  name?: string;
  scopes?: string[];
  keyName?: string;
  permissions?: string[];
  environment?: 'production' | 'sandbox';
  expiresAt?: string | null;
  ipWhitelist?: string[] | null;
  rateLimit?: number | null;
}

export interface ApiKeyResponse {
  id: string;
  keyId?: string;
  name: string;
  keyName?: string;
  keyPrefix: string;
  environment?: 'production' | 'sandbox';
  apiKey?: string;
  createdAt: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  status?: 'active' | 'revoked' | string;
  rateLimit?: number | null;
  lastUsed?: string;
  scopes: string[];
  permissions?: string[];
}

export interface ApiKeyCreateResult {
  keyId: string;
  apiKey: string;
  keyPrefix?: string;
  environment?: 'production' | 'sandbox';
  name?: string;
  permissions: string[];
  createdAt: string;
  expiresAt: string | null;
}

export interface ApiKeyRevokeResult {
  keyId: string;
  revoked: boolean;
  revokedAt: string;
}

export type ApiKeyListItem = ApiKeyResponse;

export interface WebhookRegisterResult {
  webhookId: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface WebhookDeleteResult {
  webhookId: string;
  deleted: boolean;
  deletedAt: string;
}

export interface WebhookTestRequest {
  webhookId?: string;
  webhookUrl?: string;
  eventType: string;
  payload?: Record<string, unknown>;
}

export interface AuditLogResponse {
  id: string;
  eventId?: string;
  action: string;
  eventType?: string;
  actorId: string;
  actor?: string;
  resourceId: string;
  targetType?: string;
  targetId?: string;
  requestId?: string;
  timestamp: string;
  createdAt?: string;
  details: Record<string, unknown> | string | number | boolean | null;
  data?: Record<string, unknown> | string | number | boolean | null;
  status: 'success' | 'failure';
}

export interface VerificationStatsResponse {
  totalVerifications: number;
  approved: number;
  rejected: number;
  pending: number;
  manualReview?: number;
  averageTime: number; // in seconds
  averageProcessingTime?: number;
  successful: number;
  failed: number;
  successRate?: number;
  dailyBreakdown: {
    date: string;
    count: number;
  }[];
  breakdown?: {
    period: string;
    total: number;
    approved: number;
    rejected: number;
    manualReview: number;
  }[];
}

export interface ReportCreateRequest {
  type?: 'compliance' | 'audit' | 'activity';
  reportType?: 'verification_summary' | 'compliance_summary' | 'risk_distribution';
  dateRange: {
    start?: string;
    end?: string;
    from?: string;
    to?: string;
  };
  filters?: Record<string, string | number | boolean | Array<string | number> | null>;
  format?: 'pdf' | 'csv' | 'excel';
  includeCharts?: boolean;
}

export interface ReportResponse {
  reportId: string;
  status: 'generating' | 'ready' | 'failed';
  estimatedCompletion?: string | null;
  downloadUrl?: string;
}

export interface ComplianceReport {
  id: string;
  name: string;
  date: string;
  type: 'Monthly' | 'Quarterly' | 'Annual';
  status: 'Compliant' | 'Review Needed' | 'Certified' | 'Pending';
  verifications: number;
  issues: number;
}

export interface AnalyticsData {
  dates: string[];
  verifications: number[];
  approvals: number[];
  rejections: number[];
}

export interface VerificationRequestResponse {
  verificationId: string;
  type: 'kyc_individual' | 'kyc_business' | 'sanctions' | 'pep' | 'document' | 'aml';
  status: 'pending' | 'verified' | 'rejected' | 'requires_action' | 'in_progress' | 'review_needed' | 'not_found';
  details?: VerificationDetails;
  createdAt: string;
  updatedAt: string;
  subject?: string;
}

export interface BulkVerificationRequest {
  items: BulkVerifyItem[];
}

export interface BulkVerificationResponse {
  batchId: string;
  items: Array<{
    requestId: string;
    verificationId: string;
  }>;
}

export interface BulkOnboardingValidationIssue {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface BulkOnboardingValidationResponse {
  validationId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  progress: number;
  issues: BulkOnboardingValidationIssue[];
}

export interface BulkOnboardingImportResponse {
  importJobId: string;
  acceptedRows: number;
  rejectedRows: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export interface RiskRuleWeights {
  identity: number;
  sanctions: number;
  transaction: number;
  geography: number;
  device: number;
}

export interface RiskSimulationRequest {
  customerProfile: {
    customerType: 'retail' | 'business';
    country: string;
    transactionAmount: number;
    sanctionsHits: number;
    priorAlerts: number;
  };
  weights: RiskRuleWeights;
}

export interface RiskSimulationResponse {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  factors: Array<{ factor: string; contribution: number }>;
  recommendation: string;
}

export interface RiskSimulationReport {
  reportId: string;
  generatedAt: string;
  downloadUrl?: string;
}

export interface AuditExplorerFilters {
  from?: string;
  to?: string;
  entity?: string;
  eventType?: string;
}

export interface SignedAuditExportResponse {
  exportId: string;
  signature: string;
  downloadUrl?: string;
}

export interface WebhookRetryItem {
  id: string;
  webhookId: string;
  eventType: string;
  nextRetryAt: string;
  attempt: number;
}

export interface WebhookTestResponse {
  webhookId: string | null;
  status: 'delivered' | 'invalid_target' | 'inactive' | 'not_found';
  eventType?: string;
  targetUrl?: string | null;
  sentAt?: string;
}

export interface WebhookSecretRotateResponse {
  webhookId: string;
  previousSecretLast4: string;
  newSecret: string;
  rotatedAt: string;
}

export interface LicenseUsageMetrics {
  planName: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  monthlyQuota: number;
  usedQuota: number;
  slaUptime: number;
  anomalyAlerts: Array<{ id: string; message: string; severity: 'low' | 'medium' | 'high' }>;
}

export interface BulkVerifyItem {
  requestId: string;
  customerId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    country: string;
  };
  contactInfo: {
    email: string;
    address: {
      country: string;
    };
  };
  identityDocuments: Array<{
    type: 'passport' | 'drivers_license' | 'national_id';
    number: string;
  }>;
  callbackUrl?: string;
}

export interface CompanySettings {
  companyName: string;
  industry: string;
  website: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    webhook: boolean;
  };
  security: {
    mfaEnabled: boolean;
    ipWhitelist?: string[];
  };
}

export interface InvitationAcceptBody {
  token: string;
}

export interface InvitationLifecycleResponse {
  invitationId: string;
  status: string;
}

export interface ApiSecuritySettings {
  autoRotateSecrets: boolean;
  ipWhitelistEnabled: boolean;
  allowedIps: string[];
}

export interface BillingPlan {
  id: string;
  name: string;
  description?: string;
  amount?: number;
  currency?: string;
  interval?: 'monthly' | 'yearly';
  features?: string[];
  [key: string]: unknown;
}

export interface CheckoutSessionBody {
  targetPlan: string;
  billingInterval: 'monthly' | 'yearly';
}

export interface CheckoutSessionResponse {
  checkoutSessionId?: string;
  checkoutUrl: string;
  [key: string]: unknown;
}

export interface MonoExchangeBody {
  customerId: string;
  code: string;
  metadata?: Record<string, unknown>;
}

export interface MonoExchangeResponse {
  monoAccountId: string;
  status?: string;
  [key: string]: unknown;
}

export interface VoiceVerificationBody {
  customerId: string;
  voiceSample: string;
  phrase?: string;
}

export interface BehavioralBody {
  customerId: string;
  signals: Record<string, unknown>;
}

export interface FingerprintBody {
  customerId: string;
  fingerprintTemplate: string;
}

export interface BiometricVerificationResponse {
  verificationId?: string;
  sessionId?: string;
  status: string;
  score?: number;
  riskScore?: number;
  privacyProof?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BusinessInfo {
  businessRef: string;
  name: string;
  country: string;
  registrationNumber?: string;
  address?: Record<string, unknown>;
}

export interface KybDirectorsBody {
  businessRef: string;
  directors: Array<Record<string, unknown>>;
  matchThreshold?: number;
  fuzzyMatching?: boolean;
}

export interface KybFinancialHealthBody {
  businessRef: string;
  [key: string]: unknown;
}

export interface KybWorkflowResponse {
  status: string;
  verificationId?: string;
  recommendation?: string;
  overallRecommendation?: string;
  results?: Array<Record<string, unknown>>;
  score?: number;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface KycIndividualEnhancedBody {
  [key: string]: unknown;
  additionalChecks?: Record<string, unknown>;
  callbackUrl?: string;
  priority?: 'low' | 'standard' | 'high' | 'urgent';
}

export interface KycBatchBody {
  items: Array<Record<string, unknown>>;
}

export interface KycBatchResponse {
  batchId: string;
  verificationIds?: string[];
  [key: string]: unknown;
}

export interface DidVerifyBody {
  did: string;
  challenge: string;
  signature: string;
}

export interface DidVerifyResponse {
  did: string;
  verified: boolean;
}

export interface CredentialIssueBody {
  customerId: string;
  verificationId?: string;
  did?: string;
  credentialType: string;
  schema?: Record<string, unknown> | string;
  claims: Record<string, unknown>;
  expiresAt?: string;
}

export interface CredentialIssueResponse {
  credentialId: string;
  status: string;
  credential?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BlockchainProofByAnchorResponse {
  anchorId: string;
  status: 'anchored' | 'not_found' | string;
  proof?: {
    chain?: string;
    txHash?: string;
    anchorData?: Record<string, unknown>;
    anchoredAt?: string;
  };
}

export interface OngoingMonitoringStatusResponse {
  subscriptionId: string;
  active: boolean;
  monitoringType: string;
  frequencyDays?: number;
  nextReviewAt?: string;
  callbackUrl?: string;
}

export interface OngoingChangeItem {
  changeId: string;
  changeType: string;
  details?: Record<string, unknown>;
  detectedAt: string;
}

export interface OngoingMonitoringChangesResponse {
  items: OngoingChangeItem[];
}

export interface SarCreateBody {
  requestId: string;
  customerId?: string;
  narrative: string;
  activity: Record<string, unknown>;
}

export interface SarSubmitBody {
  reportId: string;
  submissionChannel: 'electronic' | 'manual';
}

export interface CtrCreateBody {
  requestId: string;
  customerId?: string;
  transaction: Record<string, unknown>;
}

export interface ComplianceCaseResponse {
  reportId: string;
  status: string;
  [key: string]: unknown;
}

export interface PepFamilyBody {
  firstName: string;
  lastName: string;
  fuzzyMatching?: boolean;
  matchThreshold?: number;
}

export interface ReportDetailResponse {
  reportId: string;
  reportType: 'verification_summary' | 'compliance_summary' | 'risk_distribution' | string;
  status: 'generating' | 'ready' | 'failed' | 'not_found' | string;
  format: 'pdf' | 'csv' | 'excel' | string;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
  readyAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'verifier' | 'enterprise' | 'manager';
  status: 'active' | 'suspended' | 'banned' | 'pending';
  joinedAt: string;
  lastActive?: string;
  avatar?: string;
  // Verifier specific fields
  organizationName?: string;
  verificationLevel?: 'None' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  credentialsIssued?: number;
  reputation?: number;
}

export interface Verifier extends User {
  role: 'verifier';
  description?: string;
  website?: string;
  location?: string;
  did?: string;
  stats?: {
    issued: number;
    active: number;
    revoked: number;
    reputation: number;
    earnings: string | number;
  };
}

export interface VerifierProfile extends Verifier {
  title?: string;
  languages?: string[];
  specializations?: string[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    expiry?: string;
  }[];
  pricing?: {
    type: string;
    price: number;
    expedited: number;
  }[];
  availability?: {
    vacationMode: boolean;
    schedule: {
      day: string;
      active: boolean;
      start: string;
      end: string;
    }[];
    timezone: string;
  };
  autoAccept?: {
    enabled: boolean;
    minPrice: number;
    allowedTypes: string[];
  };
}

export interface CredentialIssuanceRequest {
  verificationId: string;
  recipientDid: string;
  credentialType: string;
  data: Record<string, unknown>;
  notes?: string;
}

export interface DashboardNotification {
  id: string;
  type: 'alert' | 'transaction' | 'message' | 'update' | 'info';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionLabel?: string;
}

export interface MarketplaceVerifier {
  id: string;
  name: string;
  category: string;
  rating: number;
  verified: boolean;
  imageUrl?: string;
  reviewCount?: number;
  priceFrom?: number;
  currency?: string;
}

export interface UserWalletOverview {
  currency: string;
  balance: number;
  totalSpent: number;
}

export interface SystemHealthService {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
}

export interface GeoDistributionItem {
  region: string;
  percentage: number;
}

export interface CredentialIssuanceResponse {
  credentialId: string;
  transactionHash: string;
  issuedAt: string;
  status: 'issued' | 'pending' | 'failed';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  [key: string]: unknown;
}

export interface PagedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PrivacyProofSummary {
  proofId: string;
  proofType: string;
  proofRole: 'primary' | 'claim';
  verificationId?: string;
  commitment?: string;
  publicSignals: Record<string, unknown>;
  zkProof?: {
    backend: 'noir';
    circuitId: string;
    verifierTarget?: string;
  } | null;
}

export interface VerificationViewModel {
  verificationId: string;
  status: string;
  overallResult?: string;
  riskLevel?: string;
  privacyProof?: PrivacyProofSummary | null;
  privacyClaims: PrivacyProofSummary[];
}

export interface FraudTrendPoint {
  period: string;
  count: number;
  severity?: string;
}

export interface RiskDistributionItem {
  bucket: string;
  count: number;
  percentage: number;
}

export interface ComplianceMetric {
  label: string;
  value: number;
  unit?: string;
  change?: number;
}

export interface ProcessingTimePoint {
  period: string;
  averageSeconds: number;
  p95Seconds?: number;
}

export interface ConsentRecord {
  consentId: string;
  customerId: string;
  type: string;
  status: string;
  recordedAt: string;
  details?: Record<string, unknown>;
}

export interface DataExportResponse {
  exportId: string;
  status: string;
  downloadUrl?: string;
}

export interface DataDeletionResponse {
  requestId: string;
  status: string;
}

export interface ComplianceScheduleResponse {
  scheduleId: string;
  status: string;
  nextRunAt?: string;
}

export interface ProofVerificationResponse {
  valid: boolean;
  proofId?: string;
  message?: string;
}

export interface CircuitCatalogItem {
  circuitId: string;
  title: string;
  description?: string;
  privateInputs: string[];
  publicInputs: string[];
  defaultDisclosureFields: string[];
}

export interface NoirToolchainStatus {
  ready: boolean;
  runtime: 'native' | 'docker' | 'unknown';
  version?: string;
}

export interface SelectiveDisclosureResponse {
  disclosureId: string;
  disclosedFields: string[];
  payload: Record<string, unknown>;
}

export interface BlockchainAnchorResponse {
  anchorId: string;
  transactionHash: string;
  status: string;
  anchoredAt?: string;
}

export interface DidRecord {
  did: string;
  customerId: string;
  status: string;
  createdAt: string;
  document?: Record<string, unknown>;
}

export interface CredentialRecord {
  credentialId: string;
  type: string;
  issuedAt: string;
  status: string;
  subjectDid?: string;
  issuerDid?: string;
  data?: Record<string, unknown>;
}

export interface PresentationResponse {
  presentationId: string;
  status: string;
  challenge?: string;
}

export interface MonitoringRule {
  ruleId: string;
  name: string;
  status: string;
  severity?: string;
  conditions: Record<string, unknown>;
  updatedAt: string;
}

export interface CaseRecord {
  caseId: string;
  status: string;
  priority: string;
  title: string;
  assignedTo?: string;
  updatedAt: string;
  details?: Record<string, unknown>;
}

export interface PrimitiveHealth {
  status: string;
  ready: boolean;
  details?: Record<string, unknown>;
}

export interface PrimitiveModelStatus {
  status: string;
  loaded: boolean;
  modelVersion?: string;
}

export interface AccountVerificationResponse {
  verificationId: string;
  status: string;
  accountName?: string;
  bankName?: string;
  confidence?: number;
}

export interface MonitoringToggleResponse {
  customerId: string;
  active: boolean;
  monitoringType?: string;
  updatedAt: string;
}

export interface DueReviewItem {
  id: string;
  customerId: string;
  dueAt: string;
  reason: string;
  status: string;
}

export interface WatchlistEntry {
  id: string;
  customerId: string;
  status: string;
  reason?: string;
  createdAt: string;
}

export interface SourceOfFundsResponse {
  verificationId: string;
  status: string;
  riskLevel?: string;
  summary?: string;
}

export interface SourceOfWealthAssessment {
  customerId: string;
  riskLevel: string;
  summary: string;
  factors: string[];
}

export interface CreditCheckResponse {
  checkId: string;
  status: string;
  score?: number;
  provider?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export interface CurrencyConversionResponse {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  convertedAmount: number;
  rate: number;
}

export interface CountryRegulationResponse {
  country: string;
  regulations: Array<{
    id: string;
    title: string;
    summary: string;
    category?: string;
  }>;
}

export interface SandboxSeedResponse {
  batchId: string;
  recordsCreated: number;
  status: string;
}

export interface ApiReferenceEndpoint {
  category: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  component: string;
  description: string;
  auth?: string;
}

export interface ApiReferenceSection {
  id: string;
  title: string;
  endpoints: ApiReferenceEndpoint[];
}

export interface DisputeRecord {
  disputeId: string;
  type: string;
  status: "open" | "in_review" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  filedBy: string;
  against: string;
  filedAt: string;
  assignedTo?: string;
  summary?: string;
}

export interface DisputeTimelineEvent {
  eventId: string;
  eventType: string;
  actor: string;
  message: string;
  createdAt: string;
}

export interface DisputeEvidenceItem {
  id: string;
  name: string;
  url?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface DisputeDetailRecord extends DisputeRecord {
  description?: string;
  filedByProfile?: {
    name: string;
    email?: string;
    role?: string;
    avatarUrl?: string;
  };
  againstProfile?: {
    name: string;
    email?: string;
    role?: string;
    avatarUrl?: string;
  };
  evidence: DisputeEvidenceItem[];
  timeline: DisputeTimelineEvent[];
}

export interface DisputeResolveBody {
  resolution: "approve_refund" | "reject" | "partial";
  notes: string;
  refundAmount?: number;
}

export interface GovernanceProposal {
  proposalId: string;
  title: string;
  summary: string;
  type: string;
  status: "active" | "passed" | "rejected" | "executed" | "draft";
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain?: number;
  createdAt: string;
  votingEndsAt: string;
}

export interface GovernanceVote {
  voter: string;
  vote: "for" | "against" | "abstain";
  power: number;
  createdAt: string;
}

export interface GovernanceProposalDetail extends GovernanceProposal {
  changes?: Record<string, unknown>[];
  timeline?: Array<{ date: string; event: string }>;
  recentVotes?: GovernanceVote[];
}

export interface GovernanceProposalCreateBody {
  title: string;
  summary: string;
  type: string;
  changes: Record<string, unknown>[];
  votingEndsAt: string;
}

export interface FinancialOverviewResponse {
  totalRevenue: number;
  recurringRevenue: number;
  escrowBalance: number;
  treasuryBalance: number;
  revenueTrend: Array<{ period: string; value: number }>;
  sourceBreakdown: Array<{ source: string; percentage: number; value?: number }>;
  regionalBreakdown: Array<{ region: string; value: number }>;
}

export interface RevenueCustomerItem {
  customerId: string;
  name: string;
  type: string;
  transactions: number;
  revenue: number;
  growthPercent: number;
}

export interface FinancialTransactionRecord {
  transactionId: string;
  type: string;
  amount: number;
  direction: "in" | "out";
  reference?: string;
  createdAt: string;
}

export interface ModerationItem {
  contentId: string;
  contentType: string;
  author: string;
  content: string;
  reason: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "approved" | "removed";
  reportedAt: string;
}

export interface ModerationRule {
  ruleId: string;
  name: string;
  enabled: boolean;
  mode?: string;
  description?: string;
}

export interface ModerationActionBody {
  action: "approve" | "remove" | "warn";
  notes?: string;
}

export interface VerifierReputationSummary {
  score: number;
  percentile?: number;
  trend: Array<{ period: string; score: number }>;
  breakdown: Array<{ metric: string; value: number }>;
}

export interface VerifierReviewItem {
  reviewId: string;
  reviewer: string;
  rating: number;
  credentialType?: string;
  comment: string;
  helpfulCount?: number;
  createdAt: string;
  reply?: string | null;
}

export interface VerifierEarningsSummary {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  currency: string;
  periodBreakdown: Array<{ period: string; amount: number }>;
}

export interface VerifierWithdrawalRecord {
  withdrawalId: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  destinationId?: string;
  transactionHash?: string;
  createdAt: string;
}

export interface VerifierWithdrawalCreateBody {
  amount: number;
  currency: string;
  destinationId: string;
}

export interface VerifierStakingTier {
  tier: string;
  requiredStake: number;
  achieved: boolean;
}

export interface VerifierStakingHistoryItem {
  stakeEventId: string;
  action: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface VerifierStakingOverview {
  stakedAmount: number;
  availableAmount: number;
  apy: number;
  estimatedMonthlyReward: number;
  unstakePeriodDays: number;
  currentTier: string;
  nextTier?: string;
  nextTierRequiredStake?: number;
  tiers: VerifierStakingTier[];
}

export interface VerifierStakeActionBody {
  amount: number;
}

export interface SupportArticle {
  articleId: string;
  title: string;
  category: string;
  content: string;
}

export interface SupportTicketCreateBody {
  subject: string;
  message: string;
  attachments?: string[];
}

export interface SupportTicketRecord {
  ticketId: string;
  subject: string;
  status: string;
  createdAt: string;
}

export interface CredentialRegistryItem {
  credentialId: string;
  type: string;
  holderName: string;
  issuerName: string;
  status: "valid" | "revoked" | "expired" | "pending";
  issuedAt: string;
  expiresAt?: string | null;
}

export interface CredentialDetailRecord {
  credentialId: string;
  type: string;
  schema?: string;
  status: string;
  issuedAt: string;
  expiresAt?: string | null;
  txHash?: string;
  network?: string;
  holder: { name: string; did?: string; email?: string };
  issuer: { name: string; did?: string; verified?: boolean };
  claims: Record<string, string>;
}

export interface EnterpriseSummary {
  enterpriseId: string;
  name: string;
  plan: string;
  users: number;
  apiUsagePercent: number;
  status: string;
  billingStatus?: string;
  lastActive?: string;
}

export interface EnterpriseDetailRecord extends EnterpriseSummary {
  email?: string;
  did?: string;
  website?: string;
  location?: string;
  description?: string;
  joinedDate?: string;
  stats?: {
    apiCalls?: string;
    storage?: string;
    spent?: string;
  };
}

export interface EnterpriseTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
}

export interface ErrorLogRecord {
  errorId: string;
  timestamp: string;
  service: string;
  severity: "critical" | "error" | "warning" | "info";
  message: string;
  status: "open" | "investigating" | "resolved";
}

export interface AdminUserStats {
  credentials?: number;
  verifications?: number;
  spent?: string;
}

export interface AdminUserDetailRecord extends User {
  did?: string;
  stats?: AdminUserStats;
}

export interface UserActivityRecord {
  id: string;
  action: string;
  timestamp: string;
  ip?: string;
  type?: string;
  details?: string;
}

export interface UserCredentialSummary {
  credentialId: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: string;
}

export interface UserTransactionSummary {
  transactionId: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  direction: "in" | "out";
  status: string;
  createdAt: string;
}

export interface VerifierIssuedCredentialRecord {
  credentialId: string;
  type: string;
  recipient: string;
  issuedAt: string;
  status: string;
}

export interface VerifierReviewRecord {
  reviewId: string;
  reviewer: string;
  rating: number;
  comment: string;
  createdAt: string;
}

```

## 3) Frontend Schema Source Of Truth (Auth Domain)

Verbatim auth request/response schema definitions from `src/services/authService.ts` (type block):

```ts
import type { UserRole } from "@/features/auth/AuthContext";
import { env } from "@/config/env";
import {
  readSession as readSessionState,
  writeSession as writeSessionState,
  type SessionState,
} from "@/auth/sessionStore";

type BackendRole = UserRole;
type MfaMethod = "totp" | "webauthn" | "recovery_code";

type ApiSuccess<T> = {
  success: true;
  data?: T;
  requestId: string;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
  requestId: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: BackendRole;
  };
  permissions: string[];
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
  permissions: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
  role: BackendRole;
  authKey: string;
  mfa?: {
    method: "totp";
    code: string;
  };
};

export type LoginMfaChallenge = {
  mfaRequired: true;
  challengeId: string;
  methods: MfaMethod[];
};

export type MfaEnrollment = {
  qrCodeImageUrl?: string;
  otpauthUri?: string;
  backupCodes: string[];
};

export type SignupPayload =
  | {
      role: "user";
      fullName: string;
      email: string;
      password: string;
      consentAccepted: boolean;
    }
  | {
      role: "enterprise";
      organizationName: string;
      contactName: string;
      email: string;
      password: string;
      countryCode: string;
      registrationNumber: string;
      consentAccepted: boolean;
    }
  | {
      role: "verifier";
      organizationName: string;
      contactName: string;
      email: string;
      password: string;
      verificationLicenseId: string;
      jurisdiction: string;
      consentAccepted: boolean;
    }
  | {
      role: "admin";
      fullName: string;
      email: string;
      password: string;
      department: string;
      authorizationCode: string;
      consentAccepted: boolean;
    };

export type SignupResponse = {
  userId: string;
  role: BackendRole;
  status: string;
  generatedAuthKey: string;
};

export type AuthApiErrorCode =
  | "validation_error"
  | "invalid_credentials"
  | "mfa_failed"
  | "token_invalid"
  | "role_mismatch"
  | "account_disabled"
  | "ip_blocked"
  | "email_conflict"
  | "account_locked"
  | "rate_limited"
  | "auth_internal_error"
  | string;

export class AuthApiError extends Error {
  status: number;
  code: AuthApiErrorCode;
  requestId?: string;
  details?: unknown[];

  constructor(status: number, code: AuthApiErrorCode, message: string, requestId?: string, details?: unknown[]) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}
```

## 4) Backend Mapping Notes

- Base banking path used by frontend runtime: `/api/v1/banking` (see `bankingService.ts`).
- Auth base path is role-normalized by frontend (`/admin/auth`, `/enterprise/auth`, `/verifier/auth`, `/user/auth`) from `authService.ts`.
- For endpoints with template paths (for example `/cases/${caseId}`), backend must support path params exactly as called.
- For rows marked `implicit/none`, request/response typing is inferred in code or not generic-annotated; backend should still return envelope-compatible responses.
