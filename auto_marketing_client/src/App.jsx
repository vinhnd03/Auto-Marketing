import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {Toaster} from "react-hot-toast";

// Import components and pages using new structure
import {Navbar, Footer, Preloader} from "./components";

import {
    Home,
    LoginPage,
    RegisterPage,
    ResetPasswordPage,
    CampaignManager,
    Profile,
    Settings,
    WorkspacePage,
    WorkspaceDetailPage,
} from "./pages";

import {TermsPage, PrivacyPage} from "./pages/legal";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ListCustomerComponent from "./components/admin/ListCustomerComponent";
import ListCustomerByDateComponent from "./components/admin/ListCustomerByDateComponent";
import NewCustomerStatisticsComponent from "./components/admin/NewCustomerStatisticsComponent";
import TrendPage from "./components/admin/TrendAnalysis";

// Component để xác định có hiển thị Navbar/Footer không
const AppLayout = ({children}) => {
    const location = useLocation();
    const isAuthPage = [
        "/login",
        "/register",
        "/reset-password",
        "/terms",
        "/privacy",
        "/admin/customers/quarterly",
        "/admin/customer/list",
        "/admin/customer/blocked",
        "/admin/customer/trends"
    ].includes(location.pathname);

    return (
        <>
            {!isAuthPage && <Navbar/>}
            <div className={!isAuthPage ? "flex-grow" : ""}>{children}</div>
            {!isAuthPage && <Footer/>}
        </>
    );
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
                    <Route path="/reset-password" element={<ResetPasswordPage/>}/>

                    {/* Legal Routes */}
                    <Route path="/terms" element={<TermsPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>

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
                        path="/admin"
                        element={
                            <AdminLayout/>
                        }
                    >
                        <Route index element={<AdminDashboard/>}/>
                        <Route path="customer/list" element={<ListCustomerComponent/>}/>
                        <Route path="customer/blocked" element={<ListCustomerByDateComponent/>}/>
                        <Route path="customer/trends" element={<TrendPage/>}/>
                        <Route path="customers/quarterly" element={<NewCustomerStatisticsComponent/>}/>
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
