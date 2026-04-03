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
  BulkOnboardingValidationResponse,
  BulkOnboardingImportResponse,
  RiskSimulationRequest,
  RiskSimulationResponse,
  RiskSimulationReport,
  AuditExplorerFilters,
  SignedAuditExportResponse,
  WebhookRetryItem,
  WebhookTestResponse,
  WebhookSecretRotateResponse,
  LicenseUsageMetrics,
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
  GeoDistributionItem,
  PagedResult,
  PaginationMeta,
  PrivacyProofSummary,
  VerificationViewModel,
  FraudTrendPoint,
  RiskDistributionItem,
  ComplianceMetric,
  ProcessingTimePoint,
  ConsentRecord,
  DataExportResponse,
  DataDeletionResponse,
  ComplianceScheduleResponse,
  ProofVerificationResponse,
  CircuitCatalogItem,
  NoirToolchainStatus,
  SelectiveDisclosureResponse,
  BlockchainAnchorResponse,
  DidRecord,
  CredentialRecord,
  PresentationResponse,
  MonitoringRule,
  CaseRecord,
  PrimitiveHealth,
  PrimitiveModelStatus,
  AccountVerificationResponse,
  MonitoringToggleResponse,
  DueReviewItem,
  WatchlistEntry,
  SourceOfFundsResponse,
  SourceOfWealthAssessment,
  CreditCheckResponse,
  TranslationResponse,
  CurrencyConversionResponse,
  CountryRegulationResponse,
  SandboxSeedResponse,
  ApiErrorShape,
  BankingRetryEventDetail,
  BankingRequestDiagnosticEvent,
  IndividualKYCVerifyApiData,
  DocumentExtractApiData,
  BiometricFaceMatchApiData,
  BiometricLivenessApiData,
  SanctionsCheckApiData,
  PEPCheckApiData,
  AMLRiskScoreApiData,
  TransactionMonitoringApiData,
  InvitationAcceptBody,
  InvitationLifecycleResponse,
  ApiSecuritySettings,
  BillingPlan,
  CheckoutSessionBody,
  CheckoutSessionResponse,
  MonoExchangeBody,
  MonoExchangeResponse,
  VoiceVerificationBody,
  BehavioralBody,
  FingerprintBody,
  BiometricVerificationResponse,
  BusinessInfo,
  KybDirectorsBody,
  KybFinancialHealthBody,
  KybWorkflowResponse,
  KycIndividualEnhancedBody,
  KycBatchBody,
  KycBatchResponse,
  DidVerifyBody,
  DidVerifyResponse,
  CredentialIssueBody,
  CredentialIssueResponse,
  BlockchainProofByAnchorResponse,
  OngoingMonitoringStatusResponse,
  OngoingMonitoringChangesResponse,
  SarCreateBody,
  SarSubmitBody,
  CtrCreateBody,
  ComplianceCaseResponse,
  PepFamilyBody,
  ReportDetailResponse
} from '../types/banking';
import { getStoredSession, refreshRequest, saveSession, toSession } from './authService';
import { z } from 'zod';

const API_PATH = '/api/v1/banking';
const API_KEY_STORAGE_KEY = 'verza:banking:apiKey';
const ADMIN_TOKEN_STORAGE_KEY = 'verza:banking:adminToken';
export const BANKING_RETRY_EVENT = 'verza:banking:retry';
export const BANKING_REQUEST_DIAGNOSTIC_EVENT = 'verza:banking:request-diagnostic';
const DEFAULT_IMAGE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEmgJ3H2jyxQAAAABJRU5ErkJggg==';
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const RETRY_DELAYS_MS = [5000, 15000, 30000, 60000];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

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
const ROOT_BASE_URL = BASE_URL.endsWith(API_PATH) ? BASE_URL.slice(0, -API_PATH.length) : BASE_URL;
const ENV_API_KEY = (import.meta.env.VITE_BANKING_API_KEY || '').trim();
const ENV_ADMIN_TOKEN = (import.meta.env.VITE_BANKING_ADMIN_TOKEN || '').trim();

type JsonRecord = Record<string, unknown>;
type ApiEnvelope<T> = { success: boolean; data: T; timestamp?: string; error?: { code?: string; message?: string; details?: unknown[] } };
type StoredAuthSession = { accessToken?: string; refreshToken?: string; expiresAt?: number; user?: { name?: string }; permissions?: string[] };

const isRecord = (value: unknown): value is JsonRecord => typeof value === 'object' && value !== null;

const parseWithSchema = <T>(schema: z.ZodType<T>, value: unknown, context: string): T => {
  const result = schema.safeParse(value);
  if (!result.success) {
    const reason = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ');
    throw new Error(`${context} schema validation failed: ${reason}`);
  }
  return result.data;
};

const generateUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const raw = `${Date.now()}_${Math.random().toString(16).slice(2).padEnd(16, '0').slice(0, 16)}`;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-4${raw.slice(13, 16)}-a${raw.slice(17, 20)}-${raw.slice(20).padEnd(12, '0').slice(0, 12)}`;
};

const countryCodeSchema = z.string().regex(/^[A-Z]{2}$/);
const documentTypeSchema = z.enum(['passport', 'drivers_license', 'national_id']);
const documentVerifyRequestSchema = z.object({
  documentType: documentTypeSchema,
  documentImage: z.string().url(),
  documentBackImage: z.string().url().optional(),
  issuingCountry: countryCodeSchema,
  expectedData: z.record(z.string(), z.string()).optional(),
  useOcr: z.boolean().optional(),
}).strict();
const documentSecurityFeatureSchema = z.object({
  type: z.string().min(1),
  status: z.string().min(1),
  valid: z.boolean().optional(),
}).strict();
const documentVerifyResponseSchema = z.object({
  authentic: z.boolean(),
  confidenceScore: z.number(),
  securityFeaturesDetected: z.array(documentSecurityFeatureSchema),
  fraudIndicators: z.object({
    forgery: z.string().min(1),
    manipulation: z.string().min(1),
    photoSubstitution: z.string().min(1),
  }).strict(),
  qualityAssessment: z.object({
    imageQuality: z.string().min(1),
    blur: z.string().min(1),
    glare: z.string().min(1),
    orientation: z.string().min(1),
  }).strict(),
  expectedDataMatch: z.object({
    checked: z.number(),
    matched: z.number(),
    matchRate: z.number(),
    details: z.array(z.object({
      field: z.string().min(1),
      expected: z.string(),
      matched: z.boolean(),
    }).strict()),
  }).strict().optional(),
  mrz: z.object({
    detected: z.boolean(),
    parsed: z.record(z.string(), z.unknown()).optional(),
    valid: z.boolean().optional(),
  }).strict().optional(),
  signals: z.object({
    imageSize: z.object({
      width: z.number(),
      height: z.number(),
    }).strict().optional(),
    textCoverage: z.number().optional(),
    blockCount: z.number().optional(),
    brightness: z.number().optional(),
    contrast: z.number().optional(),
    edgeDensity: z.number().optional(),
  }).strict().optional(),
}).strict();
const bulkVerifyItemSchema = z.object({
  requestId: z.string().min(1),
  customerId: z.string().min(1),
  personalInfo: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    country: countryCodeSchema,
  }).strict(),
  contactInfo: z.object({
    email: z.string().email(),
    address: z.object({
      country: countryCodeSchema,
    }).strict(),
  }).strict(),
  identityDocuments: z.array(z.object({
    type: documentTypeSchema,
    number: z.string().min(1),
  }).strict()).min(1),
  callbackUrl: z.string().url().optional(),
}).strict();
const bulkVerificationRequestSchema = z.object({
  items: z.array(bulkVerifyItemSchema).min(1).max(1000),
}).strict();
const bulkVerificationResponseSchema = z.object({
  batchId: z.string().min(1),
  items: z.array(z.object({
    requestId: z.string().min(1),
    verificationId: z.string().min(1),
  }).strict()),
}).strict();

const generateToken = (prefix: string): string => {
  return `${prefix}_${generateUuid()}`;
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

let refreshTokenPromise: Promise<string> | null = null;

const refreshAuthAccessToken = async (): Promise<string> => {
  const currentSession = getStoredSession();
  if (!currentSession?.refreshToken) return '';
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      const refreshed = await refreshRequest(currentSession.refreshToken);
      const nextSession = toSession(refreshed);
      if (currentSession.user?.name) {
        nextSession.user.name = currentSession.user.name;
      }
      if (currentSession.permissions?.length) {
        nextSession.permissions = currentSession.permissions;
      }
      saveSession(nextSession);
      return nextSession.accessToken;
    })().finally(() => {
      refreshTokenPromise = null;
    });
  }
  return refreshTokenPromise;
};

const resolveAccessToken = async (): Promise<string> => {
  const currentSession = getStoredSession();
  if (!currentSession?.accessToken) {
    return getAuthAccessToken();
  }
  if (!currentSession.expiresAt || Date.now() < currentSession.expiresAt - 30_000) {
    return currentSession.accessToken;
  }
  try {
    return await refreshAuthAccessToken();
  } catch {
    return currentSession.accessToken;
  }
};

class BankingApiError extends Error {
  status: number;
  path: string;
  requestId?: string;
  retryable: boolean;

  constructor(status: number, path: string, message: string, requestId?: string, retryable = false) {
    super(message);
    this.name = 'BankingApiError';
    this.status = status;
    this.path = path;
    this.requestId = requestId;
    this.retryable = retryable;
  }
}

const isBankingApiError = (error: unknown): error is BankingApiError => error instanceof BankingApiError;

const toErrorMessage = (status: number, payload: unknown): string => {
  const isInlineUploadDisallowed = (value: string): boolean => value.toLowerCase().includes('inline_upload_disallowed');
  if (isRecord(payload)) {
    if (typeof payload.detail === 'string') {
      if (isInlineUploadDisallowed(payload.detail)) return 'Please provide a URL instead';
      return payload.detail;
    }
    if (isRecord(payload.error)) {
      const code = typeof payload.error.code === 'string' ? payload.error.code : '';
      const message = typeof payload.error.message === 'string' ? payload.error.message : '';
      if (isInlineUploadDisallowed(code) || isInlineUploadDisallowed(message)) return 'Please provide a URL instead';
      if (message) return message;
    }
  }
  return `Request failed with status ${status}`;
};

export const getBankingErrorMessage = (error: unknown, fallback = 'Request failed'): string => {
  if (isBankingApiError(error)) {
    return error.requestId ? `${error.message} (requestId: ${error.requestId})` : error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const delay = (durationMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  });

const isRetryableMethod = (method: string): boolean => method === 'GET' || method === 'POST' || method === 'DELETE';

const emitRetryEvent = (detail: BankingRetryEventDetail): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<BankingRetryEventDetail>(BANKING_RETRY_EVENT, { detail }));
};

const emitDiagnosticEvent = (detail: BankingRequestDiagnosticEvent): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<BankingRequestDiagnosticEvent>(BANKING_REQUEST_DIAGNOSTIC_EVENT, { detail }));
};

const getRetryDelayMs = (status: number, retryAttempt: number): number =>
  status === 429
    ? RETRY_DELAYS_MS[Math.min(retryAttempt - 1, RETRY_DELAYS_MS.length - 1)]
    : Math.min(1000 * Math.pow(2, retryAttempt - 1), 5000);

const shouldRetry = (method: string, status: number, retryAttempt: number): boolean => {
  if (!isRetryableMethod(method) || !RETRYABLE_STATUSES.has(status)) return false;
  if (status === 429) return retryAttempt <= RETRY_DELAYS_MS.length;
  return retryAttempt <= 3;
};

const unwrapEnvelope = <T>(status: number, payload: unknown): { value: T; envelopeError: ApiErrorShape | null } => {
  if (isRecord(payload) && typeof payload.success === 'boolean') {
    if (!payload.success) {
      return { value: payload as T, envelopeError: payload as ApiErrorShape };
    }
    if (isRecord(payload.data) && payload.data.status === 'not_found') {
      return { value: payload.data as T, envelopeError: null };
    }
    return { value: (payload as ApiEnvelope<T>).data, envelopeError: null };
  }
  if (isRecord(payload) && payload.status === 'not_found' && status === 200) {
    return { value: payload as T, envelopeError: null };
  }
  return { value: payload as T, envelopeError: null };
};

const estimateDataUrlBytes = (value: string): number => {
  const [, base64] = value.split(',');
  if (!base64) return 0;
  const normalized = base64.replace(/\s+/g, '');
  const padding = normalized.endsWith('==') ? 2 : normalized.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((normalized.length * 3) / 4) - padding);
};

const assertImagePayloadLimit = (value: string | undefined, field: string): void => {
  if (!value || !value.startsWith('data:image/')) return;
  const bytes = estimateDataUrlBytes(value);
  if (bytes > MAX_IMAGE_BYTES) {
    throw new Error(`${field} exceeds 10MB limit`);
  }
};

const performRequest = async <T>(
  baseUrl: string,
  method: string,
  path: string,
  body?: unknown,
  options?: { allowBootstrapAdminToken?: boolean; idempotent?: boolean }
): Promise<T> => {
  const normalizedPath = normalizeEndpointPath(path);
  const requestId = generateUuid();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Request-Id': requestId,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let accessToken = await resolveAccessToken();
  const apiKey = getBankingApiKey();
  const adminToken = options?.allowBootstrapAdminToken ? getAdminToken() : '';
  if (adminToken) {
    headers['x-verza-admin-token'] = adminToken;
  }

  if (method === 'POST' || method === 'DELETE') {
    headers['Idempotency-Key'] = generateUuid();
  }

  emitDiagnosticEvent({
    requestId,
    path: normalizedPath,
    method,
    stage: 'started',
    occurredAt: new Date().toISOString(),
  });

  let retryAttempt = 0;
  let refreshedAfterUnauthorized = false;
  while (true) {
    try {
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      } else if (apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
      } else {
        delete headers.Authorization;
      }

      const res = await fetch(`${baseUrl}${normalizedPath}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: 'include',
      });
      const text = await res.text();
      const payload = text ? safeParseJson(text) : {};
      if (!res.ok) {
        if (res.status === 401 && !refreshedAfterUnauthorized) {
          try {
            const refreshedToken = await refreshAuthAccessToken();
            if (refreshedToken) {
              accessToken = refreshedToken;
              refreshedAfterUnauthorized = true;
              continue;
            }
          } catch {
            accessToken = '';
          }
        }
        retryAttempt += 1;
        const retryable = shouldRetry(method, res.status, retryAttempt);
        if (retryable) {
          const retryInMs = getRetryDelayMs(res.status, retryAttempt);
          emitRetryEvent({ requestId, path: normalizedPath, status: res.status, attempt: retryAttempt, retryInMs });
          emitDiagnosticEvent({
            requestId,
            path: normalizedPath,
            method,
            stage: 'retrying',
            status: res.status,
            attempt: retryAttempt,
            retryInMs,
            message: `Retrying after status ${res.status}`,
            occurredAt: new Date().toISOString(),
          });
          await delay(retryInMs);
          continue;
        }
        emitDiagnosticEvent({
          requestId,
          path: normalizedPath,
          method,
          stage: 'failed',
          status: res.status,
          attempt: retryAttempt,
          message: toErrorMessage(res.status, payload),
          occurredAt: new Date().toISOString(),
        });
        throw new BankingApiError(
          res.status,
          normalizedPath,
          toErrorMessage(res.status, payload),
          res.headers.get('x-request-id') || requestId,
          retryable,
        );
      }
      const { value, envelopeError } = unwrapEnvelope<T>(res.status, payload);
      if (envelopeError) {
        emitDiagnosticEvent({
          requestId,
          path: normalizedPath,
          method,
          stage: 'failed',
          status: res.status,
          attempt: retryAttempt,
          message: toErrorMessage(res.status, envelopeError),
          occurredAt: new Date().toISOString(),
        });
        throw new BankingApiError(
          res.status,
          normalizedPath,
          toErrorMessage(res.status, envelopeError),
          res.headers.get('x-request-id') || requestId,
          false,
        );
      }
      emitDiagnosticEvent({
        requestId,
        path: normalizedPath,
        method,
        stage: 'succeeded',
        status: res.status,
        attempt: retryAttempt,
        occurredAt: new Date().toISOString(),
      });
      return value;
    } catch (error) {
      if (isBankingApiError(error)) throw error;
      retryAttempt += 1;
      if (shouldRetry(method, 429, retryAttempt)) {
        const retryInMs = getRetryDelayMs(429, retryAttempt);
        emitRetryEvent({ requestId, path: normalizedPath, status: 429, attempt: retryAttempt, retryInMs });
        emitDiagnosticEvent({
          requestId,
          path: normalizedPath,
          method,
          stage: 'retrying',
          status: 429,
          attempt: retryAttempt,
          retryInMs,
          message: error instanceof Error ? error.message : 'Transient network error',
          occurredAt: new Date().toISOString(),
        });
        await delay(retryInMs);
        continue;
      }
      if (error instanceof Error) {
        emitDiagnosticEvent({
          requestId,
          path: normalizedPath,
          method,
          stage: 'failed',
          status: 0,
          attempt: retryAttempt,
          message: error.message,
          occurredAt: new Date().toISOString(),
        });
        throw new BankingApiError(0, normalizedPath, error.message, requestId, true);
      }
      emitDiagnosticEvent({
        requestId,
        path: normalizedPath,
        method,
        stage: 'failed',
        status: 0,
        attempt: retryAttempt,
        message: 'Network request failed',
        occurredAt: new Date().toISOString(),
      });
      throw new BankingApiError(0, normalizedPath, 'Network request failed', requestId, true);
    }
  }
};

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { allowBootstrapAdminToken?: boolean; idempotent?: boolean }
): Promise<T> => performRequest<T>(BASE_URL, method, path, body, options);

const primitiveRequest = async <T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> => performRequest<T>(ROOT_BASE_URL, method, path, body, { idempotent: false });

const uploadMultipart = async <T>(path: string, formData: FormData): Promise<T> => {
  const normalizedPath = normalizeEndpointPath(path);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Request-Id': generateUuid(),
  };
  const accessToken = await resolveAccessToken();
  const apiKey = getBankingApiKey();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });
  const text = await res.text();
  const payload = text ? safeParseJson(text) : {};
  if (!res.ok) {
    throw new BankingApiError(
      res.status,
      normalizedPath,
      toErrorMessage(res.status, payload),
      res.headers.get('x-request-id') || headers['X-Request-Id'],
      false
    );
  }
  const { value, envelopeError } = unwrapEnvelope<T>(res.status, payload);
  if (envelopeError) {
    throw new BankingApiError(
      res.status,
      normalizedPath,
      toErrorMessage(res.status, envelopeError),
      res.headers.get('x-request-id') || headers['X-Request-Id'],
      false
    );
  }
  return value;
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

const webhookResponseSchema = z.object({
  webhookId: z.string().min(1),
  webhookUrl: z.string().url(),
  events: z.array(z.string()),
  active: z.boolean(),
  createdAt: z.string(),
}).passthrough();

const apiKeyResponseSchema = z.object({
  keyId: z.string().min(1),
  keyName: z.string().min(1),
  permissions: z.array(z.string()),
  environment: z.enum(['production', 'sandbox']).optional(),
  createdAt: z.string(),
  expiresAt: z.string().nullable().optional(),
  revokedAt: z.string().nullable().optional(),
  rateLimit: z.number().nullable().optional(),
  status: z.string().optional(),
  keyPrefix: z.string().optional(),
  apiKey: z.string().optional(),
  lastUsed: z.string().optional(),
}).passthrough();

const webhookTestResponseSchema = z.object({
  webhookId: z.string().nullable().optional(),
  status: z.enum(['delivered', 'invalid_target', 'inactive', 'not_found']),
  eventType: z.string().optional(),
  targetUrl: z.string().nullable().optional(),
  sentAt: z.string().optional(),
}).passthrough();

const webhookLegacyTestResponseSchema = z.object({
  requestId: z.string(),
  delivered: z.boolean(),
  statusCode: z.number(),
  latencyMs: z.number(),
}).passthrough();

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
  environment:
    item.environment === 'sandbox' || item.environment === 'production'
      ? item.environment
      : typeof item.keyPrefix === 'string' && item.keyPrefix.toLowerCase().startsWith('sb_')
        ? 'sandbox'
        : 'production',
  apiKey: typeof item.apiKey === 'string' ? item.apiKey : undefined,
  permissions: Array.isArray(item.permissions) ? item.permissions.map(String) : [],
  scopes: Array.isArray(item.permissions) ? item.permissions.map(String) : [],
  createdAt: typeof item.createdAt === 'string' ? item.createdAt : toIsoNow(),
  expiresAt: typeof item.expiresAt === 'string' ? item.expiresAt : null,
  revokedAt: typeof item.revokedAt === 'string' ? item.revokedAt : null,
  status: typeof item.status === 'string' ? item.status : 'active',
  lastUsed: typeof item.lastUsed === 'string' ? item.lastUsed : undefined,
  rateLimit: typeof item.rateLimit === 'number' ? item.rateLimit : null,
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
  reviewCount: typeof item.reviewCount === 'number' ? item.reviewCount : undefined,
  priceFrom: typeof item.priceFrom === 'number' ? item.priceFrom : undefined,
  currency: typeof item.currency === 'string' ? item.currency : undefined,
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

const buildQueryString = (params: Record<string, string | number | boolean | undefined | null>): string => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => [key, String(value)]),
  ).toString();
  return query ? `?${query}` : '';
};

const normalizeMeta = (value: unknown): PaginationMeta => {
  const meta = isRecord(value) ? value : {};
  const metaItems = Array.isArray(meta.items) ? meta.items : [];
  return {
    page: Number(meta.page ?? 1),
    limit: Number(meta.limit ?? 20),
    total: Number(meta.total ?? metaItems.length),
    totalPages: Number(meta.totalPages ?? 1),
  };
};

const normalizePagedResult = <T>(
  payload: unknown,
  mapper: (value: JsonRecord) => T
): PagedResult<T> => {
  if (Array.isArray(payload)) {
    return {
      items: payload.filter(isRecord).map(mapper),
      meta: {
        page: 1,
        limit: payload.length,
        total: payload.length,
        totalPages: 1,
      },
    };
  }
  if (isRecord(payload) && Array.isArray(payload.items)) {
    return {
      items: payload.items.filter(isRecord).map(mapper),
      meta: normalizeMeta(payload.meta),
    };
  }
  return {
    items: [],
    meta: {
      page: 1,
      limit: 0,
      total: 0,
      totalPages: 0,
    },
  };
};

const mapPrivacyProof = (value: unknown, role: PrivacyProofSummary['proofRole'] = 'primary'): PrivacyProofSummary | null => {
  if (!isRecord(value)) return null;
  const zkProof = isRecord(value.zkProof)
    ? {
        backend: 'noir' as const,
        circuitId: String(value.zkProof.circuitId ?? 'unknown'),
        verifierTarget: typeof value.zkProof.verifierTarget === 'string' ? value.zkProof.verifierTarget : undefined,
      }
    : null;
  return {
    proofId: String(value.proofId ?? value.id ?? generateToken('proof')),
    proofType: String(value.proofType ?? value.type ?? 'verification_proof'),
    proofRole: value.proofRole === 'claim' ? 'claim' : role,
    verificationId: typeof value.verificationId === 'string' ? value.verificationId : undefined,
    commitment: typeof value.commitment === 'string' ? value.commitment : undefined,
    publicSignals: isRecord(value.publicSignals) ? value.publicSignals : {},
    zkProof,
  };
};

const mapVerificationViewModel = (value: unknown): VerificationViewModel => {
  const record = isRecord(value) ? value : {};
  const claims = Array.isArray(record.privacyClaims) ? record.privacyClaims.map((item) => mapPrivacyProof(item, 'claim')).filter(Boolean) as PrivacyProofSummary[] : [];
  return {
    verificationId: String(record.verificationId ?? record.id ?? ''),
    status: String(record.status ?? 'pending'),
    overallResult: typeof record.overallResult === 'string' ? record.overallResult : undefined,
    riskLevel: typeof record.riskLevel === 'string' ? record.riskLevel : undefined,
    privacyProof: mapPrivacyProof(record.privacyProof),
    privacyClaims: claims,
  };
};

const mapFraudTrendPoint = (value: JsonRecord): FraudTrendPoint => ({
  period: String(value.period ?? value.date ?? value.label ?? ''),
  count: Number(value.count ?? value.value ?? 0),
  severity: typeof value.severity === 'string' ? value.severity : undefined,
});

const mapRiskDistributionItem = (value: JsonRecord): RiskDistributionItem => ({
  bucket: String(value.bucket ?? value.riskLevel ?? value.label ?? 'unknown'),
  count: Number(value.count ?? value.total ?? 0),
  percentage: Number(value.percentage ?? value.share ?? 0),
});

const mapComplianceMetric = (value: JsonRecord): ComplianceMetric => ({
  label: String(value.label ?? value.name ?? value.metric ?? 'metric'),
  value: Number(value.value ?? value.count ?? 0),
  unit: typeof value.unit === 'string' ? value.unit : undefined,
  change: typeof value.change === 'number' ? value.change : undefined,
});

const mapProcessingTimePoint = (value: JsonRecord): ProcessingTimePoint => ({
  period: String(value.period ?? value.date ?? value.label ?? ''),
  averageSeconds: Number(value.averageSeconds ?? value.averageTime ?? value.avg ?? 0),
  p95Seconds: typeof value.p95Seconds === 'number' ? value.p95Seconds : typeof value.p95 === 'number' ? value.p95 : undefined,
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
    assertImagePayloadLimit((payload.identityDocuments[0] as { documentImage?: string }).documentImage, 'documentImage');
    const result = await request<IndividualKYCVerifyApiData>('POST', '/kyc/individual/verify', payload);
    const normalizedStatus = normalizeVerificationStatus(typeof result.status === 'string' ? result.status : 'pending', typeof result.overallResult === 'string' ? result.overallResult : undefined);
    return {
      verificationId: String(result.verificationId ?? result.id ?? ''),
      status: normalizedStatus === 'not_found' ? 'pending' : normalizedStatus,
      riskScore: 'low',
      createdAt: typeof result.createdAt === 'string' ? result.createdAt : toIsoNow(),
    };
  },

  getVerificationStatus: async (verificationId: string): Promise<VerificationStatusResponse> => {
    const result = await request<IndividualKYCVerifyApiData>('GET', `/kyc/individual/${verificationId}`, undefined, { idempotent: false });
    return mapVerificationStatusResponse(result as JsonRecord);
  },

  pollVerificationStatus: async (
    verificationId: string,
    options?: {
      intervalMs?: number;
      maxAttempts?: number;
      onProgress?: (progress: {
        attempt: number;
        maxAttempts: number;
        status: VerificationStatusResponse['status'];
        timedOut: boolean;
      }) => void;
    }
  ): Promise<VerificationStatusResponse> => {
    const intervalMs = options?.intervalMs ?? 3000;
    const maxAttempts = options?.maxAttempts ?? 20;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const status = await bankingService.getVerificationStatus(verificationId);
      options?.onProgress?.({ attempt, maxAttempts, status: status.status, timedOut: false });
      if (status.status === 'not_found') return status;
      if (status.status !== 'pending' && status.status !== 'in_progress' && status.status !== 'review_needed') {
        return status;
      }
      if (attempt < maxAttempts) {
        await delay(intervalMs);
      }
    }
    options?.onProgress?.({ attempt: maxAttempts, maxAttempts, status: 'pending', timedOut: true });
    throw new Error(`Verification polling timed out after ${maxAttempts} attempts`);
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
    assertImagePayloadLimit((payload.identityDocuments[0] as { documentImage?: string }).documentImage, 'documentImage');
    const result = await request<IndividualKYCVerifyApiData>('POST', '/kyc/individual/basic', payload);
    const normalizedStatus = normalizeVerificationStatus(typeof result.status === 'string' ? result.status : 'pending', typeof result.overallResult === 'string' ? result.overallResult : undefined);
    return {
      verificationId: String(result.verificationId ?? result.id ?? ''),
      status: normalizedStatus === 'not_found' ? 'pending' : normalizedStatus,
      riskScore: 'low',
      createdAt: typeof result.createdAt === 'string' ? result.createdAt : toIsoNow(),
    };
  },

  verifyDocument: async (data: DocumentVerifyRequest): Promise<DocumentVerifyResponse> => {
    const payload = parseWithSchema(
      documentVerifyRequestSchema,
      {
        documentType: data.documentType,
        documentImage: data.documentImage,
        documentBackImage: data.documentBackImage,
        issuingCountry: data.issuingCountry,
        expectedData: data.expectedData,
        useOcr: data.useOcr ?? true,
      },
      'verifyDocument request',
    );
    assertImagePayloadLimit(payload.documentImage, 'documentImage');
    assertImagePayloadLimit(payload.documentBackImage, 'documentBackImage');
    const result = await request<unknown>('POST', '/documents/verify', payload);
    return parseWithSchema(documentVerifyResponseSchema, result, 'verifyDocument response');
  },

  extractDocumentData: async (data: DocumentExtractRequest): Promise<DocumentExtractResponse> => {
    assertImagePayloadLimit(data.documentImage, 'documentImage');
    const result = await request<DocumentExtractApiData>('POST', '/documents/extract', data);
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
    assertImagePayloadLimit(data.selfieImage, 'selfieImage');
    assertImagePayloadLimit(data.idPhotoImage || data.documentImage, 'idPhotoImage');
    const result = await request<BiometricFaceMatchApiData>('POST', '/biometrics/face-match', {
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
    if (typeof selfieImage === 'string') {
      assertImagePayloadLimit(selfieImage, 'selfieImage');
    }
    if (Array.isArray(selfieImage)) {
      selfieImage.forEach((item, index) => assertImagePayloadLimit(item, `selfieImage[${index}]`));
    }
    const result = await request<BiometricLivenessApiData>('POST', '/biometrics/liveness', {
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
    const result = await request<SanctionsCheckApiData>('POST', '/screening/sanctions/check', {
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
    const result = await request<PEPCheckApiData>('POST', '/screening/pep/check', {
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
    const result = await request<AMLRiskScoreApiData>('POST', '/aml/risk-score', payload);
    const factors = Array.isArray(result.riskFactors) ? result.riskFactors : [];
    return {
      score: typeof result.overallRiskScore === 'number' ? result.overallRiskScore : 0,
      riskLevel: (result.riskLevel as AMLRiskScoreResponse['riskLevel']) || 'low',
      factors: factors.map((factor) => (isRecord(factor) && typeof factor.factor === 'string' ? factor.factor : 'unknown')),
    };
  },

  simulateRiskScore: async (data: RiskSimulationRequest): Promise<RiskSimulationResponse> => {
    try {
      const result = await request<JsonRecord>('POST', '/risk/sandbox/simulate', data);
      const factors = Array.isArray(result.factors) ? result.factors : [];
      return {
        score: Number(result.score ?? 0),
        riskLevel: (result.riskLevel as 'low' | 'medium' | 'high') || 'medium',
        factors: factors
          .filter(isRecord)
          .map((factor) => ({
            factor: typeof factor.factor === 'string' ? factor.factor : 'unknown',
            contribution: Number(factor.contribution ?? 0),
          })),
        recommendation: typeof result.recommendation === 'string' ? result.recommendation : 'manual_review',
      };
    } catch (error) {
      if (isBankingApiError(error) && error.status === 404) {
        const riskBase = Math.min(
          100,
          Math.round(
            data.customerProfile.sanctionsHits * data.weights.sanctions +
              data.customerProfile.priorAlerts * data.weights.identity +
              (data.customerProfile.transactionAmount / 1000) * data.weights.transaction,
          ),
        );
        return {
          score: riskBase,
          riskLevel: riskBase >= 75 ? 'high' : riskBase >= 40 ? 'medium' : 'low',
          factors: [
            { factor: 'sanctions_hits', contribution: data.customerProfile.sanctionsHits * data.weights.sanctions },
            { factor: 'prior_alerts', contribution: data.customerProfile.priorAlerts * data.weights.identity },
            { factor: 'transaction_amount', contribution: (data.customerProfile.transactionAmount / 1000) * data.weights.transaction },
          ],
          recommendation: riskBase >= 75 ? 'reject_or_edd' : riskBase >= 40 ? 'manual_review' : 'auto_approve',
        };
      }
      throw error;
    }
  },

  generateRiskSandboxReport: async (data: {
    simulation: RiskSimulationResponse;
    weights: RiskSimulationRequest['weights'];
    customerProfile: RiskSimulationRequest['customerProfile'];
  }): Promise<RiskSimulationReport> => {
    const result = await request<JsonRecord>('POST', '/risk/sandbox/report', data);
    return {
      reportId: String(result.reportId ?? generateToken('risk-report')),
      generatedAt: typeof result.generatedAt === 'string' ? result.generatedAt : new Date().toISOString(),
      downloadUrl: typeof result.downloadUrl === 'string' ? result.downloadUrl : undefined,
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
    const result = await request<TransactionMonitoringApiData>('POST', '/aml/transaction-monitoring', payload);
    const decision = typeof result.decision === 'string' ? result.decision : 'approve';
    const action: TransactionMonitoringResponse['action'] =
      decision === 'manual_review' ? 'manual_review' :
      decision === 'block' ? 'block' :
      'approve';
    return {
      isSuspicious: decision !== 'approve',
      riskScore: typeof result.transactionRiskScore === 'number' ? result.transactionRiskScore : 0,
      action,
    };
  },

  registerWebhook: async (data: WebhookRegisterRequest): Promise<WebhookResponse> => {
    const result = await request<JsonRecord>('POST', '/webhooks/register', {
      webhookUrl: data.webhookUrl || data.url || '',
      events: data.events || [],
      secret: data.secret || generateToken('whsec'),
      active: data.active ?? true,
    });
    return mapWebhook(parseWithSchema(webhookResponseSchema, result, 'registerWebhook response'));
  },

  testWebhookEndpoint: async (webhookId: string): Promise<WebhookTestResponse> => {
    return bankingService.testWebhook({
      webhookId,
      eventType: 'verification.completed',
      payload: { source: 'dashboard' },
    });
  },

  testWebhook: async (input: { webhookId?: string; webhookUrl?: string; eventType: string; payload?: Record<string, unknown> }): Promise<WebhookTestResponse> => {
    try {
      const result = await request<JsonRecord>('POST', '/webhooks/test', input);
      const parsed = parseWithSchema(webhookTestResponseSchema, result, 'testWebhook response');
      return {
        webhookId: parsed.webhookId ?? null,
        status: parsed.status,
        eventType: parsed.eventType,
        targetUrl: parsed.targetUrl,
        sentAt: parsed.sentAt,
      };
    } catch (error) {
      if (!input.webhookId || !(isBankingApiError(error) && error.status === 404)) {
        throw error;
      }
      const fallbackResult = await request<JsonRecord>('POST', `/webhooks/${input.webhookId}/test`, undefined, { idempotent: false });
      const legacy = parseWithSchema(webhookLegacyTestResponseSchema, fallbackResult, 'testWebhook legacy response');
      return {
        webhookId: input.webhookId,
        status: legacy.delivered ? 'delivered' : 'invalid_target',
        eventType: input.eventType,
        targetUrl: input.webhookUrl ?? null,
        sentAt: new Date().toISOString(),
      };
    }
  },

  listWebhooks: async (active?: boolean): Promise<WebhookResponse[]> => {
    const query = typeof active === 'boolean' ? `?active=${active}` : '';
    const result = await request<JsonRecord>('GET', `/webhooks${query}`, undefined, { idempotent: false });
    const items = Array.isArray(result.items) ? result.items : [];
    return items
      .filter(isRecord)
      .map((item) => parseWithSchema(webhookResponseSchema, item, 'listWebhooks item'))
      .map((item) => mapWebhook(item));
  },

  deleteWebhook: async (webhookId: string): Promise<void> => {
    await request('DELETE', `/webhooks/${webhookId}`);
  },

  rotateWebhookSecret: async (webhookId: string): Promise<WebhookSecretRotateResponse> => {
    const result = await request<JsonRecord>('POST', `/webhooks/${webhookId}/rotate-secret`, undefined, { idempotent: false });
    return {
      webhookId: String(result.webhookId ?? webhookId),
      previousSecretLast4: typeof result.previousSecretLast4 === 'string' ? result.previousSecretLast4 : '0000',
      newSecret: typeof result.newSecret === 'string' ? result.newSecret : generateToken('whsec'),
      rotatedAt: typeof result.rotatedAt === 'string' ? result.rotatedAt : new Date().toISOString(),
    };
  },

  getWebhookRetryQueue: async (): Promise<WebhookRetryItem[]> => {
    try {
      const result = await request<unknown>('GET', '/webhooks/retries', undefined, { idempotent: false });
      if (Array.isArray(result)) {
        return result.filter(isRecord).map((item) => ({
          id: String(item.id ?? generateToken('retry')),
          webhookId: String(item.webhookId ?? ''),
          eventType: typeof item.eventType === 'string' ? item.eventType : 'verification.completed',
          nextRetryAt: typeof item.nextRetryAt === 'string' ? item.nextRetryAt : new Date().toISOString(),
          attempt: Number(item.attempt ?? 1),
        }));
      }
      if (isRecord(result) && Array.isArray(result.items)) {
        return result.items.filter(isRecord).map((item) => ({
          id: String(item.id ?? generateToken('retry')),
          webhookId: String(item.webhookId ?? ''),
          eventType: typeof item.eventType === 'string' ? item.eventType : 'verification.completed',
          nextRetryAt: typeof item.nextRetryAt === 'string' ? item.nextRetryAt : new Date().toISOString(),
          attempt: Number(item.attempt ?? 1),
        }));
      }
      return [];
    } catch (error) {
      if (isBankingApiError(error) && error.status === 404) {
        return [];
      }
      throw error;
    }
  },

  createApiKey: async (data: ApiKeyCreateRequest): Promise<ApiKeyResponse> => {
    const payload = {
      keyName: data.keyName || data.name || 'Frontend Integration Key',
      permissions: data.permissions || data.scopes || ['kyc:write', 'kyc:read'],
      environment: data.environment || 'production',
      expiresAt: data.expiresAt || null,
      ipWhitelist: data.ipWhitelist ?? [],
      rateLimit: data.rateLimit ?? null,
    };
    const result = await request<JsonRecord>('POST', '/api-keys/create', payload, { allowBootstrapAdminToken: true });
    const mapped = mapApiKey(parseWithSchema(apiKeyResponseSchema, result, 'createApiKey response'));
    if (mapped.apiKey) {
      setBankingApiKey(mapped.apiKey);
    }
    return mapped;
  },

  listApiKeys: async (environment?: 'production' | 'sandbox'): Promise<ApiKeyResponse[]> => {
    const query = environment ? `?environment=${environment}` : '';
    const result = await request<JsonRecord>('GET', `/api-keys${query}`, undefined, { idempotent: false });
    const items = Array.isArray(result.items) ? result.items : [];
    return items
      .filter(isRecord)
      .map((item) => parseWithSchema(apiKeyResponseSchema, item, 'listApiKeys item'))
      .map((item) => mapApiKey(item));
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

  searchAuditTrail: async (filters: AuditExplorerFilters): Promise<AuditLogResponse[]> => {
    const query = new URLSearchParams(
      Object.entries({
        from: filters.from,
        to: filters.to,
        entity: filters.entity,
        eventType: filters.eventType,
      }).filter(([, value]) => Boolean(value)) as [string, string][],
    ).toString();
    const path = query ? `/audit/logs/search?${query}` : '/audit/logs/search';
    const result = await request<unknown>('GET', path, undefined, { idempotent: false });
    if (Array.isArray(result)) {
      return result.filter(isRecord).map(mapAuditLog);
    }
    if (isRecord(result) && Array.isArray(result.items)) {
      return result.items.filter(isRecord).map(mapAuditLog);
    }
    return [];
  },

  exportSignedAuditLogs: async (filters: AuditExplorerFilters): Promise<SignedAuditExportResponse> => {
    const result = await request<JsonRecord>('POST', '/audit/logs/export-signed', filters, { idempotent: false });
    return {
      exportId: String(result.exportId ?? generateToken('audit-export')),
      signature: typeof result.signature === 'string' ? result.signature : generateToken('sig'),
      downloadUrl: typeof result.downloadUrl === 'string' ? result.downloadUrl : undefined,
    };
  },

  getVerificationStats: async (params?: { startDate?: string; endDate?: string; groupBy?: 'day' | 'week' | 'month' }): Promise<VerificationStatsResponse> => {
    const query = new URLSearchParams(
      Object.entries({
        startDate: params?.startDate,
        endDate: params?.endDate,
        groupBy: params?.groupBy,
      }).filter(([, value]) => value !== undefined) as [string, string][],
    ).toString();
    const path = query ? `/analytics/verification-stats?${query}` : '/analytics/verification-stats';
    const result = await request<JsonRecord>('GET', path, undefined, { idempotent: false });
    return {
      totalVerifications: Number(result.totalVerifications || 0),
      approved: Number(result.approved || 0),
      rejected: Number(result.rejected || 0),
      pending: Number(result.pending || 0),
      manualReview: Number(result.manualReview || 0),
      averageTime:
        typeof result.averageTime === 'number'
          ? result.averageTime
          : typeof result.averageProcessingTime === 'number'
            ? result.averageProcessingTime
            : 0,
      averageProcessingTime: typeof result.averageProcessingTime === 'number' ? result.averageProcessingTime : undefined,
      successful: typeof result.successful === 'number' ? result.successful : Number(result.approved || 0),
      failed: typeof result.failed === 'number' ? result.failed : Number(result.rejected || 0),
      successRate: typeof result.successRate === 'number' ? result.successRate : undefined,
      dailyBreakdown: Array.isArray(result.dailyBreakdown) ? result.dailyBreakdown as VerificationStatsResponse['dailyBreakdown'] : [],
      breakdown: Array.isArray(result.breakdown) ? result.breakdown as VerificationStatsResponse['breakdown'] : undefined,
    };
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

  validateBulkOnboardingUpload: async (rows: Array<Record<string, unknown>>): Promise<BulkOnboardingValidationResponse> => {
    const result = await request<JsonRecord>('POST', '/onboarding/bulk/validate', { rows }, { idempotent: false });
    const issues = Array.isArray(result.issues) ? result.issues : [];
    return {
      validationId: String(result.validationId ?? generateToken('bulk-validation')),
      totalRows: Number(result.totalRows ?? rows.length),
      validRows: Number(result.validRows ?? rows.length),
      invalidRows: Number(result.invalidRows ?? 0),
      progress: Number(result.progress ?? 100),
      issues: issues.filter(isRecord).map((issue) => ({
        row: Number(issue.row ?? 0),
        field: typeof issue.field === 'string' ? issue.field : 'unknown',
        message: typeof issue.message === 'string' ? issue.message : 'Validation failed',
        severity: issue.severity === 'warning' ? 'warning' : 'error',
      })),
    };
  },

  importBulkOnboardingRows: async (rows: Array<Record<string, unknown>>): Promise<BulkOnboardingImportResponse> => {
    const result = await request<JsonRecord>('POST', '/onboarding/bulk/import', { rows }, { idempotent: false });
    return {
      importJobId: String(result.importJobId ?? generateToken('bulk-import')),
      acceptedRows: Number(result.acceptedRows ?? rows.length),
      rejectedRows: Number(result.rejectedRows ?? 0),
      status: (result.status as BulkOnboardingImportResponse['status']) || 'queued',
    };
  },

  getBulkOnboardingErrorReport: async (validationId: string): Promise<string> => {
    const result = await request<JsonRecord>('GET', `/onboarding/bulk/errors/${validationId}`, undefined, { idempotent: false });
    return typeof result.downloadUrl === 'string' ? result.downloadUrl : '';
  },

  getLicenseUsageMetrics: async (): Promise<LicenseUsageMetrics> => {
    try {
      const result = await request<JsonRecord>('GET', '/license/usage', undefined, { idempotent: false });
      const alerts = Array.isArray(result.anomalyAlerts) ? result.anomalyAlerts : [];
      return {
        planName: typeof result.planName === 'string' ? result.planName : 'Enterprise',
        currentPeriodStart: typeof result.currentPeriodStart === 'string' ? result.currentPeriodStart : new Date().toISOString(),
        currentPeriodEnd: typeof result.currentPeriodEnd === 'string' ? result.currentPeriodEnd : new Date().toISOString(),
        monthlyQuota: Number(result.monthlyQuota ?? 0),
        usedQuota: Number(result.usedQuota ?? 0),
        slaUptime: Number(result.slaUptime ?? 99.9),
        anomalyAlerts: alerts.filter(isRecord).map((alert) => ({
          id: String(alert.id ?? generateToken('alert')),
          message: typeof alert.message === 'string' ? alert.message : 'Quota anomaly detected',
          severity: alert.severity === 'high' || alert.severity === 'medium' ? alert.severity : 'low',
        })),
      };
    } catch (error) {
      if (isBankingApiError(error) && error.status === 404) {
        return {
          planName: 'Enterprise',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          monthlyQuota: 10000,
          usedQuota: 4200,
          slaUptime: 99.95,
          anomalyAlerts: [],
        };
      }
      throw error;
    }
  },

  changeLicensePlan: async (targetPlan: 'starter' | 'growth' | 'enterprise'): Promise<{ status: string }> => {
    try {
      const result = await request<JsonRecord>('POST', '/license/plan/change', { targetPlan }, { idempotent: false });
      return { status: typeof result.status === 'string' ? result.status : 'accepted' };
    } catch (error) {
      if (isBankingApiError(error) && error.status === 404) {
        return { status: 'accepted_offline' };
      }
      throw error;
    }
  },

  initiateBulkVerification: async (data: BulkVerificationRequest): Promise<BulkVerificationResponse> => {
    const payload = parseWithSchema(bulkVerificationRequestSchema, data, 'initiateBulkVerification request');
    const result = await request<unknown>('POST', '/bulk/verify', payload);
    return parseWithSchema(bulkVerificationResponseSchema, result, 'initiateBulkVerification response');
  },

  getCompanySettings: async (): Promise<CompanySettings> => {
    return request<CompanySettings>('GET', '/settings/company', undefined, { idempotent: false });
  },

  updateCompanySettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
    return request<CompanySettings>('PATCH', '/settings/company', data, { idempotent: false });
  },

  inviteTeamMember: async (payload: { email: string; role: string; message?: string }): Promise<{ invitationId: string; status: string }> => {
    try {
      const result = await request<JsonRecord>('POST', '/team/invitations', payload, { idempotent: false });
      return {
        invitationId: String(result.invitationId ?? result.id ?? generateToken('invite')),
        status: String(result.status ?? 'sent'),
      };
    } catch (error) {
      if (isBankingApiError(error) && error.status === 404) {
        return { invitationId: generateToken('invite'), status: 'queued' };
      }
      throw error;
    }
  },

  resendTeamInvitation: async (invitationId: string): Promise<InvitationLifecycleResponse> => {
    const result = await request<JsonRecord>('POST', `/team/invitations/${invitationId}/resend`, undefined, { idempotent: false });
    return {
      invitationId: String(result.invitationId ?? invitationId),
      status: String(result.status ?? 'sent'),
    };
  },

  acceptTeamInvitation: async (data: InvitationAcceptBody): Promise<InvitationLifecycleResponse> => {
    const result = await request<JsonRecord>('POST', '/team/invitations/accept', data, { idempotent: false });
    return {
      invitationId: String(result.invitationId ?? generateToken('invite')),
      status: String(result.status ?? 'accepted'),
    };
  },

  getApiSecuritySettings: async (): Promise<ApiSecuritySettings> => {
    const result = await request<JsonRecord>('GET', '/api/settings', undefined, { idempotent: false });
    return {
      autoRotateSecrets: Boolean(result.autoRotateSecrets),
      ipWhitelistEnabled: Boolean(result.ipWhitelistEnabled),
      allowedIps: Array.isArray(result.allowedIps) ? result.allowedIps.map(String) : [],
    };
  },

  updateApiSecuritySettings: async (data: ApiSecuritySettings): Promise<ApiSecuritySettings> => {
    const result = await request<JsonRecord>('PATCH', '/api/settings', data, { idempotent: false });
    return {
      autoRotateSecrets: Boolean(result.autoRotateSecrets),
      ipWhitelistEnabled: Boolean(result.ipWhitelistEnabled),
      allowedIps: Array.isArray(result.allowedIps) ? result.allowedIps.map(String) : [],
    };
  },

  getBillingPlans: async (): Promise<BillingPlan[]> => {
    const payload = await request<unknown>('GET', '/billing/plans', undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.filter(isRecord) as BillingPlan[];
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord) as BillingPlan[];
    return [];
  },

  createCheckoutSession: async (data: CheckoutSessionBody): Promise<CheckoutSessionResponse> => {
    const result = await request<JsonRecord>('POST', '/billing/checkout/session', data, { idempotent: false });
    return {
      checkoutSessionId: typeof result.checkoutSessionId === 'string' ? result.checkoutSessionId : undefined,
      checkoutUrl: String(result.checkoutUrl ?? ''),
      ...result,
    };
  },

  uploadCompanyLogo: async (file: File): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadMultipart<JsonRecord>('/settings/company/logo', formData);
    return {
      logoUrl: String(result.logoUrl ?? ''),
    };
  },

  exchangeMonoCode: async (data: MonoExchangeBody): Promise<MonoExchangeResponse> => {
    const result = await request<JsonRecord>('POST', '/account/mono/exchange', data, { idempotent: false });
    return {
      monoAccountId: String(result.monoAccountId ?? result.accountId ?? ''),
      status: typeof result.status === 'string' ? result.status : undefined,
      ...result,
    };
  },

  getMonoAccountDetails: async (monoAccountId: string): Promise<Record<string, unknown>> => {
    const result = await request<unknown>('GET', `/account/mono/${monoAccountId}/details`, undefined, { idempotent: false });
    return isRecord(result) ? result : {};
  },

  getMonoAccountIdentity: async (monoAccountId: string): Promise<Record<string, unknown>> => {
    const result = await request<unknown>('GET', `/account/mono/${monoAccountId}/identity`, undefined, { idempotent: false });
    return isRecord(result) ? result : {};
  },

  getMonoAccountTransactions: async (monoAccountId: string): Promise<Record<string, unknown>> => {
    const result = await request<unknown>('GET', `/account/mono/${monoAccountId}/transactions`, undefined, { idempotent: false });
    return isRecord(result) ? result : {};
  },

  verifyVoiceBiometrics: async (data: VoiceVerificationBody): Promise<BiometricVerificationResponse> => {
    const result = await request<JsonRecord>('POST', '/biometrics/voice-verification', data, { idempotent: false });
    return {
      verificationId: typeof result.verificationId === 'string' ? result.verificationId : undefined,
      status: String(result.status ?? 'review'),
      score: typeof result.score === 'number' ? result.score : undefined,
      privacyProof: isRecord(result.privacyProof) ? result.privacyProof : undefined,
      ...result,
    };
  },

  verifyBehavioralBiometrics: async (data: BehavioralBody): Promise<BiometricVerificationResponse> => {
    const result = await request<JsonRecord>('POST', '/biometrics/behavioral', data, { idempotent: false });
    return {
      sessionId: typeof result.sessionId === 'string' ? result.sessionId : undefined,
      status: String(result.status ?? 'ok'),
      riskScore: typeof result.riskScore === 'number' ? result.riskScore : undefined,
      privacyProof: isRecord(result.privacyProof) ? result.privacyProof : undefined,
      ...result,
    };
  },

  verifyFingerprintBiometrics: async (data: FingerprintBody): Promise<BiometricVerificationResponse> => {
    const result = await request<JsonRecord>('POST', '/biometrics/fingerprint', data, { idempotent: false });
    return {
      verificationId: typeof result.verificationId === 'string' ? result.verificationId : undefined,
      status: String(result.status ?? 'review'),
      score: typeof result.score === 'number' ? result.score : undefined,
      privacyProof: isRecord(result.privacyProof) ? result.privacyProof : undefined,
      ...result,
    };
  },

  verifyBusinessKyb: async (data: BusinessInfo): Promise<KybWorkflowResponse> => {
    return request<KybWorkflowResponse>('POST', '/kyb/business/verify', data, { idempotent: false });
  },

  runKybRegistryCheck: async (data: { businessRef: string }): Promise<KybWorkflowResponse> => {
    return request<KybWorkflowResponse>('POST', '/kyb/business/registry-check', data, { idempotent: false });
  },

  runKybOwnershipCheck: async (data: { businessRef: string }): Promise<KybWorkflowResponse> => {
    return request<KybWorkflowResponse>('POST', '/kyb/business/ownership', data, { idempotent: false });
  },

  runKybDirectorsCheck: async (data: KybDirectorsBody): Promise<KybWorkflowResponse> => {
    return request<KybWorkflowResponse>('POST', '/kyb/business/directors', data, { idempotent: false });
  },

  runKybFinancialHealth: async (data: KybFinancialHealthBody): Promise<KybWorkflowResponse> => {
    return request<KybWorkflowResponse>('POST', '/kyb/business/financial-health', data, { idempotent: false });
  },

  verifyKycIndividualEnhanced: async (data: KycIndividualEnhancedBody): Promise<IndividualKYCResponse> => {
    const result = await request<IndividualKYCVerifyApiData>('POST', '/kyc/individual/enhanced', data, { idempotent: false });
    const normalizedStatus = normalizeVerificationStatus(typeof result.status === 'string' ? result.status : 'pending', typeof result.overallResult === 'string' ? result.overallResult : undefined);
    return {
      verificationId: String(result.verificationId ?? result.id ?? ''),
      status: normalizedStatus === 'not_found' ? 'pending' : normalizedStatus,
      riskScore: 'low',
      createdAt: typeof result.createdAt === 'string' ? result.createdAt : toIsoNow(),
    };
  },

  submitKycIndividualBatch: async (data: KycBatchBody): Promise<KycBatchResponse> => {
    const result = await request<JsonRecord>('POST', '/kyc/individual/batch', data, { idempotent: false });
    return {
      batchId: String(result.batchId ?? generateToken('kyc-batch')),
      verificationIds: Array.isArray(result.verificationIds) ? result.verificationIds.map(String) : undefined,
      ...result,
    };
  },

  refreshKycIndividualVerification: async (verificationId: string): Promise<VerificationStatusResponse> => {
    const result = await request<IndividualKYCVerifyApiData>('POST', `/kyc/individual/${verificationId}/refresh`, undefined, { idempotent: false });
    return mapVerificationStatusResponse(result as JsonRecord);
  },

  verifyDidChallenge: async (data: DidVerifyBody): Promise<DidVerifyResponse> => {
    const result = await request<JsonRecord>('POST', '/did/verify', data, { idempotent: false });
    return {
      did: String(result.did ?? data.did),
      verified: Boolean(result.verified),
    };
  },

  issueDidCredentialAdvanced: async (data: CredentialIssueBody): Promise<CredentialIssueResponse> => {
    const result = await request<JsonRecord>('POST', '/did/credentials/issue', data, { idempotent: false });
    return {
      credentialId: String(result.credentialId ?? generateToken('cred')),
      status: String(result.status ?? 'issued'),
      credential: isRecord(result.credential) ? result.credential : undefined,
      ...result,
    };
  },

  getBlockchainProofByAnchor: async (anchorId: string): Promise<BlockchainProofByAnchorResponse> => {
    return request<BlockchainProofByAnchorResponse>('POST', '/blockchain/proof', { anchorId }, { idempotent: false });
  },

  getOngoingMonitoringStatus: async (customerId: string): Promise<OngoingMonitoringStatusResponse> => {
    return request<OngoingMonitoringStatusResponse>('GET', `/ongoing/${customerId}/status`, undefined, { idempotent: false });
  },

  getOngoingMonitoringChanges: async (customerId: string): Promise<OngoingMonitoringChangesResponse> => {
    const result = await request<unknown>('GET', `/ongoing/${customerId}/changes`, undefined, { idempotent: false });
    const toChangeItem = (item: JsonRecord) => ({
      changeId: String(item.changeId ?? item.id ?? generateToken('change')),
      changeType: String(item.changeType ?? item.type ?? 'update'),
      details: isRecord(item.details) ? item.details : undefined,
      detectedAt: String(item.detectedAt ?? item.createdAt ?? toIsoNow()),
    });
    if (Array.isArray(result)) {
      return { items: result.filter(isRecord).map(toChangeItem) };
    }
    if (isRecord(result) && Array.isArray(result.items)) {
      return { items: result.items.filter(isRecord).map(toChangeItem) };
    }
    return { items: [] };
  },

  createSarDraft: async (data: SarCreateBody): Promise<ComplianceCaseResponse> => {
    const result = await request<JsonRecord>('POST', '/compliance/sar/create', data, { idempotent: false });
    return {
      reportId: String(result.reportId ?? result.id ?? generateToken('sar')),
      status: String(result.status ?? 'draft'),
      ...result,
    };
  },

  submitSarReport: async (data: SarSubmitBody): Promise<ComplianceCaseResponse> => {
    const result = await request<JsonRecord>('POST', '/compliance/sar/submit', data, { idempotent: false });
    return {
      reportId: String(result.reportId ?? data.reportId),
      status: String(result.status ?? 'submitted'),
      ...result,
    };
  },

  createCtrDraft: async (data: CtrCreateBody): Promise<ComplianceCaseResponse> => {
    const result = await request<JsonRecord>('POST', '/compliance/ctr/create', data, { idempotent: false });
    return {
      reportId: String(result.reportId ?? result.id ?? generateToken('ctr')),
      status: String(result.status ?? 'draft'),
      ...result,
    };
  },

  checkPepFamilyAssociates: async (data: PepFamilyBody): Promise<PEPCheckResponse> => {
    const result = await request<PEPCheckApiData>('POST', '/screening/pep/family-associates', data, { idempotent: false });
    return {
      isPEP: result.status === 'potential_match' || Number(result.totalMatches || 0) > 0,
      details: result,
    };
  },

  getReportDetails: async (reportId: string): Promise<ReportDetailResponse> => {
    const result = await request<JsonRecord>('GET', `/reports/${reportId}`, undefined, { idempotent: false });
    return {
      reportId: String(result.reportId ?? reportId),
      reportType: String(result.reportType ?? 'verification_summary'),
      status: String(result.status ?? 'generating'),
      format: String(result.format ?? 'pdf'),
      downloadUrl: typeof result.downloadUrl === 'string' ? result.downloadUrl : null,
      createdAt: String(result.createdAt ?? toIsoNow()),
      updatedAt: String(result.updatedAt ?? toIsoNow()),
      readyAt: typeof result.readyAt === 'string' ? result.readyAt : null,
    };
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

  getUserVerificationsPage: async (params?: { status?: string; page?: number; limit?: number }): Promise<PagedResult<VerificationRequestResponse>> => {
    const query = buildQueryString({ status: params?.status, page: params?.page, limit: params?.limit });
    const payload = await request<unknown>('GET', `/user/verifications${query}`, undefined, { idempotent: false });
    return normalizePagedResult(payload, mapVerificationRequest);
  },

  getNotificationsPage: async (params?: { page?: number; limit?: number }): Promise<PagedResult<DashboardNotification>> => {
    const query = buildQueryString({ page: params?.page, limit: params?.limit });
    const payload = await request<unknown>('GET', `/notifications${query}`, undefined, { idempotent: false });
    return normalizePagedResult(payload, mapDashboardNotification);
  },

  getFraudTrends: async (params?: { range?: string }): Promise<FraudTrendPoint[]> => {
    const query = buildQueryString({ range: params?.range });
    const payload = await request<unknown>('GET', `/analytics/fraud-trends${query}`, undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.filter(isRecord).map(mapFraudTrendPoint);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord).map(mapFraudTrendPoint);
    return [];
  },

  getRiskDistribution: async (params?: { range?: string }): Promise<RiskDistributionItem[]> => {
    const query = buildQueryString({ range: params?.range });
    const payload = await request<unknown>('GET', `/analytics/risk-distribution${query}`, undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.filter(isRecord).map(mapRiskDistributionItem);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord).map(mapRiskDistributionItem);
    return [];
  },

  getComplianceMetrics: async (params?: { range?: string }): Promise<ComplianceMetric[]> => {
    const query = buildQueryString({ range: params?.range });
    const payload = await request<unknown>('GET', `/analytics/compliance-metrics${query}`, undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.filter(isRecord).map(mapComplianceMetric);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord).map(mapComplianceMetric);
    if (isRecord(payload) && isRecord(payload.metrics)) {
      return Object.entries(payload.metrics).map(([label, value]) => ({
        label,
        value: typeof value === 'number' ? value : Number(value || 0),
      }));
    }
    return [];
  },

  getGeographicalAnalytics: async (): Promise<GeoDistributionItem[]> => {
    const payload = await request<unknown>('GET', '/analytics/geographical', undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.filter(isRecord).map(mapGeoDistribution);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord).map(mapGeoDistribution);
    return [];
  },

  getProcessingTimes: async (params?: { range?: string }): Promise<ProcessingTimePoint[]> => {
    const query = buildQueryString({ range: params?.range });
    const payload = await request<unknown>('GET', `/analytics/processing-times${query}`, undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.filter(isRecord).map(mapProcessingTimePoint);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord).map(mapProcessingTimePoint);
    return [];
  },

  getHealth: async (): Promise<PrimitiveHealth> => {
    const payload = await request<JsonRecord>('GET', '/health', undefined, { idempotent: false });
    return {
      status: typeof payload.status === 'string' ? payload.status : 'ok',
      ready: payload.ready !== false,
      details: isRecord(payload.details) ? payload.details : undefined,
    };
  },

  getAdminAlerts: async (params?: { page?: number; limit?: number; status?: string }): Promise<PagedResult<DashboardNotification>> => {
    const query = buildQueryString({ page: params?.page, limit: params?.limit, status: params?.status });
    const payload = await request<unknown>('GET', `/admin/alerts${query}`, undefined, { idempotent: false });
    return normalizePagedResult(payload, mapDashboardNotification);
  },

  getOperationalAlerts: async (params?: { page?: number; limit?: number; status?: string }): Promise<PagedResult<DashboardNotification>> => {
    const query = buildQueryString({ page: params?.page, limit: params?.limit, status: params?.status });
    const payload = await request<unknown>('GET', `/alerts${query}`, undefined, { idempotent: false });
    return normalizePagedResult(payload, mapDashboardNotification);
  },

  getAlertDetails: async (alertId: string): Promise<DashboardNotification> => {
    const payload = await request<JsonRecord>('GET', `/alerts/${alertId}`, undefined, { idempotent: false });
    return mapDashboardNotification(payload);
  },

  investigateAlert: async (alertId: string, data?: Record<string, unknown>): Promise<{ status: string }> => {
    const payload = await request<JsonRecord>('POST', `/alerts/${alertId}/investigate`, data ?? {}, { idempotent: false });
    return { status: typeof payload.status === 'string' ? payload.status : 'investigating' };
  },

  resolveAlert: async (alertId: string, data?: Record<string, unknown>): Promise<{ status: string }> => {
    const payload = await request<JsonRecord>('POST', `/alerts/${alertId}/resolve`, data ?? {}, { idempotent: false });
    return { status: typeof payload.status === 'string' ? payload.status : 'resolved' };
  },

  recordConsent: async (data: Record<string, unknown>): Promise<ConsentRecord> => {
    const payload = await request<JsonRecord>('POST', '/privacy/consent/record', data, { idempotent: false });
    return {
      consentId: String(payload.consentId ?? payload.id ?? generateToken('consent')),
      customerId: String(payload.customerId ?? data.customerId ?? ''),
      type: String(payload.type ?? data.type ?? 'general'),
      status: String(payload.status ?? 'recorded'),
      recordedAt: String(payload.recordedAt ?? payload.createdAt ?? toIsoNow()),
      details: isRecord(payload.details) ? payload.details : undefined,
    };
  },

  getConsentHistory: async (customerId: string): Promise<ConsentRecord[]> => {
    const payload = await request<unknown>('GET', `/privacy/consent/${customerId}`, undefined, { idempotent: false });
    const items = Array.isArray(payload) ? payload : isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];
    return items.filter(isRecord).map((item) => ({
      consentId: String(item.consentId ?? item.id ?? generateToken('consent')),
      customerId: String(item.customerId ?? customerId),
      type: String(item.type ?? 'general'),
      status: String(item.status ?? 'recorded'),
      recordedAt: String(item.recordedAt ?? item.createdAt ?? toIsoNow()),
      details: isRecord(item.details) ? item.details : undefined,
    }));
  },

  requestDataExport: async (data: Record<string, unknown>): Promise<DataExportResponse> => {
    const payload = await request<JsonRecord>('POST', '/privacy/data-export', data, { idempotent: false });
    return {
      exportId: String(payload.exportId ?? payload.id ?? generateToken('export')),
      status: String(payload.status ?? 'queued'),
      downloadUrl: typeof payload.downloadUrl === 'string' ? payload.downloadUrl : undefined,
    };
  },

  requestDataDeletion: async (data: Record<string, unknown>): Promise<DataDeletionResponse> => {
    const payload = await request<JsonRecord>('POST', '/privacy/data-deletion', data, { idempotent: false });
    return {
      requestId: String(payload.requestId ?? payload.id ?? generateToken('delete')),
      status: String(payload.status ?? 'queued'),
    };
  },

  scheduleComplianceReport: async (data: Record<string, unknown>): Promise<ComplianceScheduleResponse> => {
    const payload = await request<JsonRecord>('POST', '/compliance/reports/schedule', data, { idempotent: false });
    return {
      scheduleId: String(payload.scheduleId ?? payload.id ?? generateToken('schedule')),
      status: String(payload.status ?? 'scheduled'),
      nextRunAt: typeof payload.nextRunAt === 'string' ? payload.nextRunAt : undefined,
    };
  },

  getComplianceReports: async (params?: { page?: number; limit?: number }): Promise<PagedResult<ComplianceReport>> => {
    const query = buildQueryString({ page: params?.page, limit: params?.limit });
    const payload = await request<unknown>('GET', `/compliance/reports${query}`, undefined, { idempotent: false });
    return normalizePagedResult(payload, (value) => value as unknown as ComplianceReport);
  },

  getVerificationView: async (verificationId: string): Promise<VerificationViewModel> => {
    const payload = await request<unknown>('GET', `/kyc/individual/${verificationId}`, undefined, { idempotent: false });
    return mapVerificationViewModel(payload);
  },

  generateZkProof: async (data: Record<string, unknown>): Promise<PrivacyProofSummary> => {
    const payload = await request<unknown>('POST', '/zk-proof/generate', data, { idempotent: false });
    return mapPrivacyProof(payload) ?? {
      proofId: generateToken('proof'),
      proofType: 'zk_proof',
      proofRole: 'primary',
      publicSignals: {},
      zkProof: null,
    };
  },

  verifyZkProof: async (data: Record<string, unknown>): Promise<ProofVerificationResponse> => {
    const payload = await request<JsonRecord>('POST', '/zk-proof/verify', data, { idempotent: false });
    return {
      valid: payload.valid !== false,
      proofId: typeof payload.proofId === 'string' ? payload.proofId : undefined,
      message: typeof payload.message === 'string' ? payload.message : undefined,
    };
  },

  getVerificationProof: async (verificationId: string): Promise<PrivacyProofSummary | null> => {
    const payload = await request<unknown>('GET', `/zk-proof/verification/${verificationId}`, undefined, { idempotent: false });
    return mapPrivacyProof(payload);
  },

  discloseProof: async (data: Record<string, unknown>): Promise<SelectiveDisclosureResponse> => {
    const payload = await request<JsonRecord>('POST', '/zk-proof/disclose', data, { idempotent: false });
    return {
      disclosureId: String(payload.disclosureId ?? payload.id ?? generateToken('disclose')),
      disclosedFields: Array.isArray(payload.disclosedFields) ? payload.disclosedFields.map(String) : [],
      payload: isRecord(payload.payload) ? payload.payload : {},
    };
  },

  getZkCircuits: async (): Promise<CircuitCatalogItem[]> => {
    const payload = await request<unknown>('GET', '/zk-proof/circuits', undefined, { idempotent: false });
    const items = Array.isArray(payload) ? payload : isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];
    return items.filter(isRecord).map((item) => ({
      circuitId: String(item.circuitId ?? item.id ?? 'unknown'),
      title: String(item.title ?? item.name ?? item.circuitId ?? 'Unnamed circuit'),
      description: typeof item.description === 'string' ? item.description : undefined,
      privateInputs: Array.isArray(item.privateInputs) ? item.privateInputs.map(String) : [],
      publicInputs: Array.isArray(item.publicInputs) ? item.publicInputs.map(String) : [],
      defaultDisclosureFields: Array.isArray(item.defaultDisclosureFields) ? item.defaultDisclosureFields.map(String) : [],
    }));
  },

  getNoirToolchainStatus: async (): Promise<NoirToolchainStatus> => {
    const payload = await request<JsonRecord>('GET', '/zk-proof/noir/toolchain', undefined, { idempotent: false });
    return {
      ready: payload.ready === true,
      runtime:
        payload.runtime === 'native' || payload.runtime === 'docker'
          ? payload.runtime
          : 'unknown',
      version: typeof payload.version === 'string' ? payload.version : undefined,
    };
  },

  generateNoirProof: async (data: Record<string, unknown>): Promise<PrivacyProofSummary> => {
    const payload = await request<unknown>('POST', '/zk-proof/noir/generate', data, { idempotent: false });
    return mapPrivacyProof(payload, 'claim') ?? {
      proofId: generateToken('noir'),
      proofType: 'noir_claim',
      proofRole: 'claim',
      publicSignals: {},
      zkProof: { backend: 'noir', circuitId: String(data.circuitId ?? 'unknown') },
    };
  },

  verifyNoirProof: async (data: Record<string, unknown>): Promise<ProofVerificationResponse> => {
    const payload = await request<JsonRecord>('POST', '/zk-proof/noir/verify', data, { idempotent: false });
    return {
      valid: payload.valid !== false,
      proofId: typeof payload.proofId === 'string' ? payload.proofId : undefined,
      message: typeof payload.message === 'string' ? payload.message : undefined,
    };
  },

  createBlockchainAnchor: async (data: Record<string, unknown>): Promise<BlockchainAnchorResponse> => {
    const payload = await request<JsonRecord>('POST', '/blockchain/anchor', data, { idempotent: false });
    return {
      anchorId: String(payload.anchorId ?? payload.id ?? generateToken('anchor')),
      transactionHash: String(payload.transactionHash ?? payload.hash ?? ''),
      status: String(payload.status ?? 'pending'),
      anchoredAt: typeof payload.anchoredAt === 'string' ? payload.anchoredAt : undefined,
    };
  },

  getBlockchainProof: async (verificationId: string): Promise<BlockchainAnchorResponse> => {
    const payload = await request<JsonRecord>('GET', `/blockchain/proof/${verificationId}`, undefined, { idempotent: false });
    return {
      anchorId: String(payload.anchorId ?? verificationId),
      transactionHash: String(payload.transactionHash ?? payload.hash ?? ''),
      status: String(payload.status ?? 'available'),
      anchoredAt: typeof payload.anchoredAt === 'string' ? payload.anchoredAt : undefined,
    };
  },

  createDid: async (data: Record<string, unknown>): Promise<DidRecord> => {
    const payload = await request<JsonRecord>('POST', '/did/create', data, { idempotent: false });
    return {
      did: String(payload.did ?? payload.id ?? ''),
      customerId: String(payload.customerId ?? data.customerId ?? ''),
      status: String(payload.status ?? 'created'),
      createdAt: String(payload.createdAt ?? toIsoNow()),
      document: isRecord(payload.document) ? payload.document : undefined,
    };
  },

  getDid: async (customerId: string): Promise<DidRecord> => {
    const payload = await request<JsonRecord>('GET', `/did/${customerId}`, undefined, { idempotent: false });
    return {
      did: String(payload.did ?? ''),
      customerId,
      status: String(payload.status ?? 'active'),
      createdAt: String(payload.createdAt ?? toIsoNow()),
      document: isRecord(payload.document) ? payload.document : undefined,
    };
  },

  getDidCredential: async (credentialId: string): Promise<CredentialRecord> => {
    const payload = await request<JsonRecord>('GET', `/did/credentials/${credentialId}`, undefined, { idempotent: false });
    return {
      credentialId: String(payload.credentialId ?? credentialId),
      type: String(payload.type ?? payload.credentialType ?? 'credential'),
      issuedAt: String(payload.issuedAt ?? payload.createdAt ?? toIsoNow()),
      status: String(payload.status ?? 'issued'),
      subjectDid: typeof payload.subjectDid === 'string' ? payload.subjectDid : undefined,
      issuerDid: typeof payload.issuerDid === 'string' ? payload.issuerDid : undefined,
      data: isRecord(payload.data) ? payload.data : undefined,
    };
  },

  listDidCredentials: async (customerId: string): Promise<CredentialRecord[]> => {
    const payload = await request<unknown>('GET', `/did/credentials/customer/${customerId}`, undefined, { idempotent: false });
    const items = Array.isArray(payload) ? payload : isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];
    return items.filter(isRecord).map((item) => ({
      credentialId: String(item.credentialId ?? item.id ?? generateToken('cred')),
      type: String(item.type ?? item.credentialType ?? 'credential'),
      issuedAt: String(item.issuedAt ?? item.createdAt ?? toIsoNow()),
      status: String(item.status ?? 'issued'),
      subjectDid: typeof item.subjectDid === 'string' ? item.subjectDid : undefined,
      issuerDid: typeof item.issuerDid === 'string' ? item.issuerDid : undefined,
      data: isRecord(item.data) ? item.data : undefined,
    }));
  },

  presentCredential: async (data: Record<string, unknown>): Promise<PresentationResponse> => {
    const payload = await request<JsonRecord>('POST', '/did/credentials/present', data, { idempotent: false });
    return {
      presentationId: String(payload.presentationId ?? payload.id ?? generateToken('presentation')),
      status: String(payload.status ?? 'created'),
      challenge: typeof payload.challenge === 'string' ? payload.challenge : undefined,
    };
  },

  verifyPresentedCredential: async (data: Record<string, unknown>): Promise<ProofVerificationResponse> => {
    const payload = await request<JsonRecord>('POST', '/did/credentials/verify', data, { idempotent: false });
    return {
      valid: payload.valid !== false,
      proofId: typeof payload.presentationId === 'string' ? payload.presentationId : undefined,
      message: typeof payload.message === 'string' ? payload.message : undefined,
    };
  },

  listMonitoringRules: async (): Promise<MonitoringRule[]> => {
    const payload = await request<unknown>('GET', '/monitoring/rules', undefined, { idempotent: false });
    const items = Array.isArray(payload) ? payload : isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];
    return items.filter(isRecord).map((item) => ({
      ruleId: String(item.ruleId ?? item.id ?? generateToken('rule')),
      name: String(item.name ?? 'Rule'),
      status: String(item.status ?? 'active'),
      severity: typeof item.severity === 'string' ? item.severity : undefined,
      conditions: isRecord(item.conditions) ? item.conditions : {},
      updatedAt: String(item.updatedAt ?? item.createdAt ?? toIsoNow()),
    }));
  },

  createMonitoringRule: async (data: Record<string, unknown>): Promise<MonitoringRule> => {
    const payload = await request<JsonRecord>('POST', '/monitoring/rules/create', data, { idempotent: false });
    return {
      ruleId: String(payload.ruleId ?? payload.id ?? generateToken('rule')),
      name: String(payload.name ?? data.name ?? 'Rule'),
      status: String(payload.status ?? 'active'),
      severity: typeof payload.severity === 'string' ? payload.severity : undefined,
      conditions: isRecord(payload.conditions) ? payload.conditions : {},
      updatedAt: String(payload.updatedAt ?? payload.createdAt ?? toIsoNow()),
    };
  },

  updateMonitoringRule: async (ruleId: string, data: Record<string, unknown>): Promise<MonitoringRule> => {
    const payload = await request<JsonRecord>('PATCH', `/monitoring/rules/${ruleId}`, data, { idempotent: false });
    return {
      ruleId,
      name: String(payload.name ?? data.name ?? 'Rule'),
      status: String(payload.status ?? 'active'),
      severity: typeof payload.severity === 'string' ? payload.severity : undefined,
      conditions: isRecord(payload.conditions) ? payload.conditions : {},
      updatedAt: String(payload.updatedAt ?? toIsoNow()),
    };
  },

  deleteMonitoringRule: async (ruleId: string): Promise<void> => {
    await request('DELETE', `/monitoring/rules/${ruleId}`, undefined, { idempotent: false });
  },

  listCases: async (params?: { page?: number; limit?: number; status?: string }): Promise<PagedResult<CaseRecord>> => {
    const query = buildQueryString({ page: params?.page, limit: params?.limit, status: params?.status });
    const payload = await request<unknown>('GET', `/cases${query}`, undefined, { idempotent: false });
    return normalizePagedResult(payload, (item) => ({
      caseId: String(item.caseId ?? item.id ?? generateToken('case')),
      status: String(item.status ?? 'open'),
      priority: String(item.priority ?? 'medium'),
      title: String(item.title ?? item.subject ?? 'Case'),
      assignedTo: typeof item.assignedTo === 'string' ? item.assignedTo : undefined,
      updatedAt: String(item.updatedAt ?? item.createdAt ?? toIsoNow()),
      details: isRecord(item.details) ? item.details : undefined,
    }));
  },

  createCase: async (data: Record<string, unknown>): Promise<CaseRecord> => {
    const payload = await request<JsonRecord>('POST', '/cases/create', data, { idempotent: false });
    return {
      caseId: String(payload.caseId ?? payload.id ?? generateToken('case')),
      status: String(payload.status ?? 'open'),
      priority: String(payload.priority ?? data.priority ?? 'medium'),
      title: String(payload.title ?? data.title ?? 'Case'),
      assignedTo: typeof payload.assignedTo === 'string' ? payload.assignedTo : undefined,
      updatedAt: String(payload.updatedAt ?? payload.createdAt ?? toIsoNow()),
      details: isRecord(payload.details) ? payload.details : undefined,
    };
  },

  getCase: async (caseId: string): Promise<CaseRecord> => {
    const payload = await request<JsonRecord>('GET', `/cases/${caseId}`, undefined, { idempotent: false });
    return {
      caseId,
      status: String(payload.status ?? 'open'),
      priority: String(payload.priority ?? 'medium'),
      title: String(payload.title ?? payload.subject ?? 'Case'),
      assignedTo: typeof payload.assignedTo === 'string' ? payload.assignedTo : undefined,
      updatedAt: String(payload.updatedAt ?? payload.createdAt ?? toIsoNow()),
      details: isRecord(payload.details) ? payload.details : undefined,
    };
  },

  updateCase: async (caseId: string, data: Record<string, unknown>): Promise<CaseRecord> => {
    const payload = await request<JsonRecord>('PATCH', `/cases/${caseId}`, data, { idempotent: false });
    return {
      caseId,
      status: String(payload.status ?? 'open'),
      priority: String(payload.priority ?? data.priority ?? 'medium'),
      title: String(payload.title ?? data.title ?? 'Case'),
      assignedTo: typeof payload.assignedTo === 'string' ? payload.assignedTo : undefined,
      updatedAt: String(payload.updatedAt ?? toIsoNow()),
      details: isRecord(payload.details) ? payload.details : undefined,
    };
  },

  assignCase: async (caseId: string, assigneeId: string): Promise<{ status: string }> => {
    const payload = await request<JsonRecord>('POST', `/cases/${caseId}/assign`, { assigneeId }, { idempotent: false });
    return { status: String(payload.status ?? 'assigned') };
  },

  closeCase: async (caseId: string, data?: Record<string, unknown>): Promise<{ status: string }> => {
    const payload = await request<JsonRecord>('POST', `/cases/${caseId}/close`, data ?? {}, { idempotent: false });
    return { status: String(payload.status ?? 'closed') };
  },

  getDocumentSupportedTypes: async (country?: string): Promise<string[]> => {
    const query = buildQueryString({ country });
    const payload = await request<unknown>('GET', `/documents/supported-types${query}`, undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.map(String);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.map(String);
    return [];
  },

  classifyDocument: async (data: Record<string, unknown>): Promise<{ documentType: string; confidence: number }> => {
    const payload = await request<JsonRecord>('POST', '/documents/classify', data, { idempotent: false });
    return {
      documentType: String(payload.documentType ?? payload.type ?? 'unknown'),
      confidence: Number(payload.confidence ?? 0),
    };
  },

  compareDocuments: async (data: Record<string, unknown>): Promise<{ matched: boolean; differences: string[] }> => {
    const payload = await request<JsonRecord>('POST', '/documents/compare', data, { idempotent: false });
    return {
      matched: payload.matched !== false,
      differences: Array.isArray(payload.differences) ? payload.differences.map(String) : [],
    };
  },

  checkAdverseMedia: async (data: Record<string, unknown>): Promise<SanctionsCheckResponse> => {
    const payload = await request<JsonRecord>('POST', '/screening/adverse-media/check', data, { idempotent: false });
    const matches = Array.isArray(payload.matches) ? payload.matches : [];
    return {
      matchFound: matches.length > 0 || payload.status === 'potential_match',
      hits: matches.filter(isRecord),
    };
  },

  listSanctionsLists: async (): Promise<string[]> => {
    const payload = await request<unknown>('GET', '/screening/sanctions/lists', undefined, { idempotent: false });
    if (Array.isArray(payload)) return payload.map(String);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.map(String);
    return [];
  },

  toggleOngoingScreening: async (screeningType: 'sanctions' | 'pep' | 'adverse-media', customerId: string, active: boolean): Promise<MonitoringToggleResponse> => {
    const payload = await request<JsonRecord>('POST', `/screening/${screeningType}/ongoing`, { customerId, active }, { idempotent: false });
    return {
      customerId,
      active: payload.active === undefined ? active : Boolean(payload.active),
      monitoringType: screeningType,
      updatedAt: String(payload.updatedAt ?? toIsoNow()),
    };
  },

  verifyBankAccount: async (data: Record<string, unknown>): Promise<AccountVerificationResponse> => {
    const payload = await request<JsonRecord>('POST', '/account/verify', data, { idempotent: false });
    return {
      verificationId: String(payload.verificationId ?? payload.id ?? generateToken('acct')),
      status: String(payload.status ?? 'pending'),
      accountName: typeof payload.accountName === 'string' ? payload.accountName : undefined,
      bankName: typeof payload.bankName === 'string' ? payload.bankName : undefined,
      confidence: typeof payload.confidence === 'number' ? payload.confidence : undefined,
    };
  },

  instantVerifyBankAccount: async (data: Record<string, unknown>): Promise<AccountVerificationResponse> => {
    const payload = await request<JsonRecord>('POST', '/account/instant-verify', data, { idempotent: false });
    return {
      verificationId: String(payload.verificationId ?? payload.id ?? generateToken('acct')),
      status: String(payload.status ?? 'verified'),
      accountName: typeof payload.accountName === 'string' ? payload.accountName : undefined,
      bankName: typeof payload.bankName === 'string' ? payload.bankName : undefined,
      confidence: typeof payload.confidence === 'number' ? payload.confidence : undefined,
    };
  },

  verifyMicroDeposits: async (data: Record<string, unknown>): Promise<AccountVerificationResponse> => {
    const payload = await request<JsonRecord>('POST', '/account/micro-deposits', data, { idempotent: false });
    return {
      verificationId: String(payload.verificationId ?? payload.id ?? generateToken('acct')),
      status: String(payload.status ?? 'pending'),
      accountName: typeof payload.accountName === 'string' ? payload.accountName : undefined,
      bankName: typeof payload.bankName === 'string' ? payload.bankName : undefined,
      confidence: typeof payload.confidence === 'number' ? payload.confidence : undefined,
    };
  },

  screenTransaction: async (data: Record<string, unknown>): Promise<TransactionMonitoringResponse> => {
    const payload = await request<JsonRecord>('POST', '/transactions/screen', data, { idempotent: false });
    const decision = String(payload.decision ?? 'approve');
    return {
      isSuspicious: decision !== 'approve',
      riskScore: Number(payload.riskScore ?? payload.transactionRiskScore ?? 0),
      action: decision === 'block' ? 'block' : decision === 'manual_review' ? 'manual_review' : 'approve',
    };
  },

  enableOngoingMonitoring: async (customerId: string): Promise<MonitoringToggleResponse> => {
    const payload = await request<JsonRecord>('POST', '/ongoing/enable', { customerId }, { idempotent: false });
    return {
      customerId,
      active: payload.active === undefined ? true : Boolean(payload.active),
      monitoringType: typeof payload.monitoringType === 'string' ? payload.monitoringType : undefined,
      updatedAt: String(payload.updatedAt ?? toIsoNow()),
    };
  },

  disableOngoingMonitoring: async (customerId: string): Promise<MonitoringToggleResponse> => {
    const payload = await request<JsonRecord>('POST', '/ongoing/disable', { customerId }, { idempotent: false });
    return {
      customerId,
      active: payload.active === undefined ? false : Boolean(payload.active),
      monitoringType: typeof payload.monitoringType === 'string' ? payload.monitoringType : undefined,
      updatedAt: String(payload.updatedAt ?? toIsoNow()),
    };
  },

  getDueReviews: async (): Promise<DueReviewItem[]> => {
    const payload = await request<unknown>('GET', '/ongoing/due-reviews', undefined, { idempotent: false });
    const items = Array.isArray(payload) ? payload : isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];
    return items.filter(isRecord).map((item) => ({
      id: String(item.id ?? generateToken('review')),
      customerId: String(item.customerId ?? ''),
      dueAt: String(item.dueAt ?? item.reviewAt ?? toIsoNow()),
      reason: String(item.reason ?? 'Periodic review'),
      status: String(item.status ?? 'due'),
    }));
  },

  addWatchlistEntry: async (data: Record<string, unknown>): Promise<WatchlistEntry> => {
    const payload = await request<JsonRecord>('POST', '/watchlist/add', data, { idempotent: false });
    return {
      id: String(payload.id ?? generateToken('watch')),
      customerId: String(payload.customerId ?? data.customerId ?? ''),
      status: String(payload.status ?? 'active'),
      reason: typeof payload.reason === 'string' ? payload.reason : typeof data.reason === 'string' ? data.reason : undefined,
      createdAt: String(payload.createdAt ?? toIsoNow()),
    };
  },

  getWatchlist: async (): Promise<WatchlistEntry[]> => {
    const payload = await request<unknown>('GET', '/watchlist', undefined, { idempotent: false });
    const items = Array.isArray(payload) ? payload : isRecord(payload) && Array.isArray(payload.items) ? payload.items : [];
    return items.filter(isRecord).map((item) => ({
      id: String(item.id ?? generateToken('watch')),
      customerId: String(item.customerId ?? ''),
      status: String(item.status ?? 'active'),
      reason: typeof item.reason === 'string' ? item.reason : undefined,
      createdAt: String(item.createdAt ?? toIsoNow()),
    }));
  },

  verifySourceOfFunds: async (data: Record<string, unknown>): Promise<SourceOfFundsResponse> => {
    const payload = await request<JsonRecord>('POST', '/source-of-funds/verify', data, { idempotent: false });
    return {
      verificationId: String(payload.verificationId ?? payload.id ?? generateToken('sof')),
      status: String(payload.status ?? 'pending'),
      riskLevel: typeof payload.riskLevel === 'string' ? payload.riskLevel : undefined,
      summary: typeof payload.summary === 'string' ? payload.summary : undefined,
    };
  },

  analyzeSourceOfFunds: async (data: Record<string, unknown>): Promise<SourceOfFundsResponse> => {
    const payload = await request<JsonRecord>('POST', '/source-of-funds/analyze', data, { idempotent: false });
    return {
      verificationId: String(payload.verificationId ?? payload.id ?? generateToken('sof')),
      status: String(payload.status ?? 'completed'),
      riskLevel: typeof payload.riskLevel === 'string' ? payload.riskLevel : undefined,
      summary: typeof payload.summary === 'string' ? payload.summary : undefined,
    };
  },

  verifySourceOfWealth: async (data: Record<string, unknown>): Promise<SourceOfFundsResponse> => {
    const payload = await request<JsonRecord>('POST', '/source-of-wealth/verify', data, { idempotent: false });
    return {
      verificationId: String(payload.verificationId ?? payload.id ?? generateToken('sow')),
      status: String(payload.status ?? 'pending'),
      riskLevel: typeof payload.riskLevel === 'string' ? payload.riskLevel : undefined,
      summary: typeof payload.summary === 'string' ? payload.summary : undefined,
    };
  },

  getSourceOfWealthAssessment: async (customerId: string): Promise<SourceOfWealthAssessment> => {
    const payload = await request<JsonRecord>('GET', `/source-of-wealth/${customerId}/assessment`, undefined, { idempotent: false });
    return {
      customerId,
      riskLevel: String(payload.riskLevel ?? 'low'),
      summary: String(payload.summary ?? ''),
      factors: Array.isArray(payload.factors) ? payload.factors.map(String) : [],
    };
  },

  runCreditCheck: async (data: Record<string, unknown>): Promise<CreditCheckResponse> => {
    const payload = await request<JsonRecord>('POST', '/credit/check', data, { idempotent: false });
    return {
      checkId: String(payload.checkId ?? payload.id ?? generateToken('credit')),
      status: String(payload.status ?? 'completed'),
      score: typeof payload.score === 'number' ? payload.score : undefined,
      provider: typeof payload.provider === 'string' ? payload.provider : undefined,
    };
  },

  getCreditScore: async (data: Record<string, unknown>): Promise<CreditCheckResponse> => {
    const payload = await request<JsonRecord>('POST', '/credit/score', data, { idempotent: false });
    return {
      checkId: String(payload.checkId ?? payload.id ?? generateToken('credit')),
      status: String(payload.status ?? 'completed'),
      score: typeof payload.score === 'number' ? payload.score : undefined,
      provider: typeof payload.provider === 'string' ? payload.provider : undefined,
    };
  },

  translateText: async (data: Record<string, unknown>): Promise<TranslationResponse> => {
    const payload = await request<JsonRecord>('POST', '/translation/text', data, { idempotent: false });
    return {
      translatedText: String(payload.translatedText ?? payload.text ?? ''),
      sourceLanguage: typeof payload.sourceLanguage === 'string' ? payload.sourceLanguage : undefined,
      targetLanguage: typeof payload.targetLanguage === 'string' ? payload.targetLanguage : undefined,
    };
  },

  translateDocument: async (data: Record<string, unknown>): Promise<TranslationResponse> => {
    const payload = await request<JsonRecord>('POST', '/translation/document', data, { idempotent: false });
    return {
      translatedText: String(payload.translatedText ?? payload.text ?? ''),
      sourceLanguage: typeof payload.sourceLanguage === 'string' ? payload.sourceLanguage : undefined,
      targetLanguage: typeof payload.targetLanguage === 'string' ? payload.targetLanguage : undefined,
    };
  },

  convertCurrency: async (data: { sourceCurrency: string; targetCurrency: string; amount: number }): Promise<CurrencyConversionResponse> => {
    const payload = await request<JsonRecord>('POST', '/localization/currency-convert', data, { idempotent: false });
    return {
      sourceCurrency: data.sourceCurrency,
      targetCurrency: data.targetCurrency,
      sourceAmount: data.amount,
      convertedAmount: Number(payload.convertedAmount ?? payload.amount ?? 0),
      rate: Number(payload.rate ?? 0),
    };
  },

  getCountryRegulations: async (country: string): Promise<CountryRegulationResponse> => {
    const payload = await request<unknown>('GET', `/localization/regulations/${country}`, undefined, { idempotent: false });
    const regulations = Array.isArray(payload)
      ? payload
      : isRecord(payload) && Array.isArray(payload.items)
        ? payload.items
        : isRecord(payload) && Array.isArray(payload.regulations)
          ? payload.regulations
          : [];
    return {
      country,
      regulations: regulations.filter(isRecord).map((item) => ({
        id: String(item.id ?? generateToken('reg')),
        title: String(item.title ?? item.name ?? 'Regulation'),
        summary: String(item.summary ?? item.description ?? ''),
        category: typeof item.category === 'string' ? item.category : undefined,
      })),
    };
  },

  generateSandboxTestData: async (data?: Record<string, unknown>): Promise<SandboxSeedResponse> => {
    const payload = await request<JsonRecord>('POST', '/sandbox/generate-test-data', data ?? {}, { idempotent: false });
    return {
      batchId: String(payload.batchId ?? payload.id ?? generateToken('sandbox')),
      recordsCreated: Number(payload.recordsCreated ?? payload.count ?? 0),
      status: String(payload.status ?? 'completed'),
    };
  },

  getPrimitiveHealth: async (): Promise<PrimitiveHealth> => {
    const payload = await primitiveRequest<JsonRecord>('GET', '/verification/health');
    return {
      status: typeof payload.status === 'string' ? payload.status : 'ok',
      ready: payload.ready !== false,
      details: isRecord(payload.details) ? payload.details : undefined,
    };
  },

  getPrimitiveCameras: async (): Promise<Array<Record<string, unknown>>> => {
    const payload = await primitiveRequest<unknown>('GET', '/verification/cameras');
    if (Array.isArray(payload)) return payload.filter(isRecord);
    if (isRecord(payload) && Array.isArray(payload.items)) return payload.items.filter(isRecord);
    return [];
  },

  getPrimitiveConfig: async (): Promise<Record<string, unknown>> => {
    const payload = await primitiveRequest<unknown>('GET', '/verification/config');
    return isRecord(payload) ? payload : {};
  },

  getPrimitiveProxyToken: async (data?: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const payload = await primitiveRequest<unknown>('POST', '/verification/proxy/token', data ?? {});
    return isRecord(payload) ? payload : {};
  },

  getPrimitiveModelStatus: async (): Promise<PrimitiveModelStatus> => {
    const payload = await primitiveRequest<JsonRecord>('GET', '/verification/model/status');
    return {
      status: String(payload.status ?? 'unknown'),
      loaded: payload.loaded === true,
      modelVersion: typeof payload.modelVersion === 'string' ? payload.modelVersion : undefined,
    };
  },

  reloadPrimitiveModel: async (): Promise<PrimitiveModelStatus> => {
    const payload = await primitiveRequest<JsonRecord>('POST', '/verification/model/reload', {});
    return {
      status: String(payload.status ?? 'reloading'),
      loaded: payload.loaded === true,
      modelVersion: typeof payload.modelVersion === 'string' ? payload.modelVersion : undefined,
    };
  },

  issueCredential: async (data: CredentialIssuanceRequest): Promise<CredentialIssuanceResponse> => {
    return request<CredentialIssuanceResponse>('POST', '/verifier/issue-credential', data);
  }
};
