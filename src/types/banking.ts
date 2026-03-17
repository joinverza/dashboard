
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
  documentImage: string; // Base64 or URL
  documentType: 'passport' | 'drivers_license' | 'national_id';
  country: string;
}

export interface DocumentVerifyResponse {
  isValid: boolean;
  issues: string[];
  extractedData?: Record<string, string | number | boolean | null>;
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
  riskLevel: 'low' | 'medium' | 'high';
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
  action: 'approve' | 'flag' | 'block';
}

export interface WebhookRegisterRequest {
  url?: string;
  webhookUrl?: string;
  events: string[];
  secret?: string;
  active?: boolean;
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
  requests: IndividualKYCRequest[]; // Simplified for now
  callbackUrl?: string;
}

export interface BulkVerificationResponse {
  batchId: string;
  totalRequests: number;
  status: 'processing' | 'completed' | 'failed';
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
  role: 'admin' | 'user' | 'verifier' | 'enterprise';
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
