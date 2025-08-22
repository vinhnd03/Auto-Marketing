import React from "react";

const PaymentResultModal = ({ result, onClose }) => {
    if (!result) return null;

    const safeDecode = (v) => {
        try {
            return v ? decodeURIComponent(v) : "";
        } catch {
            return v || "";
        }
    };

    const service = safeDecode(result.service);
    const message = safeDecode(result.message);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />
            {/* modal */}
            <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    {result.success ? (
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-3xl text-green-600">✅</span>
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-3xl text-red-500">❌</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                {result.success ? (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Cảm ơn bạn đã sử dụng dịch vụ 💖
                        </p>
                        <div className="text-sm text-gray-700 space-y-1 text-left">
                            <div className="flex justify-between">
                                <b>Dịch vụ:</b> <span>{service}</span>
                            </div>
                            <div className="flex justify-between">
                                <b>Mã giao dịch:</b> <span>{result.txnRef}</span>
                            </div>
                            {result.workspaces && (
                                <div className="flex justify-between">
                                    <b>Số workspace:</b> <span>{result.workspaces}</span>
                                </div>
                            )}
                            {result.duration && (
                                <div className="flex justify-between">
                                    <b>Thời gian:</b> <span>{result.duration} tháng</span>
                                </div>
                            )}
                            {result.amount && (
                                <div className="flex justify-between">
                                    <b>Số tiền:</b>{" "}
                                    <span>{Number(result.amount).toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <h2 className="text-lg font-semibold text-red-500 mb-2">
                        {message || "Giao dịch không thành công"}
                    </h2>
                )}

                {/* Button */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default PaymentResultModal;
