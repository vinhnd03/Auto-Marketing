import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

let interceptorAttached = false;

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {

    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);

          // Xóa cookie JWT (nếu dùng cookie)
          document.cookie = "jwt=; Max-Age=0; path=/;";

          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate, setUser]);
};

// ✅ component wrapper để dùng trong App
export const AxiosInterceptor = () => {
  useAxiosInterceptor();
  return null;
};
