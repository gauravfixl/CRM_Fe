"use client"

import { useState } from "react"
import {
    UserPlus,
    Mail,
    Search,
    Loader2,
    RefreshCw,
    Clock,
    Send,
    Trash2,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Link2,
    Calendar
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

export default function InvitationsPage() {
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const invitations = [
        { id: "inv1", email: "ceo@partnerfirm.com", role: "Manager", sentAt: "1 hour ago", expiresAt: "23h left", status: "Pending" },
        { id: "inv2", email: "tech.support@vendor.io", role: "Contributor", sentAt: "Yesterday", expiresAt: "Expired", status: "Expired" },
        { id: "inv3", email: "new.recruit@fixl.com", role: "Developer", sentAt: "3 days ago", expiresAt: "Expired", status: "Accepted" },
    ]

    const filteredInvites = invitations.filter(inv =>
        inv.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleResend = (email: string) => {
        toast.success(`Invitation resent to ${email}`)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Pending Invitations"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Invitations", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info("Refreshing invitations")}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Refresh
                        </CustomButton>
                        <CustomButton size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-white">
                            <UserPlus className="w-3.5 h-3.5 mr-2" /> Create Invite
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Invitation Metrics Hub */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Total Sent</p>
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{invitations.length}</h3>
                            <Badge className="bg-blue-50 text-blue-600 border-0 scale-90">Last 30d</Badge>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Awaiting Accept</p>
                        <h3 className="text-2xl font-black text-orange-600">{invitations.filter(i => i.status === 'Pending').length}</h3>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Acceptance Rate</p>
                        <h3 className="text-2xl font-black text-emerald-600">33%</h3>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">Expired Invites</p>
                        <h3 className="text-2xl font-black text-red-600">{invitations.filter(i => i.status === 'Expired').length}</h3>
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
                            placeholder="Search invites by email address..."
                        />
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <CustomButton variant="ghost" className="h-10 text-xs px-4 text-zinc-600">
                        <Link2 className="w-3.5 h-3.5 mr-2" /> Copy Signup Link
                    </CustomButton>
                </div>

                {/* Invitation List Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative">

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">recipient email</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">assigned role</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">temporal status</th>
                                    <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">lifecycle</th>
                                    <th className="p-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredInvites.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Mail className="w-12 h-12 text-zinc-200" />
                                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No active invitations found</h3>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvites.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-blue-50/10 transition-all group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{inv.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <Badge variant="outline" className="text-[10px] font-black border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-md text-zinc-600 dark:text-zinc-400">
                                                    {inv.role.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    {inv.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-orange-500" />}
                                                    {inv.status === 'Expired' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                                    {inv.status === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                                    <span className={`text-xs font-bold ${inv.status === 'Pending' ? 'text-orange-600' :
                                                            inv.status === 'Accepted' ? 'text-emerald-600' : 'text-red-600'
                                                        }`}>{inv.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                                        <span className="text-[10px] font-bold text-zinc-500">Sent: {inv.sentAt}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-zinc-400" />
                                                        <span className={`text-[10px] font-bold ${inv.status === 'Expired' ? 'text-red-400' : 'text-zinc-500'}`}>Expiry: {inv.expiresAt}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {inv.status !== 'Accepted' && (
                                                        <CustomButton
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleResend(inv.email)}
                                                            className="h-8 rounded-lg hover:bg-blue-50 text-blue-600 font-bold text-[10px] uppercase px-3"
                                                        >
                                                            <Send className="w-3 h-3 mr-2" /> Resend
                                                        </CustomButton>
                                                    )}
                                                    <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                                                        <Trash2 className="w-4 h-4" />
                                                    </CustomButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
                    <Link2 className="w-5 h-5 text-blue-600" />
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                        Tip: If the recipient hasn't received the email, you can copy the unique invitation link and send it manually.
                    </p>
                </div>
            </div>
        </div>
    )
}
