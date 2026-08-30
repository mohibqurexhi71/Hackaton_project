'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { CategoryBadge } from '@/components/common/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
  ListFilter,
  MapPin,
  RefreshCw,
  ThumbsUp,
} from 'lucide-react';

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  valueClassName = 'text-[#151c27]',
  loading,
}) {
  return (
    <Card className="h-full rounded-[8px] border-[#c4c6cf] bg-white shadow-none">
      <CardContent className="flex h-full items-center justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#74777f]">
            {label}
          </p>

          {loading ? (
            <Skeleton className="mt-2 h-8 w-12 bg-[#e7eefe]" />
          ) : (
            <p
              className={`mt-1 text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[28px] ${valueClassName}`}
            >
              {value}
            </p>
          )}

          <p className="mt-1 text-[12px] leading-[1.45] text-[#74777f]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] sm:h-11 sm:w-11 ${iconClassName}`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-[18px] font-semibold leading-[1.35] tracking-[-0.01em] text-[#151c27] sm:text-[19px]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-[680px] text-[12px] leading-[1.55] text-[#74777f]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  primary = false,
}) {
  return (
    <Link
      to={to}
      className="group block h-full rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000a1e] focus-visible:ring-offset-2"
    >
      <Card
        className={
          primary
            ? 'h-full rounded-[8px] border-[#000a1e] bg-[#002147] shadow-none transition-colors duration-150 hover:bg-[#000a1e]'
            : 'h-full rounded-[8px] border-[#c4c6cf] bg-white shadow-none transition-colors duration-150 hover:border-[#74777f]'
        }
      >
        <CardContent className="flex h-full min-h-[156px] flex-col p-5 sm:min-h-[166px]">
          <div
            className={
              primary
                ? 'flex h-10 w-10 items-center justify-center rounded-[4px] bg-white/10 text-white'
                : 'flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#c4c6cf] bg-[#f0f3ff] text-[#002147]'
            }
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>

          <div className="mt-4">
            <h3
              className={
                primary
                  ? 'text-[15px] font-semibold leading-[1.4] text-white'
                  : 'text-[15px] font-semibold leading-[1.4] text-[#151c27]'
              }
            >
              {title}
            </h3>

            <p
              className={
                primary
                  ? 'mt-1.5 max-w-[320px] text-[12px] leading-[1.55] text-[#d6e3ff]'
                  : 'mt-1.5 max-w-[320px] text-[12px] leading-[1.55] text-[#74777f]'
              }
            >
              {description}
            </p>
          </div>

          <div
            className={
              primary
                ? 'mt-auto pt-4 text-[12px] font-medium text-white'
                : 'mt-auto pt-4 text-[12px] font-medium text-[#002147]'
            }
          >
            <span className="inline-flex items-center gap-1">
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CitizenDashboardPage() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await complaintApi.getMine();
      setComplaints(res.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load your complaints.');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = complaints.length;

    const pending = complaints.filter(
      (complaint) => complaint.status === 'pending'
    ).length;

    const inProgress = complaints.filter(
      (complaint) => complaint.status === 'in-progress'
    ).length;

    const resolved = complaints.filter(
      (complaint) => complaint.status === 'resolved'
    ).length;

    return {
      total,
      pending,
      inProgress,
      resolved,
    };
  }, [complaints]);

  const recentComplaints = complaints.slice(0, 4);

  const firstName = user?.name?.split(' ')[0] || 'Citizen';

  return (
    <div className="min-h-full overflow-x-hidden bg-[#f9f9ff]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6 sm:px-6 sm:py-8 lg:py-9">
        {/* PAGE HEADER */}
        <section className="border-b border-[#dce2f3] pb-6 sm:pb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-[680px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
                Citizen Dashboard
              </p>

              <h1 className="mt-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#151c27] sm:text-[30px]">
                Welcome back, {firstName}
              </h1>

              <p className="mt-2 max-w-[650px] text-[13px] leading-[1.65] text-[#74777f] sm:text-[14px]">
                Track your reported civic issues, see their current status,
                and stay informed about progress in your community.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link to="/complaints/new" className="w-full sm:w-auto">
                <Button className="h-10 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#002147] sm:w-auto">
                  <FilePlus2 className="mr-2 h-4 w-4" strokeWidth={2} />
                  Report a Complaint
                </Button>
              </Link>

              <Link to="/complaints" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-[4px] border-[#c4c6cf] bg-white px-4 text-[13px] font-medium text-[#151c27] shadow-none hover:bg-[#f0f3ff] sm:w-auto"
                >
                  <ListFilter className="mr-2 h-4 w-4" strokeWidth={2} />
                  Browse Complaints
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#ba1a1a] bg-[#ffdad6] p-4"
          >
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-[#ba1a1a]"
              strokeWidth={2}
            />

            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#93000a]">
                Unable to load complaints
              </p>

              <p className="mt-1 text-[12px] leading-[1.5] text-[#93000a]">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* STATS */}
        <section className="mt-7 sm:mt-8">
          <SectionHeading
            eyebrow="Complaint overview"
            title="Your current activity"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="My Complaints"
              value={stats.total}
              description="Total submissions"
              icon={FileText}
              iconClassName="bg-[#f0f3ff] text-[#002147]"
              loading={loading}
            />

            <StatCard
              label="Pending Review"
              value={stats.pending}
              description="Awaiting action"
              icon={Clock3}
              iconClassName="bg-[#fef3c7] text-[#92400e]"
              valueClassName="text-[#92400e]"
              loading={loading}
            />

            <StatCard
              label="In Progress"
              value={stats.inProgress}
              description="Currently being handled"
              icon={RefreshCw}
              iconClassName="bg-[#dbeafe] text-[#1e40af]"
              valueClassName="text-[#1e40af]"
              loading={loading}
            />

            <StatCard
              label="Resolved"
              value={stats.resolved}
              description="Successfully completed"
              icon={CheckCircle2}
              iconClassName="bg-[#e8f8e6] text-[#006e0c]"
              valueClassName="text-[#006e0c]"
              loading={loading}
            />
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8 sm:mt-9">
          <SectionHeading
            eyebrow="Quick actions"
            title="What would you like to do?"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <QuickAction
              to="/complaints/new"
              icon={FilePlus2}
              title="Report a Complaint"
              description="Submit a road, garbage, water, electricity, or other civic issue."
              primary
            />

            <QuickAction
              to="/complaints/mine"
              icon={FileText}
              title="View My Complaints"
              description="Review your submissions and follow their current progress."
            />

            <QuickAction
              to="/complaints"
              icon={ListFilter}
              title="Browse Complaints"
              description="Explore public issues and support complaints affecting your area."
            />
          </div>
        </section>

        {/* RECENT COMPLAINTS */}
        <section className="mt-8 sm:mt-9">
          <SectionHeading
            eyebrow="Recent activity"
            title="Your recent complaints"
            description="Monitor status, priority, and official remarks."
            action={
              complaints.length > 0 ? (
                <Link to="/complaints/mine">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit rounded-[4px] px-2 text-[12px] font-medium text-[#002147] shadow-none hover:bg-[#f0f3ff]"
                  >
                    View all {complaints.length}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : null
            }
          />

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  className="rounded-[8px] border-[#c4c6cf] bg-white shadow-none"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20 bg-[#e7eefe]" />
                        <Skeleton className="h-6 w-24 bg-[#e7eefe]" />
                      </div>

                      <Skeleton className="h-5 w-[82%] bg-[#e7eefe]" />
                      <Skeleton className="h-4 w-[55%] bg-[#e7eefe]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <Card className="rounded-[8px] border-dashed border-[#c4c6cf] bg-white shadow-none">
              <CardContent className="flex flex-col items-center px-5 py-12 text-center sm:py-14">
                <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#c4c6cf] bg-[#f0f3ff] text-[#002147]">
                  <FilePlus2 className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <h3 className="mt-4 text-[17px] font-semibold text-[#151c27]">
                  No complaints reported yet
                </h3>

                <p className="mt-2 max-w-[500px] text-[12px] leading-[1.65] text-[#74777f]">
                  You have not filed a civic complaint yet. Report an issue in
                  your area or browse existing complaints from your community.
                </p>

                <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Link to="/complaints/new" className="w-full sm:w-auto">
                    <Button className="h-10 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-5 text-[13px] text-white shadow-none hover:bg-[#002147] sm:w-auto">
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Report Your First Issue
                    </Button>
                  </Link>

                  <Link to="/complaints" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="h-10 w-full rounded-[4px] border-[#c4c6cf] bg-white px-5 text-[13px] text-[#151c27] shadow-none hover:bg-[#f0f3ff] sm:w-auto"
                    >
                      Browse Public Complaints
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <Card
                  key={complaint._id}
                  className="rounded-[8px] border-[#c4c6cf] bg-white shadow-none transition-colors duration-150 hover:border-[#74777f]"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryBadge category={complaint.category} />
                          <StatusBadge status={complaint.status} />
                          <PriorityBadge
                            priority={complaint.priority}
                            score={complaint.priorityScore}
                          />
                        </div>

                        <Link
                          to={`/complaints/${complaint._id}`}
                          className="mt-3 block line-clamp-2 text-[15px] font-semibold leading-[1.45] tracking-[-0.005em] text-[#151c27] transition-colors duration-150 hover:text-[#002147]"
                        >
                          {complaint.title}
                        </Link>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#74777f] sm:text-[12px]">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {complaint.area || 'Area not specified'}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            {complaint.createdAt
                              ? new Date(
                                  complaint.createdAt
                                ).toLocaleDateString()
                              : 'Date unavailable'}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <ThumbsUp className="h-3.5 w-3.5 shrink-0 text-[#006e0c]" />
                            {complaint.upvotes || 0} upvotes
                          </span>
                        </div>
                      </div>

                      <div className="w-full shrink-0 xl:w-auto">
                        <Link to={`/complaints/${complaint._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 w-full rounded-[4px] border-[#c4c6cf] bg-white px-3 text-[12px] text-[#151c27] shadow-none hover:bg-[#f0f3ff] xl:w-auto"
                          >
                            View Details
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {complaint.officerRemark && (
                      <div className="mt-4 border-t border-[#e2e8f8] pt-4">
                        <div className="rounded-[4px] border border-[#c4c6cf] bg-[#f9f9ff] p-3">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-2">
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#002147]">
                              Officer Remark
                            </span>

                            <span className="text-[12px] leading-[1.55] text-[#44474e]">
                              {complaint.officerRemark}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* INFORMATION STRIP */}
        <section className="mt-8 rounded-[8px] border border-[#c4c6cf] bg-[#f0f3ff] px-4 py-4 sm:mt-9 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#002147] text-white">
                <RefreshCw className="h-4 w-4" strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <p className="text-[12px] font-semibold leading-[1.4] text-[#151c27] sm:text-[13px]">
                  Complaint status is updated by authorized officers
                </p>

                <p className="mt-1 text-[11px] leading-[1.55] text-[#74777f] sm:text-[12px]">
                  Check your complaint details regularly for the latest status
                  and official remarks.
                </p>
              </div>
            </div>

            <Link to="/complaints/mine">
              <Button
                variant="ghost"
                size="sm"
                className="w-fit rounded-[4px] px-2 text-[12px] font-medium text-[#002147] shadow-none hover:bg-white"
              >
                My Complaints
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}