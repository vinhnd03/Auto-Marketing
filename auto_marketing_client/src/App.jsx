import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {Toaster} from "react-hot-toast";

// Import components and pages using new structure
import {Navbar, Footer, Preloader} from "./components";

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

import ListUsers from "./components/admin/ListUsers";
import ListUserByDate from "./components/admin/ListUserByDate";
import NewCustomerStatistic from "./components/admin/NewCustomerStatistic";
import DetailUserComponent from "./components/admin/DetailUser";
import PackageStatsPage from "./pages/admin/PackageStatsPage";
import PlanPage from "./pages/admin/PlanPage";
import NewPackagePurchased from "./components/admin/NewPackagePurchased";

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

    // Hiển thị Navbar ở tất cả pages trừ auth pages, admin pages và legal pages
    const shouldShowNavbar = !isAuthPage && !isAdminPage && !isLegalPage;

    // Hiển thị Footer ở tất cả pages trừ auth pages và admin pages (bao gồm cả legal pages)
    const shouldShowFooter = !isAuthPage && !isAdminPage;

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
        setTimeout(() => setLoading(false), 1200);
    }, []);
    if (loading) return <Preloader/>;
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Home/>}/>

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                    <Route path="/reset-password" element={<ResetPasswordPage/>}/>

                    {/* Legal Routes */}
                    <Route path="/terms" element={<TermsPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>

                    <Route path="/pricing" element={<ListComponent/>}/>
                    <Route path="/payment-result" element={<PaymentResultComponent/>}/>
                    {/* Application Routes */}
                    <Route path="/campaign-manager" element={<CampaignManager/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/workspace" element={<WorkspacePage/>}/>
                    <Route
                        path="/workspaces/:workspaceId"
                        element={<WorkspaceDetailPage/>}
                    />
                    {/* Admin Routes */}
                    <Route
                        path="/admin/*"
                        element={
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
                        }
                    />
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/blog" element={<BlogPage/>}/>
                    <Route path="/help" element={<HelpPage/>}/>
                    <Route path="/faq" element={<FAQPage/>}/>
                    <Route path="/guide" element={<GuidePage/>}/>
                    <Route path="/sitemap" element={<SitemapPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage/>}
                    />
                    <Route path="/reset-password" element={<ResetPasswordPage/>}/>
                    <Route path="/terms" element={<TermsPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/features" element={<FeaturesPage/>}/>
                    <Route path="/pricing" element={<ListComponent/>}/>
                    <Route
                        path="/payment-result"
                        element={<PaymentResultComponent/>}
                    />
                    <Route path="/campaign-manager" element={<CampaignManager/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/workspace" element={<WorkspacePage/>}/>
                    <Route
                        path="/workspaces/:workspaceId"
                        element={<WorkspaceDetailPage/>}
                    />
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
