import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Preloader } from "../components";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Preloader />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;