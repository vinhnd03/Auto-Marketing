import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const PackageCharts = ({ selectedTimeType = "month" }) => {
    const [chartType, setChartType] = useState("pie");
    const [series, setSeries] = useState([]);

    const labels = ["Gói cơ bản", "Gói nâng cao", "Gói doanh nghiệp", "Gói VIP"];
    const colors = ["#00c2a8", "#34d399", "#60a5fa", "#fbbf24"];

    // Dữ liệu mẫu
    const dummyData = {
        week: [10, 20, 5, 15],
        month: [44, 55, 13, 33],
        quarter: [100, 80, 60, 40],
        year: [400, 320, 220, 180],
    };

    useEffect(() => {
        setSeries(dummyData[selectedTimeType] || []);
    }, [selectedTimeType]);

    const pieOptions = {
        labels,
        colors,
        legend: { position: "bottom" },
    };

    const barOptions = {
        chart: { type: "bar" },
        plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
        colors,
        xaxis: { categories: labels },
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="border p-2 rounded-lg shadow-sm focus:border-[#00c2a8] focus:ring-2 focus:ring-[#00c2a8]"
                >
                    <option value="pie">Biểu đồ tròn</option>
                    <option value="bar">Biểu đồ cột</option>
                </select>
            </div>
            {chartType === "pie" ? (
                <Chart options={pieOptions} series={series} type="pie" height={300} />
            ) : (
                <Chart
                    options={barOptions}
                    series={[{ name: "Số lượng", data: series }]}
                    type="bar"
                    height={300}
                />
            )}
        </>
    );
};

export default PackageCharts;
