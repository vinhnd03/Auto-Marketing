import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";

const TransactionRefundsPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);

  const stats = [
    {
      title: "Tổng yêu cầu hoàn tiền",
      value: "89",
      change: "+8.5%",
      changeType: "negative",
      icon: RotateCcw,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Tổng số tiền hoàn",
      value: "₫156,780",
      change: "+15.2%",
      changeType: "negative",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Hoàn tiền đã xử lý",
      value: "67",
      change: "+12.3%",
      changeType: "positive",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Đang chờ xử lý",
      value: "22",
      change: "+5.1%",
      changeType: "negative",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const refunds = [
    {
      id: "REF001",
      customer: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      originalAmount: "₫299,000",
      refundAmount: "₫299,000",
      package: "Gói Premium",
      reason: "Không hài lòng với dịch vụ",
      date: "2025-01-15 14:30",
      status: "completed",
      processingTime: "2 ngày",
    },
    {
      id: "REF002",
      customer: "Trần Thị B",
      email: "tranthib@email.com",
      originalAmount: "₫199,000",
      refundAmount: "₫199,000",
      package: "Gói Basic",
      reason: "Gói không phù hợp nhu cầu",
      date: "2025-01-15 13:45",
      status: "pending",
      processingTime: "Đang xử lý",
    },
    {
      id: "REF003",
      customer: "Lê Văn C",
      email: "levanc@email.com",
      originalAmount: "₫499,000",
      refundAmount: "₫499,000",
      package: "Gói Enterprise",
      reason: "Lỗi kỹ thuật từ hệ thống",
      date: "2025-01-15 12:20",
      status: "completed",
      processingTime: "1 ngày",
    },
    {
      id: "REF004",
      customer: "Phạm Thị D",
      email: "phamthid@email.com",
      originalAmount: "₫199,000",
      refundAmount: "₫199,000",
      package: "Gói Basic",
      reason: "Thay đổi ý định",
      date: "2025-01-15 11:15",
      status: "pending",
      processingTime: "Đang xử lý",
    },
    {
      id: "REF005",
      customer: "Hoàng Văn E",
      email: "hoangvane@email.com",
      originalAmount: "₫299,000",
      refundAmount: "₫299,000",
      package: "Gói Premium",
      reason: "Chất lượng dịch vụ kém",
      date: "2025-01-15 10:30",
      status: "completed",
      processingTime: "3 ngày",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        text: "Đã hoàn tiền",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      pending: {
        text: "Đang xử lý",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle size={16} className="text-green-500" />;
    }
    return <Clock size={16} className="text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Quản lý hoàn tiền
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi tất cả các yêu cầu hoàn tiền từ khách hàng
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
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

        {/* Refunds Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Yêu cầu hoàn tiền gần đây
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm hoàn tiền..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả trạng thái</option>
                <option value="completed">Đã hoàn tiền</option>
                <option value="pending">Đang xử lý</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hoàn tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gói dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền gốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền hoàn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lý do hoàn tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày yêu cầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian xử lý
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refunds.map((refund, index) => (
                  <motion.tr
                    key={refund.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {refund.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {refund.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {refund.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {refund.package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {refund.originalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      {refund.refundAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 max-w-xs truncate">
                        {refund.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {refund.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {refund.processingTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(refund.status)}
                        {getStatusBadge(refund.status)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">{refunds.length}</span> trong tổng
              số <span className="font-medium">{refunds.length}</span> yêu cầu
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
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Phê duyệt hoàn tiền
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Gửi email thông báo
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

export default TransactionRefundsPage;
