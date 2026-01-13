/**
 * Refactor Summary:
 * - Removed 'API' import and used relative paths with axiosInstance
 * - Fixed incomplete URL in 'deleteProjectMember' (changed to /projects/{id}/members)
 * - Added JSDoc documentation for all project-related hooks
 * - Cleaned up console logs
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Creates a new project in a workspace.
 * @param {Object} formData - Project data.
 * @param {string} wsId - Workspace ID.
 */
export const createProject = async (formData, wsId) => {
  const url = `/project/create/${wsId}`;
  const response = await axios.post(url, formData);
  return response;
};

/**
 * Fetches project details by ID.
 * @param {string} id - Project ID.
 * @param {string} workspaceId - Workspace ID.
 */
export const getProjectById = async (id, workspaceId) => {
  const url = `/project/${id}/details`;
  try {
    const response = await axios.get(url, {
      params: { workspaceId: workspaceId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project by id:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches projects assigned to the current user in a workspace.
 * @param {string} wsId - Workspace ID.
 */
export const getMyProjects = async (wsId) => {
  const url = `/project/workspace/${wsId}/my-projects`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches analytics for a project.
 * @param {string} projectId - Project ID.
 */
export const getProjectAnalytics = async (projectId) => {
  const url = `/project/${projectId}/analytics`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches all projects (Admin only).
 */
export const getAdminProjects = async () => {
  const url = `/project/admin/all`;
  const response = await axios.get(url);
  return response;
};

/**
 * Deletes a project.
 * @param {string} projectId - Project ID.
 * @param {string} workspaceId - Workspace ID.
 */
export const deleteProject = async (projectId, workspaceId) => {
  const url = `/project/delete/${projectId}`;
  const response = await axios.delete(url, {
    data: { workspaceId },
  });
  return response;
};

/**
 * Fetches members of a project.
 * @param {string} projectId - Project ID.
 */
export const getProjectMembers = async (projectId) => {
  const url = `/projects/${projectId}/members`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches assignable members for a project.
 * @param {string} projectId - Project ID.
 * @param {string} workspaceId - Workspace ID.
 */
export const getProjectAssignableMembers = async (projectId, workspaceId) => {
  const url = `/project/${projectId}/assignable-members`;
  const response = await axios.post(url, { workspaceId });
  return response.data;
};

/**
 * Adds members to a project.
 * @param {string} projectId - Project ID.
 * @param {Object} formData - Member data.
 */
export const addProjectMembers = async (projectId, formData) => {
  const url = `/projects/${projectId}/members`;
  const response = await axios.post(url, formData);
  return response;
};

/**
 * Updates a project member's details.
 * @param {Object} formData - Updated member data.
 * @param {string} projectId - Project ID.
 * @param {string} memberId - Member ID.
 */
export const updateProjectMember = async (formData, projectId, memberId) => {
  const url = `/projects/${projectId}/members/${memberId}`;
  const response = await axios.post(url, formData);
  return response;
};

/**
 * Removes a member from a project.
 * @param {string} projectId - Project ID.
 * @param {Object} formData - Data identifying the member to remove.
 */
export const deleteProjectMember = async (projectId, formData) => {
  // Corrected URL to target members endpoint
  const url = `/projects/${projectId}/members`;
  const response = await axios.delete(url, { data: formData });
  return response;
};
