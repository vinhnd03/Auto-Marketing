
import { useEffect, useState } from "react";
import { search, servicePackages } from "../../service/customer_service";

function ListCustomerByDateComponent() {
    const [list, setList] = useState([]);
    const [keyword, setKeyWord] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        handleSearch();
    }, [page]);

    const handleSearch = async () => {
        const { data, totalPages } = await search(keyword, sortKey, page, 5, startDate, endDate);
        setList(data.map(c => ({
            ...c,
            status: c.status || "Đang hoạt động"
        })));
        setTotalPages(totalPages);
    };

    const toggleStatus = (id) => {
        setList(prevList =>
            prevList.map(c =>
                c.id === id
                    ? { ...c, status: c.status === "Đang hoạt động" ? "Bị khóa" : "Đang hoạt động" }
                    : c
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-green-50 p-4 rounded-lg shadow-md">
                <p className="text-center sm:text-left text-3xl font-bold flex-1">
                    Danh sách tài khoản theo ngày tạo
                </p>
            </div>

            {/* Form tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-md flex-wrap">

                {/* Lọc theo ngày tạo */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => { setPage(1); handleSearch(); }}
                        className="w-full sm:w-auto px-5 py-2 bg-blue-400 text-white rounded-lg hover:bg-green-400 transition"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-300">
                    <tr>
                        <th className="p-2 border-b">STT</th>
                        <th className="p-2 border-b">Mã khách hàng</th>
                        <th className="p-2 border-b">Tên khách hàng</th>
                        <th className="p-2 border-b">Email</th>
                        <th className="p-2 border-b">Số điện thoại</th>
                        <th className="p-2 border-b">Gói dịch vụ</th>
                        <th className="p-2 border-b">Tên tài khoản</th>
                        <th className="p-2 border-b">Ngày tạo</th>
                        <th className="p-2 border-b">Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="p-4 text-center text-gray-500">
                                Không có tài khoản nào...
                            </td>
                        </tr>
                    ) : (
                        list.map((customer, index) => (
                            <tr key={customer.id} className="border-b">
                                <td className="p-2">{(page - 1) * 5 + index + 1}</td>
                                <td className="p-2">{customer.codeCustomer}</td>
                                <td className="p-2">{customer.nameCustomer}</td>
                                <td className="p-2">{customer.email}</td>
                                <td className="p-2">{customer.phone}</td>
                                <td className="p-2">{customer.servicePackage}</td>
                                <td className="p-2">{customer.username}</td>
                                <td className="p-2">{formatDate(customer.createDate)}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => toggleStatus(customer.id)}
                                        className={`px-3 py-1 rounded text-white ${customer.status=== "Đang hoạt động" ? "bg-green-500 hover:bg-green-600":"bg-red-500 hover:bg-red-600" }`}
                                    >
                                        {customer.status === "Đang hoạt động" ? "Đang hoạt động" : "Mở khóa"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Trước
                </button>

                {(() => {
                    const visiblePages = 3; // số trang hiển thị
                    let startPage = Math.max(1, page - 1); // bắt đầu từ trang trước trang hiện tại 1 bước

                    // Nếu gần cuối, đảm bảo vẫn hiển thị đủ 3 trang
                    if (startPage + visiblePages - 1 > totalPages) {
                        startPage = Math.max(1, totalPages - visiblePages + 1);
                    }

                    return [...Array(visiblePages)].map((_, i) => {
                        const p = startPage + i;
                        if (p > totalPages) return null; // tránh hiển thị trang vượt max
                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 rounded ${
                                    page === p ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    });
                })()}

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

export default ListCustomerByDateComponent;
