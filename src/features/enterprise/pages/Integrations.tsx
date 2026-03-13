import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plug, Plus, 
  ExternalLink, Settings, Trash2, RefreshCw, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'wouter';
import { bankingService } from '@/services/bankingService';
import type { WebhookResponse } from '@/types/banking';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  useEffect(() => {
    const fetchWebhooks = async () => {
        setIsLoadingWebhooks(true);
        try {
            const data = await bankingService.listWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error("Failed to fetch webhooks", error);
        } finally {
            setIsLoadingWebhooks(false);
        }
    };
    fetchWebhooks();
  }, []);

  const handleAddWebhook = async () => {
    if (!newWebhookUrl) return;
    setIsAddingWebhook(true);
    try {
        const newHook = await bankingService.registerWebhook({ url: newWebhookUrl, events: ["all"] });
        setWebhooks([...webhooks, newHook]);
        setNewWebhookUrl('');
    } catch (error) {
        console.error("Failed to add webhook", error);
    } finally {
        setIsAddingWebhook(false);
    }
  };

  const filteredIntegrations = INTEGRATIONS.filter(integration => 
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect Verza with your existing tools and workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> API Docs
            </a>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Request Integration
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input 
          placeholder="Search integrations..." 
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="bg-card/80 backdrop-blur-sm border-border/50 flex flex-col">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                <div className="h-12 w-12 rounded-lg bg-white p-2 flex items-center justify-center border">
                  {/* Using a placeholder if image fails or for the demo */}
                  <div className="font-bold text-xl text-black">{integration.name.substring(0, 2)}</div>
                </div>
                {integration.status === 'connected' && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Connected</Badge>
                )}
                {integration.status === 'disconnected' && (
                  <Badge variant="outline" className="text-muted-foreground">Available</Badge>
                )}
                {integration.status === 'error' && (
                  <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Error</Badge>
                )}
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <CardTitle className="text-lg mb-2">{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
                
                {integration.lastSync && (
                  <div className="mt-4 text-xs text-muted-foreground flex items-center">
                    <RefreshCw className="mr-1 h-3 w-3" /> Last sync: {integration.lastSync}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2 border-t border-border/50 mt-auto">
                {integration.status === 'connected' ? (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="mr-2 h-4 w-4" /> Configure
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/enterprise/integrations/setup/${integration.id}`}>
                      Connect
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Webhooks</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
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

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-0">
            {isLoadingWebhooks ? (
                <div className="p-8 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : webhooks.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No webhooks registered.</div>
            ) : (
                webhooks.map((webhook, index) => (
              <div key={webhook.id} className={`flex items-center justify-between p-4 ${index !== webhooks.length - 1 ? 'border-b border-border/50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-muted p-2 rounded-md">
                    <Plug className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-mono text-sm">{webhook.url}</div>
                    <div className="flex gap-2 mt-1">
                      {webhook.events.map(event => (
                        <Badge key={event} variant="secondary" className="text-xs">{event}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${webhook.isActive ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-muted-foreground capitalize">{webhook.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            )))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
