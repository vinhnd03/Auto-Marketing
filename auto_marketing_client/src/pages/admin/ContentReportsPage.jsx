import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Users,
  FileText,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

const ContentReportsPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const stats = [
    {
      title: "Tổng lượt xem",
      value: "2.4M",
      change: "+18.5%",
      changeType: "positive",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tổng tương tác",
      value: "156K",
      change: "+23.7%",
      changeType: "positive",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Thời gian đọc trung bình",
      value: "4.2 phút",
      change: "+8.9%",
      changeType: "positive",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Tỷ lệ thoát",
      value: "32.1%",
      change: "-5.2%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const topContent = [
    {
      id: "POST001",
      title: "Hướng dẫn Marketing Automation cho người mới bắt đầu",
      category: "Marketing",
      views: 15420,
      engagement: 89.5,
      avgTime: "6.2 phút",
      bounceRate: "28.3%",
      conversion: "12.4%",
    },
    {
      id: "POST002",
      title: "Top 10 công cụ AI hỗ trợ Content Marketing",
      category: "AI Tools",
      views: 12890,
      engagement: 92.1,
      avgTime: "5.8 phút",
      bounceRate: "25.7%",
      conversion: "15.2%",
    },
    {
      id: "POST003",
      title: "Chiến lược SEO cho website thương mại điện tử",
      category: "SEO",
      views: 9876,
      engagement: 87.3,
      avgTime: "4.9 phút",
      bounceRate: "31.2%",
      conversion: "10.8%",
    },
    {
      id: "POST004",
      title: "Cách tối ưu hóa tỷ lệ chuyển đổi trong Marketing",
      category: "Conversion",
      views: 8765,
      engagement: 85.9,
      avgTime: "5.1 phút",
      bounceRate: "33.8%",
      conversion: "9.7%",
    },
    {
      id: "POST005",
      title: "Xu hướng Digital Marketing năm 2025",
      category: "Trends",
      views: 7654,
      engagement: 91.2,
      avgTime: "6.5 phút",
      bounceRate: "22.1%",
      conversion: "18.3%",
    },
  ];

  const categoryPerformance = [
    { category: "Marketing", views: 45600, engagement: 88.5, conversion: 13.2 },
    { category: "AI Tools", views: 38900, engagement: 91.2, conversion: 16.8 },
    { category: "SEO", views: 32400, engagement: 86.7, conversion: 11.5 },
    { category: "Conversion", views: 28700, engagement: 84.3, conversion: 9.8 },
    { category: "Trends", views: 23400, engagement: 89.1, conversion: 14.6 },
  ];

  const getEngagementColor = (engagement) => {
    if (engagement >= 90) return "text-green-600";
    if (engagement >= 80) return "text-blue-600";
    if (engagement >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getConversionColor = (conversion) => {
    if (conversion >= 15) return "text-green-600";
    if (conversion >= 10) return "text-blue-600";
    if (conversion >= 5) return "text-yellow-600";
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
                Báo cáo nội dung
              </h1>
              <p className="text-gray-600 mt-2">
                Phân tích hiệu suất và thống kê chi tiết về nội dung
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
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

        {/* Top Performing Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Nội dung hiệu suất cao nhất
            </h2>
            <div className="flex items-center gap-3">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả danh mục</option>
                <option value="marketing">Marketing</option>
                <option value="ai-tools">AI Tools</option>
                <option value="seo">SEO</option>
                <option value="conversion">Conversion</option>
                <option value="trends">Trends</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tương tác (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian đọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ thoát
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chuyển đổi (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topContent.map((content, index) => (
                  <motion.tr
                    key={content.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {content.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {content.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {content.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {content.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getEngagementColor(content.engagement)}>
                        {content.engagement}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {content.avgTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {content.bounceRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={getConversionColor(content.conversion)}>
                        {content.conversion}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Hiệu suất theo danh mục
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Lượt xem theo danh mục
              </h4>
              <div className="space-y-3">
                {categoryPerformance.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {category.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(category.views / 50000) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-16 text-right">
                        {category.views.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Tỷ lệ tương tác & chuyển đổi
              </h4>
              <div className="space-y-3">
                {categoryPerformance.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {category.category}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-600">
                          {category.engagement}%
                        </div>
                        <div className="text-xs text-gray-500">Tương tác</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-green-600">
                          {category.conversion}%
                        </div>
                        <div className="text-xs text-gray-500">Chuyển đổi</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
              Tạo báo cáo tùy chỉnh
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Phân tích xu hướng
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              So sánh hiệu suất
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Đề xuất tối ưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentReportsPage;
