'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { Button } from '@/components/ui/button';
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
  MapPin,
  Calendar,
  ThumbsUp,
  User,
  ArrowLeft,
  MessageSquare,
  Star,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Loader2,
} from 'lucide-react';

export default function ComplaintDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCitizen } = useAuth();
  const id = params?.id;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upvoting, setUpvoting] = useState(false);

  // Feedback dialog state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchComplaint = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await complaintApi.getById(id);
      setComplaint(res.data);
    } catch (err) {
      setError(err.message || 'Complaint not found or invalid ID format');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in as a citizen to upvote complaints.');
      return;
    }
    if (!isCitizen) {
      toast.error('Only citizens can upvote community complaints.');
      return;
    }

    setUpvoting(true);
    try {
      const res = await complaintApi.upvote(id);
      setComplaint(res.data);
      toast.success('Upvote registered! Priority urgency updated.');
    } catch (err) {
      toast.error(err.message || 'Failed to upvote complaint');
    } finally {
      setUpvoting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const res = await complaintApi.submitFeedback(id, {
        rating,
        comment: comment.trim(),
      });
      setComplaint(res.data);
      toast.success('Thank you! Your feedback has been recorded.');
      setFeedbackOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const userIdStr = user?.id || user?._id;
  const isAuthor =
    userIdStr &&
    complaint?.createdBy &&
    (typeof complaint.createdBy === 'object'
      ? complaint.createdBy._id || complaint.createdBy.id
      : complaint.createdBy
    )?.toString() === userIdStr.toString();

  const hasUpvoted =
    userIdStr &&
    complaint?.upvotedBy &&
    complaint.upvotedBy.some(
      (uid) => (typeof uid === 'object' ? uid._id || uid : uid)?.toString() === userIdStr.toString()
    );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* BACK BUTTON */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to previous page
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <Card className="p-8 border-border/60 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </Card>
        ) : error || !complaint ? (
          <Card className="border-dashed border-red-500/40 bg-red-500/5 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold">Complaint Not Found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              {error || 'The complaint ID you requested does not exist or has been removed.'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/complaints">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Browse All Complaints
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* MAIN COMPLAINT CARD */}
            <Card className="border-border/80 bg-card/80 shadow-xl backdrop-blur-xl p-6 sm:p-8 space-y-6">
              {/* Badges & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={complaint.category} />
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge
                    priority={complaint.priority}
                    score={complaint.priorityScore}
                    showScore={true}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={hasUpvoted ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={handleUpvote}
                    disabled={upvoting || hasUpvoted}
                    className={`gap-1.5 ${
                      hasUpvoted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                        : 'border-border hover:border-emerald-500/50 hover:text-emerald-400'
                    }`}
                  >
                    {hasUpvoted ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Upvoted ({complaint.upvotes || 0})
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4 text-emerald-400" />
                        Upvote ({complaint.upvotes || 0})
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {complaint.title}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Area / Location</div>
                    <div className="font-semibold text-foreground">{complaint.area}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Reported Date</div>
                    <div className="font-semibold text-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Reported By</div>
                    <div className="font-semibold text-foreground">
                      {complaint.createdBy?.name || 'Citizen'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* OFFICER REMARK SECTION */}
            {complaint.officerRemark && (
              <Card className="border-sky-500/40 bg-sky-950/10 p-6 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Official Municipal Officer Remark
                </div>
                <p className="text-sm text-sky-200 leading-relaxed pl-6">
                  {complaint.officerRemark}
                </p>
                {complaint.resolvedAt && (
                  <div className="text-xs text-muted-foreground pl-6 pt-1">
                    Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()} at{' '}
                    {new Date(complaint.resolvedAt).toLocaleTimeString()}
                  </div>
                )}
              </Card>
            )}

            {/* CITIZEN FEEDBACK SECTION */}
            {complaint.status === 'resolved' && (
              <Card className="border-emerald-500/40 bg-emerald-950/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="h-5 w-5" />
                    Citizen Resolution Feedback
                  </div>

                  {isAuthor && !complaint.feedbackGiven && (
                    <Button
                      size="sm"
                      onClick={() => setFeedbackOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Submit Your Rating
                    </Button>
                  )}
                </div>

                {complaint.feedbackGiven ? (
                  <div className="space-y-2 pl-7">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < complaint.feedbackRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        {complaint.feedbackRating} / 5 Stars
                      </span>
                    </div>

                    {complaint.feedbackComment && (
                      <p className="text-sm text-emerald-200/90 italic">
                        &quot;{complaint.feedbackComment}&quot;
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground pl-7">
                    {isAuthor
                      ? 'This complaint was marked as resolved by municipal staff. Please provide your feedback rating to confirm resolution quality.'
                      : 'Awaiting citizen resolution rating.'}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* FEEDBACK SUBMISSION DIALOG */}
        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogContent className="bg-card border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Rate Resolution Quality
              </DialogTitle>
              <DialogDescription>
                How satisfied are you with the municipal response and resolution for this issue?
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Rating (1–5 Stars)</Label>
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
                  {rating === 5 && '5 Stars — Outstanding service'}
                  {rating === 4 && '4 Stars — Good resolution'}
                  {rating === 3 && '3 Stars — Acceptable'}
                  {rating === 2 && '2 Stars — Below expectations'}
                  {rating === 1 && '1 Star — Unsatisfactory resolution'}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="comment">Feedback Remarks (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Provide any comments regarding work quality or completion speed..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFeedbackOpen(false)}
                  disabled={submittingFeedback}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  disabled={submittingFeedback}
                >
                  {submittingFeedback ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
  );
}
