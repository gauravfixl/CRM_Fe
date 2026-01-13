/**
 * Project Management Hooks
 * Handles all API calls for project CRUD operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface Project {
    _id: string;
    name: string;
    description?: string;
    workspace: string;
    organization: string;
    createdBy: {
        _id: string;
        email: string;
        fullName: string;
    };
    boardId?: string;
    visibility: "public" | "private";
    type: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectAnalytics {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    tasksPerMember: Array<{
        member: string;
        email: string;
        taskCount: number;
    }>;
    tasksPerState: Array<{
        state: string;
        count: number;
    }>;
}

export interface AssignableMember {
    mId: string;
    email: string;
}

/**
 * Create a new project
 */
export const createProject = async (workspaceId: string, data: {
    name: string;
    templateId?: string;
    description?: string;
    visibility?: "public" | "private";
}) => {
    try {
        const response = await axios.post(`/project/create/${workspaceId}`, data);
        showSuccess("Project created successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating project:", err);
            showError(err?.response?.data?.message || "Failed to create project");
        }
        throw err;
    }
};

/**
 * Update project details
 */
export const updateProject = async (projectId: string, data: any) => {
    try {
        const response = await axios.patch(`/project/update/${projectId}`, data);
        showSuccess("Project updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating project:", err);
            showError(err?.response?.data?.message || "Failed to update project");
        }
        throw err;
    }
};

/**
 * Delete project
 */
export const deleteProject = async (projectId: string, workspaceId: string) => {
    try {
        const response = await axios.delete(`/project/delete/${projectId}`, {
            data: { workspaceId }
        });
        showSuccess("Project deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting project:", err);
            showError(err?.response?.data?.message || "Failed to delete project");
        }
        throw err;
    }
};

/**
 * Archive/Unarchive project
 */
export const archiveProject = async (projectId: string) => {
    try {
        const response = await axios.patch(`/project/archive/${projectId}`);
        showSuccess("Project archived successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error archiving project:", err);
            showError(err?.response?.data?.message || "Failed to archive project");
        }
        throw err;
    }
};

/**
 * Get all projects by workspace
 */
export const getAllProjectsByWorkspace = async (
    workspaceId: string,
    params?: {
        page?: number;
        limit?: number;
        visibility?: string;
        isArchived?: boolean;
        type?: string;
        createdAt?: string;
    }
) => {
    try {
        const response = await axios.get(`/project/workspace/${workspaceId}/projects`, { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching projects:", err);
            showError("Failed to fetch projects");
        }
        throw err;
    }
};

/**
 * Get my projects in workspace
 */
export const getMyProjectsByWorkspace = async (workspaceId: string) => {
    try {
        const response = await axios.get(`/project/workspace/${workspaceId}/my-projects`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching my projects:", err);
            showError("Failed to fetch your projects");
        }
        throw err;
    }
};

/**
 * Get project by ID
 */
export const getProjectById = async (projectId: string, workspaceId: string) => {
    try {
        const response = await axios.get(`/project/${projectId}/details`, {
            params: { workspaceId }
        });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching project:", err);
            showError("Failed to fetch project details");
        }
        throw err;
    }
};

/**
 * Get assignable members for project
 */
export const getAssignableMembers = async (projectId: string, workspaceId: string) => {
    try {
        const response = await axios.get(`/project/${projectId}/assignable-members`, {
            data: { workspaceId }
        });
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
 * Get project analytics
 */
export const getProjectAnalytics = async (projectId: string) => {
    try {
        const response = await axios.get(`/project/${projectId}/Analytics`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching project analytics:", err);
            showError("Failed to fetch analytics");
        }
        throw err;
    }
};
