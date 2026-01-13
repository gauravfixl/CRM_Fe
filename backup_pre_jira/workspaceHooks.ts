/**
 * Workspace Management Hooks
 * Handles all API calls for workspace CRUD operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    organization: string;
    createdBy: {
        _id: string;
        email: string;
        fullName: string;
    };
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceMember {
    _id: string;
    userId: {
        _id: string;
        email: string;
        fullName: string;
        avatar?: string;
    };
    role: {
        _id: string;
        name: string;
        permissions: any[];
    };
    hasCustomPermission: boolean;
    permissionsOverride?: any[];
    invitedBy: string;
    status: string;
    isDeleted: boolean;
    joinedAt: string;
}

export interface WorkspaceAnalytics {
    totalProjects: number;
    totalMembers: number;
    activeTasks: number;
    completedTasks: number;
    totalTeams: number;
    workloadPerMember: Array<{
        member: string;
        email: string;
        taskCount: number;
    }>;
    teamsPerProject: Array<{
        projectId: string;
        projectName: string;
        teamCount: number;
    }>;
    projectWiseTaskDistribution: Array<{
        projectId: string;
        projectName: string;
        taskCount: number;
    }>;
}

/**
 * Create a new workspace
 */
export const createWorkspace = async (data: { name: string; description?: string }, orgId?: string) => {
    try {
        const finalOrgID = orgId || localStorage.getItem("orgID");
        console.log("Creating workspace with OrgID:", finalOrgID);
        const response = await axios.post("/workspace/create", {
            ...data,
            organization: finalOrgID,
            orgId: finalOrgID
        });
        showSuccess("Workspace created successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Workspace Create Error Data:", err.response?.data || err);
            showError(err?.response?.data?.message || "Failed to create workspace. Please ensure you have selected an organization.");
        }
        throw err;
    }
};

/**
 * Update workspace details
 */
export const updateWorkspace = async (id: string, data: { name: string; description?: string }) => {
    try {
        const response = await axios.patch(`/workspace/update/${id}`, data);
        showSuccess("Workspace updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating workspace:", err);
            showError(err?.response?.data?.message || "Failed to update workspace");
        }
        throw err;
    }
};

/**
 * Delete workspace (soft delete)
 */
export const deleteWorkspace = async (id: string) => {
    try {
        const response = await axios.patch(`/workspace/delete/${id}`);
        showSuccess("Workspace deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting workspace:", err);
            showError(err?.response?.data?.message || "Failed to delete workspace");
        }
        throw err;
    }
};

/**
 * Get all workspaces (admin view)
 */
export const getAllWorkspaces = async () => {
    try {
        const response = await axios.get("/workspace/admin/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching admin workspaces:", err);
            // Don't show public toast error here as this might be expected to fail for non-admins
        }
        throw err;
    }
};

/**
 * Get workspaces where current user is a member
 */
export const getMyWorkspaces = async () => {
    try {
        const response = await axios.get("/workspace/my-workspace/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching my workspaces:", err);
            showError("Failed to fetch your workspaces");
        }
        throw err;
    }
};

/**
 * Get workspace by ID
 */
export const getWorkspaceById = async (workspaceId: string) => {
    try {
        const response = await axios.get(`/workspace/${workspaceId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching workspace:", err);
            showError("Failed to fetch workspace details");
        }
        throw err;
    }
};

/**
 * Get workspace analytics
 */
export const getWorkspaceAnalytics = async (workspaceId: string) => {
    try {
        const response = await axios.get(`/workspace/${workspaceId}/Analytics`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching workspace analytics:", err);
            showError("Failed to fetch analytics");
        }
        throw err;
    }
};

/**
 * Get workspace members
 */
export const getWorkspaceMembers = async (
    workspaceId: string,
    params?: {
        page?: number;
        limit?: number;
        customPermission?: boolean;
        isDeleted?: boolean;
        email?: string;
    }
) => {
    try {
        const response = await axios.get(`/workspace/member/${workspaceId}`, { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching workspace members:", err);
            showError("Failed to fetch members");
        }
        throw err;
    }
};

/**
 * Add member to workspace
 */
export const addWorkspaceMember = async (workspaceId: string, data: { email: string; role: string }) => {
    try {
        const response = await axios.post(`/workspace/AddMember/${workspaceId}`, data);
        showSuccess("Member added successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error adding member:", err);
            showError(err?.response?.data?.message || "Failed to add member");
        }
        throw err;
    }
};

/**
 * Remove member from workspace
 */
export const removeWorkspaceMember = async (workspaceId: string, data: { email: string; reason?: string }) => {
    try {
        const response = await axios.patch(`/workspace/RemoveMember/${workspaceId}`, data);
        showSuccess("Member removed successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error removing member:", err);
            showError(err?.response?.data?.message || "Failed to remove member");
        }
        throw err;
    }
};
