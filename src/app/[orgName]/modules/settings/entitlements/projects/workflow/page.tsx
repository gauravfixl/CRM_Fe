"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Workflow,
    Search,
    Plus,
    MoreHorizontal,
    ArrowRightCircle,
    CheckCircle2,
    Circle,
    LayoutDashboard
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function WorkflowStatusPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", category: "todo", color: "gray" })

    // Mock Data
    const [statuses, setStatuses] = useState([
        { id: "1", name: "Backlog", category: "todo", color: "zinc" },
        { id: "2", name: "To Do", category: "todo", color: "blue" },
        { id: "3", name: "In Progress", category: "progress", color: "indigo" },
        { id: "4", name: "In Review", category: "progress", color: "purple" },
        { id: "5", name: "Done", category: "done", color: "emerald" },
        { id: "6", name: "Cancelled", category: "done", color: "rose" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const createStatus = () => {
        if (!newItem.name) return toast.error("Please enter specific status details")
        setIsLoading(true)
        setTimeout(() => {
            setStatuses([...statuses, {
                id: Date.now().toString(),
                name: newItem.name,
                category: newItem.category,
                color: newItem.color
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", category: "todo", color: "gray" })
            setIsLoading(false)
            toast.success("Workflow Status Created")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECT GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">WORKFLOW STATUS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Workflow Configuration</h1>
                        <p className="text-xs text-zinc-500 font-medium">Define flow states and transitions for tasks.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Status
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Status</DialogTitle>
                                    <DialogDescription>
                                        Add a new step to your project workflows.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Status Name</Label>
                                        <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. QA Review" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Category Phase</Label>
                                        <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select phase" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">To Do (Open)</SelectItem>
                                                <SelectItem value="progress">In Progress (Active)</SelectItem>
                                                <SelectItem value="done">Done (Completed)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={createStatus} disabled={isLoading}>{isLoading ? "Creating..." : "Create Status"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Statuses</p>
                        <Workflow className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{statuses.length}</p>
                        <p className="text-[10px] text-white">Across all flows</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Active Items</p>
                        <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">142</p>
                        <p className="text-[10px] text-zinc-400">Tasks in flow</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search statuses..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Status Name</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Category Phase</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Color Code</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statuses.map((s) => (
                            <TableRow key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full bg-${s.color}-500 shadow-sm border border-${s.color}-300`}></div>
                                        <span className="text-xs font-bold text-zinc-900">{s.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        {s.category === 'todo' && <Circle className="w-3.5 h-3.5 text-zinc-400" />}
                                        {s.category === 'progress' && <ArrowRightCircle className="w-3.5 h-3.5 text-blue-500" />}
                                        {s.category === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                        <span className="text-xs text-zinc-600 capitalize">{s.category.replace('-', ' ')}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">{s.color}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("Editing status...")}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Deleting status...")}>Delete</DropdownMenuItem>
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
