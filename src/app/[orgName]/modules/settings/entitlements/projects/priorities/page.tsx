"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Signal,
    Search,
    Plus,
    MoreHorizontal,
    ArrowUp,
    ArrowDown,
    Minus,
    AlertTriangle,
    TrendingUp,
    Clock
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
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function PriorityLevelsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<{ id: string; name: string; score: number; color: string } | null>(null)
    const [newItem, setNewItem] = useState({ name: "", score: 50, color: "zinc" })

    // Mock Data
    const [priorities, setPriorities] = useState([
        { id: "1", name: "Urgent", score: 90, color: "rose", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
        { id: "2", name: "High", score: 70, color: "orange", icon: <ArrowUp className="w-3.5 h-3.5 text-orange-500" /> },
        { id: "3", name: "Medium", score: 50, color: "blue", icon: <Minus className="w-3.5 h-3.5 text-blue-500" /> },
        { id: "4", name: "Low", score: 30, color: "zinc", icon: <ArrowDown className="w-3.5 h-3.5 text-zinc-500" /> },
    ])

    const colorOptions = ["rose", "orange", "blue", "zinc", "emerald", "purple", "amber"]

    const createPriority = () => {
        if (!newItem.name) return toast.error("Please enter a priority name")
        setIsLoading(true)
        setTimeout(() => {
            setPriorities([...priorities, {
                id: Date.now().toString(),
                name: newItem.name,
                score: newItem.score,
                color: newItem.color,
                icon: <Minus className="w-3.5 h-3.5 text-zinc-500" />
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", score: 50, color: "zinc" })
            setIsLoading(false)
            toast.success("Priority level created")
        }, 1000)
    }

    const updatePriority = () => {
        if (!editItem || !editItem.name) return toast.error("Please fill all fields")
        setIsLoading(true)
        setTimeout(() => {
            setPriorities(priorities.map(p => p.id === editItem.id ? { ...p, name: editItem.name, score: editItem.score, color: editItem.color } : p))
            setIsEditOpen(false)
            setEditItem(null)
            setIsLoading(false)
            toast.success("Priority level updated")
        }, 800)
    }

    const deletePriority = (id: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setPriorities(priorities.filter(p => p.id !== id))
            setIsLoading(false)
            toast.success("Priority level deleted")
        }, 800)
    }

    const filteredPriorities = priorities
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.score - a.score)

    const avgScore = priorities.length > 0 ? Math.round(priorities.reduce((sum, p) => sum + p.score, 0) / priorities.length) : 0
    const urgentCount = priorities.filter(p => p.score >= 80).length

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Priorities</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Priority Matrix</h1>
                        <p className="text-xs text-gray-500 font-medium">Standardize urgency levels and SLA weights.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                                    <Plus className="w-4 h-4" />
                                    New priority
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                                <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                                    <DialogTitle className="text-white font-semibold">Create priority level</DialogTitle>
                                    <p className="text-blue-100 text-xs">Define a new urgency tier.</p>
                                </DialogHeader>
                                <div className="grid gap-4 px-5 py-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Name</Label>
                                        <Input className="h-9 rounded-lg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Critical" />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex justify-between">
                                            <Label className="text-xs font-semibold">Weight score (0-100)</Label>
                                            <span className="text-xs text-gray-500 font-semibold">{newItem.score}</span>
                                        </div>
                                        <Slider defaultValue={[50]} max={100} step={1} onValueChange={(vals) => setNewItem({ ...newItem, score: vals[0] })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold">Color tag</Label>
                                        <div className="flex gap-2 flex-wrap">
                                            {colorOptions.map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setNewItem({ ...newItem, color: c })}
                                                    className={`w-7 h-7 rounded-full border-2 transition-all ${newItem.color === c ? "border-blue-600 scale-110" : "border-gray-200"}`}
                                                    style={{ backgroundColor: `var(--color-${c}-400, #a1a1aa)` }}
                                                >
                                                    <span className={`block w-full h-full rounded-full bg-${c}-400`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="px-5 pb-4">
                                    <Button variant="outline" className="h-9 rounded-lg text-xs" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 font-semibold" onClick={createPriority} disabled={isLoading}>{isLoading ? "Creating..." : "Create priority"}</Button>
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
                            <p className="text-xs text-white/80">Total levels</p>
                            <Signal className="w-4 h-4 text-white/80" />
                        </div>
                        <p className="text-xl font-semibold text-white">{priorities.length}</p>
                        <p className="text-[10px] text-white/70">Importance tiers</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600">Avg score</p>
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{avgScore}</p>
                        <p className="text-[10px] text-gray-400">Across all levels</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600">Urgent tasks</p>
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{urgentCount}</p>
                        <p className="text-[10px] text-gray-400">Score 80 or above</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-600">Resolution rate</p>
                            <Clock className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">92%</p>
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
                            placeholder="Search priorities..."
                            className="pl-9 h-9 bg-white border-gray-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Priority name</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Weight score</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Color tag</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPriorities.map((p) => (
                            <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                                            {p.icon}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full bg-${p.color}-500`} style={{ width: `${p.score}%` }}></div>
                                        </div>
                                        <span className="text-sm text-gray-600">{p.score}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="secondary" className="rounded-full text-[10px] font-medium capitalize">{p.color}</Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-gray-100 rounded-lg">
                                            <DropdownMenuItem onClick={() => {
                                                setEditItem({ id: p.id, name: p.name, score: p.score, color: p.color })
                                                setIsEditOpen(true)
                                            }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deletePriority(p.id)}>Delete</DropdownMenuItem>
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
                        <DialogTitle className="text-white font-semibold">Edit priority level</DialogTitle>
                        <p className="text-blue-100 text-xs">Update the priority details.</p>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Name</Label>
                            <Input className="h-9 rounded-lg" value={editItem?.name || ""} onChange={(e) => setEditItem(editItem ? { ...editItem, name: e.target.value } : null)} placeholder="e.g. Critical" />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <Label className="text-xs font-semibold">Weight score (0-100)</Label>
                                <span className="text-xs text-gray-500 font-semibold">{editItem?.score || 0}</span>
                            </div>
                            <Slider value={[editItem?.score || 50]} max={100} step={1} onValueChange={(vals) => setEditItem(editItem ? { ...editItem, score: vals[0] } : null)} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold">Color tag</Label>
                            <div className="flex gap-2 flex-wrap">
                                {colorOptions.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setEditItem(editItem ? { ...editItem, color: c } : null)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all ${editItem?.color === c ? "border-blue-600 scale-110" : "border-gray-200"}`}
                                    >
                                        <span className={`block w-full h-full rounded-full bg-${c}-400`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button variant="outline" className="h-9 rounded-lg text-xs" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="h-9 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 font-semibold" onClick={updatePriority} disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
