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
import { getAllClients, deleteClient } from "@/hooks/clientHooks"

export default function MasterClientViewPage() {
    const params = useParams()
    const router = useRouter()
    const orgName = params?.orgName as string
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [clients, setClients] = useState<any[]>([])
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All")

    const fetchClients = async () => {
        try {
            setIsFetching(true)
            const response = await getAllClients()
            const data = response?.data?.data || response?.data || []
            const activeClients = Array.isArray(data)
                ? data.filter((c: any) => !c.isDeleted && !c.deleted)
                : []
            setClients(activeClients.map((c: any) => ({
                id: c._id,
                name: c.clientFirmName || c.name || "",
                email: c.email || "",
                phone: c.phone || "",
                address: c.address || "",
                contactPerson: c.contactPerson || "",
                status: c.status || "ACTIVE",
                tier: c.tier || "Standard",
                revenue: c.revenue || "$0",
                manager: c.contactPerson || "Unassigned",
                stage: c.stage || "Active",
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
        const headers = ["Name", "Email", "Phone", "Address", "Status", "Tier", "Revenue", "Manager", "Stage"]
        const rows = clients.map(c => [c.name, c.email, c.phone, c.address, c.status, c.tier, c.revenue, c.manager, c.stage])
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
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
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-white font-medium">Total Clients</p>
                        <Users className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-white">{clients.length}</p>
                        <p className="text-[10px] text-white">{clients.filter(c => c.status === "ACTIVE").length} active accounts</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl p-4">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500 font-medium">Enterprise Tier</p>
                        <Building2 className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">342</p>
                        <p className="text-[10px] text-zinc-400 font-medium">High-value accounts</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl p-4">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
                        <TrendingUp className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">$3.2M</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Annual recurring</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl p-4">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500 font-medium">Retention Rate</p>
                        <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">94.2%</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Last 12 months</p>
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
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Client Identity</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Lifecycle Stage</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Tier</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Revenue</TableHead>
                            <TableHead className="px-4 py-3 text-right font-medium text-[10px] text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.map((client) => (
                            <TableRow key={client.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-semibold text-zinc-600 border border-zinc-200 transition-transform group-hover:scale-110">
                                            {client.manager === 'Unassigned' ? '?' : client.manager.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-zinc-900">{client.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{client.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-500' : client.status === 'AT-RISK' ? 'bg-amber-500' : 'bg-zinc-400'}`} />
                                        <span className="text-xs font-medium text-zinc-700">{client.stage}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <Badge variant="outline" className="rounded-md text-[10px] font-medium border-zinc-200 text-zinc-600 bg-white shadow-sm">
                                        {client.tier}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className="text-xs font-semibold text-zinc-900">{client.revenue}</span>
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
                                            <DropdownMenuItem onClick={() => toast.info(`Transferring ${client.name}`)} className="text-xs font-medium cursor-pointer">Transfer Manager</DropdownMenuItem>
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
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-400">Client Name</Label>
                                <p className="text-sm font-semibold text-zinc-900">{selectedClient.name}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-400">Email</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.email}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-400">Phone</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.phone}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-400">Address</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-medium text-zinc-400">Tier</Label>
                                    <Badge variant="outline" className="w-fit rounded-md text-[10px] font-medium">{selectedClient.tier}</Badge>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-medium text-zinc-400">Status</Label>
                                    <Badge className={`w-fit rounded-md text-[10px] font-medium ${selectedClient.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {selectedClient.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-400">Revenue</Label>
                                <p className="text-xl font-semibold text-zinc-900">{selectedClient.revenue}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-zinc-400">Account Manager</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.manager}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="h-8 text-xs font-medium rounded-lg">
                            Close
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
