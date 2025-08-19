import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Globe, FileText } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/register"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại đăng ký
          </Link>

          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Điều khoản sử dụng
              </h1>
              <p className="text-gray-600">Có hiệu lực từ ngày 01/01/2025</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 text-blue-600" size={24} />
              1. Giới thiệu
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Chào mừng bạn đến với <strong>AutoMarketing</strong> - nền tảng
                tự động hóa marketing hàng đầu. Bằng việc sử dụng dịch vụ của
                chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được
                nêu dưới đây.
              </p>
              <p>
                Các điều khoản này áp dụng cho tất cả người dùng, khách hàng và
                bên thứ ba truy cập hoặc sử dụng dịch vụ AutoMarketing.
              </p>
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="mr-2 text-blue-600" size={24} />
              2. Dịch vụ của chúng tôi
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>AutoMarketing cung cấp các dịch vụ sau:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tự động hóa chiến dịch email marketing</li>
                <li>Phân tích và báo cáo hiệu suất marketing</li>
                <li>Quản lý khách hàng tiềm năng (Lead Management)</li>
                <li>Tích hợp với các nền tảng marketing khác</li>
                <li>Tư vấn và hỗ trợ chiến lược marketing</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="mr-2 text-blue-600" size={24} />
              3. Trách nhiệm của người dùng
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>Khi sử dụng dịch vụ AutoMarketing, bạn cam kết:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cung cấp thông tin chính xác và cập nhật</li>
                <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>Tuân thủ các quy định về chống spam và bảo vệ dữ liệu</li>
                <li>Bảo mật thông tin đăng nhập tài khoản</li>
                <li>Không chia sẻ tài khoản cho bên thứ ba</li>
                <li>Báo cáo ngay các vấn đề bảo mật phát hiện được</li>
              </ul>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Điều khoản thanh toán
            </h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Gói dịch vụ</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Gói miễn phí:</strong> 14 ngày dùng thử với đầy đủ
                  tính năng
                </li>
                <li>
                  <strong>Gói cơ bản:</strong> 299,000 VNĐ/tháng
                </li>
                <li>
                  <strong>Gói chuyên nghiệp:</strong> 599,000 VNĐ/tháng
                </li>
                <li>
                  <strong>Gói doanh nghiệp:</strong> Liên hệ để được báo giá
                </li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6">
                Chính sách hoàn tiền
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hoàn tiền 100% trong 7 ngày đầu nếu không hài lòng</li>
                <li>
                  Hoàn tiền theo tỷ lệ cho thời gian chưa sử dụng khi hủy gói
                </li>
                <li>Không hoàn tiền cho các dịch vụ tùy chỉnh đã hoàn thành</li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Bảo mật và dữ liệu
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu của bạn
                theo
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Chính sách bảo mật
                </Link>{" "}
                của chúng tôi.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dữ liệu được mã hóa và lưu trữ an toàn</li>
                <li>Tuân thủ GDPR và các quy định bảo vệ dữ liệu</li>
                <li>
                  Không chia sẻ dữ liệu với bên thứ ba không được ủy quyền
                </li>
                <li>Quyền truy cập, chỉnh sửa và xóa dữ liệu của người dùng</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Giới hạn trách nhiệm
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>AutoMarketing không chịu trách nhiệm cho:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Thiệt hại gián tiếp hoặc hậu quả từ việc sử dụng dịch vụ
                </li>
                <li>Gián đoạn dịch vụ do bảo trì hoặc nâng cấp hệ thống</li>
                <li>Hành vi của người dùng vi phạm điều khoản sử dụng</li>
                <li>
                  Thiệt hại do sử dụng sai mục đích hoặc không tuân thủ hướng
                  dẫn
                </li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Chấm dứt dịch vụ
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn
                nếu:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Vi phạm các điều khoản sử dụng</li>
                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>Không thanh toán phí dịch vụ đúng hạn</li>
                <li>
                  Có hành vi gây tổn hại đến hệ thống hoặc người dùng khác
                </li>
              </ul>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Thay đổi điều khoản
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                AutoMarketing có quyền cập nhật các điều khoản này bất cứ lúc
                nào. Chúng tôi sẽ thông báo trước ít nhất 30 ngày về các thay
                đổi quan trọng.
              </p>
              <p>
                Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là
                bạn đồng ý với các điều khoản mới.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Liên hệ
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng
                liên hệ:
              </p>
              <ul className="space-y-1">
                <li>
                  <strong>Email:</strong> legal@AutoMarketing.vn
                </li>
                <li>
                  <strong>Điện thoại:</strong> 1900 1234
                </li>
                <li>
                  <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/privacy"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Xem Chính sách bảo mật
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-center"
          >
            Đồng ý và Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
