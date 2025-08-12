import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function BlogPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: "10 Chiến lược Marketing Automation hiệu quả nhất 2025",
      excerpt:
        "Khám phá những chiến lược marketing automation mới nhất giúp tăng ROI và tiết kiệm thời gian cho doanh nghiệp.",
      category: "Marketing Tips",
      date: "15/01/2025",
      readTime: "5 phút đọc",
      image: "📈",
      featured: true,
    },
    {
      id: 2,
      title: "Cách sử dụng AI để tạo content marketing chất lượng",
      excerpt:
        "Hướng dẫn chi tiết cách tận dụng AI để tạo ra content marketing thu hút và chuyển đổi cao.",
      category: "AI & Technology",
      date: "12/01/2025",
      readTime: "7 phút đọc",
      image: "🤖",
    },
    {
      id: 3,
      title: "Email Marketing vs Social Media: Kênh nào hiệu quả hơn?",
      excerpt:
        "So sánh chi tiết hai kênh marketing phổ biến và cách tối ưu hóa từng kênh cho doanh nghiệp.",
      category: "Comparison",
      date: "10/01/2025",
      readTime: "6 phút đọc",
      image: "📧",
    },
    {
      id: 4,
      title: "Case Study: Startup tăng 300% doanh thu với AutoMarketing",
      excerpt:
        "Câu chuyện thành công của startup công nghệ tăng trưởng vượt bậc nhờ áp dụng marketing automation.",
      category: "Case Study",
      date: "08/01/2025",
      readTime: "10 phút đọc",
      image: "🚀",
    },
    {
      id: 5,
      title: "Xu hướng Marketing Digital Việt Nam 2025",
      excerpt:
        "Phân tích những xu hướng marketing digital mới nổi và cơ hội cho doanh nghiệp Việt Nam.",
      category: "Trends",
      date: "05/01/2025",
      readTime: "8 phút đọc",
      image: "📊",
    },
    {
      id: 6,
      title: "Chatbot vs Live Chat: Lựa chọn nào phù hợp?",
      excerpt:
        "Hướng dẫn chọn giải pháp customer service phù hợp với quy mô và ngân sách doanh nghiệp.",
      category: "Customer Service",
      date: "03/01/2025",
      readTime: "5 phút đọc",
      image: "💬",
    },
  ];

  const categories = [
    "Tất cả",
    "Marketing Tips",
    "AI & Technology",
    "Case Study",
    "Trends",
    "Customer Service",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Blog AutoMarketing
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Khám phá những insights, tips và case studies mới nhất về marketing
            automation, AI và digital transformation từ đội ngũ chuyên gia của
            chúng tôi.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white shadow-sm" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Tất cả"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Bài viết nổi bật
          </h2>

          {blogPosts
            .filter((post) => post.featured)
            .map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-12">
                    <span className="text-6xl">{post.image}</span>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm">{post.date}</span>
                      <span className="text-gray-500 text-sm">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                    <a
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Đọc tiếp →
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12" data-aos="fade-up">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Bài viết mới nhất
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter((post) => !post.featured)
              .map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 flex items-center justify-center">
                    <span className="text-4xl">{post.image}</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{post.date}</span>
                      <a
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Đọc tiếp →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Đăng ký nhận bài viết mới</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Nhận những insights và tips marketing automation mới nhất trực tiếp
            trong inbox của bạn.
          </p>

          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Đăng ký
            </button>
          </div>

          <p className="text-blue-200 text-xs mt-4">
            Chúng tôi tôn trọng privacy của bạn. Unsubscribe bất cứ lúc nào.
          </p>
        </div>
      </section>
    </div>
  );
}
