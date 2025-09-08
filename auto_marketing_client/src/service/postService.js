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
  timeout: 60000, // 60 seconds for AI generation (increased from 30s)
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
      {
        ...config,
        timeout: 90000, // 90 seconds for image generation specifically
      }
    );
    return response.data; // List<String> imageUrls
  } catch (error) {
    console.error("Error in generateImagesForPost:", error);

    // Enhanced error handling
    if (error.code === "ECONNABORTED") {
      const customError = new Error(
        "Quá trình tạo hình ảnh mất quá nhiều thời gian. Vui lòng thử lại với mô tả ngắn gọn hơn."
      );
      customError.code = "ECONNABORTED";
      throw customError;
    }

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      let message = "Có lỗi xảy ra khi tạo hình ảnh";

      // Log the full error response for debugging
      console.log("Full error response:", error.response);
      console.log("Error message:", error.message);

      switch (status) {
        case 400:
          // Check for OpenAI content policy violation in multiple places
          const errorString = JSON.stringify(data || {});
          const messageString = error.message || "";

          if (
            messageString.includes("content_policy_violation") ||
            messageString.includes("safety system") ||
            errorString.includes("content_policy_violation") ||
            errorString.includes("safety system") ||
            data?.message?.includes("safety system") ||
            data?.message?.includes("content_policy_violation") ||
            data?.error?.code === "content_policy_violation"
          ) {
            message =
              "Nội dung mô tả không phù hợp với chính sách an toàn của AI. Vui lòng thử lại với mô tả khác (tránh nội dung bạo lực, tình dục, hoặc không phù hợp).";
          } else {
            message = data?.message || "Dữ liệu đầu vào không hợp lệ";
          }
          break;
        case 401:
          message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại";
          break;
        case 403:
          message = "Bạn không có quyền thực hiện thao tác này";
          break;
        case 429:
          message = "Đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau";
          break;
        case 500:
          message = "Server đang gặp sự cố. Vui lòng thử lại sau ít phút";
          break;
        case 503:
          message = "Dịch vụ tạo ảnh tạm thời không khả dụng";
          break;
        default:
          message = data?.message || `Lỗi server (${status})`;
      }

      const customError = new Error(message);
      customError.response = error.response;
      throw customError;
    }

    // Network or other errors
    throw new Error(
      "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng"
    );
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
