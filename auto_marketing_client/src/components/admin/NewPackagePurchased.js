import React, { useEffect, useState } from "react";
import { getStatisticPackageByMonthYear } from "../../service/admin/statisticsPackagesService";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Filter, Calendar, TrendingUp } from "lucide-react";

Chart.register(...registerables);

function NewPackagePurchased() {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [weeklyChartData, setWeeklyChartData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState(null);
  const [quarterlyChartData, setQuarterlyChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const years = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getStatisticPackageByMonthYear(
          selectedMonth,
          selectedYear
        );

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

    fetchData().then();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Thống kê khách hàng mua gói mới
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
                  <option key={i + 1} value={i + 1}>
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
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    Năm {year}
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
        (weeklyChartData && weeklyChartData.labels.length > 0 ? (
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
                <Bar
                  data={weeklyChartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
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
                        display: true,
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
                    },
                    layout: {
                      padding: {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      },
                    },
                  }}
                />
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
      {!loading &&
        selectedMonth === "all" &&
        monthlyChartData &&
        quarterlyChartData && (
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
                <Bar
                  data={monthlyChartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
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
                        display: true,
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
                    },
                    layout: {
                      padding: {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      },
                    },
                  }}
                />
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
                <Bar
                  data={quarterlyChartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
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
                        display: true,
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
                    },
                    layout: {
                      padding: {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      },
                    },
                  }}
                />
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default NewPackagePurchased;
