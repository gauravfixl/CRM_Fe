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

export const createJobPosting = async (data: {
    title: string;
    description: string;
    department: string;
    position: string;
    location: string;
    employmentType: string;
    qualifications?: string[];
    responsibilities?: string[];
    tags?: string[];
    closingDate?: string;
    openingCount?: number;
}) => {
    try {
        const response = await axios.post("/recruitment/jobs/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating job posting:", err);
            showError(err?.response?.data?.error || "Failed to create job posting");
        }
        throw err;
    }
};

export const updateJobPosting = async (jobId: string, data: Record<string, any>) => {
    try {
        const response = await axios.patch(`/recruitment/jobs/update/${jobId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating job posting:", err);
            showError(err?.response?.data?.error || "Failed to update job posting");
        }
        throw err;
    }
};

export const closeJobPosting = async (jobId: string) => {
    try {
        const response = await axios.patch(`/recruitment/jobs/${jobId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error closing job posting:", err);
            showError(err?.response?.data?.error || "Failed to close job posting");
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

export const createCandidate = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    jobApplication: string;
    source?: string;
    status?: string;
}) => {
    try {
        const response = await axios.post("/recruitment/candidates/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating candidate:", err);
            showError(err?.response?.data?.message || "Failed to create candidate");
        }
        throw err;
    }
};

export const updateCandidate = async (candidateId: string, data: Record<string, any>) => {
    try {
        const response = await axios.patch(`/recruitment/candidates/${candidateId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating candidate:", err);
            showError(err?.response?.data?.message || "Failed to update candidate");
        }
        throw err;
    }
};

export const updateCandidateStatus = async (candidateId: string, status: string) => {
    try {
        const response = await axios.patch(`/recruitment/candidates/update-status/${candidateId}`, { status });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating candidate status:", err);
            showError(err?.response?.data?.message || "Failed to update candidate status");
        }
        throw err;
    }
};

export const deleteCandidate = async (candidateId: string) => {
    try {
        const response = await axios.delete(`/recruitment/candidates/${candidateId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting candidate:", err);
            showError(err?.response?.data?.message || "Failed to delete candidate");
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

export const createInterview = async (data: {
    candidate: string;
    jobPosting: string;
    interviewer: string;
    scheduledDate: string;
    interviewType: "Phone" | "Video" | "In-person";
    panel?: string[];
    followUp?: string;
}) => {
    try {
        const response = await axios.post("/recruitment/interviews/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating interview:", err);
            showError(err?.response?.data?.message || "Failed to create interview");
        }
        throw err;
    }
};

export const updateInterviewStatus = async (interviewId: string, status: "Scheduled" | "Completed" | "Cancelled") => {
    try {
        const response = await axios.patch(`/recruitment/interviews/${interviewId}/status`, { status });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating interview status:", err);
            showError(err?.response?.data?.message || "Failed to update interview status");
        }
        throw err;
    }
};

export const submitInterviewFeedback = async (interviewId: string, data: {
    interviewerId: string;
    comments: string;
    rating: number;
}) => {
    try {
        const response = await axios.patch(`/recruitment/interviews/${interviewId}/feedback`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error submitting interview feedback:", err);
            showError(err?.response?.data?.message || "Failed to submit interview feedback");
        }
        throw err;
    }
};

export const deleteInterview = async (interviewId: string) => {
    try {
        const response = await axios.delete(`/recruitment/interviews/${interviewId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting interview:", err);
            showError(err?.response?.data?.message || "Failed to delete interview");
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

export const createOffer = async (data: {
    candidate: string;
    jobPosting: string;
    offerDate: string;
    offerDetails: {
        baseSalary: number;
        bonus?: number;
        currency?: string;
        payFrequency?: string;
        benefits?: string[];
        jobTitle?: string;
        location?: string;
    };
}) => {
    try {
        const response = await axios.post("/recruitment/Offers/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating offer:", err);
            showError(err?.response?.data?.message || "Failed to create offer");
        }
        throw err;
    }
};

export const updateOffer = async (offerId: string, data: Record<string, any>) => {
    try {
        const response = await axios.patch(`/recruitment/Offers/update/${offerId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating offer:", err);
            showError(err?.response?.data?.message || "Failed to update offer");
        }
        throw err;
    }
};

export const updateOfferStatus = async (offerId: string, status: string, acceptedDate?: string) => {
    try {
        const response = await axios.patch(`/recruitment/Offers/${offerId}`, { status, acceptedDate });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating offer status:", err);
            showError(err?.response?.data?.message || "Failed to update offer status");
        }
        throw err;
    }
};

export const deleteOffer = async (offerId: string) => {
    try {
        const response = await axios.delete(`/recruitment/Offers/${offerId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting offer:", err);
            showError(err?.response?.data?.message || "Failed to delete offer");
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

// Raw time log (punch) APIs
export const punch = async (data: {
    punchType: "IN" | "OUT";
    source?: string;
    deviceId?: string;
}) => {
    try {
        const response = await axios.post("/hrm/attendance/punch", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error punching attendance:", err);
            showError(err?.response?.data?.message || "Failed to record punch");
        }
        throw err;
    }
};

export const getTodayPunches = async () => {
    try {
        const response = await axios.get("/hrm/attendance/punches/today");
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching today punches:", err);
            showError("Failed to fetch today punches");
        }
        throw err;
    }
};

// Attendance regularization APIs (employee self-service)
export const requestRegularization = async (data: {
    attendanceDate: string; // YYYY-MM-DD
    requestedIn?: Date | string;
    requestedOut?: Date | string;
    reason: string;
}) => {
    try {
        const response = await axios.post("/attendance/regularization/request", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error requesting regularization:", err);
            showError(err?.response?.data?.message || "Failed to request regularization");
        }
        throw err;
    }
};

export const approveRegularization = async (id: string) => {
    try {
        const response = await axios.post(`/attendance/regularization/approve/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error approving regularization:", err);
            showError(err?.response?.data?.message || "Failed to approve regularization");
        }
        throw err;
    }
};

export const rejectRegularization = async (id: string, remarks: string) => {
    try {
        const response = await axios.post(`/attendance/regularization/reject/${id}`, { remarks });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error rejecting regularization:", err);
            showError(err?.response?.data?.message || "Failed to reject regularization");
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

// Leave request APIs (employee self-service + HR approval)
export const createLeaveRequest = async (data: {
    leaveType: string; // leaveTypeId
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    isHalfDay?: boolean;
    halfDaySession?: "FIRST_HALF" | "SECOND_HALF" | null;
    reason: string;
}) => {
    try {
        const response = await axios.post("/leave/request/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating leave request:", err);
            showError(err?.response?.data?.message || "Failed to create leave request");
        }
        throw err;
    }
};

export const approveLeaveRequest = async (id: string) => {
    try {
        const response = await axios.post(`/leave/request/approve/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error approving leave request:", err);
            showError(err?.response?.data?.message || "Failed to approve leave request");
        }
        throw err;
    }
};

export const rejectLeaveRequest = async (id: string, reason: string) => {
    try {
        const response = await axios.post(`/leave/request/reject/${id}`, { reason });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error rejecting leave request:", err);
            showError(err?.response?.data?.message || "Failed to reject leave request");
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

export const createAppraisal = async (data: {
    employee: string;
    period: string;
    rating: number;
    comments?: string;
    recommendation?: string;
}) => {
    try {
        const response = await axios.post("/performance/appraisal/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating appraisal:", err);
            showError(err?.response?.data?.message || "Failed to create appraisal");
        }
        throw err;
    }
};

export const updateAppraisal = async (appraisalId: string, data: Record<string, any>) => {
    try {
        const response = await axios.put(`/performance/appraisal/${appraisalId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating appraisal:", err);
            showError(err?.response?.data?.message || "Failed to update appraisal");
        }
        throw err;
    }
};

export const deleteAppraisal = async (appraisalId: string) => {
    try {
        const response = await axios.delete(`/performance/appraisal/${appraisalId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting appraisal:", err);
            showError(err?.response?.data?.message || "Failed to delete appraisal");
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

export const createGoal = async (data: {
    employee: string;
    goal: string;
    keyPerformanceIndicators?: string[];
    targetDate: string;
}) => {
    try {
        const response = await axios.post("/performance/goals/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating goal:", err);
            showError(err?.response?.data?.message || "Failed to create goal");
        }
        throw err;
    }
};

export const updateGoal = async (goalId: string, data: Record<string, any>) => {
    try {
        const response = await axios.patch(`/performance/goals/${goalId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating goal:", err);
            showError(err?.response?.data?.message || "Failed to update goal");
        }
        throw err;
    }
};

export const deleteGoal = async (goalId: string) => {
    try {
        const response = await axios.delete(`/performance/goals/${goalId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting goal:", err);
            showError(err?.response?.data?.message || "Failed to delete goal");
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

export const createFeedback = async (data: {
    employee: string;
    feedbackType: string;
    rating?: number;
    comments: string;
}) => {
    try {
        const response = await axios.post("/performance/feedback/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating feedback:", err);
            showError(err?.response?.data?.message || "Failed to create feedback");
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

export const getHolidaysByYear = async (year: number | string) => {
    try {
        const response = await axios.get("/attendance/holidays/", { params: { year } });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching holidays by year:", err);
            showError("Failed to fetch holidays");
        }
        throw err;
    }
};

export const createHoliday = async (data: { name: string; date: string; type: "National" | "Optional"; isPaid?: boolean; isMandatory?: boolean }) => {
    try {
        const response = await axios.post("/attendance/holidays/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating holiday:", err);
            showError("Failed to create holiday");
        }
        throw err;
    }
};

export const updateHoliday = async (holidayId: string, data: { name?: string; type?: string; isPaid?: boolean; isMandatory?: boolean; isActive?: boolean }) => {
    try {
        const response = await axios.patch(`/attendance/holidays/${holidayId}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating holiday:", err);
            showError("Failed to update holiday");
        }
        throw err;
    }
};

export const deleteHoliday = async (holidayId: string) => {
    try {
        const response = await axios.delete(`/attendance/holidays/${holidayId}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deleting holiday:", err);
            showError("Failed to delete holiday");
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

// ==================== SALARY CONFIGURATION APIs ====================

export const getSalaryConfigs = async (params?: { status?: string }) => {
    try {
        const response = await axios.get("/payroll/salary-config/all", { params });
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error fetching salary configurations:", err);
        }
        throw err;
    }
};

export const createSalaryConfig = async (data: {
    employee: string;
    salaryType: string;
    base: number;
    components: Array<{
        key: string;
        label: string;
        type: "EARNING" | "DEDUCTION";
        mode: "AMOUNT" | "PERCENT";
        value: number;
        isTaxable: boolean;
        sequence?: number;
    }>;
    effectiveFrom: string;
    currency?: string;
}) => {
    try {
        const response = await axios.post("/payroll/salary-config/", data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error creating salary configuration:", err);
            showError(err?.response?.data?.error || "Failed to create salary configuration");
        }
        throw err;
    }
};

export const updateSalaryConfig = async (id: string, data: Record<string, any>) => {
    try {
        const response = await axios.patch(`/payroll/salary-config/${id}`, data);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error updating salary configuration:", err);
            showError(err?.response?.data?.error || "Failed to update salary configuration");
        }
        throw err;
    }
};

export const deactivateSalaryConfig = async (id: string) => {
    try {
        const response = await axios.delete(`/payroll/salary-config/${id}`);
        return response;
    } catch (err: any) {
        if (err?.response?.status !== 401) {
            console.error("Error deactivating salary configuration:", err);
            showError(err?.response?.data?.error || "Failed to deactivate salary configuration");
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
