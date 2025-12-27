import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { PageLoader } from '@/components/shared/loaders/PageLoader';
import { pageVariants } from '@/lib/animations';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);
  const [currentLocation, setCurrentLocation] = useState(location);

  useEffect(() => {
    if (location !== currentLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      const timer = setTimeout(() => {
        setCurrentChildren(children);
        setCurrentLocation(location);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCurrentChildren(children);
    }
  }, [location, children, currentLocation]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <PageLoader key="loader" />
      ) : (
        <motion.div
          key={currentLocation}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          {currentChildren}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
