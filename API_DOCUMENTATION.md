# Verza Dashboard API Documentation

This document outlines the API endpoints required to support the Verza Dashboard, covering User, Verifier, Enterprise, and Admin functionalities.

## Base URL
`https://api.verza.io/v1`

## Authentication & Authorization

### Login
- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "u_12345",
      "name": "Anne Cooper",
      "email": "anne.cooper@velvet.com",
      "role": "user", // "user" | "verifier" | "enterprise" | "admin"
      "avatar": "https://..."
    }
  }
  ```

### Register
- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "user"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful. Please verify your email."
  }
  ```

### Forgot Password
- **Endpoint:** `/auth/forgot-password`
- **Method:** `POST`
- **Request Body:** `{"email": "user@example.com"}`
- **Response:** `{"message": "Reset link sent"}`

### Reset Password
- **Endpoint:** `/auth/reset-password`
- **Method:** `POST`
- **Request Body:** `{"token": "reset_token", "newPassword": "..."}`
- **Response:** `{"message": "Password updated"}`

---

## Common Utilities

### File Upload
- **Endpoint:** `/upload`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Request:** `file` (binary)
- **Response:**
  ```json
  {
    "url": "https://storage.verza.io/uploads/file.pdf",
    "id": "file_123"
  }
  ```

### Notifications
- **Endpoint:** `/notifications`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "id": "n_1",
      "title": "Verification Complete",
      "description": "Your degree verification is complete.",
      "timestamp": "2023-10-27T10:00:00Z",
      "isRead": false,
      "type": "success"
    }
  ]
  ```

### Mark Notification Read
- **Endpoint:** `/notifications/:id/read`
- **Method:** `PUT`
- **Response:** `{"success": true}`

### Messages
- **Endpoint:** `/messages`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "id": "m_1",
      "senderId": "u_555",
      "senderName": "Verifier Inc.",
      "subject": "Document Query",
      "content": "Please re-upload...",
      "timestamp": "2023-10-26T14:30:00Z",
      "isRead": false
    }
  ]
  ```

---

## User Dashboard

### Dashboard Overview
- **Endpoint:** `/user/dashboard`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "metrics": [
      { "id": "1", "label": "Verified Credentials", "value": "12", "percentChange": 8.5 },
      { "id": "2", "label": "Pending", "value": "3", "percentChange": -2.0 }
    ],
    "activity": [ ... ],
    "verificationStatus": [ ... ]
  }
  ```

### Credentials
- **List Credentials:** `GET /user/credentials`
- **Get Credential:** `GET /user/credentials/:id`
- **Upload Credential:**
  - **Endpoint:** `/user/credentials`
  - **Method:** `POST`
  - **Request Body:**
    ```json
    {
      "title": "University Diploma",
      "type": "Education",
      "fileUrl": "https://...",
      "issuer": "University X"
    }
    ```
- **Share Credential:**
  - **Endpoint:** `/user/credentials/:id/share`
  - **Method:** `POST`
  - **Request Body:** `{"recipientEmail": "..."}`
  - **Response:** `{"shareLink": "https://verza.io/share/..."}`

### Verifications
- **List Requests:** `GET /user/verifications`
- **Request Verification:**
  - **Endpoint:** `/user/verifications`
  - **Method:** `POST`
  - **Request Body:**
    ```json
    {
      "credentialId": "c_123",
      "verifierId": "v_456",
      "notes": "Please verify ASAP"
    }
    ```

### Marketplace
- **List Verifiers:** `GET /marketplace/verifiers?category=education&search=...`
- **Verifier Profile:** `GET /marketplace/verifiers/:id`
- **Response:**
  ```json
  {
    "id": "v_456",
    "name": "Global Verify",
    "rating": 4.8,
    "services": ["Education", "Employment"],
    "priceRange": "$10-$50"
  }
  ```

### Wallet
- **Get Balance:** `GET /user/wallet/balance`
- **Get Transactions:** `GET /user/wallet/transactions`
- **Deposit Funds:** `POST /user/wallet/deposit` (`{"amount": 100, "method": "card"}`)
- **Withdraw Funds:** `POST /user/wallet/withdraw` (`{"amount": 50, "address": "0x..."}`)

---

## Verifier Dashboard

### Dashboard Overview
- **Endpoint:** `/verifier/dashboard`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "activeJobs": 5,
    "earnings": 1250.00,
    "reputation": 98
  }
  ```

### Job Board
- **Available Jobs:** `GET /verifier/jobs/available`
- **Accept Job:** `POST /verifier/jobs/:id/accept`
- **Active Jobs:** `GET /verifier/jobs/active`

### Verification Process
- **Get Job Details:** `GET /verifier/jobs/:id`
- **Update Status:** `PUT /verifier/jobs/:id/status` (`{"status": "in_progress"}`)
- **Complete Verification:**
  - **Endpoint:** `/verifier/jobs/:id/complete`
  - **Method:** `POST`
  - **Request Body:**
    ```json
    {
      "verdict": "verified", // or "rejected"
      "reportUrl": "https://...",
      "comments": "All checks passed."
    }
    ```

### Profile & Settings
- **Update Profile:** `PUT /verifier/profile`
- **Manage Services:** `PUT /verifier/services`

---

## Enterprise Dashboard

### Dashboard Overview
- **Endpoint:** `/enterprise/dashboard`
- **Method:** `GET`

### Bulk Verification
- **Upload Batch:** `POST /enterprise/verifications/batch`
- **Batch Status:** `GET /enterprise/verifications/batch/:id`

### Team Management
- **List Members:** `GET /enterprise/team`
- **Invite Member:** `POST /enterprise/team/invite` (`{"email": "...", "role": "editor"}`)
- **Remove Member:** `DELETE /enterprise/team/:id`

### API Management
- **Get API Keys:** `GET /enterprise/api-keys`
- **Generate Key:** `POST /enterprise/api-keys`
- **Revoke Key:** `DELETE /enterprise/api-keys/:id`

---

## Admin Dashboard

### User Management
- **List Users:** `GET /admin/users?role=all&status=active`
- **Get User:** `GET /admin/users/:id`
- **Ban User:** `POST /admin/users/:id/ban`
- **Unban User:** `POST /admin/users/:id/unban`

### Content Moderation
- **List Flagged Content:** `GET /admin/moderation/flagged`
- **Resolve Flag:** `POST /admin/moderation/:id/resolve` (`{"action": "delete"}`)

### System Monitor
- **Get System Health:** `GET /admin/system/health`
- **Response:**
  ```json
  {
    "cpu": "45%",
    "memory": "60%",
    "uptime": "99.9%"
  }
  ```

### Compliance & Audit
- **Get Audit Logs:** `GET /admin/audit-logs`
- **Get Compliance Reports:** `GET /admin/compliance/reports`

### Governance
- **List Proposals:** `GET /admin/governance/proposals`
- **Create Proposal:** `POST /admin/governance/proposals`
- **Vote:** `POST /admin/governance/proposals/:id/vote`


### Staking (Verifier)
- **Get Staking Info:** `GET /verifier/staking`
- **Stake Tokens:** `POST /verifier/staking/stake` (`{"amount": 1000}`)
- **Unstake Tokens:** `POST /verifier/staking/unstake` (`{"amount": 500}`)
- **Claim Rewards:** `POST /verifier/staking/claim`

---

## Analytics
- **Get User Analytics:** `GET /user/analytics?period=30d`
- **Get Verifier Analytics:** `GET /verifier/analytics?period=30d`
- **Get Enterprise Analytics:** `GET /enterprise/analytics?period=30d`

---

## Additional Admin Features

### Disputes
- **List Disputes:** `GET /admin/disputes`
- **Get Dispute Detail:** `GET /admin/disputes/:id`
- **Resolve Dispute:** `POST /admin/disputes/:id/resolve`
  ```json
  {
    "resolution": "refund_user",
    "reason": "Verifier failed to deliver."
  }
  ```

### Fraud Detection
- **Get Fraud Alerts:** `GET /admin/fraud/alerts`
- **Dismiss Alert:** `POST /admin/fraud/alerts/:id/dismiss`

---

## Backend Requirements

### General
- **CORS:** Enable CORS for the dashboard domain.
- **Rate Limiting:** Implement rate limiting on public endpoints (login, register).
- **Security:**
  - All endpoints must be HTTPS.
  - JWT for stateless authentication.
  - Input validation for all request bodies (Zod/Joi).

### Specific Logic
- **Verification Logic:** Backend must handle the state machine for verifications (Pending -> In Review -> Verified/Rejected).
- **Wallet Logic:** Integration with payment gateways (Stripe/PayPal) or Blockchain nodes for crypto transactions.
- **Notifications:** Real-time updates using WebSockets or Server-Sent Events (SSE) for status changes.
- **RBAC:** Middleware to enforce Role-Based Access Control (User vs Verifier vs Admin).

---

# Golang Backend Structure (Proposed)

This section proposes a production-grade Go backend structure tailored to the frontend routes and features in this repository (User, Verifier, Enterprise, Admin), including chat (user↔admin, user↔verifier), verifications workflow, wallet/payments, enterprise API keys, audit/compliance, and admin operations.

## High-Level Architecture

- **Primary runtime:** Go HTTP API (REST) + optional WebSocket for chat and notifications.
- **Data stores:**
  - **PostgreSQL** for transactional data (users, credentials, verifications, payments, disputes, audit logs).
  - **Redis** for caching, rate limiting, WebSocket presence, ephemeral state.
  - **S3** for document storage (credentials, reports) using pre-signed URLs; never proxy large files through the API.
- **Async processing:** background workers (SQS/Redis Streams) for document scanning, webhook delivery, email, fraud signals, analytics rollups.
- **Observability:** structured logs, metrics, traces (OpenTelemetry).
- **Security:** JWT + refresh tokens (or session tokens), enterprise API keys, RBAC/ABAC, audit trails, encryption.

## Repository Layout

Recommended monorepo layout for the backend (Go):

```
backend/
  cmd/
    api/
      main.go
    worker/
      main.go
    migrate/
      main.go
  internal/
    config/
      config.go
    http/
      server.go
      router.go
      middleware/
        auth.go
        rbac.go
        rate_limit.go
        request_id.go
        recover.go
        cors.go
        csrf.go
      handlers/
        auth/
          handler.go
        users/
          handler.go
        credentials/
          handler.go
        verifications/
          handler.go
        marketplace/
          handler.go
        wallet/
          handler.go
        analytics/
          handler.go
        notifications/
          handler.go
        chat/
          handler.go
          ws.go
        admin/
          handler.go
    domain/
      user/
        model.go
        policy.go
      credential/
        model.go
      verification/
        model.go
        state_machine.go
      wallet/
        model.go
      chat/
        model.go
      enterprise/
        model.go
      audit/
        model.go
    service/
      auth/
        service.go
      user/
        service.go
      credential/
        service.go
      verification/
        service.go
      wallet/
        service.go
      chat/
        service.go
      enterprise/
        service.go
      admin/
        service.go
    repo/
      user/
        repo.go
        postgres.go
      credential/
        repo.go
        postgres.go
      verification/
        repo.go
        postgres.go
      wallet/
        repo.go
        postgres.go
      chat/
        repo.go
        postgres.go
      audit/
        repo.go
        postgres.go
      enterprise/
        repo.go
        postgres.go
    infra/
      db/
        postgres.go
      cache/
        redis.go
      objectstore/
        s3.go
      email/
        ses.go
      queue/
        sqs.go
      webhook/
        dispatcher.go
      crypto/
        kms.go
  migrations/
    0001_init.sql
    0002_chat.sql
    ...
  openapi/
    openapi.yaml (optional; recommended)
  deploy/
    ecs/
    terraform/
```

## Core Concepts (Domain + Services)

- **Strict boundaries:**
  - `handlers` parse/validate requests, call `service`, map errors to HTTP.
  - `service` enforces business rules and authorization checks (RBAC/ABAC).
  - `repo` handles persistence and query shapes.
  - `domain` defines canonical models and invariants (including verification state machine).
- **Idempotency:** required for payments, webhook delivery, verification submissions, and some admin actions.
- **Auditability:** write immutable audit records for security/compliance-sensitive actions.

## Suggested Database Tables (Minimum Set)

Names are indicative; adjust for your naming conventions.

- **Auth & identity**
  - `users` (role: user|verifier|enterprise|admin)
  - `user_sessions` or `refresh_tokens`
  - `mfa_methods` (optional, recommended)
  - `roles`, `permissions`, `role_permissions`, `user_roles` (if not using role enum only)
- **Credentials**
  - `credentials` (owner_user_id, type, issuer, status)
  - `credential_files` (credential_id, s3_key, checksum, mime, size)
  - `credential_shares` (credential_id, created_by, share_token, expires_at, recipient_email)
  - `credential_revocations` (credential_id, reason, revoked_by, revoked_at)
- **Verification workflow**
  - `verification_requests` (user_id, credential_id, verifier_id, status, price, currency)
  - `verification_events` (request_id, type, payload_json, created_at) for audit/state transitions
  - `verification_reports` (request_id, s3_key, verdict, notes)
- **Marketplace**
  - `verifiers` (org/user fields, services, pricing, rating)
  - `verifier_services` (verifier_id, service_type, price, sla)
  - `reviews` (verifier_id, author_user_id, rating, text)
- **Wallet & billing**
  - `wallet_accounts` (owner_id, balance, currency)
  - `wallet_transactions` (deposit/withdraw/charge/refund, status, external_ref)
  - `payments` (provider, intent_id, status, amount, metadata)
  - `invoices` (enterprise_id, period, amount, status)
  - `subscriptions` (enterprise_id, plan, status)
- **Chat**
  - `conversations` (type: support|verifier, created_by)
  - `conversation_participants` (conversation_id, user_id, role_in_conversation)
  - `messages` (conversation_id, sender_id, body, sent_at, read_at)
  - `conversation_assignments` (admin_id, conversation_id) for support routing (optional)
- **Enterprise API**
  - `enterprise_accounts`
  - `enterprise_team_members`
  - `api_keys` (hashed_key, prefix, scopes, last_used_at, revoked_at)
  - `webhooks` (url, secret, events, status)
  - `webhook_deliveries` (webhook_id, event_id, status, attempts, last_error)
- **Admin / security**
  - `audit_logs` (actor_id, action, resource, ip, user_agent, metadata_json)
  - `fraud_alerts` (risk score, entity, status)
  - `disputes` (type, filer, against, status, resolution)
  - `system_events` or `error_logs` (optional; typically shipped to log system instead of DB)

---

# API Surface (Detailed v1 Endpoints)

Use versioned APIs (e.g. `/v1`) for all endpoints. Below uses `/v1` prefix implicitly for readability.

## Authentication

- `POST /auth/login` (email+password; returns access + refresh)
- `POST /auth/logout` (revoke refresh/session)
- `POST /auth/refresh` (rotate refresh token; returns new access)
- `POST /auth/register` (role-aware registration; enterprise/verifier may require approval)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/mfa/enroll` (optional)
- `POST /auth/mfa/verify` (optional)

## Users (Profile & Settings)

- `GET /me`
- `PATCH /me` (name, avatar, preferences)
- `PATCH /me/security` (password change, MFA toggles)
- `GET /me/activity` (recent events for dashboard)

## Credentials (User)

Matches `/app/credentials`, `/app/credentials/:id`, `/app/upload-credential`.

- `GET /user/credentials?status=&type=&q=&page=`
- `POST /user/credentials` (create credential record; expects file references or upload session)
- `GET /user/credentials/:id`
- `PATCH /user/credentials/:id`
- `DELETE /user/credentials/:id`
- `POST /user/credentials/:id/share` (creates share token + optional email invite)
- `GET /share/:token` (public read-only view; careful with PII)
- `POST /user/credentials/:id/revoke`
- `POST /user/uploads` (create upload session; returns S3 presigned POST/PUT)
- `POST /user/uploads/complete` (finalize upload; verify checksums)

## Marketplace (User)

Matches `/app/marketplace`, `/app/verifier-profile/:id`.

- `GET /marketplace/verifiers?search=&service=&rating=&sort=&page=`
- `GET /marketplace/verifiers/:id`
- `GET /marketplace/verifiers/:id/reviews?page=`

## Verification Requests (User)

Matches `/app/request-verification`, `/app/verification-status/:id`.

- `GET /user/verifications?status=&page=`
- `POST /user/verifications`
  ```json
  { "credentialId": "c_123", "verifierId": "v_456", "notes": "..." }
  ```
- `GET /user/verifications/:id`
- `POST /user/verifications/:id/cancel` (if allowed by state machine)
- `GET /user/verifications/:id/events` (timeline)
- `POST /user/verifications/:id/attachments` (optional extra docs)

## Wallet & Payments (User)

Matches `/app/wallet`, `/app/wallet/deposit`, `/app/wallet/withdraw`, transaction detail/status pages.

- `GET /user/wallet`
- `GET /user/wallet/transactions?page=`
- `GET /user/wallet/transactions/:id`
- `GET /user/wallet/config` (returns public configs for payment providers)
- `POST /user/wallet/deposit` (creates payment intent/initializes provider transaction)
  ```json
  { "amount": 5000, "currency": "NGN", "provider": "paystack", "email": "user@example.com" }
  ```
  Returns (Paystack example):
  ```json
  { "authorization_url": "https://checkout.paystack.com/...", "access_code": "...", "reference": "..." }
  ```
- `GET /user/wallet/verify/:reference` (verifies provider transaction; idempotent)
- `POST /user/wallet/withdraw` (initiates withdrawal; strong fraud controls)
- `GET /user/wallet/withdrawals/:id`
- `POST /payments/webhook` (Paystack/Stripe/other provider callback; verify signature)
- `GET /user/payment/confirm?payment_intent=` (optional, if using redirect-based confirmation)

## Notifications (All Roles)

- `GET /notifications?page=`
- `PUT /notifications/:id/read`
- `PUT /notifications/read-all`

## Messaging & Chat (User↔Admin, User↔Verifier)

Matches the dashboard chat modal and verifier chat.

### REST (conversation + message history)
- `GET /chat/conversations?type=support|verifier`
- `POST /chat/conversations`
  ```json
  { "type": "support", "verifierId": null }
  ```
- `GET /chat/conversations/:id`
- `GET /chat/conversations/:id/messages?before=&limit=`
- `POST /chat/conversations/:id/messages`
  ```json
  { "body": "Hello..." }
  ```
- `PUT /chat/conversations/:id/read` (mark as read; updates read receipts)
- `POST /chat/conversations/:id/close` (support ticket close semantics)

### WebSocket (recommended for real-time)
- `GET /ws/chat?token=...` (JWT in query or, preferably, header-based upgrade)
  - Events:
    - `message.new`
    - `conversation.updated`
    - `presence.updated`
    - `typing`

### Admin support routing
- `GET /admin/support/conversations?status=open|assigned|closed`
- `POST /admin/support/conversations/:id/assign` (assign to admin)
- `POST /admin/support/conversations/:id/close`

## Verifier (Jobs & Workflow)

Matches `/verifier/jobs`, `/verifier/active`, `/verifier/review/:id`, `/verifier/issue/:id`, earnings, reputation, reviews, analytics.

- `GET /verifier/jobs/available?type=&urgency=&page=`
- `POST /verifier/jobs/:id/accept`
- `GET /verifier/jobs/active?page=`
- `GET /verifier/jobs/:id`
- `PUT /verifier/jobs/:id/status`
- `POST /verifier/jobs/:id/notes`
- `POST /verifier/jobs/:id/complete`
  ```json
  { "verdict": "verified", "reportFileId": "file_123", "comments": "..." }
  ```
- `GET /verifier/earnings/summary?period=30d`
- `GET /verifier/earnings/transactions?page=`
- `POST /verifier/withdraw` (payout request)
- `GET /verifier/reviews?page=`
- `GET /verifier/analytics?period=30d`

## Verifier Staking

Matches `/verifier/staking`.

- `GET /verifier/staking`
- `POST /verifier/staking/stake`
- `POST /verifier/staking/unstake`
- `POST /verifier/staking/claim`

## Enterprise (Dashboard + Integrations)

Matches `/enterprise/*` pages: bulk verification, requests, API keys, team, compliance, audit, billing, analytics, integrations.

### Enterprise account
- `GET /enterprise/me`
- `PATCH /enterprise/me`

### Verification requests (enterprise initiated)
- `POST /enterprise/verifications` (single)
- `POST /enterprise/verifications/batch` (bulk upload)
- `GET /enterprise/verifications?page=`
- `GET /enterprise/verifications/:id`

### Team management
- `GET /enterprise/team?page=`
- `POST /enterprise/team/invite`
- `PATCH /enterprise/team/:id` (roles)
- `DELETE /enterprise/team/:id`

### API keys
- `GET /enterprise/api-keys`
- `POST /enterprise/api-keys`
- `DELETE /enterprise/api-keys/:id` (revoke)

### Webhooks & integrations
- `GET /enterprise/webhooks`
- `POST /enterprise/webhooks`
- `PATCH /enterprise/webhooks/:id`
- `DELETE /enterprise/webhooks/:id`
- `POST /enterprise/integrations/:provider/connect`
- `POST /enterprise/integrations/:provider/disconnect`

### Compliance & audit (enterprise-scoped)
- `GET /enterprise/compliance/reports?period=`
- `GET /enterprise/audit-logs?actor=&action=&from=&to=`

### Billing
- `GET /enterprise/billing/subscription`
- `GET /enterprise/billing/invoices?page=`
- `POST /enterprise/billing/plan` (upgrade/downgrade)

## Admin (Platform Operations)

Matches `/admin/*` pages: users/verifiers/enterprises, credentials, disputes, governance, system, logs, fraud, settings, admins, compliance, audit logs, moderation.

### Users & organizations
- `GET /admin/users?role=&status=&q=&page=`
- `GET /admin/users/:id`
- `POST /admin/users/:id/suspend`
- `POST /admin/users/:id/unsuspend`
- `POST /admin/users/:id/ban`
- `POST /admin/users/:id/unban`
- `GET /admin/verifiers?page=`
- `GET /admin/verifiers/:id`
- `GET /admin/enterprises?page=`
- `GET /admin/enterprises/:id`

### Credentials
- `GET /admin/credentials?status=&q=&page=`
- `GET /admin/credentials/:id`
- `POST /admin/credentials/:id/revoke`
- `POST /admin/credentials/:id/restore` (if soft-deleted)

### Verification oversight
- `GET /admin/verifications?status=&page=`
- `GET /admin/verifications/:id`
- `POST /admin/verifications/:id/force-cancel` (rare; audited)

### Disputes
- `GET /admin/disputes?status=&q=&page=`
- `GET /admin/disputes/:id`
- `POST /admin/disputes/:id/assign`
- `POST /admin/disputes/:id/resolve`

### Governance
- `GET /admin/governance/proposals?page=`
- `POST /admin/governance/proposals`
- `GET /admin/governance/proposals/:id`
- `POST /admin/governance/proposals/:id/vote`
- `POST /admin/governance/proposals/:id/execute` (if applicable)

### Fraud & security monitoring
- `GET /admin/fraud/alerts?status=&page=`
- `GET /admin/fraud/alerts/:id`
- `POST /admin/fraud/alerts/:id/dismiss`
- `POST /admin/fraud/alerts/:id/escalate`

### Audit logs & compliance
- `GET /admin/audit-logs?actor=&action=&resource=&from=&to=`
- `GET /admin/compliance/reports?framework=soc2|iso27001|gdpr&period=`

### System
- `GET /admin/system/health`
- `GET /admin/system/metrics`
- `GET /admin/system/error-logs?service=&level=&from=&to=`

---

# AWS Deployment (Recommended Structure)

This section provides an AWS deployment reference with security/compliance controls suitable for an identity/credential verification platform.

## Accounts & Environments

- Use **AWS Organizations** with separate accounts:
  - `shared-services` (CI/CD runners, artifact stores, central logging)
  - `dev`, `staging`, `prod`
  - Optional: `security` account (GuardDuty/SecurityHub/Config aggregator)
- Enforce SCPs (deny public S3, deny disabling CloudTrail/Config, restrict regions).

## Network Baseline (VPC)

- One VPC per environment, 3 AZs:
  - Public subnets: ALB, NAT gateways (if needed)
  - Private subnets: ECS tasks, internal services
  - Isolated subnets: RDS, ElastiCache
- Use **VPC endpoints** (S3, ECR, CloudWatch Logs, Secrets Manager, SSM) to reduce public egress.
- No SSH: use **SSM Session Manager** for break-glass access.

## Compute (ECS Fargate)

- **ECR** for container images.
- **ECS Fargate** for:
  - `api` service (Go HTTP + WebSocket if used)
  - `worker` service (async jobs)
- **ALB** in front of ECS:
  - TLS termination with **ACM**.
  - WAF attached for bot/rate controls.
  - Path-based routing if separating `/ws` and `/v1`.
- Deploy strategy:
  - **Blue/green** (CodeDeploy) for production.
  - Run DB migrations as a one-off task prior to traffic shifting.

## Data Layer

- **RDS PostgreSQL (Multi-AZ)** with:
  - Encryption at rest (KMS)
  - Automated backups + PITR
  - Read replicas (if needed)
  - Enhanced monitoring
- **ElastiCache Redis** (Multi-AZ) for:
  - rate limiting, caching, session/presence, job queues (if Redis-based)
- **S3** for documents:
  - SSE-KMS encryption
  - Block Public Access
  - Versioning + lifecycle policies
  - Optional **Object Lock (WORM)** for audit artifacts

## Edge & DNS

- **Route 53** for DNS.
- **CloudFront** for the frontend (if you host the SPA in S3) and optionally for API caching on safe GET endpoints.
- Strict TLS: TLS 1.2+, modern ciphers, HSTS.

## Secrets, Keys, and Cryptography

- **Secrets Manager** for DB creds, API keys, provider secrets; enable rotation where possible.
- **KMS** CMKs per environment:
  - separate keys for RDS, S3, Secrets Manager (optional)
- Never store raw API keys:
  - store a key prefix + bcrypt/argon2 hash of the secret.

## Logging, Monitoring, and Audit

- **CloudWatch Logs** for application logs (JSON structured).
- **CloudTrail** enabled in all accounts/regions; centralized to a log archive bucket.
- **AWS Config** + SecurityHub + GuardDuty for continuous compliance signals.
- Traces/metrics:
  - OpenTelemetry Collector → CloudWatch/X-Ray/AMP/AMG depending on your stack.
- Log retention:
  - security/audit logs: 1–7 years depending on policy
  - application logs: 30–180 days typical

## Compliance & Security Controls (Practical Checklist)

- **Data classification:** PII vs non-PII; tag and restrict access accordingly.
- **Least privilege IAM:** task roles per service; no wildcard permissions.
- **Network segmentation:** DB in isolated subnets; security groups deny by default.
- **Encryption everywhere:** TLS in transit; KMS at rest; consider field-level encryption for highly sensitive attributes.
- **Audit trails:** record admin actions (ban/unban, revoke credentials, dispute decisions, role changes) with IP/user agent.
- **Change management:** IaC + peer review, approvals for prod, immutable builds.
- **Vulnerability management:** container scanning (ECR scan + Trivy in CI), dependency scanning, regular patching.
- **Rate limiting & abuse prevention:** Redis token bucket + WAF rules; protect auth and verification endpoints.
- **Incident response:** GuardDuty findings routing, runbooks, break-glass role, pager integration.
- **Privacy rights (GDPR):** export/delete endpoints, retention policies, lawful basis logging where required.

## CI/CD (Suggested)

- Build steps:
  - `go test ./...`
  - `golangci-lint run`
  - build container image
  - scan image
  - push to ECR
- Deploy steps:
  - run migrations (one-off task)
  - deploy ECS service (blue/green)
  - smoke test `/healthz` and critical endpoints

## API Security Defaults

- Enforce request IDs (`X-Request-Id`) and correlation IDs.
- Validate JWTs (issuer, audience, expiry); rotate signing keys.
- Use short-lived access tokens + refresh tokens; store refresh tokens hashed and revokeable.
- Protect admin endpoints with stronger requirements:
  - MFA recommended
  - IP allowlists (optional)
  - session binding / device fingerprinting (optional)
- Use strict input validation (server-side) and consistent error shapes.
