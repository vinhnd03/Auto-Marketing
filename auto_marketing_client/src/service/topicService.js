import axios from "axios";
import toast from "react-hot-toast";
import api from "../context/api";

// Base URL for topic API
// const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;
const BASE_URL = `/v1`;

// Configure axios with default timeout
// const apiClient = axios.create({
// const apiClient = axios.create({
//   withCredentials: true,
//   baseURL: BASE_URL,
//   timeout: 30000, // 30 seconds for AI generation
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

const config = {
  withCredentials: true,
  timeout: 30000, // 30 seconds for AI generation
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

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
    // const response = await apiClient.post("/topics/generate", requestData);
    const response = await api.post("/v1/topics/generate", requestData, config);
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
    const response = await api.get(`/v1/topics/campaign/${campaignId}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getTopicsByCampaignId = async (campaignId) => {
  try {
    const resp = await api.get(`${BASE_URL}/topics/campaignId`, {
      params: { campaignId },
      withCredentials: true,
      ...config,
    });
    console.log(resp.data);

    return resp.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Get topics by campaign and status
 * @param {number} campaignId - Campaign ID
 * @param {string} status - Topic status (PENDING/APPROVED/REJECTED)
 * @returns {Promise<Array>} Filtered topics list
 */
export async function getTopicsByCampaignAndStatus(campaignId, status) {
  try {
    const response = await api.get(
      `/v1/topics/campaign/${campaignId}/status/${status}`,
      config
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
    const response = await api.put(
      `/v1/topics/${topicId}/approve`,
      null,
      config
    );
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
    const response = await api.put(
      `/v1/topics/${topicId}/reject`,
      null,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteTopic(topicId) {
  try {
    const response = await api.delete(`/v1/topics/${topicId}`, config);
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
    await api.delete(
      `/v1/topics/campaign/${campaignId}/status/${status}`,
      config
    );
  } catch (error) {
    throw error;
  }
}

// Đếm số topic APPROVED của một campaign
export async function countApprovedTopicsByCampaign(campaignId) {
  try {
    const response = await api.get(
      `/v1/topics/count/approved/campaign/${campaignId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error counting approved topics:", error);
    return 0;
  }
}
