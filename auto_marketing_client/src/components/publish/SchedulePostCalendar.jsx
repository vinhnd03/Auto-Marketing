import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isoWeek from "dayjs/plugin/isoWeek";
import { Dialog } from "@headlessui/react";

dayjs.locale("vi");
dayjs.extend(isoWeek);

const hours = Array.from({ length: 24 }, (_, i) => i);

export default function SchedulePostCalendar({
  confirmedPosts = [],
  availableContents = [],
  onSubmit
}) {
  const [selectedContentId, setSelectedContentId] = useState("");
  const [weekStart, setWeekStart] = useState(dayjs().startOf("isoWeek"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [minute, setMinute] = useState("00");

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, "day")
  );
  const now = dayjs();

  // Map confirmedPosts -> posts state
  useEffect(() => {
    const mapped = confirmedPosts.map((p) => ({
      ...p,
      time: p.time ? dayjs(p.time) : null,
    }));
    setPosts(mapped);
  }, [confirmedPosts]);

  const isPastTime = (day, hour) => {
    const cellTime = day.hour(hour).minute(0);
    return cellTime.isBefore(now.subtract(5, "minute"));
  };

  const openScheduleModal = (day, hour) => {
    if (isPastTime(day, hour)) {
      alert("Không thể đặt lịch vào thời điểm quá khứ hoặc trễ hơn 5 phút hiện tại");
      return;
    }
    setSelectedTime(day.hour(hour));
    setMinute("00");
    setSelectedContentId("");
    setIsModalOpen(true);
  };

  // State giữ posts
const [posts, setPosts] = useState([]);

// State tạm giữ posts để gửi ra ngoài
const [pendingPosts, setPendingPosts] = useState(null);

// Khi posts thay đổi, gửi ra ngoài
useEffect(() => {
  if (pendingPosts) {
    onSubmit && onSubmit(
      pendingPosts.map(p => ({
        id: p.id,
        title: p.title,
        content: p.content,
        time: p.time ? p.time.format("YYYY-MM-DD HH:mm") : null
      }))
    );
    setPendingPosts(null); // reset
  }
}, [pendingPosts, onSubmit]);

// Trong hàm lưu bài post mới
const savePost = () => {
  if (!selectedContentId) {
    alert("Vui lòng chọn nội dung bài viết");
    return;
  }
  const chosenContent = availableContents.find(c => c.id === selectedContentId);
  if (!chosenContent) return;

  const time = selectedTime.minute(parseInt(minute, 10));

  const newPost = {
    id: chosenContent.id,
    title: chosenContent.title,
    content: chosenContent.content,
    time
  };

  setPosts(prev => {
    const updated = [...prev, newPost];
    setPendingPosts(updated);  // Lưu vào biến pending để useEffect gọi onSubmit
    return updated;
  });

  setIsModalOpen(false);
};


  const renderPosts = (day, hour) => {
    const postsAtTime = posts.filter(
      (p) =>
        p.time &&
        p.time.format("YYYY-MM-DD-HH") ===
          day.hour(hour).format("YYYY-MM-DD-HH")
    );
    return postsAtTime.map((post, index) => (
      <div
        key={index}
        className="bg-blue-50 border-l-4 border-blue-500 p-1 mt-1 rounded"
      >
        <p className="text-xs font-medium">{post.time.format("HH:mm")}</p>
        <p className="text-xs text-gray-600 truncate">{post.title || post.content}</p>
      </div>
    ));
  };

  const getCellHeight = (day, hour) => {
    const count = posts.filter(
      (p) =>
        p.time &&
        p.time.format("YYYY-MM-DD-HH") ===
          day.hour(hour).format("YYYY-MM-DD-HH")
    ).length;
    return count > 0 ? 48 * count : 80;
  };

  return (
    <div className="p-4">
      {/* Thanh điều hướng tuần */}
      <div className="flex items-center justify-center gap-4 mb-2">
        <button
          onClick={() => setWeekStart((prev) => prev.subtract(7, "day"))}
          className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          ←
        </button>
        <p className="text-sm font-semibold">
          {daysOfWeek[0].format("DD/MM")} – {daysOfWeek[6].format("DD/MM")}
        </p>
        <button
          onClick={() => setWeekStart((prev) => prev.add(7, "day"))}
          className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          →
        </button>
      </div>

      {/* Bảng lịch */}
      <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
        <div></div>
        {daysOfWeek.map((day, idx) => (
          <div
            key={idx}
            className={`text-center py-2 font-medium ${
              day.isSame(dayjs(), "day") ? "text-purple-600" : ""
            }`}
          >
            {day.format("dddd DD/MM")}
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-sm text-right pr-2 py-2 border-t border-gray-200">
              {hour.toString().padStart(2, "0")}:00
            </div>
            {daysOfWeek.map((day, idx) => (
              <div
                key={idx}
                className={`p-1 border-t border-l border-gray-200 cursor-pointer hover:bg-gray-50 relative ${
                  isPastTime(day, hour)
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white"
                }`}
                style={{ height: getCellHeight(day, hour) }}
                onClick={() => openScheduleModal(day, hour)}
              >
                {renderPosts(day, hour)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Chọn nội dung để đăng
            </Dialog.Title>

            {/* Chọn giờ */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Thời gian</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedTime ? selectedTime.format("dddd DD/MM HH") : ""}
                  className="border rounded px-2 py-1 text-sm w-full"
                />
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chọn content */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Chọn nội dung</label>
              <select
                value={selectedContentId}
                onChange={(e) => setSelectedContentId(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              >
                <option value="">-- Chọn bài viết --</option>
                {availableContents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || c.content.slice(0, 30) + "..."}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={savePost}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
