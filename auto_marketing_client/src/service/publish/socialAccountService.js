import axios from "axios";
import api from "../../context/api";

export const getSocialAccountByUserId = async (userId) => {
  try {
    // const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/social/by-user/${userId}`, {
    const res = await api.get(`/social/by-user/${userId}`, {
      withCredentials: true, // bắt buộc để gửi cookie session
      headers: {
        "Content-Type": "application/json"
      }
    });

    return res.data; // object SocialAccount
  } catch (err) {
    console.error("Lỗi khi lấy social account:", err);
    throw err;
  }
};
