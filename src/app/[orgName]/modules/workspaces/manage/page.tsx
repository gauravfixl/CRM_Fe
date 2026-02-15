"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Building2,
    Search,
    Filter,
    MoreHorizontal,
    Plus,
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    Trash2,
    RefreshCcw,
    Shield
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
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function WorkspaceManagePage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" })

    // Mock Data
    const [workspaces, setWorkspaces] = useState([
        { id: "1", name: "Engineering", description: "Core product development", members: 12, projects: 5, status: "ACTIVE", owner: "John Doe" },
        { id: "2", name: "Marketing", description: "Global campaigns", members: 8, projects: 3, status: "ACTIVE", owner: "Sarah Smith" },
        { id: "3", name: "Client Projects", description: "External deliverables", members: 15, projects: 8, status: "ACTIVE", owner: "Mike Brown" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const createWorkspace = () => {
        if (!newWorkspace.name) return toast.error("Workspace name is required")

        setIsLoading(true)
        // Simulation of backend logic: createWorkspace -> validates -> creates -> assigns admin -> generates token
        setTimeout(() => {
            const newWs = {
                id: Date.now().toString(),
                name: newWorkspace.name,
                description: newWorkspace.description,
                members: 1, // Creator
                projects: 0,
                status: "ACTIVE",
                owner: "Current User"
            }
            setWorkspaces([...workspaces, newWs])
            setIsLoading(false)
            setIsCreateOpen(false)
            setNewWorkspace({ name: "", description: "" })
            toast.success("Workspace created successfully")
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECT MANAGEMENT</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">WORKSPACES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Workspace Administration</h1>
                        <p className="text-xs text-zinc-500 font-medium">Manage organization departments and project containers.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleAction("Workspaces refreshed")}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                            Refresh
                        </Button>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    New Workspace
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create Workspace</DialogTitle>
                                    <DialogDescription>
                                        Create a new workspace to group projects and members. You will be assigned as the Workspace Admin.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Workspace Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Engineering"
                                            value={newWorkspace.name}
                                            onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <Input
                                            id="desc"
                                            placeholder="Brief description of purpose"
                                            value={newWorkspace.description}
                                            onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={createWorkspace} disabled={isLoading}>
                                        {isLoading ? "Creating..." : "Create Workspace"}
                                    </Button>
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Workspaces</p>
                        <Building2 className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">{workspaces.length}</p>
                        <p className="text-[10px] text-white">Active departments</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Total Projects</p>
                        <Briefcase className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">16</p>
                        <p className="text-[10px] text-zinc-400">Across all workspaces</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Active Members</p>
                        <Users className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">35</p>
                        <p className="text-[10px] text-zinc-400">Collaborating users</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Efficiency</p>
                        <LayoutDashboard className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">92%</p>
                        <p className="text-[10px] text-zinc-400">Task completion rate</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* CONTENT */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input
                            placeholder="Search workspaces..."
                            className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Workspace Name</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Description</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Projects</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Members</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workspaces.map((ws) => (
                            <TableRow key={ws.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-zinc-900">{ws.name}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">Owner: {ws.owner}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs text-zinc-500 font-medium">{ws.description}</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="outline" className="bg-white text-zinc-600 border-zinc-200">{ws.projects}</Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-zinc-500">
                                        <Users className="w-3 h-3" />
                                        <span className="text-xs font-bold">{ws.members}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] uppercase font-bold">
                                        {ws.status}
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
                                            <DropdownMenuItem onClick={() => handleAction("Opening settings...")}>
                                                <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction("Viewing analytics...")}>
                                                <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Analytics
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleAction("Delete initiated...")}>
                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Workspace
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
