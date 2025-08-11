import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tạm thời để test, sau này sẽ lấy từ context/redux
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {user, logout, isLogin} = useAuth();

  // Mock user data - sau này sẽ lấy từ context/API
  // const user = {
  //   name: "Nguyễn Văn A",
  //   email: "nguyen.van.a@email.com",
  //   avatar:
  //     "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  // };


  // Đóng dropdown khi click bên ngoài
  useEffect(() => {

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setDropdownOpen(false);
    // Navigate to workspace after login
    navigate("/workspace");
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    // Navigate back to home after logout
    navigate("/");
    // Thêm logic logout khác ở đây
   
  };

  const navLinks = [
    { path: "/", label: "Trang chủ" },
    { path: "/features", label: "Tính năng" },
    { path: "/pricing", label: "Bảng giá" },
    { path: "/contact", label: "Liên hệ" },
    // Chỉ hiển thị Workspace khi đã đăng nhập
    // ...(isLoggedIn ? [{ path: "/workspace", label: "Workspace" }] : []),
    ...(isLogin() ? [{ path: "/workspace", label: "Workspace" }] : []),
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
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
          <button onClick={() => setMenuOpen(!menuOpen)}>
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
            {isLogin() ? (
              /* Avatar và Dropdown Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {/* {user.name} */}
                    {user.lastName + " " + user.firstName}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Cog6ToothIcon className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>

                    <hr className="my-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
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
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white shadow overflow-hidden">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-gray-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
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

          {/* Button Row hoặc User Info */}
          {/* {isLoggedIn ? ( */}
          {isLogin() ? (
            /* User info và menu khi đã đăng nhập */
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  <UserIcon className="w-4 h-4 mr-3" />
                  Hồ sơ cá nhân
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-3" />
                  Cài đặt
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            /* Login/Signup buttons khi chưa đăng nhập */
            <div className="mt-4 flex flex-row gap-x-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-white rounded bg-gradient-to-r from-blue-500 to-purple-600 shadow hover:shadow-lg transition"
              >
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
