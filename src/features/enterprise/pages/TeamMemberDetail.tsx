import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Mail, Calendar, Clock, 
  MoreHorizontal, Trash2, Ban, RefreshCw, Activity,
  CheckCircle
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
const MEMBER_DATA = {
  id: "TM-001", 
  name: "Alex Johnson", 
  email: "alex.j@company.com", 
  role: "Admin", 
  status: "active",
  joinDate: "Oct 15, 2023",
  lastActive: "2 mins ago",
  avatar: "/avatars/alex.jpg",
  permissions: [
    "Manage Team Members",
    "View Analytics",
    "Manage API Keys",
    "Process Verifications",
    "Billing Management"
  ],
  activity: [
    { id: 1, action: "Logged in", date: "Today, 9:30 AM", ip: "192.168.1.1" },
    { id: 2, action: "Created API Key", date: "Yesterday, 2:15 PM", ip: "192.168.1.1" },
    { id: 3, action: "Invited Sarah Connor", date: "Oct 20, 2023", ip: "192.168.1.1" },
    { id: 4, action: "Updated Billing Info", date: "Oct 18, 2023", ip: "192.168.1.1" },
  ]
};

export default function TeamMemberDetail() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const member = MEMBER_DATA;

  const handleAction = async (action: string) => {
    setIsLoading(true);
    console.log(`Performing ${action}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/enterprise/team')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{member.name}</h1>
          <div className="flex items-center text-muted-foreground text-sm">
            <Mail className="mr-2 h-3 w-3" />
            {member.email}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : "Actions"} <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction('reset_password')}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('suspend')} className="text-orange-500">
                <Ban className="mr-2 h-4 w-4" /> Suspend Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('delete')} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" /> Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={member.avatar || undefined} />
                <AvatarFallback className="text-2xl">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center">{member.name}</CardTitle>
            <CardDescription className="text-center flex items-center justify-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {member.role}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                {member.status}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Joined</div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {member.joinDate}
              </div>
            </div>
            <Separator />
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Last Active</div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {member.lastActive}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions & Access</CardTitle>
                  <CardDescription>
                    Current role permissions for this user.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {member.permissions.map((perm, index) => (
                      <div key={index} className="flex items-center p-3 rounded-lg border bg-card/50">
                        <CheckCircle className="mr-3 h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-medium">{perm}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                    <div className="space-y-1">
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">Extra layer of security for the account</div>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions performed by this user.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {member.activity.map((item) => (
                      <div key={item.id} className="flex items-start">
                        <Activity className="mr-4 h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{item.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.date} • IP: {item.ip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
