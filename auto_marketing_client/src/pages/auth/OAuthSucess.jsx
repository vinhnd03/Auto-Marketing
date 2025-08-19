import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Preloader } from "../../components";
import { useAuth } from "../../context/AuthContext";

const OAuth2Success = () => {
  const { fetchUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await fetchUser(); // load lại user từ cookie HttpOnly
      if (user?.role?.name === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/workspace");
      }
    };
    init();
  }, []);

  return <Preloader />;
};

export default OAuth2Success;