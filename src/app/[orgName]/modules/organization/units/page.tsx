"use client"

import { Network, Plus, Search, MoreVertical, Users, User, ChevronRight, Filter, Building2, LayoutGrid, List, Mail, Phone, MapPin, Globe, UserCheck, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect } from "react"
import { axiosInstance } from "@/lib/axios"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BusinessUnits() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [loading, setLoading] = useState(false)
    const [units, setUnits] = useState<any[]>([])
    
    // Create Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({
        FirmName: "",
        email: "",
        phone: "",
        contactPerson: "",
        add: "",
        website: "",
        gst_no: "",
        cinNo: "",
        invoicePrefix: ""
    })

    const fetchFirms = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get("/firm/getAllFirm")
            setUnits(res.data?.firms || [])
        } catch (error: any) {
            console.error("Error fetching firms:", error)
            toast.error("Failed to load business units. Please check your connection.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFirms()
    }, [])

    const handleNameChange = (val: string) => {
        if (/\d/.test(val)) {
            toast.error("Business Unit Name should not contain numbers")
            return
        }
        setFormData({ ...formData, FirmName: val })
    }

    const handleCreateFirm = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!formData.FirmName.trim()) return toast.error("Unit name is required")
        if (/\d/.test(formData.FirmName)) return toast.error("Unit name cannot contain numbers")
        if (!formData.email.trim() || !emailRegex.test(formData.email)) return toast.error("Valid email is required")
        if (!formData.phone.trim()) return toast.error("Phone number is required")
        if (!formData.contactPerson.trim()) return toast.error("Unit manager name is required")

        setIsCreating(true)
        try {
            await axiosInstance.post("/firm/create", formData)
            toast.success("Business Unit created successfully!")
            setIsDialogOpen(false)
            setFormData({
                FirmName: "",
                email: "",
                phone: "",
                contactPerson: "",
                add: "",
                website: "",
                gst_no: "",
                cinNo: "",
                invoicePrefix: ""
            })
            fetchFirms()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create business unit")
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="relative min-h-screen">
            <SubHeader
                title="Business Units"
                breadcrumbItems={[
                    { label: "Home", href: "/" },
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Business Units", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                            {viewMode === 'grid' ? <List className="w-4 h-4 mr-2" /> : <LayoutGrid className="w-4 h-4 mr-2" />}
                            {viewMode === 'grid' ? 'List View' : 'Grid View'}
                        </CustomButton>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <CustomButton size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    Add Business Unit
                                </CustomButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                                <div className="h-2 bg-blue-600 w-full" />
                                <div className="p-6 sm:p-8 space-y-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                            <Building2 className="w-6 h-6 text-blue-600" />
                                            Create Business Unit
                                        </DialogTitle>
                                        <DialogDescription className="font-medium">
                                            Add a new operational unit or firm to your organization.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleCreateFirm} className="grid grid-cols-2 gap-5">
                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-xs uppercase font-bold text-zinc-500">Unit Name</Label>
                                            <Input 
                                                required
                                                placeholder="e.g. Sales & Marketing" 
                                                className="h-11 rounded-xl bg-zinc-50"
                                                value={formData.FirmName}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-zinc-500">Official Email</Label>
                                            <Input 
                                                required
                                                type="email"
                                                placeholder="admin@unit.com" 
                                                className="h-11 rounded-xl bg-zinc-50"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-zinc-500">Contact Number</Label>
                                            <Input 
                                                required
                                                placeholder="+91 XXXXX XXXXX" 
                                                className="h-11 rounded-xl bg-zinc-50"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-zinc-500">Unit Manager</Label>
                                            <Input 
                                                required
                                                placeholder="Enter manager name" 
                                                className="h-11 rounded-xl bg-zinc-50"
                                                value={formData.contactPerson}
                                                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold text-zinc-500">Invoice Prefix</Label>
                                            <Input 
                                                placeholder="e.g. INV-SM" 
                                                className="h-11 rounded-xl bg-zinc-50"
                                                value={formData.invoicePrefix}
                                                onChange={(e) => setFormData({...formData, invoicePrefix: e.target.value})}
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-xs uppercase font-bold text-zinc-500">Address</Label>
                                            <Input 
                                                placeholder="Full office address" 
                                                className="h-11 rounded-xl bg-zinc-50"
                                                value={formData.add}
                                                onChange={(e) => setFormData({...formData, add: e.target.value})}
                                            />
                                        </div>

                                        <div className="pt-4 col-span-2 flex gap-3">
                                            <CustomButton type="button" variant="ghost" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </CustomButton>
                                            <CustomButton 
                                                type="submit" 
                                                disabled={isCreating}
                                                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 shadow-lg transition-all active:scale-95"
                                            >
                                                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Unit"}
                                            </CustomButton>
                                        </div>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="p-4 md:p-6 space-y-4">
                {/* Filters Bar */}
                <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <CustomInput
                            placeholder="Search business units..."
                            className="pl-10 h-9 bg-zinc-50 border-zinc-100"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 cursor-pointer">All Units</Badge>
                        <Badge variant="secondary" className="bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 cursor-pointer">Corporate</Badge>
                        <Badge variant="secondary" className="bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 cursor-pointer">Operations</Badge>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-220px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                            <p className="font-medium">Fetching units...</p>
                        </div>
                    ) : units.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-3xl text-zinc-400 bg-zinc-50/50">
                            <Building2 className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-bold text-zinc-500">No Business Units Found</p>
                            <p className="text-sm">Click "Add Business Unit" to create your first operational unit.</p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {units.map((unit) => (
                                <SmallCard key={unit._id} className="group hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-white">
                                    <SmallCardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                                <Network className="w-5 h-5" />
                                            </div>
                                            <button className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-zinc-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{unit.FirmName}</h3>
                                            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                                                <Mail className="w-3 h-3" />
                                                {unit.email}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="h-7 w-7 border">
                                                    <AvatarFallback className="text-[10px] font-bold bg-zinc-100 italic">{(unit.contactPerson?.[0] || "U").toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-zinc-800 truncate">{unit.contactPerson}</p>
                                                    <p className="text-[10px] text-zinc-400">Unit Manager</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-zinc-900">{unit.phone.slice(-4)}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Contact Ext</p>
                                            </div>
                                        </div>
                                    </SmallCardContent>
                                </SmallCard>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left font-outfit">
                                <thead className="bg-zinc-50/50 border-b">
                                    <tr className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Unit Name</th>
                                        <th className="px-6 py-4">Manager</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Invoice Prefix</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {units.map((unit) => (
                                        <tr key={unit._id} className="hover:bg-zinc-50/50 transition-colors group text-sm">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer">{unit.FirmName}</span>
                                                    <span className="text-[10px] text-zinc-400">{unit._id.slice(-8)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6 border">
                                                        <AvatarFallback className="text-[8px] font-bold">{(unit.contactPerson?.[0] || "U").toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-zinc-700">{unit.contactPerson}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 font-medium">{unit.email}</td>
                                            <td className="px-6 py-4 text-zinc-500 font-medium">{unit.phone}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-bold border-0">{unit.invoicePrefix || "N/A"}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-4 h-4" />
                                                </CustomButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}
