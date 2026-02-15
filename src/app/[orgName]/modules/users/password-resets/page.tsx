"use client"

import { useState } from "react"
import {
    KeyRound,
    Search,
    RefreshCw,
    Mail,
    Clock,
    CheckCircle2,
    XCircle,
    Zap,
    ShieldCheck,
    MoreVertical,
    Loader2,
    Info,
    ChevronRight,
    Send
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function PasswordResetQueuePage() {
    const [searchQuery, setSearchQuery] = useState("")

    const requests = [
        { id: "pr1", name: "Sofia Garcia", email: "sofia.g@designhub.com", requestedAt: "15 mins ago", urgency: "High", source: "Self-Service" },
        { id: "pr2", name: "Ahmed Khan", email: "ahmed.k@ops.inc", requestedAt: "2 hours ago", urgency: "Normal", source: "Admin Requested" },
        { id: "pr3", name: "Emma Watson", email: "e.watson@fixl.com", requestedAt: "Yesterday", urgency: "Low", source: "Periodic Reset" },
    ]

    const handleApprove = (name: string) => {
        toast.success(`Temporary password sent to ${name}`)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Password Reset Queue"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Password Resets", href: "#" }
                ]}
                rightControls={
                    <CustomButton variant="outline" size="sm" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <RefreshCw className="w-3.5 h-3.5 mr-2" /> Refresh Queue
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Reset Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Pending Actions</h5>
                            <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{requests.length}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Resolved Today</h5>
                            <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100">18</p>
                        </div>
                    </div>
                    <div className="bg-zinc-900 dark:bg-zinc-100 rounded-[2rem] p-6 text-white dark:text-zinc-900 shadow-xl flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center shrink-0">
                            <Zap className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest leading-none opacity-60 mb-1">Self-Service Usage</h5>
                            <p className="text-3xl font-black tracking-tight">84%</p>
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
                            placeholder="Search through password management requests..."
                        />
                    </div>
                </div>

                {/* Request List Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">requestor identity</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">request details</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">urgency</th>
                                    <th className="p-5 text-right w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {requests.map((r) => (
                                    <tr key={r.id} className="hover:bg-blue-50/10 transition-all group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs border border-zinc-200 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-700">
                                                    <KeyRound className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{r.name}</span>
                                                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{r.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Requested {r.requestedAt}</span>
                                                </div>
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{r.source}</p>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <Badge className={`border-0 text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${r.urgency === 'High' ? 'bg-red-100 text-red-600' :
                                                    r.urgency === 'Normal' ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                                                }`}>
                                                {r.urgency} Priority
                                            </Badge>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CustomButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleApprove(r.name)}
                                                    className="h-9 rounded-xl hover:bg-blue-600 hover:text-white text-blue-600 font-black text-[10px] uppercase tracking-widest px-4 transition-all"
                                                >
                                                    <Send className="w-3.5 h-3.5 mr-2" /> Approve & Reset
                                                </CustomButton>
                                                <MoreVertical className="w-4 h-4 text-zinc-300 ml-2 cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Global Security Tip */}
                <div className="bg-zinc-900 dark:bg-white rounded-[2.5rem] p-8 text-white dark:text-zinc-900 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
                    <ShieldCheck className="absolute -bottom-10 -left-10 h-64 w-64 opacity-5 group-hover:rotate-12 transition-transform" />
                    <div className="relative z-10 space-y-4 max-w-2xl">
                        <h4 className="text-2xl font-black tracking-tight">Baseline Password Policy</h4>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium leading-relaxed">
                            Improve security by enforcing complex password requirements and regular expiration periods. We recommend using NIST standards for all administrative accounts.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <CustomButton className="bg-blue-600 text-white hover:bg-blue-700 font-black rounded-xl text-xs h-10 px-6 border-0">
                                View Policy <ChevronRight className="ml-2 w-4 h-4" />
                            </CustomButton>
                        </div>
                    </div>
                    <div className="shrink-0 h-40 w-40 bg-zinc-800 dark:bg-zinc-100 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center border border-white/10">
                        <h6 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Auto-Reset</h6>
                        <div className="text-3xl font-black text-blue-400 mb-1 tracking-tight">OFF</div>
                        <p className="text-[9px] font-bold text-zinc-600">click to enable</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
