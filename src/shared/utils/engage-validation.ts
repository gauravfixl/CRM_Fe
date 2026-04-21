// Shared validation utilities for the Engage section forms.
// Keep logic pure: return first error message or null (null = valid).

export type ValidationError = { field: string; message: string } | null;

const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

export const required = (value: unknown, field: string, label?: string): ValidationError => {
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
        return { field, message: `${label ?? field} is required.` };
    }
    return null;
};

export const minLength = (value: string, n: number, field: string, label?: string): ValidationError => {
    if (typeof value !== "string" || value.trim().length < n) {
        return { field, message: `${label ?? field} must be at least ${n} characters.` };
    }
    return null;
};

export const maxLength = (value: string, n: number, field: string, label?: string): ValidationError => {
    if (typeof value === "string" && value.length > n) {
        return { field, message: `${label ?? field} must be at most ${n} characters.` };
    }
    return null;
};

export const rangeNumber = (value: number, min: number, max: number, field: string, label?: string): ValidationError => {
    if (typeof value !== "number" || isNaN(value) || value < min || value > max) {
        return { field, message: `${label ?? field} must be between ${min} and ${max}.` };
    }
    return null;
};

export const isFutureOrToday = (dateStr: string, field: string, label?: string): ValidationError => {
    if (!dateStr) return { field, message: `${label ?? field} is required.` };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { field, message: `${label ?? field} is invalid.` };
    if (d < startOfToday()) return { field, message: `${label ?? field} must be today or a future date.` };
    return null;
};

export const isValidDate = (dateStr: string, field: string, label?: string): ValidationError => {
    if (!dateStr) return { field, message: `${label ?? field} is required.` };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { field, message: `${label ?? field} is invalid.` };
    return null;
};

export const hasPlaceholder = (value: string, placeholder: string, field: string, label?: string): ValidationError => {
    if (!value.includes(placeholder)) {
        return { field, message: `${label ?? field} must include ${placeholder}.` };
    }
    return null;
};

// Run validators in order, return first error
export const runValidators = (...validators: ValidationError[]): ValidationError => {
    for (const v of validators) {
        if (v) return v;
    }
    return null;
};
