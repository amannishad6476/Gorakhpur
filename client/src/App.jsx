import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingButtons from './components/layout/FloatingButtons';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public Pages (lazy loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FreeEstimatePage = lazy(() => import('./pages/FreeEstimatePage'));
const ServiceAreasPage = lazy(() => import('./pages/ServiceAreasPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

// Admin Pages (lazy loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminEnquiriesPage = lazy(() => import('./pages/admin/AdminEnquiriesPage'));
const AdminEstimatesPage = lazy(() => import('./pages/admin/AdminEstimatesPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminBlogsPage = lazy(() => import('./pages/admin/AdminBlogsPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const AdminFAQsPage = lazy(() => import('./pages/admin/AdminFAQsPage'));
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'));
const AdminContentPage = lazy(() => import('./pages/admin/AdminContentPage'));
const AdminActivityPage = lazy(() => import('./pages/admin/AdminActivityPage'));
const AdminChangePasswordPage = lazy(() => import('./pages/admin/AdminChangePasswordPage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminBannersPage = lazy(() => import('./pages/admin/AdminBannersPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-0">{children}</main>
    <Footer />
    <FloatingButtons />
  </>
);

// Admin layout wrapper (no public nav/footer)
const AdminLayout = ({ children }) => (
  <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
    {children}
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: '12px',
                    fontSize: '14px',
                  },
                  success: { iconTheme: { primary: '#d4a017', secondary: '#fff' } },
                }}
              />
              <Suspense fallback={<LoadingSpinner fullPage />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                  <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
                  <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
                  <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
                  <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
                  <Route path="/blog" element={<PublicLayout><BlogListPage /></PublicLayout>} />
                  <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
                  <Route path="/reviews" element={<PublicLayout><ReviewsPage /></PublicLayout>} />
                  <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
                  <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                  <Route path="/free-estimate" element={<PublicLayout><FreeEstimatePage /></PublicLayout>} />
                  <Route path="/service-areas" element={<PublicLayout><ServiceAreasPage /></PublicLayout>} />
                  <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
                  <Route path="/terms-conditions" element={<PublicLayout><TermsPage /></PublicLayout>} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLayout><AdminLoginPage /></AdminLayout>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/enquiries" element={<ProtectedRoute><AdminLayout><AdminEnquiriesPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/estimates" element={<ProtectedRoute><AdminLayout><AdminEstimatesPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/reviews" element={<ProtectedRoute><AdminLayout><AdminReviewsPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/blogs" element={<ProtectedRoute><AdminLayout><AdminBlogsPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/services" element={<ProtectedRoute><AdminLayout><AdminServicesPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/gallery" element={<ProtectedRoute><AdminLayout><AdminGalleryPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/faqs" element={<ProtectedRoute><AdminLayout><AdminFAQsPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/testimonials" element={<ProtectedRoute><AdminLayout><AdminTestimonialsPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/content" element={<ProtectedRoute><AdminLayout><AdminContentPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/activity" element={<ProtectedRoute><AdminLayout><AdminActivityPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/change-password" element={<ProtectedRoute><AdminLayout><AdminChangePasswordPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><AdminProjectsPage /></AdminLayout></ProtectedRoute>} />
                  <Route path="/admin/banners" element={<ProtectedRoute><AdminLayout><AdminBannersPage /></AdminLayout></ProtectedRoute>} />

                  {/* Redirects */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center text-center px-4">
    <div>
      <div className="text-8xl mb-6">🎨</div>
      <h1 className="text-6xl font-black text-gradient-gold mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Page Not Found</h2>
      <p className="text-[var(--color-text-muted)] mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go to Homepage</a>
    </div>
  </div>
);

export default App;
