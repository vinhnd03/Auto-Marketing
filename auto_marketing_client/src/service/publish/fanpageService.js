import axios from "axios";
import api from "../../context/api";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/fanpages`;
const API_URL = `/fanpages`;

/**
 * Lấy danh sách fanpage hoặc tự đồng bộ nếu chưa có
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export const getUserFanpages = async (userId) => {
  try {
    // const response = await axios.get(`${API_URL}/list-or-sync`, { params: { userId }, withCredentials:true });
    const response = await api.get(`${API_URL}/list-or-sync`, { params: { userId }, withCredentials:true });
    return response.data || [];
  } catch (err) {
    console.error("Lỗi khi lấy fanpages:", err);
    return [];
  }
};
