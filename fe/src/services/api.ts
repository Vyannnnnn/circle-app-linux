import axios from "axios";
import { store } from "../redux/store";
import { logout } from "@/redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data: {
    username: string;
    full_Name: string;
    email: string;
    password: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  getProfileById: (userId: number) => api.get(`/auth/${userId}/profile`),
  getProfile: () => api.get("/auth/profile"),

  editProfile: (data: FormData) => api.put("/auth/profile", data),
  getFollows: (type: "followers" | "following") =>
    api.get("/auth/follows", { params: { type } }),
  getSuggestions: () => api.get("/auth/suggested-users"),
  searchUsers: (query: string) =>
    api.get("/auth/search-users", { params: { query } }),
  follow: (userId: number) => api.post(`/auth/${userId}/follow`),
  unfollow: (userId: number) => api.post(`/auth/${userId}/unfollow`),
};

export const threadAPI = {
  getThreads: () => api.get("/threads/lists"),
  getUserThreads: () => api.get("/threads/user"),
  getThreadById: (threadId: number) => api.get(`/threads/${threadId}`),
  getThreadsByUserId: (id: number) => api.get(`/threads/user/${id}`),
  

  getRepliesByThreadId: (threadId: number) =>
    api.get(`/threads/${threadId}/replies`),
  createThread: (data: FormData) => api.post("/threads/create", data),
  createReply: (threadId: number, data: FormData) =>
    api.post(`/threads/${threadId}/reply`, data),
  likeThread: (id: number) => api.post(`/threads/${id}/like`),
  unlikeThread: (id: number) => api.post(`/threads/${id}/unlike`),
};

export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
};

export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}${path}`;
};

export default api;
