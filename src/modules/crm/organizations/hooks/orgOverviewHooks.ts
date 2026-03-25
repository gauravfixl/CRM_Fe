/**
 * Organization Overview Hooks
 * Handles all API calls for Overview section pages
 */

import axios from "@/lib/axios";

// ============ OVERVIEW PAGE HOOKS ============

/**
 * Fetch organization overview dashboard data
 * Includes: total users, active firms, system uptime, monthly spend
 */
export const getOrgOverviewData = async () => {
    try {
        const response = await axios.get("/org/overview");
        return response;
    } catch (error) {
        console.error("Error fetching org overview:", error);
        throw error;
    }
};

/**
 * Fetch organization health and system status
 * Includes: uptime, API traffic, data usage, security score
 */
export const getOrgHealthData = async () => {
    try {
        const response = await axios.get("/org/health");
        return response;
    } catch (error) {
        console.error("Error fetching org health:", error);
        throw error;
    }
};

/**
 * Fetch organization activity/audit logs
 * Includes: admin actions, security events, system changes
 */
export const getOrgActivityLogs = async (
    page: number = 1,
    limit: number = 10,
    severity?: string,
    searchQuery?: string
) => {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (severity) params.append("severity", severity);
        if (searchQuery) params.append("search", searchQuery);

        const response = await axios.get(`/activity/module/organization?${params}`);
        return response;
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
    }
};

/**
 * Fetch organization onboarding status
 * Includes: completion phases, steps, progress
 */
export const getOrgOnboardingStatus = async () => {
    try {
        const response = await axios.get("/org/onboarding-status");
        return response;
    } catch (error) {
        console.error("Error fetching onboarding status:", error);
        throw error;
    }
};

/**
 * Update onboarding step status
 */
export const updateOnboardingStep = async (
    phaseId: string,
    stepId: number,
    completed: boolean
) => {
    try {
        const response = await axios.patch("/org/onboarding-step", {
            phaseId,
            stepId,
            completed,
        });
        return response;
    } catch (error) {
        console.error("Error updating onboarding step:", error);
        throw error;
    }
};

/**
 * Run compliance scan for organization
 */
export const runComplianceScan = async () => {
    try {
        const response = await axios.post("/org/compliance-scan");
        return response;
    } catch (error) {
        console.error("Error running compliance scan:", error);
        throw error;
    }
};

/**
 * Get organization system notifications
 */
export const getOrgNotifications = async (limit: number = 5) => {
    try {
        const response = await axios.get(`/org/notifications?limit=${limit}`);
        return response;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

/**
 * Get organization resource distribution by firms
 */
export const getResourceDistribution = async () => {
    try {
        const response = await axios.get("/org/resource-distribution");
        return response;
    } catch (error) {
        console.error("Error fetching resource distribution:", error);
        throw error;
    }
};

/**
 * Get organization service status
 */
export const getServiceStatus = async () => {
    try {
        const response = await axios.get("/org/service-status");
        return response;
    } catch (error) {
        console.error("Error fetching service status:", error);
        throw error;
    }
};

/**
 * Refresh organization health metrics
 */
export const refreshHealthMetrics = async () => {
    try {
        const response = await axios.post("/org/refresh-health");
        return response;
    } catch (error) {
        console.error("Error refreshing health metrics:", error);
        throw error;
    }
};

/**
 * Export activity logs as CSV
 */
export const exportActivityLogs = async (format: "csv" | "json" = "csv") => {
    try {
        const response = await axios.get(`/activity/export?format=${format}`, {
            responseType: format === "csv" ? "blob" : "json",
        });
        return response;
    } catch (error) {
        console.error("Error exporting activity logs:", error);
        throw error;
    }
};

/**
 * Send invitations to multiple users
 */
export const sendBulkInvitations = async (emails: string[], role: string) => {
    try {
        const response = await axios.post("/org/bulk-invite", {
            emails,
            role,
        });
        return response;
    } catch (error) {
        console.error("Error sending bulk invitations:", error);
        throw error;
    }
};
