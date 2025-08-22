import axios from "axios"
import api from "../context/api";

// const URL = "http://localhost:8080"

const getUserProfile = async (id) => {
    try {
        const resp = await api.get(`/user/${id}`, { withCredentials: true });
        if (resp.data.success) {
            return resp.data.profile;
        }
        return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateUserProfile = async (userProfile) => {
    try {
        const resp = await api.put(`/user`, userProfile, { withCredentials: true });
        return resp.data.success;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const changePassword = async (value) => {
    try {
        console.log(value);
        const resp = await api.put(`/user/changePassword`, value);
        return {
            success: resp.data.success,
            error: resp.data.error || "UNKNOWN_ERROR"
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error.response?.data?.error || "UNKNOWN_ERROR"
        };
    }
}

export default { getUserProfile, updateUserProfile, changePassword }