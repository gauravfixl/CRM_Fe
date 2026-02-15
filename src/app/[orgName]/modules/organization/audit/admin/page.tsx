"use client"

import React, { useState } from "react"
import {
    History,
    Search,
    Filter,
    Download,
    Activity,
    ShieldCheck,
    AlertTriangle,
    Clock,
    User,
    Globe,
    ArrowUpRight,
    Eye,
    X,
    Server,
    Database,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { toast } from "sonner"

const adminActions = [
    { id: "LOG-9021", action: "Policy Override", category: "Governance", user: "Robert Fox", scope: "Global", timestamp: "12:45:02 PM", severity: "High" },
    { id: "LOG-9020", action: "Seat Allocation Updated", category: "Subscription", user: "Jane Fisher", scope: "Dubai Office", timestamp: "11:20:15 AM", severity: "Low" },
    { id: "LOG-9019", action: "Compliance Report Export", category: "Audit", user: "Michael Chen", scope: "Global", timestamp: "09:15:44 AM", severity: "Medium" },
    { id: "LOG-9018", action: "Admin Role Granted", category: "Identity", user: "Robert Fox", scope: "London Sub", timestamp: "Yesterday", severity: "High" },
    { id: "LOG-9017", action: "API Key Rotated", category: "Security", user: "System", scope: "Global", timestamp: "Yesterday", severity: "Low" },
]

export default function AdminActionLogsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLog, setSelectedLog] = useState<any>(null)

    const filteredLogs = adminActions.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Admin Activity Stream</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time immutable ledger of all administrative actions performed across the institution.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200" onClick={() => toast.info("Audit signature verified.")}>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Verify Integrity
                    </Button>
                    <Button className="h-9 bg-slate-900 hover:bg-black text-white gap-2 font-black uppercase text-[10px] tracking-widest px-6" onClick={() => toast.success("Exporting full audit trail...")}>
                        <Download className="w-4 h-4" />
                        Download Full Trail
                    </Button>
                </div>
            </div>

            {/* AUDIT STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Events</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">12.4k</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Last 90 days</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-red-600">Critical Alerts</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-red-600">04</p>
                        <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">Requires review</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Sync</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">100%</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Nodes connected</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-purple-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Admins</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-purple-600">08</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Auth identities</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search logs by action, user or scope..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* LOGS TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden flex-1 rounded-3xl">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Audit Ledger</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction ID</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Administrative Action</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Scope</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{log.id}</td>
                                        <td className="px-4 py-5 font-bold text-slate-900 text-sm flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.severity === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                    log.severity === 'Medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                                }`} />
                                            {log.action}
                                        </td>
                                        <td className="px-4 py-5 text-xs text-slate-600 font-bold uppercase">{log.user}</td>
                                        <td className="px-4 py-5">
                                            <Badge variant="outline" className="text-[9px] font-black border-slate-200 bg-white text-slate-500 uppercase rounded-md">{log.scope}</Badge>
                                        </td>
                                        <td className="px-4 py-5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {log.timestamp}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Dialog open={selectedLog?.id === log.id} onOpenChange={(open) => !open && setSelectedLog(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-blue-500 hover:bg-white" onClick={() => setSelectedLog(log)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
                                                    <div className={`p-8 text-white ${log.severity === 'High' ? 'bg-red-600' : 'bg-slate-900'
                                                        }`}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <Badge className="bg-white/20 text-white border-none uppercase font-black text-[9px]">{log.category}</Badge>
                                                            <span className="text-[10px] font-mono opacity-50">{log.id}</span>
                                                        </div>
                                                        <DialogTitle className="text-2xl font-black tracking-tight">{log.action}</DialogTitle>
                                                        <p className="text-[11px] opacity-70 mt-1 font-medium">{log.timestamp} • Institutional Trace</p>
                                                    </div>
                                                    <div className="p-8 space-y-6 bg-white">
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiator</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                                        <User className="w-3 h-3 text-slate-400" />
                                                                    </div>
                                                                    <p className="text-sm font-bold text-slate-900">{log.user}</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Scope</p>
                                                                <div className="flex items-center gap-2">
                                                                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                                                                    <p className="text-sm font-bold text-slate-900">{log.scope}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Separator className="bg-slate-50" />
                                                        <div className="space-y-4">
                                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-500 space-y-2">
                                                                <p className="flex justify-between"><span className="font-bold">METADATA_SRC:</span> <span>Institutional_Nexus_V4</span></p>
                                                                <p className="flex justify-between"><span className="font-bold">AUTH_SIG:</span> <span>Verified_AES256</span></p>
                                                                <p className="flex justify-between"><span className="font-bold">NODE_ID:</span> <span>{Math.random().toString(36).substring(7).toUpperCase()}</span></p>
                                                            </div>
                                                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-50 border-dashed">
                                                                <Lock className="w-5 h-5 text-blue-500" />
                                                                <p className="text-[10px] font-medium text-blue-700 leading-relaxed">This record is crypto-signed and locked. No administrative entity can modify or delete this transaction once committed.</p>
                                                            </div>
                                                        </div>
                                                        <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase text-[11px] tracking-widest rounded-2xl" onClick={() => setSelectedLog(null)}>
                                                            Acknowledge & Close
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
