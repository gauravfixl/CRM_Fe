"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreVertical,
  Users,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Search,
  Filter,
  RefreshCcw,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Eye,
  Edit3,
  ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
        ])
        setClients(clientsRes.data?.clients || [])
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

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const total = clients.length
    const active = clients.filter(c => !c.deleted).length
    const newThisMonth = clients.filter(c => {
      const created = new Date(c.createdAt)
      const monthStart = new Date()
      monthStart.setDate(1)
      return created >= monthStart
    }).length

    return [
      {
        label: "Total Accounts",
        value: total,
        icon: Users,
        gradient: "from-blue-600 via-blue-700 to-indigo-800",
        shadow: "shadow-blue-200/50",
        iconBg: "bg-white/20"
      },
      {
        label: "Active Relationships",
        value: active,
        icon: ShieldCheck,
        gradient: "from-emerald-500 via-teal-600 to-cyan-700",
        shadow: "shadow-emerald-200/50",
        iconBg: "bg-white/20"
      },
      {
        label: "New Partners",
        value: newThisMonth,
        icon: TrendingUp,
        gradient: "from-purple-600 via-fuchsia-600 to-indigo-700",
        shadow: "shadow-purple-200/50",
        iconBg: "bg-white/20"
      },
      {
        label: "Retention Rate",
        value: "98.2%",
        icon: Briefcase,
        gradient: "from-orange-500 via-rose-500 to-red-600",
        shadow: "shadow-orange-200/50",
        iconBg: "bg-white/20"
      },
    ]
  }, [clients])

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
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. Page Header - Sticky */}
      <div className="sticky top-0 bg-white border-b px-6 py-4 shadow-sm z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              Global Client Directory
            </h1>
            <p className="text-sm text-zinc-500 font-normal italic">Centralized intelligence for all active B2B relationships.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="outline"
              className="h-9 font-black uppercase text-[10px] tracking-widest rounded-xl"
              onClick={() => { setLoading(true); getAllClients().then(r => setClients(r.data.clients)).finally(() => setLoading(false)) }}
            >
              <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Force Sync
            </Button>
            <Permission module="client" action="CREATE_CLIENT">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-blue-200"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Enterprise Client
              </Button>
            </Permission>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 2. SUPER VIBRANT STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.shadow} border-0 flex flex-col justify-between h-32 group cursor-default`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform duration-700" />
              <div className="flex items-center justify-between z-10">
                <div className={`p-2.5 rounded-xl ${stat.iconBg} backdrop-blur-md`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
              </div>
              <div className="z-10 mt-auto">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. Filter & Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/30">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search by name, firm or contact..."
                  className="pl-9 h-10 font-bold text-xs border-zinc-200 bg-white focus-visible:ring-blue-500 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className={`h-10 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl border-zinc-200 ${showDeleted ? 'bg-rose-50 text-rose-600 border-rose-100' : ''}`}
                onClick={() => setShowDeleted(!showDeleted)}
              >
                <Filter className="mr-2 h-3.5 w-3.5" />
                {showDeleted ? 'Showing Deleted' : 'Filter: Active Only'}
              </Button>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] pl-6 py-4"></TableHead>
                  <TableHead className="text-[10px] font-black text-zinc-400 uppercase py-4 tracking-widest">Client Identity</TableHead>
                  <TableHead className="text-[10px] font-black text-zinc-400 uppercase py-4 tracking-widest">Firm Info</TableHead>
                  <TableHead className="text-[10px] font-black text-zinc-400 uppercase py-4 tracking-widest">Contact Details</TableHead>
                  <TableHead className="text-[10px] font-black text-zinc-400 uppercase py-4 tracking-widest">Status</TableHead>
                  <TableHead className="text-[10px] font-black text-zinc-400 uppercase py-4 tracking-widest text-right pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {currentClients.length > 0 ? (
                    currentClients.map((client, idx) => (
                      <motion.tr
                        key={client._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * idx }}
                        className="group hover:bg-zinc-50/50 transition-colors border-b last:border-0"
                      >
                        <TableCell className="pl-6 py-4">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors uppercase italic">
                            {client.firstName?.[0]}{client.lastName?.[0]}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-zinc-900 italic tracking-tight group-hover:text-blue-600 transition-colors">
                              {client.firstName} {client.lastName}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1.5 mt-1">
                              <Briefcase className="h-3 w-3" /> Firm ID: {client.firmId?.slice(-6) || 'UNCATEGORIZED'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-xs font-bold text-zinc-600 uppercase italic">{client.clientFirmName || "N/A"}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                              <Mail className="w-3 h-3 text-zinc-300" /> {client.email}
                            </span>
                            <span className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                              <Phone className="w-3 h-3 text-zinc-300" /> {client.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${client.deleted ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {client.deleted ? 'Archived' : 'Active Partner'}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Link href={`/${orgName}/modules/crm/clients/${client._id}`}>
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                  <MoreVertical className="h-4 w-4 text-zinc-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100 p-2 rounded-xl">
                                <DropdownMenuItem asChild className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer">
                                  <Link href={`/${orgName}/modules/crm/clients/${client._id}/edit`}>
                                    <Edit3 className="w-3.5 h-3.5" /> Edit Account
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" /> Remove Partner
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="p-4 rounded-full bg-zinc-50">
                            <Search className="h-10 w-10 text-zinc-200" />
                          </div>
                          <p className="text-sm font-bold text-zinc-400 uppercase italic tracking-widest">No clients found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
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
