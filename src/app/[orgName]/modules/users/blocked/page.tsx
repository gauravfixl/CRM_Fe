"use client"

import { useState } from "react"
import {
    ShieldAlert,
    Search,
    RefreshCw,
    UserX,
    UserCheck,
    AlertTriangle,
    MapPin,
    Clock,
    ExternalLink,
    Loader2,
    ChevronRight,
    MoreVertical,
    Activity
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function BlockedRiskyUsersPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const riskyUsers = [
        {
            id: "r1",
            name: "James Bond",
            email: "007@mi6.gov",
            riskLevel: "Critical",
            reason: "Impossible Travel Detected",
            lastLocation: "Moscow, RU",
            status: "Blocked"
        },
        {
            id: "r2",
            name: "Unknown Entity",
            email: "guest_82@proxy.net",
            riskLevel: "Medium",
            reason: "Multiple Failed MFA attempts",
            lastLocation: "Berlin, DE",
            status: "Active (Monitored)"
        },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Blocked & Risky Users"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Security", href: "#" },
                    { label: "Risky Users", href: "#" }
                ]}
                rightControls={
                    <CustomButton className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/20">
                        Block All High Risk
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Risk Intelligence HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-3xl p-5 group flex flex-col justify-between h-40">
                        <ShieldAlert className="w-8 h-8 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                        <div>
                            <h5 className="text-sm font-black text-red-900 dark:text-red-100 uppercase tracking-tighter">Critical Risk</h5>
                            <p className="text-3xl font-black text-red-600">01</p>
                        </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-3xl p-5 group flex flex-col justify-between h-40">
                        <AlertTriangle className="w-8 h-8 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                        <div>
                            <h5 className="text-sm font-black text-orange-900 dark:text-orange-100 uppercase tracking-tighter">Medium Risk</h5>
                            <p className="text-3xl font-black text-orange-600">04</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900 dark:bg-zinc-100 border-0 rounded-3xl p-5 group flex flex-col justify-between h-40 text-white dark:text-zinc-900 shadow-2xl">
                        <UserX className="w-8 h-8 opacity-40 mb-4 group-hover:rotate-12 transition-transform" />
                        <div>
                            <h5 className="text-sm font-black uppercase tracking-tighter opacity-60">Total Blocked</h5>
                            <p className="text-3xl font-black">12</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 group flex flex-col justify-between h-40 shadow-sm">
                        <Activity className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                        <div>
                            <h5 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">Threat Level</h5>
                            <p className="text-3xl font-black text-emerald-500 uppercase tracking-tighter">LOW</p>
                        </div>
                    </div>
                </div>

                {/* Command Bar */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
                            placeholder="Search through risky identities and suspicious activities..."
                        />
                    </div>
                </div>

                {/* Risk List Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">flagged identity</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">risk assessment</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">last anomalous activity</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">action status</th>
                                    <th className="p-5 text-right w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {riskyUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-red-50/10 transition-all group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg ${user.riskLevel === 'Critical' ? 'bg-red-600 shadow-red-500/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
                                                    {user.riskLevel === 'Critical' ? '!!!' : '!!'}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{user.name}</span>
                                                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="outline" className={`w-fit text-[9px] font-black tracking-widest px-2 ${user.riskLevel === 'Critical' ? 'border-red-200 text-red-600 bg-red-50' : 'border-orange-200 text-orange-600 bg-orange-50'
                                                    }`}>
                                                    {user.riskLevel.toUpperCase()}
                                                </Badge>
                                                <p className="text-[11px] font-bold text-zinc-500 truncate max-w-[200px]">{user.reason}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{user.lastLocation}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-[10px] font-medium text-zinc-500">2 hours ago</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <Badge className={`border-0 text-[10px] font-black truncate max-w-[120px] px-2 py-0.5 rounded-full ${user.status.includes('Blocked') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {user.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toast.success("Self-remediation request sent")}
                                                    className="h-8 rounded-lg hover:bg-blue-50 text-blue-600 font-bold text-[10px] uppercase px-3 shadow-none border-0"
                                                >
                                                    Remediate
                                                </CustomButton>
                                                <MoreVertical className="w-4 h-4 text-zinc-300 ml-2" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Global Protection Policies Link */}
                <div className="p-8 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden group">
                    <ShieldAlert className="absolute -top-10 -left-10 h-64 w-64 text-white opacity-5 group-hover:rotate-12 transition-transform" />
                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <h4 className="text-3xl font-black tracking-tight">Identity Protection Policies</h4>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                            Set up automated responses for suspicious login patterns. Take immediate action like revoking active sessions or requiring an immediate password reset when risks are detected.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <CustomButton className="bg-white text-zinc-900 hover:bg-zinc-100 font-black rounded-xl text-xs h-11 px-8">
                                Configure Protection <ChevronRight className="ml-2 w-4 h-4" />
                            </CustomButton>
                            <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                                View Audit Logs <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
