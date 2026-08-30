'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  FilePlus,
  ListFilter,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  Truck,
  Trash2,
  Droplets,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-border/40 py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-background to-background" />

          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Civic Issue Resolution & AI Operations</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Report. Track.{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Resolve.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A transparent civic complaint platform connecting citizens directly with municipal authorities.
              Surface neighborhood issues, upvote community priorities, and track government resolution in real-time.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/complaints/new">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 h-12 shadow-lg shadow-emerald-900/25">
                  <FilePlus className="h-5 w-5" />
                  Report an Issue
                </Button>
              </Link>
              <Link to="/complaints">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 px-8 h-12 border-border">
                  <ListFilter className="h-5 w-5 text-emerald-400" />
                  Browse Complaints
                </Button>
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-4 rounded-xl border border-border/60 bg-card/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                  <ThumbsUp className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">Community Upvotes</div>
                <div className="text-xs text-muted-foreground">Democratize urgency</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl border border-border/60 bg-card/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 mb-2">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">Live Lifecycle</div>
                <div className="text-xs text-muted-foreground">Pending to resolved</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl border border-border/60 bg-card/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 mb-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">AI Briefings</div>
                <div className="text-xs text-muted-foreground">Gemini operational summaries</div>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl border border-border/60 bg-card/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-xl font-bold">Citizen Ratings</div>
                <div className="text-xs text-muted-foreground">Post-resolution feedback</div>
              </div>
            </div>
          </div>
        </section>

        {/* ISSUE CATEGORIES SECTION */}
        <section className="py-20 border-b border-border/40 bg-card/30">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <Badge variant="outline" className="mb-3 text-emerald-400 border-emerald-500/30">
                Issue Coverage
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Civic Issues Can You Report?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Categorized workflows direct issues instantly to relevant municipal response units.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/60 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Roads & Transport</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Potholes, broken asphalt, damaged footpaths, missing manhole covers, and faulty traffic signals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Garbage & Sanitation</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Uncollected trash heaps, overflowing public dumpsters, clogged drainage, and illegal dumping.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Water Supply</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Burst pipeline mains, low water pressure, contaminated tap water, and open sewer leakages.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">Electricity & Power</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Exposed transformer wires, malfunctioning streetlights, hanging power cables, and power surges.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 border-b border-border/40">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-3 text-emerald-400 border-emerald-500/30">
                Simple 3-Step Process
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How CivicFix Works
              </h2>
              <p className="mt-3 text-muted-foreground">
                From initial citizen report to government action and verified citizen feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card/60 relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-xl shadow-lg shadow-emerald-900/30 mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold">1. Report or Upvote</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Submit a complaint with location and category. If someone else already reported it, duplicate detection helps you upvote the existing issue to boost its priority.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card/60 relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white font-black text-xl shadow-lg shadow-sky-900/30 mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold">2. Officer Operations</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Municipal officers monitor live complaint queues, receive AI daily workload briefings, dispatch field crews, and update statuses with official remarks.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card/60 relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white font-black text-xl shadow-lg shadow-teal-900/30 mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold">3. Resolve & Rate</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Once marked resolved, the reporting citizen receives a resolution confirmation and provides a 1–5 star rating with feedback on the service quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 bg-gradient-to-b from-background via-emerald-950/20 to-background">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to improve your neighborhood?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join fellow citizens and government authorities in resolving municipal issues faster and more transparently.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                  Create Citizen Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-border">
                  Sign In to CivicFix
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-8 bg-card/40">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-foreground">CivicFix</span> — Citizen Complaint Portal
          </div>
          <div>
            12-Hour Mega Hackathon Project • Node.js, Express, Next.js, MongoDB, Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}
