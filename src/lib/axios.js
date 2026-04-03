

import axios from "axios";
import { API } from "@/config/backend";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth-cookies";

export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the org-token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const orgToken = localStorage.getItem("orgToken");
      if (orgToken) {
        config.headers["org-token"] = orgToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track refresh state to avoid multiple concurrent refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, orgToken = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(orgToken);
    }
  });
  failedQueue = [];
};

// Response interceptor - auto refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors, skip if already retried or if it's the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === "/auth/refresh" ||
      originalRequest.url === "/auth/signin"
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((orgToken) => {
        if (orgToken) {
          originalRequest.headers["org-token"] = orgToken;
        }
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axiosInstance.post("/auth/refresh", {}, { withCredentials: true });
      const newOrgToken = res.data?.orgToken;

      if (newOrgToken) {
        localStorage.setItem("orgToken", newOrgToken);
        setAuthCookie(newOrgToken);
        originalRequest.headers["org-token"] = newOrgToken;
      }

      processQueue(null, newOrgToken);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Refresh failed - clear auth state and redirect to login
      localStorage.clear();
      clearAuthCookie();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
