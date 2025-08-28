import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";

export default function CampaignPerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showConversions, setShowConversions] = useState(true);

  // Dữ liệu mẫu
  const performanceData = {
    overview: {
      totalCampaigns: 12,
      activeCampaigns: 5,
      totalSpent: 25000000,
      totalRevenue: 85000000,
      avgROAS: 3.4,
      totalConversions: 3200,
      avgCTR: 2.8,
      avgCPC: 1150,
    },
    trends: {
      labels: [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ],
      revenue: [
        12000000, 15000000, 18000000, 22000000, 25000000, 28000000, 32000000,
        35000000, 38000000, 42000000, 45000000, 48000000,
      ],
      spent: [
        8000000, 9500000, 11000000, 13000000, 15000000, 17000000, 19000000,
        21000000, 23000000, 25000000, 27000000, 29000000,
      ],
      conversions: [
        800, 950, 1100, 1300, 1500, 1700, 1900, 2100, 2300, 2500, 2700, 2900,
      ],
    },
    topCampaigns: [
      {
        id: 1,
        name: "Black Friday 2024",
        type: "Social Media",
        spent: 5000000,
        revenue: 18000000,
        roas: 3.6,
        conversions: 450,
        ctr: 3.2,
        cpc: 980,
      },
      {
        id: 2,
        name: "Holiday Season",
        type: "Google Ads",
        spent: 8000000,
        revenue: 25000000,
        roas: 3.1,
        conversions: 680,
        ctr: 2.8,
        cpc: 1250,
      },
      {
        id: 3,
        name: "Summer Sale",
        type: "Facebook Ads",
        spent: 4000000,
        revenue: 12000000,
        roas: 3.0,
        conversions: 320,
        ctr: 2.5,
        cpc: 1350,
      },
    ],
  };

  const getGrowthRate = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getPerformanceColor = (value, isPositive = true) => {
    if (isPositive) {
      return value >= 0 ? "text-green-600" : "text-red-600";
    }
    return value <= 0 ? "text-green-600" : "text-red-600";
  };

  const getROASColor = (roas) => {
    if (roas >= 4) return "text-green-600";
    if (roas >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Hiệu suất Chiến dịch
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Phân tích và báo cáo hiệu suất tổng thể của các chiến dịch marketing
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter size={16} />
          <span>Bộ lọc</span>
        </button>

        <div className="flex space-x-2">
          <button className="px-3 sm:px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Xuất báo cáo</span>
            <span className="sm:hidden">Xuất</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
          showMobileFilter ? "block" : "hidden sm:block"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng thời gian
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
                <option value="365">1 năm qua</option>
              </select>
            </div>

            {/* Campaign Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại chiến dịch
              </label>
              <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Tất cả loại</option>
                <option>Social Media</option>
                <option>Google Ads</option>
                <option>Facebook Ads</option>
                <option>Email Marketing</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Tất cả trạng thái</option>
                <option>Đang chạy</option>
                <option>Hoàn thành</option>
                <option>Tạm dừng</option>
              </select>
            </div>

            {/* View Options */}
            <div className="flex items-end space-x-2">
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2 rounded-lg transition-colors ${
                  showRevenue
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Hiển thị doanh thu"
              >
                <DollarSign size={16} />
              </button>
              <button
                onClick={() => setShowConversions(!showConversions)}
                className={`p-2 rounded-lg transition-colors ${
                  showConversions
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="Hiển thị chuyển đổi"
              >
                <Users size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Close Button */}
      {showMobileFilter && (
        <div className="sm:hidden flex justify-end">
          <button
            onClick={() => setShowMobileFilter(false)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <span>Đóng bộ lọc</span>
          </button>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="bg-white rounded-lg shadow p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng chiến dịch
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData.overview.totalCampaigns}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-green-600 font-medium">
                  +{performanceData.overview.activeCampaigns} đang chạy
                </span>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(performanceData.overview.totalRevenue / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <TrendingUp size={12} className="text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+15.2%</span>
                <span className="ml-1">so với tháng trước</span>
              </div>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                ROAS trung bình
              </p>
              <p
                className={`text-2xl font-bold ${getROASColor(
                  performanceData.overview.avgROAS
                )}`}
              >
                {performanceData.overview.avgROAS}x
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-green-600 font-medium">+0.3x</span>
                <span className="ml-1">so với tháng trước</span>
              </div>
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng chuyển đổi
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceData.overview.totalConversions.toLocaleString()}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-green-600 font-medium">+8.5%</span>
                <span className="ml-1">so với tháng trước</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Biểu đồ hiệu suất
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Chỉ số:</span>
            <button
              onClick={() => setShowRevenue(!showRevenue)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                showRevenue
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Doanh thu
            </button>
            <button
              onClick={() => setShowConversions(!showConversions)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                showConversions
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Chuyển đổi
            </button>
          </div>
        </div>

        <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500">Biểu đồ hiệu suất chiến dịch</p>
            <p className="text-sm text-gray-400">
              Tích hợp Chart.js để hiển thị dữ liệu
            </p>
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Top Chiến dịch Hiệu suất Cao
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[800px] sm:min-w-[900px] lg:min-w-[1000px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                  Tên chiến dịch
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Chi tiêu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Doanh thu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  ROAS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Chuyển đổi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.topCampaigns.map((campaign, index) => (
                <motion.tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <div
                          className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                          title={campaign.name}
                        >
                          {campaign.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {campaign.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {campaign.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {(campaign.spent / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {(campaign.revenue / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getROASColor(
                        campaign.roas
                      )}`}
                    >
                      {campaign.roas}x
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {campaign.conversions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      CTR: {campaign.ctr}%
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {performanceData.topCampaigns.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có dữ liệu hiệu suất
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Chưa có chiến dịch nào hoàn thành để phân tích hiệu suất
          </p>
        </div>
      )}
    </div>
  );
}
