import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Lấy danh sách plan
export const fetchPlans = async () => {
    const response = await axios.get(`${API_URL}/api/v1/plans`,{
        withCredentials: true,
    });
    return Array.isArray(response.data) ? response.data : [];
};

// Đăng ký gói FREE
export const subscribeTrial = async (userId) => {
    const response = await axios.post(
        `${API_URL}/api/v1/workspaces/subscriptions/trial?userId=${userId}`,
        {},
        {withCredentials: true}
    );
    return response.data;
};

// Thanh toán gói qua VNPAY
export const createPayment = async (plan, userId) => {
    const response = await axios.post(
        `${API_URL}/api/payment`,
        {
            serviceName: plan.name,
            amount: plan.price,
            userId,
            maxWorkspace: plan.maxWorkspace,
            duration: plan.durationDate,
        },
        {withCredentials: true}
    );
    return response.data;
};

export const getMostPopularPlan = async () => {
    try {
        const res = await axios.get(`${API_URL}}/api/v1/plans/getMostPopular`, {withCredentials: true})
        return res.data;
    } catch (e) {
        console.log("loi ket noi du lieu")
        return "";
    }
}