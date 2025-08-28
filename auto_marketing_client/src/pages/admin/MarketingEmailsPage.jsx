import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  Eye,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  BarChart3,
} from "lucide-react";

const MarketingEmailsPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);

  const stats = [
    {
      title: "Tổng email campaigns",
      value: "89",
      change: "+12",
      changeType: "positive",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Emails đã gửi",
      value: "2.4M",
      change: "+18.5%",
      changeType: "positive",
      icon: Send,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tỷ lệ mở",
      value: "24.8%",
      change: "+2.3%",
      changeType: "positive",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Tỷ lệ click",
      value: "3.2%",
      change: "+0.8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const campaigns = [
    {
      id: "CAMP001",
      name: "Welcome Series - New Users",
      subject: "Chào mừng bạn đến với Auto Marketing!",
      status: "active",
      type: "Automated",
      recipients: 15420,
      sent: 15420,
      opened: 3824,
      clicked: 493,
      unsubscribed: 23,
      openRate: 24.8,
      clickRate: 3.2,
      lastSent: "2025-01-15 10:00:00",
      nextSend: "2025-01-16 10:00:00",
    },
    {
      id: "CAMP002",
      name: "Product Launch - Premium Package",
      subject: "Giới thiệu gói Premium mới với AI Marketing",
      status: "active",
      type: "One-time",
      recipients: 8900,
      sent: 8900,
      opened: 2136,
      clicked: 356,
      unsubscribed: 12,
      openRate: 24.0,
      clickRate: 4.0,
      lastSent: "2025-01-14 14:00:00",
      nextSend: null,
    },
    {
      id: "CAMP003",
      name: "Weekly Newsletter",
      subject: "Tin tức Marketing tuần này - 15/01/2025",
      status: "scheduled",
      type: "Recurring",
      recipients: 12500,
      sent: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      lastSent: null,
      nextSend: "2025-01-16 09:00:00",
    },
    {
      id: "CAMP004",
      name: "Abandoned Cart Recovery",
      subject: "Bạn có quên gì trong giỏ hàng không?",
      status: "active",
      type: "Automated",
      recipients: 2340,
      sent: 2340,
      opened: 702,
      clicked: 187,
      unsubscribed: 8,
      openRate: 30.0,
      clickRate: 8.0,
      lastSent: "2025-01-15 16:00:00",
      nextSend: "2025-01-16 16:00:00",
    },
    {
      id: "CAMP005",
      name: "Customer Feedback Request",
      subject: "Chia sẻ trải nghiệm của bạn với chúng tôi",
      status: "draft",
      type: "One-time",
      recipients: 0,
      sent: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      lastSent: null,
      nextSend: null,
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        text: "Hoạt động",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      scheduled: {
        text: "Đã lên lịch",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      draft: {
        text: "Nháp",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      paused: {
        text: "Tạm dừng",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      Automated: "bg-purple-100 text-purple-800 border-purple-200",
      "One-time": "bg-blue-100 text-blue-800 border-blue-200",
      Recurring: "bg-green-100 text-green-800 border-green-200",
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
                Email campaigns
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi tất cả email marketing campaigns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Tạo campaign mới
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

        {/* Campaigns Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách Campaigns
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm campaign..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="scheduled">Đã lên lịch</option>
                <option value="draft">Nháp</option>
                <option value="paused">Tạm dừng</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả loại</option>
                <option value="automated">Automated</option>
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người nhận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ mở
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ click
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lần gửi cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {campaign.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <span className="text-sm text-gray-900 truncate">
                          {campaign.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(campaign.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.recipients.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={
                          campaign.openRate > 20
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {campaign.openRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={
                          campaign.clickRate > 3
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {campaign.clickRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.lastSent || "Chưa gửi"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <BarChart3 size={16} />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900 p-1">
                          <Send size={16} />
                        </button>
                      </div>
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
              Tạo template mới
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Import danh sách
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Cài đặt automation
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

export default MarketingEmailsPage;
