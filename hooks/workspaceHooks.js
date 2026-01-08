/**
 * Refactor Summary:
 * - Added JSDoc documentation for all workspace-related hooks
 * - Removed detailed console.errors (throwing error is sufficient)
 * - Fixed duplicate comments
 * - Standardized formatting
 */

import { useState } from "react";
import { axiosInstance as axios } from "@/lib/axios";

/**
 * Creates a new workspace.
 * @param {Object} payload - Workspace data.
 */
export const createWorkspace = async (payload) => {
  try {
    const res = await axios.post("/workspace/create", payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches all workspaces owned/accessible by the user.
 */
export const getMyWorkspaces = async () => {
  try {
    const res = await axios.get("/workspace/my-workspace/all");
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches all workspaces (Admin only).
 */
export const getAllWorkspaces = async () => {
  try {
    const res = await axios.get("/workspace/admin");
    return res.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches a single workspace by ID.
 * @param {string} workspaceId - Workspace ID.
 */
export const getWorkspaceById = async (workspaceId) => {
  try {
    const res = await axios.get(`/workspace/${workspaceId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Updates a workspace.
 * @param {string} workspaceId - Workspace ID.
 * @param {Object} updates - Update data.
 */
export const updateWorkspace = async (workspaceId, updates) => {
  try {
    const res = await axios.patch(`/workspace/update/${workspaceId}`, updates);
    return res.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Deletes a workspace.
 * @param {string} workspaceId - Workspace ID.
 */
export const deleteWorkspace = async (workspaceId) => {
  try {
    const res = await axios.delete(`/workspace/${workspaceId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches workspace analytics.
 * @param {string} workspaceId - Workspace ID.
 */
export const getWorkspaceAnalytics = async (workspaceId) => {
  try {
    const res = await axios.get(`/workspace/${workspaceId}/analytics`);
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches workspace members.
 * @param {string} workspaceId - Workspace ID.
 */
export const getWorkspaceMembers = async (workspaceId) => {
  try {
    const res = await axios.get(`/workspace/member/${workspaceId}`);
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Adds a member to a workspace.
 * @param {string} workspaceId - Workspace ID.
 * @param {Object} payload - Member data.
 */
export const addWorkspaceMember = async (workspaceId, payload) => {
  try {
    const res = await axios.post(`/workspace/AddMember/${workspaceId}`, payload);
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Removes a member from a workspace.
 * @param {string} workspaceId - Workspace ID.
 * @param {Object} payload - Member data.
 */
export const deleteWorkspaceMember = async (workspaceId, payload) => {
  try {
    const res = await axios.patch(`/workspace/RemoveMember/${workspaceId}`, payload);
    return res;
  } catch (err) {
    throw err;
  }
};

/**
 * Hook to manage loading state (Utility).
 */
export const useWorkspaceLoading = () => {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
};
