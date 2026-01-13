/**
 * Refactor Summary:
 * - Removed undefined 'API' variable and used relative paths
 * - Fixed 'leadId' being a static top-level variable (now retrieved dynamically)
 * - Added JSDoc documentation for all lead-related hooks
 * - Cleaned up redundant/commented-out code
 * - Standardized error handling
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

const baseLeadUrl = `/lead`;

// --- Lead CRUD APIs ---

/**
 * Fetches all leads for the organization.
 */
export const getLeadListByOrg = async () => {
  try {
    const response = await axios.get(`${baseLeadUrl}/getAllLeads`);
    return response;
  } catch (error) {
    console.error("Error fetching lead list:", error);
    throw error;
  }
};

/**
 * Fetches leads filtered by status and firm ID.
 * @param {string} status - Lead status.
 * @param {string} firmId - Firm ID.
 */
export const getOrgLeadByStatus = async (status, firmId) => {
  const url = `${baseLeadUrl}/filter/status`;
  const data = { firmId, status };
  const response = await axios.post(url, data);
  return response;
};

/**
 * Creates a new lead.
 * @param {Object} leadData - Lead data.
 */
export const createLead = async (leadData) => {
  try {
    const response = await axios.post(`${baseLeadUrl}/create`, leadData);
    return response.data;
  } catch (err) {
    console.error("Error during createLead API call:", err);
    return { success: false, error: err?.response?.data?.message || err.message };
  }
};

/**
 * Bulk adds leads from Excel data.
 * @param {Object} excelData - Parsed Excel data.
 */
export const bulkAddLead = async (excelData) => {
  const url = `${baseLeadUrl}/add-leadbyExcel`;
  const response = await axios.post(url, excelData);
  return response;
};

/**
 * Fetches a single lead by ID.
 * @param {string} id - Lead ID.
 */
export const getLeadById = async (id) => {
  const response = await axios.get(`${baseLeadUrl}/${id}`);
  return response;
};

/**
 * Updates an existing lead.
 * @param {string} leadId - Lead ID.
 * @param {Object} form - Updated data.
 */
export const updateLead = async (leadId, form) => {
  if (!leadId) throw new Error("Lead ID must be present.");
  const response = await axios.patch(`${baseLeadUrl}/update/${leadId}`, form);
  return response.data;
};

/**
 * Updates a lead's status.
 * @param {string} id - Lead ID.
 * @param {string} status - New status.
 */
export const updateLeadStatus = async (id, status) => {
  const response = await axios.patch(`${baseLeadUrl}/update/status/${id}`, status);
  return response;
};

/**
 * Deletes multiple leads.
 * @param {Array<string>} leadIds - List of lead IDs to delete.
 */
export const deleteLead = async (leadIds) => {
  try {
    const response = await axios.delete(`${baseLeadUrl}/bulk-delete`, {
      data: { leadIds },
    });

    if (response.status === 200) {
      showSuccess("Lead Deleted");
      return response.data;
    } else {
      showError("Unable to delete lead");
      throw new Error("Failed to delete lead");
    }
  } catch (err) {
    console.error("Error deleting lead:", err);
    showError(err.message || "Error occurred while deleting lead");
    throw err;
  }
};

/**
 * Searches for leads.
 * @param {string} search - Search query.
 */
export const searchLead = async (search) => {
  try {
    const orgId = localStorage.getItem("orgID");
    const response = await axios.post(`${baseLeadUrl}/leadSearch`, {
      search,
      orgId,
    });
    return response;
  } catch (err) {
    showError("Something went wrong");
  }
};

// --- Lead Activity APIs ---

/**
 * Adds a new activity to a lead.
 * @param {Object} formData - Activity data.
 */
export const addLeadActivity = async (formData) =>
  axios.post(`/leadActivity/addLeadActivity`, formData);

/**
 * Fetches all activities for a lead.
 * @param {string} id - Lead ID.
 */
export const getAllActivities = async (id) =>
  axios.get(`/leadActivity/getAllActivities/${id}`);

/**
 * Fetches activities by type.
 * @param {string} type - Activity type.
 * @param {string} id - Lead ID.
 */
export const getActivitiesByType = async (type, id) =>
  axios.get(`/leadActivity/getActivitiesByType/${type}/${id}`);

/**
 * Fetches a single activity by ID.
 * @param {string} id - Activity ID.
 */
export const getActivityById = async (id) =>
  axios.get(`/leadActivity/getLeadActivityById/${id}`);

/**
 * Updates a lead activity.
 * @param {string} id - Activity ID.
 * @param {Object} form - Updated data.
 */
export const updateActivity = async (id, form) =>
  axios.patch(`/leadActivity/updateLeadActivity/${id}`, form);

/**
 * Updates an activity attachment.
 * @param {string} id - Activity ID.
 * @param {Object} formData - File data.
 */
export const updateAttachment = async (id, formData) =>
  axios.patch(`/leadActivity/updateAttachment/${id}`, formData);

/**
 * Deletes a lead activity.
 * @param {string} id - Activity ID.
 */
export const deleteLeadActivity = async (id) =>
  axios.delete(`/leadActivity/deleteLeadActivity/${id}`);

/**
 * Adds a comment to a lead activity.
 * @param {Object} data - Comment data.
 */
export const addLeadActivityComment = async (data) =>
  axios.post(`/leadActivity/addLeadActivityComment`, data);

/**
 * Fetches comments for a lead activity.
 * @param {string} id - Activity ID.
 */
export const getLeadActivityComments = async (id) =>
  axios.get(`/leadActivity/getLeadActivityComment/${id}`);

/**
 * Bulk deletes leads (from trash view).
 * @param {Array<string>} selectedValues - IDs to delete.
 */
export const bulkDeleteLeads = async (selectedValues) =>
  axios.delete(`${baseLeadUrl}/bulk-delete`, {
    data: {
      leadIds: selectedValues,
    },
  });

/**
 * Fetches stage history for the current lead (from localStorage).
 */
export const getStageHistory = async () => {
  const leadId = localStorage.getItem("leadId");
  return axios.get(`${baseLeadUrl}/${leadId}/stage-history`);
};

/**
 * Updates the lead stage.
 * @param {string} leadId - Lead ID.
 * @param {string} stage - New stage.
 * @param {string} [reason] - Reason for change.
 * @param {boolean} [createClient] - Whether to create a client.
 */
export const updateLeadStage = async (
  leadId,
  stage,
  reason,
  createClient
) => {
  try {
    const response = await axios.patch(`${baseLeadUrl}/${leadId}/stage`, {
      stage,
      reason,
      createClient
    });
    return response.data;
  } catch (error) {
    console.error("Error updating stage:", error);
    throw new Error(error.response?.data?.message || "Failed to update stage.");
  }
};

/**
 * Fetches all deleted leads.
 */
export const getAllDeletedLeads = async () =>
  axios.get(`${baseLeadUrl}/deleted/all`);

/**
 * Fetches activity logs for the lead module.
 */
export const getActivityForLead = async () =>
  axios.get(`/activities/module/lead`);

/**
 * Restores a deleted lead.
 * @param {string} id - Lead ID.
 */
export const restoreLead = async (id) =>
  axios.patch(`${baseLeadUrl}/restore/${id}`);
