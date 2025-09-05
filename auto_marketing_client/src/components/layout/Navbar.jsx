// Notification context/hook
import { useNotification } from "../../context/NotificationContext";
import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../service/authService";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  ChevronDownIcon,
  IdentificationIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import ConfirmLogoutModal from "../modal/ConfirmLogoutModal";

export default function Navbar() {
  const bellButtonRef = useRef(null);
  const bellDropdownRef = useRef(null);
  const [hasUnread, setHasUnread] = useState(false);
  const { notifications, clearNotifications } = useNotification();
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Khi có thông báo mới, set hasUnread=true
  useEffect(() => {
    if (notifications.length > 0) {
      setHasUnread(true);
    }
  }, [notifications]);
  const { user } = useAuth();
  // console.log(user);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Mock user data - sau này sẽ lấy từ context/API
  // const user = {
  //   name: "Nguyễn Văn A",
  //   email: "nguyen.van.a@email.com",
  //   avatar:
  //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  // };

  // Đóng dropdown thông báo khi click bên ngoài
  useEffect(() => {
    function handleClickOutsideBell(event) {
      const bellBtn = bellButtonRef.current;
      const bellDropdown = bellDropdownRef.current;
      if (
        bellDropdown &&
        !bellDropdown.contains(event.target) &&
        bellBtn &&
        !bellBtn.contains(event.target)
      ) {
        setShowBellDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideBell);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideBell);
    };
  }, []);

  // Đóng dropdown user khi click bên ngoài hoặc nhấn Escape
  useEffect(() => {
    function handleClickOutsideUser(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        closeMenu();
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideUser);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUser);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(true);
    setDropdownOpen(false);
  };

  // Format ngày tháng năm kiểu Việt Nam: dd/MM/yyyy, HH:mm:ss
  function formatDateVN(date) {
    const d = new Date(date);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(
      d.getMonth() + 1
    )}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
      d.getSeconds()
    )}`;
  }

  const navLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/features", label: "Tính năng" },
    { path: "/pricing", label: "Bảng giá" },
    { path: "/contact", label: "Liên hệ" },
    // Chỉ hiển thị Workspace khi đã đăng nhập
    // ...(isLoggedIn ? [{ path: "/workspace", label: "Workspace" }] : []),
    ...(user ? [{ path: "/workspace", label: "Workspace" }] : []),
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      {showLogoutModal && (
        <ConfirmLogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg px-2 py-1 rounded">
            AM
          </div>
          <span className="text-2xl font-bold text-gray-800">
            AutoMarketing
          </span>
        </Link>

        {/* Hamburger Icon (mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-semibold text-gray-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `no-underline ${
                    isActive
                      ? "text-blue-600"
                      : "hover:text-purple-600 transition"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Buttons hoặc User Avatar */}
          <div className="flex space-x-6 items-center">
            {/* Button test để chuyển đổi trạng thái đăng nhập - xóa sau này */}
            {/* <button
              onClick={() => (isLoggedIn ? handleLogout() : handleLogin())}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              {isLoggedIn ? "Logout Test" : "Login Test"}
            </button> */}

            {/* {isLoggedIn ? ( */}
            {user ? (
              /* Avatar, Bell và Dropdown Menu */
              <div
                className="relative flex items-center gap-2"
                ref={dropdownRef}
              >
                {/* Notification Bell Icon */}
                <button
                  className="relative focus:outline-none hover:bg-gray-100 rounded-full p-2"
                  title="Thông báo"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBellDropdown((prev) => {
                      // Nếu đang mở dropdown user thì đóng lại
                      if (dropdownOpen) setDropdownOpen(false);
                      return !prev;
                    });
                    setHasUnread(false);
                  }}
                  ref={bellButtonRef}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600 hover:text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {/* Badge nếu có thông báo mới */}
                  {hasUnread && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                  )}
                  {/* Dropdown thông báo */}
                  {showBellDropdown && (
                    <div
                      ref={bellDropdownRef}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-800">
                        Thông báo
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-4 text-gray-500 text-sm">
                          Không có thông báo nào.
                        </div>
                      ) : (
                        <ul className="max-h-60 overflow-y-auto">
                          {notifications.map((n, idx) => (
                            <li
                              key={idx}
                              className="px-4 py-3 border-b last:border-b-0 text-gray-700 text-sm"
                            >
                              {n.message}
                              <span className="block text-xs text-gray-400 mt-1">
                                {formatDateVN(n.createdAt)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div
                        onClick={clearNotifications}
                        className="w-full px-4 py-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-b-lg"
                      >
                        Xóa tất cả thông báo
                      </div>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => {
                    // Nếu đang mở dropdown thông báo thì đóng lại
                    if (showBellDropdown) setShowBellDropdown(false);
                    setDropdownOpen((prev) => !prev);
                  }}
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://tse3.mm.bing.net/th/id/OIP.Udgj6h-H7jNBYuwbaZkWsgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                    }
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-3" />
                      Hồ sơ cá nhân
                    </Link>

                    <Link
                      to="/transaction_history"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ReceiptPercentIcon className="w-4 h-4 mr-3" />
                      Lịch sử thanh toán
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Cog6ToothIcon className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>

                    {user.role.name === "ADMIN" && (
                      <>
                        <hr className="my-2" />
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <IdentificationIcon className="w-4 h-4 mr-3" />
                          Trang quản trị
                        </Link>
                      </>
                    )}
                    <hr className="my-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup buttons khi chưa đăng nhập */
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium text-white rounded bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Đăng ký ngay
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black transition-opacity duration-300 ease-in-out ${
          menuOpen
            ? "bg-opacity-50 pointer-events-auto"
            : "bg-opacity-0 pointer-events-none"
        } flex justify-end`}
      >
        <button
          className="absolute inset-0 w-full h-full"
          onClick={closeMenu}
          aria-label="Close mobile menu"
        />
        <nav
          className={`relative h-full w-80 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Main navigation"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg px-2 py-1 rounded">
                AM
              </div>
              <span className="text-xl font-bold text-gray-800">
                AutoMarketing
              </span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-6 py-4">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Section */}
          {user ? (
            <div className="px-6 py-4 border-t border-gray-200">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-4">
                <img
                  // src={user.avatar}
                  // alt={user.name}
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  }
                  alt={user?.name || "Người dùng"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* User Menu */}
              <div className="space-y-1 max-h-[80vh] overflow-y-auto">
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  to="/transaction_history"
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                  Lịch sử thanh toán
                </Link>

                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-400" />
                  Cài đặt
                </Link>

                {user.role?.name === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <IdentificationIcon className="w-5 h-5 mr-3 text-gray-400" />
                    Trang quản trị
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-3" />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            /* Login/Signup Section */
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="space-y-3 ">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full text-center py-3 px-4 text-base font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block w-full text-center py-3 px-4 text-base font-medium text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span
                  className="w-2 h-2 bg-blue-500 rounded-full mr-2"
                  aria-hidden="true"
                ></span>
                1900 123 456
              </span>
              <span className="flex items-center">
                <span
                  className="w-2 h-2 bg-purple-500 rounded-full mr-2"
                  aria-hidden="true"
                ></span>
                123 Lê Lợi, Q.1, TP.HCM
              </span>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-400">
                © 2025 AutoMarketing. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
