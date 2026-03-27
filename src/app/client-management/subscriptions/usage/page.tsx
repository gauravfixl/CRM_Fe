"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Zap,
    Database,
    Activity,
    TrendingUp,
    Cpu,
    Network,
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    Clock,
    AlertCircle,
    ChevronRight,
    ArrowRight
} from "lucide-react"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    LineChart,
    Line
} from 'recharts'

const usageTrend = [
    { name: '01 Sep', consumption: 45000 },
    { name: '05 Sep', consumption: 52000 },
    { name: '10 Sep', consumption: 48000 },
    { name: '15 Sep', consumption: 61000 },
    { name: '20 Sep', consumption: 75000 },
    { name: '25 Sep', consumption: 82000 },
    { name: '30 Sep', consumption: 94000 },
]

const clientUsage = [
    { id: 1, client: 'SpaceX', metric: 'API Requests', current: '12.4M', limit: '15M', overflow: '0', revenue: '$4,250', status: 'Stable' },
    { id: 2, client: 'Tesla Inc', metric: 'Data Storage', current: '8.2 TB', limit: '10 TB', overflow: '0', revenue: '$1,800', status: 'Stable' },
    { id: 3, client: 'Adobe', metric: 'Compute Units', current: '42k', limit: '35k', overflow: '7k', revenue: '$540+', status: 'Critical' },
    { id: 4, client: 'Netflix', metric: 'Network BW', current: '984 TB', limit: '1 PB', overflow: '0', revenue: '$12,800', status: 'Warning' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm transition-all hover:border-indigo-100">
        <div className="flex items-center justify-between mb-4">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                color === 'blue' ? "bg-blue-50 text-blue-600" :
                    color === 'orange' ? "bg-orange-50 text-orange-600" :
                        color === 'purple' ? "bg-purple-50 text-purple-600" :
                            "bg-slate-50 text-slate-600"
            )}>
                <Icon size={20} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                <TrendingUp size={12} /> {trend}
            </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value} <span className="text-sm font-bold text-slate-400">{unit}</span></h3>
        <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    </div>
)

export default function UsageBilling() {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <Zap size={14} className="text-orange-600" />
                    </div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Real-time Metering</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Usage <span className="text-orange-600">Billing Engine</span></h1>
                <p className="text-sm font-medium text-slate-500 max-w-2xl">Track metered consumption across API, storage, and compute resources. Transparent invoicing based on actual platform utilization.</p>
            </header>

            {/* Global Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Global API Velocity" value="842" unit=" req/sec" icon={Activity} color="blue" trend="+12%" />
                <MetricCard title="Total Data Flux" value="1.2" unit=" PB" icon={Database} color="purple" trend="+5.4%" />
                <MetricCard title="Compute Grid Utilization" value="94.2" unit="%" icon={Cpu} color="orange" trend="+2.1%" />
                <MetricCard title="Avg Latency (Global)" value="42" unit=" ms" icon={Network} color="blue" trend="-8%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage Analytics */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Platform Consumption Trend</h2>
                            <p className="text-xs text-slate-500 font-medium">Aggregated resource utilization across all active clusters</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-widest">REAL-TIME SYNC ON</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={usageTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    tickFormatter={(v) => `${v / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -10px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="consumption"
                                    stroke="#ec4899"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#ec4899', strokeWidth: 4, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#ec4899' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Critical Usage Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-6 shadow-sm flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Overage Alerts</h3>
                        <p className="text-xs font-medium text-slate-500 mt-2 px-4 leading-relaxed">System has detected 4 enterprise accounts that have exceeded their soft-limits in the last 24 hours.</p>
                        <button className="w-full mt-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                            Mitigate Overages <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Usage Spikes</h3>
                            <Clock size={14} className="text-slate-300" />
                        </div>
                        <div className="space-y-5">
                            {[
                                { client: 'Adobe', spike: '+420%', time: '2h ago' },
                                { client: 'Swift Apps', spike: '+85%', time: '5h ago' },
                                { client: 'Netflix', spike: '+12%', time: '12h ago' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">{s.client}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-rose-600">{s.spike}</span>
                                        <span className="text-[10px] font-medium text-slate-400">{s.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Usage Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Metered Accounts Overview</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input type="text" placeholder="Search accounts..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 w-64" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Account Name</th>
                                <th className="px-6 py-4">Primary Metric</th>
                                <th className="px-6 py-4">Current Usage</th>
                                <th className="px-6 py-4">Quota Utilization</th>
                                <th className="px-6 py-4">Accrued Rev</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {clientUsage.map((u) => (
                                <tr key={u.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                    <td className="px-6 py-4 font-extrabold text-sm text-slate-900">{u.client}</td>
                                    <td className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-tight">{u.metric}</td>
                                    <td className="px-6 py-4 text-xs font-black text-slate-900">{u.current}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        u.status === 'Critical' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" :
                                                            u.status === 'Warning' ? "bg-orange-500" : "bg-emerald-500"
                                                    )}
                                                    style={{ width: `${Math.min(100, (parseFloat(u.current) / parseFloat(u.limit)) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400">/ {u.limit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-emerald-600">{u.revenue}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                                            u.status === 'Stable' ? "bg-emerald-50 text-emerald-600" :
                                                u.status === 'Warning' ? "bg-orange-50 text-orange-600" : "bg-rose-50 text-rose-600"
                                        )}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
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
        </div>
    )
}
