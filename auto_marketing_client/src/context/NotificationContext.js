import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Lấy lại thông báo từ localStorage khi khởi tạo
  const NOTI_KEY = "am_notifications";
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTI_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Lưu vào localStorage mỗi khi notifications thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(NOTI_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
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
