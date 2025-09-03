import axios from "axios";
import { data } from 'react-router-dom';
import api from "../context/api";

// Base URL for topic API
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;
// const BASE_URL = `/v1`;

export const getTopicsByCampaignId = async (campaignId) => {
  try {
    // const resp = await axios.get(`${BASE_URL}/topics/campaignId`, {
    const resp = await axios.get(`${BASE_URL}/topics/campaignId`, {
      params: {campaignId},
      withCredentials:true
    })
    console.log(resp.data);
    
    return resp.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
// Configure axios with default timeout
// const apiClient = axios.create({
const apiClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds for AI generation
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout - AI generation mất quá nhiều thời gian";
    } else if (error.code === "ERR_NETWORK") {
      error.message = "Network Error - Không thể kết nối đến server";
    } else if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "Dữ liệu không hợp lệ";
          break;
        case 404:
          error.message = "Chiến dịch không tồn tại";
          break;
        case 500:
          error.message = "AI generation failed - Lỗi server";
          break;
        default:
          error.message = `Server Error ${error.response.status}: ${
            error.response.data?.message || error.response.statusText
          }`;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generate topics using AI for a specific campaign
 * @param {Object} requestData - Topic generation request
 * @param {number} requestData.campaignId - Campaign ID
 * @param {number} requestData.numberOfTopics - Number of topics to generate
 * @param {string} requestData.creativityLevel - conservative/balanced/creative
 * @param {string} requestData.contentStyle - friendly/professional/creative
 * @param {string} requestData.additionalInstructions - Optional additional instructions
 * @returns {Promise<Array>} Generated topics
 */
export async function generateTopicsWithAI(requestData) {
  try {
    const response = await apiClient.post("/topics/generate", requestData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all topics for a specific campaign
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<Array>} Topics list
 */
export async function getTopicsByCampaign(campaignId) {
  try {
    const response = await apiClient.get(`/topics/campaign/${campaignId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get topics by campaign and status
 * @param {number} campaignId - Campaign ID
 * @param {string} status - Topic status (PENDING/APPROVED/REJECTED)
 * @returns {Promise<Array>} Filtered topics list
 */
export async function getTopicsByCampaignAndStatus(campaignId, status) {
  try {
    const response = await apiClient.get(
      `/topics/campaign/${campaignId}/status/${status}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Approve a topic
 * @param {number} topicId - Topic ID
 * @returns {Promise<Object>} Updated topic
 */
export async function approveTopic(topicId) {
  try {
    const response = await apiClient.put(`/topics/${topicId}/approve`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Reject a topic
 * @param {number} topicId - Topic ID
 * @returns {Promise<Object>} Updated topic
 */
export async function rejectTopic(topicId) {
  try {
    const response = await apiClient.put(`/topics/${topicId}/reject`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTopic(topicId) {
  try {
    const response = await apiClient.delete(`/topics/${topicId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete all topics by campaign and status
 * @param {number} campaignId - Campaign ID
 * @param {string} status - Topic status (PENDING/APPROVED/REJECTED)
 * @returns {Promise<void>}
 */
export async function deleteTopicsByCampaignAndStatus(campaignId, status) {
  try {
    // status nên là 'PENDING'
    await apiClient.delete(`/topics/campaign/${campaignId}/status/${status}`);
  } catch (error) {
    throw error;
  }
}
