import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResultComponent = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [result, setResult] = useState({
        success: false,
        message: "",
        amount: 0,
        service: "",
        txnRef: "",
        workspaces: 0,
        duration: 0
    });

    useEffect(() => {
        const success = searchParams.get("success") === "true";
        const message = searchParams.get("message") || "";
        const amount = Number(searchParams.get("amount")) || 0;
        const service = searchParams.get("service") || "";
        const txnRef = searchParams.get("txnRef") || "";
        const workspaces = Number(searchParams.get("workspaces")) || 0;
        const duration = Number(searchParams.get("duration")) || 0;

        const shownTxnRef = sessionStorage.getItem("shownTxnRef");
        if (shownTxnRef === txnRef) return;

        setResult({ success, message, amount, service, txnRef, workspaces, duration });
        setShowModal(true);

        sessionStorage.setItem("shownTxnRef", txnRef);
    }, [searchParams]);

    const handleClose = () => {
        navigate("/");
        setShowModal(false);

    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                <div className="text-4xl mb-4">
                    {result.success ? "✅" : "❌"}
                </div>

                {result.success ? (
                    <>
                        <h2 className="text-2xl font-bold text-violet-700 mb-2">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-black mb-4">
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi 💖
                        </p>
                        <div
                            className="flex flex-col text-sm text-violet-700 mt-2 justify-between"
                            style={{ minHeight: "150px" }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                maxWidth: '400px', // giới hạn chiều rộng để không cách quá xa
                                padding: '0 50px', // thêm padding hai bên cho thoáng
                                alignItems: 'center'
                            }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Dịch vụ:</p>
                                <p style={{ margin: 0 }}>{decodeURIComponent(result.service)}</p>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                maxWidth: '400px',
                                padding: '0 50px',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Mã giao dịch:</p>
                                <p style={{ margin: 0 }}>{result.txnRef}</p>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                maxWidth: '400px',
                                padding: '0 50px',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Số workspace:</p>
                                <p style={{ margin: 0 }}>{result.workspaces}</p>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                maxWidth: '400px',
                                padding: '0 50px',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Thời gian:</p>
                                <p style={{ margin: 0 }}>{result.duration} tháng</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2">
                            <p className="text-violet-700">{decodeURIComponent(result.message)}</p>
                        </h2>
                    </>
                )}

                <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2  bg-gradient-to-r from-blue-600 to-purple-400 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default PaymentResultComponent;
