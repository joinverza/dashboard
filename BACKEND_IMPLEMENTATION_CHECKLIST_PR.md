# PR Checklist: Backend Implementation for Dashboard Mapping

## PR Summary
- Implements backend contracts required by `TASK_BACKEND_FRONTEND_MAPPING.md`.
- Covers endpoint-by-endpoint delivery with request/response schemas, auth/RBAC, and email security controls.
- Unblocks frontend integrations already implemented in the dashboard.

## Scope
- Team invitation and secure email onboarding.
- License usage and plan change operations.
- API key environment support and RBAC enforcement.
- API settings persistence.
- Billing plan catalog and payment-gated upgrades.
- Company settings persistence + optional logo upload.

## Global API Standards (Apply to All Endpoints)
- [ ] Use versioned base path: `/api/v1/banking`.
- [ ] Require `X-Request-Id` pass-through and return in response header.
- [ ] Return consistent error shape on failures:

```json
{
  "success": false,
  "error": {
    "code": "string_code",
    "message": "human readable message",
    "details": []
  },
  "timestamp": "2026-04-03T00:00:00.000Z"
}
```

- [ ] Return envelope for success:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-04-03T00:00:00.000Z"
}
```

- [ ] Enforce idempotency for write endpoints (`POST`, `DELETE`) via `Idempotency-Key`.
- [ ] Emit audit logs for all privileged actions.

## Auth + RBAC Matrix

| Capability | Required Permission | Allowed Roles |
|---|---|---|
| List API keys | `api_keys:read` | `admin`, `manager`, `enterprise` (if granted) |
| Create/Revoke API keys | `api_keys:write` | `admin`, `manager` |
| List/Register/Delete webhooks | `webhooks:read`, `webhooks:write` | `admin`, `manager` |
| Read usage metrics | `license:read` | `admin`, `manager`, `enterprise` |
| Change license plan | `license:write` | `admin`, billing-admin users |
| Read/Update API settings | `api_settings:read`, `api_settings:write` | `admin`, security-admin users |
| Invite team member | `team:invite` | `admin`, `manager` |
| Read/Update company settings | `settings:read`, `settings:write` | `admin`, `manager` |

- [ ] JWT validation on every protected endpoint.
- [ ] Server-side permission checks (do not trust frontend role checks).
- [ ] 403 for valid token but missing permission.

## Endpoint-by-Endpoint Checklist

### 1) Team Invitations + Email Delivery

#### `POST /team/invitations`
- [ ] Implement endpoint.
- [ ] Auth: `team:invite`.
- [ ] Request schema:

```json
{
  "email": "new.member@company.com",
  "role": "Viewer",
  "message": "Optional welcome message"
}
```

- [ ] Response schema:

```json
{
  "invitationId": "inv_123",
  "status": "sent"
}
```

- [ ] Validation:
  - [ ] Email format validation.
  - [ ] Role in allowed set (`Admin`, `Manager`, `Analyst`, `Viewer`).
  - [ ] Organization membership and license seat checks.
- [ ] Side effects:
  - [ ] Persist invitation token hash + TTL.
  - [ ] Queue outbound email.
  - [ ] Audit event `team.invitation.created`.

#### `POST /team/invitations/{invitationId}/resend` (recommended)
- [ ] Auth: `team:invite`.
- [ ] Rate-limit resend to avoid abuse.
- [ ] Audit event `team.invitation.resent`.

#### `POST /team/invitations/accept` (required for flow completion)
- [ ] Accept signed token and create account/team membership.
- [ ] Single-use token invalidation.
- [ ] Audit event `team.invitation.accepted`.

### 2) License Usage + Plan Change

#### `GET /license/usage`
- [ ] Implement endpoint.
- [ ] Auth: `license:read`.
- [ ] Response schema:

```json
{
  "planName": "Business",
  "currentPeriodStart": "2026-04-01T00:00:00.000Z",
  "currentPeriodEnd": "2026-04-30T23:59:59.999Z",
  "monthlyQuota": 5000,
  "usedQuota": 3250,
  "slaUptime": 99.95,
  "anomalyAlerts": [
    { "id": "alert_1", "message": "Usage spike detected", "severity": "medium" }
  ]
}
```

#### `POST /license/plan/change`
- [ ] Implement endpoint.
- [ ] Auth: `license:write`.
- [ ] Request schema:

```json
{
  "targetPlan": "starter"
}
```

- [ ] Response schema:

```json
{
  "status": "accepted"
}
```

- [ ] Enforce payment-state gating (no active upgrade until payment success).
- [ ] Audit event `license.plan.change_requested`.

### 3) API Keys: Environment + Rate-Limit

#### `GET /api-keys`
- [ ] Include explicit `environment` per key:
  - [ ] `production`
  - [ ] `sandbox`
- [ ] Auth: `api_keys:read`.
- [ ] Response item schema:

```json
{
  "keyId": "key_123",
  "keyName": "Backend Service",
  "keyPrefix": "vk_live_****",
  "permissions": ["api_keys:read"],
  "environment": "production",
  "createdAt": "2026-04-03T00:00:00.000Z",
  "lastUsed": "2026-04-03T00:00:00.000Z",
  "status": "active"
}
```

#### `POST /api-keys/create`
- [ ] Auth: `api_keys:write`.
- [ ] Request schema:

```json
{
  "keyName": "Backend Service",
  "permissions": ["api_keys:read", "api_keys:write"],
  "environment": "sandbox",
  "expiresAt": null
}
```

- [ ] Response schema includes one-time `apiKey`.
- [ ] Rate-limiting:
  - [ ] Return `429` when exceeded.
  - [ ] Include `Retry-After` header.
  - [ ] Include request ID for support tracing.

#### `DELETE /api-keys/{keyId}`
- [ ] Auth: `api_keys:write`.
- [ ] Soft-revoke and audit event `api_key.revoked`.

### 4) API Settings Persistence

#### `GET /api/settings`
- [ ] Auth: `api_settings:read`.
- [ ] Response schema:

```json
{
  "autoRotateSecrets": true,
  "ipWhitelistEnabled": false,
  "allowedIps": []
}
```

#### `PATCH /api/settings`
- [ ] Auth: `api_settings:write`.
- [ ] Request schema:

```json
{
  "autoRotateSecrets": true,
  "ipWhitelistEnabled": true,
  "allowedIps": ["203.0.113.10/32"]
}
```

- [ ] Validate IP/CIDR format when whitelist is enabled.
- [ ] Audit event `api_settings.updated`.

### 5) Billing Plans + Payment-Gated Upgrade

#### `GET /billing/plans`
- [ ] Public to authenticated org users or `license:read`.
- [ ] Response schema:

```json
{
  "plans": [
    { "id": "starter", "monthly": 499, "yearlyMonthlyEquivalent": 399, "currency": "USD" },
    { "id": "business", "monthly": 2450, "yearlyMonthlyEquivalent": 1960, "currency": "USD" },
    { "id": "enterprise", "monthly": null, "yearlyMonthlyEquivalent": null, "currency": "USD" }
  ]
}
```

#### `POST /billing/checkout/session`
- [ ] Auth: `license:write`.
- [ ] Request schema:

```json
{
  "targetPlan": "business",
  "billingInterval": "yearly"
}
```

- [ ] Response schema:

```json
{
  "checkoutSessionId": "cs_123",
  "provider": "stripe",
  "checkoutUrl": "https://..."
}
```

#### `POST /billing/webhooks/provider`
- [ ] Verify provider signature.
- [ ] On payment success:
  - [ ] Mark checkout session paid.
  - [ ] Apply plan change atomically.
  - [ ] Emit audit event `license.plan.changed`.
- [ ] On payment failure:
  - [ ] Keep current plan unchanged.

### 6) Company Settings + Logo Upload

#### `GET /settings/company`
- [ ] Auth: `settings:read`.
- [ ] Return current company profile.

#### `PATCH /settings/company`
- [ ] Auth: `settings:write`.
- [ ] Validate critical fields (`companyName`, `email`, optional `website` URL).
- [ ] Audit event `settings.company.updated`.

#### `POST /settings/company/logo` (recommended)
- [ ] Auth: `settings:write`.
- [ ] Accept image upload with max size policy.
- [ ] Return canonical CDN URL for `logoUrl`.

## Email Security Requirements (Mandatory for Invitation Flow)
- [ ] SPF configured for sending domain.
- [ ] DKIM signing enabled with key rotation policy.
- [ ] DMARC policy enforced (`quarantine` or `reject`) with aggregate reporting.
- [ ] Use dedicated transactional subdomain (example: `mail.yourdomain.com`).
- [ ] Invitation links:
  - [ ] Signed token (HMAC or asymmetric signature).
  - [ ] Short TTL (recommended 24h to 72h).
  - [ ] Single-use nonce/jti with replay prevention.
  - [ ] Bind token to org + email + intended role.
- [ ] Add anti-abuse controls:
  - [ ] Per-org and per-recipient send throttles.
  - [ ] CAPTCHA/risk controls for suspicious activity.
  - [ ] Alerting for unusual invitation spikes.

## Testing Checklist
- [ ] Unit tests for request validation on every new endpoint.
- [ ] Integration tests for auth and RBAC denials (`401`/`403`).
- [ ] Contract tests for response envelopes and schema stability.
- [ ] Payment webhook tests for success/failure idempotency.
- [ ] Invitation token lifecycle tests (issue, resend, expire, accept once).
- [ ] Rate-limit tests for API key creation (`429` + `Retry-After`).

## Rollout + Migration Checklist
- [ ] Feature-flag plan-change enforcement until payment webhooks are verified in prod.
- [ ] Backfill existing API keys with `environment` default (`production`).
- [ ] Add DB indexes for invitation token lookup and API key environment queries.
- [ ] Configure monitoring dashboards:
  - [ ] Invitation delivery success/failure.
  - [ ] Plan change request/success ratio.
  - [ ] API key create rate-limit hit rate.

## PR Acceptance Criteria
- [ ] All endpoints above implemented or explicitly marked deferred with owner/date.
- [ ] RBAC permissions enforced server-side and documented.
- [ ] Email security controls configured and validated.
- [ ] Frontend integration smoke test passes for:
  - [ ] Invite member flow.
  - [ ] Usage load + upgrade/downgrade actions.
  - [ ] API key create/list/revoke in production and sandbox.
  - [ ] API settings save/load.
  - [ ] Pricing to billing payment-gated upgrade flow.
