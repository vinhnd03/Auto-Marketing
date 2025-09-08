import api from "../context/api";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Đặt mục tiêu cho post
export const setPostGoals = async (postId, goalsData) => {
  try {
    console.log("Setting goals for post:", postId, "with data:", goalsData);
    const response = await api.post(
      `/v1/posts/${postId}/goals`,
      goalsData,
      config
    );
    console.log("Goals set successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error setting post goals:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

// Lấy mục tiêu của post
export const getPostGoals = async (postId) => {
  try {
    console.log("Getting goals for post:", postId);
    const response = await api.get(`/v1/posts/${postId}/goals`, config);
    console.log("Goals retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting post goals:", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

// Xóa mục tiêu của post
export const deletePostGoals = async (postId) => {
  try {
    await api.delete(`/v1/posts/${postId}/goals`, config);
  } catch (error) {
    console.error("Error deleting post goals:", error);
    throw error;
  }
};

// Cập nhật thống kê thực tế
export const updatePostActualStats = async (postId, statsData) => {
  try {
    const response = await api.post(
      `/v1/posts/${postId}/actual-stats`,
      statsData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error updating post actual stats:", error);
    throw error;
  }
};

// Lấy thống kê thực tế
export const getPostActualStats = async (postId) => {
  try {
    const response = await api.get(`/v1/posts/${postId}/actual-stats`, config);
    return response.data;
  } catch (error) {
    console.error("Error getting post actual stats:", error);
    throw error;
  }
};

// Lấy tiến độ của post
export const getPostProgress = async (postId) => {
  try {
    const response = await api.get(`/v1/posts/${postId}/progress`, config);
    return response.data;
  } catch (error) {
    console.error("Error getting post progress:", error);
    throw error;
  }
};

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
