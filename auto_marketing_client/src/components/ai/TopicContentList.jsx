import React from "react";

const TopicContentList = ({ topic, onClose }) => {
  if (!topic) return null;
  // Nếu topic có mảng content (contentList hoặc contents), render từng content
  let contents = [];
  if (Array.isArray(topic.contentList)) {
    contents = topic.contentList;
  } else if (Array.isArray(topic.contents)) {
    contents = topic.contents;
  }

  return (
    <div className="bg-white border border-blue-200 rounded-xl p-6 mt-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-blue-700">
          Danh sách Content cho: {topic.title || topic.name}
        </h4>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm font-semibold"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
      {contents.length > 0 ? (
        <ul className="space-y-4">
          {contents.map((content, idx) => (
            <li key={content.id || idx} className="border-b pb-3">
              {/* Nếu content là object có title/text/description thì render, nếu là chuỗi thì render trực tiếp */}
              <div className="font-semibold text-gray-900">
                {content.title || content.name || `Content ${idx + 1}`}
              </div>
              <div className="text-gray-700 text-sm mt-1">
                {content.text ||
                  content.description ||
                  (typeof content === "string"
                    ? content
                    : JSON.stringify(content))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-700 text-sm">
          {topic.description || "Chưa có content nào cho topic này."}
        </div>
      )}
    </div>
  );
};

export default TopicContentList;
