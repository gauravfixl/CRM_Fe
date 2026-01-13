/**
 * Refactor Summary:
 * - Improved documentation for board-related API hooks
 * - Standardized query parameter handling using URLSearchParams
 * - Cleaned up redundant/commented-out code
 * - Improved error message consistency
 * - Preserved existing exports and functionality
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError } from "@/utils/toast";

/**
 * Fetches a single board by ID with optional project and team filters.
 * @param {string} projectId - Optional project ID filter.
 * @param {string} boardId - The ID of the board to fetch.
 * @param {string} [teamId] - Optional team ID filter.
 */
export const getBoardById = async (projectId, boardId, teamId) => {
  try {
    const params = new URLSearchParams({ projectId });
    if (teamId) {
      params.append("teamId", teamId);
    }

    const response = await axios.get(`/board/${boardId}?${params.toString()}`);
    return response;
  } catch (err) {
    console.error("Error in getBoardById:", err);
    throw err;
  }
};

/**
 * Adds a new column to a board.
 * @param {string} boardId - The ID of the board to update.
 * @param {Object} form - The new column data.
 */
export const addNewColumn = async (boardId, form) => {
  try {
    const response = await axios.post(`/board/${boardId}/add-column`, form);
    return response;
  } catch (err) {
    showError("Failed to add column.");
    throw err;
  }
};

/**
 * Deletes a column from a board.
 * @param {string} boardId - The ID of the board.
 * @param {Object} payload - The column termination/deletion data.
 */
export const deleteColumn = async (boardId, payload) => {
  try {
    const response = await axios.delete(`/board/${boardId}/delete-column`, {
      data: payload,
    });
    return response;
  } catch (err) {
    showError("Failed to delete column.");
    throw err;
  }
};

/**
 * Updates an existing column in a board.
 * @param {string} boardId - The ID of the board.
 * @param {Object} form - The updated column data.
 */
export const updateColumn = async (boardId, form) => {
  try {
    const response = await axios.patch(`/board/${boardId}/update-column`, form);
    return response;
  } catch (err) {
    showError("Failed to update column.");
    throw err;
  }
};

/**
 * Fetches all boards associated with a specific project.
 * @param {string} projectId - The ID of the project.
 */
export const getAllProjectBoards = async (projectId) => {
  try {
    const response = await axios.get(`/board/${projectId}/all`);
    return response;
  } catch (err) {
    console.error("Error in getAllProjectBoards:", err);
    throw err;
  }
};
