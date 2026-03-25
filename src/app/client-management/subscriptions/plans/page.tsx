"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Package,
    Zap,
    Shield,
    Star,
    Check,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Target,
    Layers,
    Activity
} from "lucide-react"

const plans = [
    {
        id: 1,
        name: 'Starter',
        price: '$49',
        billing: 'per month',
        activeClients: 124,
        revenue: '$6,076',
        features: ['Up to 5 Projects', 'Basic CRM', 'Email Support'],
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        icon: Zap
    },
    {
        id: 2,
        name: 'Professional',
        price: '$199',
        billing: 'per month',
        activeClients: 420,
        revenue: '$83,580',
        features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'API Access'],
        color: 'bg-purple-50 text-purple-600 border-purple-100',
        icon: Package,
        isPopular: true
    },
    {
        id: 3,
        name: 'Enterprise',
        price: '$999',
        billing: 'per month',
        activeClients: 86,
        revenue: '$85,914',
        features: ['Custom Contracts', 'Dedicated Account Manager', '24/7 Phone Support', 'SLA Guarantee'],
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        icon: Shield
    },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

export default function PlansPricing() {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Plans & <span className="text-indigo-600">Pricing</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Manage your product monetization logic, feature gating, and billing tiers across the global enterprise.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                    <Plus size={18} /> Add New Plan
                </button>
            </header>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <Target className="h-4 w-4" /> Best Performing Plan
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">Professional</span>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% growth</span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <Layers className="h-4 w-4" /> Active Price Points
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">12 Variants</span>
                        <span className="text-[11px] font-bold text-slate-500">Across 3 tiers</span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        <Activity className="h-4 w-4" /> Avg Revenue / Plan
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">$58.4k</span>
                        <span className="text-[11px] font-bold text-slate-500">Monthly Average</span>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "relative flex flex-col rounded-3xl border bg-white p-8 transition-all hover:shadow-xl group overflow-hidden",
                            plan.isPopular ? "border-indigo-200 shadow-indigo-100/20" : "border-slate-200"
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0">
                                <div className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1.5">
                                    <Star className="h-3 w-3 fill-white" /> Popular
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-8">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner border transition-transform group-hover:scale-110", plan.color)}>
                                <plan.icon size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-xs font-medium text-slate-500">/{plan.billing}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 pb-2">
                                <span>Platform Metrics</span>
                                <span>Current Activity</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-600">Active Clients</span>
                                <span className="text-xs font-black text-slate-900">{plan.activeClients}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-600">Plan Revenue (MRR)</span>
                                <span className="text-xs font-black text-indigo-600">{plan.revenue}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Features</h4>
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className="h-4 w-4 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5">
                                        <Check size={10} strokeWidth={4} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 leading-tight">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-3">
                            <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
                                Edit Plan
                            </button>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
