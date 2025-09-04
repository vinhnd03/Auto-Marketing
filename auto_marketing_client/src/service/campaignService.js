import axios from "axios";
import api from "../context/api";
// const URL = `${process.env.REACT_APP_BACKEND_URL}/api/campaign`;
const URL = `/campaign`;

const findCampaignByWorkspaceId = async (workspaceId) => {
  try {
    // const resp = await axios.get(`${URL}/workspaceId`,{
    const resp = await api.get(`${URL}/workspaceId`,{
      params: {workspaceId},
      withCredentials:true
    })
    console.log(resp.data);
    return resp.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
const findAllCampaign = async (
  page = 0,
  size = 10,
  name = "",
  startDate = "",
  workspaceId = 0
) => {
  const params = { page, size, name, startDate, workspaceId };
    console.log("wsiddd: ",workspaceId);

  try {
    // const resp = await axios.get(URL, { params, withCredentials: true });
    const resp = await api.get(URL, { params, withCredentials: true });
    console.log("resp", resp.data);
    return {
      content: resp.data.content || [],
      totalElements: resp.data.totalElements || 0,
    };
  } catch (error) {
    console.log(error);
    return { content: [], totalElements: 0 };
  }
};

const create = async (dto) => {
  try {
    // const res = await axios.post(URL, dto, { withCredentials: true });
    const res = await api.post(URL, dto, { withCredentials: true });
    return { data: res.data, errors: null };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { data: null, errors: error.response.data };
    }
    throw error;
  }
};

// Lấy danh sách trạng thái (enum) từ server
const getStatuses = async () => {
  try {
    // const res = await axios.get(`${URL}/statuses`, { withCredentials: true });
    const res = await api.get(`${URL}/statuses`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái:", error);
    return [];
  }
};

const getStatusMap = async () => {
  try {
    const res = await axios.get(`${URL}/status-map`, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái:", error);
    return [];
  }
};


// Lấy campaign theo id
const findById = async (id) => {
  try {
    // const res = await axios.get(`${URL}/${id}`, {withCredentials: true});
    const res = await api.get(`${URL}/${id}`, {withCredentials: true});
    return { data: res.data, errors: null };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: null, errors: { message: "Campaign không tồn tại" } };
    }
    throw error;
  }
};

// Cập nhật campaign theo id
const update = async (id, dto) => {
  try {
    // const res = await axios.put(`${URL}/${id}`, dto, {withCredentials: true});
    const res = await api.put(`${URL}/${id}`, dto, {withCredentials: true});
    return { data: res.data, errors: null };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { data: null, errors: error.response.data };
    }
    throw error;
  }
};

const softDelete = async (id) => {
  try {
    // const res = await axios.delete(`${URL}/${id}`, { withCredentials: true });
    const res = await api.delete(`${URL}/${id}`, { withCredentials: true });
    return { success: true, message: res.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data || "Xóa không thành công",
      };
    }
    throw error;
  }
};
const uploadExcel = async (file, workspaceId) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // const res = await axios.post(
    const res = await api.post(
      `${URL}/upload-excel?workspaceId=${workspaceId}`, // query param đủ
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { data: res.data, errors: null };
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { data: null, errors: error.response.data };
    }
    throw error;
  }
};

const countCampaign = async (id) => {
  try {
    // const resp = await axios.get(`${URL}/totalCampaign`, {
    const resp = await api.get(`${URL}/totalCampaign`, {
      params: { userId: id },
      withCredentials: true,
    });
    return resp.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  findAllCampaign,
  create,
  getStatuses,
  findById,
  update,
  softDelete,
  uploadExcel,
  countCampaign,
  findCampaignByWorkspaceId,
  getStatusMap
};
