'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/toaster';
import { Building2, Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, isOfficer } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to role-specific dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isOfficer) {
        navigate('/officer/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isOfficer, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await signup(
      formData.name.trim(),
      formData.email.trim(),
      formData.password
    );

    if (res.success) {
      toast.success(`Account created! Welcome, ${res.user.name}.`);
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.message);
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Brand Header */}
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

      <Card className="w-full max-w-md border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Create Citizen Account</CardTitle>
          <CardDescription>
            Report community issues, upvote neighbors, and track municipal action
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
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Ahmed Khan"
                  className="pl-9"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ahmed@example.com"
                  className="pl-9"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  className="pl-9 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
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

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="pl-9 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                  Creating Account...
                </>
              ) : (
                <>
                  Register as Citizen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 text-center text-sm text-muted-foreground border-t border-border/40 pt-4">
          <div>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
