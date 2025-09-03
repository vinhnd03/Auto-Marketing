import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/transactions`;

export const getAllTransactionSuccess = async (page, size, filterPlan) => {
    try {
        const res = await axios.get(API_URL, {
            params: { page, size, filterPlan },
            withCredentials: true,
        });
        return res.data; // trả luôn object { transactions, totalPages }
    } catch (error) {
        console.error("Lỗi khi gọi API transactions:", error);
        throw error;
    }
};