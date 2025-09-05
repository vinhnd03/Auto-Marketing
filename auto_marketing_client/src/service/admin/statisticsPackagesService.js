import axios from "axios";

export async function getAllPackages() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/plans`, {withCredentials: true});
        const plans = response.data?.data || response.data;
        return Array.isArray(plans) ? plans : [];
    } catch (e) {
        console.error("Error fetching plans:", e);
        return [];
    }
}

const BASE = `${process.env.REACT_APP_BACKEND_URL}/api/users`; // giữ nguyên

/**
 * Backend response shape:
 * {
 *   monthly: [{ month: 1..12, count }],
 *   quarterly: [{ quarter: 1..4, count }],
 *   weekly?: [{ week: 1..52, count }] // khi có month
 * }
 */
export async function getStatisticPackageByMonthYear(month, year) {
    try {
        const params = { year };
        if (month !== "all") params.month = Number(month);

        // Gọi endpoint mới statistics_packages
        const { data } = await axios.get(`${BASE}/statistics_packages`, { params, withCredentials: true });

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
        const weeklyBuckets = new Array(5).fill(0); // Tuần 1–5 trong tháng
        const weeklyData = data?.weekly || [];

        weeklyData.forEach(({ week, count }) => {
            if (week >= 1 && week <= 5) {
                weeklyBuckets[week - 1] = Number(count) || 0;
            }
        });

        const weekly = {
            labels: [
                `Tuần 1 (1-7/${month})`,
                `Tuần 2 (8-14/${month})`,
                `Tuần 3 (15-21/${month})`,
                `Tuần 4 (22-28/${month})`,
                `Tuần 5 (29-31/${month})`,
            ],
            datasets: [
                {
                    label: `Khách hàng mới trong tháng ${month}/${year}`,
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