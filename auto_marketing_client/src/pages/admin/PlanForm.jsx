import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const planSchema = Yup.object().shape({
    name: Yup.string().required("Tên gói không được để trống"),
    price: Yup.number()
        .typeError("Giá phải là số")
        .min(0,"Giá phải >= 0")
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

export default function PlanForm({ initialValues, onSubmit, onCancel, submitLabel = "Lưu" }) {
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
                <Form className="grid grid-cols-2 gap-4">
                    <Field type="hidden" name="id" />

                    <div>
                        <label className="block text-sm font-medium">Tên gói</label>
                        <Field name="name" className="mt-1 p-2 border rounded w-full" />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Giá</label>
                        <Field type="number" name="price" className="mt-1 p-2 border rounded w-full" />
                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Thời hạn (ngày)</label>
                        <Field type="number" name="durationDate" className="mt-1 p-2 border rounded w-full" />
                        <ErrorMessage name="durationDate" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Cấp độ gói</label>
                        <Field type="number" name="planLevel" className="mt-1 p-2 border rounded w-full" />
                        <ErrorMessage name="planLevel" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Số Workspace tối đa</label>
                        <Field type="number" name="maxWorkspace" className="mt-1 p-2 border rounded w-full" />
                        <ErrorMessage name="maxWorkspace" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Số Social Account tối đa</label>
                        <Field type="number" name="maxSocialAccount" className="mt-1 p-2 border rounded w-full" />
                        <ErrorMessage name="maxSocialAccount" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Mô tả</label>
                        <Field as="textarea" name="description" className="mt-1 p-2 border rounded w-full h-24" />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="col-span-2 flex justify-end mt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 transition">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                            {submitLabel}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
