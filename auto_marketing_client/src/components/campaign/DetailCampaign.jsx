import { XCircle, Info } from "lucide-react";

const DetailCampaign = ({ campaign, onClose }) => {
  if (!campaign) return null;

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d) ? "—" : d.toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-medium rounded-full inline-block";
    switch (status) {
      case "ACTIVE":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Hoạt động
          </span>
        );
      case "INACTIVE":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>Ngưng</span>
        );
      case "FINISHED":
        return (
          <span className={`${base} bg-gray-200 text-gray-600`}>
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>{status}</span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Chi tiết chiến dịch
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Nội dung */}
      <div className="px-6 py-5 space-y-5">
        {/* Grid 2 cột */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
          <p>
            <strong>Tên:</strong> {campaign.name}
          </p>
          <p>
            <strong>Ngày tạo:</strong> {formatDate(campaign.createdAt)}
          </p>
          <p>
            <strong>Cập nhật:</strong> {formatDate(campaign.updatedAt)}
          </p>
          <p>
            <strong>Bắt đầu:</strong> {formatDate(campaign.startDate)}
          </p>
          <p>
            <strong>Trạng thái:</strong> {getStatusBadge(campaign.status)}
          </p>

          <p>
            <strong>Workspace:</strong> {campaign.workspace?.name || "—"}
          </p>
        </div>

        {/* Mô tả */}
        <div>
          <strong className="block mb-1">Mô tả:</strong>
          <div className="max-h-32 overflow-y-auto p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            {campaign.description || "—"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default DetailCampaign;
