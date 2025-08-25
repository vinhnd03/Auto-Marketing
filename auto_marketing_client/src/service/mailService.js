import axios from "axios";

const sendEmail = async (email) => {
  try {
    const resp = await axios.post(
      "http://localhost:8080/api/auth/forgot-password",
      { email },
      { withCredentials: true }
    );
    return resp.data.success;
  } catch (error) {
    console.error(error);
    return error.response?.data?.success ?? false;
  }
};

export default sendEmail;