import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Building2,
  ShieldCheck,
  Globe
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, type UserRole } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function EnterpriseSignupPage() {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<UserRole>("enterprise");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate key generation
    const mockKey = "vz_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedKey(mockKey);
    setShowKeyModal(true);
  };

  const confirmSignup = () => {
    setShowKeyModal(false);
    signup(name, email, role);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white selection:bg-blue-500/20 selection:text-blue-500">
      {/* Right Panel - Brand & Vision (Moved to Right to alternate) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#001524_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Verza Portal</span>
          <img src={versalogo} alt="Verza" className="h-8 w-8" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              Join the network <br />
              <span className="text-blue-500">of trust</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Become a Verifier or Enterprise partner. Issue credentials, verify identities, and participate in the governance of the network.
            </p>
            
            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: ShieldCheck, text: "Institutional Compliance" },
                { icon: Building2, text: "Enterprise Integration" },
                { icon: Globe, text: "Global Validator Network" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sm font-medium">{item.text}</span>
                  <div className="h-8 w-8 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-medium">
          <span>Secure Enclave</span>
          <span>© 2024 Verza Inc.</span>
        </div>
      </div>

      {/* Left Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#09090b] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Verza" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Verza Portal</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Partner Application</h2>
            <p className="text-zinc-400">Register for an enterprise or verifier account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Account Type</label>
              <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 focus:ring-blue-500/20 h-11 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise Partner</SelectItem>
                  <SelectItem value="verifier">Verifier Node</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Company / Organization</label>
              <Input 
                type="text" 
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Contact Name</label>
              <Input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Business Email</label>
              <Input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Generate Auth Key & Register"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-zinc-500">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Already have an auth key?{" "}
            <Link href="/portal/login">
              <span className="text-blue-500 hover:text-blue-400 font-medium cursor-pointer transition-colors">
                Sign in to Portal
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* Auth Key Modal */}
      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent className="bg-[#09090b] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Authentication Key Generated</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Please save this key securely. You will need it to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 my-4">
            <p className="font-mono text-lg text-blue-500 break-all text-center select-all">
              {generatedKey}
            </p>
          </div>
          <Button onClick={confirmSignup} className="w-full bg-blue-600 hover:bg-blue-500">
            I have saved my key
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}