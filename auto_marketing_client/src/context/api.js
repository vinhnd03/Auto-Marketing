// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://auto-marketing-production.up.railway.app/api",
  withCredentials: true,
});

export default api;