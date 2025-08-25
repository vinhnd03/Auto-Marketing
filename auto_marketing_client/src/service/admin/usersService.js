import axios from "axios";


export async function getAll() {
    try {
        const response = await axios.get("http://localhost:8080/api/users", {
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
        const response = await axios.patch("http://localhost:8080/api/users/" + id, user, {withCredentials: true});
        return response.data;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function findById(id) {
    try {
        const response=await axios.get("http://localhost:8080/api/users/"+id, {withCredentials: true});
        return response.data;
    }catch (e) {
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
        const { data: result } = await axios.get("http://localhost:8080/api/users", {
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



