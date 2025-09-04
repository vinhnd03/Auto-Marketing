import axios from "axios";

const sendEmail = async (email) => {
  try {
    const resp = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`,
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