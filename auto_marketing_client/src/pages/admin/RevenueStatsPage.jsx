import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Package } from "lucide-react";
import {
    BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Legend
} from "recharts";
import FilterForm from "../../components/admin/FilterForm";
import StatCardNew from "../../components/admin/StatCard";
import {getRevenue, getRevenueStats} from "../../service/revenueService";

export default function RevenueStatsPage() {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        type: "month",
        chartType: "bar",
    });
    const [dash, setDash] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [statsData, setStatsData] = useState({
        month: 0,
        quarter: 0,
        week: 0,
        year: 0,
        lastMonth: 0,
        lastQuarter: 0,
        lastWeek: 0
    });
    const [loading, setLoading] = useState(false);

    // Hàm lấy dữ liệu từ API
    const fetchData = async (typeOverride = null, startOverride = null, endOverride = null, updateStats = true) => {
        const type = typeOverride || filters.type;
        let start, end;

        if (type === "day") {
            start = (startOverride || filters.startDate) + "T00:00:00";
            end = (endOverride || filters.endDate) + "T23:59:59";
        } else if (type === "month") {
            const [startYear, startMonth] = (startOverride || filters.startDate).split("-");
            const [endYear, endMonth] = (endOverride || filters.endDate).split("-");
            const startDay = `${startYear}-${startMonth}-01T00:00:00`;
            const endDateObj = new Date(endYear, endMonth, 0);
            const endDay = `${endYear}-${String(endMonth).padStart(2, "0")}-${String(endDateObj.getDate()).padStart(2, "0")}T23:59:59`;
            start = startDay;
            end = endDay;
        } else if (type === "quarter") {
            const year = filters.startYear || new Date().getFullYear();
            start = `${year}-01-01T00:00:00`;
            end = `${year}-12-31T23:59:59`;
        }

        if (!start || !end) return;

        setLoading(true);
        try {
            // gọi service thay vì fetch thủ công
            const data = await getRevenue(type, start, end);

            if (updateStats) {
                const totalMonth = data.reduce((sum, item) => sum + (type === 'month' ? item.totalRevenue : 0), 0);
                const totalQuarter = data.reduce((sum, item) => sum + (type === 'quarter' ? item.totalRevenue : 0), 0);
                const totalWeek = data.reduce((sum, item) => sum + (type === 'day' ? item.totalRevenue : 0), 0);

                setStatsData({
                    month: totalMonth,
                    quarter: totalQuarter,
                    week: totalWeek,
                    totalPackages: 0
                });
            }

            const mappedData = data.map(item => ({ name: item.period, value: item.totalRevenue }));
            setChartData(mappedData);
        } catch (err) {
            console.error(err);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };
    const handleApplyFilters = () => {
        fetchData(filters.type, filters.startDate, filters.endDate, false);
    };

    useEffect(() => {
        // Tính ngày đầu và cuối tháng hiện tại
        const now = new Date();
        const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        const endOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate()}`;

        // Set filter mặc định
        setFilters((prev) => ({
            ...prev,
            startDate: startOfMonth,
            endDate: endOfMonth,
            type: "day",
        }));

        // Fetch thống kê tổng quan
        (async () => {
            try {
                const d = await getRevenueStats();
                setDash(d);
            } catch (e) {
                console.error(e);
            }
        })();

        // Fetch chart theo tháng hiện tại
        fetchData("day", startOfMonth, endOfMonth, true);
    }, []);

    const toVND = (n) => (n ?? 0).toLocaleString("vi-VN") + "đ";
    const pct = (x) => `${(x ?? 0).toFixed(1)}%`;

    const stats = dash
        ? [
            {
                name: "Doanh thu tháng",
                value: toVND(dash.month.current),
                description: "Tổng doanh thu tháng này",
                icon: DollarSign,
                color: "blue",
                change: pct(dash.month.changePercent),
                changeType: dash.month.changeType,
                compareLabel: "so với tháng trước",
            },
            {
                name: "Doanh thu quý",
                value: toVND(dash.quarter.current),
                description: "Tổng doanh thu quý này",
                icon: TrendingUp,
                color: "green",
                change: pct(dash.quarter.changePercent),


                changeType: dash.quarter.changeType,
                compareLabel: "so với quý trước",
            },
            {
                name: "Doanh thu tuần",
                value: toVND(dash.week.current),
                description: "Tổng doanh thu tuần này",
                icon: TrendingDown,
                color: "purple",
                change: pct(dash.week.changePercent),
                changeType: dash.week.changeType,
                compareLabel: "so với tuần trước",
            },
            {
                name: "Tổng doanh thu năm",
                value: toVND(dash.year),
                description: "Tổng doanh thu năm nay",
                icon: Package,
                color: "orange",
                change: "",
                changeType: "increase",
                compareLabel: " ",
            },
        ]
        : [];

    return (
        <div className="space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600  bg-clip-text text-transparent">
                        Thống kê Doanh Thu
                    </h1>
                    <p className="text-gray-600">Tổng quan hệ thống AutoMarketing</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((s) => (
                    <StatCardNew key={s.name} stat={s} />
                ))}
            </div>

            {/* Filter Form */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                <FilterForm filters={filters} setFilters={setFilters} onApply={handleApplyFilters} />
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                {!filters.startDate || !filters.endDate ? (
                    <p className="text-center text-gray-500 text-lg font-medium py-12">📅 Mời chọn ngày để hiển thị biểu đồ</p>
                ) : loading ? (
                    <p className="text-center text-gray-500 text-lg font-medium py-12">⏳ Đang tải dữ liệu...</p>
                ) : chartData.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg font-medium py-12">Không có dữ liệu trong khoảng thời gian này</p>
                ) : (
                    <div style={{ width: "100%", height: 350 }}>
                        <ResponsiveContainer>
                            {filters.chartType === "bar" ? (
                                <BarChart
                                    data={chartData}
                                    barGap={8}
                                    margin={{ top: 20, left: 30, right: 30, bottom: 10 }}
                                >
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }}
                                           tickFormatter={(value) => toVND(value)} />
                                    <Tooltip cursor={{ fill: "rgba(59,130,246,0.08)" }}
                                             formatter={(value) => [toVND(value), "Doanh thu"]}/>
                                    <Legend />

                                    <Bar
                                        dataKey="value"
                                        name="Doanh thu"
                                        fill="url(#colorRevenue)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            ) : (
                                <LineChart data={chartData} margin={{ top: 20, left: 30, right: 30, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ stroke: "rgba(59,130,246,0.3)", strokeWidth: 2 }}
                                             formatter={(value) => [toVND(value), "Doanh thu"]}/>
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name="Doanh thu"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>

                    </div>
                )}
            </div>
        </div>
    );
}