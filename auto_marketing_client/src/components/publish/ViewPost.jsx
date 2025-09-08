import dayjs from "dayjs";
import { getInsights } from "../../service/publish/insightService";
import { useEffect, useState } from "react";

const ViewPost = ({ postData, onClose }) => {
  const [insights, setInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Lấy các postLink từ fanpages
  const postLinks =
    postData?.fanpages
      ?.filter((f) => f.postUrl)
      .map((f) => ({
        fanpageId: f.id,
        postTargetId: f.postTargetId,
        name: f.pageName,
        url: f.postUrl,
      })) || [];

  // Fetch insights khi postData thay đổi
  useEffect(() => {
    if (postLinks.length === 0) return;

    setLoadingInsights(true);

    Promise.all(
      postLinks.map((link) =>
        getInsights(link.postTargetId).then((data) => ({
          [link.postTargetId]: data,
        }))
      )
    )
      .then((results) => {
        const merged = results.reduce((acc, cur) => ({ ...acc, ...cur }), {});
        setInsights(merged);
      })
      .catch((err) => console.error("Error fetching insights:", err))
      .finally(() => setLoadingInsights(false));
  }, [postData]);

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
  <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] relative flex flex-col">
    {/* Close button */}
    <button
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
      onClick={onClose}
    >
      ×
    </button>

    {/* Header */}
    <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-blue-50 flex-shrink-0">
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        {postData.fanpages?.[0]?.pageName?.[0]?.toUpperCase() || "F"}
      </div>
      <div className="font-semibold text-gray-800 truncate">
        {postData.fanpages?.length > 0
          ? postData.fanpages.map((f) => f.pageName).join(", ")
          : "Facebook Page"}
      </div>
    </div>

    {/* Content */}
    <div className="p-4 overflow-y-auto flex-1">
      {/* Title */}
      {postData.post.title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
          {postData.post.title}
        </h3>
      )}

      {/* Content */}
      {postData.post.content && (
        <div className="text-gray-800 mb-2 whitespace-pre-wrap max-h-48 overflow-y-auto">
          {postData.post.content}
        </div>
      )}

      {/* Hashtag */}
      {postData.post.hashtag && (
        <p className="text-blue-600 mb-3 font-medium">{postData.post.hashtag}</p>
      )}

      {/* Media */}
      {postData.post.medias && postData.post.medias.length > 0 ? (
        <div className="mt-2 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
          {postData.post.medias.map((m, idx) => (
            <img
              key={idx}
              src={m.url}
              alt={m.name || "media"}
              className="w-full h-36 object-cover rounded-md"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-2">Không có ảnh</p>
      )}

      {/* Insights */}
      {postLinks.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Thống kê:</h3>
          {loadingInsights ? (
            <p className="text-gray-500 italic">Đang tải thống kê...</p>
          ) : (
            postLinks.map((link) => {
              const data = insights[link.postTargetId];
              return data ? (
                <div
                  key={link.postTargetId}
                  className="mb-3 flex flex-col gap-1 border-b border-gray-200 pb-2"
                >
                  <p className="font-medium">Trang {link.name}:</p>
                  <p>Lượt thích: {data.likeCount ?? 0}</p>
                  <p className="text-gray-500 text-xs">
                    Cập nhật: {dayjs(data.lastCheckedAt).format("HH:mm DD/MM/YYYY")}
                  </p>
                </div>
              ) : (
                <p key={link.postTargetId} className="text-gray-500 italic">
                  Không có dữ liệu thống kê cho {link.name}
                </p>
              );
            })
          )}
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 flex-shrink-0 flex flex-col gap-1">
      <div className="flex justify-between">
        <span>
          <strong>Trạng thái:</strong> {getStatusText(postData.status)}
        </span>
        <span>
          <strong>Lên lịch:</strong> {formatDateTime(postData.scheduledTime)}
        </span>
      </div>

      {/* Post links */}
      {postLinks.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {postLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12" />
              </svg>
              <span>Xem trên {link.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default ViewPost;
