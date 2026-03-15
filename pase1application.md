# Phase 1 Frontend API Contracts (Backend-Accurate)

This document is generated from the current backend implementation under `/api/v1/banking/*`.

## Global Contract

### Base URL
- `https://<your-host>/api/v1/banking`

### Standard Headers
- `Authorization: Bearer <API_KEY>` (required for all endpoints except first-time API key bootstrap)
- `Content-Type: application/json` (for POST/DELETE with body)
- `Idempotency-Key: <unique-string>` (recommended for POST/DELETE; backend replays identical stored response)
- `X-Request-Id: <optional-client-id>` (optional; echoed back in response headers)

### Success Envelope
```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-15T12:00:00Z"
}
```

### Validation Error Envelope (status `400`)
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Validation error",
    "details": [
      {
        "loc": ["body", "fieldName"],
        "msg": "Field required",
        "type": "missing"
      }
    ]
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

### Auth/Permission Errors
- Authentication/authorization failures are returned as standard FastAPI errors:
```json
{
  "detail": "Missing Authorization Bearer token"
}
```
- Common statuses:
  - `401`: missing/invalid/expired key
  - `403`: insufficient permissions or IP not allowed
  - `429`: per-key rate limit exceeded

---

## Category A: Identity Verification (7 APIs)

## 1) POST `/kyc/individual/verify`
Permission: `kyc:write`

### Request Body
```json
{
  "requestId": "req_kyc_full_001",
  "customerId": "cust_001",
  "verificationType": "full",
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1994-08-19",
    "nationality": "NG"
  },
  "contactInfo": {
    "email": "jane@example.com",
    "phone": "+2348012345678",
    "address": {
      "line1": "12 Allen Avenue",
      "city": "Ikeja",
      "country": "NG"
    }
  },
  "identityDocuments": [
    {
      "documentType": "passport",
      "documentImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
    }
  ],
  "proofOfAddress": {
    "type": "utility_bill",
    "documentImage": "data:image/png;base64,iVBORw0KGgoAAA..."
  },
  "biometricData": {
    "selfieImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "idPhotoImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  },
  "additionalChecks": {
    "bvn": "12345678901",
    "nin": "12345678901"
  },
  "callbackUrl": "https://client.example.com/webhooks/kyc",
  "priority": "standard"
}
```

### Field Rules
- `verificationType`: `basic | full | enhanced_due_diligence`
- `priority`: `low | standard | high | urgent` (default: `standard`)
- Required: `requestId`, `customerId`, `verificationType`, `personalInfo`, `contactInfo`, `identityDocuments`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "verificationId": "ver_abc123",
    "status": "pending",
    "overallResult": "pending"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 2) GET `/kyc/individual/{verificationId}`
Permission: `kyc:read`

### Path Params
- `verificationId` (string)

### Success Response (`200`, found)
```json
{
  "success": true,
  "data": {
    "verificationId": "ver_abc123",
    "status": "completed",
    "verificationType": "full",
    "overallResult": "manual_review_required",
    "confidenceScore": 75.0,
    "riskScore": 65.0,
    "riskLevel": "high",
    "extractedData": {
      "personalInfo": {
        "firstName": "Jane",
        "lastName": "Doe"
      }
    },
    "result": {
      "mode": "full",
      "screening": {
        "pep": {
          "status": "clear",
          "totalMatches": 0
        },
        "sanctions": {
          "status": "potential_match",
          "totalMatches": 1
        },
        "adverseMedia": null,
        "pepFamilyAssociates": null
      },
      "document": {
        "qualityAssessment": {
          "imageQuality": "high",
          "blur": "none",
          "glare": "minimal",
          "orientation": "upright"
        }
      },
      "biometrics": {
        "faceMatch": {
          "match": true,
          "matchScore": 0.88,
          "threshold": 0.5
        }
      },
      "identity": {
        "bvn": null,
        "nin": null
      },
      "additionalChecks": {
        "adverseMedia": false,
        "extendedPep": false
      }
    },
    "createdAt": "2026-03-15T11:55:00Z",
    "updatedAt": "2026-03-15T11:55:10Z",
    "completedAt": "2026-03-15T11:55:10Z"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

### Not Found Behavior (`200`, not 404)
```json
{
  "success": true,
  "data": {
    "verificationId": "ver_unknown",
    "status": "not_found"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 3) POST `/kyc/individual/basic`
Permission: `kyc:write`

### Request Body
```json
{
  "requestId": "req_kyc_basic_001",
  "customerId": "cust_001",
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1994-08-19",
    "nationality": "NG"
  },
  "contactInfo": {
    "email": "jane@example.com"
  },
  "identityDocuments": [
    {
      "documentType": "national_id",
      "documentImage": "data:image/jpeg;base64,/9j/4AAQSk..."
    }
  ]
}
```

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "verificationId": "ver_basic_001",
    "status": "pending",
    "overallResult": "pending"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 4) POST `/documents/verify`
Permission: `documents:write`

### Request Body
```json
{
  "documentType": "passport",
  "documentImage": "data:image/jpeg;base64,/9j/4AAQSk...",
  "documentBackImage": "data:image/jpeg;base64,/9j/4AAQSk...",
  "issuingCountry": "NG",
  "expectedData": {
    "firstName": "JANE",
    "lastName": "DOE",
    "documentNumber": "A12345678"
  },
  "useOcr": true
}
```

### Field Rules
- Required: `documentType`, `documentImage`
- `useOcr`: optional boolean; if omitted, OCR is disabled

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "authentic": true,
    "confidenceScore": 86.0,
    "securityFeaturesDetected": [
      {
        "type": "mrz",
        "status": "detected",
        "valid": true
      },
      {
        "type": "backImage",
        "status": "provided"
      }
    ],
    "fraudIndicators": {
      "forgery": "not_detected",
      "manipulation": "not_detected",
      "photoSubstitution": "not_detected"
    },
    "qualityAssessment": {
      "imageQuality": "high",
      "blur": "none",
      "glare": "minimal",
      "orientation": "upright"
    },
    "expectedDataMatch": {
      "checked": 3,
      "matched": 2,
      "matchRate": 0.6666666667,
      "details": [
        {
          "field": "firstName",
          "expected": "JANE",
          "matched": true
        }
      ]
    },
    "mrz": {
      "detected": true,
      "parsed": {
        "lines": ["P<NGA..."]
      },
      "valid": true
    },
    "signals": {
      "imageSize": {
        "width": 1200,
        "height": 800
      },
      "textCoverage": 0.11,
      "blockCount": 18,
      "brightness": 0.52,
      "contrast": 0.31,
      "edgeDensity": 0.05
    }
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 5) POST `/documents/extract`
Permission: `documents:write`

### Request Body
```json
{
  "documentImage": "data:image/jpeg;base64,/9j/4AAQSk...",
  "documentType": "passport",
  "language": "en"
}
```

### Field Rules
- Required: `documentImage`
- Optional: `documentType`, `language`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "extractedData": {
      "rawText": "P<NGA...DOE<<JANE...",
      "ocr": {
        "provider": "google_vision",
        "enabled": true,
        "error": null
      }
    },
    "confidence": {
      "overall": 0.75,
      "fieldConfidence": {}
    },
    "mrz": {
      "detected": true,
      "parsed": {
        "lines": ["P<NGA..."]
      },
      "valid": true
    }
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 6) POST `/biometrics/face-match`
Permission: `biometrics:write`

### Request Body
```json
{
  "selfieImage": "data:image/jpeg;base64,/9j/4AAQSk...",
  "idPhotoImage": "data:image/jpeg;base64,/9j/4AAQSk...",
  "threshold": 0.65
}
```

### Field Rules
- Required: `selfieImage`, `idPhotoImage`
- `threshold`: optional float `0.0` to `1.0`; if omitted backend uses model threshold

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "match": true,
    "matchScore": 0.87,
    "confidence": 87.0,
    "threshold": 0.65,
    "details": {
      "faceDetectedInSelfie": true,
      "faceDetectedInID": true,
      "faceQuality": {
        "selfie": "unknown",
        "id": "unknown"
      },
      "pose": {
        "selfie": "unknown",
        "id": "unknown"
      }
    }
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 7) POST `/biometrics/liveness`
Permission: `biometrics:write`

### Request Body (Passive)
```json
{
  "livenessType": "passive",
  "selfieImage": "data:image/jpeg;base64,/9j/4AAQSk..."
}
```

### Request Body (Active)
```json
{
  "livenessType": "active",
  "selfieImage": [
    "data:image/jpeg;base64,/9j/frame1...",
    "data:image/jpeg;base64,/9j/frame2..."
  ],
  "videoUrl": "https://cdn.example.com/liveness.mp4"
}
```

### Field Rules
- Required: `livenessType` (`passive | active`)
- Optional:
  - `selfieImage` can be a string or list of strings
  - `videoUrl` (if active mode)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "live": true,
    "livenessScore": 0.9,
    "confidence": 90.0,
    "spoofingAttempts": {
      "printedPhoto": "unknown",
      "screenReplay": "unknown",
      "mask2D": "unknown",
      "mask3D": "unknown",
      "deepfake": "unknown"
    },
    "quality": {
      "resolution": "unknown",
      "lighting": "unknown",
      "focus": "unknown"
    }
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## Category B: Basic Screening (4 APIs)

## 8) POST `/screening/sanctions/check`
Permission: `screening:write`

### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1994-08-19",
  "nationality": "NG",
  "fuzzyMatching": true,
  "matchThreshold": 90
}
```

### Field Rules
- Required: `firstName`, `lastName`
- `matchThreshold`: integer `0..100` (default `90`)
- `fuzzyMatching`: boolean (default `true`)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "status": "clear",
    "totalMatches": 0,
    "matches": [],
    "listsChecked": ["internal_stub"],
    "recommendation": "proceed",
    "provider": "internal_stub"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 9) POST `/screening/pep/check`
Permission: `screening:write`

### Request Body
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1994-08-19",
  "nationality": "NG",
  "fuzzyMatching": true,
  "matchThreshold": 90
}
```

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "status": "potential_match",
    "totalMatches": 1,
    "matches": [
      {
        "matchScore": 84,
        "name": "jane doe",
        "aliases": [],
        "reason": "internal_stub"
      }
    ],
    "listsChecked": ["internal_stub"],
    "recommendation": "manual_review",
    "provider": "internal_stub"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 10) POST `/aml/risk-score`
Permission: `aml:write`

### Request Body
```json
{
  "customerId": "cust_001",
  "customerProfile": {
    "segment": "retail"
  },
  "verificationResults": {
    "pepStatus": "clear",
    "sanctionsStatus": "potential_match"
  },
  "transactionProfile": {
    "highRiskCountries": ["IR", "KP"],
    "crossBorderPercentage": 67
  },
  "relationshipFactors": {
    "customerTenure": 18
  }
}
```

### Field Rules
- Required: `customerId`, `customerProfile`
- Optional: `verificationResults`, `transactionProfile`, `relationshipFactors`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "overallRiskScore": 60.0,
    "riskLevel": "high",
    "riskCategory": "rules_v1",
    "riskFactors": [
      {
        "factor": "high_risk_country",
        "category": "geographic",
        "impact": "high",
        "score": 25,
        "description": "Customer operates in high-risk jurisdiction"
      }
    ],
    "mitigatingFactors": [],
    "recommendations": {
      "dueDiligenceLevel": "enhanced",
      "monitoringFrequency": "monthly",
      "transactionLimits": {
        "daily": 10000,
        "monthly": 250000
      },
      "manualReviewRequired": true
    },
    "nextReviewDate": "2026-04-14"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 11) POST `/aml/transaction-monitoring`
Permission: `aml:write`

### Request Body
```json
{
  "transactionId": "tx_001",
  "customerId": "cust_001",
  "transaction": {
    "amount": 125000,
    "destinationCountry": "IR",
    "highRiskCountries": ["IR", "KP"]
  },
  "customerRiskProfile": {
    "typicalTransactionSize": 20000,
    "riskLevel": "high"
  }
}
```

### Field Rules
- Required: `transactionId`, `customerId`, `transaction`, `customerRiskProfile`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "transactionRiskScore": 70.0,
    "riskLevel": "high",
    "decision": "block",
    "flaggedReasons": [
      {
        "reason": "unusual_amount",
        "severity": "medium",
        "details": "Amount significantly higher than typical"
      },
      {
        "reason": "high_risk_destination",
        "severity": "high",
        "details": "Destination country on high-risk list"
      }
    ],
    "velocityChecks": {
      "anomalyDetected": false
    }
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## Category C: Webhooks & Integration (3 APIs)

## 12) POST `/webhooks/register`
Permission: `webhooks:write`

### Request Body
```json
{
  "webhookUrl": "https://client.example.com/webhooks/verza",
  "events": [
    "kyc.verification.completed",
    "reports.create.accepted"
  ],
  "secret": "supersecret123",
  "active": true
}
```

### Field Rules
- `webhookUrl`: valid URL (required)
- `events`: string array (defaults to `[]`)
- `secret`: required string, length `8..256`
- `active`: boolean (default `true`)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "webhookId": "wh_001",
    "status": "active",
    "createdAt": "2026-03-15T12:00:00Z"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 13) GET `/webhooks`
Permission: `webhooks:read`

### Query Params
- `active` (optional boolean): filter active/inactive

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "webhookId": "wh_001",
        "webhookUrl": "https://client.example.com/webhooks/verza",
        "events": ["kyc.verification.completed"],
        "active": true,
        "createdAt": "2026-03-15T12:00:00Z"
      }
    ]
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 14) DELETE `/webhooks/{webhookId}`
Permission: `webhooks:write`

### Path Params
- `webhookId` (string)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "webhookId": "wh_001",
    "deleted": true,
    "deletedAt": "2026-03-15T12:00:00Z"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## Category D: API Management (3 APIs)

## 15) POST `/api-keys/create`
Permission:
- Existing-keys mode: `api_keys:write` using bearer token
- Bootstrap mode (when no active key exists): requires `x-verza-admin-token`

### Request Body
```json
{
  "keyName": "Frontend Integration Key",
  "permissions": [
    "kyc:write",
    "kyc:read",
    "documents:write",
    "biometrics:write",
    "screening:write",
    "aml:write",
    "webhooks:write",
    "webhooks:read",
    "api_keys:read",
    "audit:read",
    "analytics:read",
    "reports:write"
  ],
  "expiresAt": "2026-12-31T23:59:59Z",
  "ipWhitelist": ["203.0.113.0/24"],
  "rateLimit": 1000
}
```

### Field Rules
- `keyName`: required, `1..128` chars
- `permissions`: string array
- `expiresAt`: ISO datetime string (invalid format becomes `null` silently)
- `ipWhitelist`: optional list of CIDR or IP strings
- `rateLimit`: optional integer `>= 0`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "keyId": "key_001",
    "apiKey": "vz_XXXXXXXXXXXXXXXXXXXXXXXX",
    "permissions": ["kyc:write", "kyc:read"],
    "createdAt": "2026-03-15T12:00:00Z",
    "expiresAt": "2026-12-31T23:59:59Z"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 16) GET `/api-keys`
Permission: `api_keys:read`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "keyId": "key_001",
        "keyName": "Frontend Integration Key",
        "permissions": ["kyc:write", "kyc:read"],
        "createdAt": "2026-03-15T12:00:00Z",
        "expiresAt": "2026-12-31T23:59:59Z",
        "revokedAt": null,
        "rateLimit": 1000,
        "status": "active"
      }
    ]
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 17) DELETE `/api-keys/{keyId}`
Permission: `api_keys:write`

### Path Params
- `keyId` (string)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "keyId": "key_001",
    "revoked": true,
    "revokedAt": "2026-03-15T12:00:00Z"
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## Category E: Audit & Compliance (2 APIs)

## 18) GET `/audit/customer/{customerId}`
Permission: `audit:read`

### Path Params
- `customerId` (this is the external `customer_ref` used when creating KYC requests)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "eventId": "evt_001",
        "eventType": "kyc.individual.verify.accepted",
        "requestId": "req_kyc_full_001",
        "actor": "api_key:key_abc",
        "targetType": "verification",
        "targetId": "ver_abc123",
        "data": {
          "jobId": "job_001",
          "customerId": "cust_001",
          "verificationType": "full"
        },
        "createdAt": "2026-03-15T12:00:00Z"
      }
    ]
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

### Not Found Behavior (`200`, empty list)
```json
{
  "success": true,
  "data": {
    "items": []
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 19) GET `/audit/verification/{verificationId}`
Permission: `audit:read`

### Path Params
- `verificationId` (string)

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "eventId": "evt_002",
        "eventType": "kyc.verification.completed",
        "requestId": "req_kyc_full_001",
        "actor": "worker",
        "targetType": "verification",
        "targetId": "ver_abc123",
        "data": {
          "overallResult": "approved",
          "confidenceScore": 85.0,
          "riskScore": 20.0,
          "riskLevel": "low"
        },
        "createdAt": "2026-03-15T12:00:10Z"
      }
    ]
  },
  "timestamp": "2026-03-15T12:00:10Z"
}
```

---

## Category F: Basic Reporting (2 APIs)

## 20) GET `/analytics/verification-stats`
Permission: `analytics:read`

### Query Params
- `startDate` (optional string; date or datetime)
- `endDate` (optional string; date or datetime)
- `groupBy` (optional): `day | week | month` (default: `month`)

### Example Request
`GET /api/v1/banking/analytics/verification-stats?startDate=2026-01-01&endDate=2026-03-31&groupBy=month`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "totalVerifications": 120,
    "approved": 94,
    "rejected": 8,
    "manualReview": 18,
    "averageProcessingTime": 3.42,
    "successRate": 78.3333333333,
    "breakdown": [
      {
        "period": "2026-01",
        "total": 40,
        "approved": 30,
        "rejected": 3,
        "manualReview": 7
      }
    ]
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## 21) POST `/reports/create`
Permission: `reports:write`

### Request Body
```json
{
  "reportType": "verification_summary",
  "dateRange": {
    "from": "2026-01-01",
    "to": "2026-03-31"
  },
  "filters": {
    "riskLevel": ["high", "very_high"]
  },
  "format": "csv",
  "includeCharts": false
}
```

### Field Rules
- `reportType`: `verification_summary | compliance_summary | risk_distribution`
- `format`: `pdf | csv | excel` (default: `csv`)
- Required: `reportType`, `dateRange`

### Success Response (`200`)
```json
{
  "success": true,
  "data": {
    "reportId": "rep_001",
    "status": "generating",
    "estimatedCompletion": null,
    "downloadUrl": null
  },
  "timestamp": "2026-03-15T12:00:00Z"
}
```

---

## Frontend Integration Notes

1. Treat many operations as async:
   - KYC verify/basic immediately return `pending`
   - Poll `GET /kyc/individual/{verificationId}` until `status=completed`
   - Report create returns `generating`; polling endpoint exists at `GET /reports/{reportId}` (outside this 21-endpoint list)

2. Not-found semantics are endpoint-specific:
   - Some endpoints return `200` with a status flag (`not_found`) rather than HTTP `404`

3. Idempotency behavior:
   - If you send the same `Idempotency-Key` + same method/path/scope, backend returns the exact stored previous body

4. Keep response parsing envelope-first:
   - Always parse `success`, then read `data`
   - Handle auth/rate-limit errors separately via `detail` message
