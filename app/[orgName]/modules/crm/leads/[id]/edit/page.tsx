
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from "sonner"
import { useLoaderStore } from "@/lib/loaderStore"
import { getLeadById, updateLead } from "@/hooks/leadHooks"
import { showSuccess } from "@/utils/toast"
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown"

export default function EditLeadPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string
  const [orgName, setOrgName]= useState("")
  useEffect(() => {
     const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);
  const { showLoader, hideLoader } = useLoaderStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [lead, setLead] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    name: "",
  
    email: "",
    phone: "",
    company: "",
    position: "",
    status: "New",
    value: 0,
    source: "",
    assignedTo: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    currency: "INR",
    nextAction: "",
    nextActionDate: "",
    priority: "High",
    notes: "",
    tags: "",
  })
  const [errors, setErrors] = useState<any>({})

  function mapLeadResponse(apiLead: any) {
    return {
      id: apiLead._id,
    firstName: apiLead.contact?.client?.firstName || apiLead.contact?.name?.split(" ")[0] || "",
lastName: apiLead.contact?.client?.lastName || apiLead.contact?.name?.split(" ")[1] || "",

      email: apiLead.contact?.email || "",
      phone: apiLead.contact?.phone || "",
      company: apiLead.firm?.FirmName || "",
      status: apiLead.stage || "New",
      value: apiLead.value || 0,
      source: apiLead.source || "",
      assignedTo: apiLead.assignedTo?.email || "",
      position: apiLead.contact?.position || "",
      line1: apiLead.contact?.client?.address?.line1 || "",
      line2: apiLead.contact?.client?.address?.line2 || "",
      city: apiLead.contact?.client?.address?.city || "",
      state: apiLead.contact?.client?.address?.state || "",
      country: apiLead.contact?.client?.address?.country || "",
      postalCode: apiLead.contact?.client?.address?.postalCode || "",
      currency: apiLead.currency || "INR",
      nextAction: apiLead.nextAction || "",
      nextActionDate: apiLead.nextActionDate || "",
      priority: apiLead.priority || "High",
      notes: (apiLead.notes || []).join(", "),
      tags: (apiLead.tags || []).join(", "),
      firmId: apiLead.firm?._id
      
    }
  }

  useEffect(() => {
    const fetchLead = async () => {
      try {
        showLoader()
        const response = await getLeadById(leadId)
        if (response.data) {
          setLead(mapLeadResponse(response.data.lead))
        } else {
          setLead(null)
        }
      } catch (err) {
        console.error("Error fetching lead:", err)
        setLead(null)
      } finally {
        hideLoader()
      }
    }
    if (leadId) fetchLead()
  }, [leadId, showLoader, hideLoader])

  useEffect(() => {
    if (lead) setFormData(lead)
  }, [lead])

  function validateStep(step: number) {
    const newErrors: any = {}
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
       if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.company) newErrors.company = "Company is required"
    }
    if (step === 2) {
      if (!formData.line1) newErrors.line1 = "Address line 1 is required"
      if (!formData.city) newErrors.city = "City is required"
    }
    if (step === 3) {
      if (!formData.status) newErrors.status = "Status is required"
      if (!formData.priority) newErrors.priority = "Priority is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((s) => s + 1)
  }

  const handlePrev = () => {
    setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsLoading(true)

    const payload = {
      title: formData.company,
      description: "",
      firm: formData.firmId,
      contact: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position || "VP of Engineering",
        client: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
          }
        },
        source: formData.source,
        firmId: formData.firmId,
      },
      stage: formData.status,
      estimatedValue: formData.value,
      currency: formData.currency,
      nextAction: formData.nextAction,
      nextActionDate: formData.nextActionDate || new Date().toISOString(),
      priority: formData.priority,
      notes: formData.notes.split(",").map((n: string) => n.trim()),
      tags: formData.tags.split(",").map((t: string) => t.trim()),
      createClient: true
    }

    try {
      await updateLead(leadId, payload)
      showSuccess("Lead updated successfully!")
      router.push(`/${orgName}/modules/crm/leads/${leadId}`)
    } catch (err) {
      console.error("Failed to update lead:", err)
      toast.error("Failed to update lead.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!lead) {
    return (
      <Card>
        <CardContent className="p-8 text-center">Lead not found.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 editt-lead-page">
      <div className="flex items-center space-x-2">
        <Link href={`/${orgName}/modules/crm/leads/${leadId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lead
          </Button>
        </Link>
      </div>

      <Card className="edit-lead-card">
        <CardHeader>
          <CardTitle>Edit Lead</CardTitle>
          <CardDescription>Update lead information step by step</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 edit-lead-form">
            
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4 edit-lead-step-1">
                <div>
                  <Label>First Name <span className="text-red-500">*</span></Label>
                  <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Enter both first and last name" />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                   <div>
                  <Label>Last Name <span className="text-red-500">*</span></Label>
                  <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Enter both first and last name" />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
                <div>
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <Label>Company <span className="text-red-500">*</span></Label>
                  <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                </div>
                <div>
                  <Label>Position</Label>
                  <Input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                </div>
              </div>
            )}

            {/* STEP 2: Address */}
            {/* {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Address Line 1 <span className="text-red-500">*</span></Label>
                  <Input value={formData.line1} onChange={(e) => setFormData({ ...formData, line1: e.target.value })} />
                  {errors.line1 && <p className="text-red-500 text-sm">{errors.line1}</p>}
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input value={formData.line2} onChange={(e) => setFormData({ ...formData, line2: e.target.value })} />
                </div>
                <div>
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>State</Label>
                    <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                </div>
              </div>
            )} */}
            {currentStep === 2 && (
  <div className="space-y-4 edit-lead-step-2">
    {/* Address Line 1 */}
    <div>
      <Label>
        Address Line 1 <span className="text-red-500">*</span>
      </Label>
      <Input
        value={formData.line1}
        onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
      />
      {errors.line1 && <p className="text-red-500 text-sm">{errors.line1}</p>}
    </div>

    {/* Address Line 2 */}
    <div>
      <Label>Address Line 2</Label>
      <Input
        value={formData.line2}
        onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
      />
    </div>

    {/* Country, State, City Dropdown */}
    <CountryStateCityDropdown
      initialCountry={formData.country}
      initialState={formData.state}
      initialCity={formData.city}
      handleChange={(e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value })
      }
      countryName="country"
      stateName="state"
      cityName="city"
    />
    {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

    {/* Postal Code */}
    <div>
      <Label>Postal Code</Label>
      <Input
        value={formData.postalCode}
        onChange={(e) =>
          setFormData({ ...formData, postalCode: e.target.value })
        }
      />
    </div>
  </div>
)}


            {/* STEP 3: Lead Details */}
            {currentStep === 3 && (
              <div className="space-y-4 edit-lead-step-3">
            
               <div>
  <Label>Value</Label>
  <Input
    type="number"
    min={0}
    value={formData.value}
    onKeyDown={(e) => {
      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
    }}
    onChange={(e) => {
      const newValue = Number(e.target.value);
      setFormData({
        ...formData,
        value: isNaN(newValue) || newValue < 0 ? 0 : newValue,
      });
    }}
  />
</div>

                <div>
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                </div>
                <div>
                  <Label>Notes (comma separated)</Label>
                  <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </div>
            )}

            <div className="flex justify-between edit-lead-page-controls">
              {currentStep > 1 && <Button variant="outline" type="button" onClick={handlePrev}>Previous</Button>}
              {currentStep < 3 && <Button type="button" onClick={handleNext}>Next</Button>}
              {currentStep === 3 && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : (<><Save className="mr-2 h-4 w-4" />Save Changes</>)}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
