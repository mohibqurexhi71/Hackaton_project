'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi, aiApi } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { CategoryBadge } from '@/components/common/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toaster';
import {
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  Flame,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Star,
  Edit3,
  Loader2,
  AlertCircle,
  BarChart3,
  Bot,
  Layers,
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

export default function OfficerDashboardPage() {
  const { user } = useAuth();

  // Statistics state
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Gemini AI briefing state
  const [aiBriefing, setAiBriefing] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Complaints list & filters state
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [area, setArea] = useState('');

  // Review & Update Dialog state (Screen 10)
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('in-progress');
  const [officerRemark, setOfficerRemark] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Fetch stats from GET /api/complaints/stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await complaintApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Stats error:', err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch complaints from GET /api/complaints
  const fetchComplaints = useCallback(async () => {
    setLoadingComplaints(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (status) params.status = status;
      if (area.trim()) params.area = area.trim();

      const res = await complaintApi.getAll(params);
      setComplaints(res.data || []);
    } catch (err) {
      console.error('Complaints fetch error:', err.message);
    } finally {
      setLoadingComplaints(false);
    }
  }, [search, category, status, area]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchComplaints]);

  // Generate AI briefing from POST /api/ai/officer-summary
  const generateAiBriefing = async () => {
    setGeneratingAi(true);
    setAiError('');
    try {
      const res = await aiApi.getOfficerSummary();
      setAiBriefing(res.data?.summary || '');
      toast.success('Gemini AI operational briefing generated!');
    } catch (err) {
      setAiError(err.message || 'Failed to generate AI briefing');
      toast.error(err.message || 'AI generation failed');
    } finally {
      setGeneratingAi(false);
    }
  };

  // Open Review Dialog (Screen 10)
  const openReviewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status || 'in-progress');
    setOfficerRemark(complaint.officerRemark || '');
  };

  // Handle status update submission PATCH /api/complaints/:id/status
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmittingStatus(true);
    try {
      const res = await complaintApi.updateStatus(selectedComplaint._id, {
        status: updateStatus,
        remark: officerRemark.trim(),
      });

      const updated = res.data;
      toast.success(`Complaint status updated to "${updateStatus}"`);

      // Update in table state
      setComplaints((prev) =>
        prev.map((c) => (c._id === selectedComplaint._id ? updated : c))
      );

      // Refresh overall stats
      fetchStats();
      setSelectedComplaint(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update complaint status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  return (
    <ProtectedRoute officerOnly={true}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* TOP HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <ShieldAlert className="h-4 w-4" />
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Officer Command Dashboard
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Municipal Operations Management • Logged in as <strong className="text-foreground">{user?.name}</strong>
              </p>
            </div>

            <Button
              onClick={generateAiBriefing}
              disabled={generatingAi}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white gap-2 font-semibold shadow-lg shadow-purple-900/20 shrink-0"
            >
              {generatingAi ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating AI Briefing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Briefing
                </>
              )}
            </Button>
          </div>

          {/* AI BRIEFING SHOWCASE CARD */}
          {(aiBriefing || generatingAi || aiError) && (
            <Card className="border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-background to-indigo-950/20 shadow-xl backdrop-blur-xl p-6 relative overflow-hidden animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                    <Bot className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                      Gemini AI Daily Operations Briefing
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        Operational Summary
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Synthesized from real-time complaint distribution and severity patterns
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAiBriefing}
                  disabled={generatingAi}
                  className="text-xs gap-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                >
                  <RefreshCw className={`h-3 w-3 ${generatingAi ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-500/20">
                {generatingAi ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-purple-500/10" />
                    <Skeleton className="h-4 w-5/6 bg-purple-500/10" />
                    <Skeleton className="h-4 w-4/6 bg-purple-500/10" />
                  </div>
                ) : aiError ? (
                  <div className="text-xs text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                ) : (
                  <p className="text-sm text-purple-100 leading-relaxed font-medium">
                    &ldquo;{aiBriefing}&rdquo;
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* OPERATIONAL METRICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Total */}
            <Card className="border-border/60 bg-card/60 p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total Complaints
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-foreground">
                {loadingStats ? <Skeleton className="h-8 w-12" /> : stats?.total ?? 0}
              </h3>
            </Card>

            {/* Pending */}
            <Card className="border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Pending Action
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-amber-400">
                {loadingStats ? <Skeleton className="h-8 w-12" /> : stats?.pending ?? 0}
              </h3>
            </Card>

            {/* In Progress */}
            <Card className="border-sky-500/30 bg-sky-500/5 p-4">
              <p className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                In Progress
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-sky-400">
                {loadingStats ? <Skeleton className="h-8 w-12" /> : stats?.inProgress ?? 0}
              </h3>
            </Card>

            {/* Resolved */}
            <Card className="border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Resolved
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-400">
                {loadingStats ? <Skeleton className="h-8 w-12" /> : stats?.resolved ?? 0}
              </h3>
            </Card>

            {/* Critical Severity */}
            <Card className="border-rose-500/30 bg-rose-500/5 p-4">
              <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-rose-500" />
                Critical Priority
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-rose-400">
                {loadingStats ? <Skeleton className="h-8 w-12" /> : stats?.critical ?? 0}
              </h3>
            </Card>

            {/* Feedback Satisfaction */}
            <Card className="border-border/60 bg-card/60 p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                Citizen Rating
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-amber-400">
                {loadingStats ? <Skeleton className="h-8 w-12" /> : `${stats?.averageFeedbackRating ?? 0} ★`}
              </h3>
            </Card>
          </div>

          {/* COMPLAINTS MANAGEMENT TABLE */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Complaints Queue & Dispatch</h2>
                <p className="text-xs text-muted-foreground">
                  Review submitted citizen issues, inspect priorities, and update operational statuses with remarks.
                </p>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-9 text-xs w-44"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 rounded-md border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 rounded-md border border-border bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TABLE */}
            <Card className="border-border/80 bg-card/70 shadow-lg overflow-hidden backdrop-blur-xl">
              {loadingComplaints ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : complaints.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Layers className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="font-semibold text-sm">No complaints found</p>
                  <p className="text-xs">No records match the current filter selection.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase border-b border-border/60">
                      <tr>
                        <th className="px-4 py-3">Complaint Details</th>
                        <th className="px-4 py-3">Area / Category</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Upvotes</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {complaints.map((c) => (
                        <tr
                          key={c._id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          {/* Title & snippet */}
                          <td className="px-4 py-3.5 max-w-xs">
                            <Link
                              href={`/complaints/${c._id}`}
                              className="font-bold text-foreground hover:text-sky-400 block truncate"
                            >
                              {c.title}
                            </Link>
                            <p className="text-xs text-muted-foreground truncate max-w-sm mt-0.5">
                              {c.description}
                            </p>
                          </td>

                          {/* Area & Category */}
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-xs flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                {c.area}
                              </span>
                              <CategoryBadge category={c.category} />
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={c.status} />
                          </td>

                          {/* Priority */}
                          <td className="px-4 py-3.5">
                            <PriorityBadge priority={c.priority} score={c.priorityScore} showScore={true} />
                          </td>

                          {/* Upvotes */}
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-xs flex items-center gap-1 text-emerald-400">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {c.upvotes || 0}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3.5 text-right">
                            <Button
                              size="sm"
                              onClick={() => openReviewModal(c)}
                              className="h-8 bg-sky-600 hover:bg-sky-700 text-white gap-1.5 text-xs"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* SCREEN 10: OFFICER STATUS UPDATE & REVIEW DIALOG */}
          <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
            <DialogContent className="bg-card border-border sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sky-400">
                  <ShieldAlert className="h-5 w-5" />
                  Review Complaint & Update Status
                </DialogTitle>
                <DialogDescription>
                  Update lifecycle progression and attach official resolution notes for the citizen.
                </DialogDescription>
              </DialogHeader>

              {selectedComplaint && (
                <form onSubmit={handleStatusSubmit} className="space-y-4 py-2">
                  {/* Complaint Snapshot */}
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={selectedComplaint.category} />
                      <PriorityBadge priority={selectedComplaint.priority} score={selectedComplaint.priorityScore} showScore={true} />
                      <span className="text-muted-foreground">• {selectedComplaint.upvotes || 0} upvotes</span>
                    </div>
                    <div className="font-bold text-sm text-foreground">{selectedComplaint.title}</div>
                    <p className="text-muted-foreground">{selectedComplaint.description}</p>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/40">
                      <span>Location: <strong>{selectedComplaint.area}</strong></span>
                      <span>• Author: <strong>{selectedComplaint.createdBy?.name || 'Citizen'}</strong></span>
                    </div>
                  </div>

                  {/* Status Picker */}
                  <div className="space-y-1.5">
                    <Label htmlFor="statusSelect">Lifecycle Status</Label>
                    <select
                      id="statusSelect"
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="pending">Pending (Awaiting Inspection)</option>
                      <option value="in-progress">In Progress (Field Team Dispatched)</option>
                      <option value="resolved">Resolved (Work Completed & Verified)</option>
                    </select>
                  </div>

                  {/* Officer Remark */}
                  <div className="space-y-1.5">
                    <Label htmlFor="remark">Official Officer Remark</Label>
                    <Textarea
                      id="remark"
                      placeholder="e.g. Municipal asphalt team deployed on site. Heavy bitumen roller leveling the crater..."
                      value={officerRemark}
                      onChange={(e) => setOfficerRemark(e.target.value)}
                      rows={3}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      This remark is visible to the reporting citizen and the public feed.
                    </p>
                  </div>

                  <DialogFooter className="pt-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedComplaint(null)}
                      disabled={submittingStatus}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-sky-600 hover:bg-sky-700 text-white font-semibold"
                      disabled={submittingStatus}
                    >
                      {submittingStatus ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Save & Dispatch'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ProtectedRoute>
  );
}
