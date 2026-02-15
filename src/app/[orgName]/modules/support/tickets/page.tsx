"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LifeBuoy,
    Plus,
    Search,
    Filter,
    MessageSquare,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    User,
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
    Shield,
    Flag,
    Settings
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

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState([
        {
            id: "TICK-8801",
            subject: "OAuth2 Token Validation Failure in Cluster-A",
            client: "Globex Corp",
            priority: "Urgent",
            status: "Open",
            assigned: "Engineer-1",
            category: "Technical",
            lastUpdate: "12m ago",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        {
            id: "TICK-8802",
            subject: "Invoice Discrepancy for Q4 2025 Ledger",
            client: "Acme Inc",
            priority: "High",
            status: "In Progress",
            assigned: "Sarah J.",
            category: "Billing",
            lastUpdate: "1h ago",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            id: "TICK-8803",
            subject: "SSO Integration Blueprint Request",
            client: "Cyberdyne",
            priority: "Standard",
            status: "Pending",
            assigned: "Support Bot",
            category: "Onboarding",
            lastUpdate: "4h ago",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            id: "TICK-8804",
            subject: "Bulk Lead Import Timeout Simulation",
            client: "Digital Ocean",
            priority: "Low",
            status: "Resolved",
            assigned: "Auto-Solver",
            category: "Product",
            lastUpdate: "Yesterday",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ])

    const handleDelete = (id: string) => {
        setTickets(prev => prev.filter(t => t.id !== id))
        toast.error("Ticket expunged from support stream")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Service Command Center"
                breadcrumbItems={[
                    { label: "Support & Helpdesk", href: "#" },
                    { label: "Operations", href: "#" },
                    { label: "Tickets & Cases", href: "/modules/support/tickets" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic">
                            Live Queue
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Open Case
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1750px] mx-auto w-full">
                {/* Support Health HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active Tickets", value: "142", icon: LifeBuoy, color: "text-indigo-600", trend: "+4% Volume" },
                        { label: "Avg Resolution", value: "2.4h", icon: Clock, color: "text-emerald-600", trend: "-12% Latency" },
                        { label: "CSAT Score", value: "98.2", icon: Activity, color: "text-blue-600", trend: "Elite Level" },
                        { label: "SLA Integrity", value: "100%", icon: Shield, color: "text-amber-600", trend: "Safe" },
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

                {/* Main Ticket Ledger Table Control */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col transition-all overflow-hidden lg:min-h-[600px]">
                    <div className="p-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50/20 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-600/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <LifeBuoy size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Active Incident Ledger</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">Orchestrate and resolve complex service tickets and technical cases.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <CustomInput placeholder="Search cases, clients, or subjects..." className="pl-14 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 bg-white hover:bg-zinc-50">
                                <Filter size={24} className="text-zinc-400" />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {tickets.map((ticket, idx) => (
                                <motion.div
                                    key={ticket.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex flex-col xl:flex-row items-center justify-between p-10 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 gap-10"
                                >
                                    <div className="flex items-center gap-10 w-full xl:w-auto">
                                        <div className={`h-24 w-24 rounded-[36px] ${ticket.bg} ${ticket.color} flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-700`}>
                                            <span className="text-3xl font-black italic">{ticket.priority.charAt(0)}</span>
                                            <div className="absolute top-0 right-0 p-3 opacity-20"><Flag size={14} /></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 shadow-[0_0_15px_rgba(225,29,72,0.2)]' :
                                                        ticket.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                    } uppercase italic`}>{ticket.priority}</Badge>
                                                <span className="text-[10px] font-black uppercase text-zinc-400 italic flex items-center gap-2">
                                                    <User size={12} className="text-indigo-400" /> {ticket.client}
                                                </span>
                                            </div>
                                            <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none group-hover:text-indigo-600 transition-colors uppercase italic truncate max-w-[500px]">{ticket.subject}</h4>
                                            <div className="flex items-center gap-4 text-xs font-black text-zinc-400 uppercase italic opacity-60">
                                                <span>{ticket.id}</span>
                                                <span className="h-1 w-1 bg-zinc-300 rounded-full" />
                                                <span>{ticket.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 flex-1 w-full xl:w-auto px-10 border-x border-zinc-100 dark:border-zinc-800 border-dashed">
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Ownership</span>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-black italic">OP</div>
                                                <span className="text-sm font-black italic text-zinc-600 uppercase">{ticket.assigned}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Last Activity</span>
                                            <span className="text-xl font-black italic text-zinc-900 dark:text-white uppercase">{ticket.lastUpdate}</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">Case Status</span>
                                            <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${ticket.status === 'Open' ? 'bg-indigo-100 text-indigo-700' :
                                                    ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                } uppercase italic`}>{ticket.status}</Badge>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 tracking-widest">SLA Drift</span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[100%] transition-all" />
                                                </div>
                                                <span className="text-xs font-black text-emerald-600">0%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0">
                                        <CustomButton variant="ghost" className="h-16 w-16 p-0 rounded-[28px] bg-zinc-50 border border-zinc-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-3xl transition-all duration-700">
                                            <MessageSquare size={24} />
                                        </CustomButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" className="h-16 w-16 p-0 rounded-[28px] border border-zinc-100 hover:shadow-xl transition-all">
                                                    <MoreVertical size={24} className="text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[32px] w-64 p-2 shadow-3xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm italic uppercase italic tracking-tight"><Edit3 size={18} /> Modify Metadata</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm italic uppercase italic tracking-tight"><SearchCheck size={18} /> Root Cause Audit</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm italic uppercase italic tracking-tight"><History size={18} /> Lifecycle Trace</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(ticket.id)} className="rounded-2xl gap-3 font-bold px-8 py-5 text-sm text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase"><Trash2 size={18} /> expunge record</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="py-10 flex flex-col items-center justify-center space-y-6">
                            <CustomButton variant="ghost" className="h-20 px-20 rounded-full border-2 border-dashed border-zinc-100 text-zinc-300 font-black uppercase italic tracking-[0.4em] hover:bg-zinc-50 hover:text-indigo-600 hover:border-indigo-400 transition-all flex items-center gap-6 text-sm">
                                <Plus size={28} /> Synchronize Legacy Cases
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Intelligence & Automation row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Card className="rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 shadow-inner">
                                <Zap size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Neural Auto-Triage</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Intelligent case routing and sentiment scoring.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Deterministic Skill Routing", desc: "Map technical cases to Engineers based on commit history.", status: "ENFORCED" },
                                { label: "Sentiment Escalation Hub", desc: "Instantly flag cases with 'Angry' or 'Churn' sentiment markers.", status: "ACTIVE" },
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-10 bg-zinc-50 dark:bg-zinc-800/40 rounded-[40px] border border-zinc-100/50 hover:border-blue-300 transition-all">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tight italic leading-none">{rule.label}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 italic tracking-widest">{rule.desc}</p>
                                    </div>
                                    <Badge className="bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-200 px-4 py-2 font-black italic text-[9px] uppercase">{rule.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[64px] p-16 bg-zinc-900 border-0 shadow-3xl text-white relative overflow-hidden group">
                        <Settings className="absolute -bottom-20 -right-20 h-96 w-96 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]" />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Service Topology Engine</h3>
                            <p className="text-xl font-bold text-zinc-400 italic uppercase tracking-[0.1em] leading-relaxed">Map support incidents to technical infrastructure nodes to identify systemic failures before they escalate.</p>
                            <div className="pt-10">
                                <CustomButton className="bg-white text-zinc-900 rounded-[32px] h-20 w-full font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform text-base italic flex items-center justify-center gap-4">
                                    Open Topology View <ArrowRight size={24} />
                                </CustomButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
