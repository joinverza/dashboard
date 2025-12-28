import { motion } from 'framer-motion';
import { 
  Building2, Globe, Mail, Phone, MapPin, 
  Save, Shield, Bell 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EnterpriseSettings() {
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
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Logo Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Company Logo</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Upload New</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Recommended size: 400x400px. Max size: 2MB.</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" defaultValue="Acme Corp" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select defaultValue="tech">
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
                    <Input className="pl-9" defaultValue="https://acme.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tax ID / EIN</Label>
                  <Input defaultValue="12-3456789" />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" defaultValue="contact@acme.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea className="pl-9 min-h-[80px]" defaultValue="123 Innovation Drive, Suite 100&#10;San Francisco, CA 94105" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/50 pt-6">
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
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
                 <Button variant="outline">Configure</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
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
                 <Button variant="outline">Enable</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
