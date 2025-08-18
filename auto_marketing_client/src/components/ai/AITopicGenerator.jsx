  import React, { useState, useEffect } from "react";
  import { X, Wand2, Sparkles } from "lucide-react";
  import { getAllCampaigns } from "../../service/campaign_service";
  import { generateTopicsWithAI } from "../../service/topic_service";

  const AITopicGenerator = ({ isOpen, onClose, onGenerate }) => {
    const [selectedCampaign, setSelectedCampaign] = useState("");
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [topicsCount, setTopicsCount] = useState(10);
    const [additionalInstructions, setAdditionalInstructions] = useState("");
    const [aiSettings, setAiSettings] = useState({
      creativity: "balanced", // conservative, balanced, creative
      contentStyle: "professional", // friendly, professional, creative
      targetAudience: "general", // specific, general, broad
    });

    const creativityOptions = [
      {
        value: "conservative",
        label: "Bảo thủ",
        description: "An toàn, chuyên nghiệp",
      },
      {
        value: "balanced",
        label: "Cân bằng",
        description: "Vừa an toàn vừa sáng tạo",
      },
      { value: "creative", label: "Sáng tạo", description: "Táo bạo, độc đáo" },
    ];

    const styleOptions = [
      { value: "friendly", label: "Thân thiện", description: "Gần gũi, dễ hiểu" },
      {
        value: "professional",
        label: "Chuyên nghiệp",
        description: "Trang trọng, uy tín",
      },
      { value: "creative", label: "Sáng tạo", description: "Độc đáo, thu hút" },
    ];

    // Fetch campaigns when modal opens
    useEffect(() => {
      if (isOpen) {
        fetchCampaigns();
      }
    }, [isOpen]);

    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const campaignsData = await getAllCampaigns();
        setCampaigns(campaignsData);
      } catch (err) {
        console.error("Error fetching campaigns:", err);

        // Hiển thị lỗi cho user
        if (
          err.code === "NETWORK_ERROR" ||
          err.message.includes("Network Error")
        ) {
          setError(
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
          );
        } else if (err.response?.status === 404) {
          setError("API endpoint không tồn tại.");
        } else if (err.response?.status >= 500) {
          setError("Lỗi server. Vui lòng thử lại sau.");
        } else {
          setError("Không thể tải danh sách chiến dịch. Vui lòng thử lại.");
        }

        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    const handleGenerate = async () => {
      if (!selectedCampaign) return;

      setGenerating(true);

      try {
        // Prepare request data for API
        const requestData = {
          campaignId: parseInt(selectedCampaign),
          numberOfTopics: topicsCount,
          creativityLevel: aiSettings.creativity,
          contentStyle: aiSettings.contentStyle,
          additionalInstructions: additionalInstructions.trim() || undefined,
        };

        // Call real API to generate topics
        const generatedTopics = await generateTopicsWithAI(requestData);

        // Transform API response to match UI format
        const transformedTopics = generatedTopics.map((topic, index) => ({
          id: topic.id,
          title: topic.name,
          description: topic.description,
          category: "AI Generated",
          campaignId: topic.campaignId,
          campaignName:
            campaigns.find((c) => c.id === topic.campaignId)?.name ||
            "Unknown Campaign",
          posts: 0,
          pendingPosts: 0,
          publishedPosts: 0,
          engagement: "0",
          status:
            topic.status === "PENDING"
              ? "needs_content"
              : topic.status.toLowerCase(),
          aiGenerated: topic.generatedByAI,
          createdDate: topic.createdAt,
          platforms: campaigns.find((c) => c.id === topic.campaignId)
            ?.platforms || ["Facebook", "Instagram"],
          targetKeywords: [],
          aiSettings: aiSettings,
          aiPrompt: topic.aiPrompt,
        }));

        onGenerate(transformedTopics);
        onClose();
      } catch (error) {
        console.error("Error generating topics:", error);

        // Show user-friendly error message
        let errorMessage = "Không thể tạo topics. Vui lòng thử lại.";

        if (error.message.includes("timeout")) {
          errorMessage =
            "AI generation mất quá nhiều thời gian. Vui lòng thử lại với ít topics hơn.";
        } else if (error.message.includes("Network Error")) {
          errorMessage =
            "Không thể kết nối đến server AI. Kiểm tra kết nối mạng.";
        } else if (error.message.includes("Campaign not found")) {
          errorMessage =
            "Chiến dịch không tồn tại. Vui lòng chọn chiến dịch khác.";
        }

        setError(errorMessage);
      } finally {
        setGenerating(false);
      }
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Wand2 className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    AI Tạo Topics
                  </h2>
                  <p className="text-sm text-gray-600">
                    Tự động tạo các chủ đề cho chiến dịch marketing
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
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-red-600 mr-2">⚠️</div>
                    <div>
                      <h4 className="font-medium text-red-900">
                        Lỗi tải dữ liệu
                      </h4>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchCampaigns}
                    className="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    🔄 Thử lại
                  </button>
                </div>
              )}

              {/* Campaign Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn chiến dịch *
                </label>
                {loading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    <span className="text-gray-600">
                      Đang tải danh sách chiến dịch...
                    </span>
                  </div>
                ) : (
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={campaigns.length === 0}
                  >
                    <option value="">-- Chọn chiến dịch --</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                )}
                {!loading && campaigns.length === 0 && !error && (
                  <p className="text-sm text-gray-500 mt-1">
                    Không có chiến dịch nào. Hãy tạo chiến dịch mới trước.
                  </p>
                )}
              </div>

              {/* Topics Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng topics
                </label>
                <select
                  value={topicsCount}
                  onChange={(e) => setTopicsCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={5}>5 topics</option>
                  <option value={10}>10 topics</option>
                  <option value={15}>15 topics</option>
                  <option value={20}>20 topics</option>
                </select>
              </div>

              {/* Additional Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hướng dẫn thêm cho AI (tùy chọn)
                </label>
                <textarea
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Ví dụ: Tập trung vào đối tượng khách hàng trẻ tuổi, sử dụng hashtag trending, đề cập đến sản phẩm mới..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {additionalInstructions.length}/500 ký tự
                </div>
              </div>

              {/* AI Settings */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900">Cài đặt AI</h3>

                {/* Creativity Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ sáng tạo
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {creativityOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() =>
                          setAiSettings({
                            ...aiSettings,
                            creativity: option.value,
                          })
                        }
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          aiSettings.creativity === option.value
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phong cách nội dung
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {styleOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() =>
                          setAiSettings({
                            ...aiSettings,
                            contentStyle: option.value,
                          })
                        }
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          aiSettings.contentStyle === option.value
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Sparkles className="text-blue-600 mr-2" size={20} />
                  <h4 className="font-medium text-blue-900">AI sẽ tạo gì?</h4>
                </div>
                <ul className="text-blue-700 mt-2 text-sm space-y-1">
                  <li>
                    • {topicsCount} chủ đề được AI tạo ra phù hợp với chiến dịch
                  </li>
                  <li>• Mô tả chi tiết và hấp dẫn cho từng topic</li>
                  <li>• Phù hợp với mức độ sáng tạo và phong cách đã chọn</li>
                  <li>• Lưu trữ tự động vào database để quản lý</li>
                  <li>• Có thể approve/reject và chỉnh sửa sau khi tạo</li>
                </ul>
              </div>

              {generating && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                    <h4 className="font-medium text-purple-900">
                      AI đang phân tích và tạo topics...
                    </h4>
                  </div>
                  <p className="text-purple-700 mt-2 text-sm">
                    Đang sử dụng AI để phân tích chiến dịch và tạo {topicsCount}{" "}
                    topics phù hợp. Quá trình này có thể mất 30-90 giây tùy vào độ
                    phức tạp.
                  </p>
                  <div className="mt-3 text-xs text-purple-600">
                    💡 AI đang xem xét: Thông tin chiến dịch, mức độ sáng tạo (
                    {aiSettings.creativity}), phong cách nội dung (
                    {aiSettings.contentStyle})
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Hủy
              </button>
              <button
                onClick={handleGenerate}
                disabled={!selectedCampaign || generating}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !selectedCampaign || generating
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
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
                    Tạo Topics
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  export default AITopicGenerator;
