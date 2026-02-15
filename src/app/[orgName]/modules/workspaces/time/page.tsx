"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Timer,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    LayoutDashboard,
    Clock,
    Play
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

export default function TimeTrackingPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const logs = [
        { id: "L-01", task: "Design Homepage", project: "Website Redesign", user: "Alice", date: "Today", duration: "2h 30m", desc: "Figma work" },
        { id: "L-02", task: "API Integration", project: "Backend Migration", user: "Bob", date: "Today", duration: "4h 15m", desc: "Coding endpoints" },
        { id: "L-03", task: "Client Meeting", project: "Consulation", user: "Charlie", date: "Yesterday", duration: "1h 00m", desc: "Zoom call" },
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
                    <span className="text-zinc-900 font-semibold">TIME TRACKING</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Timesheets & Logs</h1>
                        <p className="text-xs text-zinc-500 font-medium">Monitor effort allocation across projects.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => handleAction("Timer Started")}>
                            <Play className="w-3.5 h-3.5 mr-2" />
                            Start Timer
                        </Button>
                        <Button variant="outline" className="h-8 rounded-md border-zinc-200 text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => handleAction("Log time manually")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Log Time
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-emerald-500 to-emerald-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_20px_40px_rgba(5,150,105,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Hours</p>
                        <Timer className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">142h</p>
                        <p className="text-[10px] text-white">This week</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* LOGS TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search logs..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-emerald-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Task</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Project</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">User</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Description</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Date</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-6">Duration</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((l) => (
                            <TableRow key={l.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <span className="text-xs font-bold text-zinc-900">{l.task}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-medium text-zinc-600">{l.project}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-medium text-zinc-600">{l.user}</span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs text-zinc-500 italic">{l.desc}</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-[10px] font-mono text-zinc-500">{l.date}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-6">
                                    <span className="text-xs font-bold font-mono text-zinc-900">{l.duration}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("Edit Log")}>
                                                Edit Entry
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Delete Log")}>
                                                Delete Entry
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
