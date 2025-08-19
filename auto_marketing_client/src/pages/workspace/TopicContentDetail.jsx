import React, { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { getPostsByTopic } from "../../service/post_service";

const TopicContentDetail = ({ topic, onBack }) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        ) : contents.length > 0 ? (
          <div className="space-y-4">
            {contents.map((content, idx) => (
              <div
                key={content.id || idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    Content #{idx + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {content.createdAt}
                  </span>
                </div>
                <div className="text-gray-700 whitespace-pre-line">
                  {content.text || content.body || content.content}
                </div>
              </div>
            ))}
          </div>
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
