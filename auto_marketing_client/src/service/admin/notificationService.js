import axios from "axios";
import api from "../../context/api";

// const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/users`;
const BASE_URL = `/users`;

//Hàm thông báo
export async function getNotifications() {
    try {
        // const { data } = await axios.get(`${BASE_URL}/notifications`, {withCredentials: true});
        const { data } = await api.get(`${BASE_URL}/notifications`, {withCredentials: true});
        // Đảm bảo luôn trả về array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        return [];
    }
}

//hàm đếm số nguười dùng
export async function getUserCount() {
    // const { data } = await axios.get(`${BASE_URL}/count`, {withCredentials: true});
    const { data } = await api.get(`${BASE_URL}/count`, {withCredentials: true});
    return data;
}