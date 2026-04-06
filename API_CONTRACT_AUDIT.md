# Frontend-Backend API Contract Audit

## Scope
- Canonical backend contract source: `compapi.md`.
- Frontend contract sources: `src/services/bankingService.ts`, `src/services/authService.ts`, `src/security/*.ts`, `src/types/banking.ts`, `src/types/security.ts`.
- Generated schema/endpoint inventory: `FRONTEND_SCHEMA_ENDPOINT_MASTER.md`.

## Audit Method
- Parsed all `### \`METHOD /path\`` entries from `compapi.md`.
- Extracted frontend service calls for `request(...)`, `primitiveRequest(...)`, and direct `fetch(...)` usage in auth/security clients.
- Compared method + path pairs with placeholder-aware matching (`{id}` templates).
- Re-validated after fixes: **0 unresolved method/path mismatches in `bankingService.ts` static endpoint calls**.

## Discrepancies Found And Fixed
| Area | Previous Frontend Contract | Canonical Backend Contract (`compapi.md`) | Resolution |
|---|---|---|---|
| Audit export | `POST /api/v1/banking/audit/logs/export-signed` | `POST /api/v1/banking/audit/export` | Updated `bankingService.exportSignedAuditLogs()` to call `/audit/export`. |
| Moderation queue/history | `GET /api/v1/banking/content/moderation/queue`, `GET /api/v1/banking/content/moderation/history` | `GET /api/v1/banking/admin/content` | Updated queue/history to query `/admin/content` with filters. |
| Moderation rules | `GET /api/v1/banking/content/moderation/rules` | `GET /api/v1/banking/admin/content` | Updated rules loader to derive rule-like records from `/admin/content` payload (`rules` or `items`). |
| Moderate content action | `POST /api/v1/banking/content/moderation/{contentId}/action` | `POST /api/v1/banking/admin/content/{contentId}/moderate` | Updated `moderateContent()` endpoint path. |
| Verifier staking overview/history | `GET /api/v1/banking/verifier/staking/overview`, `GET /api/v1/banking/verifier/staking/history` | `GET /api/v1/banking/verifier/staking` | Consolidated both reads to `/verifier/staking` and normalized `overview/history` response shapes. |
| Verifier staking actions | `POST /api/v1/banking/verifier/staking/stake`, `POST /api/v1/banking/verifier/staking/unstake` | `POST /api/v1/banking/verifier/staking/actions` | Updated action methods to `/verifier/staking/actions` with explicit `action` field (`stake`/`unstake`). |
| Verifier support endpoints | `GET /api/v1/banking/support/articles`, `GET/POST /api/v1/banking/support/tickets` | `GET /api/v1/banking/verifier/help/articles`, `GET/POST /api/v1/banking/verifier/help/tickets` | Updated article/ticket service endpoints to verifier-help namespace. |

## Auth Contract Notes
- `authService.ts` uses role-normalized auth bases (`/admin/auth`, `/enterprise/auth`, `/verifier/auth`, `/user/auth`) and then calls relative paths (`/login`, `/signup`, etc.).
- This aligns with `compapi.md` templated routes (`/{role}/auth/*`) and `/auth/*` routes when base URL is configured accordingly.
- No code change required for auth path method compatibility.

## Error Handling, Validation, And Security
- Existing request middleware behavior remains intact:
  - Standard envelope/error normalization (`success/error/requestId`) in `bankingService` and `authService`.
  - Retry and refresh-token handling for transient auth failures.
  - High-risk security headers (`X-Ontiver-Nonce`, `X-Ontiver-Timestamp`) unchanged.
  - Existing request guards (`assertRequiredString`, `assertBodyField`) retained.

## Tests Added/Updated
- Updated integration coverage in `src/services/bankingService.operationsHub.integration.test.ts`:
  - Verifies audit export now uses `/api/v1/banking/audit/export`.
  - Verifies staking reads from `/api/v1/banking/verifier/staking` and actions post to `/api/v1/banking/verifier/staking/actions` with proper `action` payload.
  - Verifies support and moderation calls use `/api/v1/banking/verifier/help/*` and `/api/v1/banking/admin/content/*`.

## Suggested Commit Messages
- `fix(api-contract): align audit/moderation/staking/support endpoints with compapi.md`
- `test(api-contract): add integration assertions for corrected backend endpoint mappings`
- `docs(api): regenerate frontend schema endpoint map and add contract audit report`
