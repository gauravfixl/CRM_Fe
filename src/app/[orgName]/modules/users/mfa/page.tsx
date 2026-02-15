"use client"

import { useState } from "react"
import {
    ShieldCheck,
    ShieldAlert,
    Search,
    RefreshCw,
    Smartphone,
    Mail,
    Key,
    HardDrive,
    CheckCircle2,
    XCircle,
    MoreVertical,
    ArrowRight,
    PieChart,
    Lock
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function MFAEnrollmentPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const users = [
        { id: "m1", name: "David Miller", email: "d.miller@enterprise.io", status: "Enabled", method: "Authenticator App", strength: "High" },
        { id: "m2", name: "Samantha Reed", email: "sreed@fixl.com", status: "Disabled", method: "None", strength: "None" },
        { id: "m3", name: "Liam Wilson", email: "liam.w@external.org", status: "Enabled", method: "SMS / Text", strength: "Medium" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="MFA Enrollment"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Security", href: "#" },
                    { label: "MFA Status", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-xl shadow-xl">
                            Enforce MFA Policy
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Security Health Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Security Posture</h4>
                                <p className="text-sm font-medium text-zinc-500">67% of users have MFA active</p>
                            </div>
                        </div>
                        <div className="pt-8">
                            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border dark:border-zinc-800">
                                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" style={{ width: '67%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between group cursor-pointer hover:bg-blue-700 transition-all">
                            <Smartphone className="w-8 h-8 opacity-40 group-hover:scale-110 transition-transform" />
                            <div>
                                <h5 className="text-3xl font-black tracking-tighter">42</h5>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">App Authenticators</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-zinc-300 transition-all">
                            <Lock className="w-8 h-8 text-zinc-300 group-hover:scale-110 transition-transform" />
                            <div>
                                <h5 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">12</h5>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Keys</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900 dark:bg-white rounded-[2rem] p-6 text-white dark:text-zinc-900 shadow-xl flex flex-col justify-between group cursor-pointer hover:opacity-90 transition-all">
                            <ShieldAlert className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                            <div>
                                <h5 className="text-3xl font-black tracking-tighter">03</h5>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">High Risk (Disabled)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
                            placeholder="Search users to verify authentication strength..."
                        />
                    </div>
                </div>

                {/* MFA List Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">identity profile</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">enrollment status</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">primary method</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">auth strength</th>
                                    <th className="p-5 text-right w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/10 transition-all group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs border border-zinc-200 shadow-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 transition-colors">{user.name}</span>
                                                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <Badge className={`
                        ${user.status === 'Enabled' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} 
                        border-0 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit
                      `}>
                                                {user.status === 'Enabled' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {user.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                {user.method === 'Authenticator App' && <Smartphone className="w-3.5 h-3.5 text-blue-500" />}
                                                {user.method === 'SMS / Text' && <Mail className="w-3.5 h-3.5 text-orange-500" />}
                                                {user.method === 'None' && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{user.method}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className={`h-1.5 w-4 rounded-full ${user.strength === 'High' ? 'bg-emerald-500' :
                                                                user.strength === 'Medium' && i <= 2 ? 'bg-orange-400' : 'bg-zinc-200'
                                                            }`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <MoreVertical className="w-5 h-5 text-zinc-300 cursor-pointer ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Advanced Config Hub */}
                <div className="p-8 rounded-[3rem] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-blue-600 text-white border-0 text-[10px] font-black tracking-widest">ENTERPRISE SECURITY</Badge>
                        </div>
                        <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Conditional Access Policies</h4>
                        <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                            Require MFA only when users are logging in from untrusted networks or unmanaged devices. Reduce friction without compromising security.
                        </p>
                        <CustomButton variant="outline" size="sm" className="rounded-xl border-zinc-300 font-bold text-xs h-11 px-6">
                            Review Policies <ArrowRight className="ml-2 w-4 h-4" />
                        </CustomButton>
                    </div>
                    <div className="shrink-0 h-40 w-40 bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl flex items-center justify-center p-8 group-hover:rotate-12 transition-transform">
                        <PieChart className="h-full w-full text-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    )
}
