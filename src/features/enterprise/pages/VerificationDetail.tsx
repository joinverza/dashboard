import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, RefreshCw, Share2, FileText, CheckCircle, 
  Clock, Shield, ExternalLink, Activity
} from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function VerificationDetail() {
  const [, params] = useRoute('/enterprise/requests/:id');
  const id = params?.id || 'REQ-2025-1058';

  // Mock data
  const requestData = {
    id: id,
    type: "University Degree Verification",
    status: "completed",
    submittedDate: "2025-03-15 10:30 AM",
    completedDate: "2025-03-15 02:45 PM",
    requester: "Sarah Connor",
    verifier: "Verza Verify",
    subject: {
      name: "John Doe",
      email: "john.doe@example.com",
      id: "D12345678"
    },
    document: {
      type: "Diploma",
      institution: "Stanford University",
      degree: "Master of Computer Science",
      year: "2022"
    },
    blockchain: {
      midnightHash: "0x7f...3a2b",
      cardanoHash: "0x8c...9d1e",
      block: "10582394",
      timestamp: "2025-03-15 14:45:22 UTC"
    },
    cost: {
      verificationFee: 10.00,
      platformFee: 2.50,
      total: 12.50
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <Link href="/enterprise/requests" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Requests
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-primary to-verza-secondary bg-clip-text text-transparent">
                {requestData.id}
              </h1>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
                <CheckCircle className="h-3 w-3 mr-1" /> COMPLETED
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {requestData.type} • Submitted on {requestData.submittedDate}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Download Proof
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button className="gap-2 bg-verza-primary hover:bg-verza-primary/90">
              <RefreshCw className="h-4 w-4" /> Re-verify
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Verification Results</CardTitle>
                <CardDescription>Verified data extracted from the document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Subject Name</span>
                    <p className="font-medium">{requestData.subject.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Subject ID</span>
                    <p className="font-medium">{requestData.subject.id}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Institution</span>
                    <p className="font-medium">{requestData.document.institution}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Degree</span>
                    <p className="font-medium">{requestData.document.degree}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Graduation Year</span>
                    <p className="font-medium">{requestData.document.year}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Verification Method</span>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-verza-primary" />
                      <span className="font-medium">Direct Source + Blockchain Anchor</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    Extracted Data Confidence
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Name Match</span>
                      <span className="text-green-500 font-medium">100%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span>Institution Match</span>
                      <span className="text-green-500 font-medium">98%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full w-[98%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Blockchain Proof</CardTitle>
                <CardDescription>Immutable record of verification on Midnight and Cardano</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <img src="/midnight-logo-placeholder.png" alt="M" className="w-4 h-4 opacity-70" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerText = 'M';
                      }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Midnight Transaction (Privacy Layer)</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded block truncate text-muted-foreground">
                        {requestData.blockchain.midnightHash}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <img src="/cardano-logo-placeholder.png" alt="C" className="w-4 h-4 opacity-70" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerText = 'C';
                      }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Cardano Transaction (Settlement Layer)</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded block truncate text-muted-foreground">
                        {requestData.blockchain.cardanoHash}
                      </code>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground px-1">
                    <span>Block: {requestData.blockchain.block}</span>
                    <span>{requestData.blockchain.timestamp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Requester</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">SC</div>
                      <span className="text-sm font-medium">{requestData.requester}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Verifier</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs text-green-500">V</div>
                      <span className="text-sm font-medium">{requestData.verifier}</span>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Cost Breakdown</span>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Verification Fee</span>
                        <span>${requestData.cost.verificationFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform Fee</span>
                        <span>${requestData.cost.platformFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/50">
                        <span>Total</span>
                        <span>${requestData.cost.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-border/50 ml-2 space-y-6 pb-2">
                  <div className="mb-6 ml-6 relative">
                    <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-4 ring-background">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">Completed</h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      {requestData.completedDate}
                    </time>
                    <p className="text-xs text-muted-foreground">
                      Verification finalized and proof generated.
                    </p>
                  </div>
                  <div className="mb-6 ml-6 relative">
                    <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 ring-4 ring-background">
                      <Activity className="h-3 w-3 text-white" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">Processing</h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      {requestData.submittedDate.replace('10:30', '10:35')}
                    </time>
                    <p className="text-xs text-muted-foreground">
                      Verifier started the verification process.
                    </p>
                  </div>
                  <div className="ml-6 relative">
                    <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-muted ring-4 ring-background">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">Submitted</h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      {requestData.submittedDate}
                    </time>
                    <p className="text-xs text-muted-foreground">
                      Request received by the system.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
