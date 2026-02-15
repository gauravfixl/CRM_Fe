"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
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
    MapPin
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

export default function MasterClientViewPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showNewClientDialog, setShowNewClientDialog] = useState(false)
    const [showDetailsDialog, setShowDetailsDialog] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any>(null)

    // New Client Form State
    const [newClient, setNewClient] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        tier: "Standard",
        manager: ""
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const handleCreateClient = () => {
        if (!newClient.name || !newClient.email) {
            toast.error("Please fill in required fields")
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(`Client "${newClient.name}" created successfully`)
            setShowNewClientDialog(false)
            setNewClient({ name: "", email: "", phone: "", address: "", tier: "Standard", manager: "" })
        }, 1000)
    }

    const handleViewDetails = (client: any) => {
        setSelectedClient(client)
        setShowDetailsDialog(true)
    }

    const handleArchiveClient = (name: string) => {
        toast.success(`${name} archived successfully`)
    }

    const clients = [
        {
            id: "1",
            name: "Acme Corporation",
            email: "contact@acme.com",
            phone: "+1 (555) 123-4567",
            address: "123 Business St, NY",
            status: "ACTIVE",
            tier: "Enterprise",
            revenue: "$125,000",
            manager: "John Doe",
            stage: "Onboarding"
        },
        {
            id: "2",
            name: "GlobalSoft Inc",
            email: "info@globalsoft.com",
            phone: "+1 (555) 234-5678",
            address: "456 Tech Ave, CA",
            status: "ACTIVE",
            tier: "Premium",
            revenue: "$82,500",
            manager: "Sarah J.",
            stage: "Active"
        },
        {
            id: "3",
            name: "Skyline Organization",
            email: "admin@skyline.org",
            phone: "+1 (555) 345-6789",
            address: "789 Corporate Blvd, TX",
            status: "AT-RISK",
            tier: "Standard",
            revenue: "$45,000",
            manager: "Emma W.",
            stage: "At-Risk"
        },
        {
            id: "4",
            name: "BankTech Solutions",
            email: "support@banktech.io",
            phone: "+1 (555) 456-7890",
            address: "321 Finance Dr, IL",
            status: "DORMANT",
            tier: "Enterprise",
            revenue: "$0",
            manager: "Unassigned",
            stage: "Dormant"
        },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>ORGANIZATION</span>
                    <span>/</span>
                    <span>GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">MASTER CLIENTS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Client Management</h1>
                        <p className="text-xs text-zinc-500 font-medium">Monitor and manage all client accounts organization-wide.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleAction("Clients refreshed")}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => setShowNewClientDialog(true)}
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                        >
                            <UserCheck className="w-3.5 h-3.5 mr-2" />
                            New Client
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS - PREMIUM 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 3D BLUE CARD */}
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Clients</p>
                        <Users className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">1,247</p>
                        <p className="text-[10px] text-white">89 active accounts</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Enterprise Tier</p>
                        <Building2 className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">342</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">High-value accounts</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Total Revenue</p>
                        <TrendingUp className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">$3.2M</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Annual recurring</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Retention Rate</p>
                        <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">94.2%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Last 12 months</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                        placeholder="Search clients..."
                        className="pl-8 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-9 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-md shadow-sm hover:bg-zinc-50 text-xs"
                    >
                        <Filter className="w-3.5 h-3.5 mr-2" />
                        Filters
                    </Button>
                    <Button
                        variant="outline"
                        className="h-9 border-zinc-200 text-blue-600 bg-white font-medium px-4 rounded-md shadow-sm hover:bg-zinc-50 text-xs"
                    >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* MASTER DATA TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Client Identity</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Lifecycle Stage</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Tier</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Revenue</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 border border-zinc-200 transition-transform group-hover:scale-110">
                                            {client.manager === 'Unassigned' ? '?' : client.manager.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-zinc-900">{client.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{client.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : client.status === 'AT-RISK' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-zinc-400'}`} />
                                        <span className="text-xs font-medium text-zinc-700">{client.stage}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 text-zinc-600 bg-white shadow-sm">
                                        {client.tier}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-semibold text-zinc-900">{client.revenue}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleViewDetails(client)} className="text-xs font-medium cursor-pointer">View Details</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toast.info(`Transferring ${client.name}`)} className="text-xs font-medium cursor-pointer">Transfer Manager</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleArchiveClient(client.name)} className="text-xs font-medium text-rose-600 cursor-pointer">Archive Client</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <p className="text-[10px] text-zinc-400 font-medium">Showing 4 of 1,247 records</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* NEW CLIENT DIALOG */}
            <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black uppercase italic">Create New Client</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Add a new client account to your organization.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-bold text-zinc-700">Client Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter client name"
                                value={newClient.name}
                                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold text-zinc-700">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="client@example.com"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    className="h-10 pl-10"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-xs font-bold text-zinc-700">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="phone"
                                    placeholder="+1 (555) 000-0000"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    className="h-10 pl-10"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address" className="text-xs font-bold text-zinc-700">Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="address"
                                    placeholder="123 Business St, City, State"
                                    value={newClient.address}
                                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                                    className="h-10 pl-10"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tier" className="text-xs font-bold text-zinc-700">Client Tier</Label>
                            <Select value={newClient.tier} onValueChange={(value) => setNewClient({ ...newClient, tier: value })}>
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Standard">Standard</SelectItem>
                                    <SelectItem value="Premium">Premium</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="manager" className="text-xs font-bold text-zinc-700">Account Manager</Label>
                            <Input
                                id="manager"
                                placeholder="Assign account manager"
                                value={newClient.manager}
                                onChange={(e) => setNewClient({ ...newClient, manager: e.target.value })}
                                className="h-10"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewClientDialog(false)} className="h-10">
                            Cancel
                        </Button>
                        <Button onClick={handleCreateClient} disabled={isLoading} className="h-10 bg-blue-600 hover:bg-blue-700">
                            {isLoading ? "Creating..." : "Create Client"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CLIENT DETAILS DIALOG */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black uppercase italic">Client Details</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            View complete information for this client account.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClient && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase">Client Name</Label>
                                <p className="text-sm font-bold text-zinc-900">{selectedClient.name}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase">Email</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.email}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase">Phone</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.phone}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase">Address</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase">Tier</Label>
                                    <Badge variant="outline" className="w-fit">{selectedClient.tier}</Badge>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase">Status</Label>
                                    <Badge className={`w-fit ${selectedClient.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {selectedClient.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase">Revenue</Label>
                                <p className="text-lg font-black text-zinc-900">{selectedClient.revenue}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-400 uppercase">Account Manager</Label>
                                <p className="text-sm text-zinc-700">{selectedClient.manager}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="h-10">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
