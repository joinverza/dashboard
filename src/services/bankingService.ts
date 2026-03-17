import type {
  IndividualKYCRequest,
  IndividualKYCResponse,
  VerificationStatusResponse,
  DocumentVerifyRequest,
  DocumentVerifyResponse,
  DocumentExtractRequest,
  DocumentExtractResponse,
  BiometricFaceMatchRequest,
  BiometricFaceMatchResponse,
  BiometricLivenessRequest,
  BiometricLivenessResponse,
  SanctionsCheckRequest,
  SanctionsCheckResponse,
  PEPCheckRequest,
  PEPCheckResponse,
  AMLRiskScoreRequest,
  AMLRiskScoreResponse,
  TransactionMonitoringRequest,
  TransactionMonitoringResponse,
  WebhookRegisterRequest,
  WebhookResponse,
  ApiKeyCreateRequest,
  ApiKeyResponse,
  AuditLogResponse,
  VerificationStatsResponse,
  ReportCreateRequest,
  ReportResponse,
  VerificationRequestResponse,
  BulkVerificationRequest,
  BulkVerificationResponse,
  CompanySettings,
  ComplianceReport,
  AnalyticsData,
  User,
  Verifier,
  VerifierProfile,
  VerificationDetails,
  CredentialIssuanceRequest,
  CredentialIssuanceResponse,
  DashboardNotification,
  MarketplaceVerifier,
  UserWalletOverview,
  SystemHealthService,
  GeoDistributionItem
} from '../types/banking';

const API_PATH = '/api/v1/banking';
const API_KEY_STORAGE_KEY = 'verza:banking:apiKey';
const ADMIN_TOKEN_STORAGE_KEY = 'verza:banking:adminToken';
const DEFAULT_IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEmgJ3H2jyxQAAAABJRU5ErkJggg==';

const sanitizeUrlString = (value: string): string =>
  value
    .trim()
    .replace(/[`"'“”‘’]/g, '')
    .replace(/\s+/g, '')
    .replace(/\/+$/, '');

const normalizeEndpointPath = (value: string): string => {
  const clean = sanitizeUrlString(value);
  if (!clean) return '/';
  return clean.startsWith('/') ? clean : `/${clean}`;
};

const normalizeBaseUrl = (value: string): string => {
  const cleaned = sanitizeUrlString(value);
  if (!cleaned) return API_PATH;
  if (cleaned.endsWith(API_PATH)) return cleaned;
  return `${cleaned}${API_PATH}`;
};

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_BANKING_API_BASE_URL || '');
const ENV_API_KEY = (import.meta.env.VITE_BANKING_API_KEY || '').trim();
const ENV_ADMIN_TOKEN = (import.meta.env.VITE_BANKING_ADMIN_TOKEN || '').trim();

type JsonRecord = Record<string, unknown>;
type ApiEnvelope<T> = { success: boolean; data: T; timestamp?: string; error?: { code?: string; message?: string; details?: unknown[] } };
type StoredAuthSession = { accessToken?: string };

const isRecord = (value: unknown): value is JsonRecord => typeof value === 'object' && value !== null;

const generateToken = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const safeParseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const readStorage = (key: string): string => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(key)?.trim() || '';
};

const writeStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
};

const removeStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
};

export const getBankingApiKey = (): string => readStorage(API_KEY_STORAGE_KEY) || ENV_API_KEY;
export const setBankingApiKey = (apiKey: string): void => writeStorage(API_KEY_STORAGE_KEY, apiKey.trim());
export const clearBankingApiKey = (): void => removeStorage(API_KEY_STORAGE_KEY);
export const setBankingAdminToken = (token: string): void => writeStorage(ADMIN_TOKEN_STORAGE_KEY, token.trim());

const getAdminToken = (): string => readStorage(ADMIN_TOKEN_STORAGE_KEY) || ENV_ADMIN_TOKEN;
const getAuthAccessToken = (): string => {
  if (typeof window === 'undefined') return '';
  const raw = window.localStorage.getItem('verza:auth:session');
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw) as StoredAuthSession;
    return typeof parsed.accessToken === 'string' ? parsed.accessToken.trim() : '';
  } catch {
    return '';
  }
};

class BankingApiError extends Error {
  status: number;
  path: string;
  requestId?: string;

  constructor(status: number, path: string, message: string, requestId?: string) {
    super(message);
    this.name = 'BankingApiError';
    this.status = status;
    this.path = path;
    this.requestId = requestId;
  }
}

const isBankingApiError = (error: unknown): error is BankingApiError => error instanceof BankingApiError;

const toErrorMessage = (status: number, payload: unknown): string => {
  if (isRecord(payload)) {
    if (typeof payload.detail === 'string') return payload.detail;
    if (isRecord(payload.error) && typeof payload.error.message === 'string') {
      return payload.error.message;
    }
  }
  return `Request failed with status ${status}`;
};

const unwrapEnvelope = <T>(payload: unknown): T => {
  if (isRecord(payload) && typeof payload.success === 'boolean') {
    if (!payload.success) {
      throw new Error(toErrorMessage(400, payload));
    }
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { allowBootstrapAdminToken?: boolean; idempotent?: boolean }
): Promise<T> => {
  const normalizedPath = normalizeEndpointPath(path);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Request-Id': generateToken('req'),
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const accessToken = getAuthAccessToken();
  const apiKey = getBankingApiKey();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (!headers.Authorization && options?.allowBootstrapAdminToken) {
    const adminToken = getAdminToken();
    if (adminToken) {
      headers['x-verza-admin-token'] = adminToken;
    }
  }

  if ((method === 'POST' || method === 'DELETE') && options?.idempotent !== false) {
    headers['Idempotency-Key'] = generateToken('idem');
  }

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'include',
  });

  const text = await res.text();
  const payload = text ? safeParseJson(text) : {};

  if (!res.ok) {
    throw new BankingApiError(
      res.status,
      normalizedPath,
      toErrorMessage(res.status, payload),
      res.headers.get('x-request-id') || undefined,
    );
  }

  return unwrapEnvelope<T>(payload);
};

const toIsoNow = (): string => new Date().toISOString();

const splitName = (name?: string): { firstName: string; lastName: string } => {
  const value = (name || '').trim();
  if (!value) return { firstName: '', lastName: '' };
  const parts = value.split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
};

const toVerificationDetails = (value: unknown): VerificationDetails | undefined => {
  if (isRecord(value)) {
    return value as VerificationDetails;
  }
  return undefined;
};

const toAuditValue = (value: unknown): AuditLogResponse['details'] => {
  if (value === null) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (isRecord(value)) return value as Record<string, unknown>;
  return null;
};

const toScalarRecord = (value: JsonRecord): Record<string, string | number | boolean | null> =>
  Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (item === null || typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return [key, item];
      }
      return [key, String(item)];
    }),
  );

const normalizeVerificationStatus = (status: string, overallResult?: string): VerificationStatusResponse['status'] => {
  if (status === 'not_found') return 'not_found';
  if (status === 'completed') {
    if (overallResult === 'approved') return 'verified';
    if (overallResult === 'rejected') return 'rejected';
    if (overallResult === 'manual_review_required') return 'review_needed';
    return 'verified';
  }
  if (status === 'review_required') return 'review_needed';
  return status as VerificationStatusResponse['status'];
};

const normalizeVerificationType = (value: unknown): VerificationStatusResponse['type'] => {
  const type = typeof value === 'string' ? value : 'kyc_individual';
  if (type === 'kyc_business' || type === 'sanctions' || type === 'pep' || type === 'document' || type === 'aml' || type === 'kyc_individual') {
    return type;
  }
  return 'kyc_individual';
};

const mapVerificationStatusResponse = (input: JsonRecord): VerificationStatusResponse => {
  const verificationId = String(input.verificationId ?? input.id ?? '');
  const createdAt = typeof input.createdAt === 'string' ? input.createdAt : toIsoNow();
  const updatedAt = typeof input.updatedAt === 'string' ? input.updatedAt : createdAt;
  const rawStatus = typeof input.status === 'string' ? input.status : 'pending';
  const overallResult = typeof input.overallResult === 'string' ? input.overallResult : undefined;

  return {
    verificationId,
    type: normalizeVerificationType(input.verificationType ?? input.type),
    status: normalizeVerificationStatus(rawStatus, overallResult),
    details: toVerificationDetails(input.result) ?? toVerificationDetails(input.details) ?? toVerificationDetails(input),
    createdAt,
    updatedAt,
  };
};

const mapVerificationRequest = (item: JsonRecord): VerificationRequestResponse => {
  const mapped = mapVerificationStatusResponse(item);
  return {
    verificationId: mapped.verificationId,
    type: mapped.type || 'kyc_individual',
    status: mapped.status,
    details: mapped.details,
    createdAt: mapped.createdAt,
    updatedAt: mapped.updatedAt,
    subject: typeof item.subject === 'string' ? item.subject : undefined,
  };
};

const mapWebhook = (item: JsonRecord): WebhookResponse => ({
  id: String(item.webhookId ?? item.id ?? ''),
  webhookId: String(item.webhookId ?? item.id ?? ''),
  url: String(item.webhookUrl ?? item.url ?? ''),
  webhookUrl: String(item.webhookUrl ?? item.url ?? ''),
  events: Array.isArray(item.events) ? item.events.map(String) : [],
  isActive: Boolean(item.active ?? item.isActive),
  active: Boolean(item.active ?? item.isActive),
  createdAt: typeof item.createdAt === 'string' ? item.createdAt : toIsoNow(),
});

const mapApiKey = (item: JsonRecord): ApiKeyResponse => ({
  id: String(item.keyId ?? item.id ?? ''),
  keyId: String(item.keyId ?? item.id ?? ''),
  name: String(item.keyName ?? item.name ?? ''),
  keyName: String(item.keyName ?? item.name ?? ''),
  keyPrefix: typeof item.keyPrefix === 'string' ? item.keyPrefix : '',
  apiKey: typeof item.apiKey === 'string' ? item.apiKey : undefined,
  permissions: Array.isArray(item.permissions) ? item.permissions.map(String) : [],
  scopes: Array.isArray(item.permissions) ? item.permissions.map(String) : [],
  createdAt: typeof item.createdAt === 'string' ? item.createdAt : toIsoNow(),
  expiresAt: typeof item.expiresAt === 'string' ? item.expiresAt : null,
  revokedAt: typeof item.revokedAt === 'string' ? item.revokedAt : null,
  status: typeof item.status === 'string' ? item.status : 'active',
  lastUsed: typeof item.lastUsed === 'string' ? item.lastUsed : undefined,
  rateLimit: typeof item.rateLimit === 'number' ? item.rateLimit : undefined,
});

const mapAuditLog = (item: JsonRecord): AuditLogResponse => ({
  id: String(item.eventId ?? item.id ?? ''),
  eventId: String(item.eventId ?? item.id ?? ''),
  action: String(item.action ?? item.eventType ?? 'unknown'),
  eventType: typeof item.eventType === 'string' ? item.eventType : undefined,
  actorId: String(item.actorId ?? item.actor ?? ''),
  actor: typeof item.actor === 'string' ? item.actor : undefined,
  resourceId: String(item.resourceId ?? item.targetId ?? ''),
  targetType: typeof item.targetType === 'string' ? item.targetType : undefined,
  targetId: typeof item.targetId === 'string' ? item.targetId : undefined,
  requestId: typeof item.requestId === 'string' ? item.requestId : undefined,
  timestamp: String(item.timestamp ?? item.createdAt ?? toIsoNow()),
  createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
  details: toAuditValue(item.details) ?? toAuditValue(item.data),
  data: toAuditValue(item.data),
  status: item.status === 'failure' ? 'failure' : 'success',
});

const mapDashboardNotification = (item: JsonRecord): DashboardNotification => {
  const rawType = String(item.type ?? item.category ?? item.eventType ?? 'info').toLowerCase();
  const type: DashboardNotification['type'] =
    rawType.includes('alert') || rawType.includes('risk')
      ? 'alert'
      : rawType.includes('transaction') || rawType.includes('payment')
        ? 'transaction'
        : rawType.includes('message') || rawType.includes('chat')
          ? 'message'
          : rawType.includes('update') || rawType.includes('system')
            ? 'update'
            : 'info';
  const readValue = item.read ?? item.isRead ?? item.readAt;
  return {
    id: String(item.id ?? item.notificationId ?? item.eventId ?? generateToken('notif')),
    type,
    title: String(item.title ?? item.subject ?? item.eventType ?? 'Notification'),
    message: String(item.message ?? item.body ?? item.description ?? ''),
    createdAt: String(item.createdAt ?? item.timestamp ?? toIsoNow()),
    read: Boolean(readValue),
    actionLabel: typeof item.actionLabel === 'string' ? item.actionLabel : typeof item.action === 'string' ? item.action : undefined,
  };
};

const mapMarketplaceVerifier = (item: JsonRecord): MarketplaceVerifier => ({
  id: String(item.id ?? item.verifierId ?? item.userId ?? ''),
  name: String(item.name ?? item.organizationName ?? item.displayName ?? 'Unknown Verifier'),
  category: String(item.category ?? item.specialization ?? item.service ?? 'General'),
  rating: typeof item.rating === 'number' ? item.rating : Number(item.rating || 0),
  verified: Boolean(item.verified ?? item.isVerified ?? item.status === 'verified'),
  imageUrl:
    typeof item.imageUrl === 'string'
      ? item.imageUrl
      : typeof item.logoUrl === 'string'
        ? item.logoUrl
        : typeof item.avatar === 'string'
          ? item.avatar
          : undefined,
});

const mapSystemHealthService = (item: JsonRecord): SystemHealthService => {
  const statusRaw = String(item.status ?? 'operational').toLowerCase();
  const status: SystemHealthService['status'] =
    statusRaw === 'down' || statusRaw === 'critical'
      ? 'down'
      : statusRaw === 'degraded' || statusRaw === 'warning'
        ? 'degraded'
        : 'operational';
  return {
    name: String(item.name ?? item.service ?? item.component ?? 'Service'),
    status,
    uptime: String(item.uptime ?? item.availability ?? 'N/A'),
  };
};

const mapGeoDistribution = (item: JsonRecord): GeoDistributionItem => ({
  region: String(item.region ?? item.country ?? item.name ?? 'Unknown'),
  percentage: typeof item.percentage === 'number' ? item.percentage : Number(item.percentage || item.share || 0),
});

export const bankingService = {
  getVerificationRequests: async (params?: { limit?: number }): Promise<VerificationRequestResponse[]> => {
    const query = params?.limit ? `?limit=${params.limit}` : '';
    try {
      const payload = await request<unknown>('GET', `/requests${query}`, undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapVerificationRequest);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapVerificationRequest);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  updateVerificationStatus: async (verificationId: string, status: string, notes?: string): Promise<VerificationStatusResponse> => {
    const payload = await request<JsonRecord>('POST', `/requests/${verificationId}/review`, { status, notes });
    return mapVerificationStatusResponse(payload);
  },

  verifyIndividual: async (data: IndividualKYCRequest): Promise<IndividualKYCResponse> => {
    const payload = {
      requestId: generateToken('req_kyc_full'),
      customerId: data.email || `${data.firstName}.${data.lastName}`.toLowerCase(),
      verificationType: 'full',
      personalInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dob,
        nationality: data.address.country || 'US',
      },
      contactInfo: {
        email: data.email,
        phone: data.phone,
        address: {
          line1: data.address.street,
          city: data.address.city,
          country: data.address.country,
        },
      },
      identityDocuments: [
        {
          documentType: data.idDocumentType,
          documentImage: (data as IndividualKYCRequest & { idDocumentImage?: string }).idDocumentImage || DEFAULT_IMAGE_DATA_URL,
          documentNumber: data.idDocumentNumber,
        },
      ],
      priority: 'standard',
    };
    const result = await request<JsonRecord>('POST', '/kyc/individual/verify', payload);
    return {
      verificationId: String(result.verificationId ?? ''),
      status: 'pending',
      riskScore: 'low',
      createdAt: toIsoNow(),
    };
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationStatusResponse> => {
    const result = await request<JsonRecord>('GET', `/kyc/individual/${verificationId}`, undefined, { idempotent: false });
    return mapVerificationStatusResponse(result);
  },

  verifyIndividualBasic: async (data: Partial<IndividualKYCRequest>): Promise<IndividualKYCResponse> => {
    const payload = {
      requestId: generateToken('req_kyc_basic'),
      customerId: data.email || `${data.firstName || ''}.${data.lastName || ''}`.toLowerCase(),
      personalInfo: {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        dateOfBirth: data.dob || '',
        nationality: data.address?.country || 'US',
      },
      contactInfo: {
        email: data.email || '',
      },
      identityDocuments: [
        {
          documentType: data.idDocumentType || 'national_id',
          documentImage: (data as Partial<IndividualKYCRequest> & { idDocumentImage?: string }).idDocumentImage || DEFAULT_IMAGE_DATA_URL,
          documentNumber: data.idDocumentNumber || '',
        },
      ],
    };
    const result = await request<JsonRecord>('POST', '/kyc/individual/basic', payload);
    return {
      verificationId: String(result.verificationId ?? ''),
      status: 'pending',
      riskScore: 'low',
      createdAt: toIsoNow(),
    };
  },

  verifyDocument: async (data: DocumentVerifyRequest): Promise<DocumentVerifyResponse> => {
    const result = await request<JsonRecord>('POST', '/documents/verify', {
      documentType: data.documentType,
      documentImage: data.documentImage,
      issuingCountry: data.country,
    });
    return {
      isValid: Boolean(result.authentic),
      issues: [],
      extractedData: toScalarRecord(result),
    };
  },

  extractDocumentData: async (data: DocumentExtractRequest): Promise<DocumentExtractResponse> => {
    const result = await request<JsonRecord>('POST', '/documents/extract', data);
    const extractedData = isRecord(result.extractedData) ? result.extractedData : {};
    const confidenceRecord = isRecord(result.confidence) ? result.confidence : {};
    const overall = typeof confidenceRecord.overall === 'number' ? confidenceRecord.overall : 0;
    const fields = isRecord(extractedData.fields) ? extractedData.fields : {};
    return {
      fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, String(value)])),
      confidence: overall,
    };
  },

  matchFace: async (data: BiometricFaceMatchRequest): Promise<BiometricFaceMatchResponse> => {
    const result = await request<JsonRecord>('POST', '/biometrics/face-match', {
      selfieImage: data.selfieImage,
      idPhotoImage: data.idPhotoImage || data.documentImage || '',
      threshold: data.threshold,
    });
    return {
      match: Boolean(result.match),
      score: typeof result.matchScore === 'number' ? result.matchScore * 100 : 0,
    };
  },

  checkLiveness: async (data: BiometricLivenessRequest): Promise<BiometricLivenessResponse> => {
    const isActive = data.livenessType === 'active' || Array.isArray(data.imageSequence);
    const selfieImage = data.selfieImage ?? (isActive ? data.imageSequence : DEFAULT_IMAGE_DATA_URL);
    const result = await request<JsonRecord>('POST', '/biometrics/liveness', {
      livenessType: isActive ? 'active' : 'passive',
      selfieImage,
      videoUrl: data.videoUrl,
    });
    const livenessScore = typeof result.livenessScore === 'number' ? result.livenessScore : 0;
    return {
      isLive: Boolean(result.live),
      score: livenessScore * 100,
    };
  },

  checkSanctions: async (data: SanctionsCheckRequest): Promise<SanctionsCheckResponse> => {
    const fromName = splitName(data.name);
    const result = await request<JsonRecord>('POST', '/screening/sanctions/check', {
      firstName: data.firstName || fromName.firstName,
      lastName: data.lastName || fromName.lastName,
      dateOfBirth: data.dateOfBirth || data.dob,
      nationality: data.nationality || data.country,
      fuzzyMatching: data.fuzzyMatching ?? true,
      matchThreshold: data.matchThreshold ?? 90,
    });
    const matches = Array.isArray(result.matches) ? result.matches : [];
    return {
      matchFound: matches.length > 0 || result.status === 'potential_match',
      hits: matches,
    };
  },

  checkPEP: async (data: PEPCheckRequest): Promise<PEPCheckResponse> => {
    const fromName = splitName(data.name);
    const result = await request<JsonRecord>('POST', '/screening/pep/check', {
      firstName: data.firstName || fromName.firstName,
      lastName: data.lastName || fromName.lastName,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality || data.country,
      fuzzyMatching: data.fuzzyMatching ?? true,
      matchThreshold: data.matchThreshold ?? 90,
    });
    return {
      isPEP: result.status === 'potential_match' || Number(result.totalMatches || 0) > 0,
      details: result,
    };
  },

  calculateRiskScore: async (data: AMLRiskScoreRequest): Promise<AMLRiskScoreResponse> => {
    const customerData = data.customerData;
    const payload = {
      customerId: data.customerId || customerData?.email || generateToken('cust'),
      customerProfile: data.customerProfile || {
        segment: 'retail',
        country: customerData?.address.country,
      },
      verificationResults: data.verificationResults,
      transactionProfile: data.transactionProfile,
      relationshipFactors: data.relationshipFactors,
    };
    const result = await request<JsonRecord>('POST', '/aml/risk-score', payload);
    const factors = Array.isArray(result.riskFactors) ? result.riskFactors : [];
    return {
      score: typeof result.overallRiskScore === 'number' ? result.overallRiskScore : 0,
      riskLevel: (result.riskLevel as 'low' | 'medium' | 'high') || 'low',
      factors: factors.map((factor) => (isRecord(factor) && typeof factor.factor === 'string' ? factor.factor : 'unknown')),
    };
  },

  monitorTransaction: async (data: TransactionMonitoringRequest): Promise<TransactionMonitoringResponse> => {
    const payload = {
      transactionId: data.transactionId,
      customerId: data.customerId || data.senderId || '',
      transaction: data.transaction || {
        amount: data.amount || 0,
      },
      customerRiskProfile: data.customerRiskProfile || {
        riskLevel: 'medium',
      },
    };
    const result = await request<JsonRecord>('POST', '/aml/transaction-monitoring', payload);
    const decision = typeof result.decision === 'string' ? result.decision : 'approve';
    return {
      isSuspicious: decision !== 'approve',
      riskScore: typeof result.transactionRiskScore === 'number' ? result.transactionRiskScore : 0,
      action: (decision === 'flag' || decision === 'block' ? decision : 'approve') as 'approve' | 'flag' | 'block',
    };
  },

  registerWebhook: async (data: WebhookRegisterRequest): Promise<WebhookResponse> => {
    const result = await request<JsonRecord>('POST', '/webhooks/register', {
      webhookUrl: data.webhookUrl || data.url || '',
      events: data.events || [],
      secret: data.secret || generateToken('whsec'),
      active: data.active ?? true,
    });
    return mapWebhook(result);
  },

  listWebhooks: async (): Promise<WebhookResponse[]> => {
    const result = await request<JsonRecord>('GET', '/webhooks', undefined, { idempotent: false });
    const items = Array.isArray(result.items) ? result.items : [];
    return items.filter(isRecord).map(mapWebhook);
  },

  deleteWebhook: async (webhookId: string): Promise<void> => {
    await request('DELETE', `/webhooks/${webhookId}`);
  },

  createApiKey: async (data: ApiKeyCreateRequest): Promise<ApiKeyResponse> => {
    const payload = {
      keyName: data.keyName || data.name || 'Frontend Integration Key',
      permissions: data.permissions || data.scopes || ['kyc:write', 'kyc:read'],
      expiresAt: data.expiresAt || null,
      ipWhitelist: data.ipWhitelist || [],
      rateLimit: data.rateLimit,
    };
    const result = await request<JsonRecord>('POST', '/api-keys/create', payload, { allowBootstrapAdminToken: true });
    const mapped = mapApiKey(result);
    if (mapped.apiKey) {
      setBankingApiKey(mapped.apiKey);
    }
    return mapped;
  },

  listApiKeys: async (): Promise<ApiKeyResponse[]> => {
    const result = await request<JsonRecord>('GET', '/api-keys', undefined, { idempotent: false });
    const items = Array.isArray(result.items) ? result.items : [];
    return items.filter(isRecord).map(mapApiKey);
  },

  revokeApiKey: async (keyId: string): Promise<void> => {
    await request('DELETE', `/api-keys/${keyId}`);
  },

  getCustomerAudit: async (customerId: string): Promise<AuditLogResponse[]> => {
    const result = await request<JsonRecord>('GET', `/audit/customer/${customerId}`, undefined, { idempotent: false });
    return Array.isArray(result.items) ? result.items.filter(isRecord).map(mapAuditLog) : [];
  },

  getVerificationAudit: async (verificationId: string): Promise<AuditLogResponse[]> => {
    const result = await request<JsonRecord>('GET', `/audit/verification/${verificationId}`, undefined, { idempotent: false });
    return Array.isArray(result.items) ? result.items.filter(isRecord).map(mapAuditLog) : [];
  },

  getAuditLogs: async (): Promise<AuditLogResponse[]> => {
    const result = await request<unknown>('GET', '/audit/logs', undefined, { idempotent: false });
    if (Array.isArray(result)) {
      return result.filter(isRecord).map(mapAuditLog);
    }
    if (isRecord(result) && Array.isArray(result.items)) {
      return result.items.filter(isRecord).map(mapAuditLog);
    }
    return [];
  },

  getVerificationStats: async (): Promise<VerificationStatsResponse> => {
    try {
      const result = await request<JsonRecord>('GET', '/analytics/verification-stats', undefined, { idempotent: false });
      return {
        totalVerifications: Number(result.totalVerifications || 0),
        approved: Number(result.approved || 0),
        rejected: Number(result.rejected || 0),
        pending: Number(result.pending || 0),
        manualReview: Number(result.manualReview || 0),
        averageTime: typeof result.averageTime === 'number' ? result.averageTime : 0,
        averageProcessingTime: typeof result.averageProcessingTime === 'number' ? result.averageProcessingTime : undefined,
        successful: typeof result.successful === 'number' ? result.successful : 0,
        failed: typeof result.failed === 'number' ? result.failed : 0,
        successRate: typeof result.successRate === 'number' ? result.successRate : undefined,
        dailyBreakdown: Array.isArray(result.dailyBreakdown) ? result.dailyBreakdown as VerificationStatsResponse['dailyBreakdown'] : [],
        breakdown: Array.isArray(result.breakdown) ? result.breakdown as VerificationStatsResponse['breakdown'] : undefined,
      };
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return {
          totalVerifications: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          manualReview: 0,
          averageTime: 0,
          successful: 0,
          failed: 0,
          dailyBreakdown: [],
        };
      }
      throw error;
    }
  },

  createReport: async (data: ReportCreateRequest): Promise<ReportResponse> => {
    const result = await request<JsonRecord>('POST', '/reports/create', {
      reportType: data.reportType || (data.type === 'compliance' ? 'compliance_summary' : data.type === 'audit' ? 'verification_summary' : 'risk_distribution'),
      dateRange: {
        from: data.dateRange.from || data.dateRange.start || '',
        to: data.dateRange.to || data.dateRange.end || '',
      },
      filters: data.filters,
      format: data.format || 'csv',
      includeCharts: data.includeCharts ?? false,
    });
    return {
      reportId: String(result.reportId ?? ''),
      status: (result.status as ReportResponse['status']) || 'generating',
      estimatedCompletion: typeof result.estimatedCompletion === 'string' ? result.estimatedCompletion : null,
      downloadUrl: typeof result.downloadUrl === 'string' ? result.downloadUrl : undefined,
    };
  },

  listReports: async (): Promise<ComplianceReport[]> => {
    const result = await request<unknown>('GET', '/reports', undefined, { idempotent: false });
    if (Array.isArray(result)) {
      return result as ComplianceReport[];
    }
    if (isRecord(result) && Array.isArray(result.items)) {
      return result.items as ComplianceReport[];
    }
    return [];
  },

  getAnalytics: async (timeRange: string): Promise<AnalyticsData> => {
    return request<AnalyticsData>('GET', `/analytics?timeRange=${encodeURIComponent(timeRange)}`, undefined, { idempotent: false });
  },

  getUserVerifications: async (params?: { status?: string; page?: number; limit?: number }): Promise<VerificationRequestResponse[]> => {
    const query = new URLSearchParams(
      Object.entries({
        status: params?.status,
        page: params?.page ? String(params.page) : undefined,
        limit: params?.limit ? String(params.limit) : undefined,
      }).filter(([, value]) => value !== undefined) as [string, string][],
    ).toString();
    const path = query ? `/user/verifications?${query}` : '/user/verifications';
    try {
      const payload = await request<unknown>('GET', path, undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapVerificationRequest);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapVerificationRequest);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  getNotifications: async (params?: { page?: number; limit?: number }): Promise<DashboardNotification[]> => {
    const query = new URLSearchParams(
      Object.entries({
        page: params?.page ? String(params.page) : undefined,
        limit: params?.limit ? String(params.limit) : undefined,
      }).filter(([, value]) => value !== undefined) as [string, string][],
    ).toString();
    const path = query ? `/notifications?${query}` : '/notifications';
    try {
      const payload = await request<unknown>('GET', path, undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapDashboardNotification);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapDashboardNotification);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  getMarketplaceVerifiers: async (params?: {
    search?: string;
    service?: string;
    rating?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<MarketplaceVerifier[]> => {
    const query = new URLSearchParams(
      Object.entries({
        search: params?.search,
        service: params?.service,
        rating: params?.rating,
        sort: params?.sort,
        page: params?.page ? String(params.page) : undefined,
        limit: params?.limit ? String(params.limit) : undefined,
      }).filter(([, value]) => value !== undefined) as [string, string][],
    ).toString();
    const path = query ? `/marketplace/verifiers?${query}` : '/marketplace/verifiers';
    try {
      const payload = await request<unknown>('GET', path, undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapMarketplaceVerifier);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapMarketplaceVerifier);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  getUserWalletOverview: async (): Promise<UserWalletOverview> => {
    try {
      const payload = await request<unknown>('GET', '/user/wallet', undefined, { idempotent: false });
      if (isRecord(payload)) {
        return {
          currency: typeof payload.currency === 'string' ? payload.currency : 'USD',
          balance: typeof payload.balance === 'number' ? payload.balance : Number(payload.balance || 0),
          totalSpent: typeof payload.totalSpent === 'number' ? payload.totalSpent : Number(payload.totalSpent || payload.spent || 0),
        };
      }
      return { currency: 'USD', balance: 0, totalSpent: 0 };
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return { currency: 'USD', balance: 0, totalSpent: 0 };
      }
      throw error;
    }
  },

  getSystemHealth: async (): Promise<SystemHealthService[]> => {
    try {
      const payload = await request<unknown>('GET', '/admin/system-health', undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapSystemHealthService);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapSystemHealthService);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  getRecentAlerts: async (): Promise<DashboardNotification[]> => {
    try {
      const payload = await request<unknown>('GET', '/admin/alerts', undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapDashboardNotification);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapDashboardNotification);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  getGeoDistribution: async (): Promise<GeoDistributionItem[]> => {
    try {
      const payload = await request<unknown>('GET', '/analytics/geographic-distribution', undefined, { idempotent: false });
      if (Array.isArray(payload)) {
        return payload.filter(isRecord).map(mapGeoDistribution);
      }
      if (isRecord(payload) && Array.isArray(payload.items)) {
        return payload.items.filter(isRecord).map(mapGeoDistribution);
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)) {
        return [];
      }
      throw error;
    }
  },

  initiateBulkVerification: async (data: BulkVerificationRequest): Promise<BulkVerificationResponse> => {
    return request<BulkVerificationResponse>('POST', '/bulk/verify', data);
  },

  getCompanySettings: async (): Promise<CompanySettings> => {
    return request<CompanySettings>('GET', '/settings/company', undefined, { idempotent: false });
  },

  updateCompanySettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
    return request<CompanySettings>('PATCH', '/settings/company', data, { idempotent: false });
  },

  getUsers: async (params?: { role?: string; status?: string; search?: string }): Promise<User[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<User[]>('GET', `/admin/users?${query}`, undefined, { idempotent: false });
  },

  getVerifiers: async (params?: { status?: string; search?: string }): Promise<Verifier[]> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<Verifier[]>('GET', `/admin/verifiers?${query}`, undefined, { idempotent: false });
  },

  getVerifierDetails: async (id: string): Promise<Verifier> => {
    return request<Verifier>('GET', `/admin/verifiers/${id}`, undefined, { idempotent: false });
  },

  getVerifierProfile: async (): Promise<VerifierProfile> => {
    return request<VerifierProfile>('GET', '/verifier/profile', undefined, { idempotent: false });
  },

  updateVerifierProfile: async (data: Partial<VerifierProfile>): Promise<VerifierProfile> => {
    return request<VerifierProfile>('PATCH', '/verifier/profile', data, { idempotent: false });
  },

  issueCredential: async (data: CredentialIssuanceRequest): Promise<CredentialIssuanceResponse> => {
    return request<CredentialIssuanceResponse>('POST', '/verifier/issue-credential', data);
  }
};
