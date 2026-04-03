# Dashboard Task Mapping (Frontend + Backend)

## Scope Classification

| # | Task | Focus | Why |
|---|---|---|---|
| 1 | Team avatar images with actual images | Frontend | UI asset rendering and team profile data presentation |
| 2 | Send secure/professional invite emails | Backend + Frontend | Backend email delivery + frontend invite workflow |
| 3 | Operations Hub usage/upgrade/downgrade shows not found | Backend + Frontend | Backend plan endpoints + frontend error handling/retries |
| 4 | Small help cards explaining tabs/pages | Frontend | UX guidance components |
| 5 | Active API keys for production/sandbox, privileged only | Backend + Frontend | Backend RBAC + frontend visibility and filtering |
| 6 | Proper production and sandbox pages/components | Frontend (with backend data) | UI views and environment-specific state |
| 7 | API key generation rate-limit exceeded | Backend + Frontend | Rate-limit policy + frontend feedback/retry UX |
| 8 | Make API settings buttons functional + pages | Frontend + Backend optional | Frontend controls; backend persistence optional |
| 9 | Monthly and yearly pricing plans | Frontend + Backend pricing source | UI pricing toggle; backend source of truth for catalog |
| 10 | Upgrade flow with payment success gating + tier docs | Backend + Frontend | Payment confirmation backend + frontend checkout/upgrade UX |
| 11 | Settings page buttons/pages functional | Frontend + Backend persistence | Frontend interactions + backend data storage |

## Frontend Implementation Notes (Completed In This Pass)

- `Task 1`: Added real avatar image assets under `public/avatars/` and connected team pages to actual image files.
- `Task 2`: Replaced invite simulation with `bankingService.inviteTeamMember(...)` call in `InviteTeamMember`.
- `Task 3`: Added graceful 404 handling for plan-change endpoints and safer Operations Hub button handling.
- `Task 4`: Added reusable `TabHelpCard` and integrated guidance cards into API, Operations Hub, and Settings pages.
- `Task 5`: Added privileged visibility checks and environment-based API key filtering (production/sandbox).
- `Task 6`: Added functional production/sandbox environment cards and segmented key views in API Management.
- `Task 7`: Added explicit rate-limit-friendly messaging for API key generation failures.
- `Task 8`: Wired API settings switches with save behavior (local persistence) and feedback.
- `Task 9`: Implemented monthly/yearly pricing logic and route-to-billing flow.
- `Task 10`: Implemented pending-plan payment gate in Billing where upgrade applies after payment success.
- `Task 11`: Made settings logo upload/remove controls functional and added save feedback.

## Backend Contract Mapping

### 1) Team avatars
- Frontend files:
  - `src/features/enterprise/pages/TeamManagement.tsx`
  - `src/features/enterprise/pages/TeamMemberDetail.tsx`
- Backend contract:
  - Optional `GET /api/v1/banking/team/members` should include `avatarUrl`.
  - Optional upload endpoint `POST /api/v1/banking/team/members/{id}/avatar`.

### 2) Team invitation emails
- Frontend files:
  - `src/features/enterprise/pages/InviteTeamMember.tsx`
  - `src/services/bankingService.ts` (`inviteTeamMember`)
- Backend required endpoint:
  - `POST /api/v1/banking/team/invitations`
  - Payload: `{ email, role, message? }`
  - Response: `{ invitationId, status }`
- Security requirements:
  - Signed invite tokens with TTL.
  - Single-use link redemption.
  - Audit log event on invite send/resend.
  - SPF/DKIM/DMARC-compliant sender domain.

### 3) Usage / Upgrade / Downgrade not found
- Frontend files:
  - `src/features/enterprise/pages/VerificationTools.tsx`
  - `src/services/bankingService.ts`
- Backend required endpoints:
  - `GET /api/v1/banking/license/usage`
  - `POST /api/v1/banking/license/plan/change`
- Expected behavior:
  - Return current plan, usage, quota, period.
  - Return accepted/queued status for change requests.

### 4) Help cards
- Frontend files:
  - `src/components/shared/TabHelpCard.tsx`
  - Integrated in API / Operations Hub / Settings pages.
- Backend required:
  - None (optional CMS/help content endpoint later).

### 5) API keys by environment + privileged access
- Frontend files:
  - `src/features/enterprise/pages/ApiManagement.tsx`
- Backend required:
  - `GET /api/v1/banking/api-keys` returns key metadata with environment (recommended explicit `environment` field).
  - Role/permission enforcement for API key endpoints (`api_keys:read`, `api_keys:write`).

### 6) Production vs sandbox functional pages
- Frontend files:
  - `src/features/enterprise/pages/ApiManagement.tsx`
- Backend required:
  - Environment-aware API key and webhook data.
  - Recommended query support `?environment=production|sandbox`.

### 7) API key generation rate limiting
- Frontend files:
  - `src/features/enterprise/pages/ApiManagement.tsx`
- Backend required:
  - `POST /api/v1/banking/api-keys/create` should return:
    - `429` with clear message and `Retry-After`.
    - Request ID header for traceability.

### 8) API settings functionality
- Frontend files:
  - `src/features/enterprise/pages/ApiManagement.tsx`
- Backend optional endpoint:
  - `GET /api/v1/banking/api/settings`
  - `PATCH /api/v1/banking/api/settings`
  - Fields: `autoRotateSecrets`, `ipWhitelistEnabled`, optional `allowedIps`.

### 9) Monthly/yearly pricing
- Frontend files:
  - `src/features/enterprise/pages/PricingPlans.tsx`
- Backend recommended endpoint:
  - `GET /api/v1/banking/billing/plans`
  - Return monthly and yearly prices per tier.

### 10) Upgrade buttons + payment gate + tiers
- Frontend files:
  - `src/features/enterprise/pages/PricingPlans.tsx`
  - `src/features/enterprise/pages/Billing.tsx`
- Backend required:
  - Payment intent/session creation.
  - Webhook confirmation from payment provider.
  - Upgrade only after payment success.
- Tier list in dashboard docs:
  - Starter
  - Business
  - Enterprise

### 11) Settings page functional buttons
- Frontend files:
  - `src/features/enterprise/pages/Settings.tsx`
- Backend required:
  - `GET /api/v1/banking/settings/company`
  - `PATCH /api/v1/banking/settings/company`
  - Optional file upload endpoint for logos.

## Suggested Backend Rollout Order

1. Team invitation email service (`/team/invitations`) with secure token redemption.
2. License usage + plan change endpoints (`/license/usage`, `/license/plan/change`).
3. Explicit API key environment field + RBAC hardening.
4. Pricing catalog and payment session endpoints.
5. API settings persistence endpoints.

## Validation Checklist

- Confirm all privileged routes enforce backend authorization, not frontend-only checks.
- Confirm all write actions return request IDs and audit events.
- Confirm rate-limited endpoints include actionable retry metadata.
- Confirm production/sandbox isolation at data and permission levels.
