import React from "react";
import { Wand2 } from "lucide-react";

const AIGeneratedTopicCard = React.memo(function AIGeneratedTopicCard({ topic, campaign, checked, onCheck }) {
  return (
    <div
      key={`ai-topic-${topic.id}`}
      className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-30"></div>
      <div className="absolute -top-2 -right-2 z-10">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse border-2 border-white">
          ⭐ AI TẠO MỚI
        </div>
      </div>
      <div className="relative z-10">
        {/* Checkbox để approve topic */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wand2 className="text-white" size={18} />
            </div>
            <div>
              <div className="text-xs text-purple-600 font-medium">
                {campaign.name}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-bold">
                  <Wand2 size={10} className="mr-1" />
                  AI Generate
                </div>
              </div>
            </div>
          </div>
          {/* Checkbox approve */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={onCheck}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                checked
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              {checked && (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {checked ? "Đã chọn" : "Chọn lưu"}
            </span>
          </label>
        </div>
        <h4 className="text-lg font-bold text-purple-900 mb-3 line-clamp-2">
          {topic.title}
        </h4>
        <p className="text-purple-700 text-sm mb-4 line-clamp-3">
          {topic.description}
        </p>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            {checked
              ? "✅ Topic này sẽ được lưu"
              : "⏳ Chọn checkbox để lưu topic này"}
          </p>
        </div>
      </div>
    </div>
  );
});

export default AIGeneratedTopicCard;
