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

