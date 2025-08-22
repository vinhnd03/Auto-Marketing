import React from "react";
import toast from "react-hot-toast";

export default function FilterForm({filters, setFilters, onApply}) {

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFilters((prev) => {
            const updated = {...prev, [name]: value};

            // Nếu là quarter -> chỉ chọn năm
            if (updated.type === "quarter" && updated.startYear && updated.endYear) {
                updated.startDate = `${updated.startYear}-01-01`;
                updated.endDate = `${updated.endYear}-12-31`;
            }

            // Nếu là month -> dạng YYYY-MM
            if (updated.type === "month" && updated.startDate && updated.endDate) {
                // Không cần xử lý thêm vì input type="month" đã chuẩn
            }

            return updated;
        });
    };

    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let y = currentYear + 1; y >= currentYear - 20; y--) {
            years.push(y);
        }
        return years;
    };

    const renderDateFields = () => {
        if (filters.type === "day") {
            return (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </>
            );
        } else if (filters.type === "month") {
            return (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tháng bắt đầu</label>
                        <input
                            type="month"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tháng kết thúc</label>
                        <input
                            type="month"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    </div>
                </>
            );
        } else if (filters.type === "quarter") {

            // RÚT GỌN: chỉ chọn năm
            return (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Năm bắt đầu</label>
                        <select
                            name="startYear"
                            value={filters.startYear || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">-- Năm --</option>
                            {getYearOptions().map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Năm kết thúc</label>
                        <select
                            name="endYear"
                            value={filters.endYear || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">-- Năm --</option>
                            {getYearOptions().map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </>
            );
        }
    };

    const handleApplyFilters = () => {
        let startISO = null;
        let endISO = null;

        const pad = (num) => num.toString().padStart(2, "0");

        if (filters.type === "day") {
            if (!filters.startDate || !filters.endDate) {
                toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
                return;
            }

            if (filters.startDate > filters.endDate) {
                toast.error("Ngày bắt đầu phải bé hơn ngày kết thúc");
                return;
            }

            startISO = `${filters.startDate}T00:00:00`;
            endISO = `${filters.endDate}T23:59:59`;
        } else if (filters.type === "month") {
            if (!filters.startDate || !filters.endDate) {
                toast.error("Vui lòng chọn tháng bắt đầu và tháng kết thúc");
                return;
            }

            const [sy, sm] = filters.startDate.split("-");
            const [ey, em] = filters.endDate.split("-");

            if (sy > ey || (sy === ey && sm > em)) {
                toast.error("Tháng bắt đầu phải bé hơn hoặc bằng tháng kết thúc");
                return;
            }

            startISO = `${sy}-${pad(sm)}-01T00:00:00`;
            const lastDayOfEndMonth = new Date(Number(ey), Number(em), 0).getDate();
            endISO = `${ey}-${pad(em)}-${pad(lastDayOfEndMonth)}T23:59:59`;
        } else if (filters.type === "quarter") {
            if (!filters.startYear || !filters.endYear) {
                toast.error("Vui lòng chọn năm bắt đầu/kết thúc");
                return;
            }

            if (filters.startYear > filters.endYear) {
                toast.error("Năm bắt đầu phải bé hơn hoặc bằng năm kết thúc");
                return;
            }

            startISO = `${filters.startYear}-01-01T00:00:00`;
            endISO = `${filters.endYear}-12-31T23:59:59`;
        }

        onApply({ startDate: startISO, endDate: endISO, type: filters.type, chartType: filters.chartType });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Kiểu thống kê */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kiểu thống kê</label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                        <option value="day">Theo Ngày</option>
                        <option value="month">Theo Tháng</option>
                        <option value="quarter">Theo Quý</option>
                    </select>
                </div>

                {/* Dynamic date fields */}
                {renderDateFields()}

                {/* Loại biểu đồ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại biểu đồ</label>
                    <select
                        name="chartType"
                        value={filters.chartType}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="bar">Biểu đồ cột</option>
                        <option value="line">Biểu đồ đường</option>
                    </select>

                </div>
                <div className="flex items-end mb-1">
                    {/* Nút áp dụng */}
                    <button
                        onClick={handleApplyFilters}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl
                        shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition">
                        Áp dụng
                    </button>
                </div>


            </div>
        </div>
    );
}
