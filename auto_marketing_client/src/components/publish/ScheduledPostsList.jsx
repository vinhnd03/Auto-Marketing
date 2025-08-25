import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { Pencil, Trash2, Eye } from "lucide-react";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";
import ViewPost from "./ViewPost";
import {
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../../service/publish/scheduleManagerService";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const ScheduledPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Load danh sách khi mount
  // useEffect(() => {
  //   fetchSchedules();
  // }, [editingPost]);
  const fetchSchedules = async () => {
    try {
      const data = await getSchedules();
      const mapped = data.map((item) => ({
        ...item,
        fanpageIds: item.fanpages ? item.fanpages.map((fp) => fp.id) : [],
      }));
      setPosts(mapped);
    } catch (err) {
      console.error("Lỗi load schedules:", err);
    }
  };
  const formatDateTime = (value) => {
    if (!value) return "Chưa đặt lịch";
    const clean = value.replace(" ", "T").split(".")[0];
    return dayjs(clean, "YYYY-MM-DDTHH:mm:ss").format("HH:mm DD/MM/YYYY");
  };

  const handleEdit = async (scheduledPostId, payload, newFiles) => {
    try {
      const saved = await updateSchedule(scheduledPostId, payload, newFiles);
      const savedWithFanpages = {
        ...saved,
        fanpageIds: saved.fanpageIds || editingPost.fanpageIds,
      };
      setPosts((prev) =>
        prev.map((p) => (p.id === saved.id ? savedWithFanpages : p))
      );
      toast.success("Cập nhật thành công!");
      setEditingPost(null);
      await fetchSchedules();
    } catch (err) {
      console.error("Lỗi update:", err.response || err);
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteSchedule(item.id);
      setPosts((prev) => prev.filter((p) => p.id !== item.id));
      setDeleteTarget(null);
      toast.success("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi delete:", err);
      toast.error("Xóa thất bại!");
    }
  };

  // --- FILTER VÀ PAGINATION ---
  const filteredPosts = useMemo(() => {
    if (!searchText) return posts;
    return posts.filter((p) => {
      const title = p.post?.title?.toLowerCase() || "";
      const content = p.post?.content?.toLowerCase() || "";
      return (
        title.includes(searchText.toLowerCase()) ||
        content.includes(searchText.toLowerCase())
      );
    });
  }, [posts, searchText]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <>
      {/* Search input */}
      <div className="mb-2 flex justify-between items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề hoặc nội dung..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1); // reset trang khi tìm kiếm
          }}
          className="border rounded px-2 py-1 w-full max-w-sm text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-[800px] w-full table-auto text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-2 border">STT</th>
              <th className="p-2 border">Tiêu đề</th>
              <th className="p-2 border">Nội dung</th>
              <th className="p-2 border">Hashtag</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Thời gian</th>
              <th className="p-2 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Không tìm thấy bài viết nào
                </td>
              </tr>
            )}
            {currentPosts.map((item, index) => {
              const post = item.post;
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="p-2 border">{post.title}</td>
                  <td className="p-2 border max-w-xs truncate">
                    {post.content}
                  </td>
                  <td className="p-2 border">{post.hashtag}</td>
                  <td className="p-2 border">
                    {item.status === "SCHEDULED" ? "Chờ đăng" : item.status}
                  </td>
                  <td className="p-2 border">
                    {formatDateTime(item.scheduledTime)}
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        onClick={() => setViewingPost(item)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => setEditingPost(item)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-2 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-2 py-1 border rounded hover:bg-gray-100 ${
                currentPage === i + 1 ? "bg-blue-100 border-blue-400" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-2 py-1 border rounded hover:bg-gray-100"
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      {viewingPost && (
        <ViewPost postData={viewingPost} onClose={() => setViewingPost(null)} />
      )}

      {editingPost && (
        <EditPost
          post={editingPost}
          onSave={handleEdit}
          onCancel={() => setEditingPost(null)}
        />
      )}

      {deleteTarget && (
        <DeletePost
          post={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ScheduledPostsList;
