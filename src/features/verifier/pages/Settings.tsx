import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Monitor, Wallet } from "lucide-react";

export default function VerifierSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, security, and notification preferences.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details and account status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="verifier@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Digital Identity (DID)</Label>
                <div className="flex gap-2">
                  <Input defaultValue="did:verza:verifier:123456789" disabled className="font-mono bg-muted/20" />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                </div>
                <Button variant="outline">Update Password</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                 <div>
                   <div className="font-medium text-red-500">Danger Zone</div>
                   <div className="text-sm text-muted-foreground">Deactivate your account temporarily or permanently.</div>
                 </div>
                 <Button variant="destructive" size="sm">Deactivate Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Protect your account with additional security measures.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security to your account.</div>
                  </div>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2"><Monitor className="h-4 w-4" /> Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">💻</div>
                      <div>
                        <div className="text-sm font-medium">Windows PC - Chrome</div>
                        <div className="text-xs text-muted-foreground">New York, USA • Current Session</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" disabled>Active</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">📱</div>
                      <div>
                        <div className="text-sm font-medium">iPhone 13 - Safari</div>
                        <div className="text-xs text-muted-foreground">New York, USA • 2 hours ago</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2"><Wallet className="h-4 w-4" /> Connected Wallets</h3>
                <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/10">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">💳</div>
                     <div>
                       <div className="text-sm font-medium">Cardano Wallet (Nami)</div>
                       <div className="text-xs text-muted-foreground font-mono">addr1...xyz8</div>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500">Disconnect</Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">Connect New Wallet</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase">Job Alerts</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-jobs" className="flex-1">New Job Available</Label>
                  <Switch id="new-jobs" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="job-status" className="flex-1">Job Status Updates</Label>
                  <Switch id="job-status" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="deadlines" className="flex-1">Deadline Reminders</Label>
                  <Switch id="deadlines" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase">Payments</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="payment-received" className="flex-1">Payment Received</Label>
                  <Switch id="payment-received" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="payouts" className="flex-1">Payout Confirmations</Label>
                  <Switch id="payouts" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase">Communication</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-reviews" className="flex-1">New Reviews</Label>
                  <Switch id="new-reviews" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing" className="flex-1">Marketing & Updates</Label>
                  <Switch id="marketing" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
