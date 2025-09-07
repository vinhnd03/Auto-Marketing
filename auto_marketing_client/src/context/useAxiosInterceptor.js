import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { cancelAllRequests, setSessionExpired } from "./api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const { setUser, logout } = useAuth();
  // const hasShown = useRef(false);

  // ✅ Dùng useCallback để giữ 1 reference duy nhất
  const errorHandler = useCallback(
    (error) => {
      const status = error.response?.status;
      const errorData = error.response?.data;
      if (status === 401 && errorData?.error === "Unauthorized") {
        // if (!hasShown.current) {
        // cancelAllRequests();
        // setSessionExpired(true);
        // hasShown.current = true;
        // logout();
        setUser(null);

        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", {
          id: "session-expired",
        });
        navigate("/login", { replace: true });
        // }

        // ⛔️ không reject để component không xử lý tiếp
        // return new Promise(() => { }); // "treo" promise này
        return Promise.resolve();
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
