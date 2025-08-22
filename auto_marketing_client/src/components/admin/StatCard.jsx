// src/components/StatCardNew.jsx
import React from "react";
import { ArrowUp, ArrowDown, DollarSign, TrendingUp } from "lucide-react";

export default function StatCardNew({ stat }) {
    let Icon = stat.icon;

    // Nếu là Doanh thu thì đổi icon cho phù hợp
    if (stat.name?.toLowerCase().includes("doanh thu")) {
        Icon = DollarSign; // hoặc TrendingUp
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {stat.description ||
                            (stat.name?.toLowerCase().includes("tổng doanh thu")
                                ? "Tính đến thời điểm hiện tại"
                                : "")}
                    </p>
                </div>
                <div
                    className={`w-12 h-12 bg-gradient-to-r ${
                        stat.color === "blue"
                            ? "from-blue-500 to-blue-600"
                            : stat.color === "green"
                                ? "from-green-500 to-green-600"
                                : stat.color === "purple"
                                    ? "from-purple-500 to-purple-600"
                                    : "from-orange-500 to-orange-600"
                    } rounded-lg flex items-center justify-center`}
                >
                    <Icon className="text-white" size={24} />
                </div>
            </div>

            {/* Nếu có change thì hiển thị mũi tên so sánh */}
            {stat.change !== "" ? (
                <div className="flex items-center mt-4">
                    {stat.changeType === "increase" ? (
                        <ArrowUp className="text-green-500 mr-1" size={16} />
                    ) : stat.changeType === "decrease" ? (
                        <ArrowDown className="text-red-500 mr-1" size={16} />
                    ) : (
                        <span className="w-4 mr-1" />
                    )}
                    <span
                        className={`text-sm font-medium ${
                            stat.changeType === "increase"
                                ? "text-green-600"
                                : stat.changeType === "decrease"
                                    ? "text-red-600"
                                    : "text-gray-600"
                        }`}
                    >
                        {stat.change || "0%"}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                        {stat.compareLabel || "so với kỳ trước"}
                    </span>
                </div>
            ) : stat.name?.toLowerCase().includes("tổng doanh thu") ? (
                // Nếu không có change nhưng là Tổng doanh thu => hiển thị thông báo
                <div className="mt-4 text-sm text-gray-500">
                    Dữ liệu được cập nhật mới nhất
                </div>
            ) : null}
        </div>
    );
}
