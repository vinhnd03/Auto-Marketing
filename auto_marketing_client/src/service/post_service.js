import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1";
const apiClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function getPostsByTopic(topicId) {
  try {
    const response = await apiClient.get(`/posts/topic/${topicId}` );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getPostsByFilter = async (workspaceId,campaignId,topicId) => {
  try {
    const resp = await axios.get(`${BASE_URL}/posts/filter`, {
      params: {
        workspaceId,
        campaignId: campaignId || null,
        topicId: topicId || null
      },
      withCredentials: true
    })
    console.log(resp.data);
    
    return resp.data
  } catch (error) {
    
  }
}
