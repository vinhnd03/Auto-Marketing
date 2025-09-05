import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/users`;

//Hàm thông báo
export async function getNotifications() {
    try {
        const { data } = await axios.get(`${BASE_URL}/notifications`, {withCredentials: true});
        // Đảm bảo luôn trả về array
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        return [];
    }
}


//hàm đếm số nguười dùng
export async function getUserCount() {
    const { data } = await axios.get(`${BASE_URL}/count`, {withCredentials: true});
    return data;
}

//  const NOTIFICATION_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/notifications`;
//
// export async function markNotificationAsRead(id) {
//     try {
//         const { data } = await axios.patch(`${NOTIFICATION_BASE_URL}/${id}/read`, {}, { withCredentials: true });
//         return data; // trả về notification đã update
//     } catch (error) {
//         console.error("Lỗi khi đánh dấu đã đọc:", error);
//         return null;
//     }
// }
//
// // Đánh dấu tất cả thông báo đã đọc
// export async function markAllNotificationsAsRead() {
//     try {
//         const { data } = await axios.patch(`${NOTIFICATION_BASE_URL}/read-all`, {}, { withCredentials: true });
//         return Array.isArray(data) ? data : [];
//     } catch (error) {
//         console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
//         return [];
//     }
// }


const API_URL = "http://localhost:8080/api/notifications";


// Đánh dấu một thông báo là đã đọc
export async function markNotificationAsRead(id) {
    try {
        await axios.patch(`${API_URL}/${id}/read`, {}, { withCredentials: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}

// Đánh dấu tất cả thông báo là đã đọc
export async function markAllNotificationsAsRead() {
    try {
        await axios.patch(`${API_URL}/read-all`, {}, { withCredentials: true });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
}


