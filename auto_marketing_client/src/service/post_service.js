import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";
const apiClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 180000,
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

export async function generateContentWithAI(body) {
  try {
    const response = await apiClient.post("/posts/generate", body);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function approveAndCleanPosts(topicId, selectedPostIds) {
  return apiClient.post(
    `/posts/approve-and-clean?topicId=${topicId}`,
    selectedPostIds
  );
}
