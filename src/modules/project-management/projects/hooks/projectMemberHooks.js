/**
 * Refactor Summary:
 * - Fixed incomplete URL in 'deleteProjectMembers' (changed to /projects/{id}/members)
 * - Added JSDoc documentation
 * - Standardized formatting
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all members of a project.
 * @param {string} projectId - Project ID.
 */
export const getAllProjectMembers = async (projectId) => {
  const url = `/projects/${projectId}/members`;
  const response = await axios.get(url);
  return response;
};

/**
 * Adds members to a project.
 * @param {string} projectId - Project ID.
 * @param {Object} body - Member data.
 */
export const addProjectMembers = async (projectId, body) => {
  const url = `/projects/${projectId}/members`;
  const response = await axios.post(url, body);
  return response;
};

/**
 * Updates a project member.
 * @param {string} projectId - Project ID.
 * @param {string} memberId - Member ID.
 * @param {Object} body - Updated member data.
 */
export const updateProjectMember = async (projectId, memberId, body) => {
  const url = `/projects/${projectId}/members/${memberId}`;
  const response = await axios.patch(url, body);
  return response;
};

/**
 * Removes members from a project.
 * @param {string} projectId - Project ID.
 * @param {Object} body - Data identifying members to remove.
 */
export const deleteProjectMembers = async (projectId, body) => {
  // Corrected URL to target members endpoint
  const url = `/projects/${projectId}/members`;
  const response = await axios.delete(url, { data: body });
  return response;
};