import apiClient from "../config/apiClient";

export const getAttendanceByDate = async (date) => {
  const response = await apiClient.get("/attendance", {
    params: date ? { date } : {},
  });
  return response.data;
};

export const saveAttendance = async (payload) => {
  const response = await apiClient.post("/attendance", payload);
  return response.data;
};

export const getAttendanceStats = async () => {
  const response = await apiClient.get("/attendance/stats");
  return response.data;
};
