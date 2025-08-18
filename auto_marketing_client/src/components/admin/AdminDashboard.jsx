import React from "react";
import { Link } from "react-router-dom";
import {
    TrendingUp,
    Users,
    DollarSign,
    Target,
    ArrowUp,
    ArrowDown,
    AlertTriangle,
    CheckCircle,
    Package,
} from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        {
            name: "Tổng người dùng",
            value: "1,234",
            change: "+12.5%",
            changeType: "increase",
            icon: Users,
            color: "blue",
            description: "Người dùng hoạt động",
        },
        {
            name: "Doanh thu tháng",
            value: "₫152.5M",
            change: "+8.2%",
            changeType: "increase",
            icon: DollarSign,
            color: "green",
            description: "So với tháng trước",
        },
        {
            name: "Chiến dịch đang chạy",
            value: "456",
            change: "+15.3%",
            changeType: "increase",
            icon: Target,
            color: "purple",
            description: "Chiến dịch hoạt động",
        },
        {
            name: "Gói Premium",
            value: "89",
            change: "-2.1%",
            changeType: "decrease",
            icon: Package,
            color: "orange",
            description: "Đăng ký mới tháng này",
        },
    ];

    const recentUsers = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            email: "nguyenvana@email.com",
            plan: "Premium",
            joinDate: "2024-08-05",
            status: "active",
        },
        {
            id: 2,
            name: "Trần Thị B",
            email: "tranthib@email.com",
            plan: "Professional",
            joinDate: "2024-08-04",
            status: "active",
        },
        {
            id: 3,
            name: "Lê Văn C",
            email: "levanc@email.com",
            plan: "Starter",
            joinDate: "2024-08-03",
            status: "pending",
        },
        {
            id: 4,
            name: "Phạm Thị D",
            email: "phamthid@email.com",
            plan: "Premium",
            joinDate: "2024-08-02",
            status: "active",
        },
    ];

    const recentTransactions = [
        {
            id: 1,
            user: "Nguyễn Văn A",
            plan: "Premium",
            amount: "₫1,299,000",
            date: "2024-08-06",
            status: "completed",
        },
        {
            id: 2,
            user: "Trần Thị B",
            plan: "Professional",
            amount: "₫599,000",
            date: "2024-08-06",
            status: "completed",
        },
        {
            id: 3,
            user: "Lê Văn C",
            plan: "Starter",
            amount: "₫299,000",
            date: "2024-08-05",
            status: "pending",
        },
        {
            id: 4,
            user: "Phạm Thị D",
            plan: "Premium",
            amount: "₫1,299,000",
            date: "2024-08-05",
            status: "failed",
        },
    ];

    const systemAlerts = [
        {
            id: 1,
            type: "warning",
            message: "Server load đang cao (85%)",
            time: "5 phút trước",
        },
        {
            id: 2,
            type: "info",
            message: "Backup dữ liệu hoàn thành",
            time: "1 giờ trước",
        },
        {
            id: 3,
            type: "error",
            message: "API Facebook gặp sự cố",
            time: "2 giờ trước",
        },
    ];

    const quickActions = [
        {
            name: "Quản lý người dùng",
            description: "Xem và quản lý tài khoản người dùng",
            icon: Users,
            href: "/admin/users",
            color: "blue",
        },
        {
            name: "Báo cáo doanh thu",
            description: "Xem chi tiết doanh thu và thống kê",
            icon: DollarSign,
            href: "/admin/revenue",
            color: "green",
        },
        {
            name: "Quản lý gói dịch vụ",
            description: "Cấu hình và quản lý các gói",
            icon: Package,
            href: "/admin/packages",
            color: "purple",
        },
        {
            name: "Cài đặt hệ thống",
            description: "Cấu hình và bảo trì hệ thống",
            icon: AlertTriangle,
            href: "/admin/settings",
            color: "orange",
        },
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: "bg-green-100 text-green-800", text: "Hoạt động" },
            pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ xử lý" },
            completed: { color: "bg-green-100 text-green-800", text: "Thành công" },
            failed: { color: "bg-red-100 text-red-800", text: "Thất bại" },
            blocked: { color: "bg-red-100 text-red-800", text: "Bị khóa" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
        {config.text}
      </span>
        );
    };

    const getPlanBadge = (plan) => {
        const planConfig = {
            Starter: { color: "bg-gray-100 text-gray-800" },
            Professional: { color: "bg-blue-100 text-blue-800" },
            Premium: { color: "bg-purple-100 text-purple-800" },
        };

        const config = planConfig[plan] || planConfig.Starter;
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
        {plan}
      </span>
        );
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case "error":
                return <AlertTriangle className="text-red-500" size={16} />;
            case "warning":
                return <AlertTriangle className="text-yellow-500" size={16} />;
            case "info":
                return <CheckCircle className="text-blue-500" size={16} />;
            default:
                return <CheckCircle className="text-gray-500" size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Tổng quan hệ thống MarketingAuto</p>
                </div>
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Admin Mode</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.name}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {stat.description}
                                    </p>
                                </div>
                                <div
                                    className={`w-12 h-12 bg-gradient-to-r ${
                                        stat.color === "blue"
                                            ? "from-blue-500 to-blue-600"
                                            : stat.color === "green"
                                                ? "from-green-500 to-green-600"
                                                : stat.color === "purple"
                                                    ? "from-purple-500 to-purple-600"
                                                    : "from-orange-500 to-orange-600"
                                    } rounded-lg flex items-center justify-center`}
                                >
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                            <div className="flex items-center mt-4">
                                {stat.changeType === "increase" ? (
                                    <ArrowUp className="text-green-500 mr-1" size={16} />
                                ) : (
                                    <ArrowDown className="text-red-500 mr-1" size={16} />
                                )}
                                <span
                                    className={`text-sm font-medium ${
                                        stat.changeType === "increase"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                  {stat.change}
                </span>
                                <span className="text-sm text-gray-500 ml-1">
                  so với tháng trước
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.name}
                                to={action.href}
                                className="group p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-r ${
                                            action.color === "blue"
                                                ? "from-blue-500 to-blue-600"
                                                : action.color === "green"
                                                    ? "from-green-500 to-green-600"
                                                    : action.color === "purple"
                                                        ? "from-purple-500 to-purple-600"
                                                        : "from-orange-500 to-orange-600"
                                        } rounded-lg flex items-center justify-center flex-shrink-0`}
                                    >
                                        <Icon className="text-white" size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                                            {action.name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Người dùng mới
                        </h2>
                        <Link
                            to="/admin/users"
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.name.charAt(0)}
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {getPlanBadge(user.plan)}
                                    <div className="mt-1">{getStatusBadge(user.status)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Giao dịch gần đây
                        </h2>
                        <Link
                            to="/admin/transactions"
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {transaction.user}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {transaction.plan} - {transaction.date}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {transaction.amount}
                                    </p>
                                    {getStatusBadge(transaction.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Cảnh báo hệ thống
                        </h2>
                        <Link
                            to="/admin/system/logs"
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Xem logs
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {systemAlerts.map((alert) => (
                            <div key={alert.id} className="flex items-start space-x-3">
                                {getAlertIcon(alert.type)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Doanh thu theo thời gian
                    </h2>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md">
                            7 ngày
                        </button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                            30 ngày
                        </button>
                        <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                            90 ngày
                        </button>
                    </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <TrendingUp className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-gray-500">
                            Biểu đồ doanh thu sẽ được hiển thị ở đây
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;