import apiClient from "../config/apiClient";

export const getStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data;
};

export const createStudent = async (student) => {
  const response = await apiClient.post("/students", student);
  return response.data;
};

export const updateStudent = async (id, updates) => {
  const response = await apiClient.put(`/students/${id}`, updates);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await apiClient.delete(`/students/${id}`);
  return response.data;
};
