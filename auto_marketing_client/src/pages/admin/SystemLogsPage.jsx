import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

const SystemLogsPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");

  const stats = [
    {
      title: "Tổng log entries",
      value: "45,678",
      change: "+12.3%",
      changeType: "positive",
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Logs hôm nay",
      value: "1,234",
      change: "+8.7%",
      changeType: "positive",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Lỗi hệ thống",
      value: "23",
      change: "-15.2%",
      changeType: "positive",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Cảnh báo",
      value: "156",
      change: "+5.8%",
      changeType: "negative",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const logs = [
    {
      id: "LOG001",
      timestamp: "2025-01-15 14:30:25",
      level: "INFO",
      source: "UserService",
      message: "User login successful: user@email.com",
      details: "IP: 192.168.1.100, User Agent: Chrome/120.0.0.0",
      userId: "USER123",
      sessionId: "SESS456",
    },
    {
      id: "LOG002",
      timestamp: "2025-01-15 14:29:18",
      level: "WARNING",
      source: "PaymentService",
      message: "Payment processing timeout for transaction TXN789",
      details: "Transaction ID: TXN789, Amount: ₫299,000, Timeout: 30s",
      userId: "USER456",
      sessionId: "SESS789",
    },
    {
      id: "LOG003",
      timestamp: "2025-01-15 14:28:45",
      level: "ERROR",
      source: "DatabaseService",
      message: "Database connection failed: Connection timeout",
      details: "Server: db-prod-01, Port: 5432, Retry attempts: 3",
      userId: null,
      sessionId: null,
    },
    {
      id: "LOG004",
      timestamp: "2025-01-15 14:27:32",
      level: "INFO",
      source: "EmailService",
      message: "Email sent successfully: welcome@automarketing.com",
      details: "Template: welcome_email, Recipients: 1, Status: delivered",
      userId: "USER789",
      sessionId: "SESS012",
    },
    {
      id: "LOG005",
      timestamp: "2025-01-15 14:26:15",
      level: "ERROR",
      source: "APIService",
      message: "API rate limit exceeded for endpoint /api/campaigns",
      details: "IP: 203.45.67.89, Limit: 1000/hour, Current: 1001",
      userId: "USER012",
      sessionId: "SESS345",
    },
    {
      id: "LOG006",
      timestamp: "2025-01-15 14:25:48",
      level: "INFO",
      source: "CampaignService",
      message: "Campaign created successfully: Summer Sale 2025",
      details: "Campaign ID: CAMP001, Budget: ₫5,000,000, Duration: 30 days",
      userId: "USER345",
      sessionId: "SESS678",
    },
  ];

  const getLevelBadge = (level) => {
    const levelConfig = {
      INFO: {
        text: "Thông tin",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Info,
      },
      WARNING: {
        text: "Cảnh báo",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
      },
      ERROR: {
        text: "Lỗi",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
      SUCCESS: {
        text: "Thành công",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
    };

    const config = levelConfig[level] || levelConfig.INFO;
    const Icon = config.icon;

    return (
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          className={config.className
            .replace("bg-", "text-")
            .replace(" border-", "")}
        />
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
        >
          {config.text}
        </span>
      </div>
    );
  };

  const getSourceBadge = (source) => {
    const sourceColors = {
      UserService: "bg-purple-100 text-purple-800 border-purple-200",
      PaymentService: "bg-green-100 text-green-800 border-green-200",
      DatabaseService: "bg-red-100 text-red-800 border-red-200",
      EmailService: "bg-blue-100 text-blue-800 border-blue-200",
      APIService: "bg-orange-100 text-orange-800 border-orange-200",
      CampaignService: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };

    const className =
      sourceColors[source] || "bg-gray-100 text-gray-800 border-gray-200";
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${className}`}
      >
        {source}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                System Logs
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi tất cả logs hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Làm mới
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download size={16} />
                Xuất logs
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

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Logs gần đây
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm logs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả levels</option>
                <option value="INFO">Thông tin</option>
                <option value="WARNING">Cảnh báo</option>
                <option value="ERROR">Lỗi</option>
                <option value="SUCCESS">Thành công</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả services</option>
                <option value="UserService">User Service</option>
                <option value="PaymentService">Payment Service</option>
                <option value="DatabaseService">Database Service</option>
                <option value="EmailService">Email Service</option>
                <option value="APIService">API Service</option>
                <option value="CampaignService">Campaign Service</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSourceBadge(log.source)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900">
                          {log.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {log.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <span className="text-sm text-gray-600 text-xs">
                          {log.details}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.userId || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.sessionId || "N/A"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">{logs.length}</span> trong tổng số{" "}
              <span className="font-medium">{logs.length}</span> logs
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Trước
              </button>
              <button className="px-3 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Xóa logs cũ
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Backup logs
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Cài đặt retention
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Cấu hình alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogsPage;
