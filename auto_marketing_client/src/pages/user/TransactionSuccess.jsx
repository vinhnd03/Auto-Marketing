import {useEffect, useState} from "react";
import {IoChevronBack, IoChevronForward} from "react-icons/io5";
import {getAllTransactionSuccess} from "../../service/transaction/transaction_service";

export default function TransactionSuccess() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0); // trang hiện tại
    const [size] = useState(5); // số giao dịch mỗi trang
    const [totalPages, setTotalPages] = useState(0);


    const [filterPlan, setFilterPlan] = useState("");

    useEffect(() => {
        setPage(0);
    }, [filterPlan]);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                setLoading(true);
                const data = await getAllTransactionSuccess(page, size, filterPlan);
                console.log(data)
                setTransactions(data.transactions);
                setTotalPages(data.totalPages);

            } catch (err) {
                console.error("Lỗi khi tải lịch sử giao dịch:", err);
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [page, filterPlan]);

    useEffect(() => {
        // Khi đổi trang thì cuộn lên đầu
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [page]);

    if (loading) return <p className="p-6">Đang tải...</p>;

    return (
        <div className="bg-gray-50 py-4 sm:py-8">
            <div className="max-w-full sm:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                        Lịch sử thanh toán
                    </h1>

                    <div className="flex items-center gap-2">
                        <label htmlFor="plan" className="text-sm text-gray-600">Lọc theo gói:</label>
                        <select
                            id="plan"
                            value={filterPlan}
                            onChange={(e) => setFilterPlan(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả gói</option>
                            <option value="Basic">Basic</option>
                            <option value="Standard">Standard</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
                    <table
                        className="min-w-full text-sm sm:text-base border-collapse border-separate border-spacing-y-2">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-3 sm:px-4 py-2 text-left font-semibold">💳 Mã Thanh Toán</th>
                            <th className="px-3 sm:px-4 py-2 text-left font-semibold">📦 Gói Thanh Toán</th>
                            <th className="px-3 sm:px-4 py-2 text-left font-semibold">📅 Ngày Thanh Toán</th>
                            <th className="px-3 sm:px-4 py-2 text-left font-semibold">💰 Số tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions?.length > 0 ? (
                            transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="border-t hover:bg-gray-50 transition-colors duration-200"
                                    title={`Mã GD: ${tx.transactionCode}\nGói: ${tx.plan.name}\nNgày: ${new Date(tx.createdAt).toLocaleDateString("vi-VN")}\nSố tiền: ${tx.amount.toLocaleString()} VND`}
                                >
                                    <td className="px-3 sm:px-4 py-2">{tx.transactionCode}</td>
                                    <td className="px-3 sm:px-4 py-2">{tx.plan.name}</td>
                                    <td className="px-3 sm:px-4 py-2">
                                        {new Date(tx.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="px-3 sm:px-4 py-2 font-medium text-gray-900">
                                        {tx.amount.toLocaleString()} VND
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-3 py-6 text-center text-gray-500">
                                    Không có thanh toán nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="sm:hidden">
                    {transactions?.length > 0 ? (
                        transactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="bg-white shadow rounded-lg p-4 mb-3 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <p><strong>💳 Mã Thanh Toán:</strong> {tx.transactionCode}</p>
                                <p><strong>📦 Gói Thanh Toán:</strong> {tx.plan.name}</p>
                                <p><strong>📅 Ngày Thanh
                                    Toán:</strong> {new Date(tx.createdAt).toLocaleDateString("vi-VN")}</p>
                                <p><strong>💰 Số tiền:</strong> {tx.amount.toLocaleString()} VND</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-6">Không có thanh toán nào</p>
                    )}
                </div>


                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 gap-3">
                        {/* Nút Prev */}
                        {page > 0 && (
                            <button
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                            >
                                <IoChevronBack size={20}/>
                            </button>
                        )}
                        {/* Thông tin trang */}
                        <span className="px-3 py-2 font-medium text-gray-700">
      Trang <span className="font-bold">{page + 1}</span> / {totalPages}
    </span>

                        {/* Nút Next */}
                        {page + 1 < totalPages && (
                            <button
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                            >
                                <IoChevronForward size={20}/>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
