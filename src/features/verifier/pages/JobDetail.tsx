import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  User, 
  Calendar,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Mock Data (in a real app, fetch by ID)
const JOB_DETAILS = {
  id: "1",
  type: "Identity Verification",
  requester: "John D.",
  requesterId: "DID:verza:123...456",
  price: 15.00,
  platformFee: 1.50,
  netEarnings: 13.50,
  urgency: "High",
  deadline: "2 hours",
  estimatedTime: "15-20 mins",
  riskScore: "Low",
  riskDetails: {
    score: 12,
    issues: []
  },
  location: "USA",
  postedTime: "10 mins ago",
  documentType: "Passport",
  documentPreview: "/placeholder-passport.png", // In real app, secure URL
  requirements: [
    "Verify photo match",
    "Check expiration date",
    "Validate security features (hologram)",
    "Confirm MRZ data"
  ],
  specialInstructions: "Please pay attention to the signature consistency.",
  languages: ["English"],
  description: "Standard identity verification request for new user onboarding."
};

export default function JobDetail() {
  const [match, params] = useRoute("/verifier/jobs/:id");
  const id = match ? params.id : null;
  
  // In a real app, useQuery to fetch job details by ID
  const job = JOB_DETAILS; 

  const handleAccept = () => {
    // Navigate to workspace or show success
    window.location.href = `/verifier/workspace/${id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto p-4 md:p-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{job.type}</h1>
              <Badge variant={job.urgency === 'High' ? 'destructive' : 'secondary'}>
                {job.urgency} Priority
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Job ID: #{id} • Posted {job.postedTime}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600">
            Decline
          </Button>
          <Button 
            className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
            onClick={handleAccept}
          >
            Accept Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requester Info */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-verza-emerald" />
                Requester Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{job.requester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-lg">{job.location}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">DID</p>
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{job.requesterId}</code>
              </div>
            </CardContent>
          </Card>

          {/* Document Preview & Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Document
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[200px] bg-black/20 rounded-lg m-4 border-2 border-dashed border-border/50">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">{job.documentType}</p>
                    <p className="text-xs text-muted-foreground/70">Preview hidden until accepted</p>
                </CardContent>
             </Card>

             <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-verza-emerald" />
                    AI Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-2xl font-bold text-verza-emerald">{job.riskDetails.score}/100</span>
                    </div>
                    <Progress value={job.riskDetails.score} className="h-2 bg-muted [&>div]:bg-verza-emerald" />
                    
                    <div className="bg-verza-emerald/10 p-3 rounded-md border border-verza-emerald/20 flex gap-3">
                        <CheckCircle className="h-5 w-5 text-verza-emerald shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-verza-emerald">Low Risk Detected</p>
                            <p className="text-xs text-muted-foreground">AI pre-screening found no major anomalies.</p>
                        </div>
                    </div>
                </CardContent>
             </Card>
          </div>
          
          {/* Additional Info */}
           <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Special Instructions</p>
                    <p className="mt-1">{job.specialInstructions}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <p className="text-sm font-medium text-muted-foreground">Required Language</p>
                         <div className="flex gap-2 mt-1">
                             {job.languages.map(lang => (
                                 <Badge key={lang} variant="secondary">{lang}</Badge>
                             ))}
                         </div>
                    </div>
                    <div>
                         <p className="text-sm font-medium text-muted-foreground">Document Type</p>
                         <p className="mt-1">{job.documentType}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Action & Payment */}
        <div className="space-y-6">
             <Card className="bg-card/80 backdrop-blur-sm border-border/50 border-t-4 border-t-verza-emerald shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-verza-emerald" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Job Price</span>
                        <span className="font-mono">${job.price.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Platform Fee (10%)</span>
                        <span className="font-mono text-red-400">-${job.platformFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Net Earnings</span>
                        <span className="text-verza-emerald">${job.netEarnings.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                         <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-muted-foreground"><Clock className="h-4 w-4 mr-2" /> Deadline</span>
                            <span className="font-medium text-orange-500">{job.deadline}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" /> Est. Time</span>
                            <span>{job.estimatedTime}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={handleAccept}>
                        Accept Job Now
                    </Button>
                </CardFooter>
             </Card>

             <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Requirements Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <div className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs text-muted-foreground">{i+1}</span>
                                </div>
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
             </Card>
        </div>
      </div>
    </motion.div>
  );
}
