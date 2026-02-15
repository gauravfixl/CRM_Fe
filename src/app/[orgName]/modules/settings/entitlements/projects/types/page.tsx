"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    FolderKanban,
    Search,
    Plus,
    MoreHorizontal,
    LayoutDashboard,
    Layers,
    ArrowRight,
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
import { Label } from "@/components/ui/label"

export default function ProjectTypesPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", key: "", workflow: "Standard" })

    // Mock Data
    const [types, setTypes] = useState([
        { id: "1", name: "Software Development", key: "SW", workflow: "Agile Scrum", projects: 12, status: "ACTIVE" },
        { id: "2", name: "Marketing Campaign", key: "MKT", workflow: "Kanban", projects: 5, status: "ACTIVE" },
        { id: "3", name: "General Task", key: "GEN", workflow: "Simple Todo", projects: 8, status: "ACTIVE" },
        { id: "4", name: "Client Onboarding", key: "ONB", workflow: "Stage Gate", projects: 3, status: "INACTIVE" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const createType = () => {
        if (!newItem.name || !newItem.key) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setTypes([...types, {
                id: Date.now().toString(),
                name: newItem.name,
                key: newItem.key.toUpperCase(),
                workflow: newItem.workflow,
                projects: 0,
                status: "ACTIVE"
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", key: "", workflow: "Standard" })
            setIsLoading(false)
            toast.success("Project Type Created")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECT GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">PROJECT TYPES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Project Schemas</h1>
                        <p className="text-xs text-zinc-500 font-medium">Define project categories and their default behaviors.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Type
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Project Type</DialogTitle>
                                    <DialogDescription>
                                        Define a new project template for your organization.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Type Name</Label>
                                        <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Website Redesign" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Key Prefix</Label>
                                        <Input value={newItem.key} onChange={(e) => setNewItem({ ...newItem, key: e.target.value })} placeholder="e.g. WEB" maxLength={3} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={createType} disabled={isLoading}>{isLoading ? "Creating..." : "Create Type"}</Button>
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Types</p>
                        <FolderKanban className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{types.filter(t => t.status === 'ACTIVE').length}</p>
                        <p className="text-[10px] text-white">Project definitions</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Total Projects</p>
                        <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">28</p>
                        <p className="text-[10px] text-zinc-400">Using these types</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Workflows</p>
                        <Layers className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">4</p>
                        <p className="text-[10px] text-zinc-400">Unique process flows</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Completion Rate</p>
                        <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">92%</p>
                        <p className="text-[10px] text-zinc-400">Avg across types</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search types..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Type Name</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Key Prefix</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Default Workflow</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Active Projects</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {types.map((t) => (
                            <TableRow key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <FolderKanban className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">{t.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 font-mono text-xs text-zinc-500">{t.key}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{t.workflow}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-zinc-200">{t.projects}</Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${t.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {t.status}
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
                                            <DropdownMenuItem onClick={() => handleAction("Editing type...")}>Edit Type</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Deleting type...")}>Delete</DropdownMenuItem>
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
