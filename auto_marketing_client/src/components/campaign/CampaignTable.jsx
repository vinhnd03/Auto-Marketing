import React, { useState, useEffect } from "react";
import { Pencil, Trash2, FilePlus, Eye } from "lucide-react";
import CampaignService from "../../service/campaignService";
import CreateCampaignForm from "../campaign/CreateCampaignForm";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import EditCampaignForm from "../campaign/EditCampaignForm";
import DetailCampaign from "../campaign/DetailCampaign";
import campaignService from "../../service/campaignService";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const CampaignTable = ({ campaigns = [], onTotalCampaignChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignList, setCampaignList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [campaignToView, setCampaignToView] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [totalCampaign, setTotalCampaign] = useState(0);
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const fetchCountCampaign = async () => {
    try {
      const campaignNumber = await campaignService.countCampaign(user.id);
      setTotalCampaign(campaignNumber);
      if (onTotalCampaignChange) {
        onTotalCampaignChange(campaignNumber); // truyền ra ngoài
      }
    } catch (err) {
      setTotalCampaign(null);
      if (onTotalCampaignChange) {
        onTotalCampaignChange(null);
      }
    }
  };
  const fetchData = async () => {
    setIsLoading(true);
    const { content, totalElements } = await CampaignService.findAllCampaign(
      currentPage - 1,
      recordsPerPage,
      searchTerm,
      startDate,
      endDate,
      workspaceId
    );
    setCampaignList(content);
    setTotalRecords(totalElements);
    setIsLoading(false);
    fetchCountCampaign();
  };

  useEffect(() => {
    fetchData();
    fetchCountCampaign();
  }, [currentPage, recordsPerPage, searchTerm, startDate, endDate]);

  const processedCampaigns = campaignList.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Sắp bắt đầu": { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Đang hoạt động": { bg: "bg-green-100", text: "text-green-800" },
      "Đã kết thúc": { bg: "bg-gray-100", text: "text-gray-800" },
    };
    const config = statusConfig[status] || statusConfig["Sắp bắt đầu"];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {status}
      </span>
    );
  };

  const handleCreateCampaign = async (newCampaign) => {
    try {
      const response = await CampaignService.create(newCampaign);

      if (response?.errors) {
        return { data: null, errors: response.errors };
      }

      setCurrentPage(1);
      const { content, totalElements } = await CampaignService.findAllCampaign(
        0, // pageIndex = 0
        recordsPerPage,
        searchTerm,
        startDate,
        endDate,
        workspaceId
      );
      setCampaignList(content);
      setTotalRecords(totalElements);
      setShowForm(false);
      toast.success("Thêm mới chiến dịch thành công");
      await fetchCountCampaign();
      return { data: response.data, errors: null };
    } catch (error) {
      console.error("Lỗi khi tạo campaign:", error);
      toast.error("Thêm mới chiến dịch thất bại");
      return {
        data: null,
        errors: error?.response?.data?.errors || {
          message: "Unexpected error occurred",
        },
      };
    }
  };

  const handleEditClick = async (id) => {
    try {
      setIsLoading(true);
      const response = await CampaignService.findById(id);
      if (response?.errors) {
        console.error("Lỗi khi lấy chi tiết campaign:", response.errors);
        return;
      }
      setCampaignToEdit(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      setIsLoading(true);
      const response = await CampaignService.softDelete(id);
      if (response?.errors) {
        console.error("Xóa thất bại:", response.errors);
        return;
      }

      // Reload dữ liệu sau khi xóa
      setCurrentPage(1);
      const { content, totalElements } = await CampaignService.findAllCampaign(
        0, // pageIndex = 0
        recordsPerPage,
        searchTerm,
        startDate,
        endDate,
        workspaceId
      );
      setCampaignList(content);
      setTotalRecords(totalElements);

      setShowDeleteModal(false);
      setCampaignToDelete(null);
      await fetchCountCampaign();
      toast.success("Xóa chiến dịch thành công");
    } catch (error) {
      console.error("Lỗi khi xóa campaign:", error);
      toast.error("Xóa chiến dịch thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCampaign = async (values) => {
    if (!campaignToEdit?.id) return;

    try {
      setIsLoading(true);
      const response = await CampaignService.update(campaignToEdit.id, values);

      if (response?.errors) {
        console.error("Lỗi khi cập nhật campaign:", response.errors);
        return { data: null, errors: response.errors };
      }

      // reload dữ liệu bảng
      const { content, totalElements } = await CampaignService.findAllCampaign(
        currentPage - 1,
        recordsPerPage,
        searchTerm,
        startDate,
        endDate,
        workspaceId
      );
      setCampaignList(content);
      setTotalRecords(totalElements);
      setShowEditModal(false);
      toast.success("Cập nhật chiến dịch thành công");
      return { data: response.data, errors: null };
    } catch (error) {
      console.error("Lỗi khi cập nhật campaign:", error);
      toast.error("Cập nhật chiến dịch thất bại");
      return {
        data: null,
        errors: error?.response?.data || { message: "Unexpected error" },
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="bg-gray-50 min-h-screen p-4 sm:p-8 rounded-xl shadow-inner font-sans antialiased text-gray-900">
      {showForm ? (
        <CreateCampaignForm
          onSubmit={handleCreateCampaign}
          onCancel={() => setShowForm(false)}
          onUploadSuccess={fetchData}
          errors={errors}
        />
      ) : (
        <>
          <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto px-2 sm:px-6 lg:px-12">
            <div className="space-y-8">
              {/* Phần tiêu đề và nút tạo mới */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Chiến dịch trong workspace
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mt-1">
                    Quản lý và theo dõi các chiến dịch marketing của bạn một cách dễ dàng và trực quan hơn.
                  </p>
                </div>
                <button
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-colors"
                  onClick={() => setShowForm(true)}
                >
                  <FilePlus size={18} />
                  <span className="text-sm font-medium">
                    Tạo chiến dịch mới
                  </span>
                </button>
              </div>

              {/* Phần tìm kiếm và lọc */}
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6 w-full">
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-500 mb-1">
                      Chiến dịch
                    </label>
                    <input
                      type="text"
                      placeholder="Tìm kiếm chiến dịch..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-3 border rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-500 mb-1">
                      Từ ngày
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-4 py-3 border rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-500 mb-1">
                      Đến ngày
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-3 border rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="text-xs text-gray-500 mb-1">
                      Hiển thị
                    </label>
                    <select
                      value={recordsPerPage}
                      onChange={(e) => {
                        setRecordsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5 bản ghi</option>
                      <option value={10}>10 bản ghi</option>
                      <option value={20}>20 bản ghi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Phần bảng hiển thị chính */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Tên chiến dịch
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Mô tả
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Từ ngày
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Đến ngày
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Trạng thái
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <svg
                                className="animate-spin h-8 w-8 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <p className="mt-2 text-lg font-medium">
                                Đang tải dữ liệu...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : processedCampaigns.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <FilePlus
                                size={48}
                                className="mb-2 text-gray-300"
                              />
                              <p className="text-lg font-medium">
                                Không tìm thấy chiến dịch nào
                              </p>
                              <p className="text-sm mt-1">
                                Hãy thử tìm kiếm với từ khóa khác
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        processedCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-6 py-5">
                              <div className="text-sm font-medium text-gray-900">
                                {campaign.name}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-600 max-w-xs truncate">
                                {campaign.description}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-base text-gray-600">
                              {new Date(campaign.startDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-6 py-5 text-base text-gray-600">
                              {new Date(campaign.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-6 py-5">
                              {getStatusBadge(campaign.status)}
                            </td>
                            <td className="px-6 py-5 text-base font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Xem chi tiết"
                                  onClick={() => {
                                    setCampaignToView(campaign);
                                    setShowDetailModal(true);
                                  }}
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Chỉnh sửa"
                                  onClick={() => handleEditClick(campaign.id)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Xóa"
                                  onClick={() => {
                                    setCampaignToDelete(campaign);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Phần phân trang */}
                {totalRecords > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-sm text-gray-600">
                        Hiển thị{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * recordsPerPage + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * recordsPerPage, totalRecords)}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-medium">{totalRecords}</span> kết
                        quả
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md text-sm border ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          «
                        </button>
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md text-sm border ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          ‹
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-700">
                          {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md text-sm border ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          ›
                        </button>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md text-sm border ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          »
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {showEditModal && campaignToEdit && (
        <>
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 99999,
              margin: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                width: "100%",
                maxWidth: "672px",
                maxHeight: "90vh",
                overflowY: "auto",
                margin: "16px",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "24px" }}>
                <EditCampaignForm
                  initialData={campaignToEdit}
                  onSubmit={handleUpdateCampaign}
                  onCancel={() => setShowEditModal(false)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {showDetailModal && campaignToView && (
        <>
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 99999,
              margin: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                width: "100%",
                maxWidth: "672px",
                maxHeight: "90vh",
                overflowY: "auto",
                margin: "16px",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "24px" }}>
                <DetailCampaign
                  campaign={campaignToView}
                  onClose={() => setShowDetailModal(false)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        campaignName={campaignToDelete?.name}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteCampaign(campaignToDelete.id)}
      />
    </div>
  );
};

export default CampaignTable;
