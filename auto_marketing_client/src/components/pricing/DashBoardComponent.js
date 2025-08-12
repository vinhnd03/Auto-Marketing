import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Check, Star, Zap, Crown, Shield } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Starter",
    price: 99000,
    originalPrice: 149000,
    color: "teal",
    workspaces: 1,
    max_social_account: 1,
    duration: 1,
    popular: false,
    icon: <Zap className="w-8 h-8" />,
    features: [
      "1 Workspace",
      "1 Tài khoản MXH",
      "Đăng bài cơ bản",
      "Thống kê cơ bản",
      "Hỗ trợ email",
    ],
  },
  {
    id: 2,
    name: "Growth",
    price: 249000,
    originalPrice: 349000,
    color: "blue",
    workspaces: 3,
    max_social_account: 3,
    duration: 3,
    popular: true,
    icon: <Star className="w-8 h-8" />,
    features: [
      "3 Workspace",
      "3 Tài khoản MXH",
      "Đăng bài tự động",
      "AI tạo content",
      "Thống kê nâng cao",
      "Hỗ trợ chat 24/7",
    ],
  },
  {
    id: 3,
    name: "Professional",
    price: 399000,
    originalPrice: 549000,
    color: "purple",
    workspaces: 6,
    max_social_account: 6,
    duration: 6,
    popular: false,
    icon: <Crown className="w-8 h-8" />,
    features: [
      "6 Workspace",
      "6 Tài khoản MXH",
      "Tất cả tính năng AI",
      "Phân tích competitor",
      "API truy cập",
      "Hỗ trợ ưu tiên",
      "Đào tạo 1-1",
    ],
  },
];

const ListComponent = () => {
  const [loadingId, setLoadingId] = useState(null);

  const handleBuy = async (service) => {
    setLoadingId(service.id);
    try {
      const response = await axios.post("http://localhost:8080/api/payment", {
        serviceId: service.id,
        serviceName: service.name,
        amount: service.price,
      });

      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không lấy được URL thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu thanh toán:", error);
      toast.error("Lỗi khi xử lý thanh toán!");
    } finally {
      setLoadingId(null);
    }
  };

  const getCardStyles = (service) => {
    if (service.popular) {
      return "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl scale-105 relative";
    }
    return "border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300";
  };

  const getButtonStyles = (service) => {
    if (service.popular) {
      return "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg";
    }
    return "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600";
  };

  const getIconColor = (service) => {
    switch (service.color) {
      case "teal":
        return "text-teal-600";
      case "blue":
        return "text-blue-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Tiết kiệm đến 80% thời gian quản lý
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chọn gói phù hợp
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tự động hóa marketing, tăng hiệu quả bán hàng và phát triển thương
            hiệu với các gói dịch vụ được thiết kế riêng cho doanh nghiệp của
            bạn.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`relative rounded-2xl p-8 ${getCardStyles(service)}`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      🔥 Phổ biến nhất
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${
                      service.color === "teal"
                        ? "from-teal-100 to-teal-200"
                        : service.color === "blue"
                        ? "from-blue-100 to-blue-200"
                        : "from-purple-100 to-purple-200"
                    } mb-4`}
                  >
                    <span className={getIconColor(service)}>
                      {service.icon}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h3>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {service.price.toLocaleString("vi-VN")}
                    </span>
                    <div className="text-left">
                      <div className="text-sm text-gray-500 line-through">
                        {service.originalPrice.toLocaleString("vi-VN")}
                      </div>
                      <div className="text-sm text-gray-600">VNĐ</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <span>💰</span>
                    Tiết kiệm{" "}
                    {Math.round(
                      (1 - service.price / service.originalPrice) * 100
                    )}
                    %
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Duration */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Thời hạn:</span>{" "}
                    {service.duration} tháng
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleBuy(service)}
                  disabled={loadingId === service.id}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${getButtonStyles(
                    service
                  )} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loadingId === service.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    `Chọn gói ${service.name}`
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao khách hàng tin tưởng AutoMarketing?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang lại dịch vụ tốt nhất với đội ngũ hỗ trợ
              chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">
                Khách hàng đang sử dụng
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Tin tưởng và hài lòng
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                99.5%
              </div>
              <div className="text-gray-600 font-medium">
                Thời gian hoạt động
              </div>
              <div className="text-sm text-gray-500 mt-2">Hệ thống ổn định</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">12h</div>
              <div className="text-gray-600 font-medium">Hỗ trợ hàng ngày</div>
              <div className="text-sm text-gray-500 mt-2">8:00 - 20:00</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                7 ngày
              </div>
              <div className="text-gray-600 font-medium">Dùng thử miễn phí</div>
              <div className="text-sm text-gray-500 mt-2">Không mất phí</div>
            </div>
          </div>

          {/* Additional trust elements */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Bảo mật SSL
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  GDPR tuân thủ
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Thanh toán an toàn
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListComponent;
