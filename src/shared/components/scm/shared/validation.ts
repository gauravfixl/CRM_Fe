/**
 * Field-name based validators for SCM forms.
 *
 * Each rule is keyed by a logical field name (productName, sku, email, ...)
 * and returns either an error string or null. The form component picks the
 * matching rule by passing the field name to `validateField`.
 */

export type Validator = (value: any) => string | null

const isBlank = (v: any) => v === null || v === undefined || String(v).trim() === ""

const required: (label: string) => Validator = (label) => (v) =>
    isBlank(v) ? `${label} is required` : null

const compose =
    (...rules: Validator[]): Validator =>
    (v) => {
        for (const rule of rules) {
            const err = rule(v)
            if (err) return err
        }
        return null
    }

const pattern =
    (re: RegExp, msg: string): Validator =>
    (v) =>
        isBlank(v) || re.test(String(v).trim()) ? null : msg

const minLen =
    (n: number, label: string): Validator =>
    (v) =>
        isBlank(v) || String(v).trim().length >= n ? null : `${label} must be at least ${n} characters`

const maxLen =
    (n: number, label: string): Validator =>
    (v) =>
        isBlank(v) || String(v).trim().length <= n ? null : `${label} must be at most ${n} characters`

const numericNonNegative =
    (label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        const n = Number(v)
        if (Number.isNaN(n)) return `${label} must be a number`
        if (n < 0) return `${label} cannot be negative`
        return null
    }

const integerNonNegative =
    (label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        const n = Number(v)
        if (!Number.isInteger(n)) return `${label} must be a whole number`
        if (n < 0) return `${label} cannot be negative`
        return null
    }

const decimalMax2 =
    (label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        if (!/^\d+(\.\d{1,2})?$/.test(String(v).trim()))
            return `${label} can have up to 2 decimal places`
        return null
    }

const futureDate =
    (label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        const d = new Date(v)
        if (Number.isNaN(d.getTime())) return `${label} is not a valid date`
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (d < today) return `${label} must be today or in the future`
        return null
    }

const pastOrToday =
    (label: string): Validator =>
    (v) => {
        if (isBlank(v)) return null
        const d = new Date(v)
        if (Number.isNaN(d.getTime())) return `${label} is not a valid date`
        const today = new Date()
        today.setHours(23, 59, 59, 999)
        if (d > today) return `${label} cannot be in the future`
        return null
    }

const NAME_RE = /^[A-Za-z][A-Za-z0-9 &/\-.,()]{1,59}$/
const CODE_RE = /^[A-Z0-9_-]{2,15}$/
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const PHONE_RE = /^[+]?[0-9]{10,15}$/
const GST_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/
const ACCOUNT_RE = /^[0-9]{9,18}$/
const PINCODE_RE = /^[0-9]{6}$/
const BARCODE_RE = /^[0-9]{8,13}$/
const URL_RE = /^https?:\/\/[\w.-]+(\:[0-9]+)?(\/.*)?$/i

/**
 * Map of logical field name → validator chain.
 * Field names are normalized (lowercased, no underscores) before lookup.
 */
const RULES: Record<string, Validator> = {
    // Names
    productname: compose(required("Product Name"), minLen(2, "Product Name"), maxLen(60, "Product Name"), pattern(NAME_RE, "Product Name has invalid characters")),
    vendorname: compose(required("Vendor Name"), minLen(2, "Vendor Name"), maxLen(60, "Vendor Name"), pattern(NAME_RE, "Vendor Name has invalid characters")),
    warehousename: compose(required("Warehouse Name"), minLen(2, "Warehouse Name"), maxLen(60, "Warehouse Name"), pattern(NAME_RE, "Warehouse Name has invalid characters")),
    categoryname: compose(required("Category Name"), minLen(2, "Category Name"), maxLen(60, "Category Name"), pattern(NAME_RE, "Category Name has invalid characters")),
    contactperson: compose(required("Contact Person"), minLen(2, "Contact Person"), maxLen(60, "Contact Person"), pattern(NAME_RE, "Contact Person has invalid characters")),
    courier: compose(required("Courier"), minLen(2, "Courier"), maxLen(60, "Courier")),
    couriername: compose(required("Courier Name"), minLen(2, "Courier Name"), maxLen(60, "Courier Name")),
    managername: compose(required("Manager Name"), minLen(2, "Manager Name"), maxLen(60, "Manager Name"), pattern(NAME_RE, "Manager Name has invalid characters")),
    customername: compose(required("Customer Name"), minLen(2, "Customer Name"), maxLen(60, "Customer Name")),
    brand: compose(maxLen(60, "Brand")),
    unit: compose(required("Unit"), maxLen(20, "Unit")),

    // Codes / SKUs
    sku: compose(required("SKU"), pattern(CODE_RE, "SKU must be 2-15 chars, A-Z 0-9 _ -")),
    productcode: compose(required("Product Code"), pattern(CODE_RE, "Product Code must be 2-15 chars, A-Z 0-9 _ -")),
    vendorcode: compose(required("Vendor Code"), pattern(CODE_RE, "Vendor Code must be 2-15 chars, A-Z 0-9 _ -")),
    warehousecode: compose(required("Warehouse Code"), pattern(CODE_RE, "Warehouse Code must be 2-15 chars, A-Z 0-9 _ -")),
    ponumber: compose(required("PO Number"), pattern(CODE_RE, "PO Number must be 2-15 chars, A-Z 0-9 _ -")),
    grnnumber: compose(required("GRN Number"), pattern(CODE_RE, "GRN Number must be 2-15 chars, A-Z 0-9 _ -")),
    transfernumber: compose(required("Transfer Number"), pattern(CODE_RE, "Transfer Number must be 2-15 chars, A-Z 0-9 _ -")),
    referencenumber: compose(maxLen(30, "Reference Number")),
    batchnumber: compose(maxLen(30, "Batch Number")),
    serialnumber: compose(maxLen(30, "Serial Number")),
    trackingnumber: compose(maxLen(50, "Tracking Number")),
    binnumber: compose(required("Bin Number"), pattern(/^[A-Z0-9-]{1,10}$/, "Bin Number invalid format")),
    racknumber: compose(required("Rack Number"), pattern(/^[A-Z0-9-]{1,10}$/, "Rack Number invalid format")),

    // Contact
    email: compose(required("Email"), pattern(EMAIL_RE, "Enter a valid email address")),
    phone: compose(required("Phone"), pattern(PHONE_RE, "Phone must be 10-15 digits, optional +")),
    contact: compose(required("Contact"), pattern(PHONE_RE, "Contact must be 10-15 digits, optional +")),
    mobile: compose(required("Mobile"), pattern(PHONE_RE, "Mobile must be 10-15 digits, optional +")),
    website: compose(pattern(URL_RE, "Website must start with http:// or https://")),

    // Tax / banking
    gst: compose(pattern(GST_RE, "Invalid GSTIN format")),
    gstin: compose(pattern(GST_RE, "Invalid GSTIN format")),
    taxnumber: compose(maxLen(20, "Tax Number")),
    ifsc: compose(pattern(IFSC_RE, "Invalid IFSC format")),
    swiftcode: compose(pattern(/^[A-Z0-9]{8,11}$/, "Invalid SWIFT code")),
    accountnumber: compose(pattern(ACCOUNT_RE, "Account Number must be 9-18 digits")),
    bankname: compose(maxLen(60, "Bank Name")),
    paymentterms: compose(maxLen(60, "Payment Terms")),

    // Address
    address: compose(maxLen(200, "Address")),
    city: compose(pattern(/^[A-Za-z][A-Za-z .'-]{1,50}$/, "City has invalid characters")),
    state: compose(pattern(/^[A-Za-z][A-Za-z .'-]{1,50}$/, "State has invalid characters")),
    country: compose(maxLen(60, "Country")),
    pincode: compose(pattern(PINCODE_RE, "Pincode must be 6 digits")),

    // Numeric
    quantity: compose(required("Quantity"), integerNonNegative("Quantity")),
    receivedquantity: compose(integerNonNegative("Received Quantity")),
    rejectedquantity: compose(integerNonNegative("Rejected Quantity")),
    reorderlevel: compose(integerNonNegative("Reorder Level")),
    openingstock: compose(integerNonNegative("Opening Stock")),
    capacity: compose(integerNonNegative("Capacity")),
    storagecapacity: compose(integerNonNegative("Storage Capacity")),
    weight: compose(numericNonNegative("Weight")),
    packageweight: compose(numericNonNegative("Package Weight")),

    // Money / decimals
    price: compose(required("Price"), decimalMax2("Price")),
    purchaseprice: compose(required("Purchase Price"), decimalMax2("Purchase Price")),
    sellingprice: compose(required("Selling Price"), decimalMax2("Selling Price")),
    unitcost: compose(required("Unit Cost"), decimalMax2("Unit Cost")),
    quotedprice: compose(required("Quoted Price"), decimalMax2("Quoted Price")),
    amount: compose(required("Amount"), decimalMax2("Amount")),
    totalamount: compose(decimalMax2("Total Amount")),
    contractvalue: compose(decimalMax2("Contract Value")),
    shippingcharges: compose(decimalMax2("Shipping Charges")),
    taxrate: compose(numericNonNegative("Tax Rate")),
    taxpercentage: compose(numericNonNegative("Tax Percentage")),
    discount: compose(numericNonNegative("Discount")),

    // Identifiers
    barcode: compose(pattern(BARCODE_RE, "Barcode must be 8-13 digits")),

    // Dates
    expirydate: compose(futureDate("Expiry Date")),
    expecteddelivery: compose(futureDate("Expected Delivery")),
    expecteddeliverydate: compose(futureDate("Expected Delivery Date")),
    expectedarrivaldate: compose(futureDate("Expected Arrival Date")),
    pickupdate: compose(futureDate("Pickup Date")),
    requireddate: compose(futureDate("Required Date")),
    contractenddate: compose(futureDate("Contract End Date")),
    renewalreminderdate: compose(futureDate("Renewal Reminder Date")),
    manufacturingdate: compose(pastOrToday("Manufacturing Date")),
    receiveddate: compose(pastOrToday("Received Date")),
    returndate: compose(pastOrToday("Return Date")),
    contractstartdate: compose(pastOrToday("Contract Start Date")),
    orderdate: compose(pastOrToday("Order Date")),
    paymentdate: compose(pastOrToday("Payment Date")),
    issueddate: compose(pastOrToday("Issued Date")),

    // Long text
    description: compose(maxLen(500, "Description")),
    remarks: compose(maxLen(500, "Remarks")),
    reason: compose(maxLen(200, "Reason")),
    notes: compose(maxLen(500, "Notes")),

    // Selects (must be non-blank if marked required at form level — selects use this only when required)
    status: required("Status"),
    priority: required("Priority"),
    category: required("Category"),
    warehouse: required("Warehouse"),
    vendor: required("Vendor"),
    product: required("Product"),
    customer: required("Customer"),
    courierpartner: required("Courier Partner"),
    paymentmethod: required("Payment Method"),
    transactiontype: required("Transaction Type"),
    adjustmenttype: required("Adjustment Type"),
}

/** Normalize "Product Name" / "product_name" / "productName" → "productname". */
const normalize = (name: string) =>
    name.replace(/[_\s-]/g, "").toLowerCase()

/** Validate one field; returns null when valid, else the error message. */
export function validateField(name: string, value: any): string | null {
    const rule = RULES[normalize(name)]
    if (!rule) return null
    return rule(value)
}

/** Validate an entire object; returns a {fieldName: error} map (only failing fields). */
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

/** Convenience helpers for ad-hoc validation outside the registry. */
export const v = {
    required,
    pattern,
    minLen,
    maxLen,
    numericNonNegative,
    integerNonNegative,
    decimalMax2,
    futureDate,
    pastOrToday,
    compose,
}
