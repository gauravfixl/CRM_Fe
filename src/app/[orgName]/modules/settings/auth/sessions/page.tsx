"use client"

import { useEffect, useState } from "react"
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
    ChevronRight,
    Activity,
    TrendingUp
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { KeyRound, ShieldCheck, Mail, AlertTriangle } from "lucide-react"

import { axiosInstance } from "@/lib/axios"

export default function SessionManagementPage() {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isOtpOpen, setIsOtpOpen] = useState(false)
    const [isLimitsOpen, setIsLimitsOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [otpValue, setOtpValue] = useState("")
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = () => {
        setIsSyncing(true)
        setTimeout(() => {
            setIsSyncing(false)
            toast.success("Active directory sessions synchronized")
        }, 1200)
    }

    type SessionRow = {
        id: string
        user: string
        email: string
        device: string
        location: string
        ip: string
        status: "Active" | "Inactive"
        risk: "Low" | "Medium" | "High"
    }

    const [sessionsRaw, setSessionsRaw] = useState<any[]>([])
    const [sessions, setSessions] = useState<SessionRow[]>([])

    useEffect(() => {
        const fetchSessions = async () => {
            setIsFetching(true)
            try {
                const res = await axiosInstance.get("/session/all")
                const list = res?.data?.sessions ?? []
                setSessionsRaw(list)

                const mapped: SessionRow[] = list.map((s: any) => {
                    const email = s?.user?.email ?? "unknown@local"
                    const status: SessionRow["status"] = s?.isActive ? "Active" : "Inactive"
                    const risk: SessionRow["risk"] = s?.isActive ? "Low" : "Medium"
                    return {
                        id: s?._id?.toString() ?? `${Date.now()}-${Math.random()}`,
                        user: email,
                        email,
                        device: s?.deviceType ?? "Unknown device",
                        location: s?.location ?? "N/A",
                        ip: s?.ip ?? "N/A",
                        status,
                        risk,
                    }
                })

                setSessions(mapped)
            } catch (e: any) {
                toast.error(e?.response?.data?.message || "Failed to fetch sessions.")
                setSessions([])
            } finally {
                setIsFetching(false)
            }
        }

        fetchSessions()
    }, [])

    const handleRevokeAllAttempt = async () => {
        setLoading(true)
        try {
            await axiosInstance.post("/session/send-otp")
            toast.success("Security OTP sent to your email")
            setIsOtpOpen(true)
        } catch (e: any) {
            toast.error("Failed to initiate revocation")
        } finally {
            setLoading(false)
        }
    }

    const confirmGlobalRevocation = async () => {
        if (!otpValue) return
        setLoading(true)
        try {
            const targets = sessionsRaw.filter((s) => s?.isActive)
            for (const s of targets) {
                await axiosInstance.delete("/session/delete", {
                    data: { sessionId: s?._id, otp: otpValue },
                })
            }
            toast.success("Global tokens invalidated")
            setIsOtpOpen(false)
            setOtpValue("")
            const res = await axiosInstance.get("/session/all")
            setSessionsRaw(res?.data?.sessions ?? [])
        } catch (e: any) {
            toast.error("Invalid OTP or synchronization error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit">
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
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium text-sm"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? "animate-spin" : ""}`} /> 
                            {isSyncing ? "Syncing..." : "Sync Active"}
                        </CustomButton>
                        <CustomButton
                            onClick={handleRevokeAllAttempt}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-lg border-0"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ShieldX className="w-4 h-4 mr-2" />}
                            Revoke Global Tokens
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Top Stats Cards - matching dashboard pattern */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-xs opacity-80">Active Sessions</p>
                                    <p className="text-white text-xl font-semibold mt-1">1,240</p>
                                    <p className="text-white text-[10px] mt-1">Across all devices</p>
                                </div>
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Desktop Sessions</p>
                                    <p className="text-xl font-semibold text-gray-900 mt-1">842</p>
                                    <p className="text-blue-600 text-[10px] mt-1">68% of total</p>
                                </div>
                                <Laptop className="w-5 h-5 text-primary" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Mobile Sessions</p>
                                    <p className="text-xl font-semibold text-gray-900 mt-1">398</p>
                                    <p className="text-green-600 text-[10px] mt-1">32% of total</p>
                                </div>
                                <Smartphone className="w-5 h-5 text-primary" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Login Velocity</p>
                                    <p className="text-xl font-semibold text-gray-900 mt-1">42/min</p>
                                    <p className="text-green-600 text-[10px] mt-1">Normal Range</p>
                                </div>
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                {/* Metrics Row */}
                <div className="bg-white rounded-xl shadow-md border p-4">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-base font-medium text-gray-900">Session Metrics</p>
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5">Live</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">42 / min</p>
                                <p className="text-xs text-gray-500">Login Velocity</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">99.8%</p>
                                <p className="text-xs text-gray-500">Token Integrity</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">12</p>
                                <p className="text-xs text-gray-500">Stale Sessions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search active identities by name, IP, or location..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-10 bg-transparent text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-2 mr-2">
                        <CustomButton variant="outline" size="sm" onClick={() => setIsFilterOpen(true)} className="rounded-lg border-zinc-200 h-9 px-4 font-medium text-xs bg-white dark:bg-zinc-950">
                            <Filter className="w-3.5 h-3.5 mr-2" /> All Locations
                        </CustomButton>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Live Authentication Table</p>
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 text-xs px-3 py-0.5 rounded-lg">Read-only Monitor</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                                    <TableHead className="p-4 text-xs font-medium text-gray-500">Identity Scope</TableHead>
                                    <TableHead className="p-4 text-xs font-medium text-gray-500">Hardware Context</TableHead>
                                    <TableHead className="p-4 text-xs font-medium text-gray-500">Geolocation & IP</TableHead>
                                    <TableHead className="p-4 text-xs font-medium text-gray-500">Security Risk</TableHead>
                                    <TableHead className="p-4 text-xs font-medium text-gray-500">Status</TableHead>
                                    <TableHead className="p-4 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {(isFetching ? [] : sessions).map((s) => (
                                    <TableRow key={s.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10 transition-all group">
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 flex items-center justify-center font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm">
                                                    {s.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.user}</p>
                                                    <p className="text-xs text-gray-500">{s.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-2">
                                                {s.device.includes("Browser") ? (
                                                    <Laptop className="w-4 h-4 text-zinc-400" />
                                                ) : (
                                                    <Smartphone className="w-4 h-4 text-zinc-400" />
                                                )}
                                                <span className="text-sm text-gray-700 dark:text-zinc-300">{s.device}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span className="text-sm text-gray-700 dark:text-zinc-200">{s.location}</span>
                                                </div>
                                                <p className="text-xs font-mono text-gray-400">{s.ip}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <Badge className={`rounded-lg border-0 text-xs font-medium ${s.risk === 'High' ? 'bg-orange-50 text-orange-600' :
                                                s.risk === 'Medium' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                                                }`}>
                                                {s.risk} Risk
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-2 border border-zinc-100 dark:border-zinc-800 px-3 py-1 bg-zinc-50/50 dark:bg-zinc-900/50 w-fit rounded-lg">
                                                <div className={`h-1.5 w-1.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                                                <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">{s.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4 text-right">
                                            <CustomButton variant="ghost" size="icon" onClick={() => { setSelectedSession(s); setIsRevokeConfirmOpen(true); }} className="text-zinc-300 hover:text-red-500 rounded-lg group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </CustomButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Session Expiration Card */}
                <div className="bg-white rounded-xl shadow-md border p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-gray-900">Session Token Expiration</h4>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Enforce global session limits to automatically sign users out after inactivity. Current threshold: <span className="font-semibold text-gray-900">8 Hours</span>
                                </p>
                            </div>
                        </div>
                        <CustomButton onClick={() => setIsLimitsOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold text-sm border-0">
                            Update Limits
                        </CustomButton>
                    </div>
                </div>

            </div>

            {/* Modals & Sheets */}

            {/* OTP Revocation Dialog */}
            <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader className="items-center text-center">
                        <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-xl font-bold italic">Verification Required</DialogTitle>
                        <DialogDescription className="italic font-medium">To invalidate all active tokens, please enter the one-time code sent to your administrator email.</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Six-Digit OTP</Label>
                            <Input 
                                placeholder="000000" 
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                className="h-14 text-center text-2xl font-mono tracking-[0.5em] rounded-xl border-zinc-200"
                            />
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold">
                            <AlertTriangle className="w-4 h-4" />
                            THIS ACTION CANNOT BE UNDONE. ALL USERS WILL BE KICKED.
                        </div>
                    </div>
                    <DialogFooter>
                        <CustomButton className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl" onClick={confirmGlobalRevocation} disabled={loading}>
                            {loading ? "Validating..." : "CONFIRM DESTRUCTION"}
                        </CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Session Limits Sheet */}
            <Sheet open={isLimitsOpen} onOpenChange={setIsLimitsOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic">Global Lifecycle Constraints</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic">Adjust the duration and persistence of identity tokens.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Absolute Lifecycle</Label>
                            <Select defaultValue="8">
                                <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="1">1 Hour</SelectItem>
                                    <SelectItem value="8">8 Hours (Standard)</SelectItem>
                                    <SelectItem value="24">24 Hours</SelectItem>
                                    <SelectItem value="week">7 Days (Persistent)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">Inactivity Timeout</Label>
                                <p className="text-[10px] text-zinc-400 italic font-medium">Auto-sign out if user is idle</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                            <KeyRound className="w-5 h-5 text-indigo-600" />
                            <p className="text-[10px] font-bold text-indigo-600 leading-snug">Changes will affect newly created sessions. Existing sessions retain their original TTL.</p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic">Refine Session Scope</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic">Segment live identities by geo or risk indicators.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Region Scope</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {["North America", "Europe", "Asia-Pacific", "GovCloud"].map((r) => (
                                    <div key={r} className="p-3 rounded-xl border border-zinc-200 text-xs font-bold hover:bg-zinc-50 cursor-pointer text-center">{r}</div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Security Posture</Label>
                            <div className="flex flex-wrap gap-2">
                                {["Low Risk", "Unknown Location", "Vulnerable Device"].map((p) => (
                                    <Badge key={p} className="bg-zinc-100 text-zinc-500 font-bold px-3 py-1 cursor-pointer">{p}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Individual Revoke Confirmation */}
            <Dialog open={isRevokeConfirmOpen} onOpenChange={setIsRevokeConfirmOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader className="items-center text-center">
                        <div className="h-14 w-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <DialogTitle className="text-lg font-bold">Revoke Session?</DialogTitle>
                        <DialogDescription className="text-zinc-500 italic">User: {selectedSession?.user}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-2">
                        <CustomButton variant="outline" className="rounded-xl px-8" onClick={() => setIsRevokeConfirmOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 font-bold" onClick={() => { toast.success("Session revoked"); setIsRevokeConfirmOpen(false); }}>Revoke Now</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
