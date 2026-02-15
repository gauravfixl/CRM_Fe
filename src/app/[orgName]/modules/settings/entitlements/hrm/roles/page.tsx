"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Briefcase,
    Search,
    Plus,
    MoreHorizontal,
    UserCircle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function JobRolesPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newItem, setNewItem] = useState({ title: "", level: "entry" })

    // Mock Data
    const [roles, setRoles] = useState([
        { id: "1", title: "Junior Developer", level: "Entry Level", code: "DEV-1" },
        { id: "2", title: "Senior Developer", level: "Senior", code: "DEV-3" },
        { id: "3", title: "Product Manager", level: "Management", code: "PM-1" },
        { id: "4", title: "HR Associate", level: "Associate", code: "HR-1" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const createRole = () => {
        if (!newItem.title) return toast.error("Please enter role title")
        setIsLoading(true)
        setTimeout(() => {
            setRoles([...roles, {
                id: Date.now().toString(),
                title: newItem.title,
                level: newItem.level,
                code: `NEW-${Math.floor(Math.random() * 100)}`
            }])
            setIsCreateOpen(false)
            setNewItem({ title: "", level: "entry" })
            setIsLoading(false)
            toast.success("Role Template Created")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HR GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">ROLES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Job Templates</h1>
                        <p className="text-xs text-zinc-500 font-medium">Standardize designations and hierarchy levels.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Role
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Job Role</DialogTitle>
                                    <DialogDescription>
                                        Define a position template for hiring.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Job Title</Label>
                                        <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="e.g. Sales Executive" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Level</Label>
                                        <Select value={newItem.level} onValueChange={(v) => setNewItem({ ...newItem, level: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Intern">Intern</SelectItem>
                                                <SelectItem value="Entry Level">Entry Level</SelectItem>
                                                <SelectItem value="Associate">Associate</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                                <SelectItem value="Management">Management</SelectItem>
                                                <SelectItem value="Director">Director</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={createRole} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">{isLoading ? "Creating..." : "Create Role"}</Button>
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Defined Roles</p>
                        <UserCircle className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{roles.length}</p>
                        <p className="text-[10px] text-white">Unique positions</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search roles..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Job Title</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Hierarchy Level</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Role Code</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((r) => (
                            <TableRow key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-sm">
                                            <Briefcase className="w-4 h-4 text-zinc-500" />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-900">{r.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge variant="outline" className="text-xs font-normal text-zinc-600 bg-white">{r.level}</Badge>
                                </TableCell>
                                <TableCell className="py-3 font-mono text-xs text-zinc-500">{r.code}</TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                            <DropdownMenuItem onClick={() => handleAction("Editing role...")}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Deleting role...")}>Delete</DropdownMenuItem>
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
