import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, PlayCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import { stepUpAuth } from '@/services/authService';
import { fetchJwksMetadata, rotateSigningKey } from '@/security/jwksClient';

const operations = [
  'addWatchlistEntry',
  'analyzeSourceOfFunds',
  'assignCase',
  'checkAdverseMedia',
  'checkPepFamilyAssociates',
  'classifyDocument',
  'closeCase',
  'compareDocuments',
  'convertCurrency',
  'createApiKey',
  'createBlockchainAnchor',
  'createCase',
  'createDid',
  'createMonitoringRule',
  'disableOngoingMonitoring',
  'discloseProof',
  'enableOngoingMonitoring',
  'generateNoirProof',
  'generateSandboxTestData',
  'generateZkProof',
  'getAnalytics',
  'getBillingPlans',
  'getBlockchainProof',
  'getBlockchainProofByAnchor',
  'getBulkOnboardingErrorReport',
  'getCase',
  'getConsentHistory',
  'getCountryRegulations',
  'getCreditScore',
  'getDid',
  'getDidCredential',
  'getDueReviews',
  'getHealth',
  'getNoirToolchainStatus',
  'getOngoingMonitoringChanges',
  'getOngoingMonitoringStatus',
  'getSourceOfWealthAssessment',
  'getVerificationProof',
  'getWatchlist',
  'getZkCircuits',
  'issueDidCredentialAdvanced',
  'listDidCredentials',
  'listMonitoringRules',
  'listSanctionsLists',
  'monitorTransaction',
  'presentCredential',
  'recordConsent',
  'registerWebhook',
  'requestDataDeletion',
  'requestDataExport',
  'resendTeamInvitation',
  'runCreditCheck',
  'scheduleComplianceReport',
  'screenTransaction',
  'submitKycIndividualBatch',
  'testWebhook',
  'toggleOngoingScreening',
  'translateDocument',
  'translateText',
  'updateCase',
  'updateMonitoringRule',
  'verifyBehavioralBiometrics',
  'verifyDidChallenge',
  'verifyFingerprintBiometrics',
  'verifyKycIndividualEnhanced',
  'verifyNoirProof',
  'verifyPresentedCredential',
  'verifySourceOfFunds',
  'verifySourceOfWealth',
  'verifyVoiceBiometrics',
  'verifyZkProof',
  'stepUpAuth',
  'closureGetApiV1BankingAdminCredentials',
  'closureGetApiV1BankingAdminCredentialsByCredentialId',
  'closureGetApiV1BankingAdminEnterprises',
  'closureGetApiV1BankingAdminEnterprisesByTenantId',
  'closurePatchApiV1BankingAdminEnterprisesByTenantId',
  'closureGetApiV1BankingAdminFinancial',
  'closureGetApiV1BankingAdminFinancialRevenue',
  'closureGetApiV1BankingAdminLogs',
  'closureGetApiV1BankingAdminVerifications',
  'closureGetApiV1BankingAdminVerificationsByVerificationId',
  'closureGetApiV1BankingAlerts',
  'closureGetApiV1BankingAnalyticsComplianceMetrics',
  'closureGetApiV1BankingAnalyticsFraudTrends',
  'closureGetApiV1BankingAnalyticsProcessingTimes',
  'closureGetApiV1BankingAnalyticsRiskDistribution',
  'closureGetApiV1BankingAnalyticsVerificationStats',
  'closureGetApiV1BankingApiKeys',
  'closureGetApiV1BankingApiKeysValidateCurrent',
  'closureDeleteApiV1BankingApiKeysByKeyId',
  'closureGetApiV1BankingAuditLogsSearch',
  'closurePostApiV1BankingBillingWebhooksProvider',
  'closureGetApiV1BankingCases',
  'closureGetApiV1BankingComplianceReports',
  'closureGetApiV1BankingDiagnosticsRequests',
  'closurePostApiV1BankingDiagnosticsRequestsByRequestIdCancel',
  'closurePostApiV1BankingDiagnosticsRequestsByRequestIdRetry',
  'closureGetApiV1BankingDisputes',
  'closurePostApiV1BankingDisputesByDisputeIdResolve',
  'closureGetApiV1BankingDocumentsSupportedTypes',
  'closureGetApiV1BankingGovernanceProposals',
  'closureGetApiV1BankingMarketplaceVerifiers',
  'closureDeleteApiV1BankingMonitoringRulesByRuleId',
  'closureGetApiV1BankingNotifications',
  'closureGetApiV1BankingRequests',
  'closurePostApiV1BankingRequestsByVerificationIdRevoke',
  'closurePostApiV1BankingScreeningAdverseMediaOngoing',
  'closurePostApiV1BankingScreeningPepOngoing',
  'closurePostApiV1BankingScreeningSanctionsOngoing',
  'closureGetApiV1BankingUserVerifications',
  'closureGetApiV1BankingVerifierActive',
  'closureGetApiV1BankingVerifierCompleted',
  'closureGetApiV1BankingVerifierEarnings',
  'closureGetApiV1BankingVerifierHelp',
  'closureGetApiV1BankingVerifierHelpArticles',
  'closureGetApiV1BankingVerifierHelpTickets',
  'closureGetApiV1BankingVerifierJobs',
  'closureGetApiV1BankingVerifierJobsByVerificationId',
  'closureGetApiV1BankingVerifierNotifications',
  'closureGetApiV1BankingVerifierReviewByVerificationId',
  'closureGetApiV1BankingVerifierReviews',
  'closurePostApiV1BankingVerifierWithdraw',
  'closureGetApiV1BankingWebhooks',
  'closureDeleteApiV1BankingWebhooksByWebhookId',
  'closureGetHealth',
  'closureGetRoot',
  'closureGetVerificationDemoDocumentWebcam',
  'closureGetVerificationDemoMobile',
  'closureGetVerificationDemoMobileLiveness',
  'closureGetVerificationDemoWebcam',
  'closurePostVerificationPredict',
  'closurePostVerificationProxyDocumentOcrCheck',
  'closurePostVerificationProxyToken',
  'closurePostVerificationProxyVerifyDocument',
  'closureGetVerificationResult',
  'closurePostVerificationVerify',
  'closurePostVerificationVerifyDocument',
  'closurePostVerificationVerifyMobileLiveness',
  'closurePostVerificationVerifyWebcam',
  'fetchJwksMetadata',
  'rotateSigningKey'
] as const;

type OperationName = (typeof operations)[number];

const defaultArgsByOperation: Partial<Record<OperationName, string>> = {
  addWatchlistEntry: '[]',
  analyzeSourceOfFunds: '[{"customerId":"customer_001","amount":5000}]',
  assignCase: '["case_001", {"assignee":"analyst@bank.com"}]',
  checkAdverseMedia: '[]',
  checkPepFamilyAssociates: '[]',
  classifyDocument: '[]',
  closeCase: '["case_001", {"resolution":"false_positive"}]',
  compareDocuments: '[]',
  convertCurrency: '[]',
  createApiKey: '[]',
  createBlockchainAnchor: '[]',
  createCase: '[]',
  createDid: '[]',
  createMonitoringRule: '[{"name":"Large transfer monitor"}]',
  disableOngoingMonitoring: '[]',
  discloseProof: '[]',
  enableOngoingMonitoring: '[]',
  generateNoirProof: '[]',
  generateSandboxTestData: '[{"scenario":"high_risk"}]',
  generateZkProof: '[]',
  getAnalytics: '[]',
  getBillingPlans: '[]',
  getBlockchainProof: '["verification_001"]',
  getBlockchainProofByAnchor: '["anchor_001"]',
  getBulkOnboardingErrorReport: '["batch_001"]',
  getCase: '["case_001"]',
  getConsentHistory: '[]',
  getCountryRegulations: '[]',
  getCreditScore: '["customer_001"]',
  getDid: '["did:example:123"]',
  getDidCredential: '["credential_001"]',
  getDueReviews: '[]',
  getHealth: '[]',
  getNoirToolchainStatus: '[]',
  getOngoingMonitoringChanges: '[]',
  getOngoingMonitoringStatus: '[]',
  getSourceOfWealthAssessment: '["customer_001"]',
  getVerificationProof: '["verification_001"]',
  getWatchlist: '[]',
  getZkCircuits: '[]',
  issueDidCredentialAdvanced: '[{"subjectId":"did:example:123","claims":{"kycLevel":"enhanced"}}]',
  listDidCredentials: '["did:example:123"]',
  listMonitoringRules: '[]',
  listSanctionsLists: '[]',
  monitorTransaction: '[]',
  presentCredential: '["credential_001", {"audience":"verifier"}]',
  recordConsent: '[]',
  registerWebhook: '[{"url":"https://example.com/webhook","events":["verification.completed"]}]',
  requestDataDeletion: '[]',
  requestDataExport: '[]',
  resendTeamInvitation: '["invite_001"]',
  runCreditCheck: '[]',
  scheduleComplianceReport: '[]',
  screenTransaction: '[]',
  submitKycIndividualBatch: '[]',
  testWebhook: '["webhook_001"]',
  toggleOngoingScreening: '[]',
  translateDocument: '[]',
  translateText: '[]',
  updateCase: '["case_001", {"status":"in_review"}]',
  updateMonitoringRule: '["rule_001", {"enabled":true}]',
  verifyBehavioralBiometrics: '[]',
  verifyDidChallenge: '["did:example:123", {"challenge":"nonce"}]',
  verifyFingerprintBiometrics: '[]',
  verifyKycIndividualEnhanced: '[]',
  verifyNoirProof: '[]',
  verifyPresentedCredential: '["credential_001", {"proof":"sample"}]',
  verifySourceOfFunds: '[{"customerId":"customer_001","amount":5000}]',
  verifySourceOfWealth: '[{"customerId":"customer_001"}]',
  verifyVoiceBiometrics: '[]',
  verifyZkProof: '[]',
  stepUpAuth: '[{"method":"totp"}]',
  closureGetApiV1BankingAdminCredentials: '[]',
  closureGetApiV1BankingAdminCredentialsByCredentialId: '["credentialId_001"]',
  closureGetApiV1BankingAdminEnterprises: '[]',
  closureGetApiV1BankingAdminEnterprisesByTenantId: '["tenantId_001"]',
  closurePatchApiV1BankingAdminEnterprisesByTenantId: '["tenantId_001", {"body":{}}]',
  closureGetApiV1BankingAdminFinancial: '[]',
  closureGetApiV1BankingAdminFinancialRevenue: '[]',
  closureGetApiV1BankingAdminLogs: '[]',
  closureGetApiV1BankingAdminVerifications: '[]',
  closureGetApiV1BankingAdminVerificationsByVerificationId: '["verificationId_001"]',
  closureGetApiV1BankingAlerts: '[]',
  closureGetApiV1BankingAnalyticsComplianceMetrics: '[]',
  closureGetApiV1BankingAnalyticsFraudTrends: '[]',
  closureGetApiV1BankingAnalyticsProcessingTimes: '[]',
  closureGetApiV1BankingAnalyticsRiskDistribution: '[]',
  closureGetApiV1BankingAnalyticsVerificationStats: '[]',
  closureGetApiV1BankingApiKeys: '[]',
  closureGetApiV1BankingApiKeysValidateCurrent: '[]',
  closureDeleteApiV1BankingApiKeysByKeyId: '["keyId_001", {"body":{}}]',
  closureGetApiV1BankingAuditLogsSearch: '[]',
  closurePostApiV1BankingBillingWebhooksProvider: '[{"body":{}}]',
  closureGetApiV1BankingCases: '[]',
  closureGetApiV1BankingComplianceReports: '[]',
  closureGetApiV1BankingDiagnosticsRequests: '[]',
  closurePostApiV1BankingDiagnosticsRequestsByRequestIdCancel: '["requestId_001", {"body":{}}]',
  closurePostApiV1BankingDiagnosticsRequestsByRequestIdRetry: '["requestId_001", {"body":{}}]',
  closureGetApiV1BankingDisputes: '[]',
  closurePostApiV1BankingDisputesByDisputeIdResolve: '["disputeId_001", {"body":{}}]',
  closureGetApiV1BankingDocumentsSupportedTypes: '[]',
  closureGetApiV1BankingGovernanceProposals: '[]',
  closureGetApiV1BankingMarketplaceVerifiers: '[]',
  closureDeleteApiV1BankingMonitoringRulesByRuleId: '["ruleId_001", {"body":{}}]',
  closureGetApiV1BankingNotifications: '[]',
  closureGetApiV1BankingRequests: '[]',
  closurePostApiV1BankingRequestsByVerificationIdRevoke: '["verificationId_001", {"body":{}}]',
  closurePostApiV1BankingScreeningAdverseMediaOngoing: '[{"body":{}}]',
  closurePostApiV1BankingScreeningPepOngoing: '[{"body":{}}]',
  closurePostApiV1BankingScreeningSanctionsOngoing: '[{"body":{}}]',
  closureGetApiV1BankingUserVerifications: '[]',
  closureGetApiV1BankingVerifierActive: '[]',
  closureGetApiV1BankingVerifierCompleted: '[]',
  closureGetApiV1BankingVerifierEarnings: '[]',
  closureGetApiV1BankingVerifierHelp: '[]',
  closureGetApiV1BankingVerifierHelpArticles: '[]',
  closureGetApiV1BankingVerifierHelpTickets: '[]',
  closureGetApiV1BankingVerifierJobs: '[]',
  closureGetApiV1BankingVerifierJobsByVerificationId: '["verificationId_001"]',
  closureGetApiV1BankingVerifierNotifications: '[]',
  closureGetApiV1BankingVerifierReviewByVerificationId: '["verificationId_001"]',
  closureGetApiV1BankingVerifierReviews: '[]',
  closurePostApiV1BankingVerifierWithdraw: '[{"body":{}}]',
  closureGetApiV1BankingWebhooks: '[]',
  closureDeleteApiV1BankingWebhooksByWebhookId: '["webhookId_001", {"body":{}}]',
  closureGetHealth: '[]',
  closureGetRoot: '[]',
  closureGetVerificationDemoDocumentWebcam: '[]',
  closureGetVerificationDemoMobile: '[]',
  closureGetVerificationDemoMobileLiveness: '[]',
  closureGetVerificationDemoWebcam: '[]',
  closurePostVerificationPredict: '[{"body":{}}]',
  closurePostVerificationProxyDocumentOcrCheck: '[{"body":{}}]',
  closurePostVerificationProxyToken: '[{"body":{}}]',
  closurePostVerificationProxyVerifyDocument: '[{"body":{}}]',
  closureGetVerificationResult: '[]',
  closurePostVerificationVerify: '[{"body":{}}]',
  closurePostVerificationVerifyDocument: '[{"body":{}}]',
  closurePostVerificationVerifyMobileLiveness: '[{"body":{}}]',
  closurePostVerificationVerifyWebcam: '[{"body":{}}]',
  fetchJwksMetadata: '[]',
  rotateSigningKey: '[]',
};

const invokeBanking = (method: keyof typeof bankingService, args: unknown[]): Promise<unknown> => {
  const runner = bankingService[method] as unknown as (...params: unknown[]) => Promise<unknown>;
  return runner(...args);
};

const operationHandlers: Record<OperationName, (args: unknown[]) => Promise<unknown>> = {
  addWatchlistEntry: async (args: unknown[]) => invokeBanking('addWatchlistEntry', args),
  analyzeSourceOfFunds: async (args: unknown[]) => invokeBanking('analyzeSourceOfFunds', args),
  assignCase: async (args: unknown[]) => invokeBanking('assignCase', args),
  checkAdverseMedia: async (args: unknown[]) => invokeBanking('checkAdverseMedia', args),
  checkPepFamilyAssociates: async (args: unknown[]) => invokeBanking('checkPepFamilyAssociates', args),
  classifyDocument: async (args: unknown[]) => invokeBanking('classifyDocument', args),
  closeCase: async (args: unknown[]) => invokeBanking('closeCase', args),
  compareDocuments: async (args: unknown[]) => invokeBanking('compareDocuments', args),
  convertCurrency: async (args: unknown[]) => invokeBanking('convertCurrency', args),
  createApiKey: async (args: unknown[]) => invokeBanking('createApiKey', args),
  createBlockchainAnchor: async (args: unknown[]) => invokeBanking('createBlockchainAnchor', args),
  createCase: async (args: unknown[]) => invokeBanking('createCase', args),
  createDid: async (args: unknown[]) => invokeBanking('createDid', args),
  createMonitoringRule: async (args: unknown[]) => invokeBanking('createMonitoringRule', args),
  disableOngoingMonitoring: async (args: unknown[]) => invokeBanking('disableOngoingMonitoring', args),
  discloseProof: async (args: unknown[]) => invokeBanking('discloseProof', args),
  enableOngoingMonitoring: async (args: unknown[]) => invokeBanking('enableOngoingMonitoring', args),
  generateNoirProof: async (args: unknown[]) => invokeBanking('generateNoirProof', args),
  generateSandboxTestData: async (args: unknown[]) => invokeBanking('generateSandboxTestData', args),
  generateZkProof: async (args: unknown[]) => invokeBanking('generateZkProof', args),
  getAnalytics: async (args: unknown[]) => invokeBanking('getAnalytics', args),
  getBillingPlans: async (args: unknown[]) => invokeBanking('getBillingPlans', args),
  getBlockchainProof: async (args: unknown[]) => invokeBanking('getBlockchainProof', args),
  getBlockchainProofByAnchor: async (args: unknown[]) => invokeBanking('getBlockchainProofByAnchor', args),
  getBulkOnboardingErrorReport: async (args: unknown[]) => invokeBanking('getBulkOnboardingErrorReport', args),
  getCase: async (args: unknown[]) => invokeBanking('getCase', args),
  getConsentHistory: async (args: unknown[]) => invokeBanking('getConsentHistory', args),
  getCountryRegulations: async (args: unknown[]) => invokeBanking('getCountryRegulations', args),
  getCreditScore: async (args: unknown[]) => invokeBanking('getCreditScore', args),
  getDid: async (args: unknown[]) => invokeBanking('getDid', args),
  getDidCredential: async (args: unknown[]) => invokeBanking('getDidCredential', args),
  getDueReviews: async (args: unknown[]) => invokeBanking('getDueReviews', args),
  getHealth: async (args: unknown[]) => invokeBanking('getHealth', args),
  getNoirToolchainStatus: async (args: unknown[]) => invokeBanking('getNoirToolchainStatus', args),
  getOngoingMonitoringChanges: async (args: unknown[]) => invokeBanking('getOngoingMonitoringChanges', args),
  getOngoingMonitoringStatus: async (args: unknown[]) => invokeBanking('getOngoingMonitoringStatus', args),
  getSourceOfWealthAssessment: async (args: unknown[]) => invokeBanking('getSourceOfWealthAssessment', args),
  getVerificationProof: async (args: unknown[]) => invokeBanking('getVerificationProof', args),
  getWatchlist: async (args: unknown[]) => invokeBanking('getWatchlist', args),
  getZkCircuits: async (args: unknown[]) => invokeBanking('getZkCircuits', args),
  issueDidCredentialAdvanced: async (args: unknown[]) => invokeBanking('issueDidCredentialAdvanced', args),
  listDidCredentials: async (args: unknown[]) => invokeBanking('listDidCredentials', args),
  listMonitoringRules: async (args: unknown[]) => invokeBanking('listMonitoringRules', args),
  listSanctionsLists: async (args: unknown[]) => invokeBanking('listSanctionsLists', args),
  monitorTransaction: async (args: unknown[]) => invokeBanking('monitorTransaction', args),
  presentCredential: async (args: unknown[]) => invokeBanking('presentCredential', args),
  recordConsent: async (args: unknown[]) => invokeBanking('recordConsent', args),
  registerWebhook: async (args: unknown[]) => invokeBanking('registerWebhook', args),
  requestDataDeletion: async (args: unknown[]) => invokeBanking('requestDataDeletion', args),
  requestDataExport: async (args: unknown[]) => invokeBanking('requestDataExport', args),
  resendTeamInvitation: async (args: unknown[]) => invokeBanking('resendTeamInvitation', args),
  runCreditCheck: async (args: unknown[]) => invokeBanking('runCreditCheck', args),
  scheduleComplianceReport: async (args: unknown[]) => invokeBanking('scheduleComplianceReport', args),
  screenTransaction: async (args: unknown[]) => invokeBanking('screenTransaction', args),
  submitKycIndividualBatch: async (args: unknown[]) => invokeBanking('submitKycIndividualBatch', args),
  testWebhook: async (args: unknown[]) => invokeBanking('testWebhook', args),
  toggleOngoingScreening: async (args: unknown[]) => invokeBanking('toggleOngoingScreening', args),
  translateDocument: async (args: unknown[]) => invokeBanking('translateDocument', args),
  translateText: async (args: unknown[]) => invokeBanking('translateText', args),
  updateCase: async (args: unknown[]) => invokeBanking('updateCase', args),
  updateMonitoringRule: async (args: unknown[]) => invokeBanking('updateMonitoringRule', args),
  verifyBehavioralBiometrics: async (args: unknown[]) => invokeBanking('verifyBehavioralBiometrics', args),
  verifyDidChallenge: async (args: unknown[]) => invokeBanking('verifyDidChallenge', args),
  verifyFingerprintBiometrics: async (args: unknown[]) => invokeBanking('verifyFingerprintBiometrics', args),
  verifyKycIndividualEnhanced: async (args: unknown[]) => invokeBanking('verifyKycIndividualEnhanced', args),
  verifyNoirProof: async (args: unknown[]) => invokeBanking('verifyNoirProof', args),
  verifyPresentedCredential: async (args: unknown[]) => invokeBanking('verifyPresentedCredential', args),
  verifySourceOfFunds: async (args: unknown[]) => invokeBanking('verifySourceOfFunds', args),
  verifySourceOfWealth: async (args: unknown[]) => invokeBanking('verifySourceOfWealth', args),
  verifyVoiceBiometrics: async (args: unknown[]) => invokeBanking('verifyVoiceBiometrics', args),
  verifyZkProof: async (args: unknown[]) => invokeBanking('verifyZkProof', args),
  stepUpAuth: async (args: unknown[]) => stepUpAuth((args[0] as Record<string, unknown> | undefined) ?? {}),
  closureGetApiV1BankingAdminCredentials: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminCredentials', args),
  closureGetApiV1BankingAdminCredentialsByCredentialId: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminCredentialsByCredentialId', args),
  closureGetApiV1BankingAdminEnterprises: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminEnterprises', args),
  closureGetApiV1BankingAdminEnterprisesByTenantId: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminEnterprisesByTenantId', args),
  closurePatchApiV1BankingAdminEnterprisesByTenantId: async (args: unknown[]) => invokeBanking('closurePatchApiV1BankingAdminEnterprisesByTenantId', args),
  closureGetApiV1BankingAdminFinancial: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminFinancial', args),
  closureGetApiV1BankingAdminFinancialRevenue: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminFinancialRevenue', args),
  closureGetApiV1BankingAdminLogs: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminLogs', args),
  closureGetApiV1BankingAdminVerifications: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminVerifications', args),
  closureGetApiV1BankingAdminVerificationsByVerificationId: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAdminVerificationsByVerificationId', args),
  closureGetApiV1BankingAlerts: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAlerts', args),
  closureGetApiV1BankingAnalyticsComplianceMetrics: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAnalyticsComplianceMetrics', args),
  closureGetApiV1BankingAnalyticsFraudTrends: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAnalyticsFraudTrends', args),
  closureGetApiV1BankingAnalyticsProcessingTimes: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAnalyticsProcessingTimes', args),
  closureGetApiV1BankingAnalyticsRiskDistribution: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAnalyticsRiskDistribution', args),
  closureGetApiV1BankingAnalyticsVerificationStats: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAnalyticsVerificationStats', args),
  closureGetApiV1BankingApiKeys: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingApiKeys', args),
  closureGetApiV1BankingApiKeysValidateCurrent: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingApiKeysValidateCurrent', args),
  closureDeleteApiV1BankingApiKeysByKeyId: async (args: unknown[]) => invokeBanking('closureDeleteApiV1BankingApiKeysByKeyId', args),
  closureGetApiV1BankingAuditLogsSearch: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingAuditLogsSearch', args),
  closurePostApiV1BankingBillingWebhooksProvider: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingBillingWebhooksProvider', args),
  closureGetApiV1BankingCases: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingCases', args),
  closureGetApiV1BankingComplianceReports: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingComplianceReports', args),
  closureGetApiV1BankingDiagnosticsRequests: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingDiagnosticsRequests', args),
  closurePostApiV1BankingDiagnosticsRequestsByRequestIdCancel: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingDiagnosticsRequestsByRequestIdCancel', args),
  closurePostApiV1BankingDiagnosticsRequestsByRequestIdRetry: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingDiagnosticsRequestsByRequestIdRetry', args),
  closureGetApiV1BankingDisputes: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingDisputes', args),
  closurePostApiV1BankingDisputesByDisputeIdResolve: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingDisputesByDisputeIdResolve', args),
  closureGetApiV1BankingDocumentsSupportedTypes: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingDocumentsSupportedTypes', args),
  closureGetApiV1BankingGovernanceProposals: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingGovernanceProposals', args),
  closureGetApiV1BankingMarketplaceVerifiers: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingMarketplaceVerifiers', args),
  closureDeleteApiV1BankingMonitoringRulesByRuleId: async (args: unknown[]) => invokeBanking('closureDeleteApiV1BankingMonitoringRulesByRuleId', args),
  closureGetApiV1BankingNotifications: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingNotifications', args),
  closureGetApiV1BankingRequests: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingRequests', args),
  closurePostApiV1BankingRequestsByVerificationIdRevoke: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingRequestsByVerificationIdRevoke', args),
  closurePostApiV1BankingScreeningAdverseMediaOngoing: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingScreeningAdverseMediaOngoing', args),
  closurePostApiV1BankingScreeningPepOngoing: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingScreeningPepOngoing', args),
  closurePostApiV1BankingScreeningSanctionsOngoing: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingScreeningSanctionsOngoing', args),
  closureGetApiV1BankingUserVerifications: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingUserVerifications', args),
  closureGetApiV1BankingVerifierActive: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierActive', args),
  closureGetApiV1BankingVerifierCompleted: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierCompleted', args),
  closureGetApiV1BankingVerifierEarnings: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierEarnings', args),
  closureGetApiV1BankingVerifierHelp: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierHelp', args),
  closureGetApiV1BankingVerifierHelpArticles: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierHelpArticles', args),
  closureGetApiV1BankingVerifierHelpTickets: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierHelpTickets', args),
  closureGetApiV1BankingVerifierJobs: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierJobs', args),
  closureGetApiV1BankingVerifierJobsByVerificationId: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierJobsByVerificationId', args),
  closureGetApiV1BankingVerifierNotifications: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierNotifications', args),
  closureGetApiV1BankingVerifierReviewByVerificationId: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierReviewByVerificationId', args),
  closureGetApiV1BankingVerifierReviews: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingVerifierReviews', args),
  closurePostApiV1BankingVerifierWithdraw: async (args: unknown[]) => invokeBanking('closurePostApiV1BankingVerifierWithdraw', args),
  closureGetApiV1BankingWebhooks: async (args: unknown[]) => invokeBanking('closureGetApiV1BankingWebhooks', args),
  closureDeleteApiV1BankingWebhooksByWebhookId: async (args: unknown[]) => invokeBanking('closureDeleteApiV1BankingWebhooksByWebhookId', args),
  closureGetHealth: async (args: unknown[]) => invokeBanking('closureGetHealth', args),
  closureGetRoot: async (args: unknown[]) => invokeBanking('closureGetRoot', args),
  closureGetVerificationDemoDocumentWebcam: async (args: unknown[]) => invokeBanking('closureGetVerificationDemoDocumentWebcam', args),
  closureGetVerificationDemoMobile: async (args: unknown[]) => invokeBanking('closureGetVerificationDemoMobile', args),
  closureGetVerificationDemoMobileLiveness: async (args: unknown[]) => invokeBanking('closureGetVerificationDemoMobileLiveness', args),
  closureGetVerificationDemoWebcam: async (args: unknown[]) => invokeBanking('closureGetVerificationDemoWebcam', args),
  closurePostVerificationPredict: async (args: unknown[]) => invokeBanking('closurePostVerificationPredict', args),
  closurePostVerificationProxyDocumentOcrCheck: async (args: unknown[]) => invokeBanking('closurePostVerificationProxyDocumentOcrCheck', args),
  closurePostVerificationProxyToken: async (args: unknown[]) => invokeBanking('closurePostVerificationProxyToken', args),
  closurePostVerificationProxyVerifyDocument: async (args: unknown[]) => invokeBanking('closurePostVerificationProxyVerifyDocument', args),
  closureGetVerificationResult: async (args: unknown[]) => invokeBanking('closureGetVerificationResult', args),
  closurePostVerificationVerify: async (args: unknown[]) => invokeBanking('closurePostVerificationVerify', args),
  closurePostVerificationVerifyDocument: async (args: unknown[]) => invokeBanking('closurePostVerificationVerifyDocument', args),
  closurePostVerificationVerifyMobileLiveness: async (args: unknown[]) => invokeBanking('closurePostVerificationVerifyMobileLiveness', args),
  closurePostVerificationVerifyWebcam: async (args: unknown[]) => invokeBanking('closurePostVerificationVerifyWebcam', args),
  fetchJwksMetadata: async () => fetchJwksMetadata(),
  rotateSigningKey: async () => rotateSigningKey(),
};

type ResultMap = Record<string, string>;

export default function PartialEndpointsWorkbench() {
  const [query, setQuery] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [payloads, setPayloads] = useState<Record<string, string>>(() =>
    Object.fromEntries(operations.map((name) => [name, defaultArgsByOperation[name] ?? '[]'])),
  );
  const [results, setResults] = useState<ResultMap>({});

  const visibleOperations = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [] as readonly OperationName[];
    return operations.filter((name) => name.toLowerCase().includes(term));
  }, [query]);

  const runOperation = async (operation: OperationName) => {
    const raw = payloads[operation] ?? '[]';
    let args: unknown[] = [];
    try {
      const parsed = JSON.parse(raw);
      args = Array.isArray(parsed) ? parsed : [parsed];
    } catch (_error) {
      toast.error(`Invalid JSON payload for ${operation}`);
      return;
    }

    setLoadingKey(operation);
    try {
      const response = await operationHandlers[operation](args);
      setResults((previous) => ({ ...previous, [operation]: JSON.stringify(response, null, 2) }));
      toast.success(`${operation} completed`);
    } catch (error) {
      setResults((previous) => ({ ...previous, [operation]: getBankingErrorMessage(error, 'Operation failed') }));
      toast.error(getBankingErrorMessage(error, `Failed to run ${operation}`));
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Partial Endpoint Workbench
        </CardTitle>
        <CardDescription>
          Explicit endpoint bindings for closure coverage with strict handler mapping.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workbench-search">Find operation</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="workbench-search" className="pl-9" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by method" />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {visibleOperations.map((operation) => (
            <div key={operation} className="rounded-md border p-3 space-y-2">
              <div className="font-medium text-sm">{operation}</div>
              <Label htmlFor={`payload-${operation}`}>Args JSON</Label>
              <Textarea id={`payload-${operation}`} value={payloads[operation] ?? '[]'} onChange={(e)=>setPayloads((prev)=>({...prev,[operation]:e.target.value}))} className="min-h-20 font-mono text-xs" />
              <Button size="sm" onClick={() => void runOperation(operation)} disabled={loadingKey===operation}>
                {loadingKey===operation ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlayCircle className="mr-2 h-4 w-4"/>}
                Run
              </Button>
              <pre className="rounded bg-muted p-2 text-xs overflow-auto">{results[operation] ?? 'No result yet.'}</pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
