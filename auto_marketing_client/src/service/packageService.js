// src/service/packageService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/packages";

export const getPackageStats = async () => {
    try {
        const resp = await axios.get(`${API_URL}/stats`);
        return resp.data
    } catch (e) {
        console.error("Lỗi kết nối API", e);
        return {};
    }
};

export const getPackageSalesChart = async (startDate, endDate) => {
    try {
        const resp = await axios.get(`${API_URL}/chart`, {
            params: {start: startDate, end: endDate}
        });
        return resp.data
    } catch (e) {
        console.error("Lỗi kết nối API", e);
        return [];
    }
};
