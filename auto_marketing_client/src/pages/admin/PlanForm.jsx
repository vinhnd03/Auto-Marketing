import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const planSchema = Yup.object().shape({
  name: Yup.string().required("Tên gói không được để trống"),
  price: Yup.number()
    .typeError("Giá phải là số")
    .positive("Giá phải > 0")
    .required("Bắt buộc nhập"),
  durationDate: Yup.number()
    .typeError("Thời hạn phải là số")
    .min(1, "Ít nhất 1 ngày")
    .required("Bắt buộc nhập"),
  planLevel: Yup.number()
    .typeError("Level phải là số")
    .min(1, "Level phải >= 1")
    .required("Bắt buộc nhập"),
  maxWorkspace: Yup.number()
    .typeError("Workspace phải là số")
    .min(1, "Ít nhất 1 workspace")
    .required("Bắt buộc nhập"),
  maxSocialAccount: Yup.number()
    .typeError("Social account phải là số")
    .min(1, "Ít nhất 1 social account")
    .required("Bắt buộc nhập"),
  description: Yup.string()
    .min(10, "Mô tả ít nhất 10 ký tự")
    .required("Bắt buộc nhập"),
});

const defaultInitial = {
  id: null,
  name: "",
  price: "",
  durationDate: "",
  description: "",
  maxWorkspace: "",
  maxSocialAccount: "",
  planLevel: "",
};

export default function PlanForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Lưu",
}) {
  return (
    <Formik
      initialValues={initialValues ?? defaultInitial}
      enableReinitialize
      validationSchema={planSchema}
      onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
        try {
          // onSubmit should return an object like:
          // { success: true } or { success: false, fieldErrors: { name: '...' } }
          const res = await onSubmit(values);

          if (res?.fieldErrors) {
            Object.entries(res.fieldErrors).forEach(([field, msg]) => {
              setFieldError(field, msg);
            });
          }

          if (res?.success) {
            resetForm();
          }
        } catch (err) {
          console.error("PlanForm onSubmit error:", err);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field type="hidden" name="id" />

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên gói
            </label>
            <Field
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Nhập tên gói..."
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá (VNĐ)
            </label>
            <Field
              type="number"
              name="price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời hạn (ngày)
            </label>
            <Field
              type="number"
              name="durationDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="30"
            />
            <ErrorMessage
              name="durationDate"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cấp độ gói
            </label>
            <Field
              type="number"
              name="planLevel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="1"
            />
            <ErrorMessage
              name="planLevel"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số Workspace tối đa
            </label>
            <Field
              type="number"
              name="maxWorkspace"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="1"
            />
            <ErrorMessage
              name="maxWorkspace"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số Social Account tối đa
            </label>
            <Field
              type="number"
              name="maxSocialAccount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="2"
            />
            <ErrorMessage
              name="maxSocialAccount"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <Field
              as="textarea"
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              rows="4"
              placeholder="Mô tả chi tiết về gói dịch vụ..."
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang xử lý..." : submitLabel}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
