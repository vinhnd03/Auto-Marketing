import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-gray-700">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <h3 className="text-xl font-bold text-blue-600">AutoMarketing</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Giải pháp tiếp thị tự động hàng đầu Việt Nam. Giúp doanh nghiệp
              tăng trưởng bền vững với công nghệ AI tiên tiến.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Theo dõi:</span>
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Tính năng", href: "/features" },
                { label: "Bảng giá", href: "/pricing" },
                { label: "Về chúng tôi", href: "/about" },
                { label: "Blog", href: "/blog" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-3">
              {[
                { label: "Liên hệ", href: "/contact" },
                { label: "Trung tâm trợ giúp", href: "/help" },
                { label: "Câu hỏi thường gặp", href: "/faq" },
                { label: "Hướng dẫn sử dụng", href: "/guide" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Liên hệ</h4>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm text-gray-900">
                    support@automarketing.vn
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Hotline</div>
                  <div className="text-sm text-gray-900">1900 123 456</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Địa chỉ</div>
                  <div className="text-sm text-gray-900">
                    295 Nguyễn Tất Thành, Thanh Bình, Hải Châu, Đà Nẵng
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h5 className="font-semibold mb-2 text-gray-900 text-sm">
                📧 Đăng ký nhận tin
              </h5>
              <p className="text-gray-600 text-xs mb-3">
                Nhận thông báo về tính năng mới và ưu đãi đặc biệt
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <button className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-600">
              © {new Date().getFullYear()} AutoMarketing. Made with ❤️ in
              Vietnam
            </div>

            <div className="flex items-center gap-6">
              <a
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Điều khoản sử dụng
              </a>
              <a
                href="/sitemap"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
