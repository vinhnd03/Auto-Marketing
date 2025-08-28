import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Dữ liệu mẫu
  const transactions = [
    {
      id: "TXN001",
      customerName: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      amount: 500000,
      currency: "VND",
      status: "success",
      type: "subscription",
      paymentMethod: "Credit Card",
      date: "2024-12-15T10:30:00",
      description: "Gói Premium - 3 tháng",
      transactionFee: 15000,
      netAmount: 485000,
    },
    {
      id: "TXN002",
      customerName: "Trần Thị B",
      email: "tranthib@email.com",
      amount: 1000000,
      currency: "VND",
      status: "pending",
      type: "one_time",
      paymentMethod: "Bank Transfer",
      date: "2024-12-15T09:15:00",
      description: "Gói Enterprise - 1 năm",
      transactionFee: 25000,
      netAmount: 975000,
    },
    {
      id: "TXN003",
      customerName: "Lê Văn C",
      email: "levanc@email.com",
      amount: 300000,
      currency: "VND",
      status: "failed",
      type: "subscription",
      paymentMethod: "Credit Card",
      date: "2024-12-15T08:45:00",
      description: "Gói Basic - 1 tháng",
      transactionFee: 10000,
      netAmount: 290000,
    },
    {
      id: "TXN004",
      customerName: "Phạm Thị D",
      email: "phamthid@email.com",
      amount: 750000,
      currency: "VND",
      status: "success",
      type: "one_time",
      paymentMethod: "PayPal",
      date: "2024-12-14T16:20:00",
      description: "Gói Pro - 6 tháng",
      transactionFee: 20000,
      netAmount: 730000,
    },
    {
      id: "TXN005",
      customerName: "Hoàng Văn E",
      email: "hoangvane@email.com",
      amount: 1200000,
      currency: "VND",
      status: "success",
      type: "subscription",
      paymentMethod: "Credit Card",
      date: "2024-12-14T14:10:00",
      description: "Gói Enterprise - 1 năm",
      transactionFee: 30000,
      netAmount: 1170000,
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: {
        color: "bg-green-100 text-green-800",
        text: "Thành công",
        icon: CheckCircle,
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Chờ xử lý",
        icon: Clock,
      },
      failed: {
        color: "bg-red-100 text-red-800",
        text: "Thất bại",
        icon: XCircle,
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800",
        text: "Đã hủy",
        icon: AlertTriangle,
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
      subscription: "bg-blue-100 text-blue-800",
      one_time: "bg-purple-100 text-purple-800",
      refund: "bg-orange-100 text-orange-800",
    };

    const typeText = {
      subscription: "Đăng ký",
      one_time: "Một lần",
      refund: "Hoàn tiền",
    };

    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
          typeColors[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {typeText[type] || type}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const methodIcons = {
      "Credit Card": "💳",
      "Bank Transfer": "🏦",
      PayPal: "📱",
      Cash: "💵",
    };

    return methodIcons[method] || "💳";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    const matchesType = filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = transactions.length;
  const successRate =
    (transactions.filter((t) => t.status === "success").length /
      totalTransactions) *
    100;
  const avgTransactionValue =
    totalRevenue / transactions.filter((t) => t.status === "success").length;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Tất cả Giao dịch
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Quản lý và theo dõi tất cả giao dịch thanh toán
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
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Làm mới</span>
            <span className="sm:hidden">Làm mới</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Xuất báo cáo</span>
            <span className="sm:hidden">Xuất</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng giao dịch
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tỷ lệ thành công
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {successRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Giá trị TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {(avgTransactionValue / 1000).toFixed(0)}K
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm giao dịch..."
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
                <option value="all">Tất cả trạng thái</option>
                <option value="success">Thành công</option>
                <option value="pending">Chờ xử lý</option>
                <option value="failed">Thất bại</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giao dịch
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tất cả loại</option>
                <option value="subscription">Đăng ký</option>
                <option value="one_time">Một lần</option>
                <option value="refund">Hoàn tiền</option>
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

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] sm:min-w-[1100px] lg:min-w-[1200px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Mã GD
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Số tiền
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Phương thức
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.id}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div
                        className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                        title={transaction.customerName}
                      >
                        {transaction.customerName}
                      </div>
                      <div
                        className="text-sm text-gray-500 truncate max-w-[200px]"
                        title={transaction.email}
                      >
                        {transaction.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-semibold">
                        {(transaction.amount / 1000).toFixed(0)}K{" "}
                        {transaction.currency}
                      </div>
                      <div className="text-xs text-gray-500">
                        Phí: {(transaction.transactionFee / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-4">
                    {getTypeBadge(transaction.type)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                      </span>
                      <span className="text-sm text-gray-900">
                        {transaction.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Làm mới"
                      >
                        <RefreshCw size={16} />
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
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có giao dịch nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all" || filterType !== "all"
              ? "Thử thay đổi bộ lọc tìm kiếm"
              : "Chưa có giao dịch nào được thực hiện"}
          </p>
        </div>
      )}
    </div>
  );
}
