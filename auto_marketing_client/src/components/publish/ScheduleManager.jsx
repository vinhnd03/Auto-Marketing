import React, { useState } from "react";
import dayjs from "dayjs";
import SchedulePostForm from "./SchedulePostForm";
import ScheduledPostsList from "./ScheduledPostsList";

const ScheduleManager = () => {
  // Danh sách bài viết đã xác nhận (ví dụ)
  const [confirmedPosts] = useState([
    { id: "1", title: "Bài viết 1", content: "Nội dung bài viết 1", image: "" },
    { id: "2", title: "Bài viết 2", content: "Nội dung bài viết 2", image: "" },
  ]);

  // Danh sách lịch đăng đã tạo
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // Hàm thêm lịch đăng từ form
  const handleAddSchedule = ({ postId, platforms, scheduledTime }) => {
    const post = confirmedPosts.find((p) => p.id === postId);
    if (!post) return;

    const newSchedules = platforms.map((platform) => ({
      time: scheduledTime,
      content: post.content,
      platform,
      status: "Chờ đăng", // hoặc trạng thái khác tùy logic
    }));

    setScheduledPosts((prev) => [...prev, ...newSchedules]);
  };

  // Hàm sửa lịch
  const handleEditSchedule = (updatedPost) => {
    setScheduledPosts((prev) =>
      prev.map((p) =>
        p.time === updatedPost.time && p.platform === updatedPost.platform
          ? updatedPost
          : p
      )
    );
  };

  // Hàm xóa lịch
  const handleDeleteSchedule = (postToDelete) => {
    setScheduledPosts((prev) =>
      prev.filter(
        (p) =>
          !(
            p.time === postToDelete.time &&
            p.platform === postToDelete.platform
          )
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Form đặt lịch */}
      <SchedulePostForm
        confirmedPosts={confirmedPosts}
        onSubmit={handleAddSchedule}
      />

      {/* Danh sách lịch */}
      <ScheduledPostsList
        posts={scheduledPosts}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
      />
    </div>
  );
};

export default ScheduleManager;
