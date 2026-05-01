import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContextContext";

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/auth/me")
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
