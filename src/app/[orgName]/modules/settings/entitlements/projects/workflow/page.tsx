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
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<{ id: string; name: string; category: string; color: string } | null>(null)
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
            toast.success("Workflow status created")
        }, 1000)
    }

    const openEdit = (s: typeof statuses[0]) => {
        setEditItem({ id: s.id, name: s.name, category: s.category, color: s.color })
        setIsEditOpen(true)
    }

    const saveEdit = () => {
        if (!editItem || !editItem.name) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setStatuses(statuses.map(s => s.id === editItem.id ? { ...s, name: editItem.name, category: editItem.category, color: editItem.color } : s))
            setIsEditOpen(false)
            setEditItem(null)
            setIsLoading(false)
            toast.success("Workflow status updated")
        }, 800)
    }

    const deleteStatus = (id: string) => {
        setStatuses(statuses.filter(s => s.id !== id))
        toast.success("Workflow status deleted")
    }

    const filteredStatuses = statuses.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const todoCount = statuses.filter(s => s.category === "todo").length
    const progressCount = statuses.filter(s => s.category === "progress").length
    const doneCount = statuses.filter(s => s.category === "done").length

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Page header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Workflow status</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Workflow Configuration</h1>
                        <p className="text-xs text-gray-500 font-medium">Define flow states and transitions for tasks.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5 text-white">
                                    <Plus className="w-4 h-4" />
                                    New status
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-xl">
                                <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-xl -m-6 mb-0">
                                    <DialogTitle className="text-white font-semibold">Create Status</DialogTitle>
                                    <DialogDescription className="text-blue-100">
                                        Add a new step to your project workflows.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 px-1">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Status name</Label>
                                        <Input className="h-9 rounded-lg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. QA Review" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Category phase</Label>
                                        <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                                            <SelectTrigger className="h-9 rounded-lg">
                                                <SelectValue placeholder="Select phase" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg">
                                                <SelectItem value="todo">To do (Open)</SelectItem>
                                                <SelectItem value="progress">In progress (Active)</SelectItem>
                                                <SelectItem value="done">Done (Completed)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="h-9 rounded-lg text-xs">Cancel</Button>
                                    <Button onClick={createStatus} disabled={isLoading} className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold">{isLoading ? "Creating..." : "Create status"}</Button>
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
                            <p className="text-xs text-white/80">Total statuses</p>
                            <Workflow className="w-4 h-4 text-white/80" />
                        </div>
                        <p className="text-xl font-semibold text-white">{statuses.length}</p>
                        <p className="text-[10px] text-white/70">Across all flows</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">To do phases</p>
                            <Circle className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{todoCount}</p>
                        <p className="text-[10px] text-gray-400">Open statuses</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">In progress phases</p>
                            <ArrowRightCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{progressCount}</p>
                        <p className="text-[10px] text-gray-400">Active statuses</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="flex flex-col gap-1 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">Done phases</p>
                            <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{doneCount}</p>
                        <p className="text-[10px] text-gray-400">Completed statuses</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            placeholder="Search statuses..."
                            className="pl-9 h-9 bg-white border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Status name</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Category phase</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Color code</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStatuses.map((s) => (
                            <TableRow key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full bg-${s.color}-500 shadow-sm border border-${s.color}-300`}></div>
                                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        {s.category === "todo" && <Circle className="w-3.5 h-3.5 text-gray-400" />}
                                        {s.category === "progress" && <ArrowRightCircle className="w-3.5 h-3.5 text-blue-500" />}
                                        {s.category === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                        <span className="text-sm text-gray-600 capitalize">{s.category.replace("-", " ")}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-[10px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{s.color}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-gray-100 rounded-lg">
                                            <DropdownMenuItem onClick={() => openEdit(s)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deleteStatus(s.id)}>Delete</DropdownMenuItem>
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
                        <DialogTitle className="text-white font-semibold">Edit Status</DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Update this workflow status configuration.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 px-1">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Status name</Label>
                            <Input className="h-9 rounded-lg" value={editItem?.name ?? ""} onChange={(e) => setEditItem(editItem ? { ...editItem, name: e.target.value } : null)} placeholder="e.g. QA Review" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Category phase</Label>
                            <Select value={editItem?.category ?? "todo"} onValueChange={(v) => setEditItem(editItem ? { ...editItem, category: v } : null)}>
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="todo">To do (Open)</SelectItem>
                                    <SelectItem value="progress">In progress (Active)</SelectItem>
                                    <SelectItem value="done">Done (Completed)</SelectItem>
                                </SelectContent>
                            </Select>
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
