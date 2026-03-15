import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  CheckCircle, 
  XCircle, 
  Save, 
  Clock,
  AlertTriangle,
  
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bankingService } from "@/services/bankingService";
import type { VerificationStatusResponse } from "@/types/banking";
import { toast } from "sonner";

export default function DocumentReview() {
  const [match, params] = useRoute("/verifier/workspace/:id");
  const id = match ? params.id : null;
  
  const [job, setJob] = useState<VerificationStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const data = await bankingService.getVerificationStatus(id);
        setJob(data);
        
        // Initialize checklist
        const initialChecklist = {
            "r1": false,
            "r2": false,
            "r3": false,
            "r4": false,
            "r5": false
        };
        setChecklist(initialChecklist);
      } catch (error) {
        console.error("Failed to fetch job details", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleCheck = (id: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [id]: checked }));
  };

  const requirements = [
    { id: "r1", label: "Photo matches requester profile" },
    { id: "r2", label: "Document is not expired" },
    { id: "r3", label: "Holograms are visible and valid" },
    { id: "r4", label: "MRZ code matches data" },
    { id: "r5", label: "No signs of tampering" }
  ];

  const allChecked = requirements.every(req => checklist[req.id]);

  const handleApprove = async () => {
    if (!id) return;
    try {
      await bankingService.updateVerificationStatus(id, 'verified', notes);
      toast.success("Verification approved successfully");
      setIsApproveDialogOpen(false);
      setTimeout(() => window.location.href = "/verifier/dashboard", 1500);
    } catch (error) {
      console.error("Failed to approve verification", error);
      toast.error("Failed to approve verification");
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await bankingService.updateVerificationStatus(id, 'rejected', notes);
      toast.success("Verification rejected");
      setTimeout(() => window.location.href = "/verifier/dashboard", 1500);
    } catch (error) {
      console.error("Failed to reject verification", error);
      toast.error("Failed to reject verification");
    }
  };

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
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const details = job.details ?? {};
  const documentUrl = typeof details.documentUrl === 'string' ? details.documentUrl : "/placeholder-passport.png";
  const documentType = typeof details.documentType === 'string' ? details.documentType : "Identity Document";
  const requesterName = details.firstName ? `${details.firstName} ${details.lastName}` : "Unknown Subject";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <h1 className="text-lg font-semibold">{job.type ? job.type.replace('_', ' ').toUpperCase() : 'VERIFICATION'} - #{id?.substring(0, 8)}</h1>
             <p className="text-xs text-muted-foreground">Requester: {requesterName} • {documentType}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border border-border">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50" onClick={handleReject}>
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" /> Save Draft
                </Button>
            </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Document Viewer */}
        <div className="flex-1 bg-black/10 relative overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur border border-border rounded-full shadow-lg p-1.5 flex gap-2 z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-border" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-8 bg-border" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                </Button>
                 <div className="w-px h-8 bg-border" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-8">
                <motion.div 
                    className="relative shadow-2xl"
                    style={{ 
                        scale, 
                        rotate: rotation,
                        transformOrigin: "center center"
                    }}
                >
                    <img 
                        src={documentUrl} 
                        alt="Document to review" 
                        className="max-w-full rounded-lg"
                        style={{ maxHeight: 'calc(100vh - 12rem)' }}
                    />
                </motion.div>
            </div>
        </div>

        {/* Right Panel: Verification Tools */}
        <div className="w-[400px] border-l border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
            <Tabs defaultValue="checklist" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 p-2 h-14 bg-transparent border-b border-border/50 rounded-none">
                    <TabsTrigger value="checklist">Checklist</TabsTrigger>
                    <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        <TabsContent value="checklist" className="mt-0 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verification Requirements</h3>
                                {requirements.map(req => (
                                    <div key={req.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
                                        <Checkbox 
                                            id={req.id} 
                                            checked={checklist[req.id] || false}
                                            onCheckedChange={(checked) => handleCheck(req.id, checked as boolean)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label 
                                                htmlFor={req.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {req.label}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-500">Verifier Tip</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Pay close attention to the expiration date. Ensure it matches the extracted data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ai" className="mt-0 space-y-6">
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        AI Confidence
                                        <span className="text-primary">{job.details?.aiScore || 95}%</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Fraud Risk</span>
                                            <span className="font-medium text-primary">Low</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Data Extraction</span>
                                            <span className="font-medium text-primary">High Accuracy</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Extracted Data</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-2 text-sm border-b border-border/30 pb-2">
                                        <span className="capitalize text-muted-foreground">Name</span>
                                        <span className="col-span-2 font-mono truncate">{job.details?.firstName} {job.details?.lastName}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm border-b border-border/30 pb-2">
                                        <span className="capitalize text-muted-foreground">DOB</span>
                                        <span className="col-span-2 font-mono truncate">{job.details?.dob}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm border-b border-border/30 pb-2">
                                        <span className="capitalize text-muted-foreground">Doc Num</span>
                                        <span className="col-span-2 font-mono truncate">{job.details?.idDocumentNumber}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm border-b border-border/30 pb-2">
                                        <span className="capitalize text-muted-foreground">Address</span>
                                        <span className="col-span-2 font-mono truncate">
                                          {job.details?.address ? `${job.details.address.city}, ${job.details.address.country}` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="mt-0">
                             <div className="space-y-2">
                                <Label>Internal Notes</Label>
                                <Textarea 
                                    placeholder="Add any observations or comments here..." 
                                    className="min-h-[200px]"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">These notes will be saved with the verification record.</p>
                             </div>
                        </TabsContent>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur space-y-3">
                    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                                disabled={!allChecked}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve & Verify
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Verification</DialogTitle>
                                <DialogDescription>
                                    You are about to verify this document. This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="rounded-lg bg-muted p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Credential Type</span>
                                        <span className="font-medium">{job.type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Requester</span>
                                        <span className="font-medium">{requesterName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Estimated Reward</span>
                                        <span className="font-medium text-primary">$15.00</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="confirm" 
                                      checked={confirmChecked}
                                      onCheckedChange={(c) => setConfirmChecked(c as boolean)}
                                    />
                                    <label htmlFor="confirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I certify that I have verified this document according to the protocol.
                                    </label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleApprove} disabled={!confirmChecked}>Confirm Approval</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
