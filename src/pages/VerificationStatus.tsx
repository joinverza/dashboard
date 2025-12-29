import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  User, 
  MessageSquare, 
  HelpCircle,
  AlertCircle,
  X,
  Send,
  MoreVertical,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data for the page
const TRACKING_DATA = {
  id: "REQ-2023-8921",
  credentialTitle: "University Diploma Verification",
  status: "in_progress",
  currentStage: 3, // 1-based index
  stages: [
    { id: 1, title: "Request Submitted", date: "Today, 09:30 AM", status: "completed" },
    { id: 2, title: "Verifier Assigned", date: "Today, 09:45 AM", status: "completed" },
    { id: 3, title: "Document Review", date: "In Progress", status: "current" },
    { id: 4, title: "Identity Check", date: "Pending", status: "pending" },
    { id: 5, title: "Final Verification", date: "Pending", status: "pending" }
  ],
  verifier: {
    name: "Sarah Jenkins",
    role: "Senior Education Verifier",
    organization: "Verza Global Verification",
    rating: 4.9,
    verifications: 1240,
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  estimatedCompletion: "Today, 04:00 PM",
  timeRemaining: "~4 hours",
  activities: [
    { id: 1, text: "Verifier Sarah Jenkins started reviewing your document", time: "10 min ago", icon: User },
    { id: 2, text: "Automated fraud detection check passed", time: "15 min ago", icon: ShieldCheck },
    { id: 3, text: "Payment of 50 ADA confirmed", time: "30 min ago", icon: CheckCircle2 },
    { id: 4, text: "Request #REQ-2023-8921 submitted", time: "32 min ago", icon: FileText }
  ]
};

const CHAT_MESSAGES = [
  { id: 1, sender: "system", text: "Request started. You can now chat with your verifier.", time: "09:45 AM" },
  { id: 2, sender: "verifier", text: "Hello! I've started reviewing your diploma. Please ensure the transcript is also legible in the uploaded file.", time: "09:50 AM" },
];

export default function VerificationStatusPage() {
  const [, setLocation] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);

  // Mock auto-refresh of activity
  const [activities] = useState(TRACKING_DATA.activities);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    // Simulate verifier typing/reply
    setTimeout(() => {
      const replyMessage = {
        id: messages.length + 2,
        sender: "verifier",
        text: "Thanks for your message. I'll check that for you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMessage]);
      toast.info("New message from Verifier");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-20 animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-verza-emerald/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => setLocation("/app/credentials")} className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Credentials
            </button>
            <span>/</span>
            <span className="text-foreground">Tracking #{TRACKING_DATA.id}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{TRACKING_DATA.credentialTitle}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse">
                  In Progress
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Est. Completion: {TRACKING_DATA.estimatedCompletion}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
               <Button variant="outline" onClick={() => setIsChatOpen(true)} className="gap-2">
                 <MessageSquare className="w-4 h-4" /> Chat with Verifier
               </Button>
               <Button variant="destructive" className="gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 border" onClick={() => toast.error("Cannot cancel request at this stage")}>
                 Cancel Request
               </Button>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
          <CardContent className="p-8">
            <div className="relative flex justify-between">
              {/* Progress Line Background */}
              <div className="absolute top-5 left-0 w-full h-1 bg-secondary rounded-full -z-10" />
              
              {/* Active Progress Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((TRACKING_DATA.currentStage - 1) / (TRACKING_DATA.stages.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-5 left-0 h-1 bg-verza-emerald rounded-full -z-10"
              />

              {TRACKING_DATA.stages.map((stage, index) => {
                const isCompleted = index + 1 < TRACKING_DATA.currentStage;
                const isCurrent = index + 1 === TRACKING_DATA.currentStage;

                return (
                  <div key={stage.id} className="flex flex-col items-center gap-3 relative group">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 z-10",
                        isCompleted ? "bg-verza-emerald border-verza-emerald text-white" :
                        isCurrent ? "bg-background border-verza-emerald text-verza-emerald shadow-[0_0_15px_rgba(16,185,129,0.4)]" :
                        "bg-background border-secondary text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                       isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-verza-emerald animate-ping" /> :
                       <span className="text-xs font-medium">{index + 1}</span>
                      }
                    </motion.div>
                    <div className="text-center space-y-1">
                      <p className={cn(
                        "text-sm font-medium whitespace-nowrap",
                        isCurrent ? "text-verza-emerald" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {stage.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{stage.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Status Card */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-verza-emerald" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50">
                  <Avatar className="w-12 h-12 border-2 border-background">
                    <AvatarImage src={TRACKING_DATA.verifier.avatar} />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{TRACKING_DATA.verifier.name}</h3>
                        <p className="text-sm text-muted-foreground">{TRACKING_DATA.verifier.role}</p>
                        <p className="text-xs text-muted-foreground">{TRACKING_DATA.verifier.organization}</p>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                           <span>★</span> {TRACKING_DATA.verifier.rating}
                         </div>
                         <p className="text-xs text-muted-foreground">{TRACKING_DATA.verifier.verifications} verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-verza-emerald">60%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      className="h-full bg-verza-emerald"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your document is currently being reviewed for authenticity marks and watermarks. This process typically takes 15-30 minutes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" onClick={() => setLocation(`/app/credentials/${TRACKING_DATA.id}`)}>
                    <FileText className="w-4 h-4 mr-2" /> View Document
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsChatOpen(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Message Verifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Feed */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 relative border-l border-border/50 ml-2 pl-6">
                  {activities.map((activity, index) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-[31px] top-0 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary" />
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-secondary/30 text-muted-foreground">
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm">{activity.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Payment Info */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-verza-emerald" />
                    <span className="text-sm font-medium text-verza-emerald">Paid Successfully</span>
                  </div>
                  <span className="text-sm font-bold">50 ADA</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Transaction ID</span>
                    <span className="font-mono text-xs">0x892...921a</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Date</span>
                    <span>Oct 24, 2023</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => toast.success("Receipt downloaded")}>
                  <Download className="w-3 h-3 mr-2" /> Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                  <p className="text-sm text-muted-foreground">Verifier completes the identity and document check.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                  <p className="text-sm text-muted-foreground">Result is cryptographically signed and anchored to Cardano.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                  <p className="text-sm text-muted-foreground">You receive the verified credential in your wallet.</p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => toast.info("Opening Help Center...")}
                >
                  <HelpCircle className="w-4 h-4" /> Visit Help Center
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => toast.info("Report issue feature coming soon")}
                >
                  <AlertCircle className="w-4 h-4" /> Report an Issue
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Chat Slide-in Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border/50 shadow-2xl z-50 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={TRACKING_DATA.verifier.avatar} />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{TRACKING_DATA.verifier.name}</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toast.info("Chat options coming soon")}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsChatOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4 bg-secondary/5">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.sender === "user" ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl text-sm",
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : msg.sender === "system"
                          ? "bg-secondary text-xs text-center w-full my-2 text-muted-foreground italic"
                          : "bg-card border border-border/50 rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                      {msg.sender !== "system" && (
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {msg.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-md">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon for Activity
function Activity({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
