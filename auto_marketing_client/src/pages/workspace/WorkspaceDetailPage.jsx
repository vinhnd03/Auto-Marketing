import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AITopicGenerator,
  AIContentGenerator,
  CampaignTable,
} from "../../components";
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Folder,
  Wand2,
  BarChart3,
  Settings,
  Play,
  MoreHorizontal,
  Edit3,
  Send,
  Table,
} from "lucide-react";
import SchedulePostCalendar from "../../components/publish/SchedulePostCalendar";
import ScheduledPostsList from "../../components/publish/ScheduledPostsList";
import dayjs from "dayjs";
const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showTopicGenerator, setShowTopicGenerator] = useState(false);
  const [newlyCreatedTopics, setNewlyCreatedTopics] = useState([]);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [selectedTopicForContent, setSelectedTopicForContent] = useState(null);

  // Mock data - trong thực tế sẽ lấy từ API dựa trên workspaceId
  const initialWorkspace = {
    id: parseInt(workspaceId),
    name: "Summer Sale Campaign",
    description: "Chiến dịch khuyến mãi mùa hè 2024",
    template: "ecommerce",
    status: "active",
    createdAt: "2024-08-01",
    budget: 50000000,
    duration: "3 tháng",
    goals: ["Tăng doanh số bán hàng", "Nâng cao nhận diện thương hiệu"],
    channels: ["facebook", "instagram", "email", "google"],
    campaigns: [
      {
        id: 1,
        name: "Summer Sale Week 1",
        description: "Tuần lễ khuyến mãi đầu tiên",
        status: "active",
        startDate: "2024-08-01",
        endDate: "2024-08-07",
        budget: 15000000,
        platforms: ["Facebook", "Instagram"],
        topics: 5,
        content: 12,
        performance: { reach: 125000, engagement: 8500, conversions: 450 },
        topicsList: [
          {
            id: 1,
            title: "Top 10 sản phẩm hot nhất mùa hè",
            description:
              "Giới thiệu những sản phẩm bán chạy và được yêu thích nhất trong mùa hè này",
            campaignId: 1,
            status: "active",
            posts: 5,
            pendingPosts: 2,
            aiGenerated: true,
            createdAt: "2024-08-01",
          },
          {
            id: 2,
            title: "Tips chọn outfit mùa hè",
            description:
              "Hướng dẫn phối đồ thời trang phù hợp với thời tiết nóng bức",
            campaignId: 1,
            status: "active",
            posts: 3,
            pendingPosts: 1,
            aiGenerated: false,
            createdAt: "2024-08-02",
          },
        ],
      },
      {
        id: 2,
        name: "Flash Sale Weekend",
        description: "Sale cuối tuần với giảm giá sốc",
        status: "draft",
        startDate: "2024-08-10",
        endDate: "2024-08-11",
        budget: 8000000,
        platforms: ["Facebook", "Instagram", "Google Ads"],
        topics: 3,
        content: 6,
        performance: { reach: 0, engagement: 0, conversions: 0 },
        topicsList: [
          {
            id: 3,
            title: "Flash Sale 24h - Giảm giá sốc",
            description:
              "Thông báo về chương trình flash sale với mức giảm giá không thể bỏ lỡ",
            campaignId: 2,
            status: "draft",
            posts: 0,
            pendingPosts: 3,
            aiGenerated: true,
            createdAt: "2024-08-03",
          },
        ],
      },
    ],
  };

  // State quản lý workspace data
  const [workspace, setWorkspace] = useState(initialWorkspace);

  // Function để cập nhật campaigns
  const handleUpdateCampaigns = (updatedCampaigns) => {
    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      campaigns: updatedCampaigns,
    }));
  };

  const stats = [
    {
      label: "Tổng chiến dịch",
      value: workspace.campaigns.length,
      color: "blue",
      icon: <Target size={24} />,
    },
    {
      label: "Đang chạy",
      value: workspace.campaigns.filter((c) => c.status === "active").length,
      color: "green",
      icon: <Play size={24} />,
    },
    {
      label: "Tổng chủ đề",
      value: workspace.campaigns.reduce((sum, c) => sum + c.topics, 0),
      color: "purple",
      icon: <Folder size={24} />,
    },
    {
      label: "Tổng content",
      value: workspace.campaigns.reduce((sum, c) => sum + c.content, 0),
      color: "orange",
      icon: <BarChart3 size={24} />,
    },
  ];

  const quickActions = [
    {
      title: "Tạo Campaign mới",
      description: "Tạo chiến dịch marketing mới cho workspace",
      icon: <Target size={24} />,
      color: "from-blue-600 to-blue-700",
      action: "create-campaign",
    },
    {
      title:
        newlyCreatedTopics.length > 0
          ? "Tạo lại Chủ đề"
          : "Tạo Chủ đề đầu tiên",
      description: "AI tạo ra các chủ đề cho campaigns",
      icon: <Wand2 size={24} />,
      color: "from-purple-600 to-purple-700",
      action: "generate-topics",
    },
    {
      title: "Xem Analytics",
      description: "Phân tích hiệu suất các chiến dịch",
      icon: <BarChart3 size={24} />,
      color: "from-green-600 to-green-700",
      action: "view-analytics",
    },
    {
      title: "Cài đặt Workspace",
      description: "Quản lý thông tin và cấu hình",
      icon: <Settings size={24} />,
      color: "from-gray-600 to-gray-700",
      action: "settings",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatGradient = (color) => {
    const gradients = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    };
    return gradients[color] || gradients.blue;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Đang chạy" },
      draft: { color: "bg-yellow-100 text-yellow-800", text: "Nháp" },
      completed: { color: "bg-gray-100 text-gray-800", text: "Hoàn thành" },
      paused: { color: "bg-red-100 text-red-800", text: "Tạm dừng" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "create-campaign":
        toast.success("Tính năng đang phát triển - Tạo campaign mới");
        break;
      case "generate-topics":
        setShowTopicGenerator(true);
        break;
      case "view-analytics":
        toast.success("Tính năng đang phát triển - Analytics");
        break;
      case "settings":
        toast.success("Tính năng đang phát triển - Settings");
        break;
      default:
        break;
    }
  };

  const handleTopicGenerated = async (newTopics) => {
    console.log("Topics được tạo:", newTopics);

    // Sử dụng topics từ AITopicGenerator
    const createdTopicIds = newTopics.map((topic) => topic.id);

    // Cập nhật workspace với topics mới
    setWorkspace((prevWorkspace) => {
      const updatedWorkspace = { ...prevWorkspace };

      // Tìm campaign tương ứng và thêm topics
      newTopics.forEach((topic) => {
        const campaignIndex = updatedWorkspace.campaigns.findIndex(
          (c) => c.id === topic.campaignId
        );

        if (campaignIndex !== -1) {
          if (!updatedWorkspace.campaigns[campaignIndex].topicsList) {
            updatedWorkspace.campaigns[campaignIndex].topicsList = [];
          }
          updatedWorkspace.campaigns[campaignIndex].topicsList.push({
            ...topic,
            isNew: true,
            createdAt: new Date().toISOString().split("T")[0],
            pendingPosts: Math.floor(Math.random() * 5) + 1, // Random số content cần tạo
          });
          updatedWorkspace.campaigns[campaignIndex].topics += 1;
        }
      });

      return updatedWorkspace;
    });

    setNewlyCreatedTopics(createdTopicIds);
    setActiveTab("topics");

    toast.success(`✅ Đã tạo thành công ${newTopics.length} topics mới!`, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "linear-gradient(to right, #10b981, #059669)",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "bold",
        padding: "16px 24px",
      },
    });
  };

  const handleHideAITopics = () => {
    setNewlyCreatedTopics([]);
    toast.success("Đã ẩn section AI Topics!", {
      duration: 2000,
      style: {
        background: "#10B981",
        color: "white",
      },
    });
  };

  const handleContentGenerated = (generatedContent) => {
    console.log("Content được tạo:", generatedContent);

    // Tạo toast thông báo thành công
    toast.success(`🎉 Đã tạo thành công ${generatedContent.length} nội dung!`);

    // Đóng content generator
    setShowContentGenerator(false);
    setSelectedTopicForContent(null);

    // Có thể thêm logic để cập nhật workspace data ở đây
    // Ví dụ: cập nhật số lượng content trong campaign tương ứng
  };

  const handleSelectTopicForContent = (topicId) => {
    let selectedTopic = null;
    workspace.campaigns.forEach((campaign) => {
      if (campaign.topicsList) {
        const topic = campaign.topicsList.find((t) => t.id === topicId);
        if (topic) {
          selectedTopic = topic;
        }
      }
    });

    if (selectedTopic) {
      setSelectedTopicForContent(selectedTopic);
      setShowContentGenerator(true);
      toast.success(
        `Mở AI Content Generator cho topic: ${selectedTopic.title}`
      );
    }
  };

  //bình
  // Lọc danh sách bài viết đã xác nhận (mock)
// Ở đây mình giả sử confirmed = status === "active" và posts > 0
// Lấy danh sách nội dung khả dụng (content) từ campaign đầu tiên làm ví dụ
  const availableContents = initialWorkspace.campaigns[0].topicsList.map(topic => ({
    id: topic.id.toString(), // id dưới dạng string vì select value là string
    title: topic.title,
    content: topic.description,
  }));
  // Dạng thời gian ở đây là string để SchedulePostCalendar convert sang dayjs
  const [confirmedPosts, setConfirmedPosts] = useState([]);

// Hàm nhận dữ liệu post mới từ component con
  const handleScheduleSubmit = (posts) => {
    console.log("Posts mới được lên lịch:", posts);
    setConfirmedPosts(posts);
    // Ở đây bạn có thể gọi API lưu lên server hoặc xử lý tiếp
  };


  const initialPosts = [
  {
    id: 1,
    content: "Bài viết 1",
    time: dayjs().add(1, "day").toISOString(),
    platform: "Facebook",
    status: "pending",
  },
  {
    id: 2,
    content: "Bài viết 2",
    time: dayjs().add(2, "day").toISOString(),
    platform: "Instagram",
    status: "posted",
  },
  // Thêm bài viết mẫu...
];
  const [posts, setPosts] = useState(initialPosts);
// Xử lý chỉnh sửa bài đăng
  const handleEditPost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  // Xử lý xóa bài đăng
  const handleDeletePost = (deletedPost) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedPost.id));
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/workspace"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {workspace.name}
                </h1>
                <p className="text-gray-600">{workspace.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(workspace.status)}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${getStatGradient(
                      stat.color
                    )} rounded-lg flex items-center justify-center text-white`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Hành động nhanh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  {
                    id: "overview",
                    label: "Tổng quan",
                    icon: <BarChart3 size={16} />,
                  },
                  {
                    id: "campaigns",
                    label: "Chiến dịch",
                    icon: <Target size={16} />,
                  },
                  {
                    id: "topics",
                    label: "Chủ đề",
                    icon: <Folder size={16} />,
                  },
                  {
                    id: "publish",
                    label: "Đăng bài",
                    icon: <Send size={16} />,
                  },
                  {
                      id: "publishedManager",
                    label: "Quản lý bài",
                    icon: <Table size={16} />,
                  },
                  {
                    id: "analytics",
                    label: "Phân tích",
                    icon: <TrendingUp size={16} />,
                  },
                  {
                    id: "settings",
                    label: "Cài đặt",
                    icon: <Settings size={16} />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Thông tin workspace
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Template:</span>
                          <span className="font-medium">
                            E-commerce Marketing
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngân sách:</span>
                          <span className="font-medium">
                            {formatCurrency(workspace.budget)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thời gian:</span>
                          <span className="font-medium">
                            {workspace.duration}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tạo ngày:</span>
                          <span className="font-medium">
                            {workspace.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Mục tiêu
                      </h3>
                      <div className="space-y-2">
                        {workspace.goals.map((goal, goalIndex) => (
                          <div
                            key={`goal-${goalIndex}`}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CAMPAIGN CUA ANH KHANH */}
              {activeTab === "campaigns" && (
                <CampaignTable
                  campaigns={workspace.campaigns}
                  onUpdateCampaigns={handleUpdateCampaigns}
                />
              )}

              {activeTab === "topics" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      🎯 Topics trong workspace
                    </h3>
                    {newlyCreatedTopics.length > 0 && (
                      <button
                        onClick={() => setShowTopicGenerator(true)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center"
                      >
                        <Wand2 size={16} className="mr-2" />
                        🔄 Tạo lại Chủ đề
                      </button>
                    )}
                  </div>

                  {/* Section hiển thị topics vừa được AI tạo */}
                  {newlyCreatedTopics.length > 0 && (
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 border-2 border-purple-300 rounded-2xl overflow-hidden shadow-2xl mb-8">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                            <Wand2 className="text-white" size={28} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">
                              🎉 AI đã tạo {newlyCreatedTopics.length} topics
                              mới!
                            </h3>
                            <p className="text-purple-100 text-base">
                              Dưới đây là các topics vừa được AI tạo ra cho bạn.
                              Hãy xem và chỉnh sửa nếu cần.
                            </p>
                          </div>
                          <button
                            onClick={handleHideAITopics}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
                          >
                            <span>✕ Ẩn section</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {newlyCreatedTopics.map((topicId) => {
                            let foundTopic = null;
                            let foundCampaign = null;

                            workspace.campaigns.forEach((campaign) => {
                              const topic = campaign.topicsList?.find(
                                (t) => t.id === topicId
                              );
                              if (topic) {
                                foundTopic = topic;
                                foundCampaign = campaign;
                              }
                            });

                            if (!foundTopic) return null;

                            return (
                              <div
                                key={foundTopic.id}
                                className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-30"></div>

                                <div className="absolute -top-2 -right-2 z-10">
                                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse border-2 border-white">
                                    ⭐ AI TẠO MỚI
                                  </div>
                                </div>

                                <div className="relative z-10">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <Wand2
                                          className="text-white"
                                          size={18}
                                        />
                                      </div>
                                      <div>
                                        <div className="text-xs text-purple-600 font-medium">
                                          {foundCampaign.name}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-bold">
                                            <Wand2 size={10} className="mr-1" />
                                            AI Tạo tự động
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <h4 className="text-lg font-bold text-purple-900 mb-3 line-clamp-2">
                                    {foundTopic.title}
                                  </h4>
                                  <p className="text-purple-700 text-sm mb-4 line-clamp-3">
                                    {foundTopic.description}
                                  </p>

                                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                                    <div>
                                      <span>Posts: </span>
                                      <span className="font-medium text-purple-800">
                                        {foundTopic.posts}
                                      </span>
                                    </div>
                                    <div>
                                      <span>Pending: </span>
                                      <span className="font-medium text-purple-800">
                                        {foundTopic.pendingPosts}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleSelectTopicForContent(
                                          foundTopic.id
                                        )
                                      }
                                      className="flex-1 text-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                                    >
                                      📝 Tạo Content
                                    </button>
                                    <button className="py-2.5 px-4 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all">
                                      <Edit3 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Topics by Campaign */}
                  {workspace.campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Target className="text-white" size={20} />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {campaign.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {campaign.description}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(campaign.status)}
                        </div>
                      </div>

                      <div className="p-6">
                        {campaign.topicsList &&
                        campaign.topicsList.filter(
                          (topic) => !newlyCreatedTopics.includes(topic.id)
                        ).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {campaign.topicsList
                              .filter(
                                (topic) =>
                                  !newlyCreatedTopics.includes(topic.id)
                              )
                              .map((topic) => (
                                <div
                                  key={topic.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                                        <Folder
                                          className="text-white"
                                          size={16}
                                        />
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        {topic.aiGenerated && (
                                          <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                            <Wand2 size={10} className="mr-1" />
                                            AI
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <h5 className="font-semibold mb-2 line-clamp-2 text-gray-900">
                                    {topic.title}
                                  </h5>
                                  <p className="text-sm mb-4 line-clamp-3 text-gray-600">
                                    {topic.description}
                                  </p>

                                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                                    <div>
                                      <span>Posts: </span>
                                      <span className="font-medium text-gray-900">
                                        {topic.posts}
                                      </span>
                                    </div>
                                    <div>
                                      <span>Pending: </span>
                                      <span className="font-medium text-gray-900">
                                        {topic.pendingPosts}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleSelectTopicForContent(topic.id)
                                      }
                                      className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                    >
                                      Tạo Content
                                    </button>
                                    <button className="py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors">
                                      <Wand2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Folder className="text-gray-400" size={24} />
                            </div>
                            <h5 className="text-lg font-semibold text-gray-900 mb-2">
                              Chưa có topics nào
                            </h5>
                            <p className="text-gray-600 mb-4">
                              Campaign "{campaign.name}" chưa có topics nào. Hãy
                              để AI tạo ra những chủ đề thú vị!
                            </p>
                            {campaign.status !== "completed" && (
                              <button
                                onClick={() => setShowTopicGenerator(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                              >
                                <Wand2 size={14} className="mr-2 inline" />
                                🎯 Tạo Topics
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ĐĂNG BÀI LÊN MXH CỦA ANH BÌNH 
                Có thể tạo 1 component và truyền props vào như của anh khánh ví dụ như:
                  <CampaignTable
                  campaigns={workspace.campaigns}
                  onUpdateCampaigns={handleUpdateCampaigns}
                />
              */}

              {activeTab === "publish" && (
                <SchedulePostCalendar
                  confirmedPosts={confirmedPosts}
                  availableContents={availableContents}
                  onSubmit={handleScheduleSubmit}
                />
              )}

              {
                activeTab === "publishedManager" && (
                  <ScheduledPostsList
                    posts={posts}
    onEdit={handleEditPost}
    onDelete={handleDeletePost}
                  />
                )
              }

              {activeTab === "analytics" && (
                <div className="text-center py-12">
                  <TrendingUp
                    size={48}
                    className="text-gray-400 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-600">
                    Tính năng phân tích chi tiết đang được phát triển
                  </p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="text-center py-12">
                  <Settings size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cài đặt Workspace
                  </h3>
                  <p className="text-gray-600">
                    Tính năng cài đặt đang được phát triển
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI Topic Generator */}
          <AITopicGenerator
            isOpen={showTopicGenerator}
            onClose={() => setShowTopicGenerator(false)}
            onGenerate={handleTopicGenerated}
            campaigns={workspace.campaigns}
          />

          {/* AI Content Generator Modal */}
          <AIContentGenerator
            isOpen={showContentGenerator}
            onClose={() => {
              setShowContentGenerator(false);
              setSelectedTopicForContent(null);
            }}
            onGenerate={handleContentGenerated}
            selectedTopic={selectedTopicForContent}
            campaigns={workspace.campaigns}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
