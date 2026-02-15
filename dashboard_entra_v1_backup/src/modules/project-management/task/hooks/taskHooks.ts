/**
 * Task Management Hooks
 * Handles all API calls for task CRUD operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface Task {
    _id: string;
    name: string;
    taskCode?: string;
    description?: string;
    type: "task" | "bug";
    status: string;
    priority: "low" | "medium" | "high" | "critical";
    assigneeId?: {
        _id: string;
        userId: {
            email: string;
            fullName: string;
            avatar?: string;
        };
    };
    assignedTeamId?: string;
    reporterId: string;
    projectId: string;
    boardId: string;
    parentId?: string;
    dueDate?: string;
    storyPoints?: number;
    labels?: string[];
    watchers?: string[];
    columnOrder: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TasksByColumn {
    [columnKey: string]: Task[];
}

/**
 * Create a new task
 */
export const createTask = async (projectId: string, data: {
    boardId: string;
    name: string;
    description?: string;
    type: "task" | "bug";
    status: string;
    priority: "low" | "medium" | "high" | "critical";
    assigneeId?: string;
    assignedTeamId?: string;
    sprintId?: string;
    epicId?: string;
    parentId?: string;
    dueDate?: string;
    storyPoints?: number;
    labels?: string[];
    watchers?: string[];
    customFields?: any;
}) => {
    try {
        const response = await axios.post(`/tasks/${projectId}/create`, data);
        showSuccess("Task created successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating task:", err);
            showError(err?.response?.data?.message || "Failed to create task");
        }
        throw err;
    }
};

/**
 * Get all tasks by project
 */
export const getAllTasks = async (projectId: string, params?: { teamId?: string; boardId?: string }) => {
    try {
        const response = await axios.get(`/tasks/${projectId}/all`, { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching tasks:", err);
            showError("Failed to fetch tasks");
        }
        throw err;
    }
};

/**
 * Get task by ID
 */
export const getTaskById = async (taskId: string) => {
    try {
        const response = await axios.get(`/tasks/${taskId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching task:", err);
            showError("Failed to fetch task details");
        }
        throw err;
    }
};

/**
 * Update task
 */
export const updateTask = async (projectId: string, taskId: string, data: any) => {
    try {
        const response = await axios.patch(`/tasks/project/${projectId}/${taskId}/update`, data);
        showSuccess("Task updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating task:", err);
            showError(err?.response?.data?.message || "Failed to update task");
        }
        throw err;
    }
};

/**
 * Delete task
 */
export const deleteTask = async (projectId: string, taskId: string, params: { boardId: string; teamId?: string }) => {
    try {
        const response = await axios.delete(`/tasks/project/${projectId}/${taskId}/delete`, { params });
        showSuccess("Task deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting task:", err);
            showError(err?.response?.data?.message || "Failed to delete task");
        }
        throw err;
    }
};

/**
 * Get subtasks
 */
export const getSubtasks = async (projectId: string, taskId: string, boardId: string) => {
    try {
        const response = await axios.get(`/tasks/project/${projectId}/${taskId}/subtasks`, {
            params: { boardId }
        });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching subtasks:", err);
            showError("Failed to fetch subtasks");
        }
        throw err;
    }
};

/**
 * Reorder tasks (drag and drop)
 */
export const reorderTasks = async (projectId: string, taskId: string, data: {
    boardId: string;
    from: string;
    to: string;
}) => {
    try {
        const response = await axios.patch(`/tasks/project/${projectId}/${taskId}/re-order`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error reordering task:", err);
            showError(err?.response?.data?.message || "Failed to move task");
        }
        throw err;
    }
};

/**
 * Get tasks by board column
 */
/**
 * Get tasks by board column
 */
export const getTasksByBoardColumn = async (
    boardId: string,
    projectId?: string,
    assigneeId?: string,
    search?: string
) => {
    try {
        const response = await axios.get(`/tasks/${boardId}/by-board`, {
            params: {
                projectId,
                assigneeId: assigneeId === "all" ? undefined : assigneeId,
                search
            }
        });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching tasks by column:", err);
            showError("Failed to fetch board tasks");
        }
        throw err;
    }
};

// Aliases for backward compatibility
export const addTask = createTask;
export const getTasksByColumn = getTasksByBoardColumn;
export const reorderTask = reorderTasks;
