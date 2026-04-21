import { axiosInstance as axios } from "@/lib/axios";

/* ============================================================
   Backend API service for HRM Settings section.
   Mirrors the 9 pages under /hrmcubicle/admin/*
   ============================================================ */

/* ---------- Shared types ---------- */

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/* ============================================================
   1. ATTENDANCE — Shifts / Policy / Holidays  (FULL backend)
   ============================================================ */

export interface ApiShift {
    _id: string;
    organizationId: string;
    shiftType: "morning" | "noon" | "night";
    startTime: string;
    endTime: string;
    breakMinutes: number;
    graceInMinutes: number;
    graceOutMinutes: number;
    halfDayAfterMinutes: number;
    overtimeAfterMinutes: number;
    isNightShift: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const shiftsApi = {
    list: () => axios.get<ApiResponse<ApiShift[]>>("/attendance/shifts/active").then(r => r.data),
    get: (id: string) => axios.get<ApiResponse<ApiShift>>(`/attendance/shifts/${id}`).then(r => r.data),
    create: (payload: Partial<ApiShift>) =>
        axios.post<ApiResponse<ApiShift>>("/attendance/shifts/", payload).then(r => r.data),
    update: (id: string, payload: Partial<ApiShift>) =>
        axios.patch<ApiResponse<ApiShift>>(`/attendance/shifts/${id}`, payload).then(r => r.data),
    remove: (id: string) =>
        axios.delete<ApiResponse<void>>(`/attendance/shifts/${id}`).then(r => r.data),
};

export interface ApiAttendancePolicy {
    _id?: string;
    organizationId?: string;
    lateAllowedMinutes: number;
    halfDayThresholdMinutes: number;
    absentThresholdMinutes: number;
    overtimeMinMinutes: number;
    allowEarlyPunch: boolean;
    allowLatePunch: boolean;
    sandwichLeaveRule: boolean;
    allowBackdatedRegularization: boolean;
    maxBackdateDays: number;
    isActive?: boolean;
    effectiveFrom?: string;
}

export const attendancePolicyApi = {
    getActive: () =>
        axios.get<ApiResponse<ApiAttendancePolicy | null>>("/attendance/policy/active").then(r => r.data),
    upsert: (payload: Partial<ApiAttendancePolicy>) =>
        axios.post<ApiResponse<ApiAttendancePolicy>>("/attendance/policy/", payload).then(r => r.data),
};

export interface ApiHoliday {
    _id: string;
    organizationId: string;
    date: string;
    name: string;
    type: "National" | "Optional";
    isPaid: boolean;
    isMandatory: boolean;
    isActive: boolean;
    locationId?: string;
}

export const holidaysApi = {
    list: (year: number) =>
        axios.get<ApiResponse<ApiHoliday[]>>(`/attendance/holidays/?year=${year}`).then(r => r.data),
    get: (id: string) =>
        axios.get<ApiResponse<ApiHoliday>>(`/attendance/holidays/${id}`).then(r => r.data),
    create: (payload: Partial<ApiHoliday>) =>
        axios.post<ApiResponse<ApiHoliday>>("/attendance/holidays/", payload).then(r => r.data),
    update: (id: string, payload: Partial<ApiHoliday>) =>
        axios.patch<ApiResponse<ApiHoliday>>(`/attendance/holidays/${id}`, payload).then(r => r.data),
    remove: (id: string) =>
        axios.delete<ApiResponse<void>>(`/attendance/holidays/${id}`).then(r => r.data),
};

/* ============================================================
   2. ROLES & PERMISSIONS  (PARTIAL backend)
   ============================================================ */

export interface ApiRolePermission {
    _id: string;
    role: string;
    name: string;
    scope?: string;
    permissions: { module: string; actions: string[] }[];
    isCustom: boolean;
    isActive?: boolean;
    orgId?: string;
    workspaceId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const rolesApi = {
    list: () => axios.get<ApiResponse<ApiRolePermission[]>>("/role/all").then(r => r.data),
    listNames: () => axios.get<ApiResponse<{ _id: string; name: string }[]>>("/role/list").then(r => r.data),
    create: (payload: {
        role: string;
        name: string;
        workspaceId?: string;
        permissions: { module: string; actions: string[] }[];
    }) => axios.post<ApiResponse<ApiRolePermission>>("/role/create", payload).then(r => r.data),
    update: (id: string, payload: Partial<ApiRolePermission>) =>
        axios.patch<ApiResponse<ApiRolePermission>>(`/role/${id}`, payload).then(r => r.data),
    remove: (id: string) =>
        axios.delete<ApiResponse<void>>(`/role/${id}`).then(r => r.data),
};

/* ============================================================
   3. AUTOMATION RULES  (PARTIAL backend via /api/org-admin)
   ============================================================ */

export interface ApiAutomationRule {
    _id: string;
    name: string;
    description?: string;
    module: string;
    trigger: { event: string; source: string };
    conditions?: Record<string, unknown>;
    actions: Array<Record<string, unknown>>;
    enabled: boolean;
    lastExecutedAt?: string;
    executionCount?: number;
    createdAt: string;
}

export const automationRulesApi = {
    list: (params?: { module?: string; enabled?: boolean; page?: number; limit?: number }) =>
        axios.get<ApiResponse<ApiAutomationRule[]>>("/org-admin/automation-rules", { params }).then(r => r.data),
    create: (payload: Partial<ApiAutomationRule>) =>
        axios.post<ApiResponse<ApiAutomationRule>>("/org-admin/automation-rules", payload).then(r => r.data),
    update: (id: string, payload: Partial<ApiAutomationRule>) =>
        axios.patch<ApiResponse<ApiAutomationRule>>(`/org-admin/automation-rules/${id}`, payload).then(r => r.data),
    remove: (id: string) =>
        axios.delete<ApiResponse<void>>(`/org-admin/automation-rules/${id}`).then(r => r.data),
    execute: (id: string) =>
        axios.post<ApiResponse<{ executed: true }>>(`/org-admin/automation-rules/${id}/execute`).then(r => r.data),
};

/* ============================================================
   4. INTEGRATIONS — Webhooks + API Keys (PARTIAL via /api/org-admin)
   ============================================================ */

export interface ApiWebhook {
    _id: string;
    name: string;
    endpoint: string;
    events: string[];
    secret?: string;
    active: boolean;
    retryPolicy?: Record<string, unknown>;
    lastTriggeredAt?: string;
}

export const webhooksApi = {
    list: () => axios.get<ApiResponse<ApiWebhook[]>>("/org-admin/integrations/webhooks").then(r => r.data),
    create: (payload: { name: string; endpoint: string; events: string[]; active?: boolean }) =>
        axios.post<ApiResponse<ApiWebhook>>("/org-admin/integrations/webhooks", payload).then(r => r.data),
    update: (id: string, payload: Partial<ApiWebhook>) =>
        axios.patch<ApiResponse<ApiWebhook>>(`/org-admin/integrations/webhooks/${id}`, payload).then(r => r.data),
    remove: (id: string) =>
        axios.delete<ApiResponse<void>>(`/org-admin/integrations/webhooks/${id}`).then(r => r.data),
};

export interface ApiKey {
    _id: string;
    name: string;
    keyPrefix?: string;
    keyHash?: string;
    key?: string; // returned only on create
    active: boolean;
    lastUsedAt?: string;
    createdAt: string;
}

export const apiKeysApi = {
    list: () => axios.get<ApiResponse<ApiKey[]>>("/org-admin/integrations/api-keys").then(r => r.data),
    create: (payload: { name: string }) =>
        axios.post<ApiResponse<ApiKey>>("/org-admin/integrations/api-keys", payload).then(r => r.data),
    revoke: (id: string) =>
        axios.post<ApiResponse<void>>(`/org-admin/integrations/api-keys/${id}/revoke`).then(r => r.data),
};

/* ============================================================
   5. PAYROLL — Salary Components + Statutory Settings
   ============================================================ */

export interface ApiSalaryComponent {
    _id: string;
    organizationId: string;
    name: string;
    type: "Earning" | "Deduction";
    amountType: "Fixed" | "Percentage of Basic";
    value: number;
    isTaxable: boolean;
    isStatutory: boolean;
    sequence: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const salaryComponentsApi = {
    list: (params?: { type?: "Earning" | "Deduction"; isActive?: boolean }) =>
        axios.get<ApiResponse<ApiSalaryComponent[]>>("/hrm/payroll/salary-components/", { params }).then(r => r.data),
    create: (payload: Partial<ApiSalaryComponent>) =>
        axios.post<ApiResponse<ApiSalaryComponent>>("/hrm/payroll/salary-components/", payload).then(r => r.data),
    update: (id: string, payload: Partial<ApiSalaryComponent>) =>
        axios.patch<ApiResponse<ApiSalaryComponent>>(`/hrm/payroll/salary-components/${id}`, payload).then(r => r.data),
    remove: (id: string) =>
        axios.delete<ApiResponse<void>>(`/hrm/payroll/salary-components/${id}`).then(r => r.data),
};

export interface ApiStatutorySettings {
    _id?: string;
    organizationId?: string;
    pfEnabled: boolean;
    pfRate: number;
    esiEnabled: boolean;
    esiRate: number;
    tdsEnabled: boolean;
    ptEnabled: boolean;
    payFrequency: "Monthly" | "Bi-weekly" | "Weekly";
    payDay: number;
    cutoffDay: number;
}

export const statutorySettingsApi = {
    get: () =>
        axios.get<ApiResponse<ApiStatutorySettings>>("/hrm/payroll/salary-components/settings/statutory").then(r => r.data),
    update: (payload: Partial<ApiStatutorySettings>) =>
        axios.patch<ApiResponse<ApiStatutorySettings>>("/hrm/payroll/salary-components/settings/statutory", payload).then(r => r.data),
};

/* ============================================================
   6. AUDIT LOGS  (PARTIAL — read-only + export)
   ============================================================ */

export interface ApiAuditLog {
    _id: string;
    organizationId: string;
    actorId?: { _id: string; firstName?: string; lastName?: string; email?: string } | string;
    actorRole: "Employee" | "Manager" | "Admin";
    entityType: string;
    entityId: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "OVERRIDE" | "LOCK" | "UNLOCK" | "APPROVE" | "REJECT";
    message?: string;
    before?: unknown;
    after?: unknown;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface AuditLogFilters {
    entityType?: string;
    action?: string;
    actorId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const auditLogsApi = {
    list: (filters?: AuditLogFilters) =>
        axios.get<ApiResponse<ApiAuditLog[]>>("/hrm/audit-logs", { params: filters }).then(r => r.data),
    get: (id: string) =>
        axios.get<ApiResponse<ApiAuditLog>>(`/hrm/audit-logs/${id}`).then(r => r.data),
    summary: () =>
        axios.get<ApiResponse<{ total: number; last24h: number; last7d: number; byEntity: any[]; byAction: any[] }>>(
            "/hrm/audit-logs/summary"
        ).then(r => r.data),
    exportCsv: (filters?: Omit<AuditLogFilters, "page" | "limit">) =>
        axios.get("/hrm/audit-logs/export", { params: filters, responseType: "blob" }).then(r => r.data as Blob),
};

/* ============================================================
   Helper — uniform error message extraction
   ============================================================ */
export const extractApiError = (err: unknown, fallback = "Something went wrong"): string => {
    if (err && typeof err === "object") {
        const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
        return e.response?.data?.message || e.response?.data?.error || e.message || fallback;
    }
    return fallback;
};
