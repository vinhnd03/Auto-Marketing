import TopicContentList from "../../components/ai/TopicContentList";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import TopicContentDetail from "./TopicContentDetail";
import { AITopicGenerator, CampaignTable } from "../../components";
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
  Send,
  Table,
} from "lucide-react";
import SchedulePostCalendar from "../../components/publish/SchedulePostCalendar";
import ScheduledPostsList from "../../components/publish/ScheduledPostsList";
import { getAllCampaigns } from "../../service/campaign_service";
import {
  generateTopicsWithAI,
  approveTopic,
  deleteTopicsByCampaignAndStatus,
  getTopicsByCampaign,
} from "../../service/topic_service";
import dayjs from "dayjs";
const WorkspaceDetailPage = () => {
  const { workspaceId } = useParams();
  // Hooks phải nằm ở đầu function component
  const [workspace, setWorkspace] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
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
  // XÓA các biến/hook không dùng
  // Phân trang topic cho mỗi campaign
  const DEFAULT_TOPICS_PER_PAGE = 6;
  const [topicsPageByCampaign, setTopicsPageByCampaign] = useState({});
  // Lọc danh sách bài viết đã xác nhận (mock)
  const [confirmedPosts, setConfirmedPosts] = useState([]);
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
  ];
  const [posts, setPosts] = useState(initialPosts);

  // Fetch campaigns from API
  const fetchCampaigns = async () => {
    try {
      const campaignsData = await getAllCampaigns();
      setApiCampaigns(campaignsData);
    } catch (err) {
      setApiCampaigns([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Reset phân trang khi workspace thay đổi
  useEffect(() => {
    if (workspace && workspace.campaigns) {
      const initialPages = {};
      workspace.campaigns.forEach((c) => {
        initialPages[c.id] = DEFAULT_TOPICS_PER_PAGE;
      });
      setTopicsPageByCampaign(initialPages);
    }
  }, [workspace]);

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
      },
      // ...other campaigns
    ],
  };

  const handleUpdateCampaigns = (updatedCampaigns) => {
    setApiCampaigns(updatedCampaigns);
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

  // Đã thay thế bằng setSelectedTopicForContent(topic) trực tiếp trong nút 'Xem Content'

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

  const handleSaveApprovedTopics = async () => {
    if (approvedTopics.size === 0) {
      toast.error("Vui lòng chọn ít nhất 1 topic để lưu!", { duration: 3000 });
      return;
    }

    setSavingTopics(true);
    const loadingToast = toast.loading(
      `Đang lưu ${approvedTopics.size} topics...`
    );

    try {
      // 1. Lưu các topic được chọn
      const approvedTopicsList = Array.from(approvedTopics);
      const topicsToApprove = approvedTopicsList
        .map((topicId) => findTopicById(topicId))
        .filter((topic) => topic != null);

      const approvePromises = topicsToApprove.map(async (topic) => {
        if (!topic.id) {
          console.error("❌ No id found for topic:", topic);
          return null;
        }
        return await approveTopic(topic.id);
      });

      await Promise.all(approvePromises);

      // 2. Xóa tất cả topic PENDING của campaign (gọi API xóa hàng loạt)
      let campaignIdReload = null;
      if (topicsToApprove.length > 0) {
        campaignIdReload = topicsToApprove[0].campaignId;
        await deleteTopicsByCampaignAndStatus(campaignIdReload, "PENDING");
      }

      // 3. Reload lại danh sách topic từ API cho campaign liên quan
      if (campaignIdReload) {
        const updatedTopicsList = await getTopicsByCampaign(campaignIdReload);
        setWorkspace((prevWorkspace) => {
          const updatedCampaigns = prevWorkspace.campaigns.map((campaign) =>
            campaign.id === campaignIdReload
              ? { ...campaign, topicsList: updatedTopicsList || [] }
              : campaign
          );
          return { ...prevWorkspace, campaigns: updatedCampaigns };
        });
      } else {
        // fallback: filter local nếu không xác định được campaign
        setWorkspace((prevWorkspace) => {
          const updatedCampaigns = prevWorkspace.campaigns.map((campaign) => ({
            ...campaign,
            topicsList: campaign.topicsList
              ? campaign.topicsList.filter((t) => t.status === "APPROVED")
              : [],
          }));
          return { ...prevWorkspace, campaigns: updatedCampaigns };
        });
      }

      toast.dismiss(loadingToast);
      toast.success(`Đã lưu thành công các topic mà bạn đã chọn!`, {
        duration: 4000,
      });
      setNewlyCreatedTopics([]);
      setApprovedTopics(new Set());
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Không thể lưu hoặc xóa topics. Vui lòng thử lại.");
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
  const availableContents =
    initialWorkspace.campaigns &&
    initialWorkspace.campaigns[0] &&
    Array.isArray(initialWorkspace.campaigns[0].topicsList)
      ? initialWorkspace.campaigns[0].topicsList.map((topic) => ({
          id: topic.id.toString(),
          title: topic.title,
          content: topic.description,
        }))
      : [];
  // Hàm nhận dữ liệu post mới từ component con
  const handleScheduleSubmit = (posts) => {
    console.log("Posts mới được lên lịch:", posts);
    setConfirmedPosts(posts);
    // Ở đây bạn có thể gọi API lưu lên server hoặc xử lý tiếp
  };
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

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setLoadingWorkspace(true);
      try {
        // Lấy campaigns thật từ API
        const campaignsData = await getAllCampaigns();
        const campaignsWithTopics = await Promise.all(
          campaignsData.map(async (campaign) => {
            const topicsList = await getTopicsByCampaign(campaign.id);
            return { ...campaign, topicsList: topicsList || [] };
          })
        );
        setWorkspace({
          id: parseInt(workspaceId),
          name: "Tên workspace từ API nếu có",
          description: "Mô tả workspace từ API nếu có",
          campaigns: campaignsWithTopics,
        });
      } catch (err) {
        toast.error("Không thể tải dữ liệu workspace từ API");
        setWorkspace(null);
      } finally {
        setLoadingWorkspace(false);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  if (loadingWorkspace) {
    return <div>Đang tải workspace...</div>;
  }
  if (!workspace || !workspace.campaigns) {
    return <div>Không có dữ liệu workspace</div>;
  }

  const stats = [
    {
      label: "Tổng chiến dịch",
      value: workspace && workspace.campaigns ? workspace.campaigns.length : 0,
      color: "blue",
      icon: <Target size={24} />,
    },
    {
      label: "Đang chạy",
      value: apiCampaigns
        ? apiCampaigns.filter((c) => c.status === "ACTIVE").length
        : 0,
      color: "green",
      icon: <Play size={24} />,
    },
    {
      label: "Tổng chủ đề",
      value: Array.isArray(transformedCampaigns)
        ? transformedCampaigns.reduce((sum, c) => sum + (c.topics || 0), 0)
        : 0,
      color: "purple",
      icon: <Folder size={24} />,
    },
    {
      label: "Tổng content",
      value:
        workspace && Array.isArray(workspace.campaigns)
          ? workspace.campaigns.reduce((sum, c) => sum + (c.content || 0), 0)
          : 0,
      color: "orange",
      icon: <BarChart3 size={24} />,
    },
  ];
  // Phân trang topic cho mỗi campaign
  // XÓA các khai báo trùng lặp phía dưới (nếu còn)

  // Đã có hook useEffect ở đầu function, xóa đoạn lặp lại này

  const handleShowMoreTopics = (campaignId, totalTopics) => {
    setTopicsPageByCampaign((prev) => ({
      ...prev,
      [campaignId]: Math.min(
        (prev[campaignId] || DEFAULT_TOPICS_PER_PAGE) + DEFAULT_TOPICS_PER_PAGE,
        totalTopics
      ),
    }));
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
                        {Array.isArray(workspace.goals) &&
                        workspace.goals.length > 0 ? (
                          workspace.goals.map((goal, goalIndex) => (
                            <div
                              key={`goal-${goalIndex}-${goal}`}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-700">{goal}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            Chưa có mục tiêu nào
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CAMPAIGN CUA ANH KHANH */}
              {activeTab === "campaigns" && (
                <div>
                  <CampaignTable
                    campaigns={transformedCampaigns}
                    onUpdateCampaigns={handleUpdateCampaigns}
                  />
                </div>
              )}

              {activeTab === "topics" && (
                <div className="space-y-6">
                  {/* Nếu đang xem detail content của topic */}
                  {selectedTopicForContent ? (
                    <TopicContentDetail
                      topic={selectedTopicForContent}
                      onBack={() => setSelectedTopicForContent(null)}
                    />
                  ) : !workspace || !Array.isArray(workspace.campaigns) ? (
                    <div className="text-center py-8 text-gray-500">
                      Không có dữ liệu workspace hoặc danh sách campaigns.
                    </div>
                  ) : workspace.campaigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Workspace chưa có campaign nào.
                    </div>
                  ) : (
                    <>
                      {/* Danh sách các campaign và topic đã có */}
                      {workspace.campaigns.map((campaign) => {
                        // Lấy danh sách topic đã approved
                        const topicsListArr = Array.isArray(campaign.topicsList)
                          ? campaign.topicsList
                          : [];
                        const approvedTopics = topicsListArr.filter(
                          (topic) =>
                            topic.status === "APPROVED" ||
                            topic.status === "active" ||
                            topic.status === "ACTIVE"
                        );
                        const pageSize =
                          topicsPageByCampaign[campaign.id] ||
                          DEFAULT_TOPICS_PER_PAGE;
                        const visibleTopics = approvedTopics.slice(0, pageSize);
                        const hasMore =
                          approvedTopics.length > visibleTopics.length;
                        return (
                          <div
                            key={campaign.id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6"
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
                              {visibleTopics.length > 0 ? (
                                <>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {visibleTopics.map((topic, topicIndex) => (
                                      <div
                                        key={`campaign-${campaign.id}-topic-${topic.id}-${topicIndex}`}
                                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                                      >
                                        <div className="flex items-center mb-3">
                                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 mr-2">
                                            <Folder
                                              className="text-white"
                                              size={20}
                                            />
                                          </div>
                                          {topic.aiGenerated && (
                                            <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-bold ml-2">
                                              <Wand2
                                                size={12}
                                                className="mr-1"
                                              />
                                              AI
                                            </div>
                                          )}
                                        </div>
                                        <h5 className="font-semibold text-base mb-1 text-gray-900">
                                          {topic.name || topic.title}
                                        </h5>
                                        <p className="text-sm mb-3 text-gray-600">
                                          {topic.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                          <button
                                            className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center"
                                            onClick={() => {
                                              setSelectedTopicForContent(topic);
                                            }}
                                          >
                                            Xem Content
                                          </button>
                                          <button
                                            className="ml-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200 transition-colors flex items-center justify-center"
                                            title="Chỉnh sửa topic"
                                            disabled
                                          >
                                            <Settings size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Nút phân trang: Xem thêm & Thu gọn */}
                                  <div className="flex justify-center mt-6 space-x-3">
                                    {hasMore &&
                                      pageSize > DEFAULT_TOPICS_PER_PAGE && (
                                        <>
                                          <button
                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all"
                                            onClick={() =>
                                              handleShowMoreTopics(
                                                campaign.id,
                                                approvedTopics.length
                                              )
                                            }
                                          >
                                            Xem thêm
                                          </button>
                                          <button
                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition-all"
                                            onClick={() =>
                                              setTopicsPageByCampaign(
                                                (prev) => ({
                                                  ...prev,
                                                  [campaign.id]:
                                                    DEFAULT_TOPICS_PER_PAGE,
                                                })
                                              )
                                            }
                                          >
                                            Thu gọn
                                          </button>
                                        </>
                                      )}
                                    {!hasMore &&
                                      pageSize > DEFAULT_TOPICS_PER_PAGE && (
                                        <button
                                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition-all"
                                          onClick={() =>
                                            setTopicsPageByCampaign((prev) => ({
                                              ...prev,
                                              [campaign.id]:
                                                DEFAULT_TOPICS_PER_PAGE,
                                            }))
                                          }
                                        >
                                          Thu gọn
                                        </button>
                                      )}
                                    {hasMore &&
                                      pageSize === DEFAULT_TOPICS_PER_PAGE && (
                                        <button
                                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition-all"
                                          onClick={() =>
                                            handleShowMoreTopics(
                                              campaign.id,
                                              approvedTopics.length
                                            )
                                          }
                                        >
                                          Xem thêm
                                        </button>
                                      )}
                                  </div>
                                </>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Folder
                                      className="text-gray-400"
                                      size={24}
                                    />
                                  </div>
                                  <h5 className="text-lg font-semibold text-gray-900 mb-2">
                                    Chưa có topics nào
                                  </h5>
                                  <p className="text-gray-600 mb-4">
                                    Campaign "{campaign.name}" chưa có topics
                                    nào. Hãy để AI generate ra những chủ đề thú
                                    vị!
                                  </p>
                                  {campaign.status !== "completed" && (
                                    <button
                                      onClick={() =>
                                        setShowTopicGenerator(true)
                                      }
                                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                    >
                                      <Wand2
                                        size={14}
                                        className="mr-2 inline"
                                      />
                                      🎯 Generate Topics
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
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
          {/* Hiển thị danh sách content của topic đã chọn ngay trong tab Chủ đề */}
          {/* ...đã render detail content trong tab Chủ đề, không cần modal cũ... */}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
