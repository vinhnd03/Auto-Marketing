import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { X, Camera, Upload, User } from "lucide-react";
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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 5MB!");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh!");
        return;
      }

      setAvatarPreview(URL.createObjectURL(file));
      toast.success("Tải ảnh thành công!");
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Đã xóa ảnh!");
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
      // Reset form
      setAvatarPreview(null);
      nameRef.current.value = "";
      descriptionRef.current.value = "";
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Tạo workspace thành công!");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
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
          {/* Avatar Section with Enhanced UI */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative group">
              <button
                type="button"
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-lg group-hover:scale-105"
                onClick={handleAvatarClick}
                aria-label="Chọn ảnh đại diện"
              >
                {avatarPreview ? (
                  <>
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <Camera className="w-6 h-6 text-white" />
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
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
                        Tải ảnh lên
                      </span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </button>

              {/* Camera Icon Badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white group-hover:bg-blue-700 transition-colors cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chọn ảnh đại diện cho workspace
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 5MB</p>
            </div>
          </div>

          {/* Tên Workspace */}
          <div>
            <label
              htmlFor="workspace-name"
              className="block text-gray-700 font-medium text-sm sm:text-base"
            >
              Tên Workspace
            </label>
            <input
              id="workspace-name"
              type="text"
              ref={nameRef}
              placeholder="Nhập tên workspace"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="workspace-description"
              className="block text-gray-700 font-medium text-sm sm:text-base"
            >
              Mô tả
            </label>
            <textarea
              id="workspace-description"
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

CreateWorkspaceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateWorkspaceModal;
