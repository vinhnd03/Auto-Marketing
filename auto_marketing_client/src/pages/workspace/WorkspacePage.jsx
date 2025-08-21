import React, { useEffect, useRef, useState } from "react";
import { Plus, Folder, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import CreateWorkspaceModal from "../../components/workspace/CreateWorkspaceModal";
import UpdateWorkspaceModal from "../../components/workspace/UpdateWorkspaceModal";
import SelectPagesModal from "../../components/modal/SelectPagesModal";
import SelectSocialNetwork from "../../components/modal/SelectSocialNetwork";

import {
  getAllWorkspaceByUserId,
  getMaxWorkspace,
  updateWorkspaceStatus
} from "../../service/workspace/workspace_service";
import WorkspaceLimitModal from "../../components/workspace/WorkspaceLimitModal";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Preloader } from "../../components";

const WorkspacePage = () => {
  const { user } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [selectedActiveIds, setSelectedActiveIds] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const defaultAvatar = "https://i.pravatar.cc/100?img=4";

  // Modal chọn MXH và Fanpage
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectPageModalOpen, setIsSelectPageModalOpen] = useState(false);

  // Giới hạn workspace
  const [maxWorkspace, setMaxWorkspace] = useState(0);

  // Kiểm tra liên kết MXH
  const [isFbLinked, setIsFbLinked] = useState(false);
  const [checkingFbLinked, setCheckingFbLinked] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const checkLinked = async () => {
      try {
        const res = await fetch(`/api/social/check?userId=${user.id}`);
        const text = await res.text();
        setIsFbLinked(text.includes("đã liên kết"));
      } catch (err) {
        console.error(err);
        toast.error("Không thể kiểm tra MXH");
      } finally {
        setCheckingFbLinked(false);
      }
    };

    checkLinked();
  }, [user]);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        const [maxWsRes, wsList] = await Promise.all([
          getMaxWorkspace(user.id),
          getAllWorkspaceByUserId(user.id)
        ]);

        if (maxWsRes.error) {
          toast.error(maxWsRes.error);
          return;
        }

        setMaxWorkspace(maxWsRes);

        if (!Array.isArray(wsList) || wsList.length === 0) {
          setWorkspaces([]);
          // Nếu đã liên kết MXH mới show create modal
          if (isFbLinked) setShowCreateModal(true);
          return;
        }

        const sortedWs = [...wsList].sort((a, b) => b.id - a.id);

        const activeCount = sortedWs.filter(w => w.status === "ACTIVE").length;
        if (activeCount < maxWsRes) {
          const allIds = sortedWs.map(w => w.id);
          try {
            const res = await updateWorkspaceStatus(user.id, allIds, "ACTIVE");
            if (res.error) toast.error(res.error);
            else {
              const updatedWs = sortedWs.map(w => ({ ...w, status: "ACTIVE" }));
              setWorkspaces(updatedWs);
            }
          } catch (err) {
            toast.error("Không thể cập nhật trạng thái workspace");
            setWorkspaces(sortedWs);
          }
        } else {
          setWorkspaces(sortedWs);
        }
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải workspace");
      }
    };

    fetchData();
  }, [user, isFbLinked]);

  const toastShown = useRef(false);

  useEffect(() => {
    const activeWs = workspaces.filter(w => w.status === "ACTIVE");
    if (activeWs.length > maxWorkspace) {
      setSelectedActiveIds(activeWs.map(w => w.id));
      setIsLimitModalOpen(true);
      if (!toastShown.current) {
        toast.custom(
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded shadow">
            Vui lòng nâng cấp gói để tạo thêm không gian làm việc
          </div>
        );
        toastShown.current = true;
      }
    } else {
      toastShown.current = false;
      setIsLimitModalOpen(false);
    }
  }, [workspaces, maxWorkspace]);

  const handleUpdateWorkspace = (updatedWs) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updatedWs.id ? updatedWs : ws))
    );
  };

  const handleSaveLimit = async () => {
    try {
      const activeIds = selectedActiveIds;
      const res = await updateWorkspaceStatus(user.id, activeIds, "ACTIVE");
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setWorkspaces(prev =>
        prev.map(ws => ({
          ...ws,
          status: activeIds.includes(ws.id) ? "ACTIVE" : "INACTIVE"
        }))
      );
      toast.success("Cập nhật trạng thái workspace thành công");
      setIsLimitModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    }
  };

  const handleAddWorkspace = (newWorkspace) => {
    setWorkspaces(prev => [newWorkspace, ...prev]);
  };

  if (checkingFbLinked) return <Preloader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Modal chọn mạng xã hội */}
      {isModalOpen && (
        <SelectSocialNetwork
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOpenPagesSelect={() => {
            setIsSelectPageModalOpen(true);
            setIsModalOpen(false);
          }}
          setIsFbLinked={setIsFbLinked}
        />
      )}

      {isSelectPageModalOpen && (
        <SelectPagesModal
          isOpen={isSelectPageModalOpen}
          onClose={() => setIsSelectPageModalOpen(false)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
          <p className="text-gray-600">Quản lý các dự án marketing của bạn</p>
        </div>
        <button
          onClick={() => {
            if (!isFbLinked) {
              setIsModalOpen(true);
            } else {
              setShowCreateModal(true);
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
        >
          <Plus size={16} className="mr-2"/>
          Tạo workspace mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Tổng workspace", value: workspaces.length, color: "blue" },
          { label: "Đang hoạt động", value: workspaces.filter((w) => w.status === "ACTIVE").length, color: "green" },
          { label: "Tổng chiến dịch", value: workspaces.reduce((sum, w) => sum + w.campaigns, 0), color: "purple" },
          { label: "Thành viên", value: workspaces.reduce((sum, w) => sum + w.members, 0), color: "orange" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${
                  stat.color === "blue" ? "from-blue-500 to-blue-600"
                  : stat.color === "green" ? "from-green-500 to-green-600"
                  : stat.color === "purple" ? "from-purple-500 to-purple-600"
                  : "from-orange-500 to-orange-600"
                } rounded-lg flex items-center justify-center`}
              >
                <Folder className="text-white" size={24}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workspace List */}
      {workspaces.length === 0 ? (
        <p className="text-gray-500 italic">Chưa có workspace nào</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.slice(0, visibleCount).map((ws) => (
              <div
                key={ws.id}
                className="border rounded-lg p-4 flex flex-col items-center hover:shadow-md transition h-full"
              >
                <div className="flex justify-end w-full">
                  <button
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setShowUpdateModal(true);
                    }}
                    className="text-gray-500 hover:text-blue-600"
                    title="Chỉnh sửa"
                  >
                    <Settings size={18}/>
                  </button>
                </div>
                <img
                  src={ws.avatar || defaultAvatar}
                  alt={ws.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="font-semibold text-lg text-center">{ws.name}</h3>
                <div className="mt-1 min-h-[1.25rem] flex items-center justify-center">
                  {ws.description && (
                    <p className="text-sm text-gray-500 text-center">
                      {ws.description.length > 50 ? ws.description.substring(0, 50) + "..." : ws.description}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Ngày tạo: {new Date(ws.createdAt).toLocaleDateString()}
                </div>
                {ws.updatedAt && (
                  <div className="text-xs text-gray-400 mt-2">
                    Ngày Update: {new Date(ws.updatedAt).toLocaleDateString()}
                  </div>
                )}
                <div className="mt-auto w-full pt-4">
                  {ws.status === "ACTIVE" ? (
                    <Link
                      to={`/workspaces/${ws.id}`}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium block text-center"
                    >
                      Mở workspace
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium block text-center cursor-not-allowed"
                      title="Workspace này đang tạm dừng"
                    >
                      Mở workspace
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Nút Xem thêm / Thu gọn */}
          {workspaces.length > 6 && (
            <div className="flex justify-center gap-4 mt-6">
              {visibleCount < workspaces.length && (
                <button
                  onClick={() => {
                    setVisibleCount(prev => Math.min(prev + 6, workspaces.length));
                    if (visibleCount + 6 >= workspaces.length) setIsExpanded(true);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
                >
                  Xem thêm
                </button>
              )}
              {(isExpanded || visibleCount > 6) && (
                <button
                  onClick={() => {
                    setVisibleCount(6);
                    setIsExpanded(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
                >
                  Thu gọn
                </button>
              )}
            </div>
          )}
        </>
      )}

      {isLimitModalOpen && (
        <WorkspaceLimitModal
          workspaces={workspaces}
          selectedIds={selectedActiveIds}
          onChange={setSelectedActiveIds}
          onSave={handleSaveLimit}
          maxWorkspace={maxWorkspace}
        />
      )}

      {/* Modals */}
      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAdd={handleAddWorkspace}
        workspaces={workspaces}
      />
      <UpdateWorkspaceModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateWorkspace}
        workspace={selectedWorkspace}
        setWorkspaces={setWorkspaces}
        userId={user?.id}
        workspaces={workspaces}
      />
    </div>
  );
};

export default WorkspacePage;
