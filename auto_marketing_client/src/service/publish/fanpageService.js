// fanpageService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/fanpages";

/**
 * Lấy danh sách fanpage của user
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getFanpages = async (userId) => {
  try {
    const response = await axios.get(API_URL, { params: { userId } });
    return response.data || [];
  } catch (err) {
    console.error("Lỗi khi lấy fanpages:", err);
    return [];
  }
};

/**
 * Đồng bộ fanpage từ Facebook
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const syncFanpages = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/sync`, null, { params: { userId } });
    return response.data || [];
  } catch (err) {
    console.error("Lỗi khi sync fanpages:", err);
    return [];
  }
};
