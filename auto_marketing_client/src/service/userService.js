import axios from "axios"

const URL = "http://localhost:8080"

const getUserProfile = async (id) => {
    try {
        const resp = await axios.get(`${URL}/api/user/${id}`, { withCredentials: true });
        if(resp.data.success){
            return resp.data.profile;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateUserProfile = async (userProfile) => {
    try {
        const resp = await axios.put(`${URL}/api/user`, userProfile, {withCredentials : true});
        return resp.data.success;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default {getUserProfile, updateUserProfile}