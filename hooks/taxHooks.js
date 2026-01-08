

/**
 * Refactor Summary:
 * - Added JSDoc documentation for all tax-related hooks
 * - Deprecated/Commented out broken 'addTaxes' function (unused references)
 * - Standardized error handling and toast usage
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Adds a new tax rate to a firm.
 * @param {Object} form - Tax data.
 */
export const addFirmTax = async (form) => {
  const url = `/taxRates/addTaxInFirm`;
  const response = await axios.post(url, form);
  return response;
};

/**
 * Adds a new global tax rate.
 * @param {Object} form - Tax data.
 */
export const addGlobalTax = async (form) => {
  const url = `/taxRates/postGlobalTax`;
  const response = await axios.post(url, form);
  return response;
};

/**
 * Fetches all taxes for the organization.
 */
export const getAllOrgTaxes = async () => {
  const url = `/taxRates/getAllTaxes`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches all taxes for a specific firm.
 * @param {string} firmId - Firm ID.
 */
export const getAllTaxesByFirm = async (firmId) => {
  const url = `/taxRates/gettaxRates/${firmId}`;
  const response = await axios.get(url);
  return response;
};

/**
 * Fetches clients associated with a specific tax.
 * @param {string} invoiceTaxId - Invoice Tax ID.
 */
export const getClientTax = async (invoiceTaxId) => {
  const url = `/taxRates/clientByTax`;
  const response = await axios.post(url, invoiceTaxId);
  return response;
};

/**
 * Fetches invoices associated with a specific tax.
 * @param {string} invoiceTaxId - Invoice Tax ID.
 */
export const getInvoiceByTax = async (invoiceTaxId) => {
  const url = `/taxRates/invoiceByTax`;
  const response = await axios.post(url, invoiceTaxId);
  return response;
};

/**
 * Fetches all global taxes.
 */
export const getGlobalTaxes = async () => {
  const url = `/taxRates/getGlobalTaxs`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (err) {
    console.error("Error in getGlobalTaxes:", err);
    throw err;
  }
};

/**
 * Updates a tax rate.
 * @param {Object} payload - Update payload containing rate and taxId.
 */
export const updateTax = async (payload) => {
  try {
    const form = { newRate: payload.rate };
    const id = payload.taxId;
    const url = `/taxRates/updateRates/${id}`;
    const response = await axios.patch(url, form);
    return response;
  } catch (error) {
    console.error("Error in updateTax:", error);
    throw error;
  }
};

/**
 * Disables a tax rate.
 * @param {string} taxId - Tax ID.
 */
export const disableTax = async (taxId) => {
  const url = `/taxRates/disableTax/${taxId}`;
  try {
    const response = await axios.patch(url);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Enables a tax rate.
 * @param {string} taxId - Tax ID.
 */
export const enableTax = async (taxId) => {
  const url = `/taxRates/enableTax/${taxId}`;
  return await axios.patch(url);
};

// --- Legacy / Unused Code ---

/*
// Broken: uses undefined API and missing toast components
export const addTaxes = async (data) => {
  const url = `${API}/`;
  try {
    const response = await axios.post(url, data);
    response.status === 200
      ? SuccessToast("Tax Added")
      : ErrorToast("Unable to add tax");
  } catch (err) {
    ErrorToast("Something went wrong");
  }
};
*/
