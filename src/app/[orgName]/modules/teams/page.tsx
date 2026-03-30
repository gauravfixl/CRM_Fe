"use client"

import { useState } from "react"
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    ShieldCheck,
    Globe,
    UserPlus,
    Zap,
    Trash2,
    Edit3,
    ChevronRight,
    Info,
    Network,
    Terminal,
    Lock,
    CloudUpload
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreateGroupModal, GroupFormData } from "@/components/groups/create-group-modal"
import { AddMembersModal } from "@/components/groups/add-members-modal"
import { AssignAccessModal } from "@/components/groups/assign-access-modal"
import { ReleaseGroupModal } from "@/components/groups/release-group-modal"
import { BulkImportModal } from "@/components/groups/bulk-import-modal"
import { GroupProfileModal } from "@/components/groups/group-profile-modal"
import { ManageMembersModal } from "@/components/groups/manage-members-modal"
import { toast } from "sonner"

interface Group {
    id: string
    name: string
    members: number
    type: string
    description: string
    status: string
}

export default function GroupsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<string | null>(null)
    const [membershipFilter, setMembershipFilter] = useState<string | null>(null)

    const [groups, setGroups] = useState<Group[]>([
        { id: "1", name: "Executive Leadership", members: 12, type: "Security", description: "All C-suite and executive members", status: "Active" },
        { id: "2", name: "Engineering Team", members: 45, type: "M365", description: "Core product engineering and devops", status: "Active" },
        { id: "3", name: "Finance & Accounts", members: 8, type: "Security", description: "Access to payroll and treasury", status: "Active" },
        { id: "4", name: "Contractors (External)", members: 156, type: "Dynamic", description: "Automatically includes all guest users", status: "Active" },
        { id: "5", name: "HR Operations", members: 5, type: "Security", description: "Personnel records and recruitment", status: "Active" },
    ])

    // Modal states
    const [createGroupOpen, setCreateGroupOpen] = useState(false)
    const [bulkImportOpen, setBulkImportOpen] = useState(false)
    const [addMembersOpen, setAddMembersOpen] = useState(false)
    const [assignAccessOpen, setAssignAccessOpen] = useState(false)
    const [releaseGroupOpen, setReleaseGroupOpen] = useState(false)
    const [groupProfileOpen, setGroupProfileOpen] = useState(false)
    const [manageMembersOpen, setManageMembersOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

    const typeBorderColor = (type: string) => {
        if (type === "Security") return "border-t-indigo-500"
        if (type === "Dynamic") return "border-t-emerald-500"
        return "border-t-blue-500"
    }

    const typeBadgeStyle = (type: string) => {
        if (type === "Security") return "bg-indigo-50 text-indigo-600 border border-indigo-200"
        if (type === "Dynamic") return "bg-emerald-50 text-emerald-600 border border-emerald-200"
        return "bg-blue-50 text-blue-600 border border-blue-200"
    }

    const handleGroupCreated = (group: GroupFormData) => {
        setGroups(prev => [...prev, { ...group, members: 0 }])
    }

    const handleGroupReleased = (groupId: string) => {
        setGroups(prev => prev.filter(g => g.id !== groupId))
    }

    const handleGroupUpdated = (updated: { id: string; name: string; description: string; type: string; status: string }) => {
        setGroups(prev => prev.map(g => g.id === updated.id ? { ...g, ...updated } : g))
    }

    const openGroupProfile = (group: Group) => {
        setSelectedGroup(group)
        setGroupProfileOpen(true)
    }

    const openAddMembers = (group: Group) => {
        setSelectedGroup(group)
        setAddMembersOpen(true)
    }

    const openAssignAccess = (group: Group) => {
        setSelectedGroup(group)
        setAssignAccessOpen(true)
    }

    const openReleaseGroup = (group: Group) => {
        setSelectedGroup(group)
        setReleaseGroupOpen(true)
    }

    const openManageMembers = (group: Group) => {
        setSelectedGroup(group)
        setManageMembersOpen(true)
    }

    // Filter groups
    const filteredGroups = groups.filter(group => {
        const matchSearch = !searchQuery ||
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchType = !typeFilter || group.type === typeFilter
        return matchSearch && matchType
    })

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Groups & Teams"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Directory", href: "#" },
                    { label: "Groups", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            className="rounded-none h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm"
                            onClick={() => setBulkImportOpen(true)}
                        >
                            <CloudUpload className="w-4 h-4 mr-2" /> Bulk Import
                        </CustomButton>
                        <CustomButton
                            className="bg-primary text-white hover:bg-primary/90 rounded-none h-10 px-6 font-semibold text-sm shadow-lg shadow-primary/20 border-0"
                            onClick={() => setCreateGroupOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" /> New Group
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Directory Header */}
                <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white p-8 rounded-none flex flex-col md:flex-row items-start justify-between gap-8 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                        <Users className="h-48 w-48" />
                    </div>
                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-white/20 text-white border-0 rounded-none px-3 py-1 font-semibold tracking-wide text-[10px]">Organizational Directory</Badge>
                            <Badge className="bg-white/10 text-white/80 border-0 rounded-none px-3 py-1 font-semibold tracking-wide text-[10px]">SC-200 Compliant</Badge>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight leading-tight text-white">Security & Collaboration Groups</h2>
                        <p className="text-white/80 font-normal leading-relaxed text-sm">
                            Groups are the backbone of identity governance. Use &quot;Security Groups&quot; for permission assignment and &quot;M365 Groups&quot; for collaboration across modules.
                        </p>
                        <div className="flex items-center gap-8 pt-2">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">{groups.length}</span>
                                <span className="text-[10px] font-medium text-white/60 mt-1">Total Containers</span>
                            </div>
                            <Separator orientation="vertical" className="h-10 bg-white/20" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">{Math.round((groups.filter(g => g.type === "Dynamic").length / Math.max(groups.length, 1)) * 100)}%</span>
                                <span className="text-[10px] font-medium text-white/60 mt-1">Dynamic Growth</span>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 relative z-10 w-full md:w-72 space-y-3">
                        <div className="bg-white/10 border border-white/15 p-4 rounded-none backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-white/15 text-white flex items-center justify-center rounded-none">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-white/60">Active Policies</p>
                                    <p className="text-sm font-semibold text-white">48 Automation Rules</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-500/15 border border-emerald-400/20 p-4 rounded-none backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-emerald-400/20 text-emerald-300 flex items-center justify-center rounded-none">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-emerald-300/70">Posture Check</p>
                                    <p className="text-sm font-semibold text-emerald-300">No Orphaned Groups</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-medium"
                            placeholder="Find security groups by name, tag, or attribute..."
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <CustomButton variant="ghost" className={`rounded-none h-10 px-4 font-medium text-xs ${typeFilter ? "text-primary bg-primary/5" : "text-zinc-500"}`}>
                                    <Filter className="w-3.5 h-3.5 mr-2" /> {typeFilter || "All Types"}
                                </CustomButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-none">
                                <DropdownMenuItem className="text-xs" onClick={() => setTypeFilter(null)}>All Types</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs" onClick={() => setTypeFilter("Security")}>Security</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => setTypeFilter("M365")}>M365</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => setTypeFilter("Dynamic")}>Dynamic</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <CustomButton variant="ghost" className="rounded-none h-10 px-4 font-medium text-xs text-zinc-500">
                                    <Network className="w-3.5 h-3.5 mr-2" /> Membership
                                </CustomButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-none">
                                <DropdownMenuItem className="text-xs" onClick={() => toast.info("Showing all membership types")}>All</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs" onClick={() => toast.info("Filtering: Assigned membership")}>Assigned</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs" onClick={() => toast.info("Filtering: Dynamic membership")}>Dynamic</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredGroups.map((group) => (
                        <Card key={group.id} className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-md transition-all group overflow-hidden border-t-3 ${typeBorderColor(group.type)}`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
                                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-none font-semibold text-sm">
                                    {group.name.substring(0, 2)}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 rounded-none">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </CustomButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-none border-zinc-200 dark:border-zinc-800 shadow-lg">
                                        <DropdownMenuLabel className="text-[10px] font-semibold text-zinc-400">Actions</DropdownMenuLabel>
                                        <DropdownMenuItem className="text-xs font-medium py-2.5 cursor-pointer" onClick={() => openGroupProfile(group)}>
                                            <Edit3 className="w-3.5 h-3.5 mr-2" /> Group Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-medium py-2.5 cursor-pointer" onClick={() => openAddMembers(group)}>
                                            <UserPlus className="w-3.5 h-3.5 mr-2" /> Add Identities
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-medium py-2.5 cursor-pointer" onClick={() => openAssignAccess(group)}>
                                            <Lock className="w-3.5 h-3.5 mr-2" /> Assign Access
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-xs font-medium py-2.5 text-red-600 cursor-pointer" onClick={() => openReleaseGroup(group)}>
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Release Group
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="space-y-4 px-5 pb-5">
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{group.name}</h3>
                                    <p className="text-xs text-zinc-400 mt-1 font-normal">{group.description}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge className={`rounded-none border text-[10px] font-semibold py-0.5 px-2.5 ${typeBadgeStyle(group.type)}`}>
                                        {group.type}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                                        <Users className="w-3.5 h-3.5 text-zinc-300" />
                                        {group.members} Identities
                                    </div>
                                </div>

                                <Separator className="bg-zinc-100 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                <div className="bg-zinc-200 w-full h-full opacity-50"></div>
                                            </div>
                                        ))}
                                        <div className="h-7 w-7 rounded-full border-2 border-white dark:border-zinc-900 bg-primary text-white text-[9px] flex items-center justify-center font-semibold">+{Math.max(group.members - 3, 0)}</div>
                                    </div>
                                    <CustomButton
                                        variant="ghost"
                                        className="h-8 text-[11px] text-zinc-500 font-medium hover:text-primary transition-colors px-2"
                                        onClick={() => openManageMembers(group)}
                                    >
                                        Manage Members <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create Action Card */}
                    <div
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer group rounded-none"
                        onClick={() => setCreateGroupOpen(true)}
                    >
                        <div className="h-14 w-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-zinc-400">New Container</h4>
                            <p className="text-xs text-zinc-400 font-normal">Define a new security or collaboration context</p>
                        </div>
                    </div>
                </div>

                {/* System Insights Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-none flex items-start gap-5 shadow-lg relative overflow-hidden group">
                        <Terminal className="absolute -bottom-8 -right-8 h-36 w-36 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-3">
                            <h5 className="text-lg font-semibold text-white">Automate Membership</h5>
                            <p className="text-indigo-100 text-sm font-normal leading-relaxed opacity-90">
                                Connect your directory to your HR module to automatically populate teams based on department metadata.
                            </p>
                            <CustomButton
                                className="bg-white text-indigo-600 hover:bg-zinc-100 rounded-none h-9 px-5 font-semibold text-xs border-0"
                                onClick={() => toast.info("Sync Engine configuration coming soon")}
                            >
                                Configure Sync Engine
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none flex items-start gap-5 relative overflow-hidden group">
                        <Globe className="absolute -bottom-8 -right-8 h-36 w-36 opacity-5 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-3">
                            <h5 className="text-lg font-semibold text-zinc-900 dark:text-white">External Collaboration</h5>
                            <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                                Securely share resources with guest users by adding them to designated External Collaboration Groups.
                            </p>
                            <CustomButton
                                variant="outline"
                                className="rounded-none h-9 px-5 font-semibold text-xs border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                                onClick={() => toast.info("Guest access review coming soon")}
                            >
                                Review Guest Access
                            </CustomButton>
                        </div>
                    </div>
                </div>

            </div>

            {/* All Modals */}
            <CreateGroupModal
                open={createGroupOpen}
                onOpenChange={setCreateGroupOpen}
                onGroupCreated={handleGroupCreated}
            />
            <BulkImportModal
                open={bulkImportOpen}
                onOpenChange={setBulkImportOpen}
                onImportComplete={() => toast.success("Import completed")}
            />
            <AddMembersModal
                open={addMembersOpen}
                onOpenChange={setAddMembersOpen}
                groupName={selectedGroup?.name}
            />
            <AssignAccessModal
                open={assignAccessOpen}
                onOpenChange={setAssignAccessOpen}
                groupName={selectedGroup?.name}
            />
            <ReleaseGroupModal
                open={releaseGroupOpen}
                onOpenChange={setReleaseGroupOpen}
                groupName={selectedGroup?.name}
                groupId={selectedGroup?.id}
                onGroupReleased={handleGroupReleased}
            />
            <GroupProfileModal
                open={groupProfileOpen}
                onOpenChange={setGroupProfileOpen}
                group={selectedGroup || undefined}
                onGroupUpdated={handleGroupUpdated}
            />
            <ManageMembersModal
                open={manageMembersOpen}
                onOpenChange={setManageMembersOpen}
                groupName={selectedGroup?.name}
                groupId={selectedGroup?.id}
            />
        </div>
    )
}
