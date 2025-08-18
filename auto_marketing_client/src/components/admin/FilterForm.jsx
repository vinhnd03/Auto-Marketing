// src/components/TimeFilter.jsx
import { useState } from "react";

const TimeFilter = ({ onFilterChange }) => {
    const [type, setType] = useState("");
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "type") {
            setType(value);
            setValue("");
        } else {
            setValue(value);
        }
        onFilterChange({
            type: name === "type" ? value : type,
            value: name === "value" ? value : "",
        });
    };

    const renderOptions = () => {
        if (type === "month") {
            return Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                </option>
            ));
        }
        if (type === "quarter") {
            return [1, 2, 3, 4].map((q) => (
                <option key={q} value={q}>
                    Quý {q}
                </option>
            ));
        }
        if (type === "year") {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={currentYear - i}>
                    {currentYear - i}
                </option>
            ));
        }
        return <option>Chọn loại thời gian</option>;
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <select
                name="type"
                value={type}
                onChange={handleChange}
                className="border p-2 rounded-lg shadow-sm focus:border-[#00c2a8] focus:ring-2 focus:ring-[#00c2a8]"
            >
                <option value="">-- Chọn loại thời gian --</option>
                <option value="month">Theo tháng</option>
                <option value="quarter">Theo quý</option>
                <option value="year">Theo năm</option>
            </select>

            <select
                name="value"
                value={value}
                onChange={handleChange}
                className="border p-2 rounded-lg shadow-sm focus:border-[#00c2a8] focus:ring-2 focus:ring-[#00c2a8]"
            >
                <option value="">-- Chọn giá trị --</option>
                {renderOptions()}
            </select>
        </div>
    );
};

export default TimeFilter;
