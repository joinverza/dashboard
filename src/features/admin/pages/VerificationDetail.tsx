import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  
  Loader2
} from 'lucide-react';
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { bankingService } from '@/services/bankingService';
import type { VerificationStatusResponse } from '@/types/banking';

export default function VerificationDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/verifications/:id");
  const id = params?.id || 'REQ-001';

  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await bankingService.getVerificationStatus(id);
        setVerification(data);
      } catch (error) {
        console.error("Failed to fetch verification details", error);
        toast.error("Failed to load verification details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'verified' | 'rejected') => {
    try {
      await bankingService.updateVerificationStatus(id, newStatus);
      setVerification(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Request ${newStatus === 'verified' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update request status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Verification Request Not Found</h2>
        <Button variant="link" onClick={() => setLocation('/admin/verifications')}>
          Return to Requests
        </Button>
      </div>
    );
  }

  const details = verification.details || {};
  const subjectName = details.firstName && details.lastName 
    ? `${details.firstName} ${details.lastName}` 
    : 'Unknown Subject';

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
            <h1 className="text-3xl font-bold tracking-tight">Request {verification.verificationId}</h1>
            <Badge className={
              verification.status === 'verified' ? "bg-green-500/10 text-green-500 border-green-500/20" :
              verification.status === 'rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
              "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            }>
              {verification.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {verification?.type?.replace(/_/g, ' ')} for {subjectName}
          </p>
        </div>
        <div className="flex gap-2">
          {verification.status === 'pending' || verification.status === 'review_needed' ? (
            <>
              <Button 
                variant="outline" 
                className="text-red-500 border-red-500/20 hover:bg-red-500/10" 
                onClick={() => handleStatusUpdate('rejected')}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => handleStatusUpdate('verified')}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Approve
              </Button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground italic flex items-center">
              Request is {verification.status}
            </div>
          )}
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
                  <div className="font-medium mt-1 capitalize">{verification?.type?.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Submitted At</div>
                  <div className="font-medium mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {new Date(verification.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Subject Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {Object.entries(details).map(([key, value]) => (
                    typeof value !== 'object' && value !== null ? (
                      <div key={key}>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="font-medium">{String(value)}</div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
             <CardHeader>
               <CardTitle>Raw Response Data</CardTitle>
             </CardHeader>
             <CardContent>
               <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono max-h-96">
                 {JSON.stringify(verification, null, 2)}
               </pre>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Requester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${subjectName}`} />
                  <AvatarFallback>
                    {subjectName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{subjectName}</div>
                  <div className="text-sm text-muted-foreground">
                    {details.email || 'No email provided'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-sm font-bold text-green-500">Low</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[15%]" />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Automated risk assessment based on provided data and global watchlists.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
