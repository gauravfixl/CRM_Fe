"use client"

import React, { useState } from "react"
import {
    X,
    Users,
    Search,
    UserPlus,
    UserMinus,
    Crown,
    CheckCircle2,
    ShieldCheck,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTeamStore, Team } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

interface ManageTeamMembersModalProps {
    team: Team
    isOpen: boolean
    onClose: () => void
}

export function ManageTeamMembersModal({ team, isOpen, onClose }: ManageTeamMembersModalProps) {
    const { getMembersByWorkspace, getTeamMembers, addMemberToTeam, removeMemberFromTeam } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    if (!isOpen) return null

    const workspaceMembers = activeWorkspaceId ? getMembersByWorkspace(activeWorkspaceId) : []
    const teamMembers = getTeamMembers(team.id)
    const teamMemberIds = teamMembers.map(m => m.id)

    // Filter people not in team
    const availablePeople = workspaceMembers.filter(m =>
        !teamMemberIds.includes(m.id) &&
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAdd = (memberId: string) => {
        addMemberToTeam(team.id, memberId)
    }

    const handleRemove = (memberId: string) => {
        if (memberId === team.leadId) return // Cannot remove lead
        removeMemberFromTeam(team.id, memberId)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-[700px] h-[650px] rounded-[40px] shadow-2xl border-4 border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                style={{ zoom: "0.85" }}
            >
                {/* Header */}
                <div className="px-10 py-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 rotate-3 group-hover:rotate-0 transition-transform">
                            {team.avatar ? <span className="text-2xl">{team.avatar}</span> : <Users size={28} />}
                        </div>
                        <div>
                            <h2 className="text-[24px] font-black text-slate-800 tracking-tight uppercase leading-none">{team.name}</h2>
                            <p className="text-[13px] font-bold text-slate-400 mt-2 italic">Manage who's on this team and their contributions.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-full text-slate-400 hover:text-slate-800 transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Current Members */}
                    <div className="w-[55%] border-r border-slate-50 flex flex-col pt-6">
                        <div className="px-8 mb-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-4 flex items-center gap-2">
                                <ShieldCheck size={12} className="text-indigo-500" />
                                Current Team ({teamMembers.length})
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-6">
                            {teamMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 group transition-all">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-[14px] font-black text-slate-800 tracking-tight uppercase leading-none">{member.name}</p>
                                            <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                    {member.id === team.leadId ? (
                                        <Badge className="bg-amber-100 text-amber-600 border-none font-black text-[9px] px-2 h-5 tracking-widest uppercase">Lead</Badge>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(member.id)}
                                            className="h-8 w-8 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <UserMinus size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Add Members */}
                    <div className="flex-1 bg-slate-50/30 flex flex-col pt-6">
                        <div className="px-8 space-y-4 mb-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <UserPlus size={12} className="text-indigo-500" />
                                Add to Team
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                <Input
                                    placeholder="Search people..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 pl-9 text-[12px] font-bold rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 bg-white shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-6">
                            {availablePeople.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-[13px] font-black text-slate-700 tracking-tight uppercase leading-none">{member.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleAdd(member.id)}
                                        className="h-8 w-8 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg shadow-sm transition-all"
                                        size="icon"
                                    >
                                        <Plus size={16} />
                                    </Button>
                                </div>
                            ))}
                            {availablePeople.length === 0 && (
                                <div className="py-10 text-center space-y-2">
                                    <p className="text-[12px] font-bold text-slate-400 italic">No more members to add.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-6 bg-slate-800 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <Users size={18} className="text-slate-400" />
                        <span className="text-[14px] font-bold text-slate-300 italic">Editing membership for {team.name}</span>
                    </div>
                    <Button
                        onClick={onClose}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-black h-10 px-8 rounded-xl shadow-lg shadow-indigo-500/20 uppercase tracking-widest text-[11px]"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}

function Plus({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 16} height={size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
