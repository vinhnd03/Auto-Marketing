import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getPostsByTopic(topicId) {
  try {
    const response = await apiClient.get(`/posts/topic/${topicId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
