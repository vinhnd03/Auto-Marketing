import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const services = [
    {
        id: 1,
        name: "Starter",
        price: 99000,
        color: "green",
        workspaces: 1,
        max_social_account: 1,
        duration: 1,
        icon: (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path
                    d="M32 4L20 28H44L32 4Z"
                    fill="#20C997"
                />
                <path
                    d="M20 28L44 28L32 60L20 28Z"
                    fill="#17A2B8"
                />
            </svg>
        ),
    },
    {
        id: 2,
        name: "Growth",
        price: 249000,
        color: "blue",
        workspaces: 3,
        max_social_account: 3,
        duration: 3,
        icon: (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="12" stroke="#339AF0" strokeWidth="4" />
                <line x1="32" y1="4" x2="32" y2="20" stroke="#74C0FC" strokeWidth="3" />
                <line x1="32" y1="44" x2="32" y2="60" stroke="#74C0FC" strokeWidth="3" />
                <line x1="4" y1="32" x2="20" y2="32" stroke="#74C0FC" strokeWidth="3" />
                <line x1="44" y1="32" x2="60" y2="32" stroke="#74C0FC" strokeWidth="3" />
            </svg>
        ),
    },
    {
        id: 3,
        name: "Professional",
        price: 399000,
        color: "purple",
        workspaces: 6,
        max_social_account: 6,
        duration: 6,
        icon: (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path
                    d="M32 12C40 4 56 8 56 20C56 32 32 56 32 56C32 56 8 32 8 20C8 8 24 4 32 12Z"
                    fill="#845EF7"
                    stroke="#7048E8"
                    strokeWidth="3"
                />
            </svg>
        ),
    },
];

const getGradient = (color) => {
    switch (color) {
        case "blue":
            return "from-blue-400 to-blue-600";
        case "green":
            return "from-green-400 to-green-600";
        case "purple":
            return "from-purple-400 to-purple-700";
        case "orange":
            return "from-orange-400 to-orange-600";
        default:
            return "from-gray-400 to-gray-500";
    }
};

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

    return (
        <section className="bg-gradient-to-b from-cyan-50 to-cyan-100 py-24" id="pricing">
            <div className="container mx-auto px-6 text-center max-w-6xl">
                <h1 className="text-4xl font-bold mb-6 text-purple-800">
                    Giảm bớt 80% thời gian quản lý nhàm chán
                </h1>
                <p className="mb-16 text-lg text-purple-700 max-w-3xl mx-auto">
                    Quên đi Excel và giấy bút thủ công. Trải nghiệm việc quản lý nhiều tài khoản social media một cách dễ dàng và tự động với PostLab.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {services.map((service) => {
                        const isSelected = selectedPlan === service.id;
                        return (
                            <div
                                key={service.id}
                                onClick={() => setSelectedPlan(service.id)}
                                className={`cursor-pointer p-8 rounded-3xl border transition duration-300 shadow-md flex flex-col items-center bg-white ${
                                    isSelected
                                        ? "border-purple-700 shadow-lg scale-105"
                                        : "border-gray-200 hover:border-purple-400 hover:shadow-lg"
                                }`}
                            >
                                {/* Icon */}
                                <div className="mb-6 select-none">{service.icon}</div>

                                {/* Name */}
                                <h2
                                    className={`text-2xl font-bold mb-3 ${
                                        isSelected ? "text-purple-700" : "text-gray-900"
                                    }`}
                                >
                                    {service.name}
                                </h2>

                                {/* Price */}
                                <p className="text-3xl font-extrabold text-purple-600 mb-4">
                                    {service.price.toLocaleString("vi-VN")} VND
                                </p>

                                {/* Extra info */}
                                <ul className="text-gray-700 mb-8 space-y-3 text-left w-full max-w-xs mx-auto">
                                    <li className="flex items-center gap-2">
                                        📂 <span className="font-medium">Số workspace:</span>{" "}
                                        <span>{service.workspaces}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        🧑‍🤝‍🧑 <span className="font-medium">Số tài khoản MXH:</span>{" "}
                                        <span>{service.max_social_account}</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        ⏳ <span className="font-medium">Thời gian:</span>{" "}
                                        <span>{service.duration} tháng</span>
                                    </li>
                                </ul>

                                {isSelected && (
                                    <div className="text-sm font-medium text-purple-700 mb-4">
                                        ✅ Gói đã chọn
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBuy(service);
                                    }}
                                    disabled={loadingId === service.id}
                                    className={`mt-auto w-full px-6 py-3 rounded-lg font-semibold transition ${
                                        isSelected
                                            ? "bg-purple-700 text-white hover:bg-purple-800"
                                            : "bg-white border border-purple-700 text-purple-700 hover:bg-purple-100"
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
