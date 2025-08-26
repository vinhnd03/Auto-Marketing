import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";

const TransactionFailedPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);

  const stats = [
    {
      title: "Tổng giao dịch thất bại",
      value: "156",
      change: "+5.2%",
      changeType: "negative",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Tổng số tiền thất bại",
      value: "₫89,450",
      change: "+12.8%",
      changeType: "negative",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Tỷ lệ thất bại",
      value: "1.3%",
      change: "+0.2%",
      changeType: "negative",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Giao dịch thất bại hôm nay",
      value: "8",
      change: "-15.4%",
      changeType: "positive",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const transactions = [
    {
      id: "TXN001",
      customer: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      amount: "₫299,000",
      package: "Gói Premium",
      paymentMethod: "Credit Card",
      date: "2025-01-15 14:30",
      status: "failed",
      reason: "Thẻ tín dụng bị từ chối",
    },
    {
      id: "TXN002",
      customer: "Trần Thị B",
      email: "tranthib@email.com",
      amount: "₫199,000",
      package: "Gói Basic",
      paymentMethod: "Bank Transfer",
      date: "2025-01-15 13:45",
      status: "failed",
      reason: "Số dư không đủ",
    },
    {
      id: "TXN003",
      customer: "Lê Văn C",
      email: "levanc@email.com",
      amount: "₫499,000",
      package: "Gói Enterprise",
      paymentMethod: "Credit Card",
      date: "2025-01-15 12:20",
      status: "failed",
      reason: "Thẻ bị khóa",
    },
    {
      id: "TXN004",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      amount: "₫199,000",
      package: "Gói Basic",
      paymentMethod: "Bank Transfer",
      date: "2025-01-15 11:15",
      status: "failed",
      reason: "Lỗi kết nối ngân hàng",
    },
    {
      id: "TXN005",
      customer: "Hoàng Văn E",
      email: "hoangvane@email.com",
      amount: "₫299,000",
      package: "Gói Premium",
      paymentMethod: "Credit Card",
      date: "2025-01-15 10:30",
      status: "failed",
      reason: "Thẻ hết hạn",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      failed: {
        text: "Thất bại",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.failed;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const iconConfig = {
      "Credit Card": CreditCard,
      "Bank Transfer": User,
    };

    const Icon = iconConfig[method] || CreditCard;
    return <Icon size={16} className="text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi tất cả các giao dịch thanh toán thất bại
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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

        {/* Failed Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Giao dịch thất bại gần đây
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm giao dịch..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả lý do</option>
                <option value="card_declined">Thẻ bị từ chối</option>
                <option value="insufficient_funds">Số dư không đủ</option>
                <option value="card_locked">Thẻ bị khóa</option>
                <option value="bank_error">Lỗi ngân hàng</option>
                <option value="expired">Thẻ hết hạn</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã giao dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gói dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày giao dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lý do thất bại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="text-sm text-gray-900">
                          {transaction.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-sm text-gray-900 max-w-xs truncate">
                          {transaction.reason}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">{transactions.length}</span> trong
              tổng số <span className="font-medium">{transactions.length}</span>{" "}
              giao dịch
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

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Gửi email thông báo
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Thử lại thanh toán
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Liên hệ khách hàng
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Cập nhật trạng thái
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFailedPage;
