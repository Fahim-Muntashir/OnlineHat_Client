// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
