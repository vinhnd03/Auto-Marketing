import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    X,
    Bell,
    Search,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Shield,
} from "lucide-react";
import {getUserCount,getNotifications} from "../../service/admin/notificationService";

const AdminHeader = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                // Gọi song song 2 API
                const [notifications, count] = await Promise.all([
                    getNotifications(),
                    getUserCount()
                ]);

                setNotifications(notifications);
                setUserCount(count);
            } catch (e) {
                console.error("Lỗi khi fetch dữ liệu:", e);
            }
        }

        fetchData().then();
    }, [showAllNotifications]);


    return (
        <header
            className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md fixed top-0 right-0 left-64 z-40 h-16">
            <div className="flex items-center justify-between h-full px-6 text-white">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng, báo cáo, thống kê..."
                            className="w-full pl-10 pr-4 py-2 border border-transparent rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-800"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    {/* Admin Badge */}
                    <div className="flex items-center space-x-2 bg-white/20 text-white px-3 py-1 rounded-full">
                        <Shield size={14}/>
                        <span className="text-sm font-medium">Admin</span>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden lg:flex items-center space-x-4 text-sm">
                        <div className="text-center">
                            <div className="font-semibold">{userCount}</div>
                            <div className="text-xs">Người dùng</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold text-green-200">₫152Tr</div>
                            <div className="text-xs">Doanh thu</div>
                        </div>
                    </div>


                    <div className="relative flex items-center gap-4">
                        {/*  Nút chuông */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 hover:bg-white/20 rounded-lg relative"
                            >
                                <Bell size={20}/>
                                {notifications.some((n) => n.unread) && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {/*  Popup thông báo */}
                            {showNotifications && (
                                <div
                                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 text-gray-900">
                                    <div className="p-4 border-b border-gray-200 ">
                                        <h3 className="text-lg font-semibold ">Thông báo hệ thống</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.slice(0,7).map((notification, index) => (
                                                <div
                                                    key={notification.id || notification.id || index}
                                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                                        notification.unread ? "bg-purple-50" : ""
                                                    }`}
                                                >
                                                    <p className="text-sm">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="p-4 text-sm text-gray-500">
                                                Không có thông báo nào
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <button
                                            onClick={() => {
                                                setShowNotifications(false);
                                                setShowAllNotifications(true);
                                            }}
                                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                        >
                                            Xem tất cả thông báo
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 📌 Modal xem tất cả */}
                        {showAllNotifications && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] flex flex-col">

                                    {/* Header */}
                                    <div
                                        className="flex justify-between items-center p-4 border-b bg-blue-500 flex-shrink-0">
                                        <h2 className="text-lg font-semibold text-white">Tất cả thông báo</h2>
                                        <button
                                            className="text-white hover:text-gray-200"
                                            onClick={() => setShowAllNotifications(false)}
                                        >
                                            <X size={20}/>
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 overflow-y-auto flex-grow">
                                        {notifications && notifications.length > 0 ? (
                                            <ul className="space-y-3">
                                                {notifications.map((n, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="p-3 border rounded hover:bg-gray-50 transition"
                                                    >
                                                        <p className="font-medium">{n.title}</p>
                                                        <p className="text-sm text-gray-600">{n.message}</p>
                                                        <span
                                                            className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString("vi-VN")}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 text-center">Không có thông báo nào</p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-end p-4 border-t flex-shrink-0">
                                        <button
                                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                            onClick={() => setShowAllNotifications(false)}
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-2 hover:bg-white/20 rounded-lg"
                        >
                            <div
                                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/30">
                                <User size={16} className="text-white"/>
                            </div>
                            <span className="text-sm font-medium hidden md:block">Admin User</span>
                            <ChevronDown size={16}/>
                        </button>

                        {showUserMenu && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 text-gray-900">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-sm font-medium">Admin User</p>
                                    <p className="text-xs text-gray-500">admin@marketingauto.vn</p>
                                    <span
                                        className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mt-2">
                                Administrator
                            </span>
                                </div>
                                <div className="py-2">
                                    <Link
                                        to="/admin/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User size={16}/>
                                        <span>Hồ sơ Admin</span>
                                    </Link>
                                    <Link
                                        to="/admin/settings"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={16}/>
                                        <span>Cài đặt hệ thống</span>
                                    </Link>
                                </div>
                                <div className="border-t border-gray-200 py-2">
                                    <button
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                                        <LogOut size={16}/>
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
