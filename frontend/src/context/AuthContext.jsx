import { useMemo, useState } from "react";
import { loginUser } from "../services/authService";
import AuthContext from "./authContextStore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isLoggedIn", "true");
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user && localStorage.getItem("token")),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
