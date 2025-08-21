import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditPost = ({ post, onSave, onCancel }) => {
  const [medias, setMedias] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [fanpageIds, setFanpageIds] = useState([]);
  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    hashtag: "",
    scheduledTime: "",
  });

  useEffect(() => {
    if (!post) return;
    const postData = post.post || {};

    setInitialValues({
      title: postData.title || "",
      content: postData.content || "",
      hashtag: postData.hashtag || "",
      scheduledTime: post.scheduledTime
        ? dayjs(post.scheduledTime).format("YYYY-MM-DDTHH:mm")
        : "",
    });

    setFanpageIds(post.fanpages ? post.fanpages.map((fp) => fp.id) : []);
    setMedias(postData.medias || []);
  }, [post]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề không được để trống"),
    content: Yup.string().required("Nội dung không được để trống"),
    scheduledTime: Yup.string()
      .required("Thời gian đăng không được để trống")
      .test(
        "future-date",
        "Thời gian đăng phải ở tương lai",
        (value) => value && dayjs(value).isAfter(dayjs())
      ),
  });

  const handleSubmit = (values) => {
    if (!fanpageIds || fanpageIds.length === 0) {
      return alert("Cần chọn ít nhất 1 fanpage");
    }

    const scheduleData = {
      postId: post?.post?.id || null,
      title: values.title,
      content: values.content,
      hashtag: values.hashtag,
      tone: post?.post?.tone || "",
      contentType: post?.post?.contentType || "",
      targetAudience: post?.post?.targetAudience || 1,
      fanpageIds,
      medias: medias.map((m) => ({
        id: m.id,
        url: m.url,
        type: m.type || "PIC",
      })),
      scheduledTime: dayjs(values.scheduledTime).format("YYYY-MM-DDTHH:mm:ss"),
    };

    onSave(post.id, scheduleData, newFiles);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa bài viết</h2>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tiêu đề
                </label>
                <Field
                  type="text"
                  name="title"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nội dung
                </label>
                <Field
                  as="textarea"
                  name="content"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium mb-1">
                  Thời gian đăng
                </label>
                <Field
                  type="datetime-local"
                  name="scheduledTime"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
                <ErrorMessage
                  name="scheduledTime"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Fanpage
                </label>
                {fanpageIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.fanpages.map((fp) => (
                      <span
                        key={fp.id}
                        className="px-2 py-1 text-xs bg-gray-200 rounded-full cursor-not-allowed"
                      >
                        {fp.pageName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Chưa chọn fanpage</p>
                )}
              </div>

              {/* Media */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ảnh hiện có
                </label>
                <div className="flex flex-wrap gap-3">
                  {medias.length > 0 ? (
                    medias.map((m) => (
                      <div
                        key={m.id}
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
                          onClick={() =>
                            setMedias(medias.filter((x) => x.id !== m.id))
                          }
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

              <div className="mt-3">
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
              </div>

              <div className="mt-6 flex justify-end gap-3 bottom-0 bg-white pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                >
                  Lưu
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditPost;
