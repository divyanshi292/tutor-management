import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getProfile,
  loginUser,
  signupUser,
  updateProfile as updateProfileApi,
} from "../services/authService";
import AuthContext from "./authContextStore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const saveAuthSession = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
    setUser(userData);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await loginUser(credentials);
      saveAuthSession(data.token, data.user);
      return data.user;
    },
    [saveAuthSession]
  );

  const signup = useCallback(
    async (details) => {
      const data = await signupUser(details);
      saveAuthSession(data.token, data.user);
      return data.user;
    },
    [saveAuthSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  }, []);

  const updateUserProfile = useCallback(async (updates) => {
    const updatedUser = await updateProfileApi(updates);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let isMounted = true;
    getProfile()
      .then((freshUser) => {
        if (isMounted) {
          localStorage.setItem("user", JSON.stringify(freshUser));
          setUser(freshUser);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401 && isMounted) {
          logout();
        }
      });

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user && localStorage.getItem("token")),
      login,
      signup,
      logout,
      updateUserProfile,
    }),
    [user, login, signup, logout, updateUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
