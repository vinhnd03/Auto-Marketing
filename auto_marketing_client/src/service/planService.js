import axios from "axios";

const URL = "http://localhost:8080/api/admin/plans";

const getPlans = async () => {
    try {
        const resp = await axios.get(URL, {withCredentials: true});
        console.log("API response:", resp.data);
        return resp.data
    } catch (e) {
        console.log("Lỗi kết nối api", e);
        return [];
    }
}

const getPlanById = async (id) => {
    try {
        const resp = await axios.get(`${URL}/${id}`, {withCredentials: true});
        return resp.data
    } catch (e) {
        console.log("Lỗi kết nối api", e);
        return {};
    }
}

const createPlan = async (plan) => {
    try {
        return await axios.post(URL, plan, {withCredentials: true});
    } catch (e) {
        console.log("Lỗi kết nối api", e);
        return {};
    }
}

const updatePlan = async (plan) => {
    try {
        return await axios.put(`${URL}/${plan.id}`, plan, {withCredentials: true});
    } catch (e) {
        console.log("Lỗi kết nối api", e);
        return {};
    }
}

const deletePlan = async (id) => {
    try {
        return await axios.delete(`${URL}/${id}`, {withCredentials: true});
    } catch (e) {
        console.log("Lỗi kết nối api", e);
        return {};
    }
}

export {getPlans, getPlanById, createPlan, updatePlan, deletePlan};