import React, { useState, useEffect, useMemo } from "react";
import { Table, Input, Button, Tag, Space } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
import { useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const ScheduledPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {workspaceId} = useParams();
  useEffect(() => {
    fetchSchedules(workspaceId);
  }, [workspaceId]);

  // Load danh sách khi mount
  // useEffect(() => {
  //   fetchSchedules();
  // }, [editingPost]);
  const fetchSchedules = async () => {
    try {
      const data = await getSchedules(workspaceId);
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

  // Ant Design columns
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: 60,
      render: (_, __, idx) => (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: ["post", "title"],
      key: "title",
      render: (text, record) => record.post?.title,
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: ["post", "content"],
      key: "content",
      render: (text, record) => record.post?.content,
      ellipsis: true,
    },
    {
      title: "Hashtag",
      dataIndex: ["post", "hashtag"],
      key: "hashtag",
      render: (text, record) => record.post?.hashtag,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "SCHEDULED" ? "gold" : "default"}>
          {status === "SCHEDULED" ? "Chờ đăng" : status}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Thời gian",
      dataIndex: "scheduledTime",
      key: "scheduledTime",
      render: (value) => formatDateTime(value),
      align: "center",
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            type="text"
            onClick={() => setViewingPost(record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            type="text"
            onClick={() => setEditingPost(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            type="text"
            danger
            onClick={() => setDeleteTarget(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-5xl mx-auto mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <span className="text-xl font-bold text-gray-900">
          Quản lý bài viết đã lên lịch
        </span>
        <div className="w-full md:w-auto">
          <Input.Search
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg"
            allowClear
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={currentPosts}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: (
            <span className="text-gray-400 italic text-base">
              Không tìm thấy bài viết nào
            </span>
          ),
        }}
        bordered
        size="middle"
        scroll={{ x: 900 }}
        className="rounded-lg overflow-hidden"
      />
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            size="middle"
            className="rounded-lg"
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              type={currentPage === i + 1 ? "primary" : "default"}
              size="middle"
              className={`rounded-lg font-semibold ${
                currentPage === i + 1 ? "" : "bg-gray-50"
              }`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            size="middle"
            className="rounded-lg"
          >
            &gt;
          </Button>
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
    </div>
  );
};

export default ScheduledPostsList;
