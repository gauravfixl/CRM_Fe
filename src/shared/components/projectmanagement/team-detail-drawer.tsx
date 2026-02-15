"use client"

import React, { useState, useEffect } from "react"
import { Team, TeamMember, useTeamStore } from "@/shared/data/teams-store"
import { SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    X,
    Users,
    ShieldCheck,
    UserPlus,
    Settings2,
    Archive,
    Trash2,
    MoreVertical,
    Mail,
    Calendar,
    ChevronDown,
    Layout
} from "lucide-react"

interface TeamDetailDrawerProps {
    teamId: string
    onClose: () => void
}

/**
 * SOURCE OF TRUTH: Team Operational Control
 */
export default function TeamDetailDrawer({ teamId, onClose }: TeamDetailDrawerProps) {
    const { teams, teamMembers, updateTeam, removeTeamMember } = useTeamStore()
    const team = teams.find(t => t.id === teamId)
    const members = teamMembers[teamId] || []

    const [activeTab, setActiveTab] = useState("members")

    if (!team) return null

    const handleRemoveMember = (memberId: string) => {
        if (confirm("Remove this member from the team?")) {
            removeTeamMember(teamId, memberId)
        }
    }

    const handleToggleArchive = () => {
        updateTeam(teamId, { isArchived: !team.isArchived })
    }

    return (
        <SheetContent className="sm:max-w-[650px] p-0 border-l border-slate-200 shadow-2xl flex flex-col h-full bg-white font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-20 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-xl text-white shadow-lg ${team.isArchived ? 'bg-slate-400' : 'bg-indigo-600'}`}>
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">{team.name}</h4>
                            {team.isArchived && <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-slate-100">Archived</Badge>}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {team.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-50 rounded-xl">
                        <Settings2 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all">
                        <X size={24} />
                    </Button>
                </div>
            </div>

            {/* Sub-Header Navigation */}
            <div className="px-8 flex items-center gap-8 border-b border-slate-100 bg-slate-50/50">
                {[
                    { id: "members", label: "Team Members", count: members.length },
                    { id: "analytics", label: "Operational Analytics", count: null },
                    { id: "settings", label: "Governance", count: null }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-14 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab.label}
                        {tab.count !== null && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500">{tab.count}</span>}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-10">

                    {activeTab === "members" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Member Roster</h3>
                                <Button className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest gap-2">
                                    <UserPlus size={14} />
                                    Add Member
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div key={member.id} className="group p-4 bg-white border-2 border-slate-100 rounded-[24px] hover:border-indigo-100 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-11 w-11 border-2 border-slate-50">
                                                <AvatarImage src={member.userAvatar} />
                                                <AvatarFallback>{member.userName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{member.userName}</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="ghost" className="text-[9px] font-bold text-slate-400 p-0 hover:bg-transparent">
                                                        <Mail size={10} className="mr-1" />
                                                        {member.userEmail}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge className={`font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border-none ${member.role === 'TeamAdmin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {member.role}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {[{ label: "Total Tasks", val: "24", icon: <Layout className="text-blue-500" /> }, { label: "Completed", val: "18", icon: <ShieldCheck className="text-emerald-500" /> }].map((s, i) => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            {s.icon}
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                                        </div>
                                        <p className="text-3xl font-black text-slate-800">{s.val}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-8 bg-indigo-600 rounded-[40px] text-white space-y-4">
                                <h4 className="text-lg font-black uppercase tracking-tight leading-none">Team Efficiency: 82%</h4>
                                <p className="text-[12px] font-medium text-indigo-100 leading-relaxed">This team is outperforming the workspace average by 14.5% during this sprint cycle.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-8">
                            <div className="p-6 bg-slate-50 rounded-[30px] border border-slate-100 space-y-6">
                                <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Active Team Governance</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Archive size={16} className="text-slate-400" />
                                            <span className="text-[12px] font-bold text-slate-600">Archive this team</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleToggleArchive}
                                            className={`h-8 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest border-2 transition-all ${team.isArchived ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-500'}`}
                                        >
                                            {team.isArchived ? "Unarchive" : "Archive"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100">
                                        <div className="flex items-center gap-3">
                                            <Trash2 size={16} className="text-rose-500" />
                                            <span className="text-[12px] font-bold text-rose-500">Delete Permanently</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="h-8 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest bg-rose-50 text-rose-600 hover:bg-rose-100"
                                        >
                                            Terminate
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </ScrollArea>
        </SheetContent>
    )
}
