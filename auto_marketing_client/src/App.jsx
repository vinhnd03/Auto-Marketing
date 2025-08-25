import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Toaster } from "react-hot-toast";

// Import components and pages using new structure
import { Navbar, Footer, Preloader } from "./components";

import {
  Home,
  ContactPage,
  FeaturesPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  CampaignManager,
  Profile,
  Settings,
  WorkspacePage,
  WorkspaceDetailPage,
} from "./pages";

import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import HelpPage from "./pages/HelpPage";
import FAQPage from "./pages/FAQPage";
import GuidePage from "./pages/GuidePage";
import SitemapPage from "./pages/SitemapPage";

import {TermsPage, PrivacyPage} from "./pages/legal";
import ListComponent from "./components/pricing/DashBoardComponent";
import PaymentResultComponent from "./components/pricing/PaymentResultComponent";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import RevenueStatsPage from "./pages/admin/RevenueStatsPage";
import { ForbiddenPage, NotFoundPage } from "./pages/error/ErrorPage ";
import AdminRoute from "./routes/AdminRoute";
import GuestRoute from "./routes/GuestRoute";
import OAuth2Success from "./pages/auth/OAuthSucess";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AxiosInterceptor } from "./context/useAxiosInterceptor";
import ListUsers from "./components/admin/ListUsers";
import ListUserByDate from "./components/admin/ListUserByDate";
import NewCustomerStatistic from "./components/admin/NewCustomerStatistic";
import DetailUserComponent from "./components/admin/DetailUser";
import PackageStatsPage from "./pages/admin/PackageStatsPage";
import PlanPage from "./pages/admin/PlanPage";
import NewPackagePurchased from "./components/admin/NewPackagePurchased";

import GlobalScrollToTop from "./components/ui/GlobalScrollToTop";

// Component để scroll to top khi navigate
const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return null;
};

// Component để xác định có hiển thị Navbar/Footer không
const AppLayout = ({children}) => {
    const location = useLocation();
    const isAuthPage = [
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
    ].includes(location.pathname);

    const isAdminPage = location.pathname.startsWith("/admin");
    const isLegalPage = ["/terms", "/privacy"].includes(location.pathname);

  const isErrorPage = ["/not-found"].includes(location.pathname);
  // Hiển thị Navbar ở tất cả pages trừ auth pages, admin pages và legal pages
  const shouldShowNavbar = !isAuthPage && !isAdminPage && !isLegalPage && !isErrorPage;

  // Hiển thị Footer ở tất cả pages trừ auth pages và admin pages (bao gồm cả legal pages)
  const shouldShowFooter = !isAuthPage && !isAdminPage && !isErrorPage;

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavbar && <Navbar/>}
            <main className="flex-1">{children}</main>
            {shouldShowFooter && <Footer/>}
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // gọi hook custom trong effect để đảm bảo AuthProvider đã mount
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);
  if (loading) return <Preloader />;

  return (
    <>
      <AxiosInterceptor />
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - Separate layout */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                    <Route index element={<AdminDashboard/>}/>
                    <Route path="users/list" element={<ListUsers/>}/>
                    <Route path="users/new" element={<ListUserByDate/>}/>
                    <Route path={"users/detail/:id"} element={<DetailUserComponent/>}/>
                    <Route path="customers/statistics_customer" element={<NewCustomerStatistic/>}/>
                    <Route path="customers/statistics_packages" element={<NewPackagePurchased/>}/>
                    <Route path="revenue" element={<RevenueStatsPage/>}/>
                    <Route path="packages" element={<PackageStatsPage/>}/>
                    <Route path="plans" element={<PlanPage/>}/>
                </Routes>
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <LoginPage />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <GuestRoute>
                      <RegisterPage />
                    </GuestRoute>
                  }
                />
                <Route path="/oauth2/success" element={<OAuth2Success />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<ListComponent />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route
                  path="/payment-result"
                  element={
                    <ProtectedRoute>
                      <PaymentResultComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/campaign-manager"
                  element={
                    <ProtectedRoute>
                      <CampaignManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      {" "}
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workspace"
                  element={
                    <ProtectedRoute>
                      <WorkspacePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workspaces/:workspaceId"
                  element={
                    <ProtectedRoute>
                      <WorkspaceDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/*"
                  element={<Navigate to="/not-found" replace />}
                />
              </Routes>
            </AppLayout>
          }
        />
        <Route path="/unauthorized" element={<ForbiddenPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
      <GlobalScrollToTop />
    </>
  );
}

export default App;
