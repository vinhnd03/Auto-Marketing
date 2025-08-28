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
import { Filter, Calendar, TrendingUp } from "lucide-react";

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
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const years = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) years.push(i);

  const calcGrowthRates = (arr) => {
    if (!arr || arr.length === 0) return [];
    const rates = [0];
    for (let i = 1; i < arr.length; i++) {
      const prev = Number(arr[i - 1]) || 0;
      const curr = Number(arr[i]) || 0;
      const rate = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
      rates.push(Number(rate.toFixed(1)));
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
        const weekLabels = weeklyFromApi.map(
          (_, i) => `Tuần ${i + 1} - Tháng ${selectedMonth}`
        );

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
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Số khách hàng",
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: 10,
        },
        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Tăng trưởng (%)",
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
        grid: { drawOnChartArea: false },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: 10,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  };

  const totalCustomers = (
    selectedMonth === "all"
      ? monthlyChartData.datasets[0].data
      : weeklyChartData.datasets[0].data
  ).reduce((a, b) => a + Number(b || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Thống kê khách hàng đăng ký mới
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Tổng quan hệ thống AutoMarketing
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter size={16} />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* Bộ lọc */}
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
          showMobileFilter ? "block" : "hidden sm:block"
        }`}
      >
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Chọn tháng</span>
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tất cả</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>Chọn năm</span>
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Close Button */}
      {showMobileFilter && (
        <div className="sm:hidden flex justify-end">
          <button
            onClick={() => setShowMobileFilter(false)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
          >
            <span>Đóng bộ lọc</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-white bg-blue-600 rounded-md">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang tải dữ liệu...
          </div>
        </div>
      )}

      {/* Biểu đồ tuần */}
      {!loading &&
        selectedMonth !== "all" &&
        (weeklyChartData.labels && weeklyChartData.labels.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Biểu đồ theo tuần
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Khách hàng mới trong tháng {selectedMonth}/{selectedYear}
                </p>
              </div>
              <div className="w-full h-80 sm:h-96">
                <Chart type="bar" data={weeklyChartData} options={options} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                Danh sách chi tiết
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Thời gian
                      </th>
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Số lượng khách hàng mới
                      </th>
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Tăng trưởng (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyChartData.labels.map((label, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-2 sm:p-3 text-sm text-gray-900">
                          {label}
                        </td>
                        <td className="p-2 sm:p-3 text-sm text-gray-600 font-medium">
                          {weeklyChartData.datasets[0].data[index]}
                        </td>
                        <td className="p-2 sm:p-3 text-sm text-gray-600">
                          {weeklyChartData.datasets[1].data[index]}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm sm:text-base">
              Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
            </p>
          </div>
        ))}

      {/* Biểu đồ tháng & quý */}
      {!loading && selectedMonth === "all" && (
        <div className="space-y-6 sm:space-y-8">
          {/* Biểu đồ theo tháng */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Biểu đồ theo tháng
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tổng số khách hàng mua gói theo tháng ({selectedYear})
              </p>
            </div>
            <div className="w-full h-80 sm:h-96">
              <Chart type="bar" data={monthlyChartData} options={options} />
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                Chi tiết theo tháng
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-200">
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Tháng
                      </th>
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Số lượng khách hàng mới
                      </th>
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Tăng trưởng (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyChartData.labels.map((label, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-white"
                      >
                        <td className="p-2 sm:p-3 text-sm text-gray-900">
                          {label}
                        </td>
                        <td className="p-2 sm:p-3 text-sm text-gray-600 font-medium">
                          {monthlyChartData.datasets[0].data[index]}
                        </td>
                        <td className="p-2 sm:p-3 text-sm text-gray-600">
                          {monthlyChartData.datasets[1].data[index]}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Biểu đồ theo quý */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Biểu đồ theo quý
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Tổng số khách hàng mua gói theo quý ({selectedYear})
              </p>
            </div>
            <div className="w-full h-80 sm:h-96">
              <Chart type="bar" data={quarterlyChartData} options={options} />
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                Chi tiết theo quý
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="bg-white border-b border-gray-200">
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Quý
                      </th>
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Số lượng khách hàng mới
                      </th>
                      <th className="p-2 sm:p-3 text-sm font-semibold text-gray-700">
                        Tăng trưởng (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyChartData.labels.map((label, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-white"
                      >
                        <td className="p-2 sm:p-3 text-sm text-gray-900">
                          {label}
                        </td>
                        <td className="p-2 sm:p-3 text-sm text-gray-600 font-medium">
                          {quarterlyChartData.datasets[0].data[index]}
                        </td>
                        <td className="p-2 sm:p-3 text-sm text-gray-600">
                          {quarterlyChartData.datasets[1].data[index]}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tổng khách hàng */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <p className="text-sm sm:text-base text-blue-800">
          <strong>Tổng khách hàng mới:</strong> {totalCustomers}
        </p>
      </div>
    </div>
  );
}
