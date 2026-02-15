"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CheckCircle2,
    Clock,
    Plus,
    Search,
    Filter,
    ArrowRight,
    SearchCheck,
    History,
    MoreVertical,
    FileText,
    Activity,
    Edit3,
    Trash2,
    Copy,
    Share2,
    LayoutDashboard,
    Zap,
    TrendingUp,
    Briefcase,
    Flag,
    AlertCircle,
    Calendar,
    Users,
    Maximize2
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

export default function GlobalTasksPage() {
    const [tasks, setTasks] = useState([
        {
            id: "1",
            title: "Architect Serverless GraphQL Node",
            project: "Core Cloud Sync",
            priority: "High",
            status: "In Progress",
            due: "2h left",
            effort: "8h",
            user: "Alice J.",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            id: "2",
            title: "Implement Differential Privacy Matrix",
            project: "Identity Vault v2",
            priority: "Critical",
            status: "Review",
            due: "Today",
            effort: "12h",
            user: "Bob S.",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        {
            id: "3",
            title: "Neural Engine Sentiment Training",
            project: "CRM Smart Logic",
            priority: "Medium",
            status: "Staged",
            due: "Tomorrow",
            effort: "24h",
            user: "Carol D.",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            id: "4",
            title: "Execute Fiscal Year Audit Logs",
            project: "Finance 2026",
            priority: "Standard",
            status: "Done",
            due: "Yesterday",
            effort: "4h",
            user: "David M.",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ])

    const handleDelete = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id))
        toast.error("Task expunged from global ledger")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Unified Task Ledger"
                breadcrumbItems={[
                    { label: "Operations", href: "#" },
                    { label: "Project Management", href: "#" },
                    { label: "Tasks", href: "/modules/tasks" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic">
                            Workload Stats
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Inject Task
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1750px] mx-auto w-full">
                {/* Task Velocity HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Global Burn Rate", value: "4.2/day", icon: Zap, color: "text-blue-600", trend: "+12%" },
                        { label: "Critical Blockers", value: "3", icon: AlertCircle, color: "text-rose-600", trend: "Balanced" },
                        { label: "On-Time Ratio", value: "94.8%", icon: TrendingUp, color: "text-emerald-600", trend: "+2.1%" },
                        { label: "Dev Capacity", value: "182h/w", icon: Activity, color: "text-purple-600", trend: "Normal" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-2xl border-zinc-200 dark:border-zinc-800 rounded-[48px] p-10 shadow-xl relative group overflow-hidden transition-all hover:translate-y-[-8px]">
                            <stat.icon className={`absolute -right-4 -bottom-4 h-24 w-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-[1500ms]`} />
                            <div className="relative z-10 flex flex-col justify-end min-h-[100px]">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] mb-4 italic leading-tight">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-5xl font-black tracking-tighter italic">{stat.value}</h2>
                                    <Badge className="bg-zinc-50 dark:bg-zinc-800 text-[8px] font-black italic border-none p-1">{stat.trend}</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Task List Control */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col transition-all overflow-hidden lg:min-h-[600px]">
                    <div className="p-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50/20 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-600/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <FileText size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Operations Ledger</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">Unified orchestration of cross-project execution nodes.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <CustomInput placeholder="Search tasks, priorities, or projects..." className="pl-14 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 bg-white hover:bg-zinc-50">
                                <Filter size={24} className="text-zinc-400" />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {tasks.map((task, idx) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex flex-col xl:flex-row items-center justify-between p-10 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all duration-500 gap-10"
                                >
                                    <div className="flex items-center gap-10 w-full xl:w-auto">
                                        <div className={`h-24 w-24 rounded-[36px] ${task.bg} ${task.color} flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-700`}>
                                            <span className="text-4xl font-black italic">{task.priority.charAt(0)}</span>
                                            <div className="absolute top-0 right-0 p-3 opacity-20"><Flag size={14} /></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${task.bg} ${task.color} shadow-sm uppercase italic`}>{task.priority}</Badge>
                                                <span className="text-[10px] font-black uppercase text-zinc-400 italic flex items-center gap-2">
                                                    <Briefcase size={12} className="text-indigo-400" /> {task.project}
                                                </span>
                                            </div>
                                            <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none group-hover:text-indigo-600 transition-colors uppercase italic truncate max-w-[400px]">{task.title}</h4>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 flex-1 w-full xl:w-auto px-10 border-x border-zinc-100 dark:border-zinc-800 border-dashed">
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Horizon</span>
                                            <div className="flex items-center gap-3">
                                                <Clock size={16} className="text-rose-500 animate-pulse" />
                                                <span className="text-xl font-black italic text-zinc-900 dark:text-white uppercase">{task.due}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Allocated Effort</span>
                                            <span className="text-xl font-black italic text-zinc-900 dark:text-white uppercase">{task.effort} MDs</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Assignee</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-black italic">SR</div>
                                                <span className="text-sm font-black italic text-zinc-600 uppercase">{task.user}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Node Status</span>
                                            <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} uppercase italic`}>{task.status}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0">
                                        <CustomButton variant="ghost" className="h-16 w-16 p-0 rounded-[28px] bg-zinc-50 border border-zinc-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-3xl transition-all duration-700">
                                            <Maximize2 size={24} />
                                        </CustomButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" className="h-16 w-16 p-0 rounded-[28px] border border-zinc-100 hover:shadow-xl transition-all">
                                                    <MoreVertical size={24} className="text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[32px] w-64 p-2 shadow-3xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm italic uppercase italic tracking-tight"><Edit3 size={18} /> Modify Execution</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm italic uppercase italic tracking-tight"><SearchCheck size={18} /> Dependency Audit</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm italic uppercase italic tracking-tight"><History size={18} /> Cycle History</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(task.id)} className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase"><Trash2 size={18} /> expunge Node</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="py-10 flex flex-col items-center justify-center space-y-6">
                            <CustomButton variant="ghost" className="h-20 px-20 rounded-full border-2 border-dashed border-zinc-100 text-zinc-300 font-black uppercase italic tracking-[0.4em] hover:bg-zinc-50 hover:text-indigo-600 hover:border-indigo-400 transition-all flex items-center gap-6 text-sm">
                                <Plus size={28} /> Sync Remaining Fragments
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
