import { axiosInstance as axios } from "@/lib/axios";

/**
 * Creates a new team.
 * @param {Object} form - Team data.
 */
export const createTeam = async (form) => {
  const response = await axios.post("/teams/", form);
  return response;
};

/**
 * Fetches all teams.
 */
export const getAllTeams = async () => {
  const response = await axios.get("/teams/");
  return response;
};

/**
 * Fetches a team by ID.
 * @param {string} teamId - Team ID.
 */
export const getTeamById = async (teamId) => {
  const response = await axios.get(`/teams/${teamId}/details`);
  return response;
};

/**
 * Fetches teams by workspace ID.
 * @param {string} workspaceId - Workspace ID.
 */
export const getTeamsByWorkspace = async (workspaceId) => {
  const response = await axios.get(`/teams/${workspaceId}/all`);
  return response;
};

/**
 * Adds a member to a team.
 * @param {string} teamId - Team ID.
 * @param {Object} form - Member data.
 */
export const addTeamMember = async (teamId, form) => {
  const response = await axios.post(`/teams/${teamId}/add-member`, form);
  return response;
};

/**
 * Fetches members of a team.
 * @param {string} teamId - Team ID.
 */
export const getTeamMembers = async (teamId) => {
  const response = await axios.get(`/teams/${teamId}/members`);
  return response;
};

/**
 * Removes a member from a team.
 * @param {string} teamId - Team ID.
 * @param {string} memberId - Member ID.
 */
export const removeTeamMember = async (teamId, memberId) => {
  const response = await axios.delete(`/teams/${teamId}/member/${memberId}`);
  return response;
};

/**
 * Deletes a team.
 * @param {string} teamId - Team ID.
 */
export const deleteTeam = async (teamId) => {
  const response = await axios.delete(`/teams/${teamId}/delete`);
  return response;
};
