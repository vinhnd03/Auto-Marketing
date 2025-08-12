import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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

import { TermsPage, PrivacyPage } from "./pages/legal";
import ListComponent from "./components/pricing/DashBoardComponent";
import PaymentResultComponent from "./components/pricing/PaymentResultComponent";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import RevenueManagement from "./pages/admin/RevenueManagement";

import ListCustomerComponent from "./components/admin/ListCustomerComponent";
import ListCustomerByDateComponent from "./components/admin/ListCustomerByDateComponent";
import NewCustomerStatisticsComponent from "./components/admin/NewCustomerStatisticsComponent";
import TrendPage from "./components/admin/TrendAnalysis";

// Component để scroll to top khi navigate
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

// Component để xác định có hiển thị Navbar/Footer không
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
  ].includes(location.pathname);

  const isAdminPage = location.pathname.startsWith("/admin");
  const isLegalPage = ["/terms", "/privacy"].includes(location.pathname);

  // Hiển thị Navbar ở tất cả pages trừ auth pages, admin pages và legal pages
  const shouldShowNavbar = !isAuthPage && !isAdminPage && !isLegalPage;

  // Hiển thị Footer ở tất cả pages trừ auth pages và admin pages (bao gồm cả legal pages)
  const shouldShowFooter = !isAuthPage && !isAdminPage;

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);
  if (loading) return <Preloader />;
  return (
    <Router>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Legal Routes */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Contact Route */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/features" element={<FeaturesPage />} />

          <Route path="/pricing" element={<ListComponent />} />
          <Route path="/payment-result" element={<PaymentResultComponent />} />
          {/* Application Routes */}
          <Route path="/campaign-manager" element={<CampaignManager />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route
            path="/workspaces/:workspaceId"
            element={<WorkspaceDetailPage />}
          />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ListCustomerComponent />} />
            <Route path="users/new" element={<ListCustomerByDateComponent />} />
            <Route path="customers/trends" element={<TrendPage />} />
            <Route
              path="customers/statistics"
              element={<NewCustomerStatisticsComponent />}
            />
            <Route path="revenue" element={<RevenueManagement />} />
          </Route>
        </Routes>
      </AppLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
              color: "#fff",
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
