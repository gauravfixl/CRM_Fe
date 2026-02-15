"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Zap,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    LayoutDashboard,
    Calendar,
    Target,
    TrendingUp
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function SprintsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const sprints = [
        { id: "S-24", name: "Sprint 24 - Core Features", project: "Backend Migration", start: "Jan 10", end: "Jan 24", goal: "Auth Module", status: "ACTIVE", completion: 65 },
        { id: "S-25", name: "Sprint 25 - Testing", project: "Backend Migration", start: "Jan 25", end: "Feb 07", goal: "QA & Bug Fixes", status: "PLANNED", completion: 0 },
        { id: "S-08", name: "Alpha Release", project: "Mobile App Beta", start: "Jan 05", end: "Jan 19", goal: "Store Submission", status: "ACTIVE", completion: 82 },
    ]

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">SPRINTS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Sprint Management</h1>
                        <p className="text-xs text-zinc-500 font-medium">Coordinate agile cycles and track team velocity.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => handleAction("Sprint Planner")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Plan Sprint
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-amber-500 to-orange-600 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(245,158,11,0.3)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Sprints</p>
                        <Zap className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{sprints.filter(s => s.status === 'ACTIVE').length}</p>
                        <p className="text-[10px] text-white">In progress now</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Avg Velocity</p>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">42</p>
                        <p className="text-[10px] text-zinc-400">Points per sprint</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SPRINTS TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search sprints..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-amber-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Sprint Name</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Project</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Goal</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Duration</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Completion</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sprints.map((s) => (
                            <TableRow key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <span className="text-xs font-bold text-zinc-900">{s.name}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-medium text-zinc-600">{s.project}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-3.5 h-3.5 text-zinc-400" />
                                        <span className="text-xs text-zinc-500 italic">{s.goal}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-[10px] font-mono text-zinc-500">{s.start} - {s.end}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="w-full max-w-[80px] mx-auto h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500"
                                            style={{ width: `${s.completion}%` }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${s.status === 'ACTIVE' ? 'bg-amber-50 text-amber-600' :
                                            'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {s.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("View Burndown")}>
                                                Burndown Chart
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction("Close Sprint")}>
                                                Complete Sprint
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
