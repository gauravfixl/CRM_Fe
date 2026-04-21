/**
 * Form validators for the HRM Settings section.
 * Each validator returns an object with field => error-message entries;
 * an empty object means the form is valid.
 */

export type ValidationErrors = Record<string, string>;

const isBlank = (v: unknown) =>
    v === undefined || v === null || (typeof v === "string" && v.trim().length === 0);

const isUrl = (v: string) => {
    try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

const HH_MM_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/* ---------- Shifts ---------- */

export const validateShift = (s: {
    name?: string;
    shiftType?: string;
    startTime?: string;
    endTime?: string;
    workingHours?: number;
    breakDuration?: number;
    applicableDays?: number[];
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(s.name)) errs.name = "Shift name is required";
    else if ((s.name as string).length < 2) errs.name = "Shift name must be at least 2 characters";

    if (isBlank(s.startTime) || !HH_MM_RE.test(s.startTime!)) errs.startTime = "Valid start time (HH:MM) is required";
    if (isBlank(s.endTime) || !HH_MM_RE.test(s.endTime!)) errs.endTime = "Valid end time (HH:MM) is required";

    if (s.workingHours !== undefined && (s.workingHours <= 0 || s.workingHours > 24))
        errs.workingHours = "Working hours must be between 0 and 24";
    if (s.breakDuration !== undefined && (s.breakDuration < 0 || s.breakDuration > 480))
        errs.breakDuration = "Break must be between 0 and 480 minutes";

    if (!s.applicableDays || s.applicableDays.length === 0)
        errs.applicableDays = "Select at least one applicable day";
    return errs;
};

/* ---------- Attendance Rules ---------- */

export const validateAttendanceRule = (r: {
    name?: string;
    type?: string;
    config?: { gracePeriodMinutes?: number; lateMarkAfterMinutes?: number; overtimeMultiplier?: number };
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(r.name)) errs.name = "Rule name is required";
    if (!r.type) errs.type = "Rule type is required";

    if (r.type === "Grace Period") {
        const g = r.config?.gracePeriodMinutes;
        if (g === undefined || g < 0 || g > 120)
            errs.gracePeriodMinutes = "Grace period must be between 0 and 120 minutes";
    }
    if (r.type === "Late Mark") {
        const l = r.config?.lateMarkAfterMinutes;
        if (l === undefined || l < 0 || l > 240)
            errs.lateMarkAfterMinutes = "Late mark threshold must be between 0 and 240 minutes";
    }
    if (r.type === "Overtime") {
        const m = r.config?.overtimeMultiplier;
        if (m === undefined || m <= 0 || m > 10)
            errs.overtimeMultiplier = "Multiplier must be between 0 and 10";
    }
    return errs;
};

/* ---------- Holidays ---------- */

export const validateHoliday = (h: { name?: string; date?: string; type?: string }): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(h.name)) errs.name = "Holiday name is required";
    if (isBlank(h.date)) errs.date = "Date is required";
    else if (Number.isNaN(Date.parse(h.date!))) errs.date = "Invalid date";
    if (!h.type) errs.type = "Holiday type is required";
    return errs;
};

/* ---------- Salary Component ---------- */

export const validateSalaryComponent = (c: {
    name?: string;
    type?: string;
    amountType?: string;
    value?: number;
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(c.name)) errs.name = "Component name is required";
    else if ((c.name as string).length < 2) errs.name = "Name must be at least 2 characters";
    if (!c.type) errs.type = "Type is required";
    if (!c.amountType) errs.amountType = "Amount type is required";
    if (c.value === undefined || Number.isNaN(c.value)) errs.value = "Value is required";
    else if (c.value < 0) errs.value = "Value cannot be negative";
    else if (c.amountType === "Percentage of Basic" && c.value > 100)
        errs.value = "Percentage cannot exceed 100";
    return errs;
};

/* ---------- Statutory Settings ---------- */

export const validateStatutorySettings = (s: {
    pfRate?: number;
    esiRate?: number;
    payDay?: number;
    cutoffDay?: number;
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (s.pfRate !== undefined && (s.pfRate < 0 || s.pfRate > 100)) errs.pfRate = "PF rate must be 0–100%";
    if (s.esiRate !== undefined && (s.esiRate < 0 || s.esiRate > 100)) errs.esiRate = "ESI rate must be 0–100%";
    if (s.payDay !== undefined && (s.payDay < 1 || s.payDay > 31)) errs.payDay = "Pay day must be 1–31";
    if (s.cutoffDay !== undefined && (s.cutoffDay < 1 || s.cutoffDay > 31)) errs.cutoffDay = "Cutoff day must be 1–31";
    return errs;
};

/* ---------- Role ---------- */

export const validateRole = (r: {
    name?: string;
    role?: string;
    permissions?: { module: string; actions: string[] }[];
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(r.name)) errs.name = "Role name is required";
    else if ((r.name as string).length < 2) errs.name = "Role name must be at least 2 characters";
    if (isBlank(r.role)) errs.role = "Role type is required";
    if (!r.permissions || r.permissions.length === 0)
        errs.permissions = "At least one permission is required";
    return errs;
};

/* ---------- Automation Rule ---------- */

export const validateAutomationRule = (r: {
    name?: string;
    trigger?: string | { event?: string };
    action?: string;
    category?: string;
    module?: string;
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(r.name)) errs.name = "Rule name is required";
    else if ((r.name as string).length < 3) errs.name = "Name must be at least 3 characters";

    const triggerValue = typeof r.trigger === "string" ? r.trigger : r.trigger?.event;
    if (isBlank(triggerValue)) errs.trigger = "Trigger condition is required";

    if (isBlank(r.action)) errs.action = "Action is required";
    if (isBlank(r.category) && isBlank(r.module)) errs.category = "Category is required";
    return errs;
};

/* ---------- Webhook ---------- */

export const validateWebhook = (w: { url?: string; endpoint?: string; events?: string[]; name?: string }): ValidationErrors => {
    const errs: ValidationErrors = {};
    const url = w.url || w.endpoint;
    if (isBlank(url)) errs.url = "Endpoint URL is required";
    else if (!isUrl(url!)) errs.url = "Endpoint must be a valid http(s) URL";

    if (!w.events || w.events.filter(e => e && e.trim()).length === 0)
        errs.events = "Subscribe to at least one event";
    return errs;
};

/* ---------- API Key ---------- */

export const validateApiKey = (k: { name?: string }): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(k.name)) errs.name = "Key label is required";
    else if ((k.name as string).length < 3) errs.name = "Key label must be at least 3 characters";
    return errs;
};

/* ---------- Integration App ---------- */

export const validateIntegration = (i: { name?: string; category?: string }): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(i.name)) errs.name = "App name is required";
    if (isBlank(i.category)) errs.category = "Category is required";
    return errs;
};

/* ---------- Delegation ---------- */

export const validateDelegation = (d: {
    delegator?: string;
    delegate?: string;
    module?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(d.delegator)) errs.delegator = "Delegator is required";
    if (isBlank(d.delegate)) errs.delegate = "Delegate is required";
    if (d.delegator && d.delegate && d.delegator === d.delegate)
        errs.delegate = "Delegator and delegate must be different";
    if (!d.module) errs.module = "Module is required";
    if (isBlank(d.startDate)) errs.startDate = "Start date is required";
    if (isBlank(d.endDate)) errs.endDate = "End date is required";
    if (d.startDate && d.endDate && Date.parse(d.startDate) > Date.parse(d.endDate))
        errs.endDate = "End date must be after start date";
    if (isBlank(d.reason)) errs.reason = "Reason is required";
    else if ((d.reason as string).length < 10) errs.reason = "Reason must be at least 10 characters";
    return errs;
};

/* ---------- Escalation Rule ---------- */

export const validateEscalationRule = (r: {
    module?: string;
    triggerDays?: number;
    l1Escalatee?: string;
    l1Days?: number;
    l2Escalatee?: string;
    l2Days?: number;
    l3Escalatee?: string;
    l3Days?: number;
    notification?: string;
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (!r.module) errs.module = "Module is required";
    if (r.triggerDays === undefined || r.triggerDays < 1) errs.triggerDays = "Trigger must be at least 1 day";

    if (isBlank(r.l1Escalatee)) errs.l1Escalatee = "Level 1 escalatee is required";
    if (r.l1Days === undefined || r.l1Days < 1) errs.l1Days = "Level 1 delay must be ≥ 1 day";

    if (isBlank(r.l2Escalatee)) errs.l2Escalatee = "Level 2 escalatee is required";
    if (r.l2Days === undefined || r.l2Days < 1) errs.l2Days = "Level 2 delay must be ≥ 1 day";

    if (isBlank(r.l3Escalatee)) errs.l3Escalatee = "Level 3 escalatee is required";
    if (r.l3Days === undefined || r.l3Days < 1) errs.l3Days = "Level 3 delay must be ≥ 1 day";

    if (r.l1Days !== undefined && r.l2Days !== undefined && r.l2Days <= r.l1Days)
        errs.l2Days = "Level 2 delay must exceed Level 1";
    if (r.l2Days !== undefined && r.l3Days !== undefined && r.l3Days <= r.l2Days)
        errs.l3Days = "Level 3 delay must exceed Level 2";

    if (!r.notification) errs.notification = "Notification channel is required";
    return errs;
};

/* ---------- Approval Workflow ---------- */

export const validateApprovalFlow = (f: {
    name?: string;
    type?: string;
    levels?: { approverRole?: string }[];
}): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (isBlank(f.name)) errs.name = "Flow name is required";
    if (!f.type) errs.type = "Flow type is required";
    if (!f.levels || f.levels.length === 0) errs.levels = "At least one approval level is required";
    else if (f.levels.some(l => isBlank(l.approverRole)))
        errs.levels = "Every level must have an approver role";
    return errs;
};
