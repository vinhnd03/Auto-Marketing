import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { getStatisticByMonthYear } from "../../service/admin/statisticsCustomerService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export default function NewCustomerStatistic() {
    const [analysisType, setAnalysisType] = useState("weekly");
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const years = [];
    for (let i = 2020; i <= new Date().getFullYear(); i++) years.push(i);

    const calcGrowthRates = (arr) => {
        if (!arr || arr.length === 0) return [];
        const rates = [0];
        for (let i = 1; i < arr.length; i++) {
            const prev = Number(arr[i - 1]) || 0;
            const curr = Number(arr[i]) || 0;
            const rate = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
            rates.push(Number(rate.toFixed(2)));
        }
        return rates;
    };

    const [monthlyChartData, setMonthlyChartData] = useState({
        labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
        datasets: [
            {
                label: "Số lượng khách hàng mới",
                data: Array(12).fill(0),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                yAxisID: "y",
            },
            {
                label: "Tăng trưởng (%)",
                data: Array(12).fill(0),
                type: "line",
                borderColor: "rgba(255, 99, 132, 1)",
                yAxisID: "y1",
            },
        ],
    });

    const [quarterlyChartData, setQuarterlyChartData] = useState({
        labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
        datasets: [
            {
                label: "Số lượng khách hàng mới",
                data: [0, 0, 0, 0],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                yAxisID: "y",
            },
            {
                label: "Tăng trưởng (%)",
                data: [0, 0, 0, 0],
                type: "line",
                borderColor: "rgba(255, 99, 132, 1)",
                yAxisID: "y1",
            },
        ],
    });

    const [weeklyChartData, setWeeklyChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Số lượng khách hàng mới",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                yAxisID: "y",
            },
            {
                label: "Tăng trưởng (%)",
                data: [],
                type: "line",
                borderColor: "rgba(255, 99, 132, 1)",
                yAxisID: "y1",
            },
        ],
    });

    const sum = (arr) => arr.reduce((a, b) => a + Number(b || 0), 0);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (selectedMonth === "all") {
                // --- lấy dữ liệu 12 tháng ---
                const monthlyPromises = Array.from({ length: 12 }, (_, i) =>
                    getStatisticByMonthYear(i + 1, selectedYear)
                        .then((res) => sum(res?.weekly?.datasets?.[0]?.data || []))
                        .catch(() => 0)
                );
                const monthlyFromWeeks = await Promise.all(monthlyPromises);

                const quarterlyFromApi = [0, 0, 0, 0].map((_, qi) =>
                    monthlyFromWeeks.slice(qi * 3, qi * 3 + 3).reduce((s, n) => s + n, 0)
                );

                setMonthlyChartData((prev) => ({
                    ...prev,
                    datasets: [
                        { ...prev.datasets[0], data: monthlyFromWeeks },
                        { ...prev.datasets[1], data: calcGrowthRates(monthlyFromWeeks) },
                    ],
                }));

                setQuarterlyChartData((prev) => ({
                    ...prev,
                    datasets: [
                        { ...prev.datasets[0], data: quarterlyFromApi },
                        { ...prev.datasets[1], data: calcGrowthRates(quarterlyFromApi) },
                    ],
                }));

                setWeeklyChartData((prev) => ({
                    ...prev,
                    labels: [],
                    datasets: [
                        { ...prev.datasets[0], data: [] },
                        { ...prev.datasets[1], data: [] },
                    ],
                }));
            } else {
                const monthNumber = Number(selectedMonth);
                const res = await getStatisticByMonthYear(monthNumber, selectedYear);
                const weeklyFromApi = res?.weekly?.datasets?.[0]?.data || [];

                // tự động tạo nhãn tuần dựa trên số lượng dữ liệu
                const weekLabels = weeklyFromApi.map((_, i) => `Tuần ${i + 1} - Tháng ${selectedMonth}`);

                setWeeklyChartData((prev) => ({
                    ...prev,
                    labels: weekLabels,
                    datasets: [
                        { ...prev.datasets[0], data: weeklyFromApi },
                        { ...prev.datasets[1], data: calcGrowthRates(weeklyFromApi) },
                    ],
                }));

                // --- monthly + quarterly vẫn lấy từ tổng tuần ---
                const monthlyPromises = Array.from({ length: 12 }, (_, i) =>
                    getStatisticByMonthYear(i + 1, selectedYear)
                        .then((res) => sum(res?.weekly?.datasets?.[0]?.data || []))
                        .catch(() => 0)
                );
                const monthlyFromWeeks = await Promise.all(monthlyPromises);

                const quarterlyFromApi = [0, 0, 0, 0].map((_, qi) =>
                    monthlyFromWeeks.slice(qi * 3, qi * 3 + 3).reduce((s, n) => s + n, 0)
                );

                setMonthlyChartData((prev) => ({
                    ...prev,
                    datasets: [
                        { ...prev.datasets[0], data: monthlyFromWeeks },
                        { ...prev.datasets[1], data: calcGrowthRates(monthlyFromWeeks) },
                    ],
                }));

                setQuarterlyChartData((prev) => ({
                    ...prev,
                    datasets: [
                        { ...prev.datasets[0], data: quarterlyFromApi },
                        { ...prev.datasets[1], data: calcGrowthRates(quarterlyFromApi) },
                    ],
                }));
            }
        } catch (e) {
            console.error("Lỗi khi lấy dữ liệu:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, [selectedMonth, selectedYear]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        stacked: false,
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                title: { display: true, text: "Số khách hàng" },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                title: { display: true, text: "Tăng trưởng (%)" },
                grid: { drawOnChartArea: false },
            },
        },
    };

    const totalCustomers = (
        selectedMonth === "all" ? monthlyChartData.datasets[0].data : weeklyChartData.datasets[0].data
    ).reduce((a, b) => a + Number(b || 0), 0);

    return (
        <div className="container mx-auto p-4">
            <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-blue-50 p-4 rounded-lg shadow-md">
                <p className="text-3xl font-bold">Thống kê khách hàng đăng kí mới</p>
            </div>

            <div className="flex space-x-4 mb-4">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                >
                    <option value="all">Tất cả</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1)}>
                            Tháng {i + 1}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="border border-gray-300 rounded-md p-1"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            Năm {y}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : selectedMonth !== "all" ? (
                weeklyChartData.labels && weeklyChartData.labels.length > 0 ? (
                    <div className="flex space-x-4 mb-8">
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Biểu đồ theo tuần</h3>
                            <div style={{ maxWidth: "500px", height: "300px" }}>
                                <Chart type="bar" data={weeklyChartData} options={options} />
                            </div>
                        </div>

                        <div className="w-1/2 bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4">Danh sách chi tiết</h3>
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b">Thời gian</th>
                                    <th className="p-2 border-b">Số lượng khách hàng mới</th>
                                    <th className="p-2 border-b">Tăng trưởng (%)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {weeklyChartData.labels.map((label, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">{weeklyChartData.datasets[0].data[index]}</td>
                                        <td className="p-2">{weeklyChartData.datasets[1].data[index]}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
                    </div>
                )
            ) : (
                <div className="flex space-x-4 mb-8">
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Biểu đồ theo tháng</h3>
                        <div style={{ maxWidth: "500px", height: "300px" }}>
                            <Chart type="bar" data={monthlyChartData} options={options} />
                        </div>

                        <div className="mt-4 bg-white p-4 rounded shadow">
                            <h4 className="text-md font-semibold mb-2">Chi tiết theo tháng</h4>
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b">Tháng</th>
                                    <th className="p-2 border-b">Số lượng khách hàng mới</th>
                                    <th className="p-2 border-b">Tăng trưởng (%)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {monthlyChartData.labels.map((label, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">{monthlyChartData.datasets[0].data[index]}</td>
                                        <td className="p-2">{monthlyChartData.datasets[1].data[index]}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Biểu đồ theo quý</h3>
                        <div style={{ maxWidth: "500px", height: "300px" }}>
                            <Chart type="bar" data={quarterlyChartData} options={options} />
                        </div>

                        <div className="mt-4 bg-white p-4 rounded shadow">
                            <h4 className="text-md font-semibold mb-2">Chi tiết theo quý</h4>
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b">Quý</th>
                                    <th className="p-2 border-b">Số lượng khách hàng mới</th>
                                    <th className="p-2 border-b">Tăng trưởng (%)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {quarterlyChartData.labels.map((label, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">{quarterlyChartData.datasets[0].data[index]}</td>
                                        <td className="p-2">{quarterlyChartData.datasets[1].data[index]}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 bg-gray-100 p-4 rounded">
                <p>
                    <strong>Tổng khách hàng mới:</strong> {totalCustomers}
                </p>
            </div>
        </div>
    );
}
