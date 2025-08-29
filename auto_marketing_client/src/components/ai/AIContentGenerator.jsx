import { playNotificationSound } from "../../utils/notificationSound";
import { useNotification } from "../../context/NotificationContext";
import React, { useState, useEffect } from "react";
import { X, Wand2, FileText, Image, Sparkles, Eye, Edit } from "lucide-react";
import SocialMediaPublisher from "./SocialMediaPublisher";
import {
  generateContentWithAI,
  approveAndCleanPosts,
} from "../../service/postService";

import toast from "react-hot-toast";

const AIContentGenerator = ({
  isOpen,
  onClose,
  onGenerate,
  selectedTopic,
  onContentSaved,
  onShowResultsChange,
}) => {
  // ...existing code...

  const { addNotification } = useNotification();
  const [generating, setGenerating] = useState(false);
  const [contentSettings, setContentSettings] = useState({
    postCount: 1,
    customPostCount: 1,
    tone: "professional",
    includeHashtags: true,
    includeCTA: true,
  });
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [previewContent, setPreviewContent] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Notify parent when showResults changes
  useEffect(() => {
    if (typeof onShowResultsChange === "function") {
      onShowResultsChange(showResults);
    }
  }, [showResults, onShowResultsChange]);
  const [selectedContentForDetail, setSelectedContentForDetail] =
    useState(null);
  const [showContentDetail, setShowContentDetail] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [showPublisher, setShowPublisher] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  const [error, setError] = useState(null);

  // Đảm bảo toast luôn nổi trên modal
  useEffect(() => {
    if (isOpen) {
      let toastStyle = document.getElementById("toast-zindex-style");
      if (!toastStyle) {
        toastStyle = document.createElement("style");
        toastStyle.id = "toast-zindex-style";
        toastStyle.innerHTML = `.react-hot-toast { z-index: 120000 !important; }`;
        document.head.appendChild(toastStyle);
      }
    }
  }, [isOpen]);

  // Đã bỏ loại nội dung

  const toneOptions = [
    { value: "casual", label: "Thân thiện", description: "Gần gũi, dễ hiểu" },
    {
      value: "professional",
      label: "Chuyên nghiệp",
      description: "Trang trọng, uy tín",
    },
    { value: "playful", label: "Vui tươi", description: "Năng động, thu hút" },
    {
      value: "urgent",
      label: "Khẩn cấp",
      description: "Tạo cảm giác cần hành động ngay",
    },
  ];

  // Remove step loading, just a simple spinner until BE done
  const generateContent = async () => {
    setGenerating(true);
    setError(null);
    setShowResults(false);

    const body = {
      topicId: selectedTopic?.id,
      numberOfPosts:
        contentSettings.postCount === -1
          ? contentSettings.customPostCount &&
            /^\d+$/.test(contentSettings.customPostCount)
            ? Number(contentSettings.customPostCount)
            : 1
          : contentSettings.postCount || 1,
      tone: contentSettings.tone || "professional",
      targetWordCount: 800,
      includeSections: true,
      includeIntroConclusion: true,
      includeBulletPoints: true,
      includeCallToAction: contentSettings.includeCTA,
      includeStatistics: false,
      includeCaseStudies: false,
      includeHashtag: contentSettings.includeHashtags,
      additionalInstructions: additionalInstructions || "",
      targetPlatform: "facebook",
      targetAudience: "general",
    };

    try {
      const data = await generateContentWithAI(body);
      // Đảm bảo mọi item đều có estimatedReach là số
      const safeContent = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            estimatedReach:
              typeof item.estimatedReach === "number" ? item.estimatedReach : 0,
          }))
        : [
            {
              ...data,
              estimatedReach:
                typeof data.estimatedReach === "number"
                  ? data.estimatedReach
                  : 0,
            },
          ];
      setPreviewContent(safeContent);
      setSelectedContentIds(safeContent.map((c) => c.id));
      setShowResults(true);
      setGenerating(false);
      // Thông báo thành công qua chuông
      const postCountDisplay =
        contentSettings.postCount === -1
          ? contentSettings.customPostCount
          : contentSettings.postCount;
      addNotification &&
        addNotification({
          type: "success",
          message: `Đã tạo thành công ${postCountDisplay} bài viết cho chủ đề "${
            selectedTopic?.title || selectedTopic?.name || ""
          }"!`,
          createdAt: new Date(),
        });
      // Phát âm thanh
      playNotificationSound && playNotificationSound();
      // toast.success("Tạo nội dung thành công!", { style: TOAST_STYLE });
    } catch (err) {
      setError("Không thể tạo nội dung. Vui lòng thử lại.");
      setGenerating(false);
      // toast.error("Tạo nội dung thất bại!", { style: TOAST_STYLE });
    }
  };

  // Function để xử lý khi người dùng chọn xem chi tiết content
  const handleViewDetail = (content) => {
    setSelectedContentForDetail(content);
    setShowContentDetail(true);
  };

  // Function để xử lý chỉnh sửa content
  const handleEditContent = (content) => {
    setEditingContent({ ...content });
  };

  // Function để lưu content đã chỉnh sửa
  const handleSaveEditedContent = (editedContent) => {
    setPreviewContent((prevContent) =>
      prevContent.map((content) =>
        content.id === editedContent.id ? editedContent : content
      )
    );
    setEditingContent(null);
  };

  // Function để hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingContent(null);
  };

  // Function để toggle chọn content
  const handleToggleSelectContent = (contentId) => {
    setSelectedContentIds((prev) =>
      prev.includes(contentId)
        ? prev.filter((id) => id !== contentId)
        : [...prev, contentId]
    );
  };

  // Function để chọn tất cả content
  const handleSelectAll = () => {
    setSelectedContentIds(previewContent.map((content) => content.id));
  };

  // Function để bỏ chọn tất cả content
  const handleDeselectAll = () => {
    setSelectedContentIds([]);
  };

  const handleSaveSelectedContent = async () => {
    try {
      setGenerating(true);

      const response = await approveAndCleanPosts(
        selectedTopic?.id,
        selectedContentIds
      );
      const approvedPosts = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setPreviewContent(approvedPosts);
      setShowPublisher(false);
      toast.success("Lưu nội dung thành công!");
      setGenerating(false);
      setShowResults(false); // Nếu muốn ẩn kết quả sau khi lưu

      // Gọi callback để cập nhật danh sách content ở component cha
      if (typeof onContentSaved === "function") {
        // Truyền về mảng content mới đã được duyệt
        onContentSaved(approvedPosts);
      }
      // Đóng modal sau khi lưu thành công
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (err) {
      setGenerating(false);
      toast.error("Lưu nội dung thất bại!");
    }
  };
  // Function để xử lý khi publish thành công
  const handlePublishSuccess = (publishResult) => {
    onGenerate(publishResult.publishedContent);
    setShowPublisher(false);
    setShowResults(false);
    setPreviewContent([]);
    setSelectedContentForDetail(null);
    setShowContentDetail(false);
    setEditingContent(null);
    setSelectedContentIds([]);
    // toast.success("Publish nội dung lên mạng xã hội thành công!", {
    //   style: TOAST_STYLE,
    // });
  };

  // Function để quay lại form settings
  const handleBackToSettings = () => {
    setShowResults(false);
    setPreviewContent([]);
    setSelectedContentForDetail(null);
    setShowContentDetail(false);
    setEditingContent(null);
    setSelectedContentIds([]);
    setShowPublisher(false);
  };

  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyMargin = document.body.style.margin;
      const originalBodyPadding = document.body.style.padding;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.margin = originalBodyMargin;
        document.body.style.padding = originalBodyPadding;
        document.body.style.height = "";
        document.body.style.width = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      {/* Overlay phủ toàn bộ viewport */}
      <div
        className="fixed bg-black bg-opacity-60"
        style={{
          zIndex: 99999,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      />

      {/* Modal container */}
      <div
        className="fixed flex items-center justify-center"
        style={{
          zIndex: 100000,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: "16px",
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  AI Tạo Nội Dung
                </h2>
                <p className="text-sm text-gray-600">
                  Tự động tạo nội dung bài đăng cho topic:{" "}
                  <span className="font-bold">
                    {selectedTopic?.title ||
                      selectedTopic?.name ||
                      "Chưa có tên chủ đề"}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Hiển thị kết quả content */}
            {showResults ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3 sm:items-center sm:justify-between sm:flex-row flex-col">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      🎉 AI đã tạo {previewContent.length} nội dung cho bạn!
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Chọn những nội dung phù hợp để publish lên mạng xã hội
                    </p>
                  </div>
                  <button
                    onClick={handleBackToSettings}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Quay lại cài đặt
                  </button>
                </div>

                {/* Content Selection Controls */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      Đã chọn:{" "}
                      <span className="text-green-600 font-bold">
                        {selectedContentIds.length}
                      </span>
                      /{previewContent.length} nội dung
                    </span>
                    {selectedContentIds.length > 0 ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Sẵn sàng publish
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        ⚠️ Chưa chọn nội dung
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleSelectAll}
                      disabled={
                        selectedContentIds.length === previewContent.length
                      }
                      className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                        selectedContentIds.length === previewContent.length
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      Chọn tất cả
                    </button>
                    <button
                      onClick={handleDeselectAll}
                      disabled={selectedContentIds.length === 0}
                      className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                        selectedContentIds.length === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                </div>

                {/* Grid hiển thị content */}
                <div className="grid grid-cols-1 gap-6 max-h-[60vh] overflow-y-auto">
                  {previewContent.map((content, index) => {
                    const isSelected = selectedContentIds.includes(content.id);
                    return (
                      <div
                        key={content.id}
                        className={`bg-white border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() => handleToggleSelectContent(content.id)}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {/* Checkbox để chọn content */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation(); // Ngăn trigger click của container
                                  handleToggleSelectContent(content.id);
                                }}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                              />
                            </div>
                            <div
                              className={`w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold ${
                                isSelected ? "ring-2 ring-green-500" : ""
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-gray-600 uppercase bg-gray-100 px-3 py-1 rounded-full">
                                  {content.type}
                                </span>
                                {isSelected && (
                                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                                    ✓ Đã chọn
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Ước tính reach:{" "}
                                {content.estimatedReach
                                  ? content.estimatedReach.toLocaleString()
                                  : "0"}{" "}
                                người
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Ngăn trigger click của container
                                handleViewDetail(content);
                              }}
                              className="text-green-600 hover:text-green-800 font-medium text-sm border border-green-300 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              <Eye size={14} className="inline mr-1" />
                              Xem chi tiết
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Nội dung bài viết:
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800 whitespace-pre-line">
                              {content.content}
                            </p>
                          </div>
                        </div>

                        {/* Removed hashtags, best time, and estimated interaction sections as requested */}
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {selectedContentIds.length > 0 ? (
                      <>
                        Sẵn sàng publish{" "}
                        <span className="font-bold text-green-600">
                          {selectedContentIds.length}
                        </span>{" "}
                        nội dung được chọn
                      </>
                    ) : (
                      <>Chưa chọn nội dung nào để publish</>
                    )}
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row gap-2 sm:space-x-3">
                    <button
                      onClick={handleBackToSettings}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Tạo lại
                    </button>
                    {selectedContentIds.length > 0 && (
                      <button
                        onClick={handleSaveSelectedContent}
                        className="w-full sm:w-auto px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <span>💾 Lưu nội dung đã chọn</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {selectedContentIds.length}
                        </span>
                      </button>
                    )}
                    {selectedContentIds.length === 0 && (
                      <button
                        disabled
                        className="w-full sm:w-auto px-6 py-2 text-sm font-medium bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Chọn nội dung để publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Form settings - content hiện tại */
              <>
                {/* Content Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Post Count */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Số lượng bài viết
                    </label>
                    <div className="w-full flex items-center gap-2 mb-2">
                      <select
                        value={
                          contentSettings.postCount > 0
                            ? contentSettings.postCount
                            : -1
                        }
                        onChange={
                          generating
                            ? undefined
                            : (e) => {
                                const val = parseInt(e.target.value);
                                if (val === -1) {
                                  setContentSettings({
                                    ...contentSettings,
                                    postCount: -1,
                                    customPostCount: "",
                                  });
                                } else {
                                  setContentSettings({
                                    ...contentSettings,
                                    postCount: val,
                                    customPostCount: undefined,
                                  });
                                }
                              }
                        }
                        disabled={generating}
                        className={`px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base shadow-sm min-w-[180px] max-w-[220px] ${
                          generating ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      >
                        <option value={1}>1 bài viết</option>
                        <option value={2}>2 bài viết</option>
                        <option value={3}>3 bài viết</option>
                        <option value={-1}>Tùy chọn...</option>
                      </select>
                      {contentSettings.postCount === -1 && (
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={contentSettings.customPostCount ?? ""}
                          onChange={
                            generating
                              ? undefined
                              : (e) => {
                                  const val = e.target.value;
                                  // Cho phép xóa input
                                  if (
                                    val === "" ||
                                    (/^\d+$/.test(val) &&
                                      Number(val) > 0 &&
                                      Number(val) <= 50)
                                  ) {
                                    setContentSettings({
                                      ...contentSettings,
                                      customPostCount:
                                        val === "" ? "" : Number(val),
                                    });
                                  }
                                }
                          }
                          disabled={generating}
                          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-base shadow-sm flex-1 w-full min-w-[220px]"
                          placeholder="Số lượng bài viết mong muốn"
                          style={{ minWidth: 0 }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Section nhập hướng dẫn cho AI */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Hướng dẫn thêm cho AI (tuỳ chọn)
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={4}
                      placeholder="Nhập hướng dẫn chi tiết cho AI để tạo nội dung đúng ý bạn (ví dụ: chủ đề, phong cách, yêu cầu đặc biệt...)"
                      value={additionalInstructions}
                      onChange={(e) =>
                        setAdditionalInstructions(e.target.value)
                      }
                      disabled={generating}
                    />
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tone giọng điệu
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {toneOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={
                          generating
                            ? undefined
                            : () =>
                                setContentSettings({
                                  ...contentSettings,
                                  tone: option.value,
                                })
                        }
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          contentSettings.tone === option.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-gray-400"
                        } ${
                          generating
                            ? "cursor-not-allowed opacity-50 pointer-events-none"
                            : ""
                        }`}
                      >
                        <div className="font-medium text-sm">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Tự động tạo hashtags
                      </span>
                      <p className="text-xs text-gray-500">
                        Hashtags tối ưu SEO
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentSettings.includeHashtags}
                      onChange={
                        generating
                          ? undefined
                          : (e) =>
                              setContentSettings({
                                ...contentSettings,
                                includeHashtags: e.target.checked,
                              })
                      }
                      disabled={generating}
                      className={`h-4 w-4 text-green-600 ${
                        generating ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Thêm Call-to-Action
                      </span>
                      <p className="text-xs text-gray-500">Kêu gọi hành động</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={contentSettings.includeCTA}
                      onChange={
                        generating
                          ? undefined
                          : (e) =>
                              setContentSettings({
                                ...contentSettings,
                                includeCTA: e.target.checked,
                              })
                      }
                      disabled={generating}
                      className={`h-4 w-4 text-green-600 ${
                        generating ? "cursor-not-allowed opacity-50" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Generation Progress */}
                {generating && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mb-6"></div>
                    <h4 className="font-medium text-green-900 text-lg mb-2">
                      Đang tạo nội dung AI, vui lòng đợi...
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Quá trình này có thể mất vài phút tuỳ độ dài bài viết và
                      số lượng bài.
                    </p>
                  </div>
                )}

                {/* Info Box - chỉ hiển thị khi chưa có kết quả */}
                {!showResults && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Sparkles className="text-blue-600 mr-2" size={20} />
                      <h4 className="font-medium text-blue-900">
                        AI sẽ tạo gì?
                      </h4>
                    </div>
                    <ul className="text-blue-700 mt-2 text-sm space-y-1">
                      <li>• {contentSettings.postCount} bài viết đa dạng</li>
                      <li>• Nội dung tối ưu và thu hút</li>
                      {contentSettings.includeHashtags && (
                        <li>• Hashtags tối ưu SEO</li>
                      )}
                      {contentSettings.includeCTA && (
                        <li>• Call-to-action hấp dẫn</li>
                      )}
                      <li>• Ý tưởng hình ảnh kèm theo</li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer buttons - chỉ hiển thị khi chưa có kết quả */}
          {!showResults && (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-6 border-t bg-gray-50">
              <button
                onClick={generating ? undefined : onClose}
                disabled={generating}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 ${
                  generating ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Hủy
              </button>
              <button
                onClick={generateContent}
                disabled={generating}
                className={`w-full sm:w-auto px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                  generating
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 inline" size={16} />
                    Tạo nội dung
                  </>
                )}
              </button>
            </div>
          )}

          {/* Modal Xem Chi Tiết Content */}
          {showContentDetail && selectedContentForDetail && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
              style={{
                zIndex: 100001,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      <Eye size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Chi tiết nội dung
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowContentDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Content Preview */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      📝 Nội dung bài viết:
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                        {selectedContentForDetail.content}
                      </p>
                    </div>
                  </div>

                  {/* Removed hashtag list in detail modal */}

                  {/* Suggested Images */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      🖼️ Đề xuất hình ảnh:
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedContentForDetail.imageUrl ? (
                        <div className="bg-gray-100 p-3 rounded-lg text-center">
                          <img
                            src={selectedContentForDetail.imageUrl}
                            alt="Đề xuất hình ảnh"
                            className="w-12 h-12 rounded-lg mx-auto mb-2 object-cover cursor-pointer"
                            onClick={() =>
                              setZoomImage(selectedContentForDetail.imageUrl)
                            }
                          />
                          <p className="text-xs text-gray-600">Ảnh đề xuất</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Không có đề xuất hình ảnh
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Modal zoom ảnh */}
                  {zoomImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100002]">
                      <div className="relative flex flex-col items-center">
                        <button
                          onClick={() => setZoomImage(null)}
                          className="absolute -top-8 right-0 bg-white rounded-full shadow px-3 py-1 text-gray-700 hover:bg-gray-200 font-bold text-lg"
                          style={{ zIndex: 100003 }}
                        >
                          &times;
                        </button>
                        <img
                          src={zoomImage}
                          alt="Zoom ảnh"
                          className="max-w-[80vw] max-h-[80vh] rounded-lg shadow-2xl border border-white"
                          style={{ background: "white" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                  <button
                    onClick={() => setShowContentDetail(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Đóng
                  </button>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedContentForDetail.content
                        );
                        alert("Đã copy nội dung!");
                      }}
                      className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      📋 Copy Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Chỉnh Sửa Content */}
          {editingContent && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4"
              style={{
                zIndex: 100001,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: "100vh",
              }}
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      <Edit size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Chỉnh sửa nội dung
                      </h3>
                      <p className="text-sm text-gray-600">
                        Loại:{" "}
                        <span className="font-medium">
                          {editingContent.type}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Edit Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Nội dung bài viết:
                    </label>
                    <textarea
                      value={editingContent.content}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          content: e.target.value,
                        })
                      }
                      className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Nhập nội dung bài viết..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editingContent.content?.length || 0} ký tự
                    </p>
                  </div>

                  {/* Removed hashtag editing section */}
                </div>

                <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Hủy
                  </button>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewDetail(editingContent)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                    >
                      <Eye size={16} className="inline mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleSaveEditedContent(editingContent)}
                      className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✅ Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIContentGenerator;
