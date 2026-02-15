"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Phone,
    Mail,
    Users,
    Video,
    MessageSquare,
    Calendar,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    TrendingUp,
    Target,
    Zap,
    History,
    FileText,
    Activity,
    Edit3,
    Trash2,
    Copy,
    Share2,
    LayoutDashboard,
    ArrowRight
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function CRMActivitiesPage() {
    const [activities, setActivities] = useState([
        {
            id: "1",
            type: "Call",
            title: "Discovery Call - Project Titan",
            user: "Michael Chen",
            lead: "Globex Corp",
            time: "10:30 AM",
            duration: "24m",
            status: "Completed",
            icon: Phone,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            id: "2",
            type: "Email",
            title: "Proposal Follow-up - Phase 4",
            user: "Sarah Johnson",
            lead: "Acme Inc",
            time: "11:45 AM",
            duration: "5m",
            status: "Sent",
            icon: Mail,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            id: "3",
            type: "Meeting",
            title: "Onboarding Session & Demo",
            user: "David Miller",
            lead: "Umbrella Corp",
            time: "02:00 PM",
            duration: "1h 15m",
            status: "Upcoming",
            icon: Video,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            id: "4",
            type: "Note",
            title: "Strategy Review Internal",
            user: "Jessica Lee",
            lead: "Initech",
            time: "04:30 PM",
            duration: "12m",
            status: "Logged",
            icon: FileText,
            color: "text-amber-600",
            bg: "bg-amber-50"
        }
    ])

    const handleDelete = (id: string) => {
        setActivities(prev => prev.filter(a => a.id !== id))
        toast.error("Activity purged from timeline")
    }

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Activity Real-time Sync"
                breadcrumbItems={[
                    { label: "CRM System", href: "#" },
                    { label: "Timeline", href: "/modules/crm/activities" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic shadow-sm">
                            Calendar View
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Log Interaction
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1700px] mx-auto w-full">
                {/* Visual HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Total Loops", value: "1,242", icon: History, color: "text-blue-600" },
                        { label: "Talk Time", value: "48.5h", icon: Clock, color: "text-emerald-600" },
                        { label: "Conversion Lift", value: "12.4%", icon: Zap, color: "text-purple-600" },
                        { label: "Active Reps", value: "24", icon: Users, color: "text-amber-600" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 shadow-xl relative group overflow-hidden transition-all hover:shadow-2xl hover:translate-y-[-4px]">
                            <stat.icon className={`absolute -right-4 -bottom-4 h-24 w-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-1000`} />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] leading-none mb-4 italic">{stat.label}</p>
                                <h2 className="text-4xl font-black tracking-tighter italic">{stat.value}</h2>
                                <div className="mt-4 h-1 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${stat.color.replace('text', 'bg')} w-[70%] opacity-20`} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Timeline Control */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
                    <div className="p-12 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-zinc-50/20 dark:bg-zinc-800/10">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-blue-600/30 rotate-2">
                                <Activity size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Enterprise Heartbeat</h3>
                                <p className="text-sm font-black text-zinc-400 mt-2 uppercase tracking-widest italic opacity-70">Unified interaction ledger across all communication vectors.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <CustomInput placeholder="Search activities..." className="pl-12 h-12 rounded-[24px] bg-white border-zinc-200 shadow-inner" />
                            </div>
                            <CustomButton variant="outline" className="h-12 w-12 rounded-[20px] p-0 border-zinc-200">
                                <Filter size={20} />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-12 relative min-h-[600px]">
                        {/* Timeline Spine */}
                        <div className="absolute left-24 top-0 bottom-0 w-px bg-zinc-100 dark:bg-zinc-800 hidden md:block" />

                        <div className="space-y-12">
                            <AnimatePresence mode="popLayout">
                                {activities.map((act, idx) => (
                                    <motion.div
                                        key={act.id}
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative flex flex-col md:flex-row items-center md:items-start gap-12 group"
                                    >
                                        <div className="w-24 text-right pt-6 shrink-0 hidden md:block">
                                            <span className="text-sm font-black italic text-zinc-400 uppercase tracking-tighter">{act.time}</span>
                                        </div>

                                        <div className={`relative z-10 h-16 w-16 rounded-[24px] ${act.bg} ${act.color} flex items-center justify-center shadow-xl border-4 border-white dark:border-zinc-900 group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                                            <act.icon size={28} />
                                        </div>

                                        <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-800/30 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all relative overflow-hidden group/card">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${act.bg} ${act.color} shadow-sm uppercase italic`}>{act.type} // {act.status}</Badge>
                                                        <span className="text-xs font-bold text-zinc-400 italic">Duration: {act.duration}</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none pt-2 group-hover/card:text-blue-600 transition-colors uppercase">{act.title}</h4>
                                                    <div className="flex items-center gap-6 mt-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[8px] font-black italic">SR</div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{act.user}</span>
                                                        </div>
                                                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Lead:</span>
                                                            <span className="text-xs font-black uppercase italic text-blue-600 underline decoration-blue-600/30 underline-offset-4">{act.lead}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CustomButton variant="outline" className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-zinc-200 hover:border-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover/card:opacity-100 italic">View Transcript</CustomButton>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <CustomButton variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/50 border border-zinc-100 group-hover/card:shadow-lg transition-all">
                                                                <MoreVertical size={20} className="text-zinc-400" />
                                                            </CustomButton>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-[32px] w-56 p-2 shadow-3xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                            <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic"><Edit3 size={16} /> Edit Entry</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic"><Copy size={16} /> Duplicate Logic</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic"><Share2 size={16} /> Internal Link</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(act.id)} className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs text-red-600 focus:bg-red-600 focus:text-white-100 font-black italic uppercase"><Trash2 size={16} /> Expunge Record</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Timeline Load More Target */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="ml-0 md:ml-36 border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[56px] flex flex-col items-center justify-center p-16 text-center group cursor-pointer hover:bg-zinc-100/30 hover:border-blue-300 transition-all"
                            >
                                <div className="h-20 w-20 bg-zinc-50 group-hover:bg-blue-600 group-hover:text-white rounded-[28px] flex items-center justify-center mb-6 shadow-inner group-hover:shadow-2xl transition-all duration-700">
                                    <Plus size={32} />
                                </div>
                                <h4 className="text-2xl font-black uppercase tracking-tighter text-zinc-400 group-hover:text-blue-600 transition-colors italic leading-none">Load Historical Fragments</h4>
                                <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.2em] leading-relaxed max-w-[250px] opacity-40 italic">Decrypting and synchronizing the past 48 hours of business telemetry.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Intelligent Insights row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Card className="rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 shadow-inner">
                                <TrendingUp size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Velocity Analytics</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Sentiment and engagement vector tracking.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { label: "Client Sentiment", score: "H", color: "text-emerald-500", desc: "Highly Positive" },
                                { label: "Rep Activity", score: "92", color: "text-blue-500", desc: "Exceeding Target" },
                                { label: "Response Delay", score: "4m", color: "text-purple-500", desc: "Decreasing" },
                                { label: "Lead Warmth", score: "88", color: "text-orange-500", desc: "Ready for Deal" },
                            ].map((stat, i) => (
                                <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-800/40 rounded-[40px] border border-zinc-100 hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">{stat.label}</span>
                                    <span className={`text-3xl font-black italic ${stat.color}`}>{stat.score}</span>
                                    <span className="text-[8px] font-bold uppercase text-zinc-400">{stat.desc}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[64px] p-16 bg-zinc-900 border-0 shadow-3xl text-white relative overflow-hidden group">
                        <LayoutDashboard className="absolute -bottom-20 -right-20 h-96 w-96 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]" />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Meta Logic Orchestrator</h3>
                            <p className="text-lg font-bold text-zinc-400 italic uppercase tracking-[0.1em] leading-relaxed">Automatically categorize and score every interaction using the Neural Business SDK.</p>
                            <div className="pt-10 flex flex-col gap-6">
                                <CustomButton className="bg-white text-zinc-900 rounded-[32px] h-20 w-full font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform text-base italic">Initialize Neural Scan</CustomButton>
                                <div className="flex items-center justify-center gap-6">
                                    <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 px-4 py-2 text-[10px] font-black uppercase tracking-widest italic">NEURAL ENGINE: STABLE</Badge>
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
