import React, { useEffect, useState } from "react";
import { getAIGeneratedPosts } from "../../service/postService";
import { Link } from "react-router-dom";

const AIGeneratedPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAIGeneratedPosts();
        setPosts(data || []);
      } catch (err) {
        setError("Không thể tải danh sách bài viết AI.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Bài viết AI đã tạo
      </h1>
      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500">Chưa có bài viết AI nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleString()
                    : ""}
                </span>
                <Link
                  to={`/ai-generated-posts/${post.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIGeneratedPostsPage;
