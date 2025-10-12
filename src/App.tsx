import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import ShopOwnerDashboard from './components/ShopOwnerDashboard';
import GovernmentDashboard from './components/GovernmentDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ShopProfile from './components/ShopProfile';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import SupportPage from './pages/SupportPage';
import CompliancePage from './pages/CompliancePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import FeedbackPage from './pages/FeedbackPage';
import ContactPage from './pages/ContactPage';
import ShopBrowsePage from './pages/ShopBrowsePage';
import ShopManagementPage from './pages/ShopManagementPage';
import InspectionManagementPage from './pages/InspectionManagementPage';
import ReviewsPage from './pages/ReviewsPage';
import ShopDetailPage from './pages/ShopDetailPage';
import MyReviewsPage from './pages/MyReviewsPage';
import ShopRegistrationForm from './components/ShopRegistrationForm';
import ProfileManagement from './components/ProfileManagement';
import DocumentsPage from './pages/DocumentsPage';
import InspectionsPage from './pages/InspectionsPage';
import ActivitiesPage from './pages/ActivitiesPage';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {profile?.role === 'shop_owner' && (
        <>
          <Route path="/dashboard" element={<ShopOwnerDashboard />} />
          <Route path="/shop-profile" element={<ShopProfile />} />
          <Route path="/shop/manage" element={<ShopProfile />} />
          <Route path="/shop/register" element={<ShopRegistrationForm />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </>
      )}
      {profile?.role === 'government_official' && (
        <>
          <Route path="/dashboard" element={<GovernmentDashboard />} />
          <Route path="/shop-management" element={<ShopManagementPage />} />
          <Route path="/inspections" element={<InspectionManagementPage />} />
        </>
      )}
      {profile?.role === 'customer' && (
        <>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/shop-profile" element={<ShopProfile />} />
          <Route path="/shops" element={<ShopBrowsePage />} />
          <Route path="/shop/:shopId" element={<ShopDetailPage />} />
          <Route path="/shop/:shopId/reviews" element={<ReviewsPage />} />
          <Route path="/my-reviews" element={<MyReviewsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </>
      )}
      <Route path="/profile" element={<ProfileManagement />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/compliance" element={<CompliancePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shops" element={<ShopBrowsePage />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;