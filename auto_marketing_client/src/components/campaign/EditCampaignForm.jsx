import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Save, X, Type, FileText, Calendar, Flag } from "lucide-react";
import * as Yup from "yup";
import CampaignService from "../../service/campaignService";
export default function EditCampaignForm({ initialData, onSubmit, onCancel }) {
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    // Lấy status từ service
    const fetchStatus = async () => {
      try {
        const result = await CampaignService.getStatuses(); // giả sử service có hàm này
        setStatusOptions(result);
      } catch (err) {
        console.error("Không lấy được trạng thái:", err);
      }
    };
    fetchStatus();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Tên chiến dịch không được để trống")
      .min(3, "Tên chiến dịch phải có ít nhất 3 ký tự")
      .max(100, "Tên chiến dịch không được vượt quá 100 ký tự"),

    description: Yup.string()
        .required("Mô tả không được để trống")
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
    <Formik
      initialValues={{
        name: initialData.name || "",
        description: initialData.description || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        status: initialData.status || "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange }) => (
        <Form className="space-y-6">
          {/* Header */}
          <div className="pb-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Flag size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Chỉnh sửa chiến dịch
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Cập nhật thông tin chiến dịch và lưu thay đổi.
            </p>
          </div>

          {/* Tên */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Type size={16} className="mr-2 text-blue-500" />
              Tên chiến dịch <span className="text-red-500">*</span>
            </label>
            <Field
              type="text"
              name="name"
              placeholder="Nhập tên chiến dịch..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <FileText size={16} className="mr-2 text-blue-500" />
              Mô tả <span className="text-red-500">*</span>
            </label>
            <Field
              as="textarea"
              name="description"
              placeholder="Nhập mô tả..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={4}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Ngày bắt đầu & kết thúc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Calendar size={16} className="mr-2 text-blue-500" />
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <Field
                type="date"
                name="startDate"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Calendar size={16} className="mr-2 text-blue-500" />
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <Field
                type="date"
                name="endDate"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Flag size={16} className="mr-2 text-blue-500" />
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <Field
              as="select"
              name="status"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            >
              <option value="">Chọn trạng thái</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="status"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <X size={16} /> Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Save size={16} /> Cập nhật
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
