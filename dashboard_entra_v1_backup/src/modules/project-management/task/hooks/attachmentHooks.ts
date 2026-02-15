/**
 * Attachment Management Hooks
 * Handles all API calls for task attachments
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

export interface Attachment {
    _id: string;
    taskId: string;
    name: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    uploadedBy: {
        _id: string;
        fullName: string;
    };
    createdAt: string;
}

/**
 * Get attachments for a task
 */
export const getTaskAttachments = async (taskId: string) => {
    try {
        const response = await axios.get(`/tasks/${taskId}/attachments`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching attachments:", err);
        }
        throw err;
    }
};

/**
 * Upload an attachment to a task
 */
export const uploadAttachment = async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(`/tasks/${taskId}/attachments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        showSuccess("File uploaded successfully!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error uploading file:", err);
            showError(err?.response?.data?.message || "Failed to upload file");
        }
        throw err;
    }
};

/**
 * Delete an attachment
 */
export const deleteAttachment = async (taskId: string, attachmentId: string) => {
    try {
        await axios.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
        showSuccess("Attachment removed");
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting attachment:", err);
            showError(err?.response?.data?.message || "Failed to delete attachment");
        }
        throw err;
    }
};
