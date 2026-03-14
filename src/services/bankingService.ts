
import { apiRequest } from '../lib/queryClient';
import type {
  IndividualKYCRequest,
  IndividualKYCResponse,
  VerificationStatusResponse,
  DocumentVerifyRequest,
  DocumentVerifyResponse,
  DocumentExtractRequest,
  DocumentExtractResponse,
  BiometricFaceMatchRequest,
  BiometricFaceMatchResponse,
  BiometricLivenessRequest,
  BiometricLivenessResponse,
  SanctionsCheckRequest,
  SanctionsCheckResponse,
  PEPCheckRequest,
  PEPCheckResponse,
  AMLRiskScoreRequest,
  AMLRiskScoreResponse,
  TransactionMonitoringRequest,
  TransactionMonitoringResponse,
  WebhookRegisterRequest,
  WebhookResponse,
  ApiKeyCreateRequest,
  ApiKeyResponse,
  AuditLogResponse,
  VerificationStatsResponse,
  ReportCreateRequest,
  ReportResponse,
  VerificationRequestResponse,
  BulkVerificationRequest,
  BulkVerificationResponse,
  CompanySettings,
  ComplianceReport,
  AnalyticsData,
  User,
  Verifier,
  VerifierProfile,
  CredentialIssuanceRequest,
  CredentialIssuanceResponse
} from '../types/banking';

const BASE_URL = '/api/v1/banking';

export const bankingService = {
  // A0. Requests Management
  getVerificationRequests: async (params?: { limit?: number }): Promise<VerificationRequestResponse[]> => {
    const query = params?.limit ? `?limit=${params.limit}` : '';
    const res = await apiRequest('GET', `${BASE_URL}/requests${query}`);
    return res.json();
  },

  updateVerificationStatus: async (verificationId: string, status: string, notes?: string): Promise<VerificationStatusResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/requests/${verificationId}/review`, { status, notes });
    return res.json();
  },

  // A1. Individual KYC - Essential APIs
  verifyIndividual: async (data: IndividualKYCRequest): Promise<IndividualKYCResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/kyc/individual/verify`, data);
    return res.json();
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationStatusResponse> => {
    const res = await apiRequest('GET', `${BASE_URL}/requests/${verificationId}`);
    return res.json();
  },

  verifyIndividualBasic: async (data: Partial<IndividualKYCRequest>): Promise<IndividualKYCResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/kyc/individual/basic`, data);
    return res.json();
  },

  // A2. Document Verification - Essential APIs
  verifyDocument: async (data: DocumentVerifyRequest): Promise<DocumentVerifyResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/documents/verify`, data);
    return res.json();
  },

  extractDocumentData: async (data: DocumentExtractRequest): Promise<DocumentExtractResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/documents/extract`, data);
    return res.json();
  },

  // A3. Biometric Verification - Essential APIs
  matchFace: async (data: BiometricFaceMatchRequest): Promise<BiometricFaceMatchResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/biometrics/face-match`, data);
    return res.json();
  },

  checkLiveness: async (data: BiometricLivenessRequest): Promise<BiometricLivenessResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/biometrics/liveness`, data);
    return res.json();
  },

  // B1. Sanctions Screening - Essential
  checkSanctions: async (data: SanctionsCheckRequest): Promise<SanctionsCheckResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/screening/sanctions/check`, data);
    return res.json();
  },

  // B2. PEP Screening - Essential
  checkPEP: async (data: PEPCheckRequest): Promise<PEPCheckResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/screening/pep/check`, data);
    return res.json();
  },

  // B3. AML Risk Assessment - Basic
  calculateRiskScore: async (data: AMLRiskScoreRequest): Promise<AMLRiskScoreResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/aml/risk-score`, data);
    return res.json();
  },

  monitorTransaction: async (data: TransactionMonitoringRequest): Promise<TransactionMonitoringResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/aml/transaction-monitoring`, data);
    return res.json();
  },

  // C. Webhooks & Integration (3 APIs)
  registerWebhook: async (data: WebhookRegisterRequest): Promise<WebhookResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/webhooks/register`, data);
    return res.json();
  },

  listWebhooks: async (): Promise<WebhookResponse[]> => {
    const res = await apiRequest('GET', `${BASE_URL}/webhooks`);
    return res.json();
  },

  deleteWebhook: async (webhookId: string): Promise<void> => {
    await apiRequest('DELETE', `${BASE_URL}/webhooks/${webhookId}`);
  },

  // D. API Management (3 APIs)
  createApiKey: async (data: ApiKeyCreateRequest): Promise<ApiKeyResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/api-keys/create`, data);
    return res.json();
  },

  listApiKeys: async (): Promise<ApiKeyResponse[]> => {
    const res = await apiRequest('GET', `${BASE_URL}/api-keys`);
    return res.json();
  },

  revokeApiKey: async (keyId: string): Promise<void> => {
    await apiRequest('DELETE', `${BASE_URL}/api-keys/${keyId}`);
  },

  // E. Audit & Compliance - Basic (2 APIs)
  getCustomerAudit: async (customerId: string): Promise<AuditLogResponse[]> => {
    const res = await apiRequest('GET', `${BASE_URL}/audit/customer/${customerId}`);
    return res.json();
  },

  getVerificationAudit: async (verificationId: string): Promise<AuditLogResponse[]> => {
    const res = await apiRequest('GET', `${BASE_URL}/audit/verification/${verificationId}`);
    return res.json();
  },

  getAuditLogs: async (): Promise<AuditLogResponse[]> => {
    const res = await apiRequest('GET', `${BASE_URL}/audit/logs`);
    return res.json();
  },

  // F. Basic Reporting (2 APIs)
  getVerificationStats: async (): Promise<VerificationStatsResponse> => {
    const res = await apiRequest('GET', `${BASE_URL}/analytics/verification-stats`);
    return res.json();
  },

  createReport: async (data: ReportCreateRequest): Promise<ReportResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/reports/create`, data);
    return res.json();
  },

  listReports: async (): Promise<ComplianceReport[]> => {
    const res = await apiRequest('GET', `${BASE_URL}/reports`);
    return res.json();
  },

  getAnalytics: async (timeRange: string): Promise<AnalyticsData> => {
    const res = await apiRequest('GET', `${BASE_URL}/analytics?timeRange=${timeRange}`);
    return res.json();
  },

  // G. Advanced Features
  initiateBulkVerification: async (data: BulkVerificationRequest): Promise<BulkVerificationResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/bulk/verify`, data);
    return res.json();
  },

  getCompanySettings: async (): Promise<CompanySettings> => {
    const res = await apiRequest('GET', `${BASE_URL}/settings/company`);
    return res.json();
  },

  updateCompanySettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
    const res = await apiRequest('PATCH', `${BASE_URL}/settings/company`, data);
    return res.json();
  },

  // H. Admin Management
  getUsers: async (params?: { role?: string; status?: string; search?: string }): Promise<User[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await apiRequest('GET', `${BASE_URL}/admin/users?${query}`);
    return res.json();
  },

  getVerifiers: async (params?: { status?: string; search?: string }): Promise<Verifier[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await apiRequest('GET', `${BASE_URL}/admin/verifiers?${query}`);
    return res.json();
  },

  getVerifierDetails: async (id: string): Promise<Verifier> => {
    const res = await apiRequest('GET', `${BASE_URL}/admin/verifiers/${id}`);
    return res.json();
  },

  // I. Verifier Profile & Issuance
  getVerifierProfile: async (): Promise<VerifierProfile> => {
    const res = await apiRequest('GET', `${BASE_URL}/verifier/profile`);
    return res.json();
  },

  updateVerifierProfile: async (data: Partial<VerifierProfile>): Promise<VerifierProfile> => {
    const res = await apiRequest('PATCH', `${BASE_URL}/verifier/profile`, data);
    return res.json();
  },

  issueCredential: async (data: CredentialIssuanceRequest): Promise<CredentialIssuanceResponse> => {
    const res = await apiRequest('POST', `${BASE_URL}/verifier/issue-credential`, data);
    return res.json();
  }
};
