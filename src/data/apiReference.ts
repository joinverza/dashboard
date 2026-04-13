import type { ApiReferenceSection } from '@/types/banking';

export const apiReferenceSections: ApiReferenceSection[] = [
  {
    id: 'auth',
    title: 'Authentication',
    endpoints: [
      { category: 'Authentication', method: 'POST', path: '/auth/login', component: 'LoginForm', description: 'Authenticate a dashboard user and return access and refresh tokens.', auth: 'public' },
      { category: 'Authentication', method: 'POST', path: '/auth/refresh', component: 'SessionInterceptor', description: 'Refresh an expired access token using a refresh token.', auth: 'public' },
      { category: 'Authentication', method: 'GET', path: '/auth/me', component: 'ProfileHeader', description: 'Return the current authenticated user and permissions.', auth: 'bearer' },
      { category: 'Authentication', method: 'POST', path: '/auth/logout', component: 'SignOutAction', description: 'Invalidate the refresh token and end the current session.', auth: 'bearer' },
    ],
  },
  {
    id: 'kyc',
    title: 'Verification and KYC',
    endpoints: [
      { category: 'KYC', method: 'POST', path: '/api/v1/banking/kyc/individual/verify', component: 'KycSubmissionForm', description: 'Submit a full asynchronous KYC verification request.', auth: 'bearer or api key' },
      { category: 'KYC', method: 'POST', path: '/api/v1/banking/kyc/individual/basic', component: 'KycQuickStartForm', description: 'Submit a reduced-payload KYC request for faster onboarding.', auth: 'bearer or api key' },
      { category: 'KYC', method: 'GET', path: '/api/v1/banking/kyc/individual/{verificationId}', component: 'VerificationStatusPanel', description: 'Poll the status, risk, and privacy proof details of a verification.', auth: 'bearer or api key' },
      { category: 'KYC', method: 'GET', path: '/api/v1/banking/requests', component: 'VerificationQueueTable', description: 'List queued verification requests with paging and filtering.', auth: 'bearer or api key' },
      { category: 'KYC', method: 'POST', path: '/api/v1/banking/bulk/verify', component: 'BulkUploadPanel', description: 'Create bulk verification requests for enterprise onboarding.', auth: 'bearer or api key' },
    ],
  },
  {
    id: 'documents',
    title: 'Documents and Biometrics',
    endpoints: [
      { category: 'Documents', method: 'GET', path: '/api/v1/banking/documents/supported-types', component: 'DocumentTypePicker', description: 'Return document types supported for a given country.', auth: 'bearer or api key' },
      { category: 'Documents', method: 'POST', path: '/api/v1/banking/documents/extract', component: 'OcrAutofillPanel', description: 'Extract structured document fields with OCR and proof metadata.', auth: 'bearer or api key' },
      { category: 'Documents', method: 'POST', path: '/api/v1/banking/documents/verify', component: 'DocumentVerificationPanel', description: 'Verify authenticity, quality, and expected field matches.', auth: 'bearer or api key' },
      { category: 'Biometrics', method: 'POST', path: '/api/v1/banking/biometrics/face-match', component: 'FaceMatchPanel', description: 'Compare a selfie to an ID photo and return a match score.', auth: 'bearer or api key' },
      { category: 'Biometrics', method: 'POST', path: '/api/v1/banking/biometrics/liveness', component: 'LivenessPanel', description: 'Validate that the submitted biometric capture is from a live user.', auth: 'bearer or api key' },
    ],
  },
  {
    id: 'screening',
    title: 'Screening and AML',
    endpoints: [
      { category: 'Screening', method: 'POST', path: '/api/v1/banking/screening/pep/check', component: 'PepCheckForm', description: 'Run a politically exposed person screening check.', auth: 'bearer or api key' },
      { category: 'Screening', method: 'POST', path: '/api/v1/banking/screening/sanctions/check', component: 'SanctionsCheckForm', description: 'Run a sanctions screening check.', auth: 'bearer or api key' },
      { category: 'Screening', method: 'POST', path: '/api/v1/banking/screening/adverse-media/check', component: 'AdverseMediaCheckForm', description: 'Search for negative media risk indicators.', auth: 'bearer or api key' },
      { category: 'AML', method: 'POST', path: '/api/v1/banking/aml/risk-score', component: 'RiskDecisionCard', description: 'Calculate an AML risk score from customer and transaction context.', auth: 'bearer or api key' },
      { category: 'AML', method: 'POST', path: '/api/v1/banking/aml/transaction-monitoring', component: 'TransactionDecisionPanel', description: 'Evaluate transaction risk and return an action decision.', auth: 'bearer or api key' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy, Noir, and Blockchain',
    endpoints: [
      { category: 'Privacy', method: 'POST', path: '/api/v1/banking/privacy/consent/record', component: 'ConsentCapturePanel', description: 'Record a privacy consent event for a customer.', auth: 'bearer or api key' },
      { category: 'Noir', method: 'GET', path: '/api/v1/banking/zk-proof/circuits', component: 'NoirCircuitCatalog', description: 'List supported Noir circuits and disclosure metadata.', auth: 'bearer or api key' },
      { category: 'Noir', method: 'GET', path: '/api/v1/banking/zk-proof/noir/toolchain', component: 'NoirRuntimeHealthCard', description: 'Return Noir runtime readiness and execution mode.', auth: 'bearer or api key' },
      { category: 'Noir', method: 'POST', path: '/api/v1/banking/zk-proof/disclose', component: 'SelectiveDisclosureModal', description: 'Generate a selective disclosure payload from an approved proof.', auth: 'bearer or api key' },
      { category: 'Blockchain', method: 'POST', path: '/api/v1/banking/blockchain/anchor', component: 'BlockchainAnchorPanel', description: 'Anchor proof material to the configured blockchain target.', auth: 'bearer or api key' },
    ],
  },
  {
    id: 'ops',
    title: 'Operations and Analytics',
    endpoints: [
      { category: 'Operations', method: 'GET', path: '/api/v1/banking/admin/system-health', component: 'SystemHealthBoard', description: 'Return system component health across platform services.', auth: 'bearer' },
      { category: 'Operations', method: 'GET', path: '/api/v1/banking/admin/alerts', component: 'OpsAlertsTable', description: 'List operational alerts with paging and filters.', auth: 'bearer' },
      { category: 'Operations', method: 'GET', path: '/api/v1/banking/cases', component: 'CaseTable', description: 'Return investigation cases for analyst workflows.', auth: 'bearer' },
      { category: 'Analytics', method: 'GET', path: '/api/v1/banking/analytics/verification-stats', component: 'VerificationStatsChart', description: 'Return top-line dashboard verification metrics.', auth: 'bearer or api key' },
      { category: 'Analytics', method: 'GET', path: '/api/v1/banking/analytics/geographic-distribution', component: 'GeoDistributionTable', description: 'Return geographic distribution metrics for dashboard maps and tables.', auth: 'bearer or api key' },
    ],
  },
  {
    id: 'api-management',
    title: 'API Management and Primitive Verification',
    endpoints: [
      { category: 'API Management', method: 'POST', path: '/api/v1/banking/api-keys/create', component: 'ApiKeyCreateModal', description: 'Generate a new API key with dashboard-managed permissions.', auth: 'bearer' },
      { category: 'API Management', method: 'GET', path: '/api/v1/banking/webhooks', component: 'WebhookList', description: 'List registered webhooks and subscribed events.', auth: 'bearer' },
      { category: 'Primitive Verification', method: 'GET', path: '/verification/health', component: 'PrimitiveServiceStatus', description: 'Return low-level verification service liveness.', auth: 'public or proxy token' },
      { category: 'Primitive Verification', method: 'POST', path: '/verification/proxy/token', component: 'ProxyTokenBootstrap', description: 'Issue a browser-safe proxy token for hosted capture flows.', auth: 'bearer' },
      { category: 'Primitive Verification', method: 'GET', path: '/verification/model/status', component: 'ModelOperationsCard', description: 'Return primitive model loading status for ops users.', auth: 'bearer' },
    ],
  },
];
