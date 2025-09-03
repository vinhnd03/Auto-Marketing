import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Khi app load, gọi /me để check user đã login chưa
  const fetchUser = async () => {
    try {
      // const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
      const resp = await api.get(`/auth/me`, {
        withCredentials: true,
      });
      setUser(resp.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
  try {
    await api.post('/auth/logout'); // Gọi API logout server
  } catch (error) {
    // Ignore errors
  } finally {
    // ✅ Clear mọi state và storage
    setUser(null);
    setIsAuthenticated(false);
    
    // ✅ Xóa cookie trên client
    document.cookie = 'jwt=; Max-Age=0; path=/;';
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
