import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Trash2,
  Droplets,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig = {
  road: {
    label: 'Road',
    icon: Truck,
  },
  garbage: {
    label: 'Garbage',
    icon: Trash2,
  },
  water: {
    label: 'Water',
    icon: Droplets,
  },
  electricity: {
    label: 'Electricity',
    icon: Zap,
  },
  other: {
    label: 'Other',
    icon: HelpCircle,
  },
};

export function CategoryBadge({ category, className }) {
  const normalized = (category || 'other').toLowerCase();
  const config = categoryConfig[normalized] || categoryConfig.other;

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full',
        'border-[#c4c6cf] bg-white',
        'px-2.5 py-1',
        'text-[11px] font-medium text-[#44474e]',
        'shadow-none',
        className
      )}
    >
      <Icon
        className="h-3.5 w-3.5 text-[#44474e]"
        strokeWidth={2}
      />

      <span>{config.label}</span>
    </Badge>
  );
}