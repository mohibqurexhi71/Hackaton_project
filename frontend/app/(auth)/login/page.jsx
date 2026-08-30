'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/toaster';
import { Building2, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldAlert, UserCheck } from 'lucide-react';

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get('redirect');
  const { login, isAuthenticated, user, isOfficer } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Role-based redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isOfficer) {
        navigate('/officer/dashboard', { replace: true });
      } else {
        navigate(redirectUrl || '/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, isOfficer, navigate, redirectUrl]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(formData.email.trim(), formData.password);

    if (res.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'officer') {
        navigate('/officer/dashboard', { replace: true });
      } else {
        navigate(redirectUrl || '/dashboard', { replace: true });
      }
    } else {
      setError(res.message);
      toast.error(res.message);
    }
    setLoading(false);
  };

  // Demo user quick autofill
  const fillDemoAccount = (role = 'citizen') => {
    if (role === 'officer') {
      setFormData({
        email: 'officer@civicfix.demo',
        password: 'Officer123!',
      });
    } else if (role === 'fatima') {
      setFormData({
        email: 'fatima@civicfix.demo',
        password: 'Citizen123!',
      });
    } else {
      setFormData({
        email: 'ahmed@civicfix.demo',
        password: 'Citizen123!',
      });
    }
    setError('');
  };

  return (
    <Card className="w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In to CivicFix</CardTitle>
        <CardDescription>
          Access your complaint portal dashboard and tracking
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="pl-9"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-9 pr-10"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-900/20 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <div className="text-xs text-muted-foreground text-center mb-2.5 font-medium">
            Demo Credentials (Fast Testing)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs border-sky-500/30 text-sky-400 hover:bg-sky-500/10 gap-1"
              onClick={() => fillDemoAccount('officer')}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Govt Officer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-1"
              onClick={() => fillDemoAccount('citizen')}
            >
              <UserCheck className="h-3.5 w-3.5" />
              Citizen Ahmed
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 text-center text-sm text-muted-foreground border-t border-border/40 pt-4">
        <div>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-emerald-400 hover:underline">
            Register as Citizen
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Brand logo back to home */}
      <Link to="/" className="flex items-center space-x-2.5 mb-8 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 transition-transform group-hover:scale-105">
          <Building2 className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-tight tracking-tight text-foreground">
            CivicFix
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">Citizen Complaint Portal</span>
        </div>
      </Link>

      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-muted/40" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
