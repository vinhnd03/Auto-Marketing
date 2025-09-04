import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Preloader } from "../components";

 const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if(loading) return (<Preloader />)

    if (user) {
        return user.role.name === "ADMIN" ?
            <Navigate to="/admin" replace /> : <Navigate to="/" replace />
    }

    return children;
}

export default GuestRoute;