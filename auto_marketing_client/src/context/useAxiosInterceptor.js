import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // ✅ Dùng useCallback để giữ 1 reference duy nhất
  const errorHandler = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        setUser(null);

        // tránh toast trùng
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", {
          id: "session-expired",
        });

        navigate("/login", { replace: true });
      }
      return Promise.reject(error);
    },
    [navigate, setUser]
  );

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      errorHandler
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [errorHandler]); // chỉ re-attach khi errorHandler thay đổi
};

// ✅ wrapper
export const AxiosInterceptor = () => {
  useAxiosInterceptor();
  return null;
};
