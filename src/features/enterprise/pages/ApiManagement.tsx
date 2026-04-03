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
  Shield,
  Trash2
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
import { ApiErrorBoundary } from '@/components/shared/ApiErrorBoundary';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import { useAuth } from '@/features/auth/AuthContext';
import { BANKING_REQUEST_DIAGNOSTIC_EVENT, getBankingErrorMessage } from '@/services/bankingService';
import { apiKeysService, apiManagementEndpointMappings, webhooksService } from '@/services/apiManagementService';
import type { ApiKeyResponse, BankingRequestDiagnosticEvent, WebhookResponse } from '@/types/banking';

const REQUEST_HISTORY_STORAGE_KEY = 'verza:banking:requestHistory';
const API_SETTINGS_STORAGE_KEY = 'verza:api:settings';

export default function ApiManagement() {
  const { user, hasPermission } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [pageError, setPageError] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isDeletingWebhookId, setIsDeletingWebhookId] = useState<string | null>(null);
  const [isDeletingKeyId, setIsDeletingKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [rawApiKey, setRawApiKey] = useState('');
  const [rawApiKeyExpiresAt, setRawApiKeyExpiresAt] = useState<number | null>(null);
  const [requestHistory, setRequestHistory] = useState<BankingRequestDiagnosticEvent[]>([]);
  const [autoRotateSecrets, setAutoRotateSecrets] = useState(false);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
    try {
      const raw = window.localStorage.getItem(API_SETTINGS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { autoRotateSecrets?: boolean; ipWhitelistEnabled?: boolean };
      setAutoRotateSecrets(Boolean(parsed.autoRotateSecrets));
      setIpWhitelistEnabled(Boolean(parsed.ipWhitelistEnabled));
    } catch {
      setAutoRotateSecrets(false);
      setIpWhitelistEnabled(false);
    }
  }, []);

  const loadData = async () => {
    setIsLoadingData(true);
    setPageError('');
    try {
      const [keys, hooks] = await Promise.all([apiKeysService.list(), webhooksService.list()]);
      setApiKeys(keys);
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
    setIsCreatingKey(true);
    try {
      const created = await apiKeysService.create({
        keyName: trimmedName,
        permissions: ['api_keys:read', 'api_keys:write', 'webhooks:read', 'webhooks:write']
      });
      setNewKeyName('');
      await loadData();
      toast.success('API Key created successfully');
      if (created.apiKey) {
        setRawApiKey(created.apiKey);
        setRawApiKeyExpiresAt(Date.now() + 30000);
        void navigator.clipboard.writeText(created.apiKey);
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
    setIsCreatingWebhook(true);
    try {
      await webhooksService.register({
        url: newWebhookUrl.trim(),
        events: newWebhookEvents.length ? newWebhookEvents : ['verification.completed'],
      });
      setNewWebhookUrl('');
      setNewWebhookEvents([]);
      await loadData();
      toast.success('Webhook registered successfully');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to register webhook'));
    } finally {
      setIsCreatingWebhook(false);
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

  const requestHistoryRows = useMemo(() => requestHistory.slice(0, 20), [requestHistory]);
  const canViewApiKeys = hasPermission('api_keys:read') || user?.role === 'admin' || user?.role === 'manager' || user?.role === 'enterprise';
  const getApiKeyEnvironment = (key: ApiKeyResponse): 'production' | 'sandbox' => {
    const hint = `${key.name} ${key.keyPrefix}`.toLowerCase();
    return hint.includes('sandbox') || hint.includes('test') || hint.includes('dev') ? 'sandbox' : 'production';
  };
  const visibleApiKeys = useMemo(
    () => apiKeys.filter((key) => (sandboxMode ? getApiKeyEnvironment(key) === 'sandbox' : getApiKeyEnvironment(key) === 'production')),
    [apiKeys, sandboxMode],
  );
  const productionKeyCount = useMemo(() => apiKeys.filter((key) => getApiKeyEnvironment(key) === 'production').length, [apiKeys]);
  const sandboxKeyCount = useMemo(() => apiKeys.filter((key) => getApiKeyEnvironment(key) === 'sandbox').length, [apiKeys]);

  const saveApiSettings = async () => {
    setIsSavingSettings(true);
    try {
      window.localStorage.setItem(
        API_SETTINGS_STORAGE_KEY,
        JSON.stringify({ autoRotateSecrets, ipWhitelistEnabled }),
      );
      toast.success('API settings saved');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <ApiErrorBoundary>
      <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-primary to-verza-secondary bg-clip-text text-transparent">
            API Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys, webhooks, and integration settings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
            <Button 
              variant={!sandboxMode ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setSandboxMode(false)}
              className="text-xs"
            >
              Production
            </Button>
            <Button 
              variant={sandboxMode ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setSandboxMode(true)}
              className="text-xs"
            >
              Sandbox
            </Button>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-verza-primary hover:bg-verza-primary/90">
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
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateKey} disabled={!newKeyName || isCreatingKey}>
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
              <Button variant="outline" size="sm" onClick={loadData} disabled={isLoadingData}>
                {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {rawApiKey && (
        <Alert>
          <Key className="h-4 w-4" />
          <AlertTitle>New API key</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col gap-2">
              <div className="font-mono text-xs break-all">{rawApiKey}</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">This value clears automatically after 30 seconds.</span>
                <Button size="sm" variant="outline" onClick={() => copyText(rawApiKey)} className="h-7 px-2">
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {isLoadingData && (
        <Card>
          <CardContent className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests This Month</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145,203</div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[45%]"></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              45% of monthly quota used
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Latency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124ms</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-green-500 text-xs font-medium flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> Healthy
              </span>
              <span className="text-xs text-muted-foreground">Global edge network</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.02%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={!sandboxMode ? 'border-blue-500/40' : ''}>
          <CardHeader>
            <CardTitle className="text-base">Production Environment</CardTitle>
            <CardDescription>Live credentials and traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{productionKeyCount}</div>
            <p className="text-xs text-muted-foreground">Active keys in production</p>
          </CardContent>
        </Card>
        <Card className={sandboxMode ? 'border-blue-500/40' : ''}>
          <CardHeader>
            <CardTitle className="text-base">Sandbox Environment</CardTitle>
            <CardDescription>Testing and staging credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sandboxKeyCount}</div>
            <p className="text-xs text-muted-foreground">Active keys in sandbox</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Request Diagnostics</CardTitle>
            <CardDescription>Persistent history of request IDs, retries, and outcomes</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearRequestHistory} disabled={requestHistory.length === 0}>
            Clear History
          </Button>
        </CardHeader>
        <CardContent>
          {requestHistoryRows.length === 0 ? (
            <div className="text-sm text-muted-foreground py-3">
              No request diagnostics yet. Run API actions to populate this panel.
            </div>
          ) : (
            <div className="rounded-md border">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestHistoryRows.map((item) => (
                    <TableRow key={`${item.requestId}-${item.stage}-${item.occurredAt}-${item.attempt || 0}`}>
                      <TableCell className="text-xs">{new Date(item.occurredAt).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.stage === 'failed' ? 'destructive' : item.stage === 'retrying' ? 'secondary' : 'outline'
                          }
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <TabHelpCard
            title="API Keys Tab"
            description="Create and rotate keys for production or sandbox usage. Key visibility is restricted to privileged team members."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Active API Keys</CardTitle>
                <CardDescription>
                  Manage the API keys used to authenticate your requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!canViewApiKeys ? (
                  <div className="text-sm text-muted-foreground rounded-md border p-4">
                    You do not have permission to view API keys. Ask an Admin or Manager for `api_keys:read` access.
                  </div>
                ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key Prefix</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Used</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleApiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-muted-foreground" />
                              {key.name}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{key.keyPrefix}</TableCell>
                          <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              ACTIVE
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyText(key.keyPrefix || '')}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={loadData} disabled={isLoadingData}>
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteKey(key.id)}
                                disabled={isDeletingKeyId === key.id}
                              >
                                {isDeletingKeyId === key.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {visibleApiKeys.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                            No {sandboxMode ? 'sandbox' : 'production'} API keys found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Resources to help you integrate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">API Reference</h4>
                    <p className="text-xs text-muted-foreground">Complete endpoint documentation</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Security Guide</h4>
                    <p className="text-xs text-muted-foreground">Best practices for secure integration</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>SDKs & Libraries</CardTitle>
                <CardDescription>Official libraries for your stack</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start gap-2">
                    <span className="font-bold">JS</span> Node.js
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <span className="font-bold">PY</span> Python
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <span className="font-bold">GO</span> Go
                  </Button>
                  <Button variant="outline" className="justify-start gap-2">
                    <span className="font-bold">RB</span> Ruby
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <TabHelpCard
            title="Webhooks Tab"
            description="Register callback endpoints to receive verification events and monitor delivery status."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-end mb-4">
                 <Dialog open={isCreatingWebhook} onOpenChange={setIsCreatingWebhook}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-verza-primary hover:bg-verza-primary/90">
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
                            <Button onClick={handleCreateWebhook} disabled={!newWebhookUrl || isCreatingWebhook}>
                                {isCreatingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Webhook"}
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
