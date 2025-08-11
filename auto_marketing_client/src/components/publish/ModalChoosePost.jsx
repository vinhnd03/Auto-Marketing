import React, { useState, useEffect } from "react";

export default function ModalChoosePost({
  date,
  confirmedPosts,
  initialPostId,
  initialPlatforms,
  status, // ✅ thêm
  onConfirm,
  onDelete,
  onClose,
}) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const isEditable = status !== "published"; // ✅

  useEffect(() => {
    if (initialPostId) {
      const post = confirmedPosts.find((p) => p.id === initialPostId);
      if (post) setSelectedPost(post);
    }
    if (initialPlatforms) {
      setSelectedPlatforms(initialPlatforms);
    }
  }, [initialPostId, initialPlatforms, confirmedPosts]);

  const togglePlatform = (platform) => {
    if (!isEditable) return;
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">{date}</h2>

        <label className="block mb-2 font-medium">Bài viết</label>
        <select
          value={selectedPost?.id || ""}
          onChange={(e) => {
            const post = confirmedPosts.find((p) => p.id === Number(e.target.value));
            setSelectedPost(post);
          }}
          disabled={!isEditable}
          className="border rounded w-full p-2 mb-4 disabled:bg-gray-100"
        >
          <option value="">-- Chọn bài viết --</option>
          {confirmedPosts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Nền tảng</label>
        <div className="flex gap-2 mb-4">
          {["Facebook", "Instagram", "Website"].map((pf) => (
            <button
              key={pf}
              onClick={() => togglePlatform(pf)}
              disabled={!isEditable}
              className={`px-3 py-1 border rounded ${
                selectedPlatforms.includes(pf) ? "bg-blue-500 text-white" : "bg-gray-100"
              } ${!isEditable && "opacity-50 cursor-not-allowed"}`}
            >
              {pf}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          {isEditable && initialPostId && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Xóa
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Đóng
          </button>
          {isEditable && (
            <button
              onClick={() => onConfirm(selectedPost, selectedPlatforms)}
              disabled={!selectedPost || selectedPlatforms.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {initialPostId ? "Cập nhật" : "Xác nhận"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
