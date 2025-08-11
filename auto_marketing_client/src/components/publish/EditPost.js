import { useState, useEffect } from "react";

const EditPost = ({ post, onSave, onCancel }) => {
  const [content, setContent] = useState(post?.content || "");
  const [platform, setPlatform] = useState(post?.platform || "");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (post?.time) {
      const iso = new Date(post.time).toISOString().slice(0, 16);
      setTime(iso);
    }
  }, [post]);

  const handleSave = () => {
    onSave({
      ...post,
      content,
      platform,
      time: new Date(time),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa bài viết</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nền tảng</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thời gian đăng</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
