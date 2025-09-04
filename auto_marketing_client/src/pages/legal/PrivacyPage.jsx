import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
} from "lucide-react";

const PrivacyPage = () => {
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
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chính sách bảo mật
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
              <Eye className="mr-2 text-green-600" size={24} />
              1. Giới thiệu
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Tại <strong>AutoMarketing</strong>, chúng tôi cam kết bảo vệ
                quyền riêng tư và thông tin cá nhân của bạn. Chính sách này giải
                thích cách chúng tôi thu thập, sử dụng, và bảo vệ dữ liệu của
                bạn.
              </p>
              <p>
                Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các thực
                hành được mô tả trong chính sách bảo mật này.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="mr-2 text-green-600" size={24} />
              2. Thông tin chúng tôi thu thập
            </h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin cá nhân
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Họ và tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Thông tin công ty (nếu có)</li>
                <li>Địa chỉ thanh toán</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6">
                Thông tin sử dụng
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Lịch sử đăng nhập và hoạt động</li>
                <li>Dữ liệu chiến dịch marketing</li>
                <li>Thống kê sử dụng tính năng</li>
                <li>Thông tin thiết bị và trình duyệt</li>
                <li>Địa chỉ IP và dữ liệu vị trí</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6">
                Cookies và công nghệ theo dõi
              </h3>
              <p>
                Chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện
                trải nghiệm người dùng, phân tích lưu lượng truy cập và cá nhân
                hóa nội dung.
              </p>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 text-green-600" size={24} />
              3. Cách chúng tôi sử dụng thông tin
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>Chúng tôi sử dụng thông tin được thu thập để:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cung cấp và vận hành dịch vụ AutoMarketing</li>
                <li>Xử lý thanh toán và quản lý tài khoản</li>
                <li>Gửi thông báo quan trọng về dịch vụ</li>
                <li>Cung cấp hỗ trợ kỹ thuật và khách hàng</li>
                <li>Cải thiện và phát triển sản phẩm</li>
                <li>Phân tích và báo cáo hiệu suất</li>
                <li>
                  Gửi newsletter và thông tin marketing (chỉ khi được đồng ý)
                </li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="mr-2 text-green-600" size={24} />
              4. Chia sẻ thông tin
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn.
                Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Với sự đồng ý của bạn:</strong> Khi bạn cho phép rõ
                  ràng
                </li>
                <li>
                  <strong>Nhà cung cấp dịch vụ:</strong> Đối tác được ủy quyền
                  hỗ trợ vận hành dịch vụ (thanh toán, hosting, analytics)
                </li>
                <li>
                  <strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan
                  có thẩm quyền
                </li>
                <li>
                  <strong>Bảo vệ quyền lợi:</strong> Để bảo vệ an toàn và quyền
                  lợi của AutoMarketing và người dùng
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="mr-2 text-green-600" size={24} />
              5. Bảo mật dữ liệu
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt:</p>

              <h3 className="text-lg font-medium text-gray-900">
                Bảo mật kỹ thuật
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mã hóa SSL/TLS cho tất cả truyền tải dữ liệu</li>
                <li>Mã hóa dữ liệu lưu trữ với AES-256</li>
                <li>Xác thực hai yếu tố (2FA)</li>
                <li>Firewall và hệ thống phát hiện xâm nhập</li>
                <li>Sao lưu dữ liệu định kỳ và an toàn</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-6">
                Bảo mật tổ chức
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Đào tạo nhân viên về bảo mật thông tin</li>
                <li>Kiểm soát truy cập nghiêm ngặt</li>
                <li>Kiểm tra bảo mật định kỳ</li>
                <li>Quy trình phản ứng sự cố bảo mật</li>
              </ul>
            </div>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Quyền của người dùng
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>Bạn có các quyền sau đối với dữ liệu cá nhân:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Quyền truy cập:</strong> Yêu cầu xem thông tin chúng
                  tôi có về bạn
                </li>
                <li>
                  <strong>Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông
                  tin không chính xác
                </li>
                <li>
                  <strong>Quyền xóa:</strong> Yêu cầu xóa dữ liệu cá nhân (trong
                  phạm vi pháp lý)
                </li>
                <li>
                  <strong>Quyền di chuyển:</strong> Xuất dữ liệu của bạn sang
                  định dạng có thể đọc được
                </li>
                <li>
                  <strong>Quyền hạn chế:</strong> Giới hạn cách chúng tôi xử lý
                  dữ liệu của bạn
                </li>
                <li>
                  <strong>Quyền phản đối:</strong> Từ chối một số hoạt động xử
                  lý dữ liệu
                </li>
              </ul>
              <p className="mt-4">
                Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua
                email:
                <span className="font-medium text-blue-600">
                  {" "}
                  privacy@AutoMarketing.vn
                </span>
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Lưu trữ dữ liệu
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>Chúng tôi lưu trữ dữ liệu của bạn trong thời gian:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Tài khoản hoạt động:</strong> Trong suốt thời gian sử
                  dụng dịch vụ
                </li>
                <li>
                  <strong>Sau khi hủy tài khoản:</strong> Tối đa 30 ngày để xử
                  lý yêu cầu khôi phục
                </li>
                <li>
                  <strong>Dữ liệu thanh toán:</strong> 7 năm (theo yêu cầu pháp
                  lý)
                </li>
                <li>
                  <strong>Logs hệ thống:</strong> 12 tháng cho mục đích bảo mật
                </li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Quyền riêng tư trẻ em
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Dịch vụ AutoMarketing không dành cho trẻ em dưới 16 tuổi. Chúng
                tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 16
                tuổi.
              </p>
              <p>
                Nếu bạn phát hiện chúng tôi có thông tin của trẻ em dưới 16
                tuổi, vui lòng liên hệ ngay để chúng tôi xóa thông tin đó.
              </p>
            </div>
          </section>


          {/* Contact */}
          <section className="bg-green-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Liên hệ về bảo mật
            </h2>
            <div className="text-gray-700 space-y-2">
              <p>
                Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện
                quyền của mình:
              </p>
              <ul className="space-y-1">
                <li>
                  <strong>Email bảo mật:</strong> privacy@AutoMarketing.vn
                </li>
                <li>
                  <strong>Điện thoại:</strong> 1900 1234 (máy lẻ 2)
                </li>
                <li>
                  <strong>Địa chỉ:</strong> 295 Nguyễn Tất Thành, Quận Thanh Khê, Tp Đà Nẵng
                </li>
                <li>
                  <strong>DPO (Data Protection Officer):</strong>{" "}
                  dpo@AutoMarketing.vn
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/terms"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Xem Điều khoản sử dụng
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all text-center"
          >
            Đồng ý và Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
