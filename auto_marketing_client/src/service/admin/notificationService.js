import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

//Hàm thông báo
export async function getNotifications() {
    try {
        const { data } = await axios.get(`${BASE_URL}/notifications`);
        // Đảm bảo luôn trả về array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        return [];
    }
}

//hàm đếm số nguười dùng
export async function getUserCount() {
    const { data } = await axios.get(`${BASE_URL}/count`);
    return data;
}