import axios from "axios";

export const getSocialAccountsByUserId = async (userId) => {
    try {
        const res = await axios.get(`http://localhost:8080/api/social-accounts/user/${userId}`,{withCredentials: true,});
        return res.data;
    } catch (err) {
        console.error(err);
        return { error: err.response?.data || "Error" };
    }
};