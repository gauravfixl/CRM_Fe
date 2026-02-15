"use client"

import { useState } from "react"
import {
    Users,
    CheckCircle2,
    Circle,
    Clock,
    Search,
    ChevronRight,
    ShieldCheck,
    UserCheck,
    Zap,
    Building2,
    ArrowUpRight
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function OnboardingStatusPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const onboardingUsers = [
        {
            id: "orb1",
            name: "Marcus Aurelius",
            email: "marcus@rome.inc",
            progress: 75,
            steps: [
                { name: "Account Creation", status: "complete" },
                { name: "Profile Setup", status: "complete" },
                { name: "MFA Enrollment", status: "complete" },
                { name: "Org Training", status: "pending" }
            ]
        },
        {
            id: "orb2",
            name: "Seneca Young",
            email: "s.young@stoic.io",
            progress: 25,
            steps: [
                { name: "Account Creation", status: "complete" },
                { name: "Profile Setup", status: "pending" },
                { name: "MFA Enrollment", status: "pending" },
                { name: "Org Training", status: "pending" }
            ]
        }
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Onboarding Status"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Onboarding", href: "#" }
                ]}
                rightControls={
                    <CustomButton size="sm" className="bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
                        Send Reminders
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">In Pipeline</p>
                            <h3 className="text-3xl font-black text-blue-600 tracking-tight">{onboardingUsers.length}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Avg. Setup Time</p>
                            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">4.2 <span className="text-xs">hrs</span></h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Stalled Setups</p>
                            <h3 className="text-3xl font-black text-red-600 tracking-tight">1</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <Circle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* User Onboarding Cards */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Active Onboarding Lifecycles</h4>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Filter by name..."
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {onboardingUsers.map((u) => (
                        <div key={u.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-blue-500/30 transition-all group">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                {/* User Profile */}
                                <div className="w-64 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 font-black text-sm border border-zinc-200 group-hover:scale-110 transition-transform">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">{u.name}</h5>
                                            <p className="text-[11px] font-medium text-zinc-500 overflow-hidden text-ellipsis w-40">{u.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Stepper */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Completion Progress</p>
                                        <span className="text-xs font-black text-blue-600">{u.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6 border dark:border-zinc-800 shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${u.progress}%` }}></div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6">
                                        {u.steps.map((step, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                {step.status === 'complete' ? (
                                                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    </div>
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full bg-zinc-100 text-zinc-300 flex items-center justify-center border border-zinc-200">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-pulse" />
                                                    </div>
                                                )}
                                                <span className={`text-[11px] font-bold tracking-tight ${step.status === 'complete' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                                    {step.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="shrink-0 flex items-center gap-2">
                                    <CustomButton variant="outline" size="sm" className="rounded-xl font-bold text-xs h-10 px-4 border-zinc-200">
                                        View Logs
                                    </CustomButton>
                                    <CustomButton variant="ghost" size="icon" className="h-10 w-10 text-zinc-400">
                                        <ChevronRight className="w-5 h-5" />
                                    </CustomButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Global Onboarding Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <Building2 className="absolute -bottom-8 -right-8 h-40 w-40 opacity-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-black mb-2 tracking-tight">Onboarding Workflows</h4>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed max-w-sm">Design custom onboarding journeys with automated welcome emails and role-specific training modules.</p>
                        <CustomButton className="bg-white text-blue-700 hover:bg-blue-50 font-black rounded-xl text-xs h-10 px-6 border-0">
                            Configure Journey <ArrowUpRight className="ml-2 w-4 h-4" />
                        </CustomButton>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">Identity Governance</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Ensure all new users meet the baseline security requirements before granting access to sensitive production environments.</p>
                        </div>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="flex -space-x-3">
                                <div className="h-10 w-10 rounded-full border-4 border-white dark:border-zinc-900 bg-blue-100" />
                                <div className="h-10 w-10 rounded-full border-4 border-white dark:border-zinc-900 bg-emerald-100" />
                                <div className="h-10 w-10 rounded-full border-4 border-white dark:border-zinc-900 bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">+12</div>
                            </div>
                            <span className="text-xs font-bold text-zinc-400 italic">verified this week</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
