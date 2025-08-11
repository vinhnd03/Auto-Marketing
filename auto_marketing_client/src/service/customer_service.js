
import axios from "axios";

// Danh sách khách hàng
export let customer = [
    {
        id: 1,
        codeCustomer: "C001",
        nameCustomer: "Nguyễn Văn A",
        email: "a@example.com",
        phone: "0901111111",
        servicePackage: "Gói Premium",
        username: "nguyenvana",
        createDate: "2025-08-01",
        status:true
    },
    {
        id: 2,
        codeCustomer: "C002",
        nameCustomer: "Trần Thị B",
        email: "b@example.com",
        phone: "0902222222",
        servicePackage: "Gói Basic",
        username: "tranthib",
        createDate: "2025-08-02",
        status: false
    },
    {
        id: 3,
        codeCustomer: "C003",
        nameCustomer: "Lê Văn C",
        email: "c@example.com",
        phone: "0903333333",
        servicePackage: "Gói Premium",
        username: "levanc",
        createDate: "2025-08-03",
        status: true
    },
    {
        id: 4,
        codeCustomer: "C004",
        nameCustomer: "Phạm Thị D",
        email: "d@example.com",
        phone: "0904444444",
        servicePackage: "Gói Standard",
        username: "phamthid",
        createDate: "2025-08-04",
        status: true
    },
    {
        id: 5,
        codeCustomer: "C005",
        nameCustomer: "Hoàng Văn E",
        email: "e@example.com",
        phone: "0905555555",
        servicePackage: "Gói Basic",
        username: "hoangvane",
        createDate: "2025-08-05",
        status: false
    },
    {
        id: 6,
        codeCustomer: "C006",
        nameCustomer: "Vũ Thị F",
        email: "f@example.com",
        phone: "0906666666",
        servicePackage: "Gói Premium",
        username: "vuthif",
        createDate: "2025-08-06",
        status: false
    },
    {
        id: 7,
        codeCustomer: "C007",
        nameCustomer: "Ngô Văn G",
        email: "g@example.com",
        phone: "0907777777",
        servicePackage: "Gói Standard",
        username: "ngovang",
        createDate: "2025-08-07",
        status: true
    },
    {
        id: 8,
        codeCustomer: "C008",
        nameCustomer: "Đỗ Thị H",
        email: "h@example.com",
        phone: "0908888888",
        servicePackage: "Gói Basic",
        username: "dothih",
        createDate: "2025-08-08",
        status: false
    },
    {
        id: 9,
        codeCustomer: "C009",
        nameCustomer: "Bùi Văn I",
        email: "i@example.com",
        phone: "0909999999",
        servicePackage: "Gói Premium",
        username: "buivani",
        createDate: "2025-08-09",
        status: true
    },
    {
        id: 10,
        codeCustomer: "C010",
        nameCustomer: "Tạ Thị J",
        email: "j@example.com",
        phone: "0910000000",
        servicePackage: "Gói Standard",
        username: "tatij",
        createDate: "2025-08-10",
        status: true
    },
    {
        id: 11,
        codeCustomer: "C011",
        nameCustomer: "Phan Văn K",
        email: "k@example.com",
        phone: "0911111111",
        servicePackage: "Gói Basic",
        username: "phanvank",
        createDate: "2025-08-11",
        status: false
    },
    {
        id: 12,
        codeCustomer: "C012",
        nameCustomer: "Mai Thị L",
        email: "l@example.com",
        phone: "0912222222",
        servicePackage: "Gói Premium",
        username: "maithil",
        createDate: "2025-08-12",
        status: true
    }
];

// Danh sách gói dịch vụ
export let servicePackages = [
    { id: 1, name: "Gói Basic" },
    { id: 2, name: "Gói Standard" },
    { id: 3, name: "Gói Premium" }
];



export async function getAllCustomer() {
    return customer;
    // //gọi API
    // try {
    //     const response = await axios.get("http://localhost:8080/customer");
    //     return response.data;
    // } catch (e) {
    //     console.log(e)
    //     return [];
    // }
}

export async function addNewCustomer(customer) {
    try {
        const response = await axios.post("http://localhost:8080/customer", customer);
    } catch (e) {
        console.log(e)
        throw e;
    }
}

export async function search(
    nameKeyword,
    servicePackageKey,
    page = 1,
    size = 2,
    startDate = null,
    endDate = null
) {
    try {
        const filtered = customer.filter((p) => {
            const matchName =
                !nameKeyword ||
                p.nameCustomer.toLowerCase().includes(nameKeyword.toLowerCase());

            const matchService =
                !servicePackageKey ||
                p.servicePackage.toLowerCase().includes(servicePackageKey.toLowerCase());

            const matchDate = (() => {
                if (!startDate && !endDate) return true; // Không lọc theo ngày
                const regDate = new Date(p.createDate); // Ngày đăng ký của khách
                if (startDate && regDate < new Date(startDate)) return false;
                else if(endDate && regDate > new Date(endDate)) return false;
                return true;
            })();

            return matchName && matchService && matchDate;
        });

        // Phân trang
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const pagedData = filtered.slice(startIndex, endIndex);

        return {
            data: pagedData,
            totalItems: filtered.length,
            totalPages: Math.ceil(filtered.length / size),
            currentPage: page,
        };
    } catch (e) {
        console.log(e);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
    }
}

// export async function search(nameKeyword, servicePackageKey, page = 1, size = 5) {
//     try {
//         // Lọc danh sách khách hàng theo tên và gói dịch vụ
//         const filtered = customer.filter((p) => {
//             const matchName = !nameKeyword || p.nameCustomer.toLowerCase().includes(nameKeyword.toLowerCase());
//             const matchService = !servicePackageKey || p.servicePackage.toLowerCase().includes(servicePackageKey.toLowerCase());
//             return matchName && matchService;
//         });
//
//         // Tính toán phân trang
//         const startIndex = (page - 1) * size;
//         const endIndex = startIndex + size;
//         const pagedData = filtered.slice(startIndex, endIndex);
//
//         return {
//             data: pagedData,         // Dữ liệu cho trang hiện tại
//             totalItems: filtered.length, // Tổng số bản ghi tìm được
//             totalPages: Math.ceil(filtered.length / size), // Tổng số trang
//             currentPage: page
//         };
//     } catch (e) {
//         console.log(e);
//         return { data: [], totalItems: 0, totalPages: 0, currentPage: page };
//     }
// }



// export async function search(nameKeyword, idKey) {
//     try {
//         const name = await axios.get(`http://localhost:8080/customer?_sort=soLuong&_order=asc`)
//         const theLoaiId = await axios.get("http://localhost:8080/theLoai");
//         const responseName = name.data.filter((p) => {
//             return (!nameKeyword || p.nameCustomer.toLowerCase().includes(nameKeyword.toLowerCase()))
//                 && (!idKey || p.theLoai.id === parseInt(idKey));
//         });
//         return {
//             sach: responseName,
//             theLoai: theLoaiId.data
//         }
//     } catch (e) {
//         console.log(e)
//         return {
//             sach: [],
//             theLoai: []
//         }
//     }
// }
