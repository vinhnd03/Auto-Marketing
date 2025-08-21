import React, { useEffect, useState } from "react";
import { getStatisticPackageByMonthYear } from "../../service/admin/statisticsPackagesService";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function NewPackagePurchased() {
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
                const data = await getStatisticPackageByMonthYear(selectedMonth, selectedYear);

                if (!data) {
                    setWeeklyChartData(null);
                    setMonthlyChartData(null);
                    setQuarterlyChartData(null);
                    return;
                }

                setMonthlyChartData(data.monthly || null);
                setQuarterlyChartData(data.quarterly || null);

                if (selectedMonth !== "all") {
                    setWeeklyChartData(data.weekly || null);
                } else {
                    setWeeklyChartData(null);
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-green-50 p-4 rounded-lg shadow-md">
                <p className="text-3xl font-bold">Thống kê khách hàng mua gói mới</p>
            </div>

            {/* Bộ lọc */}
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

            {/* Biểu đồ tuần */}
            {selectedMonth !== "all" && (
                weeklyChartData && weeklyChartData.labels.length > 0 ? (
                    <div className="flex space-x-4 mb-8">
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Biểu đồ theo tuần</h3>
                            <div style={{ maxWidth: "500px", height: "300px" }}>
                                <Bar
                                    data={weeklyChartData}
                                    options={{ maintainAspectRatio: false }}
                                />
                            </div>
                        </div>

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
                                        <td className="p-2">{weeklyChartData.datasets[0].data[index]}</td>
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

            {/* Biểu đồ tháng & quý */}
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

export default NewPackagePurchased;