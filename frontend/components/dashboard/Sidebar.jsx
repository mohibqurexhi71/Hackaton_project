'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  ListFilter,
  ShieldAlert,
  Building2,
  LogOut,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DashboardSidebar({ className, onItemClick }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout, isOfficer, isCitizen } = useAuth();

  const citizenNav = [
    {
      name: 'Dashboard Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Report New Issue',
      href: '/complaints/new',
      icon: PlusCircle,
    },
    {
      name: 'My Complaints',
      href: '/complaints/mine',
      icon: FileText,
    },
    {
      name: 'Browse Complaints',
      href: '/complaints',
      icon: ListFilter,
    },
  ];

  const officerNav = [
    {
      name: 'Officer Operations',
      href: '/officer/dashboard',
      icon: ShieldAlert,
    },
    {
      name: 'Browse Complaints',
      href: '/complaints',
      icon: ListFilter,
    },
  ];

  const navigationItems = isOfficer ? officerNav : citizenNav;

  return (
    <aside className={cn('flex flex-col h-full bg-card/95 border-r border-border/80 text-card-foreground', className)}>
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-border/60">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-900/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-foreground">
                CivicFix
              </span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
                Portal
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Citizen Complaints</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {isOfficer ? 'Government Operations' : 'Citizen Menu'}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href} to={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20 font-semibold'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info & Quick Logout Footer */}
      <div className="p-4 border-t border-border/60 bg-muted/20">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-muted-foreground capitalize font-medium">{user?.role || 'Citizen'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
