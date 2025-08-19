import React, { useEffect, useState } from "react";
import { getStatisticByMonthYear } from "../../service/admin/statistics_packages_service";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function CustomerStatsDashboard() {
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [weeklyChartData, setWeeklyChartData] = useState(null);
    const [monthlyChartData, setMonthlyChartData] = useState(null);
    const [quarterlyChartData, setQuarterlyChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    const years = [];
    for (let i = 2020; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let monthlyData = Array(12).fill(0); // Dữ liệu tháng (12 tháng)
                let quarterlyData = [0, 0, 0, 0]; // Dữ liệu quý (Q1–Q4)
                let weeklyData = null;

                if (selectedMonth === "all") {
                    // Gọi API cho từng tháng (1–12) để lấy dữ liệu tuần
                    const promises = [];
                    for (let m = 1; m <= 12; m++) {
                        promises.push(
                            getStatisticByMonthYear(m, selectedYear)
                                .then((data) => {
                                    // Nếu dữ liệu không null, tính tổng tuần thành tháng
                                    if (data && data.weekly && data.weekly.datasets[0].data) {
                                        const weeklyArr = data.weekly.datasets[0].data.map(val => Number(val || 0));
                                        monthlyData[m - 1] = weeklyArr.reduce((sum, val) => sum + val, 0);
                                    } else {
                                        monthlyData[m - 1] = 0; // Nếu null, tháng đó bằng 0
                                    }
                                })
                                .catch((error) => {
                                    console.error(`Lỗi khi lấy dữ liệu tháng ${m}/${selectedYear}:`, error);
                                    monthlyData[m - 1] = 0; // Xử lý lỗi, đặt tháng bằng 0
                                })
                        );
                    }
                    await Promise.all(promises);

                    // Tính quý từ tháng
                    for (let i = 0; i < 12; i++) {
                        const quarterIndex = Math.floor(i / 3); // Tháng 1–3 -> Q1, 4–6 -> Q2, v.v.
                        quarterlyData[quarterIndex] += monthlyData[i];
                    }

                    // Cập nhật monthlyChartData
                    setMonthlyChartData({
                        labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
                        datasets: [
                            {
                                label: `Tổng số khách hàng theo tháng (${selectedYear})`,
                                data: monthlyData,
                                backgroundColor: "rgba(153, 102, 255, 0.6)",
                            },
                        ],
                    });

                    // Cập nhật quarterlyChartData
                    setQuarterlyChartData({
                        labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                        datasets: [
                            {
                                label: `Tổng khách hàng theo quý (${selectedYear})`,
                                data: quarterlyData,
                                backgroundColor: "rgba(255, 159, 64, 0.6)",
                            },
                        ],
                    });

                    // Không hiển thị biểu đồ tuần khi chọn "all"
                    setWeeklyChartData(null);
                } else {
                    // Lấy dữ liệu cho tháng cụ thể
                    const chartData = await getStatisticByMonthYear(parseInt(selectedMonth), parseInt(selectedYear));
                    if (chartData && chartData.weekly && chartData.weekly.datasets[0].data) {
                        // Dữ liệu tuần
                        weeklyData = {
                            labels: [
                                `Tuần 1 - Tháng ${selectedMonth}`,
                                `Tuần 2 - Tháng ${selectedMonth}`,
                                `Tuần 3 - Tháng ${selectedMonth}`,
                                `Tuần 4 - Tháng ${selectedMonth}`,
                            ],
                            datasets: [
                                {
                                    label: `Khách hàng mới trong tháng ${selectedMonth}/${selectedYear}`,
                                    data: chartData.weekly.datasets[0].data.map(val => Number(val || 0)),
                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                },
                            ],
                        };
                        setWeeklyChartData(weeklyData);

                        // Tính tổng tháng từ tuần
                        const monthTotal = weeklyData.datasets[0].data.reduce((sum, val) => sum + val, 0);
                        monthlyData[parseInt(selectedMonth) - 1] = monthTotal;

                        // Tính quý từ tháng
                        const quarterIndex = Math.floor((parseInt(selectedMonth) - 1) / 3);
                        quarterlyData[quarterIndex] = monthTotal;

                        // Cập nhật monthlyChartData (chỉ tháng được chọn có giá trị)
                        setMonthlyChartData({
                            labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
                            datasets: [
                                {
                                    label: `Tổng số khách hàng theo tháng (${selectedYear})`,
                                    data: monthlyData,
                                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                                },
                            ],
                        });

                        // Cập nhật quarterlyChartData
                        setQuarterlyChartData({
                            labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                            datasets: [
                                {
                                    label: `Tổng khách hàng theo quý (${selectedYear})`,
                                    data: quarterlyData,
                                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                                },
                            ],
                        });
                    } else {
                        setWeeklyChartData(null);
                        setMonthlyChartData(null);
                        setQuarterlyChartData(null);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
                setWeeklyChartData(null);
                setMonthlyChartData(null);
                setQuarterlyChartData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Thống kê khách hàng mua gói mới</h2>
            <div className="flex space-x-4 mb-6">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                >
                    <option value="all">Tất cả</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Tháng {i + 1}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            Năm {year}
                        </option>
                    ))}
                </select>
            </div>
            {/* Chỉ hiển thị biểu đồ tuần khi chọn một tháng cụ thể */}
            {selectedMonth !== "all" && (
                weeklyChartData && weeklyChartData.labels.length > 0 ? (
                    <div className="flex space-x-4 mb-8">
                        {/* Biểu đồ tuần bên trái */}
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Biểu đồ theo tuần</h3>
                            <div style={{ maxWidth: "500px", height: "300px" }}>
                                <Bar
                                    data={weeklyChartData}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </div>
                        </div>

                        {/* Bảng dữ liệu bên phải */}
                        <div className="w-1/2 bg-white p-6 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4">Danh sách chi tiết</h3>
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b">Thời gian</th>
                                    <th className="p-2 border-b">Số lượng khách hàng mới</th>
                                </tr>
                                </thead>
                                <tbody>
                                {weeklyChartData.labels.map((label, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">
                                            {weeklyChartData.datasets[0].data[index]}
                                        </td>
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
            )}

            {/* Chỉ hiển thị biểu đồ tháng và quý khi chọn "Tất cả" */}
            {selectedMonth === "all" && monthlyChartData && quarterlyChartData && (
                <div className="flex space-x-4 mb-8">
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Biểu đồ theo tháng</h3>
                        <div style={{ maxWidth: "500px", height: "300px" }}>
                            <Bar
                                data={monthlyChartData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                        {/* Bảng dữ liệu chi tiết biểu đồ tháng */}
                        <div className="mt-4 bg-white p-4 rounded shadow">
                            <h4 className="text-md font-semibold mb-2">Chi tiết theo tháng</h4>
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b">Tháng</th>
                                    <th className="p-2 border-b">Số lượng khách hàng mới</th>
                                </tr>
                                </thead>
                                <tbody>
                                {monthlyChartData.labels.map((label, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">{monthlyChartData.datasets[0].data[index]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold mb-2">Biểu đồ theo quý</h3>
                        <div style={{ maxWidth: "500px", height: "300px" }}>
                            <Bar
                                data={quarterlyChartData}
                                options={{ maintainAspectRatio: false }}
                            />
                        </div>
                        {/* Bảng dữ liệu chi tiết biểu đồ quý */}
                        <div className="mt-4 bg-white p-4 rounded shadow">
                            <h4 className="text-md font-semibold mb-2">Chi tiết theo quý</h4>
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border-b">Quý</th>
                                    <th className="p-2 border-b">Số lượng khách hàng mới</th>
                                </tr>
                                </thead>
                                <tbody>
                                {quarterlyChartData.labels.map((label, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{label}</td>
                                        <td className="p-2">{quarterlyChartData.datasets[0].data[index]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerStatsDashboard;