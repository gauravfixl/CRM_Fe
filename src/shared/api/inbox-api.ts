import { axiosInstance as axios } from "@/lib/axios";
import type { ApprovalItem } from "@/shared/data/inbox-store";

/* ============================================================
   Backend API service for HRM Inbox section.
   Only Leave Requests have a fully-wired backend today:
     - GET    /api/leave/request/pending
     - POST   /api/leave/request/approve/:id
     - POST   /api/leave/request/reject/:id
   Attendance Regularization has approve/reject but no list-pending
   endpoint, so it cannot be hydrated from the server yet.
   Notifications and generic Requests have no backend at all.
   ============================================================ */

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

type PopulatedEmployee = {
    _id?: string;
    firstName?: string;
    lastName?: string;
    employeeCode?: string;
    department?: string;
};

export interface ApiLeaveRequest {
    _id: string;
    organizationId: string;
    employeeId: string | PopulatedEmployee;
    leaveType: string;
    startDate: string;
    endDate: string;
    isHalfDay?: boolean;
    halfDaySession?: "FIRST_HALF" | "SECOND_HALF" | null;
    hours?: number;
    reason?: string;
    status: "Pending" | "Approved" | "Rejected";
    approvedBy?: string;
    approvedAt?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

/* ---------- Mapping helpers ---------- */

const toInitials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "EM";

function resolveEmployee(raw: ApiLeaveRequest["employeeId"]): ApprovalItem["requestedBy"] {
    if (!raw || typeof raw === "string") {
        const id = typeof raw === "string" ? raw : "UNKNOWN";
        return { id, name: "Employee", avatar: "EM", department: "—" };
    }
    const fullName = `${raw.firstName || ""} ${raw.lastName || ""}`.trim() || "Employee";
    return {
        id: raw.employeeCode || raw._id || "UNKNOWN",
        name: fullName,
        avatar: toInitials(fullName),
        department: raw.department || "—"
    };
}

function computeDays(start: string, end: string, isHalfDay?: boolean): number {
    if (isHalfDay) return 0.5;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 1;
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1);
}

export function leaveRequestToApproval(raw: ApiLeaveRequest): ApprovalItem {
    const days = computeDays(raw.startDate, raw.endDate, raw.isHalfDay);
    const priority: ApprovalItem["priority"] = days > 3 ? "High" : days >= 2 ? "Medium" : "Low";

    return {
        id: raw._id,
        category: "Leave",
        requestedBy: resolveEmployee(raw.employeeId),
        requestedAt: raw.createdAt,
        status: raw.status,
        priority,
        details: {
            title: `${raw.leaveType} Leave Request`,
            description: raw.reason || "Leave request",
            startDate: raw.startDate,
            endDate: raw.endDate,
            days,
            reason: raw.reason
        },
        approvedAt: raw.approvedAt,
        rejectionReason: raw.rejectionReason
    };
}

/* ---------- Endpoints ---------- */

export async function fetchPendingLeaveApprovals(): Promise<ApprovalItem[]> {
    const res = await axios.get<ApiResponse<ApiLeaveRequest[]>>("/leave/request/pending");
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    return data.map(leaveRequestToApproval);
}

export async function approveLeaveApproval(id: string): Promise<ApiLeaveRequest> {
    const res = await axios.post<ApiResponse<ApiLeaveRequest>>(`/leave/request/approve/${id}`);
    return res.data.data;
}

export async function rejectLeaveApproval(id: string, reason: string): Promise<ApiLeaveRequest> {
    const res = await axios.post<ApiResponse<ApiLeaveRequest>>(`/leave/request/reject/${id}`, { reason });
    return res.data.data;
}

/* ---------- Attendance Regularization ----------
   Approve/reject exist on the backend but there is no "GET pending"
   endpoint yet, so we can't list them in the inbox. These helpers are
   exposed for when the backend adds the listing endpoint.
*/

export async function approveAttendanceRegularization(id: string) {
    const res = await axios.post<ApiResponse<unknown>>(`/attendance/regularization/approve/${id}`);
    return res.data;
}

export async function rejectAttendanceRegularization(id: string, remarks: string) {
    const res = await axios.post<ApiResponse<unknown>>(`/attendance/regularization/reject/${id}`, { remarks });
    return res.data;
}

export function isLeaveApiId(id: string): boolean {
    return /^[a-f0-9]{24}$/i.test(id);
}
