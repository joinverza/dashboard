import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { 
  ShieldCheck, 
  CheckCircle, 
  Globe, 
  Zap, 
  Users, 
  Lock, 
  ArrowRight, 
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import versalogo from "@/assets/versalogoSVG.svg";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans selection:bg-[#00FF87] selection:text-black overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
            <img src={versalogo} alt="Verza" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">Verza</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="text-sm text-gray-400 hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            <div className="flex items-center gap-4 ml-4">
              <Button variant="ghost" className="text-white hover:text-[#00FF87]" onClick={() => setLocation("/login")}>
                Log in
              </Button>
              <Button className="bg-[#00FF87] text-black hover:bg-[#00FF87]/90 rounded-full px-6" onClick={() => setLocation("/signup")}>
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-[#0D0D0D] border-b border-white/10 p-6 flex flex-col gap-4"
          >
            <a href="#features" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#solutions" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Solutions</a>
            <a href="#pricing" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <div className="h-px bg-white/10 my-2" />
            <Button variant="ghost" className="justify-start" onClick={() => setLocation("/login")}>Log in</Button>
            <Button className="bg-[#00FF87] text-black hover:bg-[#00FF87]/90" onClick={() => setLocation("/signup")}>Get Started</Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-[#00FF87]/10" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-blue-500/10" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#00FF87] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87]"></span>
              </span>
              Verza 2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Trust, Verified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF87] to-blue-500">
                On The Blockchain
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              The universal standard for digital credentials. Issue, verify, and manage tamper-proof credentials with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-[#00FF87] text-black hover:bg-[#00FF87]/90 rounded-full px-8 h-12 text-base w-full sm:w-auto" onClick={() => setLocation("/signup")}>
                Start Verifying Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 rounded-full px-8 h-12 text-base w-full sm:w-auto" onClick={() => setLocation("/login")}>
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/10 pt-10"
          >
            <div>
              <div className="text-3xl font-bold text-white mb-1">10k+</div>
              <div className="text-sm text-gray-500">Active Verifiers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">2M+</div>
              <div className="text-sm text-gray-500">Credentials Issued</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-sm text-gray-500">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">&lt;1s</div>
              <div className="text-sm text-gray-500">Verification Time</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Infrastructure</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built for scale, security, and interoperability. Everything you need to manage digital trust.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-[#00FF87]" />}
              title="Tamper-Proof Security"
              description="Credentials are cryptographically signed and anchored to the blockchain, making them impossible to forge."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-500" />}
              title="Global Interoperability"
              description="Built on W3C Verifiable Credentials standards. Works across borders and platforms instantly."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Instant Verification"
              description="Verify credentials in milliseconds via API or QR code. No manual checks required."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-purple-500" />}
              title="Identity Management"
              description="Comprehensive tools for managing user identities, roles, and access permissions."
            />
            <FeatureCard 
              icon={<Lock className="w-8 h-8 text-pink-500" />}
              title="Privacy Preserving"
              description="Zero-knowledge proofs allow verification without revealing sensitive personal data."
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8 text-emerald-500" />}
              title="Automated Compliance"
              description="Stay compliant with KYC/AML regulations automatically with built-in audit trails."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#00FF87]/10 to-blue-500/10 border border-white/10 p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">Join thousands of organizations using Verza to secure their digital trust infrastructure.</p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-8 h-12" onClick={() => setLocation("/signup")}>
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={versalogo} alt="Verza" className="h-6 w-6" />
              <span className="font-bold">Verza</span>
            </div>
            <p className="text-sm text-gray-500">
              The standard for digital trust.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00FF87]">Features</a></li>
              <li><a href="#" className="hover:text-[#00FF87]">Solutions</a></li>
              <li><a href="#" className="hover:text-[#00FF87]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#00FF87]">Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00FF87]">About</a></li>
              <li><a href="#" className="hover:text-[#00FF87]">Careers</a></li>
              <li><a href="#" className="hover:text-[#00FF87]">Blog</a></li>
              <li><a href="#" className="hover:text-[#00FF87]">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy"><span className="hover:text-[#00FF87] cursor-pointer">Privacy</span></Link></li>
              <li><Link href="/terms"><span className="hover:text-[#00FF87] cursor-pointer">Terms</span></Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Verza Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
      <div className="mb-4 bg-black/50 w-14 h-14 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
