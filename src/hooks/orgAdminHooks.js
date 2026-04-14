import { axiosInstance as axios } from "@/lib/axios";

/**
 * OrgAdmin Hooks — covers all endpoints under the backend `orgAdmin` route:
 *   - Org settings (get/update)
 *   - Automation rules (list/create/update/delete/execute)
 *   - Integration webhooks (list/create/update/delete)
 *   - Integration API keys (list/create/revoke)
 *   - Data management jobs (list/create)
 *   - Data management backups (list/create)
 *
 * Backend mounts these at /api/organization/... so all paths below start with /organization.
 */

/* ------------------------------------------------------------------ */
/*                          ORG ADMIN SETTINGS                         */
/* ------------------------------------------------------------------ */

export const getOrgAdminSettings = async () => {
  const response = await axios.get("/organization/settings");
  return response;
};

export const updateOrgAdminSettings = async (form) => {
  const response = await axios.patch("/organization/settings", form);
  return response;
};

/* ------------------------------------------------------------------ */
/*                          AUTOMATION RULES                           */
/* ------------------------------------------------------------------ */

export const listAutomationRules = async () => {
  const response = await axios.get("/organization/automation-rules");
  return response;
};

export const createAutomationRule = async (form) => {
  const response = await axios.post("/organization/automation-rules", form);
  return response;
};

export const updateAutomationRule = async (ruleId, form) => {
  const response = await axios.patch(`/organization/automation-rules/${ruleId}`, form);
  return response;
};

export const deleteAutomationRule = async (ruleId) => {
  const response = await axios.delete(`/organization/automation-rules/${ruleId}`);
  return response;
};

export const executeAutomationRule = async (ruleId) => {
  const response = await axios.post(`/organization/automation-rules/${ruleId}/execute`);
  return response;
};

/* ------------------------------------------------------------------ */
/*                              WEBHOOKS                               */
/* ------------------------------------------------------------------ */

export const listWebhooks = async () => {
  const response = await axios.get("/organization/integrations/webhooks");
  return response;
};

export const createWebhook = async (form) => {
  const response = await axios.post("/organization/integrations/webhooks", form);
  return response;
};

export const updateWebhook = async (webhookId, form) => {
  const response = await axios.patch(`/organization/integrations/webhooks/${webhookId}`, form);
  return response;
};

export const deleteWebhook = async (webhookId) => {
  const response = await axios.delete(`/organization/integrations/webhooks/${webhookId}`);
  return response;
};

/* ------------------------------------------------------------------ */
/*                              API KEYS                               */
/* ------------------------------------------------------------------ */

export const listApiKeys = async () => {
  const response = await axios.get("/organization/integrations/api-keys");
  return response;
};

export const createApiKey = async (form) => {
  const response = await axios.post("/organization/integrations/api-keys", form);
  return response;
};

export const revokeApiKey = async (keyId) => {
  const response = await axios.post(`/organization/integrations/api-keys/${keyId}/revoke`);
  return response;
};

/* ------------------------------------------------------------------ */
/*                       DATA MANAGEMENT — JOBS                         */
/* ------------------------------------------------------------------ */

export const listDataJobs = async () => {
  const response = await axios.get("/organization/data-management/jobs");
  return response;
};

export const createDataJob = async (form) => {
  const response = await axios.post("/organization/data-management/jobs", form);
  return response;
};

/* ------------------------------------------------------------------ */
/*                     DATA MANAGEMENT — BACKUPS                        */
/* ------------------------------------------------------------------ */

export const listBackups = async () => {
  const response = await axios.get("/organization/data-management/backups");
  return response;
};

export const createBackup = async (form) => {
  const response = await axios.post("/organization/data-management/backups", form);
  return response;
};
