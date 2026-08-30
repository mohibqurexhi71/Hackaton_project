'use client';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  ListFilter,
  FileText,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * CivicFix Logo
 * A restrained institutional mark:
 * shield + civic structure + check.
 */
function CivicFixLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center',
          compact ? 'h-9 w-9' : 'h-10 w-10'
        )}
      >
        {/* Institutional mark */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* Shield */}
          <path
            d="M20 3.5L33 8.5V18.8C33 27.1 27.7 32.7 20 36.5C12.3 32.7 7 27.1 7 18.8V8.5L20 3.5Z"
            fill="#002147"
          />

          {/* Civic building */}
          <path
            d="M12 16.5L20 11.5L28 16.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M13.5 17.5H26.5V26.5H13.5V17.5Z"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />

          <path
            d="M16 19.5V24.5M20 19.5V24.5M24 19.5V24.5"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Green civic check */}
          <path
            d="M15.5 28.5L18 30.8L24.8 24.2"
            stroke="#8FF780"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#151c27]">
            CivicFix
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#74777f]">
            Citizen Portal
          </span>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { user, isAuthenticated, isOfficer, isCitizen, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItemClass = (active = false) =>
    cn(
      'inline-flex items-center gap-2 rounded-[4px] px-3 py-2 text-[14px] font-medium transition-colors duration-150',
      active
        ? 'bg-[#f0f3ff] text-[#000a1e]'
        : 'text-[#44474e] hover:bg-[#f0f3ff] hover:text-[#151c27]'
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#c4c6cf] bg-[#ffffff]">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-6">
        {/* Brand */}
        <Link
          to="/"
          className="shrink-0 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000a1e] focus-visible:ring-offset-2"
          aria-label="CivicFix home"
          onClick={closeMobileMenu}
        >
          <CivicFixLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/complaints"
            className={navItemClass(isActive('/complaints'))}
          >
            <ListFilter className="h-4 w-4" strokeWidth={2} />
            Browse Complaints
          </Link>

          {isAuthenticated && isCitizen && (
            <>
              <Link
                to="/dashboard"
                className={navItemClass(isActive('/dashboard'))}
              >
                <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
                Dashboard
              </Link>

              <Link
                to="/complaints/mine"
                className={navItemClass(isActive('/complaints/mine'))}
              >
                <FileText className="h-4 w-4" strokeWidth={2} />
                My Complaints
              </Link>

              <Link
                to="/complaints/new"
                className={navItemClass(isActive('/complaints/new'))}
              >
                <PlusCircle className="h-4 w-4" strokeWidth={2} />
                Report Issue
              </Link>
            </>
          )}

          {isAuthenticated && isOfficer && (
            <Link
              to="/officer/dashboard"
              className={navItemClass(isActive('/officer/dashboard'))}
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={2} />
              Officer Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-[4px] px-4 text-[#151c27] hover:bg-[#f0f3ff]"
                >
                  Sign In
                </Button>
              </Link>

              <Link to="/signup">
                <Button
                  size="sm"
                  className="gap-2 rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-4 text-white shadow-none hover:bg-[#002147]"
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Role badge / Primary action */}
              {isOfficer ? (
                <Badge
                  variant="outline"
                  className="gap-1.5 rounded-full border-[#c4c6cf] bg-[#f0f3ff] px-3 py-1 text-[#002147]"
                >
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                  Government Officer
                </Badge>
              ) : (
                <Link to="/complaints/new">
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-4 text-white shadow-none hover:bg-[#002147]"
                  >
                    <PlusCircle className="h-4 w-4" strokeWidth={2} />
                    Report Complaint
                  </Button>
                </Link>
              )}

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-[4px] border-[#c4c6cf] bg-white px-3 text-[#151c27] shadow-none hover:bg-[#f0f3ff]"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#002147] text-white">
                      <User className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>

                    <span className="max-w-[120px] truncate font-medium">
                      {user?.name || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-60 rounded-[8px] border border-[#c4c6cf] bg-white p-1 shadow-[0_4px_12px_rgba(0,10,30,0.08)]"
                >
                  <DropdownMenuLabel className="px-3 py-2.5 font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-[14px] font-semibold text-[#151c27]">
                        {user?.name || 'Account'}
                      </p>

                      <p className="truncate text-[12px] text-[#74777f]">
                        {user?.email}
                      </p>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#74777f]">
                        {isOfficer ? 'Government Officer' : 'Citizen'}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-[#e2e8f8]" />

                  {isCitizen && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/dashboard"
                          className="cursor-pointer rounded-[4px] text-[#151c27] focus:bg-[#f0f3ff]"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Citizen Dashboard
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/complaints/mine"
                          className="cursor-pointer rounded-[4px] text-[#151c27] focus:bg-[#f0f3ff]"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          My Complaints
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isOfficer && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/officer/dashboard"
                        className="cursor-pointer rounded-[4px] text-[#151c27] focus:bg-[#f0f3ff]"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Officer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-[#e2e8f8]" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-[4px] text-[#ba1a1a] focus:bg-[#ffdad6] focus:text-[#93000a]"
                  >
                    <LogOut className="mr-2 h-4 w-4" strokeWidth={2} />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#c4c6cf] bg-white text-[#151c27] transition-colors duration-150 hover:bg-[#f0f3ff] md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e2e8f8] bg-white md:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-4">
            <Link
              to="/complaints"
              onClick={closeMobileMenu}
              className={navItemClass(isActive('/complaints'))}
            >
              <ListFilter className="h-4 w-4" strokeWidth={2} />
              Browse Complaints
            </Link>

            {isAuthenticated && isCitizen && (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={navItemClass(isActive('/dashboard'))}
                >
                  <LayoutDashboard className="h-4 w-4" strokeWidth={2} />
                  Citizen Dashboard
                </Link>

                <Link
                  to="/complaints/mine"
                  onClick={closeMobileMenu}
                  className={navItemClass(isActive('/complaints/mine'))}
                >
                  <FileText className="h-4 w-4" strokeWidth={2} />
                  My Complaints
                </Link>

                <Link
                  to="/complaints/new"
                  onClick={closeMobileMenu}
                  className={cn(
                    navItemClass(isActive('/complaints/new')),
                    'mt-1 border border-[#c4c6cf]'
                  )}
                >
                  <PlusCircle className="h-4 w-4" strokeWidth={2} />
                  Report Issue
                </Link>
              </>
            )}

            {isAuthenticated && isOfficer && (
              <Link
                to="/officer/dashboard"
                onClick={closeMobileMenu}
                className={navItemClass(isActive('/officer/dashboard'))}
              >
                <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                Officer Dashboard
              </Link>
            )}

            <div className="my-3 border-t border-[#e2e8f8]" />

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button
                    variant="outline"
                    className="w-full rounded-[4px] border-[#c4c6cf] bg-white shadow-none"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link to="/signup" onClick={closeMobileMenu}>
                  <Button className="w-full rounded-[4px] bg-[#000a1e] text-white shadow-none hover:bg-[#002147]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-[8px] border border-[#c4c6cf] bg-[#f9f9ff] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002147] text-white">
                    <User className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#151c27]">
                      {user?.name || 'Account'}
                    </p>
                    <p className="truncate text-[12px] text-[#74777f]">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="w-full rounded-[4px] border-[#ba1a1a] text-[#ba1a1a] shadow-none hover:bg-[#ffdad6]"
                >
                  <LogOut className="mr-2 h-4 w-4" strokeWidth={2} />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}