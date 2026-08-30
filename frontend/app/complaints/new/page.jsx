'use client';

import React, { useEffect, useState } from 'react';
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
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FilePlus2,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  Star,
  ThumbsUp,
} from 'lucide-react';

function PageHeading({ complaintCount }) {
  return (
    <section className="border-b border-[#dce2f3] pb-6 sm:pb-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-[720px]">
          <Link
            to="/dashboard"
            className="mb-5 inline-flex items-center gap-1.5 rounded-[4px] text-[12px] font-medium text-[#74777f] transition-colors duration-150 hover:text-[#002147] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000a1e]"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Back to Dashboard
          </Link>

          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777f]">
            Citizen activity
          </p>

          <h1 className="mt-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#151c27] sm:text-[30px]">
            My Complaints
          </h1>

          <p className="mt-2 text-[13px] leading-[1.65] text-[#74777f] sm:text-[14px]">
            Track your submitted complaints, follow official progress, and
            provide feedback after an issue has been resolved.
          </p>

          {!Number.isNaN(complaintCount) && (
            <p className="mt-3 text-[11px] font-medium text-[#74777f]">
              {complaintCount} complaint
              {complaintCount === 1 ? '' : 's'} in your account
            </p>
          )}
        </div>

        <Link to="/complaints/new" className="w-full sm:w-auto">
          <Button className="h-10 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-4 text-[13px] font-medium text-white shadow-none hover:bg-[#151c27] sm:w-auto">
            <FilePlus2 className="mr-2 h-4 w-4" strokeWidth={2} />
            Report New Issue
          </Button>
        </Link>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <Card className="rounded-[8px] border-dashed border-[#c4c6cf] bg-white shadow-none">
      <CardContent className="flex flex-col items-center px-5 py-12 text-center sm:py-14">
        <div className="flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#c4c6cf] bg-[#f0f3ff] text-[#002147]">
          <FileText className="h-6 w-6" strokeWidth={1.8} />
        </div>

        <h2 className="mt-4 text-[18px] font-semibold tracking-[-0.01em] text-[#151c27]">
          No complaints yet
        </h2>

        <p className="mt-2 max-w-[520px] text-[12px] leading-[1.65] text-[#74777f]">
          You have not submitted a civic complaint yet. Report a local issue
          or browse existing complaints from your community.
        </p>

        <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link to="/complaints/new" className="w-full sm:w-auto">
            <Button className="h-10 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-5 text-[13px] text-white shadow-none hover:bg-[#151c27] sm:w-auto">
              <FilePlus2 className="mr-2 h-4 w-4" strokeWidth={2} />
              Report Issue
            </Button>
          </Link>

          <Link to="/complaints" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-10 w-full rounded-[4px] border-[#c4c6cf] bg-white px-5 text-[13px] text-[#151c27] shadow-none hover:bg-[#f0f3ff] sm:w-auto"
            >
              Browse Public Feed
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ComplaintCard({ complaint, onFeedback }) {
  const hasFeedback = complaint.feedbackGiven;
  const isResolved = complaint.status === 'resolved';

  return (
    <Card className="overflow-hidden rounded-[8px] border-[#c4c6cf] bg-white shadow-none transition-colors duration-150 hover:border-[#74777f]">
      <CardContent className="p-4 sm:p-5">
        {/* TOP ROW */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={complaint.category} />

              <StatusBadge status={complaint.status} />

              <PriorityBadge
                priority={complaint.priority}
                score={complaint.priorityScore}
                showScore={true}
              />
            </div>

            <Link
              to={`/complaints/${complaint._id}`}
              className="mt-3 block text-[16px] font-semibold leading-[1.45] tracking-[-0.005em] text-[#151c27] transition-colors duration-150 hover:text-[#002147]"
            >
              {complaint.title}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#74777f]">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />

            <span>
              {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString()
                : 'Date unavailable'}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        {complaint.description && (
          <div className="mt-4">
            <p className="line-clamp-3 text-[12px] leading-[1.65] text-[#44474e] sm:text-[13px]">
              {complaint.description}
            </p>
          </div>
        )}

        {/* META */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e2e8f8] pt-4 text-[11px] text-[#74777f] sm:text-[12px]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#44474e]" strokeWidth={2} />
            <span className="font-medium text-[#44474e]">
              {complaint.area || 'Area not specified'}
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <ThumbsUp
              className="h-3.5 w-3.5 text-[#44474e]"
              strokeWidth={2}
            />
            {complaint.upvotes || 0} community upvotes
          </span>
        </div>

        {/* OFFICER REMARK */}
        {complaint.officerRemark && (
          <div className="mt-4 rounded-[6px] border border-[#c4c6cf] bg-[#f9f9ff] p-3.5">
            <div className="flex items-start gap-2">
              <MessageSquare
                className="mt-0.5 h-4 w-4 shrink-0 text-[#002147]"
                strokeWidth={2}
              />

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#002147]">
                  Officer Remark
                </p>

                <p className="mt-1 text-[12px] leading-[1.6] text-[#44474e]">
                  {complaint.officerRemark}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RESOLVED / FEEDBACK AREA */}
        {isResolved && (
          <div className="mt-4 border-t border-[#dce2f3] pt-4">
            {hasFeedback ? (
              <div className="flex flex-col gap-3 rounded-[6px] border border-[#77dd6a] bg-[#f5fcf3] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-[#006e0c]"
                      strokeWidth={2}
                    />

                    <span className="text-[12px] font-semibold text-[#006e0c]">
                      Feedback submitted
                    </span>

                    <span className="text-[11px] text-[#74777f]">
                      Your rating helps evaluate the resolution.
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={
                            star <= complaint.feedbackRating
                              ? 'h-3.5 w-3.5 fill-[#9a6700] text-[#9a6700]'
                              : 'h-3.5 w-3.5 text-[#c4c6cf]'
                          }
                          strokeWidth={2}
                        />
                      ))}
                    </div>

                    {complaint.feedbackComment && (
                      <span className="max-w-full truncate text-[11px] italic text-[#74777f]">
                        "{complaint.feedbackComment}"
                      </span>
                    )}
                  </div>
                </div>

                <Link to={`/complaints/${complaint._id}`} className="shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-[4px] border-[#c4c6cf] bg-white px-3 text-[11px] text-[#151c27] shadow-none hover:bg-[#f0f3ff]"
                  >
                    View Details
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-[6px] border border-[#c4c6cf] bg-[#f0f3ff] p-3.5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-white text-[#002147]">
                      <Star className="h-4 w-4" strokeWidth={2} />
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#151c27]">
                        Your complaint has been resolved
                      </p>

                      <p className="mt-1 text-[11px] leading-[1.5] text-[#74777f]">
                        Rate the response to help evaluate the quality of the
                        resolution.
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full gap-2 sm:w-auto">
                    <Button
                      size="sm"
                      onClick={() => onFeedback(complaint)}
                      className="h-9 flex-1 rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-3 text-[11px] font-medium text-white shadow-none hover:bg-[#002147] sm:flex-none"
                    >
                      <Star className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
                      Give Feedback
                    </Button>

                    <Link
                      to={`/complaints/${complaint._id}`}
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-full rounded-[4px] border-[#c4c6cf] bg-white px-3 text-[11px] text-[#151c27] shadow-none hover:bg-[#ffffff]"
                      >
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NON-RESOLVED DETAILS */}
        {!isResolved && (
          <div className="mt-4 flex justify-end border-t border-[#dce2f3] pt-4">
            <Link to={`/complaints/${complaint._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-[4px] border-[#c4c6cf] bg-white px-3 text-[11px] text-[#151c27] shadow-none hover:bg-[#f0f3ff]"
              >
                View Details
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MyComplaintsPage() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback dialog state
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
      setError(err?.message || 'Failed to load your complaints');
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

  const closeFeedbackDialog = () => {
    if (!submittingFeedback) {
      setFeedbackComplaint(null);
    }
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();

    if (!feedbackComplaint) {
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmittingFeedback(true);

    try {
      const res = await complaintApi.submitFeedback(
        feedbackComplaint._id,
        {
          rating,
          comment: comment.trim(),
        }
      );

      toast.success('Your feedback has been submitted.');

      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint._id === feedbackComplaint._id
            ? res.data
            : complaint
        )
      );

      setFeedbackComplaint(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <ProtectedRoute citizenOnly={true}>
      <div className="min-h-screen bg-[#f9f9ff] text-[#151c27]">
        <Navbar />

        <main className="mx-auto w-full max-w-[1280px] px-5 py-7 sm:px-6 sm:py-8 lg:py-10">
          <PageHeading complaintCount={complaints.length} />

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#ba1a1a] bg-[#ffdad6] px-4 py-3"
            >
              <AlertCircle
                className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#ba1a1a]"
                strokeWidth={2}
              />

              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#93000a]">
                  Unable to load your complaints
                </p>

                <p className="mt-1 text-[12px] leading-[1.5] text-[#93000a]">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <section className="mt-7 sm:mt-8">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <Card
                    key={item}
                    className="rounded-[8px] border-[#c4c6cf] bg-white shadow-none"
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-6 w-20 bg-[#e7eefe]" />
                          <Skeleton className="h-6 w-24 bg-[#e7eefe]" />
                          <Skeleton className="h-6 w-20 bg-[#e7eefe]" />
                        </div>

                        <Skeleton className="h-5 w-[70%] bg-[#e7eefe]" />

                        <Skeleton className="h-4 w-full bg-[#e7eefe]" />

                        <Skeleton className="h-4 w-[50%] bg-[#e7eefe]" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint._id}
                    complaint={complaint}
                    onFeedback={openFeedbackDialog}
                  />
                ))}
              </div>
            )}
          </section>

          {/* FEEDBACK DIALOG */}
          <Dialog
            open={!!feedbackComplaint}
            onOpenChange={(open) => {
              if (!open) {
                closeFeedbackDialog();
              }
            }}
          >
            <DialogContent className="w-[calc(100%-32px)] max-w-[460px] rounded-[8px] border border-[#c4c6cf] bg-white p-0 shadow-[0_8px_24px_rgba(0,10,30,0.12)]">
              <DialogHeader className="border-b border-[#dce2f3] px-5 py-5 sm:px-6">
                <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.01em] text-[#151c27]">
                  <CheckCircle2
                    className="h-5 w-5 text-[#1cc06e]"
                    strokeWidth={2}
                  />
                  Rate Resolution
                </DialogTitle>

                <DialogDescription className="mt-1 text-[12px] leading-[1.6] text-[#74777f]">
                  Your feedback helps evaluate how effectively the issue was
                  resolved.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleFeedbackSubmit}
                className="space-y-6 px-5 py-5 sm:px-6"
              >
                {/* COMPLAINT SUMMARY */}
                <div className="rounded-[6px] border border-[#c4c6cf] bg-[#f9f9ff] p-3.5">
                  <p className="truncate text-[13px] font-semibold text-[#151c27]">
                    {feedbackComplaint?.title}
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#74777f]">
                    <MapPin className="h-3.5 w-3.5" />
                    {feedbackComplaint?.area}
                  </p>
                </div>

                {/* RATING */}
                <div>
                  <Label className="text-[13px] font-medium text-[#151c27]">
                    Service rating
                  </Label>

                  <p className="mt-1 text-[11px] text-[#74777f]">
                    Select from 1 to 5 stars.
                  </p>

                  <div className="mt-4 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} out of 5`}
                        className="rounded-[4px] p-1.5 transition-colors duration-150 hover:bg-[#f0f3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000a1e]"
                      >
                        <Star
                          className={
                            star <= rating
                              ? 'h-7 w-7 fill-[#9a6700] text-[#9a6700]'
                              : 'h-7 w-7 text-[#c4c6cf]'
                          }
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-center text-[12px] font-medium text-[#854d0e]">
                    {rating === 5 && 'Excellent resolution'}
                    {rating === 4 && 'Good resolution'}
                    {rating === 3 && 'Average resolution'}
                    {rating === 2 && 'Below expectations'}
                    {rating === 1 && 'Poor resolution'}
                  </p>
                </div>

                {/* COMMENT */}
                <div>
                  <Label
                    htmlFor="feedback-comment"
                    className="text-[13px] font-medium text-[#151c27]"
                  >
                    Feedback remarks
                    <span className="ml-1 text-[11px] font-normal text-[#74777f]">
                      (Optional)
                    </span>
                  </Label>

                  <Textarea
                    id="feedback-comment"
                    placeholder="Tell us anything about the response or quality of the resolution..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    className="mt-2 resize-y rounded-[4px] border-[#c4c6cf] bg-white text-[12px] leading-[1.6] text-[#151c27] shadow-none placeholder:text-[#74777f] focus:border-[#000a1e] focus:ring-2 focus:ring-[#000a1e]/10"
                  />
                </div>

                {/* FOOTER */}
                <DialogFooter className="flex-col-reverse gap-2 border-t border-[#dce2f3] pt-5 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFeedbackComplaint(null)}
                    disabled={submittingFeedback}
                    className="h-10 w-full rounded-[4px] border-[#c4c6cf] bg-white text-[12px] text-[#151c27] shadow-none hover:bg-[#f0f3ff] sm:w-auto"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={submittingFeedback}
                    className="h-10 w-full rounded-[4px] border border-[#000a1e] bg-[#000a1e] px-5 text-[12px] font-medium text-white shadow-none hover:bg-[#002147] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submittingFeedback ? (
                      <>
                        <Loader2
                          className="mr-2 h-4 w-4 animate-spin"
                          strokeWidth={2}
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Feedback
                        <ArrowRight
                          className="ml-2 h-4 w-4"
                          strokeWidth={2}
                        />
                      </>
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