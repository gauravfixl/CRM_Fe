"use client"

import React, { useState, useEffect } from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Trash2, RotateCcw, Search, MoreHorizontal, AlertTriangle, Clock, XCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CustomButton } from "@/components/custom/CustomButton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { getAllTeams, deleteTeam, createTeam } from "@/hooks/teamHooks"

interface DeletedGroup {
    id: string
    name: string
    type: string
    deletedAt: string
    deletedBy: string
    members: number
    daysRemaining: number
}

export default function DeletedGroupsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [deletedGroups, setDeletedGroups] = useState<DeletedGroup[]>([])
    const [loading, setLoading] = useState(true)

    const fetchDeletedTeams = async () => {
        try {
            setLoading(true)
            const response = await getAllTeams()
            const teams = response.data?.teams || response.data || []
            const deleted = teams
                .filter((t: any) => t.isDeleted || t.deleted || t.status === "Deleted")
                .map((t: any) => {
                    const deletedAt = t.deletedAt || t.updatedAt || t.createdAt || new Date().toISOString()
                    const deletedDate = new Date(deletedAt)
                    const now = new Date()
                    const diffDays = Math.max(0, 30 - Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24)))
                    return {
                        id: t._id || t.id,
                        name: t.name || "",
                        type: t.type || "Security",
                        deletedAt: deletedDate.toISOString().split("T")[0],
                        deletedBy: t.deletedBy || "unknown",
                        members: Array.isArray(t.members) ? t.members.length : (t.members || 0),
                        daysRemaining: diffDays,
                    }
                })
            setDeletedGroups(deleted)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch deleted teams")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDeletedTeams()
    }, [])

    const [restoreLoading, setRestoreLoading] = useState<string | null>(null)
    const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<DeletedGroup | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleRestore = async (group: DeletedGroup) => {
        setRestoreLoading(group.id)
        try {
            await createTeam({ name: group.name, type: group.type })
            setDeletedGroups(prev => prev.filter(g => g.id !== group.id))
            toast.success(`Group "${group.name}" has been restored`)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to restore group")
        } finally {
            setRestoreLoading(null)
        }
    }

    const handlePermanentDelete = async () => {
        if (!selectedGroup) return
        setDeleteLoading(true)
        try {
            await deleteTeam(selectedGroup.id)
            setDeletedGroups(prev => prev.filter(g => g.id !== selectedGroup.id))
            toast.success(`Group "${selectedGroup.name}" permanently deleted`)
            setPermanentDeleteOpen(false)
            setSelectedGroup(null)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to permanently delete group")
        } finally {
            setDeleteLoading(false)
        }
    }

    const openPermanentDelete = (group: DeletedGroup) => {
        setSelectedGroup(group)
        setPermanentDeleteOpen(true)
    }

    const filteredGroups = deletedGroups.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const typeBadgeStyle = (type: string) => {
        if (type === "Security") return "bg-indigo-50 text-indigo-600 border-indigo-200"
        if (type === "Dynamic") return "bg-emerald-50 text-emerald-600 border-emerald-200"
        return "bg-blue-50 text-blue-600 border-blue-200"
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Deleted Groups"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "Deleted Groups", href: "/modules/teams/deleted" }
                ]}
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                {deletedGroups.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-none">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                Deleted groups are retained for <span className="font-semibold">30 days</span> before permanent removal. Restore them before the retention period expires.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-11 border-none focus-visible:ring-0 rounded-none h-10 bg-transparent font-medium text-sm"
                                    placeholder="Search deleted groups..."
                                />
                            </div>
                        </div>
                    </>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                    </div>
                ) : filteredGroups.length === 0 && deletedGroups.length === 0 ? (
                    <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Recently Deleted</CardTitle>
                            <CardDescription>Groups deleted within the last 30 days can be restored.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                            <div className="text-center text-zinc-500">
                                <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No deleted groups found</p>
                                <p className="text-xs opacity-70 mt-1">Recycle bin is empty</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredGroups.map((group) => (
                            <Card key={group.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-red-400">
                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500 rounded-none">
                                            <Trash2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white line-through opacity-70">{group.name}</h3>
                                                <Badge className={`rounded-none text-[10px] px-2 py-0.5 border ${typeBadgeStyle(group.type)}`}>{group.type}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Deleted: {group.deletedAt}
                                                </span>
                                                <span>By: {group.deletedBy}</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" /> {group.members} members
                                                </span>
                                            </div>
                                            <Badge className={`rounded-none text-[10px] px-2 py-0.5 mt-2 border ${group.daysRemaining <= 7 ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                                                {group.daysRemaining} days remaining
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CustomButton
                                            variant="outline"
                                            size="sm"
                                            className="rounded-none h-8 text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                            onClick={() => handleRestore(group)}
                                            disabled={restoreLoading === group.id}
                                        >
                                            {restoreLoading === group.id ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 mr-1" />}
                                            Restore
                                        </CustomButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => handleRestore(group)}>
                                                    <RotateCcw className="w-3.5 h-3.5 mr-2" /> Restore Group
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-xs text-red-600 cursor-pointer" onClick={() => openPermanentDelete(group)}>
                                                    <XCircle className="w-3.5 h-3.5 mr-2" /> Permanently Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Permanent Delete Confirmation Dialog */}
            <Dialog open={permanentDeleteOpen} onOpenChange={setPermanentDeleteOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-none p-0 gap-0">
                    <div className="p-6 pb-4 bg-red-50 dark:bg-red-950/30">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <DialogTitle className="text-lg font-bold text-red-700 dark:text-red-400">Permanently Delete</DialogTitle>
                            </div>
                            <DialogDescription className="text-red-600/80">
                                This action is irreversible. The group and all its data will be permanently removed.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-6">
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-red-700 dark:text-red-400">
                                    Are you sure you want to permanently delete &quot;{selectedGroup?.name}&quot;?
                                </p>
                                <p className="text-red-600/80 mt-1">
                                    This cannot be undone. All associated permissions, memberships, and audit logs will be lost.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-0">
                        <CustomButton variant="outline" className="rounded-none" onClick={() => setPermanentDeleteOpen(false)} disabled={deleteLoading}>
                            Cancel
                        </CustomButton>
                        <CustomButton className="rounded-none bg-red-600 text-white hover:bg-red-700" onClick={handlePermanentDelete} disabled={deleteLoading}>
                            {deleteLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Delete Permanently
                        </CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
