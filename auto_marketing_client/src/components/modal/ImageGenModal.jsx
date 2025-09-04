import React, { useState } from "react";
import * as yup from "yup";
import {
  generateImagesForPost,
  saveImagesForPost,
} from "../../service/postService";
import { toast } from "react-hot-toast";

const imageGenSchema = yup.object().shape({
  prompt: yup
    .string()
    .required("Vui lòng nhập mô tả hình ảnh.")
    .min(10, "Mô tả phải từ 10 ký tự trở lên.")
    .max(300, "Mô tả tối đa 300 ký tự."),
  style: yup.string().required("Vui lòng chọn phong cách hình ảnh."),
  numImages: yup
    .number()
    .typeError("Số lượng hình ảnh phải là số.")
    .required("Vui lòng nhập số lượng hình ảnh.")
    .min(1, "Số lượng hình ảnh phải lớn hơn 0.")
    .max(20, "Tối đa 20 hình ảnh."),
});

function ImageGenModal({ isOpen, onClose, onSubmit, postTitle, postId }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [checked, setChecked] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  if (!isOpen) return null;

  const validateAndGenImages = async () => {
    try {
      await imageGenSchema.validate(
        { prompt, style, numImages },
        { abortEarly: false }
      );
      setErrors({});
      setLoading(true);
      const imgs = await generateImagesForPost(postId, {
        prompt,
        style,
        numImages,
      });
      setImages(imgs);
      setChecked(Array(imgs.length).fill(false));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.inner) {
        const errObj = {};
        err.inner.forEach((e) => {
          errObj[e.path] = e.message;
        });
        setErrors(errObj);
      } else {
        setErrors({ prompt: err.message });
      }
    }
  };

  const handleCheck = (idx) => {
    setChecked((prev) => {
      const arr = [...prev];
      arr[idx] = !arr[idx];
      return arr;
    });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    const selectedImages = images.filter((_, i) => checked[i]);
    try {
      await saveImagesForPost(postId, selectedImages);
      toast.success("Lưu ảnh thành công!");
      if (onSubmit) onSubmit(selectedImages);
    } catch (err) {
      toast.error("Lưu ảnh thất bại!");
    }
    setSaveLoading(false);
    setImages([]);
    setChecked([]);
    setPrompt("");
    setStyle("");
    setNumImages(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[600px] relative">
        {/* Nút X đóng modal */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          onClick={onClose}
          aria-label="Đóng"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#f3f3f3" />
            <path
              d="M7 7L15 15M15 7L7 15"
              stroke="#888"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-2">Tạo hình ảnh cho bài viết</h2>
        {postTitle && (
          <div className="mb-6 text-base text-gray-700 font-medium">
            <span className="text-gray-500">Tiêu đề bài viết: </span>
            <span className="text-purple-700">{postTitle}</span>
          </div>
        )}
        {/* Form nhập prompt, style, số lượng */}
        {images.length === 0 && (
          <>
            <div className="mb-6">
              <label className="block text-base font-semibold mb-2">
                Mô tả hình ảnh (prompt)
              </label>
              <textarea
                className="w-full border rounded px-4 py-3 text-base resize-none min-h-[80px]"
                placeholder="Nhập mô tả hình ảnh (prompt)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                maxLength={300}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {prompt.length}/300 ký tự
                </span>
                {errors.prompt && (
                  <span className="text-red-500 text-xs">{errors.prompt}</span>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-base font-semibold mb-2">
                Phong cách hình ảnh
              </label>
              <select
                className={`w-full border rounded px-4 py-3 text-base ${
                  errors.style ? "border-red-500" : ""
                }`}
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="">Chọn phong cách</option>
                <option value="photorealistic">Chụp thực tế</option>
                <option value="cartoon">Hoạt hình</option>
                <option value="minimal">Tối giản</option>
                <option value="vintage">Cổ điển</option>
                <option value="modern">Hiện đại</option>
              </select>
              {errors.style && (
                <p className="text-red-500 text-sm mt-1">{errors.style}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-base font-semibold mb-2">
                Số lượng hình ảnh
              </label>
              <input
                type="number"
                min={1}
                max={20}
                step={1}
                className="w-full border rounded px-4 py-3 text-base"
                value={numImages === 0 ? "" : numImages}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9]/g, "");
                  val = val ? Math.max(1, Math.min(20, Number(val))) : 0;
                  setNumImages(val);
                }}
                onBlur={(e) => {
                  if (!e.target.value || Number(e.target.value) < 1)
                    setNumImages(1);
                }}
                inputMode="numeric"
                placeholder="Nhập số lượng (1-20)"
              />
              {errors.numImages && (
                <p className="text-red-500 text-sm mt-1">{errors.numImages}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-5 py-3 bg-gray-200 rounded text-base"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                className={`px-5 py-3 rounded text-base flex items-center justify-center transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                onClick={loading ? undefined : validateAndGenImages}
                disabled={loading}
                style={{ minWidth: 120 }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin mr-2"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#fff"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="#fff"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Đang tạo...
                  </>
                ) : (
                  "Tạo hình ảnh"
                )}
              </button>
            </div>
          </>
        )}
        {/* Hiển thị ảnh đã gen và checkbox chọn */}
        {images.length > 0 && (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-4 text-lg">Chọn ảnh muốn lưu:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img, idx) => (
                  <div
                    key={img}
                    className={`relative border-2 rounded-xl p-3 flex flex-col items-center transition-all duration-200 ${
                      checked[idx]
                        ? "border-purple-600 shadow-lg"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleCheck(idx)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={img}
                      alt={`gen-${idx}`}
                      className="w-48 h-48 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-center justify-center w-full">
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                          checked[idx]
                            ? "bg-purple-600 border-purple-600"
                            : "bg-white border-gray-400"
                        }`}
                        style={{ transition: "all 0.2s" }}
                      >
                        {checked[idx] && (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 10.5L9 14.5L15 7.5"
                              stroke="#fff"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="mt-2 text-base font-medium text-gray-700">
                      {checked[idx] ? "Đã chọn" : "Chọn"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-6 py-3 bg-gray-200 rounded text-base"
                onClick={() => {
                  setImages([]);
                  setChecked([]);
                }}
                disabled={saveLoading}
              >
                Quay lại
              </button>
              <button
                className="px-6 py-3 bg-purple-600 text-white rounded text-base"
                onClick={handleSave}
                disabled={saveLoading || checked.every((c) => !c)}
              >
                {saveLoading ? "Đang lưu..." : "Lưu ảnh đã chọn"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageGenModal;
