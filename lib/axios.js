

import axios from "axios";
import { API } from "../backend";
export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true, // 🔥 ensures cookies are always sent
  headers: {
    "Content-Type": "application/json",
  },
})
 