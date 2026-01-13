
"use client"

import { useState ,useEffect} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, Save } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { addNewFirm } from "@/hooks/firmHooks"
import { CustomInput } from "@/components/custom/CustomInput"
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown"

export default function AddFirmPage() {
  const router = useRouter()
  const { addFirm } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const [orgName, setOrgName]= useState("")
    useEffect(() => {
      const storedOrg = localStorage.getItem("orgName") || "";
      setOrgName(storedOrg);
    }, []);

  // 🔹 Optimized input change handler
  const handleInputChange = (field: string, value: any, nested: string | null = null) => {
    // Filter phone fields to allow only numbers and +
    const phoneFields = ["phone", "mobile", "altPhone", "altMobile"];
    if (phoneFields.includes(field)) {
      value = value.replace(/[^0-9+]/g, "")
    }

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
      if (!formData.FirmName || formData.FirmName.trim().length < 3) newErrors.FirmName = "Firm Name must be at least 3 characters."
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required."
      if (!formData.phone) newErrors.phone = "Phone is required."
      else if (!/^[0-9+]+$/.test(formData.phone)) newErrors.phone = "Phone can only contain numbers and +"
      if (!formData.invoicePrefix) newErrors.invoicePrefix = "Invoice prefix is required."
      if (!formData.gst_no) newErrors.gst_no = "GST No is required."
    }

    if (step === 2) {
      if (!formData.add.address1) newErrors.address1 = "Address 1 is required."
      if (!formData.add.address2) newErrors.address2 = "Address 2 is required."
      if (!formData.add.city) newErrors.city = "City is required."
      if (!formData.add.state) newErrors.state = "State is required."
      if (!formData.add.country) newErrors.country = "Country is required."
      if (!formData.add.pinCode) newErrors.pinCode = "Pin Code is required."
    }

    if (step === 3) {
      // Optional: validate contact person phones
    const cp = formData.contactPerson;
["phone", "mobile", "altPhone", "altMobile"].forEach(field => {
  const value = cp[field as keyof typeof cp];
  if (value && !/^[0-9+]+$/.test(value)) {
    newErrors[field] = `${field} can only contain numbers and +`;
  }
});

    }

    if (step === 4) {
      if (!formData.tinNo) newErrors.tinNo = "TIN No is required."
      if (!formData.cinNo) newErrors.cinNo = "CIN No is required."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (step < 4) handleNext()
    }
  }

  const handleNext = () => {
    if (validateStep()) setStep(prev => prev + 1)
  }

  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    setIsLoading(true)
    const newFirm = { ...formData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), isDeleted: false }

    try {
      const response = await addNewFirm(newFirm)
      addFirm(response.data)
      toast.success("Firm added successfully!")
      router.push(`/${orgName}/modules/firm-management/firms`)
    } catch (error: any) {
      toast.error(error.message || "Failed to create firm")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 add-firm-page">
      <div className="flex items-center space-x-2">
        <Link href={`/${orgName}/modules/firm-management/firms`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Firms
          </Button>
        </Link>
      </div>

      <Card className="add-firm-card">
        <CardHeader>
          <CardTitle className="flex items-center ">
            <Building className="mr-2 h-5 w-5" /> Add New Firm
          </CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 add-firm-form" onKeyDown={handleKeyDown}>

            {/* Step 1 */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4 add-firm-step-1">
                {[{ field: "FirmName", label: "Firm Name", required: true },
                  { field: "email", label: "Email", type: "email", required: true },
                  { field: "phone", label: "Phone", type: "tel", required: true },
                  { field: "invoicePrefix", label: "Invoice Prefix", required: true },
                  { field: "website", label: "Website" },
                  { field: "gst_no", label: "GST No", required: true }
                ].map(({ field, label, type, required }) => (
                  <div key={field} className="flex flex-col">
                    <CustomInput
                      label={required ? <>{label} <span className="text-red-500">*</span></> : label}
                      type={type as any}
                      value={(formData as any)[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Step 2 */}
            {/* {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label={<>Address 1 <span className="text-red-500">*</span></>}
                  value={formData.add.address1}
                  onChange={(e) => handleInputChange("address1", e.target.value, "add")}
                />
                {errors.address1 && <p className="text-red-500 text-sm">{errors.address1}</p>}

                <CustomInput
                  label={<>Address 2 <span className="text-red-500">*</span></>}
                  value={formData.add.address2}
                  onChange={(e) => handleInputChange("address2", e.target.value, "add")}
                />
                {errors.address2 && <p className="text-red-500 text-sm">{errors.address2}</p>}

                <div className="col-span-2">
                  <CountryStateCityDropdown
                    initialCountry={formData.add.country}
                    initialState={formData.add.state}
                    initialCity={formData.add.city}
                    countryName="country"
                    stateName="state"
                    cityName="city"
                    handleChange={(e) => handleInputChange(e.target.name, e.target.value, "add")}
                  />
                </div>
                <CustomInput
                  label="Pin Code"
                  value={formData.add.pinCode}
                  onChange={(e) => handleInputChange("pinCode", Number(e.target.value), "add")}
                />
              </div>
            )} */}
{step === 2 && (
  <div className="grid grid-cols-2 gap-4 add-firm-step-2">
    {/* Address 1 */}
    <div className="flex flex-col">
      <CustomInput
        label={
          <>
            Address 1 <span className="text-red-500">*</span>
          </>
        }
        value={formData.add.address1}
        onChange={(e) => handleInputChange("address1", e.target.value, "add")}
      />
      {errors.address1 && (
        <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
      )}
    </div>

    {/* Address 2 */}
    <div className="flex flex-col">
      <CustomInput
        label={
          <>
            Address 2 <span className="text-red-500">*</span>
          </>
        }
        value={formData.add.address2}
        onChange={(e) => handleInputChange("address2", e.target.value, "add")}
      />
      {errors.address2 && (
        <p className="text-red-500 text-sm mt-1">{errors.address2}</p>
      )}
    </div>

    {/* Country/State/City Dropdown full width */}
    <div className="col-span-2">
      <CountryStateCityDropdown
        initialCountry={formData.add.country}
        initialState={formData.add.state}
        initialCity={formData.add.city}
        countryName="country"
        stateName="state"
        cityName="city"
        handleChange={(e) =>
          handleInputChange(e.target.name, e.target.value, "add")
        }
      />
    </div>

    {/* Pin Code */}
    <CustomInput
      label="Pin Code"
      value={formData.add.pinCode}
      onChange={(e) => handleInputChange("pinCode", Number(e.target.value), "add")}
    />
  </div>
)}

            {/* Step 3 */}
        {step === 3 && (
  <div className="add-firm-step-3">
    <p>Contact Person (Optional)</p>
    <div className="grid grid-cols-2 gap-x-2  ">
      {Object.keys(formData.contactPerson).map((field) => (
        <div key={field} className="flex flex-col">
          <CustomInput
            label={field.replace(/([A-Z])/g, " $1")}
            type={["phone", "mobile", "altPhone", "altMobile"].includes(field) ? "tel" : "text"}
            value={(formData.contactPerson as any)[field]}
            onChange={(e) =>
              handleInputChange(field, e.target.value, "contactPerson")
            }
          />
          {errors[field] && (
            <p className="text-red-500 text-sm">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  </div>
)}


            {/* Step 4 */}
            {step === 4 && (
              <div className="grid grid-cols-2 gap-4 add-firm-step-4">
                {["uin", "tinNo", "cinNo"].map(field => (
                  <div key={field} className="flex flex-col">
                    <CustomInput
                      label={["tinNo", "cinNo"].includes(field) ? <>{field.toUpperCase()} <span className="text-red-500">*</span></> : field.toUpperCase()}
                      value={(formData as any)[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between add-firm-page-controls">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
              ) : <div />}
              {step < 4 ? (
                <Button type="button" onClick={handleNext}>Next</Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : <><Save className="mr-2 h-4 w-4" /> Create Firm</>}
                </Button>
              )}
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
