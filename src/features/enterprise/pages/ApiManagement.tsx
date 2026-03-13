import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, Copy, RefreshCw, Trash2, Plus, Eye, EyeOff, CheckCircle, 
  AlertTriangle, Server, Activity, Shield, Code, ExternalLink, Loader2
} from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bankingService } from '@/services/bankingService';
import type { ApiKeyResponse, WebhookResponse } from '@/types/banking';
import { toast } from 'sonner';

export default function ApiManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  // const [isLoading, setIsLoading] = useState(true); // Removed unused state
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>([]);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // setIsLoading(true);
    try {
      // In a real app, we would handle errors more gracefully
      // For now we might catch if the service fails (e.g. 404/500)
      const keys = await bankingService.listApiKeys().catch(() => []);
      const hooks = await bankingService.listWebhooks().catch(() => []);
      
      // If empty (mock/initial), let's populate with some dummy data if the API fails or returns empty
      if (keys.length === 0) {
        setApiKeys([
            { id: "key_prod_1", name: "Production Key 1", keyPrefix: "vz_live_...", createdAt: "2023-11-15", lastUsed: "2 mins ago", scopes: ["read", "write"] },
            { id: "key_dev_1", name: "Development Key", keyPrefix: "vz_test_...", createdAt: "2025-02-10", lastUsed: "2 days ago", scopes: ["read"] },
        ]);
      } else {
        setApiKeys(keys);
      }

      if (hooks.length === 0) {
        setWebhooks([
            { id: "wh_1", url: "https://api.example.com/webhooks", events: ["verification.completed"], isActive: true, createdAt: "2024-01-01" }
        ]);
      } else {
        setWebhooks(hooks);
      }
    } catch (error) {
      console.error(error);
      // setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    setIsCreatingKey(true);
    try {
        const newKey = await bankingService.createApiKey({ name: newKeyName, scopes: ["read", "write"] });
        setApiKeys([...apiKeys, newKey]);
        setNewKeyName('');
        toast.success("API Key created successfully");
        // Close dialog logic would go here if controlled
    } catch (e) {
        console.error(e);
        toast.error("Failed to create API key");
    } finally {
        setIsCreatingKey(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
        await bankingService.revokeApiKey(id);
        setApiKeys(apiKeys.filter(k => k.id !== id));
        toast.success("API Key revoked");
    } catch (e) {
        console.error(e);
        toast.error("Failed to revoke API key");
    }
  };

  const handleCreateWebhook = async () => {
    setIsCreatingWebhook(true);
    try {
        const newHook = await bankingService.registerWebhook({ url: newWebhookUrl, events: newWebhookEvents.length ? newWebhookEvents : ["all"] });
        setWebhooks([...webhooks, newHook]);
        setNewWebhookUrl('');
        setNewWebhookEvents([]);
        toast.success("Webhook registered successfully");
    } catch (e) {
        console.error(e);
        toast.error("Failed to register webhook");
    } finally {
        setIsCreatingWebhook(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
        await bankingService.deleteWebhook(id);
        setWebhooks(webhooks.filter(w => w.id !== id));
        toast.success("Webhook deleted");
    } catch (e) {
        console.error(e);
        toast.error("Failed to delete webhook");
    }
  };


  return (
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

      {/* Usage Statistics */}
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

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
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
                      {apiKeys.map((key) => (
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
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteKey(key.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                                        <Button variant="ghost" size="sm">Test</Button>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteWebhook(hook.id)}>Delete</Button>
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
                        <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>IP Whitelist</Label>
                            <p className="text-sm text-muted-foreground">
                                Restrict API access to specific IP addresses.
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
