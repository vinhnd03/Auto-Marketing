import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAIGeneratedPosts } from "../../service/postService";

const AIGeneratedPostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await getAIGeneratedPosts();
        const found = posts.find((p) => String(p.id) === String(id));
        if (!found) throw new Error("Không tìm thấy bài viết AI.");
        setPost(found);
      } catch (err) {
        setError(err.message || "Không thể tải bài viết AI.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        to="/ai-generated-posts"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Quay lại danh sách bài viết AI
      </Link>
      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-4">
            {post.title}
          </h1>
          <div className="text-gray-700 mb-6 whitespace-pre-line">
            {post.content}
          </div>
          <div className="text-xs text-gray-400">
            {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGeneratedPostDetailPage;
