/**
 * Thin API wrappers for the OrgAdmin Settings pages.
 * Each function returns the raw axios response (consistent with existing hooks).
 *
 * Backend coverage:
 * ✅ General Preferences / Localization → /api/org-admin/settings (timezone, locale, language, currency, region, branding)
 * ✅ Email Templates → branding.emailTemplates (limited: invoice/reminder/welcome only)
 * ✅ My Account → Profile → /api/auth/getprofile + /api/auth/updateUser/:id
 * ✅ My Account → Sessions → /api/session/all + send-otp + delete (OTP flow)
 * ✅ My Account → Password change → /api/auth/forgot (email link flow)
 * ✅ My Account → 2FA → /api/auth/generate-2fa-qr + verify-2fa-setup
 * ✅ System Tools → Force Backup → /api/org-admin/data-management/backups
 *
 * Not covered by existing backend (skipped):
 * - Localization → fiscal year, working days, currency formats, holidays (HRM-scoped, different schema)
 * - Document Templates (only 3 fixed branding slots, no CRUD)
 * - Communication Gateways (no SMTP/SMS/WhatsApp config models)
 * - Custom Fields & Tags (no models)
 * - Numbering Schemes (no model)
 * - System Tools other actions: clear cache / reindex / health check / audit export / purge trash
 */

import { axiosInstance as axios } from "@/lib/axios"

// -------------------- Org Admin Settings --------------------
export const fetchOrgAdminSettings = () => axios.get("/org-admin/settings")
export const patchOrgAdminSettings = (payload: Record<string, any>) =>
    axios.patch("/org-admin/settings", payload)

// -------------------- User Profile --------------------
export const fetchCurrentUser = () => axios.get("/auth/getprofile")
export const patchUser = (id: string, payload: Record<string, any>) =>
    axios.patch(`/auth/updateUser/${id}`, payload)
export const patchProfileImage = (formData: FormData) =>
    axios.patch("/auth/updateProfilephoto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })

// -------------------- Sessions --------------------
export const fetchSessions = () => axios.get("/session/all")
export const sendSessionDeleteOtp = () => axios.post("/session/send-otp")
export const deleteSession = (sessionId: string, otp: string) =>
    axios.delete("/session/delete", { data: { sessionId, otp } })

// -------------------- Password (forgot/reset flow) --------------------
export const requestPasswordReset = (email: string) =>
    axios.post("/auth/forgot", { email })

// -------------------- 2FA --------------------
export const generate2faQr = () => axios.post("/auth/generate-2fa-qr")
export const verify2faSetup = (otp: string) =>
    axios.post("/auth/verify-2fa-setup", { otp })

// -------------------- Backup (System Tools) --------------------
export const triggerBackup = (notes?: string) =>
    axios.post("/org-admin/data-management/backups", {
        backupType: "manual",
        snapshotRef: `manual-${Date.now()}`,
        includedModules: ["all"],
        notes: notes ?? "Manual backup triggered from System Tools",
    })

export const fetchBackupHistory = () =>
    axios.get("/org-admin/data-management/backups")

// -------------------- Helper: shape adapter --------------------
/**
 * Maps the OrgAdmin store snapshot (frontend) to the backend
 * /org-admin/settings PATCH payload shape.
 */
export const buildOrgSettingsPayload = (params: {
    timezone?: string
    language?: string
    currency?: string
    secondaryCurrency?: string
    locale?: string
    region?: string
    emailTemplates?: { invoice?: string; reminder?: string; welcome?: string }
}) => {
    const payload: Record<string, any> = {}
    if (params.timezone) payload.timezone = params.timezone
    if (params.language) payload.language = params.language
    if (params.currency) payload.currency = params.currency
    if (params.locale) payload.locale = params.locale
    if (params.region) payload.region = params.region
    if (params.emailTemplates) {
        payload.branding = { emailTemplates: params.emailTemplates }
    }
    return payload
}

/**
 * Maps the backend /org-admin/settings GET response back into
 * the relevant slices of the frontend admin-settings store.
 */
export const parseOrgSettingsResponse = (data: any) => {
    if (!data) return null
    return {
        timezone: data.timezone as string | undefined,
        language: data.language as string | undefined,
        locale: data.locale as string | undefined,
        currency: data.currency as string | undefined,
        region: data.region as string | undefined,
        emailTemplates: data.branding?.emailTemplates as
            | { invoice?: string; reminder?: string; welcome?: string }
            | undefined,
    }
}
