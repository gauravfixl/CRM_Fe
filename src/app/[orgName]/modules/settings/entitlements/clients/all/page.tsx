"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    UserCheck,
    ShieldCheck,
    Calendar,
    AlertCircle,
    Users,
    Target,
    PieChart,
    LayoutDashboard,
    RefreshCcw,
    Building2,
    TrendingUp,
    Mail,
    Phone,
    MapPin,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { getAllClients, deleteClient, updateClient } from "@/hooks/clientHooks"

export default function MasterClientViewPage() {
    const params = useParams()
    const router = useRouter()
    const orgName = params?.orgName as string
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [clients, setClients] = useState<any[]>([])
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [editBusy, setEditBusy] = useState(false)
    const [editForm, setEditForm] = useState({
        clientFirmName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        website: "",
    })
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All")

    const fetchClients = async () => {
        try {
            setIsFetching(true)
            const response = await getAllClients()
            const data = response?.data?.clients || []
            const activeClients = Array.isArray(data)
                ? data.filter((c: any) => !c.isDeleted && !c.deleted)
                : []
            setClients(activeClients.map((c: any) => ({
                id: c._id,
                name: c.clientFirmName || [c.firstName, c.lastName].filter(Boolean).join(" ") || "Unnamed",
                firstName: c.firstName || "",
                lastName: c.lastName || "",
                clientFirmName: c.clientFirmName || "",
                email: c.email || "",
                phone: c.phone || "",
                website: c.website || "",
                address: c.address || null,
                firm: c.firmId?.firmName || "-",
                createdAt: c.createdAt,
                status: c.deleted ? "INACTIVE" : "ACTIVE",
            })))
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch clients")
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const handleAction = async (msg: string) => {
        setIsLoading(true)
        await fetchClients()
        setIsLoading(false)
        toast.success(msg)
    }

    const handleViewDetails = (client: any) => {
        setSelectedClient(client)
        setShowDetailsDialog(true)
    }

    const handleOpenEdit = (client: any) => {
        setSelectedClient(client)
        setEditForm({
            clientFirmName: client.clientFirmName || "",
            firstName: client.firstName || "",
            lastName: client.lastName || "",
            email: client.email || "",
            phone: client.phone || "",
            website: client.website || "",
        })
        setShowEditDialog(true)
    }

    const handleSubmitEdit = async () => {
        if (!selectedClient) return
        if (!editForm.email.trim()) {
            toast.error("Email is required")
            return
        }
        if (!editForm.phone.trim()) {
            toast.error("Phone is required")
            return
        }
        const payload: Record<string, unknown> = {
            email: editForm.email.trim(),
            phone: editForm.phone.trim(),
        }
        if (editForm.clientFirmName) payload.clientFirmName = editForm.clientFirmName
        if (editForm.firstName) payload.firstName = editForm.firstName
        if (editForm.lastName) payload.lastName = editForm.lastName
        if (editForm.website) payload.website = editForm.website

        try {
            setEditBusy(true)
            await updateClient(selectedClient.id, payload)
            toast.success("Client updated")
            setShowEditDialog(false)
            await fetchClients()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update client")
        } finally {
            setEditBusy(false)
        }
    }

    const handleArchiveClient = async (client: any) => {
        try {
            await deleteClient(client.id)
            toast.success(`${client.name} archived successfully`)
            await fetchClients()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to archive client")
        }
    }

    const handleExport = () => {
        const headers = ["Name", "Firm", "Email", "Phone", "Website", "Status"]
        const rows = clients.map(c => [c.name, c.firm, c.email, c.phone, c.website, c.status])
        const csvContent = [headers.join(","), ...rows.map(r => r.map((v: any) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","))].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "clients_export.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success("Client data exported successfully")
    }

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "All" ||
            (statusFilter === "Active" && client.status === "ACTIVE") ||
            (statusFilter === "Inactive" && client.status !== "ACTIVE")
        return matchesSearch && matchesStatus
    })

    return (
        <div className="flex flex-col gap-4 p-4 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>Organization</span>
                    <span>/</span>
                    <span>Governance</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">Master Clients</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-sm font-semibold text-zinc-900">Client Management</h1>
                        <p className="text-[10px] text-zinc-500 font-medium">Monitor and manage all client accounts organization-wide.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleAction("Clients refreshed")}
                            className="h-8 rounded-lg border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => router.push(`/${orgName}/modules/settings/entitlements/clients/add`)}
                            className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                        >
                            <UserCheck className="w-3.5 h-3.5 mr-2" />
                            New Client
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none text-white rounded-xl shadow-sm">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white font-medium">Total Clients</p>
                                <p className="text-xl font-semibold text-white mt-1">{clients.length}</p>
                                <p className="text-[10px] text-white mt-1">{clients.filter(c => c.status === "ACTIVE").length} active accounts</p>
                            </div>
                            <Users className="w-4 h-4 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Enterprise Tier</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">342</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">High-value accounts</p>
                            </div>
                            <Building2 className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">$3.2M</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Annual recurring</p>
                            </div>
                            <TrendingUp className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Retention Rate</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">94.2%</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Last 12 months</p>
                            </div>
                            <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                        placeholder="Search clients..."
                        className="pl-8 h-9 bg-white border-zinc-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-lg shadow-sm hover:bg-zinc-50 text-xs"
                            >
                                <Filter className="w-3.5 h-3.5 mr-2" />
                                Filters{statusFilter !== "All" ? ` (${statusFilter})` : ""}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 shadow-sm rounded-xl">
                            <DropdownMenuLabel className="text-[10px] font-medium text-slate-500">Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer" onClick={() => setStatusFilter("All")}>
                                All {statusFilter === "All" && <CheckMark />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer" onClick={() => setStatusFilter("Active")}>
                                Active {statusFilter === "Active" && <CheckMark />}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-medium cursor-pointer" onClick={() => setStatusFilter("Inactive")}>
                                Inactive {statusFilter === "Inactive" && <CheckMark />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        className="h-8 border-zinc-200 text-blue-600 bg-white font-medium px-4 rounded-lg shadow-sm hover:bg-zinc-50 text-xs"
                        onClick={handleExport}
                    >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* MASTER DATA TABLE */}
            {isFetching ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                </div>
            ) : (
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Client</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Firm</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Phone</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Status</TableHead>
                            <TableHead className="px-4 py-3 text-right font-medium text-[10px] text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow key={client.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-semibold text-zinc-600 border border-zinc-200 transition-transform group-hover:scale-110">
                                            {(client.name || "?").split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('') || '?'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-zinc-900">{client.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{client.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className="text-xs font-medium text-zinc-700">{client.firm}</span>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className="text-xs font-medium text-zinc-700">{client.phone || "-"}</span>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <Badge className={`rounded-md text-[10px] font-medium ${client.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-100'}`}>
                                        {client.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-sm border-zinc-100 rounded-xl">
                                            <DropdownMenuItem onClick={() => handleViewDetails(client)} className="text-xs font-medium cursor-pointer">View Details</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleOpenEdit(client)} className="text-xs font-medium cursor-pointer">Edit Client</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleArchiveClient(client)} className="text-xs font-medium text-rose-600 cursor-pointer">Archive Client</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <p className="text-[10px] text-zinc-400 font-medium">Showing {filteredClients.length} of {clients.length} records</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>
            )}


            {/* CLIENT DETAILS DIALOG */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="sm:max-w-[500px] rounded-xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Client Details</DialogTitle>
                        <DialogDescription className="text-[10px] text-zinc-500">
                            View complete information for this client account.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClient && (
                        <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">{selectedClient.name}</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">{selectedClient.firm}</p>
                                </div>
                                <Badge className={`rounded-md text-[10px] font-medium ${selectedClient.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-100'}`}>
                                    {selectedClient.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                <div>
                                    <Label className="text-[10px] font-medium text-zinc-400">First Name</Label>
                                    <p className="text-xs text-zinc-700 mt-0.5">{selectedClient.firstName || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-medium text-zinc-400">Last Name</Label>
                                    <p className="text-xs text-zinc-700 mt-0.5">{selectedClient.lastName || "-"}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-xs text-zinc-700">
                                    <Mail className="w-3 h-3 text-zinc-400" /> {selectedClient.email || "-"}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-700">
                                    <Phone className="w-3 h-3 text-zinc-400" /> {selectedClient.phone || "-"}
                                </div>
                                {selectedClient.website && (
                                    <div className="flex items-center gap-2 text-xs text-zinc-700">
                                        <Building2 className="w-3 h-3 text-zinc-400" /> {selectedClient.website}
                                    </div>
                                )}
                            </div>

                            {selectedClient.address && typeof selectedClient.address === 'object' && (
                                <div className="pt-2 border-t">
                                    <Label className="text-[10px] font-medium text-zinc-400">Address</Label>
                                    <div className="flex items-start gap-2 mt-1 text-xs text-zinc-700">
                                        <MapPin className="w-3 h-3 text-zinc-400 mt-0.5" />
                                        <div>
                                            {[selectedClient.address.address1, selectedClient.address.address2, selectedClient.address.city, selectedClient.address.state, selectedClient.address.country, selectedClient.address.pinCode].filter(Boolean).join(", ") || "-"}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedClient.createdAt && (
                                <div className="pt-2 border-t">
                                    <Label className="text-[10px] font-medium text-zinc-400">Created</Label>
                                    <p className="text-xs text-zinc-700 mt-0.5">{new Date(selectedClient.createdAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="h-8 text-xs font-medium rounded-lg">
                            Close
                        </Button>
                        {selectedClient && (
                            <Button onClick={() => { setShowDetailsDialog(false); handleOpenEdit(selectedClient) }} className="h-8 text-xs font-medium rounded-lg">
                                Edit
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT CLIENT DIALOG */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[520px] rounded-xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Edit Client</DialogTitle>
                        <DialogDescription className="text-[10px] text-zinc-500">
                            Update the client's basic information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-2">
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Firm Name</Label>
                            <Input
                                value={editForm.clientFirmName}
                                onChange={(e) => setEditForm({ ...editForm, clientFirmName: e.target.value })}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-[10px] font-medium">First Name</Label>
                                <Input
                                    value={editForm.firstName}
                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                    className="h-8 text-xs"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-[10px] font-medium">Last Name</Label>
                                <Input
                                    value={editForm.lastName}
                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Email *</Label>
                            <Input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Phone *</Label>
                            <Input
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Website</Label>
                            <Input
                                value={editForm.website}
                                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                placeholder="https://"
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={editBusy} className="h-8 text-xs font-medium rounded-lg">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitEdit} disabled={editBusy} className="h-8 text-xs font-medium rounded-lg">
                            {editBusy && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CheckMark() {
    return (
        <svg className="w-3.5 h-3.5 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}
