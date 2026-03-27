"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2,
    Clock,
    Search,
    Filter,
    MoreVertical,
    Building2,
    Calendar,
    CreditCard,
    ArrowUpRight,
    ArrowRight,
    ArrowDownRight,
    Settings2,
    Zap,
    History
} from "lucide-react"

const activeSubscriptions = [
    { id: 1, client: 'SpaceX', plan: 'Enterprise', status: 'Active', mrr: '$2,450', nextBilling: 'Oct 15, 2024', health: '88%', healthColor: 'text-emerald-500' },
    { id: 2, client: 'Tesla Inc', plan: 'Professional', status: 'Active', mrr: '$850', nextBilling: 'Oct 22, 2024', health: '94%', healthColor: 'text-emerald-500' },
    { id: 3, client: 'Adobe', plan: 'Professional', status: 'Expiring', mrr: '$850', nextBilling: 'Oct 10, 2024', health: '42%', healthColor: 'text-rose-500' },
    { id: 4, client: 'Netflix', plan: 'Enterprise+', status: 'Active', mrr: '$4,200', nextBilling: 'Nov 02, 2024', health: '75%', healthColor: 'text-amber-500' },
    { id: 5, client: 'Slack', plan: 'Starter', status: 'Inactive', mrr: '$0', nextBilling: 'Past Due', health: '12%', healthColor: 'text-slate-400' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

export default function ActiveSubscriptions() {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active <span className="text-emerald-600">Subscriptions</span></h1>
                <p className="text-sm font-medium text-slate-500 max-w-2xl">Real-time lifecycle management of all billable accounts. Monitor health scores, handle renewal risks, and perform tier migrations.</p>
            </header>

            {/* Lifecycle Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-3">Live Accounts</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900">420</span>
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-3">Net Expansion</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900">+$12.4k</span>
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-3">Renewal Risk</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900">12%</span>
                        <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                            <ArrowDownRight size={18} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-3">Pending Upgrades</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900">8</span>
                        <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Zap size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* List Control */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by client or plan ID..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SHOW:</span>
                            <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[11px] font-black text-slate-600 focus:outline-none">
                                <option>ALL STATUS</option>
                                <option>ACTIVE ONLY</option>
                                <option>FAILED ONLY</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
                            <Filter size={14} /> Global Sort
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-slate-800 transition-all uppercase tracking-widest">
                            <Settings2 size={14} /> Bulk Actions
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Client Entity</th>
                                <th className="px-6 py-4">Service Plan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Monthly Value</th>
                                <th className="px-6 py-4">Next Invoice</th>
                                <th className="px-6 py-4">Usage Health</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activeSubscriptions.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                <Building2 className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="text-sm font-extrabold text-slate-900 tracking-tight">{sub.client}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                                            <span className="text-[11px] font-black text-slate-700 tracking-tight">{sub.plan.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                            sub.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                sub.status === 'Expiring' ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-slate-900">{sub.mrr}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                            <Calendar size={14} className="text-slate-400" />
                                            {sub.nextBilling}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={cn("h-full rounded-full transition-all duration-1000", sub.healthColor.replace('text', 'bg'))} style={{ width: sub.health }} />
                                            </div>
                                            <span className={cn("text-[11px] font-black", sub.healthColor)}>{sub.health}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all">
                                                <History size={16} />
                                            </button>
                                            <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing Top Performance Accounts first</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 cursor-pointer text-[11px] font-black uppercase tracking-widest">
                            Migration Engine <ArrowRight size={14} />
                        </div>
                        <div className="flex items-center gap-2 text-rose-600 hover:text-rose-700 cursor-pointer text-[11px] font-black uppercase tracking-widest">
                            Churn Recovery Audit <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
