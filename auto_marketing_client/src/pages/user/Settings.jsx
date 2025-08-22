import { useState } from "react";
import {
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ErrorMessage, Form, Formik } from "formik";
import userService from "../../service/userService";
import toast from "react-hot-toast";
import * as Yup from "yup";

export default function Settings() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,

    // Privacy
    profileVisibility: "public", // public, private, friends
    showEmail: false,
    showPhone: false,

    // Appearance
    theme: "light", // light, dark, auto
    language: "vi", // vi, en

    // Security
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Logic lưu cài đặt
    console.log("Saving settings:", settings);
    // Thông báo lưu thành công
  };

  const handleChangePassword = async (
    value,
    { setSubmitting, setFieldError, resetForm }
  ) => {
    // Logic đổi mật khẩu
    console.log("Changing password...", value);
    const data = await userService.changePassword(value);

    if (data.success) {
      toast.success("Đã đổi mật khẩu");
      resetForm();
    } else {
      if (data.error === "WRONG_PASSWORD") {
        setFieldError("currentPassword", "Mật khẩu không chính xác");
      } else if (data.error === "SAME_OLD_PASSWORD") {
        setFieldError(
          "newPassword",
          "Mật khẩu mới không được trùng mật khẩu cũ"
        );
      } else {
        toast.error("Đổi mật khẩu không thành công do lỗi");
      }
    }

    setSubmitting(false);
  };

  const changePasswordValidation = Yup.object({
    currentPassword: Yup.string().required("Vui lòng nhập mật khẩu"),
    newPassword: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100, "Mật khẩu không được quá 100 ký tự")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
      )
      .required("Vui lòng nhập mật khẩu mới"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!"
      )
    ) {
      // Logic xóa tài khoản
      console.log("Deleting account...");
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600 mt-1">
              Quản lý thông tin tài khoản và tùy chọn ứng dụng
            </p>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BellIcon className="w-5 h-5 mr-2" />
              Thông báo
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            {[
              {
                key: "emailNotifications",
                label: "Thông báo qua email",
                desc: "Nhận thông báo về hoạt động tài khoản qua email",
              },
              {
                key: "pushNotifications",
                label: "Thông báo đẩy",
                desc: "Nhận thông báo đẩy trên trình duyệt",
              },
              {
                key: "marketingEmails",
                label: "Email marketing",
                desc: "Nhận email về sản phẩm mới và ưu đãi",
              },
              {
                key: "weeklyReports",
                label: "Báo cáo hàng tuần",
                desc: "Nhận báo cáo tổng hợp hoạt động hàng tuần",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) =>
                      handleSettingChange(item.key, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Quyền riêng tư
            </h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Profile Visibility */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Hiển thị hồ sơ
              </label>
              <select
                value={settings.profileVisibility}
                onChange={(e) =>
                  handleSettingChange("profileVisibility", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Công khai</option>
                <option value="private">Riêng tư</option>
                <option value="friends">Chỉ bạn bè</option>
              </select>
            </div>

            {/* Contact Info Visibility */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  Hiển thị email
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showEmail}
                    onChange={(e) =>
                      handleSettingChange("showEmail", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  Hiển thị số điện thoại
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showPhone}
                    onChange={(e) =>
                      handleSettingChange("showPhone", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Giao diện & Ngôn ngữ
            </h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Theme */}
            <div>
              <label className="block font-medium text-gray-900 mb-3">
                Chủ đề
              </label>
              <div className="flex space-x-4">
                {[
                  { value: "light", label: "Sáng", icon: SunIcon },
                  { value: "dark", label: "Tối", icon: MoonIcon },
                  { value: "auto", label: "Tự động", icon: GlobeAltIcon },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange("theme", theme.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      settings.theme === theme.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <theme.icon className="w-4 h-4" />
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Ngôn ngữ
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  handleSettingChange("language", e.target.value)
                }
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Bảo mật
            </h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            {/* Two Factor Auth */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  Xác thực hai yếu tố
                </div>
                <div className="text-sm text-gray-500">
                  Thêm lớp bảo mật cho tài khoản của bạn
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) =>
                    handleSettingChange("twoFactorAuth", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Login Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  Cảnh báo đăng nhập
                </div>
                <div className="text-sm text-gray-500">
                  Nhận thông báo khi có đăng nhập từ thiết bị mới
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.loginAlerts}
                  onChange={(e) =>
                    handleSettingChange("loginAlerts", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Change Password */}
            <Formik
              enableReinitialize
              initialValues={passwordData}
              onSubmit={handleChangePassword}
              validationSchema={changePasswordValidation}
            >
              {({ values, handleChange, isSubmitting, errors, touched }) => (
                <Form>
                  <div className="border-t pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Đổi mật khẩu
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            name="currentPassword"
                            value={values.currentPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.current ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <ErrorMessage
                          name="currentPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            name="newPassword"
                            value={values.newPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.new ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <ErrorMessage
                          name="newPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.confirm ? (
                              <EyeSlashIcon className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Đang lưu...
                          </div>
                        ) : (
                          "Đổi mật khẩu"
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 mb-6">
          <div className="px-6 py-4 border-b border-red-200">
            <h2 className="text-lg font-semibold text-red-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
              Vùng nguy hiểm
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Xóa tài khoản</div>
                <div className="text-sm text-gray-500">
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu. Hành động này không
                  thể hoàn tác.
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {/* <div className="text-center">
          <button
            onClick={handleSaveSettings}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Lưu tất cả cài đặt
          </button>
        </div> */}
      </div>
    </div>
  );
}
