/**
 * Field-name based validators for Lead Management forms.
 * Each rule is keyed by a logical field name and returns either an error
 * string or null. Form components pick the matching rule by passing the
 * field name to `validateField`.
 */

export type Validator = (value: any) => string | null

const isBlank = (v: any) => v === null || v === undefined || String(v).trim() === ""

export const required =
    (label: string): Validator =>
    (v) =>
        isBlank(v) ? `${label} is required` : null

export const compose =
    (...rules: Validator[]): Validator =>
    (v) => {
        for (const rule of rules) {
            const err = rule(v)
            if (err) return err
        }
        return null
    }

export const pattern =
    (re: RegExp, msg: string): Validator =>
    (v) =>
        isBlank(v) || re.test(String(v).trim()) ? null : msg

export const minLen =
    (n: number, label: string): Validator =>
    (v) =>
        isBlank(v) || String(v).trim().length >= n
            ? null
            : `${label} must be at least ${n} characters`

export const maxLen =
    (n: number, label: string): Validator =>
    (v) =>
        isBlank(v) || String(v).trim().length <= n
            ? null
            : `${label} must be at most ${n} characters`

export const numericMin =
    (min: number, label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        const n = Number(v)
        if (Number.isNaN(n)) return `${label} must be a number`
        if (n < min) return `${label} must be at least ${min}`
        return null
    }

export const numericMax =
    (max: number, label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        const n = Number(v)
        if (Number.isNaN(n)) return `${label} must be a number`
        if (n > max) return `${label} must be at most ${max}`
        return null
    }

export const currencyAmount: (label: string) => Validator = (label) => (v) => {
    if (isBlank(v)) return null
    // Accept formats: 12345, 12345.67, $12,500, ₹1,25,500, $1.2M, $850k
    const trimmed = String(v).trim()
    if (/^[\$₹€£]?\d{1,3}(,\d{2,3})*(\.\d{1,2})?[KkMmBb]?\+?$/.test(trimmed)) return null
    if (/^[\$₹€£]?\d+(\.\d{1,2})?[KkMmBb]?\+?$/.test(trimmed)) return null
    return `${label} must be a valid amount (e.g. 12500, $12,500, $1.2M, ₹1,25,000)`
}

export const futureOrToday: (label: string) => Validator = (label) => (v) => {
    if (isBlank(v)) return null
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return `${label} is not a valid date`
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (d < today) return `${label} must be today or in the future`
    return null
}

// ─── Regex patterns ────────────────────────────────────────────────────────
const NAME_RE = /^[A-Za-z][A-Za-z .'\-]{1,59}$/
const TITLE_RE = /^[A-Za-z0-9][A-Za-z0-9 &/_,.\-()'"]{2,99}$/
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/
const PHONE_RE = /^[+]?[0-9\s\-()]{10,18}$/
const COMPANY_RE = /^[A-Za-z0-9][A-Za-z0-9 &/.,\-()'"]{1,79}$/
const URL_RE = /^https?:\/\/[\w.\-]+(:[0-9]+)?(\/.*)?$/i
const TAG_RE = /^[A-Za-z0-9][A-Za-z0-9 _\-]{0,29}$/
const STAGE_RE = /^[A-Za-z][A-Za-z0-9 \-]{1,40}$/

// ─── Field-name → validator map ────────────────────────────────────────────
const RULES: Record<string, Validator> = {
    // Identity
    name: compose(
        required("Name"),
        minLen(2, "Name"),
        maxLen(60, "Name"),
        pattern(NAME_RE, "Name should contain only letters, spaces, ., ', -")
    ),
    fullname: compose(
        required("Full Name"),
        minLen(2, "Full Name"),
        maxLen(60, "Full Name"),
        pattern(NAME_RE, "Full Name should contain only letters, spaces, ., ', -")
    ),
    contactname: compose(
        required("Contact Name"),
        minLen(2, "Contact Name"),
        maxLen(60, "Contact Name"),
        pattern(NAME_RE, "Contact Name should contain only letters, spaces, ., ', -")
    ),
    ownername: compose(
        maxLen(60, "Owner Name"),
        pattern(/^[A-Za-z][A-Za-z .'\-]{1,59}$|^Unassigned$/, "Owner Name has invalid characters")
    ),
    title: compose(
        required("Title"),
        minLen(3, "Title"),
        maxLen(100, "Title"),
        pattern(TITLE_RE, "Title contains invalid characters")
    ),

    // Contact channels
    email: compose(
        required("Email"),
        maxLen(120, "Email"),
        pattern(EMAIL_RE, "Enter a valid email address")
    ),
    phone: compose(
        required("Phone"),
        pattern(PHONE_RE, "Phone must be 10-15 digits, optional + and separators")
    ),
    website: compose(
        maxLen(200, "Website"),
        pattern(URL_RE, "Website must start with http:// or https://")
    ),

    // Company
    company: compose(
        required("Company"),
        minLen(2, "Company"),
        maxLen(80, "Company"),
        pattern(COMPANY_RE, "Company has invalid characters")
    ),
    industry: compose(maxLen(60, "Industry")),
    region: compose(maxLen(60, "Region")),

    // Pipeline / classification
    source: required("Source"),
    status: required("Status"),
    stage: compose(
        required("Stage"),
        pattern(STAGE_RE, "Stage has invalid characters")
    ),
    priority: required("Priority"),
    currency: required("Currency"),

    // Money / score
    value: compose(
        required("Value"),
        currencyAmount("Value")
    ),
    estimatedvalue: compose(
        required("Estimated Value"),
        currencyAmount("Estimated Value")
    ),
    minprojectvalue: compose(currencyAmount("Min Project Value")),
    score: compose(
        numericMin(0, "Score"),
        numericMax(100, "Score")
    ),

    // Tags / notes
    tag: compose(
        minLen(1, "Tag"),
        maxLen(30, "Tag"),
        pattern(TAG_RE, "Tag must start with a letter/number, max 30 chars")
    ),
    customtag: compose(
        minLen(1, "Tag"),
        maxLen(30, "Tag"),
        pattern(TAG_RE, "Tag must start with a letter/number, max 30 chars")
    ),
    note: compose(maxLen(500, "Note")),
    notes: compose(maxLen(500, "Notes")),
    description: compose(maxLen(500, "Description")),
    reason: compose(maxLen(200, "Reason")),

    // Dates
    nextactiondate: compose(futureOrToday("Next Action Date")),
    followupdate: compose(futureOrToday("Follow-up Date")),
    duedate: compose(futureOrToday("Due Date")),

    // Owner / assignment (selects)
    owner: required("Owner"),
    targetowner: required("Target Owner"),
    assignedto: compose(maxLen(60, "Assigned To")),

    // Action labels
    nextaction: compose(maxLen(120, "Next Action")),

    // Misc
    position: compose(maxLen(60, "Position")),
    sourcedetails: compose(maxLen(120, "Source Details")),
    firm: required("Firm"),

    // ─── Integrations ───
    integrationname: compose(
        required("Integration Name"),
        minLen(2, "Integration Name"),
        maxLen(60, "Integration Name"),
        pattern(/^[A-Za-z0-9][A-Za-z0-9 _\-.&/()]{1,59}$/, "Integration Name has invalid characters")
    ),
    provider: required("Provider"),
    providertype: required("Provider Type"),
    type: required("Type"),
    apikey: compose(
        required("API Key"),
        minLen(8, "API Key"),
        maxLen(200, "API Key"),
        pattern(/^[A-Za-z0-9_\-.~+/=]{8,200}$/, "API Key may contain letters, digits, _, -, ., ~, +, /, =")
    ),
    secretkey: compose(
        minLen(8, "Secret Key"),
        maxLen(200, "Secret Key"),
        pattern(/^[A-Za-z0-9_\-.~+/=]{8,200}$/, "Secret Key may contain letters, digits, _, -, ., ~, +, /, =")
    ),
    accesstoken: compose(
        minLen(8, "Access Token"),
        maxLen(500, "Access Token"),
        pattern(/^[A-Za-z0-9_\-.~+/=]{8,500}$/, "Access Token may contain letters, digits, _, -, ., ~, +, /, =")
    ),
    accountid: compose(
        maxLen(80, "Account ID"),
        pattern(/^[A-Za-z0-9_\-]{1,80}$/, "Account ID may contain letters, digits, _, -")
    ),
    endpointurl: compose(
        required("Endpoint URL"),
        pattern(/^https?:\/\/[\w.\-]+(:[0-9]+)?(\/.*)?$/i, "Endpoint URL must start with http:// or https://")
    ),
    webhookurl: compose(
        pattern(/^https?:\/\/[\w.\-]+(:[0-9]+)?(\/.*)?$/i, "Webhook URL must start with http:// or https://")
    ),
    callbackurl: compose(
        pattern(/^https?:\/\/[\w.\-]+(:[0-9]+)?(\/.*)?$/i, "Callback URL must start with http:// or https://")
    ),
    pixelid: compose(
        maxLen(60, "Pixel ID"),
        pattern(/^[A-Za-z0-9_\-]{6,60}$/, "Pixel ID must be 6-60 chars (letters, digits, _, -)")
    ),
    trackingid: compose(
        maxLen(60, "Tracking ID"),
        pattern(/^[A-Za-z0-9_\-]{6,60}$/, "Tracking ID must be 6-60 chars (letters, digits, _, -)")
    ),
    eventname: compose(
        maxLen(60, "Event Name"),
        pattern(/^[A-Za-z][A-Za-z0-9_\- ]{0,59}$/, "Event Name must start with a letter, max 60 chars")
    ),
    channelname: compose(
        required("Channel Name"),
        maxLen(60, "Channel Name"),
        pattern(/^[A-Za-z0-9 _\-.()&/]{2,60}$/, "Channel Name has invalid characters")
    ),
    syncfrequency: required("Sync Frequency"),
    direction: required("Direction"),
    integrationstatus: required("Status"),
    pluginname: compose(
        required("Plugin Name"),
        maxLen(60, "Plugin Name"),
        pattern(/^[A-Za-z0-9 _\-.&/()]{2,60}$/, "Plugin Name has invalid characters")
    ),
    version: compose(
        maxLen(20, "Version"),
        pattern(/^[A-Za-z0-9._\-]{1,20}$/, "Version may contain letters, digits, ., _, -")
    ),
}

const normalize = (name: string) => name.replace(/[_\s.\-]/g, "").toLowerCase()

export function validateField(name: string, value: any): string | null {
    const rule = RULES[normalize(name)]
    if (!rule) return null
    return rule(value)
}

export function validateForm<T extends Record<string, any>>(
    data: T,
    fields: Array<keyof T & string>
): Record<string, string> {
    const errors: Record<string, string> = {}
    for (const f of fields) {
        const err = validateField(f, data[f])
        if (err) errors[f] = err
    }
    return errors
}
