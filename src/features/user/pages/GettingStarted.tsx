import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileBadge, 
  Store, 
  Wallet, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function GettingStarted() {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "Your central hub. Get an overview of your verifications, recent activity, and quick actions.",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Credentials",
      icon: FileBadge,
      description: "Manage your identity documents and verifiable credentials in one secure place.",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      title: "Marketplace",
      icon: Store,
      description: "Connect with certified verifiers and discover new services for your identity needs.",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      title: "Wallet",
      icon: Wallet,
      description: "Handle transactions, view your balance, and track spending across the Ontiver network.",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      description: "Gain insights into your verification history and usage patterns over time.",
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
    {
      title: "Settings",
      icon: Settings,
      description: "Configure your profile, security preferences, and notification settings.",
      color: "text-gray-400",
      bg: "bg-gray-400/10",
    }
  ];

  const steps = [
    {
      title: "Complete your Profile",
      description: "Add your basic information and contact details.",
    },
    {
      title: "Upload Documents",
      description: "Securely upload your government-issued ID.",
    },
    {
      title: "Verify Identity",
      description: "Complete the liveness check and face match.",
    },
    {
      title: "Start Using Ontiver",
      description: "You're all set to use your verified identity.",
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-12 pb-12"
    >
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 p-8 md:p-12">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-verza-emerald/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verza-emerald/10 border border-verza-emerald/20 text-verza-emerald text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            Welcome to Ontiver
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Your Digital Identity, <br />
            <span className="text-zinc-400">Simplified & Secured.</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Welcome to the future of decentralized identity. This guide will help you understand 
            how to navigate the platform and make the most of your secure credentials.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              onClick={() => setLocation("/app")}
              className="bg-verza-emerald text-black hover:bg-verza-kelly font-semibold h-12 px-6 rounded-xl"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => setLocation("/app/credentials")}
              variant="outline" 
              className="border-white/10 hover:bg-white/5 h-12 px-6 rounded-xl"
            >
              View Credentials
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10 text-zinc-600">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
              <div className="w-8 h-8 rounded-full bg-verza-emerald/10 text-verza-emerald flex items-center justify-center font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Overview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Platform Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
              onClick={() => setLocation(feature.title === 'Dashboard' ? '/app' : `/app/${feature.title.toLowerCase()}`)}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                {feature.title}
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Need help?</h3>
          <p className="text-zinc-400">Our support team is available 24/7 to assist you with any questions.</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setLocation("/app/help")}
          className="whitespace-nowrap h-12 px-6 rounded-xl border-white/10 hover:bg-white/5"
        >
          Visit Help Center
        </Button>
      </div>
    </motion.div>
  );
}
