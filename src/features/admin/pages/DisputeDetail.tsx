import { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  MessageSquare, 
  Shield, 
  XCircle, 
  AlertTriangle,
  Download,
  Gavel,
  History
} from 'lucide-react';
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DisputeDetail() {
  const [, setLocation] = useLocation();
  const [resolution, setResolution] = useState('full_refund');
  
  // Mock Data
  const dispute = {
    id: "DSP-2025-001",
    status: "open",
    filedBy: {
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      avatar: ""
    },
    against: {
      name: "SecureVerify Inc.",
      email: "support@secureverify.com",
      role: "Verifier",
      avatar: ""
    },
    filedDate: "2025-03-15",
    type: "Verification Quality",
    description: "The verification was completed but the extracted data contains multiple errors. The name was misspelled and the date of birth is incorrect. I requested a correction but the verifier refused.",
    evidence: [
      { name: "screenshot_error.png", size: "2.4 MB", type: "image/png" },
      { name: "email_thread.pdf", size: "1.1 MB", type: "application/pdf" }
    ],
    timeline: [
      { id: 1, type: "created", user: "John Doe", date: "2025-03-15 10:30 AM", message: "Dispute filed" },
      { id: 2, type: "comment", user: "System", date: "2025-03-15 10:30 AM", message: "Case assigned to Admin Team" },
      { id: 3, type: "response", user: "SecureVerify Inc.", date: "2025-03-15 02:15 PM", message: "We processed the document exactly as provided. The image quality was poor." }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/disputes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {dispute.id}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Badge variant="outline" className="text-blue-400 border-blue-400/20">{dispute.type}</Badge>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Filed on {dispute.filedDate}
            </span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant="destructive" className="h-8 px-4 text-sm bg-red-500/10 text-red-500 border-red-500/20">
            {dispute.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Dispute Details Card */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Dispute Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Filed By</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={dispute.filedBy.avatar} />
                      <AvatarFallback>{dispute.filedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{dispute.filedBy.name}</p>
                      <p className="text-xs text-muted-foreground">{dispute.filedBy.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Against</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={dispute.against.avatar} />
                      <AvatarFallback>{dispute.against.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{dispute.against.name}</p>
                      <p className="text-xs text-muted-foreground">{dispute.against.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed p-4 bg-muted/30 rounded-lg">
                  "{dispute.description}"
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Evidence</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dispute.evidence.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500/50" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success("File downloaded")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {dispute.timeline.map((event) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                          {event.type === 'created' ? <AlertTriangle className="h-4 w-4 text-yellow-500" /> :
                           event.type === 'response' ? <MessageSquare className="h-4 w-4 text-blue-500" /> :
                           <History className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="w-px h-full bg-border my-2" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{event.user}</span>
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Resolution Panel - Right Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-blue-500" />
                Resolution Verdict
              </CardTitle>
              <CardDescription>Make a final decision on this dispute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup defaultValue="full_refund" onValueChange={setResolution}>
                <div className="flex items-start space-x-2 space-y-1">
                  <RadioGroupItem value="full_refund" id="r1" className="mt-1" />
                  <div>
                    <Label htmlFor="r1" className="font-medium cursor-pointer">Full Refund</Label>
                    <p className="text-xs text-muted-foreground">Return 100% of funds to user</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 space-y-1">
                  <RadioGroupItem value="full_payment" id="r2" className="mt-1" />
                  <div>
                    <Label htmlFor="r2" className="font-medium cursor-pointer">Full Payment</Label>
                    <p className="text-xs text-muted-foreground">Release funds to verifier</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 space-y-1">
                  <RadioGroupItem value="partial_refund" id="r3" className="mt-1" />
                  <div>
                    <Label htmlFor="r3" className="font-medium cursor-pointer">Partial Refund</Label>
                    <p className="text-xs text-muted-foreground">Split funds between parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 space-y-1">
                  <RadioGroupItem value="reverify" id="r4" className="mt-1" />
                  <div>
                    <Label htmlFor="r4" className="font-medium cursor-pointer">Re-verification</Label>
                    <p className="text-xs text-muted-foreground">Require new verification attempt</p>
                  </div>
                </div>
              </RadioGroup>

              {resolution === 'partial_refund' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Refund Amount (USD)</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Resolution Note</Label>
                <Textarea 
                  placeholder="Explain your decision..." 
                  className="min-h-[100px]"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Dispute resolution submitted")}>
                Submit Resolution
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" onClick={() => toast.info("Message dialog opened")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Parties
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => toast.success("Blockchain proof verified")}>
                <Shield className="mr-2 h-4 w-4" />
                View Blockchain Proof
              </Button>
              <Button variant="outline" className="justify-start text-red-500 hover:text-red-600" onClick={() => toast.error("Dispute dismissed")}>
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss Dispute
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
