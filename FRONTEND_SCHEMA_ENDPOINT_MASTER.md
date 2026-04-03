# Frontend Schemas + Endpoint Mapping (Complete)

This document is generated from frontend source code to provide an exhaustive backend mapping contract.

## 1) Endpoint Inventory Used By Frontend Services

| Service File | Line | Method | Endpoint Path (as used in frontend) | Request/Response Generic Schema |
|---|---:|---|---|---|
| bankingService.ts | 973 | GET | `/requests${query}` | `unknown` |
| bankingService.ts | 990 | POST | `/requests/${verificationId}/review` | `JsonRecord` |
| bankingService.ts | 1024 | POST | `/kyc/individual/verify` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 1035 | GET | `/kyc/individual/${verificationId}` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 1091 | POST | `/kyc/individual/basic` | `IndividualKYCVerifyApiData` |
| bankingService.ts | 1116 | POST | `/documents/verify` | `unknown` |
| bankingService.ts | 1122 | POST | `/documents/extract` | `DocumentExtractApiData` |
| bankingService.ts | 1136 | POST | `/biometrics/face-match` | `BiometricFaceMatchApiData` |
| bankingService.ts | 1156 | POST | `/biometrics/liveness` | `BiometricLivenessApiData` |
| bankingService.ts | 1170 | POST | `/screening/sanctions/check` | `SanctionsCheckApiData` |
| bankingService.ts | 1187 | POST | `/screening/pep/check` | `PEPCheckApiData` |
| bankingService.ts | 1213 | POST | `/aml/risk-score` | `AMLRiskScoreApiData` |
| bankingService.ts | 1224 | POST | `/risk/sandbox/simulate` | `JsonRecord` |
| bankingService.ts | 1267 | POST | `/risk/sandbox/report` | `JsonRecord` |
| bankingService.ts | 1286 | POST | `/aml/transaction-monitoring` | `TransactionMonitoringApiData` |
| bankingService.ts | 1300 | POST | `/webhooks/register` | `JsonRecord` |
| bankingService.ts | 1319 | POST | `/webhooks/test` | `JsonRecord` |
| bankingService.ts | 1332 | POST | `/webhooks/${input.webhookId}/test` | `JsonRecord` |
| bankingService.ts | 1346 | GET | `/webhooks${query}` | `JsonRecord` |
| bankingService.ts | 1355 | DELETE | `/webhooks/${webhookId}` | `(implicit/none)` |
| bankingService.ts | 1359 | POST | `/webhooks/${webhookId}/rotate-secret` | `JsonRecord` |
| bankingService.ts | 1370 | GET | `/webhooks/retries` | `unknown` |
| bankingService.ts | 1406 | POST | `/api-keys/create` | `JsonRecord` |
| bankingService.ts | 1415 | GET | `/api-keys` | `JsonRecord` |
| bankingService.ts | 1424 | DELETE | `/api-keys/${keyId}` | `(implicit/none)` |
| bankingService.ts | 1428 | GET | `/audit/customer/${customerId}` | `JsonRecord` |
| bankingService.ts | 1433 | GET | `/audit/verification/${verificationId}` | `JsonRecord` |
| bankingService.ts | 1438 | GET | `/audit/logs` | `unknown` |
| bankingService.ts | 1469 | POST | `/audit/logs/export-signed` | `JsonRecord` |
| bankingService.ts | 1509 | POST | `/reports/create` | `JsonRecord` |
| bankingService.ts | 1528 | GET | `/reports` | `unknown` |
| bankingService.ts | 1539 | GET | `/analytics?timeRange=${encodeURIComponent(timeRange)}` | `AnalyticsData` |
| bankingService.ts | 1631 | GET | `/user/wallet` | `unknown` |
| bankingService.ts | 1650 | GET | `/admin/system-health` | `unknown` |
| bankingService.ts | 1668 | GET | `/admin/alerts` | `unknown` |
| bankingService.ts | 1686 | GET | `/analytics/geographic-distribution` | `unknown` |
| bankingService.ts | 1703 | POST | `/onboarding/bulk/validate` | `JsonRecord` |
| bankingService.ts | 1721 | POST | `/onboarding/bulk/import` | `JsonRecord` |
| bankingService.ts | 1731 | GET | `/onboarding/bulk/errors/${validationId}` | `JsonRecord` |
| bankingService.ts | 1737 | GET | `/license/usage` | `JsonRecord` |
| bankingService.ts | 1770 | POST | `/license/plan/change` | `JsonRecord` |
| bankingService.ts | 1782 | POST | `/bulk/verify` | `unknown` |
| bankingService.ts | 1787 | GET | `/settings/company` | `CompanySettings` |
| bankingService.ts | 1791 | PATCH | `/settings/company` | `CompanySettings` |
| bankingService.ts | 1796 | POST | `/team/invitations` | `JsonRecord` |
| bankingService.ts | 1811 | GET | `/admin/users?${query}` | `User[]` |
| bankingService.ts | 1816 | GET | `/admin/verifiers?${query}` | `Verifier[]` |
| bankingService.ts | 1820 | GET | `/admin/verifiers/${id}` | `Verifier` |
| bankingService.ts | 1824 | GET | `/verifier/profile` | `VerifierProfile` |
| bankingService.ts | 1828 | PATCH | `/verifier/profile` | `VerifierProfile` |
| bankingService.ts | 1833 | GET | `/user/verifications${query}` | `unknown` |
| bankingService.ts | 1839 | GET | `/notifications${query}` | `unknown` |
| bankingService.ts | 1845 | GET | `/analytics/fraud-trends${query}` | `unknown` |
| bankingService.ts | 1853 | GET | `/analytics/risk-distribution${query}` | `unknown` |
| bankingService.ts | 1861 | GET | `/analytics/compliance-metrics${query}` | `unknown` |
| bankingService.ts | 1874 | GET | `/analytics/geographical` | `unknown` |
| bankingService.ts | 1882 | GET | `/analytics/processing-times${query}` | `unknown` |
| bankingService.ts | 1889 | GET | `/health` | `JsonRecord` |
| bankingService.ts | 1899 | GET | `/admin/alerts${query}` | `unknown` |
| bankingService.ts | 1905 | GET | `/alerts${query}` | `unknown` |
| bankingService.ts | 1910 | GET | `/alerts/${alertId}` | `JsonRecord` |
| bankingService.ts | 1915 | POST | `/alerts/${alertId}/investigate` | `JsonRecord` |
| bankingService.ts | 1920 | POST | `/alerts/${alertId}/resolve` | `JsonRecord` |
| bankingService.ts | 1925 | POST | `/privacy/consent/record` | `JsonRecord` |
| bankingService.ts | 1937 | GET | `/privacy/consent/${customerId}` | `unknown` |
| bankingService.ts | 1950 | POST | `/privacy/data-export` | `JsonRecord` |
| bankingService.ts | 1959 | POST | `/privacy/data-deletion` | `JsonRecord` |
| bankingService.ts | 1967 | POST | `/compliance/reports/schedule` | `JsonRecord` |
| bankingService.ts | 1977 | GET | `/compliance/reports${query}` | `unknown` |
| bankingService.ts | 1982 | GET | `/kyc/individual/${verificationId}` | `unknown` |
| bankingService.ts | 1987 | POST | `/zk-proof/generate` | `unknown` |
| bankingService.ts | 1998 | POST | `/zk-proof/verify` | `JsonRecord` |
| bankingService.ts | 2007 | GET | `/zk-proof/verification/${verificationId}` | `unknown` |
| bankingService.ts | 2012 | POST | `/zk-proof/disclose` | `JsonRecord` |
| bankingService.ts | 2021 | GET | `/zk-proof/circuits` | `unknown` |
| bankingService.ts | 2034 | GET | `/zk-proof/noir/toolchain` | `JsonRecord` |
| bankingService.ts | 2046 | POST | `/zk-proof/noir/generate` | `unknown` |
| bankingService.ts | 2057 | POST | `/zk-proof/noir/verify` | `JsonRecord` |
| bankingService.ts | 2066 | POST | `/blockchain/anchor` | `JsonRecord` |
| bankingService.ts | 2076 | GET | `/blockchain/proof/${verificationId}` | `JsonRecord` |
| bankingService.ts | 2086 | POST | `/did/create` | `JsonRecord` |
| bankingService.ts | 2097 | GET | `/did/${customerId}` | `JsonRecord` |
| bankingService.ts | 2108 | GET | `/did/credentials/${credentialId}` | `JsonRecord` |
| bankingService.ts | 2121 | GET | `/did/credentials/customer/${customerId}` | `unknown` |
| bankingService.ts | 2135 | POST | `/did/credentials/present` | `JsonRecord` |
| bankingService.ts | 2144 | POST | `/did/credentials/verify` | `JsonRecord` |
| bankingService.ts | 2153 | GET | `/monitoring/rules` | `unknown` |
| bankingService.ts | 2166 | POST | `/monitoring/rules/create` | `JsonRecord` |
| bankingService.ts | 2178 | PATCH | `/monitoring/rules/${ruleId}` | `JsonRecord` |
| bankingService.ts | 2190 | DELETE | `/monitoring/rules/${ruleId}` | `(implicit/none)` |
| bankingService.ts | 2195 | GET | `/cases${query}` | `unknown` |
| bankingService.ts | 2208 | POST | `/cases/create` | `JsonRecord` |
| bankingService.ts | 2221 | GET | `/cases/${caseId}` | `JsonRecord` |
| bankingService.ts | 2234 | PATCH | `/cases/${caseId}` | `JsonRecord` |
| bankingService.ts | 2247 | POST | `/cases/${caseId}/assign` | `JsonRecord` |
| bankingService.ts | 2252 | POST | `/cases/${caseId}/close` | `JsonRecord` |
| bankingService.ts | 2258 | GET | `/documents/supported-types${query}` | `unknown` |
| bankingService.ts | 2265 | POST | `/documents/classify` | `JsonRecord` |
| bankingService.ts | 2273 | POST | `/documents/compare` | `JsonRecord` |
| bankingService.ts | 2281 | POST | `/screening/adverse-media/check` | `JsonRecord` |
| bankingService.ts | 2290 | GET | `/screening/sanctions/lists` | `unknown` |
| bankingService.ts | 2297 | POST | `/screening/${screeningType}/ongoing` | `JsonRecord` |
| bankingService.ts | 2307 | POST | `/account/verify` | `JsonRecord` |
| bankingService.ts | 2318 | POST | `/account/instant-verify` | `JsonRecord` |
| bankingService.ts | 2329 | POST | `/account/micro-deposits` | `JsonRecord` |
| bankingService.ts | 2340 | POST | `/transactions/screen` | `JsonRecord` |
| bankingService.ts | 2350 | POST | `/ongoing/enable` | `JsonRecord` |
| bankingService.ts | 2360 | POST | `/ongoing/disable` | `JsonRecord` |
| bankingService.ts | 2370 | GET | `/ongoing/due-reviews` | `unknown` |
| bankingService.ts | 2382 | POST | `/watchlist/add` | `JsonRecord` |
| bankingService.ts | 2393 | GET | `/watchlist` | `unknown` |
| bankingService.ts | 2405 | POST | `/source-of-funds/verify` | `JsonRecord` |
| bankingService.ts | 2415 | POST | `/source-of-funds/analyze` | `JsonRecord` |
| bankingService.ts | 2425 | POST | `/source-of-wealth/verify` | `JsonRecord` |
| bankingService.ts | 2435 | GET | `/source-of-wealth/${customerId}/assessment` | `JsonRecord` |
| bankingService.ts | 2445 | POST | `/credit/check` | `JsonRecord` |
| bankingService.ts | 2455 | POST | `/credit/score` | `JsonRecord` |
| bankingService.ts | 2465 | POST | `/translation/text` | `JsonRecord` |
| bankingService.ts | 2474 | POST | `/translation/document` | `JsonRecord` |
| bankingService.ts | 2483 | POST | `/localization/currency-convert` | `JsonRecord` |
| bankingService.ts | 2494 | GET | `/localization/regulations/${country}` | `unknown` |
| bankingService.ts | 2514 | POST | `/sandbox/generate-test-data` | `JsonRecord` |
| bankingService.ts | 2523 | GET | `/verification/health` | `JsonRecord` |
| bankingService.ts | 2532 | GET | `/verification/cameras` | `unknown` |
| bankingService.ts | 2539 | GET | `/verification/config` | `unknown` |
| bankingService.ts | 2544 | POST | `/verification/proxy/token` | `unknown` |
| bankingService.ts | 2549 | GET | `/verification/model/status` | `JsonRecord` |
| bankingService.ts | 2558 | POST | `/verification/model/reload` | `JsonRecord` |
| bankingService.ts | 2567 | POST | `/verifier/issue-credential` | `CredentialIssuanceResponse` |
| authService.ts | 292 | POST | `/login` | `AuthTokenResponse \| LoginMfaChallenge` |
| authService.ts | 309 | POST | `/mfa/verify` | `AuthTokenResponse` |
| authService.ts | 317 | POST | `/mfa/recovery-code/verify` | `AuthTokenResponse` |
| authService.ts | 342 | POST | `/mfa/enroll/verify` | `(implicit/none)` |
| authService.ts | 349 | POST | `/signup` | `SignupResponse` |
| authService.ts | 357 | POST | `/refresh` | `AuthTokenResponse` |
| authService.ts | 365 | POST | `/logout` | `undefined` |
| authService.ts | 372 | POST | `/forgot-password` | `(implicit/none)` |
| authService.ts | 379 | POST | `/reset-password` | `(implicit/none)` |
| authService.ts | 386 | GET | `/me` | `{ id: string; email: string; role: BackendRole; permissions: string[] }` |

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
  expiresAt?: string | null;
  ipWhitelist?: string[];
  rateLimit?: number;
}

export interface ApiKeyResponse {
  id: string;
  keyId?: string;
  name: string;
  keyName?: string;
  keyPrefix: string;
  apiKey?: string;
  createdAt: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  status?: string;
  rateLimit?: number;
  lastUsed?: string;
  scopes: string[];
  permissions?: string[];
}

export interface ApiKeyCreateResult {
  keyId: string;
  apiKey: string;
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

```

## 3) Frontend Schema Source Of Truth (Auth Domain)

Verbatim auth request/response schema definitions from `src/services/authService.ts` (type block):

```ts
import type { UserRole } from "@/features/auth/AuthContext";

const AUTH_STORAGE_KEY = "verza:auth:session";

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
