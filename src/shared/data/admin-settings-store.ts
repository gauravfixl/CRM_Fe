import { create } from "zustand"

// ---------- Types ----------
export interface GeneralPrefs {
    timezone: string
    language: string
    dateFormat: string
    timeFormat: string
    numberFormat: string
    firstDayOfWeek: string
    landingPage: string
    densityMode: "Comfortable" | "Compact"
}

export interface Localization {
    defaultCurrency: string
    secondaryCurrency: string
    fiscalYearStart: string
    workingDays: string[]
}

export interface Holiday {
    id: string
    holidayName: string
    holidayDate: string
    type: "Public" | "Optional" | "Restricted"
}

export interface EmailTemplate {
    id: string
    templateName: string
    code: string
    subject: string
    body: string
    category: "Onboarding" | "Transactional" | "Marketing" | "System"
    status: "Active" | "Inactive"
    updatedAt: string
}

export interface DocumentTemplate {
    id: string
    templateName: string
    code: string
    type: "Invoice" | "Quotation" | "Purchase Order" | "Delivery Note" | "Receipt" | "Letter"
    headerText: string
    footerText: string
    paperSize: "A4" | "Letter" | "Legal"
    orientation: "Portrait" | "Landscape"
    status: "Active" | "Inactive"
    updatedAt: string
}

export interface SmtpConfig {
    smtpHost: string
    smtpPort: number
    encryption: "None" | "TLS" | "SSL"
    senderName: string
    senderEmail: string
    replyToEmail: string
    username: string
    password: string
    enabled: boolean
}

export interface SmsGatewayConfig {
    gatewayName: string
    apiKey: string
    apiSecret: string
    apiUrl: string
    senderId: string
    enabled: boolean
}

export interface WhatsAppGatewayConfig {
    gatewayName: string
    phoneNumber: string
    accessToken: string
    apiUrl: string
    enabled: boolean
}

export interface CustomField {
    id: string
    fieldName: string
    fieldKey: string
    type: "Text" | "Number" | "Date" | "Dropdown" | "Checkbox" | "Email" | "URL"
    appliesTo: "Lead" | "Client" | "Project" | "Invoice" | "Employee"
    required: boolean
    status: "Active" | "Inactive"
}

export interface Tag {
    id: string
    tagName: string
    color: string
    appliesTo: string
    usageCount: number
}

export interface NumberingScheme {
    id: string
    documentType: string
    prefix: string
    suffix: string
    padding: number
    nextNumber: number
    resetFrequency: "Never" | "Yearly" | "Monthly" | "Daily"
    sample: string
    status: "Active" | "Inactive"
}

export interface MyAccount {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatarUrl: string
    bio: string
    twoFactorEnabled: boolean
    notifyEmail: boolean
    notifyInApp: boolean
    notifyPush: boolean
}

export interface Session {
    id: string
    device: string
    browser: string
    location: string
    ip: string
    lastActive: string
    current: boolean
}

interface State {
    general: GeneralPrefs
    setGeneral: (p: Partial<GeneralPrefs>) => void

    localization: Localization
    setLocalization: (p: Partial<Localization>) => void

    holidays: Holiday[]
    addHoliday: (h: Omit<Holiday, "id">) => void
    updateHoliday: (id: string, p: Partial<Holiday>) => void
    deleteHoliday: (id: string) => void

    emailTemplates: EmailTemplate[]
    addEmailTemplate: (t: Omit<EmailTemplate, "id" | "updatedAt">) => void
    updateEmailTemplate: (id: string, p: Partial<EmailTemplate>) => void
    deleteEmailTemplate: (id: string) => void

    documentTemplates: DocumentTemplate[]
    addDocumentTemplate: (t: Omit<DocumentTemplate, "id" | "updatedAt">) => void
    updateDocumentTemplate: (id: string, p: Partial<DocumentTemplate>) => void
    deleteDocumentTemplate: (id: string) => void

    smtp: SmtpConfig
    setSmtp: (p: Partial<SmtpConfig>) => void

    sms: SmsGatewayConfig
    setSms: (p: Partial<SmsGatewayConfig>) => void

    whatsapp: WhatsAppGatewayConfig
    setWhatsapp: (p: Partial<WhatsAppGatewayConfig>) => void

    customFields: CustomField[]
    addCustomField: (f: Omit<CustomField, "id">) => void
    updateCustomField: (id: string, p: Partial<CustomField>) => void
    deleteCustomField: (id: string) => void

    tags: Tag[]
    addTag: (t: Omit<Tag, "id" | "usageCount">) => void
    updateTag: (id: string, p: Partial<Tag>) => void
    deleteTag: (id: string) => void

    numberingSchemes: NumberingScheme[]
    addNumberingScheme: (s: Omit<NumberingScheme, "id" | "sample">) => void
    updateNumberingScheme: (id: string, p: Partial<NumberingScheme>) => void
    deleteNumberingScheme: (id: string) => void

    account: MyAccount
    setAccount: (p: Partial<MyAccount>) => void

    sessions: Session[]
    revokeSession: (id: string) => void
    revokeAllOthers: () => void
}

const today = () => new Date().toISOString().slice(0, 10)
const id = (p: string) => `${p}_` + Math.random().toString(36).slice(2, 10)

const computeSample = (s: { prefix: string; suffix: string; padding: number; nextNumber: number }) => {
    const n = String(s.nextNumber).padStart(s.padding || 0, "0")
    return `${s.prefix}${n}${s.suffix}`
}

export const useAdminSettingsStore = create<State>((set) => ({
    general: {
        timezone: "Asia/Kolkata",
        language: "English (US)",
        dateFormat: "DD MMM YYYY",
        timeFormat: "12-hour",
        numberFormat: "1,23,456.78 (Indian)",
        firstDayOfWeek: "Monday",
        landingPage: "/dashboard",
        densityMode: "Comfortable",
    },
    setGeneral: (p) => set((s) => ({ general: { ...s.general, ...p } })),

    localization: {
        defaultCurrency: "INR",
        secondaryCurrency: "USD",
        fiscalYearStart: "April",
        workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    setLocalization: (p) => set((s) => ({ localization: { ...s.localization, ...p } })),

    holidays: [
        { id: "h_01", holidayName: "Republic Day", holidayDate: "2026-01-26", type: "Public" },
        { id: "h_02", holidayName: "Holi", holidayDate: "2026-03-04", type: "Public" },
        { id: "h_03", holidayName: "Independence Day", holidayDate: "2026-08-15", type: "Public" },
        { id: "h_04", holidayName: "Gandhi Jayanti", holidayDate: "2026-10-02", type: "Public" },
        { id: "h_05", holidayName: "Diwali", holidayDate: "2026-11-08", type: "Public" },
        { id: "h_06", holidayName: "Founders Day", holidayDate: "2026-09-15", type: "Optional" },
    ],
    addHoliday: (h) => set((s) => ({ holidays: [{ id: id("h"), ...h }, ...s.holidays] })),
    updateHoliday: (idVal, p) => set((s) => ({ holidays: s.holidays.map((h) => (h.id === idVal ? { ...h, ...p } : h)) })),
    deleteHoliday: (idVal) => set((s) => ({ holidays: s.holidays.filter((h) => h.id !== idVal) })),

    emailTemplates: [
        { id: "et_01", templateName: "Welcome Email", code: "WELCOME-01", subject: "Welcome to {{orgName}}!", body: "Hi {{firstName}}, welcome aboard!", category: "Onboarding", status: "Active", updatedAt: "2026-04-10" },
        { id: "et_02", templateName: "Invoice Sent", code: "INV-SEND", subject: "Your Invoice {{invoiceNumber}} is ready", body: "Dear {{customerName}}, please find attached invoice for ₹{{amount}}.", category: "Transactional", status: "Active", updatedAt: "2026-03-22" },
        { id: "et_03", templateName: "Password Reset", code: "PWD-RST", subject: "Reset your password", body: "Click here: {{link}}. Expires in 30 minutes.", category: "System", status: "Active", updatedAt: "2026-04-01" },
        { id: "et_04", templateName: "Monthly Newsletter", code: "MKT-MONTH", subject: "{{month}} updates from {{orgName}}", body: "Highlights this month...", category: "Marketing", status: "Inactive", updatedAt: "2026-02-28" },
    ],
    addEmailTemplate: (t) => set((s) => ({ emailTemplates: [{ id: id("et"), updatedAt: today(), ...t }, ...s.emailTemplates] })),
    updateEmailTemplate: (idVal, p) => set((s) => ({ emailTemplates: s.emailTemplates.map((t) => (t.id === idVal ? { ...t, ...p, updatedAt: today() } : t)) })),
    deleteEmailTemplate: (idVal) => set((s) => ({ emailTemplates: s.emailTemplates.filter((t) => t.id !== idVal) })),

    documentTemplates: [
        { id: "dt_01", templateName: "Standard Invoice", code: "INV-STD", type: "Invoice", headerText: "TAX INVOICE", footerText: "Thank you for your business.", paperSize: "A4", orientation: "Portrait", status: "Active", updatedAt: "2026-04-15" },
        { id: "dt_02", templateName: "Sales Quotation", code: "QT-SALES", type: "Quotation", headerText: "QUOTATION", footerText: "Valid for 30 days.", paperSize: "A4", orientation: "Portrait", status: "Active", updatedAt: "2026-03-30" },
        { id: "dt_03", templateName: "Purchase Order", code: "PO-001", type: "Purchase Order", headerText: "PURCHASE ORDER", footerText: "Please confirm within 48 hours.", paperSize: "A4", orientation: "Portrait", status: "Active", updatedAt: "2026-04-05" },
    ],
    addDocumentTemplate: (t) => set((s) => ({ documentTemplates: [{ id: id("dt"), updatedAt: today(), ...t }, ...s.documentTemplates] })),
    updateDocumentTemplate: (idVal, p) => set((s) => ({ documentTemplates: s.documentTemplates.map((t) => (t.id === idVal ? { ...t, ...p, updatedAt: today() } : t)) })),
    deleteDocumentTemplate: (idVal) => set((s) => ({ documentTemplates: s.documentTemplates.filter((t) => t.id !== idVal) })),

    smtp: {
        smtpHost: "smtp.example.com",
        smtpPort: 587,
        encryption: "TLS",
        senderName: "Cubicle CRM",
        senderEmail: "noreply@cubiclecrm.com",
        replyToEmail: "support@cubiclecrm.com",
        username: "noreply@cubiclecrm.com",
        password: "",
        enabled: true,
    },
    setSmtp: (p) => set((s) => ({ smtp: { ...s.smtp, ...p } })),

    sms: {
        gatewayName: "Twilio",
        apiKey: "",
        apiSecret: "",
        apiUrl: "https://api.twilio.com/2010-04-01",
        senderId: "CUBICLE",
        enabled: false,
    },
    setSms: (p) => set((s) => ({ sms: { ...s.sms, ...p } })),

    whatsapp: {
        gatewayName: "WhatsApp Business",
        phoneNumber: "+919812345678",
        accessToken: "",
        apiUrl: "https://graph.facebook.com/v18.0",
        enabled: false,
    },
    setWhatsapp: (p) => set((s) => ({ whatsapp: { ...s.whatsapp, ...p } })),

    customFields: [
        { id: "cf_01", fieldName: "GSTIN", fieldKey: "gstin", type: "Text", appliesTo: "Client", required: false, status: "Active" },
        { id: "cf_02", fieldName: "Lead Source Detail", fieldKey: "lead-source-detail", type: "Dropdown", appliesTo: "Lead", required: false, status: "Active" },
        { id: "cf_03", fieldName: "Contract Value", fieldKey: "contract-value", type: "Number", appliesTo: "Project", required: false, status: "Active" },
        { id: "cf_04", fieldName: "Onboarding Date", fieldKey: "onboarding-date", type: "Date", appliesTo: "Employee", required: true, status: "Active" },
    ],
    addCustomField: (f) => set((s) => ({ customFields: [{ id: id("cf"), ...f }, ...s.customFields] })),
    updateCustomField: (idVal, p) => set((s) => ({ customFields: s.customFields.map((f) => (f.id === idVal ? { ...f, ...p } : f)) })),
    deleteCustomField: (idVal) => set((s) => ({ customFields: s.customFields.filter((f) => f.id !== idVal) })),

    tags: [
        { id: "t_01", tagName: "VIP", color: "#ef4444", appliesTo: "Client", usageCount: 12 },
        { id: "t_02", tagName: "Hot Lead", color: "#f59e0b", appliesTo: "Lead", usageCount: 28 },
        { id: "t_03", tagName: "Renewal", color: "#10b981", appliesTo: "Client", usageCount: 15 },
        { id: "t_04", tagName: "Urgent", color: "#8b5cf6", appliesTo: "Project", usageCount: 7 },
    ],
    addTag: (t) => set((s) => ({ tags: [{ id: id("t"), usageCount: 0, ...t }, ...s.tags] })),
    updateTag: (idVal, p) => set((s) => ({ tags: s.tags.map((t) => (t.id === idVal ? { ...t, ...p } : t)) })),
    deleteTag: (idVal) => set((s) => ({ tags: s.tags.filter((t) => t.id !== idVal) })),

    numberingSchemes: [
        { id: "ns_01", documentType: "Invoice", prefix: "INV-", suffix: "", padding: 4, nextNumber: 1042, resetFrequency: "Yearly", sample: "INV-1042", status: "Active" },
        { id: "ns_02", documentType: "Quotation", prefix: "QT-", suffix: "", padding: 4, nextNumber: 538, resetFrequency: "Yearly", sample: "QT-0538", status: "Active" },
        { id: "ns_03", documentType: "Purchase Order", prefix: "PO-", suffix: "", padding: 5, nextNumber: 2087, resetFrequency: "Never", sample: "PO-02087", status: "Active" },
        { id: "ns_04", documentType: "Customer ID", prefix: "CUS-", suffix: "", padding: 6, nextNumber: 100245, resetFrequency: "Never", sample: "CUS-100245", status: "Active" },
        { id: "ns_05", documentType: "Sales Order", prefix: "SO-", suffix: "", padding: 4, nextNumber: 3082, resetFrequency: "Yearly", sample: "SO-3082", status: "Active" },
    ],
    addNumberingScheme: (s2) => set((s) => {
        const sample = computeSample(s2)
        return { numberingSchemes: [{ id: id("ns"), sample, ...s2 }, ...s.numberingSchemes] }
    }),
    updateNumberingScheme: (idVal, p) => set((s) => ({
        numberingSchemes: s.numberingSchemes.map((x) => {
            if (x.id !== idVal) return x
            const next = { ...x, ...p }
            next.sample = computeSample(next)
            return next
        }),
    })),
    deleteNumberingScheme: (idVal) => set((s) => ({ numberingSchemes: s.numberingSchemes.filter((x) => x.id !== idVal) })),

    account: {
        firstName: "Org",
        lastName: "Admin",
        email: "orgadmin@gmail.com",
        phone: "+919812340001",
        avatarUrl: "",
        bio: "Organization administrator",
        twoFactorEnabled: false,
        notifyEmail: true,
        notifyInApp: true,
        notifyPush: false,
    },
    setAccount: (p) => set((s) => ({ account: { ...s.account, ...p } })),

    sessions: [
        { id: "ses_1", device: "MacBook Pro 14\"", browser: "Chrome 122 / macOS", location: "Mumbai, IN", ip: "203.0.113.42", lastActive: "Just now", current: true },
        { id: "ses_2", device: "iPhone 15", browser: "Safari Mobile / iOS 17", location: "Mumbai, IN", ip: "203.0.113.55", lastActive: "2 hours ago", current: false },
        { id: "ses_3", device: "Windows Desktop", browser: "Firefox 124 / Windows 11", location: "Bengaluru, IN", ip: "117.193.45.12", lastActive: "Yesterday", current: false },
    ],
    revokeSession: (idVal) => set((s) => ({ sessions: s.sessions.filter((x) => x.id !== idVal || x.current) })),
    revokeAllOthers: () => set((s) => ({ sessions: s.sessions.filter((x) => x.current) })),
}))

export const TIMEZONES = [
    "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo",
    "Europe/London", "Europe/Berlin", "Europe/Paris",
    "America/New_York", "America/Los_Angeles", "America/Chicago",
    "Australia/Sydney", "UTC",
]
export const LANGUAGES = ["English (US)", "English (UK)", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese (Simplified)", "Arabic", "Portuguese"]
export const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "DD MMM YYYY", "MMM DD, YYYY", "DD-MM-YYYY"]
export const TIME_FORMATS = ["12-hour", "24-hour"]
export const NUMBER_FORMATS = ["1,234,567.89 (US)", "1.234.567,89 (EU)", "1,23,456.78 (Indian)", "1234567.89 (Plain)"]
export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "SGD", "JPY", "CNY", "AUD", "CAD"]
export const FISCAL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const LANDING_PAGES = ["/dashboard", "/modules/organization/overview", "/modules/users", "/modules/billing/plan", "/security"]
