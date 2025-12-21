import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    security: true,
  });

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
          <TabsTrigger value="appearance" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald">
            <Shield className="h-4 w-4 mr-2" />
            Security
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
                      {currentUser.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" data-testid="button-change-avatar">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Anne" data-testid="input-first-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Cooper" data-testid="input-last-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={currentUser.email} data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={currentUser.role} disabled data-testid="input-role" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-verza-emerald hover:bg-verza-kelly" data-testid="button-save-profile">
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
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
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
                  <Button className="bg-verza-emerald hover:bg-verza-kelly" data-testid="button-update-password">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
