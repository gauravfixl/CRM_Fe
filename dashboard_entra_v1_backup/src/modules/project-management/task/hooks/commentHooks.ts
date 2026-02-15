/**
 * Comment Management Hooks
 * Handles all API calls for task comments
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

export interface Comment {
    _id: string;
    taskId: string;
    content: string;
    author: {
        _id: string;
        fullName: string;
        email: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

/**
 * Get comments for a task
 */
export const getTaskComments = async (taskId: string) => {
    try {
        const response = await axios.get(`/tasks/${taskId}/comments`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching comments:", err);
            // We don't necessarily want to show a toast for every background fetch failure
        }
        throw err;
    }
};

/**
 * Add a comment to a task
 */
export const addTaskComment = async (taskId: string, content: string) => {
    try {
        const response = await axios.post(`/tasks/${taskId}/comments`, { content });
        showSuccess("Comment posted!");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error posting comment:", err);
            showError(err?.response?.data?.message || "Failed to post comment");
        }
        throw err;
    }
};

/**
 * Delete a comment
 */
export const deleteComment = async (taskId: string, commentId: string) => {
    try {
        await axios.delete(`/tasks/${taskId}/comments/${commentId}`);
        showSuccess("Comment deleted");
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting comment:", err);
            showError(err?.response?.data?.message || "Failed to delete comment");
        }
        throw err;
    }
};
