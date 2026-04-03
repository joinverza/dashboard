import { Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TabHelpCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  sectionLabel?: string;
  useWhen?: string;
  highlights?: string[];
  tone?: 'neutral' | 'blue' | 'violet' | 'emerald' | 'amber';
}

export function TabHelpCard({
  title,
  description,
  icon: Icon = Info,
  sectionLabel = 'Guidance',
  useWhen,
  highlights = [],
  tone = 'neutral',
}: TabHelpCardProps) {
  const toneStyles = {
    neutral: {
      card: 'from-muted/40 via-card to-card',
      icon: 'border-primary/20 bg-primary/10 text-primary',
      chip: 'border-border/70 bg-background',
      panel: 'border-border/60 bg-muted/20',
    },
    blue: {
      card: 'from-blue-500/10 via-card to-card',
      icon: 'border-blue-500/30 bg-blue-500/15 text-blue-600 dark:text-blue-400',
      chip: 'border-blue-500/30 bg-blue-500/10',
      panel: 'border-blue-500/20 bg-blue-500/5',
    },
    violet: {
      card: 'from-violet-500/10 via-card to-card',
      icon: 'border-violet-500/30 bg-violet-500/15 text-violet-600 dark:text-violet-400',
      chip: 'border-violet-500/30 bg-violet-500/10',
      panel: 'border-violet-500/20 bg-violet-500/5',
    },
    emerald: {
      card: 'from-emerald-500/10 via-card to-card',
      icon: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      chip: 'border-emerald-500/30 bg-emerald-500/10',
      panel: 'border-emerald-500/20 bg-emerald-500/5',
    },
    amber: {
      card: 'from-amber-500/10 via-card to-card',
      icon: 'border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400',
      chip: 'border-amber-500/30 bg-amber-500/10',
      panel: 'border-amber-500/20 bg-amber-500/5',
    },
  }[tone];

  return (
    <Card className={`border-border/60 bg-gradient-to-br ${toneStyles.card} shadow-sm`}>
      <CardContent className="p-4 md:p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className={`h-10 w-10 shrink-0 rounded-lg border flex items-center justify-center ${toneStyles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                {sectionLabel}
              </Badge>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-6">{description}</p>
          </div>
        </div>

        {(useWhen || highlights.length > 0) && (
          <div className={`rounded-md border p-3 space-y-2 ${toneStyles.panel}`}>
            {useWhen && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Best used when:</span> {useWhen}
              </p>
            )}
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-2.5 py-1 text-[11px] text-muted-foreground ${toneStyles.chip}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
