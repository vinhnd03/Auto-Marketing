import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Về AutoMarketing
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là đội ngũ chuyên gia công nghệ và marketing tại Việt Nam,
            với sứ mệnh giúp doanh nghiệp tự động hóa marketing và tăng trưởng
            bền vững.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 leading-relaxed">
                Democratize marketing automation cho mọi doanh nghiệp Việt Nam.
                Chúng tôi tin rằng công nghệ nên phục vụ con người, giúp các
                doanh nghiệp nhỏ có thể cạnh tranh với những tập đoàn lớn thông
                qua automation thông minh.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tầm nhìn
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Trở thành nền tảng marketing automation số 1 Đông Nam Á vào năm
                2030. Chúng tôi hướng tới việc tạo ra một hệ sinh thái công nghệ
                giúp triệu doanh nghiệp phát triển thông qua AI và automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Giá trị cốt lõi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "💡",
                title: "Innovation",
                desc: "Luôn tiên phong trong việc áp dụng công nghệ mới nhất",
              },
              {
                icon: "🤝",
                title: "Partnership",
                desc: "Đồng hành cùng khách hàng trên hành trình phát triển",
              },
              {
                icon: "⚡",
                title: "Efficiency",
                desc: "Tối ưu hóa hiệu quả và tiết kiệm thời gian cho doanh nghiệp",
              },
              {
                icon: "🎓",
                title: "Education",
                desc: "Chia sẻ kiến thức và nâng cao năng lực cộng đồng",
              },
              {
                icon: "🌱",
                title: "Sustainability",
                desc: "Phát triển bền vững cho cả doanh nghiệp và xã hội",
              },
              {
                icon: "🏆",
                title: "Excellence",
                desc: "Cam kết chất lượng và dịch vụ xuất sắc",
              },
            ].map((value, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section
        className="bg-gradient-to-r from-blue-50 to-purple-50 py-16"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Con số ấn tượng
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2018", label: "Năm thành lập" },
              { number: "50+", label: "Thành viên đội ngũ" },
              { number: "2,500+", label: "Khách hàng tin tưởng" },
              { number: "15+", label: "Giải thưởng đạt được" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-900 text-white py-16" data-aos="fade-up">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Hãy để AutoMarketing đồng hành cùng bạn trong việc phát triển doanh
            nghiệp thông qua công nghệ automation tiên tiến.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem gói dịch vụ
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
