import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const SchedulePostForm = ({ confirmedPosts = [], onSubmit = () => {} }) => {
  const [selectedPostId, setSelectedPostId] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [previewPost, setPreviewPost] = useState(null);

  // Lấy bài viết preview khi chọn
  useEffect(() => {
    const post = confirmedPosts.find((p) => p.id === selectedPostId);
    setPreviewPost(post || null);
  }, [selectedPostId, confirmedPosts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const scheduledDateTime = dayjs(
      `${scheduleDate} ${scheduleTime}`,
      "YYYY-MM-DD HH:mm"
    );

    if (scheduledDateTime.isBefore(dayjs().add(5, "minute"))) {
      alert("Vui lòng chọn thời gian ít nhất sau 5 phút so với hiện tại!");
      return;
    }

    if (!selectedPostId || platforms.length === 0) {
      alert("Vui lòng chọn bài viết và nền tảng!");
      return;
    }

    onSubmit({
      postId: selectedPostId,
      platforms,
      scheduledTime: scheduledDateTime.toISOString(),
    });
  };

  const handlePlatformChange = (platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột trái */}
      <form
        className="bg-white shadow-lg rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold">Đặt lịch đăng bài</h2>

        {/* Chọn bài viết */}
        <div>
          <label className="block mb-1 font-medium">Bài viết đã xác nhận</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
          >
            <option value="">-- Chọn bài viết --</option>
            {confirmedPosts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn nền tảng */}
        <div>
          <label className="block mb-1 font-medium">Nền tảng</label>
          <div className="flex flex-wrap gap-3">
            {["Facebook", "Instagram", "Website"].map((platform) => (
              <label
                key={platform}
                className={`px-4 py-2 border rounded-full cursor-pointer ${
                  platforms.includes(platform)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={platforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                />
                {platform}
              </label>
            ))}
          </div>
        </div>

        {/* Chọn thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Ngày đăng</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={dayjs().format("YYYY-MM-DD")}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Giờ đăng</label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Lưu lịch đăng
        </button>
      </form>

      {/* Cột phải - Preview */}
      <div className="bg-gray-50 shadow-inner rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Xem trước</h2>
        {previewPost ? (
          <div>
            <h3 className="text-xl font-bold">{previewPost.title}</h3>
            <p className="mt-2 text-gray-700">{previewPost.content}</p>
            {previewPost.image && (
              <img
                src={previewPost.image}
                alt="Preview"
                className="mt-4 rounded-lg"
              />
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            Chọn bài viết để xem trước nội dung...
          </p>
        )}
      </div>
    </div>
  );
};

export default SchedulePostForm;
