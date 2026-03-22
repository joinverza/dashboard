# Public API Compatibility Report

## Scope
- Release: Operations Hub and Verifications split
- Date: 2026-03-18
- Affected public base path: `/api/v1/banking`

## Compatibility Outcome
- No existing public endpoint paths were removed.
- No existing HTTP methods were changed.
- No existing request schemas were made stricter for existing endpoints.
- Existing response fields for previously available endpoints remain unchanged.

## Existing Endpoints Preserved
- `/kyc/individual/verify`
- `/kyc/individual/basic`
- `/document/verify`
- `/document/extract`
- `/biometric/face-match`
- `/biometric/liveness`
- `/screening/sanctions/check`
- `/screening/pep/check`
- `/aml/risk-score`
- `/audit/logs`
- `/webhooks/register`
- `/webhooks`

## New Additive Endpoints
- `/onboarding/bulk/validate`
- `/onboarding/bulk/import`
- `/onboarding/bulk/errors/{validationId}`
- `/risk/sandbox/simulate`
- `/risk/sandbox/report`
- `/audit/logs/search`
- `/audit/logs/export-signed`
- `/webhooks/{webhookId}/test`
- `/webhooks/{webhookId}/rotate-secret`
- `/webhooks/retries`
- `/license/usage`
- `/license/plan/change`

## Front-End Route Compatibility
- Existing route `/enterprise/tools` remains available and now hosts Operations Hub.
- Verification API tooling moved to additive route `/enterprise/verifications`.
- Role deep-links added for manager and admin aliases without removing existing role routes.

## Risk Review
- Existing authentication flow unchanged.
- Existing authorization checks preserved.
- New endpoints are additive and scoped with role permissions.
