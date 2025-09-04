import dayjs from "dayjs";
import React from "react";

const DeletePost = ({ post, onCancel, onConfirm }) => {
  if (!post) return null;

  const postData = post.post || post; // lấy đúng dữ liệu
  const scheduledTime = post.scheduledTime
    ? dayjs(post.scheduledTime).format("HH:mm DD/MM/YYYY")
    : "Chưa đặt lịch";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">Xác nhận xóa bài viết</h2>
        <p className="text-sm mb-4 text-gray-600">
          Bạn có chắc chắn muốn xóa bài viết dưới đây không?
        </p>

        <div className="bg-gray-100 rounded-md p-4 text-sm space-y-2">
          <p>
            <span className="font-medium">Tiêu đề:</span> {postData.title || "-"}
          </p>
          <p>
            <span className="font-medium">Thời gian:</span> {scheduledTime}
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded-md"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
            onClick={() => onConfirm(post)}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
