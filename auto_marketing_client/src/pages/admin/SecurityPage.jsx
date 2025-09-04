import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Activity,
  Settings,
  Download,
  RefreshCw,
  Key,
  Database,
  Server,
} from "lucide-react";

export default function SecurityPage() {
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dữ liệu mẫu
  const securityData = {
    overview: {
      totalUsers: 1250,
      activeUsers: 890,
      failedLogins: 45,
      suspiciousActivities: 12,
      lastSecurityScan: "2024-12-15T08:00:00",
      securityScore: 92,
    },
    recentActivities: [
      {
        id: 1,
        type: "login",
        user: "admin@automarketing.com",
        ip: "192.168.1.100",
        location: "Hà Nội, Việt Nam",
        status: "success",
        timestamp: "2024-12-15T10:30:00",
        details: "Đăng nhập thành công",
      },
      {
        id: 2,
        type: "failed_login",
        user: "user123@email.com",
        ip: "203.162.45.78",
        location: "TP.HCM, Việt Nam",
        status: "failed",
        timestamp: "2024-12-15T10:25:00",
        details: "Sai mật khẩu - 3 lần thử",
      },
      {
        id: 3,
        type: "password_change",
        user: "manager@company.com",
        ip: "192.168.1.150",
        location: "Hà Nội, Việt Nam",
        status: "success",
        timestamp: "2024-12-15T09:45:00",
        details: "Thay đổi mật khẩu",
      },
      {
        id: 4,
        type: "suspicious_activity",
        user: "unknown@email.com",
        ip: "45.123.67.89",
        location: "Nước ngoài",
        status: "blocked",
        timestamp: "2024-12-15T09:30:00",
        details: "Truy cập từ IP lạ - Bị chặn",
      },
    ],
    securitySettings: {
      twoFactorAuth: true,
      passwordPolicy: "strong",
      sessionTimeout: 30,
      ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
      failedLoginAttempts: 5,
      accountLockoutDuration: 15,
    },
  };

  const getActivityIcon = (type) => {
    const icons = {
      login: { icon: CheckCircle, color: "text-green-600" },
      failed_login: { icon: XCircle, color: "text-red-600" },
      password_change: { icon: Key, color: "text-blue-600" },
      suspicious_activity: { icon: AlertTriangle, color: "text-orange-600" },
    };

    const config = icons[type] || { icon: Activity, color: "text-gray-600" };
    const Icon = config.icon;

    return <Icon size={16} className={config.color} />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { color: "bg-green-100 text-green-800", text: "Thành công" },
      failed: { color: "bg-red-100 text-red-800", text: "Thất bại" },
      blocked: { color: "bg-orange-100 text-orange-800", text: "Bị chặn" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Chờ xử lý" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getSecurityScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSecurityScoreBg = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Bảo mật Hệ thống
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Giám sát và quản lý bảo mật hệ thống Auto Marketing
          </p>
        </div>

        {/* Mobile Stats Toggle */}
        <button
          onClick={() => setShowMobileStats(!showMobileStats)}
          className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Shield size={16} />
          <span>Thống kê</span>
        </button>

        <div className="flex space-x-2">
          <button className="px-3 sm:px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Quét bảo mật</span>
            <span className="sm:hidden">Quét</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
            <Settings size={16} />
            <span className="hidden sm:inline">Cài đặt</span>
            <span className="sm:hidden">Cài đặt</span>
          </button>
        </div>
      </div>

      {/* Security Score */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Điểm Bảo mật Tổng thể
          </h3>
          <span className="text-sm text-gray-500">
            Cập nhật:{" "}
            {new Date(securityData.overview.lastSecurityScan).toLocaleString(
              "vi-VN"
            )}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`relative w-32 h-32 ${getSecurityScoreBg(
              securityData.overview.securityScore
            )} rounded-full flex items-center justify-center`}
          >
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getSecurityScoreColor(
                  securityData.overview.securityScore
                )}`}
              >
                {securityData.overview.securityScore}
              </div>
              <div className="text-sm text-gray-600">/ 100</div>
            </div>
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-blue-500 rounded-full"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${
                  50 + (securityData.overview.securityScore * 3.6) / 100
                }% 0%, ${
                  50 + (securityData.overview.securityScore * 3.6) / 100
                }% 50%)`,
              }}
            ></div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {securityData.overview.securityScore >= 90
              ? "Hệ thống rất an toàn"
              : securityData.overview.securityScore >= 70
              ? "Hệ thống an toàn"
              : "Cần cải thiện bảo mật"}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
          showMobileStats ? "block" : "hidden sm:block"
        }`}
      >
        <motion.div
          className="bg-white rounded-lg shadow p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {securityData.overview.totalUsers}
              </p>
              <div className="text-xs text-gray-500">
                <span className="text-green-600 font-medium">
                  {securityData.overview.activeUsers}
                </span>{" "}
                đang hoạt động
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Đăng nhập thất bại
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {securityData.overview.failedLogins}
              </p>
              <div className="text-xs text-gray-500">24 giờ qua</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Hoạt động đáng ngờ
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {securityData.overview.suspiciousActivities}
              </p>
              <div className="text-xs text-gray-500">Cần xem xét</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">2FA</p>
              <p className="text-2xl font-bold text-gray-900">
                {securityData.securitySettings.twoFactorAuth ? "Bật" : "Tắt"}
              </p>
              <div className="text-xs text-gray-500">
                {securityData.securitySettings.twoFactorAuth
                  ? "Đang hoạt động"
                  : "Cần kích hoạt"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Stats Close Button */}
      {showMobileStats && (
        <div className="sm:hidden flex justify-end">
          <button
            onClick={() => setShowMobileStats(false)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <span>Đóng thống kê</span>
          </button>
        </div>
      )}

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Cài đặt Bảo mật
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Xác thực 2 yếu tố
              </span>
              <div
                className={`w-12 h-6 rounded-full transition-colors ${
                  securityData.securitySettings.twoFactorAuth
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                    securityData.securitySettings.twoFactorAuth
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Yêu cầu mã xác thực khi đăng nhập
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                Chính sách mật khẩu
              </span>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {securityData.securitySettings.passwordPolicy === "strong"
                ? "Mạnh"
                : "Yếu"}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Yêu cầu mật khẩu phức tạp
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                Thời gian phiên
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {securityData.securitySettings.sessionTimeout} phút
            </span>
            <p className="text-xs text-gray-500">
              Tự động đăng xuất sau thời gian không hoạt động
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                Số lần đăng nhập sai
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {securityData.securitySettings.failedLoginAttempts}
            </span>
            <p className="text-xs text-gray-500">
              Tài khoản bị khóa sau số lần thất bại
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                Thời gian khóa
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {securityData.securitySettings.accountLockoutDuration} phút
            </span>
            <p className="text-xs text-gray-500">Thời gian tài khoản bị khóa</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">
                IP Whitelist
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {securityData.securitySettings.ipWhitelist.length} mạng
            </span>
            <p className="text-xs text-gray-500">
              Chỉ cho phép truy cập từ IP được phép
            </p>
          </div>
        </div>
      </div>

      {/* Recent Security Activities */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Hoạt động Bảo mật Gần đây
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] sm:min-w-[900px] lg:min-w-[1000px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                  Vị trí
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]">
                  Thời gian
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityData.recentActivities.map((activity, index) => (
                <motion.tr
                  key={activity.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-4 py-4">
                    {getActivityIcon(activity.type)}
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                      title={activity.user}
                    >
                      {activity.user}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 font-mono">
                      {activity.ip}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className="text-sm text-gray-900 truncate max-w-[150px]"
                      title={activity.location}
                    >
                      {activity.location}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(activity.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(activity.timestamp).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString(
                        "vi-VN",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Hành động Nhanh
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Quét bảo mật
              </span>
            </div>
            <p className="text-xs text-gray-500">Kiểm tra toàn bộ hệ thống</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Quản lý người dùng
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Xem và quản lý quyền truy cập
            </p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Database className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Backup dữ liệu
              </span>
            </div>
            <p className="text-xs text-gray-500">Sao lưu dữ liệu hệ thống</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
            <div className="flex items-center mb-2">
              <Download className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Báo cáo bảo mật
              </span>
            </div>
            <p className="text-xs text-gray-500">Xuất báo cáo chi tiết</p>
          </button>
        </div>
      </div>
    </div>
  );
}
