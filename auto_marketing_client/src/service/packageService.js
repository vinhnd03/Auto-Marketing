// src/service/packageService.js
import axios from "axios";
import api from './../context/api';

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/admin/packages`;
const API_URL = `/admin/packages`;

export const getPackageStats = async () => {
    try {
        // const resp = await axios.get(`${API_URL}/stats`, {withCredentials: true});
        const resp = await api.get(`${API_URL}/stats`, {withCredentials: true});
        return resp.data
    } catch (e) {
        console.error("Lỗi kết nối API", e);
        return {};
    }
};

export const getPackageSalesChart = async (startDate, endDate) => {
    try {
        // const resp = await axios.get(`${API_URL}/chart`, {
        const resp = await api.get(`${API_URL}/chart`, {
            withCredentials: true,
            params: {start: startDate, end: endDate}
        });
        return resp.data
    } catch (e) {
        console.error("Lỗi kết nối API", e);
        return [];
    }
};
