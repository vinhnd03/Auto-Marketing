import React, { useState, useRef } from "react";
import { X, Camera, Upload, User } from "lucide-react";
import toast from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { addWorkspace } from "../../service/workspace/workspace_service";

const MAX_FILE_SIZE = 500 * 1024; // 500 KB

const CreateWorkspaceModal = ({ isOpen, onClose, onAdd, workspaces }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const socialAccountId = 3;

    // Yup schema with duplicate name + file size check
    const WorkspaceSchema = Yup.object().shape({
        name: Yup.string()
            .required("Tên workspace là bắt buộc")
            .max(50, "Tên workspace không được vượt quá 50 ký tự")
            .test("unique-name", "Tên workspace đã tồn tại", function (value) {
                if (!value) return true;
                const lower = value.trim().toLowerCase();
                const exists = workspaces.some(
                    (ws) => ws.name.trim().toLowerCase() === lower
                );
                return !exists;
            }),
        description: Yup.string()
            .required("Vui lòng nhập mô tả cho workspace")
            .max(225, "Mô tả không được vượt quá 225 ký tự"),
        avatarFile: Yup.mixed().nullable()
            .test("fileSize", "Dung lượng ảnh tối đa 500 KB", (file) => {
                if (!file) return true;
                return file.size <= MAX_FILE_SIZE;
            }),
    });

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const doCreate = async () => {
            try {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("socialAccountId", socialAccountId);
                if (values.avatarFile) {
                    formData.append("avatar", values.avatarFile);
                }

                const response = await addWorkspace(formData);

                if (response && !response.error) {
                    onAdd(response);
                    toast.success("Thêm mới workspace thành công");
                    resetForm();
                    setAvatarPreview(null);
                    onClose();
                } else {
                    toast.error(response.error || "Thêm mới workspace thất bại");
                }
            } catch (err) {
                console.error(err);
                toast.error("Không thể kết nối đến hệ thống, vui lòng thử lại sau");
            }
            setSubmitting(false);
        };

        doCreate();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative max-h-screen overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
                    Tạo Workspace mới
                </h2>

                <Formik
                    initialValues={{ name: "", description: "", avatarFile: null }}
                    validationSchema={WorkspaceSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            {/* Avatar */}
                            <div className="flex flex-col items-center space-y-3">
                                <div className="relative group">
                                    <button
                                        type="button"
                                        className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-lg group-hover:scale-105"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        {avatarPreview ? (
                                            <>
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="flex space-x-2">
                                                        <Camera className="w-6 h-6 text-white" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAvatarPreview(null);
                                                                setFieldValue("avatarFile", null);
                                                                if (fileInputRef.current) {
                                                                    fileInputRef.current.value = "";
                                                                }
                                                                toast.success("Đã xóa ảnh!");
                                                            }}
                                                            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4 text-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                    <User className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <div className="text-center">
                                                    <Upload className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                                                    <span className="text-xs text-blue-600 font-medium">
                            Tải ảnh lên (tùy chọn)
                          </span>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFieldValue("avatarFile", file);
                                                    setAvatarPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </button>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white group-hover:bg-blue-700 transition-colors cursor-pointer">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600">
                                    Chọn ảnh đại diện (nếu không chọn sẽ dùng mặc định)
                                </p>
                                {errors.avatarFile && touched.avatarFile && (
                                    <p className="text-xs text-red-500">{errors.avatarFile}</p>
                                )}
                            </div>

                            {/* Tên Workspace */}
                            <div>
                                <label
                                    htmlFor="workspace-name"
                                    className="block text-gray-700 font-medium text-sm"
                                >
                                    Tên Workspace <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    id="workspace-name"
                                    name="name"
                                    placeholder="Nhập tên workspace"
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                {errors.name && touched.name && (
                                    <p className="text-xs text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label
                                    htmlFor="workspace-description"
                                    className="block text-gray-700 font-medium text-sm"
                                >
                                    Mô tả <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    as="textarea"
                                    id="workspace-description"
                                    name="description"
                                    rows="3"
                                    placeholder="Nhập mô tả"
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                />
                                {errors.description && touched.description && (
                                    <p className="text-xs text-red-500">{errors.description}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition text-sm"
                            >
                                {isSubmitting ? "Đang tạo..." : "Tạo workspace"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateWorkspaceModal;
