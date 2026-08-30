'use client';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ShieldAlert,
  Building2,
  PlusCircle,
  ListFilter,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated, isOfficer, isCitizen, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-900/30 transition-transform group-hover:scale-105">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg leading-tight tracking-tight text-foreground">
                CivicFix
              </span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                Portal
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Citizen Complaint Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          <Link
            href="/complaints"
            className={cn(
              'px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 flex items-center gap-1.5',
              isActive('/complaints')
                ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                : 'text-muted-foreground'
            )}
          >
            <ListFilter className="h-4 w-4" />
            Browse Complaints
          </Link>

          {isAuthenticated && isCitizen && (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  'px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 flex items-center gap-1.5',
                  isActive('/dashboard')
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/complaints/mine"
                className={cn(
                  'px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 flex items-center gap-1.5',
                  isActive('/complaints/mine')
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                <FileText className="h-4 w-4" />
                My Complaints
              </Link>
              <Link
                href="/complaints/new"
                className={cn(
                  'px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 flex items-center gap-1.5',
                  isActive('/complaints/new')
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                Report Issue
              </Link>
            </>
          )}

          {isAuthenticated && isOfficer && (
            <>
              <Link
                href="/officer/dashboard"
                className={cn(
                  'px-3 py-2 rounded-md transition-colors hover:text-foreground hover:bg-muted/60 flex items-center gap-1.5',
                  isActive('/officer/dashboard')
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                <ShieldAlert className="h-4 w-4 text-sky-400" />
                Officer Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {isOfficer ? (
                <Badge variant="info" className="gap-1 px-2.5 py-0.5">
                  <ShieldAlert className="h-3 w-3" />
                  Govt Officer
                </Badge>
              ) : (
                <Link href="/complaints/new">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                    <PlusCircle className="h-4 w-4" />
                    Report Complaint
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-border">
                    <User className="h-4 w-4 text-emerald-400" />
                    <span className="max-w-[120px] truncate font-medium">
                      {user?.name || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isCitizen && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Citizen Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/complaints/mine" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          My Complaints
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isOfficer && (
                    <DropdownMenuItem asChild>
                      <Link href="/officer/dashboard" className="cursor-pointer">
                        <ShieldAlert className="mr-2 h-4 w-4 text-sky-400" />
                        Officer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-400 cursor-pointer focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/98 px-4 py-4 backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3">
            <Link
              href="/complaints"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <ListFilter className="h-4 w-4 text-emerald-400" />
              Browse Complaints
            </Link>

            {isAuthenticated && isCitizen && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                  Citizen Dashboard
                </Link>
                <Link
                  href="/complaints/mine"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  <FileText className="h-4 w-4 text-emerald-400" />
                  My Complaints
                </Link>
                <Link
                  href="/complaints/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-emerald-600/20 text-emerald-400"
                >
                  <PlusCircle className="h-4 w-4 text-emerald-400" />
                  Report Issue
                </Link>
              </>
            )}

            {isAuthenticated && isOfficer && (
              <Link
                href="/officer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-sky-600/20 text-sky-400"
              >
                <ShieldAlert className="h-4 w-4 text-sky-400" />
                Officer Dashboard
              </Link>
            )}

            <div className="border-t border-border pt-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 text-xs text-muted-foreground">
                    Signed in as <span className="font-semibold text-foreground">{user?.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
