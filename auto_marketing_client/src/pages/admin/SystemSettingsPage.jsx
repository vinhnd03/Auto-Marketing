import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Database,
  Mail,
  Bell,
  Globe,
} from "lucide-react";

const SystemSettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: "Auto Marketing",
    siteDescription: "Nền tảng Marketing Automation hàng đầu Việt Nam",
    adminEmail: "admin@automarketing.com",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",
    maintenanceMode: false,
    debugMode: false,
    maxUploadSize: "10MB",
    sessionTimeout: "30",
    emailNotifications: true,
    smsNotifications: false,
    backupFrequency: "daily",
    retentionDays: "30",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
  };

  const tabs = [
    { id: "general", name: "Tổng quan", icon: Settings },
    { id: "security", name: "Bảo mật", icon: Shield },
    { id: "database", name: "Cơ sở dữ liệu", icon: Database },
    { id: "email", name: "Email", icon: Mail },
    { id: "notifications", name: "Thông báo", icon: Bell },
    { id: "backup", name: "Backup", icon: RefreshCw },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên website
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleSettingChange("siteName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email admin
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleSettingChange("adminEmail", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả website
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) =>
            handleSettingChange("siteDescription", e.target.value)
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Múi giờ
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngôn ngữ
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              handleSettingChange("maintenanceMode", e.target.checked)
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Chế độ bảo trì</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.debugMode}
            onChange={(e) => handleSettingChange("debugMode", e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Chế độ debug</span>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kích thước upload tối đa
          </label>
          <select
            value={settings.maxUploadSize}
            onChange={(e) =>
              handleSettingChange("maxUploadSize", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="5MB">5MB</option>
            <option value="10MB">10MB</option>
            <option value="25MB">25MB</option>
            <option value="50MB">50MB</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian timeout session (phút)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) =>
              handleSettingChange("sessionTimeout", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tần suất backup
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) =>
              handleSettingChange("backupFrequency", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hourly">Hàng giờ</option>
            <option value="daily">Hàng ngày</option>
            <option value="weekly">Hàng tuần</option>
            <option value="monthly">Hàng tháng</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số ngày lưu trữ
          </label>
          <input
            type="number"
            value={settings.retentionDays}
            onChange={(e) =>
              handleSettingChange("retentionDays", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "security":
        return renderSecuritySettings();
      case "backup":
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Cài đặt hệ thống
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý cài đặt và cấu hình hệ thống
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">{renderTabContent()}</div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Khôi phục cài đặt mặc định
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Xuất cài đặt
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Import cài đặt
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Kiểm tra cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
