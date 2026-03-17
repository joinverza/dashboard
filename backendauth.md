# Auth API Frontend Integration Guide

This document describes the implemented backend auth APIs in `banking/auth_api.py` and how to map them correctly on frontend.

## 1. Base URL and Headers

- **Base path:** `/auth`
- **Content-Type:** `application/json`
- **Auth header for protected route (`GET /auth/me`):**

```http
Authorization: Bearer <accessToken>
```

- **Request ID support:** all responses include `requestId` in body for traceability.

## 2. Global Response Shapes

### 2.1 Success Envelope

```json
{
  "success": true,
  "data": {},
  "requestId": "8f6f7e87ed0f4a4eb3b5cc3e22f2fabc"
}
```

### 2.2 Error Envelope

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Invalid email",
    "details": []
  },
  "requestId": "8f6f7e87ed0f4a4eb3b5cc3e22f2fabc"
}
```

## 3. Auth Data Contracts

### 3.1 Role Enum

```ts
type Role = "enterprise" | "verifier" | "admin";
```

### 3.2 Login MFA Object

```ts
type LoginMfa = {
  method: "totp";
  code: string;
};
```

### 3.3 Token Payload Returned by Login/MFA/Refresh

```ts
type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: Role;
  };
  permissions: string[];
};
```

## 4. Endpoint Reference

---

## 4.1 `POST /auth/signup`

Creates a user account and returns a one-time generated `authKey`.

### Request Body (union by role)

#### Enterprise

```json
{
  "role": "enterprise",
  "organizationName": "Acme Corp",
  "contactName": "Jane Doe",
  "email": "security@acme.com",
  "password": "V3rza!Auth#789",
  "countryCode": "US",
  "registrationNumber": "REG-12345",
  "consentAccepted": true
}
```

#### Verifier

```json
{
  "role": "verifier",
  "organizationName": "Verify Labs",
  "contactName": "John Doe",
  "email": "ops@verifylabs.com",
  "password": "V3rza!Auth#789",
  "verificationLicenseId": "VL-9981",
  "jurisdiction": "NG",
  "consentAccepted": true
}
```

#### Admin

```json
{
  "role": "admin",
  "fullName": "Alice Root",
  "email": "alice@company.com",
  "password": "V3rza!Auth#789",
  "department": "Security",
  "authorizationCode": "VERZA_ADMIN_CODE",
  "consentAccepted": true
}
```

### Validation Rules

- Email is trimmed/lowercased and must be valid (`<=254` chars).
- Password must be `12..128`, include uppercase/lowercase/digit/symbol.
- Password rejects obvious weak patterns and common breached values.
- Role-specific required fields enforced.
- Admin domain restricted by server config (`AUTH_ADMIN_EMAIL_DOMAINS`).
- Duplicate email returns conflict.

### Success Response `201`

```json
{
  "success": true,
  "data": {
    "userId": "usr_123abc456def",
    "role": "enterprise",
    "status": "pending_email_verification",
    "generatedAuthKey": "vz_..."
  },
  "requestId": "req_123"
}
```

### Common Errors

- `400 validation_error`
- `409 email_conflict`
- `429 rate_limited`

---

## 4.2 `POST /auth/login`

Authenticates with `email + password + role + authKey`.

### Request Body

```json
{
  "email": "admin@company.com",
  "password": "V3rza!Auth#789",
  "role": "admin",
  "authKey": "vz_....",
  "mfa": {
    "method": "totp",
    "code": "123456"
  }
}
```

`mfa` is optional on initial request. If required and omitted, backend returns MFA challenge (`202`).

### Success Response `200`

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt",
    "refreshToken": "rt_...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "usr_123",
      "email": "admin@company.com",
      "role": "admin"
    },
    "permissions": ["admin:read", "admin:write"]
  },
  "requestId": "req_123"
}
```

### MFA Required Response `202`

```json
{
  "success": true,
  "data": {
    "mfaRequired": true,
    "challengeId": "mfa_ch_1234567890ab",
    "methods": ["totp", "webauthn"]
  },
  "requestId": "req_123"
}
```

### Common Errors

- `400 validation_error` (invalid email/role/authKey format)
- `401 invalid_credentials`
- `401 mfa_failed`
- `403 role_mismatch`
- `403 account_disabled`
- `403 ip_blocked`
- `423 account_locked`
- `429 rate_limited`

---

## 4.3 `POST /auth/mfa/verify`

Completes MFA challenge and returns tokens.

### Request Body

```json
{
  "challengeId": "mfa_ch_1234567890ab",
  "method": "totp",
  "code": "123456"
}
```

### Success Response `200`

Same payload as login success token response.

### Common Errors

- `401 mfa_failed` for:
  - invalid challenge
  - already consumed challenge
  - expired challenge
  - invalid code
  - unsupported method

---

## 4.4 `POST /auth/refresh`

Rotates refresh token and issues a new access token + new refresh token.

### Request Body

```json
{
  "refreshToken": "rt_..."
}
```

### Success Response `200`

Same payload as login success token response.

### Common Errors

- `401 token_invalid` (invalid/expired token, expired session, unknown user)
- `401 token_invalid` with message `Refresh token reuse detected` when reuse is detected

### Frontend Rule

- Always replace stored refresh token with the newly returned one.
- If refresh fails with `token_invalid`, clear auth state and force re-login.

---

## 4.5 `POST /auth/logout`

Revokes session(s) associated with provided refresh token.

### Request Body

```json
{
  "refreshToken": "rt_...",
  "allSessions": false
}
```

### Success Response `204`

No response body.

### Frontend Rule

- Regardless of body, on `204` clear local auth tokens/state.

---

## 4.6 `POST /auth/forgot-password`

Starts password reset request flow.

### Request Body

```json
{
  "email": "user@company.com"
}
```

### Success Response `202`

```json
{
  "success": true,
  "requestId": "req_123"
}
```

### Notes

- Response is always `202` to avoid account enumeration.
- Reset token is generated server-side and stored hashed.

---

## 4.7 `POST /auth/reset-password`

Resets password using reset token.

### Request Body

```json
{
  "token": "pwd_...",
  "newPassword": "N3w!Strong#456"
}
```

### Success Response `200`

```json
{
  "success": true,
  "data": {
    "changed": true
  },
  "requestId": "req_123"
}
```

### Common Errors

- `401 token_invalid` (invalid/expired/used reset token)
- `400 validation_error` (password policy or password history violation)

### Side Effect

- All existing sessions and refresh tokens for the user are revoked.

---

## 4.8 `GET /auth/me`

Returns current authenticated user profile and permissions.

### Headers

```http
Authorization: Bearer <accessToken>
```

### Success Response `200`

```json
{
  "success": true,
  "data": {
    "id": "usr_123",
    "email": "user@company.com",
    "role": "enterprise",
    "permissions": ["kyc:write", "kyc:read"]
  },
  "requestId": "req_123"
}
```

### Common Errors

- `401 token_invalid`:
  - missing bearer token
  - invalid/expired JWT
  - session revoked or expired
  - password reset invalidated token version

## 5. Session and Token Behavior

- Access token TTL: **900s (15 minutes)**
- Refresh token TTL: **30 days**
- Session idle timeout:
  - enterprise/verifier: **30 minutes**
  - admin: **15 minutes**
- Absolute timeout:
  - enterprise/verifier: **12 hours**
  - admin: **8 hours**
- Concurrent session limits:
  - enterprise: **5**
  - verifier: **3**
  - admin: **2**

When session limit is exceeded, older sessions are revoked automatically.

## 6. Frontend State Machine (Recommended)

### 6.1 Login Flow

1. Submit `/auth/login` without `mfa`.
2. If `200`: save tokens and user info.
3. If `202` and `mfaRequired=true`: show MFA UI and call `/auth/mfa/verify`.
4. If `/auth/mfa/verify` returns `200`: save tokens and continue.
5. On auth failures (`401`, `403`, `423`, `429`), map error message to UI.

### 6.2 Authenticated API Calls

1. Add `Authorization: Bearer <accessToken>`.
2. On `401 token_invalid`, attempt single refresh using `/auth/refresh`.
3. If refresh succeeds, retry original request once.
4. If refresh fails, sign out and redirect to login.

### 6.3 Logout

- Call `/auth/logout`, then clear client auth state regardless of response body.

## 7. Suggested Frontend Types

```ts
type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
  requestId: string;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  requestId: string;
};

type LoginResponse = ApiSuccess<AuthTokenResponse>;

type MfaChallengeResponse = ApiSuccess<{
  mfaRequired: true;
  challengeId: string;
  methods: Array<"totp" | "webauthn">;
}>;
```

## 8. Error Code Mapping Table

| HTTP | code | Typical UI meaning |
|---|---|---|
| 400 | `validation_error` | Input is invalid |
| 401 | `invalid_credentials` | Email/password/authKey mismatch |
| 401 | `mfa_failed` | MFA challenge or code invalid |
| 401 | `token_invalid` | Session/token expired or invalid |
| 403 | `role_mismatch` | Selected role does not match account |
| 403 | `account_disabled` | Account inactive/unapproved |
| 403 | `ip_blocked` | IP denied by policy |
| 409 | `email_conflict` | Email already exists |
| 423 | `account_locked` | Temporary lockout due to failures |
| 429 | `rate_limited` | Too many attempts |

## 9. Important Implementation Notes for Frontend

- Persist `authKey` only if your business flow requires showing/storing it after signup; backend stores only its hash.
- `generatedAuthKey` is returned at signup; design UX so user can copy/save once.
- MFA challenge is short-lived; if expired, restart login.
- Treat `requestId` as support/debug correlation ID in logs and UI error reports.
- `methods` includes `webauthn`, but currently verification flow is implemented for `totp`.

