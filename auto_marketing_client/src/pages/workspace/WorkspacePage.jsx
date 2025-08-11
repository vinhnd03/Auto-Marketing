import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SelectSocialNetwork from "./../../components/modal/SelectSocialNetwork";
import {
  Plus,
  Folder,
  Calendar,
  Users,
  Trash2,
  Edit3,
  ChevronRight,
  ChevronLeft,
  Target,
  Megaphone,
  TrendingUp,
  Zap,
  Globe,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Check,
  X,
} from "lucide-react";
import SelectPagesModal from "../../components/modal/SelectPagesModal";

const WorkspacePage = () => {
  const [workspaces, setWorkspaces] = useState([
    {
      id: 1,
      name: "Summer Sale Campaign",
      description: "Chiến dịch khuyến mãi mùa hè 2024",
      createdAt: "2024-08-01",
      campaigns: 5,
      members: 3,
      status: "active",
      template: "ecommerce",
      budget: 50000000,
      duration: "3 tháng",
    },
    {
      id: 2,
      name: "Product Launch",
      description: "Ra mắt sản phẩm mới iPhone 15",
      createdAt: "2024-07-15",
      campaigns: 8,
      members: 5,
      status: "completed",
      template: "product-launch",
      budget: 100000000,
      duration: "6 tháng",
    },
    {
      id: 3,
      name: "Brand Awareness",
      description: "Nâng cao nhận diện thương hiệu",
      createdAt: "2024-07-01",
      campaigns: 12,
      members: 7,
      status: "active",
      template: "brand-awareness",
      budget: 75000000,
      duration: "12 tháng",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    template: "",
    budget: "",
    duration: "",
    goals: [],
    channels: [],
    teamSize: "1-5",
    industry: "",
    targetAudience: "",
  });

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectPageModalOpen, setIsSelectPageModalOpen] = useState(false);

  useEffect(() => {
    if (user?.isNew) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, []);

  // Templates for workspace creation
  const workspaceTemplates = [
    {
      id: "ecommerce",
      name: "E-commerce Marketing",
      description: "Dành cho cửa hàng trực tuyến, bán lẻ",
      icon: <Megaphone className="w-8 h-8" />,
      features: [
        "Email Marketing",
        "Social Media",
        "Google Ads",
        "Affiliate Marketing",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "product-launch",
      name: "Product Launch",
      description: "Ra mắt sản phẩm hoặc dịch vụ mới",
      icon: <Target className="w-8 h-8" />,
      features: [
        "PR Campaign",
        "Influencer Marketing",
        "Content Marketing",
        "Event Marketing",
      ],
      color: "from-green-500 to-green-600",
    },
    {
      id: "brand-awareness",
      name: "Brand Awareness",
      description: "Xây dựng và nâng cao nhận diện thương hiệu",
      icon: <TrendingUp className="w-8 h-8" />,
      features: ["Content Strategy", "SEO", "Social Media", "Video Marketing"],
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "lead-generation",
      name: "Lead Generation",
      description: "Thu thập và nuôi dưỡng khách hàng tiềm năng",
      icon: <Zap className="w-8 h-8" />,
      features: [
        "Landing Page",
        "Lead Magnets",
        "Email Automation",
        "CRM Integration",
      ],
      color: "from-orange-500 to-orange-600",
    },
  ];

  const marketingChannels = [
    {
      id: "email",
      name: "Email Marketing",
      icon: <Mail className="w-5 h-5" />,
    },
    { id: "social", name: "Social Media", icon: <Globe className="w-5 h-5" /> },
    {
      id: "facebook",
      name: "Facebook Ads",
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
    },
    { id: "twitter", name: "Twitter/X", icon: <Twitter className="w-5 h-5" /> },
    { id: "youtube", name: "YouTube", icon: <Youtube className="w-5 h-5" /> },
    { id: "google", name: "Google Ads", icon: <Target className="w-5 h-5" /> },
    {
      id: "seo",
      name: "SEO/Content",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const marketingGoals = [
    "Tăng doanh số bán hàng",
    "Nâng cao nhận diện thương hiệu",
    "Thu thập khách hàng tiềm năng",
    "Gia tăng lưu lượng website",
    "Cải thiện engagement trên social media",
    "Ra mắt sản phẩm mới",
    "Mở rộng thị trường mới",
    "Xây dựng cộng đồng khách hàng",
  ];

  const handleCreateWorkspace = () => {
    if (newWorkspace.name.trim() && newWorkspace.template) {
      const workspace = {
        id: Date.now(),
        name: newWorkspace.name,
        description: newWorkspace.description,
        createdAt: new Date().toISOString().split("T")[0],
        campaigns: 0,
        members: 1,
        status: "active",
        template: newWorkspace.template,
        budget: newWorkspace.budget ? parseInt(newWorkspace.budget) : 0,
        duration: newWorkspace.duration,
      };
      setWorkspaces([workspace, ...workspaces]);
      setNewWorkspace({
        name: "",
        description: "",
        template: "",
        budget: "",
        duration: "",
        goals: [],
        channels: [],
        teamSize: "1-5",
        industry: "",
        targetAudience: "",
      });
      setShowCreateModal(false);
      setCreateStep(1);
    }
  };

  const nextStep = () => {
    if (createStep < 3) setCreateStep(createStep + 1);
  };

  const prevStep = () => {
    if (createStep > 1) setCreateStep(createStep - 1);
  };

  const selectTemplate = (templateId) => {
    setNewWorkspace({ ...newWorkspace, template: templateId });
  };

  const toggleGoal = (goal) => {
    const updatedGoals = newWorkspace.goals.includes(goal)
      ? newWorkspace.goals.filter((g) => g !== goal)
      : [...newWorkspace.goals, goal];
    setNewWorkspace({ ...newWorkspace, goals: updatedGoals });
  };

  const toggleChannel = (channelId) => {
    const updatedChannels = newWorkspace.channels.includes(channelId)
      ? newWorkspace.channels.filter((c) => c !== channelId)
      : [...newWorkspace.channels, channelId];
    setNewWorkspace({ ...newWorkspace, channels: updatedChannels });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Đang hoạt động" },
      completed: { color: "bg-gray-100 text-gray-800", text: "Hoàn thành" },
      paused: { color: "bg-yellow-100 text-yellow-800", text: "Tạm dừng" },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Modal */}
          {isModalOpen && (
            <SelectSocialNetwork
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onOpenPagesSelect={() => {
                setIsSelectPageModalOpen(true)
                setIsModalOpen(false)
              }}
            />
          )}

          {isSelectPageModalOpen && (
            <SelectPagesModal
              isOpen={isSelectPageModalOpen}
              onClose={() => setIsSelectPageModalOpen(false)}
            />
          )}
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
              <p className="text-gray-600">
                Quản lý các dự án marketing của bạn
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Tạo workspace mới
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: "Tổng workspace",
                value: workspaces.length,
                color: "blue",
              },
              {
                label: "Đang hoạt động",
                value: workspaces.filter((w) => w.status === "active").length,
                color: "green",
              },
              {
                label: "Tổng chiến dịch",
                value: workspaces.reduce((sum, w) => sum + w.campaigns, 0),
                color: "purple",
              },
              {
                label: "Thành viên",
                value: workspaces.reduce((sum, w) => sum + w.members, 0),
                color: "orange",
              },
            ].map((stat, index) => (
              <div
                key={index}
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
                    className={`w-12 h-12 bg-gradient-to-r ${
                      stat.color === "blue"
                        ? "from-blue-500 to-blue-600"
                        : stat.color === "green"
                        ? "from-green-500 to-green-600"
                        : stat.color === "purple"
                        ? "from-purple-500 to-purple-600"
                        : "from-orange-500 to-orange-600"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <Folder className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${
                        workspace.template === "ecommerce"
                          ? "from-blue-500 to-blue-600"
                          : workspace.template === "product-launch"
                          ? "from-green-500 to-green-600"
                          : workspace.template === "brand-awareness"
                          ? "from-purple-500 to-purple-600"
                          : workspace.template === "lead-generation"
                          ? "from-orange-500 to-orange-600"
                          : "from-blue-500 to-purple-500"
                      } rounded-lg flex items-center justify-center`}
                    >
                      <Folder className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {workspace.name}
                      </h3>
                      {getStatusBadge(workspace.status)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit3 size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {workspace.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      Tạo ngày {workspace.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Folder size={16} className="mr-2" />
                      {workspace.campaigns} chiến dịch
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-2" />
                      {workspace.members} thành viên
                    </div>
                  </div>

                  {workspace.budget && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Target size={16} className="mr-2" />
                        Ngân sách: {formatCurrency(workspace.budget)}
                      </div>
                    </div>
                  )}

                  {workspace.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      Thời gian: {workspace.duration}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to={`/workspaces/${workspace.id}`}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium block text-center"
                  >
                    Mở workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Create Workspace Wizard Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Tạo workspace mới
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Bước {createStep} / 3
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateStep(1);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    {[1, 2, 3].map((step) => (
                      <React.Fragment key={step}>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            step <= createStep
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step < createStep ? <Check size={16} /> : step}
                        </div>
                        {step < 3 && (
                          <div
                            className={`flex-1 h-1 mx-4 ${
                              step < createStep ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span
                      className={
                        createStep >= 1
                          ? "text-blue-600 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Chọn Template
                    </span>
                    <span
                      className={
                        createStep >= 2
                          ? "text-blue-600 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Cấu hình
                    </span>
                    <span
                      className={
                        createStep >= 3
                          ? "text-blue-600 font-medium"
                          : "text-gray-500"
                      }
                    >
                      Hoàn tất
                    </span>
                  </div>
                </div>

                {/* Step Content */}
                <div className="p-6">
                  {createStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Chọn template phù hợp
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Chọn template phù hợp với mục tiêu marketing của bạn
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workspaceTemplates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => selectTemplate(template.id)}
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                              newWorkspace.template === template.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start space-x-4">
                              <div
                                className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-white`}
                              >
                                {template.icon}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  {template.name}
                                </h5>
                                <p className="text-gray-600 text-sm mb-3">
                                  {template.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {template.features.map((feature, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {createStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Cấu hình workspace
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Thiết lập thông tin chi tiết cho workspace của bạn
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tên workspace *
                            </label>
                            <input
                              type="text"
                              value={newWorkspace.name}
                              onChange={(e) =>
                                setNewWorkspace({
                                  ...newWorkspace,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nhập tên workspace"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mô tả
                            </label>
                            <textarea
                              value={newWorkspace.description}
                              onChange={(e) =>
                                setNewWorkspace({
                                  ...newWorkspace,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="3"
                              placeholder="Mô tả về workspace này"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ngân sách dự kiến (VNĐ)
                            </label>
                            <input
                              type="number"
                              value={newWorkspace.budget}
                              onChange={(e) =>
                                setNewWorkspace({
                                  ...newWorkspace,
                                  budget: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="50000000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Thời gian dự án
                            </label>
                            <select
                              value={newWorkspace.duration}
                              onChange={(e) =>
                                setNewWorkspace({
                                  ...newWorkspace,
                                  duration: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Chọn thời gian</option>
                              <option value="1 tháng">1 tháng</option>
                              <option value="3 tháng">3 tháng</option>
                              <option value="6 tháng">6 tháng</option>
                              <option value="12 tháng">12 tháng</option>
                              <option value="Dài hạn">Dài hạn</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mục tiêu marketing
                            </label>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {marketingGoals.map((goal) => (
                                <label key={goal} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={newWorkspace.goals.includes(goal)}
                                    onChange={() => toggleGoal(goal)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    {goal}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kênh marketing
                            </label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                              {marketingChannels.map((channel) => (
                                <label
                                  key={channel.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={newWorkspace.channels.includes(
                                      channel.id
                                    )}
                                    onChange={() => toggleChannel(channel.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700 flex items-center">
                                    {channel.icon}
                                    <span className="ml-1">{channel.name}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {createStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Xác nhận thông tin
                        </h4>
                        <p className="text-gray-600 text-sm mb-6">
                          Kiểm tra lại thông tin trước khi tạo workspace
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Template
                            </label>
                            <p className="text-gray-900">
                              {
                                workspaceTemplates.find(
                                  (t) => t.id === newWorkspace.template
                                )?.name
                              }
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Tên workspace
                            </label>
                            <p className="text-gray-900">{newWorkspace.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Ngân sách
                            </label>
                            <p className="text-gray-900">
                              {newWorkspace.budget
                                ? formatCurrency(parseInt(newWorkspace.budget))
                                : "Chưa xác định"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Thời gian
                            </label>
                            <p className="text-gray-900">
                              {newWorkspace.duration || "Chưa xác định"}
                            </p>
                          </div>
                        </div>

                        {newWorkspace.description && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Mô tả
                            </label>
                            <p className="text-gray-900">
                              {newWorkspace.description}
                            </p>
                          </div>
                        )}

                        {newWorkspace.goals.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Mục tiêu
                            </label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {newWorkspace.goals.map((goal) => (
                                <span
                                  key={goal}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {newWorkspace.channels.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Kênh marketing
                            </label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {newWorkspace.channels.map((channelId) => {
                                const channel = marketingChannels.find(
                                  (c) => c.id === channelId
                                );
                                return (
                                  <span
                                    key={channelId}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                  >
                                    {channel?.icon}
                                    <span className="ml-1">
                                      {channel?.name}
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-6 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={createStep === 1}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      createStep === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Trước
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setCreateStep(1);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>

                    {createStep < 3 ? (
                      <button
                        onClick={nextStep}
                        disabled={createStep === 1 && !newWorkspace.template}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          createStep === 1 && !newWorkspace.template
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        }`}
                      >
                        Tiếp theo
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    ) : (
                      <button
                        onClick={handleCreateWorkspace}
                        disabled={!newWorkspace.name.trim()}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !newWorkspace.name.trim()
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        }`}
                      >
                        Tạo workspace
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
