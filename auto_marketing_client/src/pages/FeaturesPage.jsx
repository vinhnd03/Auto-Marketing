import React from "react";
import { 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  Clock, 
  Shield,
  Globe,
  Brain,
  Rocket,
  Heart,
  CheckCircle
} from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Tự động tạo nội dung",
      description: "Tạo ra nội dung marketing chất lượng cao với AI tiên tiến, tiết kiệm thời gian và tăng hiệu quả.",
      color: "purple"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Nhắm mục tiêu chính xác",
      description: "Phân tích khách hàng và nhắm mục tiêu chính xác để tối ưu hóa ROI cho chiến dịch marketing.",
      color: "blue"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Phân tích thống kê",
      description: "Theo dõi và phân tích hiệu suất chiến dịch với dashboard trực quan và báo cáo chi tiết.",
      color: "green"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lên lịch tự động",
      description: "Tự động hóa việc đăng bài và quản lý lịch marketing trên nhiều nền tảng mạng xã hội.",
      color: "orange"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Quản lý đội nhóm",
      description: "Cộng tác hiệu quả với team, phân quyền và theo dõi tiến độ công việc một cách dễ dàng.",
      color: "pink"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bảo mật cao",
      description: "Đảm bảo an toàn dữ liệu khách hàng với mã hóa SSL và các biện pháp bảo mật tiên tiến.",
      color: "red"
    }
  ];

  const platforms = [
    { name: "Facebook", logo: "📘" },
    { name: "Instagram", logo: "📷" },
    { name: "LinkedIn", logo: "💼" },
    { name: "Twitter", logo: "🐦" },
    { name: "TikTok", logo: "🎵" },
    { name: "YouTube", logo: "📺" }
  ];

  const benefits = [
    "Tiết kiệm đến 70% thời gian quản lý marketing",
    "Tăng ROI trung bình 150% cho các chiến dịch",
    "Tự động hóa 90% công việc lặp đi lặp lại",
    "Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp",
    "Tích hợp với 50+ nền tảng phổ biến",
    "Báo cáo chi tiết và phân tích sâu"
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: "bg-purple-500",
      blue: "bg-blue-500", 
      green: "bg-green-500",
      orange: "bg-orange-500",
      pink: "bg-pink-500",
      red: "bg-red-500"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tính năng
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Đột phá
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Khám phá những tính năng mạnh mẽ giúp doanh nghiệp của bạn tự động hóa marketing 
            và đạt được kết quả vượt ngoài mong đợi.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-2xl">
              <div className="bg-white rounded-xl px-8 py-4">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 Hơn 10,000+ doanh nghiệp tin tướng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những công cụ mạnh mẽ được thiết kế để tối ưu hóa chiến lược marketing của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tích hợp đa nền tảng
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quản lý tất cả các kênh marketing từ một dashboard duy nhất
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {platform.logo}
                </div>
                <h3 className="font-semibold text-gray-900">{platform.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn AutoMarketing?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Chúng tôi mang đến giải pháp toàn diện giúp doanh nghiệp của bạn 
                phát triển bền vững trong thời đại số.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                    <Rocket className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">150%</h3>
                    <p className="text-gray-600">Tăng ROI</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                    <Zap className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">70%</h3>
                    <p className="text-gray-600">Tiết kiệm thời gian</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                    <Globe className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                    <p className="text-gray-600">Tích hợp</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
                    <p className="text-gray-600">Hỗ trợ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Gia nhập hàng nghìn doanh nghiệp đã tin tưởng AutoMarketing để phát triển kinh doanh
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Dùng thử miễn phí
            </a>
            <a
              href="/contact"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Tư vấn 1-1
            </a>
          </div>

          <p className="text-blue-200 text-sm mt-6">
            ✨ Miễn phí 14 ngày • Không cần thẻ tín dụng • Hủy bất cứ lúc nào
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
