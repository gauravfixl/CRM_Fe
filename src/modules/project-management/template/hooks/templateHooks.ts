/**
 * Project Template Management Hooks
 * Handles all API calls for template operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

// Types
export interface ProjectTemplate {
    _id: string;
    name: string;
    description?: string;
    category: string;
    workflow?: any;
    boardStructure?: any;
    defaultColumns?: Array<{
        name: string;
        key: string;
        order: number;
    }>;
    isPublic: boolean;
    createdBy: string;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * List all templates
 */
export const listTemplates = async (params?: {
    category?: string;
    isPublic?: boolean;
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await axios.get("/project-template", { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status === 404) {
            // Return a mock successful response with empty data to avoid breaking the UI
            return { data: { templates: [] } } as any;
        }
        if (err?.response?.status !== 401) {
            console.error("Error fetching templates:", err);
            showError("Failed to fetch templates");
        }
        throw err;
    }
};

/**
 * Get template by ID
 */
export const getTemplateById = async (templateId: string) => {
    try {
        const response = await axios.get(`/project-template/${templateId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching template:", err);
            showError("Failed to fetch template details");
        }
        throw err;
    }
};

/**
 * Create template
 */
export const createTemplate = async (data: {
    name: string;
    description?: string;
    category: string;
    workflow?: any;
    boardStructure?: any;
    defaultColumns?: Array<{
        name: string;
        key: string;
        order: number;
    }>;
    isPublic?: boolean;
}) => {
    try {
        const response = await axios.post("/project-template/", data);
        showSuccess("Template created successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating template:", err);
            showError(err?.response?.data?.message || "Failed to create template");
        }
        throw err;
    }
};

/**
 * Update template
 */
export const updateTemplate = async (templateId: string, data: any) => {
    try {
        const response = await axios.patch(`/project-template/${templateId}`, data);
        showSuccess("Template updated successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating template:", err);
            showError(err?.response?.data?.message || "Failed to update template");
        }
        throw err;
    }
};

/**
 * Delete template
 */
export const deleteTemplate = async (templateId: string) => {
    try {
        const response = await axios.delete(`/project-template/${templateId}`);
        showSuccess("Template deleted successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting template:", err);
            showError(err?.response?.data?.message || "Failed to delete template");
        }
        throw err;
    }
};
