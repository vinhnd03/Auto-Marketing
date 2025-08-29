import { useEffect, useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import verifyToken from "../../service/tokenService";
import authService from "../../service/authService";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [isVerify, setIsVerify] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpiry, setIsExpiry] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  console.log(token);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setIsExpiry(true);
        return;
      }
      const valid = await verifyToken(token);
      setIsExpiry(!valid);
    };

    checkToken();
  }, [token]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = await authService.verifyEmail(token);
      if (result.success) {
        toast.success("Xác thực tài khoản thành công");
        setIsVerify(true);
      } else {
        toast.error("Xác thực tài khoản thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isExpiry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
            >
              <ArrowLeft size={20} className="mr-2" />
              Về trang chủ
            </Link>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AM</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Liên kết không hợp lệ
            </h2>
            <p className="text-gray-600">
              Đường dẫn của bạn đã hết hạn hoặc không hợp lệ.
              <br /> Vui lòng yêu cầu mới bằng cách đăng nhập tài khoản.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerify) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tài khoản đã được kích hoạt!
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn đã xác nhận kích hoạt tài khoản thành công. Chúc bạn có một
              trải nghiệm tốt tại AutoMarketing.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại đăng nhập
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Mail className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Xác nhận đăng ký
          </h2>
          <p className="text-gray-600">
            Nhấn vào nút bên dưới để xác nhận kích hoạt tài khoản
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang gửi xác nhận...
                </div>
              ) : (
                "Kích hoạt tài khoản"
              )}
            </button>
          </div>
        </div>
        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Cần hỗ trợ?{" "}
            <a
              href="mailto:support@marketingauto.vn"
              className="text-blue-600 hover:text-blue-700"
            >
              Liên hệ với chúng tôi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
