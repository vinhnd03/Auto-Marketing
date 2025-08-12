import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Play, Download, ExternalLink, CheckCircle } from "lucide-react";

export default function GuidePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const quickStartSteps = [
    {
      step: 1,
      title: "Tạo tài khoản",
      description: "Đăng ký tài khoản miễn phí và xác thực email",
      time: "2 phút",
      completed: true,
    },
    {
      step: 2,
      title: "Setup workspace",
      description: "Tạo workspace đầu tiên và import danh sách khách hàng",
      time: "5 phút",
      completed: false,
    },
    {
      step: 3,
      title: "Tạo campaign",
      description: "Thiết lập chiến dịch email marketing đầu tiên",
      time: "10 phút",
      completed: false,
    },
    {
      step: 4,
      title: "Theo dõi kết quả",
      description: "Xem báo cáo và tối ưu hóa hiệu suất",
      time: "5 phút",
      completed: false,
    },
  ];

  const guideCategories = [
    {
      category: "Bắt đầu nhanh",
      icon: "🚀",
      color: "blue",
      guides: [
        {
          title: "Hướng dẫn setup tài khoản đầu tiên",
          type: "Video",
          duration: "5:30",
          level: "Cơ bản",
        },
        {
          title: "Import danh sách khách hàng từ Excel",
          type: "Article",
          duration: "3 phút đọc",
          level: "Cơ bản",
        },
        {
          title: "Tạo template email đầu tiên",
          type: "Video",
          duration: "8:15",
          level: "Cơ bản",
        },
      ],
    },
    {
      category: "Email Marketing",
      icon: "📧",
      color: "green",
      guides: [
        {
          title: "Thiết kế email responsive với drag-drop editor",
          type: "Video",
          duration: "12:20",
          level: "Trung bình",
        },
        {
          title: "Phân khúc khách hàng thông minh với AI",
          type: "Article",
          duration: "7 phút đọc",
          level: "Nâng cao",
        },
        {
          title: "A/B testing cho subject line",
          type: "Video",
          duration: "6:45",
          level: "Trung bình",
        },
        {
          title: "Automation workflows cho nurturing leads",
          type: "Video",
          duration: "15:30",
          level: "Nâng cao",
        },
      ],
    },
    {
      category: "Social Media",
      icon: "📱",
      color: "purple",
      guides: [
        {
          title: "Kết nối và quản lý Facebook Pages",
          type: "Article",
          duration: "4 phút đọc",
          level: "Cơ bản",
        },
        {
          title: "Lên lịch đăng bài tự động",
          type: "Video",
          duration: "9:10",
          level: "Cơ bản",
        },
        {
          title: "Tạo content với AI Content Generator",
          type: "Video",
          duration: "11:25",
          level: "Trung bình",
        },
      ],
    },
    {
      category: "Analytics & Reports",
      icon: "📊",
      color: "orange",
      guides: [
        {
          title: "Đọc hiểu dashboard và metrics cơ bản",
          type: "Article",
          duration: "6 phút đọc",
          level: "Cơ bản",
        },
        {
          title: "Thiết lập Google Analytics tracking",
          type: "Video",
          duration: "13:40",
          level: "Nâng cao",
        },
        {
          title: "Tạo custom reports cho management",
          type: "Article",
          duration: "8 phút đọc",
          level: "Nâng cao",
        },
      ],
    },
  ];

  const resources = [
    {
      title: "AutoMarketing API Documentation",
      description: "Complete API reference cho developers",
      type: "Documentation",
      icon: "📖",
    },
    {
      title: "Email Templates Collection",
      description: "50+ templates miễn phí cho mọi ngành",
      type: "Download",
      icon: "📩",
    },
    {
      title: "Marketing Automation Checklist",
      description: "Checklist 20 bước để setup automation hoàn hảo",
      type: "PDF",
      icon: "✅",
    },
    {
      title: "GDPR Compliance Guide",
      description: "Hướng dẫn tuân thủ quy định bảo vệ dữ liệu",
      type: "Guide",
      icon: "🔒",
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
            Hướng dẫn sử dụng
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tài liệu hướng dẫn chi tiết để bạn khai thác tối đa sức mạnh của
            AutoMarketing
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 -mt-8" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🚀 Bắt đầu trong 20 phút
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold ${
                      step.completed ? "bg-green-500" : "bg-blue-600"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.step
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {step.description}
                  </p>
                  <span className="text-xs text-blue-600 font-medium">
                    {step.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Bắt đầu setup
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      <section className="py-16" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Danh mục hướng dẫn
          </h2>

          {guideCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    category.color === "blue"
                      ? "bg-blue-100"
                      : category.color === "green"
                      ? "bg-green-100"
                      : category.color === "purple"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                  }`}
                >
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {category.category}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.guides.map((guide, guideIndex) => (
                  <div
                    key={guideIndex}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          guide.type === "Video"
                            ? "bg-red-100 text-red-700"
                            : guide.type === "Article"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {guide.type === "Video" ? (
                          <Play className="w-3 h-3 inline mr-1" />
                        ) : null}
                        {guide.type}
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h4>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{guide.duration}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          guide.level === "Cơ bản"
                            ? "bg-green-100 text-green-700"
                            : guide.level === "Trung bình"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {guide.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Tài nguyên bổ sung
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-4">{resource.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section
        className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Đội ngũ onboarding của chúng tôi sẵn sàng hỗ trợ setup và training
            1-on-1 để bạn thành công với AutoMarketing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Đặt lịch onboarding
            </button>
            <a
              href="/help"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Trung tâm trợ giúp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
