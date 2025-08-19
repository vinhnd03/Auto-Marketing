import { useEffect, useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Preloader from "./../../components/ui/Preloader";
import userService from "../../service/userService";
import { Formik, Form } from "formik";
import * as Yup from "yup";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    job: "",
    createdAt: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      // await fetchUser();
      try {
        if (user) {
          const data = await userService.getUserProfile(user.id);
          console.log(data);
          if (data) {
            setFormData(data);
          } else {
            toast.error("Không tìm thấy dữ liệu");
          }
        }
      } catch (error) {
        toast.error("Lỗi máy chủ");
      }
    };
    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (value) => {
    console.log(value);
    const fetchData = async () => {
      setFormData({...value})
      const status = await userService.updateUserProfile(formData);
      if (status) {
        toast.success("Đã cập nhật thông tin");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      }
      setIsEditing(false);
    };

    fetchData();
  };

  const handleCancel = () => {
    // Reset lại dữ liệu ban đầu
    setFormData({
      ...user,
    });
    setIsEditing(false);
  };

  if (!user) return <Preloader />;

  return (
    <div className="bg-gray-50 py-8">
      <Formik enableReinitialize initialValues={formData} onSubmit={handleSave}>
        {({ values, handleChange }) => (
          <Form>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Hồ sơ cá nhân
                    </h1>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          // onClick={handleSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="px-6 py-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                      />
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                          <CameraIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {formData.name}
                      </h2>
                      <p className="text-gray-600">{formData.job}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Thành viên từ{" "}
                        <span>
                          {new Date(formData.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin cá nhân
                  </h3>
                </div>

                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ và tên */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <UserIcon className="w-4 h-4 inline mr-2" />
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          readOnly
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.email}</p>
                      )}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <PhoneIcon className="w-4 h-4 inline mr-2" />
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.phone}</p>
                      )}
                    </div>

                    {/* Công ty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nghề nghiệp
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="job"
                          value={formData.job}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.job}</p>
                      )}
                    </div>
                  </div>

                  {/* Giới thiệu */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới thiệu bản thân
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Viết vài dòng giới thiệu về bản thân..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2 leading-relaxed">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    15
                  </div>
                  <div className="text-gray-600">Chiến dịch đã tạo</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    8
                  </div>
                  <div className="text-gray-600">Chiến dịch thành công</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    2.5M
                  </div>
                  <div className="text-gray-600">Lượt tiếp cận</div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
