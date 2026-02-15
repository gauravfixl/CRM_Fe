"use client"

import { useState } from "react"
import {
    History,
    Trash2,
    ShieldX,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    Monitor,
    Smartphone,
    Laptop,
    Globe,
    Clock,
    ShieldAlert,
    Lock,
    Zap,
    ChevronRight
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

export default function SessionManagementPage() {
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const sessions = [
        { id: "s1", user: "Michael Chen", email: "michael@fixl.com", device: "Browser (MacBook Pro)", location: "London, UK", ip: "192.168.1.1", status: "Active", loginTime: "12 mins ago", risk: "Low" },
        { id: "s2", user: "Sarah Jenkins", email: "sarah.j@fixl.com", device: "iPhone 15 Pro", location: "New York, USA", ip: "172.16.0.45", status: "Active", loginTime: "2 hours ago", risk: "Medium" },
        { id: "s3", user: "John Doe", email: "john.d@fixl.com", device: "Browser (Windows)", location: "Berlin, DE", ip: "10.0.0.8", status: "Idle", loginTime: "5 hours ago", risk: "Low" },
        { id: "s4", user: "Unknown Identity", email: "audit-test@fixl.com", device: "CLI (Linux)", location: "Mumbai, IN", ip: "45.1.22.9", status: "Suspicious", loginTime: "1 hour ago", risk: "High" },
    ]

    const handleRevokeAll = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("All non-critical sessions invalidated")
        }, 1500)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Active Sessions"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Sessions", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            onClick={() => toast.info("Directory sync triggered")}
                            className="rounded-none h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync Active
                        </CustomButton>
                        <CustomButton
                            onClick={handleRevokeAll}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-none h-10 px-6 font-black uppercase text-xs tracking-widest shadow-xl border-0"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldX className="w-4 h-4 mr-2" />}
                            Revoke Global Tokens
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Session Telemetry HUD */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-1 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="p-8 bg-zinc-950 text-white flex flex-col justify-between space-y-8 md:w-80 shrink-0">
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Active Directory Pulse</h5>
                            <p className="text-3xl font-black tracking-tighter text-white italic">1,240 <span className="text-sm font-bold text-zinc-400 ml-1">SESSIONS</span></p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                    <span>Desktop</span>
                                    <span>842</span>
                                </div>
                                <Progress value={68} className="h-1 bg-zinc-800 rounded-none shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                    <span>Mobile</span>
                                    <span>398</span>
                                </div>
                                <Progress value={32} className="h-1 bg-zinc-800 rounded-none shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-8 bg-white dark:bg-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Login Velocity</CardTitle>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-none bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">42 / min</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-emerald-500">Normal Range</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Token Validity</CardTitle>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-none bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">99.8%</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Integrity Score</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stale Sessions</CardTitle>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-none bg-orange-50 dark:bg-orange-900/10 text-orange-600 flex items-center justify-center border border-orange-100 dark:border-orange-800">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-2xl font-black text-zinc-900 dark:text-white">12</span>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Exceeded limit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Command Bar */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search active identities by name, IP, or location..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-bold"
                        />
                    </div>
                    <div className="flex gap-2 mr-2">
                        <CustomButton variant="outline" size="sm" className="rounded-none border-zinc-200 h-10 px-4 font-black text-[10px] uppercase tracking-widest bg-white dark:bg-zinc-950">
                            <Filter className="w-3.5 h-3.5 mr-2" /> All Locations
                        </CustomButton>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest italic">Live Authentication Table</h4>
                        <Badge className="bg-zinc-900 text-white rounded-none border-0 text-[10px] font-black px-4 py-1 tracking-widest">READ-ONLY MONITOR</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                                    <TableHead className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Identity Scope</TableHead>
                                    <TableHead className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Hardware context</TableHead>
                                    <TableHead className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Geolocation & IP</TableHead>
                                    <TableHead className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Security Risk</TableHead>
                                    <TableHead className="p-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</TableHead>
                                    <TableHead className="p-5 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {sessions.map((s) => (
                                    <TableRow key={s.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-all group">
                                        <TableCell className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex items-center justify-center font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-none">
                                                    {s.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{s.user}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <div className="flex items-center gap-2">
                                                {s.device.includes('Browser') ? <Laptop className="w-4 h-4 text-zinc-300" /> : <Smartphone className="w-4 h-4 text-zinc-300" />}
                                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{s.device}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-3.5 h-3.5 text-zinc-300" />
                                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">{s.location}</span>
                                                </div>
                                                <p className="text-[10px] font-mono text-zinc-400">{s.ip}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <Badge className={`rounded-none border-0 text-[10px] font-black uppercase tracking-widest ${s.risk === 'High' ? 'bg-orange-50 text-orange-600' :
                                                s.risk === 'Medium' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-50 text-zinc-400'
                                                }`}>
                                                {s.risk} Risk
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-5">
                                            <div className="flex items-center gap-2 border border-zinc-100 dark:border-zinc-800 px-3 py-1 bg-zinc-50/50 dark:bg-zinc-900/50 w-fit">
                                                <div className={`h-1.5 w-1.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{s.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-5 text-right">
                                            <CustomButton variant="ghost" size="icon" className="text-zinc-300 hover:text-red-500 rounded-none group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </CustomButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Global Action Footer */}
                <div className="p-8 bg-zinc-900 text-white rounded-none flex items-center justify-between shadow-2xl relative overflow-hidden group">
                    <ShieldAlert className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 group-hover:scale-110 transition-transform" />
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="h-20 w-20 bg-zinc-800 border border-zinc-700 flex items-center justify-center rounded-none shadow-inner">
                            <Lock className="h-10 w-10 text-zinc-500" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black tracking-tighter uppercase italic text-white">Session Token Expiration</h4>
                            <p className="text-zinc-300 text-sm font-medium mt-1 leading-relaxed max-w-lg italic opacity-90">
                                You can enforce global session limits to automatically sign users out after a period of inactivity. Current threshold is <span className="text-white italic underline decoration-indigo-500/50">8 Hours</span>.
                            </p>
                        </div>
                    </div>
                    <CustomButton className="relative z-10 bg-indigo-600 hover:bg-indigo-700 font-black rounded-none h-14 px-12 uppercase text-xs tracking-widest border-0">
                        Update Global Limits
                    </CustomButton>
                </div>

            </div>
        </div>
    )
}
