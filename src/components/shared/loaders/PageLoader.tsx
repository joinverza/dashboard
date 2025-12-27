import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const GlitchLine = () => {
  const width = useMemo(() => [
    10 + Math.random() * 40,
    20 + Math.random() * 40,
    10 + Math.random() * 40
  ], []);

  const duration = useMemo(() => 0.2 + Math.random() * 0.5, []);

  return (
    <motion.div
      className="h-1 bg-[#8DC63F] rounded-full"
      animate={{
        width: width,
        opacity: [0.2, 0.8, 0.2]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  );
};

const WORDS = ["INITIALIZING", "VERIFYING", "CONNECTING", "SECURING"];

const LoadingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 overflow-hidden flex flex-col items-center justify-center">
      <motion.span
        key={index}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="text-[#8DC63F] text-xs font-mono tracking-[0.3em]"
      >
        {WORDS[index]}
      </motion.span>
    </div>
  );
};

export const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 5;
        if (next >= 100) return 100;
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(141, 198, 63, 0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </div>

      {/* Central Assembly */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 border border-[#8DC63F]/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8DC63F] rounded-full shadow-[0_0_10px_#8DC63F]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8DC63F] rounded-full shadow-[0_0_10px_#8DC63F]" />
        </motion.div>

        {/* Middle Ring - Counter Rotating */}
        <motion.div
          className="absolute inset-4 border border-[#8DC63F]/10 rounded-full border-dashed"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Tech Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-32 h-32 rounded-full border border-[#8DC63F]/30 flex items-center justify-center relative"
            animate={{ 
              boxShadow: ["0 0 10px rgba(141,198,63,0.1)", "0 0 30px rgba(141,198,63,0.3)", "0 0 10px rgba(141,198,63,0.1)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Core Hexagon */}
            <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-80">
              <motion.path
                d="M50 5 L93 27 L93 72 L50 95 L7 72 L7 27 Z"
                fill="none"
                stroke="#8DC63F"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z"
                fill="rgba(141,198,63,0.1)"
                stroke="none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Orbiting Particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
          >
            <div 
              className="w-1 h-8 bg-gradient-to-b from-transparent via-[#8DC63F] to-transparent absolute top-0 left-1/2 -translate-x-1/2 opacity-50"
              style={{ filter: 'blur(1px)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom Status Area */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
        <LoadingText />
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-[#8DC63F]/10 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#8DC63F]"
            style={{ width: `${Math.min(progress, 100)}%` }}
            animate={{
              boxShadow: "0 0 10px #8DC63F"
            }}
          />
        </div>
        
        <div className="text-[#8DC63F]/50 text-[10px] font-mono">
          SYSTEM INTEGRITY: {Math.min(Math.floor(progress), 100)}%
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[#8DC63F]/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-[#8DC63F]/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-[#8DC63F]/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-[#8DC63F]/30" />

      {/* Random Data Glitch Overlay */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 items-end opacity-30">
        {[...Array(5)].map((_, i) => (
          <GlitchLine key={i} />
        ))}
      </div>
    </div>
  );
};
