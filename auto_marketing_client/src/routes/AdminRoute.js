import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Preloader } from "../components";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (<Preloader />);
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role.name !== "ADMIN") {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default AdminRoute;