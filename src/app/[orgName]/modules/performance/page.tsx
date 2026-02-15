"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    TrendingUp,
    Target,
    Zap,
    Users,
    Activity,
    Plus,
    Search,
    Filter,
    Award,
    Star,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Edit3,
    Trash2,
    Copy,
    Share2,
    LayoutDashboard,
    SearchCheck,
    Briefcase
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function PerformanceReviewsPage() {
    const [reviews, setReviews] = useState([
        {
            id: "1",
            user: "Alice Johnson",
            role: "Principal Architect",
            rating: 4.8,
            completion: 100,
            status: "Finalized",
            cycle: "Q4 2025",
            manager: "Sarah Jensen",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            id: "2",
            user: "Bob Smith",
            role: "Product Manager",
            rating: 4.2,
            completion: 65,
            status: "Self-Review",
            cycle: "Q4 2025",
            manager: "Sarah Jensen",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            id: "3",
            user: "Carol Davis",
            role: "Lead HR",
            rating: 4.9,
            completion: 10,
            status: "Scheduled",
            cycle: "Q4 2025",
            manager: "Admin Support",
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            id: "4",
            user: "David Miller",
            role: "DevOps Engineer",
            rating: 3.5,
            completion: 100,
            status: "Calibrated",
            cycle: "Q4 2025",
            manager: "Michael Chen",
            color: "text-rose-500",
            bg: "bg-rose-50"
        }
    ])

    const handleDelete = (id: string) => {
        setReviews(prev => prev.filter(r => r.id !== id))
        toast.error("Review Node expunged")
    }

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Performance Velocity"
                breadcrumbItems={[
                    { label: "HRM / Workforce", href: "#" },
                    { label: "Performance", href: "/modules/performance" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic">
                            KPI Templates
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Start Review Cycle
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1700px] mx-auto w-full">
                {/* Organizational Performance HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Global Rating", value: "4.62", icon: Star, color: "bg-emerald-500", trend: "+0.12 pts" },
                        { label: "Cycle Velocity", value: "84%", icon: Zap, color: "bg-blue-600", trend: "High Speed" },
                        { label: "Key Top Performers", value: "124", icon: Award, color: "bg-purple-600", trend: "+12.4%" },
                        { label: "Growth Target", value: "92%", icon: TrendingUp, color: "bg-amber-500", trend: "On Track" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-[48px] p-10 shadow-xl overflow-hidden relative group transition-all hover:shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-12 w-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                                    <stat.icon size={24} />
                                </div>
                                <Badge className="bg-zinc-50 dark:bg-zinc-800 text-[9px] font-black italic border-zinc-100 dark:border-zinc-800">{stat.trend}</Badge>
                            </div>
                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] mb-2 italic">{stat.label}</p>
                            <h2 className="text-4xl font-black tracking-tighter italic">{stat.value}</h2>
                        </Card>
                    ))}
                </div>

                {/* Main Progress Board */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col pt-12">
                    <div className="px-14 pb-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-blue-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-600/30 rotate-2">
                                <Activity size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">Review Governance v2</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">Unified talent calibration and performance appraisal ledger.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <CustomInput placeholder="Search talent..." className="pl-12 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 hover:bg-zinc-50">
                                <Filter size={24} />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {reviews.map((rev, idx) => (
                                    <motion.div
                                        key={rev.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-zinc-50/50 dark:bg-zinc-800/30 p-10 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col"
                                    >
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                            <Award size={150} />
                                        </div>

                                        <div className="flex items-start justify-between relative z-10 mb-10">
                                            <div className="flex gap-6">
                                                <div className={`h-16 w-16 rounded-[24px] ${rev.bg} ${rev.color} flex items-center justify-center shadow-inner border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-105 transition-transform duration-700`}>
                                                    <span className="text-2xl font-black italic">{rev.rating}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xl font-black uppercase tracking-tight italic leading-none group-hover:text-blue-600 transition-colors uppercase">{rev.user}</h4>
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">{rev.role}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <CustomButton variant="ghost" className="h-10 w-10 p-0 rounded-2xl bg-white/50 border border-zinc-100 group-hover:shadow-lg transition-all">
                                                        <MoreVertical size={20} className="text-zinc-400" />
                                                    </CustomButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-[32px] w-64 p-2 shadow-3xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                    <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic uppercase tracking-tighter"><SearchCheck size={18} /> Review Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic uppercase tracking-tighter"><Edit3 size={18} /> Calibrate Rating</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic uppercase tracking-tighter"><Share2 size={18} /> Internal Link</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(rev.id)} className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase tracking-tighter"><Trash2 size={18} /> Expunge Node</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">
                                                <span>Review Completion</span>
                                                <span className="text-blue-600">{rev.completion}%</span>
                                            </div>
                                            <Progress value={rev.completion} className="h-2 bg-zinc-100 dark:bg-zinc-800">
                                                <div className={`h-full ${rev.completion === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'} transition-all`} style={{ width: `${rev.completion}%` }} />
                                            </Progress>
                                            <div className="flex justify-between items-center pt-4">
                                                <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${rev.bg} ${rev.color} uppercase italic`}>{rev.status}</Badge>
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">{rev.cycle}</span>
                                            </div>
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[8px] font-black italic text-zinc-500">SJ</div>
                                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">{rev.manager}</span>
                                            </div>
                                            <CustomButton variant="ghost" className="h-10 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-blue-600 transition-all flex items-center gap-2 italic">
                                                Enter Canvas <ArrowUpRight size={14} />
                                            </CustomButton>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Cycle Summary Card */}
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="bg-zinc-900 dark:bg-black rounded-[56px] p-12 text-white shadow-3xl relative overflow-hidden group flex flex-col justify-between"
                            >
                                <LayoutDashboard className="absolute -bottom-10 -right-10 h-64 w-64 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                                <div className="space-y-6 relative z-10">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-zinc-300">Strategy Insights</h3>
                                    <p className="text-xs font-bold text-zinc-500 italic uppercase leading-relaxed tracking-widest">Global workforce calibration is currently <span className="text-emerald-500">OVER-PERFORMING</span> vs previous cycle.</p>
                                </div>
                                <div className="pt-10 flex flex-col gap-4 relative z-10">
                                    <div className="flex items-center justify-between text-xs font-black italic uppercase tracking-widest text-zinc-400">
                                        <span>Retention Risk</span>
                                        <span className="text-rose-500">2.4% LOW</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <CustomButton className="bg-white text-zinc-900 rounded-[28px] h-16 w-full font-black uppercase tracking-[0.2em] text-xs italic mt-4 hover:scale-[1.03] transition-transform">Download Board Report</CustomButton>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
