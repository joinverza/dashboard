import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, Copy, RefreshCw, Trash2, Plus, Eye, EyeOff, CheckCircle, 
  AlertTriangle, Server, Activity, Shield, Code, ExternalLink
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

// Mock data
const apiKeys = [
  { id: "key_prod_1", name: "Production Key 1", prefix: "vz_live_...", created: "2023-11-15", lastUsed: "2 mins ago", status: "active" },
  { id: "key_prod_2", name: "Backend Service", prefix: "vz_live_...", created: "2024-01-20", lastUsed: "1 hour ago", status: "active" },
  { id: "key_dev_1", name: "Development Key", prefix: "vz_test_...", created: "2024-02-10", lastUsed: "2 days ago", status: "active" },
];

export default function ApiManagement() {
  const [showSecret, setShowSecret] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);

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
          <Button className="gap-2 bg-verza-primary hover:bg-verza-primary/90">
            <Plus className="h-4 w-4" />
            Create New Key
          </Button>
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
                          <TableCell className="font-mono text-xs">{key.prefix}</TableCell>
                          <TableCell>{key.created}</TableCell>
                          <TableCell>{key.lastUsed}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              {key.status.toUpperCase()}
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
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
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
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Receive real-time updates when events happen in your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Endpoint URL</Label>
                      <Input id="webhook-url" placeholder="https://api.yourdomain.com/webhooks/verza" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-secret">Webhook Secret</Label>
                      <div className="relative">
                        <Input 
                          id="webhook-secret" 
                          type={showSecret ? "text" : "password"} 
                          value="whsec_1234567890abcdef" 
                          readOnly 
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
                      <p className="text-xs text-muted-foreground">
                        Use this secret to verify the signature of incoming webhook events.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Events to Subscribe</Label>
                    <div className="space-y-2 border rounded-md p-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="evt-verification-completed" defaultChecked />
                        <label
                          htmlFor="evt-verification-completed"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          verification.completed
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="evt-verification-failed" defaultChecked />
                        <label
                          htmlFor="evt-verification-failed"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          verification.failed
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="evt-verification-created" />
                        <label
                          htmlFor="evt-verification-created"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          verification.created
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Switch id="webhook-active" defaultChecked />
                    <Label htmlFor="webhook-active">Webhooks Enabled</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Test Endpoint</Button>
                    <Button>Save Configuration</Button>
                  </div>
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
                Configure global settings for your API usage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">IP Whitelist</h4>
                  <p className="text-sm text-muted-foreground">Restrict API access to specific IP addresses.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Rate Limiting Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive emails when you approach your rate limits.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
