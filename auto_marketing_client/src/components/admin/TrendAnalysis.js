import React, { useState, useEffect } from "react";
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
import { getStatisticByMonthYear } from "../../service/statistics_service";

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

export default function TrendPage() {
    const [analysisType, setAnalysisType] = useState("weekly"); // giữ nếu bạn dùng sau
    const [loading, setLoading] = useState(true);

    // Lưu month dưới dạng string ("all" hoặc "1","2",...)
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const years = [];
    for (let i = 2020; i <= new Date().getFullYear(); i++) years.push(i);

    // Helper: đảm bảo mảng số (length cố định)
    const toNumberArray = (arr, len) => {
        const out = Array(len)
            .fill(0)
            .map((_, i) => Number((arr && arr[i]) || 0));
        return out;
    };

    // Hàm tính tăng trưởng
    const calcGrowthRates = (arr) => {
        if (!arr || arr.length === 0) return [];
        const rates = [0];
        for (let i = 1; i < arr.length; i++) {
            const prev = Number(arr[i - 1]) || 0;
            const curr = Number(arr[i]) || 0;
            rates.push(prev === 0 ? 0 : ((curr - prev) / prev) * 100);
        }
        // trả về string cố định 2 chữ số giống trước
        return rates.map((r) => Number(r).toFixed(2));
    };

    // States dữ liệu biểu đồ
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
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
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

    // Fetch khi thay đổi month/year (và giữ analysisType nếu cần)
    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                // truyền Number(selectedMonth) nếu chọn tháng cụ thể,
                // hoặc "all" (string) nếu muốn lấy toàn bộ năm — tuỳ API của bạn
                const monthParam = selectedMonth === "all" ? "all" : Number(selectedMonth);
                const data = await getStatisticByMonthYear(monthParam, selectedYear);

                // Lấy mảng số nguyên từ response (an toàn)
                const monthlyFromApi = toNumberArray(data?.monthly?.datasets?.[0]?.data, 12);
                let quarterlyFromApi = toNumberArray(data?.quarterly?.datasets?.[0]?.data, 4);
                let weeklyFromApi = toNumberArray(data?.weekly?.datasets?.[0]?.data, 4);

                // Nếu API không cho quarterly nhưng monthly có dữ liệu -> tổng hợp quarterly từ monthly
                const monthlyHasData = monthlyFromApi.some((v) => v !== 0);
                const quarterlyAllZero = quarterlyFromApi.every((v) => v === 0);
                if (monthlyHasData && quarterlyAllZero) {
                    quarterlyFromApi = [0, 0, 0, 0].map((_, qi) =>
                        monthlyFromApi.slice(qi * 3, qi * 3 + 3).reduce((s, n) => s + n, 0)
                    );
                }

                // Nếu chọn month cụ thể, đảm bảo weekly label hiển thị đúng tháng được chọn
                const weekLabels =
                    selectedMonth === "all"
                        ? ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"]
                        : ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"].map(
                            (w) => `${w} - Tháng ${selectedMonth}`
                        );

                if (!mounted) return;

                // Cập nhật state biểu đồ (dùng calcGrowthRates)
                setMonthlyChartData((prev) => ({
                    ...prev,
                    datasets: [
                        { ...prev.datasets[0], data: monthlyFromApi },
                        { ...prev.datasets[1], data: calcGrowthRates(monthlyFromApi) },
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
                    labels: weekLabels,
                    datasets: [
                        { ...prev.datasets[0], data: weeklyFromApi },
                        { ...prev.datasets[1], data: calcGrowthRates(weeklyFromApi) },
                    ],
                }));
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMonth, selectedYear, analysisType]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        stacked: false,
        scales: {
            y: { type: "linear", display: true, position: "left", title: { display: true, text: "Số khách hàng" } },
            y1: { type: "linear", display: true, position: "right", title: { display: true, text: "Tăng trưởng (%)" }, grid: { drawOnChartArea: false } },
        },
    };

    // tổng khách hàng: nếu đang xem 'all' -> tính theo tháng, còn lại theo tuần
    const totalCustomers =
        (selectedMonth === "all"
                ? monthlyChartData.datasets[0].data
                : weeklyChartData.datasets[0].data
        ).reduce((a, b) => a + Number(b || 0), 0) || 0;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Thống kê khách hàng mới</h2>

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
                // view theo tuần khi chọn tháng cụ thể
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
                // view theo tháng + quý khi chọn tất cả
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
