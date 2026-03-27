"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    CheckSquare,
    Search,
    Plus,
    MoreHorizontal,
    Bug,
    BookOpen,
    Zap,
    Layout,
    Activity,
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function TaskTypesPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<{ id: string; name: string; code: string } | null>(null)
    const [newItem, setNewItem] = useState({ name: "", code: "" })

    // Mock Data
    const [types, setTypes] = useState([
        { id: "1", name: "Epic", code: "EPC", icon: <Layout className="w-4 h-4 text-purple-500" /> },
        { id: "2", name: "User Story", code: "STY", icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
        { id: "3", name: "Task", code: "TSK", icon: <CheckSquare className="w-4 h-4 text-emerald-500" /> },
        { id: "4", name: "Bug", code: "BUG", icon: <Bug className="w-4 h-4 text-rose-500" /> },
        { id: "5", name: "Spike", code: "SPK", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    ])

    const createType = () => {
        if (!newItem.name || !newItem.code) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setTypes([...types, {
                id: Date.now().toString(),
                name: newItem.name,
                code: newItem.code,
                icon: <CheckSquare className="w-4 h-4 text-zinc-500" />
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", code: "" })
            setIsLoading(false)
            toast.success("Task type created")
        }, 1000)
    }

    const updateType = () => {
        if (!editItem || !editItem.name || !editItem.code) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setTypes(types.map(t => t.id === editItem.id ? { ...t, name: editItem.name, code: editItem.code } : t))
            setIsEditOpen(false)
            setEditItem(null)
            setIsLoading(false)
            toast.success("Task type updated")
        }, 800)
    }

    const deleteType = (id: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setTypes(types.filter(t => t.id !== id))
            setIsLoading(false)
            toast.success("Task type deleted")
        }, 800)
    }

    const filteredTypes = types.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const bugCount = types.filter(t => t.code === "BUG").length

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Task types</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Issue Types</h1>
                        <p className="text-xs text-gray-500 font-medium">Standardize the classification of work items.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                                    <Plus className="w-4 h-4" />
                                    New type
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                                <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                                    <DialogTitle className="text-white font-semibold">Create task type</DialogTitle>
                                    <p className="text-blue-100 text-xs">Define a new category for tasks.</p>
                                </DialogHeader>
                                <div className="grid gap-4 px-5 py-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Type name</Label>
                                        <Input className="h-9 rounded-lg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Sub-Task" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Code (3 letters)</Label>
                                        <Input className="h-9 rounded-lg" value={newItem.code} onChange={(e) => setNewItem({ ...newItem, code: e.target.value })} placeholder="e.g. SUB" maxLength={3} />
                                    </div>
                                </div>
                                <DialogFooter className="px-5 pb-4">
                                    <Button variant="outline" className="h-9 rounded-lg text-xs" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 font-semibold" onClick={createType} disabled={isLoading}>{isLoading ? "Creating..." : "Create type"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-white/80">Total types</p>
                            <CheckSquare className="w-4 h-4 text-white/80" />
                        </div>
                        <p className="text-xl font-semibold text-white">{types.length}</p>
                        <p className="text-[10px] text-white/70">Defined schemas</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600">Active tasks</p>
                            <Activity className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">128</p>
                        <p className="text-[10px] text-gray-400">Across all types</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600">Bug reports</p>
                            <Bug className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{bugCount}</p>
                        <p className="text-[10px] text-gray-400">Bug type defined</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600">Completion rate</p>
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">87%</p>
                        <p className="text-[10px] text-gray-400">Last 30 days</p>
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
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Code</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTypes.map((t) => (
                            <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                                            {t.icon}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-sm text-gray-600 font-mono">{t.code}</TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-gray-100 rounded-lg">
                                            <DropdownMenuItem onClick={() => {
                                                setEditItem({ id: t.id, name: t.name, code: t.code })
                                                setIsEditOpen(true)
                                            }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deleteType(t.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Edit task type</DialogTitle>
                        <p className="text-blue-100 text-xs">Update the task type details.</p>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Type name</Label>
                            <Input className="h-9 rounded-lg" value={editItem?.name || ""} onChange={(e) => setEditItem(editItem ? { ...editItem, name: e.target.value } : null)} placeholder="e.g. Sub-Task" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Code (3 letters)</Label>
                            <Input className="h-9 rounded-lg" value={editItem?.code || ""} onChange={(e) => setEditItem(editItem ? { ...editItem, code: e.target.value } : null)} placeholder="e.g. SUB" maxLength={3} />
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button variant="outline" className="h-9 rounded-lg text-xs" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 font-semibold" onClick={updateType} disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
