
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
  status: 'pending' | 'verified' | 'rejected' | 'requires_action' | 'in_progress' | 'review_needed';
  details?: any;
  updatedAt: string;
  createdAt: string; // Ensure createdAt is included as it is used in UI
}

export interface DocumentVerifyRequest {
  documentImage: string; // Base64 or URL
  documentType: 'passport' | 'drivers_license' | 'national_id';
  country: string;
}

export interface DocumentVerifyResponse {
  isValid: boolean;
  issues: string[];
  extractedData?: any;
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
  documentImage: string; // Base64
}

export interface BiometricFaceMatchResponse {
  match: boolean;
  score: number; // 0-100
}

export interface BiometricLivenessRequest {
  videoUrl?: string;
  imageSequence?: string[];
}

export interface BiometricLivenessResponse {
  isLive: boolean;
  score: number;
}

export interface SanctionsCheckRequest {
  name: string;
  dob?: string;
  country?: string;
}

export interface SanctionsCheckResponse {
  matchFound: boolean;
  hits: any[];
}

export interface PEPCheckRequest {
  name: string;
  country?: string;
}

export interface PEPCheckResponse {
  isPEP: boolean;
  details?: any;
}

export interface AMLRiskScoreRequest {
  customerData: IndividualKYCRequest;
}

export interface AMLRiskScoreResponse {
  score: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
}

export interface TransactionMonitoringRequest {
  transactionId: string;
  amount: number;
  currency: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
}

export interface TransactionMonitoringResponse {
  isSuspicious: boolean;
  riskScore: number;
  action: 'approve' | 'flag' | 'block';
}

export interface WebhookRegisterRequest {
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ApiKeyCreateRequest {
  name: string;
  scopes: string[];
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed?: string;
  scopes: string[];
}

export interface AuditLogResponse {
  id: string;
  action: string;
  actorId: string;
  resourceId: string;
  timestamp: string;
  details: any;
  status: 'success' | 'failure';
}

export interface VerificationStatsResponse {
  totalVerifications: number;
  approved: number;
  rejected: number;
  pending: number;
  averageTime: number; // in seconds
  successful: number;
  failed: number;
  dailyBreakdown: {
    date: string;
    count: number;
  }[];
}

export interface ReportCreateRequest {
  type: 'compliance' | 'audit' | 'activity';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: any;
}

export interface ReportResponse {
  reportId: string;
  status: 'generating' | 'ready' | 'failed';
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
  status: 'pending' | 'verified' | 'rejected' | 'requires_action' | 'in_progress' | 'review_needed';
  details?: any;
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
  data: any;
  notes?: string;
}

export interface CredentialIssuanceResponse {
  credentialId: string;
  transactionHash: string;
  issuedAt: string;
  status: 'issued' | 'pending' | 'failed';
}
