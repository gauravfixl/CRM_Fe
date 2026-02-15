
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { getClientById, updateClient } from "@/hooks/clientHooks"

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [client, setClient] = useState<any>(null)
   const [orgName, setOrgName]= useState("")
useEffect(() => {
   const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);

  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    clientFirmName: "",
    firstName: "",
    lastName: "",
    website: "",
    email: "",
    phone: "",
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      pinCode: 0,
      country: ""
    },
    contactPerson: {
      name: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pinCode: 0,
      country: "",
      phone: "",
      mobile: "",
      altPhone: "",
      altMobile: ""
    },
    taxId: "",
    tinNo: "",
    cinNo: "",
    firmId: ""
  })

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getClientById(params.id as string)
        if (response?.data?.client) setClient(response.data.client)
      } catch (err) {
        console.error("Error fetching client:", err)
      }
    }
    if (params.id) fetchClient()
  }, [params.id])

  useEffect(() => {
    if (client) {
      setFormData({
        clientFirmName: client.clientFirmName || "",
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        website: client.website || "",
        email: client.email || "",
        phone: client.phone || "",
        address: {
          address1: client.address.address1 || "",
          address2: client.address.address2 || "",
          city: client.address.city || "",
          state: client.address.state || "",
          pinCode: client.address.pinCode || 0,
          country: client.address.country || ""
        },
        contactPerson: {
          name: client.contactPerson.name || "",
          email: client.contactPerson.email || "",
          address1: client.contactPerson.address1 || "",
          address2: client.contactPerson.address2 || "",
          city: client.contactPerson.city || "",
          state: client.contactPerson.state || "",
          pinCode: client.contactPerson.pinCode || 0,
          country: client.contactPerson.country || "",
          phone: client.contactPerson.phone || "",
          mobile: client.contactPerson.mobile || "",
          altPhone: client.contactPerson.altPhone || "",
          altMobile: client.contactPerson.altMobile || ""
        },
        taxId: client.taxId || "",
        tinNo: client.tinNo || "",
        cinNo: client.cinNo || "",
        firmId: client.firmId._id || ""
      })
    }
  }, [client])

  const handleNestedChange = (path: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev }
      const keys = path.split(".")
      let obj: any = updated
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
    await updateClient(params.id as string, {
  ...formData,
  phone: String(formData.phone),
  contactPerson: {
    ...formData.contactPerson,
    phone: String(formData.contactPerson.phone || ""),
    mobile: String(formData.contactPerson.mobile || ""),
    altPhone: String(formData.contactPerson.altPhone || ""),
    altMobile: String(formData.contactPerson.altMobile || ""),
  }
})

      toast({ title: "Success", description: "Client updated successfully" })
      router.push(`/${orgName}/modules/crm/clients/${params.id}`)
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to update client", variant: "destructive" })
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  if (!client) return (
    <div className="flex items-center justify-center h-96 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Client Not Found</h2>
        <p className="text-muted-foreground">The client you're trying to edit doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href={`${orgName}/modules/crm/clients`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 edit-client-page p-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${orgName}/modules/crm/clients/${client.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      
      </div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Client</h1>

      <Card className="edit-client-form">
        <CardHeader>
          <CardTitle>Edit Client - Step {step}/4</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 edit-client-step-1">
                <Input placeholder="Firm Name *" value={formData.clientFirmName} onChange={(e) => setFormData({ ...formData, clientFirmName: e.target.value })} required />
                <Input placeholder="First Name *" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                <Input placeholder="Last Name *" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                <Input placeholder="Email *" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <Input placeholder="Website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                <Input placeholder="Phone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
            )}

            {/* Step 2: Firm Address */}
            {step === 2 && (
              <div className="space-y-4 edit-client-step-2">
                <h3 className="font-semibold">Firm Address</h3>
                <Input placeholder="Address1" value={formData.address.address1} onChange={(e) => handleNestedChange("address.address1", e.target.value)} />
                <Input placeholder="Address2" value={formData.address.address2} onChange={(e) => handleNestedChange("address.address2", e.target.value)} />
                <Input placeholder="City" value={formData.address.city} onChange={(e) => handleNestedChange("address.city", e.target.value)} />
                <Input placeholder="State" value={formData.address.state} onChange={(e) => handleNestedChange("address.state", e.target.value)} />
                <Input placeholder="Pin Code" type="number" value={formData.address.pinCode} onChange={(e) => handleNestedChange("address.pinCode", parseInt(e.target.value) || 0)} />
                <Input placeholder="Country" value={formData.address.country} onChange={(e) => handleNestedChange("address.country", e.target.value)} />
              </div>
            )}

            {/* Step 3: Contact Person */}
            {step === 3 && (
              <div className="space-y-4 edit-client-step-3">
                <h3 className="font-semibold">Contact Person</h3>
                <Input placeholder="Name" value={formData.contactPerson.name} onChange={(e) => handleNestedChange("contactPerson.name", e.target.value)} />
                <Input placeholder="Email" value={formData.contactPerson.email} onChange={(e) => handleNestedChange("contactPerson.email", e.target.value)} />
                <Input placeholder="Phone" value={formData.contactPerson.phone} onChange={(e) => handleNestedChange("contactPerson.phone", e.target.value)} />
                <Input placeholder="Mobile" value={formData.contactPerson.mobile} onChange={(e) => handleNestedChange("contactPerson.mobile", e.target.value)} />
                <Input placeholder="Alt Phone" value={formData.contactPerson.altPhone} onChange={(e) => handleNestedChange("contactPerson.altPhone", e.target.value)} />
                <Input placeholder="Alt Mobile" value={formData.contactPerson.altMobile} onChange={(e) => handleNestedChange("contactPerson.altMobile", e.target.value)} />
                <Input placeholder="Address1" value={formData.contactPerson.address1} onChange={(e) => handleNestedChange("contactPerson.address1", e.target.value)} />
                <Input placeholder="Address2" value={formData.contactPerson.address2} onChange={(e) => handleNestedChange("contactPerson.address2", e.target.value)} />
                <Input placeholder="City" value={formData.contactPerson.city} onChange={(e) => handleNestedChange("contactPerson.city", e.target.value)} />
                <Input placeholder="State" value={formData.contactPerson.state} onChange={(e) => handleNestedChange("contactPerson.state", e.target.value)} />
                <Input placeholder="Pin Code" type="number" value={formData.contactPerson.pinCode} onChange={(e) => handleNestedChange("contactPerson.pinCode", parseInt(e.target.value) || 0)} />
                <Input placeholder="Country" value={formData.contactPerson.country} onChange={(e) => handleNestedChange("contactPerson.country", e.target.value)} />
              </div>
            )}

            {/* Step 4: Tax & Registration */}
            {step === 4 && (
              <div className="space-y-4 edit-client-step-4">
                <h3 className="font-semibold">Tax & Registration</h3>
                <Input placeholder="Tax ID" value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
                <Input placeholder="TIN No" value={formData.tinNo} onChange={(e) => setFormData({ ...formData, tinNo: e.target.value })} />
                <Input placeholder="CIN No" value={formData.cinNo} onChange={(e) => setFormData({ ...formData, cinNo: e.target.value })} />
                <Input placeholder="Firm ID" value={formData.firmId} onChange={(e) => setFormData({ ...formData, firmId: e.target.value })} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4 navigation-btns-client">
              {step > 1 && <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>}
              {step < 4 && <Button type="button" onClick={nextStep}>Next</Button>}
              {step === 4 && <Button type="submit"><Save className="mr-2 h-4 w-4" />Update Client</Button>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
