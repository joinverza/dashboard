import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  FileText, Shield, Download, ExternalLink,
  MessageSquare, AlertTriangle
} from 'lucide-react';
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MOCK_REQUEST = {
  id: 'REQ-001',
  user: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    did: 'did:verza:123...456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  verifier: {
    name: 'VeriTech Solutions',
    id: 'VER-789',
    type: 'Organization',
  },
  details: {
    type: 'Identity Verification',
    submittedAt: 'Oct 25, 2023, 10:30 AM',
    updatedAt: 'Oct 25, 2023, 2:15 PM',
    status: 'pending',
    priority: 'high',
    documents: [
      { name: 'passport_scan.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'utility_bill.jpg', size: '1.1 MB', type: 'Image' },
    ],
    notes: 'User provided additional documentation upon request.',
  },
};

export default function VerificationDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/verifications/:id");
  const id = params?.id || 'REQ-001';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-primary" onClick={() => setLocation('/admin/verifications')}>
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </Button>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Request {id}</h1>
            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending Review</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Identity Verification for Alice Johnson</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={() => toast.error("Request rejected")}>
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast.success("Request approved")}>
            <CheckCircle className="mr-2 h-4 w-4" /> Approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>Information submitted by the user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Request Type</div>
                  <div className="font-medium mt-1">{MOCK_REQUEST.details.type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Submitted At</div>
                  <div className="font-medium mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {MOCK_REQUEST.details.submittedAt}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Submitted Documents</h3>
                <div className="grid gap-3">
                  {MOCK_REQUEST.details.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size} • {doc.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toast.success("Downloading document...")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="p-3 rounded-lg bg-secondary/10 text-sm">
                  {MOCK_REQUEST.details.notes}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 <div className="flex gap-3">
                   <Avatar className="h-8 w-8">
                     <AvatarFallback>SYS</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 space-y-1">
                     <div className="flex items-center justify-between">
                       <p className="text-sm font-medium">System</p>
                       <span className="text-xs text-muted-foreground">Oct 25, 10:30 AM</span>
                     </div>
                     <p className="text-sm text-muted-foreground">Request created automatically.</p>
                   </div>
                 </div>
                 <div className="flex gap-3">
                   <Avatar className="h-8 w-8">
                     <AvatarFallback>VER</AvatarFallback>
                   </Avatar>
                   <div className="flex-1 space-y-1">
                     <div className="flex items-center justify-between">
                       <p className="text-sm font-medium">Verifier Agent</p>
                       <span className="text-xs text-muted-foreground">Oct 25, 1:00 PM</span>
                     </div>
                     <p className="text-sm text-muted-foreground">Requested additional proof of address.</p>
                   </div>
                 </div>
               </div>
               <div className="mt-4 pt-4 border-t border-border/50">
                 <Button variant="outline" className="w-full">
                   <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={MOCK_REQUEST.user.avatar} />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{MOCK_REQUEST.user.name}</p>
                  <p className="text-sm text-muted-foreground">{MOCK_REQUEST.user.email}</p>
                </div>
              </div>
              <div className="text-xs font-mono p-2 bg-secondary/30 rounded break-all">
                {MOCK_REQUEST.user.did}
              </div>
              <Button variant="outline" className="w-full" onClick={() => setLocation('/admin/users/1')}>
                View Profile <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Assigned Verifier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{MOCK_REQUEST.verifier.name}</p>
                  <p className="text-sm text-muted-foreground">{MOCK_REQUEST.verifier.type}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setLocation('/admin/verifiers/1')}>
                View Verifier <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                <div>
                  <p className="font-medium text-sm">High Priority</p>
                  <p className="text-xs text-muted-foreground mt-1">This request has been flagged for expedited review due to enterprise SLA.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
