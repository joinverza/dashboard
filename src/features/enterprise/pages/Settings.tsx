import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Globe, Mail, Phone, MapPin, 
  Save, Shield, Bell, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { bankingService } from '@/services/bankingService';
import type { ApiSecuritySettings, CompanySettings } from '@/types/banking';
import { toast } from 'sonner';
import { TabHelpCard } from '@/components/shared/TabHelpCard';

export default function EnterpriseSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [apiSecurity, setApiSecurity] = useState<ApiSecuritySettings | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await bankingService.getCompanySettings();
      setSettings(data);
      const securityData = await bankingService.getApiSecuritySettings();
      setApiSecurity(securityData);
    } catch (error) {
      console.error("Failed to fetch company settings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !apiSecurity) return;
    
    try {
      setIsSaving(true);
      const [updated, updatedSecurity] = await Promise.all([
        bankingService.updateCompanySettings(settings),
        bankingService.updateApiSecuritySettings(apiSecurity),
      ]);
      setSettings(updated);
      setApiSecurity(updatedSecurity);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !settings) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error('Image is too large. Max size is 10MB.');
      return;
    }
    try {
      setIsSaving(true);
      const uploaded = await bankingService.uploadCompanyLogo(file);
      setSettings({ ...settings, logoUrl: uploaded.logoUrl });
      toast.success('Logo updated');
    } catch (error) {
      console.error('Failed to upload logo', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsSaving(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const handleLogoRemove = () => {
    if (!settings) return;
    setSettings({ ...settings, logoUrl: '' });
    toast.success('Logo removed');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your company profile and preferences.</p>
      </div>
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="company">Company Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <TabHelpCard
            title="Company Profile"
            description="Update core business identity details shown across your organization and integrations."
            icon={Building2}
            sectionLabel="Profile"
            tone="blue"
            useWhen="you need to update legal/contact information or branding assets."
            highlights={['Business details', 'Contact fields', 'Logo management']}
          />
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              {/* Logo Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={settings?.logoUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{settings?.companyName?.substring(0, 2).toUpperCase() || 'CP'}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Company Logo</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>Upload New</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleLogoRemove}>Remove</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended size: 400x400px. Max size: 2MB.</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      value={settings?.companyName || ''} 
                      onChange={(e) => setSettings({...settings!, companyName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select 
                    value={settings?.industry || 'tech'} 
                    onValueChange={(v) => setSettings({...settings!, industry: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      value={settings?.website || ''} 
                      onChange={(e) => setSettings({...settings!, website: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tax ID / EIN</Label>
                  <Input 
                    value={settings?.taxId || ''} 
                    onChange={(e) => setSettings({...settings!, taxId: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      value={settings?.email || ''} 
                      onChange={(e) => setSettings({...settings!, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9" 
                      value={settings?.phone || ''} 
                      onChange={(e) => setSettings({...settings!, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      className="pl-9 min-h-[80px]" 
                      value={settings?.address || ''} 
                      onChange={(e) => setSettings({...settings!, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/50 pt-6">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <TabHelpCard
            title="Notifications"
            description="Control how operational and security events are delivered to your team."
            icon={Bell}
            sectionLabel="Alerts"
            tone="violet"
            useWhen="different teams need different channels for critical and non-critical updates."
            highlights={['Email alerts', 'SMS alerts', 'Webhook notifications']}
          />
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Bell className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="font-medium">Email Notifications</div>
                     <div className="text-sm text-muted-foreground">Receive daily summaries and critical alerts.</div>
                   </div>
                 </div>
                 <Switch 
                    checked={settings?.notifications?.email || false}
                    onCheckedChange={(c) => setSettings({...settings!, notifications: {...settings!.notifications, email: c}})}
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Phone className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="font-medium">SMS Notifications</div>
                     <div className="text-sm text-muted-foreground">Receive urgent alerts via SMS.</div>
                   </div>
                 </div>
                 <Switch 
                    checked={settings?.notifications?.sms || false}
                    onCheckedChange={(c) => setSettings({...settings!, notifications: {...settings!.notifications, sms: c}})}
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Globe className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="font-medium">Webhook Notifications</div>
                     <div className="text-sm text-muted-foreground">Receive real-time events via webhooks.</div>
                   </div>
                 </div>
                 <Switch 
                    checked={settings?.notifications?.webhook || false}
                    onCheckedChange={(c) => setSettings({...settings!, notifications: {...settings!.notifications, webhook: c}})}
                 />
               </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/50 pt-6">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <TabHelpCard
            title="Security"
            description="Strengthen account and API protection with authentication and network controls."
            icon={Shield}
            sectionLabel="Protection"
            tone="blue"
            useWhen="you are hardening production access and reducing account compromise risk."
            highlights={['MFA controls', 'Secret rotation', 'IP whitelist rules']}
          />
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage password and authentication settings.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Shield className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="font-medium">Two-Factor Authentication</div>
                     <div className="text-sm text-muted-foreground">Add an extra layer of security to your account.</div>
                   </div>
                 </div>
                 <Switch 
                    checked={settings?.security?.mfaEnabled || false}
                    onCheckedChange={(c) => setSettings({...settings!, security: {...settings!.security, mfaEnabled: c}})}
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Shield className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="font-medium">Auto Rotate API Secrets</div>
                     <div className="text-sm text-muted-foreground">Enable periodic API secret rotation.</div>
                   </div>
                 </div>
                 <Switch
                    checked={apiSecurity?.autoRotateSecrets || false}
                    onCheckedChange={(c) => setApiSecurity((prev) => prev ? { ...prev, autoRotateSecrets: c } : prev)}
                 />
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <Shield className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="font-medium">IP Whitelist</div>
                     <div className="text-sm text-muted-foreground">Restrict API access to approved IP/CIDR ranges.</div>
                   </div>
                 </div>
                 <Switch
                    checked={apiSecurity?.ipWhitelistEnabled || false}
                    onCheckedChange={(c) => setApiSecurity((prev) => prev ? { ...prev, ipWhitelistEnabled: c } : prev)}
                 />
               </div>
               <div className="space-y-2">
                 <Label>Allowed IPs (comma separated)</Label>
                 <Textarea
                   className="min-h-[80px]"
                   value={(apiSecurity?.allowedIps || []).join(', ')}
                   onChange={(e) => {
                     const ips = e.target.value
                       .split(',')
                       .map((item) => item.trim())
                       .filter(Boolean);
                     setApiSecurity((prev) => prev ? { ...prev, allowedIps: ips } : prev);
                   }}
                 />
               </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/50 pt-6">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
