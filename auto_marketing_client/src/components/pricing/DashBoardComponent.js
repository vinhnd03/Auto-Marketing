import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const services = [
    { id: 1, name: "Basic Plan", price: 100000, color: "blue", workspaces: 3, duration: 1 },
    { id: 2, name: "Pro Plan", price: 200000, color: "purple", workspaces: 10, duration: 3 },
    { id: 3, name: "Premium Plan", price: 300000, color: "orange", workspaces: 30, duration: 12 },
];

const ListComponent = () => {
    const [loadingId, setLoadingId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleBuy = async (service) => {
        setLoadingId(service.id);
        try {
            const response = await axios.post("http://localhost:8080/api/payment", {
                serviceId: service.id,
                serviceName: service.name,
                amount: service.price,
            });

            const { paymentUrl } = response.data;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            } else {
                toast.error("Không lấy được URL thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu thanh toán:", error);
            toast.error("Lỗi khi xử lý thanh toán!");
        } finally {
            setLoadingId(null);
        }
    };

    const getGradient = (color) => {
        switch (color) {
            case "blue":
                return "from-blue-500 to-blue-600";
            case "green":
                return "from-green-500 to-green-600";
            case "purple":
                return "from-purple-500 to-purple-600";
            case "orange":
                return "from-orange-500 to-orange-600";
            default:
                return "from-gray-400 to-gray-500";
        }
    };

    return (
        <section className="bg-[#f7faff] py-24" id="pricing">
            <div className="container mx-auto px-6 text-center max-w-5xl">
                <h1 className="text-4xl font-bold mb-14 text-gray-900">
                    Dịch vụ của chúng tôi
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => {
                        const isSelected = selectedPlan === service.id;
                        return (
                            <div
                                key={service.id}
                                onClick={() => setSelectedPlan(service.id)}
                                className={`cursor-pointer p-8 rounded-3xl border transition duration-300 shadow-md flex flex-col items-center ${
                                    isSelected
                                        ? "bg-blue-100 border-blue-600 shadow-lg scale-105"
                                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow"
                                }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-20 h-20 bg-gradient-to-r ${getGradient(
                                        service.color
                                    )} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md mb-6`}
                                >
                                    {service.name.charAt(0)}
                                </div>

                                {/* Name */}
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {service.name}
                                </h2>

                                {/* Price */}
                                <p className="text-3xl font-extrabold text-blue-600 mb-6">
                                    {service.price.toLocaleString()} VND
                                </p>

                                {/* Extra info */}
                                <ul className="text-gray-700 mb-6 space-y-3 text-left w-full max-w-xs mx-auto">
                                    <li className="flex items-center gap-2">
                                        📂 Số workspace:{" "}
                                        <span className="font-medium text-gray-800">
                      {service.workspaces}
                    </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        ⏳ Thời gian:{" "}
                                        <span className="font-medium text-gray-800">
                      {service.duration} tháng
                    </span>
                                    </li>
                                </ul>

                                {isSelected && (
                                    <div className="text-sm font-medium text-blue-700 mt-2 mb-4">
                                        ✅ Gói đã chọn
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // tránh click cha chọn gói
                                        handleBuy(service);
                                    }}
                                    disabled={loadingId === service.id}
                                    className={`mt-auto w-full px-6 py-3 rounded-lg font-semibold transition ${
                                        isSelected
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
                                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                    {loadingId === service.id
                                        ? "Đang xử lý..."
                                        : isSelected
                                            ? "Tiếp tục với gói này"
                                            : "Chọn gói"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ListComponent;
