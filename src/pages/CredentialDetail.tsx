import { useLocation, useRoute } from "wouter";
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Copy,
  Eye,
  User,
  Upload,
  Link as LinkIcon,
  Lock,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CredentialDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/app/credentials/:id");
  const id = params?.id || "1";

  // Mock Data (would typically be fetched by ID)
  const credential = {
    id: id,
    title: "University Diploma",
    type: "Education",
    issuer: "Harvard University",
    issueDate: "May 20, 2023",
    expiryDate: "Never",
    status: "Verified",
    documentId: "EDU-2023-8921",
    did: "did:verza:7x92...8291",
    txHash: "0x892...1290",
    holder: {
      name: "Alex Thompson",
      dob: "1990-05-15",
      nationality: "USA"
    },
    verification: {
      method: "ZK-Proof (Groth16)",
      verifier: "Verza Global Verification",
      date: "2023-05-21 14:30:00",
      confidence: "99.9%"
    }
  };

  const timeline = [
    { id: 1, title: "Credential Issued", date: "May 20, 2023 10:00 AM", icon: FileText, color: "text-blue-400" },
    { id: 2, title: "Uploaded to Verza", date: "May 21, 2023 09:15 AM", icon: Upload, color: "text-purple-400" },
    { id: 3, title: "AI Pre-Screening Passed", date: "May 21, 2023 09:17 AM", icon: ShieldCheck, color: "text-green-400" },
    { id: 4, title: "Verifier Assigned", date: "May 21, 2023 10:00 AM", icon: User, color: "text-orange-400" },
    { id: 5, title: "Verification Complete", date: "May 21, 2023 02:30 PM", icon: CheckCircle2, color: "text-verza-emerald" },
    { id: 6, title: "Anchored to Blockchain", date: "May 21, 2023 02:35 PM", icon: LinkIcon, color: "text-indigo-400" }
  ];

  const shareHistory = [
    { id: 1, entity: "Tech Corp HR", purpose: "Job Application", date: "2023-06-15", status: "Active" },
    { id: 2, entity: "Global Bank", purpose: "KYC Check", date: "2023-07-01", status: "Expired" }
  ];

  return (
    <div className="space-y-6 p-6 pb-20 animate-in fade-in duration-500">
      
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <button onClick={() => setLocation("/app/credentials")} className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Credentials
        </button>
        <span>/</span>
        <span className="text-foreground">{credential.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{credential.title}</h1>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {credential.issuer}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> {credential.documentId}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Download
          </Button>
          <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow gap-2">
            <Lock className="w-4 h-4" /> Generate ZK Proof
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Document Preview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Document Preview
                <Badge variant="secondary" className="text-xs font-normal">Secure Viewer</Badge>
              </CardTitle>
            </CardHeader>
            <div className="relative aspect-[3/4] bg-black/50 flex flex-col items-center justify-center p-8 group cursor-pointer">
              {/* Security Watermark Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" 
                   style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
              </div>
              
              <FileText className="w-20 h-20 text-muted-foreground/50 mb-4 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="text-center space-y-2 relative z-10">
                <Lock className="w-6 h-6 text-verza-emerald mx-auto mb-2" />
                <p className="font-medium text-white">End-to-End Encrypted</p>
                <p className="text-xs text-white/60 max-w-[200px] mx-auto">
                  This document is stored on IPFS with localized encryption keys.
                </p>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="secondary" className="gap-2">
                  <Eye className="w-4 h-4" /> View Decrypted
                </Button>
              </div>
            </div>
            <div className="p-4 bg-muted/20 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
               <span>SHA-256 Verified</span>
               <span>Size: 2.4 MB</span>
            </div>
          </Card>

          {/* Verification Timeline */}
          <Card className="border-border/50 bg-card/30">
            <CardHeader>
              <CardTitle className="text-lg">Verification Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-border/50 ml-3 space-y-6 pl-6 py-2">
                {timeline.map((item, i) => (
                  <div key={item.id} className="relative">
                    <div className={cn(
                      "absolute -left-[29px] top-1 w-3 h-3 rounded-full ring-4 ring-background",
                      i === timeline.length - 1 ? "bg-verza-emerald" : "bg-muted-foreground/30"
                    )} />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Credential Details */}
          <Card className="border-border/50 bg-card/30">
             <CardHeader>
               <CardTitle className="text-lg">Credential Details</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Holder Information</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between border-b border-border/50 pb-2">
                     <span className="text-sm text-muted-foreground">Full Name</span>
                     <span className="text-sm font-medium">{credential.holder.name}</span>
                   </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                     <span className="text-sm text-muted-foreground">Date of Birth</span>
                     <span className="text-sm font-medium">{credential.holder.dob}</span>
                   </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                     <span className="text-sm text-muted-foreground">Nationality</span>
                     <span className="text-sm font-medium">{credential.holder.nationality}</span>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Document Information</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between border-b border-border/50 pb-2">
                     <span className="text-sm text-muted-foreground">Type</span>
                     <span className="text-sm font-medium">{credential.type}</span>
                   </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                     <span className="text-sm text-muted-foreground">Issue Date</span>
                     <span className="text-sm font-medium">{credential.issueDate}</span>
                   </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                     <span className="text-sm text-muted-foreground">Expiry Date</span>
                     <span className="text-sm font-medium">{credential.expiryDate}</span>
                   </div>
                 </div>
               </div>
               
               <div className="md:col-span-2 pt-4">
                 <div className="p-4 rounded-lg bg-secondary/20 border border-border/50 space-y-3">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium flex items-center gap-2">
                       <LinkIcon className="w-4 h-4 text-primary" /> DID (Decentralized Identifier)
                     </span>
                     <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                       <Copy className="w-3 h-3" /> Copy
                     </Button>
                   </div>
                   <code className="block bg-black/30 p-2 rounded text-xs font-mono text-muted-foreground break-all">
                     {credential.did}
                   </code>
                 </div>
               </div>
             </CardContent>
          </Card>

          {/* Blockchain Proof */}
          <Card className="border-border/50 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Blockchain Proof</CardTitle>
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Anchored on Cardano
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 rounded-lg bg-secondary/20 border border-border/50">
                <div className="space-y-1">
                   <span className="text-xs text-muted-foreground">Transaction Hash</span>
                   <div className="flex items-center gap-2">
                     <span className="font-mono text-sm">{credential.txHash}</span>
                     <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                   </div>
                </div>
                <div className="space-y-1 text-right">
                   <span className="text-xs text-muted-foreground">Block Height</span>
                   <div className="font-mono text-sm">#8921029</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Share History</h3>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </div>
            <div className="rounded-xl border border-border/50 overflow-hidden bg-card/30">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Entity</th>
                    <th className="px-4 py-3 text-left font-medium">Purpose</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {shareHistory.map((share) => (
                    <tr key={share.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium">{share.entity}</td>
                      <td className="px-4 py-3 text-muted-foreground">{share.purpose}</td>
                      <td className="px-4 py-3 text-muted-foreground">{share.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          share.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-secondary text-muted-foreground"
                        )}>
                          {share.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10">
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
