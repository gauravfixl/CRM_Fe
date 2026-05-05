"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    CreditCard,
    Users,
    UserMinus,
    Zap,
    ArrowUpRight,
    TrendingDown,
    AlertCircle,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    MoreVertical
} from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts'

const subTrendData = [
    { name: 'Jan', active: 280, churn: 12 },
    { name: 'Feb', active: 310, churn: 8 },
    { name: 'Mar', active: 335, churn: 15 },
    { name: 'Apr', active: 360, churn: 10 },
    { name: 'May', active: 390, churn: 5 },
    { name: 'Jun', active: 420, churn: 7 },
]

const subTypeData = [
    { name: 'Monthly', value: 240, color: '#8b5cf6' },
    { name: 'Annual', value: 180, color: '#c084fc' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const StatBox = ({ title, value, subtext, trend, isPositive, icon: Icon, color }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "p-6 rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md",
            color === 'purple' ? "border-purple-100 hover:border-purple-200" :
                color === 'blue' ? "border-blue-100 hover:border-blue-200" :
                    color === 'rose' ? "border-rose-100 hover:border-rose-200" :
                        "border-slate-200"
        )}
    >
        <div className="flex items-center justify-between">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                color === 'purple' ? "bg-purple-50 text-purple-600" :
                    color === 'blue' ? "bg-blue-50 text-blue-600" :
                        color === 'rose' ? "bg-rose-50 text-rose-600" :
                            "bg-slate-50 text-slate-600"
            )}>
                <Icon size={20} />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter",
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                    {isPositive ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                    {trend}
                </div>
            )}
        </div>
        <div className="mt-4">
            <h3 className="text-[10px] font-black text-slate-400 border-b border-slate-50 pb-1 mb-2 uppercase tracking-widest">{title}</h3>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
            <p className="mt-1 text-[11px] font-medium text-slate-500">{subtext}</p>
        </div>
    </motion.div>
)

export default function SubscriptionsOverview() {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Global Ops</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscriptions <span className="text-purple-600">Strategic Overview</span></h1>
                <p className="text-sm font-medium text-slate-500 max-w-2xl">Monitor subscription health, track churn velocity, and analyze MRR movements across your entire client base.</p>
            </header>

            {/* Operational KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox
                    title="Active Subscriptions"
                    value="420"
                    subtext="Net +32 this month"
                    trend="+8.5%"
                    isPositive={true}
                    icon={Users}
                    color="purple"
                />
                <StatBox
                    title="Net Revenue Churn"
                    value="1.42%"
                    subtext="Industry Avg: < 3%"
                    trend="-0.2%"
                    isPositive={true}
                    icon={UserMinus}
                    color="rose"
                />
                <StatBox
                    title="Expiring (Next 30d)"
                    value="24"
                    subtext="Value: $184k"
                    trend="Needs Review"
                    isPositive={false}
                    icon={AlertCircle}
                    color="blue"
                />
                <StatBox
                    title="Failed Payments"
                    value="$12,450"
                    subtext="Recoverable via dunning"
                    trend="4.2% Rate"
                    isPositive={false}
                    icon={CreditCard}
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Lifecycle Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Lifecycle Trends</h2>
                            <p className="text-xs text-slate-500 font-medium">Monthly active vs churned subscription volume</p>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                                ACTIVE
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                CHURNED
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="active" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                                <Bar dataKey="churn" fill="#f43f5e" fillOpacity={0.6} radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Billing Distribution */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Contract Type</h2>
                    <div className="flex-1 h-[220px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {subTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-2xl font-black text-slate-900">420</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Subs</div>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {subTypeData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-[11px] font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-500">{item.name.toUpperCase()}</span>
                                </div>
                                <span className="text-slate-900">{item.value} ({Math.round(item.value / 420 * 100)}%)</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 w-full py-2 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-extrabold border border-slate-100 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                        Detailed Reports <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
