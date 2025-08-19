import { useEffect, useState } from "react";
import { search, getAllServicePackages } from "../../service/customer_service";

function ListCustomerComponent() {
    const [list, setList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showLocked, setShowLocked] = useState(null);
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            const pkgs = await getAllServicePackages();
            setPackages(pkgs);
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [page]);

    const handleSearch = async () => {
        const { data, totalPages } = await search(keyword, sortKey, page, 5);
        let filteredData = data;

        if (showLocked !== null) {
            filteredData = filteredData.filter(c => c.status === showLocked);
        }

        setList(filteredData);
        setTotalPages(totalPages);
    };

    const toggleStatus = (id) => {
        setList(prevList =>
            prevList.map(c =>
                c.id === id ? { ...c, status: !c.status } : c
            )
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            {/* Tiêu đề */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-blue-50 p-4 rounded-lg shadow-md">
                <p className="text-3xl font-bold">Danh sách các tài khoản hiện có</p>
            </div>

            {/* Form tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 bg-white p-4 rounded-lg shadow-md">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Tìm theo tên khách hàng</label>
                    <input
                        type="text"
                        placeholder="Nhập gần đúng tên khách hàng..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Tìm theo gói dịch vụ</label>
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="">Tất cả</option>
                        {packages.map(pkg => (
                            <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Trạng thái tài khoản</label>
                    <select
                        value={showLocked ?? ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            setShowLocked(val === "" ? null : val === "true");
                        }}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="">Tất cả</option>
                        <option value="false">Đang hoạt động</option>
                        <option value="true">Bị khóa</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => { setPage(1); handleSearch(); }}
                        className="px-5 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-300"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Bảng */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-300">
                    <tr>
                        <th className="p-2 border-b">STT</th>
                        <th className="p-2 border-b">Tên khách hàng</th>
                        <th className="p-2 border-b">Email</th>
                        <th className="p-2 border-b">Ngày tạo tài khoản</th>
                        <th className="p-2 border-b">Gói đã mua</th>
                        <th className="p-2 border-b">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-gray-500">
                                Không có tài khoản nào...
                            </td>
                        </tr>
                    ) : (
                        list.map((customer, index) => (
                            <tr key={customer.id} className="border-b">
                                <td className="p-2">{(page - 1) * 5 + index + 1}</td>
                                <td className="p-2">{customer.name}</td>
                                <td className="p-2">
                                    { customer.subscriptions.length > 0
                                        ? customer.subscriptions.map(sub => sub.planId?.name).join(", ")
                                        : "Chưa mua gói nào"}
                                </td>
                                <td className="p-2">{customer.email}</td>
                                <td className="p-2">{formatDate(customer.createDate)}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => toggleStatus(customer.id)}
                                        className={`px-3 py-1 rounded text-white ${customer.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                                    >
                                        {customer.status ? "Bị khóa" : "Đang hoạt động"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded ${page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}

export default ListCustomerComponent;



// import { useEffect, useState } from "react";
// import { search, getAllServicePackages } from "../../service/customer_service";
//
// function ListCustomerComponent() {
//     const [list, setList] = useState([]);
//     const [keyword, setKeyWord] = useState("");
//     const [sortKey, setSortKey] = useState("");
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [showLocked, setShowLocked] = useState(null); // null = tất cả, true = bị khóa, false = chưa khóa
//     const [packages, setPackages] = useState([]);
//
//
//     useEffect(() => {
//         const fetchData = async ()=>{
//             const packages=await getAllServicePackages();
//             setPackages(packages);
//         }
//         fetchData().then();
//         handleSearch().then();
//     }, [page, showLocked]);
//
//     const handleSearch = async () => {
//         console.log(sortKey);
//         console.log(list);
//         const { data, totalPages } = await search(keyword, sortKey, page, 5);
//
//         let filteredData = data;
//         if (showLocked !== null) {
//             filteredData = filteredData.filter(c => c.status === showLocked);
//         }
//
//         setList(filteredData);
//         console.log("in ra cái này"+filteredData)
//         setTotalPages(totalPages);
//     };
//
//     const toggleStatus = (id) => {
//         setList(prevList =>
//             prevList.map(c =>
//                 c.id === id
//                     ? { ...c, status: !c.status }
//                     : c
//             )
//         );
//     };
//
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
//     };
//
//     return (
//         <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//             {/* Tiêu đề */}
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-blue-50 p-4 rounded-lg shadow-md">
//                 <p className="text-center sm:text-left text-3xl font-bold flex-1">
//                     Danh sách các tài khoản hiện có
//                 </p>
//             </div>
//
//             {/* Form tìm kiếm */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-4 bg-white p-4 rounded-lg shadow-md">
//                 <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Tìm theo tên khách hàng
//                     </label>
//                     <input
//                         type="text"
//                         placeholder="Nhập gần đúng tên khách hàng..."
//                         value={keyword}
//                         onChange={(e) => setKeyWord(e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
//                     />
//                 </div>
//
//                 <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Tìm theo gói dịch vụ
//                     </label>
//                     <select
//                         value={sortKey}
//                         onChange={(e) => setSortKey(e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
//                     >
//                         <option value="">Tất cả tài khoản</option>
//                         {Array.isArray(packages) && packages.map(pkg => (
//                             <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
//                         ))}
//                     </select>
//                 </div>
//
//                 <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Trạng thái tài khoản
//                     </label>
//                     <select
//                         value={showLocked ?? ""}
//                         onChange={(e) => {
//                             const val = e.target.value;
//                             setShowLocked(val === "" ? null : val === "true");
//                         }}
//                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
//                     >
//                         <option value="">Tất cả</option>
//                         <option value="false">Đang hoạt động</option>
//                         <option value="true">Bị khóa</option>
//                     </select>
//                 </div>
//
//                 <div className="flex items-end">
//                     <button
//                         onClick={() => { setPage(1); handleSearch(); }}
//                         className="w-full sm:w-auto px-5 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-300 transition"
//                     >
//                         Tìm kiếm
//                     </button>
//                 </div>
//             </div>
//
//             {/* Table */}
//             <div className="bg-white rounded shadow overflow-x-auto">
//                 <table className="w-full text-left">
//                     <thead className="bg-gray-300">
//                     <tr>
//                         <th className="p-2 border-b">STT</th>
//                         <th className="p-2 border-b">Tên khách hàng</th>
//                         <th className="p-2 border-b">Email</th>
//                         <th className="p-2 border-b">Gói đã mua</th>
//                         <th className="p-2 border-b">Ngày tạo tài khoản</th>
//                         <th className="p-2 border-b">Trạng thái</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {list.length === 0 ? (
//                         <tr>
//                             <td colSpan={9} className="p-4 text-center text-gray-500">
//                                 Không có tài khoản nào...
//                             </td>
//                         </tr>
//                     ) : (
//                         list.map((customer, index) => (
//                             <tr key={customer.id} className="border-b">
//                                 <td className="p-2">{(page - 1) * 5 + index + 1}</td>
//                                 <td className="p-2">{customer.name}</td>
//                                 <td className="p-2">{customer.email}</td>
//                                 <td className="p-2">{customer?.subscriptions?.plan?.name}</td>
//                                 <td className="p-2">{formatDate(customer.createDate)}</td>
//                                 <td className="p-2">
//                                     <button
//                                         onClick={() => toggleStatus(customer.id)}
//                                         className={`px-3 py-1 rounded text-white ${customer.status ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
//                                     >
//                                         {customer.status ? "Bị khóa" : "Đang hoạt động"}
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))
//                     )}
//                     </tbody>
//                 </table>
//             </div>
//             <div  className="flex justify-center items-center mt-4 space-x-2 ">
//                 <button
//                     onClick={() => setPage(p => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                     className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 >
//                     Trước
//                 </button>
//
//                 {(() => {
//                     const visiblePages = 3; // số trang hiển thị
//                     let startPage = Math.max(1, page - 1); // bắt đầu từ trang trước trang hiện tại 1 bước
//
//                     // Nếu gần cuối, đảm bảo vẫn hiển thị đủ 3 trang
//                     if (startPage + visiblePages - 1 > totalPages) {
//                         startPage = Math.max(1, totalPages - visiblePages + 1);
//                     }
//
//                     return [...Array(visiblePages)].map((_, i) => {
//                         const p = startPage + i;
//                         if (p > totalPages) return null; // tránh hiển thị trang vượt max
//                         return (
//                             <button
//                                 key={p}
//                                 onClick={() => setPage(p)}
//                                 className={`px-3 py-1 rounded ${
//                                     page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
//                                 }`}
//                             >
//                                 {p}
//                             </button>
//                         );
//                     });
//                 })()}
//
//                 <button
//                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                     disabled={page === totalPages}
//                     className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//                 >
//                     Sau
//                 </button>
//             </div>
//         </div>
//     );
// }
//
// export default ListCustomerComponent;
