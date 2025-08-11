import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Bell,
    Search,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Shield,
} from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";

const AdminHeader = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    // const { switchRole } = useAuth();
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            message: "Người dùng mới đăng ký: john.doe@example.com",
            time: "5 phút trước",
            unread: true,
        },
        {
            id: 2,
            message: "Doanh thu tháng này đã đạt 50 triệu VNĐ",
            time: "1 giờ trước",
            unread: true,
        },
        {
            id: 3,
            message: "Báo cáo lỗi từ người dùng ID: #12345",
            time: "2 giờ trước",
            unread: false,
        },
        {
            id: 4,
            message: "Có 15 gói Premium được mua trong ngày",
            time: "4 giờ trước",
            unread: false,
        },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-40 h-16">
            <div className="flex items-center justify-between h-full px-6">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng, báo cáo, thống kê..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Admin Badge */}
                    <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                        <Shield size={14} />
                        <span className="text-sm font-medium">Admin</span>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
                        <div className="text-center">
                            <div className="font-semibold text-gray-900">1,234</div>
                            <div className="text-xs">Người dùng</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-green-600">₫152M</div>
                            <div className="text-xs">Doanh thu</div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
                        >
                            <Bell size={20} />
                            {notifications.some((n) => n.unread) && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Thông báo hệ thống
                                    </h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                                notification.unread ? "bg-red-50" : ""
                                            }`}
                                        >
                                            <p className="text-sm text-gray-900">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {notification.time}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4">
                                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                                        Xem tất cả thông báo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-medium hidden md:block">
                Admin User
              </span>
                            <ChevronDown size={16} />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-900">
                                        Admin User
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        admin@marketingauto.vn
                                    </p>
                                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full mt-2">
                    Administrator
                  </span>
                                </div>
                                <div className="py-2">
                                    <Link
                                        to="/admin/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User size={16} />
                                        <span>Hồ sơ Admin</span>
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={16} />
                                        <span>Cài đặt hệ thống</span>
                                    </Link>
                                </div>
                                <div className="border-t border-gray-200 py-2">
                                    <button
                                        onClick={() => {
                                            // switchRole("user");
                                            navigate("/dashboard");
                                            setShowUserMenu(false);
                                        }}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left"
                                    >
                                        <User size={16} />
                                        <span>Switch to User</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                        <LogOut size={16} />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;