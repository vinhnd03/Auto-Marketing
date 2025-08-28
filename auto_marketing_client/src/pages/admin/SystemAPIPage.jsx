import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Clock,
  Users,
  Database,
  Search,
  Filter,
  Download,
  BarChart3,
} from "lucide-react";

const SystemAPIPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  const stats = [
    {
      title: "Tổng API calls",
      value: "2.4M",
      change: "+18.5%",
      changeType: "positive",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "API calls hôm nay",
      value: "89.2K",
      change: "+12.7%",
      changeType: "positive",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tỷ lệ thành công",
      value: "99.2%",
      change: "+0.5%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Thời gian phản hồi TB",
      value: "245ms",
      change: "-12.3%",
      changeType: "positive",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const apiEndpoints = [
    {
      endpoint: "/api/users",
      method: "GET",
      calls: 45600,
      successRate: 99.8,
      avgResponseTime: 180,
      errorCount: 89,
      lastCalled: "2025-01-15 14:30:25",
      status: "active",
    },
    {
      endpoint: "/api/campaigns",
      method: "POST",
      calls: 23400,
      successRate: 98.5,
      avgResponseTime: 320,
      errorCount: 351,
      lastCalled: "2025-01-15 14:29:18",
      status: "active",
    },
    {
      endpoint: "/api/payments",
      method: "POST",
      calls: 18900,
      successRate: 99.1,
      avgResponseTime: 450,
      errorCount: 170,
      lastCalled: "2025-01-15 14:28:45",
      status: "active",
    },
    {
      endpoint: "/api/analytics",
      method: "GET",
      calls: 15600,
      successRate: 97.8,
      avgResponseTime: 890,
      errorCount: 345,
      lastCalled: "2025-01-15 14:27:32",
      status: "active",
    },
    {
      endpoint: "/api/emails",
      method: "POST",
      calls: 12300,
      successRate: 99.5,
      avgResponseTime: 210,
      errorCount: 62,
      lastCalled: "2025-01-15 14:26:15",
      status: "active",
    },
    {
      endpoint: "/api/reports",
      method: "GET",
      calls: 8900,
      successRate: 96.2,
      avgResponseTime: 1200,
      errorCount: 340,
      lastCalled: "2025-01-15 14:25:48",
      status: "active",
    },
  ];

  const topUsers = [
    {
      userId: "USER001",
      email: "admin@automarketing.com",
      apiCalls: 45600,
      lastActivity: "2025-01-15 14:30:25",
      status: "active",
      plan: "Enterprise",
    },
    {
      userId: "USER002",
      email: "marketing@company.com",
      apiCalls: 23400,
      lastActivity: "2025-01-15 14:29:18",
      status: "active",
      plan: "Premium",
    },
    {
      userId: "USER003",
      email: "developer@startup.com",
      apiCalls: 18900,
      lastActivity: "2025-01-15 14:28:45",
      status: "active",
      plan: "Basic",
    },
    {
      userId: "USER004",
      email: "analyst@agency.com",
      apiCalls: 15600,
      lastActivity: "2025-01-15 14:27:32",
      status: "active",
      plan: "Premium",
    },
    {
      userId: "USER005",
      email: "support@business.com",
      apiCalls: 12300,
      lastActivity: "2025-01-15 14:26:15",
      status: "active",
      plan: "Basic",
    },
  ];

  const getMethodBadge = (method) => {
    const methodConfig = {
      GET: "bg-green-100 text-green-800 border-green-200",
      POST: "bg-blue-100 text-blue-800 border-blue-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
    };

    const className =
      methodConfig[method] || "bg-gray-100 text-gray-800 border-gray-200";
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${className}`}
      >
        {method}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        text: "Hoạt động",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      inactive: {
        text: "Không hoạt động",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getSuccessRateColor = (rate) => {
    if (rate >= 99) return "text-green-600";
    if (rate >= 95) return "text-blue-600";
    if (rate >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getResponseTimeColor = (time) => {
    if (time <= 200) return "text-green-600";
    if (time <= 500) return "text-blue-600";
    if (time <= 1000) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                API Usage
              </h1>
              <p className="text-gray-600 mt-2">
                Theo dõi và phân tích việc sử dụng API của hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1h">1 giờ qua</option>
                <option value="24h">24 giờ qua</option>
                <option value="7d">7 ngày qua</option>
                <option value="30d">30 ngày qua</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download size={16} />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Tổng quan</h2>
            <button
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="lg:hidden px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showMobileStats ? "Ẩn thống kê" : "Hiện thống kê"}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${
              !showMobileStats && "lg:block hidden"
            }`}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${stat.bgColor} border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* API Endpoints Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Endpoints API
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm endpoint..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ thành công
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian phản hồi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lỗi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lần gọi cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiEndpoints.map((endpoint, index) => (
                  <motion.tr
                    key={endpoint.endpoint}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {endpoint.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getMethodBadge(endpoint.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {endpoint.calls.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={getSuccessRateColor(endpoint.successRate)}
                      >
                        {endpoint.successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={getResponseTimeColor(
                          endpoint.avgResponseTime
                        )}
                      >
                        {endpoint.avgResponseTime}ms
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {endpoint.errorCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {endpoint.lastCalled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(endpoint.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top API Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Top API Users
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Calls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoạt động cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gói dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topUsers.map((user, index) => (
                  <motion.tr
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.apiCalls.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Cài đặt rate limit
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Quản lý API keys
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Cấu hình webhook
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Phân tích hiệu suất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAPIPage;
