/**
 * Team Management Hooks
 * Handles all API calls for team CRUD operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface Team {
    _id: string;
    name: string;
    description?: string;
    workspace: string;
    project: string;
    createdBy: string;
    hasTeamBoard: boolean;
    boardId?: string;
    membersCount: number;
    isArchived: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TeamMember {
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
 * Create a new team
 */
export const createTeam = async (data: {
    name: string;
    description?: string;
    workspaceId: string;
    projectId: string;
    useTeamBoard?: boolean;
    templateId?: string;
}) => {
    try {
        const response = await axios.post("/team/", data);
        showSuccess("Team created successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating team:", err);
            showError(err?.response?.data?.message || "Failed to create team");
        }
        throw err;
    }
};

/**
 * Get teams by workspace
 */
export const getTeamsByWorkspace = async (params?: {
    workspaceId?: string;
    projectId?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await axios.get("/team/", { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching teams:", err);
            showError("Failed to fetch teams");
        }
        throw err;
    }
};

/**
 * Get team by ID
 */
export const getTeamById = async (teamId: string) => {
    try {
        const response = await axios.get(`/team/${teamId}/details`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching team:", err);
            showError("Failed to fetch team details");
        }
        throw err;
    }
};

/**
 * Get my teams by workspace
 */
export const getMyTeamsByWorkspace = async (workspaceId: string) => {
    try {
        const response = await axios.get(`/team/${workspaceId}/all`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching my teams:", err);
            showError("Failed to fetch your teams");
        }
        throw err;
    }
};

/**
 * Get assignable members for team
 */
export const getAssignableMembersForTeam = async (projectId: string, teamId: string) => {
    try {
        const response = await axios.get(`/team/${projectId}/${teamId}/assignable/members`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching assignable members:", err);
            showError("Failed to fetch assignable members");
        }
        throw err;
    }
};

/**
 * Add team member
 */
export const addTeamMember = async (teamId: string, data: {
    projectId: string;
    memberId: string;
    role: string;
}) => {
    try {
        const response = await axios.post(`/team/${teamId}/add-member`, data);
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
 * Get team members
 */
export const getTeamMembers = async (teamId: string, projectId: string) => {
    try {
        const response = await axios.get(`/team/${teamId}/members`, {
            params: { projectId }
        });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching team members:", err);
            showError("Failed to fetch team members");
        }
        throw err;
    }
};

/**
 * Remove team member
 */
export const removeTeamMember = async (teamId: string, memberId: string, projectId: string) => {
    try {
        const response = await axios.delete(`/team/${teamId}/member/${memberId}`, {
            params: { projectId }
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

/**
 * Change member role in team
 */
export const changeMemberRoleInTeam = async (teamId: string, data: {
    projectId: string;
    memberId: string;
    role: string;
    overridepermissions?: any[];
}) => {
    try {
        const response = await axios.patch(`/team/${teamId}/change-role`, data);
        showSuccess("Member role updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error changing member role:", err);
            showError(err?.response?.data?.message || "Failed to update member role");
        }
        throw err;
    }
};

/**
 * Toggle archive team
 */
export const toggleArchiveTeam = async (teamId: string, archive: boolean) => {
    try {
        const response = await axios.patch(`/team/${teamId}/archive`, { archive });
        showSuccess(archive ? "Team archived successfully!" : "Team unarchived successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error toggling archive:", err);
            showError(err?.response?.data?.message || "Failed to update team");
        }
        throw err;
    }
};

/**
 * Delete team
 */
export const deleteTeam = async (teamId: string, projectId: string) => {
    try {
        const response = await axios.delete(`/team/${teamId}/delete`, {
            params: { projectId }
        });
        showSuccess("Team deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting team:", err);
            showError(err?.response?.data?.message || "Failed to delete team");
        }
        throw err;
    }
};

// Alias for backward compatibility
export const getAllTeams = getTeamsByWorkspace;
export const getAllTeamMembers = getTeamMembers;
