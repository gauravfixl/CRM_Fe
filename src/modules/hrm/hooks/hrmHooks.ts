/**
 * HRM Module Hooks
 * Handles all API calls for HRM-related operations
 */

import { axiosInstance as axios } from "@/lib/axios";
import { showError } from "@/utils/toast";

// ==================== EMPLOYEE APIs ====================

export const getAllEmployees = async () => {
    try {
        const response = await axios.get("/employees/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching employees:", err);
            showError("Failed to fetch employees");
        }
        throw err;
    }
};

export const getEmployeeById = async (employeeId: string) => {
    try {
        const response = await axios.get(`/employees/${employeeId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching employee:", err);
            showError("Failed to fetch employee details");
        }
        throw err;
    }
};

// ==================== DEPARTMENT APIs ====================

export const getAllDepartments = async () => {
    try {
        const response = await axios.get("/organization/departments/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching departments:", err);
            showError("Failed to fetch departments");
        }
        throw err;
    }
};

export const getDepartmentList = async () => {
    try {
        const response = await axios.get("/organization/departments/list");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching department list:", err);
        }
        throw err;
    }
};

export const createDepartment = async (data: { name: string; description?: string; head?: string }) => {
    try {
        const response = await axios.post("/organization/departments/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating department:", err);
            showError(err?.response?.data?.message || "Failed to create department");
        }
        throw err;
    }
};

export const updateDepartment = async (id: string, data: { name?: string; description?: string; head?: string }) => {
    try {
        const response = await axios.patch(`/organization/departments/${id}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating department:", err);
            showError(err?.response?.data?.message || "Failed to update department");
        }
        throw err;
    }
};

export const deleteDepartment = async (id: string) => {
    try {
        const response = await axios.delete(`/organization/departments/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting department:", err);
            showError(err?.response?.data?.message || "Failed to delete department");
        }
        throw err;
    }
};

// ==================== POSITION APIs ====================

export const getAllPositions = async () => {
    try {
        const response = await axios.get("/organization/positions/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching positions:", err);
            showError("Failed to fetch positions");
        }
        throw err;
    }
};

export const createPosition = async (data: { department: string; title: string; level?: string; description?: string }) => {
    try {
        const response = await axios.post("/organization/positions/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating position:", err);
            showError(err?.response?.data?.message || "Failed to create position");
        }
        throw err;
    }
};

export const updatePosition = async (id: string, data: { title?: string; level?: string; description?: string; department?: string }) => {
    try {
        const response = await axios.patch(`/organization/positions/${id}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating position:", err);
            showError(err?.response?.data?.message || "Failed to update position");
        }
        throw err;
    }
};

export const deletePosition = async (id: string) => {
    try {
        const response = await axios.delete(`/organization/positions/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting position:", err);
            showError(err?.response?.data?.message || "Failed to delete position");
        }
        throw err;
    }
};

// ==================== RECRUITMENT - JOB APIs ====================

export const getAllJobs = async () => {
    try {
        const response = await axios.get("/recruitment/jobs/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching jobs:", err);
            showError("Failed to fetch job postings");
        }
        throw err;
    }
};

export const getJobById = async (jobId: string) => {
    try {
        const response = await axios.get(`/recruitment/jobs/${jobId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching job:", err);
            showError("Failed to fetch job details");
        }
        throw err;
    }
};

// ==================== RECRUITMENT - CANDIDATE APIs ====================

export const getAllCandidates = async () => {
    try {
        const response = await axios.get("/recruitment/candidates/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching candidates:", err);
            showError("Failed to fetch candidates");
        }
        throw err;
    }
};

export const getCandidatesList = async () => {
    try {
        const response = await axios.get("/recruitment/candidates/list");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching candidates list:", err);
        }
        throw err;
    }
};

// ==================== RECRUITMENT - INTERVIEW APIs ====================

export const getAllInterviews = async () => {
    try {
        const response = await axios.get("/recruitment/interviews/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching interviews:", err);
            showError("Failed to fetch interviews");
        }
        throw err;
    }
};

// ==================== RECRUITMENT - OFFER APIs ====================

export const getAllOffers = async () => {
    try {
        const response = await axios.get("/recruitment/Offers/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching offers:", err);
            showError("Failed to fetch offers");
        }
        throw err;
    }
};

// ==================== ATTENDANCE APIs ====================

export const getMyAttendance = async () => {
    try {
        const response = await axios.get("/hrm/attendance/me");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching attendance:", err);
            showError("Failed to fetch attendance");
        }
        throw err;
    }
};

export const getEmployeeAttendance = async (employeeId: string) => {
    try {
        const response = await axios.get(`/hrm/attendance/employee/${employeeId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching employee attendance:", err);
            showError("Failed to fetch employee attendance");
        }
        throw err;
    }
};

// ==================== LEAVE APIs ====================

export const getMyLeaveRequests = async () => {
    try {
        const response = await axios.get("/leave/request/me");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching leave requests:", err);
            showError("Failed to fetch leave requests");
        }
        throw err;
    }
};

export const getPendingLeaveRequests = async () => {
    try {
        const response = await axios.get("/leave/request/pending");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching pending leaves:", err);
            showError("Failed to fetch pending leave requests");
        }
        throw err;
    }
};

export const getAllLeaveTypes = async () => {
    try {
        const response = await axios.get("/leave/types/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching leave types:", err);
        }
        throw err;
    }
};

export const getActiveLeaveTypes = async () => {
    try {
        const response = await axios.get("/leave/types/");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching active leave types:", err);
            showError("Failed to fetch leave types");
        }
        throw err;
    }
};

export const createLeaveType = async (data: {
    name: string; code: string; isPaid: boolean;
    annualAllocation?: number | null; allowHalfDay?: boolean;
    accrualType?: string; monthlyAccrual?: number;
    maxCarryForward?: number; allowEncashment?: boolean; maxEncashable?: number;
}) => {
    try {
        const response = await axios.post("/leave/types/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating leave type:", err);
            showError(err?.response?.data?.message || "Failed to create leave type");
        }
        throw err;
    }
};

export const updateLeaveType = async (id: string, data: {
    name?: string; annualAllocation?: number | null; allowHalfDay?: boolean;
    accrualType?: string; monthlyAccrual?: number;
    maxCarryForward?: number; allowEncashment?: boolean; maxEncashable?: number;
}) => {
    try {
        const response = await axios.patch(`/leave/types/${id}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating leave type:", err);
            showError(err?.response?.data?.message || "Failed to update leave type");
        }
        throw err;
    }
};

export const disableLeaveType = async (id: string) => {
    try {
        const response = await axios.delete(`/leave/types/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error disabling leave type:", err);
            showError(err?.response?.data?.message || "Failed to disable leave type");
        }
        throw err;
    }
};

// ==================== ATTENDANCE POLICY APIs ====================

export const getActiveAttendancePolicy = async () => {
    try {
        const response = await axios.get("/attendance/policy/active");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401 && err?.response?.status !== 404) {
            console.error("Error fetching attendance policy:", err);
            showError("Failed to fetch attendance policy");
        }
        throw err;
    }
};

export const upsertAttendancePolicy = async (data: {
    lateAllowedMinutes?: number; halfDayThresholdMinutes: number;
    absentThresholdMinutes: number; overtimeMinMinutes?: number;
    allowEarlyPunch?: boolean; allowLatePunch?: boolean;
    sandwichLeaveRule?: boolean; allowBackdatedRegularization?: boolean;
    maxBackdateDays?: number;
}) => {
    try {
        const response = await axios.post("/attendance/policy/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error saving attendance policy:", err);
            showError(err?.response?.data?.message || "Failed to save attendance policy");
        }
        throw err;
    }
};

export const getLeaveBalance = async () => {
    try {
        const response = await axios.get("/leave/balance/me");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching leave balance:", err);
        }
        throw err;
    }
};

// ==================== PERFORMANCE APIs ====================

export const getAllAppraisals = async () => {
    try {
        const response = await axios.get("/performance/appraisal/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching appraisals:", err);
            showError("Failed to fetch appraisals");
        }
        throw err;
    }
};

export const getAllGoals = async () => {
    try {
        const response = await axios.get("/performance/goals/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching goals:", err);
            showError("Failed to fetch goals");
        }
        throw err;
    }
};

export const getMyGoals = async (employeeId: string) => {
    try {
        const response = await axios.get(`/performance/goals/${employeeId}/mine`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching my goals:", err);
            showError("Failed to fetch your goals");
        }
        throw err;
    }
};

export const getAllFeedback = async () => {
    try {
        const response = await axios.get("/performance/feedback/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching feedback:", err);
            showError("Failed to fetch feedback");
        }
        throw err;
    }
};

// ==================== HOLIDAY APIs ====================

export const getAllHolidays = async () => {
    try {
        const response = await axios.get("/attendance/holidays/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching holidays:", err);
            showError("Failed to fetch holidays");
        }
        throw err;
    }
};

// ==================== SHIFT APIs ====================

export const getAllShifts = async () => {
    try {
        const response = await axios.get("/attendance/shifts/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching shifts:", err);
            showError("Failed to fetch shifts");
        }
        throw err;
    }
};

export const getActiveShifts = async () => {
    try {
        const response = await axios.get("/attendance/shifts/active");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching active shifts:", err);
            showError("Failed to fetch active shifts");
        }
        throw err;
    }
};

export const createShift = async (data: {
    shiftType: string; startTime: string; endTime: string;
    breakMinutes?: number; graceInMinutes?: number; graceOutMinutes?: number;
    halfDayAfterMinutes: number; overtimeAfterMinutes?: number; isNightShift?: boolean;
}) => {
    try {
        const response = await axios.post("/attendance/shifts/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating shift:", err);
            showError(err?.response?.data?.message || "Failed to create shift");
        }
        throw err;
    }
};

export const updateShift = async (id: string, data: { graceInMinutes?: number; graceOutMinutes?: number; isActive?: boolean }) => {
    try {
        const response = await axios.patch(`/attendance/shifts/${id}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating shift:", err);
            showError(err?.response?.data?.message || "Failed to update shift");
        }
        throw err;
    }
};

export const disableShift = async (id: string) => {
    try {
        const response = await axios.delete(`/attendance/shifts/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error disabling shift:", err);
            showError(err?.response?.data?.message || "Failed to disable shift");
        }
        throw err;
    }
};

// ==================== ONBOARDING APIs ====================

export const getOnboardingTasks = async () => {
    try {
        const response = await axios.get("/employees/onboarding/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching onboarding tasks:", err);
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

export const getAssetAssignments = async () => {
    try {
        const response = await axios.get("/resource/asset-assignment/all");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching asset assignments:", err);
        }
        throw err;
    }
};
