import apiClient from "../config/apiClient";

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const signupUser = async (details) => {
  const response = await apiClient.post("/auth/signup", details);
  return response.data;
};
