import React, { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { getPostsByTopic } from "../../service/post_service";
import dayjs from "dayjs";

const TopicContentDetail = ({ topic, onBack }) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <button
        className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
        onClick={onBack}
      >
        ← Quay lại danh sách chủ đề
      </button>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {topic.title || topic.name}
        </h2>
        <p className="text-gray-700 mb-2">{topic.description}</p>
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
            <button
              className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
              onClick={() => setSelectedContent(null)}
            >
              ← Quay lại danh sách content
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-900">
                  {selectedContent.title ||
                    selectedContent.text ||
                    selectedContent.body ||
                    selectedContent.content ||
                    `Content`}
                </span>
                <span className="text-xs text-gray-500">
                  {selectedContent.createdAt
                    ? dayjs(selectedContent.createdAt).format("DD-MM-YYYY")
                    : ""}
                </span>
              </div>
              <div className="text-gray-700 whitespace-pre-line mb-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg cursor-pointer flex flex-col"
                    onClick={() => setSelectedContent(content)}
                  >
                    {/* Hiển thị ảnh nếu có */}
                    {content.imageUrl && (
                      <div className="mb-3 flex justify-center">
                        <div className="relative group w-full max-w-xs">
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
                      <span className="font-semibold text-gray-800 block">
                        {content.title || `Content #${idx + 1}`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {preview}
                      {isLong ? "..." : ""}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
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
            <div className="flex justify-center mt-6 space-x-3">
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
