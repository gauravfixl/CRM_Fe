/**
 * Field-name based validators for OrgAdmin Settings forms.
 * Each rule is keyed by a logical field name and returns either an error string or null.
 */

export type Validator = (value: any) => string | null

const isBlank = (v: any) => v === null || v === undefined || String(v).trim() === ""

const required = (label: string): Validator => (v) =>
    isBlank(v) ? `${label} is required` : null

const compose = (...rules: Validator[]): Validator => (v) => {
    for (const rule of rules) {
        const err = rule(v)
        if (err) return err
    }
    return null
}

const pattern = (re: RegExp, msg: string): Validator => (v) =>
    isBlank(v) || re.test(String(v).trim()) ? null : msg

const minLen = (n: number, label: string): Validator => (v) =>
    isBlank(v) || String(v).trim().length >= n ? null : `${label} must be at least ${n} characters`

const maxLen = (n: number, label: string): Validator => (v) =>
    isBlank(v) || String(v).trim().length <= n ? null : `${label} must be at most ${n} characters`

const numericRange = (min: number, max: number, label: string): Validator => (v) => {
    if (isBlank(v)) return null
    const n = Number(v)
    if (Number.isNaN(n)) return `${label} must be a number`
    if (n < min || n > max) return `${label} must be between ${min} and ${max}`
    return null
}

const NAME_RE = /^[A-Za-z][A-Za-z0-9 &/\-_.,()]{1,79}$/
const CODE_RE = /^[A-Z0-9_-]{2,15}$/
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const PHONE_RE = /^[+]?[0-9]{10,15}$/
const URL_RE = /^https?:\/\/[\w.-]+(\:[0-9]+)?(\/.*)?$/i
const SLUG_RE = /^[a-z0-9-]{2,40}$/

const RULES: Record<string, Validator> = {
    // Common name fields
    name: compose(required("Name"), minLen(2, "Name"), maxLen(80, "Name"), pattern(NAME_RE, "Name has invalid characters")),
    fullname: compose(required("Full Name"), minLen(2, "Full Name"), maxLen(80, "Full Name")),
    firstname: compose(required("First Name"), minLen(1, "First Name"), maxLen(40, "First Name")),
    lastname: compose(required("Last Name"), minLen(1, "Last Name"), maxLen(40, "Last Name")),
    label: compose(required("Label"), minLen(2, "Label"), maxLen(60, "Label")),
    title: compose(required("Title"), minLen(2, "Title"), maxLen(80, "Title")),
    templatename: compose(required("Template Name"), minLen(2, "Template Name"), maxLen(80, "Template Name")),
    holidayname: compose(required("Holiday Name"), minLen(2, "Holiday Name"), maxLen(60, "Holiday Name")),
    fieldname: compose(required("Field Name"), minLen(2, "Field Name"), maxLen(40, "Field Name")),
    tagname: compose(required("Tag Name"), minLen(2, "Tag Name"), maxLen(40, "Tag Name")),
    gatewayname: compose(required("Gateway Name"), minLen(2, "Gateway Name"), maxLen(60, "Gateway Name")),
    senderName: compose(required("Sender Name"), minLen(2, "Sender Name"), maxLen(60, "Sender Name")),

    // Codes / keys / slugs
    code: compose(required("Code"), pattern(CODE_RE, "Code must be 2–15 chars (A–Z, 0–9, _ -)")),
    fieldkey: compose(required("Field Key"), pattern(SLUG_RE, "Field Key must be lowercase letters, numbers, hyphens (2–40)")),
    slug: compose(pattern(SLUG_RE, "Slug must be 2–40 lowercase chars/numbers/hyphens")),

    // Contact
    email: compose(required("Email"), pattern(EMAIL_RE, "Enter a valid email address")),
    senderemail: compose(required("Sender Email"), pattern(EMAIL_RE, "Sender Email must be a valid email")),
    fromemail: compose(required("From Email"), pattern(EMAIL_RE, "From Email must be a valid email")),
    replytoemail: compose(pattern(EMAIL_RE, "Reply-To must be a valid email")),
    phone: compose(pattern(PHONE_RE, "Phone must be 10–15 digits, optional +")),
    mobile: compose(pattern(PHONE_RE, "Mobile must be 10–15 digits, optional +")),

    // URL / endpoints
    url: compose(pattern(URL_RE, "URL must start with http:// or https://")),
    apiurl: compose(pattern(URL_RE, "API URL must start with http(s)://")),
    webhookurl: compose(pattern(URL_RE, "Webhook URL must start with http(s)://")),

    // SMTP / network
    host: compose(required("Host"), maxLen(120, "Host")),
    smtphost: compose(required("SMTP Host"), maxLen(120, "SMTP Host")),
    port: compose(required("Port"), numericRange(1, 65535, "Port")),
    smtpport: compose(required("SMTP Port"), numericRange(1, 65535, "SMTP Port")),

    // Numbering
    prefix: compose(maxLen(10, "Prefix"), pattern(/^[A-Z0-9-]{0,10}$/, "Prefix can use only A-Z, 0-9, hyphen (max 10)")),
    suffix: compose(maxLen(10, "Suffix"), pattern(/^[A-Z0-9-]{0,10}$/, "Suffix can use only A-Z, 0-9, hyphen (max 10)")),
    padding: compose(numericRange(0, 12, "Padding")),
    nextnumber: compose(required("Next Number"), numericRange(0, 999999999, "Next Number")),

    // Templates
    subject: compose(required("Subject"), minLen(2, "Subject"), maxLen(200, "Subject")),
    body: compose(required("Body"), minLen(5, "Body"), maxLen(20000, "Body")),
    content: compose(required("Content"), minLen(5, "Content"), maxLen(20000, "Content")),

    // Selects
    status: required("Status"),
    type: required("Type"),
    category: required("Category"),
    timezone: required("Timezone"),
    language: required("Language"),
    currency: required("Currency"),
    dateformat: required("Date Format"),

    // Dates
    date: required("Date"),
    holidaydate: required("Date"),

    // Long text / optional
    description: compose(maxLen(500, "Description")),
    notes: compose(maxLen(500, "Notes")),
    remarks: compose(maxLen(500, "Remarks")),

    // Passwords
    currentpassword: compose(required("Current Password"), minLen(6, "Current Password")),
    newpassword: compose(required("New Password"), minLen(8, "New Password"), maxLen(64, "New Password")),
    confirmpassword: compose(required("Confirm Password")),

    // Misc
    apikey: compose(required("API Key"), minLen(8, "API Key")),
    apisecret: compose(required("API Secret"), minLen(8, "API Secret")),
    username: compose(required("Username"), minLen(2, "Username"), maxLen(60, "Username")),
}

const normalize = (name: string) => name.replace(/[_\s-]/g, "").toLowerCase()

/** Validate a single field by its logical name. Returns error message or null. */
export function validateField(name: string, value: any): string | null {
    const rule = RULES[normalize(name)]
    if (!rule) return null
    return rule(value)
}

/** Validate a whole shape and return only failing fields. */
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
