import axios from "axios";

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


// export async function search(
//     nameKeyword,
//     servicePackageKey,
//     page = 1,
//     size = 2,
//     startDate = null,
//     endDate = null
// ) {
//     try {
//         const response = await axios.get("http://localhost:8080/api/users");
//         const allCustomers = response.data?.data || response.data || [];
//
//         const filtered = allCustomers.filter((p) => {
//             const matchName =
//                 !nameKeyword ||
//                 (p.name && p.name.toLowerCase().includes(nameKeyword.toLowerCase()));
//
//             const matchService =
//                 !servicePackageKey ||
//                 (p.servicePackage && p.servicePackage.toLowerCase().includes(servicePackageKey.toLowerCase()));
//
//             const matchDate = (() => {
//                 if (!startDate && !endDate) return true;
//                 const regDate = new Date(p.createDate);
//                 if (startDate && regDate < new Date(startDate)) return false;
//                 if (endDate && regDate > new Date(endDate)) return false;
//                 return true;
//             })();
//
//             return matchName && matchService && matchDate;
//         });
//
//         const startIndex = (page - 1) * size;
//         const endIndex = startIndex + size;
//         const pagedData = filtered.slice(startIndex, endIndex);
//
//         return {
//             data: pagedData,
//             totalItems: filtered.length,
//             totalPages: Math.ceil(filtered.length / size),
//             currentPage: page,
//         };
//     } catch (e) {
//         console.error("Error fetching customers:", e);
//         return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
//     }
// }
// export async function search(
//     nameKeyword,
//     servicePackageKey,
//     page = 1,
//     size = 5
// ) {
//     try {
//         const response = await axios.get("http://localhost:8080/api/users", {
//             params: {
//                 name: nameKeyword || null,
//                 planName: servicePackageKey || null,
//                 page: page - 1, // Spring Data JPA dùng 0-based index
//                 size
//             }
//         });
//
//         const result = response.data;
//         return {
//             data: result.content || [],
//             totalItems: result.totalItems || 0,
//             totalPages: result.totalPages || 0,
//             currentPage: result.number + 1
//         };
//     } catch (e) {
//         console.error("Error fetching customers:", e);
//         return {data: [], totalItems: 0, totalPages: 0, currentPage: page};
//     }
// }


export async function search(
    nameKeyword,
    servicePackageKey,
    page = 1,
    size = 5,
    startDate = null,
    endDate = null
) {
    try {
        // 1. Gửi request chỉ với name + planName
        const { data: result } = await axios.get("http://localhost:8080/api/users", {
            params: {
                name: nameKeyword || undefined,
                planName: servicePackageKey || undefined,
                page: 0, // Lấy hết data để tự lọc
                size: 10000 // Số đủ lớn để lấy toàn bộ
            }
        });

        let allData = result?.content ?? [];

        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            allData = allData.filter(item => {
                const createdAt = new Date(item.createDate); // cột ngày của bạn
                return (!start || createdAt >= start) && (!end || createdAt <= end);
            });
        }

        const totalItems = allData.length;
        const totalPages = Math.ceil(totalItems / size);
        const paginatedData = allData.slice((page - 1) * size, page * size);

        return {
            data: paginatedData,
            totalItems,
            totalPages,
            currentPage: page
        };
    } catch (e) {
        console.error("Error fetching customers:", e);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
    }
}


