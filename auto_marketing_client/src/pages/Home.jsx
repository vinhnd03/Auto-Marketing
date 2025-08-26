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
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>�</span>
            Kết quả ấn tượng từ khách hàng
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Những con số thành công
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-16">
            Hàng nghìn doanh nghiệp đã tin tưởng và đạt được kết quả vượt mong
            đợi với AutoMarketing
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              { number: "2,500+", label: "Doanh nghiệp tin tưởng", icon: "🏢" },
              { number: "85%", label: "Tăng trưởng doanh thu", icon: "📊" },
              { number: "12M+", label: "Khách hàng tiếp cận", icon: "👥" },
              { number: "95%", label: "Hài lòng với dịch vụ", icon: "⭐" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Customer Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                company: "CEO - TechViet Solutions",
                avatar: "👨‍💼",
                rating: 5,
                content:
                  "AutoMarketing đã giúp chúng tôi tăng 300% khách hàng mới chỉ trong 6 tháng. Tính năng AI tạo content thực sự tuyệt vời!",
              },
              {
                name: "Trần Thị B",
                company: "Founder - BeautyShop Online",
                avatar: "👩‍💼",
                rating: 5,
                content:
                  "Từ khi dùng AutoMarketing, tôi tiết kiệm được 5 giờ mỗi ngày cho việc đăng bài và chăm sóc khách hàng. ROI tăng 250%!",
              },
              {
                name: "Lê Minh C",
                company: "Marketing Director - FoodChain",
                avatar: "👨‍🍳",
                rating: 5,
                content:
                  "Báo cáo phân tích chi tiết giúp chúng tôi hiểu rõ khách hàng hơn. Doanh thu từ digital marketing tăng 400% năm ngoái.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">
              Bạn cũng muốn đạt được kết quả tương tự?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                🚀 Xem gói dịch vụ
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                💬 Tư vấn miễn phí
              </a>
            </div>
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
