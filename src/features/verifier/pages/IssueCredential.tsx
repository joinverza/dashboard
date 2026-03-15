import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertCircle, FileCheck, Key, Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { bankingService } from '@/services/bankingService';
import { toast } from "sonner";
import type {  } from '@/types/banking';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function IssueCredential() {
  const [, params] = useRoute("/verifier/issue/:id");
  const id = params?.id;
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      dob: '',
      docNumber: '',
      expiry: '',
      nationality: '',
      notes: ''
  });

  useEffect(() => {
    if (id) {
        fetchData(id);
    }
  }, [id]);

  const fetchData = async (verificationId: string) => {
    setIsLoading(true);
    try {
        const data = await bankingService.getVerificationStatus(verificationId);
        
        // Pre-fill form data if available in details (mock logic for now as details might be generic)
        if (data.details) {
            setFormData({
                firstName: data.details.firstName || 'Sarah', // Fallback for demo if API returns empty details
                lastName: data.details.lastName || 'Connor',
                dob: data.details.dob || '1985-05-12',
                docNumber: data.details.documentNumber || 'A12345678',
                expiry: data.details.expiryDate || '2030-05-12',
                nationality: data.details.nationality || 'United States',
                notes: ''
            });
        } else {
             // Fallback mock data for demo purposes if API doesn't return rich details yet
             setFormData({
                firstName: 'Sarah',
                lastName: 'Connor',
                dob: '1985-05-12',
                docNumber: 'A12345678',
                expiry: '2030-05-12',
                nationality: 'United States',
                notes: ''
            });
        }
    } catch (error) {
        console.error("Failed to fetch verification data", error);
        toast.error("Failed to load verification details");
        // Fallback for demo
        setFormData({
            firstName: 'Sarah',
            lastName: 'Connor',
            dob: '1985-05-12',
            docNumber: 'A12345678',
            expiry: '2030-05-12',
            nationality: 'United States',
            notes: ''
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleIssueCredential = async () => {
    if (!id) return;
    
    setIsIssuing(true);
    try {
        await bankingService.issueCredential({
            verificationId: id,
            recipientDid: `did:verza:${id.substring(0, 8)}`, // Mock DID generation
            credentialType: 'IdentityVerification',
            data: formData,
            notes: formData.notes
        });
        toast.success("Credential issued successfully");
        setIsConfirmOpen(false);
        // Could redirect here
    } catch (error) {
        console.error("Failed to issue credential", error);
        toast.error("Failed to issue credential");
    } finally {
        setIsIssuing(false);
    }
  };

  if (isLoading) {
      return (
          <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-verza-primary" />
          </div>
      );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Issue Credential</h1>
          <p className="text-muted-foreground">Review and sign the final credential to complete the verification.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/verifier/review/${id}`}>
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Review
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Credential Information</CardTitle>
              <CardDescription>
                Verify the data that will be written to the credential. This cannot be changed after issuance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Credential Type</Label>
                  <Input value="Identity Verification (Passport)" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Recipient DID</Label>
                  <Input value={`did:verza:${id?.substring(0, 8)}...`} disabled className="font-mono" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground uppercase">Extracted Data</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" value={formData.dob} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docNumber">Document Number</Label>
                    <Input id="docNumber" value={formData.docNumber} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" value={formData.expiry} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" value={formData.nationality} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/50">
                <Label htmlFor="notes">Verifier Notes (Public)</Label>
                <Textarea id="notes" value={formData.notes} onChange={handleInputChange} placeholder="Any additional notes attached to this credential..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Issuance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/20 rounded-lg border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-verza-emerald">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Digital Signature</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  You are signing with your specialized verifier key (did:verza:verifier:...)
                </p>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <Key className="h-4 w-4" />
                  <span className="font-medium">Blockchain Anchoring</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  A ZK proof of this credential will be anchored for immutability and privacy.
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Verification Fee</span>
                   <span>$25.00</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Platform Fee (10%)</span>
                   <span>-$2.50</span>
                 </div>
                 <div className="flex justify-between font-medium pt-2 border-t border-border/50">
                   <span>Net Earnings</span>
                   <span className="text-verza-emerald">+$22.50</span>
                 </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                    <FileCheck className="mr-2 h-4 w-4" /> Issue Credential
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Issuance</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to issue this credential? This action cannot be undone and will be recorded as a ZK proof.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 bg-muted/30 rounded-md border border-border text-sm space-y-2">
                     <p><strong>Recipient:</strong> {formData.firstName} {formData.lastName}</p>
                     <p><strong>Type:</strong> Identity Verification</p>
                     <p><strong>Proof Hash:</strong> 0x7f83...9a2b</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                    <Button 
                        className="bg-verza-emerald text-white" 
                        onClick={handleIssueCredential}
                        disabled={isIssuing}
                    >
                        {isIssuing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm & Sign
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500 mb-1">Warning</p>
                  <p className="text-amber-500/80">
                    Once issued, a credential can only be revoked, not edited. Ensure all data is 100% accurate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
