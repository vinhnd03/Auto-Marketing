import React, {useEffect, useState} from "react";
import {findById, search} from "../../service/admin/usersService";
import { Eye,Lock, Unlock } from "lucide-react";
import UpdateUserModal from "./UpdateUser";

function ListUserByDate() {
    const [list, setList] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [errors, setErrors] = useState({startDate: "", endDate: ""});
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [modalUser, setModalUser] = useState(null);


    useEffect(() => {
        handleSearch().then();
    }, [page]);
    const clearFilter = async () => {
        // reset state
        setStartDate("");
        setEndDate("");
        setErrors({ startDate: "", endDate: "" });
        setPage(1);

        // gọi lại API nhưng bỏ hết params lọc
        const result = await search("", "", 1, 5, null, null, null);
        setList(result.data);

        setTotalPages(result.totalPages);
    };


    const handleSearch = async () => {
        const {data, totalPages} = await search(null, null, page, null, startDate, endDate);
        setList(data.map(c => ({
            ...c,
            status: c.status
        })));
        setTotalPages(totalPages);
    };




    const handleValid = () => {
        let valid = true;
        let newErrors = {startDate: "", endDate: ""};

        if (!startDate) {
            newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
            valid = false;
        }
        if (!endDate) {
            newErrors.endDate = "Vui lòng chọn ngày kết thúc";
            valid = false;
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const today = new Date();
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (start > end) {
                newErrors.startDate = "Ngày bắt đầu không được sau ngày kết thúc";
                valid = false;
            }
            if (end > today) {
                newErrors.endDate = "Ngày kết thúc không được sau hôm nay";
                valid = false;
            }
        }
        setErrors(newErrors);
        return valid;
    };

    const handleViewDetail = async (id) => {
        let us = await findById(id);
        setSelectedUser(us);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedUser(null);
    };

    const openModal = (user) => setModalUser(user);
    const closeModal = () => setModalUser(null);

    const handleUpdateSuccess = (id, newStatus) => {
        setList(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric"});
    };

    return (
        <div className="space-y-6">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600  bg-clip-text text-transparent">
                        Danh sách tài khoản theo ngày tạo
                    </h1>
                    <p className="text-gray-600">Tổng quan hệ thống AutoMarketing</p>
                </div>
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
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}

                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => {
                            if (handleValid()) {
                                setPage(1);
                                handleSearch().then();
                            }
                        }}
                        className="w-full sm:w-auto px-5 py-2 bg-blue-400 text-white rounded-lg hover:bg-green-400 transition">
                        Tìm kiếm
                    </button>
                    <button
                        onClick={clearFilter}
                        className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-300"
                    >
                        Xóa bộ lọc
                    </button>
                </div>

            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-300">
                    <tr>
                        <th className="p-2 border-b">STT</th>
                        <th className="p-2 border-b">Tên khách hàng</th>
                        <th className="p-2 border-b">Email</th>
                        <th className="p-2 border-b">Ngày tạo</th>
                        <th className="p-2 border-b">Gói đã mua</th>
                        <th className="p-2 border-b">Trạng thái</th>
                        <th className="p-2 border-b">Hành động</th>
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
                                <td className="p-2">{customer.name}</td>
                                <td className="p-2">{customer.email}</td>
                                <td className="p-2">{formatDate(customer.createdAt)}</td>
                                <td className="p-2">
                                    {customer.subscriptions.length > 0
                                        ? customer.subscriptions.map(sub => sub.plan?.name).join(", ")
                                        : "Chưa mua gói nào"}
                                </td>

                                <td className="p-2 "> {customer.status ? "Đang hoạt động" : "Đang bị khóa"}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="inline-flex items-center space-x-2 rounded-md px-3 py-1">
                                        <button
                                            onClick={() => handleViewDetail(customer.id)}
                                            className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-200">
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => openModal(customer)}
                                            className={`focus:outline-none transition-colors duration-200 ${
                                                customer.status ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"
                                            }`}
                                        >
                                            {customer.status ? <Unlock size={16} /> : <Lock size={16} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                {modalUser && (
                    <UpdateUserModal
                        user={modalUser}
                        isShowModal={!!modalUser}
                        isCloseModal={closeModal}
                        onUpdateSuccess={handleUpdateSuccess}
                    />
                )}

                {/* Card hiển thị chi tiết */}
                {showDetail && selectedUser && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-8 w-[600px] shadow-lg relative"> {/* tăng width */}
                            <button
                                onClick={closeDetail}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold mb-6">Chi tiết khách hàng</h2>

                            <div className="grid grid-cols-2 gap-y-3">
                                <span className="font-semibold">ID:</span>
                                <span>{selectedUser.id}</span>

                                <span className="font-semibold">Tên:</span>
                                <span>{selectedUser.name}</span>

                                <span className="font-semibold">Email:</span>
                                <span>{selectedUser.email}</span>

                                <span className="font-semibold">Ngày tạo:</span>
                                <span>{selectedUser.createdAt}</span>

                                <span className="font-semibold">Trạng thái tài khoản:</span>
                                <span className={selectedUser.status ? "text-green-600" : "text-red-600"}>{selectedUser.status ? "Đang hoạt động" : "Đang bị khóa"}</span>
                            </div>

                            {/* Hiển thị gói dịch vụ */}
                            <div className="mt-6">
                                <span className="font-semibold">Gói dịch vụ đã mua:</span>
                                {selectedUser.subscriptions?.length > 0 ? (
                                    <div className="space-y-2 mt-2">
                                        {selectedUser.subscriptions.map((sub, idx) => {
                                            const today = new Date();
                                            const endDate = sub.endDate ? new Date(sub.endDate) : null;
                                            const isExpired = endDate && endDate < today;

                                            return (
                                                <div key={idx} className="border p-3 rounded grid grid-cols-2">
                                                    <span>Gói:</span>
                                                    <span>{sub.plan?.name} ({sub.plan?.durationDate} ngày) </span>

                                                    <span>Ngày mua:</span>
                                                    <span>{formatDate(sub.startDate)}</span>

                                                    <span>Ngày hết hạn:</span>
                                                    <span className={isExpired ? "text-red-500 font-semibold" : ""}>{isExpired ? "Đã hết hạn" : formatDate(sub.endDate)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p>Chưa mua gói nào</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
                    const visiblePages = 5; // số trang hiển thị
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

export default ListUserByDate;
