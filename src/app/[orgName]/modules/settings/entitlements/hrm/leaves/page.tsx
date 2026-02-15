"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Palmtree,
    Search,
    Plus,
    MoreHorizontal,
    Calendar,
    Plane,
    HeartPulse
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
import { Switch } from "@/components/ui/switch"

export default function LeavePoliciesPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", days: 10, carryOver: false })

    // Mock Data
    const [leaves, setLeaves] = useState([
        { id: "1", name: "Annual Leave", days: 15, carryOver: true, type: "Paid" },
        { id: "2", name: "Sick Leave", days: 10, carryOver: false, type: "Paid" },
        { id: "3", name: "Casual Leave", days: 7, carryOver: false, type: "Paid" },
        { id: "4", name: "Unpaid Leave", days: 0, carryOver: false, type: "Unpaid" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const createLeave = () => {
        if (!newItem.name) return toast.error("Please enter leave name")
        setIsLoading(true)
        setTimeout(() => {
            setLeaves([...leaves, {
                id: Date.now().toString(),
                name: newItem.name,
                days: newItem.days,
                carryOver: newItem.carryOver,
                type: "Paid"
            }])
            setIsCreateOpen(false)
            setNewItem({ name: "", days: 10, carryOver: false })
            setIsLoading(false)
            toast.success("Leave Policy Created")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HR GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">LEAVES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Time Off Policies</h1>
                        <p className="text-xs text-zinc-500 font-medium">Configure vacation, sick days, and accruals.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Policy
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Leave Type</DialogTitle>
                                    <DialogDescription>
                                        Define a new category of time off.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Policy Name</Label>
                                        <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Paternity Leave" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Annual Days</Label>
                                        <Input type="number" value={newItem.days} onChange={(e) => setNewItem({ ...newItem, days: parseInt(e.target.value) })} />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md bg-zinc-50">
                                        <Label htmlFor="carry" className="flex flex-col space-y-1">
                                            <span className="text-sm font-medium">Allow Carry Over</span>
                                            <span className="text-xs text-zinc-500 font-normal">Unused days move to next year?</span>
                                        </Label>
                                        <Switch id="carry" checked={newItem.carryOver} onCheckedChange={(v) => setNewItem({ ...newItem, carryOver: v })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={createLeave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">{isLoading ? "Creating..." : "Create Policy"}</Button>
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Policy Types</p>
                        <Plane className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{leaves.length}</p>
                        <p className="text-[10px] text-white">Defined categories</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search policies..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Leave Name</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Annual Entitlement</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Carry Over</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Type</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaves.map((l) => (
                            <TableRow key={l.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                            {l.name.includes("Sick") ? <HeartPulse className="w-4 h-4 text-rose-500" /> :
                                                l.name.includes("Annual") ? <Plane className="w-4 h-4 text-blue-500" /> :
                                                    <Calendar className="w-4 h-4 text-zinc-500" />}
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">{l.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs font-bold text-zinc-900">{l.days} Days</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="outline" className={`text-[10px] ${l.carryOver ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-50 text-zinc-400'}`}>
                                        {l.carryOver ? "Allowed" : "No"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs text-zinc-600">{l.type}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("Editing policy...")}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Deleting policy...")}>Delete</DropdownMenuItem>
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
