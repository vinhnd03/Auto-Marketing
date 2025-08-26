import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HardDrive,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const SystemBackupPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);

  const stats = [
    {
      title: "Tổng backups",
      value: "156",
      change: "+23",
      changeType: "positive",
      icon: HardDrive,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Backups hôm nay",
      value: "12",
      change: "+3",
      changeType: "positive",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tổng dung lượng",
      value: "2.4TB",
      change: "+450GB",
      changeType: "positive",
      icon: Download,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Backups thành công",
      value: "98.7%",
      change: "+0.3%",
      changeType: "positive",
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const backups = [
    {
      id: "BK001",
      name: "Full Backup - Database",
      type: "Full",
      size: "450GB",
      status: "completed",
      startTime: "2025-01-15 02:00:00",
      endTime: "2025-01-15 03:30:00",
      duration: "1h 30m",
      location: "Singapore",
      retention: "30 days",
    },
    {
      id: "BK002",
      name: "Incremental Backup - Files",
      type: "Incremental",
      size: "25GB",
      status: "completed",
      startTime: "2025-01-15 12:00:00",
      endTime: "2025-01-15 12:15:00",
      duration: "15m",
      location: "Singapore",
      retention: "7 days",
    },
    {
      id: "BK003",
      name: "Full Backup - System",
      type: "Full",
      size: "180GB",
      status: "in_progress",
      startTime: "2025-01-15 14:00:00",
      endTime: null,
      duration: "45m",
      location: "Singapore",
      retention: "90 days",
    },
    {
      id: "BK004",
      name: "Incremental Backup - Database",
      type: "Incremental",
      size: "15GB",
      status: "failed",
      startTime: "2025-01-15 10:00:00",
      endTime: "2025-01-15 10:05:00",
      duration: "5m",
      location: "Singapore",
      retention: "7 days",
    },
    {
      id: "BK005",
      name: "Full Backup - Applications",
      type: "Full",
      size: "320GB",
      status: "scheduled",
      startTime: "2025-01-16 02:00:00",
      endTime: null,
      duration: null,
      location: "Singapore",
      retention: "60 days",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        text: "Hoàn thành",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      in_progress: {
        text: "Đang thực hiện",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      failed: {
        text: "Thất bại",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
      scheduled: {
        text: "Đã lên lịch",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
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

  const getTypeBadge = (type) => {
    const typeConfig = {
      Full: "bg-blue-100 text-blue-800 border-blue-200",
      Incremental: "bg-green-100 text-green-800 border-green-200",
      Differential: "bg-purple-100 text-purple-800 border-purple-200",
    };

    const className =
      typeConfig[type] || "bg-gray-100 text-gray-800 border-gray-200";
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${className}`}
      >
        {type}
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
                Backup & Recovery
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý backup và khôi phục dữ liệu hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Upload size={16} />
                Tạo backup
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download size={16} />
                Khôi phục
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

        {/* Backups Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Danh sách Backups
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên backup
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kích thước
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian hoàn thành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian thực hiện
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lưu trữ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup, index) => (
                  <motion.tr
                    key={backup.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900">
                          {backup.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {backup.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(backup.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(backup.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.endTime || "Đang thực hiện"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {backup.duration || "Đang thực hiện"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {backup.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {backup.retention}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recovery Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Tùy chọn Khôi phục
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Download size={24} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Khôi phục toàn bộ
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Khôi phục toàn bộ hệ thống từ một backup point cụ thể
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Khôi phục toàn bộ
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Upload size={24} className="text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Khôi phục từng phần
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Khôi phục chỉ những file hoặc database cụ thể
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Khôi phục từng phần
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-purple-50 border border-purple-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <RefreshCw size={24} className="text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Test Recovery
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Kiểm tra tính toàn vẹn của backup mà không khôi phục thực tế
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Test Recovery
              </button>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Lên lịch backup
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Kiểm tra backup
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Cài đặt retention
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Cấu hình storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemBackupPage;
