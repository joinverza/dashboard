
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

export interface PrimitiveReloadRequest {
  model_path?: string | null;
}

export interface PrimitiveProxyTokenRequest {
  documentType?: string;
}

export interface PrimitiveProxyTokenResponse {
  token?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface AccountVerificationResponse {
  verificationId: string;
  status: string;
  accountName?: string;
  bankName?: string;
  confidence?: number;
}

export interface AlertInvestigateRequest {
  analyst?: string | null;
  notes?: string | null;
}

export interface AlertResolveRequest {
  resolution: string;
  notes?: string | null;
}

export interface AccountVerifyRequest {
  customerId: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  verificationMethod: string;
}

export interface AccountInstantVerifyRequest {
  customerId: string;
  publicToken: string;
  accountHolderName?: string | null;
}

export interface AccountMicroDepositsRequest {
  customerId: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
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
