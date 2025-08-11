import React, { useState, useMemo } from "react";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";

const ScheduledPostsList = ({ posts, onEdit, onDelete }) => {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 5;

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const timeStr = dayjs(post.time).format("HH:mm DD/MM/YYYY");
      return (
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        timeStr.includes(searchTerm)
      );
    });
  }, [posts, searchTerm]);

  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Tìm kiếm theo nội dung hoặc thời gian..."
          value={searchTerm}
          onChange={handleSearch}
          className="border px-3 py-2 rounded w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-[700px] w-full table-auto text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-2 border">Thời gian</th>
              <th className="p-2 border">Nội dung</th>
              <th className="p-2 border">Nền tảng</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map((post, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {dayjs(post.time).format("HH:mm DD/MM/YYYY")}
                </td>
                <td className="p-2 border line-clamp-1">{post.content}</td>
                <td className="p-2 border">{post.platform}</td>
                <td className="p-2 border">{post.status}</td>
                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setEditingPost(post)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setDeleteTarget(post)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedPosts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Không tìm thấy bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            ← Trước
          </button>

          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
            className={`px-3 py-1 rounded border ${
              currentPage === pageCount
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {editingPost && (
        <EditPost
          post={editingPost}
          onSave={(updatedPost) => {
            onEdit(updatedPost);
            setEditingPost(null);
          }}
          onCancel={() => setEditingPost(null)}
        />
      )}

      {/* Modal xóa */}
      {deleteTarget && (
        <DeletePost
          post={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={(post) => {
            onDelete(post);
            setDeleteTarget(null);
          }}
        />
      )}
    </>
  );
};

export default ScheduledPostsList;
