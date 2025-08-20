import { useState } from "react";
import { updateUser } from "../../service/admin/usersService";
import { toast } from "react-toastify";

export default function UpdateUserModal({ user, isShowModal, isCloseModal, onUpdateSuccess }) {
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async () => {
        try {
            setLoading(true);
            const newStatus = !user.status;
            await updateUser(user.id, { status: newStatus });

            toast.success(`Cập nhật trạng thái thành công!`);
            onUpdateSuccess && onUpdateSuccess(user.id, newStatus); // update state ở parent
            isCloseModal();
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật trạng thái thất bại!");
        } finally {
            setLoading(false);
        }
    };

    if (!isShowModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                {/* Close button */}
                <button
                    onClick={isCloseModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4">Xác nhận thay đổi trạng thái</h2>
                <p className="mb-6">
                    Bạn có muốn {user.status ? "khóa" : "mở khóa"} tài khoản <span className="font-semibold">{user.name}</span> không?
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={isCloseModal}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpdateStatus}
                        className={`px-4 py-2 rounded text-white ${user.status ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : user.status ? "Khóa" : "Mở khóa"}
                    </button>
                </div>
            </div>
        </div>
    );
}
