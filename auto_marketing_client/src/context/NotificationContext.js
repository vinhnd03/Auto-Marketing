import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Đảm bảo có useAuth để lấy user

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth(); // Nếu chưa có, truyền user qua prop cũng được

  const getNotiKey = (user) =>
    user
      ? `am_notifications_${user.id || user.email}`
      : "am_notifications_anonymous";

  // Khi user đổi, load lại notification đúng user
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("am_notifications_anonymous");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Load lại khi user đổi
    const key = getNotiKey(user);
    try {
      const saved = localStorage.getItem(key);
      setNotifications(saved ? JSON.parse(saved) : []);
    } catch {
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    // Lưu lại mỗi khi notifications đổi
    const key = getNotiKey(user);
    try {
      localStorage.setItem(key, JSON.stringify(notifications));
    } catch {}
  }, [notifications, user]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
    // Xóa luôn localStorage cho user hiện tại
    const key = getNotiKey(user);
    localStorage.setItem(key, JSON.stringify([]));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
