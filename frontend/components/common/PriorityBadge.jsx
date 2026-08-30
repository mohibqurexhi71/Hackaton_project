import React from 'react';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  CircleAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function PriorityBadge({
  priority,
  score,
  showScore = false,
  className,
}) {
  const normalizedPriority = (priority || 'low').toLowerCase();

  const scoreText =
    showScore && typeof score === 'number'
      ? ` (${score})`
      : '';

  switch (normalizedPriority) {
    case 'critical':
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#ba1a1a] bg-[#ffdad6]',
            'px-2.5 py-1',
            'text-[11px] font-semibold text-[#93000a]',
            'shadow-none',
            className
          )}
        >
          <Flame
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          Critical{scoreText}
        </Badge>
      );

    case 'high':
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#fb923c] bg-[#fff7ed]',
            'px-2.5 py-1',
            'text-[11px] font-semibold text-[#9a3412]',
            'shadow-none',
            className
          )}
        >
          <ShieldAlert
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          High{scoreText}
        </Badge>
      );

    case 'medium':
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#facc15] bg-[#fefce8]',
            'px-2.5 py-1',
            'text-[11px] font-medium text-[#854d0e]',
            'shadow-none',
            className
          )}
        >
          <AlertTriangle
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          Medium{scoreText}
        </Badge>
      );

    case 'low':
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#c4c6cf] bg-[#f9f9ff]',
            'px-2.5 py-1',
            'text-[11px] font-medium text-[#44474e]',
            'shadow-none',
            className
          )}
        >
          <CircleAlert
            className="h-3.5 w-3.5 text-[#44474e]"
            strokeWidth={2}
          />
          Low{scoreText}
        </Badge>
      );
  }
}