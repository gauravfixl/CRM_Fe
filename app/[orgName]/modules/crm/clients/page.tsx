"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { getAllClients, deleteClient, restoreClient, addClient, getClientsActivity, getClientById } from "@/hooks/clientHooks"
import { showSuccess } from "@/utils/toast"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLoaderStore } from "@/lib/loaderStore"
import { getAllFirmsList } from "@/hooks/firmHooks"
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown"
import SubHeader from "@/components/custom/SubHeader"
import { Permission } from "@/components/custom/Permission"

const INITIAL_FORM_DATA = {
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
};

export default function ClientsPage() {
  const { clients, setClients } = useAppStore()
  const { toast } = useToast()
  const { showLoader, hideLoader } = useLoaderStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [firms, setFirms] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [errors, setErrors] = useState<any>({})
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [currentPage, setCurrentPage] = useState(1)
  const [orgName, setOrgName] = useState("")

  const rowsPerPage = 10

  useEffect(() => {
    setOrgName(localStorage.getItem("orgName") || "")
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        showLoader()
        const [clientsRes, firmsRes] = await Promise.all([
          getAllClients(),
          getAllFirmsList(),
          getClientsActivity()
        ])
        setClients(clientsRes.data.clients)
        setFirms(firmsRes.data?.firms || [])
      } catch (err) {
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" })
      } finally {
        setLoading(false)
        hideLoader()
      }
    }
    fetchInitialData()
  }, [setClients, showLoader, hideLoader, toast])

  const filteredClients = clients.filter(c => {
    const lowerSearch = searchTerm.toLowerCase()
    const matches =
      (c.firstName && c.firstName.toLowerCase().includes(lowerSearch)) ||
      (c.contactPerson?.name && c.contactPerson.name.toLowerCase().includes(lowerSearch))
    const matchesDeleted = showDeleted ? c.deleted : !c.deleted
    return matches && matchesDeleted
  })

  const totalPages = Math.ceil(filteredClients.length / rowsPerPage)
  const currentClients = filteredClients.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const validateStep = (step: number) => {
    const newErrors: any = {}
    if (step === 1) {
      if (!formData.clientFirmName) newErrors.clientFirmName = "Required"
      if (!formData.firstName) newErrors.firstName = "Required"
      if (!formData.lastName) newErrors.lastName = "Required"
      if (!formData.email) newErrors.email = "Required"
      if (!formData.phone) newErrors.phone = "Required"
      if (!formData.firmId) newErrors.firmId = "Required"
    } else if (step === 2) {
      const { address } = formData
      if (!address.address1) newErrors.address1 = "Required"
      if (!address.city) newErrors.city = "Required"
      if (!address.state) newErrors.state = "Required"
      if (!address.country) newErrors.country = "Required"
      if (!address.pinCode) newErrors.pinCode = "Required"
    } else if (step === 4) {
      if (!formData.taxId) newErrors.taxId = "Required"
      if (!formData.tinNo) newErrors.tinNo = "Required"
      if (!formData.cinNo) newErrors.cinNo = "Required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) return
    try {
      showLoader()
      await addClient(formData)
      showSuccess("Client added successfully")
      setIsAddDialogOpen(false)
      setFormData(INITIAL_FORM_DATA)
      setCurrentStep(1)
      const res = await getAllClients()
      setClients(res.data.clients)
    } catch (error) {
      toast({ title: "Error", description: "Failed to add client", variant: "destructive" })
    } finally {
      hideLoader()
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) setCurrentStep(prev => prev + 1)
  }

  return (
    <div className="w-full">
      <SubHeader
        title="Clients"
        rightControls={
          <Permission module="client" action="CREATE_CLIENT">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-white text-primary hover:bg-primary hover:text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </Permission>
        }
      />

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant={showDeleted ? "default" : "outline"} onClick={() => setShowDeleted(!showDeleted)}>
                {showDeleted ? "View Active" : "View Deleted"}
              </Button>
            </div>

            <Permission module="client" action="VIEW_ONLY">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentClients.map(client => (
                      <TableRow key={client._id}>
                        <TableCell>
                          <input type="radio" checked={selectedClientId === client._id} onChange={() => setSelectedClientId(client._id || null)} />
                        </TableCell>
                        <TableCell>{client.firstName} {client.lastName}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>
                          <DropdownMenu open={dropdownOpen === client._id} onOpenChange={open => setDropdownOpen(open ? (client._id || null) : null)}>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {client.deleted ? (
                                <DropdownMenuItem onClick={async () => {
                                  if (!client._id) return;
                                  showLoader(); await restoreClient(client._id);
                                  const r = await getAllClients(); setClients(r.data.clients); hideLoader();
                                }}>Restore</DropdownMenuItem>
                              ) : (
                                <>
                                  <DropdownMenuItem asChild><Link href={`/${orgName}/modules/crm/clients/${client._id}`}>View</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link href={`/${orgName}/modules/crm/clients/${client._id}/edit`}>Edit</Link></DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-500" onClick={() => { setClientToDelete(client._id || null); setIsDeleteDialogOpen(true); }}>Delete</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentClients.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No clients found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Permission>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Step {currentStep} of 4</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4">
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Firm Name *</Label>
                  <Input value={formData.clientFirmName} onChange={e => setFormData({ ...formData, clientFirmName: e.target.value })} />
                </div>
                <div>
                  <Label>First Name *</Label>
                  <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label>Assigned Firm *</Label>
                  <Select value={formData.firmId} onValueChange={v => setFormData({ ...formData, firmId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select firm" /></SelectTrigger>
                    <SelectContent>{firms.map(f => <SelectItem key={f._id} value={f._id}>{f.FirmName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label>Address Details *</Label>
                <Input placeholder="Address 1" value={formData.address.address1} onChange={e => setFormData({ ...formData, address: { ...formData.address, address1: e.target.value } })} />
                <CountryStateCityDropdown
                  initialCountry={formData.address.country}
                  initialState={formData.address.state}
                  initialCity={formData.address.city}
                  handleChange={e => setFormData({ ...formData, address: { ...formData.address, [e.target.name]: e.target.value } })}
                />
                <Input placeholder="Pin Code" value={formData.address.pinCode || ""} onChange={e => setFormData({ ...formData, address: { ...formData.address, pinCode: Number(e.target.value) } })} />
              </div>
            )}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <Label className="col-span-2">Contact Person Details</Label>
                {Object.keys(formData.contactPerson).filter(k => !k.includes('address')).map(key => (
                  <div key={key}>
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <Input value={formData.contactPerson[key as keyof typeof formData.contactPerson]} onChange={e => setFormData({ ...formData, contactPerson: { ...formData.contactPerson, [key]: e.target.value } })} />
                  </div>
                ))}
              </div>
            )}
            {currentStep === 4 && (
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Tax ID *</Label><Input value={formData.taxId} onChange={e => setFormData({ ...formData, taxId: e.target.value })} /></div>
                <div><Label>TIN No *</Label><Input value={formData.tinNo} onChange={e => setFormData({ ...formData, tinNo: e.target.value })} /></div>
                <div><Label>CIN No *</Label><Input value={formData.cinNo} onChange={e => setFormData({ ...formData, cinNo: e.target.value })} /></div>
              </div>
            )}
            <DialogFooter>
              {currentStep > 1 && <Button type="button" variant="outline" onClick={() => setCurrentStep(s => s - 1)}>Back</Button>}
              {currentStep < 4 ? <Button type="button" onClick={nextStep}>Next</Button> : <Button type="submit">Create</Button>}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle><DialogDescription>Are you sure you want to delete this client?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={async () => {
              if (clientToDelete) {
                showLoader(); await deleteClient(clientToDelete);
                const r = await getAllClients(); setClients(r.data.clients);
                hideLoader(); setIsDeleteDialogOpen(false);
              }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
