/**
 * Lifecycle Module Hooks
 * Handles all API calls for Lifecycle-related operations (Onboarding, Assets)
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError } from "@/utils/toast";

// ==================== ONBOARDING APIs ====================

export const getAllOnboardings = async () => {
    try {
        const response = await axios.get("/employees/onboarding/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching onboardings:", err);
            showError("Failed to fetch onboarding records");
        }
        throw err;
    }
};

export const getOnboardingByEmployee = async (employeeId: string) => {
    try {
        const response = await axios.get(`/employees/onboarding/employee/${employeeId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching onboarding:", err);
            showError("Failed to fetch onboarding details");
        }
        throw err;
    }
};

export const initiateOnboarding = async (employeeId: string, data: any) => {
    try {
        const response = await axios.post(`/employees/onboarding/initiate/${employeeId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error initiating onboarding:", err);
            showError("Failed to initiate onboarding");
        }
        throw err;
    }
};

export const updateOnboardingStatus = async (onboardingId: string, data: any) => {
    try {
        const response = await axios.patch(`/employees/onboarding/status/${onboardingId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating onboarding status:", err);
            showError("Failed to update onboarding status");
        }
        throw err;
    }
};

export const deleteOnboarding = async (onboardingId: string) => {
    try {
        const response = await axios.delete(`/employees/onboarding/${onboardingId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting onboarding:", err);
            showError("Failed to delete onboarding record");
        }
        throw err;
    }
};

// ==================== ASSET APIs ====================

export const getAllAssets = async () => {
    try {
        const response = await axios.get("/resource/asset/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching assets:", err);
            showError("Failed to fetch assets");
        }
        throw err;
    }
};

export const getAssetById = async (assetId: string) => {
    try {
        const response = await axios.get(`/resource/asset/${assetId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching asset:", err);
            showError("Failed to fetch asset details");
        }
        throw err;
    }
};

export const createAsset = async (data: any) => {
    try {
        const response = await axios.post("/resource/asset", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating asset:", err);
            showError("Failed to create asset");
        }
        throw err;
    }
};

export const updateAssetApi = async (assetId: string, data: any) => {
    try {
        const response = await axios.patch(`/resource/asset/${assetId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating asset:", err);
            showError("Failed to update asset");
        }
        throw err;
    }
};

export const deleteAssetApi = async (assetId: string) => {
    try {
        const response = await axios.delete(`/resource/asset/${assetId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting asset:", err);
            showError("Failed to delete asset");
        }
        throw err;
    }
};

export const assignAssetApi = async (data: { assetId: string; employeeId: string }) => {
    try {
        const response = await axios.post("/resource/asset-assignment", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error assigning asset:", err);
            showError("Failed to assign asset");
        }
        throw err;
    }
};

export const returnAssetApi = async (assetId: string) => {
    try {
        const response = await axios.post(`/resource/asset-assignment/${assetId}/return`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error returning asset:", err);
            showError("Failed to return asset");
        }
        throw err;
    }
};

export const getMyAssignedAssets = async () => {
    try {
        const response = await axios.get("/resource/asset/assets/assigned");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching assigned assets:", err);
            showError("Failed to fetch assigned assets");
        }
        throw err;
    }
};
