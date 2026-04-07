# Partial Features Implementation - Batch 1

## Scope
- Objective: start implementation phase for `partial` features from `ENDPOINT_COVERAGE_MATRIX.md`.
- Implemented domain in this batch: **Primitive Verification Ops** (`/verification/*`) and related service/schema alignment.
- Files updated:
  - `src/services/bankingService.ts`
  - `src/types/banking.ts`
  - `src/features/enterprise/components/PrimitiveVerificationPanel.tsx`
  - `src/features/enterprise/pages/VerificationTools.tsx`
  - `src/features/enterprise/components/PrimitiveVerificationPanel.test.tsx`

## Service-Schema Validation Audit (Batch 1)
Reference source: `compapi.md`

### Verified Endpoints
- `GET /verification/health`
- `GET /verification/cameras`
- `GET /verification/config`
- `GET /verification/model/status`
- `POST /verification/model/reload`
- `POST /verification/proxy/token`

### Discrepancies Identified
1. `POST /verification/model/reload`
- Spec: request body supports optional `model_path` (schema `ReloadBody`).
- Previous service behavior: always posted `{}` with no typed request contract.
- Fix: introduced `PrimitiveReloadRequest` + strict request validation and pass-through of optional `model_path`.

2. `POST /verification/proxy/token`
- Spec: request body is `None`; optional query parameter `document_type`.
- Previous service behavior: posted arbitrary request body object.
- Fix: introduced `PrimitiveProxyTokenRequest`, moved `documentType` to query string (`document_type`), removed body payload.

3. Runtime usage coverage
- Previous state: primitive service methods existed but were not wired into a production page flow (status remained partial).
- Fix: implemented a dedicated `PrimitiveVerificationPanel` and integrated it into `VerificationTools` tab navigation.

## Schema Compliance Refactor Summary
- Added typed models:
  - `PrimitiveReloadRequest`
  - `PrimitiveProxyTokenRequest`
  - `PrimitiveProxyTokenResponse`
- Added zod validation:
  - `primitiveReloadRequestSchema`
  - `primitiveProxyTokenRequestSchema`
  - `primitiveProxyTokenResponseSchema`
- Updated service contracts:
  - `reloadPrimitiveModel(data?: PrimitiveReloadRequest)`
  - `getPrimitiveProxyToken(data?: PrimitiveProxyTokenRequest)`

## UI/UX Deliverable (Batch 1)
### Implemented Component
- `PrimitiveVerificationPanel`:
  - Health and model-status cards
  - Camera inventory summary
  - Runtime config viewer
  - Proxy token issue form (`documentType`)
  - Model reload form (`modelPath`)
  - Loading states, success/error feedback via toasts

### Wireframe (Desktop)
```text
+--------------------------------------------------------------+
| Primitive Verification Control Plane                         |
| [Load Snapshot] [Reload Model] [Issue Proxy Token]          |
|--------------------------------------------------------------|
| Document Type [___________]  Model Path [_________________] |
|--------------------------------------------------------------|
| Health Card               | Model Card                       |
| Status / Ready            | Status / Loaded / Version        |
|--------------------------------------------------------------|
| Cameras Summary           | Runtime Config JSON              |
|--------------------------------------------------------------|
| Proxy Token Preview (token + expiry)                         |
+--------------------------------------------------------------+
```

### Wireframe (Mobile)
```text
[Primitive Verification Control Plane]
[Load Snapshot]
[Reload Model]
[Issue Proxy Token]
[Document Type Input]
[Model Path Input]
[Health Card]
[Model Card]
[Cameras Summary]
[Runtime Config]
[Proxy Token Preview]
```

### Accessibility and Quality Notes
- Inputs include explicit labels and accessible names.
- Interactive controls use semantic buttons and keyboard-friendly form controls.
- Feedback for all async operations includes success/error toasts.
- Layout uses responsive grid and stacks cleanly on small screens.

## Testing Deliverables (Batch 1)
- Added component tests: `PrimitiveVerificationPanel.test.tsx`
  - Snapshot load flow
  - Proxy token issue flow
  - Model reload flow
  - Error feedback flow
- Existing integration/security suites still pass alongside new tests.

## Backward Compatibility
- Existing service consumers remain compatible:
  - `reloadPrimitiveModel()` still works with no args.
  - `getPrimitiveProxyToken()` still supports call without args; now aligned with API query contract.

## Suggested Commits
- `feat(verification-tools): add primitive verification operations panel with responsive UX`
- `refactor(api-schema): align primitive proxy-token and model-reload requests with compapi`
- `test(enterprise): add primitive verification panel service-flow tests`
