/**
 * Project Member Management Hooks
 * Handles all API calls for project member operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface ProjectMember {
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
    addedBy: string;
    joinedAt: string;
}

/**
 * Assign member to project
 */
export const assignMemberToProject = async (projectId: string, data: {
    workspaceId: string;
    memberId: string;
    role: string;
}) => {
    try {
        const response = await axios.post(`/project-member/${projectId}/assign`, data);
        showSuccess("Member assigned successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error assigning member:", err);
            showError(err?.response?.data?.message || "Failed to assign member");
        }
        throw err;
    }
};

/**
 * Get all project members
 */
export const getAllProjectMembers = async (projectId: string, params?: {
    workspaceId?: string;
    page?: number;
    limit?: number;
    customPermission?: boolean;
    email?: string;
}) => {
    try {
        const response = await axios.get(`/project-member/${projectId}/members`, { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching project members:", err);
            showError("Failed to fetch project members");
        }
        throw err;
    }
};

/**
 * Update project member
 */
export const updateProjectMember = async (projectId: string, memberId: string, data: {
    workspaceId: string;
    role?: string;
    overridepermissions?: any[];
}) => {
    try {
        const response = await axios.patch(`/project-member/${projectId}/member/${memberId}`, data);
        showSuccess("Member updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating member:", err);
            showError(err?.response?.data?.message || "Failed to update member");
        }
        throw err;
    }
};

/**
 * Remove member from project
 */
export const removeProjectMember = async (projectId: string, memberId: string, workspaceId: string) => {
    try {
        const response = await axios.delete(`/project-member/${projectId}/member/${memberId}`, {
            params: { workspaceId }
        });
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
