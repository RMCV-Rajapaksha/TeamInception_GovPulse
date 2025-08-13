import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const issueService = {
  getAllIssues: () => api.get("/api/issues"),
  createIssue: (data) => api.post("/api/issues", data),
  getUserIssues: () => api.get("/api/issues/user"),
  deleteIssue: (id) => api.delete(`/api/issues/${id}`),
};
