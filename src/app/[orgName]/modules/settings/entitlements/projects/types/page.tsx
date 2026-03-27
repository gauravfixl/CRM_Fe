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
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
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
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<{ id: string; name: string; key: string; workflow: string } | null>(null)
    const [newItem, setNewItem] = useState({ name: "", key: "", workflow: "Standard" })

    // Mock Data
    const [types, setTypes] = useState([
        { id: "1", name: "Software Development", key: "SW", workflow: "Agile Scrum", projects: 12, status: "Active" },
        { id: "2", name: "Marketing Campaign", key: "MKT", workflow: "Kanban", projects: 5, status: "Active" },
        { id: "3", name: "General Task", key: "GEN", workflow: "Simple Todo", projects: 8, status: "Active" },
        { id: "4", name: "Client Onboarding", key: "ONB", workflow: "Stage Gate", projects: 3, status: "Inactive" },
    ])

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
                status: "Active"
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", key: "", workflow: "Standard" })
            setIsLoading(false)
            toast.success("Project type created")
        }, 1000)
    }

    const openEdit = (t: typeof types[0]) => {
        setEditItem({ id: t.id, name: t.name, key: t.key, workflow: t.workflow })
        setIsEditOpen(true)
    }

    const saveEdit = () => {
        if (!editItem || !editItem.name || !editItem.key) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setTypes(types.map(t => t.id === editItem.id ? { ...t, name: editItem.name, key: editItem.key.toUpperCase(), workflow: editItem.workflow } : t))
            setIsEditOpen(false)
            setEditItem(null)
            setIsLoading(false)
            toast.success("Project type updated")
        }, 800)
    }

    const deleteType = (id: string) => {
        setTypes(types.filter(t => t.id !== id))
        toast.success("Project type deleted")
    }

    const filteredTypes = types.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.key.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Project types</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Project Schemas</h1>
                        <p className="text-xs text-gray-500 font-medium">Define project categories and their default behaviors.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5 text-white">
                                    <Plus className="w-4 h-4" />
                                    New type
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-xl">
                                <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-xl -m-6 mb-0">
                                    <DialogTitle className="text-white font-semibold">Create Project Type</DialogTitle>
                                    <DialogDescription className="text-blue-100">
                                        Define a new project template for your organization.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 px-1">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Type name</Label>
                                        <Input className="h-9 rounded-lg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Website Redesign" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Key prefix</Label>
                                        <Input className="h-9 rounded-lg" value={newItem.key} onChange={(e) => setNewItem({ ...newItem, key: e.target.value })} placeholder="e.g. WEB" maxLength={3} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="h-9 rounded-lg text-xs">Cancel</Button>
                                    <Button onClick={createType} disabled={isLoading} className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold">{isLoading ? "Creating..." : "Create type"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-white/80">Active types</p>
                            <FolderKanban className="w-4 h-4 text-white/80" />
                        </div>
                        <p className="text-xl font-semibold text-white">{types.filter(t => t.status === "Active").length}</p>
                        <p className="text-[10px] text-white/70">Project definitions</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">Total projects</p>
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{types.reduce((sum, t) => sum + t.projects, 0)}</p>
                        <p className="text-[10px] text-gray-400">Using these types</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">Workflows</p>
                            <Layers className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{new Set(types.map(t => t.workflow)).size}</p>
                        <p className="text-[10px] text-gray-400">Unique process flows</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">Completion rate</p>
                            <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">92%</p>
                        <p className="text-[10px] text-gray-400">Avg across types</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            placeholder="Search types..."
                            className="pl-9 h-9 bg-white border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Type name</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Key prefix</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Default workflow</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Active projects</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Status</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTypes.map((t) => (
                            <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <FolderKanban className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 font-mono text-sm text-gray-600">{t.key}</TableCell>
                                <TableCell className="py-3 text-sm text-gray-600">{t.workflow}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="secondary" className="rounded-full bg-gray-100 text-gray-600 border-gray-200">{t.projects}</Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[10px] font-semibold rounded-full border-none px-2 py-0.5 ${t.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                                        {t.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-gray-100 rounded-lg">
                                            <DropdownMenuItem onClick={() => openEdit(t)}>Edit type</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deleteType(t.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-xl -m-6 mb-0">
                        <DialogTitle className="text-white font-semibold">Edit Project Type</DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Update this project type configuration.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 px-1">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Type name</Label>
                            <Input className="h-9 rounded-lg" value={editItem?.name ?? ""} onChange={(e) => setEditItem(editItem ? { ...editItem, name: e.target.value } : null)} placeholder="e.g. Website Redesign" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Key prefix</Label>
                            <Input className="h-9 rounded-lg" value={editItem?.key ?? ""} onChange={(e) => setEditItem(editItem ? { ...editItem, key: e.target.value } : null)} placeholder="e.g. WEB" maxLength={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} className="h-9 rounded-lg text-xs">Cancel</Button>
                        <Button onClick={saveEdit} disabled={isLoading} className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold">{isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
