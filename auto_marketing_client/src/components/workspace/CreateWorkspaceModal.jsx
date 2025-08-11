import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const CreateWorkspaceModal = ({ isOpen, onClose, onCreate }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);

    if (!isOpen) return null;

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = nameRef.current.value.trim();
        const description = descriptionRef.current.value.trim();
        if (!name) return;

        const newWorkspace = {
            id: Date.now(),
            name,
            description,
            avatar: avatarPreview || null,
            createdAt: new Date().toISOString().split("T")[0],
        };

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            onCreate(newWorkspace);
            onClose();
            setAvatarPreview(null);
            nameRef.current.value = "";
            descriptionRef.current.value = "";
            toast.success("Tạo thành công!");
        } catch {}
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6 relative max-h-screen overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
                    Tạo Workspace mới
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Avatar */}
                    <div className="flex justify-center">
                        <div
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer overflow-hidden hover:border-blue-500 transition"
                            onClick={handleAvatarClick}
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs sm:text-sm underline text-blue-600">
                                    Tải ảnh đại diện
                                </span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Tên Workspace */}
                    <div>
                        <label className="block text-gray-700 font-medium text-sm sm:text-base">
                            Tên Workspace
                        </label>
                        <input
                            type="text"
                            ref={nameRef}
                            placeholder="Nhập tên workspace"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        />
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-gray-700 font-medium text-sm sm:text-base">
                            Mô tả
                        </label>
                        <textarea
                            ref={descriptionRef}
                            placeholder="Nhập mô tả"
                            rows="3"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition text-sm sm:text-base"
                    >
                        Tạo workspace
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceModal;
