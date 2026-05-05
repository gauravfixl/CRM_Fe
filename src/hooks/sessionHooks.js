import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all active sessions for the current user.
 */
export const getAllSessions = async () => {
  const response = await axios.get("/session/all");
  return response;
};

/**
 * Sends OTP for session deletion verification.
 */
export const sendSessionDeleteOtp = async () => {
  const response = await axios.post("/session/send-otp");
  return response;
};

/**
 * Deletes a session after OTP verification.
 * @param {Object} form - { sessionId, otp }.
 */
export const deleteSession = async (form) => {
  const response = await axios.delete("/session/delete", { data: form });
  return response;
};
