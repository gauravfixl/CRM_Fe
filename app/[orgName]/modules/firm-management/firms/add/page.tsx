

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Building2, Globe, User, Save, MapPin } from "lucide-react"
import { toast } from "sonner"
import { useAppStore } from "@/lib/store"
import { addNewFirm } from "@/hooks/firmHooks"
import { SmallCard } from "@/components/custom/SmallCard"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomLabel } from "@/components/custom/CustomLabel"
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown"
import { Breadcrumb } from "@/components/custom/CustomBreadCrumb"
import { FlatCard } from "@/components/custom/FlatCard"
import SubHeader from "@/components/custom/SubHeader"

export default function AddFirmPage() {
  const params = useParams()
  const router = useRouter()
  const { addFirm } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orgName, setOrgName] = useState("")

  const [formData, setFormData] = useState({
    FirmName: "",
    email: "",
    phone: "",
    invoicePrefix: "",
    add: { address1: "", address2: "", city: "", state: "", country: "", pinCode: 0 },
    contactPerson: {
      name: "", email: "", address1: "", address2: "", city: "", state: "", pinCode: 0,
      country: "", phone: "", mobile: "", altPhone: "", altMobile: ""
    },
    website: "", gst_no: "", logo: "", uin: "", tinNo: "", cinNo: ""
  })

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName(storedOrg)
  }, [])

  // --- Logic for input handling ---
  const handleInputChange = (field: string, value: any, nested: string | null = null) => {
    const phoneFields = ["phone", "mobile", "altPhone", "altMobile"]
    if (phoneFields.includes(field)) value = value.replace(/[^0-9+]/g, "")

    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: { ...(prev[nested] as any), [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }

    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.FirmName) newErrors.FirmName = "Firm Name is required."
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required."
      if (!formData.phone) newErrors.phone = "Phone is required."
      if (!formData.invoicePrefix) newErrors.invoicePrefix = "Invoice prefix is required."
      if (!formData.gst_no) newErrors.gst_no = "GST No is required."
    }
    if (step === 2) {
      if (!formData.add.address1) newErrors.address1 = "Address 1 required."
      if (!formData.add.city) newErrors.city = "City required."
      if (!formData.add.state) newErrors.state = "State required."
      if (!formData.add.country) newErrors.country = "Country required."
      if (!formData.add.pinCode) newErrors.pinCode = "Pin Code required."
    }
    if (step === 4) {
      if (!formData.tinNo) newErrors.tinNo = "TIN No required."
      if (!formData.cinNo) newErrors.cinNo = "CIN No required."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(prev => prev + 1)
  }
  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    setIsLoading(true)
    try {
      const response = await addNewFirm(formData)
      addFirm(response.data)
      toast.success("Firm added successfully!")
      router.push(`/${orgName}/modules/firm-management/firms`)
    } catch (error: any) {
      toast.error(error.message || "Failed to create firm")
    } finally {
      setIsLoading(false)
    }
  }

  // Step titles
  const stepTitles = [
    { title: "Basic Info", description: "Firm details", icon: Building2 },
    { title: "Address", description: "Location info", icon: MapPin },
    { title: "Contact Person", description: "Optional contact details", icon: User },
    { title: "Compliance", description: "Legal numbers", icon: Globe },
  ]

  // Required fields mapping
  const requiredFields = {
    step1: ["FirmName", "email", "phone", "invoicePrefix", "gst_no"],
    step2: ["address1", "city", "state", "country", "pinCode"],
    step4: ["tinNo", "cinNo"],
  }
const breadcrumbItems = [
  { label: "All Firms", href: `/${params.orgName}/modules/firm-management/firms` },
  { label: "Add", href: `/${params.orgId}/modules/firm-management/firms/add` },
]

  return (
    <>
   <SubHeader
  title="Create New Firm"
  breadcrumbItems={breadcrumbItems}
/>


      <div className="p-2 -mt-14 z-10   bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
        
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
        {/* Left part: Icon/Number */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mr-3
            ${isCompleted ? "bg-primary text-white" :
              isActive ? "bg-accent text-accent-foreground" :
                "bg-muted text-muted-foreground"}`}
        >
          <Icon size={20} />
        </div>

        {/* Right part: Title & Description */}
        <div className="flex flex-col">
          <p className={` font-semibold text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
            {stepInfo.title}
          </p>
          <p className="text-xs text-muted-foreground">{stepInfo.description}</p>
        </div>
      </div>
    )
  })}
</div>


            {/* Progress bar */}
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className="h-[50vh]    ">
            <FlatCard className="shadow-xl border-0 bg-card/80 backdrop-blur-sm   overflow-hidden overflow-y-auto hide-scrollbar ">
              <div className="p-3 py-2 space-y-2">
                {/* Step 1 */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["FirmName", "email", "phone", "invoicePrefix", "website", "gst_no"].map(field => (
                      <div key={field}>
                        <CustomLabel>
                          {field}
                          {requiredFields.step1.includes(field) && <span className="text-red-500"> *</span>}
                        </CustomLabel>
                        <CustomInput
                          value={(formData as any)[field]}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          placeholder={`Enter ${field}`}
                        />
                        {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <CustomLabel>
                        Address 1 {requiredFields.step2.includes("address1") && <span className="text-red-500"> *</span>}
                      </CustomLabel>
                      <CustomInput
                        value={formData.add.address1}
                        onChange={(e) => handleInputChange("address1", e.target.value, "add")}
                      />
                      {errors.address1 && <p className="text-red-500 text-sm">{errors.address1}</p>}
                    </div>

                    <div>
                      <CustomLabel>Address 2</CustomLabel>
                      <CustomInput
                        value={formData.add.address2}
                        onChange={(e) => handleInputChange("address2", e.target.value, "add")}
                      />
                    </div>

                    <div className="col-span-2">
                      <CountryStateCityDropdown
                        initialCountry={formData.add.country}
                        initialState={formData.add.state}
                        initialCity={formData.add.city}
                        countryName="country" stateName="state" cityName="city"
                        handleChange={(e) => handleInputChange(e.target.name, e.target.value, "add")}
                      />
                    </div>

                    <div>
                      <CustomLabel>
                        Pin Code {requiredFields.step2.includes("pinCode") && <span className="text-red-500"> *</span>}
                      </CustomLabel>
                      <CustomInput
                        value={formData.add.pinCode}
                        onChange={(e) => handleInputChange("pinCode", Number(e.target.value), "add")}
                      />
                      {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(formData.contactPerson).map(field => (
                      <CustomInput
                        key={field}
                        label={field}
                        value={(formData.contactPerson as any)[field]}
                        onChange={(e) => handleInputChange(field, e.target.value, "contactPerson")}
                      />
                    ))}
                  </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["uin", "tinNo", "cinNo"].map(field => (
                      <div key={field}>
                        <CustomLabel>
                          {field}
                          {requiredFields.step4.includes(field) && <span className="text-red-500"> *</span>}
                        </CustomLabel>
                        <CustomInput
                          value={(formData as any)[field]}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                        />
                        {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                      </div>
                    ))}
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
