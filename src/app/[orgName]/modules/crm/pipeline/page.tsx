"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    GripVertical,
    Plus,
    Search,
    Filter,
    MoreVertical,
    TrendingUp,
    Briefcase,
    DollarSign,
    Target,
    Zap,
    ChevronRight,
    SearchCheck,
    ArrowRight,
    Edit3,
    Trash2,
    Copy,
    Share2,
    Maximize2,
    Calendar,
    Users
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function PipelinePage() {
    const [columns, setColumns] = useState([
        {
            id: "1",
            title: "Discovery",
            color: "border-t-blue-500",
            bg: "bg-blue-50/20",
            count: 4,
            value: "$42.5K",
            deals: [
                { id: "d1", title: "Enterprise ERP Expansion", company: "Acme Corp", value: "$12,000", days: 3, priority: "High" },
                { id: "d2", title: "Cloud Migration Phase 2", company: "Globex", value: "$8,500", days: 1, priority: "Medium" },
                { id: "d3", title: "Security Audit Bundle", company: "Initech", value: "$4,200", days: 5, priority: "Low" },
                { id: "d4", title: "Digital Transformation", company: "Umbrella", value: "$17,800", days: 12, priority: "High" },
            ]
        },
        {
            id: "2",
            title: "Proposal Sent",
            color: "border-t-purple-500",
            bg: "bg-purple-50/20",
            count: 3,
            value: "$98.2K",
            deals: [
                { id: "d5", title: "AI Integration Suite", company: "Hooli", value: "$65,000", days: 8, priority: "High" },
                { id: "d6", title: "Mobile App Rebuild", company: "Siedel", value: "$28,500", days: 14, priority: "Medium" },
                { id: "d7", title: "SEO Strategy Ops", company: "Weyland", value: "$4,700", days: 2, priority: "Low" },
            ]
        },
        {
            id: "3",
            title: "Negotiation",
            color: "border-t-amber-500",
            bg: "bg-amber-50/20",
            count: 2,
            value: "$142.0K",
            deals: [
                { id: "d8", title: "Core Banking Upgrade", company: "Aperture", value: "$120,000", days: 45, priority: "Critical" },
                { id: "d9", title: "HR Platform License", company: "Sterling", value: "$22,000", days: 22, priority: "High" },
            ]
        },
        {
            id: "4",
            title: "Closing",
            color: "border-t-emerald-500",
            bg: "bg-emerald-50/20",
            count: 1,
            value: "$4.5K",
            deals: [
                { id: "d10", title: "Small Business Pack", company: "Pied Piper", value: "$4,500", days: 3, priority: "Medium" },
            ]
        }
    ])

    const handleDelete = (colId: string, dealId: string) => {
        setColumns(prev => prev.map(c => c.id === colId ? { ...c, deals: c.deals.filter(d => d.id !== dealId), count: c.count - 1 } : c))
        toast.error("Deal expunged from pipeline")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Sales Pipeline"
                breadcrumbItems={[
                    { label: "CRM System", href: "#" },
                    { label: "Deals", href: "/modules/crm/deals" },
                    { label: "Pipeline Visualizer", href: "/modules/crm/pipeline" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3 mr-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-10 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black italic">SR</div>
                            ))}
                        </div>
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic shadow-sm hover:shadow-xl transition-all">
                            Board Settings
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Inject Revenue
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-10 max-w-[1800px] mx-auto w-full">
                {/* Pipeline Health HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Pipe Value", value: "$287.2K", icon: DollarSign, color: "text-blue-600", trend: "+14.2%" },
                        { label: "Weighted Forecast", value: "$192.5K", icon: TrendingUp, color: "text-amber-600", trend: "+8.4%" },
                        { label: "Avg. Velocity", value: "14.2 Days", icon: Zap, color: "text-purple-600", trend: "-2.1%" },
                        { label: "Win Probability", value: "68%", icon: Target, color: "text-emerald-600", trend: "+5.0%" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 shadow-xl relative group overflow-hidden transition-all hover:scale-[1.02]">
                            <stat.icon className={`absolute -right-4 -bottom-4 h-24 w-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-1000`} />
                            <div className="flex justify-between items-start relative z-10">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] leading-none mb-4 italic">{stat.label}</p>
                                <Badge className={`bg-white dark:bg-zinc-800 ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} border-zinc-100 dark:border-zinc-800 text-[9px] font-black italic`}>{stat.trend}</Badge>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter italic relative z-10">{stat.value}</h2>
                        </Card>
                    ))}
                </div>

                {/* Pipeline Board */}
                <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide min-h-[700px]">
                    {columns.map((col, idx) => (
                        <div key={col.id} className="min-w-[400px] flex flex-col group/col">
                            <div className={`p-8 rounded-[48px] ${col.bg} border-t-8 ${col.color} border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm mb-6 flex items-center justify-between group-hover/col:shadow-2xl transition-all duration-500`}>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">{col.title}</h3>
                                    <div className="flex items-center gap-3 mt-3">
                                        <Badge className="bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase italic tracking-widest px-3 py-1">{col.count} DEALS</Badge>
                                        <span className="text-xl font-black italic tracking-tighter text-zinc-600 dark:text-zinc-400 opacity-60">{col.value}</span>
                                    </div>
                                </div>
                                <CustomButton variant="ghost" className="h-12 w-12 rounded-2xl bg-white/20 hover:bg-white text-zinc-400 hover:text-zinc-900">
                                    <MoreVertical size={20} />
                                </CustomButton>
                            </div>

                            <div className="flex-1 space-y-6">
                                <AnimatePresence mode="popLayout">
                                    {col.deals.map((deal, dIdx) => (
                                        <motion.div
                                            key={deal.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: dIdx * 0.05 }}
                                            className="group cursor-grab active:cursor-grabbing"
                                        >
                                            <Card className="bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-[40px] p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 border-l-4 hover:border-l-indigo-600 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                                    <Briefcase size={80} />
                                                </div>

                                                <div className="flex items-start justify-between relative z-10 mb-8">
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-black uppercase tracking-tight italic leading-snug group-hover:text-indigo-600 transition-colors">{deal.title}</h4>
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                            <TrendingUp size={12} className="text-indigo-400" /> {deal.company}
                                                        </p>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <CustomButton variant="ghost" className="h-10 w-10 p-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical size={18} className="text-zinc-400" />
                                                            </CustomButton>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-3xl w-56 p-2 shadow-3xl bg-white/95 backdrop-blur-xl">
                                                            <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic"><Edit3 size={16} /> Edit Blueprint</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic"><Copy size={16} /> Clone Geometry</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic"><Share2 size={16} /> Broadcast Link</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(col.id, deal.id)} className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs text-red-600 focus:text-red-100 focus:bg-red-600 font-black italic uppercase"><Trash2 size={16} /> Expunge Deal</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Net Value</p>
                                                        <p className="text-2xl font-black italic tracking-tighter text-indigo-600">{deal.value}</p>
                                                    </div>
                                                    <Badge className={`rounded-xl px-3 py-1 font-black italic text-[9px] uppercase border-none ${deal.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                                                            deal.priority === 'Critical' ? 'bg-red-100 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]' :
                                                                'bg-zinc-100 text-zinc-500'
                                                        }`}>
                                                        {deal.priority}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-zinc-50 dark:border-zinc-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex -space-x-2">
                                                            <div className="h-8 w-8 rounded-lg bg-indigo-600 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] text-white font-black italic shadow-lg shadow-indigo-600/20">MC</div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-40">
                                                            <Calendar size={12} />
                                                            <span className="text-[10px] font-black uppercase italic tracking-tighter">{deal.days}d ago</span>
                                                        </div>
                                                    </div>
                                                    <CustomButton variant="ghost" className="h-10 w-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 transition-colors">
                                                        <Maximize2 size={16} />
                                                    </CustomButton>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Column Footer Action */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:border-indigo-400 transition-all active:scale-[0.98]"
                                >
                                    <div className="h-12 w-12 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-inner group-hover:shadow-xl group-hover:shadow-indigo-600/20">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 group-hover:text-indigo-600 transition-colors italic">Inject {col.title} Lead</span>
                                </motion.div>
                            </div>
                        </div>
                    ))}

                    {/* New Column Target */}
                    <div className="min-w-[400px] flex flex-col pt-24 pr-12">
                        <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[64px] flex flex-col items-center justify-center p-20 text-center group cursor-pointer hover:bg-white/50 hover:border-indigo-300 transition-all flex-1 min-h-[500px]">
                            <div className="h-24 w-24 bg-zinc-50 group-hover:bg-indigo-600 group-hover:text-white rounded-[40px] flex items-center justify-center mb-8 shadow-inner group-hover:shadow-3xl transition-all duration-1000 rotate-12 group-hover:rotate-0">
                                <Plus size={44} />
                            </div>
                            <h4 className="text-3xl font-black uppercase tracking-tighter text-zinc-200 group-hover:text-indigo-600 transition-colors italic">Architecture Node</h4>
                            <p className="text-xs font-bold text-zinc-400 mt-4 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] opacity-40">Extend pipeline geometry with a new automated phase.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
