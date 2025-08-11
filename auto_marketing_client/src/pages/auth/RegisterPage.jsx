import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const registerSchema = Yup.object({
  lastName: Yup.string()
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ không được quá 50 ký tự")
    .required("Vui lòng nhập họ"),
  firstName: Yup.string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .required("Vui lòng nhập tên"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: Yup.string()
    .matches(/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .nullable(),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu không được quá 100 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
    )
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng")
    .required("Bạn phải đồng ý với điều khoản sử dụng"),
  subscribeNewsletter: Yup.boolean(),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = {
        lastName: values.lastName,
        firstName: values.firstName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        subscribeNewsletter: values.subscribeNewsletter,
      };

      const result = await register(userData);
      if (result.success) {
        toast.success("Đăng ký thành công!");
        navigate("/workspace");
      } else {
        toast.error(result.error || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Về trang chủ
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">AM</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Tạo tài khoản mới
          </h2>
          <p className="text-gray-600">
            Bắt đầu hành trình tự động hóa marketing của bạn
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Họ
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName && touched.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Họ"
                      />
                    </div>
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tên
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName && touched.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Tên"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số điện thoại (tùy chọn)
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone && touched.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Tạo mật khẩu mạnh"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Field
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Tôi đồng ý với{" "}
                      <Link
                        to="/terms"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Chính sách bảo mật
                      </Link>
                    </label>
                  </div>
                  <ErrorMessage
                    name="agreeToTerms"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang tạo tài khoản...
                    </div>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">
              Bạn sẽ nhận được:
            </h4>
            <div className="space-y-2">
              {[
                "Dùng thử miễn phí 14 ngày",
                "Tạo không giới hạn chiến dịch",
                "Hỗ trợ khách hàng 24/7",
                "Cập nhật tính năng mới nhất",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-700"
                >
                  <CheckCircle
                    className="text-green-500 mr-2 flex-shrink-0"
                    size={16}
                  />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
