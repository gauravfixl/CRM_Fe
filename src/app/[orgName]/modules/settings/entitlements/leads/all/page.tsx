"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    UserPlus,
    ShieldCheck,
    Calendar,
    AlertCircle,
    Users,
    Target,
    PieChart,
    LayoutDashboard,
    RefreshCcw,
    ArrowUpDown,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function MasterLeadViewPage() {
    const params = useParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const leads = [
        {
            id: "1",
            title: "Enterprise CRM Migration",
            email: "tech@acme.com",
            status: "OPEN",
            company: "Acme Corp",
            estimate: "$12,500",
            owner: "John Doe",
            stage: "Discovery"
        },
        {
            id: "2",
            title: "Mobile App Implementation",
            email: "hr@globalsoft.com",
            status: "QUALIFIED",
            company: "GlobalSoft",
            estimate: "$8,200",
            owner: "Sarah J.",
            stage: "Requirement"
        },
        {
            id: "3",
            title: "Security Infrastructure",
            email: "it@skyline.org",
            status: "IN DISCUSSION",
            company: "Skyline Org",
            estimate: "$25,000",
            owner: "Unassigned",
            stage: "Initial Contact"
        },
        {
            id: "4",
            title: "ERP Customization",
            email: "fin@banktech.io",
            status: "CLOSED-WON",
            company: "BankTech",
            estimate: "$45,000",
            owner: "Emma W.",
            stage: "Negotiation"
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
                    <span className="text-zinc-900 font-semibold">MASTER LEADS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Lead Management</h1>
                        <p className="text-xs text-zinc-500 font-medium">Track and optimize your sales pipelines organization-wide.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleAction("Leads refreshed")}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => router.push(`/${params.orgName}/modules/crm/leads/add`)}
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                        >
                            <UserPlus className="w-3.5 h-3.5 mr-2" />
                            New Lead
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS - PREMIUM 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 3D BLUE CARD */}
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Leads</p>
                        <Users className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">2,847</p>
                        <p className="text-[10px] text-white">124 active now</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Qualified</p>
                        <Target className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">1,420</p>
                        <p className="text-[10px] text-zinc-400">All systems operational</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Pipeline Value</p>
                        <PieChart className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">$1.48M</p>
                        <p className="text-[10px] text-zinc-400">2 high priority</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Win Rate</p>
                        <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">24.5%</p>
                        <p className="text-[10px] text-zinc-400">Across all firms</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                        placeholder="Search leads..."
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
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Identity</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Stage</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Company</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Value</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.map((lead) => (
                            <TableRow key={lead.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 border border-zinc-200 transition-transform group-hover:scale-110">
                                            {lead.owner === 'Unassigned' ? '?' : lead.owner.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-zinc-900">{lead.title}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{lead.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                        <span className="text-xs font-medium text-zinc-700">{lead.stage}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-[11px] font-medium text-zinc-500">{lead.company}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-semibold text-zinc-900">{lead.estimate}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem className="text-xs font-medium">Verify Integrity</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs font-medium">Transfer Ownership</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-xs font-medium text-rose-600">Move to Recovery</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <p className="text-[10px] text-zinc-400 font-medium">Showing 4 of 2,847 records</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
