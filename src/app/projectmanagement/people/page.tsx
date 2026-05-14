"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Mail,
    Trash2,
    ChevronRight,
    SearchX,
    Users,
    IdCard,
    Shield,
    Eye,
    UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTeamStore, UserRole } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { InviteUserModal } from "@/shared/components/projectmanagement/invite-user-modal"
import { cn } from "@/lib/utils"

type RoleFilter = "all" | UserRole

export default function PeoplePage() {
    const [mounted, setMounted] = useState(false)
    const { getMembersByWorkspace, removeMember, updateMemberRole } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")

    useEffect(() => {
        setMounted(true)
        if (useTeamStore.persist?.rehydrate) useTeamStore.persist.rehydrate()
        if (useWorkspaceStore.persist?.rehydrate) useWorkspaceStore.persist.rehydrate()
    }, [])

    const members = (mounted && activeWorkspaceId) ? getMembersByWorkspace(activeWorkspaceId) : []

    const filteredMembers = useMemo(() => {
        let result = members.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (roleFilter !== "all") result = result.filter(m => m.role === roleFilter)
        return result
    }, [members, searchQuery, roleFilter])

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case "ADMIN": return "bg-indigo-100 text-indigo-700 border-none"
            case "VIEWER": return "bg-slate-100 text-slate-500 border-none"
            default: return "bg-blue-50 text-blue-600 border-none"
        }
    }

    if (!mounted) return null

    const total = members.length
    const admins = members.filter(m => m.role === "ADMIN").length
    const standards = members.filter(m => m.role === "MEMBER").length
    const viewers = members.filter(m => m.role === "VIEWER").length

    const kpis: { label: string; value: number; icon: React.ReactNode; color: string; bg: string; filter: RoleFilter }[] = [
        { label: "All People", value: total, icon: <Users size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "all" },
        { label: "Admins", value: admins, icon: <Shield size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "ADMIN" },
        { label: "Members", value: standards, icon: <UserCheck size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "MEMBER" },
        { label: "Viewers", value: viewers, icon: <Eye size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "VIEWER" },
    ]

    return (
        <div className="mx-auto space-y-5 py-6 animate-in fade-in duration-500 px-6 pb-20 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Users size={14} />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">People</h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium ml-9">
                        Workspace members and their roles.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 w-[220px] bg-white border border-slate-200 text-[12px] rounded-none"
                        />
                    </div>
                    <Button
                        onClick={() => setIsInviteOpen(true)}
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] flex items-center gap-2 rounded-none"
                    >
                        <UserPlus size={14} strokeWidth={3} />
                        Invite People
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setRoleFilter(stat.filter)}
                        className={cn(
                            "block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left",
                            stat.bg,
                            roleFilter === stat.filter && "ring-2 ring-indigo-500"
                        )}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-5 border-b border-slate-100 pb-1">
                {([
                    { id: "all", label: "All" },
                    { id: "ADMIN", label: "Admins" },
                    { id: "MEMBER", label: "Members" },
                    { id: "VIEWER", label: "Viewers" },
                ] as { id: RoleFilter; label: string }[]).map(t => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setRoleFilter(t.id)}
                        className={cn(
                            "text-[12px] font-bold pb-1 px-1 transition-colors border-b-2",
                            roleFilter === t.id ? "text-indigo-600 border-indigo-600" : "text-slate-400 hover:text-slate-600 border-transparent"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMembers.map((member) => (
                    <Card key={member.id} className="group shadow-sm hover:shadow-md transition-all bg-white overflow-hidden border border-slate-100 rounded-none">
                        <div className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="relative">
                                    <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                                        <AvatarImage src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} />
                                        <AvatarFallback className="bg-indigo-600 text-white text-lg font-bold">{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="h-7 w-7 text-slate-300 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all rounded-none">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px] p-1 shadow-xl border-slate-100">
                                        <div className="px-2 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Change role</div>
                                        <DropdownMenuItem onClick={() => updateMemberRole(member.id, "ADMIN")} className="text-[12px] font-medium">Set as Admin</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateMemberRole(member.id, "MEMBER")} className="text-[12px] font-medium">Set as Member</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateMemberRole(member.id, "VIEWER")} className="text-[12px] font-medium">Set as Viewer</DropdownMenuItem>
                                        <div className="h-px bg-slate-100 my-1" />
                                        <DropdownMenuItem
                                            onClick={() => {
                                                if (confirm(`Remove ${member.name} from this workspace?`)) removeMember(member.id)
                                            }}
                                            className="text-[12px] font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                                        >
                                            <Trash2 size={14} className="mr-2" /> Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                    <Mail size={11} className="text-slate-300" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-none">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                                    <Badge className={`text-[10px] font-bold px-1.5 h-4 rounded-none ${getRoleBadge(member.role)}`}>
                                        {member.role}
                                    </Badge>
                                </div>
                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-none">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Projects</p>
                                    <span className="text-xs font-bold text-slate-800">{member.projectsCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        <button type="button" className="w-full py-2.5 bg-slate-900 flex items-center justify-center gap-2 text-[11px] font-bold text-white hover:bg-indigo-600 transition-all uppercase tracking-wider rounded-none">
                            <IdCard size={12} />
                            View Profile
                            <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </Card>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-none">
                    <SearchX size={28} className="text-slate-300 mb-2" />
                    <h3 className="text-sm font-bold text-slate-800 mb-1">No people found</h3>
                    <p className="text-slate-500 text-xs font-medium max-w-sm mb-3">
                        {searchQuery || roleFilter !== "all" ? "Adjust your filters or invite a new teammate." : "Get started by inviting your first teammate."}
                    </p>
                    <Button
                        onClick={() => setIsInviteOpen(true)}
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] gap-2 rounded-none"
                    >
                        <UserPlus size={14} strokeWidth={3} /> Invite People
                    </Button>
                </div>
            )}

            <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        </div>
    )
}
