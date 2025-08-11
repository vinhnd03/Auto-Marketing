import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  FileText,
  Type,
  Calendar,
  Flag,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
} from "lucide-react";

export default function CreateCampaignForm({ onSubmit, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dataSourceMethod, setDataSourceMethod] = useState(null); // 'manual' hoặc 'upload'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Sắp bắt đầu",
    campaignContent: "",
  });

  const statuses = ["Sắp bắt đầu", "Đang hoạt động", "Đã kết thúc"];

  const steps = [
    { id: 1, title: "Nguồn dữ liệu", icon: <FileText className="w-5 h-5" /> },
    { id: 2, title: "Xác nhận", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Bật cellDates: true + raw: false
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          cellDates: true,
          raw: false,
        });

        setPreviewData(jsonData);

        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          setForm((prev) => ({
            ...prev,
            name: firstRow["Tiêu đề chiến dịch"] || "",
            description: firstRow["Mô tả chiến dịch"] || "",
            campaignContent: firstRow["Nội dung chiến dịch"] || "",
            startDate: firstRow["Ngày bắt đầu"]
              ? formatExcelDate(firstRow["Ngày bắt đầu"])
              : "",
            endDate: firstRow["Ngày kết thúc"]
              ? formatExcelDate(firstRow["Ngày kết thúc"])
              : "",
            file: file,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
        alert("Không thể đọc file Excel. Vui lòng kiểm tra lại.");
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  // Hàm convert ngày Excel về yyyy-mm-dd
  const formatExcelDate = (excelDate) => {
    if (typeof excelDate === "number") {
      // Excel date serial -> JS Date
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      // Trả về dạng dd/MM/yyyy
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    // Nếu đã là string (ví dụ "03/03/2024") thì giữ nguyên
    return excelDate;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Tạo chiến dịch Marketing mới
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Chọn phương thức nhập dữ liệu và thiết lập chiến dịch
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step.id
                  ? currentStep === step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-green-500 border-green-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step.id ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                step.icon
              )}
            </div>
            <div className="ml-3">
              <span
                className={`text-sm font-medium ${
                  currentStep >= step.id ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {currentStep === 1 && (
        <>
          {!dataSourceMethod && (
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setDataSourceMethod("manual")}
                  className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Nhập thủ công
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Nhập đầy đủ thông tin chiến dịch
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setDataSourceMethod("upload")}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors text-left"
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Upload file
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Tải lên file phân tích hoặc brief
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
          {/* Manual */}
          {dataSourceMethod === "manual" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Type size={16} className="text-blue-500" /> Tên chiến dịch
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="VD: Summer Sale 2024"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="text-blue-500" /> Mô tả
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung chiến dịch <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="campaignContent"
                  value={form.campaignContent}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-blue-500" /> Ngày bắt
                    đầu
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-blue-500" /> Ngày kết
                    thúc
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Flag size={16} className="text-blue-500" /> Trạng thái
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setDataSourceMethod(null)}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Chọn phương thức khác
              </button>
            </div>
          )}
          {/* Upload */}
          {dataSourceMethod === "upload" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Upload size={16} className="text-blue-500" /> Tải tệp Excel
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload} // dùng hàm đã viết
                    className="hidden"
                    id="excelUpload"
                  />

                  <label
                    htmlFor="excelUpload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload size={32} className="text-blue-500 mb-2" />
                    <span className="text-sm text-gray-600">
                      Nhấn để chọn tệp hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Hỗ trợ định dạng: .xlsx, .xls
                    </span>
                  </label>
                  {uploadedFile && (
                    <p className="mt-3 text-sm text-green-600 font-medium">
                      Đã chọn: {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDataSourceMethod(null)}
                className="text-blue-600 hover:underline text-sm"
              >
                ← Chọn phương thức khác
              </button>
            </div>
          )}
        </>
      )}

      {/* Step 2 - Xác nhận */}
      {currentStep === 2 && (
        <>
          {dataSourceMethod === "manual" && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div>
                  <strong>Tên chiến dịch:</strong> {form.name || "Chưa nhập"}
                </div>
                <div>
                  <strong>Mô tả:</strong> {form.description || "Chưa nhập"}
                </div>
                <div>
                  <strong>Nội dung:</strong>{" "}
                  {form.campaignContent || "Chưa nhập"}
                </div>
                <div>
                  <strong>Ngày bắt đầu:</strong> {form.startDate || "Chưa chọn"}
                </div>
                <div>
                  <strong>Ngày kết thúc:</strong> {form.endDate || "Chưa chọn"}
                </div>
                <div>
                  <strong>Trạng thái:</strong> {form.status}
                </div>
              </div>
            </div>
          )}

          {dataSourceMethod === "upload" && previewData.length > 0 && (
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 p-2 bg-gray-100"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border border-gray-300 p-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center pt-8 border-t">
        <button
          type="button"
          onClick={currentStep === 1 ? onCancel : handlePrev}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border"
        >
          <ArrowLeft size={18} />
          {currentStep === 1 ? "Hủy" : "Quay lại"}
        </button>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={
              !dataSourceMethod ||
              (dataSourceMethod === "manual" &&
                (!form.name ||
                  !form.description ||
                  !form.campaignContent ||
                  !form.startDate ||
                  !form.endDate))
            }
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          >
            Tiếp tục
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            <Save size={18} />
            Lưu chiến dịch
          </button>
        )}
      </div>
    </div>
  );
}
