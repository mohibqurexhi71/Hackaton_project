'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  FileText,
  FilePlus,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Star,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback modal state
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const openFeedbackDialog = (complaint) => {
    setFeedbackComplaint(complaint);
    setRating(5);
    setComment('');
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackComplaint) return;

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const res = await complaintApi.submitFeedback(feedbackComplaint._id, {
        rating,
        comment: comment.trim(),
      });

      toast.success('Thank you! Your feedback has been submitted.');

      // Update complaint in state
      setComplaints((prev) =>
        prev.map((c) => (c._id === feedbackComplaint._id ? res.data : c))
      );
      setFeedbackComplaint(null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <ProtectedRoute citizenOnly={true}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                My Submitted Complaints
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track status updates, review officer remarks, and submit feedback on resolved issues.
              </p>
            </div>

            <Link to="/complaints/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm shrink-0">
                <FilePlus className="h-4 w-4" />
                Report New Issue
              </Button>
            </Link>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* COMPLAINTS LIST */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 border-border/60">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : complaints.length === 0 ? (
            <Card className="border-dashed border-border/80 bg-card/40 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">You haven&apos;t filed any complaints yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Whenever you notice civic issues like potholes, garbage, or water leaks, submit them here to get official municipal attention.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/complaints/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <FilePlus className="h-4 w-4" />
                    Report Issue
                  </Button>
                </Link>
                <Link to="/complaints">
                  <Button variant="outline">Browse Public Feed</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card
                  key={complaint._id}
                  className="border-border/60 bg-card/70 hover:border-emerald-500/40 transition-all p-5 sm:p-6 shadow-md"
                >
                  <div className="space-y-3">
                    {/* Badges and date */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CategoryBadge category={complaint.category} />
                        <StatusBadge status={complaint.status} />
                        <PriorityBadge priority={complaint.priority} score={complaint.priorityScore} showScore={true} />
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/complaints/${complaint._id}`}
                      className="text-lg font-bold hover:text-emerald-400 transition-colors block"
                    >
                      {complaint.title}
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {complaint.description}
                    </p>

                    {/* Location & Upvotes info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        {complaint.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                        {complaint.upvotes || 0} community upvotes
                      </span>
                    </div>

                    {/* OFFICER REMARK */}
                    {complaint.officerRemark && (
                      <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1">
                        <div className="font-semibold text-sky-400 flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Official Officer Remark:
                        </div>
                        <p className="text-muted-foreground pl-5">{complaint.officerRemark}</p>
                      </div>
                    )}

                    {/* RESOLVED & FEEDBACK ACTIONS */}
                    {complaint.status === 'resolved' && (
                      <div className="mt-4 pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-500/5 -mx-5 -mb-5 p-4 rounded-b-xl">
                        {complaint.feedbackGiven ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-emerald-400">Your Rating:</span>
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < complaint.feedbackRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            {complaint.feedbackComment && (
                              <span className="text-muted-foreground italic truncate max-w-xs">
                                &quot;{complaint.feedbackComment}&quot;
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                            <div className="text-xs text-emerald-300">
                              <span className="font-bold">Issue Resolved!</span> How was your experience with municipal resolution?
                            </div>
                            <Button
                              size="sm"
                              onClick={() => openFeedbackDialog(complaint)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs shrink-0"
                            >
                              <Star className="h-3.5 w-3.5" />
                              Give Feedback
                            </Button>
                          </div>
                        )}

                        <Link to={`/complaints/${complaint._id}`} className="shrink-0 self-end sm:self-auto">
                          <Button variant="ghost" size="sm" className="text-xs gap-1">
                            Details
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* FEEDBACK DIALOG */}
          <Dialog open={!!feedbackComplaint} onOpenChange={(open) => !open && setFeedbackComplaint(null)}>
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Rate Resolution Quality
                </DialogTitle>
                <DialogDescription>
                  Your feedback helps municipal teams evaluate resolution efficiency and service standards.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4 py-2">
                <div className="p-3 rounded-lg bg-muted/40 text-xs">
                  <div className="font-semibold text-foreground truncate">{feedbackComplaint?.title}</div>
                  <div className="text-muted-foreground mt-0.5">{feedbackComplaint?.area}</div>
                </div>

                <div className="space-y-2">
                  <Label>Service Rating (1–5 Stars)</Label>
                  <div className="flex items-center gap-2 justify-center py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-xs font-semibold text-amber-400">
                    {rating === 5 && 'Excellent Resolution'}
                    {rating === 4 && 'Good Work'}
                    {rating === 3 && 'Average'}
                    {rating === 2 && 'Below Expectation'}
                    {rating === 1 && 'Poor Resolution'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="comment">Feedback Remarks (Optional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share any comments about the road crew speed, clean-up quality, or remarks..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <DialogFooter className="pt-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFeedbackComplaint(null)}
                    disabled={submittingFeedback}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold"
                    disabled={submittingFeedback}
                  >
                    {submittingFeedback ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ProtectedRoute>
  );
}
