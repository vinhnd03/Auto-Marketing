import {useEffect, useState} from "react";
import {findById, search} from "../../service/admin/usersService";
import {getAllPackages} from "../../service/admin/statisticsPackagesService";
import {Eye, Lock, Unlock} from "lucide-react";
import UpdateUserModal from "./UpdateUser";

function ListUsers() {
    const [list, setList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showLocked, setShowLocked] = useState(null);
    const [packages, setPackages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [modalUser, setModalUser] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            const pkgs = await getAllPackages();
            setPackages(pkgs);
            //  console.log(packages)
        };
        fetchPackages().then();
        handleSearch().then();
    }, [page]);

    const handleViewDetail = async (id) => {
        let u = await findById(id);
        setSelectedUser(u);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedUser(null);
    };

    const openModal = (user) => setModalUser(user);
    const closeModal = () => setModalUser(null);

    const handleUpdateSuccess = (id, newStatus) => {
        setList(prev => prev.map(u => u.id === id ? {...u, status: newStatus} : u));
    };


    const handleSearch = async () => {
        const {data, totalPages} = await search(
            keyword,
            sortKey,
            page,
            5,
            null,
            null,
            showLocked // truyền thẳng cho backend
        );

        setList(data);
        setTotalPages(totalPages);

        if (page > totalPages) {
            setPage(1);
        }
    };

    const handleClear = async () => {
        // reset filter state
        setKeyword("");
        setSortKey("");
        setShowLocked(null);
        setPage(1);

        const result = await search("", "", 1, 5, null, null, null);
        setList(result.data);
        setTotalPages(result.totalPages);
    };




    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit", year: "numeric"});
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-blue-50 p-4 rounded-lg shadow-md">
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
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Bị khóa</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setPage(1);
                            handleSearch().then();
                        }}
                        className="px-5 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-300"
                    >
                        Tìm kiếm
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-300"
                    >
                        Xóa bộ lọc
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
                        <th className="p-2 border-b">Hành động</th>
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
                                <td className="p-2">{index + 1}</td>
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
                                            <Eye size={16}/>
                                        </button>
                                        <button
                                            onClick={() => openModal(customer)}
                                            className={`focus:outline-none transition-colors duration-200 ${
                                                customer.status ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"
                                            }`}
                                        >
                                            {customer.status ? <Unlock size={16}/> : <Lock size={16}/>}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                {/* Modal */}
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
                        <div className="bg-white rounded-lg p-8 w-[600px] shadow-lg relative">
                            <button
                                onClick={closeDetail}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            >
                                ✕
                            </button>
                            <h2 className=" font-bold mb-6 text-4C51BF">Thông tin chi tiết khách hàng</h2>

                            <hr></hr>
                            <div className="grid grid-cols-2 gap-y-3">
                                <span className="font-semibold">ID:</span>
                                <span>{selectedUser.id}</span>

                                <span className="font-semibold">Tên:</span>
                                <span>{selectedUser.name}</span>

                                <span className="font-semibold">Email:</span>
                                <span>{selectedUser.email}</span>

                                <span className="font-semibold">Ngày tạo:</span>
                                <span>{formatDate(selectedUser.createdAt)}</span>

                                <span className="font-semibold">Trạng thái tài khoản:</span>
                                <span
                                    className={selectedUser.status ? "text-green-600" : "text-red-600"}>{selectedUser.status ? "Đang hoạt động" : "Đang bị khóa"}</span>
                            </div>

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

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Trước
                </button>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
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

export default ListUsers;