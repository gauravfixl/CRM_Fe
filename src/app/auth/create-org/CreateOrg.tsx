"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/useAuthStore"
import { showSuccess, showError } from "@/utils/toast"
import { createOrg } from "@/hooks/orgHooks"
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown"
import { ErrorMessage } from "@/components/custom/ErrorMessage"

// Helper to get border class based on field validity
function getInputBorderClass(value: string, error: string | undefined, touched: boolean): string {
  if (error) return "border-red-500 focus-visible:ring-red-500"
  if (touched && value.trim()) return "border-green-500 focus-visible:ring-green-500"
  return ""
}

export default function CreateOrganizationPage() {
  const router = useRouter()
  const { user, organizations, setOrganizations, addOrganization } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    orgCity: "",
    orgState: "",
    orgCountry: "",
    logoFile: null as File | null,
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactEmail: user.email || "",
        contactPhone: user.phone || "",
      }))
      // Mark pre-filled fields as touched
      setTouchedFields(prev => ({
        ...prev,
        contactEmail: true,
        contactPhone: true,
      }))
    }
  }, [user])

  // Real-time field validation
  const validateField = (field: string, value: string) => {
    let error = ""

    switch (field) {
      case "orgName":
        if (!value.trim()) {
          error = "Organization name is required"
        } else if (/\d/.test(value)) {
          error = "Organization name cannot contain numbers"
        }
        break
      case "contactName":
        if (!value.trim()) {
          error = "Contact name is required"
        } else if (!/^[A-Za-z\s]+$/.test(value.trim())) {
          error = "Only alphabets are allowed"
        }
        break
      case "contactEmail":
        if (!value.trim()) {
          error = "Contact email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email (e.g. user@example.com)"
        }
        break
      case "contactPhone":
        if (!value.trim()) {
          error = "Contact phone is required"
        }
        break
      case "address":
        if (!value.trim()) {
          error = "Address is required"
        } else if (value.trim().length < 10) {
          error = "Address must be at least 10 characters"
        } else if (!/^[A-Za-z0-9\s,.:\-]+$/.test(value.trim())) {
          error = "Only alphabets, numbers and , . : - are allowed"
        }
        break
      case "orgCountry":
        if (!value.trim()) {
          error = "Country is required"
        }
        break
      case "orgState":
        if (!value.trim()) {
          error = "State is required"
        }
        break
      case "orgCity":
        if (!value.trim()) {
          error = "City is required"
        }
        break
    }

    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouchedFields(prev => ({ ...prev, [field]: true }))

    if (typeof value === "string") {
      validateField(field, value)
    } else {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Only allow alphabets in contact name
  const handleContactNameInput = (value: string) => {
    const filtered = value.replace(/[^A-Za-z\s]/g, "")
    handleInputChange("contactName", filtered)
  }

  // Filter out numbers from org name
  const handleOrgNameInput = (value: string) => {
    const filtered = value.replace(/\d/g, "")
    handleInputChange("orgName", filtered)
  }

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    if (typeof formData[field as keyof typeof formData] === "string") {
      validateField(field, formData[field as keyof typeof formData] as string)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange("logoFile", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.orgName.trim()) newErrors.orgName = "Organization name is required"
    else if (/\d/.test(formData.orgName)) newErrors.orgName = "Organization name cannot contain numbers"
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required"
    else if (!/^[A-Za-z\s]+$/.test(formData.contactName.trim())) newErrors.contactName = "Only alphabets are allowed"
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail.trim())) newErrors.contactEmail = "Please enter a valid email"
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    else if (formData.address.trim().length < 10) newErrors.address = "Address must be at least 10 characters"
    else if (!/^[A-Za-z0-9\s,.:\-]+$/.test(formData.address.trim())) newErrors.address = "Only alphabets, numbers and , . : - are allowed"
    if (!formData.orgCountry.trim()) newErrors.orgCountry = "Country is required"
    if (!formData.orgState.trim()) newErrors.orgState = "State is required"
    if (!formData.orgCity.trim()) newErrors.orgCity = "City is required"

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    Object.keys(formData).forEach(key => (allTouched[key] = true))
    setTouchedFields(allTouched)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const newOrg = {
        name: formData.orgName,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: formData.address,
        orgCity: formData.orgCity,
        orgState: formData.orgState,
        orgCountry: formData.orgCountry,
        logo: avatarPreview || null,
      }

      const response = await createOrg(newOrg)
      addOrganization(response.data)
      showSuccess("Organization created successfully! Please sign in to continue.")
      router.push("/auth/signin")
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Failed to create organization"
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-org-page min-h-screen flex items-center justify-center bg-[#1e293b] p-4">
      <div className="create-org-wrapper w-full max-w-md">
        <Card className="create-org-card shadow-2xl border-0">
          <CardHeader className="create-org-header space-y-4 text-center">
            <div className="create-org-logo-wrapper flex justify-center">
              <div className="create-org-logo relative w-24 h-24">
                <Avatar className="create-org-avatar w-24 h-24 mx-auto border-4 border-white shadow-md">
                  {avatarPreview ? (
                    <AvatarImage
                      src={avatarPreview}
                      alt="org logo"
                      className="create-org-avatar-image"
                    />
                  ) : (
                    <AvatarFallback className="create-org-avatar-fallback bg-blue-600 text-white text-lg">
                      <Building2 className="create-org-icon w-6 h-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  className="create-org-file-input absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleLogoChange}
                />
              </div>
            </div>
            <div className="create-org-header-text">
              <CardTitle className="create-org-title text-2xl font-bold text-blue-600">
                Create Your Organization
              </CardTitle>
              <CardDescription className="create-org-subtitle text-gray-600">
                Set up your organization to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="create-org-content space-y-6">
            <form onSubmit={handleCreateOrg} className="create-org-form space-y-4">
              {/* Organization Name */}
              <div className="create-org-field space-y-2">
                <Label htmlFor="orgName">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgName"
                  value={formData.orgName}
                  onChange={(e) => handleOrgNameInput(e.target.value)}
                  onBlur={() => handleBlur("orgName")}
                  placeholder="Enter organization name"
                  className={`create-org-input h-11 ${getInputBorderClass(formData.orgName, errors.orgName, touchedFields.orgName)}`}
                />
                {touchedFields.orgName && !errors.orgName && formData.orgName.trim() ? (
                  <p className="text-xs text-green-600 mt-1">Looks good!</p>
                ) : (
                  <ErrorMessage message={errors.orgName} />
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">Numbers are not allowed</p>
              </div>

              <div className="create-org-contact grid grid-cols-2 gap-4">
                {/* Contact Name */}
                <div className="create-org-field space-y-2">
                  <Label htmlFor="contactName">Contact Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleContactNameInput(e.target.value)}
                    onBlur={() => handleBlur("contactName")}
                    placeholder="e.g., Admin"
                    className={`create-org-input h-11 ${getInputBorderClass(formData.contactName, errors.contactName, touchedFields.contactName)}`}
                  />
                  {touchedFields.contactName && !errors.contactName && formData.contactName.trim() ? (
                    <p className="text-xs text-green-600 mt-1">Looks good!</p>
                  ) : (
                    <ErrorMessage message={errors.contactName} />
                  )}
                  <p className="text-[10px] text-gray-400 mt-0.5">Only alphabets allowed</p>
                </div>

                {/* Contact Email (pre-filled, read-only) */}
                <div className="create-org-field space-y-2">
                  <Label htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    readOnly
                    className={`create-org-input h-11 cursor-not-allowed bg-gray-50 ${getInputBorderClass(formData.contactEmail, errors.contactEmail, touchedFields.contactEmail)}`}
                  />
                  {touchedFields.contactEmail && !errors.contactEmail && formData.contactEmail.trim() ? (
                    <p className="text-xs text-green-600 mt-1">Pre-filled from your account</p>
                  ) : (
                    <ErrorMessage message={errors.contactEmail} />
                  )}
                </div>
              </div>

              <div className="create-org-contact grid grid-cols-2 gap-4">
                {/* Contact Phone (pre-filled, read-only) */}
                <div className="create-org-field space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone <span className="text-red-500">*</span></Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    readOnly
                    className={`create-org-input h-11 cursor-not-allowed bg-gray-50 ${getInputBorderClass(formData.contactPhone, errors.contactPhone, touchedFields.contactPhone)}`}
                  />
                  {touchedFields.contactPhone && !errors.contactPhone && formData.contactPhone.trim() ? (
                    <p className="text-xs text-green-600 mt-1">Pre-filled from your account</p>
                  ) : (
                    <ErrorMessage message={errors.contactPhone} />
                  )}
                </div>

                {/* Address */}
                <div className="create-org-field space-y-2">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    onBlur={() => handleBlur("address")}
                    placeholder="Street, Building, Area"
                    className={`create-org-input h-11 ${getInputBorderClass(formData.address, errors.address, touchedFields.address)}`}
                  />
                  {touchedFields.address && !errors.address && formData.address.trim() ? (
                    <p className="text-xs text-green-600 mt-1">Looks good!</p>
                  ) : (
                    <ErrorMessage message={errors.address} />
                  )}
                  <p className="text-[10px] text-gray-400 mt-0.5">Min 10 characters, alphabets, numbers and , . : - allowed (no special characters like @, $, %, &, *, /, \, #)</p>
                </div>
              </div>

              <CountryStateCityDropdown
                initialCountry={formData.orgCountry}
                initialState={formData.orgState}
                initialCity={formData.orgCity}
                handleChange={(e) => {
                  handleInputChange(e.target.name, e.target.value)
                }}
                countryName="orgCountry"
                stateName="orgState"
                cityName="orgCity"
              />
              {errors.orgCountry && (
                <p className="create-org-error text-red-500 text-xs mt-1">{errors.orgCountry}</p>
              )}
              {errors.orgState && (
                <p className="create-org-error text-red-500 text-xs mt-1">{errors.orgState}</p>
              )}
              {errors.orgCity && (
                <p className="create-org-error text-red-500 text-xs mt-1">{errors.orgCity}</p>
              )}

              <Button
                type="submit"
                className="create-org-submit w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Organization..." : "Create Organization"}
              </Button>
            </form>

            <div className="create-org-footer text-center">
              <p className="text-sm text-gray-600">
                Want to go back?{" "}
                <Link href="/auth/signup" className="create-org-return text-blue-600 hover:underline">
                  Return to Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
