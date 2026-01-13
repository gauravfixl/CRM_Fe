
"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CustomButton } from '@/components/custom/CustomButton'
import { FlatCard, FlatCardContent, FlatCardHeader, FlatCardTitle } from '@/components/custom/FlatCard'
import { useAppStore } from '@/lib/store'
import { type Firm } from '@/lib/store'
import { useRouter } from "next/navigation"
import { updateFirm } from '@/hooks/firmHooks'
import { CustomInput } from '@/components/custom/CustomInput'
import { CustomTextarea } from '@/components/custom/CustomTextArea'
import { showSuccess } from '@/utils/toast'
import { ArrowLeft } from 'lucide-react'
import CountryStateCityDropdown from '@/components/custom/CountryStateCityDropDown'
import { useLoaderStore } from '@/lib/loaderStore'
import { Breadcrumb } from '@/components/custom/CustomBreadCrumb'
import { useSearchParams } from 'next/navigation'
import SubHeader from '@/components/custom/SubHeader'
const EditFirmPage = () => {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "firms"

  const params = useParams()
  const { id } = useParams()
  const firmId = id as string
  const firms = useAppStore(state => state.firms)
  const router = useRouter()
  const [orgName, setOrgName] = useState("")
  const { showLoader, hideLoader } = useLoaderStore()
  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);


  const [firm, setFirm] = useState<Firm | null>(null)
  const [step, setStep] = useState<number>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const totalSteps = 4

  useEffect(() => {
    const selected = firms.find(f => f._id === firmId)
    if (selected) {
      setFirm({
        ...selected,
        contactPerson: selected.contactPerson || {},
        add: selected.add || {}
      })
    } else setFirm(null)
  }, [firmId, firms])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (!firm) return

    const fieldParts = name.split(".")
    const fieldName = fieldParts.pop() || ''
    const parent = fieldParts[0] || ''

    let newValue: any = value

    // Explicit number conversion only for specific fields
    if (parent === "add" && fieldName === "pinCode" && value !== '') {
      newValue = Number(value)
    } else if (parent === "contactPerson" && ["pinCode", "mobile", "altPhone", "altMobile"].includes(fieldName) && value !== '') {
      newValue = Number(value)
    }

    if (parent === "contactPerson") {
      setFirm(prev => prev ? {
        ...prev,
        contactPerson: { ...prev.contactPerson, [fieldName]: newValue }
      } : prev)
    } else if (parent === "add") {
      setFirm(prev => prev ? {
        ...prev,
        add: { ...prev.add, [fieldName]: newValue }
      } : prev)
    } else {
      setFirm(prev => prev ? { ...prev, [fieldName]: newValue } : prev)
    }
  }


  const validateStep = () => {
    if (!firm) return false
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!firm.FirmName || firm.FirmName.trim().length < 3) newErrors.FirmName = "Firm Name must be at least 3 characters."
      if (!firm.email || !/\S+@\S+\.\S+/.test(firm.email)) newErrors.email = "Valid email is required."
      if (!firm.phone) newErrors.phone = "Phone is required."
      if (!firm.gst_no) newErrors.gst_no = "GST No is required."
    }

    if (step === 2) {
      // const cp = firm.contactPerson || {}
      // if (!cp.name) newErrors.name = "Full Name is required."
      // if (!cp.email) newErrors.email = "Email is required."
    }

    if (step === 3) {
      const add = firm.add || {}
      if (!add.address1) newErrors.address1 = "Address 1 is required."
      if (!add.city) newErrors.city = "City is required."
      if (!add.state) newErrors.state = "State is required."
      if (!add.country) newErrors.country = "Country is required."
      if (!add.pinCode) newErrors.pinCode = "Pin Code is required."
    }

    if (step === 4) {
      if (!firm.tinNo) newErrors.tinNo = "TIN No is required."
      if (!firm.cinNo) newErrors.cinNo = "CIN No is required."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setStep(prev => prev + 1)
  }

  const handleBack = () => setStep(prev => prev - 1)

  const handleSave = async () => {
    if (!firm) return
    if (!validateStep()) return

    try {
      await updateFirm(firm, firmId)
      showSuccess("Firm updated successfully.")
      router.push(`/${orgName}/modules/firm-management/firms`)
    } catch (err) {
      console.error(err)
    }
  }
  const breadcrumbItems = [
    from === "firms"
      ? { label: "All Firms", href: `/${params.orgName}/modules/firm-management/firms` }
      : { label: "View", href: `/${params.orgName}/modules/firm-management/firms/${firmId}` },
    { label: "Edit", href: `/${params.orgName}/modules/firm-management/firms/${params.firmId}/edit` }
  ]

  // if (!firm) return showLoader()

  return (
    <>
      <SubHeader title="Edit Firm" breadcrumbItems={breadcrumbItems}></SubHeader>
      <div className="p-6 -mt-24 z-10 ">


        <FlatCard className="overflow-y-auto h-[60vh] hide-scrollbar bg-white ">
          <FlatCardHeader>

            <FlatCardTitle className="edit-firm-form ">Edit Firm: {firm?.FirmName}</FlatCardTitle>
          </FlatCardHeader>
          <FlatCardContent className="space-y-6">

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 edit-firm-step-1">
                {[
                  { field: "FirmName", label: "Firm Name", required: true },
                  { field: "website", label: "Website" },
                  { field: "phone", label: "Phone", required: true },
                  { field: "email", label: "Email", required: true },
                  { field: "gst_no", label: "GST No", required: true },
                  { field: "tinNo", label: "TIN No" },
                  { field: "cinNo", label: "CIN No" },
                  { field: "uin", label: "UIN" }
                ].map(({ field, label, required }) => (
                  <div key={field}>
                    <CustomInput
                      label={required ? <>{label} <span className="text-red-500">*</span></> : label}
                      name={field}
                      value={(firm as any)?.[field] || ''}
                      onChange={handleChange}
                      type={field === "phone" ? "text" : undefined} // top-level phone as string
                    />
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                ))}
                <div>
                  <CustomTextarea
                    label="Description"
                    name="description"
                    value={firm?.description || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Person */}
            {step === 2 && (

              <div className="edit-firm-step-2"><p>Contact Person(optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {["name", "phone", "email", "address1", "address2", "city", "state", "country", "pinCode"].map(field => (
                    <div key={field}>
                      <CustomInput
                        label={field.replace(/([A-Z])/g, " $1")}
                        name={`contactPerson.${field}`}
                        value={(firm?.contactPerson as any)[field] || ''}
                        onChange={handleChange}
                        type={field === "phone" ? "text" : undefined} // contactPerson.phone stays string
                      />


                      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                    </div>
                  ))}
                </div></div>

            )}

            {/* Step 3: Address */}
            {/* Step 3: Address */}
            {step === 3 && (
              <div className="edit-firm-step-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address1 and Address2 remain normal inputs */}
                  {["address1", "address2", "pinCode"].map(field => (
                    <div key={field}>
                      <CustomInput
                        label={field.replace(/([A-Z])/g, " $1")}
                        name={`add.${field}`}
                        value={(firm?.add as any)[field] || ''}
                        onChange={handleChange}
                      />
                      {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                    </div>
                  ))}

                </div>
                <div>

                  {/* Country-State-City Dropdown */}
                  <CountryStateCityDropdown
                    initialCountry={firm?.add.country || ''}
                    initialState={firm?.add.state || ''}
                    initialCity={firm?.add.city || ''}
                    countryName="country"
                    stateName="state"
                    cityName="city"
                    handleChange={(e: any) =>
                      handleChange({
                        target: { ...e.target, name: `add.${e.target.name}` },
                      } as any)
                    }
                  />
                  {["country", "state", "city"].map(field => (
                    errors[field] && <p key={field} className="text-red-500 text-sm">{errors[field]}</p>
                  ))}
                </div>
              </div>
            )}


            {/* Step 4: Preview */}
            {step === 4 && (
              <div className="space-y-4 edit-firm-preview-step-4">
                <h2 className="text-lg font-medium">Preview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <CustomInput label="Firm Name" value={firm?.FirmName} readOnly />
                  <CustomInput label="Website" value={firm?.website} readOnly />
                  <CustomInput label="Phone" value={firm?.phone} readOnly />
                  <CustomInput label="Email" value={firm?.email} readOnly />
                </div>
              </div>
            )}

            {/* Navigation CustomButtons */}
            <div className="flex justify-between mt-4 edit-firm-page-controls">
              {step > 1 && <CustomButton variant="outline" onClick={handleBack}>Previous</CustomButton>}
              {step < totalSteps && <CustomButton onClick={handleNext}>Next</CustomButton>}
              {step === totalSteps && <CustomButton onClick={handleSave}>Submit</CustomButton>}
            </div>
          </FlatCardContent>
        </FlatCard>
      </div>
    </>
  )
}

export default EditFirmPage
