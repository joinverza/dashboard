import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plug, Plus, 
  ExternalLink, Settings, Trash2, RefreshCw, Loader2, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link, useLocation } from 'wouter';
import { ApiErrorBoundary } from '@/components/shared/ApiErrorBoundary';
import { getBankingErrorMessage } from '@/services/bankingService';
import { webhooksService } from '@/services/apiManagementService';
import type { WebhookResponse } from '@/types/banking';
import BackButton from '@/components/shared/BackButton';

// Mock data for integrations
const INTEGRATIONS = [
  { 
    id: 'salesforce', 
    name: 'Salesforce', 
    description: 'Sync verification data with your CRM contacts and leads.',
    logo: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg',
    status: 'connected',
    lastSync: '10 mins ago'
  },
  { 
    id: 'workday', 
    name: 'Workday', 
    description: 'Automate employee verification for HR workflows.',
    logo: 'https://cdn.worldvectorlogo.com/logos/workday.svg',
    status: 'disconnected',
    lastSync: null
  },
  { 
    id: 'bamboohr', 
    name: 'BambooHR', 
    description: 'Seamless integration for applicant tracking and onboarding.',
    logo: 'https://cdn.worldvectorlogo.com/logos/bamboohr.svg',
    status: 'disconnected',
    lastSync: null
  },
  { 
    id: 'greenhouse', 
    name: 'Greenhouse', 
    description: 'Streamline candidate verification directly from your ATS.',
    logo: 'https://cdn.worldvectorlogo.com/logos/greenhouse-logo.svg',
    status: 'connected',
    lastSync: '1 hour ago'
  },
  { 
    id: 'sap', 
    name: 'SAP', 
    description: 'Enterprise resource planning integration for large scale verification.',
    logo: 'https://cdn.worldvectorlogo.com/logos/sap-13.svg',
    status: 'error',
    lastSync: 'Failed 2 days ago'
  },
  { 
    id: 'slack', 
    name: 'Slack', 
    description: 'Receive real-time notifications for verification updates.',
    logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
    status: 'connected',
    lastSync: 'Just now'
  }
];

export default function EnterpriseIntegrations() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [activeWebhookId, setActiveWebhookId] = useState<string | null>(null);
  const [webhookError, setWebhookError] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const loadWebhooks = async () => {
    setIsLoadingWebhooks(true);
    setWebhookError('');
    try {
      const data = await webhooksService.list();
      setWebhooks(data);
    } catch (error) {
      const message = getBankingErrorMessage(error, 'Failed to fetch webhooks');
      setWebhookError(message);
      toast.error(message);
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

  useEffect(() => {
    void loadWebhooks();
  }, []);

  const isValidUrl = (value: string): boolean => {
    try {
      const parsed = new URL(value.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAddWebhook = async () => {
    if (!isValidUrl(newWebhookUrl)) {
      toast.error('Enter a valid webhook URL');
      return;
    }
    setIsAddingWebhook(true);
    try {
      await webhooksService.register({ url: newWebhookUrl.trim(), events: ['verification.completed'] });
      setNewWebhookUrl('');
      await loadWebhooks();
      toast.success('Webhook added');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to add webhook'));
    } finally {
      setIsAddingWebhook(false);
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: 'disconnected', lastSync: null }
          : integration,
      ),
    );
  };

  const handleReconnect = (integrationId: string) => {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: 'connected', lastSync: 'Just now' }
          : integration,
      ),
    );
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    setActiveWebhookId(webhookId);
    try {
      await webhooksService.delete(webhookId);
      setWebhooks((current) => current.filter((item) => item.id !== webhookId));
      toast.success('Webhook deleted');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to delete webhook'));
    } finally {
      setActiveWebhookId(null);
    }
  };

  const filteredIntegrations = integrations.filter(integration => 
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ApiErrorBoundary>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <BackButton to="/enterprise/platform" label="Back to Platform" />
      {webhookError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Webhook loading failed</AlertTitle>
          <AlertDescription>
            <div className="flex items-center justify-between gap-2">
              <span>{webhookError}</span>
              <Button size="sm" variant="outline" onClick={loadWebhooks} disabled={isLoadingWebhooks}>
                {isLoadingWebhooks ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text">Integrations</h1>
          <p className="text-verza-gray">Connect Ontiver with your existing tools and workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10">
            <Link href="/enterprise/api/docs">
              <ExternalLink className="mr-2 h-4 w-4" /> API Docs
            </Link>
          </Button>
          <Button onClick={() => window.open('mailto:partnerships@ontiver.com?subject=New%20Integration%20Request', '_self')} className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90">
            <Plus className="mr-2 h-4 w-4" /> Request Integration
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input 
          placeholder="Search integrations..." 
          className="max-w-sm bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="enterprise-card rounded-2xl flex flex-col p-6">
              <div className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="h-12 w-12 rounded-lg bg-ent-text/10 p-2 flex items-center justify-center border border-ent-border">
                  {/* Using a placeholder if image fails or for the demo */}
                  <div className="font-bold text-xl text-ent-text">{integration.name.substring(0, 2)}</div>
                </div>
                {integration.status === 'connected' && (
                  <Badge className="bg-verza-emerald/10 text-verza-emerald hover:bg-verza-emerald/20 border-verza-emerald/20">Connected</Badge>
                )}
                {integration.status === 'disconnected' && (
                  <Badge variant="outline" className="text-verza-gray border-ent-border">Available</Badge>
                )}
                {integration.status === 'error' && (
                  <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Error</Badge>
                )}
              </div>
              <div className="pt-4 flex-1">
                <h3 className="text-lg font-semibold text-ent-text mb-2">{integration.name}</h3>
                <p className="text-sm text-verza-gray">{integration.description}</p>
                
                {integration.lastSync && (
                  <div className="mt-4 text-xs text-verza-gray flex items-center">
                    <RefreshCw className="mr-1 h-3 w-3" /> Last sync: {integration.lastSync}
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-ent-border mt-6">
                {integration.status === 'connected' ? (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1 bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10" onClick={() => setLocation(`/enterprise/integrations/setup/${integration.id}`)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDisconnect(integration.id)}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90" onClick={() => handleReconnect(integration.id)}>
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ent-text">Webhooks</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10">
                <Plus className="mr-2 h-4 w-4" /> Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Webhook</DialogTitle>
                <DialogDescription>
                  Receive real-time updates for specific events.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Payload URL</Label>
                  <Input 
                    placeholder="https://api.yoursite.com/webhooks" 
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input type="password" value="whsec_..." readOnly className="font-mono bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Events</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="evt-verification" defaultChecked />
                      <Label htmlFor="evt-verification">verification.completed</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddWebhook} disabled={isAddingWebhook || !newWebhookUrl}>
                    {isAddingWebhook && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="enterprise-card rounded-2xl p-6">
          <div className="space-y-0">
            {isLoadingWebhooks ? (
                <div className="p-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-verza-emerald" />
                </div>
            ) : webhooks.length === 0 ? (
                <div className="p-8 text-center text-verza-gray">No webhooks registered.</div>
            ) : (
                webhooks.map((webhook, index) => (
              <div key={webhook.id} className={`flex items-center justify-between py-4 ${index !== webhooks.length - 1 ? 'border-b border-ent-border' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-ent-muted border border-ent-border p-2 rounded-md">
                    <Plug className="h-5 w-5 text-verza-gray" />
                  </div>
                  <div>
                    <div className="font-mono text-sm text-ent-text">{webhook.url}</div>
                    <div className="flex gap-2 mt-1">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="secondary" className="text-xs bg-ent-text/10 text-verza-gray hover:bg-ent-text/20">{event}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${webhook.isActive ? 'bg-verza-emerald' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-verza-gray capitalize">{webhook.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteWebhook(webhook.id)} disabled={activeWebhookId === webhook.id} className="text-verza-gray hover:text-red-400 hover:bg-red-500/10">
                    {activeWebhookId === webhook.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </motion.div>
    </ApiErrorBoundary>
  );
}
