import apiClient from "../config/apiClient";

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const signupUser = async (details) => {
  const response = await apiClient.post("/auth/signup", details);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (updates) => {
  const response = await apiClient.put("/auth/profile", updates);
  return response.data;
};
