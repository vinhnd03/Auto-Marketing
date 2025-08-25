import axios from "axios";

const BASE = "http://localhost:8080/api/users";

export async function filterUsersByPackage(
    filter = null, // "NO_PACKAGE" | "EXPIRED" | "ACTIVE" | null
    page = 1,
    size = 10
) {
    try {
        const { data } = await axios.get(`${BASE}/search`, {
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
        const response = await axios.get("http://localhost:8080/api/users", {
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
        const response = await axios.patch("http://localhost:8080/api/users/" + id, user);
        return response.data;
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function findById(id) {
    try {
        const response=await axios.get("http://localhost:8080/api/users/"+id);
        return response.data;
    }catch (e) {
        console.log(e)
        return null;
    }
}

export async function searchAndPage(
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



// export async function searchAndPage(
//     nameKeyword,
//     servicePackageKey,
//     page = 1,
//     size = 5,
//     startDate = null,
//     endDate = null
// ) {
//     try {
//         // 1. Gửi request chỉ với name + planName
//         const { data: result } = await axios.get("http://localhost:8080/api/users", {
//             params: {
//                 name: nameKeyword || undefined,
//                 planName: servicePackageKey || undefined,
//                 page: 0, // Lấy hết data để tự lọc
//                 size: 10000 // Số đủ lớn để lấy toàn bộ
//             }
//         });
//
//         let allData = result?.content ?? [];
//
//         if (startDate || endDate) {
//             const start = startDate ? new Date(startDate) : null;
//             const end = endDate ? new Date(endDate) : null;
//
//             allData = allData.filter(item => {
//                 const createdAt = new Date(item.createdAt); // cột ngày của bạn
//                 return (!start || createdAt >= start) && (!end || createdAt <= end);
//             });
//         }
//
//         const totalItems = allData.length;
//         const totalPages = Math.ceil(totalItems / size);
//         const paginatedData = allData.slice((page - 1) * size, page * size);
//
//         return {
//             data: paginatedData,
//             totalItems,
//             totalPages,
//             currentPage: page
//         };
//     } catch (e) {
//         console.error("Error fetching customers:", e);
//         return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
//     }
// }


