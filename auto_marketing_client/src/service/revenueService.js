import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin/revenue";

const getRevenue = async (type, start, end) => {
    try {
        const response = await axios.get(BASE_URL, {
            withCredentials: true,
            params: {
                type,
                start,
                end
            }
        });
        return response.data
    } catch (e) {
        console.log("Lỗi kết nối api", e);
        throw e;
    }
};
const getRevenueStats = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/dashboard`, {withCredentials: true});
        return response.data;
    } catch (e) {
        console.error("Lỗi kết nối API", e);
        throw e;
    }
};
export {getRevenue, getRevenueStats};