"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CreditCard,
    DollarSign,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    History,
    MoreVertical,
    Download,
    Lock,
    Globe,
    Activity,
    Zap,
    Scale,
    ShieldCheck,
    SearchCheck,
    FileText,
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

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState([
        {
            id: "tx_1242",
            client: "Acme Corp",
            amount: "$12,400.00",
            method: "Stripe",
            type: "Inbound",
            status: "Succeeded",
            date: "14 Jan 2026",
            ref: "INV-2026-001",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            id: "tx_1243",
            client: "Amazon AWS",
            amount: "$2,240.12",
            method: "Corporate Card",
            type: "Outbound",
            status: "Succeeded",
            date: "13 Jan 2026",
            ref: "EXP-8891",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        {
            id: "tx_1244",
            client: "Cyberdyne Systems",
            amount: "$45,000.00",
            method: "Wire Transfer",
            type: "Inbound",
            status: "Pending",
            date: "12 Jan 2026",
            ref: "INV-2026-003",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            id: "tx_1245",
            client: "Digital Ocean",
            amount: "$450.00",
            method: "PayPal",
            type: "Outbound",
            status: "Blocked",
            date: "10 Jan 2026",
            ref: "EXP-9002",
            color: "text-zinc-600",
            bg: "bg-zinc-100"
        }
    ])

    const handleDelete = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id))
        toast.error("Transaction record expunged from ledger")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Global Money Movement"
                breadcrumbItems={[
                    { label: "Finance & Fiscal", href: "#" },
                    { label: "Accounts", href: "#" },
                    { label: "Payments", href: "/modules/payments" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic flex items-center gap-2">
                            <Download size={16} /> Export Ledger
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Manual Entry
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1750px] mx-auto w-full">
                {/* Fiscal Velocity HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Net Inflow Today", value: "$52.4K", icon: TrendingUp, color: "text-emerald-600", trend: "+14.2%" },
                        { label: "Processed Capital", value: "$1.2M", icon: DollarSign, color: "text-blue-600", trend: "Q1 Target" },
                        { label: "Failure Rate", value: "0.24%", icon: Activity, color: "text-rose-600", trend: "Optimal" },
                        { label: "Trust Score", value: "99.9", icon: ShieldCheck, color: "text-purple-600", trend: "Maximum" },
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

                {/* Main Transaction Table Control */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col transition-all overflow-hidden lg:min-h-[600px]">
                    <div className="p-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50/20 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-emerald-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-600/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <CreditCard size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Transaction Node Ledger</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">Unified ledger of all domestic and international money movement fragments.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <CustomInput placeholder="Search hash, client, or reference..." className="pl-14 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 bg-white hover:bg-zinc-50">
                                <Filter size={24} className="text-zinc-400" />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="px-8 pb-14 mt-10">
                        <div className="grid grid-cols-12 px-14 mb-8 text-[11px] font-black uppercase text-zinc-400 tracking-[0.2em] italic">
                            <div className="col-span-4">Counterparty / Reference</div>
                            <div className="col-span-2 text-center">Velocity Vector</div>
                            <div className="col-span-2 text-center">Settlement Node</div>
                            <div className="col-span-2 text-center">Net Amount</div>
                            <div className="col-span-2 text-right">Goverance</div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {transactions.map((tx, idx) => (
                                <motion.div
                                    key={tx.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group grid grid-cols-12 items-center p-10 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all duration-500 mb-6"
                                >
                                    <div className="col-span-4 flex items-center gap-8">
                                        <div className={`h-16 w-16 rounded-[24px] ${tx.bg} ${tx.color} flex items-center justify-center shadow-inner border border-zinc-100 dark:border-zinc-800`}>
                                            <span className="text-2xl font-black italic">{tx.client.charAt(0)}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none group-hover:text-emerald-600 transition-colors uppercase italic">{tx.client}</h4>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-transparent text-zinc-400 p-0 font-black italic text-[10px] uppercase tracking-widest">{tx.ref}</Badge>
                                                <span className="h-1 w-1 rounded-full bg-zinc-200" />
                                                <span className="text-[10px] font-black text-zinc-300 uppercase italic tracking-tighter">{tx.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center">
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'Inbound' ? <ArrowUpRight className="text-emerald-500" /> : <ArrowDownRight className="text-rose-500" />}
                                            <span className={`text-xl font-black italic ${tx.type === 'Inbound' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.type}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-zinc-400 italic mt-1 uppercase tracking-widest">{tx.date}</span>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center">
                                        <span className="text-xl font-black italic text-zinc-900 dark:text-white uppercase">{tx.method}</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Succeeded' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : tx.status === 'Pending' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{tx.status}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center">
                                        <span className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white">{tx.amount}</span>
                                        <span className="text-[10px] font-black text-emerald-500 italic mt-1 uppercase tracking-widest bg-emerald-50 px-2 rounded">SETTLED</span>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-end gap-3">
                                        <CustomButton variant="outline" className="h-12 w-12 rounded-2xl border-zinc-100 hover:border-emerald-500 transition-all p-0">
                                            <FileText size={20} className="text-zinc-300 group-hover:text-emerald-500" />
                                        </CustomButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/50 border border-zinc-100 group-hover:shadow-lg transition-all">
                                                    <MoreVertical size={20} className="text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[40px] w-64 p-3 shadow-4xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm italic uppercase tracking-tighter"><SearchCheck size={20} /> Inspect Node</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm italic uppercase tracking-tighter"><RotateCcw2 size={20} /> Re-sync Settlement</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm italic uppercase tracking-tighter"><Share2 size={20} /> Internal Link</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(tx.id)} className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase"><Trash2 size={20} /> expunge entry</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="py-12 flex flex-col items-center justify-center space-y-6">
                            <CustomButton variant="ghost" className="h-20 px-24 rounded-full border-2 border-dashed border-zinc-100 text-zinc-300 font-black uppercase italic tracking-[0.4em] hover:bg-zinc-50 hover:text-emerald-600 hover:border-emerald-400 transition-all flex items-center gap-6 text-sm">
                                <Plus size={28} /> Process Remaining Batch
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Intelligent Risk Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Card className="rounded-[72px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 shadow-inner">
                                <Lock size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Security Compliance Node</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Zero-trust money laundering prevention suite.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Autonomous AML Shield", desc: "Flag transaction clusters matching cross-border wash patterns.", status: "LEARNING" },
                                { label: "Stripe Sigma Calibration", desc: "Sync data warehouse with real-time settlement buckets.", status: "IDLE" },
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-10 bg-zinc-50 dark:bg-zinc-800/40 rounded-[48px] border border-zinc-100/50 hover:border-blue-300 transition-all">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tight italic leading-none">{rule.label}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 italic tracking-widest">{rule.desc}</p>
                                    </div>
                                    <Badge className="bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-200 px-4 py-2 font-black italic text-[9px] uppercase">{rule.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[72px] p-16 bg-zinc-900 border-0 shadow-3xl text-white relative overflow-hidden group">
                        <Globe className="absolute -bottom-20 -right-20 h-96 w-96 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]" />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Global Currency Network</h3>
                            <p className="text-xl font-bold text-zinc-400 italic uppercase tracking-[0.1em] leading-relaxed">Instantly convert and settle across 124+ global corridors using the best-available FX liquidity providers.</p>
                            <div className="pt-10 flex flex-col gap-8">
                                <CustomButton className="bg-white text-zinc-900 rounded-[36px] h-20 w-full font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform text-base italic flex items-center justify-center gap-4">
                                    Calibrate Liquid Corridors <ArrowRight size={24} />
                                </CustomButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function RotateCcw2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
    )
}
