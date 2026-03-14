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
  MessageSquare,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { bankingService } from "@/services/bankingService";
import type { VerificationStatusResponse } from "@/types/banking";
import { toast } from "sonner";

export default function JobDetail() {
  const [, params] = useRoute("/verifier/jobs/:id");
  const id = params?.id;
  
  const [job, setJob] = useState<VerificationStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const data = await bankingService.getVerificationStatus(id);
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job details", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Job Not Found</h2>
        <Button variant="link" onClick={() => window.history.back()}>
          Return to Jobs
        </Button>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!job) return;
    try {
      await bankingService.updateVerificationStatus(id || "", newStatus);
      setJob({ ...job, status: newStatus as any });
      toast.success(`Job status updated to ${newStatus.replace('_', ' ')}`);
      
      if (newStatus === 'verified' || newStatus === 'rejected') {
        setTimeout(() => window.history.back(), 1500);
      }
    } catch (error) {
      console.error("Failed to update job status", error);
      toast.error("Failed to update job status");
    }
  };

  const subjectName = job.details?.firstName ? `${job.details.firstName} ${job.details.lastName}` : 'Unknown Subject';

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
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{getTypeLabel(job.type || "")}</h1>
              <Badge variant={job.status === 'review_needed' ? 'destructive' : 'secondary'}>
                {job.status === 'review_needed' ? 'High' : 'Normal'} Priority
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Job ID: #{id} • Posted {new Date(job.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {job.status === 'in_progress' ? (
            <>
              <Button 
                variant="outline" 
                className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                onClick={() => handleUpdateStatus('rejected')}
              >
                Reject
              </Button>
              <Button 
                className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
                onClick={() => handleUpdateStatus('verified')}
              >
                Verify & Complete
              </Button>
            </>
          ) : job.status === 'pending' || job.status === 'review_needed' ? (
            <>
              <Button variant="outline" onClick={() => window.history.back()}>
                Decline
              </Button>
              <Button 
                className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
                onClick={() => handleUpdateStatus('in_progress')}
              >
                Accept Job
              </Button>
            </>
          ) : (
            <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-2 rounded-md">
              Status: {job.status.replace('_', ' ').toUpperCase()}
            </div>
          )}
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
                <p className="text-lg">{subjectName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-lg">{job.details.country || 'Global'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{job.details.email || 'N/A'}</code>
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
                    <p className="text-muted-foreground font-medium">{job.details.documentType || 'Standard Document'}</p>
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
                        <span className="text-2xl font-bold text-verza-emerald">12/100</span>
                    </div>
                    <Progress value={12} className="h-2 bg-muted [&>div]:bg-verza-emerald" />
                    
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
                    <p className="text-sm font-medium text-muted-foreground">Raw Data</p>
                    <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(job.details, null, 2)}
                    </pre>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <p className="text-sm font-medium text-muted-foreground">Verification Type</p>
                         <div className="flex gap-2 mt-1">
                             <Badge variant="secondary">{getTypeLabel(job.type || "")}</Badge>
                         </div>
                    </div>
                    <div>
                         <p className="text-sm font-medium text-muted-foreground">Document Type</p>
                         <p className="mt-1">{job.details.documentType || 'N/A'}</p>
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
                        <span className="font-mono">$15.00</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Platform Fee (10%)</span>
                        <span className="font-mono text-red-400">-$1.50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Net Earnings</span>
                        <span className="text-verza-emerald">$13.50</span>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                         <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-muted-foreground"><Clock className="h-4 w-4 mr-2" /> Deadline</span>
                            <span className="font-medium text-orange-500">2 hours</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" /> Est. Time</span>
                            <span>15-20 mins</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={() => handleUpdateStatus('in_progress')}>
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
                        <li className="flex items-start gap-3 text-sm">
                            <div className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs text-muted-foreground">1</span>
                            </div>
                            <span>Verify photo match</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <div className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs text-muted-foreground">2</span>
                            </div>
                            <span>Check expiration date</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <div className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs text-muted-foreground">3</span>
                            </div>
                            <span>Validate security features</span>
                        </li>
                    </ul>
                </CardContent>
             </Card>
        </div>
      </div>
    </motion.div>
  );
}
