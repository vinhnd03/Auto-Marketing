import axios from "axios"
// import api from "../context/api";

const verifyToken = async (token) => {
    try {
        const resp = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-token?token=${token}`,
            {withCredentials: true}
        )
        return resp.data.valid
    } catch (error) {
        console.log(error);
        return false;
    }
}


export default verifyToken;