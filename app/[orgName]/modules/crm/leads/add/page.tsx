"use client"

import { useState, useEffect } from "react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { getFirmList } from "@/hooks/firmHooks"
import { createLead } from "@/hooks/leadHooks"
import { getAllClients } from "@/hooks/clientHooks"
import { CustomSelect, CustomSelectTrigger, CustomSelectValue, CustomSelectContent, CustomSelectItem } from "@/components/custom/CustomSelect"
import { showError, showSuccess } from "@/utils/toast"
import { useLoaderStore } from "@/lib/loaderStore"
import { ArrowLeft, Building2, Users, CheckCircle, User, Mail, Phone, MapPin, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import SubHeader from "@/components/custom/SubHeader"

export default function AddLeadPage() {
  const [step, setStep] = useState(1)
  const { showLoader, hideLoader } = useLoaderStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    title: "",
    firm: "",
    contact: {
      name: "",
      email: "",
      source: "",
      client: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: {
          line1: "",
          line2: "",
          country: "",
          postalCode: "",
        },
      },
      firmId: "",
    },
  })
  const [firms, setFirms] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const router = useRouter()
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName(storedOrg)
  }, [])

  const validateForm = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors["title"] = "Title is required"
      if (!formData.firm.trim()) newErrors["firm"] = "Firm is required"
      if (!formData.contact.name.trim()) newErrors["contact.name"] = "Contact name required"
      if (!formData.contact.email.trim()) newErrors["contact.email"] = "Email required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) newErrors["contact.email"] = "Invalid email"
      if (!formData.contact.source.trim()) newErrors["contact.source"] = "Source is required"
    }

    if (step === 2) {
      const client = formData.contact.client
      const postal = client.address.postalCode
      if (!client.firstName.trim()) newErrors["contact.client.firstName"] = "First name is required"
      if (!client.lastName.trim()) newErrors["contact.client.lastName"] = "Last name is required"
      if (!client.email.trim()) newErrors["contact.client.email"] = "Email is required"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) newErrors["contact.client.email"] = "Invalid email"
      if (!client.phone.trim()) newErrors["contact.client.phone"] = "Phone is required"
      if (!client.address.line1.trim()) newErrors["contact.client.address.line1"] = "Address line 1 is required"
      if (!client.address.line2.trim()) newErrors["contact.client.address.line2"] = "Address line 2 is required"
      if (!client.address.country.trim()) newErrors["contact.client.address.country"] = "Country is required"

      if (!String(postal || "").trim()) {
        newErrors["contact.client.address.postalCode"] = "Postal code is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateForm(step)) return
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleAddLead = async () => {
    if (!validateForm(step)) return
    try {
      showLoader()
      const result = await createLead(formData)
      if (result.success) {
        showSuccess("Lead created successfully")
        router.push(`/${orgName}/modules/crm/leads`)
      } else {
        showError(`Failed: ${result.error}`)
      }
    } catch (err) {
      console.error(err)
      showError("Something went wrong.")
    } finally {
      hideLoader()
    }
  }

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        showLoader()
        const response = await getFirmList()
        setFirms(response.data?.firms || [])
      } catch (err: any) {
        console.error(err)
      } finally {
        hideLoader()
      }
    }
    fetchFirms()
  }, [showLoader, hideLoader])

  useEffect(() => {
    const fetchClients = async () => {
      try {
        showLoader()
        const response = await getAllClients()
        setClients(response.data?.clients || [])
      } catch (err) {
        console.error(err)
      } finally {
        hideLoader()
      }
    }
    fetchClients()
  }, [showLoader, hideLoader])

  const stepTitles = [
    { title: "Lead Information", icon: Building2, description: "Basic lead details" },
    { title: "Client Details", icon: Users, description: "Contact info & address" },
    { title: "Review & Submit", icon: CheckCircle, description: "Verify information" },
  ]

  return (
    <>
      <SubHeader title="Add Lead" />
      <div className="bg-white p-4 -mt-14 z-10 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <CustomButton variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft size={16} /> Back
            </CustomButton>
            <h1 className="text-xl font-bold">Create New Lead</h1>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {stepTitles.map((info, index) => {
                const stepNum = index + 1
                const Icon = info.icon
                return (
                  <div key={stepNum} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= stepNum ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      <Icon size={20} />
                    </div>
                    <p className={`text-sm font-medium ${step === stepNum ? "text-primary" : "text-muted-foreground"}`}>{info.title}</p>
                    <p className="text-xs text-muted-foreground hidden md:block">{info.description}</p>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>

          <SmallCard className="shadow-lg border-0 bg-card overflow-hidden">
            <SmallCardContent className="p-8">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <CustomLabel>Lead Title <span className="text-destructive">*</span></CustomLabel>
                    <CustomInput value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className={errors.title ? "border-destructive" : ""} />
                    {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <CustomLabel>Firm <span className="text-destructive">*</span></CustomLabel>
                    <select className={`w-full border rounded-md p-2 h-10 ${errors.firm ? "border-destructive" : "border-border"}`} value={formData.firm} onChange={(e) => setFormData(p => ({ ...p, firm: e.target.value }))}>
                      <option value="">Select Firm</option>
                      {firms.map(f => <option key={f._id} value={f._id}>{f.FirmName}</option>)}
                    </select>
                    {errors.firm && <p className="text-destructive text-xs">{errors.firm}</p>}
                  </div>
                  <div className="space-y-2">
                    <CustomLabel>Contact Name <span className="text-destructive">*</span></CustomLabel>
                    <CustomInput value={formData.contact.name} onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, name: e.target.value } }))} className={errors["contact.name"] ? "border-destructive" : ""} />
                    {errors["contact.name"] && <p className="text-destructive text-xs">{errors["contact.name"]}</p>}
                  </div>
                  <div className="space-y-2">
                    <CustomLabel>Contact Email <span className="text-destructive">*</span></CustomLabel>
                    <CustomInput value={formData.contact.email} onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))} className={errors["contact.email"] ? "border-destructive" : ""} />
                    {errors["contact.email"] && <p className="text-destructive text-xs">{errors["contact.email"]}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <CustomLabel>Source <span className="text-destructive">*</span></CustomLabel>
                    <select className={`w-full border rounded-md p-2 h-10 ${errors["contact.source"] ? "border-destructive" : "border-border"}`} value={formData.contact.source} onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, source: e.target.value } }))}>
                      <option value="">Select Source</option>
                      {["Website", "Referral", "Social Media", "Advertisement", "Event", "Cold Call", "Other"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors["contact.source"] && <p className="text-destructive text-xs">{errors["contact.source"]}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <CustomLabel className="mb-2 block">Quick-select Existing Client</CustomLabel>
                    <CustomSelect onValueChange={(clientId) => {
                      const c = clients.find(x => x._id === clientId)
                      if (c) setFormData(p => ({ ...p, contact: { ...p.contact, firmId: c._id, client: { firstName: c.firstName || "", lastName: c.lastName || "", email: c.email || "", phone: c.phone || "", address: { line1: c.address?.address1 || "", line2: c.address?.address2 || "", country: c.address?.country || "", postalCode: c.address?.pinCode || "" } } } }))
                    }}>
                      <CustomSelectTrigger><CustomSelectValue placeholder="Search clients..." /></CustomSelectTrigger>
                      <CustomSelectContent>{clients.map(c => <CustomSelectItem key={c._id} value={c._id}>{c.firstName} {c.lastName}</CustomSelectItem>)}</CustomSelectContent>
                    </CustomSelect>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2">
                    {[
                      { f: "firstName", l: "First Name" }, { f: "lastName", l: "Last Name" },
                      { f: "email", l: "Email" }, { f: "phone", l: "Phone" },
                      { f: "line1", l: "Address Line 1" }, { f: "line2", l: "Address Line 2" },
                      { f: "country", l: "Country" }, { f: "postalCode", l: "Postal Code" }
                    ].map(({ f, l }) => (
                      <div key={f} className="space-y-1">
                        <CustomLabel>{l} <span className="text-destructive">*</span></CustomLabel>
                        <CustomInput
                          value={
                            ["line1", "line2", "country", "postalCode"].includes(f)
                              ? String(formData.contact.client.address[f as keyof typeof formData.contact.client.address] || "")
                              : String(formData.contact.client[f as keyof typeof formData.contact.client] || "")
                          }
                          onChange={(e) => {
                            const val = e.target.value
                            setFormData(p => {
                              if (["line1", "line2", "country", "postalCode"].includes(f)) {
                                return { ...p, contact: { ...p.contact, client: { ...p.contact.client, address: { ...p.contact.client.address, [f]: val } } } }
                              }
                              return { ...p, contact: { ...p.contact, client: { ...p.contact.client, [f]: val } } }
                            })
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="col-span-2 pb-2 border-b"><h3 className="font-bold">Lead Information</h3></div>
                    <div><p className="text-muted-foreground">Title</p><p className="font-medium">{formData.title}</p></div>
                    <div><p className="text-muted-foreground">Firm</p><p className="font-medium">{firms.find(f => f._id === formData.firm)?.FirmName || "-"}</p></div>
                    <div><p className="text-muted-foreground">Contact</p><p className="font-medium">{formData.contact.name}</p></div>
                    <div><p className="text-muted-foreground">Source</p><p className="font-medium">{formData.contact.source}</p></div>

                    <div className="col-span-2 pb-2 border-b pt-4"><h3 className="font-bold">Client Details</h3></div>
                    <div><p className="text-muted-foreground">Name</p><p className="font-medium">{formData.contact.client.firstName} {formData.contact.client.lastName}</p></div>
                    <div><p className="text-muted-foreground">Email</p><p className="font-medium">{formData.contact.client.email}</p></div>
                    <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{formData.contact.client.phone}</p></div>
                    <div className="col-span-2"><p className="text-muted-foreground">Address</p><p className="font-medium">{formData.contact.client.address.line1}, {formData.contact.client.address.line2}, {formData.contact.client.address.country} - {formData.contact.client.address.postalCode}</p></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-12 pt-6 border-t">
                {step > 1 ? <CustomButton variant="outline" onClick={handleBack}>Previous Step</CustomButton> : <div />}
                <CustomButton onClick={step === 3 ? handleAddLead : handleNext}>
                  {step === 3 ? "Submit Lead" : "Next Step"}
                </CustomButton>
              </div>
            </SmallCardContent>
          </SmallCard>
        </div>
      </div>
    </>
  )
}