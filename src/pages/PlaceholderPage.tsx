import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[60vh]"
      data-testid={`page-${title.toLowerCase()}`}
    >
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-card-border text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-20 h-20 rounded-full bg-verza-emerald/20 flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Construction className="h-10 w-10 text-verza-emerald" />
          </motion.div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-2xl font-bold mb-2"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-muted-foreground"
        >
          {description || 'This page is coming soon. Stay tuned for updates!'}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-verza-emerald"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-verza-emerald"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-verza-emerald"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
