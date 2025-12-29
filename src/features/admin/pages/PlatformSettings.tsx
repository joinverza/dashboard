import {
  Save,
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function PlatformSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure global platform parameters and preferences
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success("Settings saved successfully")}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic platform identity and support settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Platform Name</Label>
                <Input defaultValue="Verza" />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input defaultValue="support@verza.io" />
              </div>
              <div className="space-y-2">
                <Label>Legal Entity Name</Label>
                <Input defaultValue="Verza Decentralized Solutions Ltd." />
              </div>
              <div className="space-y-2">
                <Label>Terms of Service URL</Label>
                <Input defaultValue="https://verza.io/terms" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Fee Configuration</CardTitle>
              <CardDescription>Manage platform transaction and subscription fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Transaction Fee (%)</Label>
                  <Input type="number" defaultValue="2.5" />
                  <p className="text-xs text-muted-foreground">Applied to all verifier payments</p>
                </div>
                <div className="space-y-2">
                  <Label>Escrow Platform Fee (%)</Label>
                  <Input type="number" defaultValue="1.0" />
                  <p className="text-xs text-muted-foreground">Additional fee for escrow services</p>
                </div>
                <div className="space-y-2">
                  <Label>Enterprise Subscription (Monthly)</Label>
                  <Input type="number" defaultValue="499" />
                  <p className="text-xs text-muted-foreground">Base price in USD</p>
                </div>
                <div className="space-y-2">
                  <Label>Verifier Stake Requirement</Label>
                  <Input type="number" defaultValue="5000" />
                  <p className="text-xs text-muted-foreground">Minimum VERZA tokens to stake</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>System Limits</CardTitle>
              <CardDescription>Set operational boundaries and constraints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Max File Upload Size (MB)</Label>
                  <Input type="number" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label>API Rate Limit (Req/Min)</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Max Verification Requests per Day</Label>
                  <Input type="number" defaultValue="50" />
                  <p className="text-xs text-muted-foreground">For regular users</p>
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (Minutes)</Label>
                  <Input type="number" defaultValue="60" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable specific platform capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Beta Features</Label>
                  <p className="text-sm text-muted-foreground">Allow users to opt-in to experimental features</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Cross-Chain Bridge</Label>
                  <p className="text-sm text-muted-foreground">Enable bridging between Midnight and Cardano</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">AI Fraud Detection</Label>
                  <p className="text-sm text-muted-foreground">Use ML models to flag suspicious activities</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">P2P Messaging</Label>
                  <p className="text-sm text-muted-foreground">Allow direct chat between users and verifiers</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Verification Rules</CardTitle>
              <CardDescription>Configure verification workflows and timeouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Verification Deadline (Hours)</Label>
                <Input type="number" defaultValue="48" />
              </div>
              <div className="space-y-2">
                <Label>Auto-Release Escrow (Hours after approval)</Label>
                <Input type="number" defaultValue="24" />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="space-y-0.5">
                  <Label>Require Multi-Sig for High Value</Label>
                  <p className="text-sm text-muted-foreground">Transactions over $10k require 2 verifiers</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Manage email and SMS communication content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Provider</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input type="password" value="****************" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sender Name</Label>
                    <Input defaultValue="Verza Notifications" />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Templates</h3>
                <div className="space-y-2">
                  <Label>Welcome Email Subject</Label>
                  <Input defaultValue="Welcome to Verza - Verify with Confidence" />
                </div>
                <div className="space-y-2">
                  <Label>Verification Success Body</Label>
                  <Textarea className="min-h-[100px]" defaultValue="Your verification request #{id} has been successfully completed by {verifier_name}. You can now view your credential on the dashboard." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
