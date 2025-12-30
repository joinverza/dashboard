import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ShieldCheck,
  Lock,
  FileKey,
  AlertTriangle
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminSignupPage() {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [authorizationCode, setAuthorizationCode] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedMasterKey, setGeneratedMasterKey] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate master key generation
    const mockKey = "ROOT_" + Math.random().toString(36).substring(2, 15).toUpperCase() + "_" + Date.now();
    setGeneratedMasterKey(mockKey);
    setShowKeyModal(true);
  };

  const confirmSignup = () => {
    setShowKeyModal(false);
    signup(name, email, "admin");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white selection:bg-red-500/20 selection:text-red-500">
      {/* Right Panel - Brand & Vision */}
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#1a0505_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Verza Admin</span>
          <img src={versalogo} alt="Verza" className="h-8 w-8 grayscale opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              Administrator <br />
              <span className="text-red-500">Onboarding</span>
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8">
              Create a new administrative account. Requires valid departmental authorization code.
            </p>
            
            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: ShieldCheck, text: "Background Check Verified" },
                { icon: FileKey, text: "Encrypted Credentials" },
                { icon: AlertTriangle, text: "Audit Log Enabled" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-400">
                  <span className="text-sm font-medium">{item.text}</span>
                  <div className="h-8 w-8 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-red-900/50 uppercase tracking-widest font-medium">
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Internal Use Only
          </span>
          <span>Verza Systems Inc.</span>
        </div>
      </div>

      {/* Left Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#050505] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Verza" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Admin Portal</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Register Admin</h2>
            <p className="text-zinc-500">Create a privileged system account</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Full Name</label>
              <Input 
                type="text" 
                placeholder="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Official Email</label>
              <Input 
                type="email" 
                placeholder="admin@verza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors"
              />
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Department</label>
              <Input 
                type="text" 
                placeholder="e.g. Security, Infrastructure"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Authorization Code</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-600" />
                <Input 
                  type="password" 
                  placeholder="Required for registration"
                  value={authorizationCode}
                  onChange={(e) => setAuthorizationCode(e.target.value)}
                  className="pl-10 bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors font-mono"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-medium transition-all mt-2 shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]"
              disabled={isLoading}
            >
              {isLoading ? "Validating..." : "Initialize Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-zinc-900" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050505] px-2 text-zinc-600">Actions</span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Have a master key?{" "}
            <Link href="/admin/login">
              <span className="text-red-500 hover:text-red-400 font-medium cursor-pointer transition-colors">
                Login to Console
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* Master Key Modal */}
      <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent className="bg-[#050505] border-red-900/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-500">Master Key Generated</DialogTitle>
            <DialogDescription className="text-zinc-500">
              This is your permanent root access key. It cannot be recovered if lost.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-950/10 rounded-lg border border-red-900/20 my-4">
            <p className="font-mono text-lg text-red-500 break-all text-center select-all">
              {generatedMasterKey}
            </p>
          </div>
          <Button onClick={confirmSignup} className="w-full bg-red-600 hover:bg-red-500 text-white">
            I have backed up this key
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}