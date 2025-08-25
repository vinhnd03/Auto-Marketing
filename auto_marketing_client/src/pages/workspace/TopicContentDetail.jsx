import React, { useEffect, useState } from "react";
import AIContentGenerator from "../../components/ai/AIContentGenerator";
import { Wand2 } from "lucide-react";
import { getPostsByTopic } from "../../service/post_service";
import dayjs from "dayjs";

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
        const data = await getPostsByTopic(topic.id);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <button
          className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          onClick={onBack}
        >
          ← Quay lại danh sách chủ đề
        </button>
        <button
          className="px-4 py-2 w-full sm:w-auto bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          onClick={() => setShowGenContentModal(true)}
        >
          Tạo thêm nội dung
        </button>
      </div>
      {/* Modal AIContentGenerator */}
      <AIContentGenerator
        isOpen={showGenContentModal}
        onClose={() => setShowGenContentModal(false)}
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
          });
          const normalized = Array.isArray(newContents)
            ? newContents.map(normalize)
            : [normalize(newContents, 0)];
          setContents((prev) => [...normalized, ...prev]);
        }}
      />
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
              <button
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
                onClick={handleBackFromDetail}
              >
                ← Quay lại danh sách content
              </button>
              <span className="text-xs text-gray-500 sm:ml-4">
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
              {/* Ảnh ở dưới cùng */}
              {selectedContent.imageUrl && (
                <div className="mt-6 flex justify-center">
                  <div className="relative group w-full max-w-md">
                    <img
                      src={selectedContent.imageUrl}
                      alt="AI generated"
                      className="rounded-xl border-4 border-blue-300 shadow-lg object-cover w-full max-h-72 transition-transform duration-300 group-hover:scale-105 bg-white"
                      style={{ aspectRatio: "16/9", objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : contents.length > 0 ? (
          <>
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
                return (
                  <div
                    key={content.id || idx}
                    className="bg-white border border-gray-200 rounded-2xl p-8 shadow hover:shadow-lg cursor-pointer flex flex-col relative h-full"
                    onClick={() => setSelectedContent(content)}
                  >
                    {/* Badge Mới luôn nổi trên cùng */}
                    {content.isNew && (
                      <span
                        className="absolute z-20 top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                        style={{ pointerEvents: "none" }}
                      >
                        Mới
                      </span>
                    )}
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
                      <span className="font-semibold text-gray-800 block break-words">
                        {content.title || `Content #${idx + 1}`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 break-words">
                      {preview}
                      {isLong ? "..." : ""}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2">
                      <button
                        className="text-blue-600 text-xs font-semibold hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContent(content);
                        }}
                      >
                        Xem chi tiết
                      </button>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {content.createdAt
                          ? dayjs(content.createdAt).format("DD-MM-YYYY")
                          : ""}
                      </span>
                    </div>
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
