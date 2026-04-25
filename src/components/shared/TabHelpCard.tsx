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
      card: 'bg-white/[0.02]',
      icon: 'border-white/10 bg-white/5 text-verza-gray',
      chip: 'border-white/10 bg-white/5',
      panel: 'border-white/5 bg-white/[0.02]',
    },
    blue: {
      card: 'bg-white/[0.03]',
      icon: 'border-verza-emerald/30 bg-verza-emerald/10 text-verza-emerald',
      chip: 'border-verza-emerald/20 bg-verza-emerald/5',
      panel: 'border-verza-emerald/10 bg-verza-emerald/[0.02]',
    },
    violet: {
      card: 'bg-white/[0.03]',
      icon: 'border-violet-500/30 bg-violet-500/15 text-violet-400',
      chip: 'border-violet-500/30 bg-violet-500/10',
      panel: 'border-violet-500/20 bg-violet-500/5',
    },
    emerald: {
      card: 'bg-white/[0.03]',
      icon: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
      chip: 'border-emerald-500/30 bg-emerald-500/10',
      panel: 'border-emerald-500/20 bg-emerald-500/5',
    },
    amber: {
      card: 'bg-white/[0.03]',
      icon: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
      chip: 'border-amber-500/30 bg-amber-500/10',
      panel: 'border-amber-500/20 bg-amber-500/5',
    },
  }[tone];

  return (
    <div className={`enterprise-card rounded-[22px] border-none ${toneStyles.card} mb-6`}>
      <CardContent className="p-5 md:p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className={`h-11 w-11 shrink-0 rounded-xl border flex items-center justify-center ${toneStyles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] border-white/10 text-verza-gray/70">
                {sectionLabel}
              </Badge>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-ent-text">{title}</h3>
            <p className="text-sm text-verza-gray/80 leading-relaxed">{description}</p>
          </div>
        </div>

        {(useWhen || highlights.length > 0) && (
          <div className={`rounded-xl border p-4 space-y-3 ${toneStyles.panel}`}>
            {useWhen && (
              <p className="text-xs text-verza-gray">
                <span className="font-semibold text-ent-text mr-1.5">Best used when:</span> {useWhen}
              </p>
            )}
            {highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider font-medium text-verza-gray/80 ${toneStyles.chip}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
}
