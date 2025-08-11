import React, {useEffect, useState} from "react";
import {getAll, getStatisticByMonthYear} from "../../service/statistics_service";
import {Bar} from "react-chartjs-2";
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

function CustomerStatsDashboard() {
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [weeklyChartData, setWeeklyChartData] = useState(null);
    const [monthlyChartData, setMonthlyChartData] = useState(null);
    const [quarterlyChartData, setQuarterlyChartData] = useState(null);
    const [allStatistic, setAllStatistic] = useState([]);

    const years = [];
    for (let i = 2020; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }

    useEffect(() => {
        async function fetchData() {
            const all = await getAll();
            setAllStatistic(all);

            if (selectedMonth === "all") {
                const filtered = all.filter(item => item.year === parseInt(selectedYear)).sort((a, b) => a.month - b.month);

                // --- DỮ LIỆU BIỂU ĐỒ THEO THÁNG (12 THÁNG) ---
                const monthlyLabels = filtered.map(item => `Tháng ${item.month}`);
                const monthlyData = filtered.map(item => item.monthTotal);

                setMonthlyChartData({
                    labels: monthlyLabels,
                    datasets: [
                        {
                            label: "Tổng số khách hàng theo tháng",
                            data: monthlyData,
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                        },
                    ],
                });

                // --- DỮ LIỆU BIỂU ĐỒ THEO QUÝ (4 CỘT: Q1 -> Q4) ---
                const quarterSums = [0, 0, 0, 0]; // Q1 -> Q4

                filtered.forEach(item => {
                    const quarterIndex = Math.floor((item.month - 1) / 3); // 0-3
                    quarterSums[quarterIndex] += item.monthTotal;
                });

                setQuarterlyChartData({
                    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                    datasets: [
                        {
                            label: "Tổng khách hàng theo quý",
                            data: quarterSums,
                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                        },
                    ],
                });

                setWeeklyChartData(null);
            } else {
                const chartData = getStatisticByMonthYear(parseInt(selectedMonth), parseInt(selectedYear));
                if (chartData) {
                    setWeeklyChartData(chartData.weekly);
                    setMonthlyChartData(chartData.monthly);
                    setQuarterlyChartData(chartData.quarterly);
                } else {
                    setWeeklyChartData(null);
                    setMonthlyChartData(null);
                    setQuarterlyChartData(null);
                }
                setMonthlyChartData(null); // Ẩn biểu đồ tháng
                setQuarterlyChartData(null); // Ẩn biểu đồ quý
            }
        }

        fetchData();
    }, [selectedMonth, selectedYear]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Thống kê khách hàng mới</h2>
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


// CustomerStatsDashboard.js
// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import {getAll} from '../service/statistics_service.js';
//
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
//
// function CustomerStatsDashboard() {
//     const [timeFrame, setTimeFrame] = useState('weekly');
//     const [data, setData] = useState(null); // ban đầu chưa có dữ liệu
//
//     useEffect(() => {
//         async function fetchData() {
//             const res = await getAll();
//             // res là 1 mảng chứa 1 object => res[0]
//             setData(res[0]);
//         }
//
//         fetchData();
//     }, []);
//
//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: { position: 'top' },
//             title: {
//                 display: true,
//                 text: `Thống kê khách hàng mới (${timeFrame === 'weekly' ? 'Tuần' : timeFrame === 'monthly' ? 'Tháng' : 'Quý'})`,
//             },
//         },
//     };
//
//     if (!data) return <div className="p-4">Đang tải dữ liệu...</div>; // loading state
//
//     return (
//         <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
//             {/* Tabs để chọn thời gian */}
//             <div className="flex space-x-4 mb-6">
//                 <button
//                     onClick={() => setTimeFrame('weekly')}
//                     className={`px-4 py-2 rounded ${timeFrame === 'weekly' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
//                 >
//                     Tuần
//                 </button>
//                 <button
//                     onClick={() => setTimeFrame('monthly')}
//                     className={`px-4 py-2 rounded ${timeFrame === 'monthly' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
//                 >
//                     Tháng
//                 </button>
//                 <button
//                     onClick={() => setTimeFrame('quarterly')}
//                     className={`px-4 py-2 rounded ${timeFrame === 'quarterly' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
//                 >
//                     Quý
//                 </button>
//             </div>
//
//             {/* Biểu đồ */}
//             <div className="bg-white p-6 rounded shadow mb-6">
//                 <Bar data={data[timeFrame]} options={chartOptions} />
//             </div>
//
//             {/* Bảng dữ liệu */}
//             <div className="bg-white p-6 rounded shadow">
//                 <h3 className="text-lg font-semibold mb-4">Danh sách chi tiết</h3>
//                 <table className="w-full text-left">
//                     <thead>
//                     <tr className="bg-gray-100">
//                         <th className="p-2 border-b">Thời gian</th>
//                         <th className="p-2 border-b">Số lượng khách hàng mới</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {data[timeFrame].labels.map((label, index) => (
//                         <tr key={index} className="border-b">
//                             <td className="p-2">{label}</td>
//                             <td className="p-2">{data[timeFrame].datasets[0].data[index]}</td>
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
//
// export default CustomerStatsDashboard;
