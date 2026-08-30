'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Droplets,
  FileText,
  MapPin,
  ShieldCheck,
  ThumbsUp,
  Trash2,
  Truck,
  Users,
  Zap,
} from 'lucide-react';

import { Navbar } from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';

const categories = [
  {
    icon: Truck,
    title: 'Roads & Transport',
    description:
      'Report potholes, damaged roads, broken footpaths, and other transport-related problems.',
  },
  {
    icon: Trash2,
    title: 'Garbage & Sanitation',
    description:
      'Flag overflowing bins, uncollected waste, blocked drainage, and sanitation concerns.',
  },
  {
    icon: Droplets,
    title: 'Water Supply',
    description:
      'Report water shortages, damaged pipelines, leakage, and local water supply issues.',
  },
  {
    icon: Zap,
    title: 'Electricity',
    description:
      'Report faulty streetlights, damaged power infrastructure, and electrical issues.',
  },
];

const benefits = [
  {
    icon: FileText,
    title: 'Simple Reporting',
    description: 'Submit a civic complaint in under a minute.',
  },
  {
    icon: ThumbsUp,
    title: 'Community Upvotes',
    description: 'Support issues affecting people in your area.',
  },
  {
    icon: Clock3,
    title: 'Transparent Tracking',
    description: 'Follow every complaint from pending to resolved.',
  },
  {
    icon: ShieldCheck,
    title: 'Accountable Resolution',
    description: 'Officers can update status and add official remarks.',
  },
];

function CivicMark() {
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="border-b border-[#dce2f3] bg-[#f9f9ff]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 sm:py-20 lg:py-24">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left */}
              <div className="max-w-[720px]">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c4c6cf] bg-white px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#44474e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006e0c]" />
                  Civic issue reporting platform
                </div>

                <h1 className="max-w-[680px] text-[42px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#151c27] sm:text-[56px] lg:text-[64px]">
                  Report. Track.{' '}
                  <span className="text-[#002147]">Resolve.</span>
                </h1>

                <p className="mt-6 max-w-[650px] text-[17px] leading-[1.7] text-[#44474e] sm:text-[18px]">
                  CivicFix gives citizens a simple way to report local problems
                  and track what happens next. Officers get a clear view of
                  complaints so important issues can be addressed faster.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link to="/complaints/new">
                    <Button
                      size="lg"
                      className="h-12 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-7 text-white shadow-none hover:bg-[#002147] sm:w-auto"
                    >
                      Report a Complaint
                      <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />
                    </Button>
                  </Link>

                  <Link to="/complaints">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 w-full rounded-[4px] border-[#c4c6cf] bg-white px-7 text-[#151c27] shadow-none hover:bg-[#f0f3ff] sm:w-auto"
                    >
                      Browse Complaints
                    </Button>
                  </Link>
                </div>

                {/* Trust row */}
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[#74777f]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006e0c]" />
                    Transparent tracking
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006e0c]" />
                    Community upvotes
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#006e0c]" />
                    Officer accountability
                  </div>
                </div>
              </div>

              {/* Right: institutional product preview */}
              <div className="lg:pl-8">
                <div className="rounded-[8px] border border-[#c4c6cf] bg-white">
                  <div className="flex items-center justify-between border-b border-[#dce2f3] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CivicMark />

                      <div>
                        <div className="text-[15px] font-semibold text-[#151c27]">
                          CivicFix
                        </div>
                        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                          Complaint overview
                        </div>
                      </div>
                    </div>

                    <div className="rounded-full border border-[#77dd6a] bg-[#e8f8e6] px-3 py-1 text-[11px] font-semibold text-[#006e0c]">
                      Active
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="rounded-[8px] border border-[#c4c6cf] bg-[#f9f9ff] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                            Road
                          </p>
                          <h2 className="mt-2 text-[18px] font-semibold text-[#151c27]">
                            Damaged road near central market
                          </h2>
                          <div className="mt-2 flex items-center gap-2 text-[13px] text-[#74777f]">
                            <MapPin className="h-4 w-4" />
                            Main Market Area
                          </div>
                        </div>

                        <div className="rounded-full border border-[#60a5fa] bg-[#dbeafe] px-3 py-1 text-[11px] font-semibold text-[#1e40af]">
                          In Progress
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 divide-x divide-[#dce2f3] border-t border-[#dce2f3] pt-4">
                        <div className="pr-3">
                          <div className="text-[11px] uppercase tracking-[0.05em] text-[#74777f]">
                            Upvotes
                          </div>
                          <div className="mt-1 text-[18px] font-semibold text-[#151c27]">
                            24
                          </div>
                        </div>

                        <div className="px-3">
                          <div className="text-[11px] uppercase tracking-[0.05em] text-[#74777f]">
                            Priority
                          </div>
                          <div className="mt-1 text-[18px] font-semibold text-[#9a3412]">
                            High
                          </div>
                        </div>

                        <div className="pl-3">
                          <div className="text-[11px] uppercase tracking-[0.05em] text-[#74777f]">
                            Filed
                          </div>
                          <div className="mt-1 text-[18px] font-semibold text-[#151c27]">
                            2d ago
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[8px] border border-[#c4c6cf] bg-white p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                          My Complaints
                        </div>
                        <div className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-[#151c27]">
                          06
                        </div>
                        <div className="mt-1 text-[12px] text-[#74777f]">
                          Across your submissions
                        </div>
                      </div>

                      <div className="rounded-[8px] border border-[#c4c6cf] bg-white p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                          Resolved
                        </div>
                        <div className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-[#006e0c]">
                          04
                        </div>
                        <div className="mt-1 text-[12px] text-[#74777f]">
                          Successfully completed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="border-b border-[#dce2f3] bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-14 lg:py-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="border-l border-[#c4c6cf] pl-4"
                  >
                    <Icon
                      className="h-5 w-5 text-[#002147]"
                      strokeWidth={2}
                    />

                    <h3 className="mt-3 text-[16px] font-semibold text-[#151c27]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[13px] leading-[1.6] text-[#74777f]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="border-b border-[#dce2f3] bg-[#f9f9ff]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
            <div className="max-w-[680px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                Issue categories
              </p>

              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-[#151c27] sm:text-[32px]">
                Report the problems that affect your area
              </h2>

              <p className="mt-4 text-[15px] leading-[1.7] text-[#44474e]">
                CivicFix organizes common local problems into clear categories
                so citizens can submit the right information and officers can
                respond efficiently.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <div
                    key={category.title}
                    className="group rounded-[8px] border border-[#c4c6cf] bg-white p-5 transition-colors duration-150 hover:border-[#74777f]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#c4c6cf] bg-[#f0f3ff]">
                      <Icon
                        className="h-5 w-5 text-[#002147]"
                        strokeWidth={2}
                      />
                    </div>

                    <h3 className="mt-5 text-[16px] font-semibold text-[#151c27]">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-[13px] leading-[1.6] text-[#74777f]">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-b border-[#dce2f3] bg-white">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                  How it works
                </p>

                <h2 className="mt-3 max-w-[460px] text-[28px] font-semibold tracking-[-0.02em] text-[#151c27] sm:text-[32px]">
                  From a local problem to a visible resolution
                </h2>

                <p className="mt-4 max-w-[500px] text-[15px] leading-[1.7] text-[#44474e]">
                  Citizens report issues, the community can support important
                  complaints, and officers manage the resolution process from a
                  single workflow.
                </p>
              </div>

              <div className="space-y-0">
                <div className="flex gap-5 border-t border-[#dce2f3] py-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002147] text-[13px] font-semibold text-white">
                    01
                  </div>

                  <div>
                    <h3 className="text-[16px] font-semibold text-[#151c27]">
                      Report the issue
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#74777f]">
                      Add a title, category, description, and your area. A
                      duplicate check helps prevent repeated reports.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 border-t border-[#dce2f3] py-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#002147] text-[13px] font-semibold text-white">
                    02
                  </div>

                  <div>
                    <h3 className="text-[16px] font-semibold text-[#151c27]">
                      Track and support
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#74777f]">
                      Follow your complaint, browse public issues, and upvote
                      problems that affect your community.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 border-y border-[#dce2f3] py-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006e0c] text-[13px] font-semibold text-white">
                    03
                  </div>

                  <div>
                    <h3 className="text-[16px] font-semibold text-[#151c27]">
                      See the resolution
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#74777f]">
                      Officers update the status and add remarks. Once
                      resolved, citizens can provide feedback on the outcome.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CIVIC CTA */}
        <section className="bg-[#002147]">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[650px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-white/10">
                    <Users
                      className="h-5 w-5 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#aec7f6]">
                    Built for communities
                  </span>
                </div>

                <h2 className="mt-5 text-[30px] font-semibold tracking-[-0.02em] text-white sm:text-[36px]">
                  Help make local problems visible.
                </h2>

                <p className="mt-4 text-[15px] leading-[1.7] text-[#d6e3ff]">
                  Report an issue, support an existing complaint, and follow
                  the progress until the problem is resolved.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-[4px] bg-white px-7 text-[#002147] shadow-none hover:bg-[#f0f3ff] sm:w-auto"
                  >
                    Create an Account
                    <ArrowRight
                      className="ml-2 h-4 w-4"
                      strokeWidth={2}
                    />
                  </Button>
                </Link>

                <Link to="/complaints">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full rounded-[4px] border-white/30 bg-transparent px-7 text-white shadow-none hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    Browse Public Complaints
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#c4c6cf] bg-[#f9f9ff]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CivicMark />

            <div>
              <div className="text-[14px] font-semibold text-[#151c27]">
                CivicFix
              </div>
              <div className="mt-1 text-[11px] text-[#74777f]">
                Citizen Complaint Portal
              </div>
            </div>
          </div>

          <p className="text-[12px] text-[#74777f]">
            Report. Track. Resolve.
          </p>
        </div>
      </footer>
    </div>
  );
}