# Partial Features Implementation - Batch 2

## Scope
- Targeted partial cluster from `ENDPOINT_COVERAGE_MATRIX.md`:
  - `GET /api/v1/banking/alerts/{alertId}`
  - `POST /api/v1/banking/alerts/{alertId}/investigate`
  - `POST /api/v1/banking/alerts/{alertId}/resolve`
  - `POST /api/v1/banking/account/verify`
  - `POST /api/v1/banking/account/instant-verify`
  - `POST /api/v1/banking/account/micro-deposits`
  - `GET /api/v1/banking/analytics/geographical`

## Service-Schema Conformance Audit
Reference: `compapi.md`

### Alerts Actions
- `AlertInvestigateBody` schema: optional `analyst`, optional `notes`.
- `AlertResolveBody` schema: required `resolution`, optional `notes`.
- Refactor:
  - Added `AlertInvestigateRequest` and `AlertResolveRequest` types.
  - Added zod schemas `alertActionSchema` and `alertResolveSchema`.
  - Service methods now validate payload shape before dispatch.

### Account Verification
- `AccountVerifyBody` schema requires:
  - `customerId`, `accountNumber`, `routingNumber`, `accountHolderName`, `verificationMethod`.
- `InstantVerifyBody` schema requires:
  - `customerId`, `publicToken`; optional nullable `accountHolderName`.
- `MicroDepositsBody` schema requires:
  - `customerId`, `accountNumber`, `routingNumber`, `accountHolderName`.
- Refactor:
  - Added typed request interfaces:
    - `AccountVerifyRequest`
    - `AccountInstantVerifyRequest`
    - `AccountMicroDepositsRequest`
  - Added zod request schemas and strict validation before request dispatch.

### Geographical Analytics
- Endpoint contract confirmed for `GET /api/v1/banking/analytics/geographical`.
- Added direct production UI usage path and integration assertions.

## UI Deliverables
- New component: `AlertAndAccountOpsPanel`
  - Alert lookup + investigate + resolve workflow.
  - Account verify + instant verify + micro-deposit verification workflow.
  - Geographical analytics loader and summary cards.
- Integrated into Operations Hub (`VerificationTools`) as **Alerts & Accounts** tab.
- UX quality:
  - Responsive card/grid layout.
  - Action-level loading and toast feedback.
  - Explicit field labels and keyboard-friendly controls.

## Test Deliverables
- Unit/component tests:
  - `AlertAndAccountOpsPanel.test.tsx`
  - Covers alert actions, account actions, geographical analytics load, and error feedback.
- Integration tests:
  - Added endpoint-path assertions and payload-flow checks in `bankingService.operationsHub.integration.test.ts`.
  - Added negative validation test ensuring invalid account payloads fail pre-dispatch.

## Backward Compatibility
- Endpoint paths remain unchanged; request contracts now stricter and schema-aligned.
- Existing call signatures updated to typed payloads with identical semantic intent.

## Suggested Commits
- `feat(ops-hub): add alerts/accounts operations panel and geographical analytics flow`
- `refactor(service-schema): enforce alert/account request contracts per compapi`
- `test(ops-hub): add alert-account-geographical service/component integration coverage`
