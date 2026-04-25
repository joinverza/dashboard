import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Code,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Plus,
  RefreshCw,
  Server,
  Settings2,
  Shield,
  Trash2,
  Webhook
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ApiErrorBoundary } from '@/components/shared/ApiErrorBoundary';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import BackButton from '@/components/shared/BackButton';
import { useAuth } from '@/features/auth/AuthContext';
import { BANKING_REQUEST_DIAGNOSTIC_EVENT, getBankingErrorMessage } from '@/services/bankingService';
import { bankingService } from '@/services/bankingService';
import { apiKeysService, apiManagementEndpointMappings, webhooksService } from '@/services/apiManagementService';
import type { ApiKeyResponse, ApiSecuritySettings, BankingRequestDiagnosticEvent, WebhookResponse } from '@/types/banking';

const REQUEST_HISTORY_STORAGE_KEY = 'verza:banking:requestHistory';
const API_SETTINGS_STORAGE_KEY = 'verza:api:settings';
type ApiKeyEnvironment = 'production' | 'sandbox';
type ApiKeyFilter = 'all' | ApiKeyEnvironment;

export default function ApiManagement() {
  const { user, hasPermission } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [filteredApiKeys, setFilteredApiKeys] = useState<ApiKeyResponse[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [pageError, setPageError] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isDeletingWebhookId, setIsDeletingWebhookId] = useState<string | null>(null);
  const [isDeletingKeyId, setIsDeletingKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [isSubmittingWebhook, setIsSubmittingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [apiKeyFilter, setApiKeyFilter] = useState<ApiKeyFilter>('all');
  const [createKeyEnvironment, setCreateKeyEnvironment] = useState<ApiKeyEnvironment | null>(null);
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [rawApiKey, setRawApiKey] = useState('');
  const [latestCreatedKeyPrefix, setLatestCreatedKeyPrefix] = useState('');
  const [latestCreatedKeyEnvironment, setLatestCreatedKeyEnvironment] = useState<ApiKeyEnvironment>('production');
  const [isRevealDialogOpen, setIsRevealDialogOpen] = useState(false);
  const [hasConfirmedCopy, setHasConfirmedCopy] = useState(false);
  const [rawApiKeyExpiresAt, setRawApiKeyExpiresAt] = useState<number | null>(null);
  const [requestHistory, setRequestHistory] = useState<BankingRequestDiagnosticEvent[]>([]);
  const [autoRotateSecrets, setAutoRotateSecrets] = useState(false);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false);
  const [allowedIps, setAllowedIps] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isTestingWebhookId, setIsTestingWebhookId] = useState<string | null>(null);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isRetryingRequestId, setIsRetryingRequestId] = useState<string | null>(null);
  const [isCancellingRequestId, setIsCancellingRequestId] = useState<string | null>(null);

  useEffect(() => {
    void loadData(apiKeyFilter);
  }, [apiKeyFilter]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(REQUEST_HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BankingRequestDiagnosticEvent[];
      if (Array.isArray(parsed)) {
        setRequestHistory(parsed.slice(0, 80));
      }
    } catch {
      setRequestHistory([]);
    }
  }, []);

  useEffect(() => {
    const onDiagnosticEvent = (event: Event) => {
      const detail = (event as CustomEvent<BankingRequestDiagnosticEvent>).detail;
      if (!detail) return;
      setRequestHistory((current) => {
        const next = [detail, ...current].slice(0, 80);
        window.localStorage.setItem(REQUEST_HISTORY_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    };
    window.addEventListener(BANKING_REQUEST_DIAGNOSTIC_EVENT, onDiagnosticEvent);
    return () => {
      window.removeEventListener(BANKING_REQUEST_DIAGNOSTIC_EVENT, onDiagnosticEvent);
    };
  }, []);

  useEffect(() => {
    if (!rawApiKey || !rawApiKeyExpiresAt) return;
    const timeoutMs = Math.max(0, rawApiKeyExpiresAt - Date.now());
    const timeoutId = window.setTimeout(() => {
      setRawApiKey('');
      setRawApiKeyExpiresAt(null);
    }, timeoutMs);
    return () => window.clearTimeout(timeoutId);
  }, [rawApiKey, rawApiKeyExpiresAt]);

  useEffect(() => {
    void loadApiSettings();
  }, []);

  const loadApiSettings = async () => {
    try {
      const response = await bankingService.getApiSecuritySettings();
      setAutoRotateSecrets(response.autoRotateSecrets);
      setIpWhitelistEnabled(response.ipWhitelistEnabled);
      setAllowedIps((response.allowedIps || []).join(', '));
      return;
    } catch {
      try {
        const raw = window.localStorage.getItem(API_SETTINGS_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as { autoRotateSecrets?: boolean; ipWhitelistEnabled?: boolean; allowedIps?: string[] };
        setAutoRotateSecrets(Boolean(parsed.autoRotateSecrets));
        setIpWhitelistEnabled(Boolean(parsed.ipWhitelistEnabled));
        setAllowedIps(Array.isArray(parsed.allowedIps) ? parsed.allowedIps.join(', ') : '');
      } catch {
        setAutoRotateSecrets(false);
        setIpWhitelistEnabled(false);
        setAllowedIps('');
      }
    }
  };

  const loadData = async (filter: ApiKeyFilter) => {
    setIsLoadingData(true);
    setPageError('');
    try {
      const environmentFilter = filter === 'all' ? undefined : filter;
      const [allKeys, keysByFilter, hooks] = await Promise.all([
        apiKeysService.list(),
        apiKeysService.list(environmentFilter),
        webhooksService.list()
      ]);
      setApiKeys(allKeys);
      setFilteredApiKeys(keysByFilter);
      setWebhooks(hooks);
    } catch (error) {
      const message = getBankingErrorMessage(error, 'Failed to load API management data');
      setPageError(message);
      toast.error(message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const isValidUrl = (value: string): boolean => {
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleCreateKey = async () => {
    const trimmedName = newKeyName.trim();
    if (!trimmedName || trimmedName.length > 128) {
      toast.error('Key name must be 1-128 characters');
      return;
    }
    if (!createKeyEnvironment) {
      toast.error('Select an environment before creating the key');
      return;
    }
    setIsCreatingKey(true);
    try {
      const created = await apiKeysService.create({
        keyName: trimmedName,
        environment: createKeyEnvironment,
        permissions: ['api_keys:read', 'api_keys:write', 'webhooks:read', 'webhooks:write']
      });
      setNewKeyName('');
      setIsCreateKeyDialogOpen(false);
      await loadData(apiKeyFilter);
      toast.success('API Key created successfully');
      if (created.apiKey) {
        setRawApiKey(created.apiKey);
        setLatestCreatedKeyPrefix(created.keyPrefix || '');
        setLatestCreatedKeyEnvironment(created.environment || createKeyEnvironment);
        setHasConfirmedCopy(false);
        setIsRevealDialogOpen(true);
        setRawApiKeyExpiresAt(Date.now() + 30000);
      }
    } catch (error) {
      const message = getBankingErrorMessage(error, 'Failed to create API key');
      const rateLimited = /429|rate limit/i.test(message);
      toast.error(rateLimited ? 'Rate limit reached. Please wait and try again in a moment.' : message);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    setIsDeletingKeyId(id);
    try {
      await apiKeysService.revoke(id);
      setApiKeys((current) => current.filter((item) => item.id !== id));
      setFilteredApiKeys((current) => current.filter((item) => item.id !== id));
      toast.success('API Key revoked');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to revoke API key'));
    } finally {
      setIsDeletingKeyId(null);
    }
  };

  const handleCreateWebhook = async () => {
    if (!isValidUrl(newWebhookUrl)) {
      toast.error('Enter a valid webhook URL');
      return;
    }
    setIsSubmittingWebhook(true);
    try {
      await webhooksService.register({
        url: newWebhookUrl.trim(),
        events: newWebhookEvents.length ? newWebhookEvents : ['verification.completed'],
      });
      setNewWebhookUrl('');
      setNewWebhookEvents([]);
      await loadData(apiKeyFilter);
      setIsWebhookDialogOpen(false);
      toast.success('Webhook registered successfully');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to register webhook'));
    } finally {
      setIsSubmittingWebhook(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    setIsDeletingWebhookId(id);
    try {
      await webhooksService.delete(id);
      setWebhooks((current) => current.filter((item) => item.id !== id));
      toast.success('Webhook deleted');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to delete webhook'));
    } finally {
      setIsDeletingWebhookId(null);
    }
  };

  const copyText = async (value: string): Promise<void> => {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  const clearRequestHistory = () => {
    setRequestHistory([]);
    window.localStorage.removeItem(REQUEST_HISTORY_STORAGE_KEY);
  };

  const persistRequestHistory = (next: BankingRequestDiagnosticEvent[]) => {
    setRequestHistory(next);
    window.localStorage.setItem(REQUEST_HISTORY_STORAGE_KEY, JSON.stringify(next));
  };

  const cancelDiagnosticRequest = async (item: BankingRequestDiagnosticEvent) => {
    setIsCancellingRequestId(item.requestId);
    try {
      const next = [
        {
          ...item,
          stage: 'failed' as const,
          status: 499,
          message: 'Retry cancelled by user',
          retryInMs: undefined,
          occurredAt: new Date().toISOString(),
        },
        ...requestHistory.filter((entry) => !(entry.requestId === item.requestId && entry.stage === 'retrying')),
      ].slice(0, 80);
      persistRequestHistory(next);
      toast.success('Retry cancelled for this request');
    } finally {
      setIsCancellingRequestId(null);
    }
  };

  const retryDiagnosticRequest = async (item: BankingRequestDiagnosticEvent) => {
    setIsRetryingRequestId(item.requestId);
    try {
      if (item.method === 'GET' && item.path.includes('/api-keys')) {
        await loadData(apiKeyFilter);
      } else if (item.method === 'GET' && item.path.includes('/webhooks')) {
        const hooks = await webhooksService.list();
        setWebhooks(hooks);
      } else if (item.method === 'GET' && item.path.includes('/api/settings')) {
        await loadApiSettings();
      } else {
        toast.info('This request type cannot be auto-retried. Repeat the original action from the page controls.');
        return;
      }

      const event: BankingRequestDiagnosticEvent = {
        requestId: item.requestId,
        path: item.path,
        method: item.method,
        stage: 'succeeded',
        status: 200,
        attempt: (item.attempt ?? 0) + 1,
        message: 'Retried by user from diagnostics',
        occurredAt: new Date().toISOString(),
      };
      const next = [event, ...requestHistory].slice(0, 80);
      persistRequestHistory(next);
      toast.success('Request retried successfully');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Retry failed'));
    } finally {
      setIsRetryingRequestId(null);
    }
  };

  const requestHistoryRows = useMemo(() => requestHistory.slice(0, 20), [requestHistory]);
  const canViewApiKeys = hasPermission('api_keys:read') || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'enterprise';
  const getApiKeyEnvironment = (key: ApiKeyResponse): ApiKeyEnvironment => {
    const explicit = String((key as ApiKeyResponse & { environment?: string }).environment ?? '').toLowerCase();
    if (explicit === 'production' || explicit === 'sandbox') return explicit;
    const hint = `${key.name} ${key.keyPrefix}`.toLowerCase();
    return hint.includes('sandbox') || hint.includes('test') || hint.includes('dev') ? 'sandbox' : 'production';
  };
  const productionKeyCount = useMemo(() => apiKeys.filter((key) => getApiKeyEnvironment(key) === 'production').length, [apiKeys]);
  const sandboxKeyCount = useMemo(() => apiKeys.filter((key) => getApiKeyEnvironment(key) === 'sandbox').length, [apiKeys]);

  const saveApiSettings = async () => {
    setIsSavingSettings(true);
    try {
      const payload: ApiSecuritySettings = {
        autoRotateSecrets,
        ipWhitelistEnabled,
        allowedIps: allowedIps
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await bankingService.updateApiSecuritySettings(payload);
      window.localStorage.setItem(
        API_SETTINGS_STORAGE_KEY,
        JSON.stringify(payload),
      );
      toast.success('API settings saved');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to save API settings'));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    setIsTestingWebhookId(webhookId);
    try {
      const result = await webhooksService.test({
        webhookId,
        eventType: 'verification.completed',
        payload: { source: 'api-management' },
      });
      toast.success(`Webhook test ${result.status}`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to test webhook endpoint'));
    } finally {
      setIsTestingWebhookId(null);
    }
  };

  return (
    <ApiErrorBoundary>
      <div className="space-y-6 pb-10">
      <BackButton to="/enterprise/platform" label="Back to Platform" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text">
            API Management
          </h1>
          <p className="text-verza-gray mt-1">
            Manage your API keys, webhooks, and integration settings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-ent-muted p-1 rounded-xl border border-ent-border">
            <Button 
              variant={apiKeyFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm" 
              onClick={() => setApiKeyFilter('all')}
              className={`text-xs rounded-lg ${apiKeyFilter === 'all' ? 'bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90' : 'text-verza-gray hover:text-ent-text'}`}
            >
              All
            </Button>
            <Button 
              variant={apiKeyFilter === 'production' ? 'secondary' : 'ghost'}
              size="sm" 
              onClick={() => setApiKeyFilter('production')}
              className={`text-xs rounded-lg ${apiKeyFilter === 'production' ? 'bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90' : 'text-verza-gray hover:text-ent-text'}`}
            >
              Production
            </Button>
            <Button 
              variant={apiKeyFilter === 'sandbox' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setApiKeyFilter('sandbox')}
              className={`text-xs rounded-lg ${apiKeyFilter === 'sandbox' ? 'bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90' : 'text-verza-gray hover:text-ent-text'}`}
            >
              Sandbox
            </Button>
          </div>
          
          <Dialog
            open={isCreateKeyDialogOpen}
            onOpenChange={(open) => {
              setIsCreateKeyDialogOpen(open);
              if (open) {
                setCreateKeyEnvironment(null);
              }
            }}
          >
            <DialogTrigger asChild>
                <Button className="gap-2 bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 rounded-full px-6 font-bold shadow-[0_4px_14px_rgba(30,215,96,0.25)]">
                    <Plus className="h-4 w-4" />
                    Create New Key
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                    <DialogDescription>
                        Generate a new API key for your application.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="key-name">Key Name</Label>
                        <Input 
                            id="key-name" 
                            placeholder="e.g. Backend Service" 
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-3">
                      <Label>Environment</Label>
                      <RadioGroup value={createKeyEnvironment ?? ''} onValueChange={(value) => setCreateKeyEnvironment(value as ApiKeyEnvironment)}>
                        <Label
                          htmlFor="api-key-env-production"
                          className="flex cursor-pointer items-start justify-between rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Production</div>
                            <p className="text-xs text-muted-foreground">Production keys access live workflows.</p>
                          </div>
                          <RadioGroupItem id="api-key-env-production" value="production" />
                        </Label>
                        <Label
                          htmlFor="api-key-env-sandbox"
                          className="flex cursor-pointer items-start justify-between rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Sandbox</div>
                            <p className="text-xs text-muted-foreground">Sandbox keys are for test and simulation workflows.</p>
                          </div>
                          <RadioGroupItem id="api-key-env-sandbox" value="sandbox" />
                        </Label>
                      </RadioGroup>
                      {!createKeyEnvironment ? (
                        <p className="text-xs text-muted-foreground">Choose one environment to continue.</p>
                      ) : null}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateKey} disabled={!newKeyName.trim() || !createKeyEnvironment || isCreatingKey}>
                        {isCreatingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Key"}
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {pageError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unable to load API resources</AlertTitle>
          <AlertDescription>
            <div className="flex items-center justify-between gap-2">
              <span>{pageError}</span>
              <Button variant="outline" size="sm" onClick={() => void loadData(apiKeyFilter)} disabled={isLoadingData}>
                {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Dialog
        open={isRevealDialogOpen}
        onOpenChange={(open) => {
          if (!open && !hasConfirmedCopy) return;
          setIsRevealDialogOpen(open);
          if (!open) {
            setHasConfirmedCopy(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API Key Created</DialogTitle>
            <DialogDescription>
              This key is shown once. Copy and store it now.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2">
              <Badge variant={latestCreatedKeyEnvironment === 'production' ? 'destructive' : 'secondary'}>
                {latestCreatedKeyEnvironment.toUpperCase()}
              </Badge>
              {latestCreatedKeyPrefix ? (
                <Badge variant="outline" className="font-mono text-xs">
                  {latestCreatedKeyPrefix}
                </Badge>
              ) : null}
            </div>
            <div className="rounded-md border bg-muted/20 p-3 font-mono text-xs break-all">
              {rawApiKey || 'Key expired. Please create a new key.'}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                if (!rawApiKey) return;
                await copyText(rawApiKey);
                setHasConfirmedCopy(true);
              }}
              disabled={!rawApiKey}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy API Key
            </Button>
            <div className="flex items-center gap-2">
              <Checkbox
                id="confirm-key-copied"
                checked={hasConfirmedCopy}
                onCheckedChange={(checked) => setHasConfirmedCopy(Boolean(checked))}
              />
              <Label htmlFor="confirm-key-copied" className="text-sm">
                I copied this key
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">For security, this value clears automatically after 30 seconds.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRevealDialogOpen(false)} disabled={!hasConfirmedCopy}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isLoadingData && (
        <Card>
          <CardContent className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="enterprise-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider text-verza-gray/60 font-medium">Requests This Month</p>
            <Server className="h-4 w-4 text-verza-emerald/40" />
          </div>
          <div>
            <div className="text-3xl font-bold text-ent-text">145,203</div>
            <div className="mt-4 h-1.5 w-full bg-ent-text/10 rounded-full overflow-hidden">
              <div className="bg-verza-emerald h-full w-[45%]"></div>
            </div>
            <p className="text-[10px] text-verza-gray/40 mt-2 uppercase tracking-tight">
              45% of monthly quota used
            </p>
          </div>
        </div>
        <div className="enterprise-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider text-verza-gray/60 font-medium">Average Latency</p>
            <Activity className="h-4 w-4 text-verza-emerald/40" />
          </div>
          <div>
            <div className="text-3xl font-bold text-ent-text">124ms</div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="h-1.5 w-1.5 rounded-full bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]" />
              <span className="text-[10px] text-verza-emerald font-bold uppercase tracking-widest">System Healthy</span>
            </div>
          </div>
        </div>
        <div className="enterprise-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider text-verza-gray/60 font-medium">Error Rate</p>
            <AlertTriangle className="h-4 w-4 text-red-400/40" />
          </div>
          <div>
            <div className="text-3xl font-bold text-ent-text">0.02%</div>
            <p className="text-[10px] text-verza-gray/40 mt-4 uppercase tracking-tight">
              Last 24 hours
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`enterprise-card rounded-2xl p-6 ${apiKeyFilter === 'production' ? 'border-verza-emerald/20' : ''}`}>
          <p className="text-[11px] uppercase tracking-wider text-verza-gray/60 font-medium">Production Environment</p>
          <div className="mt-3 text-3xl font-bold text-ent-text">{productionKeyCount}</div>
          <p className="text-[10px] text-verza-gray/40 mt-2 uppercase tracking-tight">Active keys in production</p>
        </div>
        <div className={`enterprise-card rounded-2xl p-6 ${apiKeyFilter === 'sandbox' ? 'border-verza-emerald/20' : ''}`}>
          <p className="text-[11px] uppercase tracking-wider text-verza-gray/60 font-medium">Sandbox Environment</p>
          <div className="mt-3 text-3xl font-bold text-ent-text">{sandboxKeyCount}</div>
          <p className="text-[10px] text-verza-gray/40 mt-2 uppercase tracking-tight">Active keys in sandbox</p>
        </div>
      </div>

      <div className="enterprise-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-ent-border flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ent-text">Request Diagnostics</h3>
            <p className="text-sm text-verza-gray mt-1">Persistent history of request IDs, retries, and outcomes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDiagnosticsOpen(true)} disabled={requestHistory.length === 0} className="border-ent-border text-verza-gray hover:text-ent-text">
              View Full Screen
            </Button>
            <Button variant="outline" size="sm" onClick={clearRequestHistory} disabled={requestHistory.length === 0} className="border-ent-border text-verza-gray hover:text-ent-text">
              Clear History
            </Button>
          </div>
        </div>
        <div className="p-2">
          {requestHistoryRows.length === 0 ? (
            <div className="text-sm text-verza-gray/40 py-8 text-center">
              No request diagnostics yet. Run API actions to populate this panel.
            </div>
          ) : (
            <div className="max-h-[360px] overflow-auto">
              <Table>
                <TableHeader className="bg-ent-text/5 hover:bg-transparent">
                  <TableRow className="border-ent-border hover:bg-transparent">
                    <TableHead className="text-verza-gray font-medium">Time</TableHead>
                    <TableHead className="text-verza-gray font-medium">Stage</TableHead>
                    <TableHead className="text-verza-gray font-medium">Method</TableHead>
                    <TableHead className="text-verza-gray font-medium">Path</TableHead>
                    <TableHead className="text-verza-gray font-medium">Request ID</TableHead>
                    <TableHead className="text-verza-gray font-medium">Retry</TableHead>
                    <TableHead className="text-verza-gray font-medium">Status</TableHead>
                    <TableHead className="text-right text-verza-gray font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestHistoryRows.map((item) => (
                    <TableRow key={`${item.requestId}-${item.stage}-${item.occurredAt}-${item.attempt || 0}`} className="border-ent-border hover:bg-ent-text/5 transition-colors">
                      <TableCell className="text-xs text-verza-gray/60">{new Date(item.occurredAt).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={`uppercase text-[10px] ${
                            item.stage === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            item.stage === 'retrying' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20'
                          }`}
                        >
                          {item.stage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-ent-text font-medium">{item.method}</TableCell>
                      <TableCell className="font-mono text-xs text-verza-gray/60">{item.path}</TableCell>
                      <TableCell className="font-mono text-xs">
                        <button onClick={() => copyText(item.requestId)} className="hover:text-verza-emerald text-verza-gray/60 transition-colors">
                          {item.requestId}
                        </button>
                      </TableCell>
                      <TableCell className="text-xs text-verza-gray/60">
                        {item.attempt ? `#${item.attempt}${item.retryInMs ? ` · ${Math.round(item.retryInMs / 1000)}s` : ''}` : '-'}
                      </TableCell>
                      <TableCell className="text-ent-text">{item.status ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => retryDiagnosticRequest(item)} disabled={isRetryingRequestId === item.requestId} className="border-ent-border text-verza-gray hover:text-ent-text text-xs">
                            {isRetryingRequestId === item.requestId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Retry'}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400/60 hover:text-red-400 text-xs" onClick={() => cancelDiagnosticRequest(item)} disabled={isCancellingRequestId === item.requestId}>
                            {isCancellingRequestId === item.requestId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Cancel'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <Dialog open={isDiagnosticsOpen} onOpenChange={setIsDiagnosticsOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[90vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Request Diagnostics (Full Screen)</DialogTitle>
            <DialogDescription>
              Complete request log history with request IDs, retry attempts, and statuses.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 pt-4 flex-1 min-h-0">
            {requestHistory.length === 0 ? (
              <div className="text-sm text-muted-foreground py-3">
                No request diagnostics yet. Run API actions to populate this panel.
              </div>
            ) : (
              <div className="rounded-md border h-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Retry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestHistory.map((item) => (
                      <TableRow key={`fullscreen-${item.requestId}-${item.stage}-${item.occurredAt}-${item.attempt || 0}`}>
                        <TableCell className="text-xs">{new Date(item.occurredAt).toLocaleTimeString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.stage === 'failed' ? 'destructive' : item.stage === 'retrying' ? 'secondary' : 'outline'}
                            className="uppercase text-[10px]"
                          >
                            {item.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.method}</TableCell>
                        <TableCell className="font-mono text-xs">{item.path}</TableCell>
                        <TableCell className="font-mono text-xs">
                          <button onClick={() => copyText(item.requestId)} className="hover:underline">
                            {item.requestId}
                          </button>
                        </TableCell>
                        <TableCell className="text-xs">
                          {item.attempt ? `#${item.attempt}${item.retryInMs ? ` · ${Math.round(item.retryInMs / 1000)}s` : ''}` : '-'}
                        </TableCell>
                        <TableCell>{item.status ?? '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => retryDiagnosticRequest(item)}
                              disabled={isRetryingRequestId === item.requestId}
                            >
                              {isRetryingRequestId === item.requestId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Retry'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => cancelDiagnosticRequest(item)}
                              disabled={isCancellingRequestId === item.requestId}
                            >
                              {isCancellingRequestId === item.requestId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Cancel'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="bg-ent-muted backdrop-blur-md border border-ent-border p-1 rounded-xl">
          <TabsTrigger value="keys" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Webhooks</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <TabHelpCard
            title="API Keys Tab"
            description="Create and rotate keys for production or sandbox usage. Key visibility is restricted to privileged team members."
            icon={Key}
            sectionLabel="Authentication"
            tone="blue"
            useWhen="you need to issue credentials for backend services or rotate compromised keys."
            highlights={['Create keys', 'Revoke keys', 'Copy prefixes', 'Environment split']}
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="enterprise-card rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-ent-border">
                <h3 className="text-lg font-semibold text-ent-text">Active API Keys</h3>
                <p className="text-sm text-verza-gray mt-1">Manage the API keys used to authenticate your requests.</p>
              </div>
              <div className="p-2">
                {!canViewApiKeys ? (
                  <div className="text-sm text-verza-gray/40 rounded-xl border border-ent-border p-6 m-2">
                    You do not have permission to view API keys. Ask an Admin or Manager for `api_keys:read` access.
                  </div>
                ) : (
                <div>
                  <Table>
                    <TableHeader className="bg-ent-text/5 hover:bg-transparent">
                      <TableRow className="border-ent-border hover:bg-transparent">
                        <TableHead className="text-verza-gray font-medium">Name</TableHead>
                        <TableHead className="text-verza-gray font-medium">Environment</TableHead>
                        <TableHead className="text-verza-gray font-medium">Key Prefix</TableHead>
                        <TableHead className="text-verza-gray font-medium">Created</TableHead>
                        <TableHead className="text-verza-gray font-medium">Last Used</TableHead>
                        <TableHead className="text-verza-gray font-medium">Status</TableHead>
                        <TableHead className="text-right text-verza-gray font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApiKeys.map((key) => (
                        <TableRow key={key.id} className="border-ent-border hover:bg-ent-text/5 transition-colors">
                          <TableCell className="font-medium text-ent-text">
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-verza-gray/40" />
                              {key.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getApiKeyEnvironment(key) === 'production' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-ent-text/10 text-verza-gray border-ent-border'}>
                              {getApiKeyEnvironment(key).toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-verza-gray/60">{key.keyPrefix}</TableCell>
                          <TableCell className="text-verza-gray/60 text-sm">{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-verza-gray/60 text-sm">{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</TableCell>
                          <TableCell>
                            <Badge className={String(key.status || 'active').toLowerCase() === 'revoked' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20'}>
                              {String(key.status || 'active').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-verza-gray hover:text-ent-text hover:bg-ent-text/5" onClick={() => copyText(key.keyPrefix || '')}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-verza-gray hover:text-ent-text hover:bg-ent-text/5" onClick={() => void loadData(apiKeyFilter)} disabled={isLoadingData}>
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-400/10" onClick={() => handleDeleteKey(key.id)} disabled={isDeletingKeyId === key.id}>
                                {isDeletingKeyId === key.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredApiKeys.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-verza-gray/40 py-8">
                            {apiKeyFilter === 'all' ? 'No API keys found.' : `No ${apiKeyFilter} API keys found.`}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                )}
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="enterprise-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ent-text">Documentation</h3>
                <p className="text-sm text-verza-gray mt-1">Resources to help you integrate</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-xl border border-ent-border bg-ent-muted hover:bg-ent-card transition-colors cursor-pointer">
                  <div className="bg-verza-emerald/10 p-2 rounded-lg text-verza-emerald">
                    <Code className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-ent-text">API Reference</h4>
                    <p className="text-xs text-verza-gray/60">Complete endpoint documentation</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-verza-gray/40" />
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-ent-border bg-ent-muted hover:bg-ent-card transition-colors cursor-pointer">
                  <div className="bg-verza-emerald/10 p-2 rounded-lg text-verza-emerald">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-ent-text">Security Guide</h4>
                    <p className="text-xs text-verza-gray/60">Best practices for secure integration</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-verza-gray/40" />
                </div>
              </div>
            </div>

            <div className="enterprise-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ent-text">SDKs &amp; Libraries</h3>
                <p className="text-sm text-verza-gray mt-1">Official libraries for your stack</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start gap-2 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/5">
                  <span className="font-bold text-verza-emerald">JS</span> Node.js
                </Button>
                <Button variant="outline" className="justify-start gap-2 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/5">
                  <span className="font-bold text-verza-emerald">PY</span> Python
                </Button>
                <Button variant="outline" className="justify-start gap-2 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/5">
                  <span className="font-bold text-verza-emerald">GO</span> Go
                </Button>
                <Button variant="outline" className="justify-start gap-2 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/5">
                  <span className="font-bold text-verza-emerald">RB</span> Ruby
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <TabHelpCard
            title="Webhooks Tab"
            description="Register callback endpoints to receive verification events and monitor delivery status."
            icon={Webhook}
            sectionLabel="Event Delivery"
            tone="violet"
            useWhen="your system needs real-time updates without polling the API."
            highlights={['Register endpoint', 'Choose events', 'Delivery status', 'Secret handling']}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-end mb-4">
                 <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 rounded-full px-6 font-bold shadow-[0_4px_14px_rgba(30,215,96,0.25)]">
                            <Plus className="h-4 w-4" />
                            Add Webhook
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Register Webhook</DialogTitle>
                            <DialogDescription>
                                Receive real-time updates when events happen in your account.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="webhook-url">Endpoint URL</Label>
                                  <Input 
                                    id="webhook-url" 
                                    placeholder="https://api.yourdomain.com/webhooks/verza" 
                                    value={newWebhookUrl}
                                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="webhook-secret">Webhook Secret (Auto-generated)</Label>
                                  <div className="relative">
                                    <Input 
                                      id="webhook-secret" 
                                      type={showSecret ? "text" : "password"} 
                                      value="whsec_..." 
                                      readOnly 
                                      disabled
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                      onClick={() => setShowSecret(!showSecret)}
                                    >
                                      {showSecret ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <Label>Events to Subscribe</Label>
                                <div className="space-y-2 border rounded-md p-4">
                                  {["verification.completed", "verification.failed", "verification.created"].map(evt => (
                                      <div key={evt} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`evt-${evt}`} 
                                            checked={newWebhookEvents.includes(evt)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setNewWebhookEvents([...newWebhookEvents, evt]);
                                                } else {
                                                    setNewWebhookEvents(newWebhookEvents.filter(e => e !== evt));
                                                }
                                            }}
                                        />
                                        <label
                                          htmlFor={`evt-${evt}`}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                          {evt}
                                        </label>
                                      </div>
                                  ))}
                                </div>
                              </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateWebhook} disabled={!newWebhookUrl || isSubmittingWebhook}>
                                {isSubmittingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Webhook"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle>Registered Webhooks</CardTitle>
                    <CardDescription>
                        Your active webhook endpoints.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {webhooks.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No webhooks registered. Add one to start receiving events.
                            </div>
                        ) : (
                            webhooks.map((hook) => (
                                <div key={hook.id} className="flex items-start justify-between p-4 border rounded-lg bg-muted/20">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{hook.url}</div>
                                            <Badge variant={hook.isActive ? "default" : "secondary"} className="text-[10px] h-5">
                                                {hook.isActive ? "ACTIVE" : "INACTIVE"}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {hook.events.map(evt => (
                                                <Badge key={evt} variant="outline" className="text-[10px]">{evt}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleTestWebhook(hook.id)} disabled={isTestingWebhookId === hook.id}>
                                          {isTestingWebhookId === hook.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test'}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteWebhook(hook.id)} disabled={isDeletingWebhookId === hook.id}>
                                          {isDeletingWebhookId === hook.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="settings">
            <TabHelpCard
              title="Settings Tab"
              description="Configure global API behavior and maintain endpoint-to-page mapping used by the dashboard."
              icon={Settings2}
              sectionLabel="Configuration"
              tone="emerald"
              useWhen="you need to harden API security controls and align endpoint ownership."
              highlights={['Auto-rotation', 'IP restrictions', 'Endpoint mapping']}
            />
            <Card>
                <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>
                        Configure global API behavior.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Regenerate Secret Key automatically</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically rotate secret keys every 90 days.
                            </p>
                        </div>
                        <Switch checked={autoRotateSecrets} onCheckedChange={setAutoRotateSecrets} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>IP Whitelist</Label>
                            <p className="text-sm text-muted-foreground">
                                Restrict API access to specific IP addresses.
                            </p>
                        </div>
                        <Switch checked={ipWhitelistEnabled} onCheckedChange={setIpWhitelistEnabled} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Allowed IPs (comma-separated)</Label>
                      <Input
                        placeholder="203.0.113.10/32, 198.51.100.0/24"
                        value={allowedIps}
                        onChange={(event) => setAllowedIps(event.target.value)}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <Label>Endpoint-to-Page Mapping</Label>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Method</TableHead>
                              <TableHead>Endpoint</TableHead>
                              <TableHead>Pages</TableHead>
                              <TableHead>Permission</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {apiManagementEndpointMappings.map((mapping) => (
                              <TableRow key={`${mapping.method}-${mapping.endpoint}`}>
                                <TableCell>{mapping.method}</TableCell>
                                <TableCell className="font-mono text-xs">{mapping.endpoint}</TableCell>
                                <TableCell>{mapping.pages.join(', ')}</TableCell>
                                <TableCell>{mapping.permission}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={saveApiSettings} disabled={isSavingSettings}>
                        {isSavingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save API Settings
                      </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ApiErrorBoundary>
  );
}
