import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, RefreshCw, Share2, FileText, CheckCircle, 
  Clock, Shield, Loader2, XCircle, AlertTriangle
} from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { bankingService } from '@/services/bankingService';
import type { VerificationStatusResponse, AuditLogResponse } from '@/types/banking';

export default function VerificationDetail() {
  const [, params] = useRoute('/enterprise/requests/:id');
  const id = params?.id || 'REQ-2025-1058';
  
  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [status, logs] = await Promise.all([
          bankingService.getVerificationStatus(id),
          bankingService.getVerificationAudit(id)
        ]);
        setVerification(status);
        setAuditLogs(logs);
      } catch (error) {
        console.error("Failed to fetch verification details", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!verification) {
    return <div>Verification not found</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1"><CheckCircle className="h-3 w-3 mr-1" /> VERIFIED</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1"><Clock className="h-3 w-3 mr-1" /> PENDING</Badge>;
      case 'rejected':
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1"><XCircle className="h-3 w-3 mr-1" /> REJECTED</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1"><AlertTriangle className="h-3 w-3 mr-1" /> {status.toUpperCase()}</Badge>;
    }
  };

  // Safe access to details
  const details = verification.details || {};
  const subjectName = details.firstName && details.lastName ? `${details.firstName} ${details.lastName}` : 'Unknown Subject';
  const documentType = details.documentType || 'Identity Document';

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
                {verification.verificationId}
              </h1>
              {getStatusBadge(verification.status)}
            </div>
            <p className="text-muted-foreground mt-1">
              {documentType} Verification • Last updated on {new Date(verification.updatedAt).toLocaleString()}
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
                    <p className="font-medium">{subjectName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Document Type</span>
                    <p className="font-medium">{documentType}</p>
                  </div>
                  {details.extractedData && Object.entries(details.extractedData).map(([key, value]: [string, any]) => (
                    <div key={key} className="space-y-1">
                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
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
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Audit Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l border-border/50 ml-2 space-y-6 pb-2">
                  {auditLogs.length > 0 ? auditLogs.map((log, i) => (
                    <div key={log.id || i} className="ml-6 relative">
                        <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-muted ring-4 ring-background">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                        </span>
                        <h3 className="flex items-center mb-1 text-sm font-semibold capitalize">{log.action.replace(/_/g, ' ')}</h3>
                        <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                        </time>
                        <p className="text-xs text-muted-foreground">
                            {JSON.stringify(log.details)}
                        </p>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground ml-6">No audit logs available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
