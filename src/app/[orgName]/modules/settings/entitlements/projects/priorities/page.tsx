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
    AlertTriangle
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
import { Slider } from "@/components/ui/slider"

export default function PriorityLevelsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", score: 50 })

    // Mock Data
    const [priorities, setPriorities] = useState([
        { id: "1", name: "Urgent", score: 90, color: "rose", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
        { id: "2", name: "High", score: 70, color: "orange", icon: <ArrowUp className="w-3.5 h-3.5 text-orange-500" /> },
        { id: "3", name: "Medium", score: 50, color: "blue", icon: <Minus className="w-3.5 h-3.5 text-blue-500" /> },
        { id: "4", name: "Low", score: 30, color: "zinc", icon: <ArrowDown className="w-3.5 h-3.5 text-zinc-500" /> },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const createPriority = () => {
        if (!newItem.name) return toast.error("Please enter specific status details")
        setIsLoading(true)
        setTimeout(() => {
            setPriorities([...priorities, {
                id: Date.now().toString(),
                name: newItem.name,
                score: newItem.score,
                color: "zinc",
                icon: <Minus className="w-3.5 h-3.5 text-zinc-500" />
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", score: 50 })
            setIsLoading(false)
            toast.success("Priority Level Created")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECT GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">PRIORITIES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Priority Matrix</h1>
                        <p className="text-xs text-zinc-500 font-medium">Standardize urgency levels and SLA weights.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Priority
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Priority Level</DialogTitle>
                                    <DialogDescription>
                                        Define new urgency tier.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Name</Label>
                                        <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Critical" />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex justify-between">
                                            <Label>Weight Score (1-100)</Label>
                                            <span className="text-xs text-zinc-500 font-bold">{newItem.score}</span>
                                        </div>
                                        <Slider defaultValue={[50]} max={100} step={1} onValueChange={(vals) => setNewItem({ ...newItem, score: vals[0] })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={createPriority} disabled={isLoading}>{isLoading ? "Creating..." : "Create Priority"}</Button>
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Levels Defined</p>
                        <Signal className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{priorities.length}</p>
                        <p className="text-[10px] text-white">Importance tiers</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search priorities..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Priority Name</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Weight Score</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Color Tag</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {priorities.sort((a, b) => b.score - a.score).map((p) => (
                            <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                                            {p.icon}
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className={`h-full bg-${p.color}-500`} style={{ width: `${p.score}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">{p.score}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md capitalize">{p.color}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("Editing priority...")}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Deleting priority...")}>Delete</DropdownMenuItem>
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
