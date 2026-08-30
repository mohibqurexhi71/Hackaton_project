import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertOctagon, Flame, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PriorityBadge({ priority, score, showScore = false, className }) {
  const normalizedPriority = (priority || 'low').toLowerCase();

  switch (normalizedPriority) {
    case 'critical':
      return (
        <Badge
          className={cn(
            'gap-1 border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold',
            className
          )}
        >
          <Flame className="h-3 w-3 text-rose-500 animate-pulse" />
          Critical{showScore && typeof score === 'number' ? ` (${score})` : ''}
        </Badge>
      );
    case 'high':
      return (
        <Badge
          className={cn(
            'gap-1 border-orange-500/30 bg-orange-500/10 text-orange-400 font-medium',
            className
          )}
        >
          <ShieldAlert className="h-3 w-3 text-orange-400" />
          High{showScore && typeof score === 'number' ? ` (${score})` : ''}
        </Badge>
      );
    case 'medium':
      return (
        <Badge
          variant="warning"
          className={cn('gap-1 font-medium', className)}
        >
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          Medium{showScore && typeof score === 'number' ? ` (${score})` : ''}
        </Badge>
      );
    case 'low':
    default:
      return (
        <Badge
          variant="secondary"
          className={cn('gap-1 text-muted-foreground', className)}
        >
          <AlertOctagon className="h-3 w-3" />
          Low{showScore && typeof score === 'number' ? ` (${score})` : ''}
        </Badge>
      );
  }
}
