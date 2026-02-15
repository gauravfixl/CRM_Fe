"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Users,
    Plus,
    Search,
    MoreHorizontal,
    ShieldCheck,
    UserPlus,
    Layout,
    Settings,
    MoreVertical,
    CheckCircle2,
    ChevronRight,
    Trello,
    Zap,
    Trash2,
    Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useTeamStore, Team } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { CreateTeamModal } from "@/shared/components/projectmanagement/create-team-modal"
import { ManageTeamMembersModal } from "@/shared/components/projectmanagement/manage-team-members-modal"

export default function ProjectTeamsPage() {
    const { id } = useParams()
    const { getTeamsByWorkspace, members } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedTeamForManage, setSelectedTeamForManage] = useState<Team | null>(null)

    const teams = activeWorkspaceId ? getTeamsByWorkspace(activeWorkspaceId) : []

    const getLeadName = (leadId: string) => {
        return members.find(m => m.id === leadId)?.name || "Unknown Lead"
    }

    const filteredTeams = teams.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getLeadName(t.leadId).toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full gap-5 max-w-[1400px] mx-auto pb-10 font-sans">
            <CreateTeamModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

            {selectedTeamForManage && (
                <ManageTeamMembersModal
                    team={selectedTeamForManage}
                    isOpen={!!selectedTeamForManage}
                    onClose={() => setSelectedTeamForManage(null)}
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-100 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Teams & Squads</h1>
                        <p className="text-[13px] text-slate-500 font-medium">Manage collaborative groups and their dedicated boards.</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 font-semibold h-9 gap-2 shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] px-5 rounded-lg text-[12px]"
                >
                    <Plus size={16} />
                    Create New Team
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Teams", val: teams.length.toString().padStart(2, '0'), icon: <Users size={14} />, color: "bg-blue-50 text-blue-600" },
                    { label: "Active Members", val: members.filter(m => m.workspaceId === activeWorkspaceId).length.toString(), icon: <UserPlus size={14} />, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Managed Boards", val: "05", icon: <Layout size={14} />, color: "bg-amber-50 text-amber-600" },
                    { label: "Permissions", val: "Strict", icon: <ShieldCheck size={14} />, color: "bg-rose-50 text-rose-600" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-xl bg-white">
                        <CardContent className="p-3.5 flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${stat.color}`}>{stat.icon}</div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-lg font-bold text-slate-800 leading-none">{stat.val}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        placeholder="Search teams..."
                        className="pl-9 h-9 border-slate-200 bg-white font-medium rounded-lg text-[13px] shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-700 placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-slate-500 font-medium text-[12px] gap-2 hover:bg-slate-50 rounded-lg px-3 h-8">
                        <Settings2 size={14} />
                        Settings
                    </Button>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTeams.map((team) => (
                    <Card key={team.id} className="group border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300 overflow-hidden bg-white rounded-2xl">
                        <CardHeader className="p-5 pb-2">
                            <div className="flex items-start justify-between">
                                <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all text-lg shadow-sm">
                                    {team.avatar || <Trello size={18} />}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 group-hover:text-slate-600 transition-colors"><MoreVertical size={16} /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px] font-sans rounded-xl shadow-lg p-1 border border-slate-100">
                                        <DropdownMenuItem className="font-medium text-[12px] gap-2 cursor-pointer p-2 rounded-lg"><Layout size={13} /> Configure</DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setSelectedTeamForManage(team)}
                                            className="font-medium text-[12px] gap-2 cursor-pointer p-2 rounded-lg text-indigo-600 focus:text-indigo-700"
                                        >
                                            <UserPlus size={13} /> Members
                                        </DropdownMenuItem>
                                        <Separator className="my-1" />
                                        <DropdownMenuItem className="font-medium text-[12px] text-rose-600 gap-2 cursor-pointer focus:bg-rose-50 focus:text-rose-600 p-2 rounded-lg"><Trash2 size={13} /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 space-y-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[15px] font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{team.name}</h3>
                                    <Badge variant="outline" className="text-[10px] font-medium text-indigo-500 bg-indigo-50 border-indigo-100 py-0 px-1.5 rounded-md h-4">Active</Badge>
                                </div>
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-2 min-h-[36px]">
                                    {team.description || "No description provided."}
                                </p>
                            </div>

                            <div className="space-y-3 py-3 border-y border-slate-50">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-400 ml-0.5">Team Leader</p>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-5 w-5 border border-white shadow-sm ring-1 ring-slate-100">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${team.leadId}`} />
                                                <AvatarFallback>TL</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[12px] font-semibold text-slate-700">{getLeadName(team.leadId)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[11px] font-bold text-slate-400 mr-0.5">Type</p>
                                        <div className="flex items-center justify-end gap-1.5 text-[11px] font-semibold text-slate-700">
                                            <Layout size={12} className="text-indigo-500" />
                                            Kanban
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between px-0.5">
                                        <p className="text-[11px] font-bold text-slate-400">Members</p>
                                        <span className="text-[10px] font-medium text-slate-400">{team.memberIds.length} Total</span>
                                    </div>
                                    <div className="flex -space-x-2 transition-all duration-300">
                                        {team.memberIds.slice(0, 4).map((mId, i) => (
                                            <Avatar key={i} className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-slate-100 hover:scale-110 hover:z-20 transition-all cursor-pointer">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${mId}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {team.memberIds.length > 4 && (
                                            <div className="h-7 w-7 border-2 border-white shadow-sm ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center rounded-full text-[9px] font-semibold text-slate-500">
                                                +{team.memberIds.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => setSelectedTeamForManage(team)}
                                className="w-full bg-slate-50 hover:bg-indigo-600 text-slate-600 hover:text-white font-semibold h-9 rounded-lg transition-all duration-300 text-[11px] gap-2 border border-slate-200 hover:border-indigo-600 group/btn shadow-sm"
                            >
                                <Users size={14} className="transition-transform group-hover/btn:scale-110" />
                                Manage Membership
                                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Create Team CTA Card */}
                <Card
                    onClick={() => setIsCreateModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center space-y-3 group rounded-2xl bg-slate-50/50"
                >
                    <div className="h-12 w-12 rounded-full bg-white text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 flex items-center justify-center shadow-sm">
                        <Plus size={20} className="transition-transform group-hover:rotate-90" />
                    </div>
                    <div>
                        <h4 className="text-[14px] font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">Build a New Squad</h4>
                        <p className="text-[11px] text-slate-400 mt-1 px-4">Create a dedicated space for collaborative project work.</p>
                    </div>
                </Card>
            </div>

            {/* Premium Footnote */}
            <div className="mt-2 p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[24px] text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
                    <Zap size={150} />
                </div>
                <div className="max-w-xl space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-400/30 rounded-full">
                        <Zap size={12} className="fill-indigo-400 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-300">Architecture Tip</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">Team-Managed Autonomy</h3>
                        <p className="text-indigo-200/70 text-[12px] leading-relaxed font-medium mt-1">
                            "Teams are the backbone of parallel development. Assign dedicated boards to squads to ensure focus without global noise. Use the membership manager to keep roles sharp."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
