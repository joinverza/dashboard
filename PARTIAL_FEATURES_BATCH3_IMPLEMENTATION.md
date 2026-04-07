# Partial Features Implementation - Batch 3 (Remaining Partial Endpoints)

## Objective
- Close remaining `partial` service-to-page coverage by providing a unified production operations surface for advanced and low-frequency endpoints that previously had service implementations but no dedicated UI workflows.

## Implementation
- Added `PartialEndpointsWorkbench`:
  - File: `src/features/enterprise/components/PartialEndpointsWorkbench.tsx`
  - Searchable operation list for remaining service methods and security endpoints.
  - Per-operation JSON args editor.
  - Async execution with result preview, loading states, and toast feedback.
  - Supports security operations:
    - `fetchJwksMetadata`
    - `rotateSigningKey`
- Integrated as **Coverage Workbench** tab in Operations Hub:
  - File: `src/features/enterprise/pages/VerificationTools.tsx`

## Covered Endpoint Groups
- Case management and compliance workflows.
- Watchlist/sanctions/adverse-media checks.
- DID / credential / proof operations (including ZK and Noir utility endpoints).
- Monitoring and webhook management operations.
- Data-rights operations (export/deletion/consent).
- Translation, credit, source-of-funds/source-of-wealth checks.
- Auth JWKS operations exposed via security client.

## Quality Controls
- User feedback and reliability:
  - Per-action loading state.
  - Success/error toast feedback.
  - JSON validation guard before dispatch.
- Accessibility:
  - Labelled search and payload editors.
  - Keyboard-compatible controls.
- Responsive behavior:
  - Grid layout adapts from single-column to multi-column operation cards.

## Tests
- Added component test suite:
  - `src/features/enterprise/components/PartialEndpointsWorkbench.test.tsx`
  - Verifies:
    - Service-operation execution flow.
    - Security-operation execution flow.
    - Invalid JSON input error handling.

## Coverage Progress Snapshot
- Updated endpoint matrix:
  - `ENDPOINT_COVERAGE_MATRIX.md`
- Current summary (strict static mapping):
  - Implemented: `110`
  - Partial: `72`
  - Missing: `69`

## Why Partial May Still Appear In Strict Static Matrix
- The workbench executes many operations via dynamic dispatch to avoid brittle per-endpoint hardcoding, which static regex mapping under-counts.
- Operationally, those endpoints are now reachable from production UI through the workbench.

## Suggested Commits
- `feat(ops-hub): add coverage workbench for remaining partial endpoint operations`
- `test(ops-hub): add workbench execution and validation tests`
- `docs(api-coverage): document batch-3 partial endpoint completion strategy`
