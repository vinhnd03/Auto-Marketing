
import axios from "axios";

export let statistic = [
    {
        year: 2025,
        month: 8,
        weekData: [12, 18, 22, 30],
        monthTotal: 82,
        quarter: 3
    },
    {
        year: 2025,
        month: 7,
        weekData: [10, 15, 20, 25],
        monthTotal: 70,
        quarter: 3
    },
    {
        year: 2025,
        month: 6,
        weekData: [8, 12, 18, 22],
        monthTotal: 60,
        quarter: 2
    },{
        year: 2025,
        month: 4,
        weekData: [8, 12, 18, 22],
        monthTotal: 60,
        quarter: 2
    },
    {
        year: 2025,
        month: 1,
        weekData: [5, 6, 7, 8],
        monthTotal: 26,
        quarter: 1
    },
];

export function getStatisticByMonthYear(month, year) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    if (month === 'all') {
        const monthLabels = months.map(m => `Tháng ${m}`);
        const monthData = months.map(m => {
            const found = statistic.find(item => item.month === m && item.year === year);
            return found?.monthTotal || 0;
        });

        return {
            monthly: {
                labels: monthLabels,
                datasets: [
                    {
                        label: `Tổng số khách hàng các tháng trong năm ${year}`,
                        data: monthData,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    },
                ],
            },
        };
    }

    const found = statistic.find(item => item.month === month && item.year === year);
    if (!found) return null;

    // Tính quý từ tháng
    const quarter = Math.ceil(month / 3);
    const quarterMonths = [(quarter - 1) * 3 + 1, (quarter - 1) * 3 + 2, (quarter - 1) * 3 + 3];

    // Tính tổng dữ liệu của cả quý
    const quarterlyTotal = quarterMonths.reduce((sum, m) => {
        const item = statistic.find(s => s.month === m && s.year === year);
        return sum + (item?.monthTotal || 0);
    }, 0);

    return {
        weekly: {
            labels: [`Tuần 1 - Tháng ${month}`, `Tuần 2 - Tháng ${month}`, `Tuần 3 - Tháng ${month}`, `Tuần 4 - Tháng ${month}`],
            datasets: [
                {
                    label: 'Số lượng khách hàng mới',
                    data: found.weekData || [0, 0, 0, 0],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        },
        monthly: {
            labels: [`Tháng ${found.month}`],
            datasets: [
                {
                    label: 'Tổng số khách hàng trong tháng',
                    data: [found.monthTotal],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
            ],
        },
        quarterly: {
            labels: [`Quý ${quarter}`],
            datasets: [
                {
                    label: `Tổng số khách hàng trong quý ${quarter} `,
                    data: [quarterlyTotal],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        },
    };
}
// ... các hàm khác

export async function getWeeklyStatisticByMonthYear(month, year) {
    // Giả lập dữ liệu tuần
    // Ví dụ: tháng có 4 tuần
    const labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];
    const data = labels.map(() => Math.floor(Math.random() * 200) + 50);

    return {
        labels: labels,
        datasets: [
            {
                label: `Số lượng khách hàng (${month}/${year})`,
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.5)"
            }
        ]
    };
}



// export function getStatisticByMonthYear(month, year) {
//     const found = statistic.find(item => item.month === month && item.year === year);
//     if (!found) return null;
//
//     return {
//         weekly: {
//             labels: [`Tuần 1 - Tháng ${month}`, `Tuần 2 - Tháng ${month}`, `Tuần 3 - Tháng ${month}`, `Tuần 4 - Tháng ${month}`],
//             datasets: [
//                 {
//                     label: 'Số lượng khách hàng mới',
//                     data: found.weekData,
//                     backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                 },
//             ],
//         },
//         monthly: {
//             labels: [`Tháng ${found.month}`],
//             datasets: [
//                 {
//                     label: 'Tổng số khách hàng trong tháng',
//                     data: [found.monthTotal],
//                     backgroundColor: 'rgba(153, 102, 255, 0.6)',
//                 },
//             ],
//         },
//         quarterly: {
//             labels: [`Quý ${found.quarter}`],
//             datasets: [
//                 {
//                     label: 'Tổng số khách hàng trong quý',
//                     data: [found.monthTotal], // Hoặc cộng các tháng cùng quý lại nếu cần
//                     backgroundColor: 'rgba(255, 99, 132, 0.6)',
//                 },
//             ],
//         },
//     };
// }

export async function getAll() {
    return statistic;
    //gọi API
    // try {
    //     const response = await axios.get("http://localhost:8080/statistics");
    //     return response.data;
    // } catch (e) {
    //     console.log(e)
    //     return [];
    // }
}