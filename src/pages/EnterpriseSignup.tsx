import { useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Building2,
  ShieldCheck,
  Globe
} from "lucide-react";
import versalogo from "@/assets/ONTIVER white.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EnterpriseSignupPage() {
  const { signup, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedAuthKey, setGeneratedAuthKey] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = await signup({
      role: "enterprise",
      organizationName: company,
      contactName: name,
      email,
      password,
      countryCode,
      registrationNumber,
      consentAccepted: true,
    });
    setGeneratedAuthKey(key);
    setShowKeyModal(true);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white selection:bg-verza-emerald/20 selection:text-verza-emerald">
      {/* Right Panel - Brand & Vision (Moved to Right to alternate) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#002411_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-verza-emerald/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Ontiver Portal</span>
          <img src={versalogo} alt="Ontiver" className="h-8 w-8" />
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
              <span className="text-verza-emerald">of trust</span>
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
                    <item.icon className="h-4 w-4 text-verza-emerald" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-medium">
          <span>Secure Enclave</span>
          <span>© 2025 Ontiver Inc.</span>
        </div>
      </div>

      {/* Left Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#09090b] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Ontiver" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Ontiver Portal</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Partner Application</h2>
            <p className="text-zinc-400">Register your enterprise account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Company / Organization</label>
              <Input 
                type="text" 
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Contact Name</label>
              <Input 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Business Email</label>
              <Input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Country Code</label>
              <Input
                type="text"
                placeholder="US"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Registration Number</label>
              <Input
                type="text"
                placeholder="REG-12345"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-verza-emerald hover:bg-verza-kelly text-black font-medium transition-all mt-2"
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
              <span className="text-verza-emerald hover:text-verza-kelly font-medium cursor-pointer transition-colors">
                Sign in to Portal
              </span>
            </Link>
          </p>
        </div>
      </div>
      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent className="bg-[#09090b] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Copy Your Auth Key</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This key is required for login. Copy and store it securely before continuing.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 my-4">
            <p className="font-mono text-sm text-verza-emerald break-all text-center select-all">
              {generatedAuthKey}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-zinc-700 text-zinc-200"
              onClick={() => {
                if (!generatedAuthKey) return;
                void navigator.clipboard.writeText(generatedAuthKey);
              }}
            >
              Copy key
            </Button>
            <Button
              type="button"
              className="bg-verza-emerald hover:bg-verza-kelly text-black"
              onClick={() => setLocation("/portal/login")}
            >
              Continue to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
