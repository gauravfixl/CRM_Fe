"use client"

import React, { useState, useEffect } from "react"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useTeamStore } from "@/shared/data/teams-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    LayoutGrid,
    Users,
    ShieldCheck,
    Zap,
    Building2,
    Globe2,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet } from "@/components/ui/sheet"
import MemberManagementDrawer from "@/shared/components/projectmanagement/member-management-drawer"
import TeamDetailDrawer from "@/shared/components/projectmanagement/team-detail-drawer"

export default function WorkspaceGovernancePage() {
    const [mounted, setMounted] = React.useState(false)
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
    const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
        useWorkspaceStore.persist.rehydrate()
        useTeamStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const { teams } = useTeamStore()
    const { projects } = useProjectStore()

    const displayTeams = mounted ? teams : []
    const displayProjects = mounted ? projects : []

    return (
        <div className="w-full h-full p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workspace Management</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Manage teams, projects, and workspace settings.
                    </p>
                </div>
                <Button
                    onClick={() => setIsMemberDrawerOpen(true)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                    <Users size={16} />
                    Manage Access
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Active Projects", val: displayProjects.length, icon: <LayoutGrid size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Teams", val: displayTeams.length, icon: <Globe2 size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Security", val: "v2.4", icon: <ShieldCheck size={20} />, color: "text-indigo-600", bg: "bg-indigo-50" }
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
                            </div>
                            <div className={`h-10 w-10 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Teams Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800">Teams</h3>
                        <div className="flex items-center gap-2">
                            <Input placeholder="Filter teams..." className="h-8 w-[160px] text-xs" />
                            <Button size="sm" variant="outline" className="h-8 text-xs">New Team</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayTeams.map(team => (
                            <Card
                                key={team.id}
                                onClick={() => setSelectedTeamId(team.id)}
                                className="cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
                            >
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                            {team.name.charAt(0)}
                                        </div>
                                        <Badge variant="secondary" className="text-[10px]">
                                            {team.membersCount} Members
                                        </Badge>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{team.name}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Created: {mounted ? new Date(team.createdAt).toLocaleDateString() : "..."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Security Section */}
                <div className="space-y-4">
                    <Card className="bg-slate-900 text-white border-none">
                        <CardContent className="p-6 space-y-4">
                            <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Security & Compliance</h3>
                            <p className="text-sm text-slate-400">
                                Global permissions and IP whitelisting are active.
                            </p>
                            <div className="space-y-2">
                                {["2FA Enforcement", "Data Auditing", "Session Recovery"].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-medium">
                                        <Zap size={14} className="text-indigo-400" />
                                        {feat}
                                    </div>
                                ))}
                            </div>
                            <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                                Configure Policies
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* DRAWERS */}
            <Sheet open={isMemberDrawerOpen} onOpenChange={setIsMemberDrawerOpen}>
                <MemberManagementDrawer
                    type="WORKSPACE"
                    id="ws-primary"
                    onClose={() => setIsMemberDrawerOpen(false)}
                />
            </Sheet>

            <Sheet open={!!selectedTeamId} onOpenChange={(open) => !open && setSelectedTeamId(null)}>
                {selectedTeamId && (
                    <TeamDetailDrawer
                        teamId={selectedTeamId}
                        onClose={() => setSelectedTeamId(null)}
                    />
                )}
            </Sheet>
        </div>
    )
}
