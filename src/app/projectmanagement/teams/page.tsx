"use client"

import React, { useState, useEffect } from "react"
import {
    Plus,
    Users,
    ArrowRight,
    Search,
    LayoutGrid,
    SearchX,
    Settings2,
    Target,
    Zap,
    Globe,
    Shield,
    MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useTeamStore, Team } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { CreateTeamModal } from "@/shared/components/projectmanagement/create-team-modal"
import { ManageTeamMembersModal } from "@/shared/components/projectmanagement/manage-team-members-modal"
import { Badge } from "@/components/ui/badge"

export default function TeamsPage() {
    const [mounted, setMounted] = useState(false)
    const { getTeamsByWorkspace, members } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    useEffect(() => {
        setMounted(true)
        useTeamStore.persist.rehydrate()
        useWorkspaceStore.persist.rehydrate()
    }, [])

    const teams = (mounted && activeWorkspaceId) ? getTeamsByWorkspace(activeWorkspaceId) : []

    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedTeamForManage, setSelectedTeamForManage] = useState<Team | null>(null)

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getLeadName = (leadId: string) => {
        return members.find(m => m.id === leadId)?.name || "Unknown Lead"
    }

    if (!mounted) return null

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-4 py-4 animate-in fade-in duration-500 px-6 pb-20 font-sans">
            <CreateTeamModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {selectedTeamForManage && (
                <ManageTeamMembersModal
                    team={selectedTeamForManage}
                    isOpen={!!selectedTeamForManage}
                    onClose={() => setSelectedTeamForManage(null)}
                />
            )}

            {/* 🏷️ Mini Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-indigo-600 rounded flex items-center justify-center text-white shadow-sm">
                            <Users size={14} />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Teams Directory</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Search teams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 w-[200px] bg-white border border-slate-200 rounded-lg text-[12px] focus:ring-1 focus:ring-indigo-500/20"
                        />
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[12px] flex items-center gap-2"
                    >
                        <Plus size={14} strokeWidth={3} />
                        New Team
                    </Button>
                </div>
            </div>

            {/* 📊 Filters Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <div className="flex items-center gap-5">
                    <button className="text-[12px] font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1 px-1">All Squads</button>
                    <button className="text-[12px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1 transition-colors">Internal</button>
                    <button className="text-[12px] font-bold text-slate-400 hover:text-slate-600 pb-1 px-1 transition-colors">Client Facing</button>
                </div>
            </div>

            {/* 🏗️ Compact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTeams.map((team) => (
                    <Card key={team.id} className="group border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-xl bg-white overflow-hidden flex flex-col h-full">
                        <div className="p-4 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-[20px] shadow-sm group-hover:bg-indigo-50 transition-colors">
                                    {team.avatar || "👥"}
                                </div>
                                <button
                                    onClick={() => setSelectedTeamForManage(team)}
                                    className="h-7 w-7 text-slate-300 hover:text-slate-900 rounded-md flex items-center justify-center"
                                >
                                    <Settings2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-[14px] font-bold text-slate-900 truncate">
                                    {team.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 line-clamp-2 h-[32px] italic">
                                    "{team.description || "No mission statement provided."}"
                                </p>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Avatar className="h-6 w-6 border border-white shadow-sm">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${team.leadId}`} />
                                            <AvatarFallback className="text-[9px]">{getLeadName(team.leadId)[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[80px]">{getLeadName(team.leadId)}</span>
                                    </div>
                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] px-1.5 h-4.5 rounded-full">
                                        {team.memberIds.length} Mbrs
                                    </Badge>
                                </div>

                                <div className="flex -space-x-1.5 overflow-hidden">
                                    {team.memberIds.slice(0, 4).map((mid, idx) => (
                                        <Avatar key={idx} className="h-6 w-6 border border-white ring-1 ring-slate-100 shadow-sm">
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${mid}`} />
                                            <AvatarFallback className="text-[8px]">U</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {team.memberIds.length > 4 && (
                                        <div className="h-6 w-6 rounded-full bg-slate-50 border border-white flex items-center justify-center text-[9px] font-bold text-slate-400">
                                            +{team.memberIds.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedTeamForManage(team)}
                            className="px-4 py-2.5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between group/btn w-full"
                        >
                            <span className="text-[11px] font-bold text-slate-500 group-hover/btn:text-indigo-600 transition-colors">Manage</span>
                            <ArrowRight size={12} className="text-slate-300 group-hover/btn:text-indigo-600 group-hover/btn:translate-x-0.5 transition-all" />
                        </button>
                    </Card>
                ))}
            </div>

            {filteredTeams.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Users size={24} className="text-slate-300 mb-2" />
                    <p className="text-[12px] font-bold text-slate-500">No teams found</p>
                </div>
            )}
        </div>
    )
}
