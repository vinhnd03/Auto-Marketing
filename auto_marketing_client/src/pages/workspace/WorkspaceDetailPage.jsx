import React, { useState, useEffect } from "react";
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
import { getAllCampaigns } from "../../service/campaign_service";
import {
  generateTopicsWithAI,
  approveTopic,
} from "../../service/topic_service";
import dayjs from "dayjs";
const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showTopicGenerator, setShowTopicGenerator] = useState(false);
  const [newlyCreatedTopics, setNewlyCreatedTopics] = useState([]);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [selectedTopicForContent, setSelectedTopicForContent] = useState(null);
  const [autoGeneratingTopics, setAutoGeneratingTopics] = useState(false);
  const [approvedTopics, setApprovedTopics] = useState(new Set()); // Track approved topics
  const [savingTopics, setSavingTopics] = useState(false); // Track saving state

  // API campaigns state
  const [apiCampaigns, setApiCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignsError, setCampaignsError] = useState(null);

  // Fetch campaigns from API
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    setCampaignsError(null);
    try {
      console.log("🔄 Fetching campaigns for workspace...");
      const campaignsData = await getAllCampaigns();
      console.log("✅ Campaigns loaded for workspace:", campaignsData);
      setApiCampaigns(campaignsData);
    } catch (err) {
      console.error("❌ Error fetching campaigns for workspace:", err);
      setCampaignsError("Không thể tải danh sách chiến dịch từ API");

      // Fallback to mock data for development
      if (process.env.NODE_ENV === "development") {
        console.warn("🔄 Using mock data as fallback");
        setApiCampaigns([
          {
            id: 1,
            name: "Chiến dịch Tuyển sinh Khóa mới 2024",
            description:
              "Chiến dịch marketing tổng thể để tuyển sinh cho các khóa học lập trình mới năm 2024. Mục tiêu: 1000 học viên mới.",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15",
            status: "ACTIVE",
            startDate: "2024-02-01",
            endDate: "2024-04-30",
          },
          {
            id: 2,
            name: "Black Friday Sale Campaign",
            description:
              "Chiến dịch khuyến mãi lớn dịp Black Friday cho tất cả các khóa học online. Giảm giá lên đến 70%.",
            createdAt: "2024-01-20",
            updatedAt: "2024-01-20",
            status: "DRAFT",
            startDate: "2024-11-20",
            endDate: "2024-11-30",
          },
        ]);
      } else {
        setApiCampaigns([]);
      }
    } finally {
      setLoadingCampaigns(false);
    }
  };

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
    setApiCampaigns(updatedCampaigns);
    // Also update workspace for compatibility with other features
    setWorkspace((prevWorkspace) => ({
      ...prevWorkspace,
      campaigns: updatedCampaigns,
    }));
  };

  // Transform API campaigns to match the expected format
  const transformedCampaigns = apiCampaigns.map((campaign) => {
    let displayStatus = "Đã kết thúc";
    if (campaign.status === "ACTIVE") {
      displayStatus = "Đang hoạt động";
    } else if (campaign.status === "DRAFT") {
      displayStatus = "Sắp bắt đầu";
    }

    return {
      ...campaign,
      // Map API status to display status
      status: displayStatus,
      // Add default topics and content if not present
      topics: campaign.topics || 0,
      content: campaign.content || 0,
    };
  });

  const stats = [
    {
      label: "Tổng chiến dịch",
      value: apiCampaigns.length,
      color: "blue",
      icon: <Target size={24} />,
    },
    {
      label: "Đang chạy",
      value: apiCampaigns.filter((c) => c.status === "ACTIVE").length,
      color: "green",
      icon: <Play size={24} />,
    },
    {
      label: "Tổng chủ đề",
      value: transformedCampaigns.reduce((sum, c) => sum + c.topics, 0),
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
          ? "Generate thêm Topics"
          : "Generate Topics đầu tiên",
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
    setApprovedTopics(new Set()); // Reset approved topics
    toast.success("Đã ẩn section AI Topics!", {
      duration: 2000,
      style: {
        background: "#10B981",
        color: "white",
      },
    });
  };

  // Function để tự động generate thêm topics
  const handleAutoGenerateMoreTopics = async () => {
    try {
      setAutoGeneratingTopics(true);

      // Tìm campaign đầu tiên có sẵn để generate topics
      const activeCampaign =
        apiCampaigns.find((campaign) => campaign.status === "ACTIVE") ||
        apiCampaigns[0];

      if (!activeCampaign) {
        toast.error("Không tìm thấy campaign để tạo topics");
        return;
      }

      // Toast thông báo bắt đầu
      toast.loading("🔄 Đang generate thêm topics...", {
        id: "auto-generate",
        duration: 2000,
      });

      // Cấu hình mặc định cho auto generate
      const autoGenerateRequest = {
        campaignId: activeCampaign.id,
        numberOfTopics: 5, // Mặc định tạo 5 topics
        creativityLevel: "balanced",
        contentStyle: "professional",
        additionalInstructions:
          "Tạo thêm các topics mới, đa dạng và hấp dẫn hơn",
      };

      // Gọi API để generate topics
      const generatedTopics = await generateTopicsWithAI(autoGenerateRequest);

      console.log(
        "🔍 API returned topics:",
        generatedTopics.length,
        generatedTopics
      );
      console.log("🔍 First topic structure:", generatedTopics[0]);

      // Transform API response với unique IDs
      const timestamp = Date.now();
      const transformedTopics = generatedTopics.map((topic, index) => {
        console.log(`🔄 Transforming topic ${index}:`, topic);
        console.log(`🔑 Topic ID: ${topic.id}, Name: ${topic.name}`);

        return {
          id: `${topic.id}_${timestamp}_${index}`, // Tạo unique ID
          originalId: topic.id, // Giữ lại original ID từ API
          title: topic.name || topic.title, // Fallback cho title
          description: topic.description,
          category: "AI Generated",
          campaignId: topic.campaignId,
          campaignName: activeCampaign.name,
          posts: 0,
          pendingPosts: Math.floor(Math.random() * 5) + 1,
          publishedPosts: 0,
          engagement: "0",
          status:
            topic.status === "PENDING"
              ? "needs_content"
              : topic.status.toLowerCase(),
          aiGenerated: topic.generatedByAI,
          createdDate: topic.createdAt,
          platforms: ["Facebook", "Instagram"],
          targetKeywords: [],
          aiSettings: {
            creativity: "balanced",
            contentStyle: "professional",
          },
          aiPrompt: topic.aiPrompt,
          isNew: true,
          createdAt: new Date().toISOString().split("T")[0],
        };
      });

      console.log(
        "🔄 Transformed topics:",
        transformedTopics.length,
        transformedTopics
      );

      // Cập nhật workspace trực tiếp
      const createdTopicIds = transformedTopics.map((topic) => topic.id);
      console.log("📝 Created topic IDs:", createdTopicIds);

      setWorkspace((prevWorkspace) => {
        const updatedWorkspace = { ...prevWorkspace };

        // Tìm campaign cần cập nhật
        const campaignIndex = updatedWorkspace.campaigns.findIndex(
          (c) => c.id === activeCampaign.id
        );

        if (campaignIndex !== -1) {
          if (!updatedWorkspace.campaigns[campaignIndex].topicsList) {
            updatedWorkspace.campaigns[campaignIndex].topicsList = [];
          }

          // Xóa các topics cũ có isNew flag trước khi thêm mới
          const existingTopics = updatedWorkspace.campaigns[
            campaignIndex
          ].topicsList.filter((t) => !t.isNew);
          console.log(
            "🗑️ Existing topics after cleanup:",
            existingTopics.length
          );

          // Thêm tất cả topics mới
          updatedWorkspace.campaigns[campaignIndex].topicsList = [
            ...existingTopics,
            ...transformedTopics,
          ];

          console.log(
            "➕ Total topics after adding:",
            updatedWorkspace.campaigns[campaignIndex].topicsList.length
          );
          console.log("🆕 New topics added:", transformedTopics.length);

          // Cập nhật count
          updatedWorkspace.campaigns[campaignIndex].topics =
            updatedWorkspace.campaigns[campaignIndex].topicsList.length;
        }

        return updatedWorkspace;
      });

      // Set topics mới ngay lập tức
      setNewlyCreatedTopics(createdTopicIds);
      setApprovedTopics(new Set()); // Reset approved topics khi generate mới
      console.log("🎯 Set newlyCreatedTopics:", createdTopicIds);
      setActiveTab("topics");

      // Chỉ 1 toast duy nhất ở góc phải
      toast.success(
        `🎉 Đã tự động generate ${transformedTopics.length} topics mới!`,
        {
          id: "auto-generate",
          duration: 4000,
          position: "top-right",
        }
      );
    } catch (error) {
      console.error("Error auto-generating topics:", error);

      let errorMessage = "Không thể generate topics tự động. Vui lòng thử lại.";
      if (error.message.includes("timeout")) {
        errorMessage =
          "AI generation mất quá nhiều thời gian. Vui lòng thử lại.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Không thể kết nối đến server AI.";
      }

      toast.error(errorMessage, {
        id: "auto-generate",
        duration: 5000,
      });
    } finally {
      setAutoGeneratingTopics(false);
    }
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

  // Handle approve single topic
  const handleApproveTopic = (topicId) => {
    setApprovedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId); // Toggle off if already approved
      } else {
        newSet.add(topicId); // Approve topic
      }
      return newSet;
    });
  };

  // Save approved topics to database
  const handleSaveApprovedTopics = async () => {
    if (approvedTopics.size === 0) {
      toast.error("Vui lòng chọn ít nhất 1 topic để lưu!", {
        duration: 3000,
      });
      return;
    }

    setSavingTopics(true);
    const loadingToast = toast.loading(
      `Đang lưu ${approvedTopics.size} topics...`
    );

    try {
      const approvedTopicsList = Array.from(approvedTopics);
      console.log("💾 Saving approved topics:", approvedTopicsList);

      // Debug: Check topic structure
      const topicsToApprove = approvedTopicsList
        .map((topicId) => {
          const topic = findTopicById(topicId);
          console.log("🔍 Topic found:", topic);
          return topic;
        })
        .filter((topic) => topic != null);

      console.log("📋 Topics to approve:", topicsToApprove);

      // Call API to approve each topic
      const approvePromises = topicsToApprove.map(async (topic) => {
        try {
          // Dùng topic.id (số nguyên) để gọi API
          if (!topic.id) {
            console.error("❌ No id found for topic:", topic);
            return null;
          }
          const result = await approveTopic(topic.id);
          return result;
        } catch (error) {
          console.error("❌ Error approving topic:", topic.id, error);
          return null;
        }
      });

      const approvedResults = await Promise.all(approvePromises);
      const successCount = approvedResults.filter(
        (result) => result !== null
      ).length;

      toast.dismiss(loadingToast);

      if (successCount > 0) {
        toast.success(
          `🎉 Đã lưu thành công ${successCount} topics vào database!`,
          {
            duration: 4000,
          }
        );

        // Hide the AI topics section after saving
        setNewlyCreatedTopics([]);
        setApprovedTopics(new Set());

        // Optionally refresh workspace data here
        // await refreshWorkspaceData();
      } else {
        toast.error("Không thể lưu topics. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("❌ Error saving topics:", error);
      toast.dismiss(loadingToast);

      let errorMessage = "Không thể lưu topics. Vui lòng thử lại.";
      if (error.message.includes("timeout")) {
        errorMessage = "Lưu topics mất quá nhiều thời gian. Vui lòng thử lại.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Không thể kết nối đến server.";
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setSavingTopics(false);
    }
  };

  // Helper function to find topic by ID
  const findTopicById = (topicId) => {
    let foundTopic = null;
    workspace.campaigns.forEach((campaign) => {
      const topic = campaign.topicsList?.find((t) => t.id === topicId);
      if (topic) {
        foundTopic = topic;
      }
    });
    return foundTopic;
  };

  //bình
  // Lọc danh sách bài viết đã xác nhận (mock)
  // Ở đây mình giả sử confirmed = status === "active" và posts > 0
  // Lấy danh sách nội dung khả dụng (content) từ campaign đầu tiên làm ví dụ
  const availableContents = initialWorkspace.campaigns[0].topicsList.map(
    (topic) => ({
      id: topic.id.toString(), // id dưới dạng string vì select value là string
      title: topic.title,
      content: topic.description,
    })
  );
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
    <div className="bg-gray-50 py-8">
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
                <div>
                  {loadingCampaigns && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                      <span className="text-gray-600">
                        Đang tải chiến dịch...
                      </span>
                    </div>
                  )}

                  {campaignsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <div className="text-red-600 mr-2">⚠️</div>
                        <div>
                          <h4 className="font-medium text-red-900">
                            Lỗi tải dữ liệu
                          </h4>
                          <p className="text-red-700 text-sm mt-1">
                            {campaignsError}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={fetchCampaigns}
                        className="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        🔄 Thử lại
                      </button>
                    </div>
                  )}

                  {!loadingCampaigns && (
                    <CampaignTable
                      campaigns={transformedCampaigns}
                      onUpdateCampaigns={handleUpdateCampaigns}
                    />
                  )}
                </div>
              )}

              {activeTab === "topics" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      🎯 Topics trong workspace
                    </h3>
                    <div className="flex space-x-3">
                      {/* Nút để mở form tùy chỉnh */}
                      <button
                        onClick={() => setShowTopicGenerator(true)}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center"
                      >
                        <Settings size={16} className="mr-2" />
                        ⚙️ Generate tùy chỉnh
                      </button>

                      {/* Nút generate nhanh */}
                      {newlyCreatedTopics.length > 0 && (
                        <button
                          onClick={handleAutoGenerateMoreTopics}
                          disabled={autoGeneratingTopics}
                          className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all flex items-center ${
                            autoGeneratingTopics
                              ? "opacity-75 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {autoGeneratingTopics ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Đang generate...
                            </>
                          ) : (
                            <>
                              <Wand2 size={16} className="mr-2" />
                              🔄 Generate thêm Topics
                            </>
                          )}
                        </button>
                      )}
                    </div>
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
                              🎉 AI đã generate {newlyCreatedTopics.length}{" "}
                              topics mới!
                            </h3>
                            <p className="text-purple-100 text-base">
                              Dưới đây là các topics vừa được AI generate ra cho
                              bạn. Hãy xem và chỉnh sửa nếu cần.
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
                                key={`ai-topic-${foundTopic.id}-${Date.now()}`}
                                className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-30"></div>

                                <div className="absolute -top-2 -right-2 z-10">
                                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse border-2 border-white">
                                    ⭐ AI TẠO MỚI
                                  </div>
                                </div>

                                <div className="relative z-10">
                                  {/* Checkbox để approve topic */}
                                  <div className="flex items-center justify-between mb-4">
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
                                            AI Generate
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Checkbox approve */}
                                    <label className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={approvedTopics.has(
                                          foundTopic.id
                                        )}
                                        onChange={() =>
                                          handleApproveTopic(foundTopic.id)
                                        }
                                        className="sr-only"
                                      />
                                      <div
                                        className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                                          approvedTopics.has(foundTopic.id)
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "border-gray-300 hover:border-green-400"
                                        }`}
                                      >
                                        {approvedTopics.has(foundTopic.id) && (
                                          <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      <span className="ml-2 text-sm font-medium text-gray-700">
                                        {approvedTopics.has(foundTopic.id)
                                          ? "Đã chọn"
                                          : "Chọn lưu"}
                                      </span>
                                    </label>
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
                                      <span>Status: </span>
                                      <span
                                        className={`font-medium ${
                                          approvedTopics.has(foundTopic.id)
                                            ? "text-green-600"
                                            : "text-orange-600"
                                        }`}
                                      >
                                        {approvedTopics.has(foundTopic.id)
                                          ? "APPROVED"
                                          : "PENDING"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-2">
                                      {approvedTopics.has(foundTopic.id)
                                        ? "✅ Topic này sẽ được lưu vào database"
                                        : "⏳ Chọn checkbox để approve topic này"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Nút lưu approved topics */}
                        <div className="mt-8 border-t border-purple-200 pt-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                Đã chọn: {approvedTopics.size}/
                                {newlyCreatedTopics.length} topics
                              </span>
                              <p className="text-xs mt-1">
                                Chỉ những topics được chọn mới được lưu vào
                                database
                              </p>
                            </div>

                            <button
                              onClick={handleSaveApprovedTopics}
                              disabled={
                                savingTopics || approvedTopics.size === 0
                              }
                              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                                approvedTopics.size === 0
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : savingTopics
                                  ? "bg-blue-400 text-white cursor-not-allowed"
                                  : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                              }`}
                            >
                              {savingTopics ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Đang lưu...</span>
                                </>
                              ) : (
                                <>
                                  <span>💾</span>
                                  <span>
                                    Lưu Topics ({approvedTopics.size})
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
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
                              .map((topic, topicIndex) => (
                                <div
                                  key={`campaign-${campaign.id}-topic-${topic.id}-${topicIndex}`}
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
                              để AI generate ra những chủ đề thú vị!
                            </p>
                            {campaign.status !== "completed" && (
                              <button
                                onClick={() => setShowTopicGenerator(true)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                              >
                                <Wand2 size={14} className="mr-2 inline" />
                                🎯 Generate Topics
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

              {activeTab === "publishedManager" && (
                <ScheduledPostsList
                  posts={posts}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              )}

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
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
