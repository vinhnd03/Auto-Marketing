import { X } from "lucide-react";

const FacebookConnectInfo = ({ onClose }) =>  {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg z-50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Kết nối Facebook Page
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
          <div className="px-6 py-4 space-y-4 text-gray-600">
            <p className="text-center">
              Bạn cần phải là <strong>quản trị viên</strong> của Facebook Page để
              có thể kết nối Page với Website.
            </p>
            <p className="text-center">
              Bạn có thể thêm nhiều Page ở nhiều tài khoản Facebook cá nhân khác
              nhau.
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacebookConnectInfo;