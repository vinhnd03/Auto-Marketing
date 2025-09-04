import React, { useEffect, useState } from "react";
import { Package, Star, ThumbsDown, TrendingUp } from "lucide-react";
import {
    BarChart, Bar,
    LineChart, Line,
    CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Cell, Legend
} from "recharts";
import StatCardNew from "../../components/admin/StatCard";
import FilterForm from "../../components/admin/FilterForm";
import { getPackageSalesChart, getPackageStats } from "../../service/packageService";

const pad = (n) => String(n).padStart(2, "0");
const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F43F5E", "#A855F7", "#F97316"];

const buildIntegerTicks = (max) => {
    const steps = 4;
    const top = Math.max(1, Math.ceil(max * 1.1));
    const step = Math.max(1, Math.ceil(top / steps));
    const ticks = [];
    for (let i = 0; i <= steps; i++) ticks.push(i * step);
    if (ticks[ticks.length - 1] < top) ticks.push(Math.ceil(top));
    return Array.from(new Set(ticks)).sort((a, b) => a - b);
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm border border-gray-200">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-gray-600">Số lượng: {payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function PackageStatsPage() {
    const now = new Date();
    const startDefault = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01T00:00:00`;
    const endDefault = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}T23:59:59`;

    const [filters, setFilters] = useState({
        type: "day",
        startDate: startDefault,
        endDate: endDefault,
        chartType: "bar",
    });

    const [chartData, setChartData] = useState([]);
    const [yTicks, setYTicks] = useState([0, 1]);
    const [stats, setStats] = useState([]);

    const fetchStatsForCards = async () => {
        try {
            const now = new Date();
            const start = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01T00:00:00`;
            const end = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}T23:59:59`;
            const resData = await getPackageStats(start, end);

            setStats([
                {
                    name: "Tổng gói bán ra",
                    value: resData.totalSold ?? 0,
                    description: "Tổng số gói đã được mua",
                    icon: Package,
                    color: "blue",
                    change: `${(resData.growthRate ?? 0).toFixed(2)}%`,
                    changeType: (resData.growthRate ?? 0) >= 0 ? "increase" : "decrease",
                },
                {
                    name: "Gói phổ biến nhất",
                    value: resData.mostPopularPackage ?? "Không có",
                    description: "Được mua nhiều nhất",
                    icon: Star,
                    color: "green",
                },
                {
                    name: "Gói ít mua nhất",
                    value: resData.leastPopularPackage ?? "Không có",
                    description: "Bán ít nhất",
                    icon: ThumbsDown,
                    color: "purple",
                },
                {
                    name: "Tăng trưởng",
                    value: `${(resData.growthRate ?? 0).toFixed(2)}%`,
                    description: "So với tháng trước",
                    icon: TrendingUp,
                    color: "orange",
                    change: `${(resData.growthRate ?? 0).toFixed(2)}%`,
                    changeType: (resData.growthRate ?? 0) >= 0 ? "increase" : "decrease",
                },
            ]);
        } catch (err) {
            console.error("Lỗi fetchStatsForCards:", err);
        }
    };

    useEffect(() => {
        const now = new Date();
        const start = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01T00:00:00`;
        const end = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}T23:59:59`;

        fetchStatsForCards();
        fetchChart(start, end); // 👈 fetch mặc định theo ngày
    }, []);

    const fetchChart = async (startISO, endISO) => {
        try {
            const chartRes = await getPackageSalesChart(startISO, endISO);
            let arr = Array.isArray(chartRes)
                ? chartRes.map(i => ({ name: i.packageName, sales: parseInt(i.sales ?? 0, 10) }))
                : [];
            arr.sort((a, b) => b.sales - a.sales);

            setChartData(arr);
            const max = arr.length ? Math.max(...arr.map(d => d.sales)) : 1;
            setYTicks(buildIntegerTicks(max));
        } catch (err) {
            console.error("Lỗi fetchChart:", err);
        }
    };

    const handleApplyFilters = (payload) => {
        if (!payload?.startDate || !payload?.endDate) {
            alert("Khoảng thời gian không hợp lệ");
            return;
        }
        setFilters(prev => ({
            ...prev,
            type: payload.type ?? prev.type,
            chartType: payload.chartType ?? prev.chartType
        }));
        fetchChart(payload.startDate, payload.endDate);
    };

    const maxVal = chartData.length ? Math.max(...chartData.map(d => d.sales)) : 0;
    const domainMax = Math.max(1, Math.ceil(maxVal * 1.05));
    const totalSales = chartData.reduce((s, d) => s + (d.sales || 0), 0);

    return (
        <div className="space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* Tiêu đề (đồng bộ với Revenue) */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600  bg-clip-text text-transparent">
                        Thống kê Gói Dịch Vụ
                    </h1>
                    <p className="text-gray-600">Tổng quan hệ thống AutoMarketing</p>
                </div>

            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(s => <StatCardNew key={s.name} stat={s} />)}
            </div>

            {/* Filter box */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                <FilterForm
                    filters={{
                        ...filters,
                        startDate: filters.startDate?.split("T")[0],
                        endDate: filters.endDate?.split("T")[0],
                    }}
                    setFilters={setFilters}
                    onApply={handleApplyFilters}
                />
            </div>

            {/* Chart + List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 lg:col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-4">Biểu đồ gói bán ra</h3>
                    <div className="h-[350px]">
                        {chartData.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                {filters.chartType === "bar" ? (
                                    <BarChart
                                        data={chartData}
                                        barGap={8}
                                        margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
                                    >
                                        <defs>
                                            {chartData.map((_, i) => {
                                                const baseColor = COLORS[i % COLORS.length];
                                                return (
                                                    <linearGradient
                                                        key={i}
                                                        id={`barGradient-${i}`}
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop offset="0%" stopColor={baseColor} stopOpacity={0.9} />
                                                        <stop offset="100%" stopColor={baseColor} stopOpacity={0.5} />
                                                    </linearGradient>
                                                );
                                            })}
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} domain={[0, domainMax]} ticks={yTicks} tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
                                        <Legend />

                                        <Bar
                                            dataKey="sales"
                                            name="Số lượng bán"
                                            radius={[8, 8, 0, 0]}
                                            barSize={40}
                                        >
                                            {chartData.map((entry, i) => (
                                                <Cell key={`cell-${i}`} fill={`url(#barGradient-${i})`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                ) : (
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                        <YAxis allowDecimals={false} domain={[0, domainMax]} ticks={yTicks} tick={{ fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(59,130,246,0.3)", strokeWidth: 2 }} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            name="Số lượng bán"
                                            stroke="#3B82F6"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                Không có dữ liệu
                            </div>
                        )}
                    </div>
                </div>

                {/* Package List */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3">Danh sách gói</h3>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {chartData.map((pkg, i) => {
                            const color = COLORS[i % COLORS.length];
                            const pct = totalSales ? Math.round((pkg.sales / totalSales) * 100) : 0;
                            return (
                                <div
                                    key={pkg.name}
                                    className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:shadow transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="font-medium text-gray-800">{pkg.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">
                      {pkg.sales.toLocaleString()} gói
                    </span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{ width: `${pct}%`, backgroundColor: color }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{pct}%</div>
                                </div>
                            );
                        })}
                        {!chartData.length && <div className="text-gray-400">Không có dữ liệu</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
