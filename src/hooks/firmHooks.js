import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches the lightweight firm list (id + FirmName) for the current org.
 * Backend: GET /api/firm/getFirmList → { success, firms: [{ _id, FirmName }] }
 */
export const getFirmList = async () => {
  const response = await axios.get("/firm/getFirmList");
  return response;
};

/**
 * Fetches all firms (full objects) for the current org.
 */
export const getAllFirm = async () => {
  const response = await axios.get("/firm/getAllFirm");
  return response;
};

/**
 * Fetches a single firm by id.
 */
export const getFirmById = async (id) => {
  const response = await axios.get(`/firm/getFirm/${id}`);
  return response;
};
