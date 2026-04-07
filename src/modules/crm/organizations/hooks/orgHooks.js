/**
 * Refactor Summary:
 * - Added JSDoc documentation for all organization-related hooks
 * - Cleaned up redundant console logs and comments
 * - Preserved existing API endpoints and functionality
 * - Standardized error handling
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all organizations.
 */
export const getAllOrg = async () => {
  const response = await axios.get("/organization/org/all");
  return response;
};

/**
 * Fetches details for the current organization (from localStorage).
 */
export const getOrgDetails = async () => {
  const orgId = localStorage.getItem("orgID");
  const response = await axios.get(`/organization/${orgId}`);
  return response;
};

/**
 * Fetches departments for the current organization.
 */
export const getOrgDept = async () => {
  const orgId = localStorage.getItem("orgID");
  const response = await axios.get(`/org/getOrgDeprt/${orgId}`);
  return response;
};

/**
 * Creates a new organization.
 * @param {Object} form - Organization data.
 */
export const createOrg = async (form) => {
  const response = await axios.post("/organization", form);
  return response;
};

/**
 * Updates the current organization's details.
 * @param {Object} form - Updated organization data.
 */
export const updateOrg = async (form) => {
  const orgId = localStorage.getItem("orgID");
  const response = await axios.patch(`/org/update/${orgId}`, form);
  return response;
};

/**
 * Updates the current organization's logo.
 * @param {Object} form - Logo data.
 */
export const updateLogo = async (form) => {
  const orgId = localStorage.getItem("orgID");
  const response = await axios.patch(`/org/logo/${orgId}`, form);
  return response;
};

/**
 * Fetches all users in the organization.
 */
export const fetchUsersApi = async () => {
  const response = await axios.get("/organization/users/all");
  return response.data;
};

/**
 * Fetches an organization by its ID.
 * @param {string} orgId - Organization ID.
 */
export const getOrgById = async (orgId) => {
  const response = await axios.get(`/organization/${orgId}`);
  return response;
};

/**
 * Switches the active organization context.
 * @param {string} orgId - Target Organization ID.
 */
export const switchOrganization = async (orgId) => {
  try {
    const response = await axios.post("/organization/switch", { orgId });
    return response.data;
  } catch (error) {
    console.error("Error in switchOrganization API call:", error);
    throw error;
  }
};

/**
 * Fetches all organization invites.
 */
export const getAllOrgInvites = async () => {
  const response = await axios.get("/organization/all/Invite");
  return response;
};

/**
 * Creates an organization invite.
 * @param {Object} form - Invite data { email, role }.
 */
export const createOrgInvite = async (form) => {
  const response = await axios.post("/organization/createInvite", form);
  return response;
};

/**
 * Declines an organization invite.
 * @param {string} token - Invite token.
 */
export const declineOrgInvite = async (token) => {
  const response = await axios.post(`/organization/declineInvite/${token}`);
  return response;
};

/**
 * Updates an organization member's details.
 * @param {string} memberId - The member's ID.
 * @param {Object} form - Updated member data.
 */
export const updateOrgUser = async (memberId, form) => {
  const response = await axios.put(`/organization/updateuser/${memberId}`, form);
  return response;
};

/**
 * Deletes an organization member.
 * @param {string} memberId - The member's ID.
 */
export const deleteOrgUser = async (memberId) => {
  const response = await axios.delete(`/organization/deleteuser/${memberId}`);
  return response;
};

/**
 * Updates organization details (alternate endpoint).
 * @param {Object} form - Updated org data.
 */
export const updateOrgDetails = async (form) => {
  const response = await axios.patch("/organization/update/details", form);
  return response;
};
