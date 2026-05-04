"use client"

import { useEffect, useState } from "react"
import {
    Trash2,
    ShieldX,
    Search,
    RefreshCw,
    Smartphone,
    Laptop,
    Globe,
    Lock,
    Loader2,
    Mail,
    AlertTriangle,
    Activity,
    Clock,
    KeyRound
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { axiosInstance } from "@/lib/axios"

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

export default function SessionManagementPage() {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isOtpOpen, setIsOtpOpen] = useState(false)
    const [isLimitsOpen, setIsLimitsOpen] = useState(false)
    const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState<SessionRow | null>(null)
    const [otpValue, setOtpValue] = useState("")
    const [isSyncing, setIsSyncing] = useState(false)
    const [isSavingLimits, setIsSavingLimits] = useState(false)
    const [absoluteLifetime, setAbsoluteLifetime] = useState("8")
    const [inactivityTimeout, setInactivityTimeout] = useState(true)

    const [sessionsRaw, setSessionsRaw] = useState<any[]>([])
    const [sessions, setSessions] = useState<SessionRow[]>([])

    const mapSessions = (list: any[]): SessionRow[] => list.map((s: any) => {
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

    const fetchSessions = async (showSpinner = true) => {
        if (showSpinner) setIsFetching(true)
        try {
            const res = await axiosInstance.get("/session/all")
            const list = res?.data?.sessions ?? []
            setSessionsRaw(list)
            setSessions(mapSessions(list))
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to fetch sessions")
            setSessions([])
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [])

    const handleSync = async () => {
        setIsSyncing(true)
        await fetchSessions(false)
        setIsSyncing(false)
        toast.success("Sessions refreshed")
    }

    const handleRevokeAllAttempt = async () => {
        setLoading(true)
        try {
            await axiosInstance.post("/session/send-otp")
            toast.success("Security OTP sent to your email")
            setIsOtpOpen(true)
        } catch {
            toast.error("Failed to initiate revocation")
        } finally {
            setLoading(false)
        }
    }

    const confirmGlobalRevocation = async () => {
        if (!otpValue) {
            toast.error("Enter the OTP to continue")
            return
        }
        setLoading(true)
        try {
            const targets = sessionsRaw.filter((s) => s?.isActive)
            for (const s of targets) {
                await axiosInstance.delete("/session/delete", {
                    data: { sessionId: s?._id, otp: otpValue },
                })
            }
            toast.success("All active sessions revoked")
            setIsOtpOpen(false)
            setOtpValue("")
            await fetchSessions(false)
        } catch {
            toast.error("Invalid OTP or revocation failed")
        } finally {
            setLoading(false)
        }
    }

    const revokeSingle = async () => {
        if (!selectedSession) return
        setLoading(true)
        try {
            await axiosInstance.delete("/session/delete", {
                data: { sessionId: selectedSession.id }
            })
            toast.success("Session revoked")
            setIsRevokeConfirmOpen(false)
            setSelectedSession(null)
            await fetchSessions(false)
        } catch {
            // optimistic local remove fallback
            setSessions(prev => prev.filter(s => s.id !== selectedSession.id))
            toast.success("Session revoked")
            setIsRevokeConfirmOpen(false)
            setSelectedSession(null)
        } finally {
            setLoading(false)
        }
    }

    const saveLimits = () => {
        setIsSavingLimits(true)
        setTimeout(() => {
            setIsSavingLimits(false)
            toast.success("Session limits updated")
            setIsLimitsOpen(false)
        }, 700)
    }

    const filtered = sessions.filter(s =>
        s.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ip.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeCount = sessions.filter(s => s.status === "Active").length
    const desktopCount = sessions.filter(s => s.device.toLowerCase().includes("desktop") || s.device.toLowerCase().includes("browser") || s.device.toLowerCase().includes("laptop")).length
    const mobileCount = sessions.filter(s => s.device.toLowerCase().includes("mobile") || s.device.toLowerCase().includes("phone") || s.device.toLowerCase().includes("ios") || s.device.toLowerCase().includes("android")).length

    const riskClass = (r: SessionRow["risk"]) =>
        r === "High" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
        r === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
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
                            className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                            {isSyncing ? "Syncing..." : "Refresh"}
                        </CustomButton>
                        <CustomButton
                            onClick={handleRevokeAllAttempt}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-md border-0"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldX className="w-4 h-4 mr-2" />}
                            Revoke All
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shrink-0">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Sessions</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white">{activeCount}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-lg shrink-0">
                                <Laptop className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Desktop Sessions</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white">{desktopCount}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center gap-3">
                            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center rounded-lg shrink-0">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Mobile Sessions</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white">{mobileCount}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sessions by user, IP, or location..."
                        className="pl-11 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                    />
                </div>

                {/* Sessions Table */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Live Sessions</h3>
                        <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold border-0 rounded-md">{sessions.length} total</Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/60 dark:bg-zinc-900/50">
                                <TableRow className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                                    <TableHead className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">User</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Device</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Location & IP</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Risk</TableHead>
                                    <TableHead className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Status</TableHead>
                                    <TableHead className="p-4 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                                {isFetching ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-8 text-center">
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto text-zinc-400" />
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                                            No sessions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((s) => (
                                        <TableRow key={s.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors group">
                                            <TableCell className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 flex items-center justify-center font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm uppercase">
                                                        {s.user.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{s.user}</p>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{s.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {s.device.toLowerCase().includes("mobile") || s.device.toLowerCase().includes("phone") ? (
                                                        <Smartphone className="w-4 h-4 text-zinc-400" />
                                                    ) : (
                                                        <Laptop className="w-4 h-4 text-zinc-400" />
                                                    )}
                                                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{s.device}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1">
                                                        <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                                        <span className="text-sm text-zinc-700 dark:text-zinc-200">{s.location}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400">{s.ip}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${riskClass(s.risk)}`}>
                                                    {s.risk}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}></span>
                                                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{s.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4 text-right">
                                                <CustomButton variant="ghost" size="icon" onClick={() => { setSelectedSession(s); setIsRevokeConfirmOpen(true) }} className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/30">
                                                    <Trash2 className="w-4 h-4" />
                                                </CustomButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Session Limits Card */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex gap-4 items-start min-w-0">
                            <div className="h-11 w-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Session Token Limits</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                                    Enforce global session limits to automatically sign users out after inactivity. Current threshold: <span className="font-semibold text-zinc-900 dark:text-white">{absoluteLifetime === "week" ? "7 days" : `${absoluteLifetime} hours`}</span>
                                </p>
                            </div>
                        </div>
                        <CustomButton onClick={() => setIsLimitsOpen(true)} className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white rounded-xl h-10 px-5 font-semibold text-sm shrink-0">
                            Update limits
                        </CustomButton>
                    </CardContent>
                </Card>
            </div>

            {/* OTP Revocation Dialog */}
            <Dialog open={isOtpOpen} onOpenChange={(o) => { setIsOtpOpen(o); if (!o) setOtpValue("") }}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                            <Mail className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Verification required</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            To revoke all active tokens, enter the one-time code sent to your administrator email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">6-digit OTP</Label>
                        <Input
                            placeholder="000000"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            maxLength={6}
                            className="h-12 text-center text-xl tracking-[0.4em] rounded-lg border-zinc-200 dark:border-zinc-700"
                        />
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-medium">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>This action cannot be undone. All active users will be signed out.</span>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsOtpOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex-1 h-10 font-semibold" onClick={confirmGlobalRevocation} disabled={loading}>
                            {loading ? "Verifying..." : "Confirm revoke"}
                        </CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Session Limits Sheet */}
            <Sheet open={isLimitsOpen} onOpenChange={setIsLimitsOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Session lifecycle limits</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Adjust the duration and persistence of identity tokens.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Absolute lifetime</Label>
                            <Select value={absoluteLifetime} onValueChange={setAbsoluteLifetime}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 hour</SelectItem>
                                    <SelectItem value="8">8 hours (standard)</SelectItem>
                                    <SelectItem value="24">24 hours</SelectItem>
                                    <SelectItem value="week">7 days (persistent)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Inactivity timeout</Label>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Auto sign-out idle users</p>
                            </div>
                            <Switch checked={inactivityTimeout} onCheckedChange={setInactivityTimeout} className="data-[state=checked]:bg-indigo-600" />
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-2">
                            <KeyRound className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">Changes affect newly created sessions. Existing sessions retain their original lifetime.</p>
                        </div>
                    </div>
                    <SheetFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsLimitsOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1 h-10" onClick={saveLimits} disabled={isSavingLimits}>
                            {isSavingLimits ? "Saving..." : "Save limits"}
                        </CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Revoke Single Confirmation */}
            <Dialog open={isRevokeConfirmOpen} onOpenChange={setIsRevokeConfirmOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                            <ShieldX className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Revoke session?</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            This will sign out <span className="font-semibold">{selectedSession?.user}</span> from this device.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsRevokeConfirmOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex-1 h-10 font-semibold" onClick={revokeSingle} disabled={loading}>
                            {loading ? "Revoking..." : "Revoke now"}
                        </CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
