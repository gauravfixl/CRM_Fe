import { axiosInstance as axios } from "@/lib/axios";
import { useState } from "react";

/**
 * Updates a role's permissions by ID.
 * @param {Object} form - The updated role/permission data.
 * @param {string} id - The ID of the role to update.
 */
export const updateRole = async (form, id) => {
  const url = `/role-permission/${id}`;
  try {
    const res = await axios.patch(url, form);
    if (res.status === 200) {
      console.log("Role updated successfully:", res.data);
      return res;
    } else {
      console.error("Unexpected status code:", res.status);
      return null;
    }
  } catch (err) {
    console.error("Error during updateRole API call:", err);
    throw err;
  }
};

/**
 * Fetches the current user's profile and updates the provided state.
 * @param {Function} setSingleUser - State setter function for the user data.
 */
export const userById = async (setSingleUser) => {
  try {
    const response = await axios.get("/auth/getprofile");
    if (response?.data?.user) {
      setSingleUser(response.data.user);
    }
    return response;
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
  }
};

/**
 * Fetches the current user's profile details.
 */
export const userNewDetails = async () => {
  try {
    const response = await axios.get("/auth/getprofile");
    return response;
  } catch (err) {
    console.error("Error in userNewDetails API call:", err.message);
  }
};

/**
 * Invites a user to an organization.
 * @param {Object} form - Invite data (email, role, etc.).
 */
export const inviteUser = async (form) => {
  try {
    const response = await axios.post("/organization/createInvite", form);
    return response;
  } catch (error) {
    console.error("Error in inviteUser API call:", error);
    throw error;
  }
};

/**
 * Hook to manage the invitation acceptance process.
 */
export const useAcceptInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const acceptInvite = async (token) => {
    const url = `/organization/acceptInvite/${token}`;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(url, {});
      setSuccess(response.data.message || "Invitation accepted successfully!");
      return response.data;
    } catch (err) {
      console.error("Error during acceptInvite API call:", err);
      setError(err.response?.data?.message || "An error occurred.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { acceptInvite, loading, error, success };
};

/**
 * Updates a user's profile image.
 */
export const updateUserProfileImage = async (formData, id) => {
  const url = `/auth/updateProfilephoto/${id}`;
  try {
    const response = await axios.patch(url, formData);
    return response;
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};

/**
 * Fetches all roles and permissions based on parameters.
 * @param {Object} params - Query parameters (e.g., orgId, scope).
 */
export const getAllRolesNPermissions = async (params) => {
  try {
    const response = await axios.get("/role-permission/all", { params });
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

/**
 * Deletes a role by ID.
 * @param {string} roleId - The ID of the role to delete.
 */
export const deleteRole = async (roleId) => {
  if (!roleId) {
    throw new Error("Role ID is required to delete a role.");
  }
  try {
    const response = await axios.delete(`/role-permission/${roleId}`);
    return response;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

/**
 * Adds a new role.
 * @param {Object} formData - The role data to create.
 */
export const addRole = async (formData) => {
  try {
    const response = await axios.post("/role-permission/create", formData);
    return response;
  } catch (error) {
    console.error("Error adding role:", error);
    throw error;
  }
};
