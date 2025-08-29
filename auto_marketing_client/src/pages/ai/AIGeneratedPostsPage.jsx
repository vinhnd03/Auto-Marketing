import React, { useEffect, useState } from "react";
import { getPostsByTopic } from "../../service/postService";
import { Link, useParams } from "react-router-dom";
import AIContentGenerator from "../../components/ai/AIContentGenerator";

const AIGeneratedPostsPage = () => {
  const { topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalShowResults, setAIModalShowResults] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!topicId) {
          setError("Không tìm thấy topic.");
          setLoading(false);
          return;
        }
        const data = await getPostsByTopic(topicId);
        setPosts(data || []);
        // If posts exist, show results in modal when opened
        setAIModalShowResults(data && data.length > 0 ? true : false);
      } catch (err) {
        setError("Không thể tải danh sách bài viết của topic.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [topicId]);

  // Dummy topic info for modal (can be replaced with real topic data)
  useEffect(() => {
    // You may want to fetch topic info here if needed
    setSelectedTopic({ id: topicId, title: "Chủ đề hiện tại" });
  }, [topicId]);

  const handleOpenAIModal = () => {
    setShowAIModal(true);
  };
  const handleCloseAIModal = () => {
    setShowAIModal(false);
  };
  const handleContentSaved = async () => {
    // Fetch latest posts after saving
    setLoading(true);
    try {
      const data = await getPostsByTopic(topicId);
      setPosts(data || []);
      setAIModalShowResults(data && data.length > 0 ? true : false);
    } catch (err) {
      setError("Không thể tải danh sách bài viết của topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Bài viết AI đã tạo
      </h1>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleOpenAIModal}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {posts.length > 0 ? "Xem nội dung đã tạo" : "Tạo thêm nội dung"}
        </button>
      </div>
      {showAIModal && (
        <AIContentGenerator
          isOpen={showAIModal}
          onClose={handleCloseAIModal}
          selectedTopic={selectedTopic}
          onContentSaved={handleContentSaved}
          // Show results if posts exist, otherwise show settings form
          showResults={aiModalShowResults}
          previewContent={posts}
        />
      )}
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
