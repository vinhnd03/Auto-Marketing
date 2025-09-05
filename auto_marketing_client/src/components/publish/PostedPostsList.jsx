import React, { useState, useEffect, useMemo } from "react";
import { Table, Input, Button, Tag, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ViewPost from "./ViewPost";
import { useParams } from "react-router-dom";
import { getSchedulesPosted } from "../../service/publish/scheduleManagerService";

const ITEMS_PER_PAGE = 5;

const PostedPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [viewingPost, setViewingPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { workspaceId } = useParams();

  useEffect(() => {
    fetchPosted(workspaceId);
  }, [workspaceId]);

  const fetchPosted = async (wid) => {
    try {
      const data = await getSchedulesPosted(wid);
      const mapped = data.map((item) => ({
        ...item,
        fanpageIds: item.fanpages ? item.fanpages.map((fp) => fp.id) : [],
      }));
      setPosts(mapped);
    } catch (err) {
      console.error("Lỗi load posted:", err);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "Không rõ";
    const clean = value.replace(" ", "T").split(".")[0];
    return dayjs(clean, "YYYY-MM-DDTHH:mm:ss").format("HH:mm DD/MM/YYYY");
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
      align: "center",
      width: 60,
      render: (_, __, idx) => (currentPage - 1) * ITEMS_PER_PAGE + idx + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: ["post", "title"],
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: ["post", "content"],
      ellipsis: true,
    },
    {
      title: "Hashtag",
      dataIndex: ["post", "hashtag"],
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      render: (status) => <Tag color="green">Đã đăng</Tag>,
    },
    {
      title: "Thời gian lên lịch",
      dataIndex: "scheduledTime",
      align: "center",
      render: (value) => formatDateTime(value),
    },
    {
      title: "Thời gian đăng",
      dataIndex: "postedAt",
      align: "center",
      render: (value) => formatDateTime(value),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            type="text"
            onClick={() => setViewingPost(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-5xl mx-auto mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <span className="text-xl font-bold text-gray-900">
          Quản lý bài viết đã đăng
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
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              type={currentPage === i + 1 ? "primary" : "default"}
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
          >
            &gt;
          </Button>
        </div>
      )}
      {viewingPost && (
        <ViewPost postData={viewingPost} onClose={() => setViewingPost(null)} />
      )}
    </div>
  );
};

export default PostedPostsList;
