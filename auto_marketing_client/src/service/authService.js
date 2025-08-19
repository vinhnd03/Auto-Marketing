import axios from "axios";
import { data } from "react-router-dom";

const API_URL = "http://localhost:8080/api/auth";

const register = async (data) => {
    try {
        const resp = await axios.post(`${API_URL}/register`, data, { withCredentials: true, })
        return { ...resp, success: true };
    } catch (error) {
        console.log(error);
        return {

            error: error.response?.data?.error || "Đăng ký thất bại",
            success: false
        };
    }
};

const login = async (data) => {
    try {
        // Gửi request login, server sẽ set JWT cookie (HttpOnly)
        const resp = await axios.post(`${API_URL}/login`, data, {
            withCredentials: true, // Bắt buộc để cookie được lưu
        });

        if (resp.data.success) {
            // Gọi API /me ngay sau login
            const me = await axios.get(`${API_URL}/me`, {
                withCredentials: true, // Gửi kèm cookie JWT
            });

            console.log("Thông tin user:", me.data);
            return { success: true, user: me.data };
        } else {
            return { success: false, error: "Đăng nhập thất bại" };
        }
    } catch (error) {
        if (error.response?.status === 401) {
            return { success: false, error: "Email hoặc mật khẩu không đúng" };
        }
        return { success: false, error: "Lỗi kết nối khi đăng nhập" };
    }
}

const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        return { success: true };
    } catch (error) {
        console.error("Lỗi khi logout:", error);
        return { success: false, error: "Logout thất bại" };
    }
};

const getCurrentUser = async () => {
    try {
        const resp = await axios.get(`${API_URL}/me`, { withCredentials: true });
        return { success: true, user: resp.data };
    } catch (error) {
        if (error.response?.status === 401) {
            return { success: false, error: "Chưa đăng nhập" };
        }
        console.error("Lỗi:", error);
        return { success: false, error: "Không thể lấy thông tin user" };
    }
};

const changePassword = async (token, newPassword) => {
    try {
        const resp = await axios.post(`${API_URL}/reset-password`, {token, newPassword});
        return {success: resp.data.success, data: resp.data};
    } catch (error){
        console.log(error);
        return {success: false, error: error.response?.data?.message || "Đổi mật khẩu thất bại"}
    }
}

export default { register, login, logout, getCurrentUser, changePassword };