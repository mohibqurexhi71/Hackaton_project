'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { complaintApi } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { StatusBadge } from '@/components/common/StatusBadge';
import { toast } from '@/components/ui/toaster';
import {
  FilePlus,
  Truck,
  Trash2,
  Droplets,
  Zap,
  HelpCircle,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Loader2,
  AlertCircle,
  ThumbsUp,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'road', label: 'Road & Transport', icon: Truck, desc: 'Potholes, broken asphalt, traffic lights' },
  { value: 'garbage', label: 'Garbage & Sanitation', icon: Trash2, desc: 'Trash piles, overflowing bins, drains' },
  { value: 'water', label: 'Water Supply', icon: Droplets, desc: 'Burst pipes, contaminated water, leaks' },
  { value: 'electricity', label: 'Electricity & Power', icon: Zap, desc: 'Exposed wires, broken streetlights' },
  { value: 'other', label: 'Other Civic Issue', icon: HelpCircle, desc: 'Public parks, noise, animal control' },
];

export default function ReportComplaintPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'road',
    area: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Duplicate detection state
  const [duplicates, setDuplicates] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  // Trigger duplicate check when category and area change
  useEffect(() => {
    if (!formData.category || !formData.area || formData.area.trim().length < 3) {
      setDuplicates([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingDuplicates(true);
      try {
        const res = await complaintApi.getDuplicates({
          category: formData.category,
          area: formData.area.trim(),
        });
        setDuplicates(res.data?.duplicates || []);
      } catch (err) {
        console.warn('Duplicate check warning:', err.message);
      } finally {
        setCheckingDuplicates(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.category, formData.area]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please provide a clear complaint title.');
      return;
    }

    if (!formData.category) {
      setError('Please select a complaint category.');
      return;
    }

    if (!formData.area.trim()) {
      setError('Please specify the neighborhood or area location.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please describe the problem details.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Backend sets status='pending', upvotes=0, and createdBy from token
      const res = await complaintApi.create({
        title: formData.title.trim(),
        category: formData.category,
        area: formData.area.trim(),
        description: formData.description.trim(),
      });

      toast.success('Complaint submitted successfully! Municipal queue notified.');
      navigate('/complaints/mine');
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute citizenOnly={true}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />

        <main className="flex-1 container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* HEADER */}
          <div className="border-b border-border/60 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Report a Civic Complaint
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Provide accurate location and details to help municipal teams investigate and resolve the issue quickly.
            </p>
          </div>

          {/* DUPLICATE WARNING ALERT */}
          {duplicates.length > 0 && (
            <Alert variant="warning" className="border-amber-500/40 bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div className="space-y-2">
                <AlertTitle className="text-amber-400 font-bold">
                  Similar Active Issues Already Reported in {formData.area}
                </AlertTitle>
                <AlertDescription className="text-xs text-amber-200/90 leading-relaxed">
                  We found {duplicates.length} active complaint(s) in this area. You can upvote an existing report to boost municipal priority instead of filing a duplicate:
                </AlertDescription>

                <div className="mt-3 space-y-2">
                  {duplicates.slice(0, 3).map((dup) => (
                    <div
                      key={dup._id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-background/80 border border-amber-500/30 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-foreground">{dup.title}</span>
                        <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                          <StatusBadge status={dup.status} />
                          <span>• {dup.upvotes || 0} upvotes</span>
                        </div>
                      </div>
                      <Link to={`/complaints/${dup._id}`}
                        target="_blank"
                        className="text-emerald-400 hover:underline shrink-0 flex items-center gap-1 font-semibold"
                      >
                        View & Upvote
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Alert>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM CARD */}
          <Card className="border-border/80 bg-card/70 shadow-xl backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">Complaint Details</CardTitle>
              <CardDescription>
                All fields are required for official municipal processing.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Grid */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = formData.category === cat.value;

                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, category: cat.value }))}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/15 text-foreground ring-1 ring-emerald-500'
                              : 'border-border bg-background/50 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 mt-0.5 shrink-0 ${
                              isSelected ? 'text-emerald-400' : 'text-muted-foreground'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-bold leading-tight">{cat.label}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                              {cat.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title">Complaint Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Deep pothole causing vehicle damage near school gate"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Area Location */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="area">Location / Neighborhood Area</Label>
                    {checkingDuplicates && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Checking duplicate reports...
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="area"
                      name="area"
                      placeholder="e.g. University Road, Satellite Town, Cantt"
                      className="pl-9"
                      value={formData.area}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Provide specific details about the issue, severity, duration, and landmarks to assist field teams..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-md shadow-emerald-900/25 px-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting Complaint...
                      </>
                    ) : (
                      <>
                        Submit Complaint
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
