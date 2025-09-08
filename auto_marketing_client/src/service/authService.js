import axios from "axios";
import { data } from "react-router-dom";
import api from "../context/api";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/auth`;
const API_URL = `/auth`;

const register = async (data) => {
    try {
        // const resp = await axios.post(`${API_URL}/register`, data, { withCredentials: true, })
        const resp = await api.post(`${API_URL}/register`, data, { withCredentials: true, })
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
        // const resp = await axios.post(`${API_URL}/login`, data, {
        const resp = await api.post(`${API_URL}/login`, data, {
            withCredentials: true, // Bắt buộc để cookie được lưu
        });

        if (resp.data.success) {
            // Gọi API /me ngay sau login
            // const me = await axios.get(`${API_URL}/me`, {
            const me = await api.get(`${API_URL}/me`, {
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
        } else if (error.response?.status === 403) {
            if (error.response.data.error === "EMAIL_NOT_VERIFIED") {
                return { success: false, error: "Vui lòng kiểm tra email để xác nhận tài khoản", code: "EMAIL_NOT_VERIFIED" };
            }
            return { success: false, error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên" };

        }
        return { success: false, error: "Lỗi kết nối khi đăng nhập" };
    }
}

const logout = async () => {
    try {
        // await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        await api.post(`${API_URL}/logout`, {}, { withCredentials: true });
        return { success: true };
    } catch (error) {
        console.error("Lỗi khi logout:", error);
        return { success: false, error: "Logout thất bại" };
    }
};

const getCurrentUser = async () => {
    try {
        // const resp = await axios.get(`${API_URL}/me`, { withCredentials: true });
        const resp = await api.get(`${API_URL}/me`, { withCredentials: true });
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
        // const resp = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
        const resp = await api.post(`${API_URL}/reset-password`, { token, newPassword });
        return { success: resp.data.success, data: resp.data };
    } catch (error) {
        console.log(error);
        return { success: false, error: error.response?.data?.message || "Đổi mật khẩu thất bại" }
    }
}

const verifyEmail = async (token) => {
    try {
        // const resp = await axios.get(`${API_URL}/email-verification?token=${token}`)
        const resp = await api.get(`${API_URL}/email-verification?token=${token}`)
        return { success: resp.data.success, data: resp.data };
    } catch (error) {
        console.log(error);
        return { success: false, error: error.response?.data?.message || "Xác nhận tài khoản thất bại" }
    }
}

export default { register, login, logout, getCurrentUser, changePassword, verifyEmail };