import axios from "axios";

// Base URL for campaign API
const BASE_URL = "http://localhost:8080/api/v1";

// Configure axios with default timeout and interceptors
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout - Server không phản hồi trong 10 giây";
    } else if (error.code === "ERR_NETWORK") {
      error.message = "Network Error - Không thể kết nối đến server";
    } else if (error.response) {
      error.message = `Server Error ${error.response.status}: ${
        error.response.data?.message || error.response.statusText
      }`;
    }

    return Promise.reject(error);
  }
);

// Get all campaigns
export async function getAllCampaigns() {
  try {
    const response = await apiClient.get("/campaigns",{
      withCredentials: true,
    });
    console.log("/////////////////////////////////////////////////////////")
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get campaign by ID
export async function getCampaignById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/campaigns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Create new campaign
export async function createCampaign(campaignData) {
  try {
    const response = await axios.post(`${BASE_URL}/campaigns`, campaignData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Update campaign
export async function updateCampaign(id, campaignData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/campaigns/${id}`,
      campaignData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete campaign
export async function deleteCampaign(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/campaigns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Search campaigns with filters
export async function searchCampaigns(filters = {}) {
  try {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.workspaceId) params.append("workspaceId", filters.workspaceId);

    const response = await axios.get(
      `${BASE_URL}/campaigns/search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
