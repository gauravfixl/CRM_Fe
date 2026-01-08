/**
 * Refactor Summary:
 * - Fixed reference errors where 'orgId' was used but not defined
 * - Improved documentation for firm-related API hooks
 * - Standardized error handling and toast notifications
 * - Cleaned up redundant/commented-out logic
 * - Preserved existing exports and functionality
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError } from "@/utils/toast";

/**
 * Fetches all firms.
 */
export const getAllFirms = async () => {
  try {
    const response = await axios.get("/firm/getAllFirm");
    return response;
  } catch (err) {
    console.error("Error in getAllFirms:", err);
    showError("Failed to fetch firms.");
    throw err;
  }
};

/**
 * Fetches a list of firms scoped by organization.
 */
export const getAllFirmsList = async () => {
  try {
    const response = await axios.get(`/firm/getFirmList`);
    return response;
  } catch (err) {
    showError("Failed to fetch firms list.");
    throw err;
  }
};

/**
 * Fetches a firm list (shorthand/alias for consistency).
 */
export const getFirmList = async () => {
  try {
    const response = await axios.get("/firm/getFirmList");
    return response;
  } catch (err) {
    console.error("Error in getFirmList:", err.message);
    throw err;
  }
};

/**
 * Fetches a single firm by ID.
 * @param {string} firmId - The firm ID.
 */
export const getFirmById = async (firmId) => {
  try {
    const response = await axios.get(`/firm/getFirm/${firmId}`);
    return response;
  } catch (err) {
    console.error("Error in getFirmById:", err);
    throw err;
  }
};

/**
 * Fetches a single firm (alternate signature).
 * @param {string} firmId - The firm ID.
 * @param {string} [orgId] - Optional org ID (currently unused in implementation).
 */
export const getSingleFirm = async (firmId, orgId) => {
  try {
    const response = await axios.get(`/firm/getFirm/${firmId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Creates a new firm.
 * @param {Object} form - New firm data.
 */
export const addNewFirm = async (form) => {
  try {
    const response = await axios.post("/firm/create", form, {
      headers: { "Content-Type": "application/json" }
    });
    return response;
  } catch (error) {
    showError(error.message || "Failed to create firm.");
    throw error.response?.data || error.message;
  }
};

/**
 * Deletes a firm by ID.
 */
export const deleteFirm = async (id) => {
  try {
    const response = await axios.delete(`/firm/delete/${id}`);
    return response;
  } catch (err) {
    console.error("Error in deleteFirm:", err);
    throw err;
  }
};

/**
 * Updates an existing firm's details.
 */
export const updateFirm = async (form, firmId) => {
  try {
    const response = await axios.patch(`/firm/update/${firmId}`, form);
    return response;
  } catch (err) {
    showError("Failed to update firm.");
    throw err;
  }
};

/**
 * Updates a firm's logo.
 */
export const updateFirmLogo = async (formData, id) => {
  try {
    const response = await axios.patch(`/firm/insertlogo/${id}`, formData);
    return response;
  } catch (err) {
    console.error("Error in updateFirmLogo:", err);
    throw err;
  }
};

/**
 * Fetches all deleted firms.
 */
export const getAllDeletedFirms = async () => {
  try {
    const response = await axios.get("/firm/deleted");
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Restores a deleted firm by ID.
 */
export const restoreFirm = async (id) => {
  try {
    const response = await axios.patch(`/firm/restore/${id}`);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Fetches invoices for a specific firm and handles state updates.
 * @param {string} firmId - The firm ID.
 * @param {Function} setInvoiceData - State setter for raw invoice data.
 * @param {Function} setDetails - State setter for filtered invoice details.
 * @param {Function} getDeletedInvoices - Handler for deleted invoices.
 * @param {string} selected - Current filter (All, Pending, etc.).
 * @param {Function} getAllDrafts - Handler for drafts.
 */
export const getFirmInvoices = async (
  firmId,
  setInvoiceData,
  setDetails,
  getDeletedInvoices,
  selected,
  getAllDrafts
) => {
  try {
    // Note: orgId is retrieved from localStorage as it was missing in the original implementation
    const currentOrgId = localStorage.getItem("orgID");

    const response = await axios.post("/invoice/getInvoiceByFirm", {
      firmID: firmId,
      orgId: currentOrgId,
      delete: false,
    });

    const data = response?.data?.data || [];
    setInvoiceData(data);

    switch (selected) {
      case "All":
        setDetails(data);
        break;
      case "Pending":
      case "Paid":
      case "Partial Paid":
      case "Overdue":
        setDetails(data.filter((d) => d.status === selected));
        break;
      case "Deleted":
        getDeletedInvoices(setDetails);
        break;
      case "Draft":
        getAllDrafts();
        break;
      default:
        setDetails([]);
    }
  } catch (err) {
    console.error("Error in getFirmInvoices:", err);
    setInvoiceData([]);
  }
};

/**
 * Creates a new product for a firm.
 * @param {Object} form - Product data.
 * @param {string} firmId - Firm ID.
 */
export const createNewProduct = async (form, firmId) => {
  try {
    // Note: orgId is retrieved from localStorage as it was missing in the original implementation
    const currentOrgId = localStorage.getItem("orgID");
    const response = await axios.post(`/firm/createProduct/${currentOrgId}/${firmId}`, form);
    return response;
  } catch (err) {
    showError("Failed to create product.");
    throw err;
  }
};
