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

// ────────────────────────────────────────────────────────────────────
// CATALOG — fetch full module/permission/role catalog from backend.
// Falls back to hardcoded frontend catalog if endpoint is not yet
// implemented (so role builder works end-to-end before backend ships).
// ────────────────────────────────────────────────────────────────────

/**
 * Fetches the complete RBAC catalog: modules, permissions, role definitions, scopes.
 * Expected backend response shape:
 *   {
 *     modules: [{ id, name, group, actions: string[] }],
 *     permissions: string[],
 *     roles: [{ slug, name, scope }],
 *     scopes: [{ code, name }]
 *   }
 *
 * Until backend exposes GET /role-permission/catalog, this resolves null
 * so callers can fall back to the hardcoded catalog in module-permission-map.ts.
 */
export const getPermissionCatalog = async () => {
  try {
    const response = await axios.get("/role-permission/catalog");
    return response?.data ?? null;
  } catch (error) {
    if (error?.response?.status === 404) {
      // endpoint not implemented yet — caller should use local fallback
      return null;
    }
    console.error("Error fetching permission catalog:", error);
    return null;
  }
};

// ────────────────────────────────────────────────────────────────────
// ROLE ASSIGNMENT — operates on OrgMember records (user ↔ role binding).
// Backend currently exposes only invite-flow and member listing.
// These helpers target the full assignment lifecycle the UI needs.
// ────────────────────────────────────────────────────────────────────

/**
 * List all members of the org with their current role + status.
 * Uses existing /organization/users/all endpoint.
 */
export const listOrgMembers = async (params = {}) => {
  try {
    const response = await axios.get("/organization/users/all", { params });
    return response;
  } catch (error) {
    console.error("Error listing org members:", error);
    throw error;
  }
};

/**
 * Assign / change a user's role inside the org.
 *
 * Wired to existing backend endpoint:
 *   PUT /organization/updateuser/:memberId
 *   body: { Role: <role slug>, custom: <boolean> }
 *
 * The backend looks up the RolePermission via `{ role: Role, isCustom: custom }`,
 * so we pass the role slug + isCustom flag (NOT the role _id).
 *
 * Backend will reject SuperAdmin / OrgAdmin assignment and self-demotion
 * for the org creator. permissionsOverride is reset on role change.
 */
export const assignRoleToMember = async (memberId, { roleSlug, isCustom }) => {
  if (!memberId || !roleSlug) {
    throw new Error("memberId and roleSlug are required");
  }
  try {
    const response = await axios.put(`/organization/updateuser/${memberId}`, {
      Role: roleSlug,
      custom: Boolean(isCustom),
    });
    return response;
  } catch (error) {
    console.error("Error assigning role:", error);
    throw error;
  }
};

/**
 * Revoke a user's role.
 *
 * Backend has no first-class "revoke role" endpoint — the closest existing
 * action is DELETE /organization/deleteuser/:memberId, which removes the
 * member from the org entirely. We expose that here as the revoke fallback.
 *
 * If you instead want to *downgrade* the user to a minimal role without
 * removing them, use assignRoleToMember(memberId, { roleSlug: "OrgCustom",
 * isCustom: true }) bound to a pre-seeded "Read Only" custom role.
 */
export const revokeMemberRole = async (memberId) => {
  if (!memberId) throw new Error("memberId is required");
  try {
    const response = await axios.delete(`/organization/deleteuser/${memberId}`);
    return response;
  } catch (error) {
    console.error("Error revoking member access:", error);
    throw error;
  }
};

/**
 * Set granular permission overrides for a single member.
 *
 * Wired to existing backend endpoint:
 *   PUT /organization/updateuser/:memberId
 *   body: { overridePermissions: [{ module, actions }] }
 *
 * NOTE: Backend ignores overridePermissions when the role is also being
 * changed in the same request. Call this AFTER any role change, or send
 * the override request without a Role field.
 */
export const setMemberPermissionOverride = async (memberId, permissionsOverride) => {
  if (!memberId) throw new Error("memberId is required");
  try {
    const response = await axios.put(`/organization/updateuser/${memberId}`, {
      overridePermissions: permissionsOverride || [],
    });
    return response;
  } catch (error) {
    console.error("Error setting permission override:", error);
    throw error;
  }
};

/**
 * Clear permission overrides — falls back to role defaults.
 *
 * Sends an empty overridePermissions array. Backend currently only sets
 * overrides when length > 0, so to fully clear we may need a backend tweak
 * to also wipe `permissionsOverride: []` and `hasCustomPermission: false`
 * when an empty array is sent. For now, this best-effort sends empty array.
 */
export const clearMemberPermissionOverride = async (memberId) => {
  if (!memberId) throw new Error("memberId is required");
  try {
    const response = await axios.put(`/organization/updateuser/${memberId}`, {
      overridePermissions: [],
    });
    return response;
  } catch (error) {
    console.error("Error clearing permission override:", error);
    throw error;
  }
};

/**
 * Get effective permissions for the currently authenticated user.
 * Used to populate useAuthStore.permissions for sidebar/route filtering.
 * Expected backend route: GET /me/permissions
 * Response: { role, permissions: [{ module, actions }] }
 *
 * Falls back to /auth/getprofile if /me/permissions doesn't exist.
 */
export const getMyEffectivePermissions = async () => {
  try {
    const response = await axios.get("/me/permissions");
    return response?.data ?? null;
  } catch (error) {
    if (error?.response?.status === 404) {
      // try fallback
      try {
        const fallback = await axios.get("/auth/getprofile");
        return fallback?.data ?? null;
      } catch (innerErr) {
        console.error("Error fetching profile fallback:", innerErr);
        return null;
      }
    }
    console.error("Error fetching effective permissions:", error);
    return null;
  }
};

/**
 * Get a single role with full populated permissions.
 * Used by role detail / edit screens to reload after save.
 * Expected backend route: GET /role-permission/:id
 */
export const getRoleById = async (roleId) => {
  if (!roleId) throw new Error("roleId is required");
  try {
    const response = await axios.get(`/role-permission/${roleId}`);
    return response;
  } catch (error) {
    console.error("Error fetching role by id:", error);
    throw error;
  }
};
