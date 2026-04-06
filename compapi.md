# Comprehensive API Reference

## API Versioning
- OpenAPI version: `3.1.0`
- API spec title: `FastAPI`
- API spec version: `0.1.0`
- Primary versioned namespace: `/api/v1/banking`
- Non-versioned namespaces present: `/verification`, `/auth`, `/{role}/auth`, `/health`, `/`

## Global Integration Notes
- CORS: enabled with allow-methods `*`, allow-headers `*`, credentials configurable, and exposed headers `X-Request-Id`, `X-Correlation-Id`.
- Traceability headers: request supports `X-Request-Id` (optional client-provided) and `X-Correlation-Id`; responses include `X-Request-Id` and may echo `X-Correlation-Id`.
- Banking auth: `Authorization: Bearer <token>` where token may be API key, auth access JWT, or service token.
- Verification auth: endpoints with security scheme `APIKeyHeader` require `X-API-Key` (or `X-Proxy-Token` for proxy flows).
- Idempotency: mutating banking endpoints commonly support `Idempotency-Key`; duplicate keys can return stored prior response.
- Error format (banking/auth): `{success:false,error:{code,message,details[]},requestId}`. Verification errors often return `{detail: ...}`.

## Rate Limiting
- Auth signup: default `5` requests per `3600s` per IP (`AUTH_SIGNUP_RATE_LIMIT_MAX`, `AUTH_SIGNUP_RATE_LIMIT_WINDOW_SECONDS`).
- Auth login: `10` requests per `300s` per IP.
- Banking API keys: per-key hourly limit via `rate_limit_per_hour`; exceed returns `429 Rate limit exceeded`.
- API key creation endpoint has explicit limiter and may return `Retry-After: 60`.
- Additional domain-specific 429 responses exist (for example invitation resend limits).

## Resource: auth

### `GET /auth/.well-known/jwks.json`
- Operation ID: `jwks_metadata_auth__well_known_jwks_json_get`
- Summary: Jwks Metadata
- Full URL template: `https://<host>/auth/.well-known/jwks.json`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/auth/.well-known/jwks.json' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/forgot-password`
- Operation ID: `forgot_password_auth_forgot_password_post`
- Summary: Forgot Password
- Full URL template: `https://<host>/auth/forgot-password`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ForgotPasswordRequest",
  "properties": {
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/forgot-password' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/jwks/revoke/{kid}`
- Operation ID: `revoke_jwt_signing_key_auth_jwks_revoke__kid__post`
- Summary: Revoke Jwt Signing Key
- Full URL template: `https://<host>/auth/jwks/revoke/{kid}`
- Authentication: Header `x-ontiver-admin-token` required (admin control-plane endpoint).
- Path parameters:
  - `kid`: `{"type": "string", "title": "Kid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/jwks/revoke/{kid}' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/jwks/rotate`
- Operation ID: `rotate_jwt_signing_key_auth_jwks_rotate_post`
- Summary: Rotate Jwt Signing Key
- Full URL template: `https://<host>/auth/jwks/rotate`
- Authentication: Header `x-ontiver-admin-token` required (admin control-plane endpoint).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/jwks/rotate' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/login`
- Operation ID: `login_auth_login_post`
- Summary: Login
- Full URL template: `https://<host>/auth/login`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "LoginRequest",
  "properties": {
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    },
    "password": {
      "type": "string",
      "title": "Password",
      "required": true
    },
    "role": {
      "type": "string",
      "title": "Role",
      "required": true
    },
    "authKey": {
      "type": "string",
      "title": "Authkey",
      "required": true
    },
    "mfa": {
      "anyOf": [
        {
          "type": "object",
          "title": "LoginMFARequest",
          "properties": {
            "method": {
              "type": "string",
              "title": "Method",
              "required": true
            },
            "code": {
              "type": "string",
              "title": "Code",
              "required": true
            }
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/login' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/logout`
- Operation ID: `logout_auth_logout_post`
- Summary: Logout
- Full URL template: `https://<host>/auth/logout`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "LogoutRequest",
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken",
      "required": true
    },
    "allSessions": {
      "type": "boolean",
      "title": "Allsessions",
      "default": false
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/logout' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/machine-identities`
- Operation ID: `create_machine_identity_auth_machine_identities_post`
- Summary: Create Machine Identity
- Full URL template: `https://<host>/auth/machine-identities`
- Authentication: Header `x-ontiver-admin-token` required (admin control-plane endpoint).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ServiceIdentityCreateRequest",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "required": true
    },
    "tenantId": {
      "type": "string",
      "title": "Tenantid",
      "required": true
    },
    "permissions": {
      "type": "array",
      "title": "Permissions",
      "items": {
        "type": "string"
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/machine-identities' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/machine-identities/{identityId}/tokens/issue`
- Operation ID: `issue_machine_token_auth_machine_identities__identityId__tokens_issue_post`
- Summary: Issue Machine Token
- Full URL template: `https://<host>/auth/machine-identities/{identityId}/tokens/issue`
- Authentication: Header `x-ontiver-admin-token` required (admin control-plane endpoint).
- Path parameters:
  - `identityId`: `{"type": "string", "title": "Identityid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ServiceTokenIssueRequest",
  "properties": {
    "ttlSeconds": {
      "title": "Ttlseconds",
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/machine-identities/{identityId}/tokens/issue' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /auth/me`
- Operation ID: `me_auth_me_get`
- Summary: Me
- Full URL template: `https://<host>/auth/me`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/auth/me' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /auth/mfa/enroll`
- Operation ID: `mfa_enroll_auth_mfa_enroll_get`
- Summary: Mfa Enroll
- Full URL template: `https://<host>/auth/mfa/enroll`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/auth/mfa/enroll' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/mfa/enroll/verify`
- Operation ID: `mfa_enroll_verify_auth_mfa_enroll_verify_post`
- Summary: Mfa Enroll Verify
- Full URL template: `https://<host>/auth/mfa/enroll/verify`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MFAEnrollVerifyRequest",
  "properties": {
    "method": {
      "type": "string",
      "title": "Method",
      "default": "totp"
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/mfa/enroll/verify' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/mfa/recovery-code/verify`
- Operation ID: `mfa_recovery_code_verify_auth_mfa_recovery_code_verify_post`
- Summary: Mfa Recovery Code Verify
- Full URL template: `https://<host>/auth/mfa/recovery-code/verify`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MFARecoveryCodeVerifyRequest",
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid",
      "required": true
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/mfa/recovery-code/verify' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/mfa/verify`
- Operation ID: `mfa_verify_auth_mfa_verify_post`
- Summary: Mfa Verify
- Full URL template: `https://<host>/auth/mfa/verify`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MFAVerifyRequest",
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid",
      "required": true
    },
    "method": {
      "type": "string",
      "title": "Method",
      "required": true
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/mfa/verify' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/policies/{policyKey}/mode`
- Operation ID: `set_policy_mode_auth_policies__policyKey__mode_post`
- Summary: Set Policy Mode
- Full URL template: `https://<host>/auth/policies/{policyKey}/mode`
- Authentication: Header `x-ontiver-admin-token` required (admin control-plane endpoint).
- Path parameters:
  - `policyKey`: `{"type": "string", "title": "Policykey"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "PolicyModeUpdateRequest",
  "properties": {
    "mode": {
      "type": "string",
      "title": "Mode",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/policies/{policyKey}/mode' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/refresh`
- Operation ID: `refresh_auth_refresh_post`
- Summary: Refresh
- Full URL template: `https://<host>/auth/refresh`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "RefreshRequest",
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/refresh' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/reset-password`
- Operation ID: `reset_password_auth_reset_password_post`
- Summary: Reset Password
- Full URL template: `https://<host>/auth/reset-password`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ResetPasswordRequest",
  "properties": {
    "token": {
      "type": "string",
      "title": "Token",
      "required": true
    },
    "newPassword": {
      "type": "string",
      "title": "Newpassword",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/reset-password' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/signup`
- Operation ID: `signup_auth_signup_post`
- Summary: Signup
- Full URL template: `https://<host>/auth/signup`
- Authentication: Public auth endpoint (no bearer token required).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SignupRequest",
  "properties": {
    "role": {
      "type": "string",
      "title": "Role",
      "required": true
    },
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    },
    "password": {
      "type": "string",
      "title": "Password",
      "required": true
    },
    "consentAccepted": {
      "type": "boolean",
      "title": "Consentaccepted",
      "required": true
    },
    "organizationName": {
      "title": "Organizationname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "contactName": {
      "title": "Contactname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "countryCode": {
      "title": "Countrycode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "registrationNumber": {
      "title": "Registrationnumber",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "verificationLicenseId": {
      "title": "Verificationlicenseid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "jurisdiction": {
      "title": "Jurisdiction",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fullName": {
      "title": "Fullname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "department": {
      "title": "Department",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "authorizationCode": {
      "title": "Authorizationcode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/signup' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /auth/step-up`
- Operation ID: `step_up_auth_step_up_post`
- Summary: Step Up
- Full URL template: `https://<host>/auth/step-up`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "StepUpRequest",
  "properties": {
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/auth/step-up' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/forgot-password`
- Operation ID: `segmented_forgot_password__role__auth_forgot_password_post`
- Summary: Segmented Forgot Password
- Full URL template: `https://<host>/{role}/auth/forgot-password`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ForgotPasswordRequest",
  "properties": {
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/forgot-password' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/login`
- Operation ID: `segmented_login__role__auth_login_post`
- Summary: Segmented Login
- Full URL template: `https://<host>/{role}/auth/login`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SegmentedLoginRequest",
  "properties": {
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    },
    "password": {
      "type": "string",
      "title": "Password",
      "required": true
    },
    "role": {
      "title": "Role",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "authKey": {
      "type": "string",
      "title": "Authkey",
      "required": true
    },
    "mfa": {
      "anyOf": [
        {
          "type": "object",
          "title": "LoginMFARequest",
          "properties": {
            "method": {
              "type": "string",
              "title": "Method",
              "required": true
            },
            "code": {
              "type": "string",
              "title": "Code",
              "required": true
            }
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/login' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/logout`
- Operation ID: `segmented_logout__role__auth_logout_post`
- Summary: Segmented Logout
- Full URL template: `https://<host>/{role}/auth/logout`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "LogoutRequest",
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken",
      "required": true
    },
    "allSessions": {
      "type": "boolean",
      "title": "Allsessions",
      "default": false
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/logout' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /{role}/auth/me`
- Operation ID: `segmented_me__role__auth_me_get`
- Summary: Segmented Me
- Full URL template: `https://<host>/{role}/auth/me`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/{role}/auth/me' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /{role}/auth/mfa/enroll`
- Operation ID: `segmented_mfa_enroll__role__auth_mfa_enroll_get`
- Summary: Segmented Mfa Enroll
- Full URL template: `https://<host>/{role}/auth/mfa/enroll`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/{role}/auth/mfa/enroll' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/mfa/enroll/verify`
- Operation ID: `segmented_mfa_enroll_verify__role__auth_mfa_enroll_verify_post`
- Summary: Segmented Mfa Enroll Verify
- Full URL template: `https://<host>/{role}/auth/mfa/enroll/verify`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - `authorization`: `{"title": "Authorization", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MFAEnrollVerifyRequest",
  "properties": {
    "method": {
      "type": "string",
      "title": "Method",
      "default": "totp"
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/mfa/enroll/verify' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/mfa/recovery-code/verify`
- Operation ID: `segmented_mfa_recovery_code_verify__role__auth_mfa_recovery_code_verify_post`
- Summary: Segmented Mfa Recovery Code Verify
- Full URL template: `https://<host>/{role}/auth/mfa/recovery-code/verify`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MFARecoveryCodeVerifyRequest",
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid",
      "required": true
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/mfa/recovery-code/verify' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/mfa/verify`
- Operation ID: `segmented_mfa_verify__role__auth_mfa_verify_post`
- Summary: Segmented Mfa Verify
- Full URL template: `https://<host>/{role}/auth/mfa/verify`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MFAVerifyRequest",
  "properties": {
    "challengeId": {
      "type": "string",
      "title": "Challengeid",
      "required": true
    },
    "method": {
      "type": "string",
      "title": "Method",
      "required": true
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/mfa/verify' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/refresh`
- Operation ID: `segmented_refresh__role__auth_refresh_post`
- Summary: Segmented Refresh
- Full URL template: `https://<host>/{role}/auth/refresh`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "RefreshRequest",
  "properties": {
    "refreshToken": {
      "type": "string",
      "title": "Refreshtoken",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/refresh' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/reset-password`
- Operation ID: `segmented_reset_password__role__auth_reset_password_post`
- Summary: Segmented Reset Password
- Full URL template: `https://<host>/{role}/auth/reset-password`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ResetPasswordRequest",
  "properties": {
    "token": {
      "type": "string",
      "title": "Token",
      "required": true
    },
    "newPassword": {
      "type": "string",
      "title": "Newpassword",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/reset-password' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /{role}/auth/signup`
- Operation ID: `segmented_signup__role__auth_signup_post`
- Summary: Segmented Signup
- Full URL template: `https://<host>/{role}/auth/signup`
- Authentication: JWT access token in `Authorization: Bearer <access_token>` required.
- Path parameters:
  - `role`: `{"type": "string", "title": "Role"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SegmentedSignupRequest",
  "properties": {
    "role": {
      "title": "Role",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    },
    "password": {
      "type": "string",
      "title": "Password",
      "required": true
    },
    "consentAccepted": {
      "type": "boolean",
      "title": "Consentaccepted",
      "required": true
    },
    "organizationName": {
      "title": "Organizationname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "contactName": {
      "title": "Contactname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "countryCode": {
      "title": "Countrycode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "registrationNumber": {
      "title": "Registrationnumber",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "verificationLicenseId": {
      "title": "Verificationlicenseid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "jurisdiction": {
      "title": "Jurisdiction",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fullName": {
      "title": "Fullname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "department": {
      "title": "Department",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "authorizationCode": {
      "title": "Authorizationcode",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/{role}/auth/signup' \
  -H 'Content-Type: application/json'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

## Resource: banking

### `POST /api/v1/banking/account/instant-verify`
- Operation ID: `instant_verify_api_v1_banking_account_instant_verify_post`
- Summary: Instant Verify
- Full URL template: `https://<host>/api/v1/banking/account/instant-verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "InstantVerifyBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "publicToken": {
      "type": "string",
      "title": "Publictoken",
      "required": true
    },
    "accountHolderName": {
      "title": "Accountholdername",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/account/instant-verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/account/micro-deposits`
- Operation ID: `micro_deposits_api_v1_banking_account_micro_deposits_post`
- Summary: Micro Deposits
- Full URL template: `https://<host>/api/v1/banking/account/micro-deposits`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MicroDepositsBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "accountNumber": {
      "type": "string",
      "title": "Accountnumber",
      "required": true
    },
    "routingNumber": {
      "type": "string",
      "title": "Routingnumber",
      "required": true
    },
    "accountHolderName": {
      "type": "string",
      "title": "Accountholdername",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/account/micro-deposits' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/account/mono/exchange`
- Operation ID: `mono_exchange_api_v1_banking_account_mono_exchange_post`
- Summary: Mono Exchange
- Full URL template: `https://<host>/api/v1/banking/account/mono/exchange`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MonoExchangeBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "code": {
      "type": "string",
      "title": "Code",
      "required": true
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/account/mono/exchange' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/account/mono/{monoAccountId}/details`
- Operation ID: `mono_account_details_api_v1_banking_account_mono__monoAccountId__details_get`
- Summary: Mono Account Details
- Full URL template: `https://<host>/api/v1/banking/account/mono/{monoAccountId}/details`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:read`
- Path parameters:
  - `monoAccountId`: `{"type": "string", "title": "Monoaccountid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/account/mono/{monoAccountId}/details' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/account/mono/{monoAccountId}/identity`
- Operation ID: `mono_account_identity_api_v1_banking_account_mono__monoAccountId__identity_get`
- Summary: Mono Account Identity
- Full URL template: `https://<host>/api/v1/banking/account/mono/{monoAccountId}/identity`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:read`
- Path parameters:
  - `monoAccountId`: `{"type": "string", "title": "Monoaccountid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/account/mono/{monoAccountId}/identity' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/account/mono/{monoAccountId}/transactions`
- Operation ID: `mono_account_transactions_api_v1_banking_account_mono__monoAccountId__transactions_get`
- Summary: Mono Account Transactions
- Full URL template: `https://<host>/api/v1/banking/account/mono/{monoAccountId}/transactions`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:read`
- Path parameters:
  - `monoAccountId`: `{"type": "string", "title": "Monoaccountid"}`
- Query parameters:
  - `fromDate`: `{"title": "Fromdate", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `toDate`: `{"title": "Todate", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"title": "Page", "anyOf": [{"type": "integer"}, {"type": "null"}]}`
  - `limit`: `{"title": "Limit", "anyOf": [{"type": "integer"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/account/mono/{monoAccountId}/transactions' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/account/verify`
- Operation ID: `verify_account_api_v1_banking_account_verify_post`
- Summary: Verify Account
- Full URL template: `https://<host>/api/v1/banking/account/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `account:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "AccountVerifyBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "accountNumber": {
      "type": "string",
      "title": "Accountnumber",
      "required": true
    },
    "routingNumber": {
      "type": "string",
      "title": "Routingnumber",
      "required": true
    },
    "accountHolderName": {
      "type": "string",
      "title": "Accountholdername",
      "required": true
    },
    "verificationMethod": {
      "type": "string",
      "title": "Verificationmethod",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/account/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/alerts`
- Operation ID: `admin_alerts_api_v1_banking_admin_alerts_get`
- Summary: Admin Alerts
- Full URL template: `https://<host>/api/v1/banking/admin/alerts`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `severity`: `{"title": "Severity", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `type`: `{"title": "Type", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `read`: `{"title": "Read", "anyOf": [{"type": "boolean"}, {"type": "null"}]}`
  - `sort`: `{"type": "string", "title": "Sort", "default": "createdAt:desc"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/alerts' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/content`
- Operation ID: `admin_content_api_v1_banking_admin_content_get`
- Summary: Admin Content
- Full URL template: `https://<host>/api/v1/banking/admin/content`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/content' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/admin/content/{contentId}/moderate`
- Operation ID: `moderate_content_api_v1_banking_admin_content__contentId__moderate_post`
- Summary: Moderate Content
- Full URL template: `https://<host>/api/v1/banking/admin/content/{contentId}/moderate`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write`
- Path parameters:
  - `contentId`: `{"type": "string", "title": "Contentid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ModerationActionBody",
  "properties": {
    "action": {
      "type": "string",
      "title": "Action",
      "required": true
    },
    "reason": {
      "title": "Reason",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/admin/content/{contentId}/moderate' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/credentials`
- Operation ID: `admin_credentials_api_v1_banking_admin_credentials_get`
- Summary: Admin Credentials
- Full URL template: `https://<host>/api/v1/banking/admin/credentials`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/credentials' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/credentials/{credentialId}`
- Operation ID: `admin_credential_detail_api_v1_banking_admin_credentials__credentialId__get`
- Summary: Admin Credential Detail
- Full URL template: `https://<host>/api/v1/banking/admin/credentials/{credentialId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - `credentialId`: `{"type": "string", "title": "Credentialid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/credentials/{credentialId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/enterprises`
- Operation ID: `admin_enterprises_api_v1_banking_admin_enterprises_get`
- Summary: Admin Enterprises
- Full URL template: `https://<host>/api/v1/banking/admin/enterprises`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/enterprises' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/enterprises/{tenantId}`
- Operation ID: `admin_enterprise_detail_api_v1_banking_admin_enterprises__tenantId__get`
- Summary: Admin Enterprise Detail
- Full URL template: `https://<host>/api/v1/banking/admin/enterprises/{tenantId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - `tenantId`: `{"type": "string", "title": "Tenantid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/enterprises/{tenantId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/admin/enterprises/{tenantId}`
- Operation ID: `patch_enterprise_api_v1_banking_admin_enterprises__tenantId__patch`
- Summary: Patch Enterprise
- Full URL template: `https://<host>/api/v1/banking/admin/enterprises/{tenantId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write`
- Path parameters:
  - `tenantId`: `{"type": "string", "title": "Tenantid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "EnterprisePatchBody",
  "properties": {
    "status": {
      "type": "string",
      "title": "Status",
      "required": true
    },
    "contactEmail": {
      "title": "Contactemail",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/admin/enterprises/{tenantId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/financial`
- Operation ID: `admin_financial_api_v1_banking_admin_financial_get`
- Summary: Admin Financial
- Full URL template: `https://<host>/api/v1/banking/admin/financial`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/financial' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/financial/revenue`
- Operation ID: `admin_financial_revenue_api_v1_banking_admin_financial_revenue_get`
- Summary: Admin Financial Revenue
- Full URL template: `https://<host>/api/v1/banking/admin/financial/revenue`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/financial/revenue' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/logs`
- Operation ID: `admin_logs_api_v1_banking_admin_logs_get`
- Summary: Admin Logs
- Full URL template: `https://<host>/api/v1/banking/admin/logs`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `level`: `{"title": "Level", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 50}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/logs' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/system-health`
- Operation ID: `admin_system_health_api_v1_banking_admin_system_health_get`
- Summary: Admin System Health
- Full URL template: `https://<host>/api/v1/banking/admin/system-health`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `includeComponents`: `{"type": "boolean", "title": "Includecomponents", "default": true}`
  - `environment`: `{"title": "Environment", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/system-health' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/users`
- Operation ID: `admin_users_api_v1_banking_admin_users_get`
- Summary: Admin Users
- Full URL template: `https://<host>/api/v1/banking/admin/users`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/users' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/verifications`
- Operation ID: `admin_verifications_api_v1_banking_admin_verifications_get`
- Summary: Admin Verifications
- Full URL template: `https://<host>/api/v1/banking/admin/verifications`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifications' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/verifications/{verificationId}`
- Operation ID: `admin_verification_detail_api_v1_banking_admin_verifications__verificationId__get`
- Summary: Admin Verification Detail
- Full URL template: `https://<host>/api/v1/banking/admin/verifications/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifications/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/verifiers`
- Operation ID: `admin_verifiers_api_v1_banking_admin_verifiers_get`
- Summary: Admin Verifiers
- Full URL template: `https://<host>/api/v1/banking/admin/verifiers`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifiers' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/admin/verifiers/{id}`
- Operation ID: `admin_verifier_detail_api_v1_banking_admin_verifiers__id__get`
- Summary: Admin Verifier Detail
- Full URL template: `https://<host>/api/v1/banking/admin/verifiers/{id}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - `id`: `{"type": "string", "title": "Id"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/admin/verifiers/{id}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/alerts`
- Operation ID: `list_alerts_api_v1_banking_alerts_get`
- Summary: List Alerts
- Full URL template: `https://<host>/api/v1/banking/alerts`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `alerts:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/alerts' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/alerts/{alertId}`
- Operation ID: `get_alert_api_v1_banking_alerts__alertId__get`
- Summary: Get Alert
- Full URL template: `https://<host>/api/v1/banking/alerts/{alertId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `alerts:read`
- Path parameters:
  - `alertId`: `{"type": "string", "title": "Alertid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/alerts/{alertId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/alerts/{alertId}/investigate`
- Operation ID: `investigate_alert_api_v1_banking_alerts__alertId__investigate_post`
- Summary: Investigate Alert
- Full URL template: `https://<host>/api/v1/banking/alerts/{alertId}/investigate`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `alerts:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `alertId`: `{"type": "string", "title": "Alertid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "AlertInvestigateBody",
  "properties": {
    "analyst": {
      "title": "Analyst",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/alerts/{alertId}/investigate' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/alerts/{alertId}/resolve`
- Operation ID: `resolve_alert_api_v1_banking_alerts__alertId__resolve_post`
- Summary: Resolve Alert
- Full URL template: `https://<host>/api/v1/banking/alerts/{alertId}/resolve`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `alerts:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `alertId`: `{"type": "string", "title": "Alertid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "AlertResolveBody",
  "properties": {
    "resolution": {
      "type": "string",
      "title": "Resolution",
      "required": true
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/alerts/{alertId}/resolve' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/aml/risk-score`
- Operation ID: `risk_score_api_v1_banking_aml_risk_score_post`
- Summary: Risk Score
- Full URL template: `https://<host>/api/v1/banking/aml/risk-score`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `aml:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "RiskScoreBody",
  "properties": {
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "customerProfile": {
      "type": "object",
      "title": "Customerprofile"
    },
    "verificationResults": {
      "title": "Verificationresults",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "transactionProfile": {
      "title": "Transactionprofile",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "relationshipFactors": {
      "title": "Relationshipfactors",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "customerData": {
      "title": "Customerdata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/aml/risk-score' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/aml/transaction-monitoring`
- Operation ID: `transaction_monitoring_api_v1_banking_aml_transaction_monitoring_post`
- Summary: Transaction Monitoring
- Full URL template: `https://<host>/api/v1/banking/aml/transaction-monitoring`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `aml:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "TransactionMonitoringBody",
  "properties": {
    "transactionId": {
      "type": "string",
      "title": "Transactionid",
      "required": true
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "amount": {
      "title": "Amount",
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ]
    },
    "currency": {
      "title": "Currency",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "senderId": {
      "title": "Senderid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "receiverId": {
      "title": "Receiverid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "timestamp": {
      "title": "Timestamp",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "transaction": {
      "type": "object",
      "title": "Transaction"
    },
    "customerRiskProfile": {
      "type": "object",
      "title": "Customerriskprofile"
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/aml/transaction-monitoring' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics`
- Operation ID: `analytics_overview_api_v1_banking_analytics_get`
- Summary: Analytics Overview
- Full URL template: `https://<host>/api/v1/banking/analytics`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `analytics:read`
- Path parameters:
  - None
- Query parameters:
  - `timeRange`: `{"type": "string", "title": "Timerange", "default": "30d"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/compliance-metrics`
- Operation ID: `compliance_metrics_api_v1_banking_analytics_compliance_metrics_get`
- Summary: Compliance Metrics
- Full URL template: `https://<host>/api/v1/banking/analytics/compliance-metrics`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `analytics:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/compliance-metrics' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/fraud-trends`
- Operation ID: `fraud_trends_api_v1_banking_analytics_fraud_trends_get`
- Summary: Fraud Trends
- Full URL template: `https://<host>/api/v1/banking/analytics/fraud-trends`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `analytics:read`
- Path parameters:
  - None
- Query parameters:
  - `startDate`: `{"title": "Startdate", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `endDate`: `{"title": "Enddate", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `groupBy`: `{"type": "string", "title": "Groupby", "default": "month"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/fraud-trends' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/geographic-distribution`
- Operation ID: `geographic_distribution_alias_api_v1_banking_analytics_geographic_distribution_get`
- Summary: Geographic Distribution Alias
- Full URL template: `https://<host>/api/v1/banking/analytics/geographic-distribution`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/geographic-distribution' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/geographical`
- Operation ID: `geographical_distribution_api_v1_banking_analytics_geographical_get`
- Summary: Geographical Distribution
- Full URL template: `https://<host>/api/v1/banking/analytics/geographical`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/geographical' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/processing-times`
- Operation ID: `processing_times_api_v1_banking_analytics_processing_times_get`
- Summary: Processing Times
- Full URL template: `https://<host>/api/v1/banking/analytics/processing-times`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `analytics:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/processing-times' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/risk-distribution`
- Operation ID: `risk_distribution_api_v1_banking_analytics_risk_distribution_get`
- Summary: Risk Distribution
- Full URL template: `https://<host>/api/v1/banking/analytics/risk-distribution`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `analytics:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/risk-distribution' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/analytics/verification-stats`
- Operation ID: `verification_stats_api_v1_banking_analytics_verification_stats_get`
- Summary: Verification Stats
- Full URL template: `https://<host>/api/v1/banking/analytics/verification-stats`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - `startDate`: `{"title": "Startdate", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `endDate`: `{"title": "Enddate", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `groupBy`: `{"type": "string", "title": "Groupby", "default": "month"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/analytics/verification-stats' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/api-keys`
- Operation ID: `list_api_keys_api_v1_banking_api_keys_get`
- Summary: List Api Keys
- Full URL template: `https://<host>/api/v1/banking/api-keys`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `api_keys:read`
- Path parameters:
  - None
- Query parameters:
  - `environment`: `{"title": "Environment", "anyOf": [{"type": "string", "enum": ["production", "sandbox"]}, {"type": "null"}]}`
  - `includeRevoked`: `{"type": "boolean", "title": "Includerevoked", "default": false}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/api-keys' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/api-keys/create`
- Operation ID: `create_api_key_api_v1_banking_api_keys_create_post`
- Summary: Create Api Key
- Full URL template: `https://<host>/api/v1/banking/api-keys/create`
- Authentication: Header `x-ontiver-admin-token` required (admin control-plane endpoint).
- Required permissions (code-level): `api_keys:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ApiKeyCreateBody",
  "properties": {
    "keyName": {
      "title": "Keyname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "permissions": {
      "type": "array",
      "title": "Permissions",
      "items": {
        "type": "string"
      }
    },
    "scopes": {
      "type": "array",
      "title": "Scopes",
      "items": {
        "type": "string"
      }
    },
    "environment": {
      "type": "string",
      "title": "Environment",
      "enum": [
        "production",
        "sandbox"
      ],
      "default": "production"
    },
    "expiresAt": {
      "title": "Expiresat",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "ipWhitelist": {
      "title": "Ipwhitelist",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "rateLimit": {
      "title": "Ratelimit",
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/api-keys/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/api-keys/validate/current`
- Operation ID: `validate_current_api_key_api_v1_banking_api_keys_validate_current_get`
- Summary: Validate Current Api Key
- Full URL template: `https://<host>/api/v1/banking/api-keys/validate/current`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/api-keys/validate/current' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `DELETE /api/v1/banking/api-keys/{keyId}`
- Operation ID: `revoke_api_key_api_v1_banking_api_keys__keyId__delete`
- Summary: Revoke Api Key
- Full URL template: `https://<host>/api/v1/banking/api-keys/{keyId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `api_keys:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `keyId`: `{"type": "string", "title": "Keyid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X DELETE 'https://<host>/api/v1/banking/api-keys/{keyId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/api/settings`
- Operation ID: `get_api_settings_api_v1_banking_api_settings_get`
- Summary: Get Api Settings
- Full URL template: `https://<host>/api/v1/banking/api/settings`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `api_settings:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/api/settings' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/api/settings`
- Operation ID: `patch_api_settings_api_v1_banking_api_settings_patch`
- Summary: Patch Api Settings
- Full URL template: `https://<host>/api/v1/banking/api/settings`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `api_settings:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ApiSettingsPatchBody",
  "properties": {
    "autoRotateSecrets": {
      "type": "boolean",
      "title": "Autorotatesecrets",
      "required": true
    },
    "ipWhitelistEnabled": {
      "type": "boolean",
      "title": "Ipwhitelistenabled",
      "required": true
    },
    "allowedIps": {
      "type": "array",
      "title": "Allowedips",
      "items": {
        "type": "string"
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/api/settings' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/audit/customer/{customerId}`
- Operation ID: `audit_by_customer_api_v1_banking_audit_customer__customerId__get`
- Summary: Audit By Customer
- Full URL template: `https://<host>/api/v1/banking/audit/customer/{customerId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `audit:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/customer/{customerId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/audit/export`
- Operation ID: `audit_export_api_v1_banking_audit_export_post`
- Summary: Audit Export
- Full URL template: `https://<host>/api/v1/banking/audit/export`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `audit:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "AuditExportBody",
  "properties": {
    "startDate": {
      "title": "Startdate",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "endDate": {
      "title": "Enddate",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "format": {
      "type": "string",
      "title": "Format",
      "default": "json"
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/audit/export' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/audit/logs`
- Operation ID: `list_audit_logs_api_v1_banking_audit_logs_get`
- Summary: List Audit Logs
- Full URL template: `https://<host>/api/v1/banking/audit/logs`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `audit:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `actorId`: `{"title": "Actorid", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `action`: `{"title": "Action", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `from`: `{"title": "From", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `to`: `{"title": "To", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/logs' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/audit/logs/search`
- Operation ID: `search_audit_logs_api_v1_banking_audit_logs_search_get`
- Summary: Search Audit Logs
- Full URL template: `https://<host>/api/v1/banking/audit/logs/search`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `audit:read`
- Path parameters:
  - None
- Query parameters:
  - `from`: `{"title": "From", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `to`: `{"title": "To", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `entity`: `{"title": "Entity", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `eventType`: `{"title": "Eventtype", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/logs/search' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/audit/verification/{verificationId}`
- Operation ID: `audit_by_verification_api_v1_banking_audit_verification__verificationId__get`
- Summary: Audit By Verification
- Full URL template: `https://<host>/api/v1/banking/audit/verification/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `audit:read`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/audit/verification/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/billing/checkout/session`
- Operation ID: `create_checkout_session_api_v1_banking_billing_checkout_session_post`
- Summary: Create Checkout Session
- Full URL template: `https://<host>/api/v1/banking/billing/checkout/session`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `license:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CheckoutSessionBody",
  "properties": {
    "targetPlan": {
      "type": "string",
      "title": "Targetplan",
      "required": true
    },
    "billingInterval": {
      "type": "string",
      "title": "Billinginterval",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/billing/checkout/session' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/billing/plans`
- Operation ID: `billing_plans_api_v1_banking_billing_plans_get`
- Summary: Billing Plans
- Full URL template: `https://<host>/api/v1/banking/billing/plans`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/billing/plans' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/billing/webhooks/provider`
- Operation ID: `billing_provider_webhook_api_v1_banking_billing_webhooks_provider_post`
- Summary: Billing Provider Webhook
- Full URL template: `https://<host>/api/v1/banking/billing/webhooks/provider`
- Authentication: Bearer token in `Authorization` header required (`Bearer <api_key|access_token|service_token>`).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - `x-provider-signature`: `{"title": "X-Provider-Signature", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "BillingWebhookEvent",
  "properties": {
    "provider": {
      "type": "string",
      "title": "Provider",
      "default": "stripe"
    },
    "eventId": {
      "type": "string",
      "title": "Eventid",
      "required": true
    },
    "status": {
      "type": "string",
      "title": "Status",
      "required": true
    },
    "checkoutSessionId": {
      "type": "string",
      "title": "Checkoutsessionid",
      "required": true
    },
    "targetPlan": {
      "title": "Targetplan",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/billing/webhooks/provider' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/biometrics/behavioral`
- Operation ID: `behavioral_biometrics_api_v1_banking_biometrics_behavioral_post`
- Summary: Behavioral Biometrics
- Full URL template: `https://<host>/api/v1/banking/biometrics/behavioral`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `biometrics:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "BehavioralBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "signals": {
      "type": "object",
      "title": "Signals",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/behavioral' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/biometrics/face-match`
- Operation ID: `face_match_api_v1_banking_biometrics_face_match_post`
- Summary: Face Match
- Full URL template: `https://<host>/api/v1/banking/biometrics/face-match`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `biometrics:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "FaceMatchBody",
  "properties": {
    "selfieImage": {
      "type": "string",
      "title": "Selfieimage",
      "required": true
    },
    "idPhotoImage": {
      "title": "Idphotoimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "documentImage": {
      "title": "Documentimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "threshold": {
      "title": "Threshold",
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/face-match' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/biometrics/fingerprint`
- Operation ID: `fingerprint_verification_api_v1_banking_biometrics_fingerprint_post`
- Summary: Fingerprint Verification
- Full URL template: `https://<host>/api/v1/banking/biometrics/fingerprint`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `biometrics:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "FingerprintBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "fingerprintTemplate": {
      "type": "string",
      "title": "Fingerprinttemplate",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/fingerprint' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/biometrics/liveness`
- Operation ID: `liveness_api_v1_banking_biometrics_liveness_post`
- Summary: Liveness
- Full URL template: `https://<host>/api/v1/banking/biometrics/liveness`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `biometrics:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "LivenessBody",
  "properties": {
    "selfieImage": {
      "title": "Selfieimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "videoUrl": {
      "title": "Videourl",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "livenessType": {
      "type": "string",
      "title": "Livenesstype",
      "default": "passive"
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/liveness' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/biometrics/voice-verification`
- Operation ID: `voice_verification_api_v1_banking_biometrics_voice_verification_post`
- Summary: Voice Verification
- Full URL template: `https://<host>/api/v1/banking/biometrics/voice-verification`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `biometrics:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "VoiceVerificationBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "voiceSample": {
      "type": "string",
      "title": "Voicesample",
      "required": true
    },
    "phrase": {
      "title": "Phrase",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/biometrics/voice-verification' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/blockchain/anchor`
- Operation ID: `anchor_verification_api_v1_banking_blockchain_anchor_post`
- Summary: Anchor Verification
- Full URL template: `https://<host>/api/v1/banking/blockchain/anchor`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `blockchain:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "BlockchainAnchorBody",
  "properties": {
    "verificationId": {
      "type": "string",
      "title": "Verificationid",
      "required": true
    },
    "chain": {
      "type": "string",
      "title": "Chain",
      "default": "ethereum"
    },
    "anchorData": {
      "type": "object",
      "title": "Anchordata",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/blockchain/anchor' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/blockchain/proof`
- Operation ID: `get_anchor_proof_api_v1_banking_blockchain_proof_post`
- Summary: Get Anchor Proof
- Full URL template: `https://<host>/api/v1/banking/blockchain/proof`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `blockchain:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "BlockchainProofBody",
  "properties": {
    "anchorId": {
      "type": "string",
      "title": "Anchorid",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/blockchain/proof' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/blockchain/proof/{verificationId}`
- Operation ID: `get_proof_by_verification_api_v1_banking_blockchain_proof__verificationId__get`
- Summary: Get Proof By Verification
- Full URL template: `https://<host>/api/v1/banking/blockchain/proof/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `blockchain:read`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/blockchain/proof/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/bulk/verify`
- Operation ID: `bulk_verify_api_v1_banking_bulk_verify_post`
- Summary: Bulk Verify
- Full URL template: `https://<host>/api/v1/banking/bulk/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/bulk/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/cases`
- Operation ID: `list_cases_api_v1_banking_cases_get`
- Summary: List Cases
- Full URL template: `https://<host>/api/v1/banking/cases`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `cases:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `assignedTo`: `{"title": "Assignedto", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `caseType`: `{"title": "Casetype", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 100}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/cases' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/cases/create`
- Operation ID: `create_case_api_v1_banking_cases_create_post`
- Summary: Create Case
- Full URL template: `https://<host>/api/v1/banking/cases/create`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `cases:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CaseCreateBody",
  "properties": {
    "caseType": {
      "type": "string",
      "title": "Casetype",
      "required": true
    },
    "title": {
      "title": "Title",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "description": {
      "title": "Description",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "priority": {
      "title": "Priority",
      "default": "medium",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "entityType": {
      "title": "Entitytype",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "entityId": {
      "title": "Entityid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "alertId": {
      "title": "Alertid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "assignedTo": {
      "title": "Assignedto",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/cases/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/cases/{caseId}`
- Operation ID: `get_case_api_v1_banking_cases__caseId__get`
- Summary: Get Case
- Full URL template: `https://<host>/api/v1/banking/cases/{caseId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `cases:read`
- Path parameters:
  - `caseId`: `{"type": "string", "title": "Caseid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/cases/{caseId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/cases/{caseId}`
- Operation ID: `update_case_api_v1_banking_cases__caseId__patch`
- Summary: Update Case
- Full URL template: `https://<host>/api/v1/banking/cases/{caseId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `cases:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `caseId`: `{"type": "string", "title": "Caseid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CaseUpdateBody",
  "properties": {
    "title": {
      "title": "Title",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "description": {
      "title": "Description",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "priority": {
      "title": "Priority",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "status": {
      "title": "Status",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/cases/{caseId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/cases/{caseId}/assign`
- Operation ID: `assign_case_api_v1_banking_cases__caseId__assign_post`
- Summary: Assign Case
- Full URL template: `https://<host>/api/v1/banking/cases/{caseId}/assign`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `cases:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `caseId`: `{"type": "string", "title": "Caseid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CaseAssignBody",
  "properties": {
    "analyst": {
      "type": "string",
      "title": "Analyst",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/cases/{caseId}/assign' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/cases/{caseId}/close`
- Operation ID: `close_case_api_v1_banking_cases__caseId__close_post`
- Summary: Close Case
- Full URL template: `https://<host>/api/v1/banking/cases/{caseId}/close`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `cases:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `caseId`: `{"type": "string", "title": "Caseid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CaseCloseBody",
  "properties": {
    "resolution": {
      "title": "Resolution",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/cases/{caseId}/close' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/compliance/ctr/create`
- Operation ID: `ctr_create_api_v1_banking_compliance_ctr_create_post`
- Summary: Ctr Create
- Full URL template: `https://<host>/api/v1/banking/compliance/ctr/create`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `compliance:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CtrCreateBody",
  "properties": {
    "requestId": {
      "type": "string",
      "title": "Requestid",
      "required": true
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "transaction": {
      "type": "object",
      "title": "Transaction",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/ctr/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/compliance/reports`
- Operation ID: `list_compliance_reports_api_v1_banking_compliance_reports_get`
- Summary: List Compliance Reports
- Full URL template: `https://<host>/api/v1/banking/compliance/reports`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `compliance:read`
- Path parameters:
  - None
- Query parameters:
  - `kind`: `{"title": "Kind", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/compliance/reports' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/compliance/reports/schedule`
- Operation ID: `schedule_compliance_report_api_v1_banking_compliance_reports_schedule_post`
- Summary: Schedule Compliance Report
- Full URL template: `https://<host>/api/v1/banking/compliance/reports/schedule`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `compliance:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ComplianceReportScheduleBody",
  "properties": {
    "reportType": {
      "type": "string",
      "title": "Reporttype",
      "required": true
    },
    "cron": {
      "type": "string",
      "title": "Cron",
      "required": true
    },
    "params": {
      "title": "Params",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/reports/schedule' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/compliance/sar/create`
- Operation ID: `sar_create_api_v1_banking_compliance_sar_create_post`
- Summary: Sar Create
- Full URL template: `https://<host>/api/v1/banking/compliance/sar/create`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `compliance:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SarCreateBody",
  "properties": {
    "requestId": {
      "type": "string",
      "title": "Requestid",
      "required": true
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "narrative": {
      "type": "string",
      "title": "Narrative",
      "required": true
    },
    "activity": {
      "type": "object",
      "title": "Activity",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/sar/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/compliance/sar/submit`
- Operation ID: `sar_submit_api_v1_banking_compliance_sar_submit_post`
- Summary: Sar Submit
- Full URL template: `https://<host>/api/v1/banking/compliance/sar/submit`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `compliance:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SarSubmitBody",
  "properties": {
    "reportId": {
      "type": "string",
      "title": "Reportid",
      "required": true
    },
    "submissionChannel": {
      "title": "Submissionchannel",
      "default": "electronic",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/compliance/sar/submit' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/credit/check`
- Operation ID: `credit_check_api_v1_banking_credit_check_post`
- Summary: Credit Check
- Full URL template: `https://<host>/api/v1/banking/credit/check`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `credit:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CreditCheckBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "personalInfo": {
      "type": "object",
      "title": "Personalinfo",
      "required": true
    },
    "address": {
      "type": "object",
      "title": "Address",
      "required": true
    },
    "purpose": {
      "type": "string",
      "title": "Purpose",
      "required": true
    },
    "bureaus": {
      "type": "array",
      "title": "Bureaus",
      "items": {
        "type": "string"
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/credit/check' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/credit/score`
- Operation ID: `credit_score_api_v1_banking_credit_score_post`
- Summary: Credit Score
- Full URL template: `https://<host>/api/v1/banking/credit/score`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `credit:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CreditScoreBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "bureaus": {
      "type": "array",
      "title": "Bureaus",
      "items": {
        "type": "string"
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/credit/score' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/diagnostics/requests`
- Operation ID: `list_request_diagnostics_api_v1_banking_diagnostics_requests_get`
- Summary: List Request Diagnostics
- Full URL template: `https://<host>/api/v1/banking/diagnostics/requests`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `diagnostics:read`
- Path parameters:
  - None
- Query parameters:
  - `limit`: `{"type": "integer", "title": "Limit", "default": 50}`
  - `cursor`: `{"title": "Cursor", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `from`: `{"title": "From", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `to`: `{"title": "To", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `stage`: `{"title": "Stage", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `requestId`: `{"title": "Requestid", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/diagnostics/requests' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/diagnostics/requests/{requestId}/cancel`
- Operation ID: `cancel_request_retry_api_v1_banking_diagnostics_requests__requestId__cancel_post`
- Summary: Cancel Request Retry
- Full URL template: `https://<host>/api/v1/banking/diagnostics/requests/{requestId}/cancel`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `diagnostics:cancel`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `requestId`: `{"type": "string", "title": "Requestid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CancelRequestBody",
  "properties": {
    "message": {
      "title": "Message",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/diagnostics/requests/{requestId}/cancel' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/diagnostics/requests/{requestId}/retry`
- Operation ID: `retry_request_api_v1_banking_diagnostics_requests__requestId__retry_post`
- Summary: Retry Request
- Full URL template: `https://<host>/api/v1/banking/diagnostics/requests/{requestId}/retry`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `diagnostics:retry`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `requestId`: `{"type": "string", "title": "Requestid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "RetryRequestBody",
  "properties": {
    "retryInMs": {
      "type": "integer",
      "title": "Retryinms",
      "default": 0
    },
    "message": {
      "title": "Message",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/diagnostics/requests/{requestId}/retry' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/did/create`
- Operation ID: `create_did_api_v1_banking_did_create_post`
- Summary: Create Did
- Full URL template: `https://<host>/api/v1/banking/did/create`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DidCreateBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "method": {
      "type": "string",
      "title": "Method",
      "default": "key"
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/did/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/did/credentials/customer/{customerId}`
- Operation ID: `list_credentials_api_v1_banking_did_credentials_customer__customerId__get`
- Summary: List Credentials
- Full URL template: `https://<host>/api/v1/banking/did/credentials/customer/{customerId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/did/credentials/customer/{customerId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/did/credentials/issue`
- Operation ID: `issue_credential_api_v1_banking_did_credentials_issue_post`
- Summary: Issue Credential
- Full URL template: `https://<host>/api/v1/banking/did/credentials/issue`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CredentialIssueBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "verificationId": {
      "title": "Verificationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "did": {
      "title": "Did",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "credentialType": {
      "type": "string",
      "title": "Credentialtype",
      "default": "KYC"
    },
    "schema": {
      "title": "Schema",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "claims": {
      "title": "Claims",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "expiresAt": {
      "title": "Expiresat",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/did/credentials/issue' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/did/credentials/present`
- Operation ID: `present_credential_api_v1_banking_did_credentials_present_post`
- Summary: Present Credential
- Full URL template: `https://<host>/api/v1/banking/did/credentials/present`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CredentialPresentBody",
  "properties": {
    "credentialId": {
      "type": "string",
      "title": "Credentialid",
      "required": true
    },
    "challenge": {
      "type": "string",
      "title": "Challenge",
      "required": true
    },
    "verifier": {
      "title": "Verifier",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/did/credentials/present' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/did/credentials/verify`
- Operation ID: `verify_credential_api_v1_banking_did_credentials_verify_post`
- Summary: Verify Credential
- Full URL template: `https://<host>/api/v1/banking/did/credentials/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CredentialVerifyBody",
  "properties": {
    "presentationId": {
      "title": "Presentationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "presentation": {
      "title": "Presentation",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "challenge": {
      "title": "Challenge",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/did/credentials/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/did/credentials/{credentialId}`
- Operation ID: `get_credential_api_v1_banking_did_credentials__credentialId__get`
- Summary: Get Credential
- Full URL template: `https://<host>/api/v1/banking/did/credentials/{credentialId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:read`
- Path parameters:
  - `credentialId`: `{"type": "string", "title": "Credentialid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/did/credentials/{credentialId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/did/verify`
- Operation ID: `verify_did_api_v1_banking_did_verify_post`
- Summary: Verify Did
- Full URL template: `https://<host>/api/v1/banking/did/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DidVerifyBody",
  "properties": {
    "did": {
      "type": "string",
      "title": "Did",
      "required": true
    },
    "challenge": {
      "type": "string",
      "title": "Challenge",
      "required": true
    },
    "signature": {
      "type": "string",
      "title": "Signature",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/did/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/did/{customerId}`
- Operation ID: `get_did_api_v1_banking_did__customerId__get`
- Summary: Get Did
- Full URL template: `https://<host>/api/v1/banking/did/{customerId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/did/{customerId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/disputes`
- Operation ID: `list_disputes_api_v1_banking_disputes_get`
- Summary: List Disputes
- Full URL template: `https://<host>/api/v1/banking/disputes`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `priority`: `{"title": "Priority", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/disputes' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/disputes/{disputeId}`
- Operation ID: `get_dispute_api_v1_banking_disputes__disputeId__get`
- Summary: Get Dispute
- Full URL template: `https://<host>/api/v1/banking/disputes/{disputeId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - `disputeId`: `{"type": "string", "title": "Disputeid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/disputes/{disputeId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/disputes/{disputeId}/resolve`
- Operation ID: `resolve_dispute_api_v1_banking_disputes__disputeId__resolve_post`
- Summary: Resolve Dispute
- Full URL template: `https://<host>/api/v1/banking/disputes/{disputeId}/resolve`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write`
- Path parameters:
  - `disputeId`: `{"type": "string", "title": "Disputeid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DisputeResolveBody",
  "properties": {
    "resolution": {
      "type": "string",
      "title": "Resolution",
      "required": true
    },
    "notes": {
      "type": "string",
      "title": "Notes",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/disputes/{disputeId}/resolve' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/documents/classify`
- Operation ID: `classify_document_api_v1_banking_documents_classify_post`
- Summary: Classify Document
- Full URL template: `https://<host>/api/v1/banking/documents/classify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `documents:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DocumentClassifyBody",
  "properties": {
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "required": true
    },
    "documentBackImage": {
      "title": "Documentbackimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "language": {
      "title": "Language",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/classify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/documents/compare`
- Operation ID: `compare_documents_api_v1_banking_documents_compare_post`
- Summary: Compare Documents
- Full URL template: `https://<host>/api/v1/banking/documents/compare`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `documents:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DocumentCompareBody",
  "properties": {
    "documents": {
      "type": "array",
      "title": "Documents",
      "items": {
        "type": "object",
        "title": "DocumentCompareItem",
        "properties": {
          "documentType": {
            "title": "Documenttype",
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "documentImage": {
            "type": "string",
            "title": "Documentimage",
            "required": true
          },
          "documentBackImage": {
            "title": "Documentbackimage",
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "expectedData": {
            "title": "Expecteddata",
            "anyOf": [
              {
                "type": "object"
              },
              {
                "type": "null"
              }
            ]
          },
          "useOcr": {
            "title": "Useocr",
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ]
          }
        }
      },
      "required": true
    },
    "fieldsToCompare": {
      "title": "Fieldstocompare",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "useOcr": {
      "title": "Useocr",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/compare' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/documents/extract`
- Operation ID: `extract_document_api_v1_banking_documents_extract_post`
- Summary: Extract Document
- Full URL template: `https://<host>/api/v1/banking/documents/extract`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `documents:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DocumentExtractBody",
  "properties": {
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "required": true
    },
    "documentType": {
      "title": "Documenttype",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "language": {
      "title": "Language",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/extract' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/documents/supported-types`
- Operation ID: `supported_types_api_v1_banking_documents_supported_types_get`
- Summary: Supported Types
- Full URL template: `https://<host>/api/v1/banking/documents/supported-types`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `documents:read`
- Path parameters:
  - None
- Query parameters:
  - `country`: `{"title": "Country", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/documents/supported-types' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/documents/verify`
- Operation ID: `verify_document_api_v1_banking_documents_verify_post`
- Summary: Verify Document
- Full URL template: `https://<host>/api/v1/banking/documents/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `documents:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DocumentVerifyBody",
  "properties": {
    "documentType": {
      "type": "string",
      "title": "Documenttype",
      "required": true
    },
    "documentImage": {
      "type": "string",
      "title": "Documentimage",
      "required": true
    },
    "documentBackImage": {
      "title": "Documentbackimage",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "issuingCountry": {
      "title": "Issuingcountry",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "expectedData": {
      "title": "Expecteddata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "useOcr": {
      "title": "Useocr",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/documents/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/governance/proposals`
- Operation ID: `list_governance_proposals_api_v1_banking_governance_proposals_get`
- Summary: List Governance Proposals
- Full URL template: `https://<host>/api/v1/banking/governance/proposals`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/governance/proposals' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/governance/proposals`
- Operation ID: `create_governance_proposal_api_v1_banking_governance_proposals_post`
- Summary: Create Governance Proposal
- Full URL template: `https://<host>/api/v1/banking/governance/proposals`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "GovernanceProposalBody",
  "properties": {
    "title": {
      "type": "string",
      "title": "Title",
      "required": true
    },
    "summary": {
      "type": "string",
      "title": "Summary",
      "required": true
    },
    "changes": {
      "type": "array",
      "title": "Changes",
      "items": {
        "type": "object"
      }
    },
    "votingEndsAt": {
      "type": "string",
      "title": "Votingendsat",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/governance/proposals' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/governance/proposals/{proposalId}`
- Operation ID: `get_governance_proposal_api_v1_banking_governance_proposals__proposalId__get`
- Summary: Get Governance Proposal
- Full URL template: `https://<host>/api/v1/banking/governance/proposals/{proposalId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read`
- Path parameters:
  - `proposalId`: `{"type": "string", "title": "Proposalid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/governance/proposals/{proposalId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/health`
- Operation ID: `health_api_v1_banking_health_get`
- Summary: Health
- Full URL template: `https://<host>/api/v1/banking/health`
- Authentication: Bearer token in `Authorization` header required (`Bearer <api_key|access_token|service_token>`).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/health' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyb/business/directors`
- Operation ID: `kyb_business_directors_api_v1_banking_kyb_business_directors_post`
- Summary: Kyb Business Directors
- Full URL template: `https://<host>/api/v1/banking/kyb/business/directors`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyb:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "KybDirectorsBody",
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref",
          "required": true
        },
        "name": {
          "type": "string",
          "title": "Name",
          "required": true
        },
        "country": {
          "type": "string",
          "title": "Country",
          "required": true
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": true
    },
    "directors": {
      "type": "array",
      "title": "Directors",
      "items": {
        "type": "object"
      },
      "required": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/directors' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyb/business/financial-health`
- Operation ID: `kyb_financial_health_api_v1_banking_kyb_business_financial_health_post`
- Summary: Kyb Financial Health
- Full URL template: `https://<host>/api/v1/banking/kyb/business/financial-health`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyb:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "KybFinancialHealthBody",
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref",
          "required": true
        },
        "name": {
          "type": "string",
          "title": "Name",
          "required": true
        },
        "country": {
          "type": "string",
          "title": "Country",
          "required": true
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": true
    },
    "financials": {
      "type": "object",
      "title": "Financials",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/financial-health' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyb/business/ownership`
- Operation ID: `kyb_business_ownership_api_v1_banking_kyb_business_ownership_post`
- Summary: Kyb Business Ownership
- Full URL template: `https://<host>/api/v1/banking/kyb/business/ownership`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyb:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "KybOwnershipBody",
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref",
          "required": true
        },
        "name": {
          "type": "string",
          "title": "Name",
          "required": true
        },
        "country": {
          "type": "string",
          "title": "Country",
          "required": true
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": true
    },
    "uboList": {
      "type": "array",
      "title": "Ubolist",
      "items": {
        "type": "object"
      },
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/ownership' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyb/business/registry-check`
- Operation ID: `kyb_registry_check_api_v1_banking_kyb_business_registry_check_post`
- Summary: Kyb Registry Check
- Full URL template: `https://<host>/api/v1/banking/kyb/business/registry-check`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyb:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "KybRegistryCheckBody",
  "properties": {
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref",
          "required": true
        },
        "name": {
          "type": "string",
          "title": "Name",
          "required": true
        },
        "country": {
          "type": "string",
          "title": "Country",
          "required": true
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/registry-check' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyb/business/verify`
- Operation ID: `kyb_business_verify_api_v1_banking_kyb_business_verify_post`
- Summary: Kyb Business Verify
- Full URL template: `https://<host>/api/v1/banking/kyb/business/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyb:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "KybVerifyBody",
  "properties": {
    "requestId": {
      "type": "string",
      "title": "Requestid",
      "required": true
    },
    "business": {
      "type": "object",
      "title": "BusinessInfo",
      "properties": {
        "businessRef": {
          "type": "string",
          "title": "Businessref",
          "required": true
        },
        "name": {
          "type": "string",
          "title": "Name",
          "required": true
        },
        "country": {
          "type": "string",
          "title": "Country",
          "required": true
        },
        "registrationNumber": {
          "title": "Registrationnumber",
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "address": {
          "title": "Address",
          "anyOf": [
            {
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": true
    },
    "uboList": {
      "title": "Ubolist",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "callbackUrl": {
      "title": "Callbackurl",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyb/business/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyc/individual/basic`
- Operation ID: `kyc_individual_basic_api_v1_banking_kyc_individual_basic_post`
- Summary: Kyc Individual Basic
- Full URL template: `https://<host>/api/v1/banking/kyc/individual/basic`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/basic' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyc/individual/batch`
- Operation ID: `kyc_individual_batch_api_v1_banking_kyc_individual_batch_post`
- Summary: Kyc Individual Batch
- Full URL template: `https://<host>/api/v1/banking/kyc/individual/batch`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/batch' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyc/individual/enhanced`
- Operation ID: `kyc_individual_enhanced_api_v1_banking_kyc_individual_enhanced_post`
- Summary: Kyc Individual Enhanced
- Full URL template: `https://<host>/api/v1/banking/kyc/individual/enhanced`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/enhanced' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyc/individual/verify`
- Operation ID: `kyc_individual_verify_api_v1_banking_kyc_individual_verify_post`
- Summary: Kyc Individual Verify
- Full URL template: `https://<host>/api/v1/banking/kyc/individual/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/kyc/individual/{verificationId}`
- Operation ID: `get_kyc_status_api_v1_banking_kyc_individual__verificationId__get`
- Summary: Get Kyc Status
- Full URL template: `https://<host>/api/v1/banking/kyc/individual/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:read`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/kyc/individual/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/kyc/individual/{verificationId}/refresh`
- Operation ID: `kyc_individual_refresh_api_v1_banking_kyc_individual__verificationId__refresh_post`
- Summary: Kyc Individual Refresh
- Full URL template: `https://<host>/api/v1/banking/kyc/individual/{verificationId}/refresh`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/kyc/individual/{verificationId}/refresh' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/license/plan/change`
- Operation ID: `change_license_plan_api_v1_banking_license_plan_change_post`
- Summary: Change License Plan
- Full URL template: `https://<host>/api/v1/banking/license/plan/change`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `license:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "LicensePlanChangeBody",
  "properties": {
    "targetPlan": {
      "type": "string",
      "title": "Targetplan",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/license/plan/change' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/license/usage`
- Operation ID: `license_usage_api_v1_banking_license_usage_get`
- Summary: License Usage
- Full URL template: `https://<host>/api/v1/banking/license/usage`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `license:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/license/usage' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/localization/currency-convert`
- Operation ID: `currency_convert_api_v1_banking_localization_currency_convert_post`
- Summary: Currency Convert
- Full URL template: `https://<host>/api/v1/banking/localization/currency-convert`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `localization:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CurrencyConvertBody",
  "properties": {
    "fromCurrency": {
      "type": "string",
      "title": "Fromcurrency",
      "required": true
    },
    "toCurrency": {
      "type": "string",
      "title": "Tocurrency",
      "required": true
    },
    "amount": {
      "type": "number",
      "title": "Amount",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/localization/currency-convert' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/localization/regulations/{country}`
- Operation ID: `regulations_api_v1_banking_localization_regulations__country__get`
- Summary: Regulations
- Full URL template: `https://<host>/api/v1/banking/localization/regulations/{country}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `localization:read`
- Path parameters:
  - `country`: `{"type": "string", "title": "Country"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/localization/regulations/{country}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/marketplace/verifiers`
- Operation ID: `marketplace_verifiers_api_v1_banking_marketplace_verifiers_get`
- Summary: Marketplace Verifiers
- Full URL template: `https://<host>/api/v1/banking/marketplace/verifiers`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - `search`: `{"title": "Search", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `service`: `{"title": "Service", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `rating`: `{"title": "Rating", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `sort`: `{"type": "string", "title": "Sort", "default": "rating:desc"}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/marketplace/verifiers' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/monitoring/rules`
- Operation ID: `list_rules_api_v1_banking_monitoring_rules_get`
- Summary: List Rules
- Full URL template: `https://<host>/api/v1/banking/monitoring/rules`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/monitoring/rules' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/monitoring/rules/create`
- Operation ID: `create_rule_api_v1_banking_monitoring_rules_create_post`
- Summary: Create Rule
- Full URL template: `https://<host>/api/v1/banking/monitoring/rules/create`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MonitoringRuleCreateBody",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "required": true
    },
    "rule": {
      "type": "object",
      "title": "Rule",
      "required": true
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/monitoring/rules/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `DELETE /api/v1/banking/monitoring/rules/{ruleId}`
- Operation ID: `delete_rule_api_v1_banking_monitoring_rules__ruleId__delete`
- Summary: Delete Rule
- Full URL template: `https://<host>/api/v1/banking/monitoring/rules/{ruleId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:write`
- Path parameters:
  - `ruleId`: `{"type": "string", "title": "Ruleid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X DELETE 'https://<host>/api/v1/banking/monitoring/rules/{ruleId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/monitoring/rules/{ruleId}`
- Operation ID: `update_rule_api_v1_banking_monitoring_rules__ruleId__patch`
- Summary: Update Rule
- Full URL template: `https://<host>/api/v1/banking/monitoring/rules/{ruleId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `ruleId`: `{"type": "string", "title": "Ruleid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "MonitoringRuleUpdateBody",
  "properties": {
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "rule": {
      "title": "Rule",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "active": {
      "title": "Active",
      "anyOf": [
        {
          "type": "boolean"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/monitoring/rules/{ruleId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/notifications`
- Operation ID: `notifications_api_v1_banking_notifications_get`
- Summary: Notifications
- Full URL template: `https://<host>/api/v1/banking/notifications`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `type`: `{"title": "Type", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `read`: `{"title": "Read", "anyOf": [{"type": "boolean"}, {"type": "null"}]}`
  - `sort`: `{"type": "string", "title": "Sort", "default": "createdAt:desc"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/notifications' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/notifications/mark-all-read`
- Operation ID: `mark_all_notifications_read_api_v1_banking_notifications_mark_all_read_post`
- Summary: Mark All Notifications Read
- Full URL template: `https://<host>/api/v1/banking/notifications/mark-all-read`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/notifications/mark-all-read' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/notifications/{notificationId}/read`
- Operation ID: `mark_notification_read_api_v1_banking_notifications__notificationId__read_patch`
- Summary: Mark Notification Read
- Full URL template: `https://<host>/api/v1/banking/notifications/{notificationId}/read`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - `notificationId`: `{"type": "string", "title": "Notificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/notifications/{notificationId}/read' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/onboarding/bulk/errors/{validationId}`
- Operation ID: `onboarding_bulk_errors_api_v1_banking_onboarding_bulk_errors__validationId__get`
- Summary: Onboarding Bulk Errors
- Full URL template: `https://<host>/api/v1/banking/onboarding/bulk/errors/{validationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:read`
- Path parameters:
  - `validationId`: `{"type": "string", "title": "Validationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/onboarding/bulk/errors/{validationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/onboarding/bulk/import`
- Operation ID: `onboarding_bulk_import_api_v1_banking_onboarding_bulk_import_post`
- Summary: Onboarding Bulk Import
- Full URL template: `https://<host>/api/v1/banking/onboarding/bulk/import`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "BulkOnboardingBody",
  "properties": {
    "items": {
      "type": "array",
      "title": "Items",
      "items": {
        "type": "object"
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/onboarding/bulk/import' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/onboarding/bulk/validate`
- Operation ID: `onboarding_bulk_validate_api_v1_banking_onboarding_bulk_validate_post`
- Summary: Onboarding Bulk Validate
- Full URL template: `https://<host>/api/v1/banking/onboarding/bulk/validate`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `kyc:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "BulkOnboardingBody",
  "properties": {
    "items": {
      "type": "array",
      "title": "Items",
      "items": {
        "type": "object"
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/onboarding/bulk/validate' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/ongoing/disable`
- Operation ID: `disable_monitoring_api_v1_banking_ongoing_disable_post`
- Summary: Disable Monitoring
- Full URL template: `https://<host>/api/v1/banking/ongoing/disable`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "OngoingDisableBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "monitoringType": {
      "type": "string",
      "title": "Monitoringtype",
      "default": "kyc"
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/ongoing/disable' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/ongoing/due-reviews`
- Operation ID: `due_reviews_api_v1_banking_ongoing_due_reviews_get`
- Summary: Due Reviews
- Full URL template: `https://<host>/api/v1/banking/ongoing/due-reviews`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:read`
- Path parameters:
  - None
- Query parameters:
  - `limit`: `{"type": "integer", "title": "Limit", "default": 50}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/ongoing/due-reviews' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/ongoing/enable`
- Operation ID: `enable_monitoring_api_v1_banking_ongoing_enable_post`
- Summary: Enable Monitoring
- Full URL template: `https://<host>/api/v1/banking/ongoing/enable`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "OngoingEnableBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "monitoringType": {
      "type": "string",
      "title": "Monitoringtype",
      "default": "kyc"
    },
    "frequencyDays": {
      "title": "Frequencydays",
      "default": 30,
      "anyOf": [
        {
          "type": "integer"
        },
        {
          "type": "null"
        }
      ]
    },
    "nextReviewAt": {
      "title": "Nextreviewat",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "callbackUrl": {
      "title": "Callbackurl",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/ongoing/enable' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/ongoing/{customerId}/changes`
- Operation ID: `monitoring_changes_api_v1_banking_ongoing__customerId__changes_get`
- Summary: Monitoring Changes
- Full URL template: `https://<host>/api/v1/banking/ongoing/{customerId}/changes`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - `limit`: `{"type": "integer", "title": "Limit", "default": 50}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/ongoing/{customerId}/changes' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/ongoing/{customerId}/status`
- Operation ID: `monitoring_status_api_v1_banking_ongoing__customerId__status_get`
- Summary: Monitoring Status
- Full URL template: `https://<host>/api/v1/banking/ongoing/{customerId}/status`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `monitoring:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/ongoing/{customerId}/status' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/privacy/consent/record`
- Operation ID: `record_consent_api_v1_banking_privacy_consent_record_post`
- Summary: Record Consent
- Full URL template: `https://<host>/api/v1/banking/privacy/consent/record`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `privacy:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ConsentRecordBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "consentType": {
      "type": "string",
      "title": "Consenttype",
      "required": true
    },
    "granted": {
      "type": "boolean",
      "title": "Granted",
      "required": true
    },
    "metadata": {
      "title": "Metadata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/privacy/consent/record' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/privacy/consent/{customerId}`
- Operation ID: `get_consent_api_v1_banking_privacy_consent__customerId__get`
- Summary: Get Consent
- Full URL template: `https://<host>/api/v1/banking/privacy/consent/{customerId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `privacy:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/privacy/consent/{customerId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/privacy/data-deletion`
- Operation ID: `data_deletion_api_v1_banking_privacy_data_deletion_post`
- Summary: Data Deletion
- Full URL template: `https://<host>/api/v1/banking/privacy/data-deletion`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `privacy:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DataDeletionBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "reason": {
      "title": "Reason",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/privacy/data-deletion' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/privacy/data-export`
- Operation ID: `data_export_api_v1_banking_privacy_data_export_post`
- Summary: Data Export
- Full URL template: `https://<host>/api/v1/banking/privacy/data-export`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `privacy:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DataExportBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "reason": {
      "title": "Reason",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/privacy/data-export' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/reports`
- Operation ID: `list_reports_api_v1_banking_reports_get`
- Summary: List Reports
- Full URL template: `https://<host>/api/v1/banking/reports`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/reports' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/reports/create`
- Operation ID: `create_report_api_v1_banking_reports_create_post`
- Summary: Create Report
- Full URL template: `https://<host>/api/v1/banking/reports/create`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `reports:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ReportCreateBody",
  "properties": {
    "reportType": {
      "title": "Reporttype",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "type": {
      "title": "Type",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dateRange": {
      "type": "object",
      "title": "Daterange",
      "required": true
    },
    "filters": {
      "title": "Filters",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "format": {
      "type": "string",
      "title": "Format",
      "default": "csv"
    },
    "includeCharts": {
      "type": "boolean",
      "title": "Includecharts",
      "default": false
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/reports/create' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/reports/{reportId}`
- Operation ID: `get_report_api_v1_banking_reports__reportId__get`
- Summary: Get Report
- Full URL template: `https://<host>/api/v1/banking/reports/{reportId}`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - `reportId`: `{"type": "string", "title": "Reportid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/reports/{reportId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/requests`
- Operation ID: `verification_requests_api_v1_banking_requests_get`
- Summary: Verification Requests
- Full URL template: `https://<host>/api/v1/banking/requests`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `type`: `{"title": "Type", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `assigneeId`: `{"title": "Assigneeid", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `sort`: `{"type": "string", "title": "Sort", "default": "updatedAt:desc"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/requests' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/requests/{verificationId}/review`
- Operation ID: `review_verification_request_api_v1_banking_requests__verificationId__review_post`
- Summary: Review Verification Request
- Full URL template: `https://<host>/api/v1/banking/requests/{verificationId}/review`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write, kyc:write, verification:review`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/requests/{verificationId}/review' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/requests/{verificationId}/revoke`
- Operation ID: `revoke_verification_request_api_v1_banking_requests__verificationId__revoke_post`
- Summary: Revoke Verification Request
- Full URL template: `https://<host>/api/v1/banking/requests/{verificationId}/revoke`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write, kyc:write, verification:review`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "Body"
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/requests/{verificationId}/revoke' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/risk/sandbox/report`
- Operation ID: `risk_sandbox_report_api_v1_banking_risk_sandbox_report_post`
- Summary: Risk Sandbox Report
- Full URL template: `https://<host>/api/v1/banking/risk/sandbox/report`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `sandbox:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/risk/sandbox/report' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/risk/sandbox/simulate`
- Operation ID: `risk_sandbox_simulate_api_v1_banking_risk_sandbox_simulate_post`
- Summary: Risk Sandbox Simulate
- Full URL template: `https://<host>/api/v1/banking/risk/sandbox/simulate`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `sandbox:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "RiskSandboxBody",
  "properties": {
    "customerProfile": {
      "type": "object",
      "title": "Customerprofile"
    },
    "weights": {
      "type": "object",
      "title": "Weights"
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/risk/sandbox/simulate' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/sandbox/generate-test-data`
- Operation ID: `generate_test_data_api_v1_banking_sandbox_generate_test_data_post`
- Summary: Generate Test Data
- Full URL template: `https://<host>/api/v1/banking/sandbox/generate-test-data`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `sandbox:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SandboxGenerateBody",
  "properties": {
    "scenario": {
      "type": "string",
      "title": "Scenario",
      "required": true
    },
    "count": {
      "type": "integer",
      "title": "Count",
      "default": 5
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/sandbox/generate-test-data' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/adverse-media/check`
- Operation ID: `adverse_media_check_api_v1_banking_screening_adverse_media_check_post`
- Summary: Adverse Media Check
- Full URL template: `https://<host>/api/v1/banking/screening/adverse-media/check`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "AdverseMediaBody",
  "properties": {
    "firstName": {
      "type": "string",
      "title": "Firstname",
      "required": true
    },
    "lastName": {
      "type": "string",
      "title": "Lastname",
      "required": true
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/adverse-media/check' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/adverse-media/ongoing`
- Operation ID: `adverse_media_ongoing_api_v1_banking_screening_adverse_media_ongoing_post`
- Summary: Adverse Media Ongoing
- Full URL template: `https://<host>/api/v1/banking/screening/adverse-media/ongoing`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "OngoingBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/adverse-media/ongoing' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/pep/check`
- Operation ID: `pep_check_api_v1_banking_screening_pep_check_post`
- Summary: Pep Check
- Full URL template: `https://<host>/api/v1/banking/screening/pep/check`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "PepCheckBody",
  "properties": {
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "firstName": {
      "title": "Firstname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "lastName": {
      "title": "Lastname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dateOfBirth": {
      "title": "Dateofbirth",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dob": {
      "title": "Dob",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "nationality": {
      "title": "Nationality",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "country": {
      "title": "Country",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/pep/check' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/pep/family-associates`
- Operation ID: `pep_family_associates_api_v1_banking_screening_pep_family_associates_post`
- Summary: Pep Family Associates
- Full URL template: `https://<host>/api/v1/banking/screening/pep/family-associates`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "PepFamilyBody",
  "properties": {
    "firstName": {
      "type": "string",
      "title": "Firstname",
      "required": true
    },
    "lastName": {
      "type": "string",
      "title": "Lastname",
      "required": true
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/pep/family-associates' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/pep/ongoing`
- Operation ID: `pep_ongoing_api_v1_banking_screening_pep_ongoing_post`
- Summary: Pep Ongoing
- Full URL template: `https://<host>/api/v1/banking/screening/pep/ongoing`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "OngoingBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/pep/ongoing' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/sanctions/check`
- Operation ID: `sanctions_check_api_v1_banking_screening_sanctions_check_post`
- Summary: Sanctions Check
- Full URL template: `https://<host>/api/v1/banking/screening/sanctions/check`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SanctionsCheckBody",
  "properties": {
    "name": {
      "title": "Name",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "firstName": {
      "title": "Firstname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "lastName": {
      "title": "Lastname",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dateOfBirth": {
      "title": "Dateofbirth",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "dob": {
      "title": "Dob",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "nationality": {
      "title": "Nationality",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "country": {
      "title": "Country",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "fuzzyMatching": {
      "type": "boolean",
      "title": "Fuzzymatching",
      "default": true
    },
    "matchThreshold": {
      "type": "integer",
      "title": "Matchthreshold",
      "default": 90
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/sanctions/check' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/screening/sanctions/lists`
- Operation ID: `sanctions_lists_api_v1_banking_screening_sanctions_lists_get`
- Summary: Sanctions Lists
- Full URL template: `https://<host>/api/v1/banking/screening/sanctions/lists`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/screening/sanctions/lists' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/sanctions/ongoing`
- Operation ID: `sanctions_ongoing_api_v1_banking_screening_sanctions_ongoing_post`
- Summary: Sanctions Ongoing
- Full URL template: `https://<host>/api/v1/banking/screening/sanctions/ongoing`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `screening:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "OngoingBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/sanctions/ongoing' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/screening/{screeningType}/ongoing`
- Operation ID: `screening_ongoing_api_v1_banking_screening__screeningType__ongoing_post`
- Summary: Screening Ongoing
- Full URL template: `https://<host>/api/v1/banking/screening/{screeningType}/ongoing`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - `screeningType`: `{"type": "string", "title": "Screeningtype"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "OngoingBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/screening/{screeningType}/ongoing' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/settings/company`
- Operation ID: `get_company_settings_api_v1_banking_settings_company_get`
- Summary: Get Company Settings
- Full URL template: `https://<host>/api/v1/banking/settings/company`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `settings:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/settings/company' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/settings/company`
- Operation ID: `patch_company_settings_api_v1_banking_settings_company_patch`
- Summary: Patch Company Settings
- Full URL template: `https://<host>/api/v1/banking/settings/company`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `settings:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "CompanySettingsPatchBody",
  "properties": {
    "companyName": {
      "type": "string",
      "title": "Companyname",
      "required": true
    },
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    },
    "industry": {
      "title": "Industry",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "website": {
      "title": "Website",
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "null"
        }
      ]
    },
    "taxId": {
      "title": "Taxid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "phone": {
      "title": "Phone",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "address": {
      "title": "Address",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "notifications": {
      "title": "Notifications",
      "anyOf": [
        {
          "type": "object",
          "additionalProperties": {
            "type": "boolean"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "security": {
      "title": "Security",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/settings/company' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/settings/company/logo`
- Operation ID: `upload_company_logo_api_v1_banking_settings_company_logo_post`
- Summary: Upload Company Logo
- Full URL template: `https://<host>/api/v1/banking/settings/company/logo`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `settings:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_upload_company_logo_api_v1_banking_settings_company_logo_post",
  "properties": {
    "file": {
      "type": "string",
      "title": "File",
      "format": "binary",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/settings/company/logo' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/source-of-funds/analyze`
- Operation ID: `analyze_source_of_funds_api_v1_banking_source_of_funds_analyze_post`
- Summary: Analyze Source Of Funds
- Full URL template: `https://<host>/api/v1/banking/source-of-funds/analyze`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `source_of_funds:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SourceOfFundsAnalyzeBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "lookbackDays": {
      "type": "integer",
      "title": "Lookbackdays",
      "default": 90
    },
    "transactions": {
      "title": "Transactions",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/source-of-funds/analyze' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/source-of-funds/verify`
- Operation ID: `verify_source_of_funds_api_v1_banking_source_of_funds_verify_post`
- Summary: Verify Source Of Funds
- Full URL template: `https://<host>/api/v1/banking/source-of-funds/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `source_of_funds:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SourceOfFundsVerifyBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "transactionId": {
      "title": "Transactionid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "amount": {
      "type": "number",
      "title": "Amount",
      "required": true
    },
    "claimedSource": {
      "type": "string",
      "title": "Claimedsource",
      "required": true
    },
    "supportingDocuments": {
      "type": "array",
      "title": "Supportingdocuments",
      "items": {
        "type": "object",
        "title": "SupportingDocument",
        "properties": {
          "type": {
            "type": "string",
            "title": "Type",
            "required": true
          },
          "fileUrl": {
            "type": "string",
            "title": "Fileurl",
            "required": true
          }
        }
      }
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/source-of-funds/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/source-of-wealth/verify`
- Operation ID: `verify_source_of_wealth_api_v1_banking_source_of_wealth_verify_post`
- Summary: Verify Source Of Wealth
- Full URL template: `https://<host>/api/v1/banking/source-of-wealth/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `source_of_wealth:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "SourceOfWealthVerifyBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "declaredSources": {
      "type": "array",
      "title": "Declaredsources",
      "items": {
        "type": "string"
      }
    },
    "supportingDocuments": {
      "title": "Supportingdocuments",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/source-of-wealth/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/source-of-wealth/{customerId}/assessment`
- Operation ID: `get_source_of_wealth_assessment_api_v1_banking_source_of_wealth__customerId__assessment_get`
- Summary: Get Source Of Wealth Assessment
- Full URL template: `https://<host>/api/v1/banking/source-of-wealth/{customerId}/assessment`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `source_of_wealth:read`
- Path parameters:
  - `customerId`: `{"type": "string", "title": "Customerid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/source-of-wealth/{customerId}/assessment' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/team/invitations`
- Operation ID: `create_team_invitation_api_v1_banking_team_invitations_post`
- Summary: Create Team Invitation
- Full URL template: `https://<host>/api/v1/banking/team/invitations`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `team:invite`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "TeamInviteBody",
  "properties": {
    "email": {
      "type": "string",
      "title": "Email",
      "required": true
    },
    "role": {
      "type": "string",
      "title": "Role",
      "required": true
    },
    "message": {
      "title": "Message",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/team/invitations' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/team/invitations/accept`
- Operation ID: `accept_team_invitation_api_v1_banking_team_invitations_accept_post`
- Summary: Accept Team Invitation
- Full URL template: `https://<host>/api/v1/banking/team/invitations/accept`
- Authentication: Bearer token in `Authorization` header required (`Bearer <api_key|access_token|service_token>`).
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "InvitationAcceptBody",
  "properties": {
    "token": {
      "type": "string",
      "title": "Token",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/team/invitations/accept' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/team/invitations/{invitationId}/resend`
- Operation ID: `resend_team_invitation_api_v1_banking_team_invitations__invitationId__resend_post`
- Summary: Resend Team Invitation
- Full URL template: `https://<host>/api/v1/banking/team/invitations/{invitationId}/resend`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `team:invite`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `invitationId`: `{"type": "string", "title": "Invitationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/team/invitations/{invitationId}/resend' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/transactions/screen`
- Operation ID: `transaction_screen_api_v1_banking_transactions_screen_post`
- Summary: Transaction Screen
- Full URL template: `https://<host>/api/v1/banking/transactions/screen`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `transactions:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "TransactionScreenBody",
  "properties": {
    "transactionId": {
      "type": "string",
      "title": "Transactionid",
      "required": true
    },
    "customerId": {
      "title": "Customerid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "transaction": {
      "type": "object",
      "title": "Transaction",
      "required": true
    },
    "customerRiskProfile": {
      "title": "Customerriskprofile",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "rules": {
      "title": "Rules",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/transactions/screen' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/translation/document`
- Operation ID: `translate_document_api_v1_banking_translation_document_post`
- Summary: Translate Document
- Full URL template: `https://<host>/api/v1/banking/translation/document`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `translation:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "DocumentTranslationBody",
  "properties": {
    "documentText": {
      "type": "string",
      "title": "Documenttext",
      "required": true
    },
    "sourceLang": {
      "type": "string",
      "title": "Sourcelang",
      "required": true
    },
    "targetLang": {
      "type": "string",
      "title": "Targetlang",
      "required": true
    },
    "format": {
      "title": "Format",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/translation/document' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/translation/text`
- Operation ID: `translate_text_api_v1_banking_translation_text_post`
- Summary: Translate Text
- Full URL template: `https://<host>/api/v1/banking/translation/text`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `translation:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "TextTranslationBody",
  "properties": {
    "text": {
      "type": "string",
      "title": "Text",
      "required": true
    },
    "sourceLang": {
      "type": "string",
      "title": "Sourcelang",
      "required": true
    },
    "targetLang": {
      "type": "string",
      "title": "Targetlang",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/translation/text' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/user/verifications`
- Operation ID: `user_verifications_api_v1_banking_user_verifications_get`
- Summary: User Verifications
- Full URL template: `https://<host>/api/v1/banking/user/verifications`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `sort`: `{"type": "string", "title": "Sort", "default": "updatedAt:desc"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/user/verifications' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/user/wallet`
- Operation ID: `user_wallet_api_v1_banking_user_wallet_get`
- Summary: User Wallet
- Full URL template: `https://<host>/api/v1/banking/user/wallet`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/user/wallet' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/active`
- Operation ID: `verifier_active_api_v1_banking_verifier_active_get`
- Summary: Verifier Active
- Full URL template: `https://<host>/api/v1/banking/verifier/active`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/active' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/completed`
- Operation ID: `verifier_completed_api_v1_banking_verifier_completed_get`
- Summary: Verifier Completed
- Full URL template: `https://<host>/api/v1/banking/verifier/completed`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/completed' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/earnings`
- Operation ID: `verifier_earnings_api_v1_banking_verifier_earnings_get`
- Summary: Verifier Earnings
- Full URL template: `https://<host>/api/v1/banking/verifier/earnings`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/earnings' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/help`
- Operation ID: `verifier_help_api_v1_banking_verifier_help_get`
- Summary: Verifier Help
- Full URL template: `https://<host>/api/v1/banking/verifier/help`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/help' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/help/articles`
- Operation ID: `verifier_help_articles_api_v1_banking_verifier_help_articles_get`
- Summary: Verifier Help Articles
- Full URL template: `https://<host>/api/v1/banking/verifier/help/articles`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/help/articles' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/help/tickets`
- Operation ID: `list_help_tickets_api_v1_banking_verifier_help_tickets_get`
- Summary: List Help Tickets
- Full URL template: `https://<host>/api/v1/banking/verifier/help/tickets`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/help/tickets' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/verifier/help/tickets`
- Operation ID: `create_help_ticket_api_v1_banking_verifier_help_tickets_post`
- Summary: Create Help Ticket
- Full URL template: `https://<host>/api/v1/banking/verifier/help/tickets`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:write, verification:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "HelpTicketBody",
  "properties": {
    "subject": {
      "type": "string",
      "title": "Subject",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/help/tickets' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/verifier/issue-credential`
- Operation ID: `verifier_issue_credential_api_v1_banking_verifier_issue_credential_post`
- Summary: Verifier Issue Credential
- Full URL template: `https://<host>/api/v1/banking/verifier/issue-credential`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `did:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "VerifierIssueCredentialBody",
  "properties": {
    "verificationId": {
      "type": "string",
      "title": "Verificationid",
      "required": true
    },
    "recipientDid": {
      "type": "string",
      "title": "Recipientdid",
      "required": true
    },
    "credentialType": {
      "type": "string",
      "title": "Credentialtype",
      "required": true
    },
    "data": {
      "type": "object",
      "title": "Data"
    },
    "notes": {
      "title": "Notes",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `201`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/issue-credential' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 201,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/jobs`
- Operation ID: `verifier_jobs_api_v1_banking_verifier_jobs_get`
- Summary: Verifier Jobs
- Full URL template: `https://<host>/api/v1/banking/verifier/jobs`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - `status`: `{"title": "Status", "anyOf": [{"type": "string"}, {"type": "null"}]}`
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/jobs' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/jobs/{verificationId}`
- Operation ID: `verifier_job_detail_api_v1_banking_verifier_jobs__verificationId__get`
- Summary: Verifier Job Detail
- Full URL template: `https://<host>/api/v1/banking/verifier/jobs/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, verification:read`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/jobs/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/notifications`
- Operation ID: `verifier_notifications_api_v1_banking_verifier_notifications_get`
- Summary: Verifier Notifications
- Full URL template: `https://<host>/api/v1/banking/verifier/notifications`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `admin:read, kyc:read, verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/notifications' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/profile`
- Operation ID: `verifier_profile_api_v1_banking_verifier_profile_get`
- Summary: Verifier Profile
- Full URL template: `https://<host>/api/v1/banking/verifier/profile`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/profile' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `PATCH /api/v1/banking/verifier/profile`
- Operation ID: `patch_verifier_profile_api_v1_banking_verifier_profile_patch`
- Summary: Patch Verifier Profile
- Full URL template: `https://<host>/api/v1/banking/verifier/profile`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "VerifierProfilePatchBody",
  "properties": {
    "title": {
      "title": "Title",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "description": {
      "title": "Description",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "website": {
      "title": "Website",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "location": {
      "title": "Location",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "languages": {
      "title": "Languages",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "specializations": {
      "title": "Specializations",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X PATCH 'https://<host>/api/v1/banking/verifier/profile' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/reputation`
- Operation ID: `verifier_reputation_api_v1_banking_verifier_reputation_get`
- Summary: Verifier Reputation
- Full URL template: `https://<host>/api/v1/banking/verifier/reputation`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/reputation' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/review/{verificationId}`
- Operation ID: `verifier_review_detail_api_v1_banking_verifier_review__verificationId__get`
- Summary: Verifier Review Detail
- Full URL template: `https://<host>/api/v1/banking/verifier/review/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/review/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/reviews`
- Operation ID: `verifier_reviews_api_v1_banking_verifier_reviews_get`
- Summary: Verifier Reviews
- Full URL template: `https://<host>/api/v1/banking/verifier/reviews`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:read`
- Path parameters:
  - None
- Query parameters:
  - `page`: `{"type": "integer", "title": "Page", "default": 1}`
  - `limit`: `{"type": "integer", "title": "Limit", "default": 20}`
  - `rating`: `{"title": "Rating", "anyOf": [{"type": "integer"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/reviews' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/verifier/staking`
- Operation ID: `verifier_staking_api_v1_banking_verifier_staking_get`
- Summary: Verifier Staking
- Full URL template: `https://<host>/api/v1/banking/verifier/staking`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/verifier/staking' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/verifier/staking/actions`
- Operation ID: `verifier_staking_action_api_v1_banking_verifier_staking_actions_post`
- Summary: Verifier Staking Action
- Full URL template: `https://<host>/api/v1/banking/verifier/staking/actions`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "StakingActionBody",
  "properties": {
    "action": {
      "type": "string",
      "title": "Action",
      "required": true
    },
    "amount": {
      "type": "number",
      "title": "Amount",
      "default": 0
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/staking/actions' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/verifier/withdraw`
- Operation ID: `create_verifier_withdrawal_alias_api_v1_banking_verifier_withdraw_post`
- Summary: Create Verifier Withdrawal Alias
- Full URL template: `https://<host>/api/v1/banking/verifier/withdraw`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "WithdrawalBody",
  "properties": {
    "amount": {
      "type": "number",
      "title": "Amount",
      "required": true
    },
    "currency": {
      "type": "string",
      "title": "Currency",
      "default": "USD"
    },
    "destinationId": {
      "type": "string",
      "title": "Destinationid",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/withdraw' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/verifier/withdrawals`
- Operation ID: `create_verifier_withdrawal_api_v1_banking_verifier_withdrawals_post`
- Summary: Create Verifier Withdrawal
- Full URL template: `https://<host>/api/v1/banking/verifier/withdrawals`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `verification:write`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "WithdrawalBody",
  "properties": {
    "amount": {
      "type": "number",
      "title": "Amount",
      "required": true
    },
    "currency": {
      "type": "string",
      "title": "Currency",
      "default": "USD"
    },
    "destinationId": {
      "type": "string",
      "title": "Destinationid",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/verifier/withdrawals' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/watchlist`
- Operation ID: `list_watchlist_api_v1_banking_watchlist_get`
- Summary: List Watchlist
- Full URL template: `https://<host>/api/v1/banking/watchlist`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `watchlist:read`
- Path parameters:
  - None
- Query parameters:
  - `riskLevel`: `{"title": "Risklevel", "anyOf": [{"type": "string"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/watchlist' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/watchlist/add`
- Operation ID: `add_watchlist_api_v1_banking_watchlist_add_post`
- Summary: Add Watchlist
- Full URL template: `https://<host>/api/v1/banking/watchlist/add`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `watchlist:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "WatchlistAddBody",
  "properties": {
    "customerId": {
      "type": "string",
      "title": "Customerid",
      "required": true
    },
    "reason": {
      "type": "string",
      "title": "Reason",
      "required": true
    },
    "riskLevel": {
      "type": "string",
      "title": "Risklevel",
      "default": "medium"
    },
    "sources": {
      "title": "Sources",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/watchlist/add' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/webhooks`
- Operation ID: `list_webhooks_api_v1_banking_webhooks_get`
- Summary: List Webhooks
- Full URL template: `https://<host>/api/v1/banking/webhooks`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `webhooks:read`
- Path parameters:
  - None
- Query parameters:
  - `active`: `{"title": "Active", "anyOf": [{"type": "boolean"}, {"type": "null"}]}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/webhooks' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/webhooks/register`
- Operation ID: `register_webhook_api_v1_banking_webhooks_register_post`
- Summary: Register Webhook
- Full URL template: `https://<host>/api/v1/banking/webhooks/register`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `webhooks:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "WebhookRegisterBody",
  "properties": {
    "webhookUrl": {
      "title": "Webhookurl",
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "null"
        }
      ]
    },
    "url": {
      "title": "Url",
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "null"
        }
      ]
    },
    "events": {
      "type": "array",
      "title": "Events",
      "items": {
        "type": "string"
      }
    },
    "secret": {
      "title": "Secret",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "active": {
      "type": "boolean",
      "title": "Active",
      "default": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/register' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/webhooks/retries`
- Operation ID: `webhook_retries_api_v1_banking_webhooks_retries_get`
- Summary: Webhook Retries
- Full URL template: `https://<host>/api/v1/banking/webhooks/retries`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `webhooks:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/webhooks/retries' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/webhooks/test`
- Operation ID: `test_webhook_api_v1_banking_webhooks_test_post`
- Summary: Test Webhook
- Full URL template: `https://<host>/api/v1/banking/webhooks/test`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `webhooks:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "WebhookTestBody",
  "properties": {
    "webhookId": {
      "title": "Webhookid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "webhookUrl": {
      "title": "Webhookurl",
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "null"
        }
      ]
    },
    "eventType": {
      "type": "string",
      "title": "Eventtype",
      "required": true
    },
    "payload": {
      "title": "Payload",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/test' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `DELETE /api/v1/banking/webhooks/{webhookId}`
- Operation ID: `delete_webhook_api_v1_banking_webhooks__webhookId__delete`
- Summary: Delete Webhook
- Full URL template: `https://<host>/api/v1/banking/webhooks/{webhookId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `webhooks:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `webhookId`: `{"type": "string", "title": "Webhookid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X DELETE 'https://<host>/api/v1/banking/webhooks/{webhookId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/webhooks/{webhookId}/rotate-secret`
- Operation ID: `rotate_webhook_secret_api_v1_banking_webhooks__webhookId__rotate_secret_post`
- Summary: Rotate Webhook Secret
- Full URL template: `https://<host>/api/v1/banking/webhooks/{webhookId}/rotate-secret`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `webhooks:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - `webhookId`: `{"type": "string", "title": "Webhookid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/{webhookId}/rotate-secret' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/webhooks/{webhookId}/test`
- Operation ID: `test_webhook_by_id_api_v1_banking_webhooks__webhookId__test_post`
- Summary: Test Webhook By Id
- Full URL template: `https://<host>/api/v1/banking/webhooks/{webhookId}/test`
- Authentication: OpenAPI security: HTTPBearer
- Path parameters:
  - `webhookId`: `{"type": "string", "title": "Webhookid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "WebhookTestBody",
  "properties": {
    "webhookId": {
      "title": "Webhookid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "webhookUrl": {
      "title": "Webhookurl",
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "null"
        }
      ]
    },
    "eventType": {
      "type": "string",
      "title": "Eventtype",
      "required": true
    },
    "payload": {
      "title": "Payload",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/webhooks/{webhookId}/test' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/zk-proof/circuits`
- Operation ID: `get_zk_circuits_api_v1_banking_zk_proof_circuits_get`
- Summary: Get Zk Circuits
- Full URL template: `https://<host>/api/v1/banking/zk-proof/circuits`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/zk-proof/circuits' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/zk-proof/disclose`
- Operation ID: `disclose_proof_api_v1_banking_zk_proof_disclose_post`
- Summary: Disclose Proof
- Full URL template: `https://<host>/api/v1/banking/zk-proof/disclose`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ZkDiscloseBody",
  "properties": {
    "proofId": {
      "type": "string",
      "title": "Proofid",
      "required": true
    },
    "fields": {
      "title": "Fields",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/disclose' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/zk-proof/generate`
- Operation ID: `generate_proof_api_v1_banking_zk_proof_generate_post`
- Summary: Generate Proof
- Full URL template: `https://<host>/api/v1/banking/zk-proof/generate`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ZkGenerateBody",
  "properties": {
    "proofType": {
      "type": "string",
      "title": "Prooftype",
      "required": true
    },
    "verificationId": {
      "title": "Verificationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "statement": {
      "type": "object",
      "title": "Statement",
      "required": true
    },
    "witness": {
      "title": "Witness",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "publicSignals": {
      "title": "Publicsignals",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "disclosureFields": {
      "title": "Disclosurefields",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/generate' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/zk-proof/noir/generate`
- Operation ID: `generate_noir_claim_api_v1_banking_zk_proof_noir_generate_post`
- Summary: Generate Noir Claim
- Full URL template: `https://<host>/api/v1/banking/zk-proof/noir/generate`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:write`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ZkNoirGenerateBody",
  "properties": {
    "circuitId": {
      "type": "string",
      "title": "Circuitid",
      "required": true
    },
    "verificationId": {
      "title": "Verificationid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "privateInputs": {
      "type": "object",
      "title": "Privateinputs",
      "required": true
    },
    "publicInputs": {
      "type": "object",
      "title": "Publicinputs",
      "required": true
    },
    "submittedData": {
      "title": "Submitteddata",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "publicSignals": {
      "title": "Publicsignals",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    },
    "disclosureFields": {
      "title": "Disclosurefields",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        {
          "type": "null"
        }
      ]
    },
    "verifierTarget": {
      "type": "string",
      "title": "Verifiertarget",
      "default": "evm"
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/noir/generate' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/zk-proof/noir/toolchain`
- Operation ID: `get_noir_toolchain_api_v1_banking_zk_proof_noir_toolchain_get`
- Summary: Get Noir Toolchain
- Full URL template: `https://<host>/api/v1/banking/zk-proof/noir/toolchain`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:read`
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/zk-proof/noir/toolchain' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/zk-proof/noir/verify`
- Operation ID: `verify_noir_claim_api_v1_banking_zk_proof_noir_verify_post`
- Summary: Verify Noir Claim
- Full URL template: `https://<host>/api/v1/banking/zk-proof/noir/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ZkNoirVerifyBody",
  "properties": {
    "proofId": {
      "title": "Proofid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "circuitId": {
      "title": "Circuitid",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "proofData": {
      "title": "Proofdata",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "publicInputsData": {
      "title": "Publicinputsdata",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    },
    "verificationKeyData": {
      "title": "Verificationkeydata",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/noir/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /api/v1/banking/zk-proof/verification/{verificationId}`
- Operation ID: `get_verification_proof_api_v1_banking_zk_proof_verification__verificationId__get`
- Summary: Get Verification Proof
- Full URL template: `https://<host>/api/v1/banking/zk-proof/verification/{verificationId}`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:read`
- Path parameters:
  - `verificationId`: `{"type": "string", "title": "Verificationid"}`
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/api/v1/banking/zk-proof/verification/{verificationId}' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /api/v1/banking/zk-proof/verify`
- Operation ID: `verify_proof_api_v1_banking_zk_proof_verify_post`
- Summary: Verify Proof
- Full URL template: `https://<host>/api/v1/banking/zk-proof/verify`
- Authentication: OpenAPI security: HTTPBearer
- Required permissions (code-level): `zk:read`
- Idempotency: supports `Idempotency-Key` header.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ZkVerifyBody",
  "properties": {
    "proofId": {
      "type": "string",
      "title": "Proofid",
      "required": true
    },
    "proof": {
      "title": "Proof",
      "anyOf": [
        {
          "type": "object"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/api/v1/banking/zk-proof/verify' \
  -H 'Content-Type: application/json'\n-H 'Authorization: Bearer <token>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

## Resource: health

### `GET /health`
- Operation ID: `health_health_get`
- Summary: Health
- Full URL template: `https://<host>/health`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/health' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

## Resource: root

### `GET /`
- Operation ID: `root_redirect__get`
- Summary: Root Redirect
- Full URL template: `https://<host>/`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/' \
  -H 'Content-Type: application/json'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

## Resource: verification

### `GET /verification/cameras`
- Operation ID: `cameras_verification_cameras_get`
- Summary: Cameras
- Full URL template: `https://<host>/verification/cameras`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/cameras' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/config`
- Operation ID: `verification_config_verification_config_get`
- Summary: Verification Config
- Full URL template: `https://<host>/verification/config`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/config' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/demo/document-webcam`
- Operation ID: `demo_document_webcam_verification_demo_document_webcam_get`
- Summary: Demo Document Webcam
- Full URL template: `https://<host>/verification/demo/document-webcam`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `text/html` schema:

```json
{
  "type": "string"
}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/demo/document-webcam' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/demo/mobile`
- Operation ID: `demo_mobile_verification_demo_mobile_get`
- Summary: Demo Mobile
- Full URL template: `https://<host>/verification/demo/mobile`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `text/html` schema:

```json
{
  "type": "string"
}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/demo/mobile' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/demo/mobile-liveness`
- Operation ID: `demo_mobile_liveness_verification_demo_mobile_liveness_get`
- Summary: Demo Mobile Liveness
- Full URL template: `https://<host>/verification/demo/mobile-liveness`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `text/html` schema:

```json
{
  "type": "string"
}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/demo/mobile-liveness' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/demo/webcam`
- Operation ID: `demo_webcam_verification_demo_webcam_get`
- Summary: Demo Webcam
- Full URL template: `https://<host>/verification/demo/webcam`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `text/html` schema:

```json
{
  "type": "string"
}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/demo/webcam' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/health`
- Operation ID: `health_check_verification_health_get`
- Summary: Health Check
- Full URL template: `https://<host>/verification/health`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/health' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/model/reload`
- Operation ID: `reload_model_verification_model_reload_post`
- Summary: Reload Model
- Full URL template: `https://<host>/verification/model/reload`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `application/json`

```json
{
  "type": "object",
  "title": "ReloadBody",
  "properties": {
    "model_path": {
      "title": "Model Path",
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/model/reload' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>' \
  -d '{"example":"See request schema below"}'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/model/status`
- Operation ID: `model_status_verification_model_status_get`
- Summary: Model Status
- Full URL template: `https://<host>/verification/model/status`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/model/status' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/predict`
- Operation ID: `predict_score_verification_predict_post`
- Summary: Predict Score
- Full URL template: `https://<host>/verification/predict`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - None
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_predict_score_verification_predict_post",
  "properties": {
    "id_image": {
      "type": "string",
      "title": "Id Image",
      "format": "binary",
      "required": true
    },
    "live_image": {
      "type": "string",
      "title": "Live Image",
      "format": "binary",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/predict' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/proxy/document-ocr-check`
- Operation ID: `proxy_document_ocr_check_verification_proxy_document_ocr_check_post`
- Summary: Proxy Document Ocr Check
- Full URL template: `https://<host>/verification/proxy/document-ocr-check`
- Authentication: OpenAPI security: APIKeyHeader
- Path parameters:
  - None
- Query parameters:
  - `document_type`: `{"type": "string", "title": "Document Type", "default": "NIN"}`
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_proxy_document_ocr_check_verification_proxy_document_ocr_check_post",
  "properties": {
    "document_image": {
      "type": "string",
      "title": "Document Image",
      "format": "binary",
      "required": true
    },
    "document_back_image": {
      "title": "Document Back Image",
      "anyOf": [
        {
          "type": "string",
          "format": "binary"
        },
        {
          "type": "null"
        }
      ]
    },
    "first_name": {
      "type": "string",
      "title": "First Name",
      "required": true
    },
    "last_name": {
      "type": "string",
      "title": "Last Name",
      "required": true
    },
    "other_name": {
      "type": "string",
      "title": "Other Name",
      "default": ""
    },
    "document_number": {
      "type": "string",
      "title": "Document Number",
      "default": ""
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "OcrCheckResponse",
  "properties": {
    "ok": {
      "type": "boolean",
      "title": "Ok",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    },
    "ocr_enabled": {
      "type": "boolean",
      "title": "Ocr Enabled",
      "required": true
    }
  }
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/proxy/document-ocr-check' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/proxy/token`
- Operation ID: `issue_proxy_token_verification_proxy_token_post`
- Summary: Issue Proxy Token
- Full URL template: `https://<host>/verification/proxy/token`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - `document_type`: `{"type": "string", "title": "Document Type", "default": "NIN"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/proxy/token' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/proxy/verify-document`
- Operation ID: `proxy_verify_document_verification_proxy_verify_document_post`
- Summary: Proxy Verify Document
- Full URL template: `https://<host>/verification/proxy/verify-document`
- Authentication: OpenAPI security: APIKeyHeader
- Path parameters:
  - None
- Query parameters:
  - `use_webcam`: `{"type": "boolean", "title": "Use Webcam", "default": false}`
  - `device_index`: `{"type": "integer", "title": "Device Index", "default": 0}`
  - `liveness`: `{"type": "boolean", "title": "Liveness", "default": true}`
  - `show_window`: `{"type": "boolean", "title": "Show Window", "default": true}`
  - `document_type`: `{"type": "string", "title": "Document Type", "default": "NIN"}`
  - `html`: `{"type": "boolean", "title": "Html", "default": false}`
  - `return_url`: `{"type": "string", "title": "Return Url", "default": "/verification/demo/document-webcam"}`
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_proxy_verify_document_verification_proxy_verify_document_post",
  "properties": {
    "document_image": {
      "type": "string",
      "title": "Document Image",
      "format": "binary",
      "required": true
    },
    "document_back_image": {
      "title": "Document Back Image",
      "anyOf": [
        {
          "type": "string",
          "format": "binary"
        },
        {
          "type": "null"
        }
      ]
    },
    "live_image": {
      "title": "Live Image",
      "anyOf": [
        {
          "type": "string",
          "format": "binary"
        },
        {
          "type": "null"
        }
      ]
    },
    "live_images": {
      "title": "Live Images",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "binary"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "VerificationResponse",
  "properties": {
    "score": {
      "type": "number",
      "title": "Score",
      "required": true
    },
    "threshold": {
      "type": "number",
      "title": "Threshold",
      "required": true
    },
    "passed": {
      "type": "boolean",
      "title": "Passed",
      "required": true
    },
    "verdict": {
      "type": "string",
      "title": "Verdict",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    },
    "allow_retry": {
      "type": "boolean",
      "title": "Allow Retry",
      "required": true
    }
  }
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/proxy/verify-document' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `GET /verification/result`
- Operation ID: `verification_result_verification_result_get`
- Summary: Verification Result
- Full URL template: `https://<host>/verification/result`
- Authentication: No explicit auth requirement declared.
- Path parameters:
  - None
- Query parameters:
  - `passed`: `{"type": "boolean", "title": "Passed", "default": false}`
  - `message`: `{"type": "string", "title": "Message", "default": "Verification completed"}`
  - `score`: `{"title": "Score", "anyOf": [{"type": "number"}, {"type": "null"}]}`
  - `threshold`: `{"title": "Threshold", "anyOf": [{"type": "number"}, {"type": "null"}]}`
  - `return_url`: `{"type": "string", "title": "Return Url", "default": "/verification/demo/webcam"}`
- Header parameters:
  - None
- Request body schemas: None
- Responses:
  - `200`: Successful Response
    - `text/html` schema:

```json
{
  "type": "string"
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X GET 'https://<host>/verification/result' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/verify`
- Operation ID: `verify_id_verification_verify_post`
- Summary: Verify Id
- Full URL template: `https://<host>/verification/verify`
- Authentication: OpenAPI security: APIKeyHeader
- Path parameters:
  - None
- Query parameters:
  - `html`: `{"type": "boolean", "title": "Html", "default": false}`
  - `return_url`: `{"type": "string", "title": "Return Url", "default": "/verification/demo/mobile"}`
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_verify_id_verification_verify_post",
  "properties": {
    "id_image": {
      "type": "string",
      "title": "Id Image",
      "format": "binary",
      "required": true
    },
    "live_image": {
      "type": "string",
      "title": "Live Image",
      "format": "binary",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "VerificationResponse",
  "properties": {
    "score": {
      "type": "number",
      "title": "Score",
      "required": true
    },
    "threshold": {
      "type": "number",
      "title": "Threshold",
      "required": true
    },
    "passed": {
      "type": "boolean",
      "title": "Passed",
      "required": true
    },
    "verdict": {
      "type": "string",
      "title": "Verdict",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    },
    "allow_retry": {
      "type": "boolean",
      "title": "Allow Retry",
      "required": true
    }
  }
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/verify' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/verify-document`
- Operation ID: `verify_document_verification_verify_document_post`
- Summary: Verify Document
- Full URL template: `https://<host>/verification/verify-document`
- Authentication: OpenAPI security: APIKeyHeader
- Path parameters:
  - None
- Query parameters:
  - `use_webcam`: `{"type": "boolean", "title": "Use Webcam", "default": false}`
  - `device_index`: `{"type": "integer", "title": "Device Index", "default": 0}`
  - `liveness`: `{"type": "boolean", "title": "Liveness", "default": true}`
  - `show_window`: `{"type": "boolean", "title": "Show Window", "default": true}`
  - `document_type`: `{"type": "string", "title": "Document Type", "default": "NIN"}`
  - `html`: `{"type": "boolean", "title": "Html", "default": false}`
  - `return_url`: `{"type": "string", "title": "Return Url", "default": "/verification/demo/document-webcam"}`
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_verify_document_verification_verify_document_post",
  "properties": {
    "document_image": {
      "type": "string",
      "title": "Document Image",
      "format": "binary",
      "required": true
    },
    "document_back_image": {
      "title": "Document Back Image",
      "anyOf": [
        {
          "type": "string",
          "format": "binary"
        },
        {
          "type": "null"
        }
      ]
    },
    "live_image": {
      "title": "Live Image",
      "anyOf": [
        {
          "type": "string",
          "format": "binary"
        },
        {
          "type": "null"
        }
      ]
    },
    "live_images": {
      "title": "Live Images",
      "anyOf": [
        {
          "type": "array",
          "items": {
            "type": "string",
            "format": "binary"
          }
        },
        {
          "type": "null"
        }
      ]
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "VerificationResponse",
  "properties": {
    "score": {
      "type": "number",
      "title": "Score",
      "required": true
    },
    "threshold": {
      "type": "number",
      "title": "Threshold",
      "required": true
    },
    "passed": {
      "type": "boolean",
      "title": "Passed",
      "required": true
    },
    "verdict": {
      "type": "string",
      "title": "Verdict",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    },
    "allow_retry": {
      "type": "boolean",
      "title": "Allow Retry",
      "required": true
    }
  }
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/verify-document' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/verify-mobile-liveness`
- Operation ID: `verify_mobile_liveness_verification_verify_mobile_liveness_post`
- Summary: Verify Mobile Liveness
- Full URL template: `https://<host>/verification/verify-mobile-liveness`
- Authentication: OpenAPI security: APIKeyHeader
- Path parameters:
  - None
- Query parameters:
  - `html`: `{"type": "boolean", "title": "Html", "default": false}`
  - `return_url`: `{"type": "string", "title": "Return Url", "default": "/verification/demo/mobile-liveness"}`
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_verify_mobile_liveness_verification_verify_mobile_liveness_post",
  "properties": {
    "id_image": {
      "type": "string",
      "title": "Id Image",
      "format": "binary",
      "required": true
    },
    "live_images": {
      "type": "array",
      "title": "Live Images",
      "items": {
        "type": "string",
        "format": "binary"
      },
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "VerificationResponse",
  "properties": {
    "score": {
      "type": "number",
      "title": "Score",
      "required": true
    },
    "threshold": {
      "type": "number",
      "title": "Threshold",
      "required": true
    },
    "passed": {
      "type": "boolean",
      "title": "Passed",
      "required": true
    },
    "verdict": {
      "type": "string",
      "title": "Verdict",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    },
    "allow_retry": {
      "type": "boolean",
      "title": "Allow Retry",
      "required": true
    }
  }
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/verify-mobile-liveness' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

### `POST /verification/verify-webcam`
- Operation ID: `verify_webcam_verification_verify_webcam_post`
- Summary: Verify Webcam
- Full URL template: `https://<host>/verification/verify-webcam`
- Authentication: OpenAPI security: APIKeyHeader
- Path parameters:
  - None
- Query parameters:
  - `device_index`: `{"type": "integer", "title": "Device Index", "default": 0}`
  - `liveness`: `{"type": "boolean", "title": "Liveness", "default": true}`
  - `show_window`: `{"type": "boolean", "title": "Show Window", "default": true}`
  - `html`: `{"type": "boolean", "title": "Html", "default": false}`
  - `return_url`: `{"type": "string", "title": "Return Url", "default": "/verification/demo/webcam"}`
- Header parameters:
  - None
- Request body schemas:
  - `multipart/form-data`

```json
{
  "type": "object",
  "title": "Body_verify_webcam_verification_verify_webcam_post",
  "properties": {
    "id_image": {
      "type": "string",
      "title": "Id Image",
      "format": "binary",
      "required": true
    }
  }
}
```
- Responses:
  - `200`: Successful Response
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "VerificationResponse",
  "properties": {
    "score": {
      "type": "number",
      "title": "Score",
      "required": true
    },
    "threshold": {
      "type": "number",
      "title": "Threshold",
      "required": true
    },
    "passed": {
      "type": "boolean",
      "title": "Passed",
      "required": true
    },
    "verdict": {
      "type": "string",
      "title": "Verdict",
      "required": true
    },
    "message": {
      "type": "string",
      "title": "Message",
      "required": true
    },
    "allow_retry": {
      "type": "boolean",
      "title": "Allow Retry",
      "required": true
    }
  }
}
```
  - `422`: Validation Error
    - `application/json` schema:

```json
{
  "type": "object",
  "title": "HTTPValidationError",
  "properties": {
    "detail": {
      "type": "array",
      "title": "Detail",
      "items": {
        "type": "object",
        "title": "ValidationError",
        "properties": {
          "loc": {
            "type": "array",
            "title": "Location",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "required": true
          },
          "msg": {
            "type": "string",
            "title": "Message",
            "required": true
          },
          "type": {
            "type": "string",
            "title": "Error Type",
            "required": true
          },
          "input": {
            "title": "Input"
          },
          "ctx": {
            "type": "object",
            "title": "Context"
          }
        }
      }
    }
  }
}
```
- Example request:

```bash
curl -X POST 'https://<host>/verification/verify-webcam' \
  -H 'Content-Type: application/json'\n-H 'X-API-Key: <api-key-if-configured>'\n-H 'Idempotency-Key: <uuid-v4>'
```
- Example response:

```json
{
  "status": 200,
  "note": "Response shape depends on endpoint; see response schema section."
}
```

## Frontend Implementation Notes
- Send `Authorization: Bearer <token>` for all `/api/v1/banking/*` calls and authenticated `/auth/*` calls.
- Persist and propagate `X-Request-Id` and optional `X-Correlation-Id` for client/server tracing.
- Prefer idempotency keys for all non-GET banking actions to make retries safe.
- Handle both envelope-style errors (`success:false`) and plain `detail` errors from verification endpoints.
- For multipart endpoints, use `FormData` and avoid manual `Content-Type` boundary setting.
- Normalize date-times as UTC ISO-8601 (`Z`) and treat enum-like status values as case-sensitive.
- Account for mixed response payload styles: some endpoints return `{success,data}`, others raw objects.
- When consuming HTML demo endpoints, do not parse as JSON; they are browser render targets.
