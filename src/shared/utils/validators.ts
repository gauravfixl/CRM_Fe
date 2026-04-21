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
