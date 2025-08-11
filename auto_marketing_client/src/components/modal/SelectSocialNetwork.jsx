import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { X } from "lucide-react";
import { MdUpdate } from "react-icons/md";
import { useState } from "react";
import SelectPagesModal from "./SelectPagesModal";

const SelectSocialNetwork = ({ isOpen, onClose, onOpenPagesSelect }) =>  {
  const [isSelectPageModalOpen, setIsSelectPageModalOpen] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg z-50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Liên kết tài khoản MXH cho Workspace
          </h2>
          <button onClick={onClose}
            aria-label="Đóng"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-7 h-7 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="">
          <div className="px-6 py-4 space-y-4">
            <p className="text-md text-gray-600">
              Tổ chức của bạn có thể kết nối tối đa <b>3</b> tài khoản MXH với gói sử dụng hiện tại. Đã kết nối tổng cộng: <b>0/3</b>.
            </p>

            {/* Facebook Option */}
            <button className="w-full flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition"
              onClick={onOpenPagesSelect} 
              >
              <div className="w-full">
                <p className="font-medium">Fanpage Facebook</p>
                <p className="text-sm text-gray-500">Liên kết để quản lý các Fanpage Facebook</p>
              </div>
              <FaFacebookF className="text-blue-600 w-6 h-6" />
            </button>

            {/* Other Option */}
            {/* <button className="w-full flex justify-between items-center p-4 border rounded-lg bg-gray-100 transition">
              <div className="w-full">
                <p className="font-medium text-gray-500">Tài khoản MXH khác</p>
                <p className="text-sm text-gray-400">Đang trong quá trình phát triển</p>
              </div>
              <MdUpdate className="text-gray-500 w-6 h-6" />
            </button> */}
          </div>
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
}

export default SelectSocialNetwork;
