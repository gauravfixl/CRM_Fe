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
    Building2
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
        useTeamStore.persist.rehydrate()
        useWorkspaceStore.persist.rehydrate()
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
            case "ADMIN": return "bg-slate-900 text-white border-none shadow-lg shadow-slate-200"
            case "VIEWER": return "bg-slate-100 text-slate-400 border-none"
            default: return "bg-indigo-50 text-indigo-600 border-none"
        }
    }

    if (!mounted) return null

    return (
        <div className="max-w-[1600px] mx-auto space-y-12 py-12 animate-in fade-in duration-1000 px-8 pb-32">
            {/* dynamic header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-4 border-slate-50">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                            <Users size={20} />
                        </div>
                        <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Human Capital</h4>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                        Workspace <span className="text-indigo-600">Personnel</span>.
                    </h1>
                    <p className="text-[15px] font-bold text-slate-500 italic max-w-xl">
                        A high-fidelity directory of all intellectual assets and strategic collaborators within this workspace region.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white border-2 border-slate-100 rounded-[28px] flex items-center gap-4 shadow-sm">
                        <div className="h-10 w-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Global Presence</p>
                            <p className="text-xl font-black text-slate-800 leading-none">{members.length} Entities</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsInviteOpen(true)} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest shadow-xl shadow-indigo-200 gap-3 transition-all">
                        <UserPlus size={20} className="stroke-[3px]" />
                        Onboard Talent
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 p-2 rounded-[32px] border border-slate-100">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Filter by name or secure email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 bg-white border-2 border-slate-100 rounded-2xl text-[13px] font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 pr-2">
                    <Button variant="outline" className="h-12 px-6 border-2 border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest gap-2 bg-white">
                        <Filter size={16} /> Filter Architecture
                    </Button>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredMembers.map((member) => (
                    <Card key={member.id} className="group border-none shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 rounded-[48px] bg-white overflow-hidden relative">
                        <CardContent className="p-0">
                            <div className="p-10 space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24 rounded-[32px] border-4 border-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            <AvatarImage src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} />
                                            <AvatarFallback className="bg-indigo-600 text-white text-2xl font-black">{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-10 w-10 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl shadow-2xl border-slate-100 p-2">
                                            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Override</div>
                                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, "ADMIN")} className="font-bold rounded-lg cursor-pointer">Elevate to Admin</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, "MEMBER")} className="font-bold rounded-lg cursor-pointer">Set as Standard</DropdownMenuItem>
                                            <div className="h-px bg-slate-100 my-2" />
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    if (confirm(`Terminate access for ${member.name}?`)) removeMember(member.id)
                                                }}
                                                className="font-bold text-rose-600 rounded-lg cursor-pointer focus:bg-rose-50 focus:text-rose-600"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Terminate Access
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-[24px] font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase leading-none">{member.name}</h3>
                                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400 italic">
                                        <Mail size={14} className="text-slate-300" />
                                        {member.email}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl space-y-1.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Access Level</p>
                                        <Badge className={`h-6 text-[10px] font-black px-2 rounded-lg ${getRoleBadge(member.role)}`}>
                                            {member.role}
                                        </Badge>
                                    </div>
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl space-y-1.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Task Load</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-black text-slate-800">{member.projectsCount || 0} Projects</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-6 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-3 text-[12px] font-black text-white hover:bg-indigo-600 transition-all uppercase tracking-[0.2em]">
                                <IdCard size={18} />
                                View Profile
                                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 text-center bg-slate-50/50 rounded-[80px] border-4 border-dashed border-slate-100">
                    <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-slate-200">
                        <SearchX size={64} className="text-slate-200 stroke-[1px]" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none mb-4">Zero Entities Matches</h3>
                    <p className="text-slate-500 font-bold italic max-w-sm mx-auto px-6">Your search criteria did not intersect with any active personnel in this region.</p>
                </div>
            )}

            <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        </div>
    )
}
