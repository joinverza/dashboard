import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Book, 
  MessageCircle, 
  FileText, 
  Shield, 
  CreditCard,
  User,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = [
    { icon: User, title: "Account & Profile", description: "Manage your account settings" },
    { icon: Shield, title: "Verification", description: "Identity and document verification" },
    { icon: CreditCard, title: "Payments & Billing", description: "Deposits, withdrawals, and fees" },
    { icon: FileText, title: "Credential Management", description: "Uploading and sharing credentials" },
  ];

  const FAQS = [
    {
      question: "How long does the verification process take?",
      answer: "Most verifications are completed within 24 hours. However, complex documents may take up to 48 hours for thorough review. You can track the status in real-time on your dashboard."
    },
    {
      question: "Is my personal data secure?",
      answer: "Yes, we use enterprise-grade encryption and decentralized storage. Your sensitive data is never stored in plain text and is only accessible to authorized verifiers during the review process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept payments via Cardano (ADA) and major credit cards. We are working on adding support for more cryptocurrencies and payment gateways."
    },
    {
      question: "Can I cancel a verification request?",
      answer: "You can cancel a request if it hasn't been picked up by a verifier yet. Once a verifier starts the review, the request cannot be cancelled, but you can contact support for assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="relative bg-verza-emerald/10 py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[800px] h-[800px] rounded-full bg-verza-emerald/10 blur-[100px]" />
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
          <p className="text-xl text-muted-foreground mb-10">
            Search our knowledge base or browse categories below.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search for answers..." 
              className="pl-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-verza-emerald/20 shadow-xl rounded-2xl focus-visible:ring-verza-emerald"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-verza-emerald/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-verza-emerald/10 flex items-center justify-center text-verza-emerald">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* FAQs */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="pt-8">
              <h2 className="text-2xl font-bold mb-4">Popular Articles</h2>
              <div className="grid gap-4">
                {[
                  "Getting started with Verza Dashboard",
                  "Understanding Verification Levels",
                  "How to deposit funds securely",
                  "Connecting your Web3 Wallet"
                ].map((article, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Book className="w-5 h-5 text-verza-emerald" />
                      <span className="font-medium group-hover:text-verza-emerald transition-colors">{article}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-verza-emerald/20 to-transparent border-verza-emerald/20">
              <CardHeader>
                <CardTitle>Still need help?</CardTitle>
                <CardDescription>Our support team is available 24/7</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-verza-emerald hover:bg-verza-kelly text-white h-12 text-base">
                  <MessageCircle className="w-5 h-5 mr-2" /> Start Live Chat
                </Button>
                <Button variant="outline" className="w-full h-12 text-base">
                  Submit a Ticket
                </Button>
                <div className="text-center text-sm text-muted-foreground pt-2">
                  <p>Email us directly at</p>
                  <a href="mailto:support@verza.com" className="text-verza-emerald hover:underline">support@verza.com</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Developer Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="#" className="flex items-center justify-between text-sm p-2 hover:bg-secondary rounded transition-colors">
                  <span>API Documentation</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="#" className="flex items-center justify-between text-sm p-2 hover:bg-secondary rounded transition-colors">
                  <span>System Status</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="#" className="flex items-center justify-between text-sm p-2 hover:bg-secondary rounded transition-colors">
                  <span>Changelog</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
