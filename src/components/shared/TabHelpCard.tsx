import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TabHelpCardProps {
  title: string;
  description: string;
}

export function TabHelpCard({ title, description }: TabHelpCardProps) {
  return (
    <Alert className="border-border/60 bg-muted/20">
      <Info className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
