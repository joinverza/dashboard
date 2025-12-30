import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Save, 
  Key, 
  LifeBuoy, 
  Plus, 
  Copy, 
  Trash2, 
  ExternalLink, 
  MessageSquare,
  CreditCard,
  FileText,
  Download,
  Lock
} from 'lucide-react';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    security: true,
  });

  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || "");
  const [lastName, setLastName] = useState(user?.name.split(' ').slice(1).join(' ') || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = () => {
    if (!firstName || !lastName || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Profile updated successfully");
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const apiKeys = [
    { id: 1, name: "Production Key", prefix: "pk_live_", created: "Oct 24, 2023", lastUsed: "2 mins ago", status: "Active" },
    { id: 2, name: "Test Key", prefix: "pk_test_", created: "Oct 20, 2023", lastUsed: "5 days ago", status: "Active" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
      data-testid="page-settings"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Lock className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="support" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <LifeBuoy className="h-4 w-4 mr-2" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-card-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-gradient-to-br from-verza-emerald to-verza-kelly text-white text-xl font-medium">
                      {user?.name?.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          toast.success("Avatar updated successfully");
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      data-testid="button-change-avatar" 
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} data-testid="input-first-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} data-testid="input-last-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={user?.role} disabled data-testid="input-role" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-verza-emerald hover:bg-verza-kelly" 
                    data-testid="button-save-profile"
                    onClick={handleSaveProfile}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-card-border">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                  { key: 'marketing', label: 'Marketing Emails', description: 'Receive marketing and promotional emails' },
                  { key: 'security', label: 'Security Alerts', description: 'Receive alerts about account security' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                      data-testid={`switch-${item.key}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-card-border">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the dashboard looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-4 block">Theme</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme('light')}
                      className={cn(
                        'p-4 rounded-lg border-2 cursor-pointer transition-colors',
                        theme === 'light'
                          ? 'border-verza-emerald bg-verza-emerald/10'
                          : 'border-border hover:border-verza-emerald/50'
                      )}
                      data-testid="theme-light"
                    >
                      <div className="w-full h-20 rounded-md bg-white border border-gray-200 mb-3" />
                      <p className="font-medium text-center">Light</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme('dark')}
                      className={cn(
                        'p-4 rounded-lg border-2 cursor-pointer transition-colors',
                        theme === 'dark'
                          ? 'border-verza-emerald bg-verza-emerald/10'
                          : 'border-border hover:border-verza-emerald/50'
                      )}
                      data-testid="theme-dark"
                    >
                      <div className="w-full h-20 rounded-md bg-gray-900 border border-gray-700 mb-3" />
                      <p className="font-medium text-center">Dark</p>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-card-border">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" data-testid="input-current-password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" data-testid="input-new-password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" data-testid="input-confirm-password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-verza-emerald hover:bg-verza-kelly" 
                    data-testid="button-update-password"
                    onClick={() => toast.success("Password updated successfully")}
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="privacy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-card-border mb-6">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share Analytics</p>
                    <p className="text-sm text-muted-foreground">Allow us to collect anonymous usage data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share with Partners</p>
                    <p className="text-sm text-muted-foreground">Allow trusted partners to view your verified status</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-card-border border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                    <div>
                      <p className="font-medium text-red-500">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                          toast.error("Account deletion request submitted");
                        }
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="billing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-verza-emerald/20 to-transparent border-verza-emerald/20 md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Current Plan: Pro</CardTitle>
                      <CardDescription>Billed annually</CardDescription>
                    </div>
                    <Badge className="bg-verza-emerald">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Verifications</span>
                      <span>45 / 50 used</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-verza-emerald w-[90%]" />
                    </div>
                  </div>
                  <Button 
                    className="bg-verza-emerald hover:bg-verza-kelly text-white"
                    onClick={() => toast.success("Redirecting to upgrade page...")}
                  >
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-card-border">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast.success("Payment method update modal would open here")}
                  >
                    Update Method
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm border-card-border">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: 'Oct 01, 2023', amount: '$29.00', status: 'Paid', invoice: '#INV-001' },
                    { date: 'Sep 01, 2023', amount: '$29.00', status: 'Paid', invoice: '#INV-002' },
                    { date: 'Aug 01, 2023', amount: '$29.00', status: 'Paid', invoice: '#INV-003' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-secondary/30 rounded-full">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.date}</p>
                          <p className="text-sm text-muted-foreground">{item.invoice}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-medium">{item.amount}</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {item.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toast.success(`Invoice ${item.invoice} downloaded`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="api-keys">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-card-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for external access</CardDescription>
                </div>
                <Button 
                  className="bg-verza-emerald hover:bg-verza-kelly text-white"
                  onClick={() => toast.success("New API key generated")}
                >
                  <Plus className="h-4 w-4 mr-2" /> Create New Key
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{key.name}</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] h-5">
                          {key.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                        <span>{key.prefix}************************</span>
                        <Copy 
                          className="h-3 w-3 cursor-pointer hover:text-white" 
                          onClick={() => {
                            navigator.clipboard.writeText(`${key.prefix}sk_live_...`);
                            toast.success("API key copied to clipboard");
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {key.created} • Last used: {key.lastUsed}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm(`Are you sure you want to revoke the ${key.name}?`)) {
                          toast.error("API key revoked");
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> API Documentation
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check out our documentation to learn how to authenticate requests using your API keys.
                  </p>
                  <Button variant="link" className="text-blue-400 p-0 h-auto">
                    View Documentation &rarr;
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="support">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm border-card-border">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>We're here to help with any questions or issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input placeholder="What can we help you with?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea placeholder="Describe your issue in detail..." className="min-h-[120px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Input type="radio" id="low" name="priority" className="w-4 h-4" />
                        <Label htmlFor="low" className="font-normal">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input type="radio" id="medium" name="priority" className="w-4 h-4" defaultChecked />
                        <Label htmlFor="medium" className="font-normal">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input type="radio" id="high" name="priority" className="w-4 h-4" />
                        <Label htmlFor="high" className="font-normal">High</Label>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-verza-emerald hover:bg-verza-kelly"
                    onClick={() => toast.success("Support ticket submitted successfully")}
                  >
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-card/80 backdrop-blur-sm border-card-border">
                  <CardHeader>
                    <CardTitle>FAQ</CardTitle>
                    <CardDescription>Quick answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      "How do I verify my identity?",
                      "What payment methods are accepted?",
                      "How long does verification take?",
                      "Is my data secure?"
                    ].map((q, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer flex justify-between items-center">
                        <span className="text-sm font-medium">{q}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-verza-emerald/20 to-transparent border-verza-emerald/20">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-verza-emerald/20 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-verza-emerald" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Chat with our support team in real-time</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-verza-emerald/50 text-verza-emerald hover:bg-verza-emerald hover:text-white"
                      onClick={() => toast.info("Connecting to live chat agent...")}
                    >
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
