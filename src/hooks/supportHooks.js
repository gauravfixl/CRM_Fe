/**
 * Refactor Summary:
 * - Fixed typo in 'enableSupportAccess' (was 'enableSupportAcess')
 * - Added leading slashes to URLs for consistency
 * - Added JSDoc documentation
 * - Removed incorrect file header comments
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Logs in a support agent.
 * @param {Object} credentials - Email and password.
 */
export const supportAgentLogin = async ({ email, password }) => {
  try {
    const response = await axios.post(`/support/login`, { email, password });
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Logs in a support organization with a token.
 * @param {Object} credentials - Email and token.
 */
export const supportOrgLogin = async ({ email, token }) => {
  try {
    const response = await axios.post(`/support/support-org-login`, { email, token });
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches support firms.
 */
export const getSupportFirms = async () => {
  const url = `/support/firms`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches support organizations.
 */
export const getSupportOrg = async () => {
  const url = `/support/org`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches support leads.
 */
export const getSupportLeads = async () => {
  const url = `/support/leads`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches support clients.
 */
export const getSupportClients = async () => {
  const url = `/support/clients`;
  const response = await axios.get(url);
  return response;
};

/**
 * Enables support access.
 */
export const enableSupportAccess = async () => {
  const url = `/auth/enable-support-access`;
  const response = await axios.post(url);
  return response;
};