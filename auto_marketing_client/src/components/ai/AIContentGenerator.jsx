import React, { useState, useEffect } from "react";
import { X, Wand2, FileText, Image, Sparkles, Eye, Edit } from "lucide-react";
import SocialMediaPublisher from "./SocialMediaPublisher";

const AIContentGenerator = ({ isOpen, onClose, onGenerate, selectedTopic }) => {
  const [generating, setGenerating] = useState(false);
  const [contentSettings, setContentSettings] = useState({
    postCount: 3, // Thay đổi từ 5 thành 3
    contentType: "mixed", // text, image, video, mixed
    tone: "professional", // casual, professional, playful, urgent
    includeHashtags: true,
    includeCTA: true,
  });

  const [generationStep, setGenerationStep] = useState(0);
  const [previewContent, setPreviewContent] = useState([]);
  const [showResults, setShowResults] = useState(false); // State để hiển thị kết quả
  const [selectedContentForDetail, setSelectedContentForDetail] =
    useState(null); // Content được chọn để xem chi tiết
  const [showContentDetail, setShowContentDetail] = useState(false); // Modal xem chi tiết
  const [editingContent, setEditingContent] = useState(null); // Content đang được chỉnh sửa
  const [selectedContentIds, setSelectedContentIds] = useState([]); // Danh sách ID content được chọn để publish
  const [showPublisher, setShowPublisher] = useState(false); // Modal publish content

  const contentTypes = [
    { value: "text", label: "Chỉ văn bản", icon: FileText },
    { value: "image", label: "Hình ảnh + văn bản", icon: Image },
    { value: "mixed", label: "Đa dạng", icon: Sparkles },
  ];

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

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStep(0);
    setShowResults(false);

    const steps = [
      "Phân tích topic và chiến dịch...",
      "Nghiên cứu xu hướng nội dung...",
      "Tạo ý tưởng nội dung...",
      "Viết nội dung cho từng platform...",
      "Tối ưu hashtags và CTA...",
      "Đề xuất hình ảnh...",
      "Hoàn thành!",
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Generate mock content
    const generatedContent = await generateContentForTopic();
    setPreviewContent(generatedContent);

    // Mặc định chọn tất cả content mới tạo
    setSelectedContentIds(generatedContent.map((content) => content.id));

    // Hiển thị kết quả thay vì gọi onGenerate ngay
    setShowResults(true);
    setGenerating(false);
  };

  const generateContentForTopic = async () => {
    // Mock AI content generation với độ đa dạng cao
    const contentTemplates = [
      {
        type: "promotional",
        template:
          "🔥 Đừng bỏ lỡ cơ hội! {topic_name} với ưu đãi lên đến {discount}%!\n\n✨ {benefit_1}\n✨ {benefit_2}\n✨ {benefit_3}\n\n👉 {cta}",
        images: ["product-showcase", "discount-banner", "lifestyle-shot"],
        priority: 1, // Ưu tiên cao cho content khuyến mãi
      },
      {
        type: "educational",
        template:
          "💡 Bạn có biết? {topic_name} có thể giúp bạn:\n\n📌 {tip_1}\n📌 {tip_2}\n📌 {tip_3}\n\nHãy thử ngay và chia sẻ kết quả nhé! 💪\n\n{cta}",
        images: ["infographic", "step-by-step", "before-after"],
        priority: 2, // Ưu tiên cao cho content giáo dục
      },
      {
        type: "social_proof",
        template:
          '🌟 Khách hàng nói gì về {topic_name}?\n\n💬 "{testimonial}"\n- {customer_name}\n\n🎯 Kết quả: {result}\n⭐ Đánh giá: 5/5 sao\n\n{cta}',
        images: ["customer-photo", "review-screenshot", "result-image"],
        priority: 3,
      },
      {
        type: "behind_scenes",
        template:
          "🎬 Hậu trường {topic_name}\n\n👀 Bạn có tò mò về quy trình tạo ra {product}?\n\n🔹 {process_1}\n🔹 {process_2}\n🔹 {process_3}\n\nCảm ơn team đã làm việc chăm chỉ! 👏\n\n{cta}",
        images: ["behind-scenes", "team-work", "process-shot"],
        priority: 4,
      },
      {
        type: "trending",
        template:
          "📈 Xu hướng mới nhất về {topic_name}!\n\n🚀 Điều mọi người đang quan tâm:\n\n💫 {trend_1}\n💫 {trend_2}\n💫 {trend_3}\n\nBạn đã sẵn sàng bắt kịp xu hướng?\n\n{cta}",
        images: ["trending-graphic", "stats-chart", "modern-design"],
        priority: 5,
      },
    ];

    const mockContent = [];

    // Sắp xếp templates theo mức độ ưu tiên để đảm bảo content đa dạng
    const sortedTemplates = contentTemplates.sort(
      (a, b) => a.priority - b.priority
    );

    for (let i = 0; i < contentSettings.postCount; i++) {
      // Đảm bảo luôn chọn template khác nhau cho mỗi bài đầu tiên
      const templateIndex =
        i < sortedTemplates.length ? i : i % sortedTemplates.length;
      const template = sortedTemplates[templateIndex];

      const content = {
        id: Date.now() + i,
        type: template.type,
        topicId: selectedTopic.id,
        topicName: selectedTopic.title,
        content: template.template
          .replace(/{topic_name}/g, selectedTopic.title)
          .replace(/{discount}/g, Math.floor(Math.random() * 50) + 10)
          .replace(/{benefit_1}/g, "Chất lượng cao đảm bảo")
          .replace(/{benefit_2}/g, "Giá cả phải chăng")
          .replace(/{benefit_3}/g, "Hỗ trợ 24/7")
          .replace(/{tip_1}/g, "Tiết kiệm thời gian hiệu quả")
          .replace(/{tip_2}/g, "Tăng năng suất làm việc")
          .replace(/{tip_3}/g, "Cải thiện chất lượng cuộc sống")
          .replace(/{testimonial}/g, "Sản phẩm tuyệt vời, tôi rất hài lòng!")
          .replace(/{customer_name}/g, "Nguyễn Thị Lan")
          .replace(/{result}/g, "Tăng 150% hiệu quả")
          .replace(/{product}/g, selectedTopic.title.toLowerCase())
          .replace(/{process_1}/g, "Nghiên cứu kỹ lưỡng")
          .replace(/{process_2}/g, "Thiết kế tỉ mỉ")
          .replace(/{process_3}/g, "Kiểm tra chất lượng")
          .replace(/{trend_1}/g, "Công nghệ mới nhất")
          .replace(/{trend_2}/g, "Thiết kế hiện đại")
          .replace(/{trend_3}/g, "Trải nghiệm tối ưu")
          .replace(
            /{cta}/g,
            contentSettings.includeCTA ? "👆 Đặt hàng ngay!" : ""
          ),
        hashtags: contentSettings.includeHashtags
          ? [
              `#${selectedTopic.title.replace(/\s+/g, "")}`,
              "#Marketing",
              "#Sale",
              "#Quality",
              "#Vietnam",
            ]
          : [],
        suggestedImages: template.images,
        estimatedReach: Math.floor(Math.random() * 10000) + 1000,
        bestTimeToPost: "14:00 - 16:00",
        aiSettings: contentSettings,
        status: "generated",
        createdDate: new Date().toISOString(),
      };

      mockContent.push(content);
    }

    return mockContent;
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

  // Function để lưu chỉ những content được chọn
  const handleSaveSelectedContent = () => {
    // Mở modal publish thay vì gọi onGenerate trực tiếp
    setShowPublisher(true);
  };

  // Function để xử lý khi publish thành công
  const handlePublishSuccess = (publishResult) => {
    // Gọi onGenerate với content đã được publish
    onGenerate(publishResult.publishedContent);

    // Đóng tất cả modals
    setShowPublisher(false);
    setShowResults(false);
    setPreviewContent([]);
    setSelectedContentForDetail(null);
    setShowContentDetail(false);
    setEditingContent(null);
    setSelectedContentIds([]);
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save original values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyMargin = document.body.style.margin;
      const originalBodyPadding = document.body.style.padding;

      // Apply modal styles
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";

      return () => {
        // Restore original values
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
        className="fixed bg-black bg-opacity-60 backdrop-blur-sm"
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
          <div className="flex items-center justify-between p-6 border-b">
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
                  <span className="font-medium">
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
                <div className="flex items-center justify-between">
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
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
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
                  <div className="flex space-x-2">
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
                <div className="grid grid-cols-1 gap-6 max-h-96 overflow-y-auto">
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
                        <div className="flex items-center justify-between mb-4">
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
                                {content.estimatedReach.toLocaleString()} người
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Ngăn trigger click của container
                                handleEditContent(content);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-300 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <Edit size={14} className="inline mr-1" />
                              Chỉnh sửa
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

                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              Hashtags:
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {content.hashtags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-blue-700">
                              <strong>Thời gian đăng tốt nhất:</strong>{" "}
                              {content.bestTimeToPost}
                            </div>
                            <div className="text-green-700 font-medium">
                              Ước tính tương tác:{" "}
                              {Math.floor(
                                content.estimatedReach * 0.1
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
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
                  <div className="flex space-x-3">
                    <button
                      onClick={handleBackToSettings}
                      className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Tạo lại
                    </button>
                    {selectedContentIds.length > 0 && (
                      <button
                        onClick={handleSaveSelectedContent}
                        className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <span>🚀 Publish nội dung đã chọn</span>
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {selectedContentIds.length}
                        </span>
                      </button>
                    )}
                    {selectedContentIds.length === 0 && (
                      <button
                        disabled
                        className="px-6 py-2 text-sm font-medium bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng bài viết
                    </label>
                    <select
                      value={contentSettings.postCount}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          postCount: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={2}>2 bài viết</option>
                      <option value={3}>3 bài viết</option>
                      <option value={5}>5 bài viết</option>
                      <option value={10}>10 bài viết</option>
                    </select>
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại nội dung
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {contentTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.value}
                            onClick={() =>
                              setContentSettings({
                                ...contentSettings,
                                contentType: type.value,
                              })
                            }
                            className={`p-2 border rounded-lg cursor-pointer transition-all text-center ${
                              contentSettings.contentType === type.value
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <Icon size={16} className="mx-auto mb-1" />
                            <div className="text-xs">{type.label}</div>
                          </div>
                        );
                      })}
                    </div>
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
                        onClick={() =>
                          setContentSettings({
                            ...contentSettings,
                            tone: option.value,
                          })
                        }
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          contentSettings.tone === option.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-gray-400"
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
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          includeHashtags: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-green-600"
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
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          includeCTA: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-green-600"
                    />
                  </div>
                </div>

                {/* Generation Progress */}
                {generating && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-3"></div>
                      <h4 className="font-medium text-green-900">
                        AI đang tạo nội dung...
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Phân tích topic và chiến dịch...",
                        "Nghiên cứu xu hướng nội dung...",
                        "Tạo ý tưởng nội dung...",
                        "Viết nội dung cho từng platform...",
                        "Tối ưu hashtags và CTA...",
                        "Đề xuất hình ảnh...",
                        "Hoàn thành!",
                      ].map((step, index) => (
                        <div
                          key={index}
                          className={`text-sm ${
                            index <= generationStep
                              ? "text-green-700 font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {index <= generationStep ? "✅" : "⏳"} {step}
                        </div>
                      ))}
                    </div>
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
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Hủy
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
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
                    Tạo Nội Dung
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
                      <p className="text-sm text-gray-600">
                        Loại:{" "}
                        <span className="font-medium">
                          {selectedContentForDetail.type}
                        </span>
                      </p>
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

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2">
                        📊 Ước tính hiệu suất
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Reach:</span>
                          <span className="font-bold text-blue-900">
                            {selectedContentForDetail.estimatedReach?.toLocaleString() ||
                              "0"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">
                            Tương tác dự kiến:
                          </span>
                          <span className="font-bold text-blue-900">
                            {Math.floor(
                              (selectedContentForDetail.estimatedReach || 0) *
                                0.1
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-900 mb-2">
                        ⏰ Thời gian tối ưu
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Đăng bài:</span>
                          <span className="font-bold text-green-900">
                            {selectedContentForDetail.bestTimeToPost ||
                              "14:00-16:00"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Ngày tốt nhất:</span>
                          <span className="font-bold text-green-900">
                            Thứ 3 - Thứ 5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      # Hashtags:
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedContentForDetail.hashtags?.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Images */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      🖼️ Đề xuất hình ảnh:
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedContentForDetail.suggestedImages?.map(
                        (image, i) => (
                          <div
                            key={i}
                            className="bg-gray-100 p-3 rounded-lg text-center"
                          >
                            <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <Image size={24} className="text-gray-600" />
                            </div>
                            <p className="text-xs text-gray-600 capitalize">
                              {image.replace("-", " ")}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
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
                        setShowContentDetail(false);
                        handleEditContent(selectedContentForDetail);
                      }}
                      className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit size={16} className="inline mr-1" />
                      Chỉnh sửa
                    </button>
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

                  {/* Edit Hashtags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      # Hashtags (phân cách bằng dấu phẩy):
                    </label>
                    <input
                      type="text"
                      value={editingContent.hashtags?.join(", ") || ""}
                      onChange={(e) =>
                        setEditingContent({
                          ...editingContent,
                          hashtags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#hashtag1, #hashtag2, #hashtag3"
                    />
                  </div>
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

      {/* Social Media Publisher Modal */}
      <SocialMediaPublisher
        isOpen={showPublisher}
        onClose={() => setShowPublisher(false)}
        selectedContent={previewContent.filter((content) =>
          selectedContentIds.includes(content.id)
        )}
        onPublishSuccess={handlePublishSuccess}
      />
    </>
  );
};

export default AIContentGenerator;
