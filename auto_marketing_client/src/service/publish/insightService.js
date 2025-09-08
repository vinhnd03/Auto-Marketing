import axios from "axios";

/**
 * Lấy insight cho 1 postTargetId
 * @param {number} postTargetId
 * @returns {Promise<{likeCount: number, commentCount: number, shareCount: number, lastCheckedAt: string}>}
 */
export const getInsights = async (postTargetId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/insights/${postTargetId}`,
      { withCredentials: true }
    );

    const data = response.data;

    // Map dữ liệu mới từ backend
    const mapped = {
      likeCount: data.likes ?? 0,
      commentCount: data.comments ?? 0,
      shareCount: data.shares ?? 0,
      lastCheckedAt: data.lastCheckedAt ?? new Date().toISOString(),
    };

    return mapped;
  } catch (err) {
    console.error("Error fetching insights:", err);
    return {
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      lastCheckedAt: new Date().toISOString(),
    };
  }
};
