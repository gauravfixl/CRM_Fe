"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Receipt,
    CreditCard,
    DollarSign,
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    Download,
    CheckCircle2,
    History,
    AlertCircle,
    Calendar,
    ArrowRight,
    TrendingUp
} from "lucide-react"

const invoices = [
    { id: 'INV-4201', client: 'Tesla Inc', amount: '$850.00', status: 'Paid', date: 'Sep 30, 2024', method: 'Visa •••• 4242' },
    { id: 'INV-4202', client: 'SpaceX', amount: '$2,450.00', status: 'Sent', date: 'Oct 01, 2024', method: 'Bank Transfer' },
    { id: 'INV-4203', client: 'Adobe', amount: '$850.00', status: 'Past Due', date: 'Sep 15, 2024', method: 'Amex •••• 1005' },
    { id: 'INV-4204', client: 'Netflix', amount: '$4,200.00', status: 'Paid', date: 'Sep 02, 2024', method: 'Visa •••• 8812' },
    { id: 'INV-4205', client: 'Slack', amount: '$120.00', status: 'Failed', date: 'Oct 05, 2024', method: 'Mast. •••• 5521' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const SummaryCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm transition-all hover:border-indigo-100">
        <div className="flex items-center gap-4">
            <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center",
                color === 'green' ? "bg-emerald-50 text-emerald-600" :
                    color === 'red' ? "bg-rose-50 text-rose-600" :
                        color === 'blue' ? "bg-blue-50 text-blue-600" :
                            "bg-slate-100 text-slate-600"
            )}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
        </div>
        {trend && (
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                    <TrendingUp size={12} /> {trend}
                </div>
            </div>
        )}
    </div>
)

export default function InvoicesPayments() {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Invoice <span className="text-slate-500">& Transactions</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Full transactional ledger of all subscription payments, billing adjustments, and financial history.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-black shadow-sm hover:bg-slate-50 transition-all">
                        <Download size={18} /> Financial Export
                    </button>
                </div>
            </header>

            {/* Billing Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard title="Total Collected (MTD)" value="$412.5k" icon={CheckCircle2} color="green" trend="12.4%" />
                <SummaryCard title="Outstanding Revenue" value="$42.8k" icon={DollarSign} color="blue" />
                <SummaryCard title="Failed Payments" value="$1,240" icon={AlertCircle} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Ledger Table */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Financial Ledger</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input type="text" placeholder="ID or Account..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:outline-none w-48" />
                            </div>
                            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4">Invoice ID</th>
                                    <th className="px-6 py-4">Account</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Billing Date</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-indigo-600 border-b border-indigo-100">{inv.id}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black text-slate-900">{inv.client}</td>
                                        <td className="px-6 py-5 text-sm font-black text-slate-900">{inv.amount}</td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                                inv.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                    inv.status === 'Sent' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                        inv.status === 'Past Due' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                                                            "bg-rose-50 text-rose-600 border border-rose-100"
                                            )}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-slate-500">{inv.date}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                <CreditCard size={14} />
                                                {inv.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Automation Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Dunning Activity</h3>
                            <ArrowRight size={14} className="text-indigo-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 border-l-2 border-indigo-200 pl-4 py-1">
                                <div>
                                    <p className="text-[11px] font-black text-slate-900 uppercase">Recovery Initiated</p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">Automated retry for Apple Inc (INV-4182) in progress.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 border-l-2 border-emerald-200 pl-4 py-1">
                                <div>
                                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter">Payment Resolved</p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">Netflix successfully processed outstanding balance of $4,200.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 border border-indigo-200 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Manage Dunning Rules
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Global Tax Sync</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">VAT Verification</span>
                                <div className="h-6 w-12 bg-emerald-100 rounded-full flex items-center justify-end px-1">
                                    <div className="h-4 w-4 bg-emerald-600 rounded-full" />
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Automated Receipts</span>
                                <div className="h-6 w-12 bg-emerald-100 rounded-full flex items-center justify-end px-1">
                                    <div className="h-4 w-4 bg-emerald-600 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 cursor-pointer text-[10px] font-black uppercase tracking-widest px-1">
                            Audit Trail History <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
