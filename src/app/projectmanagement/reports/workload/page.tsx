"use client"

import React, { useState, useEffect } from "react"
import {
    Users,
    UserPlus,
    Clock,
    Zap,
    AlertCircle,
    ChevronDown,
    Calendar,
    Download,
    BarChart3,
    Search,
    Filter
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"

/**
 * 👥 Workload & Capacity Report
 * Focuses on team allocation, individual load, and peaks.
 */
export default function WorkloadReport() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const teamMembers = [
        { name: "Sahil S.", avatar: "SS", role: "Product Designer", capacity: 32, used: 28, tasks: 12, color: "bg-indigo-600" },
        { name: "Sarah K.", avatar: "SK", role: "Fullstack Dev", capacity: 40, used: 45, tasks: 18, color: "bg-rose-500" },
        { name: "James W.", avatar: "JW", role: "Frontend Dev", capacity: 30, used: 15, tasks: 6, color: "bg-emerald-500" },
        { name: "Mike L.", avatar: "ML", role: "QA Lead", capacity: 25, used: 22, tasks: 9, color: "bg-amber-500" },
        { name: "Emma B.", avatar: "EB", role: "Backend Dev", capacity: 40, used: 38, tasks: 14, color: "bg-blue-600" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-8 font-outfit" style={{ zoom: "80%" }}>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
                        <Users size={14} />
                        Resource Planning
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workload & Capacity</h1>
                    <p className="text-sm text-slate-500 font-medium italic">
                        Identify bottlenecks and balance team workload across active missions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 font-bold gap-2">
                        <Calendar size={16} />
                        Current Week
                        <ChevronDown size={14} className="text-slate-400" />
                    </Button>
                    <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-lg shadow-slate-200 transition-all hover:scale-105">
                        <UserPlus size={16} />
                        Modify Capacity
                    </Button>
                </div>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-slate-100 shadow-sm bg-indigo-50/50 p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-indigo-600">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Occupancy</p>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">84%</h2>
                        <div className="flex items-center gap-2 text-[12px] font-bold bg-white border border-indigo-100 shadow-sm w-fit px-3 py-1 rounded-full text-indigo-600">
                            <Zap size={14} className="fill-current" />
                            <span>Efficiency Peak reached</span>
                        </div>
                    </div>
                </Card>

                <Card className="border border-slate-100 shadow-sm p-6 relative group bg-rose-50/30">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">At Critical Load</p>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">02</h2>
                            <span className="text-rose-500 bg-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-rose-100 italic">Attention Required</span>
                        </div>
                        <div className="flex -space-x-2">
                            <Avatar className="h-7 w-7 border-2 border-white shadow-sm"><AvatarImage src="https://i.pravatar.cc/150?u=sk" /></Avatar>
                            <Avatar className="h-7 w-7 border-2 border-white shadow-sm"><AvatarImage src="https://i.pravatar.cc/150?u=eb" /></Avatar>
                        </div>
                    </div>
                </Card>

                <Card className="border border-slate-100 shadow-sm p-6 relative group bg-amber-50/30">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unassigned Effort</p>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">12 <span className="text-sm text-slate-400 font-medium">pts</span></h2>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                            <AlertCircle size={14} className="text-amber-500" />
                            From Backlog Items
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Section: Team Distribution */}
            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-black text-slate-800 tracking-tight">Team Distribution Hub</CardTitle>
                            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-reference occupancy vs available story points</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input placeholder="Find member..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 outline-none w-48 shadow-sm transition-all" />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200"><Filter size={16} className="text-slate-500" /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-8">
                        {teamMembers.map((member, i) => {
                            const loadPercentage = (member.used / member.capacity) * 100;
                            const isOverloaded = loadPercentage > 100;

                            return (
                                <div key={member.name} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${member.avatar}`} />
                                                <AvatarFallback>{member.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 tracking-tight">{member.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={`text-[13px] font-black ${isOverloaded ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                                                    {member.used} / {member.capacity} pts
                                                </span>
                                                <Badge className={`${isOverloaded ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'} border-none font-black text-[10px] px-2 py-0.5`}>
                                                    {Math.round(loadPercentage)}% Load
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">{member.tasks} active tasks assigned</p>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                        <div
                                            className={`h-full ${isOverloaded ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : member.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                                        />
                                    </div>
                                    {isOverloaded && (
                                        <div className="flex items-center gap-1.5 text-rose-500">
                                            <AlertCircle size={10} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Exceeds recommended sprint capacity</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
