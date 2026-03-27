"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    FileText,
    ShieldCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Download,
    Eye,
    History,
    FileSignature,
    PenTool
} from "lucide-react"

const contracts = [
    { id: 1, client: 'SpaceX', type: 'MSA + SLA', status: 'Signed', date: 'Jul 12, 2024', expiry: 'Jul 11, 2026', owner: 'Legal Team', health: 'Secure' },
    { id: 2, client: 'Tesla Inc', type: 'Enterprise Agreement', status: 'Active', date: 'Aug 05, 2024', expiry: 'Aug 04, 2025', owner: 'Sarah R.', health: 'Secure' },
    { id: 3, client: 'Adobe', type: 'Data Protection Addendum', status: 'Reviewing', date: 'Sep 28, 2024', expiry: 'TBD', owner: 'Compliance', health: 'In Progress' },
    { id: 4, client: 'Netflix', type: 'MSA Upgrade', status: 'Pending Signature', date: 'Oct 02, 2024', expiry: 'Oct 01, 2027', owner: 'Jack M.', health: 'Action Required' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

export default function ContractsPage() {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contract <span className="text-slate-500">Repository</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Manage Master Service Agreements (MSA), SLAs, and custom enterprise contracts with integrated version control.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-black shadow-sm hover:bg-slate-50 transition-all">
                        <Download size={18} /> Export Vault
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black shadow-md shadow-slate-900/10 hover:bg-slate-800 transition-all">
                        <Plus size={18} /> New Document
                    </button>
                </div>
            </header>

            {/* Contract Lifecycle Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">98% COMPLIANT</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">412</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Active Contracts</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FileSignature size={20} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">14</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pending Signature</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">5</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Expiring within 30d</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <PenTool size={20} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">8</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Under Legal Review</p>
                </div>
            </div>

            {/* Document Vault Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                            <FileText size={18} />
                        </div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Document Repository</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" placeholder="Search by client or document ID..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none w-72" />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-100/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Contract Name & Account</th>
                                <th className="px-6 py-4">Document Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Effective Date</th>
                                <th className="px-6 py-4">Expiry Date</th>
                                <th className="px-6 py-4">Compliance</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {contracts.map((doc) => (
                                <tr key={doc.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-black text-slate-900 tracking-tight">{doc.client}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: CTR-00{doc.id}X</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                                            <span className="text-xs font-bold text-slate-600">{doc.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                            doc.status === 'Signed' || doc.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                doc.status === 'Reviewing' ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                                        )}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-slate-500">{doc.date}</td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs font-black text-slate-900">{doc.expiry}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-[10px] font-black">
                                            {doc.health === 'Secure' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                                            <span className={doc.health === 'Secure' ? "text-emerald-600" : "text-amber-600"}>{doc.health.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-all group-hover:border-indigo-100">
                                                <Eye size={16} />
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

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div>Showing 4 of 412 strategic documents</div>
                    <div className="flex items-center gap-4 text-indigo-600 hover:text-indigo-700 cursor-pointer">
                        Full Compliance Audit History <History size={14} />
                    </div>
                </div>
            </div>
        </div>
    )
}
