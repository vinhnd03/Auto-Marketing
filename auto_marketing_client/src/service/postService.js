import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;
const apiClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  timeout: 10 * 60 * 1000,
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
  console.log("selected: ", selectedPostIds);
  return apiClient.post(
    `/posts/approve-and-clean?topicId=${topicId}`,
    selectedPostIds
  );
}

export const getPostsByFilter = async (workspaceId, campaignId, topicId) => {
  try {
    const resp = await axios.get(`${BASE_URL}/posts/filter`, {
      params: {
        workspaceId,
        campaignId: campaignId || null,
        topicId: topicId || null,
      },
      withCredentials: true,
    });
    console.log(resp.data);

    return resp.data;
  } catch (error) {}
};

// Đếm tổng số bài viết của một topic
export async function countPostsByTopic(topicId) {
  try {
    const response = await apiClient.get(
      `/posts/topic/${topicId}/count/approved`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Lấy các post có status APPROVED cho một topic
export async function getApprovedPostsByTopic(topicId) {
  try {
    const response = await apiClient.get(`/posts/topic/${topicId}/approved`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Hàm mock API lấy bài viết AI đã tạo
export async function getAIGeneratedPosts() {
  // TODO: Thay bằng gọi API thực tế
  return [
    {
      id: 1,
      title: "AI Marketing Post 1",
      content: "Đây là nội dung bài viết AI số 1.",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "AI Marketing Post 2",
      content: "Đây là nội dung bài viết AI số 2.",
      createdAt: new Date().toISOString(),
    },
  ];
}
