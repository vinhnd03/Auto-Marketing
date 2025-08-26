import React, {useState, useRef, useEffect} from "react";
import {X, Camera, Upload, User} from "lucide-react";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
    getAllWorkspaceByUserId,
    updateWorkspace,
} from "../../service/workspace/workspace_service";

const MAX_FILE_SIZE = 5000 * 1024; //5 MB

const UpdateWorkspaceModal = ({
                                  isOpen,
                                  onClose,
                                  setWorkspaces,
                                  workspace,
                                  userId,
                                  workspaces,
                                  socialAccounts
                              }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const socialAccountId = 1;

    // Set avatar preview từ workspace khi modal mở
    useEffect(() => {
        if (workspace) {
            setAvatarPreview(workspace.avatar || null);
        }
    }, [workspace]);

    // Reset avatar preview khi modal đóng
    useEffect(() => {
        if (!isOpen) {
            setAvatarPreview(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const WorkspaceSchema = Yup.object().shape({
        name: Yup.string()
            .required("Tên workspace là bắt buộc")
            .max(50, "Tên workspace không được vượt quá 50 ký tự")
            .test("unique-name", "Tên workspace đã tồn tại", function (value) {
                if (!value) return true;
                const lower = value.trim().toLowerCase();
                const exists = workspaces.some(
                    (ws) => ws.name.trim().toLowerCase() === lower && ws.id !== workspace.id
                );
                return !exists;
            }),
        description: Yup.string()
            .required("Vui lòng nhập mô tả cho workspace")
            .max(225, "Mô tả không được vượt quá 225 ký tự"),
        avatar: Yup.mixed().nullable().test(
            "fileSize",
            "Dung lượng ảnh tối đa 5 MB",
            (file) => {
                if (!file) return true;
                return file.size <= MAX_FILE_SIZE;
            }
        ),
    });

    const handleSubmit = (values, {setSubmitting, resetForm}) => {
        const doUpdate = async () => {
            try {
                console.log(socialAccounts)
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                formData.append("socialAccountId", socialAccountId);

                if (values.avatar) {
                    formData.append("avatar", values.avatar);
                }

                const res = await updateWorkspace(workspace.id, formData);

                if (!res || res.error) {
                    toast.error(res?.error || "Cập nhật workspace thất bại");
                } else {
                    toast.success("Cập nhật workspace thành công");
                }

                const list = await getAllWorkspaceByUserId(userId);
                const sortedWs = [...list].sort((a, b) => {
                    // Ưu tiên ACTIVE lên trước
                    if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
                    if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;

                    // Nếu cùng status thì sort theo id (id lớn hơn lên trước)
                    return b.id - a.id;
                });
                setWorkspaces(sortedWs);

                resetForm();
                setAvatarPreview(null);
                onClose();
            } catch (err) {
                console.error(err);
                toast.error("Không thể kết nối đến hệ thống, vui lòng thử lại sau");
            }
            setSubmitting(false);
        };
        doUpdate();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative max-h-screen overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20}/>
                </button>

                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
                    Cập nhật Workspace
                </h2>

                <Formik
                    enableReinitialize
                    initialValues={{
                        name: workspace?.name || "",
                        description: workspace?.description || "",
                        avatar: null,
                    }}
                    validationSchema={WorkspaceSchema}
                    onSubmit={handleSubmit}
                >
                    {({setFieldValue, isSubmitting, errors, touched}) => (
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
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="flex space-x-2">
                                                        <Camera className="w-6 h-6 text-white"/>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAvatarPreview(null);
                                                                setFieldValue("avatar", null);
                                                                if (fileInputRef.current)
                                                                    fileInputRef.current.value = "";
                                                                toast.success("Đã xóa ảnh!");
                                                            }}
                                                            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4 text-white"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center space-y-2">
                                                <div
                                                    className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-8 h-8 text-blue-600"/>
                                                </div>
                                                <div className="text-center">
                                                    <Upload className="w-4 h-4 text-blue-600 mx-auto mb-1"/>
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
                                                    setFieldValue("avatar", file);
                                                    setAvatarPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </button>
                                    {errors.avatar && touched.avatar && (
                                        <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
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

                            {/* Description */}
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
