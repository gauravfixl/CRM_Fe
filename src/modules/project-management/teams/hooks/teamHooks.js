/**
 * Refactor Summary:
 * - Removed console logs
 * - Fixed duplicate/incorrect comments
 * - Refactored 'deleteTeamMember' to use axios params instead of manual string concatenation
 * - Added JSDoc documentation
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all teams, optionally filtered by workspace or project.
 * @param {string} [workspaceId] - Workspace ID.
 * @param {string} [projectId] - Project ID.
 */
export const getAllTeams = async (workspaceId, projectId) => {
  const url = `/teams`;
  const params = {};
  if (workspaceId) params.workspaceId = workspaceId;
  if (projectId) params.projectId = projectId;

  const response = await axios.get(url, { params });
  return response;
};

/**
 * Creates a new team.
 * @param {Object} body - Team data.
 */
export const createTeam = async (body) => {
  const url = `/teams`;
  const response = await axios.post(url, body);
  return response;
};

/**
 * Fetches team details by ID.
 * @param {string} teamId - Team ID.
 */
export const getTeamById = async (teamId) => {
  const url = `/teams/${teamId}/details`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches members of a team.
 * @param {string} teamId - Team ID.
 * @param {string} [projectId] - Optional Project ID filter.
 */
export const getAllTeamMembers = async (teamId, projectId) => {
  const url = `/teams/${teamId}/members`;
  const params = {};
  if (projectId) params.projectId = projectId;

  const response = await axios.get(url, { params });
  return response;
};

/**
 * Adds a member to a team.
 * @param {string} teamId - Team ID.
 * @param {Object} body - Member data.
 */
export const addTeamMember = async (teamId, body) => {
  const url = `/teams/${teamId}/add-member`;
  const response = await axios.post(url, body);
  return response;
};

/**
 * Removes a member from a team.
 * @param {string} teamId - Team ID.
 * @param {string} memberId - Member ID.
 * @param {string} projectId - Project ID (required for context).
 */
export const deleteTeamMember = async (teamId, memberId, projectId) => {
  const url = `/teams/${teamId}/member/${memberId}`;
  const response = await axios.delete(url, {
    params: { projectId },
  });
  return response;
};