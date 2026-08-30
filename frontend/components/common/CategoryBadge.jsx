import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Truck, Trash2, Droplets, Zap, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CategoryBadge({ category, className }) {
  const normalized = (category || 'other').toLowerCase();

  switch (normalized) {
    case 'road':
      return (
        <Badge variant="outline" className={cn('gap-1 text-slate-300 border-slate-700', className)}>
          <Truck className="h-3 w-3 text-sky-400" />
          Road
        </Badge>
      );
    case 'garbage':
      return (
        <Badge variant="outline" className={cn('gap-1 text-slate-300 border-slate-700', className)}>
          <Trash2 className="h-3 w-3 text-emerald-400" />
          Garbage
        </Badge>
      );
    case 'water':
      return (
        <Badge variant="outline" className={cn('gap-1 text-slate-300 border-slate-700', className)}>
          <Droplets className="h-3 w-3 text-cyan-400" />
          Water
        </Badge>
      );
    case 'electricity':
      return (
        <Badge variant="outline" className={cn('gap-1 text-slate-300 border-slate-700', className)}>
          <Zap className="h-3 w-3 text-yellow-400" />
          Electricity
        </Badge>
      );
    case 'other':
    default:
      return (
        <Badge variant="outline" className={cn('gap-1 text-slate-300 border-slate-700', className)}>
          <HelpCircle className="h-3 w-3 text-purple-400" />
          Other
        </Badge>
      );
  }
}
