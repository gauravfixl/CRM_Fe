import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/utils/toast";

const baseDealUrl = `/deal`;

/**
 * Fetches all deals for the organization.
 */
export const getDealListByOrg = async () => {
    try {
        const response = await axios.get(`${baseDealUrl}/getAllDeals`);
        return response;
    } catch (error) {
        console.error("Error fetching deal list:", error);
        throw error;
    }
};

/**
 * Creates a new deal.
 * @param {Object} dealData - Deal data.
 */
export const createDeal = async (dealData) => {
    try {
        const response = await axios.post(`${baseDealUrl}/create`, dealData);
        return response.data;
    } catch (err) {
        console.error("Error during createDeal API call:", err);
        return { success: false, error: err?.response?.data?.message || err.message };
    }
};

/**
 * Fetches a single deal by ID.
 * @param {string} id - Deal ID.
 */
export const getDealById = async (id) => {
    const response = await axios.get(`${baseDealUrl}/${id}`);
    return response;
};

/**
 * Updates an existing deal.
 * @param {string} dealId - Deal ID.
 * @param {Object} form - Updated data.
 */
export const updateDeal = async (dealId, form) => {
    const response = await axios.patch(`${baseDealUrl}/update/${dealId}`, form);
    return response.data;
};

/**
 * Updates a deal's stage.
 * @param {string} dealId - Deal ID.
 * @param {string} stage - New stage.
 */
export const updateDealStage = async (dealId, stage) => {
    try {
        const response = await axios.patch(`${baseDealUrl}/${dealId}/stage`, { stage });
        return response.data;
    } catch (error) {
        console.error("Error updating deal stage:", error);
        throw error;
    }
};

/**
 * Deletes a deal.
 */
export const deleteDeal = async (id) => {
    try {
        const response = await axios.delete(`${baseDealUrl}/${id}`);
        showSuccess("Deal Deleted");
        return response.data;
    } catch (err) {
        showError("Failed to delete deal");
        throw err;
    }
};
