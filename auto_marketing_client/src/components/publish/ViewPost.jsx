import React from "react";
import dayjs from "dayjs";

const ViewPost = ({ postData, onClose }) => {
  if (!postData) return null;

  const formatDateTime = (value) => {
    if (!value) return "Chưa đặt lịch";
    const clean = value.replace(" ", "T").split(".")[0];
    return dayjs(clean, "YYYY-MM-DDTHH:mm:ss").format("HH:mm DD/MM/YYYY");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "Chờ đăng";
      case "POSTED":
        return "Đã đăng";
      case "FAILED":
        return "Đăng thất bại";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full relative overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {/* Header */}
<div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-blue-50">
  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
    {postData.pageName ? postData.pageName[0].toUpperCase() : "F"}
  </div>
  <div className="font-semibold text-gray-800">
  {postData.fanpages?.length > 0 
      ? postData.fanpages.map(f => f.pageName).join(", ") 
      : "Facebook Page"}
</div>

</div>


        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
            {postData.post.title}
          </h3>

          {/* Content */}
          <div className="text-gray-800 mb-2 whitespace-pre-wrap max-h-48 overflow-y-auto">
            {postData.post.content}
          </div>

          {/* Hashtag */}
          {postData.post.hashtag && (
            <p className="text-blue-600 mb-3 font-medium">{postData.post.hashtag}</p>
          )}

          {/* Media */}
          {postData.post.medias && postData.post.medias.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
  {postData.post.medias.map((m, idx) => (
    <img
      key={idx}
      src={m.url}
      alt={m.name || "media"}
      className="w-[48%] sm:w-[48%] h-36 object-cover rounded-md"
    />
  ))}
</div>

          ) : (
            <p className="text-gray-500 italic mt-2">Không có ảnh</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 flex justify-between">
          <span>
            <strong>Trạng thái:</strong> {getStatusText(postData.status)}
          </span>
          <span>
            <strong>Lên lịch:</strong> {formatDateTime(postData.scheduledTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
