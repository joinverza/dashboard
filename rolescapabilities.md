# Roles Capabilities Catalog

## Metadata
- Version: `1.0.0`
- Last Updated: `2026-04-08`
- Audience: Frontend dashboard engineers mapping pages/components to backend APIs
- Scope: `verifier`, `user`, `enterprise` roles only

## Traceability Sources
- OpenAPI routes: `openapi.generated.json`
- RBAC policy: `banking/permissions.py`
- Runtime guards:
  - `banking/auth.py` (`require_banking_api_key`, `require_permission`)
  - `banking/verification_access.py` (academic/financial domain guards)
  - Router-level guards in `banking/routers/*.py`

## Conventions
- Base path for banking APIs: `/api/v1/banking`
- Each atomic action is listed as:
  - `METHOD ROUTE`
  - Required scope/claim
  - Suggested UI component(s)
  - Business rule/guard summary
- Sorted alphabetically by role, then module, then sub-module, then route.

---

## Enterprise

### Module: AML
#### Sub-module: Risk Analysis
- `POST /api/v1/banking/aml/risk-score`
  - Scope/claim: `aml:write`
  - UI: `AmlRiskScoreForm`, `AmlRiskResultPanel`
  - Rule: write-only AML scoring endpoint.
- `POST /api/v1/banking/aml/transaction-monitoring`
  - Scope/claim: `aml:write`
  - UI: `TransactionMonitoringForm`, `MonitoringAlertTable`
  - Rule: same write guard; async/real-time monitoring payloads supported.

### Module: Analytics
#### Sub-module: Dashboard Metrics
- `GET /api/v1/banking/analytics/compliance-metrics`
  - Scope/claim: `analytics:read`
  - UI: `ComplianceMetricsCard`
  - Rule: read-only analytics data.
- `GET /api/v1/banking/analytics/fraud-trends`
  - Scope/claim: `analytics:read`
  - UI: `FraudTrendsChart`
  - Rule: trend visualization feed.
- `GET /api/v1/banking/analytics/geographic-distribution`
  - Scope/claim: `analytics:read`
  - UI: `GeoDistributionMap`
  - Rule: country/region metrics.
- `GET /api/v1/banking/analytics/geographical`
  - Scope/claim: `analytics:read`
  - UI: `GeographicalInsightsPanel`
  - Rule: alternate geography-focused dataset.
- `GET /api/v1/banking/analytics/processing-times`
  - Scope/claim: `analytics:read`
  - UI: `ProcessingTimesChart`
  - Rule: processing SLA visualization.
- `GET /api/v1/banking/analytics/risk-distribution`
  - Scope/claim: `analytics:read`
  - UI: `RiskDistributionChart`
  - Rule: risk buckets for dashboard.
- `GET /api/v1/banking/analytics/verification-stats`
  - Scope/claim: `analytics:read`
  - UI: `VerificationStatsWidget`
  - Rule: aggregate verification KPIs.

### Module: API Keys
#### Sub-module: Key Lifecycle
- `POST /api/v1/banking/api-keys/create`
  - Scope/claim: `api_keys:write`
  - UI: `ApiKeyCreateDialog`
  - Rule: creates scoped API keys.
- `DELETE /api/v1/banking/api-keys/{keyId}`
  - Scope/claim: `api_keys:write`
  - UI: `ApiKeyRevokeButton`
  - Rule: revokes active key.
- `GET /api/v1/banking/api-keys/validate/current`
  - Scope/claim: `api_keys:read`
  - UI: `CurrentApiKeyStatusBadge`
  - Rule: validation introspection for current credential.

### Module: Audit
#### Sub-module: Audit Trail
- `GET /api/v1/banking/audit/customer/{customerId}`
  - Scope/claim: `audit:read`
  - UI: `CustomerAuditTimeline`
  - Rule: read-only access.
- `GET /api/v1/banking/audit/logs`
  - Scope/claim: `audit:read`
  - UI: `AuditLogTable`
  - Rule: paginated event records.
- `GET /api/v1/banking/audit/logs/search`
  - Scope/claim: `audit:read`
  - UI: `AuditSearchPanel`
  - Rule: filtered search endpoint.
- `GET /api/v1/banking/audit/verification/{verificationId}`
  - Scope/claim: `audit:read`
  - UI: `VerificationAuditTrail`
  - Rule: per-verification event history.

### Module: Biometrics
#### Sub-module: Checks
- `POST /api/v1/banking/biometrics/behavioral`
  - Scope/claim: `biometrics:write`
  - UI: `BehavioralBiometricPanel`
  - Rule: write-only biometric evaluation.
- `POST /api/v1/banking/biometrics/face-match`
  - Scope/claim: `biometrics:write`
  - UI: `FaceMatchUploader`, `FaceMatchResult`
  - Rule: identity face matching.
- `POST /api/v1/banking/biometrics/fingerprint`
  - Scope/claim: `biometrics:write`
  - UI: `FingerprintCaptureForm`
  - Rule: fingerprint verification.
- `POST /api/v1/banking/biometrics/liveness`
  - Scope/claim: `biometrics:write`
  - UI: `LivenessCheckPanel`
  - Rule: anti-spoof flow.
- `POST /api/v1/banking/biometrics/voice-verification`
  - Scope/claim: `biometrics:write`
  - UI: `VoiceVerificationRecorder`
  - Rule: voice biometric processing.

### Module: Blockchain
#### Sub-module: Proof Retrieval
- `GET /api/v1/banking/blockchain/proof/{verificationId}`
  - Scope/claim: `blockchain:read`
  - UI: `BlockchainProofDetail`
  - Rule: read-only proof fetch.
- `POST /api/v1/banking/blockchain/proof`
  - Scope/claim: `blockchain:read`
  - UI: `BlockchainProofLookupForm`
  - Rule: query-style proof retrieval endpoint.

### Module: Diagnostics
#### Sub-module: Requests
- `GET /api/v1/banking/diagnostics/requests`
  - Scope/claim: `diagnostics:read`
  - UI: `DiagnosticsRequestTable`
  - Rule: enterprise has read-only diagnostics capability.

### Module: Documents
#### Sub-module: Financial Verification
- `POST /api/v1/banking/documents/certificate/verify`
  - Scope/claim: `documents:write` + domain guard `documents:financial:verify` for financial types
  - UI: `FinancialCertificateVerifyForm`
  - Rule: denied for academic types.
- `POST /api/v1/banking/documents/classify`
  - Scope/claim: `documents:write`
  - UI: `DocumentClassificationWidget`
  - Rule: classification allowed; domain guard applies when inferred.
- `POST /api/v1/banking/documents/compare`
  - Scope/claim: `documents:write`
  - UI: `DocumentCompareWorkbench`
  - Rule: mixed academic+financial batches require admin.
- `POST /api/v1/banking/documents/extract`
  - Scope/claim: `documents:write`
  - UI: `DocumentExtractPanel`
  - Rule: domain-scoped checks executed before processing.
- `POST /api/v1/banking/documents/signature/validate`
  - Scope/claim: `documents:write` + `documents:financial:verify` for financial docs
  - UI: `DigitalSignatureValidationForm`
  - Rule: financial document validation workflow.
- `GET /api/v1/banking/documents/supported-types`
  - Scope/claim: `documents:read`
  - UI: `SupportedDocumentTypesDropdown`
  - Rule: read-only doc type catalog.
- `POST /api/v1/banking/documents/verify`
  - Scope/claim: `documents:write` + domain guard
  - UI: `FinancialDocumentVerifyForm`, `AuthenticityChecksPanel`
  - Rule: enterprise can directly verify financial documents.

### Module: Email Verifications
#### Sub-module: Bulk
- `POST /api/v1/banking/email-verifications/bulk/upload`
  - Scope/claim: `email_verification:write` (fallback: `kyc:write`)
  - UI: `EmailCsvUploadPanel`
  - Rule: CSV limit and validation constraints apply.
- `POST /api/v1/banking/email-verifications/bulk/verify`
  - Scope/claim: `email_verification:write` (fallback: `kyc:write`)
  - UI: `EmailBulkJsonForm`
  - Rule: async bulk job created.
- `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}`
  - Scope/claim: `email_verification:read` (fallback: `kyc:read` or `verification:read`)
  - UI: `EmailBulkJobStatusCard`
  - Rule: counters/status response.
- `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results`
  - Scope/claim: same as above
  - UI: `EmailBulkResultsTable`
  - Rule: paginated results feed.
#### Sub-module: Single
- `GET /api/v1/banking/email-verifications/{verificationId}`
  - Scope/claim: `email_verification:read` (fallback read scopes)
  - UI: `EmailVerificationResultView`
  - Rule: returns `not_found` state in-tenant.
- `POST /api/v1/banking/email-verifications/verify`
  - Scope/claim: `email_verification:write` (fallback: `kyc:write`)
  - UI: `EmailSingleVerifyForm`
  - Rule: idempotent async submit.

### Module: KYC
#### Sub-module: Individual
- `POST /api/v1/banking/kyc/individual/basic`
  - Scope/claim: `kyc:write`
  - UI: `KycBasicForm`
  - Rule: basic KYC check creation.
- `POST /api/v1/banking/kyc/individual/enhanced`
  - Scope/claim: `kyc:write`
  - UI: `KycEnhancedForm`
  - Rule: additional enhanced checks.
- `GET /api/v1/banking/kyc/individual/{verificationId}`
  - Scope/claim: `kyc:read`
  - UI: `KycVerificationDetail`
  - Rule: in-tenant read.
- `POST /api/v1/banking/kyc/individual/{verificationId}/refresh`
  - Scope/claim: `kyc:write`
  - UI: `KycRefreshButton`
  - Rule: refreshes verification.
- `POST /api/v1/banking/kyc/individual/verify`
  - Scope/claim: `kyc:write`
  - UI: `KycVerifyForm`
  - Rule: full KYC processing action.
#### Sub-module: Bulk
- `POST /api/v1/banking/kyc/individual/batch`
  - Scope/claim: `kyc:write`
  - UI: `KycBatchUploader`
  - Rule: batched KYC submission.

### Module: License & Settings
#### Sub-module: API Settings
- `GET /api/v1/banking/api/settings`
  - Scope/claim: `api_settings:read` (enabled for enterprise)
  - UI: `ApiSettingsView`
  - Rule: read-only for enterprise role.
#### Sub-module: Company Settings
- `GET /api/v1/banking/settings/company`
  - Scope/claim: `settings:read`
  - UI: `CompanySettingsPage`
  - Rule: enterprise read access.
#### Sub-module: License
- `GET /api/v1/banking/license/usage`
  - Scope/claim: `license:read`
  - UI: `LicenseUsageCard`
  - Rule: usage limits and consumption.

### Module: Reports
#### Sub-module: Jobs
- `POST /api/v1/banking/reports/create`
  - Scope/claim: `reports:write`
  - UI: `ReportCreateModal`
  - Rule: enterprise can create reports, but cannot read with `reports:read` unless separately granted.

### Module: Screening
#### Sub-module: Ongoing
- `POST /api/v1/banking/screening/adverse-media/ongoing`
  - Scope/claim: `screening:write`
  - UI: `AdverseMediaOngoingForm`
  - Rule: ongoing monitoring setup.
- `POST /api/v1/banking/screening/pep/ongoing`
  - Scope/claim: `screening:write`
  - UI: `PepOngoingForm`
  - Rule: ongoing PEP monitoring.
- `POST /api/v1/banking/screening/sanctions/ongoing`
  - Scope/claim: `screening:write`
  - UI: `SanctionsOngoingForm`
  - Rule: sanctions watch ongoing.
- `POST /api/v1/banking/screening/{screeningType}/ongoing`
  - Scope/claim: `screening:write`
  - UI: `GenericOngoingScreeningForm`
  - Rule: type-specific ongoing endpoint.
#### Sub-module: Screening Checks
- `POST /api/v1/banking/screening/adverse-media/check`
  - Scope/claim: `screening:write`
  - UI: `AdverseMediaCheckForm`
  - Rule: immediate check.
- `POST /api/v1/banking/screening/pep/check`
  - Scope/claim: `screening:write`
  - UI: `PepCheckForm`
  - Rule: immediate check.
- `POST /api/v1/banking/screening/pep/family-associates`
  - Scope/claim: `screening:write`
  - UI: `PepFamilyAssociatesPanel`
  - Rule: relationship screening.
- `POST /api/v1/banking/screening/sanctions/check`
  - Scope/claim: `screening:write`
  - UI: `SanctionsCheckForm`
  - Rule: immediate sanctions check.

### Module: Verification Operations
#### Sub-module: Request Decisions
- `POST /api/v1/banking/requests/{verificationId}/review`
  - Scope/claim: any of `verification:review`, `admin:write`, `kyc:write`
  - UI: `VerificationReviewDecisionPanel`
  - Rule: decision transitions with validation rules.
- `POST /api/v1/banking/requests/{verificationId}/revoke`
  - Scope/claim: any of `verification:review`, `admin:write`, `kyc:write`
  - UI: `VerificationRevokeDialog`
  - Rule: requires notes and blocks terminal-state updates.
#### Sub-module: Verifier-Style Views (Enterprise Accessible)
- `GET /api/v1/banking/verifier/jobs`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `VerificationJobsTable`
  - Rule: filtered by workflow domain visibility.
- `GET /api/v1/banking/verifier/jobs/{verificationId}`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `VerificationJobDetail`
  - Rule: in-tenant detail.
- `GET /api/v1/banking/verifier/active`
  - Scope/claim: inherited from jobs endpoint
  - UI: `ActiveVerificationQueue`
  - Rule: active subset.
- `GET /api/v1/banking/verifier/completed`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `CompletedVerificationList`
  - Rule: completed subset.
- `GET /api/v1/banking/verifier/reputation`
  - Scope/claim: `verification:read`
  - UI: `ReputationCard`
  - Rule: verifier performance metrics endpoint.
- `GET /api/v1/banking/verifier/reviews`
  - Scope/claim: `verification:read`
  - UI: `VerificationReviewsList`
  - Rule: review history.
- `GET /api/v1/banking/verifier/staking`
  - Scope/claim: `verification:read`
  - UI: `VerifierStakingPanel`
  - Rule: staking status.
- `POST /api/v1/banking/verifier/staking/actions`
  - Scope/claim: `verification:write`
  - UI: `VerifierStakingActionForm`
  - Rule: write action on staking state.
- `POST /api/v1/banking/verifier/withdrawals`
  - Scope/claim: `verification:write`
  - UI: `WithdrawalRequestForm`
  - Rule: payout initiation.

### Module: Verification Workflows
#### Sub-module: Queue and Locks
- `POST /api/v1/banking/verification/workflows/{verificationId}/claim`
  - Scope/claim: `verification:write` or `kyc:write`
  - UI: `WorkflowClaimButton`
  - Rule: lock conflict returns `409`.
- `GET /api/v1/banking/verification/workflows/queue`
  - Scope/claim: `verification:read` or `kyc:read`
  - UI: `WorkflowQueueTable`
  - Rule: domain visibility enforced.
- `POST /api/v1/banking/verification/workflows/{verificationId}/release`
  - Scope/claim: `verification:write` or `kyc:write`
  - UI: `WorkflowReleaseButton`
  - Rule: owner/admin release only.
#### Sub-module: Status and Timeline
- `PATCH /api/v1/banking/verification/workflows/{verificationId}/status`
  - Scope/claim: `verification:write` or `kyc:write`
  - UI: `WorkflowStatusUpdateForm`
  - Rule: lock ownership required unless admin override.
- `GET /api/v1/banking/verification/workflows/summary`
  - Scope/claim: `verification:read` or `kyc:read`
  - UI: `WorkflowSummaryCards`
  - Rule: aggregated counts by domain/status.
- `GET /api/v1/banking/verification/workflows/{verificationId}/timeline`
  - Scope/claim: `verification:read` or `kyc:read`
  - UI: `WorkflowTimeline`
  - Rule: event stream for auditability.

### Module: Webhooks
#### Sub-module: Endpoints and Retries
- `DELETE /api/v1/banking/webhooks/{webhookId}`
  - Scope/claim: `webhooks:write`
  - UI: `WebhookDeleteButton`
  - Rule: endpoint removal.
- `POST /api/v1/banking/webhooks/{webhookId}/rotate-secret`
  - Scope/claim: `webhooks:write`
  - UI: `WebhookRotateSecretButton`
  - Rule: secret rotation.
- `POST /api/v1/banking/webhooks/{webhookId}/test`
  - Scope/claim: `webhooks:write`
  - UI: `WebhookTestButton`
  - Rule: targeted delivery test.
- `GET /api/v1/banking/webhooks/retries`
  - Scope/claim: `webhooks:read`
  - UI: `WebhookRetriesTable`
  - Rule: retry queue visibility.
- `POST /api/v1/banking/webhooks/register`
  - Scope/claim: `webhooks:write`
  - UI: `WebhookRegisterForm`
  - Rule: create endpoint registration.
- `POST /api/v1/banking/webhooks/test`
  - Scope/claim: `webhooks:write`
  - UI: `WebhookGlobalTestAction`
  - Rule: generic outbound test.

### Module: ZK Proof
#### Sub-module: Generate/Verify
- `POST /api/v1/banking/zk-proof/generate`
  - Scope/claim: `zk:write`
  - UI: `ZkProofGenerateForm`
  - Rule: proof generation pipeline.
- `POST /api/v1/banking/zk-proof/verify`
  - Scope/claim: `zk:read`
  - UI: `ZkProofVerifyPanel`
  - Rule: verification execution.
- `GET /api/v1/banking/zk-proof/verification/{verificationId}`
  - Scope/claim: `zk:read`
  - UI: `ZkVerificationDetail`
  - Rule: verification detail retrieval.
#### Sub-module: Noir Tooling
- `GET /api/v1/banking/zk-proof/circuits`
  - Scope/claim: `zk:read`
  - UI: `ZkCircuitsList`
  - Rule: available circuits.
- `POST /api/v1/banking/zk-proof/disclose`
  - Scope/claim: `zk:read`
  - UI: `SelectiveDisclosureForm`
  - Rule: selective disclosure operation.
- `POST /api/v1/banking/zk-proof/noir/generate`
  - Scope/claim: `zk:write`
  - UI: `NoirGenerateForm`
  - Rule: noir generation workflow.
- `GET /api/v1/banking/zk-proof/noir/toolchain`
  - Scope/claim: `zk:read`
  - UI: `NoirToolchainStatus`
  - Rule: environment/toolchain info.
- `POST /api/v1/banking/zk-proof/noir/verify`
  - Scope/claim: `zk:read`
  - UI: `NoirVerifyForm`
  - Rule: noir proof verification.

---

## User

### Module: Authentication
#### Sub-module: Account Lifecycle
- `POST /auth/signup` and `POST /{role}/auth/signup` (use role=`user`)
  - Scope/claim: none; role claim is input (`role=user`)
  - UI: `UserSignupForm`
  - Rule: creates user account; role validation enforced server-side.
- `POST /auth/login` and `POST /{role}/auth/login` (role=`user`)
  - Scope/claim: none
  - UI: `UserLoginForm`
  - Rule: issues access/refresh tokens on success.
- `POST /auth/forgot-password` and segmented equivalent
  - Scope/claim: none
  - UI: `ForgotPasswordForm`
  - Rule: password reset initiation.
- `POST /auth/reset-password` and segmented equivalent
  - Scope/claim: none
  - UI: `ResetPasswordForm`
  - Rule: password update with reset token.
#### Sub-module: Session and MFA
- `GET /auth/me` and segmented equivalent
  - Scope/claim: valid bearer token/session
  - UI: `UserProfileHeader`
  - Rule: returns current principal context.
- `POST /auth/logout` and segmented equivalent
  - Scope/claim: valid bearer token/session
  - UI: `LogoutAction`
  - Rule: invalidates active session.
- `POST /auth/mfa/verify` and segmented equivalent
  - Scope/claim: challenge token/session state
  - UI: `MfaVerifyForm`
  - Rule: step-up completion.
- `GET /auth/mfa/enroll` and segmented equivalent
  - Scope/claim: authenticated session
  - UI: `MfaEnrollmentPanel`
  - Rule: enrollment bootstrap.
- `POST /auth/mfa/enroll/verify` and segmented equivalent
  - Scope/claim: authenticated session
  - UI: `MfaEnrollmentConfirmForm`
  - Rule: finalizes MFA enrollment.
- `POST /auth/mfa/recovery-code/verify` and segmented equivalent
  - Scope/claim: challenge context
  - UI: `RecoveryCodeVerifyForm`
  - Rule: recovery fallback.
- `POST /auth/refresh` and segmented equivalent
  - Scope/claim: refresh token
  - UI: `AuthSessionRefresher` (silent)
  - Rule: rotates access token/session.

---

## Verifier

### Module: Documents
#### Sub-module: Academic Verification
- `POST /api/v1/banking/documents/certificate/verify`
  - Scope/claim: `documents:write` + domain guard `documents:academic:verify` for academic types
  - UI: `AcademicCertificateVerifyForm`
  - Rule: verifier-owned academic validation path.
- `POST /api/v1/banking/documents/classify`
  - Scope/claim: `documents:write`
  - UI: `DocumentClassifyPanel`
  - Rule: classification available.
- `POST /api/v1/banking/documents/compare`
  - Scope/claim: `documents:write`
  - UI: `AcademicDocumentCompareWorkbench`
  - Rule: cross-domain compare blocked unless admin.
- `POST /api/v1/banking/documents/extract`
  - Scope/claim: `documents:write`
  - UI: `AcademicDocumentExtractPanel`
  - Rule: domain guard blocks non-allowed domains.
- `GET /api/v1/banking/documents/supported-types`
  - Scope/claim: `documents:read`
  - UI: `AcademicSupportedTypesDropdown`
  - Rule: read-only catalog.
- `POST /api/v1/banking/documents/verify`
  - Scope/claim: `documents:write` + domain guard
  - UI: `AcademicDocumentVerifyForm`
  - Rule: academic/general only.
#### Sub-module: Financial Denial Note
- `POST /api/v1/banking/documents/signature/validate`
  - Scope/claim: lacks `documents:financial:verify`
  - UI: `FinancialActionForbiddenState`
  - Rule: verifier receives `403` for financial domain actions.

### Module: Email Verifications
#### Sub-module: Read-only Access via Verification Scope
- `GET /api/v1/banking/email-verifications/{verificationId}`
  - Scope/claim: `verification:read` accepted by fallback guard
  - UI: `EmailVerificationReadOnlyView`
  - Rule: read-only visibility.
- `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}`
  - Scope/claim: same fallback read guards
  - UI: `EmailBulkJobReadOnlyView`
  - Rule: read-only.
- `GET /api/v1/banking/email-verifications/bulk/jobs/{bulkJobId}/results`
  - Scope/claim: same fallback read guards
  - UI: `EmailBulkResultsReadOnlyTable`
  - Rule: read-only.

### Module: Profile
#### Sub-module: Verifier Profile (Frontend Compat)
- `GET /api/v1/banking/verifier/profile`
  - Scope/claim: `verification:read`
  - UI: `VerifierProfilePage`
  - Rule: profile retrieval.
- `PATCH /api/v1/banking/verifier/profile`
  - Scope/claim: `verification:write`
  - UI: `VerifierProfileEditForm`
  - Rule: profile update.

### Module: Verification Operations
#### Sub-module: Queue and Decisions
- `GET /api/v1/banking/verifier/active`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `VerifierActiveQueue`
  - Rule: active jobs subset.
- `GET /api/v1/banking/verifier/completed`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `VerifierCompletedQueue`
  - Rule: completed jobs.
- `GET /api/v1/banking/verifier/jobs`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `VerifierJobsTable`
  - Rule: domain-filtered job list.
- `GET /api/v1/banking/verifier/jobs/{verificationId}`
  - Scope/claim: `verification:read` or `admin:read`
  - UI: `VerifierJobDetail`
  - Rule: detail view.
- `POST /api/v1/banking/requests/{verificationId}/review`
  - Scope/claim: any of `verification:review`, `admin:write`, `kyc:write`
  - UI: `VerifierReviewDecisionModal`
  - Rule: decision and transition validation.
- `POST /api/v1/banking/requests/{verificationId}/revoke`
  - Scope/claim: same `_require_any_permission` set
  - UI: `VerifierRevokeModal`
  - Rule: requires notes and idempotency.
#### Sub-module: Reputation/Earnings
- `GET /api/v1/banking/verifier/earnings`
  - Scope/claim: `verification:read`
  - UI: `VerifierEarningsCard`
  - Rule: payout summary.
- `GET /api/v1/banking/verifier/reputation`
  - Scope/claim: `verification:read`
  - UI: `VerifierReputationPanel`
  - Rule: reputation metrics.
- `GET /api/v1/banking/verifier/reviews`
  - Scope/claim: `verification:read`
  - UI: `VerifierReviewsTable`
  - Rule: review list.
- `GET /api/v1/banking/verifier/staking`
  - Scope/claim: `verification:read`
  - UI: `VerifierStakingOverview`
  - Rule: staking status.
- `POST /api/v1/banking/verifier/staking/actions`
  - Scope/claim: `verification:write`
  - UI: `VerifierStakingActions`
  - Rule: state-changing staking endpoint.
- `POST /api/v1/banking/verifier/withdrawals`
  - Scope/claim: `verification:write`
  - UI: `VerifierWithdrawalForm`
  - Rule: payout request create.

### Module: Verification Workflows
#### Sub-module: Domain-Scoped Workflow
- `POST /api/v1/banking/verification/workflows/{verificationId}/claim`
  - Scope/claim: `verification:write`
  - UI: `WorkflowClaimButton`
  - Rule: can claim only visible domains (academic/general).
- `GET /api/v1/banking/verification/workflows/queue`
  - Scope/claim: `verification:read`
  - UI: `VerifierWorkflowQueue`
  - Rule: domain visibility enforced by actor permissions.
- `POST /api/v1/banking/verification/workflows/{verificationId}/release`
  - Scope/claim: `verification:write`
  - UI: `WorkflowReleaseButton`
  - Rule: owner/admin only.
- `PATCH /api/v1/banking/verification/workflows/{verificationId}/status`
  - Scope/claim: `verification:write`
  - UI: `WorkflowStatusControl`
  - Rule: lock-sensitive update.
- `GET /api/v1/banking/verification/workflows/summary`
  - Scope/claim: `verification:read`
  - UI: `WorkflowSummary`
  - Rule: scoped aggregation.
- `GET /api/v1/banking/verification/workflows/{verificationId}/timeline`
  - Scope/claim: `verification:read`
  - UI: `WorkflowTimeline`
  - Rule: event audit stream.

---

## Access Matrix (Concise)

| Module | Enterprise | User | Verifier |
|---|---|---|---|
| AML | Full (`aml:write`) | None | None |
| Analytics | Read (`analytics:read`) | None | None |
| API Keys | Read/Write | None | None |
| Audit | Read | None | None |
| Authentication | Session bearer usage | Full self-service | Full self-service |
| Biometrics | Full (`biometrics:write`) | None | None |
| Blockchain | Read only | None | None |
| Diagnostics | Read only | None | None |
| Documents | Full + financial-domain authority | None | Full + academic-domain authority |
| Email Verifications | Full read/write | None | Read-only via fallback guard |
| KYC | Full read/write | None | None |
| License/Settings | Read subsets (`license:read`, `settings:read`, `api_settings:read`) | None | None |
| Reports | Create (`reports:write`) | None | None |
| Screening | Write actions | None | None |
| Verification Operations | Full review/read/write set | None | Full review/read/write set |
| Verification Workflows | Full read/write scoped by domains | None | Full read/write scoped by domains |
| Webhooks | Read/Write | None | None |
| ZK Proof | Read + write/generate | None | None |

## Validation Statement
- Every capability listed above is traceable to:
  - Route existence in `openapi.generated.json`.
  - Guard logic in router files under `banking/routers`.
  - Role permission grant in `banking/permissions.py`.
- Domain-specific document restrictions are additionally traceable to `banking/verification_access.py`.
