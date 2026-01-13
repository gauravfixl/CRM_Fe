/**
 * Refactor Summary:
 * - Fixed missing leading slash in `updateTask` URL
 * - Removed incorrect header comments and console logs
 * - Improved query parameter handling
 * - Added JSDoc documentation
 * - Standardized error handling
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all tasks for a project/board.
 * @param {string} projectId - Project ID.
 * @param {string} boardId - Board ID.
 * @param {string} [teamId] - Optional Team ID.
 */
export const getAllTasks = async (projectId, boardId, teamId) => {
  if (!projectId || !boardId) {
    throw new Error("projectId and boardId are required");
  }

  try {
    const params = new URLSearchParams({ projectId, boardId });
    if (teamId) params.append("teamId", teamId);

    const response = await axios.get(`/task/${projectId}/all?${params.toString()}`);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Adds a new task.
 * @param {Object} form - Task data.
 * @param {string} projectId - Project ID.
 */
export const addTask = async (form, projectId) => {
  const url = `/task/${projectId}/create`;
  const response = await axios.post(url, form);
  return response;
};

/**
 * Fetches a single task by ID.
 * @param {string} taskId - Task ID.
 */
export const getTaskById = async (taskId) => {
  const url = `/task/${taskId}`;
  const response = await axios.get(url);
  return response;
};

/**
 * Updates an existing task.
 * @param {string} projectId - Project ID.
 * @param {string} taskId - Task ID.
 * @param {Object} payload - Updated task data.
 */
export const updateTask = async (projectId, taskId, payload) => {
  // Added leading slash to URL
  const url = `/task/project/${projectId}/${taskId}/update`;
  const response = await axios.patch(url, payload);
  return response;
};

/**
 * Fetches all subtasks for a task.
 * @param {string} projectId - Project ID.
 * @param {string} boardId - Board ID.
 * @param {string} taskId - Task ID.
 */
export const getAllSubTasks = async (projectId, boardId, taskId) => {
  if (!projectId || !boardId) {
    throw new Error("projectId and boardId are required");
  }

  try {
    const params = new URLSearchParams({ boardId });
    const response = await axios.get(`/task/project/${projectId}/${taskId}/subtasks?${params.toString()}`);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches tasks grouped by column/board.
 * @param {string} boardId - Board ID.
 */
export const getTasksByColumn = async (boardId) => {
  const url = `/task/${boardId}/by-board`;
  const response = await axios.get(url);
  return response;
};

/**
 * Deletes a task.
 * @param {string} projectId - Project ID.
 * @param {string} boardId - Board ID.
 * @param {string} taskId - Task ID.
 * @param {string} [teamId] - Optional Team ID.
 */
export const deleteTask = async (projectId, boardId, taskId, teamId) => {
  if (!projectId || !boardId) {
    throw new Error("projectId and boardId are required");
  }

  try {
    const params = new URLSearchParams({ boardId });
    if (teamId) params.append("teamId", teamId);

    const response = await axios.delete(`/task/project/${projectId}/${taskId}/delete?${params.toString()}`);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Reorders a task within the board.
 * @param {string} projectId - Project ID.
 * @param {string} taskId - Task ID.
 * @param {Object} form - Reorder data.
 */
export const reorderTask = async (projectId, taskId, form) => {
  if (!projectId || !taskId) {
    throw new Error("projectId and taskId are required");
  }

  try {
    const response = await axios.patch(`/task/project/${projectId}/${taskId}/re-order`, form);
    return response;
  } catch (err) {
    throw err;
  }
};
