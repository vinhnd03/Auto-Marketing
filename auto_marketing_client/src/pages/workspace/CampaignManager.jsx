import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  FilePlus,
  Search,
  SortAsc,
  SortDesc,
  EyeIcon,
  Megaphone,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  CreateCampaignForm,
  DeleteConfirmationModal,
  EditCampaignForm,
} from "../../components";
export default function CampaignManager() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    setCampaigns(allCampaigns);
  }, []);

  const allCampaigns = [
    {
      id: 1,
      name: "Chiến dịch Facebook T9",
      description: "Quảng cáo sản phẩm mới trên Facebook.",
      startDate: "2025-08-01",
      endDate: "2025-08-31",
      status: "Đang hoạt động",
    },
    {
      id: 2,
      name: "Chiến dịch Email Mùa Hè",
      description: "Gửi email khuyến mãi mùa hè.",
      startDate: "2025-07-01",
      endDate: "2025-07-15",
      status: "Đã kết thúc",
    },
    {
      id: 3,
      name: "TikTok Trending",
      description: "Chạy video ngắn trên TikTok.",
      startDate: "2025-08-05",
      endDate: "2025-08-20",
      status: "Sắp bắt đầu",
    },
    {
      id: 4,
      name: "Chiến dịch Shopee Sale",
      description: "Flash Sale toàn sàn Shopee.",
      startDate: "2025-08-10",
      endDate: "2025-08-30",
      status: "Sắp bắt đầu",
    },
    {
      id: 5,
      name: "Zalo Ads Tháng 9",
      description: "Chạy quảng cáo video ngắn.",
      startDate: "2025-08-01",
      endDate: "2025-08-15",
      status: "Đang hoạt động",
    },
    {
      id: 6,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 7,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 8,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 9,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 10,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 11,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 12,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 13,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
    {
      id: 14,
      name: "Instagram Influencer",
      description: "Hợp tác với KOLs IG.",
      startDate: "2025-08-01",
      endDate: "2025-08-20",
      status: "Đang hoạt động",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState(null);

  const filteredCampaigns = campaigns
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((c) => {
      if (!searchDate) return true;
      return c.startDate === searchDate || c.endDate === searchDate;
    });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedCampaigns.length / recordsPerPage);
  const paginatedCampaigns = sortedCampaigns.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleDelete = (id) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    setShowDeleteModal(false);
  };
  const handleUpdateCampaign = (updatedCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c))
    );
    setShowEditModal(false);
  };

  return (
    <div className="bg-blue-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 mb-6 ">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-500">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text leading-snug pb-1">
                Quản lý chiến dịch
              </h1>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={() => setShowForm(true)}
            >
              <FilePlus size={18} />
              <span className="text-sm font-medium">Thêm mới</span>
            </button>

            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                  <CreateCampaignForm
                    onSubmit={(newCampaign) => {
                      setCampaigns([
                        ...campaigns,
                        { ...newCampaign, id: Date.now() },
                      ]);
                      setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center bg-white border rounded-md shadow-sm w-full">
                <span className="px-3 text-gray-500">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full px-2 py-2 focus:outline-none text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Sort */}
              <div className="flex gap-2 items-center">
                <label className="text-sm text-gray-600">Sắp xếp:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="startDate">Ngày bắt đầu</option>
                  <option value="endDate">Ngày kết thúc</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="text-gray-600 hover:text-gray-800"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )}
                </button>
              </div>

              {/* Refresh Active (Chủ đề) tab trigger */}
              <button
                type="button"
                onClick={() => {
                  // phát sự kiện để tab "Chủ đề"/Active refetch ngay
                  window.dispatchEvent(
                    new CustomEvent("campaign:refresh-active")
                  );
                }}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                title="Làm mới tab Chủ đề"
              >
                Làm mới Chủ đề
              </button>

              {/* Records per page */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Hiển thị:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} bản ghi
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-[700px] w-full table-auto border text-sm">
              <thead className="bg-blue-50 text-gray-700">
                <tr>
                  <th className="p-2 border">Tên</th>
                  <th className="p-2 border">Mô tả</th>
                  <th className="p-2 border">Bắt đầu</th>
                  <th className="p-2 border">Kết thúc</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{c.name}</td>
                    <td className="p-2 border">{c.description}</td>
                    <td className="p-2 border">{c.startDate}</td>
                    <td className="p-2 border">{c.endDate}</td>
                    <td className="p-2 border">{c.status}</td>
                    <td className="p-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setCampaignToEdit(c);
                            setShowEditModal(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            setCampaignToDelete(c);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="text-gray-700 hover:text-black">
                          <EyeIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            campaignName={campaignToDelete?.name}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => handleDelete(campaignToDelete.id)}
          />
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {/* Nút về trang đầu */}
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

            {/* Nút về trang trước */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              ‹
            </button>

            {/* Hiển thị trang */}
            <div className="text-sm text-gray-600 px-2">
              Trang {currentPage} / {totalPages}
            </div>

            {/* Nút sang trang sau */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              ›
            </button>

            {/* Nút sang trang cuối */}
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
          {showEditModal && campaignToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <EditCampaignForm
                    initialData={campaignToEdit}
                    onSubmit={handleUpdateCampaign}
                    onCancel={() => setShowEditModal(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
