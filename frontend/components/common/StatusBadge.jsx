import React from 'react';
import {
  Clock3,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }) {
  switch (status) {
    case 'resolved':
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#77dd6a] bg-[#e8f8e6]',
            'px-2.5 py-1',
            'text-[11px] font-medium text-[#006e0c]',
            'shadow-none',
            className
          )}
        >
          <CheckCircle2
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          Resolved
        </Badge>
      );

    case 'in-progress':
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#93c5fd] bg-[#eff6ff]',
            'px-2.5 py-1',
            'text-[11px] font-medium text-[#1e40af]',
            'shadow-none',
            className
          )}
        >
          <RefreshCw
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          In Progress
        </Badge>
      );

    case 'pending':
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full',
            'border-[#f1c46a] bg-[#fffbeb]',
            'px-2.5 py-1',
            'text-[11px] font-medium text-[#9a6700]',
            'shadow-none',
            className
          )}
        >
          <Clock3
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          Pending
        </Badge>
      );
  }
}