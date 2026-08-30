'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { CategoryBadge } from '@/components/common/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FilePlus,
  FileText,
  ListFilter,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

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
      setError(err.message || 'Failed to load your complaints');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from user's complaints
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const inProgress = complaints.filter((c) => c.status === 'in-progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-emerald-400">{user?.name || 'Citizen'}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your submitted civic issues and community progress across your neighborhood.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/complaints/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm">
              <FilePlus className="h-4 w-4" />
              Report Issue
            </Button>
          </Link>
          <Link href="/complaints">
            <Button variant="outline" className="gap-2 border-border">
              <ListFilter className="h-4 w-4 text-emerald-400" />
              Browse Feed
            </Button>
          </Link>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                My Complaints
              </p>
              <h3 className="text-3xl font-bold mt-1 text-foreground">
                {loading ? <Skeleton className="h-8 w-12" /> : total}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pending Review
              </p>
              <h3 className="text-3xl font-bold mt-1 text-amber-400">
                {loading ? <Skeleton className="h-8 w-12" /> : pending}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                In Progress
              </p>
              <h3 className="text-3xl font-bold mt-1 text-sky-400">
                {loading ? <Skeleton className="h-8 w-12" /> : inProgress}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <RefreshCw className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Resolved
              </p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-400">
                {loading ? <Skeleton className="h-8 w-12" /> : resolved}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT COMPLAINTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Recent Complaints Submitted by You</h2>
            <p className="text-xs text-muted-foreground">Track lifecycle status and officer remarks</p>
          </div>
          {complaints.length > 0 && (
            <Link href="/complaints/mine">
              <Button variant="ghost" size="sm" className="gap-1 text-emerald-400 hover:text-emerald-300">
                View All ({complaints.length})
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5 border-border/60">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <Card className="border-dashed border-border/80 bg-card/40 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
              <FilePlus className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold">No complaints reported yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              You haven&apos;t filed any civic complaints yet. Notice a pothole, uncollected garbage, or water issue? Report it now.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/complaints/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <FilePlus className="h-4 w-4" />
                  Report Your First Issue
                </Button>
              </Link>
              <Link href="/complaints">
                <Button variant="outline">Browse Public Feed</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 4).map((complaint) => (
              <Card
                key={complaint._id}
                className="border-border/60 bg-card/60 hover:border-emerald-500/40 transition-all p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={complaint.category} />
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} score={complaint.priorityScore} />
                    </div>
                    <Link
                      href={`/complaints/${complaint._id}`}
                      className="text-base font-bold hover:text-emerald-400 transition-colors block truncate"
                    >
                      {complaint.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {complaint.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                        {complaint.upvotes || 0} upvotes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <Link href={`/complaints/${complaint._id}`}>
                      <Button variant="outline" size="sm" className="gap-1 border-border">
                        Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {complaint.officerRemark && (
                  <div className="mt-3 pt-3 border-t border-border/40 text-xs bg-muted/30 p-2.5 rounded-lg flex items-start gap-2">
                    <span className="font-semibold text-sky-400 shrink-0">Officer Remark:</span>
                    <span className="text-muted-foreground">{complaint.officerRemark}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
