import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, CheckCircle, Lock } from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'verifier': return '/verifier';
      case 'enterprise': return '/enterprise';
      case 'admin': return '/admin';
      default: return '/app';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white overflow-hidden font-sans relative">
      {/* Dynamic Green Color Burst Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] bg-gradient-to-br from-[#00FF87]/20 to-[#00B050]/10"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[100px] bg-gradient-to-tl from-[#00FF87]/15 to-[#00B050]/5"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={versalogo} alt="Verza Logo" className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Verza</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href={getDashboardLink()}>
              <Button className="bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(0,255,135,0.4)]">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(0,255,135,0.4)]">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-20 pb-32 md:pt-32 md:pb-40 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 font-montserrat"
          >
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF87] to-[#00B050]">
              Digital Verification
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed"
          >
            Secure, scalable, and seamless verification for the modern web. 
            Empower your platform with enterprise-grade identity solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-gray-200 font-semibold text-base">
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/10 font-medium text-base">
              Contact Sales
            </Button>
          </motion.div>
        </div>

        {/* Floating Cards / Visual Elements */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block absolute top-20 right-0 w-[500px]"
        >
          <div className="relative">
            {/* Card 1 */}
            <div className="absolute top-0 right-10 p-6 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-[#00FF87]/20 text-[#00FF87]">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Identity Verified</h3>
                  <p className="text-xs text-gray-400">Just now</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="h-4 w-4 text-[#00B050]" />
                <span>KYC Compliance Check</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute top-40 right-40 p-6 bg-[#1A1A1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transform rotate-[6deg] hover:rotate-0 transition-transform duration-500 z-20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-xs text-gray-400">Encrypted Session</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-blue-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-24 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Enterprise Security",
                description: "Bank-grade encryption and security protocols to keep your data safe.",
                icon: Shield,
              },
              {
                title: "Real-time Verification",
                description: "Instant verification results with our high-performance processing engine.",
                icon: CheckCircle,
              },
              {
                title: "Global Compliance",
                description: "Built-in compliance for over 100+ jurisdictions worldwide.",
                icon: Lock,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00FF87]/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#00FF87]/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-gray-400 group-hover:text-[#00FF87] transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={versalogo} alt="Verza Logo" className="h-6 w-6 opacity-50 grayscale" />
            <span className="text-sm text-gray-500">© 2024 Verza. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
