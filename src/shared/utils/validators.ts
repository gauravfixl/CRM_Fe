/**
 * Shared form validation helpers.
 * Each validator returns `null` when the input is valid, or a human-readable
 * error message when the input is invalid.
 */

export type ValidationErrors = Record<string, string>;

export const required = (value: unknown, label = "Field"): string | null => {
    if (value === null || value === undefined) return `${label} is required`;
    if (typeof value === "string" && !value.trim()) return `${label} is required`;
    if (Array.isArray(value) && value.length === 0) return `${label} is required`;
    return null;
};

export const minLength = (value: string, min: number, label = "Field"): string | null => {
    if (!value) return null;
    return value.trim().length < min ? `${label} must be at least ${min} characters` : null;
};

export const maxLength = (value: string, max: number, label = "Field"): string | null => {
    if (!value) return null;
    return value.trim().length > max ? `${label} must be at most ${max} characters` : null;
};

export const isEmail = (value: string, label = "Email"): string | null => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? null : `${label} is not a valid email address`;
};

export const isNumberInRange = (
    value: number | string,
    min: number,
    max: number,
    label = "Value"
): string | null => {
    const n = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(n)) return `${label} must be a number`;
    if (n < min || n > max) return `${label} must be between ${min} and ${max}`;
    return null;
};

export const isPositiveInt = (value: number | string, label = "Value"): string | null => {
    const n = typeof value === "string" ? parseInt(value, 10) : value;
    if (Number.isNaN(n) || n < 0 || !Number.isInteger(n)) {
        return `${label} must be a non-negative integer`;
    }
    return null;
};

export const isValidDate = (value: string, label = "Date"): string | null => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? `${label} is not a valid date` : null;
};

export const isFutureDate = (value: string, label = "Date"): string | null => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return `${label} is not a valid date`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today ? `${label} cannot be in the past` : null;
};

export const isAfter = (
    value: string,
    other: string,
    label = "Date",
    otherLabel = "start date"
): string | null => {
    if (!value || !other) return null;
    const a = new Date(value);
    const b = new Date(other);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    return a <= b ? `${label} must be after ${otherLabel}` : null;
};

/** Merge helper — returns the first non-null error, or null. */
export const firstError = (...results: Array<string | null>): string | null => {
    for (const r of results) if (r) return r;
    return null;
};

/** Strict positive integer (>= 1). */
export const isStrictPositiveInt = (value: number | string, label = "Value"): string | null => {
    const n = typeof value === "string" ? parseInt(value, 10) : value;
    if (Number.isNaN(n) || !Number.isInteger(n) || n < 1) {
        return `${label} must be a positive integer (1 or greater)`;
    }
    return null;
};

/** Employee-ID format: 3–20 alphanumeric / hyphen / underscore. */
export const isEmployeeId = (value: string, label = "Employee ID"): string | null => {
    if (!value) return null;
    return /^[A-Za-z0-9_-]{3,20}$/.test(value.trim())
        ? null
        : `${label} must be 3–20 letters, digits, _ or -`;
};

/** Semantic-version style "X.Y.Z". */
export const isSemver = (value: string, label = "Version"): string | null => {
    if (!value) return null;
    return /^\d+\.\d+\.\d+$/.test(value.trim())
        ? null
        : `${label} must follow the format X.Y.Z (e.g. 1.0.0)`;
};

/** Placeholder tag: starts with letter/underscore, then letters/digits/underscore. */
export const isPlaceholderTag = (value: string, label = "Placeholder"): string | null => {
    if (!value) return null;
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(value.trim())
        ? null
        : `${label} must start with a letter or underscore and contain only letters, digits, and underscores`;
};

/** Reject duplicate item (case-insensitive) in a list. */
export const isUnique = (
    value: string,
    existing: string[],
    label = "Value"
): string | null => {
    if (!value) return null;
    const v = value.trim().toLowerCase();
    return existing.some(e => e.trim().toLowerCase() === v)
        ? `${label} already exists`
        : null;
};

/** Optional date that, if provided, must not be in the past. */
export const isFutureOrToday = (value: string, label = "Date"): string | null => {
    return isFutureDate(value, label);
};

/** Indian mobile: 10 digits starting with 6-9. Accepts optional +91 prefix. */
export const isIndianMobile = (value: string, label = "Mobile number"): string | null => {
    if (!value) return null;
    const cleaned = value.replace(/\s+/g, "").replace(/^\+91/, "");
    return /^[6-9]\d{9}$/.test(cleaned)
        ? null
        : `${label} must be a valid 10-digit Indian mobile number`;
};

/** PAN card: ABCDE1234F format (5 letters + 4 digits + 1 letter). */
export const isPAN = (value: string, label = "PAN"): string | null => {
    if (!value) return null;
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.trim().toUpperCase())
        ? null
        : `${label} must be in format ABCDE1234F`;
};

/** IFSC code: 4 letters + 0 + 6 alphanumeric. */
export const isIFSC = (value: string, label = "IFSC"): string | null => {
    if (!value) return null;
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase())
        ? null
        : `${label} must be 11 characters in format ABCD0123456`;
};

/** Aadhar: exactly 12 digits. */
export const isAadhar = (value: string, label = "Aadhar"): string | null => {
    if (!value) return null;
    const cleaned = value.replace(/\s+/g, "");
    return /^\d{12}$/.test(cleaned) ? null : `${label} must be exactly 12 digits`;
};

/** Bank account number: 9-18 digits. */
export const isBankAccount = (value: string, label = "Account number"): string | null => {
    if (!value) return null;
    const cleaned = value.replace(/\s+/g, "");
    return /^\d{9,18}$/.test(cleaned)
        ? null
        : `${label} must be 9-18 digits`;
};

/** Date that must not be in the future (e.g., expense date, attendance date). */
export const isPastOrToday = (value: string, label = "Date"): string | null => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return `${label} is not a valid date`;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return d > today ? `${label} cannot be in the future` : null;
};

/** Date that must be within the last N days (e.g., expense claim cutoff). */
export const isWithinPastDays = (value: string, days: number, label = "Date"): string | null => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return `${label} is not a valid date`;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return d < cutoff ? `${label} cannot be older than ${days} days` : null;
};

/** File extension whitelist check. Pass lowercase without dots, e.g. ['pdf','jpg','png']. */
export const isValidFileType = (
    fileName: string,
    allowed: string[],
    label = "File"
): string | null => {
    if (!fileName) return null;
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext) return `${label} must have a valid extension`;
    return allowed.includes(ext)
        ? null
        : `${label} must be one of: ${allowed.map(e => "." + e).join(", ")}`;
};

/** File size check against bytes limit. Pass bytes (e.g., 10 * 1024 * 1024 for 10 MB). */
export const isValidFileSize = (
    sizeBytes: number,
    maxBytes: number,
    label = "File"
): string | null => {
    if (!sizeBytes) return null;
    if (sizeBytes > maxBytes) {
        const maxMB = (maxBytes / (1024 * 1024)).toFixed(1);
        return `${label} exceeds max size of ${maxMB} MB`;
    }
    return null;
};

/** Time in HH:MM format. */
export const isValidTime = (value: string, label = "Time"): string | null => {
    if (!value) return null;
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
        ? null
        : `${label} must be in HH:MM format`;
};

/** checkOut >= checkIn on same date. Both HH:MM. */
export const isTimeAfter = (
    checkOut: string,
    checkIn: string,
    label = "Check-out time",
    otherLabel = "check-in time"
): string | null => {
    if (!checkOut || !checkIn) return null;
    return checkOut <= checkIn ? `${label} must be after ${otherLabel}` : null;
};

/** Amount must be > 0 and optionally <= max. */
export const isValidAmount = (
    value: number | string,
    options: { min?: number; max?: number; label?: string } = {}
): string | null => {
    const { min = 0.01, max, label = "Amount" } = options;
    const n = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(n)) return `${label} must be a valid number`;
    if (n < min) return `${label} must be at least ₹${min}`;
    if (max !== undefined && n > max) return `${label} cannot exceed ₹${max.toLocaleString("en-IN")}`;
    return null;
};
