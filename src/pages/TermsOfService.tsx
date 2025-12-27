import { motion } from "framer-motion";
import { Scale, FileCheck, ShieldAlert, Users, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileCheck,
      content: "By accessing and using Verza, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "User Responsibilities",
      icon: Users,
      content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer."
    },
    {
      title: "Identity Verification Services",
      icon: ShieldAlert,
      content: "Verza provides identity verification services. We do not guarantee the accuracy of third-party verifiers, though we vet them rigorously."
    },
    {
      title: "Intellectual Property",
      icon: Scale,
      content: "The Service and its original content, features and functionality are and will remain the exclusive property of Verza and its licensors."
    },
    {
      title: "Governing Law",
      icon: Gavel,
      content: "These Terms shall be governed and construed in accordance with the laws of Singapore, without regard to its conflict of law provisions."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-blue-500/10 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: December 27, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Verza website and the Verza mobile application (the "Service") operated by Verza ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/80 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>

        <div className="bg-secondary/20 rounded-xl p-8 text-center space-y-4 border border-border/50">
          <h3 className="text-xl font-bold">Questions about our Terms?</h3>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us.
          </p>
          <Button variant="outline">
            Contact Legal Team
          </Button>
        </div>

      </div>
    </div>
  );
}
