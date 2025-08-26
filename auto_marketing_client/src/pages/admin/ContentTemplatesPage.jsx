import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Copy,
  Download,
  Star,
  Users,
} from "lucide-react";

const ContentTemplatesPage = () => {
  const [showMobileStats, setShowMobileStats] = useState(false);

  const stats = [
    {
      title: "Tổng template",
      value: "156",
      change: "+23.5%",
      changeType: "positive",
      icon: Bot,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Template đang sử dụng",
      value: "89",
      change: "+18.7%",
      changeType: "positive",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Template mới tạo",
      value: "23",
      change: "+45.2%",
      changeType: "positive",
      icon: Plus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đánh giá trung bình",
      value: "4.8/5",
      change: "+0.2",
      changeType: "positive",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const templates = [
    {
      id: "TEMP001",
      name: "Template Email Marketing Chào mừng",
      category: "Email Marketing",
      description:
        "Template email chào mừng khách hàng mới với thiết kế responsive và nội dung tùy chỉnh",
      author: "AI Assistant",
      usage: 234,
      rating: 4.9,
      downloads: 1567,
      lastUpdated: "2025-01-15",
      status: "active",
      tags: ["email", "welcome", "responsive"],
    },
    {
      id: "TEMP002",
      name: "Template Landing Page Bán hàng",
      category: "Landing Page",
      description:
        "Template landing page tối ưu cho chuyển đổi với CTA mạnh mẽ và thiết kế hiện đại",
      author: "AI Assistant",
      usage: 189,
      rating: 4.7,
      downloads: 1245,
      lastUpdated: "2025-01-14",
      status: "active",
      tags: ["landing", "sales", "conversion"],
    },
    {
      id: "TEMP003",
      name: "Template Social Media Post",
      category: "Social Media",
      description:
        "Bộ template đăng bài mạng xã hội với nhiều kích thước và phong cách khác nhau",
      author: "AI Assistant",
      usage: 456,
      rating: 4.8,
      downloads: 2890,
      lastUpdated: "2025-01-13",
      status: "active",
      tags: ["social", "post", "design"],
    },
    {
      id: "TEMP004",
      name: "Template Blog Post SEO",
      category: "Blog",
      description:
        "Template bài viết blog tối ưu SEO với cấu trúc heading và meta tags chuẩn",
      author: "AI Assistant",
      usage: 123,
      rating: 4.6,
      downloads: 876,
      lastUpdated: "2025-01-12",
      status: "active",
      tags: ["blog", "seo", "content"],
    },
    {
      id: "TEMP005",
      name: "Template Newsletter",
      category: "Newsletter",
      description:
        "Template newsletter chuyên nghiệp với layout đẹp và dễ tùy chỉnh",
      author: "AI Assistant",
      usage: 78,
      rating: 4.5,
      downloads: 543,
      lastUpdated: "2025-01-11",
      status: "active",
      tags: ["newsletter", "email", "professional"],
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        text: "Đang hoạt động",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      inactive: {
        text: "Không hoạt động",
        className: "bg-red-100 text-red-800 border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      "Email Marketing": "bg-blue-100 text-blue-800 border-blue-200",
      "Landing Page": "bg-green-100 text-green-800 border-green-200",
      "Social Media": "bg-purple-100 text-purple-800 border-purple-200",
      Blog: "bg-orange-100 text-orange-800 border-orange-200",
      Newsletter: "bg-pink-100 text-pink-800 border-pink-200",
    };

    const className =
      categoryConfig[category] || "bg-gray-100 text-gray-800 border-gray-200";
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${className}`}
      >
        {category}
      </span>
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} className="text-yellow-400 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} className="text-gray-300" />
      );
    }

    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Template AI
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và tùy chỉnh các template AI cho nội dung marketing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                <Plus size={16} />
                Tạo template mới
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Tổng quan</h2>
            <button
              onClick={() => setShowMobileStats(!showMobileStats)}
              className="lg:hidden px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {showMobileStats ? "Ẩn thống kê" : "Hiện thống kê"}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${
              !showMobileStats && "lg:block hidden"
            }`}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${stat.bgColor} border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    so với tháng trước
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách template
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm template..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả danh mục</option>
                <option value="email">Email Marketing</option>
                <option value="landing">Landing Page</option>
                <option value="social">Social Media</option>
                <option value="blog">Blog</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      {getCategoryBadge(template.category)}
                      {getStatusBadge(template.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {template.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tác giả:</span>
                    <span className="text-gray-900 font-medium">
                      {template.author}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Lượt sử dụng:</span>
                    <span className="text-gray-900 font-medium">
                      {template.usage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Đánh giá:</span>
                    <div className="flex items-center gap-2">
                      {renderStars(template.rating)}
                      <span className="text-gray-900 font-medium">
                        ({template.rating})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Lượt tải:</span>
                    <span className="text-gray-900 font-medium">
                      {template.downloads}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {template.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Cập nhật: {template.lastUpdated}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
                      <Copy size={14} />
                      Copy
                    </button>
                    <button className="px-3 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1">
                      <Download size={14} />
                      Tải
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <button className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Xem thêm template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTemplatesPage;
