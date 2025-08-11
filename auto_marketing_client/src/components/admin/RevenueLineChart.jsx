// src/components/RevenueLineChart.jsx
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const RevenueLineChart = ({ selectedTimeType = "month" }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const dummyData = {
            week: [1200, 1500, 1000, 1700, 1900, 2100, 1600],
            month: [15000, 17000, 14000, 18000, 16000, 20000, 22000, 19000, 17000, 21000, 23000, 25000],
            quarter: [50000, 65000, 70000, 80000],
            year: [220000, 260000, 280000, 310000, 340000],
        };
        setChartData(dummyData[selectedTimeType]);
    }, [selectedTimeType]);

    const xCategories = {
        week: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        month: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
        quarter: ["Q1", "Q2", "Q3", "Q4"],
        year: ["2021", "2022", "2023", "2024", "2025"],
    };

    const options = {
        chart: { id: "revenue-line-chart" },
        xaxis: { categories: xCategories[selectedTimeType] || [] },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#00c2a8"],
    };

    const series = [{ name: "Doanh thu", data: chartData }];

    return (
        <Chart options={options} series={series} type="line" height={300} />
    );
};

export default RevenueLineChart;
