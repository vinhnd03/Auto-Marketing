import dayjs from "dayjs";
import { getInsights } from "../../service/publish/insightService";
import { setPostGoals, getPostGoals } from "../../service/goalService";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Target, TrendingUp } from "lucide-react";
import Swal from "sweetalert2";

const ViewPost = ({ postData, onClose }) => {
  const [insights, setInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Goals states - cập nhật để lưu theo fanpage
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [goals, setGoals] = useState({}); // Object với key là postTargetId
  const [actualStats, setActualStats] = useState({});
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [selectedFanpage, setSelectedFanpage] = useState(null);

  // Lấy các postLink từ fanpages
  const postLinks = useMemo(
    () =>
      postData?.fanpages
        ?.filter((f) => f.postUrl)
        .map((f) => ({
          fanpageId: f.id,
          postTargetId: f.postTargetId,
          name: f.pageName,
          url: f.postUrl,
        })) || [],
    [postData?.fanpages]
  );

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
  }, [postLinks]);

  // Load existing goals when component mounts - cập nhật để lưu theo fanpage
  const loadExistingGoals = useCallback(async () => {
    if (!postLinks || postLinks.length === 0) return;

    try {
      setLoadingGoals(true);
      const goalsData = {};

      // Load goals cho từng fanpage
      for (const link of postLinks) {
        try {
          const response = await getPostGoals(link.postTargetId);
          if (response && response.likes > 0) {
            goalsData[link.postTargetId] = {
              targetLikes: response.likes,
            };
          }
        } catch (error) {
          console.error(`Error loading goals for fanpage ${link.name}:`, error);
        }
      }

      setGoals(goalsData);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setLoadingGoals(false);
    }
  }, [postLinks]);

  useEffect(() => {
    loadExistingGoals();
  }, [loadExistingGoals]);

  // Handle set goals - cập nhật để lưu theo fanpage
  const handleSetGoals = async (goalData) => {
    if (!selectedFanpage?.postTargetId) {
      Swal.fire("Lỗi", "Không tìm thấy fanpage được chọn", "error");
      return;
    }

    try {
      const response = await setPostGoals(
        selectedFanpage.postTargetId,
        goalData
      );
      console.log("Goals set successfully:", response);

      // Update local state cho fanpage cụ thể
      setGoals((prev) => ({
        ...prev,
        [selectedFanpage.postTargetId]: {
          targetLikes: goalData.likes,
        },
      }));

      Swal.fire({
        title: "Thành công!",
        text: `Đã đặt mục tiêu cho trang ${selectedFanpage.name}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reload goals to get updated data
      await loadExistingGoals();
    } catch (error) {
      console.error("Error setting goals:", error);
      Swal.fire("Lỗi", "Không thể đặt mục tiêu", "error");
    }
  };

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

        {/* Goals button - cập nhật để hiển thị tổng quan */}
        <div className="absolute top-3 right-12 flex gap-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
            <Target size={14} />
            {Object.keys(goals).length > 0
              ? `${Object.keys(goals).length}/${postLinks.length} có mục tiêu`
              : "Chưa có mục tiêu"}
          </span>
        </div>

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
            <p className="text-blue-600 mb-3 font-medium">
              {postData.post.hashtag}
            </p>
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

          {/* Insights and Goals by Fanpage */}
          {postLinks.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Thống kê:</h3>
              {loadingInsights ? (
                <p className="text-gray-500 italic">Đang tải thống kê...</p>
              ) : (
                postLinks.map((link) => {
                  const data = insights[link.postTargetId];
                  const hasGoals = goals[link.postTargetId];
                  const actualLikes = data?.likeCount || 0;
                  const targetLikes = hasGoals?.targetLikes || 0;

                  return (
                    <div
                      key={link.postTargetId}
                      className="mb-4 p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">
                          Trang {link.name}:
                        </p>
                        <button
                          onClick={() => {
                            setSelectedFanpage(link);
                            setShowGoalsModal(true);
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          <Target size={12} />
                          Mục tiêu
                        </button>
                      </div>

                      {data ? (
                        <div className="space-y-2">
                          <p className="text-gray-700">
                            Lượt thích: {actualLikes}
                          </p>

                          {/* Hiển thị mục tiêu nếu có */}
                          {targetLikes > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 flex items-center">
                                  <span className="mr-1">🎯</span>
                                  Mục tiêu: {targetLikes.toLocaleString()}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    actualLikes >= targetLikes
                                      ? "text-green-600 bg-green-100"
                                      : actualLikes >= targetLikes * 0.7
                                      ? "text-yellow-600 bg-yellow-100"
                                      : actualLikes >= targetLikes * 0.4
                                      ? "text-orange-600 bg-orange-100"
                                      : "text-red-600 bg-red-100"
                                  }`}
                                >
                                  {targetLikes > 0
                                    ? Math.min(
                                        (actualLikes / targetLikes) * 100,
                                        100
                                      ).toFixed(1)
                                    : 0}
                                  %
                                </span>
                              </div>

                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    actualLikes >= targetLikes
                                      ? "bg-green-600"
                                      : actualLikes >= targetLikes * 0.7
                                      ? "bg-yellow-500"
                                      : actualLikes >= targetLikes * 0.4
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      (actualLikes / targetLikes) * 100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <p className="text-gray-500 text-xs">
                            Cập nhật:{" "}
                            {dayjs(data.lastCheckedAt).format(
                              "HH:mm DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          Không có dữ liệu thống kê
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Section Mục tiêu tổng quan */}
          {Object.keys(goals).length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Target className="mr-2" size={18} />
                Mục tiêu ({Object.keys(goals).length}/{postLinks.length} trang)
              </h3>
              <div className="grid gap-3">
                {postLinks.map((link) => {
                  const hasGoals = goals[link.postTargetId];
                  const data = insights[link.postTargetId];
                  const actualLikes = data?.likeCount || 0;
                  const targetLikes = hasGoals?.targetLikes || 0;

                  if (!hasGoals) return null;

                  return (
                    <div
                      key={link.postTargetId}
                      className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">
                          {link.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            actualLikes >= targetLikes
                              ? "text-green-600 bg-green-100"
                              : actualLikes >= targetLikes * 0.7
                              ? "text-yellow-600 bg-yellow-100"
                              : actualLikes >= targetLikes * 0.4
                              ? "text-orange-600 bg-orange-100"
                              : "text-red-600 bg-red-100"
                          }`}
                        >
                          {targetLikes > 0
                            ? Math.min(
                                (actualLikes / targetLikes) * 100,
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="text-sm text-blue-800 mb-2">
                        🎯 Mục tiêu: {targetLikes.toLocaleString()} lượt thích
                      </div>

                      <div className="text-sm text-blue-700 mb-2">
                        📊 Hiện tại: {actualLikes.toLocaleString()} lượt thích
                      </div>

                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            actualLikes >= targetLikes
                              ? "bg-green-600"
                              : actualLikes >= targetLikes * 0.7
                              ? "bg-yellow-500"
                              : actualLikes >= targetLikes * 0.4
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (actualLikes / targetLikes) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              <strong>Lên lịch:</strong>{" "}
              {formatDateTime(postData.scheduledTime)}
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

      {/* Goals Modal */}
      <GoalsModal
        isOpen={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        onSave={handleSetGoals}
      />

      {/* Progress Modal */}
      {showProgressModal && goals.targetLikes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
              <TrendingUp className="mr-2" size={20} />
              Tiến độ mục tiêu
            </h3>

            {/* Hiển thị tiến độ lượt thích */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 flex items-center">
                    <span className="mr-2">👍</span>
                    Lượt thích
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      (actualStats.actualLikes || 0) >= goals.targetLikes
                        ? "text-green-600 bg-green-100"
                        : (actualStats.actualLikes || 0) >=
                          goals.targetLikes * 0.7
                        ? "text-yellow-600 bg-yellow-100"
                        : (actualStats.actualLikes || 0) >=
                          goals.targetLikes * 0.4
                        ? "text-orange-600 bg-orange-100"
                        : "text-red-600 bg-red-100"
                    }`}
                  >
                    {Math.min(
                      ((actualStats.actualLikes || 0) / goals.targetLikes) *
                        100,
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      Thực tế: {(actualStats.actualLikes || 0).toLocaleString()}
                    </span>
                    <span>Mục tiêu: {goals.targetLikes.toLocaleString()}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((actualStats.actualLikes || 0) / goals.targetLikes) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowProgressModal(false)}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Goals Modal Component
const GoalsModal = ({ isOpen, onClose, onSave }) => {
  const [targetLikes, setTargetLikes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!targetLikes || targetLikes.trim() === "") {
      alert("Vui lòng nhập mục tiêu lượt thích!");
      return;
    }

    const likesValue = parseInt(targetLikes) || 0;
    if (likesValue <= 0) {
      alert("Mục tiêu lượt thích phải lớn hơn 0!");
      return;
    }

    onSave({ likes: likesValue });
    onClose();
    setTargetLikes("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Đặt mục tiêu cho bài viết
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lượt thích:
              </label>
              <input
                type="number"
                min="1"
                value={targetLikes}
                onChange={(e) => setTargetLikes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Nhập số lượt thích mong muốn"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTargetLikes("");
                }}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Lưu mục tiêu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
