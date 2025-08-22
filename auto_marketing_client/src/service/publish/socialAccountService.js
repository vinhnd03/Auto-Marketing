import axios from "axios";

export const getSocialAccountByUserId = async (userId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/social/by-user/${userId}`, {
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
