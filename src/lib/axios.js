

import axios from "axios";
import { API } from "@/config/backend";
export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true, // 🔥 ensures cookies are always sent
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
