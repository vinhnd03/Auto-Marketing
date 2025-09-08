import api from "../context/api";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Đặt mục tiêu cho post target (fanpage)
export const setPostGoals = async (postTargetId, goalsData) => {
  try {
    console.log(
      "Setting goals for postTarget:",
      postTargetId,
      "with data:",
      goalsData
    );
    const response = await api.post(
      `/v1/post-targets/${postTargetId}/goals`,
      goalsData,
      config
    );
    console.log("Goals set successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error setting post target goals:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

// Lấy mục tiêu của post target (fanpage)
export const getPostGoals = async (postTargetId) => {
  try {
    console.log("Getting goals for postTarget:", postTargetId);
    const response = await api.get(
      `/v1/post-targets/${postTargetId}/goals`,
      config
    );
    console.log("Goals retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting post target goals:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

// Xóa mục tiêu của post target
export const deletePostGoals = async (postTargetId) => {
  try {
    await api.delete(`/v1/post-targets/${postTargetId}/goals`, config);
  } catch (error) {
    console.error("Error deleting post target goals:", error);
    throw error;
  }
};

// Cập nhật thống kê thực tế cho post target
export const updatePostActualStats = async (postTargetId, statsData) => {
  try {
    const response = await api.post(
      `/v1/post-targets/${postTargetId}/actual-stats`,
      statsData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error updating post target actual stats:", error);
    throw error;
  }
};

// Lấy thống kê thực tế của post target
export const getPostActualStats = async (postTargetId) => {
  try {
    const response = await api.get(
      `/v1/post-targets/${postTargetId}/actual-stats`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error getting post target actual stats:", error);
    throw error;
  }
};

// Lấy tiến độ của post target
export const getPostProgress = async (postTargetId) => {
  try {
    const response = await api.get(
      `/v1/post-targets/${postTargetId}/progress`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error getting post target progress:", error);
    throw error;
  }
};

// ===== Các functions cũ vẫn giữ cho backward compatibility =====

// Lấy tiến độ theo topic
export const getProgressByTopic = async (topicId) => {
  try {
    const response = await api.get(
      `/v1/posts/topic/${topicId}/progress`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error getting progress by topic:", error);
    throw error;
  }
};

// Đếm số bài viết có mục tiêu theo topic
export const countPostsWithGoalsByTopic = async (topicId) => {
  try {
    const response = await api.get(
      `/v1/posts/topic/${topicId}/goals/count`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error counting posts with goals by topic:", error);
    throw error;
  }
};

// Lấy các bài viết đã đạt mục tiêu
export const getPostsReachedGoals = async () => {
  try {
    const response = await api.get(`/v1/posts/goals/reached`, config);
    return response.data;
  } catch (error) {
    console.error("Error getting posts that reached goals:", error);
    throw error;
  }
};
