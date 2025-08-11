import { FaFacebookF } from "react-icons/fa";
import { X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const SelectPagesModal = ({ isOpen, onClose }) => {
  const {user, updateProfile} = useAuth();

  // Danh sách page mẫu
  const pages = [
    { id: 1, name: "Page 1", avatarColor: "bg-sky-400" },
    { id: 2, name: "Page 2", avatarColor: "bg-orange-400" },
  ];

  const changeUserStatus = () => {
    const newUser = {
      ...user,
      isNew: false,
    }

    updateProfile(newUser);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg z-50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Liên kết tài khoản MXH cho Workspace
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mô tả */}
        <div className="px-6">
          <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">
            Tổ chức của bạn có thể kết nối tối đa <b>3</b> tài khoản MXH với gói
            sử dụng hiện tại. Đã kết nối tổng cộng: <b>0/3</b>.
          </p>
          <p className="text-right text-sm text-gray-500 mt-2">
            Đã chọn: 0/3
          </p>
        </div>

        {/* Danh sách pages */}
        <div className="px-6 py-4 space-y-3">
          {pages.map((page) => (
            <label
              key={page.id}
              className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${page.avatarColor}`}
                >
                  {page.name.charAt(0)}
                  <span className="absolute translate-x-4 translate-y-4 bg-blue-600 p-[2px] rounded-full">
                    <FaFacebookF className="text-white text-[10px]" />
                  </span>
                </div>
                <span className="text-gray-800 font-medium">{page.name}</span>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={() => {
              onClose();
              changeUserStatus();
            }}
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
