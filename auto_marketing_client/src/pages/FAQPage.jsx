import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const faqCategories = [
    {
      category: "Tài khoản & Thanh toán",
      faqs: [
        {
          question: "Làm thế nào để đăng ký tài khoản AutoMarketing?",
          answer:
            "Bạn có thể đăng ký tài khoản miễn phí tại trang chủ. Chỉ cần click 'Đăng ký', điền thông tin cơ bản và xác thực email. Bạn sẽ có 14 ngày dùng thử miễn phí với đầy đủ tính năng.",
        },
        {
          question: "Các phương thức thanh toán nào được hỗ trợ?",
          answer:
            "Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thanh toán hóa đơn cho doanh nghiệp.",
        },
        {
          question: "Có thể thay đổi gói dịch vụ không?",
          answer:
            "Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Phí sẽ được tính theo tỷ lệ thời gian sử dụng. Nâng cấp có hiệu lực ngay lập tức, hạ cấp sẽ áp dụng từ chu kỳ thanh toán tiếp theo.",
        },
      ],
    },
    {
      category: "Tính năng & Sử dụng",
      faqs: [
        {
          question:
            "AutoMarketing có tích hợp được với CRM hiện tại của tôi không?",
          answer:
            "Có, chúng tôi tích hợp với hơn 50+ CRM phổ biến như HubSpot, Salesforce, Pipedrive, Zoho. Bạn cũng có thể sử dụng API để tích hợp với hệ thống tùy chỉnh.",
        },
        {
          question: "Làm thế nào để tạo chiến dịch email marketing đầu tiên?",
          answer:
            "Truy cập Dashboard > Campaigns > Create New. Chọn template hoặc tạo từ đầu, thiết lập audience, lên lịch gửi và theo dõi kết quả. Chúng tôi có wizard hướng dẫn từng bước cho người mới.",
        },
        {
          question: "AI content generator hoạt động như thế nào?",
          answer:
            "AI của chúng tôi được training trên dữ liệu marketing Việt Nam. Bạn chỉ cần nhập keywords, chọn tone và format, AI sẽ tạo content chất lượng cao. Bạn có thể chỉnh sửa và tối ưu theo ý muốn.",
        },
        {
          question: "Có giới hạn số lượng email gửi không?",
          answer:
            "Mỗi gói có limit khác nhau: Starter (1K emails/tháng), Growth (10K emails/tháng), Professional (50K emails/tháng). Nếu vượt limit, bạn có thể mua thêm hoặc nâng cấp gói.",
        },
      ],
    },
    {
      category: "Bảo mật & Dữ liệu",
      faqs: [
        {
          question: "Dữ liệu của tôi có được bảo mật không?",
          answer:
            "Tuyệt đối! Chúng tôi sử dụng mã hóa SSL 256-bit, lưu trữ trên AWS với backup 3 lần/ngày. Tuân thủ GDPR và các tiêu chuẩn bảo mật quốc tế. Dữ liệu chỉ bạn mới truy cập được.",
        },
        {
          question: "Dữ liệu được lưu trữ ở đâu?",
          answer:
            "Server chính tại Singapore với backup tại Nhật Bản. Đảm bảo tốc độ tốt nhất cho khu vực Đông Nam Á và uptime 99.9%. Dữ liệu không bao giờ rời khỏi khu vực APAC.",
        },
        {
          question: "Tôi có thể xuất dữ liệu khi hủy tài khoản không?",
          answer:
            "Có, bạn có thể export toàn bộ dữ liệu (contacts, campaigns, reports) ở format CSV, Excel hoặc JSON bất cứ lúc nào. Sau khi hủy, dữ liệu sẽ được giữ lại 30 ngày để recovery.",
        },
      ],
    },
    {
      category: "Hỗ trợ & Đào tạo",
      faqs: [
        {
          question: "Tôi có được đào tạo sử dụng platform không?",
          answer:
            "Có! Gói Growth và Professional bao gồm 1 session onboarding. Chúng tôi có thư viện video tutorial, webinar hàng tuần và documentation chi tiết. Team support luôn sẵn sàng hỗ trợ 24/7.",
        },
        {
          question: "Thời gian hỗ trợ như thế nào?",
          answer:
            "Live chat: 24/7. Email support: phản hồi trong 2-4 giờ. Phone support: 8AM-8PM (T2-CN). Khách hàng Professional có dedicated account manager với hotline riêng.",
        },
        {
          question: "Có hỗ trợ setup ban đầu không?",
          answer:
            "Có, team onboarding sẽ hỗ trợ setup tài khoản, import data, tạo campaign đầu tiên và training team của bạn. Service này miễn phí cho gói Growth và Professional.",
        },
      ],
    },
  ];

  const toggleItem = (categoryIndex, faqIndex) => {
    const itemId = `${categoryIndex}-${faqIndex}`;
    setOpenItem(openItem === itemId ? null : itemId);
  };

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Câu hỏi thường gặp
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến về
            AutoMarketing
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemId = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItem === itemId;

                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(categoryIndex, faqIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFAQs.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600">
                  Hãy thử từ khóa khác hoặc liên hệ support để được hỗ trợ trực
                  tiếp.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-white py-16" data-aos="fade-up">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Vẫn còn thắc mắc?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Đội ngũ support chuyên nghiệp của chúng tôi luôn sẵn sàng giải đáp
            mọi thắc mắc của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Liên hệ Support
            </a>
            <a
              href="/help"
              className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Trung tâm trợ giúp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
