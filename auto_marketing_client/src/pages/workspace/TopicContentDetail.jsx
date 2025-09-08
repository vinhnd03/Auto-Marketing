import React, { useEffect, useState } from "react";
import AIContentGenerator from "../../components/ai/AIContentGenerator";
import {
  Wand2,
  Target,
  BarChart3,
  TrendingUp,
  Eye,
  MoreVertical,
  Edit,
  Image,
} from "lucide-react";
import { getApprovedPostsByTopic } from "../../service/postService";
import dayjs from "dayjs";
import ImageGenModal from "../../components/modal/ImageGenModal";
import EditPostModal from "./EditPostModal";
import Swal from "sweetalert2";

const TopicContentDetail = ({ topic, onBack }) => {
  // Khi quay lại danh sách content, nếu content vừa xem là mới thì bỏ badge 'Mới'
  const handleBackFromDetail = () => {
    if (selectedContent && selectedContent.isNew) {
      setContents((prev) =>
        prev.map((c) => (c === selectedContent ? { ...c, isNew: false } : c))
      );
    }
    setSelectedContent(null);
  };
  const [showGenContentModal, setShowGenContentModal] = useState(false);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [hasGeneratedResults, setHasGeneratedResults] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [selectedContentForGoals, setSelectedContentForGoals] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedContentForProgress, setSelectedContentForProgress] =
    useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Kiểm tra localStorage khi mount để xác định trạng thái nút
  useEffect(() => {
    if (topic?.id) {
      const localKey = `ai_preview_content_${topic.id}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        try {
          const arr = JSON.parse(saved);
          if (Array.isArray(arr) && arr.length > 0) {
            setHasGeneratedResults(true);
          }
        } catch (e) {}
      }
    }
  }, [topic]);
  const [showImageGenModal, setShowImageGenModal] = useState(false);
  const [imageGenTarget, setImageGenTarget] = useState(null);

  // Thêm state cho phân trang content
  const DEFAULT_CONTENTS_PER_PAGE = 6;
  const [contentPageSize, setContentPageSize] = useState(
    DEFAULT_CONTENTS_PER_PAGE
  );

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getApprovedPostsByTopic(topic.id);
        setContents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Không thể tải content cho topic này.");
      } finally {
        setLoading(false);
      }
    };
    if (topic?.id) {
      fetchContents();
    }
  }, [topic]);

  const handleGenerateImage = (content) => {
    setImageGenTarget(content);
    setShowImageGenModal(true);
  };

  const handleImageGenSubmit = async (selectedImages) => {
    // Lưu tất cả ảnh vào content
    if (selectedImages && selectedImages.length > 0 && imageGenTarget) {
      setContents((prev) =>
        prev.map((c) =>
          c.id === imageGenTarget.id
            ? {
                ...c,
                imageUrls: Array.isArray(c.imageUrls)
                  ? [...c.imageUrls, ...selectedImages]
                  : selectedImages,
                imageUrl: selectedImages[0],
              }
            : c
        )
      );
      setSelectedContent((prev) =>
        prev && prev.id === imageGenTarget.id
          ? {
              ...prev,
              imageUrls: Array.isArray(prev.imageUrls)
                ? [...prev.imageUrls, ...selectedImages]
                : selectedImages,
              imageUrl: selectedImages[0],
            }
          : prev
      );
    }
    setShowImageGenModal(false);
    setImageGenTarget(null);
  };

  // Component Modal đặt mục tiêu
  const GoalsModal = ({ isOpen, onClose, content, onSave }) => {
    const [goals, setGoals] = useState({
      likes: content?.goals?.likes || 0,
      comments: content?.goals?.comments || 0,
      shares: content?.goals?.shares || 0,
      views: content?.goals?.views || 0,
      engagement: content?.goals?.engagement || 0,
    });

    const handleSave = () => {
      onSave(goals);
      onClose();
      Swal.fire({
        title: "Thành công!",
        text: "Đã đặt mục tiêu cho content",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            Đặt mục tiêu cho Content
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lượt thích (Likes)
              </label>
              <input
                type="number"
                value={goals.likes}
                onChange={(e) =>
                  setGoals((prev) => ({
                    ...prev,
                    likes: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bình luận (Comments)
              </label>
              <input
                type="number"
                value={goals.comments}
                onChange={(e) =>
                  setGoals((prev) => ({
                    ...prev,
                    comments: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chia sẻ (Shares)
              </label>
              <input
                type="number"
                value={goals.shares}
                onChange={(e) =>
                  setGoals((prev) => ({
                    ...prev,
                    shares: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lượt xem (Views)
              </label>
              <input
                type="number"
                value={goals.views}
                onChange={(e) =>
                  setGoals((prev) => ({
                    ...prev,
                    views: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỷ lệ tương tác (%)
              </label>
              <input
                type="number"
                value={goals.engagement}
                onChange={(e) =>
                  setGoals((prev) => ({
                    ...prev,
                    engagement: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Target className="mr-1" size={16} />
              Đặt mục tiêu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Component Modal xem tiến độ mục tiêu
  const ProgressModal = ({ isOpen, onClose, content, onUpdateStats }) => {
    const [actualStats, setActualStats] = useState({
      likes: content?.actualStats?.likes || 0,
      comments: content?.actualStats?.comments || 0,
      shares: content?.actualStats?.shares || 0,
      views: content?.actualStats?.views || 0,
      engagement: content?.actualStats?.engagement || 0,
    });

    const goals = content?.goals || {};

    const getProgressPercentage = (actual, target) => {
      if (!target || target === 0) return 0;
      return Math.min((actual / target) * 100, 100);
    };

    const getProgressColor = (percentage) => {
      if (percentage >= 100) return "text-green-600 bg-green-100";
      if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
      if (percentage >= 40) return "text-orange-600 bg-orange-100";
      return "text-red-600 bg-red-100";
    };

    const handleUpdateStats = () => {
      onUpdateStats(actualStats);
      onClose();
      Swal.fire({
        title: "Cập nhật thành công!",
        text: "Đã cập nhật thống kê thực tế cho content",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Tiến độ mục tiêu - {content?.title || "Content"}
          </h3>

          {/* Hiển thị so sánh mục tiêu vs thực tế */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(goals)
              .filter(([key, value]) => value > 0)
              .map(([key, targetValue]) => {
                const actualValue = actualStats[key] || 0;
                const percentage = getProgressPercentage(
                  actualValue,
                  targetValue
                );
                const colorClass = getProgressColor(percentage);

                const labels = {
                  likes: { label: "Lượt thích", icon: "👍" },
                  comments: { label: "Bình luận", icon: "💬" },
                  shares: { label: "Chia sẻ", icon: "🔄" },
                  views: { label: "Lượt xem", icon: "👀" },
                  engagement: { label: "Tương tác (%)", icon: "📊" },
                };

                return (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 flex items-center">
                        <span className="mr-2">{labels[key].icon}</span>
                        {labels[key].label}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>
                          Thực tế: {actualValue.toLocaleString()}
                          {key === "engagement" ? "%" : ""}
                        </span>
                        <span>
                          Mục tiêu: {targetValue.toLocaleString()}
                          {key === "engagement" ? "%" : ""}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            percentage >= 100
                              ? "bg-green-500"
                              : percentage >= 70
                              ? "bg-yellow-500"
                              : percentage >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Form cập nhật số liệu thực tế */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={16} />
              Cập nhật số liệu thực tế
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(goals)
                .filter(([key, value]) => value > 0)
                .map(([key, targetValue]) => {
                  const labels = {
                    likes: "Lượt thích thực tế",
                    comments: "Bình luận thực tế",
                    shares: "Chia sẻ thực tế",
                    views: "Lượt xem thực tế",
                    engagement: "Tương tác thực tế (%)",
                  };

                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {labels[key]}
                      </label>
                      <input
                        type="number"
                        value={actualStats[key]}
                        onChange={(e) =>
                          setActualStats((prev) => ({
                            ...prev,
                            [key]:
                              key === "engagement"
                                ? parseFloat(e.target.value) || 0
                                : parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                        max={key === "engagement" ? "100" : undefined}
                        step={key === "engagement" ? "0.1" : "1"}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Mục tiêu: {targetValue.toLocaleString()}
                        {key === "engagement" ? "%" : ""}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleUpdateStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <BarChart3 className="mr-1" size={16} />
              Cập nhật số liệu
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSetGoals = (content) => {
    setSelectedContentForGoals(content);
    setShowGoalsModal(true);
  };

  const handleViewProgress = (content) => {
    setSelectedContentForProgress(content);
    setShowProgressModal(true);
  };

  const handleSaveGoals = (goals) => {
    setContents((prev) =>
      prev.map((c) =>
        c.id === selectedContentForGoals.id ? { ...c, goals } : c
      )
    );

    if (selectedContent && selectedContent.id === selectedContentForGoals.id) {
      setSelectedContent((prev) => ({ ...prev, goals }));
    }
  };

  const handleUpdateStats = (actualStats) => {
    setContents((prev) =>
      prev.map((c) =>
        c.id === selectedContentForProgress.id ? { ...c, actualStats } : c
      )
    );

    if (
      selectedContent &&
      selectedContent.id === selectedContentForProgress.id
    ) {
      setSelectedContent((prev) => ({ ...prev, actualStats }));
    }
  };

  // Đóng dropdown menu khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionMenu) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showActionMenu]);

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto"
      onClick={(e) => {
        // Chỉ đóng menu khi click vào container chính, không phải các element con
        if (e.target === e.currentTarget) {
          setShowActionMenu(false);
        }
      }}
    >
      {/* Modal zoom ảnh */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <button
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 shadow-lg"
              onClick={() => setZoomedImage(null)}
              aria-label="Đóng"
            >
              <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="11" fill="#f3f3f3" />
                <path
                  d="M7 7L15 15M15 7L7 15"
                  stroke="#888"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <button
          className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
          onClick={onBack}
        >
          ← Quay lại danh sách chủ đề
        </button>
        <button
          className="px-4 py-2 w-full sm:w-auto bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center"
          onClick={() => setShowGenContentModal(true)}
        >
          <Wand2 className="mr-2" size={16} />
          {hasGeneratedResults ? "Xem nội dung đã tạo" : "Tạo thêm nội dung"}
        </button>
      </div>
      {/* Modal AIContentGenerator */}
      <AIContentGenerator
        isOpen={showGenContentModal}
        onClose={() => {
          setShowGenContentModal(false);
          // KHÔNG reset setHasGeneratedResults ở đây, chỉ reset khi bấm nút Lưu
        }}
        selectedTopic={topic}
        onContentSaved={(newContents) => {
          // Chuẩn hoá lại dữ liệu content mới để đảm bảo có trường content/text/body
          const normalize = (item, idx) => ({
            ...item,
            content: item.content || item.text || item.body || "",
            title: item.title || `Content #${item.id || idx + 1}`,
            createdAt: item.createdAt || new Date().toISOString(),
            hashtag: Array.isArray(item.hashtags)
              ? item.hashtags.join(", ")
              : item.hashtag || "",
            imageUrl: item.imageUrl || (item.images && item.images[0]) || "",
            isNew: true, // Đánh dấu content mới
            goals: item.goals || null, // Thêm trường goals
            actualStats: item.actualStats || {
              likes: 0,
              comments: 0,
              shares: 0,
              views: 0,
              engagement: 0,
            }, // Thêm trường thống kê thực tế
          });
          const normalized = Array.isArray(newContents)
            ? newContents.map(normalize)
            : [normalize(newContents, 0)];
          setContents((prev) => [...normalized, ...prev]);
          // Khi lưu xong thì reset trạng thái nút về 'Tạo thêm nội dung'
          setHasGeneratedResults(false);
        }}
        onShowResultsChange={setHasGeneratedResults}
      />
      {selectedContent && (
        <ImageGenModal
          isOpen={showImageGenModal}
          onClose={() => {
            setShowImageGenModal(false);
            setImageGenTarget(null);
          }}
          onSubmit={handleImageGenSubmit}
          postTitle={
            selectedContent.title ||
            selectedContent.text ||
            selectedContent.body ||
            selectedContent.content ||
            ""
          }
          postId={selectedContent.id}
        />
      )}
      {selectedContent && (
        <EditPostModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          post={selectedContent}
          topicId={topic.id}
          onUpdated={(updated) => {
            // Cập nhật lại danh sách
            setContents((prev) =>
              prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
            );
            setSelectedContent(updated);
          }}
        />
      )}

      {selectedContent && (
        <GoalsModal
          isOpen={showGoalsModal}
          onClose={() => {
            setShowGoalsModal(false);
            setSelectedContentForGoals(null);
          }}
          content={selectedContentForGoals}
          onSave={handleSaveGoals}
        />
      )}

      {selectedContent && (
        <ProgressModal
          isOpen={showProgressModal}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedContentForProgress(null);
          }}
          content={selectedContentForProgress}
          onUpdateStats={handleUpdateStats}
        />
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 break-words">
          {topic.title || topic.name}
        </h2>
        <p className="text-gray-700 mb-2 break-words">{topic.description}</p>
        {topic.aiGenerated && (
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold mr-2">
            <Wand2 size={12} className="mr-1 inline" /> AI Generated
          </span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách Content đã tạo
        </h3>
        {loading ? (
          <div className="text-gray-500">Đang tải content...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : selectedContent ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
                  onClick={handleBackFromDetail}
                >
                  ← Quay lại danh sách content
                </button>

                {/* Menu Actions Dropdown */}
                <div className="relative">
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionMenu(!showActionMenu);
                    }}
                  >
                    <MoreVertical className="mr-1" size={16} />
                    Thao tác
                  </button>

                  {showActionMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-purple-700 rounded-t-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateImage(selectedContent);
                          setShowActionMenu(false);
                        }}
                      >
                        <Image className="mr-2" size={16} />
                        Generate hình ảnh
                      </button>

                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-yellow-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditModal(true);
                          setShowActionMenu(false);
                        }}
                      >
                        <Edit className="mr-2" size={16} />
                        Chỉnh sửa
                      </button>

                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetGoals(selectedContent);
                          setShowActionMenu(false);
                        }}
                      >
                        <Target className="mr-2" size={16} />
                        Đặt mục tiêu
                      </button>

                      {selectedContent.goals &&
                        Object.values(selectedContent.goals).some(
                          (v) => v > 0
                        ) && (
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-blue-700 rounded-b-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProgress(selectedContent);
                              setShowActionMenu(false);
                            }}
                          >
                            <BarChart3 className="mr-2" size={16} />
                            Xem tiến độ
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 sm:ml-4">
                Ngày tạo:{" "}
                {selectedContent.createdAt
                  ? dayjs(selectedContent.createdAt).format("DD-MM-YYYY")
                  : ""}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-900">
                  {selectedContent.title ||
                    selectedContent.text ||
                    selectedContent.body ||
                    selectedContent.content ||
                    `Content`}
                </span>
              </div>
              {/* CHỈ render duy nhất phần justify, bỏ phần không justify */}
              <div className="text-gray-700 whitespace-pre-line mb-2 text-justify">
                {(
                  selectedContent.text ||
                  selectedContent.body ||
                  selectedContent.content ||
                  ""
                )
                  .split("\n")
                  .filter((line) => !line.trim().startsWith("#"))
                  .join("\n")}
              </div>
              {selectedContent.hashtag && (
                <div className="mt-4 w-full overflow-x-auto">
                  <div className="flex flex-nowrap gap-2 items-center">
                    {selectedContent.hashtag
                      .split(/[\s,]+/)
                      .filter((tag) => tag.startsWith("#"))
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Hiển thị mục tiêu đã đặt */}
              {selectedContent.goals &&
                Object.values(selectedContent.goals).some((v) => v > 0) && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <Target className="mr-2" size={16} />
                      Mục tiêu đã đặt
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {selectedContent.goals.likes > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">👍 Lượt thích:</span>
                          <span className="font-medium text-green-700">
                            {selectedContent.goals.likes.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedContent.goals.comments > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">💬 Bình luận:</span>
                          <span className="font-medium text-green-700">
                            {selectedContent.goals.comments.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedContent.goals.shares > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">🔄 Chia sẻ:</span>
                          <span className="font-medium text-green-700">
                            {selectedContent.goals.shares.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedContent.goals.views > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">👀 Lượt xem:</span>
                          <span className="font-medium text-green-700">
                            {selectedContent.goals.views.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedContent.goals.engagement > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">📊 Tương tác:</span>
                          <span className="font-medium text-green-700">
                            {selectedContent.goals.engagement}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Hiển thị thống kê thực tế và tiến độ */}
              {selectedContent.actualStats &&
                selectedContent.goals &&
                Object.values(selectedContent.goals).some((v) => v > 0) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <BarChart3 className="mr-2" size={16} />
                      Kết quả thực tế & Tiến độ
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedContent.goals)
                        .filter(([key, value]) => value > 0)
                        .map(([key, targetValue]) => {
                          const actualValue =
                            selectedContent.actualStats[key] || 0;
                          const percentage =
                            targetValue > 0
                              ? Math.min((actualValue / targetValue) * 100, 100)
                              : 0;

                          const labels = {
                            likes: { label: "Lượt thích", icon: "👍" },
                            comments: { label: "Bình luận", icon: "💬" },
                            shares: { label: "Chia sẻ", icon: "🔄" },
                            views: { label: "Lượt xem", icon: "👀" },
                            engagement: { label: "Tương tác", icon: "📊" },
                          };

                          return (
                            <div
                              key={key}
                              className="bg-white p-3 rounded border"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700 flex items-center text-sm">
                                  <span className="mr-2">
                                    {labels[key].icon}
                                  </span>
                                  {labels[key].label}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    percentage >= 100
                                      ? "text-green-600 bg-green-100"
                                      : percentage >= 70
                                      ? "text-yellow-600 bg-yellow-100"
                                      : percentage >= 40
                                      ? "text-orange-600 bg-orange-100"
                                      : "text-red-600 bg-red-100"
                                  }`}
                                >
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mb-1">
                                Thực tế: {actualValue.toLocaleString()}
                                {key === "engagement" ? "%" : ""} / Mục tiêu:{" "}
                                {targetValue.toLocaleString()}
                                {key === "engagement" ? "%" : ""}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    percentage >= 100
                                      ? "bg-green-500"
                                      : percentage >= 70
                                      ? "bg-yellow-500"
                                      : percentage >= 40
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              {/* Ảnh ở dưới cùng */}
              {Array.isArray(selectedContent.imageUrls) &&
                selectedContent.imageUrls.length > 0 && (
                  <div className="mt-6 flex justify-center gap-4 flex-wrap">
                    {selectedContent.imageUrls.map((url, idx) => (
                      <div
                        className="relative group w-full max-w-md cursor-zoom-in"
                        key={idx}
                        onClick={() => setZoomedImage(url)}
                      >
                        <img
                          src={url}
                          alt={`AI generated ${idx + 1}`}
                          className="rounded-xl border-4 border-blue-300 shadow-lg object-cover w-full max-h-72 transition-transform duration-300 group-hover:scale-105 bg-white"
                          style={{ aspectRatio: "16/9", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ) : contents.length > 0 ? (
          <>
            {/* Bộ lọc và thống kê mục tiêu */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">
                      Tổng cộng:{" "}
                    </span>
                    <span className="ml-1 font-bold text-blue-600">
                      {contents.length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Target className="mr-1 text-green-500" size={16} />
                    <span className="text-gray-700 font-medium">
                      Đã đặt mục tiêu:{" "}
                    </span>
                    <span className="ml-1 font-bold text-green-600">
                      {
                        contents.filter(
                          (c) =>
                            c.goals && Object.values(c.goals).some((v) => v > 0)
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                    <span className="text-gray-700 font-medium">
                      Chưa đặt mục tiêu:{" "}
                    </span>
                    <span className="ml-1 font-bold text-gray-600">
                      {
                        contents.filter(
                          (c) =>
                            !c.goals ||
                            !Object.values(c.goals).some((v) => v > 0)
                        ).length
                      }
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors flex items-center"
                    onClick={() => {
                      // Lọc chỉ hiển thị những content đã đặt mục tiêu
                      const withGoals = contents.filter(
                        (c) =>
                          c.goals && Object.values(c.goals).some((v) => v > 0)
                      );
                      if (withGoals.length > 0) {
                        setContents(withGoals);
                      }
                    }}
                  >
                    <Target className="mr-1" size={12} />
                    Đã có mục tiêu
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      // Lọc chỉ hiển thị những content chưa đặt mục tiêu
                      const withoutGoals = contents.filter(
                        (c) =>
                          !c.goals || !Object.values(c.goals).some((v) => v > 0)
                      );
                      if (withoutGoals.length > 0) {
                        setContents(withoutGoals);
                      }
                    }}
                  >
                    Chưa có mục tiêu
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    onClick={() => {
                      // Reset về hiển thị tất cả
                      window.location.reload();
                    }}
                  >
                    Tất cả
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {contents.slice(0, contentPageSize).map((content, idx) => {
                const preview = (
                  content.text ||
                  content.body ||
                  content.content ||
                  ""
                ).slice(0, 100);
                const isLong =
                  (content.text || content.body || content.content || "")
                    .length > 100;
                const hasGoals =
                  content.goals &&
                  Object.values(content.goals).some((v) => v > 0);
                return (
                  <div
                    key={content.id || idx}
                    className={`bg-white border-2 rounded-2xl p-8 shadow hover:shadow-lg cursor-pointer flex flex-col relative h-full transition-all duration-300 ${
                      hasGoals
                        ? "border-green-300 bg-gradient-to-br from-white to-green-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setSelectedContent(content)}
                  >
                    {/* Badge trạng thái mục tiêu */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {content.isNew && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-20">
                          Mới
                        </span>
                      )}
                      {hasGoals ? (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center">
                          <Target className="mr-1" size={10} />
                          Có mục tiêu
                        </span>
                      ) : (
                        <span className="bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                          Chưa đặt mục tiêu
                        </span>
                      )}
                    </div>
                    {/* Hiển thị ảnh nếu có */}
                    {content.imageUrl && (
                      <div className="mb-3 flex justify-center relative z-10">
                        <div className="group w-full max-w-xs">
                          <img
                            src={content.imageUrl}
                            alt="AI generated"
                            className="rounded-xl border-2 border-blue-200 shadow object-cover w-full max-h-32 transition-transform duration-300 group-hover:scale-105 bg-white"
                            style={{ aspectRatio: "16/9", objectFit: "cover" }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="mb-2">
                      <span className="font-semibold text-gray-800 block break-words flex items-center">
                        {content.title || `Content #${idx + 1}`}
                        {hasGoals && (
                          <div className="ml-2 flex items-center">
                            <Target
                              className="text-green-500"
                              size={16}
                              title="Đã đặt mục tiêu"
                            />
                            <span className="ml-1 text-xs text-green-600 font-medium">
                              {Object.entries(content.goals)
                                .filter(([key, value]) => value > 0)
                                .map(([key, value]) => {
                                  const icons = {
                                    likes: "👍",
                                    comments: "💬",
                                    shares: "🔄",
                                    views: "👀",
                                    engagement: "📊",
                                  };
                                  return `${icons[key]}${value}${
                                    key === "engagement" ? "%" : ""
                                  }`;
                                })
                                .slice(0, 2)
                                .join(" ")}
                            </span>
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 break-words">
                      {preview}
                      {isLong ? "..." : ""}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2">
                      <div className="flex gap-1">
                        <button
                          className="text-blue-600 text-xs font-semibold hover:underline px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContent(content);
                          }}
                        >
                          <Eye className="inline mr-1" size={12} />
                          Chi tiết
                        </button>
                        <button
                          className="text-green-600 text-xs font-semibold hover:underline px-2 py-1 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetGoals(content);
                          }}
                        >
                          <Target className="inline mr-1" size={12} />
                          Mục tiêu
                        </button>
                        {hasGoals && (
                          <button
                            className="text-purple-600 text-xs font-semibold hover:underline px-2 py-1 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProgress(content);
                            }}
                          >
                            <BarChart3 className="inline mr-1" size={12} />
                            Tiến độ
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {content.createdAt
                          ? dayjs(content.createdAt).format("DD/MM")
                          : ""}
                      </span>
                    </div>

                    {/* Hiển thị mục tiêu mini trong grid - chỉ hiển thị khi có mục tiêu */}
                    {hasGoals && (
                      <div className="mt-2 p-3 bg-green-100 border border-green-300 rounded-lg shadow-sm">
                        <div className="flex items-center text-green-800 font-semibold mb-2 text-sm">
                          <Target className="mr-1" size={12} />
                          Mục tiêu đã đặt
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {content.goals.likes > 0 && (
                            <div className="flex items-center justify-between bg-white px-2 py-1 rounded">
                              <span className="text-gray-600">👍</span>
                              <span className="font-medium text-green-700">
                                {content.goals.likes.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {content.goals.comments > 0 && (
                            <div className="flex items-center justify-between bg-white px-2 py-1 rounded">
                              <span className="text-gray-600">💬</span>
                              <span className="font-medium text-green-700">
                                {content.goals.comments.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {content.goals.shares > 0 && (
                            <div className="flex items-center justify-between bg-white px-2 py-1 rounded">
                              <span className="text-gray-600">🔄</span>
                              <span className="font-medium text-green-700">
                                {content.goals.shares.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {content.goals.views > 0 && (
                            <div className="flex items-center justify-between bg-white px-2 py-1 rounded">
                              <span className="text-gray-600">👀</span>
                              <span className="font-medium text-green-700">
                                {content.goals.views.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {content.goals.engagement > 0 && (
                            <div className="flex items-center justify-between bg-white px-2 py-1 rounded col-span-2">
                              <span className="text-gray-600">
                                📊 Tương tác
                              </span>
                              <span className="font-medium text-green-700">
                                {content.goals.engagement}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hiển thị tiến độ mini trong grid */}
                    {hasGoals &&
                      content.actualStats &&
                      Object.values(content.actualStats).some((v) => v > 0) && (
                        <div className="mt-2 p-3 bg-blue-100 border border-blue-300 rounded-lg shadow-sm">
                          <div className="flex items-center text-blue-800 font-semibold mb-2 text-sm">
                            <BarChart3 className="mr-1" size={12} />
                            Tiến độ thực tế
                          </div>
                          <div className="space-y-1">
                            {Object.entries(content.goals)
                              .filter(([key, value]) => value > 0)
                              .slice(0, 3)
                              .map(([key, targetValue]) => {
                                const actualValue =
                                  content.actualStats[key] || 0;
                                const percentage =
                                  targetValue > 0
                                    ? Math.min(
                                        (actualValue / targetValue) * 100,
                                        100
                                      )
                                    : 0;

                                const labels = {
                                  likes: "👍",
                                  comments: "💬",
                                  shares: "🔄",
                                  views: "👀",
                                  engagement: "📊",
                                };

                                return (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span className="flex items-center">
                                      <span className="mr-1">
                                        {labels[key]}
                                      </span>
                                      {actualValue.toLocaleString()}
                                      {key === "engagement" ? "%" : ""}
                                    </span>
                                    <span
                                      className={`px-1 py-0.5 rounded text-xs font-bold ${
                                        percentage >= 100
                                          ? "text-green-600 bg-green-200"
                                          : percentage >= 70
                                          ? "text-yellow-600 bg-yellow-200"
                                          : percentage >= 40
                                          ? "text-orange-600 bg-orange-200"
                                          : "text-red-600 bg-red-200"
                                      }`}
                                    >
                                      {percentage.toFixed(0)}%
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
            {/* Nút phân trang: Xem thêm & Thu gọn */}
            <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-3">
              {contents.length > contentPageSize && (
                <button
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all"
                  onClick={() =>
                    setContentPageSize(
                      contentPageSize + DEFAULT_CONTENTS_PER_PAGE
                    )
                  }
                >
                  Xem thêm
                </button>
              )}
              {contentPageSize > DEFAULT_CONTENTS_PER_PAGE && (
                <button
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition-all"
                  onClick={() => setContentPageSize(DEFAULT_CONTENTS_PER_PAGE)}
                >
                  Thu gọn
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-gray-500">
            Chưa có content nào cho topic này.
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicContentDetail;
