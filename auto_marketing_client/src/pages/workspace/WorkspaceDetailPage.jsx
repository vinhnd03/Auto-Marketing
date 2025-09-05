import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  ArrowLeft,
  Target,
  Folder,
  Wand2,
  BarChart3,
  Settings,
  MoreHorizontal,
  Send,
  Table,
  ArrowUpCircle,
} from "lucide-react";

import { countApprovedTopicsByCampaign } from "../../service/topicService";
import { getPostsByTopic, countPostsByTopic } from "../../service/postService";
import {
  generateTopicsWithAI,
  approveTopic,
  deleteTopicsByCampaignAndStatus,
  getTopicsByCampaign,
} from "../../service/topicService";
import { getWorkspaceDetail } from "../../service/workspace/workspace_service";
import campaignService from "../../service/campaignService";
import { useAuth } from "../../context/AuthContext";

import AIGeneratedTopicCard from "../../components/ai/AIGeneratedTopicCard";
import TopicContentDetail from "./TopicContentDetail";
import { AITopicGenerator, CampaignTable } from "../../components";
import SchedulePostCalendar from "../../components/publish/SchedulePostCalendar";
import ScheduledPostsList from "../../components/publish/ScheduledPostsList";
import PostedPostsList from "../../components/publish/PostedPostsList";

const WorkspaceDetailPage = () => {
  // State cho tìm kiếm campaign
  const [campaignSearch, setCampaignSearch] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showTopicGenerator, setShowTopicGenerator] = useState(false);
  // Persist AI generated topics so section remains after reload
  const [newlyCreatedTopics, setNewlyCreatedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem("newlyCreatedTopics");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedTopicForContent, setSelectedTopicForContent] = useState(null);
  const [autoGeneratingTopics, setAutoGeneratingTopics] = useState(false);
  const [approvedTopics, setApprovedTopics] = useState(new Set());
  const [savingTopics, setSavingTopics] = useState(false);
  const [apiCampaigns, setApiCampaigns] = useState([]);
  const topicsTopRef = useRef(null);
  const [topicsPageByCampaign, setTopicsPageByCampaign] = useState({});
  const [topicContentCounts, setTopicContentCounts] = useState({});
  const [totalCampaign, setTotalCampaign] = useState(0);
  const [totalCampaignFirstLoading, setTotalCampaignFirstLoading] = useState(0);
  const [confirmedPosts, setConfirmedPosts] = useState([]);
  const [topicPostCounts, setTopicPostCounts] = useState({});
  const firstLoad = true;
  const DEFAULT_TOPICS_PER_PAGE = 6;
  const { user } = useAuth();
  // Lọc danh sách bài viết đã xác nhận (mock)
  // const [posts, setPosts] = useState([]); // reserved for publish tab
  const fetchCountCampaignFirstLoading = async () => {
    try {
      const campaignNumber = await campaignService.countCampaign(user.id);
      setTotalCampaignFirstLoading(campaignNumber);
    } catch (err) {
      setTotalCampaignFirstLoading(null);
    }
  };
  // Fetch campaigns from API

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        console.log("abc:", workspaceId);
        const campaignsData = await campaignService.findAllCampaign(
          0,
          10,
          "",
          "",
          workspaceId
        );
        setApiCampaigns(campaignsData.content);
        console.log("detaiuls", apiCampaigns);
      } catch (err) {
        setApiCampaigns([]);
      }
    };

    fetchCampaigns();
    fetchCountCampaignFirstLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCampaign, workspaceId]);

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
  /* const initialWorkspace = {
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
  }; */

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
    if (!status) return null;
    // Ẩn toàn bộ badge "Nháp" và các trạng thái không xác định
    const normalized = String(status).toLowerCase();
    if (normalized === "draft" || normalized === "nháp") return null;

    const statusConfig = {
      completed: { color: "bg-gray-100 text-gray-800", text: "Hoàn thành" },
      paused: { color: "bg-red-100 text-red-800", text: "Tạm dừng" },
      active: { color: "bg-green-100 text-green-700", text: "Đang hoạt động" },
      "đang hoạt động": {
        color: "bg-green-100 text-green-700",
        text: "Đang hoạt động",
      },
      "đã kết thúc": {
        color: "bg-gray-100 text-gray-800",
        text: "Đã kết thúc",
      },
      "sắp bắt đầu": {
        color: "bg-blue-100 text-blue-700",
        text: "Sắp bắt đầu",
      },
    };

    const config = statusConfig[normalized] || statusConfig[status] || null;
    if (!config) return null;
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
        setActiveTab("campaigns");
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

    // Lấy campaignId từ topic đầu tiên (giả sử cùng campaign)
    const campaignId = newTopics[0]?.campaignId;
    if (!campaignId) {
      toast.error("Không xác định được campaign để lấy topics mới!");
      return;
    }

    try {
      // Lấy danh sách id của các topic vừa tạo
      const generatedTopicIds = newTopics.map((topic) => topic.id);

      // Gọi lại API lấy danh sách topic mới nhất từ BE
      const latestTopics = await getTopicsByCampaign(campaignId);

      // Chỉ lấy các topic vừa tạo (lọc theo id)
      const newGeneratedTopics = latestTopics.filter((topic) =>
        generatedTopicIds.includes(topic.id)
      );

      setWorkspace((prevWorkspace) => {
        const updatedWorkspace = { ...prevWorkspace };
        const campaignIndex = updatedWorkspace.campaigns.findIndex(
          (c) => c.id === campaignId
        );
        if (campaignIndex !== -1) {
          updatedWorkspace.campaigns[campaignIndex].topicsList = latestTopics;
          updatedWorkspace.campaigns[campaignIndex].topics =
            latestTopics.length;
        }
        return updatedWorkspace;
      });
      const topicIds = newGeneratedTopics.map((topic) => topic.id);
      setNewlyCreatedTopics(topicIds);
      localStorage.setItem("newlyCreatedTopics", JSON.stringify(topicIds));
      setActiveTab("topics");
      toast.dismiss();
      toast.success(
        `Đã tạo thành công ${newGeneratedTopics.length} topics mới!`
      );

      // Reload workspace to ensure new campaigns/topics are shown
      if (typeof fetchWorkspaceData === "function") {
        fetchWorkspaceData();
      }
    } catch (err) {
      toast.error("Không thể lấy danh sách topic mới từ server!");
    }
  };

  const handleHideAITopics = () => {
    setNewlyCreatedTopics([]);
    setApprovedTopics(new Set()); // Reset approved topics
    toast.dismiss();
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
      toast.loading("Đang generate thêm topics...", {
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
        `Đã tự động generate ${transformedTopics.length} topics mới!`,
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

  // Handle approve single topic, giữ vị trí scroll khi chọn checkbox
  const handleApproveTopic = (topicId) => {
    // Lưu vị trí scroll hiện tại
    const scrollY = window.scrollY;
    setApprovedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
    // Khôi phục vị trí scroll sau khi cập nhật state
    setTimeout(() => {
      window.scrollTo({ top: scrollY, behavior: "auto" });
    }, 0);
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
      localStorage.removeItem("newlyCreatedTopics");
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
  const [availableContents, setAvailableContents] = useState([]);

  // Lấy danh sách bài viết từ DB
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/all`, {
        withCredentials: true,
      })
      .then((res) => {
        const dataArray = Array.isArray(res.data) ? res.data : [];
        const formattedData = dataArray.map((p) => ({
          id: p.id.toString(),
          title: p.title,
          content: p.content,
          hashtag: p.hashtag,
          tone: p.tone,
          contentType: p.contentType,
          targetAudience: p.targetAudience,
        }));
        setAvailableContents(formattedData);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleScheduleSubmit = (posts) => {
    console.log("Posts mới được lên lịch:", posts);
    setConfirmedPosts(posts);
  };

  // const handleDeletePost = () => {};

  const fetchWorkspaceData = useCallback(async () => {
    setLoadingWorkspace(true);
    try {
      // 1. Lấy workspace từ API
      const wsData = await getWorkspaceDetail(workspaceId); // bạn cần có hàm này

      // 2. Lấy campaign theo workspace (nếu chưa có endpoint riêng bạn dùng getAllCampaigns() cũng tạm ok)
      const campaignsData =
        wsData.campaigns ??
        (await campaignService.findAllCampaign(0, 10, "", "", workspaceId))
          .content;
      // 3. Với mỗi campaign => lấy topics
      const campaignsWithTopics = await Promise.all(
        campaignsData.map(async (campaign) => {
          const topicsList = await getTopicsByCampaign(campaign.id);
          return { ...campaign, topicsList: topicsList || [] };
        })
      );

      setWorkspace({
        ...wsData,
        campaigns: campaignsWithTopics,
      });
    } catch (err) {
      toast.error("Không thể tải dữ liệu workspace từ API");
      setWorkspace(null);
    } finally {
      setLoadingWorkspace(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchWorkspaceData();
  }, [fetchWorkspaceData]);

  // Fetch content counts for visible topics when tab = topics
  useEffect(() => {
    const fetchCounts = async () => {
      if (activeTab !== "topics" || !workspace?.campaigns) return;
      const topics = workspace.campaigns.flatMap((c) => c.topicsList || []);
      const approved = topics.filter((t) =>
        ["APPROVED", "ACTIVE", "active"].includes(
          String(t.status).toUpperCase()
        )
      );
      const toFetch = approved.filter((t) => topicContentCounts[t.id] == null);
      if (toFetch.length === 0) return;
      const entries = await Promise.all(
        toFetch.map(async (t) => {
          try {
            const posts = await getPostsByTopic(t.id);
            const count = Array.isArray(posts)
              ? posts.length
              : posts?.totalElements ?? posts?.length ?? 0;
            return [t.id, count];
          } catch (_) {
            return [t.id, 0];
          }
        })
      );
      setTopicContentCounts((prev) => ({
        ...prev,
        ...Object.fromEntries(entries),
      }));
    };
    fetchCounts();
  }, [activeTab, workspace, topicContentCounts]);

  // Khi người dùng chuyển tab sang "Chủ đề", tự động refetch workspace/campaigns
  useEffect(() => {
    if (activeTab === "topics") {
      // Phát tín hiệu cho các trang khác nếu cần và làm mới dữ liệu tại chỗ
      try {
        window.dispatchEvent(new CustomEvent("campaign:refresh-active"));
      } catch (_) {}
      fetchWorkspaceData();
      // Scroll tới phần đầu của tab Chủ đề
      requestAnimationFrame(() => {
        if (topicsTopRef.current) {
          const el = topicsTopRef.current;
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    }
  }, [activeTab]);

  // Lọc campaign theo tên khi search
  useEffect(() => {
    if (!workspace || !workspace.campaigns) {
      setFilteredCampaigns([]);
      return;
    }
    const onlyActive = workspace.campaigns.filter(
      (c) => String(c.status).toUpperCase() === "ACTIVE"
    );
    if (!campaignSearch.trim()) {
      setFilteredCampaigns(onlyActive);
    } else {
      setFilteredCampaigns(
        onlyActive.filter((c) =>
          (c.name || "").toLowerCase().includes(campaignSearch.toLowerCase())
        )
      );
    }
  }, [campaignSearch, workspace]);

  // State cho tổng số topic APPROVED
  const [totalApprovedTopicsCount, setTotalApprovedTopicsCount] = useState(0);
  // Khi workspace/campaigns thay đổi, gọi API đếm topic APPROVED
  useEffect(() => {
    async function fetchTotalApprovedTopics() {
      if (!workspace || !workspace.campaigns) {
        setTotalApprovedTopicsCount(0);
        return;
      }
      let total = 0;
      for (const campaign of workspace.campaigns) {
        if (campaign.id) {
          const count = await countApprovedTopicsByCampaign(campaign.id);
          total += Number(count) || 0;
        }
      }
      setTotalApprovedTopicsCount(total);
    }
    fetchTotalApprovedTopics();
  }, [workspace]);

  // Thêm effect để fetch số lượng bài viết cho các topic đang hiển thị
  useEffect(() => {
    if (activeTab !== "topics" || !workspace?.campaigns) return;
    const topics = workspace.campaigns.flatMap((c) => c.topicsList || []);
    const approved = topics.filter((t) =>
      ["APPROVED", "ACTIVE", "active"].includes(String(t.status).toUpperCase())
    );
    const toFetch = approved.filter((t) => topicPostCounts[t.id] == null);
    if (toFetch.length === 0) return;
    Promise.all(
      toFetch.map(async (t) => {
        try {
          const count = await countPostsByTopic(t.id);
          return [t.id, Number(count) || 0];
        } catch {
          return [t.id, 0];
        }
      })
    ).then((entries) => {
      setTopicPostCounts((prev) => ({
        ...prev,
        ...Object.fromEntries(entries),
      }));
    });
  }, [activeTab, workspace, topicPostCounts]);

  if (loadingWorkspace) {
    return <div>Đang tải workspace...</div>;
  }
  if (!workspace || !workspace.campaigns) {
    return <div>Không có dữ liệu workspace</div>;
  }

  // Đã thay thế bằng totalApprovedTopicsCount từ API

  const totalContentCount = Array.isArray(workspace?.campaigns)
    ? workspace.campaigns.reduce((sum, c) => {
        if (Array.isArray(c.topicsList)) {
          const approved = c.topicsList.filter((t) =>
            ["APPROVED", "ACTIVE", "active"].includes(
              String(t.status).toUpperCase()
            )
          ).length;
          return sum + approved;
        }
        return sum + (c.content || 0);
      }, 0)
    : 0;

  // Helper: try to infer number of contents/posts for a topic coming from various shapes

  const getTopicContentCount = (topic) => {
    if (!topic || typeof topic !== "object") return 0;
    if (topicPostCounts && topic.id && topicPostCounts[topic.id] != null) {
      return topicPostCounts[topic.id];
    }
    if (
      topicContentCounts &&
      topic.id &&
      topicContentCounts[topic.id] != null
    ) {
      return topicContentCounts[topic.id];
    }
    // explicit counters first
    if (typeof topic.contentCount === "number") return topic.contentCount;
    if (typeof topic.postsCount === "number") return topic.postsCount;
    if (typeof topic.postCount === "number") return topic.postCount;
    if (typeof topic.contentsCount === "number") return topic.contentsCount;
    if (typeof topic.totalContents === "number") return topic.totalContents;
    // arrays next
    const arrayKeys = [
      "contents",
      "content",
      "posts",
      "postList",
      "postsList",
      "topicContents",
      "topicContentList",
      "contentList",
      "items",
    ];
    for (const key of arrayKeys) {
      const val = topic[key];
      if (Array.isArray(val)) return val.length;
    }
    return 0;
  };

  const stats = [
    {
      label: "Tổng chiến dịch",
      value: firstLoad ? totalCampaignFirstLoading : totalCampaign,
      color: "blue",
      icon: <Target size={24} />,
    },
    {
      label: "Tổng chủ đề",
      value: totalApprovedTopicsCount,
      color: "purple",
      icon: <Folder size={24} />,
    },
    {
      label: "Tổng content",
      value: totalContentCount,
      color: "orange",
      icon: <BarChart3 size={24} />,
    },
  ];

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
    <div className="bg-gray-50 py-4 min-h-screen">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-[9999] bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUpCircle size={32} />
        </button>
      )}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center space-x-2 md:space-x-4">
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
            <div className="flex items-center space-x-2 md:space-x-3 mt-2 md:mt-0">
              {getStatusBadge(workspace.status)}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 justify-center items-center mx-auto w-full max-w-2xl">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Hành động nhanh
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => {
                    handleQuickAction(action.action);
                  }}
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <div className="border-b border-gray-200 w-full overflow-x-auto">
              <nav className="flex flex-nowrap space-x-2 px-2 py-2 scrollbar-hide">
                {[
                  {
                    id: "campaigns",
                    label: "Chiến dịch",
                    icon: <Target size={14} />,
                  },
                  {
                    id: "topics",
                    label: "Chủ đề",
                    icon: <Folder size={14} />,
                  },
                  {
                    id: "publish",
                    label: "Đăng bài",
                    icon: <Send size={14} />,
                  },
                  {
                    id: "publishedManager",
                    label: "Quản lý bài",
                    icon: <Table size={14} />,
                  },
                  {
                    id: "postedManager",
                    label: "Lịch sử bài đăng",
                    icon: <Table size={14} />,
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full font-medium text-xs md:text-sm transition-all duration-150 whitespace-nowrap shadow-sm border ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    style={{ minWidth: "max-content" }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-2 md:p-6">
              {activeTab === "overview" && (
                <div className="space-y-4 md:space-y-6">
                  {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">*/}
                  {/*  <div>*/}
                  {/*    <h3 className="text-lg font-semibold text-gray-900 mb-4">*/}
                  {/*      Thông tin workspace*/}
                  {/*    </h3>*/}
                  {/*    <div className="space-y-3">*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <span className="text-gray-600">Template:</span>*/}
                  {/*        <span className="font-medium">*/}
                  {/*          E-commerce Marketing*/}
                  {/*        </span>*/}
                  {/*      </div>*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <span className="text-gray-600">Ngân sách:</span>*/}
                  {/*        <span className="font-medium">*/}
                  {/*          {formatCurrency(workspace.budget)}*/}
                  {/*        </span>*/}
                  {/*      </div>*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <span className="text-gray-600">Thời gian:</span>*/}
                  {/*        <span className="font-medium">*/}
                  {/*          {workspace.duration}*/}
                  {/*        </span>*/}
                  {/*      </div>*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <span className="text-gray-600">Tạo ngày:</span>*/}
                  {/*        <span className="font-medium">*/}
                  {/*          {workspace.createdAt}*/}
                  {/*        </span>*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*  <div>*/}
                  {/*    <h3 className="text-lg font-semibold text-gray-900 mb-4">*/}
                  {/*      Mục tiêu*/}
                  {/*    </h3>*/}
                  {/*    <div className="space-y-2">*/}
                  {/*      {Array.isArray(workspace.goals) &&*/}
                  {/*      workspace.goals.length > 0 ? (*/}
                  {/*        workspace.goals.map((goal, goalIndex) => (*/}
                  {/*          <div*/}
                  {/*            key={`goal-${goalIndex}-${goal}`}*/}
                  {/*            className="flex items-center space-x-2"*/}
                  {/*          >*/}
                  {/*            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>*/}
                  {/*            <span className="text-gray-700">{goal}</span>*/}
                  {/*          </div>*/}
                  {/*        ))*/}
                  {/*      ) : (*/}
                  {/*        <span className="text-gray-500">*/}
                  {/*          Chưa có mục tiêu nào*/}
                  {/*        </span>*/}
                  {/*      )}*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              )}
              {/* CAMPAIGN CUA ANH KHANH */}
              {activeTab === "campaigns" && (
                <div className="px-2 sm:px-4 md:px-8 lg:px-12">
                  <CampaignTable
                    campaigns={transformedCampaigns}
                    onUpdateCampaigns={handleUpdateCampaigns}
                    onTotalCampaignChange={setTotalCampaign}
                  />
                </div>
              )}
              {activeTab === "topics" && (
                <div className="space-y-4 md:space-y-6" ref={topicsTopRef}>
                  {/* Thanh tìm kiếm campaign */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <input
                      type="text"
                      className="w-full sm:max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      placeholder="Tìm kiếm tên chiến dịch ..."
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                    />
                    <div className="flex space-x-2 md:space-x-3 mt-2 sm:mt-0">
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
                              Generate thêm Topics
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
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
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
                              <AIGeneratedTopicCard
                                key={`ai-topic-${foundTopic.id}`}
                                topic={foundTopic}
                                campaign={foundCampaign}
                                checked={approvedTopics.has(foundTopic.id)}
                                onCheck={() =>
                                  handleApproveTopic(foundTopic.id)
                                }
                              />
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
                                Chỉ những topics được chọn mới được lưu
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
                  {/* Nếu đang xem detail content của topic */}
                  {selectedTopicForContent ? (
                    <TopicContentDetail
                      topic={selectedTopicForContent}
                      onBack={async () => {
                        setSelectedTopicForContent(null);
                        // Gọi lại API để cập nhật số bài viết cho topic vừa xem
                        if (selectedTopicForContent?.id) {
                          try {
                            const count = await countPostsByTopic(
                              selectedTopicForContent.id
                            );
                            setTopicPostCounts((prev) => ({
                              ...prev,
                              [selectedTopicForContent.id]: Number(count) || 0,
                            }));
                          } catch {
                            // Nếu lỗi thì giữ nguyên số cũ
                          }
                        }
                      }}
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
                      {filteredCampaigns.map((campaign) => {
                        // ...existing code...
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
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
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
                                        {/* Content count badge */}
                                        {(() => {
                                          const contentCount =
                                            getTopicContentCount(topic);
                                          return (
                                            <div className="mb-3">
                                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                {contentCount} bài viết
                                              </span>
                                            </div>
                                          );
                                        })()}
                                        <div className="flex items-center justify-between mt-auto">
                                          <button
                                            className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center"
                                            onClick={() => {
                                              setSelectedTopicForContent(topic);
                                            }}
                                          >
                                            Xem các bài viết
                                          </button>
                                          <button
                                            className="ml-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200 transition-colors flex items-center justify-center"
                                            title="Chỉnh sửa topic"
                                            onClick={() =>
                                              toast.success(
                                                "Chức năng đang phát triển"
                                              )
                                            }
                                          >
                                            <Settings size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Nút phân trang: Xem thêm & Thu gọn */}
                                  <div className="flex flex-wrap justify-center mt-4 md:mt-6 space-x-2 md:space-x-3 gap-y-2">
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
                                <div className="text-center py-6 md:py-8">
                                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                                    <Folder
                                      className="text-gray-400"
                                      size={24}
                                    />
                                  </div>
                                  <h5 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                                    Chưa có topics nào
                                  </h5>
                                  <p className="text-gray-600 mb-2 md:mb-4 text-sm md:text-base">
                                    Campaign "{campaign.name}" chưa có topics
                                    nào. Hãy để AI generate ra những chủ đề thú
                                    vị!
                                  </p>
                                  {campaign.status !== "completed" && (
                                    <button
                                      onClick={() =>
                                        setShowTopicGenerator(true)
                                      }
                                      className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-purple-700 transition-colors"
                                    >
                                      Generate Topics
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
                <div className="p-0 mt-0">
                  <ScheduledPostsList />
                </div>
              )}
              {activeTab === "postedManager" && (
                <div className="p-0 mt-0">
                  <PostedPostsList />
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
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
