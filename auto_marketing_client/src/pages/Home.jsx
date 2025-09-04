import { useEffect } from "react";
import { HeroAnimation } from "../components";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";
import bgPattern from "../assets/bermuda-circle.svg";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="bg-[#e6f0ff] pt-8 pb-12 md:pt-12 md:pb-20"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16">
          {/* Left side (text content) */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-900">
              Giải pháp{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                AutoMarketing
              </span>{" "}
              cho doanh nghiệp hiện đại
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-xl mx-auto md:mx-0">
              Tự động hóa quy trình tiếp thị, tăng trưởng doanh thu và cá nhân
              hóa trải nghiệm khách hàng – tất cả chỉ trong một nền tảng duy
              nhất.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                href="/contact"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              >
                Bắt đầu ngay
              </a>
              <a
                href="/features"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Khám phá tính năng
              </a>
            </div>
          </div>

          {/* Right side (animation / image) */}
          <div className="order-1 md:order-2 flex justify-center overflow-hidden">
            <HeroAnimation className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto" />
          </div>
        </div>
      </section>

      {/*WHy  Section */}
      <section
        className="relative bg-purple-100 pb-28 pt-20 overflow-hidden"
        data-aos="fade-up"
      >
        {/* Decorative background circles */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-yellow-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-yellow-100 rounded-full opacity-20"></div>

        <div className="container mx-auto px-6 text-center max-w-5xl relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Tại sao chúng tôi xây dựng nền tảng này?
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>

          <p className="text-lg text-gray-700 mb-14">
            Trong kỷ nguyên số, doanh nghiệp nhỏ và vừa thường gặp khó khăn
            trong việc duy trì sự hiện diện trực tuyến, tối ưu hóa nội dung và
            tiếp cận khách hàng tiềm năng.
            <span className="text-blue-600 font-semibold"> AutoMarketing </span>
            được tạo ra để giúp bạn tự động hóa mọi khâu tiếp thị – từ lên kế
            hoạch, tạo nội dung đến phân tích hiệu suất – một cách đơn giản và
            hiệu quả.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {[
              {
                title: "Tiết kiệm thời gian",
                desc: "Tự động hoá việc đăng nội dung và chăm sóc khách hàng, giúp bạn tập trung vào chiến lược tăng trưởng.",
                icon: "⏱️",
              },
              {
                title: "Ra quyết định thông minh",
                desc: "Phân tích dữ liệu theo thời gian thực để tối ưu hóa chiến dịch và chi phí tiếp thị.",
                icon: "📊",
              },
              {
                title: "Triển khai dễ dàng",
                desc: "Giao diện đơn giản, dễ học, dễ tích hợp vào quy trình làm việc hiện tại.",
                icon: "🧩",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-blue-100 shadow-md hover:shadow-xl transition relative"
              >
                <div className="absolute -top-6 left-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-700">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24" id="features" data-aos="fade-up">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14 text-gray-900">
            Những tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Chiến dịch tự động",
                desc: "Tạo, quản lý và tự động hóa toàn bộ chiến dịch tiếp thị từ một nơi duy nhất.",
              },
              {
                title: "Email cá nhân hóa",
                desc: "Gửi đúng nội dung, đến đúng người, vào đúng thời điểm với hiệu quả tối ưu.",
              },
              {
                title: "Báo cáo & phân tích",
                desc: "Theo dõi hiệu suất theo thời gian thực để cải thiện kết quả liên tục.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-left"
              >
                <CheckCircleIcon className="w-10 h-10 text-blue-600 mb-5" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Success Numbers Section */}
      <section
        className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-24"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tính năng nổi bật
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-16">
            AutoMarketing cung cấp những công cụ thông minh giúp doanh nghiệp
            tiết kiệm thời gian, tối ưu hiệu quả và mở rộng khách hàng nhanh
            chóng.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Tự động đăng bài",
                desc: "Bạn có thể lên lịch đăng bài trên nhiều nền tảng (Facebook, Instagram, LinkedIn, v.v...) chỉ với vài cú click. Hệ thống đảm bảo nội dung được xuất bản đúng thời điểm vàng, giúp tăng tương tác tự nhiên.",
                icon: "⚡",
              },
              {
                title: "AI tạo nội dung",
                desc: "Trí tuệ nhân tạo gợi ý nội dung sáng tạo, tiêu đề hấp dẫn và hashtag phù hợp với ngành của bạn. Bạn chỉ cần chỉnh sửa nhẹ, tiết kiệm hàng giờ đồng hồ mỗi tuần cho việc viết content.",
                icon: "🤖",
              },
              {
                title: "Báo cáo chi tiết",
                desc: "Theo dõi hiệu quả chiến dịch với báo cáo trực quan: lượt tiếp cận. Nhờ đó, bạn dễ dàng đưa ra quyết định tối ưu ngân sách marketing.",
                icon: "📊",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative overflow-hidden py-28 text-black text-center"
        data-aos="zoom-in"
      >
        {/* Animated background pattern layer */}
        <div
          style={{ backgroundImage: `url(${bgPattern})` }}
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none animate-pulse"
          aria-hidden="true"
        ></div>

        {/* Content layer */}
        <div className="relative z-10 container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Sẵn sàng để <span className="text-yellow-300">tăng trưởng</span>?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            Dùng thử miễn phí ngay hôm nay – không cần thẻ tín dụng.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 text-black font-semibold rounded-full shadow-xl hover:brightness-110 transition-all duration-300 transform hover:scale-105"
          >
            🚀 Bắt đầu miễn phí
          </a>
        </div>
      </section>
    </>
  );
}
