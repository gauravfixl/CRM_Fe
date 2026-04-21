/**
 * Lightweight inline form validation helpers for My Team forms.
 * Returns an errors object keyed by field name. Empty object = valid.
 */

export type ValidationErrors = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;
const TIME_REGEX = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$|^([01]?\d|2[0-3]):[0-5]\d$/i;

export const validateRequired = (value: string | undefined | null, field: string): string | null => {
    if (!value || String(value).trim().length === 0) return `${field} is required`;
    return null;
};

export const validateMinLength = (value: string, min: number, field: string): string | null => {
    if (!value || value.trim().length < min) return `${field} must be at least ${min} characters`;
    return null;
};

export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
    return null;
};

export const validatePhone = (phone: string, required = false): string | null => {
    if (!phone) return required ? "Phone is required" : null;
    if (!PHONE_REGEX.test(phone)) return "Please enter a valid phone number";
    return null;
};

export const validateDateRange = (start: string, end: string): string | null => {
    if (!start) return "Start date is required";
    if (!end) return "End date is required";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "Invalid date";
    if (e < s) return "End date cannot be before start date";
    return null;
};

export const validateFutureOrToday = (dateStr: string): string | null => {
    if (!dateStr) return "Date is required";
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return "Date cannot be in the past";
    return null;
};

export const validateTimeHHMM = (time: string, required = false): string | null => {
    if (!time) return required ? "Time is required" : null;
    if (!TIME_REGEX.test(time)) return "Use format HH:MM (e.g. 09:00 AM or 14:30)";
    return null;
};

/**
 * Validate a Team Member form payload.
 */
export interface MemberFormData {
    name: string;
    email: string;
    phone?: string;
    designation?: string;
    department?: string;
}

export const validateMemberForm = (form: MemberFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const nameErr = validateRequired(form.name, "Name") || validateMinLength(form.name, 2, "Name");
    if (nameErr) errors.name = nameErr;

    const emailErr = validateEmail(form.email);
    if (emailErr) errors.email = emailErr;

    if (form.phone) {
        const phoneErr = validatePhone(form.phone);
        if (phoneErr) errors.phone = phoneErr;
    }

    if (form.designation !== undefined && form.designation !== "") {
        const desErr = validateMinLength(form.designation, 2, "Designation");
        if (desErr) errors.designation = desErr;
    }

    return errors;
};

/**
 * Validate a Leave Request form.
 */
export interface LeaveFormData {
    empId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export const validateLeaveForm = (form: LeaveFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!form.empId) errors.empId = "Please select an employee";
    if (!form.type) errors.type = "Leave type is required";

    const dateErr = validateDateRange(form.startDate, form.endDate);
    if (dateErr) {
        if (dateErr.includes("Start")) errors.startDate = dateErr;
        else errors.endDate = dateErr;
    }

    const reasonErr = validateRequired(form.reason, "Reason") || validateMinLength(form.reason, 10, "Reason");
    if (reasonErr) errors.reason = reasonErr;

    return errors;
};

/**
 * Validate Attendance Correction form.
 */
export interface AttendanceCorrectionForm {
    status: string;
    checkIn?: string;
    checkOut?: string;
}

export const validateCorrectionForm = (form: AttendanceCorrectionForm): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!form.status) errors.status = "Status is required";

    if (form.status === "Present") {
        if (form.checkIn && form.checkIn !== "--:--") {
            const ciErr = validateTimeHHMM(form.checkIn);
            if (ciErr) errors.checkIn = ciErr;
        }
        if (form.checkOut && form.checkOut !== "--:--") {
            const coErr = validateTimeHHMM(form.checkOut);
            if (coErr) errors.checkOut = coErr;
        }
    }

    return errors;
};

/**
 * Validate Performance Review form.
 */
export interface ReviewFormData {
    rating: string;
    feedback: string;
}

export const validateReviewForm = (form: ReviewFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!form.rating) errors.rating = "Rating is required";

    const fbErr = validateRequired(form.feedback, "Feedback") || validateMinLength(form.feedback, 20, "Feedback");
    if (fbErr) errors.feedback = fbErr;

    return errors;
};

/**
 * Validate Performance Goal form.
 */
export interface GoalFormData {
    heading: string;
    period: string;
    priority: string;
}

export const validateGoalForm = (form: GoalFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const hErr = validateRequired(form.heading, "Goal heading") || validateMinLength(form.heading, 5, "Goal heading");
    if (hErr) errors.heading = hErr;
    if (!form.period) errors.period = "Target period is required";
    if (!form.priority) errors.priority = "Priority is required";
    return errors;
};

/**
 * Validate Calendar Event form.
 */
export interface EventFormData {
    title: string;
    date: string;
    time?: string;
    location?: string;
    type: string;
}

export const validateEventForm = (form: EventFormData): ValidationErrors => {
    const errors: ValidationErrors = {};
    const tErr = validateRequired(form.title, "Title") || validateMinLength(form.title, 2, "Title");
    if (tErr) errors.title = tErr;

    const dErr = validateRequired(form.date, "Date");
    if (dErr) errors.date = dErr;
    else if (isNaN(new Date(form.date).getTime())) errors.date = "Invalid date";

    if (!form.type) errors.type = "Event type is required";

    return errors;
};
