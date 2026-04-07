export type ClosureJson = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

export interface PostAuthStepUpRequest {
  body?: Record<string, unknown>;
}

export interface PostAuthStepUpResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminCredentialsRequest {
}

export interface GetApiV1BankingAdminCredentialsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminCredentialsByCredentialIdRequest {
  credentialId: string;
}

export interface GetApiV1BankingAdminCredentialsByCredentialIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminEnterprisesRequest {
}

export interface GetApiV1BankingAdminEnterprisesResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminEnterprisesByTenantIdRequest {
  tenantId: string;
}

export interface GetApiV1BankingAdminEnterprisesByTenantIdResponse {
  status: string;
  data: ClosureJson;
}

export interface PatchApiV1BankingAdminEnterprisesByTenantIdRequest {
  tenantId: string;
  body?: Record<string, unknown>;
}

export interface PatchApiV1BankingAdminEnterprisesByTenantIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminFinancialRequest {
}

export interface GetApiV1BankingAdminFinancialResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminFinancialRevenueRequest {
}

export interface GetApiV1BankingAdminFinancialRevenueResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminLogsRequest {
}

export interface GetApiV1BankingAdminLogsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminVerificationsRequest {
}

export interface GetApiV1BankingAdminVerificationsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAdminVerificationsByVerificationIdRequest {
  verificationId: string;
}

export interface GetApiV1BankingAdminVerificationsByVerificationIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAlertsRequest {
}

export interface GetApiV1BankingAlertsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAnalyticsComplianceMetricsRequest {
}

export interface GetApiV1BankingAnalyticsComplianceMetricsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAnalyticsFraudTrendsRequest {
}

export interface GetApiV1BankingAnalyticsFraudTrendsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAnalyticsProcessingTimesRequest {
}

export interface GetApiV1BankingAnalyticsProcessingTimesResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAnalyticsRiskDistributionRequest {
}

export interface GetApiV1BankingAnalyticsRiskDistributionResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAnalyticsVerificationStatsRequest {
}

export interface GetApiV1BankingAnalyticsVerificationStatsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingApiKeysRequest {
}

export interface GetApiV1BankingApiKeysResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingApiKeysValidateCurrentRequest {
}

export interface GetApiV1BankingApiKeysValidateCurrentResponse {
  status: string;
  data: ClosureJson;
}

export interface DeleteApiV1BankingApiKeysByKeyIdRequest {
  keyId: string;
  body?: Record<string, unknown>;
}

export interface DeleteApiV1BankingApiKeysByKeyIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingAuditLogsSearchRequest {
}

export interface GetApiV1BankingAuditLogsSearchResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingBillingWebhooksProviderRequest {
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingBillingWebhooksProviderResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingCasesRequest {
}

export interface GetApiV1BankingCasesResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingComplianceReportsRequest {
}

export interface GetApiV1BankingComplianceReportsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingDiagnosticsRequestsRequest {
}

export interface GetApiV1BankingDiagnosticsRequestsResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingDiagnosticsRequestsByRequestIdCancelRequest {
  requestId: string;
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingDiagnosticsRequestsByRequestIdCancelResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingDiagnosticsRequestsByRequestIdRetryRequest {
  requestId: string;
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingDiagnosticsRequestsByRequestIdRetryResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingDisputesRequest {
}

export interface GetApiV1BankingDisputesResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingDisputesByDisputeIdResolveRequest {
  disputeId: string;
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingDisputesByDisputeIdResolveResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingDocumentsSupportedTypesRequest {
}

export interface GetApiV1BankingDocumentsSupportedTypesResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingGovernanceProposalsRequest {
}

export interface GetApiV1BankingGovernanceProposalsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingMarketplaceVerifiersRequest {
}

export interface GetApiV1BankingMarketplaceVerifiersResponse {
  status: string;
  data: ClosureJson;
}

export interface DeleteApiV1BankingMonitoringRulesByRuleIdRequest {
  ruleId: string;
  body?: Record<string, unknown>;
}

export interface DeleteApiV1BankingMonitoringRulesByRuleIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingNotificationsRequest {
}

export interface GetApiV1BankingNotificationsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingRequestsRequest {
}

export interface GetApiV1BankingRequestsResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingRequestsByVerificationIdRevokeRequest {
  verificationId: string;
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingRequestsByVerificationIdRevokeResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingScreeningAdverseMediaOngoingRequest {
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingScreeningAdverseMediaOngoingResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingScreeningPepOngoingRequest {
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingScreeningPepOngoingResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingScreeningSanctionsOngoingRequest {
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingScreeningSanctionsOngoingResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingUserVerificationsRequest {
}

export interface GetApiV1BankingUserVerificationsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierActiveRequest {
}

export interface GetApiV1BankingVerifierActiveResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierCompletedRequest {
}

export interface GetApiV1BankingVerifierCompletedResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierEarningsRequest {
}

export interface GetApiV1BankingVerifierEarningsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierHelpRequest {
}

export interface GetApiV1BankingVerifierHelpResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierHelpArticlesRequest {
}

export interface GetApiV1BankingVerifierHelpArticlesResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierHelpTicketsRequest {
}

export interface GetApiV1BankingVerifierHelpTicketsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierJobsRequest {
}

export interface GetApiV1BankingVerifierJobsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierJobsByVerificationIdRequest {
  verificationId: string;
}

export interface GetApiV1BankingVerifierJobsByVerificationIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierNotificationsRequest {
}

export interface GetApiV1BankingVerifierNotificationsResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierReviewByVerificationIdRequest {
  verificationId: string;
}

export interface GetApiV1BankingVerifierReviewByVerificationIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingVerifierReviewsRequest {
}

export interface GetApiV1BankingVerifierReviewsResponse {
  status: string;
  data: ClosureJson;
}

export interface PostApiV1BankingVerifierWithdrawRequest {
  body?: Record<string, unknown>;
}

export interface PostApiV1BankingVerifierWithdrawResponse {
  status: string;
  data: ClosureJson;
}

export interface GetApiV1BankingWebhooksRequest {
}

export interface GetApiV1BankingWebhooksResponse {
  status: string;
  data: ClosureJson;
}

export interface DeleteApiV1BankingWebhooksByWebhookIdRequest {
  webhookId: string;
  body?: Record<string, unknown>;
}

export interface DeleteApiV1BankingWebhooksByWebhookIdResponse {
  status: string;
  data: ClosureJson;
}

export interface GetHealthRequest {
}

export interface GetHealthResponse {
  status: string;
  data: ClosureJson;
}

export interface GetRootRequest {
}

export interface GetRootResponse {
  status: string;
  data: ClosureJson;
}

export interface GetVerificationDemoDocumentWebcamRequest {
}

export interface GetVerificationDemoDocumentWebcamResponse {
  status: string;
  data: ClosureJson;
}

export interface GetVerificationDemoMobileRequest {
}

export interface GetVerificationDemoMobileResponse {
  status: string;
  data: ClosureJson;
}

export interface GetVerificationDemoMobileLivenessRequest {
}

export interface GetVerificationDemoMobileLivenessResponse {
  status: string;
  data: ClosureJson;
}

export interface GetVerificationDemoWebcamRequest {
}

export interface GetVerificationDemoWebcamResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationPredictRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationPredictResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationProxyDocumentOcrCheckRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationProxyDocumentOcrCheckResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationProxyTokenRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationProxyTokenResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationProxyVerifyDocumentRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationProxyVerifyDocumentResponse {
  status: string;
  data: ClosureJson;
}

export interface GetVerificationResultRequest {
}

export interface GetVerificationResultResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationVerifyRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationVerifyResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationVerifyDocumentRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationVerifyDocumentResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationVerifyMobileLivenessRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationVerifyMobileLivenessResponse {
  status: string;
  data: ClosureJson;
}

export interface PostVerificationVerifyWebcamRequest {
  body?: Record<string, unknown>;
}

export interface PostVerificationVerifyWebcamResponse {
  status: string;
  data: ClosureJson;
}

