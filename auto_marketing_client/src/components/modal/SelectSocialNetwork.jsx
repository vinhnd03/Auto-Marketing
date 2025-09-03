import { FaFacebookF } from "react-icons/fa";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SelectSocialNetwork = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleFbLogin = () => {
    if (!user) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }

    // Redirect tới backend để link Facebook (Option B)
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/social/connect/facebook`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white rounded-xl shadow-lg z-50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Liên kết tài khoản MXH cho Workspace
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X className="w-7 h-7 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-md text-gray-600">
            Tổ chức của bạn có thể kết nối tối đa <b>3</b> tài khoản MXH với gói hiện tại.
          </p>

          <button
            className="w-full flex justify-between items-center p-4 border rounded-lg transition hover:bg-gray-50 cursor-pointer"
            onClick={handleFbLogin}
          >
            <div className="w-full">
              <p className="font-medium">Fanpage Facebook</p>
              <p className="text-sm text-gray-500">Liên kết để quản lý các Fanpage Facebook</p>
            </div>
            <FaFacebookF className="text-blue-600 w-6 h-6" />
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
          >
            Liên kết sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectSocialNetwork;
