/**
 * Refactor Summary:
 * - Added JSDoc documentation
 * - Fixed incorrect comments
 * - Standardized formatting
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches the workflow associated with a board.
 * @param {string} boardId - Board ID.
 */
export const getWorkFlowByBoard = async (boardId) => {
  const response = await axios.get(`/workflow/${boardId}/workflow`);
  return response;
};

/**
 * Updates a workflow.
 * @param {string} boardId - Board ID (or Workflow ID depending on backend context).
 * @param {Object} payload - Workflow update data.
 */
export const updateWorkflow = async (boardId, payload) => {
  const response = await axios.patch(`/workflow/${boardId}/update`, payload);
  return response;
};

/**
 * Fetches a specific workflow by ID and Project ID.
 * @param {string} projectId - Project ID.
 * @param {string} workflowId - Workflow ID.
 */
export const workflowById = async (projectId, workflowId) => {
  const response = await axios.get(`/workflow/${workflowId}/workflow/${projectId}`);
  return response;
};