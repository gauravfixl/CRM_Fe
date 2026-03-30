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

import { axiosInstance } from "@/lib/axios"

export default function SessionManagementPage() {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

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

    const handleRevokeAll = async () => {
        setLoading(true)
        try {
            const send = await axiosInstance.post("/session/send-otp")
            toast.success(send?.data?.message || "OTP sent. Please enter OTP to revoke sessions.")

            const otp = window.prompt("Enter OTP (sent to your email) to revoke sessions:")
            if (!otp) {
                toast.error("OTP required to revoke sessions.")
                return
            }

            const targets = sessionsRaw.filter((s) => s?.isActive)
            if (!targets.length) {
                toast.info("No active sessions found to revoke.")
                return
            }

            for (const s of targets) {
                await axiosInstance.delete("/session/delete", {
                    data: { sessionId: s?._id, otp },
                })
            }

            toast.success("Active sessions revoked successfully.")
            const res = await axiosInstance.get("/session/all")
            const list = res?.data?.sessions ?? []
            setSessionsRaw(list)
            setSessions(
                list.map((s: any) => {
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
            )
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to revoke sessions.")
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
                            onClick={() => toast.info("Directory sync triggered")}
                            className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium text-sm"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync Active
                        </CustomButton>
                        <CustomButton
                            onClick={handleRevokeAll}
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
                        <CustomButton variant="outline" size="sm" onClick={() => toast.info("Filtering by location")} className="rounded-lg border-zinc-200 h-9 px-4 font-medium text-xs bg-white dark:bg-zinc-950">
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
                                            <CustomButton variant="ghost" size="icon" onClick={() => toast.info("Revoking session...")} className="text-zinc-300 hover:text-red-500 rounded-lg group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-all">
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
                        <CustomButton onClick={() => toast.info("Opening session limit settings")} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold text-sm border-0">
                            Update Limits
                        </CustomButton>
                    </div>
                </div>

            </div>
        </div>
    )
}
