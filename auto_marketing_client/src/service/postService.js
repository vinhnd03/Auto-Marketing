import axios from "axios";
import api from "../context/api";

// const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;
// const apiClient = axios.create({
//   withCredentials: true,
//   baseURL: BASE_URL,
//   timeout: 10 * 60 * 1000,
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

export async function getPostsByTopic(topicId) {
  try {
    const response = await api.get(`/v1/posts/topic/${topicId}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function generateContentWithAI(body) {
  try {
    const response = await api.post("/v1/posts/generate", body, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function approveAndCleanPosts(topicId, selectedPostIds) {
  console.log("selected: ", selectedPostIds);
  return api.post(
    `/v1/posts/approve-and-clean?topicId=${topicId}`,
    selectedPostIds,
    config
  );
}

export const getPostsByFilter = async (workspaceId, campaignId, topicId) => {
  try {
    const resp = await api.get("/v1/posts/filter", {
      params: {
        workspaceId,
        campaignId: campaignId || null,
        topicId: topicId || null,
      },
      withCredentials: true,
      ...config,
    });
    console.log(resp.data);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Đếm tổng số bài viết của một topic
export async function countPostsByTopic(topicId) {
  try {
    const response = await api.get(
      `/v1/posts/topic/${topicId}/count/approved`,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Lấy các post có status APPROVED cho một topic
export async function getApprovedPostsByTopic(topicId) {
  try {
    const response = await api.get(
      `/v1/posts/topic/${topicId}/approved`,
      config
    );
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

// Gọi API gen ảnh cho bài post
export async function generateImagesForPost(
  postId,
  { prompt, style, numImages }
) {
  try {
    const response = await api.post(
      `/v1/posts/${postId}/generate-images`,
      {
        prompt,
        style,
        numImages,
      },
      config
    );
    return response.data; // List<String> imageUrls
  } catch (error) {
    throw error;
  }
}

// Gọi API lưu ảnh đã chọn cho bài post
export async function saveImagesForPost(postId, selectedImageUrls) {
  try {
    await api.post(
      `/v1/posts/${postId}/save-images`,
      selectedImageUrls,
      config
    );
    return true;
  } catch (error) {
    throw error;
  }
}

export const updatePostV2 = (postId, payload, isMultipart = false) => {
  if (isMultipart) {
    // multipart -> không set Content-Type thủ công
    return api
      .put(`/v1/posts/${postId}`, payload, config)
      .then((res) => res.data);
  } else {
    // json
    return api
      .put(`/v1/posts/${postId}`, payload, config)
      .then((res) => res.data);
  }
};

// Đếm tổng số bài viết APPROVED của một workspace
export async function countApprovedPostsByWorkspace(workspaceId) {
  try {
    const response = await api.get(
      `/v1/posts/workspace/${workspaceId}/count/approved`,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
