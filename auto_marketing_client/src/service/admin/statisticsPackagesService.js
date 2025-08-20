import axios from "axios";

export async function getAllServicePackages() {
    try {
        const response = await axios.get("http://localhost:8080/api/plans");
        const plans = response.data?.data || response.data;
        return Array.isArray(plans) ? plans : [];
    } catch (e) {
        console.error("Error fetching plans:", e);
        return [];
    }
}

const BASE = "http://localhost:8080/api/users"; // giữ nguyên

/**
 * Backend response shape:
 * {
 *   monthly: [{ month: 1..12, count }],
 *   quarterly: [{ quarter: 1..4, count }],
 *   weekly?: [{ week: 1..52, count }] // khi có month
 * }
 */
export async function getStatisticByMonthYear(month, year) {
    try {
        const params = { year };
        if (month !== "all") params.month = Number(month);

        // Gọi endpoint mới statistics_packages
        const { data } = await axios.get(`${BASE}/statistics_packages`, { params });

        // ---- MONTHLY ----
        const monthArr = new Array(12).fill(0);
        (data?.monthly || []).forEach(({ month: m, count }) => {
            if (m >= 1 && m <= 12) monthArr[m - 1] += Number(count) || 0;
        });

        const monthly = {
            labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
            datasets: [
                {
                    label: `Tổng số khách hàng mua gói theo tháng (${year})`,
                    data: monthArr,
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
            ],
        };

        // ---- QUARTERLY ----
        const quarterArr = new Array(4).fill(0);
        (data?.quarterly || []).forEach(({ quarter: q, count }) => {
            if (q >= 1 && q <= 4) quarterArr[q - 1] += Number(count) || 0;
        });

        const quarterly = {
            labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
            datasets: [
                {
                    label: `Tổng số khách hàng mua gói theo quý (${year})`,
                    data: quarterArr,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                },
            ],
        };

        if (month === "all") {
            return { monthly, quarterly };
        }

        // ---- WEEKLY ----
        const weeklyBuckets = [];
        (data?.weekly || []).forEach(({ week, count }) => {
            weeklyBuckets.push(Number(count) || 0);
        });

        const weekly = {
            labels: weeklyBuckets.map((_, idx) => `Tuần ${idx + 1} - Tháng ${month}`),
            datasets: [
                {
                    label: `Khách hàng mua gói trong tháng ${month}/${year}`,
                    data: weeklyBuckets,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
            ],
        };

        return { monthly, quarterly, weekly };
    } catch (err) {
        console.error("Lỗi khi gọi API thống kê:", err);
        return null;
    }
}
