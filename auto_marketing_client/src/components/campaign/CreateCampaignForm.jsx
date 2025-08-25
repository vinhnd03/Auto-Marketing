import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FileText, Type, Calendar, Upload, ArrowLeft } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CampaignService from "../../service/campaignService";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateCampaignForm({
  onSubmit,
  onCancel,
  onUploadSuccess,
}) {
  const { workspaceId } = useParams();
  const [dataSourceMethod, setDataSourceMethod] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "DRAFT",
    workspaceId: parseInt(workspaceId),
  });

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

        // Chỉ convert sang JSON để preview
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          cellDates: true,
        });
        setPreviewData(jsonData);

        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          setForm((prev) => ({
            ...prev,
            name: firstRow["Tên chiến dịch"] || "",
            description: firstRow["Chi tiết chiến dịch"] || "",
            startDate: firstRow["Ngày bắt đầu"]
              ? formatExcelDate(firstRow["Ngày bắt đầu"])
              : "",
            endDate: firstRow["Ngày kết thúc"]
              ? formatExcelDate(firstRow["Ngày kết thúc"])
              : "",
            file: file,
          }));
        }

        const headersFromSheet = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        })[0];
        setHeaders(headersFromSheet);
      } catch (error) {
        console.error("Lỗi khi đọc file Excel:", error);
        alert("Không thể đọc file Excel. Vui lòng kiểm tra lại.");
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleSubmitCampaign = async () => {
    if (!uploadedFile || previewData.length === 0 || loading) return;

    setLoading(true); // bắt đầu upload
    try {
      const res = await CampaignService.uploadExcel(uploadedFile, workspaceId);

      if (res.data) {
        toast.success("Upload chiến dịch từ file Excel thành công 🎉");
        setForm({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          file: null,
        });
        if (onUploadSuccess) await onUploadSuccess();
        onCancel();
      } else if (res.errors) {
        setUploadError(res.errors);
      }
    } catch (err) {
      console.log("Lỗi khi upload:", err);
      setUploadError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false); // kết thúc upload
    }
  };

  const formatExcelDate = (value) => {
    if (!value) return "";

    // Nếu là Date object
    if (value instanceof Date && !isNaN(value)) {
      const day = String(value.getDate()).padStart(2, "0");
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const year = value.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Nếu là số serial Excel
    if (typeof value === "number") {
      const date = new Date((value - 25569) * 86400 * 1000);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Nếu là chuỗi dạng "8/20/25"
    if (typeof value === "string") {
      const parts = value.split("/");
      if (parts.length === 3) {
        const month = parts[0].padStart(2, "0");
        const day = parts[1].padStart(2, "0");
        let year = parts[2];
        if (year.length === 2) year = "20" + year;
        return `${day}/${month}/${year}`;
      }
    }

    // Chuyển bất kỳ value nào khác sang string
    return String(value);
  };

  const handleManualSubmit = async (values) => {
    if (loading) return; // nếu đang loading thì không submit tiếp
    setLoading(true); // bắt đầu submit

    try {
      await onSubmit({ ...values, workspaceId: parseInt(workspaceId) });

      // reset form sau khi submit thành công
      setDataSourceMethod(null);
      setForm({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "DRAFT",
        workspaceId: parseInt(workspaceId),
      });
      onCancel();
    } catch (err) {
      console.log("Lỗi khi submit:", err);
    } finally {
      setLoading(false); // kết thúc submit, bật lại button
    }
  };

  const CampaignSchema = Yup.object().shape({
    name: Yup.string()
      .required("Tên chiến dịch không được để trống")
      .min(3, "Tên chiến dịch phải có ít nhất 3 ký tự")
      .max(100, "Tên chiến dịch không được vượt quá 100 ký tự"),
    description: Yup.string()
      .required("Chi tiết không được để trống")
      .max(500, "Mô tả không được vượt quá 500 ký tự"),

    startDate: Yup.date().required("Vui lòng chọn ngày bắt đầu"),

    endDate: Yup.date()
      .required("Vui lòng chọn ngày kết thúc")
      .min(
        Yup.ref("startDate"),
        "Ngày kết thúc phải bằng hoặc sau ngày bắt đầu"
      ),

    status: Yup.string().required("Vui lòng chọn trạng thái"),
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-3">
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

        {/* Phần mô tả chi tiết và link file mẫu */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-sm mb-2">
            Hướng dẫn: Tải file mẫu Excel để điền dữ liệu chiến dịch. File mẫu
            bao gồm các cột:{" "}
            <strong>Tên chiến dịch, Mô tả, Ngày bắt đầu, Ngày kết thúc</strong>.
            Sau khi điền xong, bạn có thể upload trực tiếp từ máy hoặc từ Google
            Drive.
          </p>
          <a
            href="/files/mau_campaign.xlsx"
            download
            className="text-blue-600 hover:underline text-sm"
          >
            Tải file mẫu Excel
          </a>
        </div>
      </div>

      {/* Chọn cách thêm mới */}
      {!dataSourceMethod && (
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <h4 className="font-semibold text-gray-800 mb-2">Upload file</h4>
              <p className="text-gray-600 text-sm">
                Tải lên file phân tích hoặc brief
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Manual */}
      {dataSourceMethod === "manual" && (
        <Formik
          initialValues={form}
          validationSchema={CampaignSchema}
          onSubmit={handleManualSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="max-w-2xl mx-auto space-y-6 mt-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Type size={16} className="text-blue-500" /> Tên chiến dịch
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  name="name"
                  placeholder="VD: Summer Sale 2024"
                  className="w-full border rounded-lg px-4 py-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="text-blue-500" /> Mô tả
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className="w-full border rounded-lg px-4 py-3"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-blue-500" /> Ngày bắt
                    đầu
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="startDate"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                  <ErrorMessage
                    name="startDate"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar size={16} className="text-blue-500" /> Ngày kết
                    thúc
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="endDate"
                    className="w-full border rounded-lg px-4 py-3"
                  />
                  <ErrorMessage
                    name="endDate"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setDataSourceMethod(null)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  ← Chọn phương thức khác
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Tạo chiến dịch
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {/* Upload */}
      {dataSourceMethod === "upload" && (
        <div className="max-w-2xl mx-auto space-y-6 mt-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Upload size={16} className="text-blue-500" /> Tải tệp Excel
              <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
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

          {uploadError && (
            <div className="bg-red-100 text-red-600 p-2 rounded whitespace-pre-line">
              {uploadError}
            </div>
          )}

          {previewData.length > 0 && (
            <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
              <thead>
                <tr>
                  {headers.map((key) => (
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
                    {headers.map((key) => {
                      let cellValue = row[key];

                      // Nếu value là Date object hoặc cột ngày, format sang string
                      if (
                        cellValue instanceof Date ||
                        key === "Ngày bắt đầu" ||
                        key === "Ngày kết thúc"
                      ) {
                        cellValue = formatExcelDate(cellValue);
                      }

                      return (
                        <td key={key} className="border p-2">
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => setDataSourceMethod(null)}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Chọn phương thức khác
            </button>
            <button
              type="button"
              onClick={handleSubmitCampaign}
              disabled={!uploadedFile || previewData.length === 0 || loading}
              className={`px-4 py-2 rounded-lg text-white ${
                !uploadedFile || previewData.length === 0 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Đang tải..." : "Thêm chiến dịch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
