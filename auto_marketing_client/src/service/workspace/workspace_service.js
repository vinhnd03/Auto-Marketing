import axios from "axios";

const url = "http://localhost:8080/api/v1/workspaces"
export const getAllWorkspaceByUserId = async (id) => {
    try {
        const res = await axios.get(`${url}/user/${id}`, {withCredentials: true,})
        return res.data;
    } catch (e) {
        console.log("loi ket noi db")
        return []
    }
}

export const addWorkspace = async (formData) => {
    try {
        const res = await axios.post(
            `${url}`,
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return {error: error.response.data};
        }
        return {error: "Không thể kết nối dữ liệu. Vui lòng thử lại"};
    }
};

export const updateWorkspace = async (id, formData) => {
    try {
        const res = await axios.patch(
            `${url}/${id}`,
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return { error: error.response.data };
        }
        return { error: "Không thể kết nối dữ liệu. Vui lòng thử lại" };
    }
};

export const getMaxWorkspace = async (id) => {

    try {
        const res = await axios.get(`${url}/${id}/workspace-limit`, {withCredentials: true,});
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return {error: error.response.data};
        }
        return {error: "Không thể kết nối dữ liệu .vui lòng thử lại"};
    }
}

export const updateWorkspaceStatus = async (userId, ids, status) => {
    try {
        const res = await axios.patch(`${url}/${userId}/status`, {
            ids,
            status
        }, {withCredentials: true,});
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return {error: error.response.data};
        }
        return {error: "Không thể kết nối dữ liệu .vui lòng thử lại"};
    }
};

export const getWorkspaceDetail = async (workspaceId) => {
    try {
        const res = await axios.get(`${url}/${workspaceId}`,{withCredentials: true,});
        return res.data; // trả về 1 workspace hoặc Array tùy backend
    } catch (err) {
        console.log(err);
        return null;
    }
};