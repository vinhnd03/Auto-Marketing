import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import {Shield} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

const ListComponent = () => {
    const [plans, setPlans] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const {user} = useAuth(); // lấy thông tin user hiện tại
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/v1/plans", {
                    withCredentials: true,
                });
                setPlans(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách gói:", error);
                toast.error("Không tải được danh sách gói.");
            }
        };
        fetchPlans();
    }, []);

    const handleBuy = async (plan) => {
        if (!plan) return;

        // Kiểm tra đăng nhập
        if (!user?.id) {
            toast.error("Bạn cần đăng nhập để có thể mua gói dịch vụ!");
            navigate("/login"); // sử dụng navigate để chuyển trang
            return;
        }

        setLoadingId(plan.id);

        try {
            if (plan.id === 1) {
                // Gói FREE
                const response = await axios.post(
                    `http://localhost:8080/api/v1/workspaces/subscriptions/trial?userId=${user.id}`,
                    {},
                    {withCredentials: true}
                );
                toast.success(response.data || "Đã kích hoạt gói FREE");
            } else {
                // Các gói khác: gọi VNPAY
                const response = await axios.post(
                    "http://localhost:8080/api/payment",
                    {
                        serviceName: plan.name,
                        amount: plan.price,
                        userId: user.id,
                    },
                    {withCredentials: true}
                );

                const {paymentUrl} = response.data;
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else {
                    toast.error("Không lấy được URL thanh toán.");
                }
            }
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            toast.error(error.response?.data || "Lỗi khi xử lý thanh toán!");
        } finally {
            setLoadingId(null);
        }
    };

    const getCardStyles = (plan) => {
        if (plan?.planLevel === 2) {
            return "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl scale-105 relative";
        }
        return "border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300";
    };

    const getButtonStyles = (plan) => {
        if (plan?.planLevel === 2) {
            return "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg";
        }
        return "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            {/* Header */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Shield className="w-4 h-4"/>
                        Tiết kiệm đến 80% thời gian quản lý
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Chọn gói phù hợp
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Tự động hóa marketing, tăng hiệu quả bán hàng và phát triển thương hiệu
                        với các gói dịch vụ được thiết kế riêng cho doanh nghiệp của bạn.
                    </p>
                </div>
            </section>

            {/* Plans */}
            <section className="pb-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.id} className={`relative rounded-2xl p-8 ${getCardStyles(plan)}`}>
                                {plan?.planLevel === 2 && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                                            🔥 Phổ biến nhất
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan?.name}</h3>

                                    {plan?.price > 0 && (
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {plan.price.toLocaleString("vi-VN")}
                                            </span>
                                            <div className="text-left">
                                                <div className="text-sm text-gray-600">VNĐ</div>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <span>💰</span>
                                        Tiết kiệm{" "}
                                        {plan?.planLevel === 0
                                            ? 100
                                            : Math.round((1 - (plan?.price ?? 0) / ((plan?.price ?? 0) * 1.5)) * 100)}
                                        %
                                    </div>

                                    <p className="text-gray-500 mt-2">{plan?.description}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="text-sm text-gray-600 text-center">
                                        <span className="font-semibold">Thời hạn:</span> {plan?.durationDate} ngày
                                    </div>
                                    <div className="text-sm text-gray-600 text-center">
                                        <span className="font-semibold">Workspace tối đa:</span> {plan?.maxWorkspace}
                                    </div>
                                    <div className="text-sm text-gray-600 text-center">
                                        <span className="font-semibold">MXH tối đa:</span> {plan?.maxSocialAccount}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBuy(plan)}
                                    disabled={loadingId === plan?.id}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${getButtonStyles(plan)} disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                    {loadingId === plan?.id ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </div>
                                    ) : (
                                        `Chọn gói ${plan?.name}`
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ListComponent;
