import axios from "axios";
import api from "../../context/api";

// const BASE = `${process.env.REACT_APP_BACKEND_URL}/api/users`;
const BASE = `/users`;

export async function filterUsersByPackage(
    filter = null, // "NO_PACKAGE" | "EXPIRED"
    page = 1,
    size = 10
) {
    try {
        // const { data } = await axios.get(`${BASE}/search`, {
        const { data } = await api.get(`${BASE}/search`, {
            withCredentials: true,
            params: {
                subscriptionFilter: filter || undefined,
                page: page - 1, // backend dùng page = 0-based
                size
            }
        });

        return {
            data: data?.content ?? [],
            totalPages: data.totalPages,
            currentPage: data.number + 1,
            totalItems: data.totalElements
        };
    } catch (e) {
        console.error("Error fetching filtered users:", e);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
    }
}

export async function getAll() {
    try {
        // const response = await axios.get(BASE, {
        const response = await api.get(BASE, {
            withCredentials: true,
            params: {
                page: 0,
                size: 1000, // đủ lớn để lấy tất cả
                sortBy: "createdAt",
                sortDir: "DESC"
            }
        });

        // Lấy ra danh sách user từ content
        return response.data?.content ?? [];
    } catch (e) {
        console.error("Error in getAll:", e);
        return [];
    }
}



export async function updateUser(id, user) {
    try {
        // const response = await axios.patch(BASE + id, user, { withCredentials: true });
        const response = await api.patch(BASE + id, user, { withCredentials: true });
        return response.data;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function findById(id) {
    try {
        // const response = await axios.get(BASE + "/" + id, { withCredentials: true });
        const response = await api.get(BASE + "/" + id, { withCredentials: true });
        return response.data;
    } catch (e) {
        console.log(e)
        return null;
    }
}

export async function search(
    nameKeyword,
    servicePackageKey,
    page = 1,
    size = 5,
    startDate = null,
    endDate = null,
    showLocked = null // thêm tham số để lọc status ngay trong API call
) {
    try {
        // const { data: result } = await axios.get(BASE, {
        const { data: result } = await api.get(BASE, {
            withCredentials: true,
            params: {
                name: nameKeyword || undefined,
                planName: servicePackageKey || undefined,
                status: showLocked !== null ? showLocked : undefined, // lọc theo status từ backend
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                page: page - 1, // backend page index = 0
                size
            }
        });

        return {
            data: result?.content ?? [],
            totalPages: result.totalPages,
            currentPage: result.number + 1
        };
    } catch (e) {
        console.error("Error fetching customers:", e);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
    }
}


