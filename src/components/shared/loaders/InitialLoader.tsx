import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";

export const InitialLoader = ({
  onLoadComplete,
}: {
  onLoadComplete: () => void;
}) => {
  const [stage, setStage] = useState<"boot" | "core" | "finishing" | "complete">("boot");
  const [bootText, setBootText] = useState<string[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const bootSequence = [
      "INITIALIZING KERNEL...",
      "LOADING NEURAL INTERFACES...",
      "ESTABLISHING SECURE CONNECTION...",
      "VERIFYING INTEGRITY...",
      "ALLOCATING MEMORY BLOCKS...",
      "SYSTEM READY."
    ];

    let delay = 0;
    
    // Clear any existing timeouts to prevent duplication in Strict Mode
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
    setBootText([]); // Reset text

    bootSequence.forEach((text, i) => {
      delay += Math.random() * 300 + 100;
      const timeoutId = window.setTimeout(() => {
        setBootText(prev => {
          // Prevent duplicates if already added (extra safety)
          if (prev.includes(text)) return prev;
          return [...prev, text];
        });
        
        if (i === bootSequence.length - 1) {
          const coreTimeoutId = window.setTimeout(() => setStage("core"), 500);
          timeoutsRef.current.push(coreTimeoutId);
        }
      }, delay);
      timeoutsRef.current.push(timeoutId);
    });

    return () => {
      timeoutsRef.current.forEach(window.clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (stage === "core") {
      const timer = window.setTimeout(() => {
        setStage("finishing");
      }, 2500);
      
      timeoutsRef.current.push(timer);
      
      return () => {
        window.clearTimeout(timer);
      };
    }

    if (stage === "finishing") {
      const timer = window.setTimeout(() => {
        setStage("complete");
        // Wait for exit animation to finish before unmounting
        const completeTimer = window.setTimeout(onLoadComplete, 1000);
        timeoutsRef.current.push(completeTimer);
      }, 800);
      
      timeoutsRef.current.push(timer);
      
      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [stage, onLoadComplete]);

  return (
    <AnimatePresence mode="wait">
      {stage !== "complete" && (
        <motion.div
          key="initial-loader"
          className="fixed inset-0 bg-black z-[9999] overflow-hidden flex items-center justify-center"
          exit={{ 
            opacity: 0, 
            scale: 1.1, 
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* Background Matrix/Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `linear-gradient(rgba(141, 198, 63, 0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(141, 198, 63, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4">
            
            {/* STAGE 1: BOOT SEQUENCE TEXT */}
            <AnimatePresence mode="wait">
              {stage === "boot" && (
                <motion.div
                  key="boot-sequence"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="font-mono text-[#8DC63F] text-sm md:text-base w-full max-w-md"
                >
                  <div className="border-l-2 border-[#8DC63F]/50 pl-4 space-y-1">
                    {bootText.map((text, i) => (
                      <motion.div
                        key={`${i}-${text}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-[#8DC63F]/50">{`>`}</span>
                        {text}
                      </motion.div>
                    ))}
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-3 h-4 bg-[#8DC63F] mt-2"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STAGE 2: CORE ACTIVATION */}
            {(stage === "core" || stage === "finishing") && (
              <motion.div
                key="core-activation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                {/* Energy Rings - Delayed Entrance */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-10">
                  <motion.div
                    className="absolute inset-0 border border-[#8DC63F]/30 rounded-full"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.1, 1], opacity: 1, rotate: 360 }}
                    transition={{ 
                      scale: { duration: 1.2, ease: "easeOut" },
                      opacity: { duration: 0.5 },
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                  />
                  <motion.div
                    className="absolute inset-4 border border-[#8DC63F]/20 rounded-full border-dashed"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: -360 }}
                    transition={{ 
                      scale: { delay: 0.2, duration: 1, ease: "easeOut" },
                      opacity: { delay: 0.2, duration: 0.5 },
                      rotate: { duration: 25, repeat: Infinity, ease: "linear" }
                    }}
                  />
                </div>

                {/* Main Logo - Pop In with Scale */}
                <motion.div 
                  className="relative z-20 flex flex-col items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.4, duration: 0.8, type: "spring", bounce: 0.4 }}
                >
                  <div className="relative p-8">
                    {/* Inner Glow */}
                    <motion.div 
                      className="absolute inset-0 bg-[#8DC63F] blur-[60px] opacity-10 rounded-full"
                      animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Logo with Metallic/Neon feel */}
                    <Logo className="w-32 h-32 md:w-56 md:h-56 drop-shadow-[0_0_15px_rgba(141,198,63,0.3)] relative z-10" />
                    

                  </div>
                </motion.div>

                {/* Scanning Light Beam - Late Entrance */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-0.5 bg-white/50 blur-[2px] z-30"
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ 
                    top: ["0%", "100%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeInOut", 
                    repeat: Infinity, 
                    repeatDelay: 0.5,
                    delay: 1.2 
                  }}
                />

                {/* Data Particles - Burst Out */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-[#8DC63F] rounded-full"
                    style={{
                      left: "50%",
                      top: "50%"
                    }}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{
                      x: Math.cos(i * (Math.PI / 6)) * 200,
                      y: Math.sin(i * (Math.PI / 6)) * 200,
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1.5 + (i * 0.1),
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Bottom Status Bar */}
            <div className="absolute bottom-12 w-full max-w-xl px-4">
               <div className="flex justify-between text-[#8DC63F]/60 text-xs font-mono mb-2">
                  <span>SYSTEM STATUS: {stage === "boot" ? "BOOTING" : "ONLINE"}</span>
                  <span>ID: VRZ-9902</span>
               </div>
               <div className="h-0.5 w-full bg-[#8DC63F]/20 relative overflow-hidden">
                 <motion.div
                    className="absolute inset-y-0 left-0 bg-[#8DC63F]"
                    initial={{ width: "0%" }}
                    animate={{ width: stage === "finishing" ? "100%" : stage === "core" ? "90%" : "30%" }}
                    transition={{ duration: 1 }}
                 />
               </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
