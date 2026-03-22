import { bankingService } from '@/services/bankingService';
import type {
  ApiKeyCreateRequest,
  ApiKeyCreateResult,
  ApiKeyListItem,
  ApiKeyRevokeResult,
  ApiKeyResponse,
  WebhookDeleteResult,
  WebhookRegisterRequest,
  WebhookRegisterResult,
  WebhookResponse,
  WebhookTestRequest,
  WebhookTestResponse,
} from '@/types/banking';

export interface DashboardEndpointMapping {
  method: 'GET' | 'POST' | 'DELETE';
  endpoint: string;
  pages: Array<'ApiManagement' | 'Integrations' | 'VerificationTools' | 'ApiDocumentation'>;
  permission: string;
}

export const apiManagementEndpointMappings: DashboardEndpointMapping[] = [
  { method: 'POST', endpoint: '/api/v1/banking/api-keys/create', pages: ['ApiManagement'], permission: 'api_keys:write' },
  { method: 'GET', endpoint: '/api/v1/banking/api-keys', pages: ['ApiManagement'], permission: 'api_keys:read' },
  { method: 'DELETE', endpoint: '/api/v1/banking/api-keys/{keyId}', pages: ['ApiManagement'], permission: 'api_keys:write' },
  { method: 'POST', endpoint: '/api/v1/banking/webhooks/register', pages: ['ApiManagement', 'Integrations', 'VerificationTools'], permission: 'webhooks:write' },
  { method: 'GET', endpoint: '/api/v1/banking/webhooks', pages: ['ApiManagement', 'Integrations', 'VerificationTools'], permission: 'webhooks:read' },
  { method: 'DELETE', endpoint: '/api/v1/banking/webhooks/{webhookId}', pages: ['ApiManagement', 'Integrations'], permission: 'webhooks:write' },
  { method: 'POST', endpoint: '/api/v1/banking/webhooks/test', pages: ['ApiManagement', 'VerificationTools'], permission: 'webhooks:write' },
];

const toApiKeyCreateResult = (result: ApiKeyResponse): ApiKeyCreateResult => ({
  keyId: result.keyId || result.id,
  apiKey: result.apiKey || '',
  permissions: result.permissions || result.scopes,
  createdAt: result.createdAt,
  expiresAt: result.expiresAt ?? null,
});

export const apiKeysService = {
  create: async (payload: ApiKeyCreateRequest): Promise<ApiKeyCreateResult> => {
    const created = await bankingService.createApiKey(payload);
    return toApiKeyCreateResult(created);
  },
  list: async (): Promise<ApiKeyListItem[]> => bankingService.listApiKeys(),
  revoke: async (keyId: string): Promise<ApiKeyRevokeResult> => {
    await bankingService.revokeApiKey(keyId);
    return {
      keyId,
      revoked: true,
      revokedAt: new Date().toISOString(),
    };
  },
};

export const webhooksService = {
  register: async (payload: WebhookRegisterRequest): Promise<WebhookRegisterResult> => {
    const created = await bankingService.registerWebhook(payload);
    return {
      webhookId: created.webhookId || created.id,
      status: created.isActive ? 'active' : 'inactive',
      createdAt: created.createdAt,
    };
  },
  list: async (active?: boolean): Promise<WebhookResponse[]> => bankingService.listWebhooks(active),
  delete: async (webhookId: string): Promise<WebhookDeleteResult> => {
    await bankingService.deleteWebhook(webhookId);
    return {
      webhookId,
      deleted: true,
      deletedAt: new Date().toISOString(),
    };
  },
  test: async (payload: WebhookTestRequest): Promise<WebhookTestResponse> => bankingService.testWebhook(payload),
};
