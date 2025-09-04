import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Menu,
  X,
  Home,
} from "lucide-react";
import PropTypes from "prop-types";
import {
  getUserCount,
  getNotifications,
} from "../../service/admin/notificationService";
import { getRevenueStats } from "../../service/revenueService";
import { useAuth } from "../../context/AuthContext";
import authService from "../../service/authService";
import toast from "react-hot-toast";
import ConfirmLogoutModal from "../modal/ConfirmLogoutModal";

const AdminHeader = ({ collapsed, onToggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [dash, setDash] = useState(null);

  const { user } = useAuth();
  const dropdownRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await getRevenueStats();
        setDash(d);
      } catch (e) {
        console.error("Lỗi khi lấy revenue stats:", e);
      }
    })();
  }, []);
  function formatMoneyShort(value) {
    if (value === null || value === undefined) return "₫0";
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " Tỷ";
    }
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + " Tr";
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return value.toString();
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Gọi song song 2 API
        const [notifications, count] = await Promise.all([
          getNotifications(),
          getUserCount(),
        ]);

        setNotifications(notifications);
        setUserCount(count);
      } catch (e) {
        console.error("Lỗi khi fetch dữ liệu:", e);
      }
    }

    fetchData().then();
  }, [showAllNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        setShowUserMenu(false);
        // setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(true);
    // if (!collapsed) {
    //   onToggleSidebar(false); // chỉ thu gọn nếu đang mở rộng
    // }
    setShowUserMenu(false);
  };

  return (
    <>
      {showLogoutModal && (
        <ConfirmLogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
      <header
        className={`bg-gradient-to-r from-blue-500 to-purple-600 shadow-md fixed top-0 right-0 z-40 h-16 transition-all duration-300 ${
          collapsed ? "left-16" : "left-64"
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 md:px-6 text-white">
          {/* Nút hamburger + Search */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-white/20 active:scale-95 transition"
              aria-label="Thu gọn/mở rộng sidebar"
              title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              <Menu size={22} />
            </button>

            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200"
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
            <div className="hidden sm:flex items-center space-x-2 bg-white/20 text-white px-3 py-1 rounded-full">
              <Shield size={14} />
              <span className="text-sm font-medium">Admin</span>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{userCount}</div>
                <div className="text-xs">Người dùng</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-200">
                  {dash ? formatMoneyShort(dash.year) : "₫0"}
                </div>
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
                  <Bell size={20} />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/*  Popup thông báo */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 text-gray-900">
                    <div className="p-4 border-b border-gray-200 ">
                      <h3 className="text-lg font-semibold ">
                        Thông báo hệ thống
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 7).map((notification, index) => (
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
                    <div className="flex justify-between items-center p-4 border-b bg-blue-500 flex-shrink-0">
                      <h2 className="text-lg font-semibold text-white">
                        Tất cả thông báo
                      </h2>
                      <button
                        className="text-white hover:text-gray-200"
                        onClick={() => setShowAllNotifications(false)}
                      >
                        <X size={20} />
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
                              <p className="text-sm text-gray-600">
                                {n.message}
                              </p>
                              <span className="text-xs text-gray-400">
                                {new Date(n.createdAt).toLocaleString("vi-VN")}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-center">
                          Không có thông báo nào
                        </p>
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
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-white/20 rounded-lg"
              >
                {user.avatar ? (
                  <img
                    alt={user.name}
                    src={user.avatar}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/30">
                    <User size={16} className="text-white" />
                  </div>
                )}
                <span className="text-sm font-medium hidden md:block">
                  {user.name}
                </span>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 text-gray-900">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mt-2">
                      Administrator
                    </span>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      <span>Hồ sơ Admin</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      <span>Cài đặt hệ thống</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <Link
                      to="/"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      <Home size={16} />
                      <span>Trang chủ</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
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
    </>
  );
};

AdminHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};

export default AdminHeader;
