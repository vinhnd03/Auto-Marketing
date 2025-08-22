import { FaFacebookF } from "react-icons/fa";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SelectPagesModal = ({ isOpen, onClose, onSuccess, userId }) => {
  const [pages, setPages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchFanpages = async () => {
      setLoading(true);
      try {
        // 1️⃣ Đồng bộ fanpage từ Facebook dựa trên access token
        await fetch(`http://localhost:8080/api/fanpages/sync?userId=${userId}`, {
          method: "POST",
        });

        // 2️⃣ Lấy danh sách fanpage đã sync từ DB
        const res = await fetch(`http://localhost:8080/api/fanpages?userId=${userId}`);
        if (!res.ok) throw new Error("Lỗi khi lấy danh sách Fanpage");
        const data = await res.json();
        setPages(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Không thể lấy danh sách Fanpage");
      } finally {
        setLoading(false);
      }
    };

    fetchFanpages();
  }, [isOpen, userId]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const selectedPages = pages.filter((p) => selectedIds.includes(p.id));
    onSuccess?.(selectedPages);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white rounded-xl shadow-lg z-50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Chọn Fanpage</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Danh sách Fanpage */}
        <div className="px-6 py-4 space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500 text-center">Đang tải fanpage...</p>
          ) : pages.length === 0 ? (
            <p className="text-gray-500 text-center">Chưa có fanpage nào</p>
          ) : (
            pages.map((page) => (
              <label
                key={page.id}
                className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 relative">
                  {page.avatarUrl ? (
                    <img
                      src={page.avatarUrl}
                      alt={page.pageName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold bg-blue-500">
                      {page.pageName.charAt(0)}
                    </div>
                  )}
                  <span className="text-gray-800 font-medium">{page.pageName}</span>
                  <span className="absolute left-7 bottom-0 bg-blue-600 p-[2px] rounded-full">
                    <FaFacebookF className="text-white text-[10px]" />
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={selectedIds.includes(page.id)}
                  onChange={() => toggleSelect(page.id)}
                />
              </label>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleFinish}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPagesModal;
