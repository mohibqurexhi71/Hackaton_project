'use client';

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function ProtectedRoute({ children, officerOnly = false, citizenOnly = false }) {
  const { isAuthenticated, isOfficer, isCitizen, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate(`/login?redirect=${encodeURIComponent(pathname)}`, { replace: true });
      } else if (officerOnly && !isOfficer) {
        navigate('/dashboard', { replace: true });
      } else if (citizenOnly && !isCitizen) {
        navigate('/officer/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isOfficer, isCitizen, loading, navigate, pathname, officerOnly, citizenOnly]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (officerOnly && !isOfficer) {
    return null;
  }

  if (citizenOnly && !isCitizen) {
    return null;
  }

  return children;
}
