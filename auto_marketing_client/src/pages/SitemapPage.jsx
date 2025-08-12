import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ExternalLink, Clock } from "lucide-react";

export default function SitemapPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const siteStructure = [
    {
      category: "Trang chính",
      icon: "🏠",
      links: [
        { title: "Trang chủ", url: "/", description: "Landing page chính của AutoMarketing" },
        { title: "Về chúng tôi", url: "/about", description: "Thông tin về công ty và đội ngũ" },
        { title: "Tính năng", url: "/features", description: "Chi tiết các tính năng của platform" },
        { title: "Bảng giá", url: "/pricing", description: "Các gói dịch vụ và định giá" },
        { title: "Liên hệ", url: "/contact", description: "Thông tin liên hệ và form tư vấn" }
      ]
    },
    {
      category: "Tài khoản & Xác thực",
      icon: "👤",
      links: [
        { title: "Đăng nhập", url: "/login", description: "Đăng nhập vào tài khoản" },
        { title: "Đăng ký", url: "/register", description: "Tạo tài khoản mới" },
        { title: "Quên mật khẩu", url: "/forgot-password", description: "Khôi phục mật khẩu" },
        { title: "Đặt lại mật khẩu", url: "/reset-password", description: "Tạo mật khẩu mới" }
      ]
    },
    {
      category: "Hỗ trợ & Tài liệu",
      icon: "📚",
      links: [
        { title: "Trung tâm trợ giúp", url: "/help", description: "Tài liệu hỗ trợ và hướng dẫn" },
        { title: "Câu hỏi thường gặp", url: "/faq", description: "Câu trả lời cho các thắc mắc phổ biến" },
        { title: "Hướng dẫn sử dụng", url: "/guide", description: "Tutorial chi tiết sử dụng platform" },
        { title: "Blog", url: "/blog", description: "Bài viết và insights về marketing" }
      ]
    },
    {
      category: "Workspace & Quản lý",
      icon: "💼",
      links: [
        { title: "Workspace", url: "/workspace", description: "Quản lý workspace và projects" },
        { title: "Campaign Manager", url: "/campaign-manager", description: "Tạo và quản lý campaigns" },
        { title: "Profile", url: "/profile", description: "Thông tin cá nhân" },
        { title: "Cài đặt", url: "/settings", description: "Cấu hình tài khoản và preferences" }
      ]
    },
    {
      category: "Thanh toán",
      icon: "💳",
      links: [
        { title: "Kết quả thanh toán", url: "/payment-result", description: "Xác nhận kết quả giao dịch" }
      ]
    },
    {
      category: "Pháp lý",
      icon: "⚖️",
      links: [
        { title: "Điều khoản sử dụng", url: "/terms", description: "Các điều khoản và điều kiện sử dụng" },
        { title: "Chính sách bảo mật", url: "/privacy", description: "Chính sách xử lý dữ liệu cá nhân" }
      ]
    },
    {
      category: "Quản trị (Admin)",
      icon: "🛡️",
      links: [
        { title: "Admin Dashboard", url: "/admin", description: "Trang tổng quan quản trị" },
        { title: "Quản lý người dùng", url: "/admin/users", description: "Danh sách và quản lý users" },
        { title: "Người dùng mới", url: "/admin/users/new", description: "Thống kê người dùng mới" },
        { title: "Xu hướng khách hàng", url: "/admin/customers/trends", description: "Phân tích xu hướng" },
        { title: "Thống kê khách hàng", url: "/admin/customers/statistics", description: "Báo cáo chi tiết" },
        { title: "Quản lý doanh thu", url: "/admin/revenue", description: "Theo dõi và quản lý doanh thu" }
      ]
    }
  ];

  const totalPages = siteStructure.reduce((total, category) => total + category.links.length, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20" data-aos="fade-up">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sitemap
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Tổng quan về cấu trúc và tất cả trang web trong hệ thống AutoMarketing
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{totalPages}</div>
              <div className="text-sm opacity-90">Tổng số trang</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{siteStructure.length}</div>
              <div className="text-sm opacity-90">Danh mục</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Cập nhật</div>
                <div className="text-xs opacity-90">12/08/2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-16" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {siteStructure.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                    <p className="text-gray-600 text-sm">{category.links.length} trang</p>
                  </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {link.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {link.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 text-xs font-mono bg-blue-50 px-2 py-1 rounded">
                          {link.url}
                        </span>
                        <span className="text-gray-400 text-xs group-hover:text-blue-500 transition-colors">
                          Xem trang →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Engine Info */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Thông tin cho Search Engine
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">🤖 Robots.txt</h3>
                <p className="text-gray-600 text-sm">
                  Hướng dẫn crawling cho search engine bots
                </p>
                <a href="/robots.txt" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Xem robots.txt
                </a>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">🗺️ XML Sitemap</h3>
                <p className="text-gray-600 text-sm">
                  Sitemap XML cho Google Search Console
                </p>
                <a href="/sitemap.xml" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Xem sitemap.xml
                </a>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">📊 Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Tracking code cho Google Analytics
                </p>
                <span className="text-gray-500 text-sm mt-2 inline-block">
                  Đã tích hợp GA4
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Cần hỗ trợ điều hướng?
              </h3>
              <p className="text-gray-600 mb-6">
                Nếu bạn không tìm thấy trang mình cần, hãy sử dụng tính năng tìm kiếm 
                hoặc liên hệ với team support của chúng tôi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/help"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Trung tâm trợ giúp
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Liên hệ support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
