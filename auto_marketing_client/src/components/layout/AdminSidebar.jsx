import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    ChevronDown,
    ChevronRight
} from "lucide-react";

const AdminSidebar = () => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();

    const toggleMenu = (name) => {
        setOpenMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const menuItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
        {
            name: "Quản lý người dùng",
            icon: Users,
            children: [
                { name: "Tất cả người dùng", href: "/admin/users/list", icon: Users },
                { name: "Người dùng mới", href: "/admin/users/new", icon: UserCheck }
            ],
        },
        {
            name: "Thống kê khách hàng",
            icon: BarChart3,
            children: [
                { name: "Theo lượt mua gói mới", href: "/admin/customers/statistics_packages" },
                { name: "Theo lượt đăng kí mới", href: "/admin/customers/statistics_customer" },
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
        { name: "Báo cáo & Phân tích", href: "/admin/analytics", icon: BarChart3 },
        { name: "Cài đặt hệ thống", href: "/admin/settings", icon: Settings },
        { name: "Bảo mật", href: "/admin/security", icon: Shield },
    ];

    const isActive = (href, exact = false) => {
        if (!href) return false;
        return exact ? location.pathname === href : location.pathname.startsWith(href);
    };

    useEffect(() => {
        const newOpenMenus = {};
        menuItems.forEach(item => {
            if (item.children) {
                const isChildActive = item.children.some(child => isActive(child.href));
                if (isChildActive) {
                    newOpenMenus[item.name] = true;
                }
            }
        });
        setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
    }, [location.pathname]);

    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const hasChildren = !!item.children;

        const handleParentClick = () => {
            if (item.href) {
                navigate(item.href);
            } else if (hasChildren && item.children[0]?.href) {
                navigate(item.children[0].href);
            }
        };

        const active = isActive(item.href, item.exact);

        return (
            <div key={item.name}>
                <div
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium cursor-pointer transition-colors duration-200
                    ${active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}`}
                >
                    <div
                        className="flex items-center w-full"
                        onClick={handleParentClick}
                    >
                        {Icon && (
                            <Icon
                                size={18}
                                className={`mr-3 transition-colors duration-200 ${
                                    active
                                        ? "text-white"
                                        : "text-gray-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600"
                                }`}
                            />
                        )}
                        <span className="flex-1">{item.name}</span>
                    </div>
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(item.name);
                            }}
                            className="p-1"
                        >
                            {openMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )}
                </div>

                {hasChildren && openMenus[item.name] && (
                    <div className="ml-6 border-l-2 border-blue-200">
                        {item.children.map((child) => {
                            const childActive = isActive(child.href);
                            return (
                                <Link
                                    key={child.name}
                                    to={child.href}
                                    className={`block px-4 py-2 text-sm rounded transition-colors duration-200
                                    ${childActive
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                        : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}`}
                                >
                                    {child.icon && (
                                        <child.icon
                                            size={14}
                                            className={`inline mr-2 ${
                                                childActive
                                                    ? "text-white"
                                                    : "text-gray-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600"
                                            }`}
                                        />
                                    )}
                                    {child.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-64 bg-white shadow-sm border-r-2 border-blue-200 fixed left-0 top-0 bottom-0 overflow-y-auto no-scrollbar">
            {/* Logo */}
            <div className="p-6 border-b-2 border-blue-200">
                <Link to="/admin" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Auto Marketing
                        </span>
                        <div className="text-xs text-gray-500">Admin Panel</div>
                    </div>
                </Link>
            </div>

            {/* Menu */}
            <nav className="py-4">
                {menuItems.map((item) => renderMenuItem(item))}
            </nav>
        </div>
    );
};

export default AdminSidebar;
