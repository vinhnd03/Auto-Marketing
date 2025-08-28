import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

const SystemStatusPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());

  const stats = [
    {
      title: "Tổng servers",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: Server,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Servers hoạt động",
      value: "11",
      change: "+1",
      changeType: "positive",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Uptime trung bình",
      value: "99.8%",
      change: "+0.2%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Servers có vấn đề",
      value: "1",
      change: "-1",
      changeType: "positive",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const servers = [
    {
      id: "SRV001",
      name: "Web Server 01",
      type: "Web Server",
      status: "online",
      uptime: "99.9%",
      cpu: 45,
      memory: 67,
      disk: 23,
      network: 89,
      lastCheck: "2025-01-15 14:30:25",
      location: "Singapore",
    },
    {
      id: "SRV002",
      name: "Database Server 01",
      type: "Database",
      status: "online",
      uptime: "99.8%",
      cpu: 78,
      memory: 89,
      disk: 45,
      network: 92,
      lastCheck: "2025-01-15 14:30:25",
      location: "Singapore",
    },
    {
      id: "SRV003",
      name: "API Server 01",
      type: "API Server",
      status: "online",
      uptime: "99.7%",
      cpu: 34,
      memory: 56,
      disk: 18,
      network: 95,
      lastCheck: "2025-01-15 14:30:25",
      location: "Singapore",
    },
    {
      id: "SRV004",
      name: "Cache Server 01",
      type: "Cache Server",
      status: "warning",
      uptime: "98.5%",
      cpu: 89,
      memory: 92,
      disk: 67,
      network: 78,
      lastCheck: "2025-01-15 14:30:25",
      location: "Singapore",
    },
    {
      id: "SRV005",
      name: "Load Balancer 01",
      type: "Load Balancer",
      status: "online",
      uptime: "99.9%",
      cpu: 23,
      memory: 34,
      disk: 12,
      network: 99,
      lastCheck: "2025-01-15 14:30:25",
      location: "Singapore",
    },
    {
      id: "SRV006",
      name: "Backup Server 01",
      type: "Backup Server",
      status: "offline",
      uptime: "0%",
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
      lastCheck: "2025-01-15 14:25:18",
      location: "Singapore",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      online: {
        text: "Hoạt động",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      warning: {
        text: "Cảnh báo",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
      },
      offline: {
        text: "Không hoạt động",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.offline;
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

  const getResourceColor = (value) => {
    if (value <= 50) return "text-green-600";
    if (value <= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getResourceBarColor = (value) => {
    if (value <= 50) return "bg-green-500";
    if (value <= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const refreshStatus = () => {
    setLastUpdated(new Date().toLocaleString());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Server Status
              </h1>
              <p className="text-gray-600 mt-2">
                Theo dõi trạng thái và hiệu suất của tất cả servers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Cập nhật lần cuối: {lastUpdated}
              </div>
              <button
                onClick={refreshStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Làm mới
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

        {/* Servers Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Trạng thái Servers
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {servers.map((server, index) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {server.name}
                    </h3>
                    <p className="text-sm text-gray-500">{server.type}</p>
                  </div>
                  {getStatusBadge(server.status)}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {server.uptime}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">CPU:</span>
                      <span
                        className={`text-sm font-medium ${getResourceColor(
                          server.cpu
                        )}`}
                      >
                        {server.cpu}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getResourceBarColor(
                          server.cpu
                        )}`}
                        style={{ width: `${server.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Memory:</span>
                      <span
                        className={`text-sm font-medium ${getResourceColor(
                          server.memory
                        )}`}
                      >
                        {server.memory}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getResourceBarColor(
                          server.memory
                        )}`}
                        style={{ width: `${server.memory}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Disk:</span>
                      <span
                        className={`text-sm font-medium ${getResourceColor(
                          server.disk
                        )}`}
                      >
                        {server.disk}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getResourceBarColor(
                          server.disk
                        )}`}
                        style={{ width: `${server.disk}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Network:</span>
                      <span
                        className={`text-sm font-medium ${getResourceColor(
                          server.network
                        )}`}
                      >
                        {server.network}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getResourceBarColor(
                          server.network
                        )}`}
                        style={{ width: `${server.network}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {server.id}</span>
                      <span>{server.location}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Kiểm tra cuối: {server.lastCheck}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Khởi động lại server
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Backup dữ liệu
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Cài đặt monitoring
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

export default SystemStatusPage;
