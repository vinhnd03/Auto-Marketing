// src/components/modal/EditPostModal.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { updatePost, updatePostV2 } from "../../service/postService";

const EditPostModal = ({ isOpen, onClose, post, onUpdated, topicId }) => {
  const [medias, setMedias] = useState([]); // Ảnh cũ (từ API)
  const [newFiles, setNewFiles] = useState([]); // Ảnh mới upload

  useEffect(() => {
  if (post) {
    if (post.medias && post.medias.length > 0) {
      setMedias(post.medias); // có id thật từ DB
    } else if (post.imageUrls && post.imageUrls.length > 0) {
      setMedias(
        post.imageUrls.map((url) => ({
          id: null,   // ảnh chưa có trong DB
          url,
          type: "PIC"
        }))
      );
    } else {
      setMedias([]);
    }
  }
}, [post]);


  if (!isOpen) return null;

  const initialValues = {
    content: post?.content || "",
    hashtag: post?.hashtag || "",
    scheduledTime: post?.scheduledTime
      ? dayjs(post.scheduledTime).format("YYYY-MM-DDTHH:mm")
      : "",
  };

  const validationSchema = Yup.object({
    content: Yup.string().required("Nội dung không được để trống"),
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isLt10Mb = file.size <= 10 * 1024 * 1024;
      if (!isImage) toast.error(`${file.name} không phải file ảnh`);
      if (!isLt10Mb) toast.error(`${file.name} vượt quá 10MB`);
      return isImage && isLt10Mb;
    });
    if (validFiles.length > 0) setNewFiles((prev) => [...prev, ...validFiles]);
  };
const handleSubmit = async (values, { setSubmitting }) => {
  try {
    // 1. Xác định ảnh bị xoá (có id trong DB nhưng không còn trong medias)
    const deletedMediaIds =
      post.medias?.filter((m) => !medias.some((x) => x.id === m.id))
        .map((m) => m.id) || [];

    // 2. Chuẩn bị dữ liệu update
    const updateData = {
      content: values.content,
      hashtag: values.hashtag,
      topicId: topicId || null,
      medias: medias.map((m) => ({
        id: m.id ?? null,
        url: m.url,
        type: m.type ?? "PIC"
      })),
      deletedMediaIds // gửi danh sách id bị xoá
    };

    // 3. Gọi API
    let updated;
    if (newFiles.length === 0) {
      // không upload ảnh mới
      updated = await updatePostV2(post.id, updateData, false);
    } else {
      // có ảnh mới thì phải dùng FormData
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(updateData)], { type: "application/json" })
      );
      newFiles.forEach((file) => formData.append("files", file));
      updated = await updatePostV2(post.id, formData, true);
    }

    // 4. Reset state
    setNewFiles([]);
    setMedias(updated.medias || []);
    onUpdated(updated);
    onClose();
    toast.success("Cập nhật bài viết thành công!");
  } catch (err) {
    console.error(err);
    toast.error("Có lỗi khi cập nhật bài viết!");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">✏️ Chỉnh sửa bài viết</h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Nội dung */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nội dung
                </label>
                <Field
                  as="textarea"
                  name="content"
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              {/* Hashtag */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hashtag
                </label>
                <Field
                  type="text"
                  name="hashtag"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>

              {/* Ảnh cũ */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ảnh hiện có
                </label>
                <div className="flex flex-wrap gap-3">
                  {medias.length > 0 ? (
  medias.map((m, index) => (
    <div
      key={m.id ?? `${m.url}-${index}`}   // dùng id nếu có, nếu null thì fallback = url + index
      className="relative w-28 h-28 border rounded overflow-hidden"
    >
      <img
        src={m.url}
        alt="media"
        className="object-cover w-full h-full"
      />
      <button
        type="button"
        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow"
        onClick={() => setMedias(medias.filter((x, i) => i !== index))}
      >
        ✕
      </button>
    </div>
  ))
) : (
  <p className="text-xs text-gray-500">Không có ảnh nào</p>
)}

                </div>
              </div>

              {/* Thêm ảnh mới */}
              {/* <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Thêm ảnh mới
                </label>
                <div
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <span className="text-3xl text-gray-400">＋</span>
                  <p className="text-sm text-gray-500 mt-1">Nhấn để chọn ảnh</p>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {newFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {newFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative w-28 h-28 border rounded-lg overflow-hidden shadow"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow"
                          onClick={() =>
                            setNewFiles(newFiles.filter((_, i) => i !== idx))
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditPostModal;
