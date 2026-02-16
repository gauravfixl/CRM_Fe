"use client"

import React, { useState, useEffect } from "react"
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Filter,
    Mail,
    Shield,
    Trash2,
    CheckCircle2,
    ChevronRight,
    SearchX,
    Users,
    IdCard,
    Zap,
    Globe,
    Building2,
    Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
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

export default function PeoplePage() {
    const [mounted, setMounted] = useState(false)
    const { getMembersByWorkspace, removeMember, updateMemberRole } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    useEffect(() => {
        setMounted(true)
        // Ensure persistence is handled
        if (useTeamStore.persist?.rehydrate) useTeamStore.persist.rehydrate()
        if (useWorkspaceStore.persist?.rehydrate) useWorkspaceStore.persist.rehydrate()
    }, [])

    const members = (mounted && activeWorkspaceId) ? getMembersByWorkspace(activeWorkspaceId) : []

    const [searchQuery, setSearchQuery] = useState("")
    const [isInviteOpen, setIsInviteOpen] = useState(false)

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case "ADMIN": return "bg-primary/10 text-primary border-none shadow-sm"
            case "VIEWER": return "bg-slate-100 text-slate-500 border-none"
            default: return "bg-blue-50 text-blue-600 border-none"
        }
    }

    if (!mounted) return null

    return (
        <div className="mx-auto space-y-8 py-8 animate-in fade-in duration-700 px-6 pb-20 font-outfit" style={{ zoom: "80%" }}>
            {/* dynamic header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <Sparkles size={16} />
                        </div>
                        <h4 className="text-xs font-semibold text-gray-500 tracking-wide">Integrated Human Capital</h4>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Workspace <span className="text-primary italic">Personnel</span>
                    </h1>
                    <p className="text-sm font-medium text-gray-500 max-w-xl">
                        A high-fidelity directory of all intellectual assets and strategic collaborators within this workspace.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
                        <div className="h-8 w-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                            <Globe size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-1">Global Presence</p>
                            <p className="text-lg font-bold text-gray-800 leading-none">{members.length} Entities</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsInviteOpen(true)} className="h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 gap-2 transition-all">
                        <UserPlus size={18} />
                        Onboard Talent
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Filter by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-11 bg-white border-gray-200 rounded-xl text-sm font-medium text-gray-600 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 pr-2">
                    <Button variant="outline" className="h-11 px-4 border-gray-200 rounded-xl font-semibold text-xs gap-2 bg-white hover:bg-gray-50">
                        <Filter size={14} /> Filter Architecture
                    </Button>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member) => (
                    <Card key={member.id} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-[32px] bg-white overflow-hidden relative border border-gray-100">
                        <CardContent className="p-0">
                            <div className="p-6 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <Avatar className="h-20 w-20 rounded-[24px] border-4 border-white shadow-lg group-hover:scale-105 transition-all duration-300">
                                            <AvatarImage src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} />
                                            <AvatarFallback className="bg-primary text-white text-xl font-bold">{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-white shadow-md" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-9 w-9 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg flex items-center justify-center transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-xl border-gray-100 p-1 font-outfit">
                                            <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Settings</div>
                                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, "ADMIN")} className="font-medium rounded-lg cursor-pointer text-sm">Elevate to Admin</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, "MEMBER")} className="font-medium rounded-lg cursor-pointer text-sm">Set as Standard</DropdownMenuItem>
                                            <div className="h-px bg-gray-100 my-1" />
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (confirm(`Terminate access for ${member.name}?`)) removeMember(member.id)
                                                }}
                                                className="font-medium text-rose-600 rounded-lg cursor-pointer text-sm focus:bg-rose-50 focus:text-rose-600"
                                            >
                                                <Trash2 size={14} className="mr-2" />
                                                Terminate Access
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">{member.name}</h3>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                        <Mail size={12} className="text-gray-300" />
                                        {member.email}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Access Level</p>
                                        <Badge className={`h-5 text-[9px] font-bold px-1.5 rounded-md ${getRoleBadge(member.role)}`}>
                                            {member.role === "ADMIN" ? "Admin" : member.role === "VIEWER" ? "Viewer" : "Member"}
                                        </Badge>
                                    </div>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Task Load</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-800">{member.projectsCount || 0} Projects</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gray-900 flex items-center justify-center gap-2 text-xs font-bold text-white hover:bg-primary transition-all uppercase tracking-widest">
                                <IdCard size={14} />
                                View Profile
                                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-200">
                    <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-gray-200">
                        <SearchX size={40} className="text-gray-200 stroke-[1.5px]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight leading-none mb-2">No Personnel Found</h3>
                    <p className="text-gray-500 text-sm font-medium max-w-sm mx-auto px-6">Your search criteria did not match any active members in this workspace.</p>
                </div>
            )}

            <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        </div>
    )
}
