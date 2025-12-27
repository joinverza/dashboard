import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
      content: [
        "Personal Identification Information (Name, email address, phone number, etc.)",
        "Identity Verification Data (Government ID documents, biometric data)",
        "Blockchain Data (Wallet addresses, transaction history)",
        "Usage Data (Log files, device information, browser type)"
      ]
    },
    {
      title: "How We Use Your Data",
      icon: FileText,
      content: [
        "To provide and maintain our Service",
        "To verify your identity and credentials",
        "To process payments and transactions",
        "To communicate with you about updates and support"
      ]
    },
    {
      title: "Data Protection & Security",
      icon: Shield,
      content: [
        "We use zero-knowledge proofs to minimize data exposure",
        "All sensitive data is encrypted at rest and in transit",
        "We do not sell your personal data to third parties",
        "Regular security audits and penetration testing"
      ]
    },
    {
      title: "Your Data Rights",
      icon: Lock,
      content: [
        "Right to access your personal data",
        "Right to rectification of inaccurate data",
        "Right to erasure (Right to be forgotten)",
        "Right to data portability"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-verza-emerald/10 py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full bg-verza-emerald/5 blur-[100px]" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: December 27, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Verza, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our decentralized identity verification platform. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 hover:border-verza-emerald/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-verza-emerald/10 flex items-center justify-center text-verza-emerald shrink-0">
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-verza-emerald shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-secondary/20 rounded-xl p-8 text-center space-y-4 border border-border/50">
          <h3 className="text-xl font-bold">Have questions about your privacy?</h3>
          <p className="text-muted-foreground">
            Our Data Protection Officer is available to help you with any concerns.
          </p>
          <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white">
            Contact Privacy Team
          </Button>
        </div>

      </div>
    </div>
  );
}
