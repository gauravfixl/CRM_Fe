"use client"

import React, { useState, useEffect } from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Globe, Plus, Search, MoreHorizontal, Users, Edit3, UserPlus, Lock, Trash2, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CustomButton } from "@/components/custom/CustomButton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateGroupModal, GroupFormData } from "@/components/groups/create-group-modal"
import { AddMembersModal } from "@/components/groups/add-members-modal"
import { AssignAccessModal } from "@/components/groups/assign-access-modal"
import { ReleaseGroupModal } from "@/components/groups/release-group-modal"
import { GroupProfileModal } from "@/components/groups/group-profile-modal"
import { ManageMembersModal } from "@/components/groups/manage-members-modal"
import { toast } from "sonner"
import { getAllTeams, createTeam, deleteTeam } from "@/hooks/teamHooks"

interface Group {
    id: string
    name: string
    members: number
    type: string
    description: string
    status: string
}

export default function M365GroupsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [groups, setGroups] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTeams = async () => {
        try {
            setLoading(true)
            const response = await getAllTeams()
            const teams = response.data?.teams || response.data || []
            const mapped = teams
                .map((t: any) => ({
                    id: t._id || t.id,
                    name: t.name || "",
                    members: Array.isArray(t.members) ? t.members.length : (t.members || 0),
                    type: t.type || "M365",
                    description: t.description || "",
                    status: t.status || "Active",
                }))
                .filter((g: Group) => g.type === "M365")
            setGroups(mapped)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch M365 groups")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeams()
    }, [])

    // Modal states
    const [createGroupOpen, setCreateGroupOpen] = useState(false)
    const [addMembersOpen, setAddMembersOpen] = useState(false)
    const [assignAccessOpen, setAssignAccessOpen] = useState(false)
    const [releaseGroupOpen, setReleaseGroupOpen] = useState(false)
    const [groupProfileOpen, setGroupProfileOpen] = useState(false)
    const [manageMembersOpen, setManageMembersOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

    const handleGroupCreated = async (group: GroupFormData) => {
        try {
            await createTeam({ ...group, type: "M365" })
            toast.success("M365 group created successfully")
            fetchTeams()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create M365 group")
        }
    }

    const handleGroupReleased = async (groupId: string) => {
        try {
            await deleteTeam(groupId)
            toast.success("M365 group deleted successfully")
            setGroups(prev => prev.filter(g => g.id !== groupId))
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete M365 group")
        }
    }

    const handleGroupUpdated = (updated: { id: string; name: string; description: string; type: string; status: string }) => {
        setGroups(prev => prev.map(g => g.id === updated.id ? { ...g, ...updated } : g))
    }

    const filteredGroups = groups.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="M365 Groups"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "M365 Groups", href: "/modules/teams/m365" }
                ]}
                rightControls={
                    <Button
                        className="h-8 gap-2 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[10px]"
                        onClick={() => setCreateGroupOpen(true)}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New M365 Group
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                {groups.length > 0 && (
                    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 border-none focus-visible:ring-0 rounded-none h-10 bg-transparent font-medium text-sm"
                                placeholder="Search M365 groups..."
                            />
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredGroups.length === 0 ? (
                    <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Microsoft 365 Groups</CardTitle>
                            <CardDescription>Collaborate with colleagues inside and outside your organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                            <div className="text-center text-zinc-500">
                                <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No M365 groups found</p>
                                <Button variant="link" className="text-blue-600" onClick={() => setCreateGroupOpen(true)}>
                                    Create a collaboration group
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredGroups.map((group) => (
                            <Card key={group.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-md transition-all overflow-hidden border-t-3 border-t-blue-500">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
                                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 border border-blue-200 dark:border-blue-800 rounded-none font-semibold text-sm">
                                        {group.name.substring(0, 2)}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 rounded-none">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </CustomButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none">
                                            <DropdownMenuLabel className="text-[10px] font-semibold text-zinc-400">Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => { setSelectedGroup(group); setGroupProfileOpen(true) }}>
                                                <Edit3 className="w-3.5 h-3.5 mr-2" /> Group Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => { setSelectedGroup(group); setAddMembersOpen(true) }}>
                                                <UserPlus className="w-3.5 h-3.5 mr-2" /> Add Identities
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => { setSelectedGroup(group); setAssignAccessOpen(true) }}>
                                                <Lock className="w-3.5 h-3.5 mr-2" /> Assign Access
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-xs text-red-600 cursor-pointer" onClick={() => { setSelectedGroup(group); setReleaseGroupOpen(true) }}>
                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Release Group
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 pb-5">
                                    <div>
                                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{group.name}</h3>
                                        <p className="text-xs text-zinc-400 mt-1">{group.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className="rounded-none border text-[10px] font-semibold py-0.5 px-2.5 bg-blue-50 text-blue-600 border-blue-200">M365</Badge>
                                        <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {group.members} Identities</span>
                                    </div>
                                    <Separator className="bg-zinc-100" />
                                    <div className="flex items-center justify-end">
                                        <CustomButton variant="ghost" className="h-8 text-[11px] text-zinc-500 font-medium hover:text-primary px-2" onClick={() => { setSelectedGroup(group); setManageMembersOpen(true) }}>
                                            Manage Members <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </CustomButton>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div
                            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-blue-300 transition-all cursor-pointer rounded-none"
                            onClick={() => setCreateGroupOpen(true)}
                        >
                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-blue-400" />
                            </div>
                            <p className="text-xs font-semibold text-zinc-400">Add M365 Group</p>
                        </div>
                    </div>
                )}
            </div>

            <CreateGroupModal open={createGroupOpen} onOpenChange={setCreateGroupOpen} defaultType="M365" onGroupCreated={handleGroupCreated} />
            <AddMembersModal open={addMembersOpen} onOpenChange={setAddMembersOpen} groupName={selectedGroup?.name} />
            <AssignAccessModal open={assignAccessOpen} onOpenChange={setAssignAccessOpen} groupName={selectedGroup?.name} />
            <ReleaseGroupModal open={releaseGroupOpen} onOpenChange={setReleaseGroupOpen} groupName={selectedGroup?.name} groupId={selectedGroup?.id} onGroupReleased={handleGroupReleased} />
            <GroupProfileModal open={groupProfileOpen} onOpenChange={setGroupProfileOpen} group={selectedGroup || undefined} onGroupUpdated={handleGroupUpdated} />
            <ManageMembersModal open={manageMembersOpen} onOpenChange={setManageMembersOpen} groupName={selectedGroup?.name} groupId={selectedGroup?.id} />
        </div>
    )
}
