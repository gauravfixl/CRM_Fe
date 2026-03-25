"use client"

import React, { useState, useEffect } from "react"
import {
    Shield, Key, Lock, Globe, Smartphone, UserCheck, Eye, EyeOff,
    AlertTriangle, History, ShieldAlert, Zap, Clock, UserX,
    CheckCircle2, X, Plus, Search, MoreHorizontal, Activity, Terminal, ShieldCheck
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

interface AccessLog {
    id: string
    user: string
    ip: string
    location: string
    device: string
    time: string
    status: "Success" | "Suspicious" | "Failed"
}

const INITIAL_LOGS: AccessLog[] = [
    { id: "LOG-1", user: "David Brown", ip: "192.168.1.45", location: "Mumbai, India", device: "Chrome / macOS", time: "2m ago", status: "Success" },
    { id: "LOG-2", user: "Sarah Miller", ip: "103.45.21.11", location: "London, UK", device: "Safari / iOS", time: "14h ago", status: "Success" },
    { id: "LOG-3", user: "Unknown", ip: "45.112.33.9", location: "Beijing, China", device: "Unknown Bot", time: "2h ago", status: "Suspicious" },
    { id: "LOG-4", user: "James Wilson", ip: "172.16.0.8", location: "New York, USA", device: "Edge / Windows", time: "1 day ago", status: "Success" },
    { id: "LOG-5", user: "Emily Davis", ip: "192.168.1.12", location: "Mumbai, India", device: "Firefox / macOS", time: "3 days ago", status: "Failed" },
]

const STATS = [
    { label: "Strength Index", value: "94/100", sub: "Enterprise A+", icon: ShieldCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Failed Auth", value: "12", sub: "Last 24 hours", icon: AlertTriangle, bg: "bg-rose-50/10", text: "text-rose-600", border: "border-rose-100/20" },
    { label: "Active Sessions", value: "242", sub: "Global nodes", icon: Zap, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "MFA Adoption", value: "98%", sub: "Core users", icon: ShieldCheck, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
]

export default function SecurityPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [mfaEnabled, setMfaEnabled] = useState(true)
    const [ssoMandatory, setSsoMandatory] = useState(false)
    const [passRotation, setPassRotation] = useState("90")
    const [showLockdownModal, setShowLockdownModal] = useState(false)
    const [logs, setLogs] = useState<AccessLog[]>(INITIAL_LOGS)
    const [search, setSearch] = useState("")

    useEffect(() => { setIsClient(true) }, [])

    const filteredLogs = logs.filter(l => l.user.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search))

    const handleForceLogout = () => {
        toast({ title: "Global Logout Initiated", description: "Terminating all active sessions across all devices..." })
    }

    const handleLockdown = () => {
        setShowLockdownModal(false)
        toast({
            variant: "destructive",
            title: "SYSTEM LOCKDOWN ACTIVE",
            description: "Access limited to Super Admins from whitelisted IPs only."
        })
    }

    const handleResetMFA = (user: string) => {
        toast({ title: "MFA Reset", description: `MFA credentials for ${user} have been cleared.` })
    }

    const handleClearLogs = () => {
        setLogs([])
        toast({ title: "Audit Trail Cleared", description: "Session logs archived and removed from active view." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-rose-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100"><Shield className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Global Security Policy</h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight">Manage authentication protocols, session security, and monitor global access attempts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleForceLogout} className="h-10 border-rose-100 text-rose-600 hover:bg-rose-50 font-black text-[11px] px-5 uppercase tracking-widest bg-white">
                        <UserX className="h-4 w-4 mr-2" /> Force Global Logout
                    </Button>
                    <Button onClick={() => setShowLockdownModal(true)} className="h-10 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-rose-100">
                        <Terminal className="h-4 w-4 mr-2" /> Lockdown Mode
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Account Security Rules */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                    <div className="border-b border-slate-50 pb-5">
                        <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">Authentication Standards</h3>
                        <p className="text-[12px] text-slate-500 font-medium mt-1">Configure how users access the platform.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <div>
                                <p className="text-[13px] font-black text-indigo-900">Enforce MFA</p>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide">Multi-Factor Authentication</p>
                            </div>
                            <Switch checked={mfaEnabled} onCheckedChange={(v) => { setMfaEnabled(v); toast({ title: v ? "MFA Enforced" : "MFA Made Optional" }) }} className="data-[state=checked]:bg-indigo-600" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div>
                                <p className="text-[13px] font-black text-slate-900">SAML 2.0 (SSO)</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Enterprise Single Sign-On</p>
                            </div>
                            <Switch checked={ssoMandatory} onCheckedChange={setSsoMandatory} className="data-[state=checked]:bg-slate-900" />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Password Rotation (Days)</Label>
                            <Select value={passRotation} onValueChange={setPassRotation}>
                                <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50 font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">Every 30 Days</SelectItem>
                                    <SelectItem value="90">Every 90 Days</SelectItem>
                                    <SelectItem value="180">Every 6 Months</SelectItem>
                                    <SelectItem value="never">Never Rotate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-3">
                            <div className="flex items-center gap-2 text-rose-700">
                                <AlertTriangle size={16} /><span className="text-[12px] font-black uppercase">Session Management</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium text-rose-900">Inactivity Timeout</span>
                                <span className="text-[12px] font-black text-rose-900">30 Mins</span>
                            </div>
                            <Button variant="link" className="p-0 h-auto text-[11px] font-black uppercase text-rose-600 hover:text-rose-800" onClick={() => toast({ title: "Coming Soon", description: "Configurable session window coming next update." })}>Manage Timeout Logic →</Button>
                        </div>
                    </div>
                </Card>

                {/* Login History */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-[17px] font-semibold text-slate-900">Global Access History</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Real-time log of all authentication events.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input placeholder="Filter by User or IP..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50 text-[12px]" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleClearLogs} className="h-10 w-10 text-slate-300 hover:text-rose-600"><History size={18} /></Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                {["User Signature", "Network Info", "Location", "Timestamp", "Security Status"].map(h => (
                                    <TableHead key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-[11px] ${log.status === 'Suspicious' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {log.user === 'Unknown' ? '?' : log.user.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-900 leading-tight">{log.user}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{log.device}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><code className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">{log.ip}</code></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Globe size={13} className="text-slate-300" />
                                            <span className="text-[12px] font-medium">{log.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><p className="text-[12px] font-bold text-slate-500 whitespace-nowrap">{log.time}</p></TableCell>
                                    <TableCell>
                                        <Badge className={`border-none h-5 px-2 text-[9px] font-black uppercase ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : log.status === 'Suspicious' ? 'bg-rose-50 text-rose-600' : 'bg-rose-100 text-rose-800'}`}>
                                            {log.status === 'Suspicious' ? <ShieldAlert size={10} className="mr-1" /> : null}
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredLogs.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 grayscale opacity-40">
                            <History size={48} className="text-slate-200 mb-4" />
                            <p className="text-[14px] font-black text-slate-400 uppercase tracking-widest">No Logs Found</p>
                        </div>
                    )}
                </Card>

            </div>

            {/* Lockdown Modal */}
            {showLockdownModal && (
                <div className="fixed inset-0 z-50 bg-rose-950/40 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600 ring-8 ring-rose-50"><Lock size={36} /></div>
                            <div>
                                <h2 className="text-[20px] font-black text-slate-900 uppercase">Emergency Lockdown?</h2>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-4">
                                    This will immediately terminate all sessions, disable public APIs, and restrict access to pre-authorized Super Admin IPs only.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button onClick={handleLockdown} className="h-12 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl border-none uppercase tracking-widest shadow-lg shadow-rose-200">
                                Confirm System Lockdown
                            </Button>
                            <Button variant="link" onClick={() => setShowLockdownModal(false)} className="h-10 text-[11px] font-black uppercase text-slate-400">
                                Abort Mission
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
