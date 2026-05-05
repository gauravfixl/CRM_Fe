import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all clients for the organization.
 */
export const getAllClients = async () => {
  const response = await axios.get("/client/all");
  return response;
};

/**
 * Fetches clients by the current user.
 */
export const getClientsByUser = async () => {
  const response = await axios.get("/client/users");
  return response;
};

/**
 * Fetches a single client by ID.
 * @param {string} id - Client ID.
 */
export const getClientById = async (id) => {
  const response = await axios.get(`/client/singleUser/${id}`);
  return response;
};

/**
 * Creates a new client.
 * @param {Object} form - Client data.
 */
export const createClient = async (form) => {
  const response = await axios.post("/client/create", form);
  return response;
};

// Alias used by the multi-step onboarding wizard.
export const addClient = createClient;

/**
 * Updates a client by ID.
 * @param {string} id - Client ID.
 * @param {Object} form - Updated client data.
 */
export const updateClient = async (id, form) => {
  const response = await axios.patch(`/client/update/${id}`, form);
  return response;
};

/**
 * Soft deletes a client by ID.
 * @param {string} id - Client ID.
 */
export const deleteClient = async (id) => {
  const response = await axios.delete(`/client/delete/${id}`);
  return response;
};

/**
 * Restores a soft-deleted client.
 * @param {string} id - Client ID.
 */
export const restoreClient = async (id) => {
  const response = await axios.patch(`/client/restore/${id}`);
  return response;
};
