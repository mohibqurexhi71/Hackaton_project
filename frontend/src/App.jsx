import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

import LandingPage from '../app/page.jsx';
import LoginPage from '../app/(auth)/login/page.jsx';
import SignupPage from '../app/(auth)/signup/page.jsx';
import DashboardPage from '../app/(dashboard)/dashboard/page.jsx';
import ComplaintsPage from '../app/complaints/page.jsx';
import NewComplaintPage from '../app/complaints/new/page.jsx';
import MyComplaintsPage from '../app/complaints/mine/page.jsx';
import ComplaintDetailsPage from '../app/complaints/[id]/page.jsx';
import OfficerDashboardPage from '../app/officer/dashboard/page.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/new" element={<NewComplaintPage />} />
          <Route path="/complaints/mine" element={<MyComplaintsPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}
