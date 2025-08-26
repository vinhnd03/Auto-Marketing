import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  StopCircle,
  Edit,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  Clock,
} from "lucide-react";

export default function ActiveCampaignsPage() {
  const [showMobileStats, setShowMobileStats] = useState(false);

  // Dữ liệu mẫu cho chiến dịch đang chạy
  const activeCampaigns = [
    {
      id: 1,
      name: "Chiến dịch Black Friday 2024",
      type: "Social Media",
      startDate: "2024-11-20",
      endDate: "2024-11-30",
      budget: 5000000,
      spent: 3200000,
      remainingDays: 8,
      reach: 150000,
      engagement: 12500,
      conversion: 850,
      ctr: 2.8,
      cpc: 1250,
      roas: 3.2,
    },
    {
      id: 2,
      name: "Holiday Season Promotion",
      type: "Google Ads",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      budget: 8000000,
      spent: 4500000,
      remainingDays: 15,
      reach: 220000,
      engagement: 18500,
      conversion: 1200,
      ctr: 3.1,
      cpc: 980,
      roas: 4.1,
    },
    {
      id: 3,
      name: "New Year Special",
      type: "Facebook Ads",
      startDate: "2024-12-25",
      endDate: "2025-01-10",
      budget: 6000000,
      spent: 2800000,
      remainingDays: 12,
      reach: 180000,
      engagement: 14200,
      conversion: 920,
      ctr: 2.5,
      cpc: 1350,
      roas: 2.8,
    },
  ];

  const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = activeCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalReach = activeCampaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalConversion = activeCampaigns.reduce(
    (sum, c) => sum + c.conversion,
    0
  );
  const avgROAS =
    activeCampaigns.reduce((sum, c) => sum + c.roas, 0) /
    activeCampaigns.length;

  const getPerformanceColor = (metric, value) => {
    if (metric === "roas") {
      return value >= 4
        ? "text-green-600"
        : value >= 2.5
        ? "text-yellow-600"
        : "text-red-600";
    }
    if (metric === "ctr") {
      return value >= 3
        ? "text-green-600"
        : value >= 2
        ? "text-yellow-600"
        : "text-red-600";
    }
    if (metric === "cpc") {
      return value <= 1000
        ? "text-green-600"
        : value <= 1500
        ? "text-yellow-600"
        : "text-red-600";
    }
    return "text-gray-600";
  };

  const getBudgetProgress = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    return {
      percentage: Math.min(percentage, 100),
      color:
        percentage >= 80
          ? "bg-red-500"
          : percentage >= 60
          ? "bg-yellow-500"
          : "bg-green-500",
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Chiến dịch đang chạy
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Theo dõi và quản lý các chiến dịch marketing đang hoạt động
          </p>
        </div>

        {/* Mobile Stats Toggle */}
        <button
          onClick={() => setShowMobileStats(!showMobileStats)}
          className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <BarChart3 size={16} />
          <span>Thống kê</span>
        </button>

        <div className="flex space-x-2">
          <button className="px-3 sm:px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2 text-sm">
            <Pause size={16} />
            <span className="hidden sm:inline">Tạm dừng tất cả</span>
            <span className="sm:hidden">Tạm dừng</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm">
            <StopCircle size={16} />
            <span className="hidden sm:inline">Dừng tất cả</span>
            <span className="sm:hidden">Dừng</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${
          showMobileStats ? "block" : "hidden sm:block"
        }`}
      >
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang chạy</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeCampaigns.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng ngân sách
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalBudget / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tiếp cận</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalReach / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                ROAS trung bình
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {avgROAS.toFixed(1)}x
              </p>
            </div>
          </div>
        </div>
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

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeCampaigns.map((campaign) => {
          const budgetProgress = getBudgetProgress(
            campaign.spent,
            campaign.budget
          );

          return (
            <motion.div
              key={campaign.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-lg font-semibold text-white truncate"
                    title={campaign.name}
                  >
                    {campaign.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      className="p-1.5 text-white hover:bg-white/20 rounded transition-colors"
                      title="Tạm dừng"
                    >
                      <Pause size={16} />
                    </button>
                    <button
                      className="p-1.5 text-white hover:bg-white/20 rounded transition-colors"
                      title="Dừng"
                    >
                      <StopCircle size={16} />
                    </button>
                    <button
                      className="p-1.5 text-white hover:bg-white/20 rounded transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-2 text-blue-100 text-sm">
                  <Target size={14} className="mr-1" />
                  {campaign.type}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Time & Budget */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Clock size={16} className="text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Còn lại</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {campaign.remainingDays} ngày
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Ngân sách</div>
                    <div className="text-lg font-bold text-gray-900">
                      {(campaign.budget / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500">
                      Đã chi: {(campaign.spent / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>

                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Tiến độ ngân sách</span>
                    <span className="font-medium">
                      {budgetProgress.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${budgetProgress.color}`}
                      style={{ width: `${budgetProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Reach</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(campaign.reach / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Engagement</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {campaign.engagement.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Conversion</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {campaign.conversion.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">CTR</div>
                    <div
                      className={`text-sm font-semibold ${getPerformanceColor(
                        "ctr",
                        campaign.ctr
                      )}`}
                    >
                      {campaign.ctr}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">CPC</div>
                    <div
                      className={`text-sm font-semibold ${getPerformanceColor(
                        "cpc",
                        campaign.cpc
                      )}`}
                    >
                      {campaign.cpc.toLocaleString()}đ
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">ROAS</div>
                    <div
                      className={`text-sm font-semibold ${getPerformanceColor(
                        "roas",
                        campaign.roas
                      )}`}
                    >
                      {campaign.roas}x
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-3 border-t border-gray-200">
                  <button className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <Edit size={14} />
                    Chỉnh sửa
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                    <BarChart3 size={14} />
                    Báo cáo
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {activeCampaigns.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Play className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có chiến dịch nào đang chạy
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tất cả chiến dịch đã hoàn thành hoặc bị tạm dừng
          </p>
        </div>
      )}
    </div>
  );
}
