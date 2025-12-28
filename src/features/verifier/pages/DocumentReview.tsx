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
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock Data
const JOB_DATA = {
  id: "1",
  type: "Identity Verification",
  requester: "John D.",
  documentType: "Passport",
  documentUrl: "/placeholder-passport.png",
  deadline: "1h 45m",
  requirements: [
    { id: "r1", label: "Photo matches requester profile" },
    { id: "r2", label: "Document is not expired" },
    { id: "r3", label: "Holograms are visible and valid" },
    { id: "r4", label: "MRZ code matches data" },
    { id: "r5", label: "No signs of tampering" }
  ],
  aiAnalysis: {
    score: 98,
    flags: [],
    extractedData: {
      name: "John Doe",
      dob: "1985-04-12",
      expiry: "2028-04-11",
      docNumber: "A12345678"
    }
  }
};

export default function DocumentReview() {
  const [match, params] = useRoute("/verifier/workspace/:id");
  const id = match ? params.id : null;
  
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const allChecked = JOB_DATA.requirements.every(req => checklist[req.id]);

  const handleApprove = () => {
    // Submit logic
    console.log("Approved");
    setIsApproveDialogOpen(false);
    window.location.href = "/verifier/completed";
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <h1 className="text-lg font-semibold">{JOB_DATA.type} - #{id}</h1>
             <p className="text-xs text-muted-foreground">Requester: {JOB_DATA.requester} • {JOB_DATA.documentType}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border border-border">
                <Clock className="h-4 w-4 text-verza-emerald" />
                <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" /> Save Draft
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Exit
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
                    {/* Placeholder Document */}
                    <div className="w-[500px] h-[700px] bg-white rounded-lg flex flex-col items-center justify-center border-8 border-gray-200">
                        <FileText className="h-32 w-32 text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium">Document Preview</p>
                        <p className="text-xs text-gray-300 mt-2">Scale: {Math.round(scale * 100)}%</p>
                    </div>
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
                                {JOB_DATA.requirements.map(req => (
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
                                            Pay close attention to the expiration date. The AI detected it might be close to expiring.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ai" className="mt-0 space-y-6">
                            <Card className="border-verza-emerald/20 bg-verza-emerald/5">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        AI Confidence
                                        <span className="text-verza-emerald">{JOB_DATA.aiAnalysis.score}%</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Fraud Risk</span>
                                            <span className="font-medium text-verza-emerald">Low</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Data Extraction</span>
                                            <span className="font-medium text-verza-emerald">High Accuracy</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">Extracted Data</h3>
                                <div className="space-y-3">
                                    {Object.entries(JOB_DATA.aiAnalysis.extractedData).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-3 gap-2 text-sm border-b border-border/30 pb-2">
                                            <span className="capitalize text-muted-foreground">{key}</span>
                                            <span className="col-span-2 font-mono truncate">{value}</span>
                                        </div>
                                    ))}
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
                                className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
                                disabled={!allChecked}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve & Sign Credential
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Confirm Verification</DialogTitle>
                                <DialogDescription>
                                    You are about to cryptographically sign this credential. This action cannot be undone and will be recorded on the blockchain.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="rounded-lg bg-muted p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Credential Type</span>
                                        <span className="font-medium">{JOB_DATA.type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Requester</span>
                                        <span className="font-medium">{JOB_DATA.requester}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Your Reward</span>
                                        <span className="font-medium text-verza-emerald">$13.50</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="confirm" />
                                    <label htmlFor="confirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I certify that I have verified this document according to the protocol.
                                    </label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
                                <Button className="bg-verza-emerald text-white" onClick={handleApprove}>Confirm & Sign</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="destructive" className="w-full">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Application
                    </Button>
                </div>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
