import React, {useState, useEffect} from "react";
import {TrendingUp, Package, Users, Percent, DollarSign, AlertTriangle} from "lucide-react";
import {Link} from "react-router-dom";
import FilterForm from "../../components/admin/FilterForm";
import RevenueLineChart from "../../components/admin/RevenueLineChart";
import PackageCharts from "../../components/admin/PackageCharts";

const RevenueManagement = () => {
    // Bộ lọc cho từng biểu đồ
    const [revenueFilter, setRevenueFilter] = useState({type: "month"});
    const [packageFilter, setPackageFilter] = useState({type: "month"});

    // Thống kê tổng quan
    const [stats, setStats] = useState({
        revenue: "120 triệu",
        packages: 45,
        users: 230,
        growth: "12%",
    });

    useEffect(() => {
        // Sau này gọi API thống kê tổng
    }, []);
    //
    // const statCards = [
    //     { label: "Tổng doanh thu", value: stats.revenue, icon: <TrendingUp className="w-6 h-6" />, color: "from-green-400 to-green-600" },
    //     { label: "Gói bán ra", value: stats.packages, icon: <Package className="w-6 h-6" />, color: "from-blue-400 to-blue-600" },
    //     { label: "Người dùng mới", value: stats.users, icon: <Users className="w-6 h-6" />, color: "from-yellow-400 to-yellow-600" },
    //     { label: "Tăng trưởng", value: stats.growth, icon: <Percent className="w-6 h-6" />, color: "from-pink-400 to-pink-600" },
    // ];
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
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Thống Kê Doanh Thu
                    </h1>
                    <p className="text-gray-600">
                        Quản lý doanh thu và thống kê doanh thu
                    </p>
                </div>
            </div>
            {/* Cards */}
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
                                        <Icon className="text-white" size={20}/>
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


            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ doanh thu */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <h2 className="font-bold text-lg text-gray-800">📈 Doanh thu</h2>
                        <FilterForm onFilterChange={setRevenueFilter}/>
                    </div>
                    <RevenueLineChart selectedTimeType={revenueFilter.type}/>
                </div>

                {/* Biểu đồ phân phối gói dịch vụ */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <h2 className="font-bold text-lg text-gray-800">📦 Phân phối gói dịch vụ</h2>
                        <FilterForm onFilterChange={setPackageFilter}/>
                    </div>
                    <PackageCharts selectedTimeType={packageFilter.type}/>
                </div>
            </div>
        </div>
    );
};

export default RevenueManagement;
