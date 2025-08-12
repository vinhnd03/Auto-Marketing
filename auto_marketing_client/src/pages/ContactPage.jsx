import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Headphones,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "general", // general, support, sales, partnership
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      info: "support@automarketing.vn",
      subInfo: "Chúng tôi sẽ phản hồi trong vòng 24h",
      color: "blue",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện thoại",
      info: "1900 123 456",
      subInfo: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
      color: "green",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa chỉ",
      info: "295 Nguyễn Tất Thành, Thanh Bình",
      subInfo: "Hải Châu, Đà Nẵng, Việt Nam",
      color: "purple",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Giờ làm việc",
      info: "Thứ 2 - Thứ 6: 9:00 - 18:00",
      subInfo: "Thứ 7 - Chủ nhật: 9:00 - 17:00",
      color: "orange",
    },
  ];

  const inquiryTypes = [
    {
      value: "general",
      label: "Thông tin chung",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Câu hỏi về sản phẩm, dịch vụ",
    },
    {
      value: "support",
      label: "Hỗ trợ kỹ thuật",
      icon: <Headphones className="w-5 h-5" />,
      description: "Báo lỗi, hướng dẫn sử dụng",
    },
    {
      value: "sales",
      label: "Tư vấn bán hàng",
      icon: <Users className="w-5 h-5" />,
      description: "Báo giá, tư vấn gói dịch vụ",
    },
    {
      value: "partnership",
      label: "Hợp tác đối tác",
      icon: <CheckCircle className="w-5 h-5" />,
      description: "Đề xuất hợp tác kinh doanh",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.",
        {
          duration: 4000,
          style: {
            background: "#10B981",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "16px 24px",
          },
        }
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        type: "general",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Có lỗi xảy ra! Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại thông tin và chúng
            tôi sẽ liên hệ lại trong thời gian sớm nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-gray-600">
                Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có
                thể.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inquiry Type */}
              <div>
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-3">
                    Loại yêu cầu <span className="text-red-500">*</span>
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all ${
                          formData.type === type.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="sr-only">{type.label}</span>
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              formData.type === type.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {type.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {type.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>
              </div>

              {/* Phone and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập tiêu đề"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nội dung tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Mô tả chi tiết yêu cầu của bạn..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Gửi tin nhắn</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${getColorClasses(
                        info.color
                      )}`}
                    >
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-900 font-medium mb-1">
                        {info.info}
                      </p>
                      <p className="text-gray-600 text-sm">{info.subInfo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Vị trí văn phòng</h3>
                <p className="text-blue-100">
                  295 Nguyễn Tất Thành, Thanh Bình, Hải Châu, Đà Nẵng
                </p>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.094682108857!2d108.21392247570935!3d16.06192998461446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c2c1e2e4a1%3A0x8c8b2b7b7b7b7b7b!2s295%20Nguy%E1%BB%85n%20T%E1%BA%A5t%20Th%C3%A0nh%2C%20Thanh%20B%C3%ACnh%2C%20H%E1%BA%A3i%20Ch%C3%A2u%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1692691234567!5m2!1svi!2s"
                  width="100%"
                  height="256"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí AutoMarketing - 295 Nguyễn Tất Thành, Đà Nẵng"
                ></iframe>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Thời gian phản hồi là bao lâu?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Chúng tôi cam kết phản hồi trong vòng 24 giờ cho tất cả yêu
                    cầu.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Tôi có thể hẹn lịch tư vấn trực tiếp không?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Có, hãy chọn "Tư vấn bán hàng" và để lại thông tin để đặt
                    lịch hẹn.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Có hỗ trợ ngoài giờ làm việc không?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Có, chúng tôi có hỗ trợ 24/7 qua email cho các vấn đề khẩn
                    cấp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Bạn cần hỗ trợ ngay lập tức?
            </h2>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn qua
              điện thoại hoặc email
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:1900123456"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Gọi ngay: 1900 123 456</span>
              </a>
              <a
                href="mailto:support@automarketing.vn"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all inline-flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Gửi email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
