import axios from "axios"

const verifyToken = async (token) => {
    try {
        const resp = await axios.get(
            `http://localhost:8080/api/auth/verify-token?token=${token}`,
            {withCredentials: true}
        )
        return resp.data.valid
    } catch (error) {
        console.log(error);
        return false;
    }
}


export default verifyToken;