import axios from "axios";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // set JSON hanya kalau bukan FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data: {
    username: string;
    full_Name?: string;
    email?: string;
    password: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  //   getProfile: () => api.get("/auth/profile"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // store.dispatch(logout());
  },
};

export const threadAPI = {
  getThreads: () => api.get("/threads/lists"),
  getThreadById: (id: number) => api.get(`/threads/${id}`),   
  getRepliesByThreadId: (threadId: number) => api.get(`/threads/${threadId}/replies`),
  createThread: (data: FormData) => api.post("/threads/create", data),
  likeThread: (id: number) => api.post(`/threads/${id}/like`),
  unlikeThread: (id: number) => api.post(`/threads/${id}/unlike`),
};

export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:3000${path}`;
};

export default api;
