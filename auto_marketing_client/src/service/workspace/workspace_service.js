import axios from "axios";

const url = "http://localhost:8080/api/v1/workspaces"
export const getAllWorkspaceByUserId = async (id) => {
    try {
        const res = await axios.get(`${url}/${id}`,{ withCredentials: true, })
        return res.data;
    } catch (e) {
        console.log("loi ket noi db")
        return []
    }
}

export const addWorkspace = async (workspaceCreate) => {
    try {
        const res = await axios.post(`${url}`, workspaceCreate,{ withCredentials: true, });
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return {error: error.response.data};
        }
        return {error: "Không thể kết nối dữ liệu .vui lòng thử lại"};
    }
}

export const updateWorkspace = async (id, workspaceUpdate) => {

    try {
        const res = await axios.patch(`${url}/${id}`, workspaceUpdate,{ withCredentials: true, });
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return {error: error.response.data};
        }
        return {error: "Không thể kết nối dữ liệu .vui lòng thử lại"};
    }
}

export const getMaxWorkspace = async (id, workspaceUpdate) => {

    try {
        const res = await axios.get(`${url}/${id}/workspace-limit`,{ withCredentials: true, });
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return {error: error.response.data};
        }
        return {error: "Không thể kết nối dữ liệu .vui lòng thử lại"};
    }
}

export const updateWorkspaceStatus = async (userId,ids, status) => {
    try {
        const res = await axios.patch(`http://localhost:8080/api/v1/workspaces/${userId}/status`, {
            ids,
            status
        },{ withCredentials: true, });
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return { error: error.response.data };
        }
        return { error: "Không thể kết nối dữ liệu .vui lòng thử lại" };
    }
};