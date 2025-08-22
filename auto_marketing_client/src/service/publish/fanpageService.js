import axios from "axios";

const API_URL = "http://localhost:8080/api/fanpages";

/**
 * Lấy danh sách fanpage hoặc tự đồng bộ nếu chưa có
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getUserFanpages = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/list-or-sync`, { params: { userId }, withCredentials:true });
    return response.data || [];
  } catch (err) {
    console.error("Lỗi khi lấy fanpages:", err);
    return [];
  }
};
