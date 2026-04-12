# Payment API Implementation Documentation

## 1. Overview

This document describes the current payment and billing implementation in the Banking API, based on the latest code updates.

- API base prefix: `/api/v1/banking`
- Main payment domain: billing plans, checkout session creation, billing webhooks, and license usage charges
- Pricing model (Enterprise):
  - Verification fee: `$0.40` per verification
  - AML monitoring fee: `$0.10` per billable user per month
  - API access fee: `$1000.00` per month

## 2. OpenAPI 3.0 Definition (Implementation-Aligned)

```yaml
openapi: 3.0.3
info:
  title: Banking Payment API
  version: 1.0.0
  description: Payment and billing endpoints for plan retrieval, checkout, webhook processing, and usage billing.
servers:
  - url: https://{host}
    variables:
      host:
        default: api.example.com
security:
  - BearerAuth: []
tags:
  - name: billing
    description: Payment and billing operations
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: APIKeyOrJWT
  parameters:
    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: false
      schema:
        type: string
      description: Optional idempotency key for safe retries on selected write endpoints.
    ProviderSignature:
      name: X-Provider-Signature
      in: header
      required: false
      schema:
        type: string
      description: HMAC SHA-256 signature in format `sha256=<hex>`.
  schemas:
    SuccessEnvelope:
      type: object
      required: [success, data, timestamp]
      properties:
        success:
          type: boolean
          enum: [true]
        data:
          type: object
          additionalProperties: true
        timestamp:
          type: string
          format: date-time
    ErrorEnvelope:
      type: object
      required: [success, error, timestamp]
      properties:
        success:
          type: boolean
          enum: [false]
        error:
          type: object
          required: [code, message]
          properties:
            code:
              type: string
            message:
              type: string
            details:
              nullable: true
              description: Optional structured details.
        timestamp:
          type: string
          format: date-time
    BillingPlan:
      type: object
      required:
        - id
        - currency
        - chargeModel
      properties:
        id:
          type: string
          enum: [starter, business, enterprise]
        monthly:
          type: integer
          nullable: true
          description: Flat monthly price in currency minor units for flat plans.
        yearlyMonthlyEquivalent:
          type: integer
          nullable: true
          description: Effective monthly equivalent for yearly billing in minor units.
        currency:
          type: string
          example: USD
        chargeModel:
          type: string
          enum: [flat, per_verification]
        perVerificationPrice:
          type: number
          format: float
          nullable: true
          description: Enterprise per-verification price in major units.
        amlMonitoringPerUserMonthly:
          type: number
          format: float
          nullable: true
          description: Enterprise AML monthly fee per billable user in major units.
        apiAccessMonthlyFee:
          type: number
          format: float
          nullable: true
          description: Enterprise fixed API monthly access fee in major units.
    BillingPlansResponseData:
      type: object
      required: [plans]
      properties:
        plans:
          type: array
          items:
            $ref: '#/components/schemas/BillingPlan'
    CheckoutSessionBody:
      type: object
      required: [targetPlan, billingInterval]
      properties:
        targetPlan:
          type: string
          description: Active billing plan id.
          example: business
        billingInterval:
          type: string
          enum: [monthly, yearly]
    CheckoutSessionResponseData:
      type: object
      required: [checkoutSessionId, provider, checkoutUrl]
      properties:
        checkoutSessionId:
          type: string
          example: cs_abc123def456
        provider:
          type: string
          example: stripe
        checkoutUrl:
          type: string
          format: uri
    BillingWebhookEvent:
      type: object
      required: [provider, eventId, status, checkoutSessionId]
      properties:
        provider:
          type: string
          default: stripe
        eventId:
          type: string
        status:
          type: string
          enum: [payment_success, payment_failed]
        checkoutSessionId:
          type: string
        targetPlan:
          type: string
          nullable: true
    BillingWebhookResponseData:
      type: object
      properties:
        processed:
          type: boolean
        status:
          type: string
          description: For duplicate events, returns `duplicate_ignored`.
    LicenseUsageResponseData:
      type: object
      required:
        - planName
        - currentPeriodStart
        - currentPeriodEnd
        - monthlyQuota
        - usedQuota
        - slaUptime
        - anomalyAlerts
        - chargeModel
        - unitPricePerVerification
        - estimatedUsageCharge
        - amlMonitoringPerUserMonthly
        - apiAccessMonthlyFee
        - billableUsers
        - estimatedAmlMonitoringCharge
        - estimatedApiAccessCharge
        - estimatedTotalMonthlyCharge
        - currency
      properties:
        planName:
          type: string
        currentPeriodStart:
          type: string
          format: date-time
        currentPeriodEnd:
          type: string
          format: date-time
        monthlyQuota:
          type: integer
        usedQuota:
          type: integer
        slaUptime:
          type: number
          format: float
        anomalyAlerts:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              message:
                type: string
              severity:
                type: string
        chargeModel:
          type: string
          enum: [included_quota, per_verification]
        unitPricePerVerification:
          type: number
          format: float
        estimatedUsageCharge:
          type: number
          format: float
        amlMonitoringPerUserMonthly:
          type: number
          format: float
        apiAccessMonthlyFee:
          type: number
          format: float
        billableUsers:
          type: integer
        estimatedAmlMonitoringCharge:
          type: number
          format: float
        estimatedApiAccessCharge:
          type: number
          format: float
        estimatedTotalMonthlyCharge:
          type: number
          format: float
        currency:
          type: string
          example: USD
    LicensePlanChangeBody:
      type: object
      required: [targetPlan]
      properties:
        targetPlan:
          type: string
          example: enterprise
    LicensePlanChangeResponseData:
      type: object
      required: [status]
      properties:
        status:
          type: string
          example: accepted
paths:
  /api/v1/banking/billing/plans:
    get:
      tags: [billing]
      summary: List active billing plans
      responses:
        '200':
          description: Plans retrieved
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/BillingPlansResponseData'
        '401':
          description: Missing/invalid bearer token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '429':
          description: API key hourly limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
  /api/v1/banking/billing/checkout/session:
    post:
      tags: [billing]
      summary: Create checkout session for target plan
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CheckoutSessionBody'
      responses:
        '200':
          description: Checkout session created
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/CheckoutSessionResponseData'
        '400':
          description: Invalid plan or invalid billing interval
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '401':
          description: Missing/invalid bearer token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '403':
          description: Missing required permission `license:write`
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '429':
          description: API key hourly limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
  /api/v1/banking/billing/webhooks/provider:
    post:
      tags: [billing]
      summary: Process payment provider webhook event
      security: []
      parameters:
        - $ref: '#/components/parameters/ProviderSignature'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BillingWebhookEvent'
      responses:
        '200':
          description: Webhook processed or duplicate ignored
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/BillingWebhookResponseData'
        '400':
          description: Unsupported webhook event status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '401':
          description: Invalid webhook signature
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '404':
          description: Unknown checkout session id
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '503':
          description: Billing webhook secret not securely configured
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
  /api/v1/banking/license/usage:
    get:
      tags: [billing]
      summary: Get license usage and billing summary
      responses:
        '200':
          description: Usage and billing summary returned
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/LicenseUsageResponseData'
        '401':
          description: Missing/invalid bearer token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '403':
          description: Missing required permission `license:read`
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '429':
          description: API key hourly limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
  /api/v1/banking/license/plan/change:
    post:
      tags: [billing]
      summary: Request plan change
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LicensePlanChangeBody'
      responses:
        '200':
          description: Plan change request accepted
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/SuccessEnvelope'
                  - type: object
                    properties:
                      data:
                        $ref: '#/components/schemas/LicensePlanChangeResponseData'
        '400':
          description: Invalid target plan
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '401':
          description: Missing/invalid bearer token
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '403':
          description: Missing required permission `license:write`
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
        '429':
          description: API key hourly limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorEnvelope'
```

## 3. Authentication Requirements

### 3.1 Bearer Authentication (Most Billing Endpoints)

Billing endpoints use `require_banking_api_key`, which accepts:

1. API key bearer tokens from `api_keys` table.
2. Auth access JWT tokens (validated session-bound).
3. Service tokens (machine identities).

### 3.2 Permission Requirements

- `GET /billing/plans`: authenticated bearer token; no explicit permission gate in route handler.
- `GET /license/usage`: requires `license:read`.
- `POST /billing/checkout/session`: requires `license:write`.
- `POST /license/plan/change`: requires `license:write`.
- `POST /billing/webhooks/provider`: no bearer auth; HMAC header signature is required.

### 3.3 Webhook Signature Authentication

- Header: `X-Provider-Signature: sha256=<hex_digest>`
- Signature logic: `HMAC_SHA256(secret=BILLING_WEBHOOK_SECRET, body=raw_request_body)`
- Validation fails with `401 invalid_webhook_signature`.
- If `BILLING_WEBHOOK_SECRET` is unset, weak, or default fallback value, endpoint fails with `503 billing_webhook_secret_invalid`.

## 4. Rate Limiting

### 4.1 API-Key Hourly Rate Limit

When using API-key bearer authentication:

- Limit source: `api_keys.rate_limit_per_hour`
- Counter table: `rate_limit_counters`
- Scope: per API key id
- Window: hour bucket (`YYYY-MM-DDTHH:00:00Z`)
- Exceeded limit: `429` HTTPException with message `Rate limit exceeded` (wrapped into banking error envelope)

JWT and service-token flow currently do not use the API-key hourly counter path.

## 5. Idempotency

Idempotency is enabled on selected write operations via `Idempotency-Key` header:

- `POST /billing/checkout/session`
- `POST /license/plan/change`

Behavior:

- First request persists result in `idempotency_records`.
- Repeat request with same key, method, path, tenant, and api key returns the original response payload and status.

## 6. Message Body Structures and Examples

### 6.1 GET `/api/v1/banking/billing/plans`

Request:

```http
GET /api/v1/banking/billing/plans HTTP/1.1
Authorization: Bearer <token>
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "starter",
        "monthly": 499,
        "yearlyMonthlyEquivalent": 399,
        "currency": "USD",
        "chargeModel": "flat",
        "perVerificationPrice": null,
        "amlMonitoringPerUserMonthly": null,
        "apiAccessMonthlyFee": null
      },
      {
        "id": "enterprise",
        "monthly": null,
        "yearlyMonthlyEquivalent": null,
        "currency": "USD",
        "chargeModel": "per_verification",
        "perVerificationPrice": 0.4,
        "amlMonitoringPerUserMonthly": 0.1,
        "apiAccessMonthlyFee": 1000.0
      }
    ]
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

### 6.2 POST `/api/v1/banking/billing/checkout/session`

Request:

```http
POST /api/v1/banking/billing/checkout/session HTTP/1.1
Authorization: Bearer <token>
Idempotency-Key: checkout-req-001
Content-Type: application/json

{
  "targetPlan": "business",
  "billingInterval": "yearly"
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "checkoutSessionId": "cs_1234567890abcdef",
    "provider": "stripe",
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_1234567890abcdef"
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

Response `400` (invalid interval):

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "billingInterval must be monthly or yearly"
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

### 6.3 POST `/api/v1/banking/billing/webhooks/provider`

Request:

```http
POST /api/v1/banking/billing/webhooks/provider HTTP/1.1
Content-Type: application/json
X-Provider-Signature: sha256=<hmac_hex>

{
  "provider": "stripe",
  "eventId": "evt_001",
  "status": "payment_success",
  "checkoutSessionId": "cs_1234567890abcdef"
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "processed": true
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

Duplicate event response `200`:

```json
{
  "success": true,
  "data": {
    "status": "duplicate_ignored"
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

Response `401` (signature mismatch):

```json
{
  "success": false,
  "error": {
    "code": "invalid_webhook_signature",
    "message": "Provider signature verification failed"
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

### 6.4 GET `/api/v1/banking/license/usage`

Request:

```http
GET /api/v1/banking/license/usage HTTP/1.1
Authorization: Bearer <token>
```

Enterprise response `200`:

```json
{
  "success": true,
  "data": {
    "planName": "Enterprise",
    "currentPeriodStart": "2026-04-01T00:00:00Z",
    "currentPeriodEnd": "2026-04-30T23:59:59Z",
    "monthlyQuota": 5000,
    "usedQuota": 1,
    "slaUptime": 99.95,
    "anomalyAlerts": [],
    "chargeModel": "per_verification",
    "unitPricePerVerification": 0.4,
    "estimatedUsageCharge": 0.4,
    "amlMonitoringPerUserMonthly": 0.1,
    "apiAccessMonthlyFee": 1000.0,
    "billableUsers": 1,
    "estimatedAmlMonitoringCharge": 0.1,
    "estimatedApiAccessCharge": 1000.0,
    "estimatedTotalMonthlyCharge": 1000.5,
    "currency": "USD"
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

### 6.5 POST `/api/v1/banking/license/plan/change`

Request:

```http
POST /api/v1/banking/license/plan/change HTTP/1.1
Authorization: Bearer <token>
Idempotency-Key: plan-change-001
Content-Type: application/json

{
  "targetPlan": "enterprise"
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "status": "accepted"
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

## 7. Response Codes and Meanings

### 7.1 Common

- `200`: Successful request.
- `400`: Validation/business rule failure (invalid plan, invalid billing interval, invalid webhook status).
- `401`: Authentication/signature failure.
- `403`: Permission or IP-whitelist denial.
- `404`: Referenced checkout session not found.
- `429`: API key hourly rate limit exceeded.
- `503`: Service misconfiguration (notably insecure/missing billing webhook secret).

### 7.2 Error Envelope Format

All banking endpoints use:

```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human-readable message",
    "details": {}
  },
  "timestamp": "2026-04-12T12:00:00Z"
}
```

`X-Request-Id` header is returned when request context contains an id.

## 8. Database Schema (Payment/Billing-Relevant)

### 8.1 `billing_plans`

Stores cataloged pricing and billing model metadata.

- `id` (PK)
- `monthly`
- `yearly_monthly_equivalent`
- `currency`
- `active`
- `requires_contact`
- `charge_model`
- `per_verification_cents`
- `aml_per_user_month_cents`
- `api_access_monthly_cents`

### 8.2 `license_subscriptions`

Per-tenant current plan and usage.

- `tenant_id` (PK)
- `plan_name`
- `current_period_start`
- `current_period_end`
- `monthly_quota`
- `used_quota`
- `sla_uptime`
- `payment_state`
- `pending_plan`
- `target_effective_at`
- `created_at`
- `updated_at`

### 8.3 `billing_checkout_sessions`

Checkout tracking and payment status.

- `id` (PK)
- `tenant_id`
- `target_plan`
- `billing_interval`
- `provider`
- `checkout_url`
- `status`
- `provider_reference`
- `created_by`
- `created_at`
- `updated_at`
- `paid_at`

### 8.4 `billing_webhook_events`

Incoming payment-provider webhook events with deduplication by event id.

- `id` (PK)
- `provider`
- `event_id` (UNIQUE)
- `signature_valid`
- `payload_json`
- `status`
- `received_at`
- `processed_at`

### 8.5 `idempotency_records`

Replay safety for selected write endpoints.

- unique key: `(tenant_id, api_key_id, method, path, idempotency_key)`
- stores original status code and response body JSON

## 9. Payment Gateway Integration Analysis

## 9.1 Which gateway is currently set up?

The billing/payment flow is currently implemented as **Stripe-oriented**:

- Checkout URLs are generated as `https://checkout.stripe.com/pay/{session_id}`.
- `billing_checkout_sessions.provider` is set to `"stripe"`.
- Webhook body defaults provider to `"stripe"`.

### Conclusion

The current payment gateway integration for billing is **Stripe-style integration** (custom lightweight flow), not PayPal/Square/Adyen.

## 9.2 Gateway-Specific Implementation Details

- Checkout session creation is currently internal and synthetic:
  - A local session id (`cs_<...>`) is generated.
  - Session metadata is persisted in DB.
  - A Stripe checkout-style URL is returned.
- There is no direct Stripe SDK call in this implementation path.
- Webhook processing is custom:
  - Validates `X-Provider-Signature` via HMAC SHA-256.
  - Deduplicates events by `eventId`.
  - On `payment_success`: marks checkout paid and updates `license_subscriptions` to target plan.
  - On `payment_failed`: marks checkout failed and sets subscription `payment_state='failed'`.

## 9.3 API Keys / Environment Variable Configuration

Billing-related variables observed in code:

- `BILLING_WEBHOOK_SECRET` (required for secure webhook verification).
- Fallback default in code is explicitly rejected as insecure.

Configuration-file findings:

- `.env.example` currently does not define `BILLING_WEBHOOK_SECRET`.
- `.env` currently does not define `BILLING_WEBHOOK_SECRET`.

Operational impact:

- If not set securely at runtime, webhook endpoint will return `503 billing_webhook_secret_invalid`.

## 9.4 Other Payment/Provider Signals in Codebase

- Paystack variables and helper logic exist in `banking/jobs.py`, but are used for identity workflows (BVN/NIN checks), not billing checkout processing.
- Mono variables exist for account linking/verification features, not billing checkout.

## 10. Custom Payment Processing Logic Summary

1. Plan catalog comes from `billing_plans`.
2. Checkout request validates plan and interval, then records pending checkout session.
3. Provider webhook validates signature and status.
4. Webhook event dedupe prevents double processing.
5. Subscription transitions:
   - success -> plan applied, payment state paid
   - failure -> payment state failed
6. Enterprise usage billing is computed dynamically:
   - verification usage from `license_subscriptions.used_quota`
   - billable users from active team members plus owner account
   - monthly totals include verification + AML + API access fee

## 11. Security and Hardening Notes

- Do not use weak/default webhook secrets.
- Store billing webhook secret in secure secret manager or deployment environment, not source control.
- Rotate any exposed secrets and restrict env-file access.
- Consider adding explicit `provider` allow-list checks if multi-gateway support is introduced.

