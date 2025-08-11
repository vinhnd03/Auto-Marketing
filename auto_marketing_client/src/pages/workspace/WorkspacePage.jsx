import React, { useState } from "react";
import { Plus, Folder, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import CreateWorkspaceModal from "../../components/workspace/CreateWorkspaceModal";
import UpdateWorkspaceModal from "../../components/workspace/UpdateWorkspaceModal";

const WorkspacePage = () => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6); // Số card hiển thị ban đầu

    const defaultAvatar = "https://i.pravatar.cc/100?img=4";

    const [workspaces, setWorkspaces] = useState([
        { id: 1, name: "Summer Sale Campaign", description: "Chiến dịch khuyến mãi mùa hè 2024", avatar: defaultAvatar, createdAt: "2024-08-01", status: "active", campaigns: 5, members: 3 },
        { id: 2, name: "Product Launch", description: "Ra mắt sản phẩm mới iPhone 15", avatar: defaultAvatar, createdAt: "2024-07-15", status: "completed", campaigns: 8, members: 5 },
        { id: 3, name: "Brand Awareness", avatar: defaultAvatar, createdAt: "2024-07-01", status: "active", campaigns: 12, members: 7 },
        { id: 4, name: "New Year Campaign", description: "Khuyến mãi Tết 2025", avatar: defaultAvatar, createdAt: "2024-12-25", status: "active", campaigns: 10, members: 4 },
        { id: 5, name: "Black Friday", avatar: defaultAvatar, createdAt: "2024-11-20", status: "completed", campaigns: 7, members: 6 },
        { id: 6, name: "Tech Fair", description: "Triển lãm công nghệ", avatar: defaultAvatar, createdAt: "2024-09-05", status: "active", campaigns: 9, members: 8 },
        { id: 7, name: "Charity Event", avatar: defaultAvatar, createdAt: "2024-10-15", status: "active", campaigns: 4, members: 2 }
    ]);

    const handleCreateWorkspace = (workspace) => {
        setWorkspaces((prev) => [workspace, ...prev]);
    };

    const handleUpdateWorkspace = (updatedWs) => {
        setWorkspaces((prev) =>
            prev.map((ws) => (ws.id === updatedWs.id ? updatedWs : ws))
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
                    <p className="text-gray-600">Quản lý các dự án marketing của bạn</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Tổng workspace", value: workspaces.length, color: "blue" },
                    { label: "Đang hoạt động", value: workspaces.filter((w) => w.status === "active").length, color: "green" },
                    { label: "Tổng chiến dịch", value: workspaces.reduce((sum, w) => sum + w.campaigns, 0), color: "purple" },
                    { label: "Thành viên", value: workspaces.reduce((sum, w) => sum + w.members, 0), color: "orange" },
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
                                        <Settings size={18} />
                                    </button>
                                </div>
                                <img src={ws.avatar || defaultAvatar} alt={ws.name} className="w-20 h-20 rounded-full object-cover mb-3" />
                                <h3 className="font-semibold text-lg text-center">{ws.name}</h3>
                                <div className="mt-1 min-h-[1.25rem] flex items-center justify-center">
                                    {ws.description && <p className="text-sm text-gray-500 text-center">{ws.description}</p>}
                                </div>
                                <div className="text-xs text-gray-400 mt-2">Ngày tạo: {ws.createdAt}</div>
                                <div className="mt-auto w-full pt-4">
                                    <Link
                                        to={`/workspaces/${ws.id}`}
                                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium block text-center"
                                    >
                                        Mở workspace
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút Xem thêm */}
                    {visibleCount < workspaces.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setVisibleCount((prev) => prev + 6)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
                            >
                                Xem thêm
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <CreateWorkspaceModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateWorkspace}
            />
            <UpdateWorkspaceModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onUpdate={handleUpdateWorkspace}
                workspace={selectedWorkspace}
            />
        </div>
    );
};

export default WorkspacePage;
