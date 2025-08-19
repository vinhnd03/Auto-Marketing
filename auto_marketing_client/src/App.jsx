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

// import AdminLayout from "./pages/admin/AdminLayout";
// import AdminDashboard from "./pages/admin/AdminDashboard";
import ListUsers from "./components/admin/ListUsers";
import ListUserByDate from "./components/admin/ListUserByDate";
import NewCustomerStatisticsComponent from "./components/admin/CustomersBuyNewPackagesStatistic";
import TrendPage from "./components/admin/NewCustomerStatistic";
import DetailUserComponent from "./components/admin/DetailUser";



// Component để xác định có hiển thị Navbar/Footer không
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/terms",
    "/privacy",
  ].includes(location.pathname) || location.pathname.startsWith("/admin");

    return (
        <>
            {!isAuthPage && <Navbar/>}
            <div className={!isAuthPage ? "flex-grow" : ""}>{children}</div>
            {!isAuthPage && <Footer/>}
        </>
    );
};

function App() {
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     setTimeout(() => setLoading(false), 1200);
    // }, []);
 //   if (loading) return <Preloader/>;
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Home/>}/>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />          
          <Route path="/reset-password" element={<ResetPasswordPage />} />          

                    {/* Legal Routes */}
                    <Route path="/terms" element={<TermsPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>

          <Route path="/pricing" element={<ListComponent />} />
          <Route path="/payment-result" element={<PaymentResultComponent/>}/>
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
                    <Route
                        path="/admin"
                        element={
                            <AdminLayout/>
                        }
                    >
                        <Route index element={<AdminDashboard/>}/>
                        <Route path="users/list" element={<ListUsers/>}/>
                        <Route path="users/new" element={<ListUserByDate/>}/>
                        <Route path={"users/detail/:id"} element={<DetailUserComponent/>}/>
                        <Route path="customers/statistics_customer" element={<TrendPage/>}/>
                        <Route path="customers/statistics_packages" element={<NewCustomerStatisticsComponent/>}/>
                        <Route path="revenue" element={<RevenueManagement/>}/>
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
