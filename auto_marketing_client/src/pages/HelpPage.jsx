import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Search,
  Book,
  MessageCircle,
  Video,
  Download,
  ExternalLink,
} from "lucide-react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const categories = [
    {
      icon: <Book className="w-8 h-8" />,
      title: "Bắt đầu",
      description: "Hướng dẫn cơ bản để bắt đầu với AutoMarketing",
      articles: 12,
      color: "blue",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Tính năng",
      description: "Tìm hiểu chi tiết về các tính năng của platform",
      articles: 25,
      color: "green",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video tutorials",
      description: "Học qua video hướng dẫn trực quan",
      articles: 8,
      color: "purple",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Tích hợp",
      description: "Kết nối với các công cụ và platform khác",
      articles: 15,
      color: "orange",
    },
  ];

  const popularArticles = [
    {
      title: "Cách tạo chiến dịch email marketing đầu tiên",
      views: "2.1k lượt xem",
      category: "Bắt đầu",
    },
    {
      title: "Tích hợp Facebook Ads với AutoMarketing",
      views: "1.8k lượt xem",
      category: "Tích hợp",
    },
    {
      title: "Phân khúc khách hàng tự động với AI",
      views: "1.5k lượt xem",
      category: "Tính năng",
    },
    {
      title: "Thiết lập chatbot cho website",
      views: "1.3k lượt xem",
      category: "Video tutorials",
    },
    {
      title: "Báo cáo và phân tích hiệu suất campaign",
      views: "1.1k lượt xem",
      category: "Tính năng",
    },
  ];

  const quickActions = [
    {
      title: "Live Chat",
      description: "Chat trực tiếp với team support",
      action: "Bắt đầu chat",
      icon: "💬",
      available: true,
    },
    {
      title: "Đặt lịch tư vấn",
      description: "Tư vấn 1-on-1 với chuyên gia",
      action: "Đặt lịch",
      icon: "📅",
      available: true,
    },
    {
      title: "Community Forum",
      description: "Tham gia cộng đồng người dùng",
      action: "Tham gia",
      icon: "👥",
      available: true,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trung tâm trợ giúp
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Tìm câu trả lời cho mọi thắc mắc về AutoMarketing
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, hướng dẫn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 -mt-8" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="text-3xl mb-4">{action.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {action.description}
                </p>
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    action.available
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {action.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Danh mục hướng dẫn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    category.color === "blue"
                      ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                      : category.color === "green"
                      ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                      : category.color === "purple"
                      ? "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
                      : "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                  }`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {category.articles} bài viết
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="bg-white py-12" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Bài viết phổ biến
          </h2>

          <div className="max-w-4xl mx-auto">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      {article.views}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section
        className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Không tìm thấy câu trả lời?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Đội ngũ support của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy
            liên hệ để được giải đáp nhanh chóng.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Liên hệ Support
            </a>
            <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Gửi ticket hỗ trợ
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>
              Thời gian phản hồi trung bình:{" "}
              <span className="text-white font-medium">&lt; 2 giờ</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
