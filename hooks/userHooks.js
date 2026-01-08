/**
 * Refactor Summary:
 * - Fixed missing 'orgId' variable references (now retrieved dynamically)
 * - Removed undefined 'API' usages and standardized relative paths
 * - Adjusted 'useTokenRefresher' interval from 30s (debug) to 30m (production)
 * - Added JSDoc documentation
 * - Cleaned up console logs and redundant logic
 */

import { axiosInstance as axios } from "@/lib/axios";
import { useState, useEffect } from "react";

/**
 * Adds a user to the organization.
 * @param {Object} data - User data.
 */
export const adduser = async (data) => {
  try {
    const res = await axios.post(`/org/adduser`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * Creates a new user (Signup).
 * @param {Object} data - Signup data.
 */
export const createUser = async (data) => {
  try {
    const response = await axios.post(`/auth/signup`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error during user creation:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates a user's details.
 * @param {Object} form - Updated details.
 * @param {string} id - User ID.
 */
export const updateUser = async (form, id) => {
  try {
    const res = await axios.put(`/organization/updateuser/${id}`, form, {
      headers: { "Content-Type": "application/json" },
    });
    return res;
  } catch (err) {
    console.error("Error during updateUser API call:", err);
    return err.message;
  }
};

/**
 * Fetches the logged-in user's profile.
 */
export const userById = async () => {
  try {
    const response = await axios.get(`/auth/getprofile`);
    return response;
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
  }
};

/**
 * Fetches user details (Duplicate of userById).
 */
export const userNewDetails = async () => {
  try {
    const response = await axios.get(`/auth/getprofile`, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
  }
};

/**
 * Fetches users by department.
 * @param {string} department - Department name.
 */
export const getUsersByDept = async (department) => {
  const orgId = localStorage.getItem("orgID");
  const response = await axios.post(`/auth/getUsersByDept`, { orgId, department }, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/**
 * Invites a user to the organization.
 * @param {Object} form - Invite data.
 */
export const inviteUser = async (form) => {
  try {
    const response = await axios.post(`/organization/createInvite`, form);
    return response;
  } catch (error) {
    console.error("Error in inviteUser API call:", error);
    throw error;
  }
};

/**
 * Hook to accept an invitation.
 */
export const useAcceptInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const acceptInvite = async (token) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`/organization/acceptInvite/${token}`, {}, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(response.data.message || "Invitation accepted successfully!");
      return response.data;
    } catch (err) {
      console.error("Error during acceptInvite:", err);
      setError(err.response?.data?.message || "An error occurred.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { acceptInvite, loading, error, success };
};

/**
 * Updates user profile image.
 * @param {Object} formData - Image data.
 * @param {string} id - User ID.
 */
export const updateUserProfileImage = async (formData, id) => {
  const response = await axios.patch(`/auth/updateProfilephoto/${id}`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/**
 * Fetches user profile (Duplicate of userById).
 */
export const getUserProfile = async () => {
  const response = await axios.get(`/auth/getprofile`, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/**
 * Fetches all users for the organization.
 */
export const getAllUsers = async () => {
  const orgId = localStorage.getItem("orgID");
  const response = await axios.get(`/auth/getAllusers/${orgId}`, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/**
 * Deletes a user.
 * @param {string} userId - User ID.
 */
export const deleteUser = async (userId) => {
  if (!userId) throw new Error("User ID is required to delete a user.");
  try {
    const { data } = await axios.delete(`/organization/deleteuser/${userId}`);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Adds a role.
 * @param {Object} formData - Role data.
 */
export const addRole = async (formData) => {
  const response = await axios.post(`/role-permission/create`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

/**
 * Fetches roles.
 * @param {Object} params - Query params.
 */
export const getRoles = async (params = {}) => {
  const response = await axios.get(`/role-permission/list`, {
    headers: { "Content-Type": "application/json" },
    params,
  });
  return response;
};

/**
 * Hook to automatically refresh auth token.
 * @param {boolean} enabled - Whether to enable refreshing.
 */
export const useTokenRefresher = (enabled) => {
  useEffect(() => {
    if (!enabled) return;

    const refreshToken = async () => {
      // console.log("Calling refresh API...");
      try {
        await axios.post("/auth/refresh", {}, { withCredentials: true });
        // console.log("Token refreshed");
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    };

    // Refresh immediately on mount
    refreshToken();

    // Refresh every 30 minutes (30 * 60 * 1000)
    const intervalId = setInterval(refreshToken, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [enabled]);
};
