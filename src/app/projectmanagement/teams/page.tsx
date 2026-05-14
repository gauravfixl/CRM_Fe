"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Plus,
    Users,
    ArrowRight,
    Search,
    Settings2,
    UserCheck,
    UserPlus,
    Crown,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTeamStore, Team } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { CreateTeamModal } from "@/shared/components/projectmanagement/create-team-modal"
import { ManageTeamMembersModal } from "@/shared/components/projectmanagement/manage-team-members-modal"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Tab = "all" | "small" | "large"

export default function TeamsPage() {
    const [mounted, setMounted] = useState(false)
    const { getTeamsByWorkspace, members } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedTeamForManage, setSelectedTeamForManage] = useState<Team | null>(null)
    const [tab, setTab] = useState<Tab>("all")

    useEffect(() => {
        setMounted(true)
        useTeamStore.persist.rehydrate()
        useWorkspaceStore.persist.rehydrate()
    }, [])

    const teams = (mounted && activeWorkspaceId) ? getTeamsByWorkspace(activeWorkspaceId) : []

    const filteredTeams = useMemo(() => {
        let result = teams.filter(t =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (tab === "small") result = result.filter(t => t.memberIds.length <= 5)
        if (tab === "large") result = result.filter(t => t.memberIds.length > 5)
        return result
    }, [teams, searchQuery, tab])

    const getLeadName = (leadId: string) => {
        return members.find(m => m.id === leadId)?.name || "Unknown Lead"
    }

    if (!mounted) return null

    const totalTeams = teams.length
    const totalMembers = new Set(teams.flatMap(t => t.memberIds)).size
    const teamLeads = new Set(teams.map(t => t.leadId)).size
    const averageSize = totalTeams > 0 ? Math.round(teams.reduce((s, t) => s + t.memberIds.length, 0) / totalTeams) : 0

    const kpis: { label: string; value: string | number; icon: React.ReactNode; color: string; bg: string; onClick: () => void; filter: Tab }[] = [
        { label: "Total Teams", value: totalTeams, icon: <Users size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", onClick: () => setTab("all"), filter: "all" },
        { label: "Team Leads", value: teamLeads, icon: <Crown size={18} />, color: "text-amber-800", bg: "bg-amber-100", onClick: () => setTab("all"), filter: "all" },
        { label: "Total Members", value: totalMembers, icon: <UserCheck size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", onClick: () => setTab("all"), filter: "all" },
        { label: "Avg Team Size", value: averageSize, icon: <UserPlus size={18} />, color: "text-rose-800", bg: "bg-rose-100", onClick: () => setTab("all"), filter: "all" },
    ]

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

            {/* Mini Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
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
                            className="pl-9 h-8 w-[200px] bg-white border border-slate-200 text-[12px] focus:ring-1 focus:ring-indigo-500/20 rounded-none"
                        />
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] flex items-center gap-2 rounded-none"
                    >
                        <Plus size={14} strokeWidth={3} />
                        New Team
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={stat.onClick}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left ${stat.bg}`}
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

            {/* Filters Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <div className="flex items-center gap-5">
                    {([
                        { id: "all", label: "All Squads" },
                        { id: "small", label: "Small (≤5)" },
                        { id: "large", label: "Large (>5)" },
                    ] as { id: Tab; label: string }[]).map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className={cn(
                                "text-[12px] font-bold pb-1 px-1 transition-colors border-b-2",
                                tab === t.id ? "text-indigo-600 border-indigo-600" : "text-slate-400 hover:text-slate-600 border-transparent"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredTeams.map((team) => (
                    <Card key={team.id} className="group border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden flex flex-col h-full rounded-none">
                        <div className="p-4 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="h-10 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-[20px] shadow-sm group-hover:bg-indigo-50 transition-colors rounded-none">
                                    {team.avatar || "👥"}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTeamForManage(team)}
                                    className="h-7 w-7 text-slate-300 hover:text-slate-900 flex items-center justify-center rounded-none"
                                    aria-label="Manage team"
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
                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] px-1.5 h-4.5 rounded-none">
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
                                        <div className="h-6 w-6 bg-slate-50 border border-white flex items-center justify-center text-[9px] font-bold text-slate-400 rounded-none">
                                            +{team.memberIds.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
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
                <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-none">
                    <Users size={24} className="text-slate-300 mb-2" />
                    <p className="text-[12px] font-bold text-slate-500 mb-3">No teams found</p>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[12px] gap-2 rounded-none"
                    >
                        <Plus size={14} strokeWidth={3} /> Create your first team
                    </Button>
                </div>
            )}
        </div>
    )
}
