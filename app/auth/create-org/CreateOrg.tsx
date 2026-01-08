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

export default function CreateOrganizationPage() {
  const router = useRouter()
  const { user, organizations, setOrganizations, addOrganization } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    }
  }, [user])

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: "" }))
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

    setErrors({})
    const newErrors: typeof errors = {}
    if (!formData.orgName.trim()) newErrors.orgName = "Organization name is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.orgCity.trim()) newErrors.orgCity = "City is required"
    if (!formData.orgState.trim()) newErrors.orgState = "State is required"
    if (!formData.orgCountry.trim()) newErrors.orgCountry = "Country is required"
    if (!formData.contactName.trim()) newErrors.contactName = "Contact Name is required"
    if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact Email is required"
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact Phone is required"

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
      showSuccess("Organization created successfully")
      router.push(`/${response.data.orgId}/dashboard`)
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
              <div className="create-org-field space-y-2">
                <Label htmlFor="orgName">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgName"
                  value={formData.orgName}
                  onChange={(e) => handleInputChange("orgName", e.target.value)}
                  placeholder="Enter organization name"
                  className="create-org-input h-11"
                />
                {errors.orgName && (
                  <p className="create-org-error text-red-500 text-sm">{errors.orgName}</p>
                )}
              </div>

              <div className="create-org-contact grid grid-cols-2 gap-4">
                <div className="create-org-field space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    placeholder="e.g., Admin"
                    className="create-org-input h-11"
                  />
                  {errors.contactName && (
                    <p className="create-org-error text-red-500 text-sm">{errors.contactName}</p>
                  )}
                </div>
                <div className="create-org-field space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    className="create-org-input h-11 cursor-not-allowed"
                  />
                  {errors.contactEmail && (
                    <p className="create-org-error text-red-500 text-sm">{errors.contactEmail}</p>
                  )}
                </div>
              </div>

              <div className="create-org-contact grid grid-cols-2 gap-4">
                <div className="create-org-field space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    className="create-org-input h-11 cursor-not-allowed"
                  />
                  {errors.contactPhone && (
                    <p className="create-org-error text-red-500 text-sm">{errors.contactPhone}</p>
                  )}
                </div>
                <div className="create-org-field space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street, Building, Area"
                    className="create-org-input h-11"
                  />
                  {errors.address && (
                    <p className="create-org-error text-red-500 text-sm">{errors.address}</p>
                  )}
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
                <p className="create-org-error text-red-500 text-sm">{errors.orgCountry}</p>
              )}
              {errors.orgState && (
                <p className="create-org-error text-red-500 text-sm">{errors.orgState}</p>
              )}
              {errors.orgCity && (
                <p className="create-org-error text-red-500 text-sm">{errors.orgCity}</p>
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
