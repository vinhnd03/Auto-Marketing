import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
        Users,
    Target,
    BarChart3,
    CreditCard,
    Settings,
    Shield,
    FileText,
    Database,
    Mail,
    TrendingUp,
    Package,
    UserCheck,
} from "lucide-react";

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            name: "Quản lý người dùng",
            icon: Users,
            children: [
                { name: "Tất cả người dùng", href: "/admin/customer/list", icon: Users },
                { name: "Người dùng mới", href: "/admin/customer/blocked", icon: UserCheck }
            ],
        },
        {
            name: "Thống kê khách hàng",
            icon: BarChart3,
            children: [
                { name: "Tăng trường trong năm", href: "/admin/customers/quarterly" },
                { name: "Phân tích xu hướng", href: "/admin/customer/trends" },
            ],
        },
        {
            name: "Thống kê doanh thu",
            icon: TrendingUp,
            children: [
                { name: "Tổng quan doanh thu", href: "/admin/revenue/overview" },
                { name: "Theo tuần", href: "/admin/revenue/weekly" },
                { name: "Theo tháng", href: "/admin/revenue/monthly" },
                { name: "Theo quý", href: "/admin/revenue/quarterly" },
            ],
        },
        {
            name: "Quản lý gói dịch vụ",
            icon: Package,
            children: [
                { name: "Tất cả gói", href: "/admin/packages" },
                { name: "Thống kê gói", href: "/admin/packages/stats" },
                { name: "Tạo gói mới", href: "/admin/packages/create" },
            ],
        },
        {
            name: "Quản lý chiến dịch",
            icon: Target,
            children: [
                { name: "Tất cả chiến dịch", href: "/admin/campaigns" },
                { name: "Chiến dịch đang chạy", href: "/admin/campaigns/active" },
                { name: "Hiệu suất chiến dịch", href: "/admin/campaigns/performance" },
            ],
        },
        {
            name: "Thanh toán & Giao dịch",
            icon: CreditCard,
            children: [
                { name: "Tất cả giao dịch", href: "/admin/transactions" },
                { name: "Thanh toán thành công", href: "/admin/transactions/success" },
                { name: "Thanh toán thất bại", href: "/admin/transactions/failed" },
                { name: "Hoàn tiền", href: "/admin/transactions/refunds" },
            ],
        },
        {
            name: "Quản lý nội dung",
            icon: FileText,
            children: [
                { name: "Bài đăng được tạo", href: "/admin/content/posts" },
                { name: "Template AI", href: "/admin/content/templates" },
                { name: "Báo cáo nội dung", href: "/admin/content/reports" },
            ],
        },
        {
            name: "Hệ thống & Logs",
            icon: Database,
            children: [
                { name: "System Logs", href: "/admin/system/logs" },
                { name: "API Usage", href: "/admin/system/api" },
                { name: "Server Status", href: "/admin/system/status" },
                { name: "Backup & Recovery", href: "/admin/system/backup" },
            ],
        },
        {
            name: "Marketing & Email",
            icon: Mail,
            children: [
                { name: "Email campaigns", href: "/admin/marketing/emails" },
                { name: "Newsletter", href: "/admin/marketing/newsletter" },
                { name: "Notifications", href: "/admin/marketing/notifications" },
            ],
        },
        {
            name: "Báo cáo & Phân tích",
            href: "/admin/analytics",
            icon: BarChart3,
        },
        {
            name: "Cài đặt hệ thống",
            href: "/admin/settings",
            icon: Settings,
        },
        {
            name: "Bảo mật",
            href: "/admin/security",
            icon: Shield,
        },
    ];

    const isActive = (href, exact = false) => {
        if (exact) {
            return location.pathname === href;
        }
        return location.pathname.startsWith(href);
    };

    const renderMenuItem = (item, level= 0) => {
        const Icon = item.icon;

        if (item.children) {
            return (
                <div key={item.name} className="mb-2">
                    <div
                        className={`flex items-center px-4 py-3 text-sm font-medium text-gray-600 ${
                            level > 0 ? "pl-8" : ""
                        }`}
                    >
                        {Icon && <Icon size={18} className="mr-3" />}
                        {item.name}
                    </div>
                    <div className="ml-4">
                        {item.children.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors ${
                    isActive(item.href, item.exact)
                        ? "bg-red-100 text-red-700 border-r-2 border-red-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${level > 0 ? "pl-8" : ""}`}
            >
                {Icon && <Icon size={18} className="mr-3" />}
                {item.name}
            </Link>
        );
    };

    return (
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 fixed left-0 top-0 bottom-0 overflow-y-auto">
            {/* Logo & Brand */}
            <div className="p-6 border-b border-gray-200">
                <Link to="/admin" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-gray-900">Admin Panel</span>
                        <div className="text-xs text-gray-500">MarketingAuto</div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="py-4">
                {menuItems.map((item) => renderMenuItem(item))}
            </nav>

            {/* System Stats */}
            <div className="p-4 border-t border-gray-200 mt-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Thống kê hệ thống
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Uptime</span>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-medium">99.9%</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Active Users</span>
                            <span className="text-xs font-medium text-green-600">847</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Server Load</span>
                            <span className="text-xs font-medium">23%</span>
                        </div>
                    </div>

                    <Link
                        to="/admin/system/status"
                        className="block w-full text-center bg-gradient-to-r from-red-600 to-red-800 text-white text-xs font-medium py-2 rounded-md mt-3 hover:from-red-700 hover:to-red-900 transition-all"
                    >
                        Chi tiết hệ thống
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;