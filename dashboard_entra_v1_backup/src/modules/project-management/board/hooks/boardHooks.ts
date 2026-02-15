/**
 * Board Management Hooks
 * Handles all API calls for board CRUD operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface BoardColumn {
    _id: string;
    name: string;
    key: string;
    order: number;
    color?: string;
}

export interface Board {
    _id: string;
    name: string;
    type: "kanban" | "scrum";
    columns: BoardColumn[];
    projectId?: string;
    teamId?: string;
    workflow?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Create a new board
 */
export const createBoard = async (data: {
    projectId?: string;
    teamId?: string;
    templateId?: string;
    name?: string;
    type?: "kanban" | "scrum";
}) => {
    try {
        const response = await axios.post("/board/create", data);
        showSuccess("Board created successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating board:", err);
            showError(err?.response?.data?.message || "Failed to create board");
        }
        throw err;
    }
};

/**
 * Get all boards by project
 */
export const getAllBoards = async (projectId: string) => {
    try {
        const response = await axios.get(`/board/${projectId}/all`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching boards:", err);
            showError("Failed to fetch boards");
        }
        throw err;
    }
};

/**
 * Get board by ID
 */
export const getBoardById = async (boardId: string, params?: { teamId?: string; projectId?: string }) => {
    try {
        const response = await axios.get(`/board/${boardId}`, { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching board:", err);
            showError("Failed to fetch board details");
        }
        throw err;
    }
};

/**
 * Delete board
 */
export const deleteBoard = async (boardId: string) => {
    try {
        const response = await axios.delete(`/board/${boardId}/delete`);
        showSuccess("Board deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting board:", err);
            showError(err?.response?.data?.message || "Failed to delete board");
        }
        throw err;
    }
};

/**
 * Add column to board
 */
export const addColumn = async (boardId: string, data: {
    name: string;
    projectId?: string;
    teamId?: string;
    color?: string;
}) => {
    try {
        const response = await axios.post(`/board/${boardId}/add-column`, data);
        showSuccess("Column added successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error adding column:", err);
            showError(err?.response?.data?.message || "Failed to add column");
        }
        throw err;
    }
};

/**
 * Update column
 */
export const updateColumn = async (boardId: string, data: {
    columnId: string;
    name: string;
    color?: string;
}) => {
    try {
        const response = await axios.patch(`/board/${boardId}/update-column`, data);
        showSuccess("Column updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating column:", err);
            showError(err?.response?.data?.message || "Failed to update column");
        }
        throw err;
    }
};

/**
 * Delete column
 */
export const deleteColumn = async (boardId: string, data: { columnId: string }) => {
    try {
        const response = await axios.delete(`/board/${boardId}/delete-column`, { data });
        showSuccess("Column deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting column:", err);
            showError(err?.response?.data?.message || "Failed to delete column");
        }
        throw err;
    }
};

// Aliases for backward compatibility
export const addNewColumn = addColumn;
export const getAllProjectBoards = getAllBoards;
