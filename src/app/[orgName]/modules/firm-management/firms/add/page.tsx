

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Building2, Globe, User, Save, MapPin } from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"
import { addNewFirm } from "@/hooks/firmHooks"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomLabel } from "@/components/custom/CustomLabel"
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown"
import SubHeader from "@/components/custom/SubHeader"
import { FlatCard } from "@/components/custom/FlatCard"
import { PhoneInputWithCountryCode } from "@/components/custom/PhoneInputWithCountryCode"

// --- Validation helpers (for submit/next step) ---
const isValidEmail = (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
const isValidUrl = (v: string) => /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(v)
const isValidGST = (v: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.toUpperCase())
// CIN: exactly 21 chars — L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits
const isValidCIN = (v: string) => /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(v.trim())
// TIN: exactly 11 digits
const isValidTIN = (v: string) => /^[0-9]{11}$/.test(v.trim())
const isValidUIN = (v: string) => v.trim().length >= 5 && v.trim().length <= 25
const isValidPinCode = (v: string | number) => /^[0-9]{4,10}$/.test(String(v))

// --- Real-time input sanitization ---
// Blocks invalid characters while typing so user cannot enter wrong input
const sanitizeInput = (field: string, value: string, nested: string | null): string => {
  const key = nested ? `${nested}.${field}` : field

  switch (key) {
    // Firm Name — alphabets, spaces, dots, ampersand, hyphens (for Pvt. Ltd. & Co.)
    case "FirmName":
      return value.replace(/[^a-zA-Z\s.&\-]/g, "")

    // Email — valid email chars only
    case "email":
    case "contactPerson.email":
      return value.replace(/[^a-zA-Z0-9._%+\-@]/g, "").toLowerCase()

    // Invoice Prefix — uppercase alphabets and numbers only
    case "invoicePrefix":
      return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()

    // Website — valid URL characters
    case "website":
      return value.replace(/[^a-zA-Z0-9.:\/\-_~?#\[\]@!$&'()*+,;=%]/g, "")

    // GST Number — alphanumeric only, auto uppercase, max 15
    case "gst_no":
      return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15)

    // Address — alphabets, numbers, spaces, commas, dots, hyphens, slashes, hash
    case "add.address1":
    case "add.address2":
    case "contactPerson.address1":
    case "contactPerson.address2":
    case "address1":
    case "address2":
      return value.replace(/[^a-zA-Z0-9\s,.\-\/#]/g, "")

    // Pin Code — digits only
    case "pinCode":
    case "add.pinCode":
    case "contactPerson.pinCode":
      return value.replace(/[^0-9]/g, "")

    // Name fields — alphabets, spaces, dots only
    case "contactPerson.name":
      return value.replace(/[^a-zA-Z\s.]/g, "")

    // City, State, Country — alphabets, spaces, hyphens
    case "city":
    case "state":
    case "country":
    case "add.city":
    case "add.state":
    case "add.country":
    case "contactPerson.city":
    case "contactPerson.state":
    case "contactPerson.country":
      return value.replace(/[^a-zA-Z\s\-]/g, "")

    // TIN — digits only, exactly 11
    case "tinNo":
      return value.replace(/[^0-9]/g, "").slice(0, 11)

    // CIN — alphanumeric only, auto uppercase, exactly 21
    case "cinNo":
      return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 21)

    // UIN — alphanumeric only, auto uppercase, max 25
    case "uin":
      return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 25)

    default:
      return value
  }
}

// --- Format hints ---
const FORMAT_HINTS: Record<string, string> = {
  FirmName: "Only letters, spaces, dots, hyphens allowed (e.g. Fixl Solutions Pvt. Ltd.)",
  email: "Valid email format, e.g. contact@company.com",
  phone: "Select country code and enter digits",
  invoicePrefix: "Only uppercase letters & numbers (e.g. FIXL, INV01)",
  website: "Optional — e.g. https://www.company.com",
  gst_no: "15-digit alphanumeric GSTIN (e.g., 08ABCDE1234F1Z8)",
  address1: "Letters, numbers, spaces, commas, dots, hyphens (e.g. Tower B, Cyber Hub)",
  address2: "Optional — Floor, Suite, Area (e.g. Sector 24, Gurugram)",
  pinCode: "Only digits allowed (4–10 digits, e.g. 122002)",
  "contactPerson.name": "Only letters, spaces, dots (e.g. Rajesh Kumar)",
  "contactPerson.email": "Valid email (e.g. rajesh@company.com)",
  "contactPerson.phone": "Select country code and enter digits",
  "contactPerson.mobile": "Select country code and enter digits",
  "contactPerson.altPhone": "Optional — select country code and enter digits",
  "contactPerson.altMobile": "Optional — select country code and enter digits",
  "contactPerson.address1": "Letters, numbers, spaces, commas, dots, hyphens",
  "contactPerson.address2": "Optional — Area / Landmark",
  "contactPerson.city": "Only letters, spaces, hyphens (e.g. New Delhi)",
  "contactPerson.state": "Only letters, spaces, hyphens (e.g. Maharashtra)",
  "contactPerson.country": "Only letters, spaces, hyphens (e.g. India)",
  "contactPerson.pinCode": "Only digits allowed (4–10 digits)",
  uin: "Optional — alphanumeric UIN (e.g. UIN7894561563)",
  tinNo: "Exactly 11 digits — first 2 are state code (e.g. 27123456789)",
  cinNo: "Exactly 21 characters — format: L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits (e.g. L17110MH1973PLC019786)",
}

// --- Field label mapping ---
const FIELD_LABELS: Record<string, string> = {
  FirmName: "Firm Name",
  email: "Email",
  phone: "Phone",
  invoicePrefix: "Invoice Prefix",
  website: "Website",
  gst_no: "GST Number",
  address1: "Address Line 1",
  address2: "Address Line 2",
  pinCode: "Pin Code",
  name: "Contact Name",
  "contactPerson.name": "Contact Name",
  "contactPerson.email": "Contact Email",
  "contactPerson.phone": "Contact Phone",
  "contactPerson.mobile": "Contact Mobile",
  "contactPerson.altPhone": "Alternate Phone",
  "contactPerson.altMobile": "Alternate Mobile",
  "contactPerson.address1": "Address Line 1",
  "contactPerson.address2": "Address Line 2",
  "contactPerson.city": "City",
  "contactPerson.state": "State",
  "contactPerson.country": "Country",
  "contactPerson.pinCode": "Pin Code",
  uin: "UIN (Unique Identification Number)",
  tinNo: "TIN (Tax Identification Number)",
  cinNo: "CIN (Company Identification Number)",
}

const STORAGE_KEY = "addFirmFormDraft"

const DEFAULT_FORM = {
  FirmName: "",
  email: "",
  phone: "",
  invoicePrefix: "",
  add: { address1: "", address2: "", city: "", state: "", country: "", pinCode: "" },
  contactPerson: {
    name: "", email: "", address1: "", address2: "", city: "", state: "", pinCode: "",
    country: "", phone: "", mobile: "", altPhone: "", altMobile: ""
  },
  website: "", gst_no: "", logo: "", uin: "", tinNo: "", cinNo: ""
}

export default function AddFirmPage() {
  const params = useParams()
  const router = useRouter()
  const { addFirm } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orgName, setOrgName] = useState("")

  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [isLoaded, setIsLoaded] = useState(false)

  // Restore form data & step from sessionStorage on mount
  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName(storedOrg)

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.formData) setFormData(parsed.formData)
        if (parsed.step) setStep(parsed.step)
      }
    } catch (e) {
      console.error("Failed to load form draft", e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Persist form data & step to sessionStorage on every change
  useEffect(() => {
    if (!isLoaded) return // Don't overwrite storage with default state before loading
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, step }))
    } catch (e) {
      console.error("Failed to save form draft", e)
    }
  }, [formData, step, isLoaded])

  // --- Input handling with real-time sanitization ---
  const handleInputChange = (field: string, value: any, nested: string | null = null) => {
    // Sanitize the value based on field type before setting state
    const sanitized = typeof value === "string" ? sanitizeInput(field, value, nested) : value

    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: { ...((prev as any)[nested]), [field]: sanitized }
      }))
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[`${nested}.${field}`]
        delete updated[field]
        return updated
      })
    } else {
      setFormData(prev => ({ ...prev, [field]: sanitized }))
      setErrors(prev => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  // --- Validation per step ---
  const validateStep = () => {
    const e: Record<string, string> = {}

    if (step === 1) {
      if (!formData.FirmName.trim()) e.FirmName = "Firm Name is required."
      else if (formData.FirmName.trim().length < 3) e.FirmName = "Firm Name must be at least 3 characters."

      if (!formData.email.trim()) e.email = "Email is required."
      else if (!isValidEmail(formData.email)) e.email = "Enter a valid email (e.g. contact@company.com)."

      if (!formData.phone.trim()) e.phone = "Phone number is required."
      else if (formData.phone.replace(/[^0-9]/g, "").length < 7) e.phone = "Enter a valid phone number with country code."

      if (!formData.invoicePrefix.trim()) e.invoicePrefix = "Invoice Prefix is required."
      else if (formData.invoicePrefix.trim().length > 10) e.invoicePrefix = "Invoice Prefix should be max 10 characters."

      if (!formData.gst_no.trim()) e.gst_no = "GST Number is required."
      else if (!isValidGST(formData.gst_no)) e.gst_no = "Invalid GST number format (15 characters: State code, PAN, Entity code, 'Z', Check digit)."

      if (formData.website.trim() && !isValidUrl(formData.website)) e.website = "Enter a valid URL (e.g. https://company.com)."
    }

    if (step === 2) {
      if (!formData.add.address1.trim()) e["add.address1"] = "Address Line 1 is required."
      if (!formData.add.country) e["add.country"] = "Country is required."
      if (!formData.add.state) e["add.state"] = "State is required."
      if (!formData.add.city) e["add.city"] = "City is required."
      if (!formData.add.pinCode) e["add.pinCode"] = "Pin Code is required."
      else if (!isValidPinCode(formData.add.pinCode)) e["add.pinCode"] = "Enter a valid Pin Code (4–10 digits)."
    }

    if (step === 3) {
      // All optional, but validate format if provided
      const cp = formData.contactPerson
      if (cp.email && !isValidEmail(cp.email)) e["contactPerson.email"] = "Enter a valid email."
      if (cp.phone && cp.phone.replace(/[^0-9]/g, "").length < 7) e["contactPerson.phone"] = "Enter a valid phone number."
      if (cp.mobile && cp.mobile.replace(/[^0-9]/g, "").length < 7) e["contactPerson.mobile"] = "Enter a valid mobile number."
      if (cp.pinCode && !isValidPinCode(cp.pinCode)) e["contactPerson.pinCode"] = "Enter a valid Pin Code."
    }

    if (step === 4) {
      if (!formData.tinNo.trim()) e.tinNo = "TIN Number is required."
      else if (!isValidTIN(formData.tinNo)) e.tinNo = "TIN must be exactly 11 digits (e.g. 27123456789)."

      if (!formData.cinNo.trim()) e.cinNo = "CIN Number is required."
      else if (!isValidCIN(formData.cinNo)) e.cinNo = "CIN must be 21 chars in format L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits (e.g. L17110MH1973PLC019786)."

      if (formData.uin.trim() && !isValidUIN(formData.uin)) e.uin = "Enter a valid UIN number."
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => { if (validateStep()) setStep(prev => prev + 1) }
  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        add: {
          ...formData.add,
          pinCode: Number(formData.add.pinCode) || 0,
        },
        contactPerson: {
          ...formData.contactPerson,
          pinCode: formData.contactPerson.pinCode ? Number(formData.contactPerson.pinCode) : undefined,
        },
      }
      const response = await addNewFirm(submitData)
      addFirm(response.data)
      // Clear draft from sessionStorage on successful creation
      sessionStorage.removeItem(STORAGE_KEY)
      toast.success("Firm added successfully!")
      router.push(`/${orgName}/modules/firm-management/firms`)
    } catch (error: any) {
      // Show specific error messages
      if (error?.response?.status === 401 || error?.code === 401) {
        toast.error("Session expired. Please login again.")
        router.push("/auth/signin")
        return
      }
      const msg = error?.response?.data?.message || error?.message || "Failed to create firm"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const stepTitles = [
    { title: "Basic Info", description: "Firm details", icon: Building2 },
    { title: "Address", description: "Location info", icon: MapPin },
    { title: "Contact Person", description: "Optional contact details", icon: User },
    { title: "Compliance", description: "Legal numbers", icon: Globe },
  ]

  const breadcrumbItems = [
    { label: "All Firms", href: `/${params.orgName}/modules/firm-management/firms` },
    { label: "Add", href: `/${params.orgName}/modules/firm-management/firms/add` },
  ]

  // --- Reusable field renderer ---
  const renderField = (
    field: string,
    value: string,
    nested: string | null,
    required: boolean,
    options?: { type?: string; maxLength?: number; placeholder?: string }
  ) => {
    const errorKey = nested ? `${nested}.${field}` : field
    const hintKey = nested ? `${nested}.${field}` : field
    const labelKey = nested ? `${nested}.${field}` : field

    return (
      <div key={field}>
        <CustomLabel>
          {FIELD_LABELS[labelKey] || FIELD_LABELS[field] || field}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </CustomLabel>
        <CustomInput
          value={value}
          type={options?.type || "text"}
          maxLength={options?.maxLength}
          onChange={(e) => handleInputChange(field, e.target.value, nested)}
          placeholder={options?.placeholder || `Enter ${FIELD_LABELS[labelKey] || FIELD_LABELS[field] || field}`}
          className={errors[errorKey] ? "border-red-400 focus:ring-red-500/20 focus:border-red-500" : ""}
        />
        <p className="text-[11px] text-zinc-400 mt-0.5">{FORMAT_HINTS[hintKey] || FORMAT_HINTS[field] || ""}</p>
        {errors[errorKey] && <p className="text-red-500 text-xs mt-0.5">{errors[errorKey]}</p>}
      </div>
    )
  }

  // --- Reusable phone field renderer ---
  const renderPhoneField = (field: string, value: string, nested: string | null, required: boolean) => {
    const errorKey = nested ? `${nested}.${field}` : field
    const labelKey = nested ? `${nested}.${field}` : field

    return (
      <div key={field}>
        <CustomLabel>
          {FIELD_LABELS[labelKey] || FIELD_LABELS[field] || field}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </CustomLabel>
        <PhoneInputWithCountryCode
          value={value}
          onChange={(val) => handleInputChange(field, val, nested)}
          error={errors[errorKey]}
        />
      </div>
    )
  }

  return (
    <>
      <SubHeader
        title="Create New Firm"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="p-6 z-10 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {stepTitles.map((stepInfo, index) => {
                const stepNumber = index + 1
                const isActive = step === stepNumber
                const isCompleted = step > stepNumber
                const Icon = stepInfo.icon

                return (
                  <div key={stepNumber} className="flex-1 flex items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-3
                        ${isCompleted ? "bg-primary text-white" :
                          isActive ? "bg-accent text-accent-foreground" :
                            "bg-muted text-muted-foreground"}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <p className={`font-semibold text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {stepInfo.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{stepInfo.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className="pb-20">
            <FlatCard className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <div className="p-3 py-2 space-y-2">

                {/* Step 1 — Basic Info */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField("FirmName", formData.FirmName, null, true)}
                    {renderField("email", formData.email, null, true, { type: "email" })}
                    {renderPhoneField("phone", formData.phone, null, true)}
                    {renderField("invoicePrefix", formData.invoicePrefix, null, true, { maxLength: 10 })}
                    {renderField("website", formData.website, null, false)}
                    {renderField("gst_no", formData.gst_no, null, true, { maxLength: 15, placeholder: "22AAAAA0000A1Z5" })}
                  </div>
                )}

                {/* Step 2 — Address */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField("address1", formData.add.address1, "add", true)}
                    {renderField("address2", formData.add.address2, "add", false)}

                    <div className="col-span-2">
                      <CountryStateCityDropdown
                        initialCountry={formData.add.country}
                        initialState={formData.add.state}
                        initialCity={formData.add.city}
                        countryName="country" stateName="state" cityName="city"
                        handleChange={(e) => handleInputChange(e.target.name, e.target.value, "add")}
                      />
                      {(errors["add.country"] || errors["add.state"] || errors["add.city"]) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                          {errors["add.country"] && <p className="text-red-500 text-xs">{errors["add.country"]}</p>}
                          {errors["add.state"] && <p className="text-red-500 text-xs">{errors["add.state"]}</p>}
                          {errors["add.city"] && <p className="text-red-500 text-xs">{errors["add.city"]}</p>}
                        </div>
                      )}
                    </div>

                    {renderField("pinCode", String(formData.add.pinCode), "add", true, { maxLength: 10 })}
                  </div>
                )}

                {/* Step 3 — Contact Person (all optional) */}
                {step === 3 && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
                      All fields in this step are optional. Fill in only if a contact person is available.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderField("name", formData.contactPerson.name, "contactPerson", false)}
                      {renderField("email", formData.contactPerson.email, "contactPerson", false, { type: "email" })}
                      {renderPhoneField("phone", formData.contactPerson.phone, "contactPerson", false)}
                      {renderField("address1", formData.contactPerson.address1, "contactPerson", false)}
                      {renderField("address2", formData.contactPerson.address2, "contactPerson", false)}
                      {renderField("city", formData.contactPerson.city, "contactPerson", false)}
                      {renderField("state", formData.contactPerson.state, "contactPerson", false)}
                      {renderField("country", formData.contactPerson.country, "contactPerson", false)}
                      {renderField("pinCode", String(formData.contactPerson.pinCode), "contactPerson", false, { maxLength: 10 })}
                    </div>
                  </div>
                )}

                {/* Step 4 — Compliance */}
                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField("uin", formData.uin, null, false, { maxLength: 15 })}
                    {renderField("tinNo", formData.tinNo, null, true, { maxLength: 11 })}
                    {renderField("cinNo", formData.cinNo, null, true, { maxLength: 21 })}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  {step > 1 ? (
                    <CustomButton variant="outline" onClick={handleBack}>
                      <ArrowLeft size={16} /> Back
                    </CustomButton>
                  ) : <div />}
                  {step < 4 ? (
                    <CustomButton onClick={handleNext}>Next Step</CustomButton>
                  ) : (
                    <CustomButton onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? "Creating..." : <><Save size={16} /> Create Firm</>}
                    </CustomButton>
                  )}
                </div>
              </div>
            </FlatCard>
          </div>
        </div>
      </div>
    </>
  )
}
