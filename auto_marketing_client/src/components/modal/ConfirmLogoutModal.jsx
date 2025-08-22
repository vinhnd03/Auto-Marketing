import { X } from "lucide-react";
import authService from "../../service/authService";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ConfirmLogoutModal = ({onClose}) => {
  const {setUser} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
      const result = await authService.logout();
      if (result.success) {
        setUser(null); // xóa user khỏi Context
        navigate("/"); // điều hướng về trang chủ
      } else {
        toast.error(result.error);
      }
    };


    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg z-50 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            Xác nhận đăng xuất
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="">
          <div className="px-md-5 py-4 space-y-4 text-gray-600">
            <p className="text-center">
              Bạn có muốn <b>đăng xuất</b> khỏi trang web không?
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="px-6 pb-6  flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-100 hover:bg-gray-300 text-black-600 py-2 rounded-md font-semibold transition"
          >
            Hủy
          </button>
          <button
            onClick={handleLogout}
            className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogoutModal;
