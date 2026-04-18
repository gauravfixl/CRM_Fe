"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Wallet,
    Users,
    Scale,
    ShieldCheck,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    Info,
    Download,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Activity,
    FileText,
    Landmark,
    Building2,
    Gift,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Receipt,
    Layers,
    Banknote,
    ArrowRight,
    Bell,
    CalendarClock,
    DollarSign,
    Briefcase,
    PieChart,
    BarChart3,
    Zap,
    FilePlus,
    Mail,
    Star,
    Eye,
    Play,
    FileCheck2,
    CircleDollarSign,
    Settings,
    Pin,
    PinOff,
    Plus,
    Edit,
    Trash2,
    X,
    LayoutDashboard,
    GripVertical,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    usePayrollStore,
    calculateEmployeeNet,
    type DashboardWidget,
    type DashboardAlert,
    type QuickAction,
    type DashboardWidgetType,
} from "@/shared/data/payroll-store"
import { useSalaryStore } from "@/shared/data/salary-store"
import { useStatutoryStore } from "@/shared/data/statutory-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`
const formatINRShort = (amt: number) => {
    const abs = Math.abs(amt || 0)
    if (abs >= 10000000) return `₹${(amt / 10000000).toFixed(2)}Cr`
    if (abs >= 100000) return `₹${(amt / 100000).toFixed(2)}L`
    if (abs >= 1000) return `₹${(amt / 1000).toFixed(1)}K`
    return `₹${Math.round(amt).toLocaleString("en-IN")}`
}

const PayrollDashboard = () => {
    const router = useRouter()
    const { toast } = useToast()

    // ── All stores ─────────────────────────────────────────
    const {
        payRuns,
        payrollEmployees,
        payslips,
        claims,
        declarations,
        proofs,
        reimbursementCategories,
        bankAccounts,
        payrollCycle,
        scheduledReports,
        settingsAuditLog,
        statutorySettings,
        salaryComponents,
        dashboardWidgets,
        dashboardAlerts,
        quickActions,
        toggleDashboardWidget,
        reorderDashboardWidgets,
        resizeDashboardWidget,
        resetDashboardLayout,
        dismissDashboardAlert,
        markAlertActioned,
        clearDismissedAlerts,
        addQuickAction,
        updateQuickAction,
        deleteQuickAction,
        toggleQuickActionPin,
    } = usePayrollStore()

    const {
        templates,
        loans,
        revisions,
        entities,
        locations,
        entityPayrollStatus,
    } = useSalaryStore()

    const {
        complianceEvents,
        activityLogs,
        monthlyFilings,
        pfRecords,
        esiRecords,
        ptRecords,
        gratuityRecords,
        form16Records,
    } = useStatutoryStore()

    // ── UI state ───────────────────────────────────────────
    const [selectedRunId, setSelectedRunId] = useState<string>("")
    const [exceptionsOpen, setExceptionsOpen] = useState(false)
    const [allPendingOpen, setAllPendingOpen] = useState(false)

    // Round 2 UI state
    const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "warning" | "info">("all")
    const [alertsManagerOpen, setAlertsManagerOpen] = useState(false)
    const [customizeOpen, setCustomizeOpen] = useState(false)
    const [quickActionsMgrOpen, setQuickActionsMgrOpen] = useState(false)
    const [qaForm, setQaForm] = useState<{
        id?: string
        label: string
        description: string
        icon: string
        href: string
        color: string
    }>({
        label: "",
        description: "",
        icon: "Zap",
        href: "",
        color: "#8B5CF6",
    })

    // ── Active run ─────────────────────────────────────────
    const defaultActive = useMemo(
        () => payRuns.find((r) => r.status === "Draft" || r.status === "Processing") || payRuns[0],
        [payRuns]
    )
    const activeRun = payRuns.find((r) => r.id === selectedRunId) || defaultActive

    // ── Computed metrics ────────────────────────────────────
    const runStats = useMemo(() => {
        if (!activeRun) return null
        const runEmps = payrollEmployees.filter((e) => e.payRunId === activeRun.id)
        const included = runEmps.filter((e) => e.included)
        const approved = included.filter((e) => e.approved)
        let totalPayout = 0, totalGross = 0, totalDeductions = 0
        let totalPF = 0, totalESI = 0, totalPT = 0, totalTDS = 0
        included.forEach((e) => {
            const c = calculateEmployeeNet(e)
            totalPayout += c.netSalary
            totalGross += c.grossEarnings
            totalDeductions += c.totalDeductions
            totalPF += e.pf
            totalESI += e.esi
            totalPT += e.pt
            totalTDS += e.tds
        })
        return {
            runEmps,
            included,
            approved,
            pendingApproval: included.length - approved.length,
            totalPayout,
            totalGross,
            totalDeductions,
            totalPF,
            totalESI,
            totalPT,
            totalTDS,
            avgSalary: included.length ? totalPayout / included.length : 0,
            inclusionPct: runEmps.length ? (included.length / runEmps.length) * 100 : 0,
            approvalPct: included.length ? (approved.length / included.length) * 100 : 0,
        }
    }, [activeRun, payrollEmployees])

    // Previous run for variance
    const prevRun = useMemo(() => {
        if (!activeRun) return null
        const idx = payRuns.findIndex((r) => r.id === activeRun.id)
        return payRuns[idx + 1] ?? null
    }, [activeRun, payRuns])

    const variance = useMemo(() => {
        if (!activeRun || !prevRun || !runStats) return null
        const prevEmps = payrollEmployees.filter((e) => e.payRunId === prevRun.id && e.included)
        const prevTotal = prevEmps.reduce((s, e) => s + calculateEmployeeNet(e).netSalary, 0)
        if (prevTotal === 0) return null
        const delta = runStats.totalPayout - prevTotal
        return { delta, pct: (delta / prevTotal) * 100, prevTotal }
    }, [activeRun, prevRun, runStats, payrollEmployees])

    // Pending actions — aggregate across stores
    const pending = useMemo(() => {
        const pendingClaims = claims.filter((c) => c.status === "Pending")
        const pendingDeclarations = declarations.filter((d) => d.status === "Pending" || d.status === "Submitted")
        const pendingProofs = proofs.filter((p) => p.status === "Pending")
        const pendingLoans = loans.filter((l) => l.status === "Pending")
        const pendingRevisions = revisions.filter((r) => r.status === "Pending")
        const pendingPayslips = payslips.filter((p) => p.status === "Pending" || p.status === "Generated")
        const pendingEmpApprovals = payrollEmployees.filter(
            (e) => e.payRunId === activeRun?.id && e.included && !e.approved
        )
        return {
            claims: pendingClaims,
            declarations: pendingDeclarations,
            proofs: pendingProofs,
            loans: pendingLoans,
            revisions: pendingRevisions,
            payslips: pendingPayslips,
            empApprovals: pendingEmpApprovals,
            totalCount:
                pendingClaims.length +
                pendingDeclarations.length +
                pendingProofs.length +
                pendingLoans.length +
                pendingRevisions.length +
                pendingEmpApprovals.length,
        }
    }, [claims, declarations, proofs, loans, revisions, payslips, payrollEmployees, activeRun])

    // Compliance health score
    const complianceScore = useMemo(() => {
        let score = 100
        if (pending.declarations.length > 0) score -= Math.min(15, pending.declarations.length * 3)
        if (pending.proofs.length > 0) score -= Math.min(10, pending.proofs.length * 2)
        const overdueEvents = complianceEvents.filter((e) => e.status === "Overdue" || e.status === "Due Today")
        score -= overdueEvents.length * 8
        const pendingFilings = monthlyFilings.filter(
            (f) => f.pfStatus === "Pending" || f.esiStatus === "Pending" || f.ptStatus === "Pending" || f.tdsStatus === "Pending"
        ).length
        score -= pendingFilings * 5
        return Math.max(0, Math.round(score))
    }, [pending, complianceEvents, monthlyFilings])

    // Department breakdown
    const deptBreakdown = useMemo(() => {
        if (!runStats) return []
        const map = new Map<string, { name: string; count: number; total: number; color: string }>()
        const palette = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#0EA5E9", "#F43F5E", "#6366F1", "#14B8A6"]
        let colorIdx = 0
        runStats.included.forEach((e) => {
            const existing = map.get(e.dept) ?? { name: e.dept, count: 0, total: 0, color: palette[colorIdx++ % palette.length] }
            existing.count += 1
            existing.total += calculateEmployeeNet(e).netSalary
            map.set(e.dept, existing)
        })
        return Array.from(map.values()).sort((a, b) => b.total - a.total)
    }, [runStats])

    const maxDeptTotal = Math.max(1, ...deptBreakdown.map((d) => d.total))

    // Monthly trend — last 6 runs
    const monthlyTrend = useMemo(() => {
        return payRuns
            .slice(0, 6)
            .reverse()
            .map((r) => {
                const runEmps = payrollEmployees.filter((e) => e.payRunId === r.id && e.included)
                const total = runEmps.reduce((s, e) => s + calculateEmployeeNet(e).netSalary, 0)
                return { month: r.month, total, status: r.status, runId: r.id }
            })
    }, [payRuns, payrollEmployees])

    const maxTrend = Math.max(1, ...monthlyTrend.map((t) => t.total))

    // Entity cost comparison
    const entityStats = useMemo(() => {
        return entities.filter((e) => e.isActive).map((entity) => {
            const latestStatus = entityPayrollStatus
                .filter((s) => s.entityId === entity.id)
                .sort((a, b) => (b.month || "").localeCompare(a.month || ""))[0]
            const entityLocations = locations.filter((l) => l.entityId === entity.id)
            return {
                ...entity,
                empCount: entityLocations.reduce((s, l) => s + l.employeeCount, 0) || entity.employeeCount || 0,
                latestMonth: latestStatus?.month,
                latestCost: latestStatus?.totalCost ?? 0,
                latestStatus: latestStatus?.status,
            }
        })
    }, [entities, entityPayrollStatus, locations])

    // Upcoming compliance events
    const upcomingEvents = useMemo(() => {
        return complianceEvents
            .filter((e) => e.status !== "Completed")
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
    }, [complianceEvents])

    const overdueCount = useMemo(
        () => complianceEvents.filter((e) => e.status === "Overdue" || e.status === "Due Today").length,
        [complianceEvents]
    )

    // Active loans summary
    const activeLoans = loans.filter((l) => l.status === "Active")
    const totalOutstanding = activeLoans.reduce((s, l) => s + l.remainingBalance, 0)
    const totalLoanDisbursed = activeLoans.reduce((s, l) => s + l.principal, 0)

    // Approved revisions — budget impact
    const approvedRevisions = revisions.filter((r) => r.status === "Approved")
    const revisionBudgetImpact = approvedRevisions.reduce((s, r) => s + (r.revisedCTC - r.currentCTC), 0)

    // Scheduled reports
    const activeSchedules = scheduledReports.filter((s) => s.isActive)
    const nextScheduled = activeSchedules
        .slice()
        .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())[0]

    // Recent activity combined (statutory + settings audit)
    const recentActivity = useMemo(() => {
        const combined = [
            ...activityLogs.map((a) => ({ ...a, source: "statutory" as const })),
            ...settingsAuditLog.map((s) => ({
                id: s.id,
                type: "Settings" as const,
                action: s.action,
                description: s.details,
                timestamp: s.timestamp,
                performedBy: s.actor,
                severity: "info" as const,
                source: "settings" as const,
            })),
        ]
        return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)
    }, [activityLogs, settingsAuditLog])

    // Bank summary
    const totalBankBalance = bankAccounts.filter((b) => b.isActive).reduce((s, b) => s + (b.balance ?? 0), 0)
    const primaryBank = bankAccounts.find((b) => b.isPrimary)

    // Reimbursement category util
    const catUtilization = useMemo(() => {
        return reimbursementCategories.filter((c) => c.active).map((cat) => {
            const utilized = claims
                .filter((c) => c.category === cat.name && (c.status === "Approved" || c.status === "Paid"))
                .reduce((s, c) => s + c.amount, 0)
            return { ...cat, utilized, pct: cat.monthlyLimit ? Math.min(100, (utilized / cat.monthlyLimit) * 100) : 0 }
        })
    }, [reimbursementCategories, claims])

    // ── Alerts, widgets, quick actions ─────────────────────
    const activeAlerts = useMemo(
        () => dashboardAlerts.filter((a) => !a.dismissed && !a.actionTaken),
        [dashboardAlerts]
    )
    const filteredAlerts = useMemo(() => {
        if (alertFilter === "all") return activeAlerts
        return activeAlerts.filter((a) => a.severity === alertFilter)
    }, [activeAlerts, alertFilter])

    const pinnedQuickActions = useMemo(
        () => quickActions.filter((q) => q.pinned).sort((a, b) => a.order - b.order),
        [quickActions]
    )
    const allQuickActionsSorted = useMemo(
        () => [...quickActions].sort((a, b) => a.order - b.order),
        [quickActions]
    )

    const enabledWidgets = useMemo(
        () => dashboardWidgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order),
        [dashboardWidgets]
    )
    const sortedWidgetsForMgmt = useMemo(
        () => [...dashboardWidgets].sort((a, b) => a.order - b.order),
        [dashboardWidgets]
    )

    const handleMoveWidget = (id: string, dir: "up" | "down") => {
        const ids = sortedWidgetsForMgmt.map((w) => w.id)
        const idx = ids.indexOf(id)
        if (idx === -1) return
        const swap = dir === "up" ? idx - 1 : idx + 1
        if (swap < 0 || swap >= ids.length) return
        const newIds = [...ids]
        newIds[idx] = ids[swap]
        newIds[swap] = ids[idx]
        reorderDashboardWidgets(newIds)
    }

    const resetQaForm = () =>
        setQaForm({ label: "", description: "", icon: "Zap", href: "", color: "#8B5CF6" })

    const handleSubmitQaForm = () => {
        if (!qaForm.label.trim() || !qaForm.href.trim()) {
            toast({ title: "Label and link are required", variant: "destructive" })
            return
        }
        if (qaForm.id) {
            updateQuickAction(qaForm.id, {
                label: qaForm.label,
                description: qaForm.description,
                icon: qaForm.icon,
                href: qaForm.href,
                color: qaForm.color,
            })
            toast({ title: "Quick action updated" })
        } else {
            addQuickAction({
                label: qaForm.label,
                description: qaForm.description,
                icon: qaForm.icon,
                href: qaForm.href,
                color: qaForm.color,
                pinned: false,
                order: quickActions.length,
            })
            toast({ title: "Quick action added" })
        }
        resetQaForm()
    }

    const daysUntil = (iso?: string) => {
        if (!iso) return null
        const diff = new Date(iso).getTime() - Date.now()
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    // Widget → count/detail mapping (for the compact widgets grid)
    const widgetMeta: Record<
        DashboardWidgetType,
        { icon: any; color: string; value: string; caption: string; href?: string }
    > = {
        PayrollKpi: {
            icon: Wallet,
            color: "#8B5CF6",
            value: formatINRShort(runStats?.totalPayout ?? 0),
            caption: `${runStats?.included.length ?? 0} employees`,
        },
        ComplianceHealth: {
            icon: ShieldCheck,
            color: complianceScore >= 90 ? "#10B981" : complianceScore >= 70 ? "#F59E0B" : "#F43F5E",
            value: `${complianceScore}%`,
            caption: overdueCount > 0 ? `${overdueCount} overdue` : "Healthy",
            href: "/hrmcubicle/payroll/statutory",
        },
        PendingApprovals: {
            icon: CheckCircle2,
            color: "#EC4899",
            value: String(pending.empApprovals.length),
            caption: "Awaiting approval",
            href: "/hrmcubicle/payroll/processing",
        },
        RecentClaims: {
            icon: Receipt,
            color: "#F59E0B",
            value: String(claims.filter((c) => c.status === "Pending").length),
            caption: `${claims.length} total claims`,
            href: "/hrmcubicle/payroll/reimbursements",
        },
        UpcomingFilings: {
            icon: CalendarClock,
            color: "#0EA5E9",
            value: String(upcomingEvents.length),
            caption: "Filings upcoming",
            href: "/hrmcubicle/payroll/statutory",
        },
        HeadcountTrend: {
            icon: Users,
            color: "#6366F1",
            value: String(runStats?.runEmps.length ?? 0),
            caption: `${Math.round(runStats?.inclusionPct ?? 0)}% included`,
        },
        CostTrend: {
            icon: BarChart3,
            color: "#14B8A6",
            value: formatINRShort(runStats?.totalGross ?? 0),
            caption: "Gross earnings",
        },
        TaxSavings: {
            icon: Scale,
            color: "#10B981",
            value: formatINRShort(runStats?.totalTDS ?? 0),
            caption: "TDS this run",
            href: "/hrmcubicle/payroll/tax-declarations",
        },
        StatutoryLiability: {
            icon: Landmark,
            color: "#F43F5E",
            value: formatINRShort(
                (runStats?.totalPF ?? 0) + (runStats?.totalESI ?? 0) + (runStats?.totalPT ?? 0)
            ),
            caption: "PF + ESI + PT",
            href: "/hrmcubicle/payroll/statutory",
        },
        EmployeeHighlights: {
            icon: Star,
            color: "#F59E0B",
            value: String(runStats?.approved.length ?? 0),
            caption: "Approved this cycle",
        },
        MonthlyVariance: {
            icon: TrendingUp,
            color: (variance?.delta ?? 0) >= 0 ? "#10B981" : "#F43F5E",
            value: variance ? `${variance.pct >= 0 ? "+" : ""}${variance.pct.toFixed(1)}%` : "—",
            caption: variance ? `vs ${prevRun?.month?.split(" ")[0] ?? ""}` : "No prior run",
        },
        CalendarMini: {
            icon: Calendar,
            color: "#8B5CF6",
            value: `Day ${payrollCycle.payoutDay}`,
            caption: `Payout • Cycle ${payrollCycle.frequency}`,
        },
    }

    // ── Export aggregate summary ──────────────────────────
    const handleExportSummary = () => {
        if (!activeRun || !runStats) {
            toast({ title: "No data", variant: "destructive" })
            return
        }
        const rows: string[] = []
        rows.push(`Payroll Summary — ${activeRun.month}`)
        rows.push(`Generated at,${new Date().toISOString()}`)
        rows.push("")
        rows.push("Category,Metric,Value")
        rows.push(`Run,Status,${activeRun.status}`)
        rows.push(`Run,Total payout,${Math.round(runStats.totalPayout)}`)
        rows.push(`Run,Gross earnings,${Math.round(runStats.totalGross)}`)
        rows.push(`Run,Total deductions,${Math.round(runStats.totalDeductions)}`)
        rows.push(`Run,Included employees,${runStats.included.length}`)
        rows.push(`Run,Approved employees,${runStats.approved.length}`)
        rows.push(`Statutory,Total PF,${runStats.totalPF}`)
        rows.push(`Statutory,Total ESI,${runStats.totalESI}`)
        rows.push(`Statutory,Total PT,${runStats.totalPT}`)
        rows.push(`Statutory,Total TDS,${runStats.totalTDS}`)
        rows.push(`Pending,Reimbursement claims,${pending.claims.length}`)
        rows.push(`Pending,Tax declarations,${pending.declarations.length}`)
        rows.push(`Pending,Proof submissions,${pending.proofs.length}`)
        rows.push(`Pending,Loan approvals,${pending.loans.length}`)
        rows.push(`Pending,Salary revisions,${pending.revisions.length}`)
        rows.push(`Compliance,Health score,${complianceScore}%`)
        rows.push(`Compliance,Overdue events,${overdueCount}`)
        rows.push(`Structure,Templates,${templates.length}`)
        rows.push(`Structure,Components,${salaryComponents.length}`)
        rows.push(`Entities,Active,${entities.filter((e) => e.isActive).length}`)
        rows.push(`Bank,Active accounts,${bankAccounts.filter((b) => b.isActive).length}`)
        rows.push(`Bank,Total balance,${totalBankBalance}`)
        rows.push(`Loans,Active,${activeLoans.length}`)
        rows.push(`Loans,Total outstanding,${totalOutstanding}`)
        rows.push("")
        rows.push("Department,Employees,Total payout")
        deptBreakdown.forEach((d) => rows.push(`${d.name},${d.count},${Math.round(d.total)}`))

        const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `payroll_dashboard_summary_${activeRun.month.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Summary exported", description: "Full dashboard snapshot CSV downloaded." })
    }

    if (!activeRun || !runStats) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] p-8 font-sans">
                <div className="h-16 w-16 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center text-[#8B5CF6] mb-4">
                    <Activity size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No pay run to display</h2>
                <p className="text-sm text-slate-500 mb-6">Create or select a pay run to see dashboard.</p>
                <Button
                    onClick={() => router.push("/hrmcubicle/payroll/processing")}
                    className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs"
                >
                    Go to Salary Processing <ChevronRight size={14} className="ml-1" />
                </Button>
            </div>
        )
    }

    const runStatusColor =
        activeRun.status === "Draft" ? "bg-slate-100 text-slate-600" :
            activeRun.status === "Processing" ? "bg-blue-50 text-blue-600" :
                activeRun.status === "Approved" ? "bg-amber-50 text-amber-600" :
                    activeRun.status === "Locked" ? "bg-emerald-50 text-emerald-600" :
                        "bg-emerald-100 text-emerald-700"

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* ── Header ──────────────────────────────────── */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Activity size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Payroll Dashboard</h1>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs font-medium text-slate-500">Consolidated overview</span>
                                {pending.totalCount > 0 && (
                                    <>
                                        <span className="text-slate-300">•</span>
                                        <button
                                            onClick={() => setAllPendingOpen(true)}
                                            className="text-[11px] font-bold text-rose-600 hover:underline"
                                        >
                                            {pending.totalCount} action{pending.totalCount > 1 ? "s" : ""} pending
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={activeRun.id} onValueChange={setSelectedRunId}>
                            <SelectTrigger className="h-9 w-40 rounded-lg border-slate-200 bg-white font-semibold text-xs">
                                <Calendar size={13} className="mr-1 text-[#8B5CF6]" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {payRuns.map((r) => (
                                    <SelectItem key={r.id} value={r.id}>
                                        <div className="flex items-center gap-2">
                                            <span>{r.month}</span>
                                            <Badge className={cn("border-none text-[9px] font-bold",
                                                r.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                                                    r.status === "Locked" ? "bg-emerald-50 text-emerald-600" :
                                                        r.status === "Draft" ? "bg-slate-100 text-slate-600" :
                                                            "bg-blue-50 text-blue-600")}>
                                                {r.status}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={handleExportSummary}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export summary</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCustomizeOpen(true)}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Settings size={14} /> <span className="hidden md:inline">Customize</span>
                        </Button>
                        <Button
                            onClick={() => router.push("/hrmcubicle/payroll/processing")}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            <Play size={13} /> <span className="hidden md:inline">Run payroll</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* ── Alert Center ─────────────────── */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                        <Bell size={16} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            Alert center
                                            <Badge className="bg-rose-100 text-rose-700 border-none text-[10px] font-bold">
                                                {dashboardAlerts.filter((a) => !a.dismissed).length}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Critical, warning and info signals across payroll
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Select value={alertFilter} onValueChange={(v) => setAlertFilter(v as any)}>
                                        <SelectTrigger className="h-8 w-32 rounded-lg border-slate-200 bg-white font-semibold text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                            <SelectItem value="warning">Warning</SelectItem>
                                            <SelectItem value="info">Info</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAlertsManagerOpen(true)}
                                        className="h-8 rounded-lg border-slate-200 font-semibold text-xs gap-1.5"
                                    >
                                        <Settings size={12} /> Manage alerts
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 lg:p-5">
                                {filteredAlerts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">All clear</p>
                                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                            No active alerts match this filter.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredAlerts.slice(0, 3).map((a) => (
                                            <AlertRow
                                                key={a.id}
                                                alert={a}
                                                daysUntil={daysUntil(a.dueDate)}
                                                onAction={() => { markAlertActioned(a.id, "You"); toast({ title: "Marked as actioned" }) }}
                                                onDismiss={() => { dismissDashboardAlert(a.id); toast({ title: "Alert dismissed" }) }}
                                                onOpen={() => a.link && router.push(a.link)}
                                            />
                                        ))}
                                        {filteredAlerts.length > 3 && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => setAlertsManagerOpen(true)}
                                                className="w-full h-8 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5"
                                            >
                                                View all {filteredAlerts.length} alerts <ChevronRight size={11} className="ml-0.5" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* ── Quick Actions strip ─────────── */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-[#8B5CF6]" />
                                    <h3 className="text-sm font-bold text-slate-900">Quick actions</h3>
                                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-bold">
                                        {pinnedQuickActions.length} pinned
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setQuickActionsMgrOpen(true)}
                                    className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                >
                                    Manage <ChevronRight size={11} className="ml-0.5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                                {pinnedQuickActions.map((qa) => (
                                    <QuickActionCard key={qa.id} action={qa} onClick={() => router.push(qa.href)} />
                                ))}
                                <button
                                    onClick={() => { resetQaForm(); setQuickActionsMgrOpen(true) }}
                                    className="rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-700 min-h-[96px]"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Plus size={16} />
                                    </div>
                                    <span className="text-[11px] font-semibold">Add quick action</span>
                                </button>
                            </div>
                        </div>

                        {/* ── Hero KPIs ─────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            <HeroKpi
                                label="Total payout"
                                value={formatINRShort(runStats.totalPayout)}
                                icon={Wallet}
                                color="#8B5CF6"
                                trend={variance ? {
                                    direction: variance.delta >= 0 ? "up" : "down",
                                    value: `${variance.pct >= 0 ? "+" : ""}${variance.pct.toFixed(1)}% vs ${prevRun?.month?.split(" ")[0] ?? ""}`,
                                } : undefined}
                            />
                            <HeroKpi
                                label="Employees"
                                value={`${runStats.included.length}/${runStats.runEmps.length}`}
                                caption={`${Math.round(runStats.inclusionPct)}% included`}
                                icon={Users}
                                color="#0EA5E9"
                            />
                            <HeroKpi
                                label="Avg salary"
                                value={formatINRShort(runStats.avgSalary)}
                                caption="Per employee"
                                icon={CircleDollarSign}
                                color="#10B981"
                            />
                            <HeroKpi
                                label="Deductions"
                                value={formatINRShort(runStats.totalDeductions)}
                                caption={`TDS ${formatINRShort(runStats.totalTDS)}`}
                                icon={TrendingDown}
                                color="#F59E0B"
                            />
                            <HeroKpi
                                label="Compliance"
                                value={`${complianceScore}%`}
                                caption={overdueCount > 0 ? `${overdueCount} overdue` : "Healthy"}
                                icon={ShieldCheck}
                                color={complianceScore >= 90 ? "#10B981" : complianceScore >= 70 ? "#F59E0B" : "#F43F5E"}
                            />
                        </div>

                        {/* ── Active run + Pending actions ─────── */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                            {/* Active run */}
                            <Card className="xl:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="flex-1 p-5 lg:p-6 space-y-4">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                    <Badge className={cn("border-none font-semibold text-[10px] px-2 py-0.5", runStatusColor)}>
                                                        Active cycle • {activeRun.status}
                                                    </Badge>
                                                    <Badge className="bg-slate-50 text-slate-600 border-slate-100 text-[10px] font-semibold">
                                                        Step {activeRun.step + 1} of 4
                                                    </Badge>
                                                </div>
                                                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">{activeRun.month}</h2>
                                                <p className="text-xs font-medium text-slate-500 mt-1">
                                                    {runStats.included.length} employees included • {runStats.approved.length} approved • {runStats.pendingApproval} pending
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total payout</div>
                                                    <div className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(runStats.totalPayout)}</div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gross earnings</div>
                                                    <div className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(runStats.totalGross)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Button
                                                    onClick={() => router.push("/hrmcubicle/payroll/processing")}
                                                    className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none"
                                                >
                                                    <Eye size={13} className="mr-1.5" /> Open pay run
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setExceptionsOpen(true)}
                                                    className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-1.5"
                                                >
                                                    <AlertCircle size={13} /> Exceptions
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => router.push("/hrmcubicle/payroll/payslips")}
                                                    className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-1.5"
                                                >
                                                    <FileText size={13} /> Payslips
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Circular progress */}
                                        <div className="w-full md:w-[280px] bg-gradient-to-br from-slate-50 to-[#8B5CF6]/5 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100">
                                            <div className="relative h-40 w-40 rounded-full flex items-center justify-center">
                                                <div className="text-center z-10">
                                                    <span className="text-3xl font-bold text-[#8B5CF6] tracking-tight">{Math.round(runStats.approvalPct)}%</span>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Approved</div>
                                                </div>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                                                    <motion.circle
                                                        cx="50" cy="50" r="44"
                                                        fill="none"
                                                        stroke="#8B5CF6"
                                                        strokeWidth="6"
                                                        strokeLinecap="round"
                                                        initial={{ strokeDasharray: "0 276" }}
                                                        animate={{ strokeDasharray: `${(runStats.approvalPct / 100) * 276} 276` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </svg>
                                            </div>
                                            <div className="mt-4 text-center">
                                                <div className="text-xs font-semibold text-slate-700">{runStats.approved.length} / {runStats.included.length}</div>
                                                <div className="text-[10px] text-slate-500">employees ready for disbursement</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pending actions summary */}
                            <Card className="xl:col-span-4 rounded-2xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6] to-[#7c4dff] text-white shadow-lg shadow-[#8B5CF6]/20 overflow-hidden">
                                <CardContent className="p-5 lg:p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="h-10 w-10 bg-white/15 rounded-xl flex items-center justify-center mb-2 border border-white/20">
                                                <Bell size={20} />
                                            </div>
                                            <h4 className="text-lg font-bold">Needs attention</h4>
                                            <p className="text-[11px] font-medium text-white/70 mt-0.5">
                                                Action items from all payroll modules
                                            </p>
                                        </div>
                                        <Badge className="bg-white/20 text-white border-none text-[10px] font-bold px-2">
                                            {pending.totalCount}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <PendingMini label="Approvals" count={pending.empApprovals.length} icon={CheckCircle2} />
                                        <PendingMini label="Claims" count={pending.claims.length} icon={Receipt} />
                                        <PendingMini label="Tax decls" count={pending.declarations.length} icon={Scale} />
                                        <PendingMini label="Proofs" count={pending.proofs.length} icon={FileCheck2} />
                                        <PendingMini label="Loans" count={pending.loans.length} icon={Landmark} />
                                        <PendingMini label="Revisions" count={pending.revisions.length} icon={TrendingUp} />
                                    </div>

                                    <Button
                                        onClick={() => setAllPendingOpen(true)}
                                        className="w-full h-9 bg-white text-slate-900 font-bold text-xs rounded-lg border-none hover:bg-white/90 gap-1"
                                    >
                                        View all <ArrowRight size={13} />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Charts ───────────────────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Monthly trend */}
                            <Card className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <CardTitle className="text-base font-bold text-slate-900">Monthly trend</CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Last {monthlyTrend.length} pay runs • click to switch
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/payroll-reports")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        View reports <ChevronRight size={11} className="ml-0.5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5">
                                    <div className="flex items-end gap-3 h-44 pt-4">
                                        {monthlyTrend.length === 0 ? (
                                            <div className="w-full text-center text-xs font-medium text-slate-400">No pay run data</div>
                                        ) : (
                                            monthlyTrend.map((t, i) => {
                                                const isActive = t.runId === activeRun.id
                                                const heightPct = maxTrend ? (t.total / maxTrend) * 100 : 0
                                                return (
                                                    <Tooltip key={t.runId}>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => setSelectedRunId(t.runId)}
                                                                className="flex-1 flex flex-col items-center gap-1.5 group"
                                                            >
                                                                <span className={cn("text-[10px] font-bold tabular-nums",
                                                                    isActive ? "text-[#8B5CF6]" : "text-slate-400 group-hover:text-slate-600")}>
                                                                    {formatINRShort(t.total)}
                                                                </span>
                                                                <div className="w-full flex-1 flex items-end">
                                                                    <motion.div
                                                                        initial={{ height: 0 }}
                                                                        animate={{ height: `${heightPct}%` }}
                                                                        transition={{ duration: 0.7, delay: i * 0.05 }}
                                                                        className={cn("w-full rounded-t-lg transition-all",
                                                                            isActive ? "bg-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/30" :
                                                                                t.status === "Paid" ? "bg-emerald-300 hover:bg-emerald-400" :
                                                                                    "bg-slate-200 hover:bg-slate-300")}
                                                                    />
                                                                </div>
                                                                <span className={cn("text-[10px] font-semibold uppercase tracking-wider",
                                                                    isActive ? "text-[#8B5CF6]" : "text-slate-500")}>
                                                                    {t.month.split(" ")[0].slice(0, 3)}
                                                                </span>
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="text-xs">
                                                                <div className="font-bold">{t.month}</div>
                                                                <div className="text-slate-500">{formatINR(t.total)} • {t.status}</div>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Deductions breakdown */}
                            <Card className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <CardTitle className="text-base font-bold text-slate-900">Deductions breakdown</CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {activeRun.month} • {formatINR(runStats.totalDeductions)} total
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/statutory")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ShieldCheck size={11} className="mr-0.5" /> Details
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-3">
                                    <DeductionBar label="PF (Employee)" amount={runStats.totalPF} total={runStats.totalDeductions} color="#8B5CF6" />
                                    <DeductionBar label="ESI" amount={runStats.totalESI} total={runStats.totalDeductions} color="#EC4899" />
                                    <DeductionBar label="Professional Tax" amount={runStats.totalPT} total={runStats.totalDeductions} color="#F59E0B" />
                                    <DeductionBar label="TDS" amount={runStats.totalTDS} total={runStats.totalDeductions} color="#10B981" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Department breakdown ───────────────── */}
                        {deptBreakdown.length > 0 && (
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100">
                                    <CardTitle className="text-base font-bold text-slate-900">Department-wise cost</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        Net payout split by department for {activeRun.month}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                        {deptBreakdown.map((d) => (
                                            <div key={d.name} className="p-3 rounded-xl border border-slate-200 bg-white">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                                                        <span className="text-xs font-bold text-slate-800 truncate">{d.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-500 shrink-0">{d.count} emp</span>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900 tabular-nums mb-2">{formatINR(d.total)}</div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: d.color }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(d.total / maxDeptTotal) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="text-[10px] font-medium text-slate-500 mt-1">
                                                    {Math.round((d.total / runStats.totalPayout) * 100)}% of total payout
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* ── Compliance + Activity ──────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Upcoming compliance */}
                            <Card className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CalendarClock size={16} className="text-[#8B5CF6]" />
                                            <CardTitle className="text-base font-bold text-slate-900">Compliance calendar</CardTitle>
                                            {overdueCount > 0 && (
                                                <Badge className="bg-rose-50 text-rose-600 border-none text-[10px] font-bold">
                                                    {overdueCount} urgent
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Upcoming filings and deadlines
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/statutory")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        View all <ChevronRight size={11} className="ml-0.5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {upcomingEvents.length === 0 ? (
                                        <div className="p-8 text-center text-xs font-medium text-slate-400">No upcoming compliance events.</div>
                                    ) : (
                                        <div className="p-3 space-y-2">
                                            {upcomingEvents.map((ev) => {
                                                const today = new Date()
                                                const due = new Date(ev.dueDate)
                                                const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                                                return (
                                                    <div
                                                        key={ev.id}
                                                        onClick={() => router.push("/hrmcubicle/payroll/statutory")}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 cursor-pointer"
                                                    >
                                                        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                                                            ev.status === "Overdue" ? "bg-rose-100 text-rose-700" :
                                                                ev.status === "Due Today" ? "bg-rose-50 text-rose-600" :
                                                                    "bg-slate-100 text-slate-500")}>
                                                            {ev.status === "Overdue" || ev.status === "Due Today" ? <AlertCircle size={14} /> : <Clock size={14} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[9px] font-bold">{ev.type}</Badge>
                                                                <span className="text-xs font-bold text-slate-800 truncate">{ev.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-slate-500">
                                                                <span>{new Date(ev.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                                                <span>•</span>
                                                                <span className={cn(days < 0 ? "text-rose-600 font-bold" : days <= 3 ? "text-amber-600 font-semibold" : "text-slate-500")}>
                                                                    {days < 0 ? `Overdue by ${Math.abs(days)}d` : days === 0 ? "Due today" : `in ${days}d`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent activity */}
                            <Card className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} className="text-emerald-500" />
                                        <CardTitle className="text-base font-bold text-slate-900">Recent activity</CardTitle>
                                    </div>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        Latest settings changes & filings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[260px]">
                                        {recentActivity.length === 0 ? (
                                            <div className="p-6 text-center text-xs font-medium text-slate-400">No activity yet.</div>
                                        ) : (
                                            <div className="p-3 space-y-2">
                                                {recentActivity.map((a) => (
                                                    <div key={a.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
                                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                            a.severity === "success" ? "bg-emerald-50 text-emerald-500" :
                                                                a.severity === "warning" ? "bg-amber-50 text-amber-500" :
                                                                    "bg-blue-50 text-blue-500")}>
                                                            {a.severity === "warning" ? <Bell size={11} /> : <CheckCircle2 size={11} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-bold px-1.5">
                                                                    {a.type}
                                                                </Badge>
                                                                <span className="text-[11px] font-bold text-slate-700 truncate">{a.action}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium text-slate-600 leading-snug mt-0.5 line-clamp-1">{a.description}</p>
                                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                                {new Date(a.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Entities + Loans + Revisions ──────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Entities */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} className="text-blue-500" />
                                            <CardTitle className="text-base font-bold text-slate-900">Entities</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {entities.filter((e) => e.isActive).length} active
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/multi-entity")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-2">
                                    {entityStats.slice(0, 3).map((e) => (
                                        <div key={e.id} className="p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-slate-800 truncate">{e.name}</span>
                                                {e.latestStatus && (
                                                    <Badge className={cn("border-none text-[9px] font-semibold",
                                                        e.latestStatus === "Paid" ? "bg-emerald-50 text-emerald-600" :
                                                            e.latestStatus === "Processed" ? "bg-blue-50 text-blue-600" :
                                                                "bg-slate-100 text-slate-500")}>
                                                        {e.latestStatus}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] font-medium">
                                                <span className="text-slate-500">{e.empCount} employees</span>
                                                <span className="text-slate-900 font-bold tabular-nums">{formatINRShort(e.latestCost)}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {entityStats.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center italic py-2">No entities configured</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Loans */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Landmark size={16} className="text-amber-500" />
                                            <CardTitle className="text-base font-bold text-slate-900">Loans & advances</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {activeLoans.length} active, {pending.loans.length} pending
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/loans")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <StatBox label="Disbursed" value={formatINRShort(totalLoanDisbursed)} color="text-slate-900" />
                                        <StatBox label="Outstanding" value={formatINRShort(totalOutstanding)} color="text-amber-600" />
                                    </div>
                                    {pending.loans.length > 0 && (
                                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-2">
                                            <AlertCircle size={13} className="text-amber-600 shrink-0" />
                                            <span className="text-[11px] font-semibold text-amber-800">
                                                {pending.loans.length} loan{pending.loans.length > 1 ? "s" : ""} awaiting approval
                                            </span>
                                        </div>
                                    )}
                                    {activeLoans.slice(0, 2).map((l) => (
                                        <div key={l.id} className="p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-slate-800 truncate">{l.employeeName}</span>
                                                <span className="text-[10px] font-bold text-[#8B5CF6] tabular-nums">{formatINRShort(l.emiAmount)}/mo</span>
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                                                {l.loanType} • {formatINRShort(l.remainingBalance)} left
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Salary Revisions */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={16} className="text-emerald-500" />
                                            <CardTitle className="text-base font-bold text-slate-900">Salary revisions</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {pending.revisions.length} pending, {approvedRevisions.length} approved
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/salary-revision")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200">
                                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Budget impact</div>
                                        <div className="text-xl font-bold text-emerald-700 tabular-nums mt-1">{formatINRShort(revisionBudgetImpact)}</div>
                                        <div className="text-[10px] font-medium text-emerald-600 mt-1">Annual increase from approved revisions</div>
                                    </div>
                                    {pending.revisions.slice(0, 2).map((r) => (
                                        <div key={r.id} className="p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-slate-800 truncate">{r.employeeName}</span>
                                                <Badge className={cn("border-none text-[9px] font-bold shrink-0",
                                                    r.incrementPercent >= 15 ? "bg-emerald-50 text-emerald-600" :
                                                        r.incrementPercent >= 10 ? "bg-blue-50 text-blue-600" :
                                                            "bg-amber-50 text-amber-600")}>
                                                    +{r.incrementPercent.toFixed(1)}%
                                                </Badge>
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">{r.revisionType} • {r.department}</div>
                                        </div>
                                    ))}
                                    {pending.revisions.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center italic py-2">No pending revisions</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Bank + Categories + Scheduled ───────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Bank accounts */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Banknote size={16} className="text-[#8B5CF6]" />
                                            <CardTitle className="text-base font-bold text-slate-900">Bank accounts</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {bankAccounts.filter((b) => b.isActive).length} active • {formatINRShort(totalBankBalance)} total
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/payroll-settings")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-2">
                                    {primaryBank && (
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/5 border border-[#8B5CF6]/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Star size={12} className="text-[#8B5CF6]" />
                                                <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">Primary</span>
                                            </div>
                                            <div className="text-xs font-bold text-slate-900 truncate">{primaryBank.bankName}</div>
                                            <div className="text-[10px] font-mono text-slate-500">{primaryBank.accountNumber}</div>
                                            <div className="text-sm font-bold text-slate-900 tabular-nums mt-1">{formatINR(primaryBank.balance ?? 0)}</div>
                                        </div>
                                    )}
                                    {bankAccounts.filter((b) => !b.isPrimary && b.isActive).slice(0, 2).map((b) => (
                                        <div key={b.id} className="p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-slate-800 truncate">{b.bankName}</span>
                                                <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-semibold shrink-0">{b.purpose}</Badge>
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5 tabular-nums">{formatINRShort(b.balance ?? 0)}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Reimbursement categories */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Receipt size={16} className="text-[#EC4899]" />
                                            <CardTitle className="text-base font-bold text-slate-900">Reimbursement budgets</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Category-wise utilisation
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/reimbursements")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-2.5">
                                    {catUtilization.slice(0, 4).map((cat) => (
                                        <div key={cat.id} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-semibold text-slate-700 truncate">{cat.name}</span>
                                                <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                                                    {formatINRShort(cat.utilized)} / {formatINRShort(cat.monthlyLimit)}
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: cat.color }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${cat.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Scheduled reports */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Mail size={16} className="text-blue-500" />
                                            <CardTitle className="text-base font-bold text-slate-900">Scheduled reports</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {activeSchedules.length} active
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/payroll-reports")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-2">
                                    {nextScheduled && (
                                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock size={12} className="text-blue-600" />
                                                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Next run</span>
                                            </div>
                                            <div className="text-xs font-bold text-slate-900 truncate">{nextScheduled.name}</div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                                                {nextScheduled.nextRun} • {nextScheduled.frequency} • {nextScheduled.format}
                                            </div>
                                        </div>
                                    )}
                                    {activeSchedules.filter((s) => s.id !== nextScheduled?.id).slice(0, 2).map((s) => (
                                        <div key={s.id} className="p-2 rounded-lg bg-slate-50/60 border border-slate-100">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-slate-800 truncate">{s.name}</span>
                                                <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-semibold shrink-0">{s.frequency}</Badge>
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">Next: {s.nextRun}</div>
                                        </div>
                                    ))}
                                    {activeSchedules.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center italic py-2">No active schedules</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Quick access grid ────────────────── */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100">
                                <CardTitle className="text-base font-bold text-slate-900">Quick access</CardTitle>
                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                    Jump to any payroll module
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 lg:p-5">
                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
                                    <QuickAccessTile icon={Play} label="Salary Processing" count={runStats.included.length} path="/hrmcubicle/payroll/processing" color="#8B5CF6" router={router} />
                                    <QuickAccessTile icon={FileText} label="Payslips" count={payslips.length} path="/hrmcubicle/payroll/payslips" color="#EC4899" router={router} />
                                    <QuickAccessTile icon={Receipt} label="Reimbursements" count={claims.length} path="/hrmcubicle/payroll/reimbursements" color="#F59E0B" router={router} />
                                    <QuickAccessTile icon={Scale} label="Tax Declarations" count={declarations.length} path="/hrmcubicle/payroll/tax-declarations" color="#10B981" router={router} />
                                    <QuickAccessTile icon={FileCheck2} label="Proof Submission" count={proofs.length} path="/hrmcubicle/payroll/proof-submission" color="#0EA5E9" router={router} />
                                    <QuickAccessTile icon={BarChart3} label="Reports" count={scheduledReports.length} path="/hrmcubicle/payroll/payroll-reports" color="#6366F1" router={router} />
                                    <QuickAccessTile icon={Layers} label="Salary Structure" count={templates.length} path="/hrmcubicle/payroll/salary-structure" color="#8B5CF6" router={router} />
                                    <QuickAccessTile icon={ShieldCheck} label="Statutory" count={complianceEvents.length} path="/hrmcubicle/payroll/statutory" color="#10B981" router={router} />
                                    <QuickAccessTile icon={Landmark} label="Loans" count={loans.length} path="/hrmcubicle/payroll/loans" color="#F59E0B" router={router} />
                                    <QuickAccessTile icon={TrendingUp} label="Revisions" count={revisions.length} path="/hrmcubicle/payroll/salary-revision" color="#EC4899" router={router} />
                                    <QuickAccessTile icon={Building2} label="Multi-Entity" count={entities.length} path="/hrmcubicle/payroll/multi-entity" color="#0EA5E9" router={router} />
                                    <QuickAccessTile icon={Briefcase} label="Settings" count={bankAccounts.length} path="/hrmcubicle/payroll/payroll-settings" color="#64748b" router={router} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* ── Cycle & Templates Summary ─────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Payroll cycle */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-[#8B5CF6]" />
                                            <CardTitle className="text-base font-bold text-slate-900">Processing cycle</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {payrollCycle.frequency} • Auto-run {payrollCycle.autoRunEnabled ? "ON" : "OFF"}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/payroll-settings")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5">
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        <StatBox label="Start" value={`Day ${payrollCycle.cycleStart}`} small />
                                        <StatBox label="Cutoff" value={`Day ${payrollCycle.cutoffDay}`} small />
                                        <StatBox label="End" value={`Day ${payrollCycle.cycleEnd}`} small />
                                        <StatBox label="Payout" value={`Day ${payrollCycle.payoutDay}`} color="text-[#8B5CF6]" small />
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-700 leading-relaxed">
                                        Cycle opens day <strong>{payrollCycle.cycleStart}</strong> → attendance locked on <strong>day {payrollCycle.cutoffDay}</strong> → closes day <strong>{payrollCycle.cycleEnd}</strong> → salary disbursed day <strong>{payrollCycle.payoutDay}</strong> of next month.
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statutory records quick glance */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-start justify-between space-y-0 gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Gift size={16} className="text-amber-500" />
                                            <CardTitle className="text-base font-bold text-slate-900">Statutory records</CardTitle>
                                        </div>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Registers per category
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push("/hrmcubicle/payroll/statutory")}
                                        className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                    >
                                        <ChevronRight size={11} />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-4 lg:p-5 space-y-2">
                                    <StatutoryMini label="Provident Fund (PF)" records={pfRecords.length} icon={Landmark} path="/hrmcubicle/payroll/statutory/pf" router={router} />
                                    <StatutoryMini label="ESI" records={esiRecords.length} icon={ShieldCheck} path="/hrmcubicle/payroll/statutory/esi" router={router} />
                                    <StatutoryMini label="Professional Tax" records={ptRecords.length} icon={Building2} path="/hrmcubicle/payroll/statutory/professional-tax" router={router} />
                                    <StatutoryMini label="Gratuity" records={gratuityRecords.length} icon={Gift} path="/hrmcubicle/payroll/statutory/lwf-gratuity" router={router} />
                                    <StatutoryMini label="Form 16 / 24Q" records={form16Records.length} icon={FileText} path="/hrmcubicle/payroll/statutory/form16" router={router} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Enabled widgets grid ───────────── */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                                        <LayoutDashboard size={16} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-bold text-slate-900">
                                            Your widgets
                                        </CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {enabledWidgets.length} of {dashboardWidgets.length} enabled • customise to add more
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCustomizeOpen(true)}
                                    className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                >
                                    Customize <Settings size={11} className="ml-0.5" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4 lg:p-5">
                                {enabledWidgets.length === 0 ? (
                                    <div className="text-center py-6 text-xs font-medium text-slate-400">
                                        No widgets enabled. Click Customize to enable some.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {enabledWidgets.map((w) => (
                                            <WidgetTile
                                                key={w.id}
                                                widget={w}
                                                meta={widgetMeta[w.type]}
                                                onClick={() => {
                                                    const href = widgetMeta[w.type].href
                                                    if (href) router.push(href)
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ── Exceptions Dialog ───────────────────── */}
                <Dialog open={exceptionsOpen} onOpenChange={setExceptionsOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                                <AlertCircle size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Payroll exceptions</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Issues blocking this cycle from finalisation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-2">
                            <ExceptionRow
                                icon={Users}
                                label={`${runStats.pendingApproval} employee approval${runStats.pendingApproval !== 1 ? "s" : ""} pending`}
                                level={runStats.pendingApproval > 0 ? "warning" : "ok"}
                                onClick={() => { setExceptionsOpen(false); router.push("/hrmcubicle/payroll/processing") }}
                            />
                            <ExceptionRow
                                icon={Receipt}
                                label={`${pending.claims.length} reimbursement claim${pending.claims.length !== 1 ? "s" : ""} pending`}
                                level={pending.claims.length > 0 ? "warning" : "ok"}
                                onClick={() => { setExceptionsOpen(false); router.push("/hrmcubicle/payroll/reimbursements") }}
                            />
                            <ExceptionRow
                                icon={Scale}
                                label={`${pending.declarations.length} tax declaration${pending.declarations.length !== 1 ? "s" : ""} need verification`}
                                level={pending.declarations.length > 5 ? "error" : pending.declarations.length > 0 ? "warning" : "ok"}
                                onClick={() => { setExceptionsOpen(false); router.push("/hrmcubicle/payroll/tax-declarations") }}
                            />
                            <ExceptionRow
                                icon={FileCheck2}
                                label={`${pending.proofs.length} investment proof${pending.proofs.length !== 1 ? "s" : ""} awaiting audit`}
                                level={pending.proofs.length > 0 ? "warning" : "ok"}
                                onClick={() => { setExceptionsOpen(false); router.push("/hrmcubicle/payroll/proof-submission") }}
                            />
                            <ExceptionRow
                                icon={CalendarClock}
                                label={overdueCount > 0 ? `${overdueCount} compliance event${overdueCount !== 1 ? "s" : ""} overdue` : "No overdue filings"}
                                level={overdueCount > 0 ? "error" : "ok"}
                                onClick={() => { setExceptionsOpen(false); router.push("/hrmcubicle/payroll/statutory") }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── All Pending Dialog ────────────────── */}
                <Dialog open={allPendingOpen} onOpenChange={setAllPendingOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Bell size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                All pending actions ({pending.totalCount})
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Items from all payroll modules awaiting your action.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                <PendingSection
                                    title="Employee approvals"
                                    count={pending.empApprovals.length}
                                    icon={CheckCircle2}
                                    color="#8B5CF6"
                                    items={pending.empApprovals.slice(0, 5).map((e) => ({ label: e.name, detail: `${e.dept} • ${e.empCode}` }))}
                                    onViewAll={() => { setAllPendingOpen(false); router.push("/hrmcubicle/payroll/processing") }}
                                />
                                <PendingSection
                                    title="Reimbursement claims"
                                    count={pending.claims.length}
                                    icon={Receipt}
                                    color="#EC4899"
                                    items={pending.claims.slice(0, 5).map((c) => ({ label: c.employeeName, detail: `${c.category} • ${formatINR(c.amount)}` }))}
                                    onViewAll={() => { setAllPendingOpen(false); router.push("/hrmcubicle/payroll/reimbursements") }}
                                />
                                <PendingSection
                                    title="Tax declarations"
                                    count={pending.declarations.length}
                                    icon={Scale}
                                    color="#10B981"
                                    items={pending.declarations.slice(0, 5).map((d) => ({ label: d.employeeName, detail: `${d.regime} regime • ${d.fiscalYear}` }))}
                                    onViewAll={() => { setAllPendingOpen(false); router.push("/hrmcubicle/payroll/tax-declarations") }}
                                />
                                <PendingSection
                                    title="Investment proofs"
                                    count={pending.proofs.length}
                                    icon={FileCheck2}
                                    color="#0EA5E9"
                                    items={pending.proofs.slice(0, 5).map((p) => ({ label: p.employeeName, detail: `${p.type} • ${formatINR(p.amount)}` }))}
                                    onViewAll={() => { setAllPendingOpen(false); router.push("/hrmcubicle/payroll/proof-submission") }}
                                />
                                <PendingSection
                                    title="Loan approvals"
                                    count={pending.loans.length}
                                    icon={Landmark}
                                    color="#F59E0B"
                                    items={pending.loans.slice(0, 5).map((l) => ({ label: l.employeeName, detail: `${l.loanType} • ${formatINR(l.principal)}` }))}
                                    onViewAll={() => { setAllPendingOpen(false); router.push("/hrmcubicle/payroll/loans") }}
                                />
                                <PendingSection
                                    title="Salary revisions"
                                    count={pending.revisions.length}
                                    icon={TrendingUp}
                                    color="#EC4899"
                                    items={pending.revisions.slice(0, 5).map((r) => ({ label: r.employeeName, detail: `${r.department} • +${r.incrementPercent.toFixed(1)}%` }))}
                                    onViewAll={() => { setAllPendingOpen(false); router.push("/hrmcubicle/payroll/salary-revision") }}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button variant="ghost" onClick={() => setAllPendingOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Alerts Manager Dialog ─────────────── */}
                <Dialog open={alertsManagerOpen} onOpenChange={setAlertsManagerOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Bell size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Alerts manager</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Review active, actioned and dismissed signals.
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="active" className="flex-1 overflow-hidden flex flex-col">
                            <TabsList className="mx-6 mt-4 bg-slate-100/80 rounded-lg p-1 h-9 grid grid-cols-3 w-[calc(100%-3rem)]">
                                <TabsTrigger value="active" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    Active ({dashboardAlerts.filter((a) => !a.dismissed && !a.actionTaken).length})
                                </TabsTrigger>
                                <TabsTrigger value="actioned" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    Actioned ({dashboardAlerts.filter((a) => a.actionTaken).length})
                                </TabsTrigger>
                                <TabsTrigger value="dismissed" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    Dismissed ({dashboardAlerts.filter((a) => a.dismissed).length})
                                </TabsTrigger>
                            </TabsList>
                            <ScrollArea className="flex-1 px-6 py-4">
                                <TabsContent value="active" className="mt-0 space-y-2">
                                    {dashboardAlerts.filter((a) => !a.dismissed && !a.actionTaken).length === 0 ? (
                                        <p className="text-xs font-medium text-slate-400 text-center py-6">No active alerts.</p>
                                    ) : (
                                        dashboardAlerts
                                            .filter((a) => !a.dismissed && !a.actionTaken)
                                            .map((a) => (
                                                <AlertRow
                                                    key={a.id}
                                                    alert={a}
                                                    daysUntil={daysUntil(a.dueDate)}
                                                    onAction={() => { markAlertActioned(a.id, "You"); toast({ title: "Marked as actioned" }) }}
                                                    onDismiss={() => { dismissDashboardAlert(a.id); toast({ title: "Alert dismissed" }) }}
                                                    onOpen={() => a.link && router.push(a.link)}
                                                />
                                            ))
                                    )}
                                </TabsContent>
                                <TabsContent value="actioned" className="mt-0 space-y-2">
                                    {dashboardAlerts.filter((a) => a.actionTaken).length === 0 ? (
                                        <p className="text-xs font-medium text-slate-400 text-center py-6">No actioned alerts.</p>
                                    ) : (
                                        dashboardAlerts
                                            .filter((a) => a.actionTaken)
                                            .map((a) => (
                                                <AlertRow
                                                    key={a.id}
                                                    alert={a}
                                                    daysUntil={daysUntil(a.dueDate)}
                                                    onAction={() => { }}
                                                    onDismiss={() => dismissDashboardAlert(a.id)}
                                                    onOpen={() => a.link && router.push(a.link)}
                                                    actioned
                                                />
                                            ))
                                    )}
                                </TabsContent>
                                <TabsContent value="dismissed" className="mt-0 space-y-2">
                                    {dashboardAlerts.filter((a) => a.dismissed).length === 0 ? (
                                        <p className="text-xs font-medium text-slate-400 text-center py-6">No dismissed alerts.</p>
                                    ) : (
                                        dashboardAlerts
                                            .filter((a) => a.dismissed)
                                            .map((a) => (
                                                <AlertRow
                                                    key={a.id}
                                                    alert={a}
                                                    daysUntil={daysUntil(a.dueDate)}
                                                    onAction={() => { }}
                                                    onDismiss={() => { }}
                                                    onOpen={() => a.link && router.push(a.link)}
                                                    dismissed
                                                />
                                            ))
                                    )}
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                            <Button
                                variant="outline"
                                onClick={() => { clearDismissedAlerts(); toast({ title: "Dismissed alerts cleared" }) }}
                                className="h-9 font-semibold text-xs gap-1.5"
                            >
                                <Trash2 size={12} /> Clear dismissed
                            </Button>
                            <Button variant="ghost" onClick={() => setAlertsManagerOpen(false)} className="h-9 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Customize Dashboard Sheet ─────────── */}
                <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
                    <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 flex flex-col">
                        <SheetHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <LayoutDashboard size={20} />
                            </div>
                            <SheetTitle className="text-lg font-bold text-slate-900">Customize dashboard</SheetTitle>
                            <SheetDescription className="text-xs font-medium text-slate-500">
                                Toggle, resize and re-order the widgets you see on this page.
                            </SheetDescription>
                        </SheetHeader>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-2">
                                {sortedWidgetsForMgmt.map((w, i) => (
                                    <div key={w.id} className="p-3 rounded-xl border border-slate-200 bg-white">
                                        <div className="flex items-start gap-3">
                                            <div className="flex flex-col items-center gap-0.5 pt-1">
                                                <button
                                                    onClick={() => handleMoveWidget(w.id, "up")}
                                                    disabled={i === 0}
                                                    className="h-5 w-5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    <ChevronUp size={12} />
                                                </button>
                                                <GripVertical size={12} className="text-slate-300" />
                                                <button
                                                    onClick={() => handleMoveWidget(w.id, "down")}
                                                    disabled={i === sortedWidgetsForMgmt.length - 1}
                                                    className="h-5 w-5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                                                >
                                                    <ChevronDown size={12} />
                                                </button>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{w.title}</p>
                                                        <p className="text-[10px] font-medium text-slate-500 truncate">{w.type}</p>
                                                    </div>
                                                    <Switch
                                                        checked={w.enabled}
                                                        onCheckedChange={() => toggleDashboardWidget(w.id)}
                                                    />
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Size</span>
                                                    <Select
                                                        value={w.size}
                                                        onValueChange={(v) => resizeDashboardWidget(w.id, v as DashboardWidget["size"])}
                                                    >
                                                        <SelectTrigger className="h-7 w-24 rounded-lg border-slate-200 bg-white font-semibold text-[11px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="sm">Small</SelectItem>
                                                            <SelectItem value="md">Medium</SelectItem>
                                                            <SelectItem value="lg">Large</SelectItem>
                                                            <SelectItem value="full">Full</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <SheetFooter className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between gap-2">
                            <Button
                                variant="outline"
                                onClick={() => { resetDashboardLayout(); toast({ title: "Layout reset to defaults" }) }}
                                className="h-9 font-semibold text-xs"
                            >
                                Reset to defaults
                            </Button>
                            <Button
                                onClick={() => setCustomizeOpen(false)}
                                className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-bold text-xs"
                            >
                                Done
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                {/* ── Manage Quick Actions Dialog ────────── */}
                <Dialog open={quickActionsMgrOpen} onOpenChange={(v) => { setQuickActionsMgrOpen(v); if (!v) resetQaForm() }}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Zap size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Manage quick actions</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Add, edit, pin and re-order the actions that appear on the dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            {/* Add / Edit form */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 mb-5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        {qaForm.id ? "Edit quick action" : "Add new quick action"}
                                    </h4>
                                    {qaForm.id && (
                                        <Button variant="ghost" size="sm" onClick={resetQaForm} className="h-7 text-[11px] font-semibold">
                                            Cancel edit
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Label</label>
                                        <Input
                                            value={qaForm.label}
                                            onChange={(e) => setQaForm({ ...qaForm, label: e.target.value })}
                                            placeholder="Run payroll"
                                            className="h-9 mt-1 rounded-lg text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lucide icon</label>
                                        <Input
                                            value={qaForm.icon}
                                            onChange={(e) => setQaForm({ ...qaForm, icon: e.target.value })}
                                            placeholder="Zap"
                                            className="h-9 mt-1 rounded-lg text-xs"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                        <Textarea
                                            value={qaForm.description}
                                            onChange={(e) => setQaForm({ ...qaForm, description: e.target.value })}
                                            placeholder="Short helper text"
                                            className="mt-1 rounded-lg text-xs min-h-[60px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Link</label>
                                        <Input
                                            value={qaForm.href}
                                            onChange={(e) => setQaForm({ ...qaForm, href: e.target.value })}
                                            placeholder="/hrmcubicle/payroll/..."
                                            className="h-9 mt-1 rounded-lg text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Color</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#14B8A6"].map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setQaForm({ ...qaForm, color: c })}
                                                    className={cn(
                                                        "h-7 w-7 rounded-lg border-2 transition-all",
                                                        qaForm.color === c ? "border-slate-900 scale-110" : "border-transparent"
                                                    )}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                            <Input
                                                value={qaForm.color}
                                                onChange={(e) => setQaForm({ ...qaForm, color: e.target.value })}
                                                className="h-7 w-24 rounded-lg text-[11px] font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        onClick={handleSubmitQaForm}
                                        className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-bold text-xs gap-1.5"
                                    >
                                        <Plus size={12} /> {qaForm.id ? "Save changes" : "Add action"}
                                    </Button>
                                </div>
                            </div>

                            {/* List */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                                    All actions ({quickActions.length})
                                </h4>
                                {allQuickActionsSorted.map((qa) => {
                                    const Icon = (LucideIcons as any)[qa.icon] ?? LucideIcons.Zap
                                    return (
                                        <div key={qa.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                                            <div
                                                className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${qa.color}14`, color: qa.color }}
                                            >
                                                <Icon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs font-bold text-slate-900 truncate">{qa.label}</p>
                                                    {qa.pinned && (
                                                        <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[9px] font-bold">
                                                            Pinned
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-medium text-slate-500 truncate">{qa.description || qa.href}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleQuickActionPin(qa.id)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {qa.pinned ? <PinOff size={13} /> : <Pin size={13} />}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{qa.pinned ? "Unpin" : "Pin"}</TooltipContent>
                                                </Tooltip>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setQaForm({
                                                        id: qa.id,
                                                        label: qa.label,
                                                        description: qa.description ?? "",
                                                        icon: qa.icon,
                                                        href: qa.href,
                                                        color: qa.color,
                                                    })}
                                                    className="h-8 w-8 p-0 text-slate-500"
                                                >
                                                    <Edit size={13} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => { deleteQuickAction(qa.id); toast({ title: "Quick action deleted" }) }}
                                                    className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                                >
                                                    <Trash2 size={13} />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                                {quickActions.length === 0 && (
                                    <p className="text-xs font-medium text-slate-400 text-center py-6">No quick actions yet.</p>
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button variant="ghost" onClick={() => setQuickActionsMgrOpen(false)} className="h-9 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// ── Subcomponents ─────────────────────────────────────────

const HeroKpi = ({
    label,
    value,
    caption,
    icon: Icon,
    color,
    trend,
}: {
    label: string
    value: string
    caption?: string
    icon: any
    color: string
    trend?: { direction: "up" | "down"; value: string }
}) => (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2 mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}14`, color }}>
                    <Icon size={18} />
                </div>
                {trend && (
                    <div className={cn("flex items-center gap-0.5 text-[10px] font-bold",
                        trend.direction === "up" ? "text-emerald-600" : "text-rose-600")}>
                        {trend.direction === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight tabular-nums truncate">{value}</p>
            {caption && <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{caption}</p>}
        </CardContent>
    </Card>
)

const PendingMini = ({ label, count, icon: Icon }: { label: string; count: number; icon: any }) => (
    <div className={cn("p-2.5 rounded-lg border transition-all",
        count > 0 ? "bg-white/15 border-white/30" : "bg-white/5 border-white/10")}>
        <div className="flex items-center gap-1.5 mb-0.5">
            <Icon size={11} />
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</span>
        </div>
        <div className="text-lg font-bold tabular-nums">{count}</div>
    </div>
)

const StatBox = ({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) => (
    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={cn("font-bold mt-0.5 tabular-nums", small ? "text-[11px]" : "text-xs", color ?? "text-slate-800")}>{value}</div>
    </div>
)

const DeductionBar = ({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) => {
    const pct = total ? (amount / total) * 100 : 0
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">{label}</span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                    {formatINRShort(amount)} <span className="text-[10px] text-slate-400 font-medium">({pct.toFixed(1)}%)</span>
                </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                />
            </div>
        </div>
    )
}

const QuickAccessTile = ({ icon: Icon, label, count, path, color, router }: { icon: any; label: string; count: number; path: string; color: string; router: any }) => (
    <button
        onClick={() => router.push(path)}
        className="p-3 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all text-left group"
    >
        <div className="flex items-start justify-between mb-2">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}14`, color }}>
                <Icon size={16} />
            </div>
            <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold">{count}</Badge>
        </div>
        <div className="text-xs font-bold text-slate-800 leading-tight">{label}</div>
    </button>
)

const StatutoryMini = ({ label, records, icon: Icon, path, router }: { label: string; records: number; icon: any; path: string; router: any }) => (
    <button
        onClick={() => router.push(path)}
        className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors text-left"
    >
        <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center text-[#8B5CF6] border border-slate-100 shrink-0">
            <Icon size={13} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">{label}</div>
            <div className="text-[10px] font-medium text-slate-500">{records} record{records !== 1 ? "s" : ""}</div>
        </div>
        <ChevronRight size={14} className="text-slate-300 shrink-0" />
    </button>
)

const ExceptionRow = ({ icon: Icon, label, level, onClick }: { icon: any; label: string; level: "ok" | "warning" | "error"; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left",
            level === "error" ? "bg-rose-50 border-rose-100 hover:bg-rose-100" :
                level === "warning" ? "bg-amber-50 border-amber-100 hover:bg-amber-100" :
                    "bg-emerald-50 border-emerald-100")}
    >
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
            level === "error" ? "bg-rose-100 text-rose-700" :
                level === "warning" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700")}>
            {level === "ok" ? <CheckCircle2 size={15} /> : <Icon size={15} />}
        </div>
        <span className={cn("text-xs font-semibold flex-1",
            level === "error" ? "text-rose-800" :
                level === "warning" ? "text-amber-800" :
                    "text-emerald-800")}>
            {label}
        </span>
        {level !== "ok" && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
    </button>
)

const PendingSection = ({
    title,
    count,
    icon: Icon,
    color,
    items,
    onViewAll,
}: {
    title: string
    count: number
    icon: any
    color: string
    items: { label: string; detail: string }[]
    onViewAll: () => void
}) => {
    if (count === 0) return null
    return (
        <div className="rounded-xl border border-slate-200 bg-white">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}14`, color }}>
                        <Icon size={14} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                        <span className="text-[10px] font-medium text-slate-500">{count} pending</span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewAll}
                    className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                >
                    View all <ChevronRight size={11} className="ml-0.5" />
                </Button>
            </div>
            <div className="p-3 space-y-1.5">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60">
                        <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate">{item.label}</div>
                            <div className="text-[10px] font-medium text-slate-500 truncate">{item.detail}</div>
                        </div>
                    </div>
                ))}
                {count > items.length && (
                    <div className="text-[10px] font-medium text-slate-400 text-center italic pt-1">
                        +{count - items.length} more
                    </div>
                )}
            </div>
        </div>
    )
}

const AlertRow = ({
    alert,
    daysUntil,
    onAction,
    onDismiss,
    onOpen,
    actioned,
    dismissed,
}: {
    alert: DashboardAlert
    daysUntil: number | null
    onAction: () => void
    onDismiss: () => void
    onOpen: () => void
    actioned?: boolean
    dismissed?: boolean
}) => {
    const SeverityIcon =
        alert.severity === "critical" ? AlertOctagon :
            alert.severity === "warning" ? AlertTriangle :
                Info
    const sevColor =
        alert.severity === "critical" ? { bg: "bg-rose-50", text: "text-rose-600", ring: "border-rose-100" } :
            alert.severity === "warning" ? { bg: "bg-amber-50", text: "text-amber-600", ring: "border-amber-100" } :
                { bg: "bg-blue-50", text: "text-blue-600", ring: "border-blue-100" }
    const dueSoon = typeof daysUntil === "number" && daysUntil >= 0 && daysUntil < 7
    return (
        <div className={cn("p-3 rounded-xl border bg-white flex items-start gap-3", sevColor.ring, (actioned || dismissed) && "opacity-70")}>
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", sevColor.bg, sevColor.text)}>
                <SeverityIcon size={15} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold text-slate-900">{alert.title}</p>
                    <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold">{alert.source}</Badge>
                    {alert.dueDate && (
                        <Badge className={cn("border-none text-[9px] font-bold", dueSoon ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600")}>
                            Due {new Date(alert.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </Badge>
                    )}
                    {actioned && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-none text-[9px] font-bold">Actioned</Badge>
                    )}
                    {dismissed && (
                        <Badge className="bg-slate-200 text-slate-700 border-none text-[9px] font-bold">Dismissed</Badge>
                    )}
                </div>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-relaxed">{alert.description}</p>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                    {!actioned && !dismissed && (
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 cursor-pointer">
                            <Checkbox
                                checked={false}
                                onCheckedChange={() => onAction()}
                            />
                            Action taken
                        </label>
                    )}
                    {alert.link && (
                        <button
                            onClick={onOpen}
                            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#8B5CF6] hover:underline"
                        >
                            {alert.linkLabel ?? "Open"} <ChevronRight size={11} />
                        </button>
                    )}
                </div>
            </div>
            {!dismissed && !actioned && (
                <button
                    onClick={onDismiss}
                    className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center shrink-0"
                    aria-label="Dismiss alert"
                >
                    <X size={13} />
                </button>
            )}
        </div>
    )
}

const QuickActionCard = ({ action, onClick }: { action: QuickAction; onClick: () => void }) => {
    const Icon = (LucideIcons as any)[action.icon] ?? LucideIcons.Zap
    return (
        <button
            onClick={onClick}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-4 text-left group min-h-[96px] flex flex-col gap-2"
        >
            <div
                className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${action.color}14`, color: action.color }}
            >
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{action.label}</p>
                {action.description && (
                    <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{action.description}</p>
                )}
            </div>
        </button>
    )
}

const WidgetTile = ({
    widget,
    meta,
    onClick,
}: {
    widget: DashboardWidget
    meta: { icon: any; color: string; value: string; caption: string; href?: string }
    onClick: () => void
}) => {
    const Icon = meta.icon
    return (
        <button
            onClick={onClick}
            className={cn(
                "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-4 text-left flex flex-col gap-3",
                widget.size === "full" && "xl:col-span-4 md:col-span-3",
                widget.size === "lg" && "xl:col-span-2 md:col-span-2",
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
                >
                    <Icon size={16} />
                </div>
                <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-bold capitalize">
                    {widget.size}
                </Badge>
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">{widget.title}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums truncate">{meta.value}</p>
                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">{meta.caption}</p>
            </div>
        </button>
    )
}

export default PayrollDashboard
