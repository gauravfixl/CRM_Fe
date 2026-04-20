import { axiosInstance } from "@/lib/axios";
import type { Ticket } from "./helpdesk-store";

// ==================== Backend Enums (must match server schema) ====================

export const BACKEND_STATUS_MAP: Record<Ticket["status"], string> = {
    "Open": "open",
    "In Progress": "in_progress",
    "Pending Employee": "on_hold",
    "Escalated": "in_progress",
    "Resolved": "resolved",
    "Closed": "closed",
    "Reopened": "open",
};

export const UI_STATUS_MAP: Record<string, Ticket["status"]> = {
    open: "Open",
    in_progress: "In Progress",
    on_hold: "Pending Employee",
    resolved: "Resolved",
    closed: "Closed",
    cancelled: "Closed",
};

export const BACKEND_PRIORITY_MAP: Record<Ticket["priority"], string> = {
    Low: "low",
    Medium: "medium",
    High: "high",
    Urgent: "urgent",
};

export const UI_PRIORITY_MAP: Record<string, Ticket["priority"]> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
};

const CATEGORY_TO_MODULE: Record<string, string> = {
    "IT Support": "other",
    "Payroll": "invoice",
    "Facility": "firm",
    "HR Ops": "user",
    "Policies": "user",
    "Leave": "user",
    "Admin": "other",
    "Finance": "invoice"
};

const MODULE_TO_CATEGORY: Record<string, string> = {
    other: "IT Support",
    invoice: "Payroll",
    firm: "Facility",
    user: "HR Ops",
    lead: "HR Ops",
    client: "HR Ops",
    project: "HR Ops"
};

const CATEGORY_TO_TYPE: Record<string, string> = {
    "IT Support": "incident",
    "Payroll": "question",
    "Facility": "task",
    "HR Ops": "task",
    "Policies": "question",
    "Leave": "task"
};

const hoursForPriority = (p: Ticket["priority"]): number =>
    p === "Urgent" ? 4 : p === "High" ? 24 : p === "Medium" ? 48 : 96;

// ==================== Mappers ====================

export interface BackendTicket {
    _id: string;
    ticketNumber?: string;
    title?: string;
    description?: string;
    module?: string;
    type?: string;
    status?: string;
    priority?: string;
    tags?: string[];
    requester?: any;
    assignee?: any;
    createdBy?: any;
    organization?: any;
    createdAt?: string;
    updatedAt?: string;
    dueDate?: string;
}

const formatName = (u?: any, fallback = "Employee"): string => {
    if (!u) return fallback;
    if (typeof u === "string") return fallback;
    const fn = u.firstName || "";
    const ln = u.lastName || "";
    const name = `${fn} ${ln}`.trim();
    return name || u.email || fallback;
};

const extractId = (u?: any, fallback = ""): string => {
    if (!u) return fallback;
    if (typeof u === "string") return u;
    return String(u._id || u.id || fallback);
};

export const mapBackendTicketToUI = (t: BackendTicket): Ticket => {
    const createdAt = t.createdAt ?? new Date().toISOString();
    const sla = new Date(createdAt);
    const uiPriority = UI_PRIORITY_MAP[String(t.priority ?? "").toLowerCase()] ?? "Medium";
    sla.setHours(sla.getHours() + hoursForPriority(uiPriority));

    const slaDeadlineTs = sla.getTime();
    const now = Date.now();
    const status = UI_STATUS_MAP[String(t.status ?? "").toLowerCase()] ?? "Open";
    const isOpen = status !== "Resolved" && status !== "Closed";

    let slaStatus: Ticket["slaStatus"] = "Healthy";
    if (isOpen) {
        if (slaDeadlineTs < now) slaStatus = "Breached";
        else if (slaDeadlineTs - now < 2 * 3600000) slaStatus = "Warning";
    }

    return {
        id: String(t._id),
        subject: t.title ?? "Untitled",
        description: t.description ?? "",
        category: MODULE_TO_CATEGORY[String(t.module ?? "")] ?? "HR Ops",
        subCategory: t.type ?? "General",
        priority: uiPriority,
        status,
        requestedBy: {
            id: extractId(t.requester, "EMP-UNKNOWN"),
            name: formatName(t.requester, "Employee"),
            department: "Unknown"
        },
        assignedTo: t.assignee ? {
            id: extractId(t.assignee),
            name: formatName(t.assignee, "Assigned Agent")
        } : undefined,
        createdAt,
        updatedAt: t.updatedAt ?? createdAt,
        slaDeadline: sla.toISOString(),
        slaStatus,
        attachments: [],
        history: [],
        responses: []
    };
};

// ==================== API Calls ====================

export interface CreateTicketPayload {
    subject: string;
    description: string;
    category: string;
    priority: Ticket["priority"];
    tags?: string[];
}

export const helpdeskApi = {
    // Fetch all tickets (admin / support queue)
    fetchAllTickets: async (params?: { page?: number; limit?: number; status?: string; priority?: string }): Promise<Ticket[]> => {
        const res = await axiosInstance.get("/platform/ticket/all", { params });
        const rows = res?.data?.tickets ?? [];
        return Array.isArray(rows) ? rows.map(mapBackendTicketToUI) : [];
    },

    // Fetch my tickets (employee view)
    fetchMyTickets: async (): Promise<Ticket[]> => {
        const res = await axiosInstance.get("/platform/ticket/");
        const list = Array.isArray(res?.data) ? res.data : [];
        return list.map(mapBackendTicketToUI);
    },

    // Create ticket
    createTicket: async (payload: CreateTicketPayload): Promise<Ticket> => {
        const body = {
            module: CATEGORY_TO_MODULE[payload.category] || "other",
            title: payload.subject,
            description: payload.description,
            type: CATEGORY_TO_TYPE[payload.category] || "task",
            priority: BACKEND_PRIORITY_MAP[payload.priority] || "medium",
            status: "open",
            tags: payload.tags || []
        };
        await axiosInstance.post("/platform/ticket/create", body);
        // Backend doesn't return the created ticket — refetch to get latest
        const myTickets = await helpdeskApi.fetchMyTickets();
        return myTickets[0];
    },

    // Update ticket status (only field backend supports updating)
    updateStatus: async (id: string, status: Ticket["status"]): Promise<void> => {
        await axiosInstance.post(`/platform/ticket/update/${id}`, {
            status: BACKEND_STATUS_MAP[status]
        });
    },

    // Assign agent
    assignAgent: async (ticketId: string, agentId: string): Promise<void> => {
        await axiosInstance.patch(`/platform/ticket/${ticketId}/assign`, {
            assignedTo: agentId
        });
    },

    // Delete ticket
    deleteTicket: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/platform/ticket/${id}/delete`);
    },

    // Fetch org users for agent picker
    fetchOrgUsers: async (): Promise<Array<{ id: string; name: string; email: string; role: string }>> => {
        try {
            const res = await axiosInstance.get("/organization/users/all", { params: { limit: 100 } });
            const list = res?.data?.users ?? res?.data ?? [];
            if (!Array.isArray(list)) return [];
            return list.map((m: any) => ({
                id: String(m?.userId?._id || m?._id || m?.id || ""),
                name: m?.userId ? formatName(m.userId) : formatName(m),
                email: m?.userId?.email || m?.email || "",
                role: m?.role?.role || m?.role || "Agent"
            })).filter(u => u.id);
        } catch {
            return [];
        }
    }
};
