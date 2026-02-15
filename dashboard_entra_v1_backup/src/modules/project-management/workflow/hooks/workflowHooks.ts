/**
 * Workflow Management Hooks
 * Handles all API calls for workflow operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface WorkflowState {
    _id: string;
    name: string;
    key: string;
    type: "initial" | "intermediate" | "final";
    order: number;
}

export interface WorkflowTransition {
    from: string;
    to: string;
    name?: string;
}

export interface Workflow {
    _id: string;
    name: string;
    states: WorkflowState[];
    transitions: WorkflowTransition[];
    projectId?: string;
    boardId?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Get workflow by project
 */
export const getWorkflowByProject = async (projectId: string) => {
    try {
        const response = await axios.get(`/workflow/project/${projectId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching workflow:", err);
            showError("Failed to fetch workflow");
        }
        throw err;
    }
};

/**
 * Get workflow by board
 */
export const getWorkflowByBoard = async (boardId: string) => {
    try {
        const response = await axios.get(`/workflow/board/${boardId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching workflow:", err);
            showError("Failed to fetch workflow");
        }
        throw err;
    }
};

/**
 * Update workflow
 */
export const updateWorkflow = async (workflowId: string, data: {
    states?: WorkflowState[];
    transitions?: WorkflowTransition[];
}) => {
    try {
        const response = await axios.patch(`/workflow/${workflowId}`, data);
        showSuccess("Workflow updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating workflow:", err);
            showError(err?.response?.data?.message || "Failed to update workflow");
        }
        throw err;
    }
};
