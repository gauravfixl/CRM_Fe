/**
 * Refactor Summary:
 * - Improved documentation for billing plan API hooks
 * - Cleaned up debug console logs
 * - Preserved existing exports and functionality
 */

import { axiosInstance as axios } from "@/lib/axios";

/**
 * Fetches all available billing plans.
 */
export const getAllBillingPlans = async () => {
  const url = `/billingplan/getAllBillingPlans`;
  const response = await axios.get(url);
  return response;
};

/**
 * Creates a new billing plan.
 * @param {Object} formData - Data for the new billing plan.
 */
export const addBillingPlan = async (formData) => {
  const url = `/billingplan/createBillingPlan`;
  const response = await axios.post(url, formData);
  return response;
};

/**
 * Updates an existing billing plan by ID.
 * @param {string} id - The ID of the billing plan to update.
 * @param {Object} formData - The updated billing plan data.
 */
export const updateBillingPlan = async (id, formData) => {
  const url = `/billingplan/updateBillingPlan/${id}`;
  const response = await axios.patch(url, formData);
  return response;
};

/* ------------------------ ORG BILLING (added) ------------------------ */

/**
 * Fetches the current plan for the active organization.
 */
export const getCurrentPlan = async () => {
  const response = await axios.get("/OrgBilling/current-plan");
  return response;
};

/**
 * Fetches billing history for the active organization.
 */
export const getBillingHistory = async () => {
  const response = await axios.get("/OrgBilling/history");
  return response;
};

/**
 * Fetches all platform billing plans (for upgrade/compare views).
 */
export const getAllPlans = async () => {
  const response = await axios.get("/billingplan/all");
  return response;
};

/**
 * Fetches a single billing plan by ID.
 * @param {string} planId - Billing plan ID.
 */
export const getPlanById = async (planId) => {
  const response = await axios.get(`/billingplan/${planId}`);
  return response;
};