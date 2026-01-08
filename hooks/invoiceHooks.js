/**
 * Refactor Summary:
 * - Fixed missed 'orgid' reference (now retrieved from localStorage)
 * - Removed undefined 'API' variable usages and standardized on relative paths
 * - Added JSDoc documentation for all invoice-related hooks
 * - Consistently used axiosInstance
 */

import { axiosInstance as axios } from "@/lib/axios";

// --- GET APIs ---

/**
 * Fetches all invoices.
 */
export const getAllInvoices = async () => {
  return await axios.get(`/invoice/all`);
};

/**
 * Fetches all draft invoices.
 */
export const getAllDrafts = async () => {
  return await axios.get(`/invoice/drafts`);
};

/**
 * Fetches a single invoice by ID (via POST as per original implementation).
 * @param {string} id - Invoice ID.
 */
export const getInvoiceById = async (id) => {
  return await axios.post(`/invoice/getSingleInvoice`, { id });
};

/**
 * Fetches a shared invoice by Org ID and Invoice ID.
 * @param {string} orgId - Organization ID.
 * @param {string} id - Invoice ID.
 */
export const getSharedInvoiceById = async (orgId, id) => {
  return await axios.get(`/invoice/singleInvoice/${orgId}/${id}`);
};

/**
 * Fetches all soft-deleted invoices.
 */
export const getDeletedInvoices = async () => {
  return await axios.get(`/invoice/getAllDeletedInvoices`);
};

/**
 * Fetches all cancelled invoices.
 */
export const getCancelledInvoices = async () => {
  return await axios.get(`/invoice/getAllCancelInvoices`);
};

/**
 * Fetches invoice reminders.
 * Note: Check suffix path if `/invoice` is correct for reminders, preserved from original.
 */
export const getAllReminders = async () => {
  return await axios.get(`/invoice`);
};

// --- POST APIs ---

/**
 * Creates a new invoice.
 * @param {Object} form - Invoice data.
 */
export const createInvoice = async (form) => {
  return await axios.post(`/invoice/create`, form);
};

/**
 * Fetches invoices by date.
 * @param {Object} form - Date filter criteria.
 */
export const getInvoiceByDate = async (form) => {
  return await axios.post(`/invoice`, form);
};

/**
 * Fetches invoices by client.
 * @param {Object} clientObj - Client identifier/filter.
 */
export const getInvoicesByClient = async (clientObj) => {
  return await axios.post(`/invoice/getInvoiceByClient`, clientObj);
};

/**
 * Fetches invoices by firm.
 * @param {string} firmId - Firm ID.
 */
export const getInvoicesByFirm = async (firmId) => {
  return await axios.post(`/invoice/getInvoiceByFirm`, {
    firmId,
  });
};

/**
 * Gets the last invoice number for a firm.
 * @param {string} firmId - Firm ID.
 */
export const getLastInvoiceNumber = async (firmId) => {
  const orgId = localStorage.getItem("orgID");
  return await axios.post(`/invoice/listInvoiceNo`, {
    orgId,
    firmId,
  });
};

// --- PATCH APIs ---

/**
 * Updates a draft invoice.
 * @param {string} editId - Draft ID to update.
 * @param {Object} form - Updated data.
 */
export const updateDraft = async (editId, form) => {
  return await axios.patch(`/invoice/updateDraft/${editId}`, form);
};

/**
 * Updates an active invoice.
 * @param {string} editId - Invoice ID to update.
 * @param {Object} form - Updated data.
 */
export const updateInvoice = async (editId, form) => {
  return await axios.patch(`/invoice/updateInvoice/${editId}`, form);
};

/**
 * Converts a draft to a live invoice.
 * @param {string} id - Draft ID.
 */
export const draftToInvoice = async (id) => {
  return await axios.patch(`/invoice/drafttoinvoice/${id}`, {
    draft: false,
    status: "Pending",
  });
};

/**
 * Records a payment for an invoice.
 * @param {Object} form - Payment details.
 * @param {string} id - Invoice ID.
 */
export const recordPayment = async (form, id) => {
  return await axios.patch(`/invoice/payment/${id}`, form);
};

/**
 * Soft deletes an invoice.
 * @param {string} id - Invoice ID.
 */
export const softDeleteInvoice = async (id) => {
  return await axios.patch(`/invoice/softDeleteInvoice/${id}`);
};

/**
 * Restores a soft-deleted invoice.
 * @param {string} id - Invoice ID.
 */
export const restoreDeletedInvoice = async (id) => {
  return await axios.patch(`/invoice/restoreInvoice/${id}`);
};

/**
 * Cancels an invoice.
 * @param {string} id - Invoice ID.
 */
export const cancelInvoice = async (id) => {
  return await axios.patch(`/invoice/cancelInvoice/${id}`, {
    cancel: true,
    status: "Cancelled",
  });
};

/**
 * Restores a cancelled invoice to Pending status.
 * @param {string} id - Invoice ID.
 */
export const restoreCancelledInvoice = async (id) => {
  return await axios.patch(`/invoice/restoreCancelInvoice/${id}`, {
    cancel: false,
    status: "Pending",
  });
};

// --- DELETE API ---

/**
 * Permanently deletes an invoice.
 * @param {string} id - Invoice ID.
 */
export const hardDeleteInvoice = async (id) => {
  return await axios.delete(`/invoice/deleteInvoice/${id}`);
};
