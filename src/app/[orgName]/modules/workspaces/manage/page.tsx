"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    Building2,
    Search,
    MoreHorizontal,
    Plus,
    LayoutDashboard,
    Briefcase,
    Settings,
    Trash2,
    RefreshCcw,
    Loader2
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
import {
    getAllWorkspaces,
    getMyWorkspaces,
    createWorkspace,
    deleteWorkspace,
    type Workspace,
} from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { showSuccess, showError } from "@/utils/toast"

export default function WorkspaceManagePage() {
    const params = useParams() as { orgName?: string }
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "" })
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    const orgName = params.orgName || localStorage.getItem("orgName") || ""

    const fetchWorkspaces = async () => {
        setIsFetching(true)
        try {
            // Try admin endpoint first, fallback to my-workspaces
            let res
            try {
                res = await getAllWorkspaces()
            } catch {
                res = await getMyWorkspaces()
            }
            const data = res?.data?.data?.workspaces || res?.data?.workspaces || res?.data?.data || res?.data || []
            setWorkspaces(Array.isArray(data) ? data : [])
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Failed to fetch workspaces:", err)
            }
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchWorkspaces()
    }, [])

    const handleCreateWorkspace = async () => {
        if (!newWorkspace.name) {
            showError("Workspace name is required")
            return
        }

        setIsLoading(true)
        try {
            await createWorkspace(newWorkspace, params.orgName)
            setIsCreateOpen(false)
            setNewWorkspace({ name: "", description: "" })
            fetchWorkspaces()
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Error creating workspace:", err)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteWorkspace = async (id: string) => {
        setIsLoading(true)
        try {
            await deleteWorkspace(id)
            setWorkspaces(workspaces.filter(ws => ws._id !== id))
            setDeleteConfirmId(null)
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Error deleting workspace:", err)
                showError("Failed to delete workspace")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const filteredWorkspaces = workspaces.filter(ws =>
        ws.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalWorkspaces = workspaces.length
    const activeWorkspaces = workspaces.filter(ws => !ws.isDeleted).length

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
                            onClick={() => fetchWorkspaces()}
                            disabled={isFetching}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
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
                                    <Button onClick={handleCreateWorkspace} disabled={isLoading}>
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
                        <p className="text-2xl font-bold text-white drop-shadow-md">{totalWorkspaces}</p>
                        <p className="text-[10px] text-white">Active departments</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Active</p>
                        <Briefcase className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{activeWorkspaces}</p>
                        <p className="text-[10px] text-zinc-400">Active workspaces</p>
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

                {isFetching ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
                        <span className="text-sm text-zinc-500">Loading workspaces...</span>
                    </div>
                ) : filteredWorkspaces.length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 text-sm">
                        {searchQuery ? "No workspaces match your search." : "No workspaces found. Create your first workspace to get started."}
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow>
                                <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Workspace Name</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Description</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Created By</TableHead>
                                <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Created At</TableHead>
                                <TableHead className="py-3 text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWorkspaces.map((ws) => (
                                <TableRow
                                    key={ws._id}
                                    className="hover:bg-zinc-50/50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/${orgName}/modules/workspaces/${ws._id}`)}
                                >
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                                <Building2 className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-zinc-900">{ws.name}</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">
                                                    Owner: {ws.createdBy?.fullName || ws.createdBy?.email || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-xs text-zinc-500 font-medium">{ws.description || "--"}</span>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <span className="text-xs text-zinc-500">{ws.createdBy?.email || "N/A"}</span>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <span className="text-xs text-zinc-500">
                                            {ws.createdAt ? new Date(ws.createdAt).toLocaleDateString() : "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3 text-right pr-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/${orgName}/modules/workspaces/${ws._id}/settings`)
                                                }}>
                                                    <Settings className="w-3.5 h-3.5 mr-2" /> Settings
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/${orgName}/modules/workspaces/${ws._id}/analytics`)
                                                }}>
                                                    <LayoutDashboard className="w-3.5 h-3.5 mr-2" /> Analytics
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-rose-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDeleteConfirmId(ws._id)
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Workspace
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Workspace</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this workspace? This will also remove all projects, tasks, and teams within it.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            disabled={isLoading}
                            onClick={() => {
                                if (deleteConfirmId) handleDeleteWorkspace(deleteConfirmId)
                            }}
                        >
                            {isLoading ? "Deleting..." : "Delete Workspace"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}