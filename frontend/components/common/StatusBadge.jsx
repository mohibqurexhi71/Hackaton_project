import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }) {
  switch (status) {
    case 'resolved':
      return (
        <Badge
          variant="success"
          className={cn('gap-1 font-medium capitalize', className)}
        >
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </Badge>
      );
    case 'in-progress':
      return (
        <Badge
          variant="info"
          className={cn('gap-1 font-medium capitalize', className)}
        >
          <RefreshCw className="h-3 w-3 animate-spin text-sky-400" style={{ animationDuration: '3s' }} />
          In Progress
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge
          variant="warning"
          className={cn('gap-1 font-medium capitalize', className)}
        >
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
  }
}
