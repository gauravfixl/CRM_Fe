"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Zap,
    Mail,
    Slack,
    Github,
    Globe,
    Webhook,
    Key,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Activity,
    Settings,
    ArrowRight,
    SearchCheck,
    Cloud,
    MessageSquare,
    Link2,
    Database,
    BarChart3,
    Edit3,
    Trash2,
    Share2,
    Lock
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState([
        {
            id: "int_1",
            name: "Slack Notify",
            category: "Communication",
            status: "Connected",
            lastSync: "3m ago",
            icon: Slack,
            color: "text-purple-600",
            bg: "bg-purple-50",
            active: true
        },
        {
            id: "int_2",
            name: "GitHub Sync",
            category: "Development",
            status: "Error",
            lastSync: "1h ago",
            icon: Github,
            color: "text-zinc-900",
            bg: "bg-zinc-100",
            active: true
        },
        {
            id: "int_3",
            name: "SendGrid Engine",
            category: "Marketing",
            status: "Connected",
            lastSync: "12m ago",
            icon: Mail,
            color: "text-blue-600",
            bg: "bg-blue-50",
            active: true
        },
        {
            id: "int_4",
            name: "Stripe Gateway",
            category: "Finance",
            status: "Idle",
            lastSync: "Yesterday",
            icon: Globe,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            active: false
        }
    ])

    const handleDelete = (id: string) => {
        setIntegrations(prev => prev.filter(i => i.id !== id))
        toast.error("Integration node expunged")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Integrations Orchestrator"
                breadcrumbItems={[
                    { label: "Administration", href: "#" },
                    { label: "Connectivity", href: "#" },
                    { label: "Integrations Hub", href: "/modules/settings/integrations" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic flex items-center gap-2">
                            <Webhook size={16} /> Webhook Logs
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Connect External Node
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1750px] mx-auto w-full">
                {/* Visual Connectivity HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active Connections", value: "24", icon: Link2, color: "text-blue-600", trend: "Balanced" },
                        { label: "Data Throughput", value: "1.2GB", icon: Activity, color: "text-emerald-600", trend: "+12% Daily" },
                        { label: "API Health", value: "99.8%", icon: Zap, color: "text-amber-600", trend: "Optimal" },
                        { label: "Webhook Events", value: "142K", icon: MessageSquare, color: "text-purple-600", trend: "High Volume" },
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

                {/* Main Connectivity Grid */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col transition-all overflow-hidden lg:min-h-[600px]">
                    <div className="p-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50/20 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-600/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Plus size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">External Sink Catalog</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">unified mesh of and third-party API gateways and service connectors.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <CustomInput placeholder="Search sinks, categories, or status..." className="pl-14 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 bg-white hover:bg-zinc-50">
                                <Filter size={24} className="text-zinc-400" />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                {integrations.map((int, idx) => (
                                    <motion.div
                                        key={int.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-zinc-50/50 dark:bg-zinc-800/30 p-10 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col"
                                    >
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0">
                                            <int.icon size={150} />
                                        </div>

                                        <div className="flex items-start justify-between relative z-10 mb-10">
                                            <div className={`h-16 w-16 rounded-[24px] ${int.bg} ${int.color} flex items-center justify-center shadow-inner border border-zinc-200/50 dark:border-zinc-700/50 group-hover:scale-105 transition-transform duration-700`}>
                                                <int.icon size={32} />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <CustomButton variant="ghost" className="h-10 w-10 p-0 rounded-2xl bg-white/50 border border-zinc-100 group-hover:shadow-lg transition-all">
                                                        <MoreVertical size={20} className="text-zinc-400" />
                                                    </CustomButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-[32px] w-64 p-2 shadow-3xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                    <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic uppercase italic tracking-tight"><Settings size={18} /> Configure API</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic uppercase italic tracking-tight"><RefreshCw size={18} /> Force Sync</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs italic uppercase italic tracking-tight"><Share2 size={18} /> Internal Link</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(int.id)} className="rounded-2xl gap-3 font-bold px-6 py-4 text-xs text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase"><Trash2 size={18} /> expunge node</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-4 relative z-10 flex-1">
                                            <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none group-hover:text-indigo-600 transition-colors uppercase italic">{int.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${int.bg} ${int.color} uppercase italic`}>{int.category}</Badge>
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">{int.lastSync}</span>
                                            </div>
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2.5 w-2.5 rounded-full ${int.status === 'Connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : int.status === 'Error' ? 'bg-rose-500' : 'bg-zinc-300'}`} />
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">{int.status}</span>
                                            </div>
                                            <Switch checked={int.active} className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Add New Shell */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[56px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-white dark:hover:bg-zinc-900 hover:border-indigo-400 transition-all flex-1 min-h-[350px]"
                            >
                                <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-indigo-600 group-hover:text-white rounded-[32px] flex items-center justify-center mb-8 shadow-inner group-hover:shadow-4xl transition-all duration-700">
                                    <Plus size={40} />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-200 group-hover:text-indigo-600 transition-colors italic leading-none uppercase">Initialize Node</h4>
                                <p className="text-[10px] font-black text-zinc-400 mt-4 uppercase tracking-widest italic opacity-40">Choose from 124+ certified corporate plugins.</p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Automation & Security row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Card className="rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 shadow-inner">
                                <Key size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white">API Credential Ledger</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Zero-trust credential rotation and vaulting.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Automatic Secret Rotation", desc: "Force rotate all OAuth tokens every 30 days.", status: "ENFORCED" },
                                { label: "mTLS Enforcement", desc: "Block any inbound integration without a valid corporate certificate.", status: "ACTIVE" },
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
                        <Webhook className="absolute -bottom-20 -right-20 h-96 w-96 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]" />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Global Event Bus</h3>
                            <p className="text-xl font-bold text-zinc-400 italic uppercase tracking-[0.1em] leading-relaxed">Broadcast real-time system signals to all external sinks with deterministic delivery and automated retry logic.</p>
                            <div className="pt-10">
                                <CustomButton className="bg-white text-zinc-900 rounded-[36px] h-20 w-full font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform text-base italic flex items-center justify-center gap-4">
                                    Configure Event Mesh <ArrowRight size={24} />
                                </CustomButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
