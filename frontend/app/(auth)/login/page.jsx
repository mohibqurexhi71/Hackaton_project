'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function CivicFixMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        aria-hidden="true"
      >
        <path
          d="M24 4.5L38 10V21.2C38 30.1 32.3 36.1 24 40C15.7 36.1 10 30.1 10 21.2V10L24 4.5Z"
          fill="#002147"
        />
        <path
          d="M16.5 19L24 14L31.5 19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 20.5H30.5V29H17.5V20.5Z"
          stroke="white"
          strokeWidth="1.8"
        />
        <path
          d="M20.5 22.5V27M24 22.5V27M27.5 22.5V27"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M18.5 32L21.5 34.5L29.5 27"
          stroke="#8FF780"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * Keep using the existing AuthContext login function.
       * Do not move JWT handling into this page.
       */
      await login(formData.email, formData.password);

      /*
       * Preserve role-based navigation used by the application.
       */
      if (user?.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to sign in. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
      <div className="mx-auto grid min-h-screen max-w-[1280px] lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT — Institutional information */}
        <section className="hidden border-r border-[#c4c6cf] bg-[#002147] px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-[4px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <CivicFixMark />

              <div className="leading-none">
                <div className="text-[19px] font-semibold tracking-[-0.02em]">
                  CivicFix
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#aec7f6]">
                  Citizen Portal
                </div>
              </div>
            </Link>

            <div className="mt-24 max-w-[480px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#aec7f6]">
                Welcome back
              </p>

              <h1 className="mt-4 text-[38px] font-semibold leading-[1.15] tracking-[-0.025em] text-white">
                Stay connected to the issues that matter in your community.
              </h1>

              <p className="mt-6 max-w-[430px] text-[15px] leading-[1.7] text-[#d6e3ff]">
                Sign in to report civic problems, track your complaints, and
                support issues affecting your area.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-white/10">
                  <ShieldCheck
                    className="h-4 w-4 text-[#8ff780]"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <p className="text-[14px] font-medium text-white">
                    Secure access
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[#aec7f6]">
                    Your account is protected with authenticated access.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-white/10">
                  <ArrowRight
                    className="h-4 w-4 text-[#8ff780]"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <p className="text-[14px] font-medium text-white">
                    Track progress
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.5] text-[#aec7f6]">
                    Follow reported issues from submission to resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#708ab5]">
            CivicFix • Report. Track. Resolve.
          </p>
        </section>

        {/* RIGHT — Login form */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[440px]">
            {/* Mobile brand */}
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3 rounded-[4px]"
              >
                <CivicFixMark />

                <div className="leading-none">
                  <div className="text-[18px] font-semibold tracking-[-0.02em] text-[#151c27]">
                    CivicFix
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#74777f]">
                    Citizen Portal
                  </div>
                </div>
              </Link>
            </div>

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                Account access
              </p>

              <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.02em] text-[#151c27]">
                Sign in to CivicFix
              </h2>

              <p className="mt-3 text-[14px] leading-[1.6] text-[#74777f]">
                Use your account credentials to continue to the portal.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-[8px] border border-[#ba1a1a] bg-[#ffdad6] px-4 py-3"
              >
                <p className="text-[13px] font-medium text-[#93000a]">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[14px] font-medium text-[#151c27]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74777f]"
                    strokeWidth={2}
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-11 rounded-[4px] border-[#c4c6cf] bg-white pl-10 text-[14px] text-[#151c27] shadow-none placeholder:text-[#74777f] focus:border-[#000a1e] focus:ring-2 focus:ring-[#000a1e]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[14px] font-medium text-[#151c27]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74777f]"
                    strokeWidth={2}
                  />

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-11 rounded-[4px] border-[#c4c6cf] bg-white pl-10 text-[14px] text-[#151c27] shadow-none placeholder:text-[#74777f] focus:border-[#000a1e] focus:ring-2 focus:ring-[#000a1e]/10"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] text-[14px] font-medium text-white shadow-none hover:bg-[#002147] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In'}

                {!loading && (
                  <ArrowRight
                    className="ml-2 h-4 w-4"
                    strokeWidth={2}
                  />
                )}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#dce2f3]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#74777f]">
                New to CivicFix?
              </span>
              <div className="h-px flex-1 bg-[#dce2f3]" />
            </div>

            <Link to="/signup">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-[4px] border-[#c4c6cf] bg-white text-[14px] font-medium text-[#151c27] shadow-none hover:bg-[#f0f3ff]"
              >
                Create a Citizen Account
              </Button>
            </Link>

            <p className="mt-8 text-center text-[11px] leading-[1.5] text-[#74777f]">
              By continuing, you agree to use CivicFix responsibly for genuine
              civic issues.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}