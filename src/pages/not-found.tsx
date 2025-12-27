import { Link } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-verza-emerald/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-verza-emerald/20 blur-2xl rounded-full" />
          <AlertCircle className="w-24 h-24 text-verza-emerald relative z-10 mx-auto" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tighter text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/app">
            <Button className="w-full sm:w-auto bg-verza-emerald hover:bg-verza-kelly text-white shadow-glow">
              <Home className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto glass-button">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
