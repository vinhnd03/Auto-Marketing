import { X } from "lucide-react";
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";

const SelectSocialNetwork = ({ isOpen, onClose, socialAccounts = [], onSelectAccount }) => {
  const [chosen, setChosen] = useState(null);

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
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
              <X className="w-7 h-7 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            <p className="text-md text-gray-600">
              Tổ chức của bạn có thể kết nối tối đa <b>3</b> tài khoản MXH với gói sử dụng hiện tại.
              Đã kết nối tổng cộng: <b>{socialAccounts.length}/3</b>.
            </p>

            {/* Danh sách network dynamic */}
            {socialAccounts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Bạn chưa liên kết tài khoản mạng xã hội nào.
                </p>
            ) : (
                socialAccounts.map((acc) => (
                    <button
                        key={acc.id}
                        className={`w-full flex justify-between items-center p-4 border rounded-lg ${
                            chosen?.id === acc.id ? 'bg-purple-50 border-purple-500' : 'hover:bg-gray-50'
                        } transition`}
                        onClick={() => setChosen(acc)}
                    >
                      <div className="w-full text-left">
                        <p className="font-medium">{acc.accountName}</p>
                        <p className="text-sm text-gray-500">{acc.platform}</p>
                      </div>
                      <input
                          type="radio"
                          checked={chosen?.id === acc.id}
                          readOnly
                      />
                    </button>
                ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
                disabled={!chosen}
                onClick={() => {
                  if (chosen) onSelectAccount(chosen);
                }}
                className={
                  chosen
                      ? "w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
                      : "w-full bg-gray-400 text-white py-2 rounded-md font-semibold cursor-not-allowed"
                }
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
  );
};

export default SelectSocialNetwork;
