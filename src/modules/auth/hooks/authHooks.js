/**
 * Refactor Summary:
 * - Improved code organization and readability
 * - Added JSDoc documentation for all API hooks
 * - Cleaned up redundant/duplicate comments
 * - Fixed minor naming inconsistencies
 * - Preserved UI & functionality
 */

import { axiosInstance as axios } from "@/lib/axios"

/**
 * Logs out the current user.
 * Clears local storage and redirects to the sign-in page.
 */
export const logoutUser = async () => {
  try {
    // 1. Hit logout API
    await axios.post("/auth/logout");

    // 2. Clear local storage
    localStorage.clear();

    // 3. Redirect to login page
    window.location.href = "/auth/signin";
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};

/**
 * Initiates the forgot password flow.
 * @param {Object} form - Form data containing user identifier (e.g., email).
 */
export const forgotPassword = async (form) => {
  const url = `/auth/forgot`;
  const response = await axios.post(url, form);
  return response;
};

/**
 * Logs in a user.
 * Note: Authentication is managed via secure cookies.
 * @param {Object} form - User credentials.
 */
export const signInUser = async (form) => {
  try {
    const response = await axios.post("/auth/signin", form);
    return response;
  } catch (error) {
    console.error("Error signing in user:", error.response?.data?.message);
    throw error;
  }
};

/**
 * Updates a user's details by ID.
 * @param {Object} form - Updated user data.
 * @param {string} id - User ID.
 */
export const updateUser = async (form, id) => {
  const url = `/auth/updateUser/${id}`;
  const response = await axios.patch(url, form);
  return response;
};

/**
 * Resets a user's password using a token.
 * @param {string} token - Reset token received via email.
 * @param {string} password - New password.
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post("/auth/reset", {
      token,
      password,
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

/**
 * Generates a QR code for 2FA setup.
 */
export const generateQr = async () => {
  try {
    const response = await axios.post("/auth/generate-2fa-qr");
    return response;
  } catch (error) {
    console.error("Error generating 2FA QR:", error.response?.data?.message);
    throw error;
  }
};

/**
 * Verifies the 2FA setup using an OTP.
 * @param {string} otp - One-time password from the authenticator app.
 */
export const verifyQr = async (otp) => {
  try {
    const response = await axios.post("/auth/verify-2fa-setup", { otp });
    return response;
  } catch (error) {
    console.error("Error verifying 2FA setup:", error.response?.data?.message);
    throw error;
  }
};

/**
 * Performs 2FA login verification.
 * @param {Object} params - UID and OTP.
 */
export const twofaLogin = async ({ otp, uid }) => {
  try {
    const response = await axios.post("/auth/verify-2fa-login", {
      uid,
      otp,
    });
    return response;
  } catch (error) {
    console.error("Error in 2FA login:", error.response?.data?.message);
    throw error;
  }
};

/**
 * Initiates passwordless login by sending an OTP to email.
 * @param {string} email - User email.
 */
export const pwlessLogin = async (email) => {
  try {
    const response = await axios.post("/auth/send-login-otp", { email });
    return response;
  } catch (error) {
    console.error("Error sending login OTP:", error.response?.data?.message);
    throw error;
  }
};

/**
 * Verifies a login OTP.
 * @param {string} email - User email.
 * @param {string} otp - Received OTP.
 */
export const otpLogin = async (email, otp) => {
  try {
    const response = await axios.post("/auth/verify-login-otp", {
      email,
      otp,
    });
    return response;
  } catch (error) {
    console.error("Error verifying login OTP:", error.response?.data?.message);
    throw error;
  }
};

// --- Legacy / Commented Code Section ---
// Preserved for historical reference.

/*
// export const signInUserLegacy = async (form) => {
//   try {
//     const macAddress = await getMacAddress();
//     const payload = { ...form, macAddress };
//     const response = await axios.post("/auth/signin", payload);
//     return response;
//   } catch (error) { ... }
// };
*/
