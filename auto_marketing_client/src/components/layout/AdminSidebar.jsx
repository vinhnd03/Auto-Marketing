import React, {useState, useEffect, useRef} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
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
    ChevronRight
} from "lucide-react";
import PropTypes from "prop-types";

const AdminSidebar = ({collapsed}) => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();
    const [hoverMenu, setHoverMenu] = useState(null);
    const hoverTimeout = useRef(null);

    const handleMouseEnter = (name) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHoverMenu(name);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setHoverMenu(null), 150);
    };


    const toggleMenu = (name) => {
        setOpenMenus((prev) => ({...prev, [name]: !prev[name]}));
    };

    const menuItems = [
        {name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true},
        {
            name: "Quản lý người dùng", icon: Users,
            children: [
                {name: "Tất cả người dùng", href: "/admin/users/list", icon: Users},
                {name: "Người dùng mới", href: "/admin/users/new", icon: UserCheck}
            ],
        },
        {
            name: "Thống kê khách hàng",
            icon: BarChart3,
            children: [
                {name: "Theo lượt mua gói mới", href: "/admin/customers/statistics_packages"},
                {name: "Theo lượt đăng kí mới", href: "/admin/customers/statistics_customer"},
            ],
        },
        {
            name: "Thống kê doanh thu",
            icon: TrendingUp,
            children: [{name: "Tổng quan doanh thu", href: "/admin/revenue"}]
        },
        {
            name: "Quản lý gói dịch vụ",
            icon: Package,
            children: [{name: "Thống kê gói", href: "/admin/packages"}, {name: "Tất cả gói", href: "/admin/plans"}]
        },
        {
            name: "Quản lý chiến dịch",
            icon: Target,
            children: [{name: "Tất cả chiến dịch", href: "/admin/campaigns"}, {
                name: "Chiến dịch đang chạy",
                href: "/admin/campaigns/active"
            }, {name: "Hiệu suất chiến dịch", href: "/admin/campaigns/performance"}]
        },
        {
            name: "Thanh toán & Giao dịch",
            icon: CreditCard,
            children: [{name: "Tất cả giao dịch", href: "/admin/transactions"}, {
                name: "Thanh toán thành công",
                href: "/admin/transactions/success"
            }, {name: "Thanh toán thất bại", href: "/admin/transactions/failed"}, {
                name: "Hoàn tiền",
                href: "/admin/transactions/refunds"
            }]
        },
        {
            name: "Quản lý nội dung",
            icon: FileText,
            children: [{name: "Bài đăng được tạo", href: "/admin/content/posts"}, {
                name: "Template AI",
                href: "/admin/content/templates"
            }, {name: "Báo cáo nội dung", href: "/admin/content/reports"}]
        },
        {
            name: "Hệ thống & Logs",
            icon: Database,
            children: [{name: "System Logs", href: "/admin/system/logs"}, {
                name: "API Usage",
                href: "/admin/system/api"
            }, {name: "Server Status", href: "/admin/system/status"}, {
                name: "Backup & Recovery",
                href: "/admin/system/backup"
            }]
        },
        {
            name: "Marketing & Email",
            icon: Mail,
            children: [{name: "Email campaigns", href: "/admin/marketing/emails"}, {
                name: "Newsletter",
                href: "/admin/marketing/newsletter"
            }, {name: "Notifications", href: "/admin/marketing/notifications"}]
        },
        {name: "Báo cáo & Phân tích", href: "/admin/analytics", icon: BarChart3},
        {name: "Cài đặt hệ thống", href: "/admin/settings", icon: Settings},
        {name: "Bảo mật", href: "/admin/security", icon: Shield},
    ];

    const isActive = (href, exact = false) =>
        href
            ? exact
                ? location.pathname === href
                : location.pathname === href || location.pathname.startsWith(href + "/")
            : false;

    useEffect(() => {
        const newOpen = {};
        menuItems.forEach((item) => {
            if (item.children) {
                const activeChild = item.children.some((c) => isActive(c.href));
                if (activeChild) newOpen[item.name] = true;
            }
        });
        setOpenMenus((prev) => ({...prev, ...newOpen}));
    }, [location.pathname]);

    const renderMenuItem = (item) => {
        const Icon = item.icon;
        const hasChildren = !!item.children;
        // chỉ set active cho cha khi collapsed = true
        const active =
            isActive(item.href, item.exact) ||
            (collapsed && hasChildren && item.children.some((c) => isActive(c.href)));
        const handleParentClick = () => {
            if (collapsed) {
                // thu gọn: click icon -> đi ngay
                if (item.href) navigate(item.href);
                else if (hasChildren && item.children[0]?.href) navigate(item.children[0].href);
                return;
            }
            // không thu gọn
            if (item.href) {
                navigate(item.href);
            } else if (hasChildren && item.children[0]?.href) {
                navigate(item.children[0].href);
            }
        };

        return (
            <div
                key={item.name}
                title={collapsed ? item.name : undefined}
                className="relative"
                onMouseEnter={() => collapsed && hasChildren && handleMouseEnter(item.name)}
                onMouseLeave={() => collapsed && hasChildren && handleMouseLeave()}
            >
                <div
                    className={`group flex items-center ${collapsed ? "justify-center" : "justify-between"} 
                      px-4 py-3 text-sm font-medium cursor-pointer transition-colors duration-200
                      ${active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}`}
                    onClick={handleParentClick}
                >
                    <div className="flex items-center w-full">
                        {Icon && (
                            <Icon
                                size={18}
                                className={`mr-3 shrink-0 transition-colors duration-200 ${
                                    active ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                                }`}
                            />
                        )}
                        {/* label ẩn khi thu gọn */}
                        <span
                            className={`flex-1 whitespace-nowrap transition-opacity duration-200 
                         ${collapsed ? "hidden" : "block"}`}
                        >
              {item.name}
            </span>
                    </div>

                    {/* nút mở/đóng submenu khi không thu gọn */}
                    {!collapsed && hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(item.name);
                            }}
                            className="p-1"
                        >
                            <ChevronRight
                                size={16}
                                className={`transition-transform ${openMenus[item.name] ? "rotate-90" : "rotate-0"}`}
                            />
                        </button>
                    )}
                </div>

                {/* Submenu khi expanded */}
                {!collapsed && hasChildren && openMenus[item.name] && (
                    <div className="ml-6 border-l-2 border-blue-200">
                        {item.children.map((child) => {
                            const childActive = isActive(child.href);
                            const ChildIcon = child.icon;
                            return (
                                <Link
                                    key={child.name}
                                    to={child.href}
                                    className={`group flex items-center px-4 py-2 text-sm whitespace-nowrap transition-colors duration-200 ${
                                        childActive
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                                    }`}
                                >
                                    {ChildIcon && (
                                        <ChildIcon
                                            size={14}
                                            className={`inline mr-2 transition-colors duration-200 ${
                                                childActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                                            }`}
                                        />
                                    )}
                                    {child.name}
                                </Link>

                            );
                        })}
                    </div>
                )}

                {/* Flyout submenu khi collapsed */}
                {collapsed && hasChildren && hoverMenu === item.name && (
                    <div
                        className="absolute left-full top-0 ml-1 bg-white border border-blue-200 rounded-md shadow-lg
                       py-2 min-w-[200px] z-[60]
                        before:content-[''] before:absolute before:top-0 before:-left-4 before:w-4 before:h-full before:bg-transparent"
                        onMouseEnter={() => setHoverMenu(item.name)}  // giữ mở khi rê vào flyout
                        onMouseLeave={() => setHoverMenu(null)}
                    >
                        {item.children.map((child) => {
                            const childActive = isActive(child.href);
                            const ChildIcon = child.icon;
                            return (
                                <Link
                                    key={child.name}
                                    to={child.href}
                                    className={`group flex items-center px-4 py-2 text-sm whitespace-nowrap transition-colors duration-200 ${childActive
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                        : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"}`}
                                >
                                    {ChildIcon && (
                                        <ChildIcon
                                            size={14}
                                            className={`mr-2 transition-colors duration-200 ${
                                                childActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
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
        <div
            className={`bg-white shadow-sm border-r-2 border-blue-200 fixed left-0 top-0 bottom-0 
                   flex flex-col transition-all duration-300 z-40
                  ${collapsed ? "w-16" : "w-64"}`}
        >
            {/* Logo */}
            <div className="p-6 border-b-2 border-blue-200 flex items-center">
                <Link to="/admin" className="flex items-center space-x-2 w-full">
                    <div
                        className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-white"/>
                    </div>
                    <div
                        className={`transition-opacity duration-200 ${collapsed ? "opacity-0 invisible" : "opacity-100 visible"}`}>
            <span
                className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Auto Marketing
            </span>
                        <div className="text-xs text-gray-500">Admin Panel</div>
                    </div>
                </Link>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto overflow-x-visible no-scrollbar">
                <nav className="py-4">
                    {menuItems.map((item) => renderMenuItem(item))}
                </nav>
            </div>
        </div>
    );
};

AdminSidebar.propTypes = {
    collapsed: PropTypes.bool.isRequired,
};

export default AdminSidebar;
