import React, { useEffect, useState } from "react";
import { Table, Tag, Spin } from "antd";
import { getInsightsByTargetId } from "../service/insightService";

const PostTargetTable = ({ targets }) => {
  const [insights, setInsights] = useState({}); // { targetId: {likeCount, commentCount, shareCount} }

  useEffect(() => {
    if (targets && targets.length > 0) {
      targets.forEach((t) => {
        getInsightsByTargetId(t.id).then((data) => {
          setInsights((prev) => ({
            ...prev,
            [t.id]: data,
          }));
        });
      });
    }
  }, [targets]);

  const columns = [
    {
      title: "Fanpage",
      dataIndex: ["fanpage", "name"],
      key: "fanpage",
    },
    {
      title: "Post URL",
      dataIndex: "postUrl",
      key: "postUrl",
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer">
            Xem bài viết
          </a>
        ) : (
          <Tag color="red">Chưa đăng</Tag>
        ),
    },
    {
      title: "Likes",
      key: "likes",
      render: (_, record) =>
        insights[record.id] ? insights[record.id].likeCount : <Spin size="small" />,
    },
    {
      title: "Comments",
      key: "comments",
      render: (_, record) =>
        insights[record.id] ? insights[record.id].commentCount : <Spin size="small" />,
    },
    {
      title: "Shares",
      key: "shares",
      render: (_, record) =>
        insights[record.id] ? insights[record.id].shareCount : <Spin size="small" />,
    },
  ];

  return <Table rowKey="id" columns={columns} dataSource={targets} pagination={false} />;
};

export default PostTargetTable;
