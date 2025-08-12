import React from "react";
import { Mail, Phone, MapPin } from "lucide-react"; // Nếu đã cài lucide-react

export default function Footer() {
  return (
    <footer className="bg-blue-50 text-gray-700 pt-16 pb-10 border-t border-gray-200">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <h3 className="text-3xl font-extrabold text-blue-600 mb-4">
            AutoMarketing
          </h3>
          <p className="text-sm leading-relaxed">
            Giải pháp tiếp thị tự động giúp doanh nghiệp tăng trưởng bền vững,
            tiết kiệm chi phí và nâng cao hiệu suất.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Trang chủ", href: "/" },
              { label: "Tính năng", href: "/features" },
              { label: "Bảng giá", href: "/pricing" },
              { label: "Liên hệ", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>support@automarketing.vn</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>1900 123 456</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>123 Lê Lợi, Q.1, TP.HCM</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h4>
          <p className="text-sm mb-3">
            Nhận thông báo, ưu đãi và bài viết mới nhất từ chúng tôi.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Email của bạn"
              className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 text-center text-sm text-gray-500 border-t pt-5">
        © {new Date().getFullYear()} AutoMarketing. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
}
