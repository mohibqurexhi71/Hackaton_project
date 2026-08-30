'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { CategoryBadge } from '@/components/common/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toaster';
import {
  Search,
  Filter,
  ArrowUpDown,
  ThumbsUp,
  MapPin,
  Calendar,
  User,
  FilePlus,
  ArrowRight,
  AlertCircle,
  X,
  Check,
  Building2,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Road', value: 'road' },
  { label: 'Garbage', value: 'garbage' },
  { label: 'Water', value: 'water' },
  { label: 'Electricity', value: 'electricity' },
  { label: 'Other', value: 'other' },
];

const STATUSES = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
];

export default function ComplaintsFeedPage() {
  const { user, isAuthenticated, isCitizen } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [area, setArea] = useState('');
  const [sort, setSort] = useState('recent'); // 'recent' | 'upvotes'

  // Upvote in-flight tracking
  const [upvotingIds, setUpvotingIds] = useState(new Set());

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (status) params.status = status;
      if (area.trim()) params.area = area.trim();
      if (sort) params.sort = sort;

      const res = await complaintApi.getAll(params);
      setComplaints(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load complaints feed');
    } finally {
      setLoading(false);
    }
  }, [search, category, status, area, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchComplaints]);

  const handleUpvote = async (complaintId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in as a citizen to upvote complaints.');
      return;
    }

    if (!isCitizen) {
      toast.error('Only citizens can upvote community complaints.');
      return;
    }

    setUpvotingIds((prev) => new Set(prev).add(complaintId));

    try {
      const res = await complaintApi.upvote(complaintId);
      const updated = res.data;

      // Update in state
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? updated : c))
      );
      toast.success('Upvote registered! Urgency updated.');
    } catch (err) {
      toast.error(err.message || 'Failed to upvote complaint');
    } finally {
      setUpvotingIds((prev) => {
        const next = new Set(prev);
        next.delete(complaintId);
        return next;
      });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setArea('');
    setSort('recent');
  };

  const hasActiveFilters = search || category || status || area || sort !== 'recent';

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Community Complaint Feed
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore public civic issues reported across neighborhoods. Upvote critical issues to boost municipal priority.
            </p>
          </div>

          {isAuthenticated && isCitizen && (
            <Link to="/complaints/new">
              <Button className="bg-[#000a1e] hover:bg-[#151c27] text-white border border-[#000a1e] gap-2 shadow-sm shrink-0">
                <FilePlus className="h-4 w-4" />
                Report Issue
              </Button>
            </Link>
          )}
        </div>

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card/70 p-4 sm:p-6 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Bar */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by issue title, description, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-background/80"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Area Filter */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Filter by neighborhood/area..."
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="pl-10 h-10 bg-background/80"
              />
              {area && (
                <button
                  onClick={() => setArea('')}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground mr-1">Category:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors border ${
                    category === cat.value
                      ? 'bg-[#000a1e] text-white border-[#000a1e] shadow-sm'
                      : 'bg-white text-[#151c27] border-[#c4c6cf] hover:bg-[#f0f3ff] hover:border-[#74777f]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Status & Sort options */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="recent">Newest First</option>
                  <option value="upvotes">Most Upvoted</option>
                </select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs text-muted-foreground hover:text-red-400 gap-1 px-2"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FEED COMPLAINTS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing <strong className="text-foreground">{complaints.length}</strong> complaints
            </span>
            {hasActiveFilters && <span className="text-emerald-400">Filtered View</span>}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 border-border/60">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <Card className="border-dashed border-border/80 bg-card/40 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <Filter className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">No complaints match your criteria</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Try adjusting your search keywords, category, area, or status filters.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
                {isAuthenticated && isCitizen && (
                  <Link to="/complaints/new">
                    <Button className="bg-[#000a1e] hover:bg-[#151c27] text-white border border-[#000a1e]">
                      Report This Issue
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => {
                const userIdStr = user?.id || user?._id;
                const hasUserUpvoted =
                  userIdStr &&
                  complaint.upvotedBy &&
                  complaint.upvotedBy.some(
                    (uid) => (typeof uid === 'object' ? uid._id || uid : uid).toString() === userIdStr.toString()
                  );
                const isUpvoting = upvotingIds.has(complaint._id);

                return (
                  <Card
                    key={complaint._id}
                    className="border-border/60 bg-card/60 hover:border-emerald-500/40 transition-all p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Info */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryBadge category={complaint.category} />
                          <StatusBadge status={complaint.status} />
                          <PriorityBadge
                            priority={complaint.priority}
                            score={complaint.priorityScore}
                            showScore={true}
                          />
                        </div>

                        <Link to={`/complaints/${complaint._id}`}
                          className="text-lg font-bold hover:text-emerald-400 transition-colors block leading-snug"
                        >
                          {complaint.title}
                        </Link>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {complaint.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                            {complaint.area}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            Reported by {complaint.createdBy?.name || 'Citizen'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        {/* Upvote Button */}
                        <Button
                          variant={hasUserUpvoted ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleUpvote(complaint._id)}
                          disabled={isUpvoting || hasUserUpvoted}
                          className={`gap-1.5 h-9 px-3.5 ${
                            hasUserUpvoted
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                              : 'border-border hover:border-emerald-500/50 hover:text-emerald-400'
                          }`}
                        >
                          {hasUserUpvoted ? (
                            <>
                              <Check className="h-4 w-4 text-emerald-400" />
                              <span>Upvoted ({complaint.upvotes || 0})</span>
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="h-4 w-4 text-emerald-400" />
                              <span>Upvote ({complaint.upvotes || 0})</span>
                            </>
                          )}
                        </Button>

                        <Link to={`/complaints/${complaint._id}`}>
                          <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            View Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Officer Remark snippet if resolved/in-progress */}
                    {complaint.officerRemark && (
                      <div className="mt-3 pt-3 border-t border-border/40 text-xs bg-muted/20 p-2.5 rounded-lg flex items-start gap-2">
                        <span className="font-semibold text-sky-400 shrink-0">Officer Remark:</span>
                        <span className="text-muted-foreground">{complaint.officerRemark}</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
