import React, {useState, useRef, useEffect} from "react";
import {X, Camera, Upload, User} from "lucide-react";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {getAllWorkspaceByUserId, updateWorkspace} from "../../service/workspace/workspace_service";

const UpdateWorkspaceModal = ({isOpen, onClose, setWorkspaces, workspace, userId, workspaces}) => {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const socialAccountId = 1;

    useEffect(() => {
        if (workspace) {
            setAvatarPreview(workspace.avatar || null);
        }
    }, [workspace]);

    if (!isOpen) return null;

    // add duplicate name check
    const WorkspaceSchema = Yup.object().shape({
        name: Yup.string()
            .required("Tên workspace là bắt buộc")
            .max(100, "Tên workspace không được vượt quá 100 ký tự")
            .test("unique-name", "Tên workspace đã tồn tại", function (value) {
                if (!value) return true;
                const lower = value.trim().toLowerCase();
                // exclude this workspace id
                const exists = workspaces.some(ws => ws.name.trim().toLowerCase() === lower && ws.id !== workspace.id);
                return !exists;
            }),
        description: Yup.string()
            .required("Vui lòng nhập mô tả cho workspace")
            .max(225, "Mô tả không được vượt quá 225 ký tự"),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        const doUpdate = async () => {
            const res = await updateWorkspace(workspace.id, {...values, socialAccountId});
            if (!res || res.error) {
                toast.error(res?.error || "Cập nhật workspace thất bại");
            } else {
                toast.success("Cập nhật workspace thành công");
            }
            // reload list
            const list = await getAllWorkspaceByUserId(userId);
            setWorkspaces(list);
            onClose();
            setSubmitting(false);
        }
        doUpdate();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative max-h-screen overflow-y-auto">
                {/* Nút đóng */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">Cập nhật Workspace</h2>

                <Formik
                    enableReinitialize
                    initialValues={{
                        name: workspace?.name || "",
                        description: workspace?.description || "",
                        avatar: "",
                    }}
                    validationSchema={WorkspaceSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            {/* Avatar */}
                            <div className="flex flex-col items-center space-y-3">
                                <div className="relative group">
                                    {/* Avatar Preview button... (giống code cũ) */}
                                </div>
                            </div>

                            {/* Tên workspace */}
                            <div>
                                <label htmlFor="workspace-name" className="block text-gray-700 font-medium text-sm">Tên Workspace</label>
                                <Field
                                    id="workspace-name"
                                    name="name"
                                    placeholder="Nhập tên workspace"
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                                />
                                {errors.name && touched.name && (
                                    <p className="text-xs text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label htmlFor="workspace-description" className="block text-gray-700 font-medium text-sm">Mô tả</label>
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
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition text-sm"
                            >
                                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UpdateWorkspaceModal;
