import { motion, useScroll, useTransform } from "framer-motion";
import { Link as RouterLink } from "wouter";
import { 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  Globe, 
  Zap, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  Landmark, 
  Plane, 
  Play,
  Menu,
  X,
  Link as LinkIcon
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'verifier': return '/verifier';
      case 'enterprise': return '/enterprise';
      case 'admin': return '/admin';
      default: return '/app';
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-hidden font-sans relative selection:bg-[#00FF87] selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] bg-gradient-to-br from-[#00FF87]/10 to-[#00B050]/5" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[100px] bg-gradient-to-tl from-[#00FF87]/10 to-[#00B050]/5" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full blur-[150px] bg-blue-500/5" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={versalogo} alt="Verza Logo" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">Verza</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-white transition-colors">Resources</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <RouterLink href={getDashboardLink()}>
                <Button className="bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(0,255,135,0.4)]">
                  Go to Dashboard
                </Button>
              </RouterLink>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <RouterLink href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </RouterLink>
                <RouterLink href="/signup">
                  <Button className="bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold">
                    Get Started
                  </Button>
                </RouterLink>
              </div>
            )}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0D0D0D] border-b border-white/10 p-4 space-y-4">
            <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
            <a href="#solutions" className="block text-gray-300 hover:text-white">Solutions</a>
            <a href="#pricing" className="block text-gray-300 hover:text-white">Pricing</a>
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <RouterLink href="/login">
                  <Button variant="ghost" className="w-full justify-start text-gray-300">Sign In</Button>
                </RouterLink>
                <RouterLink href="/signup">
                  <Button className="w-full bg-[#00B050] text-black">Get Started</Button>
                </RouterLink>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={targetRef} className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <motion.div style={{ opacity, scale }} className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#00FF87] mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87]"></span>
              </span>
              Trusted by 500+ Enterprises
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 font-montserrat"
            >
              Identity Verification <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF87] to-[#00B050]">
                Reimagined
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed"
            >
              Cut verification costs by 90% and time to minutes. The world's first decentralized identity platform for the modern enterprise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <RouterLink href="/signup">
                <Button size="lg" className="h-14 px-8 bg-[#00B050] hover:bg-[#00FF87] text-black font-bold text-base shadow-[0_0_30px_-10px_rgba(0,255,135,0.6)]">
                  Start Verifying Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </RouterLink>
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 font-medium text-base">
                <Play className="mr-2 h-5 w-5" /> Watch Demo
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* 3D Abstract Representation */}
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#00FF87]/20 to-blue-500/20 rounded-full blur-[100px]" />
               <img src={versalogo} alt="Verza Platform" className="relative z-10 w-full h-full drop-shadow-2xl opacity-90" />
               
               {/* Floating Badges */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-10 right-10 p-4 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex items-center gap-3"
               >
                 <div className="p-2 bg-green-500/20 rounded-full text-green-500"><CheckCircle className="w-6 h-6" /></div>
                 <div>
                   <div className="font-bold">Verified</div>
                   <div className="text-xs text-gray-400">ID: 892...291</div>
                 </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-20 left-0 p-4 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex items-center gap-3"
               >
                 <div className="p-2 bg-blue-500/20 rounded-full text-blue-500"><Shield className="w-6 h-6" /></div>
                 <div>
                   <div className="font-bold">Secure</div>
                   <div className="text-xs text-gray-400">Zero-Knowledge Proof</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2M+", label: "Credentials Verified" },
              { value: "< 2min", label: "Average Time" },
              { value: "90%", label: "Cost Reduction" },
              { value: "99.9%", label: "Success Rate" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Features</h2>
          <p className="text-gray-400 text-lg">Everything you need to build a secure, compliant, and user-friendly verification flow.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: Shield, title: "Privacy-First Verification", desc: "Zero-Knowledge proofs allow users to prove facts without revealing sensitive data." },
            { icon: LinkIcon, title: "Blockchain Anchored", desc: "Immutable records and smart contracts provide verifiable proof of every transaction." },
            { icon: Cpu, title: "AI Fraud Detection", desc: "Advanced computer vision and risk scoring to detect forged documents instantly." },
            { icon: Globe, title: "Global Verifier Network", desc: "Access a network of certified professionals covering over 190 countries." },
            { icon: Zap, title: "Instant Reusability", desc: "Verify once, reuse everywhere. Credentials can be shared across platforms instantly." },
            { icon: Briefcase, title: "Enterprise Ready", desc: "Full API support, webhooks, SLAs, and dedicated support for high-volume needs." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00FF87]/30 transition-all hover:bg-white/[0.07] group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:from-[#00FF87]/20 group-hover:to-[#00B050]/20 transition-colors">
                <feature.icon className="h-6 w-6 text-gray-300 group-hover:text-[#00FF87] transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Verza Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to secure digital identity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-[#00FF87]/30 to-transparent" />
            
            {[
              { step: "01", title: "Upload & Pre-screen", desc: "User uploads document. AI instantly analyzes for quality and fraud markers." },
              { step: "02", title: "Verify & Mint", desc: "Experts verify the data. A digital credential is minted on the blockchain." },
              { step: "03", title: "Reuse & Share", desc: "User receives the credential and can share verifiable proofs instantly." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-[#1A1A1A] border border-[#00FF87]/30 rounded-full flex items-center justify-center text-2xl font-bold text-[#00FF87] mb-6 relative z-10 shadow-[0_0_20px_-5px_rgba(0,255,135,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section id="solutions" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Solutions by Industry</h2>
        <Tabs defaultValue="financial" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#1A1A1A] border border-white/10 p-1 mb-8">
            <TabsTrigger value="financial" className="data-[state=active]:bg-[#00B050] data-[state=active]:text-black">Financial</TabsTrigger>
            <TabsTrigger value="healthcare" className="data-[state=active]:bg-[#00B050] data-[state=active]:text-black">Healthcare</TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-[#00B050] data-[state=active]:text-black">Education</TabsTrigger>
            <TabsTrigger value="travel" className="data-[state=active]:bg-[#00B050] data-[state=active]:text-black">Travel</TabsTrigger>
          </TabsList>
          
          {[
            { id: "financial", icon: Landmark, title: "Financial Services", desc: "Automate KYC/AML compliance with bank-grade security. Reduce onboarding time from days to minutes while meeting global regulatory requirements." },
            { id: "healthcare", icon: Shield, title: "Healthcare", desc: "Verify medical licenses and credentials instantly. Enable portable patient records with privacy-preserving zero-knowledge proofs." },
            { id: "education", icon: GraduationCap, title: "Education", desc: "Issue tamper-proof digital diplomas and transcripts. Allow students to share verifiable academic records with employers instantly." },
            { id: "travel", icon: Plane, title: "Travel & Visa", desc: "Streamline visa processing and border control with verifiable digital travel credentials. Enhance security while improving passenger experience." }
          ].map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <Card className="bg-[#1A1A1A] border-white/10">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87]">
                      <tab.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{tab.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{tab.desc}</p>
                    <Button variant="link" className="text-[#00FF87] p-0 h-auto hover:text-[#00FF87]/80">
                      Learn more <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 w-full h-64 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 flex items-center justify-center">
                    {/* Placeholder for Industry Graphic */}
                    <span className="text-white/20 font-mono text-sm">Industry Visualization</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#111] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your scale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "$0", desc: "Perfect for testing and small projects.", features: ["3 Verifications / month", "Basic API Access", "Community Support", "Standard Speed"] },
              { name: "Pro", price: "$49", desc: "For growing businesses and platforms.", features: ["50 Verifications / month", "Full API Access", "Priority Support", "Fast Lane Processing", "Custom Branding"] },
              { name: "Enterprise", price: "Custom", desc: "For large scale operations.", features: ["Unlimited Verifications", "Dedicated Account Manager", "SLA Guarantees", "On-premise Options", "Volume Discounts"] }
            ].map((plan, i) => (
              <div key={i} className={cn(
                "p-8 rounded-2xl border flex flex-col",
                i === 1 ? "bg-[#1A1A1A] border-[#00FF87] shadow-[0_0_30px_-10px_rgba(0,255,135,0.2)] relative" : "bg-white/5 border-white/10"
              )}>
                {i === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00FF87] text-black text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                <p className="text-sm text-gray-400 mb-8">{plan.desc}</p>
                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#00FF87]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Button className={cn(
                  "w-full",
                  i === 1 ? "bg-[#00B050] hover:bg-[#00FF87] text-black" : "bg-white/10 hover:bg-white/20 text-white"
                )}>
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "How does verification work?", a: "We use a combination of AI document analysis and human expert review to ensure 100% accuracy. Once verified, a cryptographic proof is stored on the blockchain." },
            { q: "Is my data safe?", a: "Yes. We use Zero-Knowledge proofs, meaning we verify the validity of information without storing the sensitive raw data on our servers." },
            { q: "How long does it take?", a: "Automated checks happen in seconds. Manual reviews for complex documents typically take less than 15 minutes." },
            { q: "What countries do you support?", a: "We support identity documents from over 190 countries and territories." }
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
              <AccordionTrigger className="hover:text-[#00FF87]">{item.q}</AccordionTrigger>
              <AccordionContent className="text-gray-400">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00B050]/10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of developers building the future of digital identity.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <RouterLink href="/signup">
              <Button size="lg" className="h-14 px-8 bg-[#00B050] hover:bg-[#00FF87] text-black font-bold text-base shadow-glow">
                Start Verifying Now
              </Button>
            </RouterLink>
            <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src={versalogo} alt="Verza Logo" className="h-6 w-6" />
              <span className="text-xl font-bold">Verza</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              The standard for decentralized identity verification. Secure, fast, and globally compliant.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#00FF87]/20 transition-colors" />
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#00FF87]/20 transition-colors" />
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#00FF87]/20 transition-colors" />
            </div>
          </div>
          
          {[
            { title: "Product", links: ["Features", "Solutions", "Pricing", "Docs"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                {col.links.map((link, j) => (
                  <li key={j}><a href="#" className="hover:text-[#00FF87] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <div>© 2024 Verza Identity Inc. All rights reserved.</div>
          <div className="flex gap-4">
            <span>English (US)</span>
            <span>USD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
