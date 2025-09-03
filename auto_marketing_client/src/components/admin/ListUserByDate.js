import React, { useEffect, useState } from "react";
import { findById,search } from "../../service/admin/usersService";
import { Eye, Lock, Unlock, Search, Filter, X } from "lucide-react";
import UpdateUserModal from "./UpdateUser";

function ListUserByDate() {
  const [list, setList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errors, setErrors] = useState({ startDate: "", endDate: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
        handleSearch().then();
    }, [page]);
    const clearFilter = async () => {
        // reset state
        setStartDate("");
        setEndDate("");
        setErrors({ startDate: "", endDate: "" });
        setPage(1);

        // gọi lại API nhưng bỏ hết params lọc
        const result = await search("", "", 1, 5, null, null, null);
        setList(result.data);

        setTotalPages(result.totalPages);
    };

  const handleSearch = async () => {
    const { data, totalPages } = await search(
      null,
      null,
      page,
      null,
      startDate,
      endDate
    );
    setList(
      data.map((c) => ({
        ...c,
        status: c.status,
      }))
    );
    setTotalPages(totalPages);
    
  };

  const handleValid = () => {
    let valid = true;
    let newErrors = { startDate: "", endDate: "" };

    if (!startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
      valid = false;
    }
    if (!endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
      valid = false;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (start > end) {
        newErrors.startDate = "Ngày bắt đầu không được sau ngày kết thúc";
        valid = false;
      }
      if (end > today) {
        newErrors.endDate = "Ngày kết thúc không được sau hôm nay";
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const handleViewDetail = async (id) => {
    let us = await findById(id);
    setSelectedUser(us);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedUser(null);
  };

  const openModal = (user) => setModalUser(user);
  const closeModal = () => setModalUser(null);

  const handleUpdateSuccess = (id, newStatus) => {
    setList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Danh sách tài khoản theo ngày tạo
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Tổng quan hệ thống AutoMarketing
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
      </div>

      {/* Form tìm kiếm */}
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
          showMobileFilter ? "block" : "hidden sm:block"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Lọc theo ngày tạo */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-end sm:col-span-2 lg:col-span-1">
              <button
                onClick={() => {
                  if (handleValid()) {
                    setPage(1);
                    handleSearch().then();
                    setShowMobileFilter(false);
                  }
                }}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <Search size={16} />
                <span>Tìm kiếm</span>
              </button>
              <button
                onClick={() => {
                  clearFilter();
                  setShowMobileFilter(false);
                }}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
              >
                Xóa bộ lọc
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
            <X size={16} />
            <span>Đóng bộ lọc</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] sm:min-w-[700px] md:min-w-[800px] lg:min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  STT
                </th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Tên khách hàng
                </th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden sm:table-cell">
                  Email
                </th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell">
                  Ngày tạo
                </th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden lg:table-cell">
                  Gói đã mua
                </th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Trạng thái
                </th>
                <th className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm sm:text-base">
                        Không có tài khoản nào...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                      {(page - 1) * 5 + index + 1}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 truncate max-w-[80px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[160px] text-xs sm:text-sm">
                          {customer.name}
                        </span>
                        <span className="text-xs text-gray-500 sm:hidden truncate max-w-[80px]">
                          {customer.email}
                        </span>
                        <span className="text-xs text-gray-500 md:hidden truncate max-w-[80px]">
                          {formatDate(customer.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                      <span className="truncate block max-w-[150px] sm:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px]">
                        {customer.email}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                      <span className="truncate block max-w-[120px] sm:max-w-[160px] 2xl:max-w-[200px]">
                        {customer.subscriptions.length > 0
                          ? customer.subscriptions
                              .map((sub) => sub.plan?.name)
                              .join(", ")
                          : "Chưa mua gói nào"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          customer.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.status ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewDetail(customer.id)}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none transition-colors duration-200"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => openModal(customer)}
                          className={`p-1 sm:p-1.5 rounded-md focus:outline-none transition-colors duration-200 ${
                            customer.status
                              ? "text-green-400 hover:text-green-600 hover:bg-green-50"
                              : "text-red-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                          title={
                            customer.status
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                          }
                        >
                          {customer.status ? (
                            <Unlock size={14} className="sm:w-4 sm:h-4" />
                          ) : (
                            <Lock size={14} className="sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalUser && (
        <UpdateUserModal
          user={modalUser}
          isShowModal={!!modalUser}
          isCloseModal={closeModal}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {/* Card hiển thị chi tiết */}
      {showDetail && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Thông tin chi tiết khách hàng
                </h2>
                <button
                  onClick={closeDetail}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      ID:
                    </span>
                    <p className="text-sm sm:text-base text-gray-900">
                      {selectedUser.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      Tên:
                    </span>
                    <p className="text-sm sm:text-base text-gray-900">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      Email:
                    </span>
                    <p className="text-sm sm:text-base text-gray-900">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      Ngày tạo:
                    </span>
                    <p className="text-sm sm:text-base text-gray-900">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">
                      Trạng thái tài khoản:
                    </span>
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.status ? "Đang hoạt động" : "Đang bị khóa"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gói dịch vụ */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Gói dịch vụ đã mua
                </h3>
                {selectedUser.subscriptions?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedUser.subscriptions.map((sub, idx) => {
                      const today = new Date();
                      const endDate = sub.endDate
                        ? new Date(sub.endDate)
                        : null;
                      const isExpired = endDate && endDate < today;

                      return (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-gray-500">
                                Gói:
                              </span>
                              <p className="text-sm sm:text-base text-gray-900">
                                {sub.plan?.name} ({sub.plan?.durationDate} ngày)
                              </p>
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-gray-500">
                                Ngày mua:
                              </span>
                              <p className="text-sm sm:text-base text-gray-900">
                                {formatDate(sub.startDate)}
                              </p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-xs sm:text-sm font-medium text-gray-500">
                                Ngày hết hạn:
                              </span>
                              <p
                                className={`text-sm sm:text-base ${
                                  isExpired
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-900"
                                }`}
                              >
                                {isExpired
                                  ? "Đã hết hạn"
                                  : formatDate(sub.endDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base">Chưa mua gói nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trước
          </button>

          {(() => {
            const visiblePages = 5;
            let startPage = Math.max(1, page - 1);
            if (startPage + visiblePages - 1 > totalPages) {
              startPage = Math.max(1, totalPages - visiblePages + 1);
            }

            return [...Array(visiblePages)].map((_, i) => {
              const p = startPage + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                    page === p
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {p}
                </button>
              );
            });
          })()}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sau
          </button>
        </div>

        <div className="text-xs sm:text-sm text-gray-500">
          Trang {page} của {totalPages}
        </div>
      </div>
    </div>
  );
}

export default ListUserByDate;
