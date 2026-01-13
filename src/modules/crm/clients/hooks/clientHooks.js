/**
 * Refactor Summary:
 * - Moved active API hooks to the top for better visibility
 * - Fixed potential reference error for 'API' in getAllDeletedClients
 * - Added JSDoc documentation for all client-related hooks
 * - Cleaned up redundant debug logs and legacy comments
 * - Preserved existing exports and functionality
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all clients.
 */
export const getAllClients = async () => {
  const url = `/client/all`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches a single client by ID.
 * @param {string} id - Client ID.
 */
export const getClientById = async (id) => {
  const url = `/client/singleUser/${id}`;
  const response = await axios.get(url);
  return response;
};

/**
 * Deletes a client by ID.
 * @param {string} id - Client ID.
 */
export const deleteClient = async (id) => {
  const url = `/client/delete/${id}`;
  const response = await axios.delete(url);
  return response;
};

/**
 * Creates a new client.
 * @param {Object} formData - Client details.
 */
export const addClient = async (formData) => {
  const url = `/client/create`;
  const response = await axios.post(url, formData);
  return response;
};

/**
 * Updates an existing client by ID.
 * @param {string} id - Client ID.
 * @param {Object} formData - Updated client data.
 */
export const updateClient = async (id, formData) => {
  const url = `/client/update/${id}`;
  const response = await axios.patch(url, formData);
  return response;
};

/**
 * Fetches all deleted (archived) clients.
 */
export const getAllDeletedClients = async () => {
  // Fixed: Replaced ${API} with relative path to match other hooks
  const url = `/client/deleted/all`;
  const response = await axios.get(url);
  return response;
};

/**
 * Restores a deleted client by ID.
 * @param {string} id - Client ID.
 */
export const restoreClient = async (id) => {
  const url = `/client/restore/${id}`;
  const response = await axios.patch(url);
  return response;
};

/**
 * Fetches audit logs/activity related to clients.
 */
export const getClientsActivity = async () => {
  const url = `/activities/module/client`;
  const response = await axios.get(url);
  return response;
};

// --- Legacy / Commented Code Section ---
// Preserved for historical reference.

/*
// export const getAllClientsLegacy = async () => { ... }
// export const getClientByIdLegacy = async (id) => { ... }
// ...
*/
