import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Play,
  Pause,
  StopCircle,
  Edit,
  Trash,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Dữ liệu mẫu
  const campaigns = [
    {
      id: 1,
      name: "Chiến dịch Black Friday 2024",
      status: "active",
      type: "Social Media",
      startDate: "2024-11-20",
      endDate: "2024-11-30",
      budget: 5000000,
      spent: 3200000,
      reach: 150000,
      engagement: 12500,
      conversion: 850,
    },
    {
      id: 2,
      name: "Campaign Tết Nguyên Đán",
      status: "pending",
      type: "Email Marketing",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      budget: 3000000,
      spent: 0,
      reach: 0,
      engagement: 0,
      conversion: 0,
    },
    {
      id: 3,
      name: "Summer Sale 2024",
      status: "completed",
      type: "Google Ads",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      budget: 8000000,
      spent: 8000000,
      reach: 250000,
      engagement: 18000,
      conversion: 1200,
    },
    {
      id: 4,
      name: "Back to School",
      status: "paused",
      type: "Facebook Ads",
      startDate: "2024-08-15",
      endDate: "2024-09-30",
      budget: 4000000,
      spent: 1800000,
      reach: 95000,
      engagement: 7200,
      conversion: 480,
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800",
        text: "Đang chạy",
        icon: Play,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Chờ xử lý",
        icon: Calendar,
      },
      completed: {
        color: "bg-blue-100 text-blue-800",
        text: "Hoàn thành",
        icon: TrendingUp,
      },
      paused: {
        color: "bg-orange-100 text-orange-800",
        text: "Tạm dừng",
        icon: Pause,
      },
      stopped: {
        color: "bg-red-100 text-red-800",
        text: "Đã dừng",
        icon: StopCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      "Social Media": "bg-purple-100 text-purple-800",
      "Email Marketing": "bg-indigo-100 text-indigo-800",
      "Google Ads": "bg-blue-100 text-blue-800",
      "Facebook Ads": "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
          typeColors[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Tất cả Chiến dịch
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Quản lý và theo dõi tất cả chiến dịch marketing
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

        <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition flex items-center gap-2 text-sm sm:text-base">
          <Plus size={18} />
          <span className="hidden sm:inline">Tạo chiến dịch</span>
          <span className="sm:hidden">Tạo</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng chiến dịch
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang chạy</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeCampaigns}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã chi tiêu</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalSpent / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
          showMobileFilter ? "block" : "hidden sm:block"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm chiến dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang chạy</option>
                <option value="pending">Chờ xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="paused">Tạm dừng</option>
                <option value="stopped">Đã dừng</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng thời gian
              </label>
              <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Tất cả thời gian</option>
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
                <option>90 ngày qua</option>
                <option>Năm 2024</option>
              </select>
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

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] sm:min-w-[1000px] lg:min-w-[1200px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                  Tên chiến dịch
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Thời gian
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Ngân sách
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Hiệu suất
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => (
                <motion.tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-4 py-4">
                    <div>
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
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="px-4 py-4">{getTypeBadge(campaign.type)}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      <div>
                        {new Date(campaign.startDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      <div className="text-gray-500">
                        đến{" "}
                        {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        {(campaign.budget / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-gray-500">
                        Đã chi: {(campaign.spent / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Reach: {campaign.reach.toLocaleString()}</div>
                      <div className="text-gray-500">
                        Engagement: {campaign.engagement.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có chiến dịch nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? "Thử thay đổi bộ lọc tìm kiếm"
              : "Bắt đầu tạo chiến dịch đầu tiên của bạn"}
          </p>
        </div>
      )}
    </div>
  );
}
