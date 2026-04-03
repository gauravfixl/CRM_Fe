"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Users,
    Building2,
    UserCircle,
    Award,
    Clock,
    Lock,
    ArrowRight,
    Activity,
    AlertCircle,
    MoreHorizontal,
    FileText,
    ShieldCheck,
    Loader2,
    RefreshCw,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import {
    getAllDepartments,
    getAllPositions,
    getActiveLeaveTypes,
    getActiveShifts,
    getActiveAttendancePolicy,
} from "@/modules/hrm/hooks/hrmHooks"

interface GovStats {
    departments: number
    positions: number
    leaveTypes: number
    shifts: number
    attendancePolicyActive: boolean
}

interface ComplianceItem {
    task: string
    status: "Active" | "Pending" | "Overdue"
    risk: "Low" | "Medium" | "High" | "Critical"
    check: () => Promise<boolean>
}

export default function HRMGovernancePage() {
    const router = useRouter()
    const params = useParams()
    const orgName = params.orgName as string

    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<GovStats>({
        departments: 0,
        positions: 0,
        leaveTypes: 0,
        shifts: 0,
        attendancePolicyActive: false,
    })
    const [complianceChecks, setComplianceChecks] = useState<
        { task: string; status: "Active" | "Pending" | "Overdue"; risk: "Low" | "Medium" | "High" | "Critical" }[]
    >([])
    const [recentLogs, setRecentLogs] = useState<{ user: string; action: string; time: string }[]>([])

    const basePath = `/${orgName}/modules/settings/entitlements/hrm`

    // Fetch real data from backend
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            try {
                const [deptRes, posRes, leaveRes, shiftRes, attendRes] = await Promise.allSettled([
                    getAllDepartments(),
                    getAllPositions(),
                    getActiveLeaveTypes(),
                    getActiveShifts(),
                    getActiveAttendancePolicy(),
                ])

                const deptCount = deptRes.status === "fulfilled" ? (deptRes.value?.data?.departments?.length || 0) : 0
                const posCount = posRes.status === "fulfilled" ? (posRes.value?.data?.positions?.length || 0) : 0
                const leaveCount = leaveRes.status === "fulfilled" ? (leaveRes.value?.data?.data?.length || 0) : 0
                const shiftCount = shiftRes.status === "fulfilled" ? (shiftRes.value?.data?.data?.length || 0) : 0
                const attendActive = attendRes.status === "fulfilled" && !!attendRes.value?.data?.data

                setStats({
                    departments: deptCount,
                    positions: posCount,
                    leaveTypes: leaveCount,
                    shifts: shiftCount,
                    attendancePolicyActive: attendActive,
                })

                // Build compliance checks from real data
                const checks: typeof complianceChecks = []

                checks.push({
                    task: "Department Structure Configured",
                    status: deptCount > 0 ? "Active" : "Pending",
                    risk: deptCount > 0 ? "Low" : "High",
                })
                checks.push({
                    task: "Job Roles Defined",
                    status: posCount > 0 ? "Active" : "Pending",
                    risk: posCount > 0 ? "Low" : "Medium",
                })
                checks.push({
                    task: "Leave Policies Configured",
                    status: leaveCount > 0 ? "Active" : "Overdue",
                    risk: leaveCount > 0 ? "Low" : "Critical",
                })
                checks.push({
                    task: "Shift Rules Defined",
                    status: shiftCount > 0 ? "Active" : "Pending",
                    risk: shiftCount > 0 ? "Low" : "Medium",
                })
                checks.push({
                    task: "Attendance Policy Active",
                    status: attendActive ? "Active" : "Overdue",
                    risk: attendActive ? "Low" : "High",
                })

                setComplianceChecks(checks)

                // Build recent logs from what was fetched
                const logs: typeof recentLogs = []
                if (deptCount > 0) logs.push({ user: "System", action: `${deptCount} departments loaded`, time: "Just now" })
                if (leaveCount > 0) logs.push({ user: "System", action: `${leaveCount} leave policies active`, time: "Just now" })
                if (shiftCount > 0) logs.push({ user: "System", action: `${shiftCount} shifts configured`, time: "Just now" })
                if (attendActive) logs.push({ user: "System", action: "Attendance policy active", time: "Just now" })
                setRecentLogs(logs)
            } catch (err) {
                toast.error("Failed to fetch governance data")
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    const activeChecks = complianceChecks.filter((c) => c.status === "Active").length
    const totalChecks = complianceChecks.length
    const complianceRate = totalChecks > 0 ? Math.round((activeChecks / totalChecks) * 100) : 0
    const pendingCount = complianceChecks.filter((c) => c.status === "Pending" || c.status === "Overdue").length
    const criticalCount = complianceChecks.filter((c) => c.risk === "Critical" || c.risk === "High").length

    const handleExportAudit = () => {
        const csv = [
            "Task,Status,Risk Level",
            ...complianceChecks.map((c) => `${c.task},${c.status},${c.risk}`),
        ].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "hrm-governance-audit.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Governance audit exported as CSV")
    }

    const navigateTo = (path: string) => {
        router.push(`${basePath}/${path}`)
    }

    if (loading) {
        return (
            <div className="font-outfit flex items-center justify-center min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-outfit">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900 leading-none">HRM Governance</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium">Monitor workforce health, institutional compliance, and policy standards.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 rounded-xl text-xs font-semibold border-slate-200" onClick={handleExportAudit}>
                        Export Audit
                    </Button>
                    <Button
                        className="h-9 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                            setLoading(true)
                            setTimeout(() => window.location.reload(), 100)
                        }}
                    >
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Compliance Rate</p>
                                <p className="text-white text-xl font-semibold mt-1">{complianceRate}%</p>
                                <Progress value={complianceRate} className="h-1 mt-2 bg-blue-400 [&>div]:bg-white" />
                            </div>
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Pending Setup</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{pendingCount}</p>
                                <p className="text-blue-500 text-[10px] mt-1">{pendingCount > 0 ? "Action required" : "All configured"}</p>
                            </div>
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Policies</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.leaveTypes + (stats.attendancePolicyActive ? 1 : 0)}</p>
                                <p className="text-green-600 text-[10px] mt-1">{stats.leaveTypes} leave + {stats.attendancePolicyActive ? "1" : "0"} attendance</p>
                            </div>
                            <FileText className="w-5 h-5 text-green-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Risk Items</p>
                                <p className={`text-xl font-semibold mt-1 ${criticalCount > 0 ? "text-rose-500" : "text-gray-900"}`}>{criticalCount > 0 ? `0${criticalCount}` : "00"}</p>
                                <p className={`text-[10px] mt-1 ${criticalCount > 0 ? "text-rose-500" : "text-green-600"}`}>
                                    {criticalCount > 0 ? "Requires action" : "All clear"}
                                </p>
                            </div>
                            <AlertCircle className={`w-5 h-5 ${criticalCount > 0 ? "text-rose-500" : "text-green-500"}`} />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Governance Compliance Checklist</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time status of HR configuration items.</p>
                        </div>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-xs font-semibold text-slate-500 px-5">Standard Task</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500">Risk Level</TableHead>
                                    <TableHead className="text-right px-5"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {complianceChecks.map((item, idx) => {
                                    const routeMap: Record<string, string> = {
                                        "Department Structure Configured": "departments",
                                        "Job Roles Defined": "roles",
                                        "Leave Policies Configured": "leaves",
                                        "Shift Rules Defined": "hours",
                                        "Attendance Policy Active": "attendance",
                                    }
                                    return (
                                        <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {item.status === "Active" ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                                    )}
                                                    <p className="text-sm font-semibold text-slate-700">{item.task}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`rounded-full text-xs font-medium px-3 py-0.5 ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none' :
                                                        item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-none' :
                                                            'bg-rose-50 text-rose-600 border-none'
                                                    }`}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.risk === 'Low' ? 'bg-emerald-500' :
                                                            item.risk === 'Medium' ? 'bg-amber-500' :
                                                                'bg-rose-500'
                                                        }`} />
                                                    <span className="text-xs text-slate-500 font-medium">{item.risk}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right px-5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs text-blue-600 font-semibold hover:bg-blue-50/50"
                                                    onClick={() => navigateTo(routeMap[item.task] || "")}
                                                >
                                                    {item.status === "Active" ? "View" : "Configure"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-500" /> HR Access Control
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Role Management", path: "role-management" },
                                { label: "Permission Matrix", path: "permission-matrix" },
                                { label: "HR Permissions", path: "permissions" },
                            ].map((item) => (
                                <div
                                    key={item.path}
                                    className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                                    onClick={() => navigateTo(item.path)}
                                >
                                    <span className="text-xs font-medium text-slate-600 group-hover:text-blue-600">{item.label}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" /> System Status
                        </h3>
                        <div className="space-y-4">
                            {recentLogs.length > 0 ? (
                                recentLogs.map((log, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-700 leading-tight">{log.action}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{log.user} - {log.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400">No recent activity</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section — Navigable Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
                {[
                    { title: "Departments", icon: Building2, count: String(stats.departments).padStart(2, "0"), path: "departments" },
                    { title: "Job Roles", icon: UserCircle, count: String(stats.positions).padStart(2, "0"), path: "roles" },
                    { title: "Leave Policies", icon: Award, count: String(stats.leaveTypes).padStart(2, "0"), path: "leaves" },
                    { title: "Shift Rules", icon: Clock, count: String(stats.shifts).padStart(2, "0"), path: "hours" },
                ].map((std, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => navigateTo(std.path)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <std.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{std.title}</p>
                                <p className="text-xl font-semibold text-slate-900 leading-tight">{std.count}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                ))}
            </div>
        </div>
    )
}
