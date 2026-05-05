"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldCheck,
    Building2,
    Landmark,
    Scale,
    FileText,
    Gift,
    ChevronRight,
    CalendarDays,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowRight,
    TrendingUp,
    Download,
    Plus,
    X,
    Trash2,
    Bell,
    Activity,
    RotateCcw,
    FileCheck,
    Gauge,
    Coins,
    Banknote,
    Shield,
    ScanLine,
    Wand2,
    MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Progress } from "@/shared/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    useStatutoryStore,
    type ComplianceEvent,
    type MonthlyFiling,
    type Challan,
    type ChallanType,
    type ComplianceHealthScore,
} from "@/shared/data/statutory-store"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const emptyEventForm: Omit<ComplianceEvent, "id"> = {
    type: "PF",
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Upcoming",
    relatedMonth: "",
}

// ── Health score color scale ─────────────────────────────────
const scoreColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", ring: "#10B981", softBg: "bg-emerald-500" }
    if (score >= 60) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", ring: "#F59E0B", softBg: "bg-amber-500" }
    return { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", ring: "#EF4444", softBg: "bg-rose-500" }
}

const StatutoryDashboard = () => {
    const router = useRouter()
    const { toast } = useToast()
    const {
        pfRecords,
        esiRecords,
        ptRecords,
        lwfRecords,
        gratuityRecords,
        form16Records,
        form24QRecords,
        complianceEvents,
        activityLogs,
        monthlyFilings,
        challans,
        addComplianceEvent,
        updateComplianceEvent,
        deleteComplianceEvent,
        markEventComplete,
        addMonthlyFiling,
        updateMonthlyFiling,
        markFilingFiled,
        deleteMonthlyFiling,
        addActivityLog,
        generateChallan,
        markChallanPaid,
        reconcileChallan,
        deleteChallan,
        bulkMarkFilingFiled,
        getComplianceHealthScore,
    } = useStatutoryStore()

    // ── UI state ───────────────────────────────────────────
    const [eventDialogOpen, setEventDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<ComplianceEvent | null>(null)
    const [eventForm, setEventForm] = useState<Omit<ComplianceEvent, "id">>(emptyEventForm)

    const [filingDialogOpen, setFilingDialogOpen] = useState(false)
    const [filingForm, setFilingForm] = useState<Omit<MonthlyFiling, "id">>({
        month: "",
        pfStatus: "Pending",
        esiStatus: "Pending",
        ptStatus: "Pending",
        tdsStatus: "Pending",
        lwfStatus: "Pending",
    })

    const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
    const [eventStatusFilter, setEventStatusFilter] = useState<string>("upcoming")

    // Round 2 — selections & dialogs
    const [selectedFilingIds, setSelectedFilingIds] = useState<string[]>([])

    const [healthDialogOpen, setHealthDialogOpen] = useState(false)

    const [genChallanOpen, setGenChallanOpen] = useState(false)
    const [genChallanType, setGenChallanType] = useState<ChallanType>("PF")
    const [genChallanPeriod, setGenChallanPeriod] = useState<string>("Mar 2026")

    const [paidChallanDialog, setPaidChallanDialog] = useState<Challan | null>(null)
    const [paidBankRef, setPaidBankRef] = useState("")

    const [reconResult, setReconResult] = useState<null | { challan: Challan; matched: boolean; variance: number; notes: string }>(null)

    const [bulkReconSummary, setBulkReconSummary] = useState<null | { matched: number; variance: number; total: number }>(null)

    const [challanTypeFilter, setChallanTypeFilter] = useState<string>("all")
    const [challanStatusFilter, setChallanStatusFilter] = useState<string>("all")
    const [challanPeriodFilter, setChallanPeriodFilter] = useState<string>("all")

    // ── Derived stats ──────────────────────────────────────
    const stats = useMemo(() => {
        const pfFiled = pfRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const pfCompliance = pfRecords.length > 0 ? Math.round((pfFiled / pfRecords.length) * 100) : 0

        const esiCoverage = esiRecords.filter((r) => r.grossWage <= 21000).length
        const esiPct = esiRecords.length > 0 ? Math.round((esiCoverage / esiRecords.length) * 100) : 0

        const ptFiled = ptRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const ptPct = ptRecords.length > 0 ? Math.round((ptFiled / ptRecords.length) * 100) : 0

        const lwfFiled = lwfRecords.filter((r) => r.status === "Filed" || r.status === "Paid").length
        const lwfPct = lwfRecords.length > 0 ? Math.round((lwfFiled / lwfRecords.length) * 100) : 0

        const gratuityProvisioned = gratuityRecords
            .filter((r) => r.status === "Provisioned" || r.status === "Paid")
            .reduce((sum, r) => sum + r.gratuityAmount, 0)

        const form16Generated = form16Records.filter(
            (r) => r.partAStatus !== "Pending" || r.partBStatus !== "Pending"
        ).length
        const form16Pct = form16Records.length > 0 ? Math.round((form16Generated / form16Records.length) * 100) : 0

        return { pfCompliance, esiPct, ptPct, lwfPct, gratuityProvisioned, form16Pct, form16Generated }
    }, [pfRecords, esiRecords, ptRecords, lwfRecords, gratuityRecords, form16Records])

    const health: ComplianceHealthScore = useMemo(() => getComplianceHealthScore(), [getComplianceHealthScore, monthlyFilings, challans, complianceEvents])
    const healthColor = scoreColor(health.overall)

    const filteredEvents = useMemo(() => {
        return complianceEvents
            .filter((e) => {
                if (eventTypeFilter !== "all" && e.type !== eventTypeFilter) return false
                if (eventStatusFilter === "upcoming" && e.status === "Completed") return false
                if (eventStatusFilter === "completed" && e.status !== "Completed") return false
                if (eventStatusFilter === "overdue" && e.status !== "Overdue" && e.status !== "Due Today") return false
                return true
            })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    }, [complianceEvents, eventTypeFilter, eventStatusFilter])

    const upcomingDueCount = useMemo(
        () => complianceEvents.filter((e) => e.status === "Due Today" || e.status === "Overdue").length,
        [complianceEvents]
    )

    const kpis = [
        { label: "PF Compliance", val: `${stats.pfCompliance}%`, icon: Landmark, color: "#8B5CF6", trend: `${pfRecords.length} employees`, path: "/hrmcubicle/payroll/statutory/pf" },
        { label: "ESI Coverage", val: `${stats.esiPct}%`, icon: ShieldCheck, color: "#10B981", trend: `${esiRecords.length} eligible`, path: "/hrmcubicle/payroll/statutory/esi" },
        { label: "PT Filed", val: `${stats.ptPct}%`, icon: Building2, color: "#0EA5E9", trend: `${ptRecords.length} employees`, path: "/hrmcubicle/payroll/statutory/professional-tax" },
        { label: "LWF Status", val: `${stats.lwfPct}%`, icon: Scale, color: "#F59E0B", trend: `${lwfRecords.length} records`, path: "/hrmcubicle/payroll/statutory/lwf-gratuity" },
        { label: "Gratuity Provision", val: formatINR(stats.gratuityProvisioned), icon: Gift, color: "#EC4899", trend: `${gratuityRecords.filter((r) => r.status !== "Not Eligible").length} eligible`, path: "/hrmcubicle/payroll/statutory/lwf-gratuity" },
        { label: "Form 16", val: `${stats.form16Pct}%`, icon: FileText, color: "#06B6D4", trend: `${stats.form16Generated}/${form16Records.length}`, path: "/hrmcubicle/payroll/statutory/form16" },
    ]

    const modules = [
        { label: "Provident Fund", desc: "EPF/EPS/EDLI management", icon: Landmark, path: "/hrmcubicle/payroll/statutory/pf", color: "#8B5CF6" },
        { label: "ESI", desc: "ESI contributions & challans", icon: ShieldCheck, path: "/hrmcubicle/payroll/statutory/esi", color: "#10B981" },
        { label: "Professional Tax", desc: "State-wise PT deductions", icon: Building2, path: "/hrmcubicle/payroll/statutory/professional-tax", color: "#0EA5E9" },
        { label: "LWF & Gratuity", desc: "Labour welfare & gratuity", icon: Gift, path: "/hrmcubicle/payroll/statutory/lwf-gratuity", color: "#F59E0B" },
        { label: "Form 16 & 24Q", desc: "TDS certificates & returns", icon: FileText, path: "/hrmcubicle/payroll/statutory/form16", color: "#06B6D4" },
    ]

    // ── Derived period list for challan filters ────────────
    const uniqueChallanPeriods = useMemo(
        () => Array.from(new Set(challans.map((c) => c.period))).sort(),
        [challans]
    )

    const filteredChallans = useMemo(() => {
        return challans
            .filter((c) => {
                if (challanTypeFilter !== "all" && c.type !== challanTypeFilter) return false
                if (challanStatusFilter !== "all" && c.status !== challanStatusFilter) return false
                if (challanPeriodFilter !== "all" && c.period !== challanPeriodFilter) return false
                return true
            })
            .sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime())
    }, [challans, challanTypeFilter, challanStatusFilter, challanPeriodFilter])

    // ── Event handlers ────────────────────────────────────
    const openAddEvent = () => {
        setEditingEvent(null)
        setEventForm(emptyEventForm)
        setEventDialogOpen(true)
    }

    const openEditEvent = (e: ComplianceEvent) => {
        setEditingEvent(e)
        setEventForm({
            type: e.type,
            title: e.title,
            description: e.description,
            dueDate: e.dueDate,
            status: e.status,
            relatedMonth: e.relatedMonth,
            completedDate: e.completedDate,
            completedBy: e.completedBy,
        })
        setEventDialogOpen(true)
    }

    const handleSaveEvent = () => {
        if (!eventForm.title.trim()) {
            toast({ title: "Title required", variant: "destructive" })
            return
        }
        if (editingEvent) {
            updateComplianceEvent(editingEvent.id, eventForm)
            toast({ title: "Event updated", description: eventForm.title })
        } else {
            addComplianceEvent(eventForm)
            toast({ title: "Event added to calendar", description: eventForm.title })
        }
        setEventDialogOpen(false)
        setEditingEvent(null)
    }

    const handleCompleteEvent = (e: ComplianceEvent) => {
        markEventComplete(e.id, "HR Manager")
        addActivityLog({
            type: e.type,
            action: `${e.type} Event Completed`,
            description: `${e.title} marked as completed`,
            performedBy: "HR Manager",
            severity: "success",
        })
        toast({ title: "Event completed", description: e.title })
    }

    const handleDeleteEvent = (id: string) => {
        const event = complianceEvents.find((e) => e.id === id)
        deleteComplianceEvent(id)
        toast({ title: "Event deleted", description: event?.title ?? "", variant: "destructive" })
    }

    // ── Filing handlers ──────────────────────────────────
    const handleSaveFiling = () => {
        if (!filingForm.month.trim()) {
            toast({ title: "Month required", variant: "destructive" })
            return
        }
        if (monthlyFilings.some((f) => f.month.toLowerCase() === filingForm.month.toLowerCase())) {
            toast({ title: "Duplicate month", description: `Filing for ${filingForm.month} already exists`, variant: "destructive" })
            return
        }
        addMonthlyFiling(filingForm)
        toast({ title: "Filing added", description: filingForm.month })
        setFilingDialogOpen(false)
        setFilingForm({ month: "", pfStatus: "Pending", esiStatus: "Pending", ptStatus: "Pending", tdsStatus: "Pending", lwfStatus: "Pending" })
    }

    const handleMarkFiled = (filing: MonthlyFiling, type: "pf" | "esi" | "pt" | "tds" | "lwf") => {
        markFilingFiled(filing.id, type, "HR Manager")
        addActivityLog({
            type: type.toUpperCase() as "PF" | "ESI" | "PT" | "TDS" | "LWF",
            action: `${type.toUpperCase()} Filed`,
            description: `${type.toUpperCase()} filed for ${filing.month}`,
            performedBy: "HR Manager",
            severity: "success",
        })
        toast({ title: `${type.toUpperCase()} filed`, description: filing.month })
    }

    const handleBumpFilingStatus = (filing: MonthlyFiling, type: "pf" | "esi" | "pt" | "tds" | "lwf") => {
        const key = `${type}Status` as const
        const current = filing[key] as string
        const next = current === "Pending" ? "Filed" : current === "Filed" ? "Paid" : "Pending"
        const updates: Partial<MonthlyFiling> = { [key]: next as any }
        updateMonthlyFiling(filing.id, updates)
        if (next === "Filed") {
            addActivityLog({
                type: type.toUpperCase() as "PF" | "ESI" | "PT" | "TDS" | "LWF",
                action: `${type.toUpperCase()} Filed`,
                description: `${type.toUpperCase()} filed for ${filing.month}`,
                performedBy: "HR Manager",
                severity: "success",
            })
        } else if (next === "Paid") {
            addActivityLog({
                type: type.toUpperCase() as "PF" | "ESI" | "PT" | "TDS" | "LWF",
                action: `${type.toUpperCase()} Paid`,
                description: `${type.toUpperCase()} payment confirmed for ${filing.month}`,
                performedBy: "HR Manager",
                severity: "success",
            })
        }
    }

    // ── Bulk filings ─────────────────────────────────────
    const toggleFilingSelection = (id: string, checked: boolean) => {
        setSelectedFilingIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)))
    }
    const toggleAllFilings = (checked: boolean) => {
        setSelectedFilingIds(checked ? monthlyFilings.map((f) => f.id) : [])
    }
    const handleBulkMarkFiled = (type: "pf" | "esi" | "pt" | "tds" | "lwf") => {
        if (selectedFilingIds.length === 0) {
            toast({ title: "No rows selected", variant: "destructive" })
            return
        }
        const { updated } = bulkMarkFilingFiled(selectedFilingIds, type, "Finance")
        toast({ title: `${type.toUpperCase()} marked filed`, description: `${updated} row${updated === 1 ? "" : "s"} updated` })
        if (updated > 0) {
            addActivityLog({
                type: type.toUpperCase() as "PF" | "ESI" | "PT" | "TDS" | "LWF",
                action: `Bulk ${type.toUpperCase()} Filed`,
                description: `Bulk ${type.toUpperCase()} filed for ${updated} period${updated === 1 ? "" : "s"}`,
                performedBy: "Finance",
                severity: "success",
            })
        }
        setSelectedFilingIds([])
    }

    // ── Challan handlers ─────────────────────────────────
    const handleGenerateChallan = () => {
        if (!genChallanPeriod.trim()) {
            toast({ title: "Period required", variant: "destructive" })
            return
        }
        const ch = generateChallan(genChallanType, genChallanPeriod.trim(), "Finance")
        toast({ title: "Challan generated", description: `${ch.challanNumber} · ${formatINR(ch.amount)}` })
        setGenChallanOpen(false)
    }

    const handleQuickGenerate = (type: ChallanType) => {
        const ch = generateChallan(type, "Mar 2026", "Finance")
        toast({ title: `${type} challan generated`, description: `${ch.challanNumber} · ${formatINR(ch.amount)}` })
    }

    const handleOpenMarkPaid = (c: Challan) => {
        setPaidBankRef(c.bankReference ?? "")
        setPaidChallanDialog(c)
    }
    const handleConfirmMarkPaid = () => {
        if (!paidChallanDialog) return
        markChallanPaid(paidChallanDialog.id, paidBankRef.trim() || undefined)
        toast({ title: "Challan marked paid", description: paidChallanDialog.challanNumber })
        setPaidChallanDialog(null)
        setPaidBankRef("")
    }

    const handleReconcile = (c: Challan) => {
        const res = reconcileChallan(c.id)
        setReconResult({ challan: c, matched: res.matched, variance: res.variance, notes: "" })
        toast({
            title: res.matched ? "Reconciled · matched" : "Reconciled · variance",
            description: res.matched ? `${c.challanNumber} matches expected` : `Variance of ${formatINR(res.variance)}`,
            variant: res.matched ? "default" : "destructive",
        })
    }

    const handleSaveReconNotes = () => {
        if (!reconResult) return
        reconcileChallan(reconResult.challan.id, reconResult.notes)
        addActivityLog({
            type: reconResult.challan.type,
            action: "Challan Reconciled",
            description: `${reconResult.challan.challanNumber} reconciled${reconResult.notes ? ` — ${reconResult.notes}` : ""}`,
            performedBy: "Finance",
            severity: reconResult.matched ? "success" : "warning",
        })
        setReconResult(null)
    }

    const handleDownloadChallanPDF = (c: Challan) => {
        // Stub: build a lightweight text payload and download as .pdf (not a real PDF).
        const lines = [
            `CHALLAN — ${c.type}`,
            `Number: ${c.challanNumber}`,
            `Period: ${c.period}`,
            `Amount: ${formatINR(c.amount)}`,
            `Employees: ${c.employeeCount}`,
            `Generated: ${c.generatedDate} by ${c.generatedBy}`,
            `Status: ${c.status}`,
            c.paidDate ? `Paid: ${c.paidDate}` : "",
            c.bankReference ? `Bank ref: ${c.bankReference}` : "",
        ].filter(Boolean).join("\n")
        const blob = new Blob([lines], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${c.challanNumber}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Challan PDF downloaded", description: c.challanNumber })
    }

    const handleReconcileAll = () => {
        const pending = challans.filter((c) => c.status !== "Reconciled")
        let matched = 0
        let variance = 0
        pending.forEach((c) => {
            const r = reconcileChallan(c.id)
            if (r.matched) matched += 1
            else variance += 1
        })
        addActivityLog({
            type: "PF",
            action: "Bulk Reconcile",
            description: `Reconciled ${pending.length} challan${pending.length === 1 ? "" : "s"} · ${matched} matched / ${variance} variance`,
            performedBy: "Finance",
            severity: variance > 0 ? "warning" : "success",
        })
        setBulkReconSummary({ matched, variance, total: pending.length })
    }

    const handleExportChallansCSV = () => {
        if (filteredChallans.length === 0) {
            toast({ title: "No challans to export", variant: "destructive" })
            return
        }
        const headers = ["Type", "Period", "Challan #", "Amount", "Employees", "Generated", "Status", "Paid Date", "Bank Ref", "Variance"]
        const rows = filteredChallans.map((c) => [
            c.type,
            c.period,
            c.challanNumber,
            c.amount,
            c.employeeCount,
            c.generatedDate,
            c.status,
            c.paidDate ?? "",
            c.bankReference ?? "",
            c.variance ?? 0,
        ])
        const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `statutory_challans_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Challans exported", description: `${filteredChallans.length} rows` })
    }

    // ── Exports ──────────────────────────────────────────
    const handleExportSummary = () => {
        const headers = ["Category", "Value", "Context"]
        const rows = kpis.map((k) => [k.label, k.val, k.trend])
        const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `statutory_summary_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Summary exported", description: "Compliance overview downloaded." })
    }

    const handleExportCalendar = () => {
        const headers = ["Type", "Title", "Description", "Due Date", "Status", "Completed By"]
        const rows = complianceEvents.map((e) => [
            e.type,
            `"${e.title}"`,
            `"${e.description ?? ""}"`,
            e.dueDate,
            e.status,
            e.completedBy ?? "",
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `compliance_calendar_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Calendar exported" })
    }

    // ── Helpers ──────────────────────────────────────────
    const statusColor = (s: string) => {
        switch (s) {
            case "Paid": case "Completed": case "Acknowledged": return "bg-emerald-50 text-emerald-600"
            case "Filed": return "bg-blue-50 text-blue-600"
            case "Pending": return "bg-amber-50 text-amber-600"
            case "Due Today": return "bg-rose-50 text-rose-600"
            case "Overdue": return "bg-rose-100 text-rose-700"
            case "Upcoming": return "bg-slate-50 text-slate-500"
            case "Not Applicable": return "bg-slate-100 text-slate-400"
            default: return "bg-slate-50 text-slate-500"
        }
    }

    const challanStatusBadge = (s: Challan["status"]) => {
        switch (s) {
            case "Generated": return "bg-slate-100 text-slate-600 border border-slate-200"
            case "Paid": return "bg-emerald-50 text-emerald-700 border border-emerald-200"
            case "Reconciled": return "bg-indigo-50 text-indigo-700 border border-indigo-200"
        }
    }

    const challanTypeIcon = (t: ChallanType) => {
        switch (t) {
            case "PF": return Landmark
            case "ESI": return ShieldCheck
            case "PT": return Building2
            case "TDS": return Banknote
            case "LWF": return Scale
        }
    }

    const daysUntilDue = (dateStr: string) => {
        const today = new Date()
        const due = new Date(dateStr)
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diff
    }

    // Health score "ring" – simple circular svg
    const HealthRing = ({ score, size = 72 }: { score: number; size?: number }) => {
        const stroke = 8
        const radius = (size - stroke) / 2
        const circ = 2 * Math.PI * radius
        const dash = (score / 100) * circ
        const color = scoreColor(score)
        return (
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color.ring}
                    strokeWidth={stroke}
                    strokeDasharray={`${dash} ${circ - dash}`}
                    strokeLinecap="round"
                />
            </svg>
        )
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Statutory Compliance</h1>
                            <p className="text-xs font-medium text-slate-500">
                                Indian labour law compliance dashboard
                                {upcomingDueCount > 0 && (
                                    <span className="ml-2 text-rose-600 font-semibold">• {upcomingDueCount} action needed</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={openAddEvent}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Plus size={14} /> <span className="hidden md:inline">Add event</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportSummary}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export summary</span>
                        </Button>
                        <Button
                            onClick={() => router.push("/hrmcubicle/payroll/statutory/pf")}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            File returns <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Health Score + KPIs */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Compliance health hero card */}
                            <Card
                                onClick={() => setHealthDialogOpen(true)}
                                className={cn(
                                    "lg:col-span-4 rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white via-white",
                                    health.overall >= 80 ? "to-emerald-50/40 border-emerald-100" : health.overall >= 60 ? "to-amber-50/40 border-amber-100" : "to-rose-50/40 border-rose-100"
                                )}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="relative shrink-0">
                                            <HealthRing score={health.overall} size={84} />
                                            <div className={cn("absolute inset-0 flex flex-col items-center justify-center", healthColor.text)}>
                                                <span className="text-xl font-bold tracking-tight tabular-nums">{health.overall}</span>
                                                <span className="text-[9px] font-semibold uppercase tracking-wider">score</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Gauge size={14} className={healthColor.text} />
                                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Compliance health</p>
                                            </div>
                                            <p className="text-base font-bold text-slate-900 mt-0.5">
                                                {health.overall >= 80 ? "Excellent shape" : health.overall >= 60 ? "Needs attention" : "Critical gaps"}
                                            </p>
                                            <div className="grid grid-cols-3 gap-2 mt-3">
                                                <div>
                                                    <p className="text-[9px] font-semibold text-slate-400 uppercase">On-time</p>
                                                    <p className="text-sm font-bold text-slate-800 tabular-nums">{health.onTimeFilingPercent}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-semibold text-slate-400 uppercase">Overdue</p>
                                                    <p className={cn("text-sm font-bold tabular-nums", health.overdueCount > 0 ? "text-rose-600" : "text-slate-800")}>{health.overdueCount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-semibold text-slate-400 uppercase">Reconciled</p>
                                                    <p className="text-sm font-bold text-slate-800 tabular-nums">{health.reconciledPercent}%</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                                                Click to view breakdown <ArrowRight size={10} />
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* KPIs grid */}
                            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {kpis.map((stat) => (
                                    <Card
                                        key={stat.label}
                                        onClick={() => router.push(stat.path)}
                                        className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start gap-2 mb-3">
                                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}14`, color: stat.color }}>
                                                    <stat.icon size={18} />
                                                </div>
                                                <ArrowRight size={12} className="text-slate-300" />
                                            </div>
                                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                            <p className="text-xl font-bold text-slate-900 tracking-tight tabular-nums mt-0.5">{stat.val}</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">{stat.trend}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Quick modules */}
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 mb-3">Quick access</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {modules.map((m) => (
                                    <Card
                                        key={m.label}
                                        onClick={() => router.push(m.path)}
                                        className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${m.color}14`, color: m.color }}>
                                                    <m.icon size={18} />
                                                </div>
                                                <ArrowRight size={14} className="text-slate-300 group-hover:text-[#8B5CF6] transition-colors" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">{m.label}</p>
                                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{m.desc}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Compliance calendar */}
                            <Card className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col gap-3 space-y-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={16} className="text-[#8B5CF6]" />
                                            <CardTitle className="text-base font-bold text-slate-900">Compliance calendar</CardTitle>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExportCalendar}
                                            className="h-7 rounded-lg border-slate-200 text-[11px] font-semibold gap-1 px-2"
                                        >
                                            <Download size={12} />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Select value={eventStatusFilter} onValueChange={setEventStatusFilter}>
                                            <SelectTrigger className="h-8 w-32 rounded-lg text-xs font-semibold"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="overdue">Overdue / Due</SelectItem>
                                                <SelectItem value="all">All events</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                                            <SelectTrigger className="h-8 w-28 rounded-lg text-xs font-semibold"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All types</SelectItem>
                                                <SelectItem value="PF">PF</SelectItem>
                                                <SelectItem value="ESI">ESI</SelectItem>
                                                <SelectItem value="PT">PT</SelectItem>
                                                <SelectItem value="TDS">TDS</SelectItem>
                                                <SelectItem value="LWF">LWF</SelectItem>
                                                <SelectItem value="Form16">Form 16</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Badge className="bg-slate-50 text-slate-500 border-none text-[10px] font-semibold">
                                            {filteredEvents.length} events
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[420px]">
                                        <div className="p-3 space-y-2">
                                            {filteredEvents.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                                                    No events match the current filters.
                                                </div>
                                            ) : (
                                                filteredEvents.map((ev) => {
                                                    const days = daysUntilDue(ev.dueDate)
                                                    const isCompleted = ev.status === "Completed"
                                                    return (
                                                        <div
                                                            key={ev.id}
                                                            className={cn(
                                                                "flex items-start gap-3 p-3 rounded-xl border transition-colors",
                                                                isCompleted ? "bg-emerald-50/40 border-emerald-100" : "bg-slate-50/50 border-slate-100 hover:bg-white"
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                                                    statusColor(ev.status)
                                                                )}
                                                            >
                                                                {isCompleted ? <CheckCircle2 size={14} /> :
                                                                    ev.status === "Overdue" || ev.status === "Due Today" ? <AlertTriangle size={14} /> :
                                                                        <Clock size={14} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[9px] font-bold">
                                                                        {ev.type}
                                                                    </Badge>
                                                                    <p className="text-xs font-bold text-slate-800 truncate">{ev.title}</p>
                                                                </div>
                                                                {ev.description && (
                                                                    <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">{ev.description}</p>
                                                                )}
                                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                    <span className="text-[10px] font-semibold text-slate-400">
                                                                        {new Date(ev.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                                    </span>
                                                                    {!isCompleted && (
                                                                        <span className={cn("text-[10px] font-bold",
                                                                            days < 0 ? "text-rose-600" : days === 0 ? "text-rose-600" : days <= 3 ? "text-amber-600" : "text-slate-500"
                                                                        )}>
                                                                            {days < 0 ? `Overdue by ${Math.abs(days)}d` : days === 0 ? "Due today" : `in ${days}d`}
                                                                        </span>
                                                                    )}
                                                                    {isCompleted && ev.completedBy && (
                                                                        <span className="text-[10px] font-medium text-emerald-600">
                                                                            by {ev.completedBy}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 shrink-0">
                                                                {!isCompleted && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() => handleCompleteEvent(ev)}
                                                                                className="h-7 w-7 p-0 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                                                            >
                                                                                <CheckCircle2 size={13} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Mark complete</TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="ghost" onClick={() => openEditEvent(ev)} className="h-7 w-7 p-0 text-slate-400 hover:text-[#8B5CF6]">
                                                                            <Activity size={13} />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Edit</TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(ev.id)} className="h-7 w-7 p-0 text-slate-400 hover:text-rose-500">
                                                                            <Trash2 size={13} />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Delete</TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Recent activity */}
                            <Card className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 gap-2">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} className="text-emerald-500" />
                                        <CardTitle className="text-base font-bold text-slate-900">Recent activity</CardTitle>
                                    </div>
                                    <Badge className="bg-slate-50 text-slate-500 border-none text-[10px] font-semibold">
                                        {activityLogs.length}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[420px]">
                                        <div className="p-3 space-y-2">
                                            {activityLogs.length === 0 ? (
                                                <div className="p-6 text-center text-slate-400 text-xs font-medium">No activity yet.</div>
                                            ) : (
                                                activityLogs.map((log) => (
                                                    <div key={log.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/60 border border-slate-100">
                                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                                            log.severity === "success" ? "bg-emerald-50 text-emerald-500" :
                                                                log.severity === "warning" ? "bg-amber-50 text-amber-500" :
                                                                    "bg-blue-50 text-blue-500"
                                                        )}>
                                                            {log.severity === "warning" ? <Bell size={11} /> : <CheckCircle2 size={11} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-bold px-1.5">
                                                                    {log.type}
                                                                </Badge>
                                                                <span className="text-[11px] font-bold text-slate-700">{log.action}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium text-slate-600 mt-1 leading-snug">{log.description}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 mt-1">
                                                                {new Date(log.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                                                                {log.performedBy && ` • ${log.performedBy}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Monthly filings */}
                            <Card className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col gap-2 space-y-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-blue-500" />
                                            <CardTitle className="text-base font-bold text-slate-900">Monthly filings</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={monthlyFilings.length > 0 && selectedFilingIds.length === monthlyFilings.length}
                                                onCheckedChange={(v) => toggleAllFilings(!!v)}
                                                className="h-4 w-4"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFilingDialogOpen(true)}
                                                className="h-7 rounded-lg border-slate-200 text-[11px] font-semibold gap-1 px-2"
                                            >
                                                <Plus size={12} /> Add
                                            </Button>
                                        </div>
                                    </div>
                                    {selectedFilingIds.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-lg bg-[#8B5CF6]/5 border border-[#8B5CF6]/20">
                                            <span className="text-[10px] font-bold text-[#8B5CF6] mr-1">{selectedFilingIds.length} selected:</span>
                                            {(["pf", "esi", "pt", "tds", "lwf"] as const).map((t) => (
                                                <Button
                                                    key={t}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleBulkMarkFiled(t)}
                                                    className="h-6 rounded-md border-slate-200 text-[10px] font-semibold px-2 bg-white hover:bg-slate-50"
                                                >
                                                    <FileCheck size={10} className="mr-1" /> {t.toUpperCase()}
                                                </Button>
                                            ))}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setSelectedFilingIds([])}
                                                className="h-6 rounded-md text-[10px] font-semibold px-2 text-slate-500"
                                            >
                                                <X size={10} />
                                            </Button>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[420px]">
                                        <div className="p-3 space-y-3">
                                            {monthlyFilings.length === 0 ? (
                                                <div className="p-6 text-center text-slate-400 text-xs font-medium">No filings tracked. Click "Add".</div>
                                            ) : (
                                                monthlyFilings.map((f) => {
                                                    const statuses = [
                                                        { key: "pf" as const, label: "PF", value: f.pfStatus },
                                                        { key: "esi" as const, label: "ESI", value: f.esiStatus },
                                                        { key: "pt" as const, label: "PT", value: f.ptStatus },
                                                        { key: "tds" as const, label: "TDS", value: f.tdsStatus },
                                                    ]
                                                    const isSelected = selectedFilingIds.includes(f.id)
                                                    return (
                                                        <div key={f.id} className={cn(
                                                            "p-3 rounded-xl border transition-colors",
                                                            isSelected ? "bg-[#8B5CF6]/5 border-[#8B5CF6]/30" : "bg-slate-50/50 border-slate-100"
                                                        )}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Checkbox
                                                                        checked={isSelected}
                                                                        onCheckedChange={(v) => toggleFilingSelection(f.id, !!v)}
                                                                        className="h-4 w-4"
                                                                    />
                                                                    <span className="text-xs font-bold text-slate-800">{f.month}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {f.filedBy && <span className="text-[10px] font-medium text-slate-400">by {f.filedBy}</span>}
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="sm" onClick={() => deleteMonthlyFiling(f.id)} className="h-6 w-6 p-0 text-slate-300 hover:text-rose-500">
                                                                                <X size={12} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Remove row</TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 gap-1.5">
                                                                {statuses.map((s) => (
                                                                    <button
                                                                        key={s.key}
                                                                        onClick={() => handleBumpFilingStatus(f, s.key)}
                                                                        className={cn(
                                                                            "px-2 py-1.5 rounded-md text-[10px] font-bold border transition-all hover:shadow-sm text-left",
                                                                            s.value === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                                s.value === "Filed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                                    "bg-amber-50 text-amber-700 border-amber-200"
                                                                        )}
                                                                    >
                                                                        <div className="text-[9px] uppercase tracking-wider">{s.label}</div>
                                                                        <div className="truncate">{s.value}</div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <p className="text-[10px] font-medium text-slate-400 italic mt-2">
                                                                Click any cell to cycle: Pending → Filed → Paid → Pending.
                                                            </p>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Challans & payments */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col gap-3 space-y-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Coins size={16} className="text-[#8B5CF6]" />
                                        <CardTitle className="text-base font-bold text-slate-900">Challans & payments</CardTitle>
                                        <Badge className="bg-slate-50 text-slate-500 border-none text-[10px] font-semibold">{filteredChallans.length}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleReconcileAll}
                                            className="h-8 rounded-lg border-slate-200 text-[11px] font-semibold gap-1 px-3 hover:bg-indigo-50 hover:text-indigo-600"
                                        >
                                            <ScanLine size={12} /> Reconcile all unreconciled
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExportChallansCSV}
                                            className="h-8 rounded-lg border-slate-200 text-[11px] font-semibold gap-1 px-3"
                                        >
                                            <Download size={12} /> Export
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 rounded-lg border-slate-200 text-[11px] font-semibold gap-1 px-3"
                                                >
                                                    <Wand2 size={12} /> Quick generate
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuLabel className="text-[10px] font-semibold text-slate-500">For current period</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {(["PF", "ESI", "PT", "TDS", "LWF"] as ChallanType[]).map((t) => (
                                                    <DropdownMenuItem key={t} onClick={() => handleQuickGenerate(t)} className="text-xs font-semibold">
                                                        <Shield size={12} className="mr-2 text-[#8B5CF6]" /> {t} challan
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                            size="sm"
                                            onClick={() => setGenChallanOpen(true)}
                                            className="h-8 rounded-lg bg-[#8B5CF6] hover:bg-[#7c4dff] text-white text-[11px] font-bold gap-1 px-3 border-none"
                                        >
                                            <Plus size={12} /> Generate challan
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Select value={challanTypeFilter} onValueChange={setChallanTypeFilter}>
                                        <SelectTrigger className="h-8 w-28 rounded-lg text-xs font-semibold"><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All types</SelectItem>
                                            <SelectItem value="PF">PF</SelectItem>
                                            <SelectItem value="ESI">ESI</SelectItem>
                                            <SelectItem value="PT">PT</SelectItem>
                                            <SelectItem value="TDS">TDS</SelectItem>
                                            <SelectItem value="LWF">LWF</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={challanStatusFilter} onValueChange={setChallanStatusFilter}>
                                        <SelectTrigger className="h-8 w-32 rounded-lg text-xs font-semibold"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            <SelectItem value="Generated">Generated</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Reconciled">Reconciled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={challanPeriodFilter} onValueChange={setChallanPeriodFilter}>
                                        <SelectTrigger className="h-8 w-36 rounded-lg text-xs font-semibold"><SelectValue placeholder="Period" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All periods</SelectItem>
                                            {uniqueChallanPeriods.map((p) => (
                                                <SelectItem key={p} value={p}>{p}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="max-h-[440px]">
                                    {filteredChallans.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-xs font-medium">No challans match the current filters.</div>
                                    ) : (
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/60 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Period</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Challan #</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Employees</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Generated</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredChallans.map((c) => {
                                                    const Icon = challanTypeIcon(c.type)
                                                    return (
                                                        <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/40">
                                                            <td className="px-4 py-2.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-7 w-7 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                                                                        <Icon size={13} />
                                                                    </div>
                                                                    <span className="text-xs font-bold text-slate-800">{c.type}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2.5 text-xs font-semibold text-slate-700">{c.period}</td>
                                                            <td className="px-4 py-2.5 text-xs font-mono text-slate-600">{c.challanNumber}</td>
                                                            <td className="px-4 py-2.5 text-xs font-bold text-slate-800 tabular-nums text-right">{formatINR(c.amount)}</td>
                                                            <td className="px-4 py-2.5 text-xs font-semibold text-slate-600 tabular-nums text-right">{c.employeeCount}</td>
                                                            <td className="px-4 py-2.5 text-xs font-medium text-slate-500">
                                                                {new Date(c.generatedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                                <span className="block text-[10px] text-slate-400">by {c.generatedBy}</span>
                                                            </td>
                                                            <td className="px-4 py-2.5">
                                                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold", challanStatusBadge(c.status))}>
                                                                    {c.status === "Reconciled" ? <CheckCircle2 size={10} /> :
                                                                        c.status === "Paid" ? <Banknote size={10} /> :
                                                                            <FileText size={10} />}
                                                                    {c.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2.5 text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-[#8B5CF6]">
                                                                            <MoreHorizontal size={14} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="rounded-xl">
                                                                        <DropdownMenuItem onClick={() => handleOpenMarkPaid(c)} className="text-xs font-semibold" disabled={c.status !== "Generated"}>
                                                                            <Banknote size={12} className="mr-2 text-emerald-500" /> Mark paid
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleReconcile(c)} className="text-xs font-semibold" disabled={c.status === "Reconciled"}>
                                                                            <ScanLine size={12} className="mr-2 text-indigo-500" /> Reconcile
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDownloadChallanPDF(c)} className="text-xs font-semibold">
                                                                            <Download size={12} className="mr-2 text-slate-500" /> Download PDF
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem onClick={() => { deleteChallan(c.id); toast({ title: "Challan deleted", description: c.challanNumber, variant: "destructive" }) }} className="text-xs font-semibold text-rose-600 focus:text-rose-700">
                                                                            <Trash2 size={12} className="mr-2" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Event Dialog */}
                <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <CalendarDays size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingEvent ? "Edit event" : "Add compliance event"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Track regulatory deadlines with type, date, and notes.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Type" required>
                                    <Select value={eventForm.type} onValueChange={(v) => setEventForm({ ...eventForm, type: v as any })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PF">PF</SelectItem>
                                            <SelectItem value="ESI">ESI</SelectItem>
                                            <SelectItem value="PT">PT</SelectItem>
                                            <SelectItem value="TDS">TDS</SelectItem>
                                            <SelectItem value="LWF">LWF</SelectItem>
                                            <SelectItem value="Form16">Form 16</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Status" required>
                                    <Select value={eventForm.status} onValueChange={(v) => setEventForm({ ...eventForm, status: v as any })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                            <SelectItem value="Due Today">Due Today</SelectItem>
                                            <SelectItem value="Overdue">Overdue</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            <FormField label="Title" required>
                                <Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. PF ECR Filing - April 2026" />
                            </FormField>
                            <FormField label="Description">
                                <Textarea value={eventForm.description ?? ""} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="min-h-[60px] text-xs font-medium" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Due date" required>
                                    <Input type="date" value={eventForm.dueDate} onChange={(e) => setEventForm({ ...eventForm, dueDate: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                                <FormField label="Related month">
                                    <Input value={eventForm.relatedMonth ?? ""} onChange={(e) => setEventForm({ ...eventForm, relatedMonth: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. March 2026" />
                                </FormField>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setEventDialogOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveEvent} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingEvent ? "Save" : "Add event"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* New monthly filing dialog */}
                <Dialog open={filingDialogOpen} onOpenChange={setFilingDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <FileText size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Add month to tracker</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Start tracking PF/ESI/PT/TDS filing status for a new month.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Month label" required>
                                <Input value={filingForm.month} onChange={(e) => setFilingForm({ ...filingForm, month: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. April 2026" />
                            </FormField>
                            <p className="text-[11px] font-medium text-slate-500">
                                All statuses start as "Pending". Click any cell in the tracker to cycle through Pending → Filed → Paid.
                            </p>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setFilingDialogOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveFiling} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Add to tracker
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Compliance Health Detail Dialog */}
                <Dialog open={healthDialogOpen} onOpenChange={setHealthDialogOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-2", healthColor.bg, healthColor.text)}>
                                <Gauge size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Compliance health breakdown</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Live score synthesised from filings, challans, and calendar events.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-5">
                            {/* Overall hero */}
                            <div className={cn("flex items-center gap-4 p-4 rounded-xl border", healthColor.bg, healthColor.border)}>
                                <div className="relative">
                                    <HealthRing score={health.overall} size={96} />
                                    <div className={cn("absolute inset-0 flex flex-col items-center justify-center", healthColor.text)}>
                                        <span className="text-2xl font-bold tabular-nums">{health.overall}</span>
                                        <span className="text-[9px] font-semibold uppercase tracking-wider">/ 100</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">
                                        {health.overall >= 80 ? "Excellent compliance posture" : health.overall >= 60 ? "Some gaps to address" : "Immediate action required"}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 mt-1">
                                        Score factors: on-time filing %, reconciled challan %, and open overdue events (each -5).
                                    </p>
                                </div>
                            </div>

                            {/* Per-type bars */}
                            <div className="space-y-3">
                                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Per-type scores</p>
                                {[
                                    { label: "Provident Fund", val: health.pfScore, icon: Landmark },
                                    { label: "ESI", val: health.esiScore, icon: ShieldCheck },
                                    { label: "Professional Tax", val: health.ptScore, icon: Building2 },
                                    { label: "TDS", val: health.tdsScore, icon: Banknote },
                                ].map((row) => {
                                    const c = scoreColor(row.val)
                                    return (
                                        <div key={row.label} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <row.icon size={12} className={c.text} />
                                                    <span className="text-xs font-semibold text-slate-700">{row.label}</span>
                                                </div>
                                                <span className={cn("text-xs font-bold tabular-nums", c.text)}>{row.val}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div className={cn("h-full rounded-full transition-all", c.softBg)} style={{ width: `${row.val}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">On-time filing</p>
                                    <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">{health.onTimeFilingPercent}%</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Across all tracked months</p>
                                </div>
                                <button
                                    onClick={() => { setHealthDialogOpen(false); setEventStatusFilter("overdue") }}
                                    className={cn(
                                        "p-3 rounded-xl border text-left hover:shadow-sm transition-all",
                                        health.overdueCount > 0 ? "bg-rose-50 border-rose-100" : "bg-slate-50 border-slate-100"
                                    )}
                                >
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overdue events</p>
                                    <p className={cn("text-xl font-bold tabular-nums mt-1", health.overdueCount > 0 ? "text-rose-600" : "text-slate-900")}>{health.overdueCount}</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Click to view calendar</p>
                                </button>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reconciled</p>
                                    <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">{health.reconciledPercent}%</p>
                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{challans.filter((c) => c.status === "Reconciled").length} / {challans.length} challans</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button onClick={() => setHealthDialogOpen(false)} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Generate Challan Dialog */}
                <Dialog open={genChallanOpen} onOpenChange={setGenChallanOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Wand2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Generate challan</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Build a new challan from matching records for the chosen period.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Type" required>
                                    <Select value={genChallanType} onValueChange={(v) => setGenChallanType(v as ChallanType)}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PF">PF</SelectItem>
                                            <SelectItem value="ESI">ESI</SelectItem>
                                            <SelectItem value="PT">PT</SelectItem>
                                            <SelectItem value="TDS">TDS</SelectItem>
                                            <SelectItem value="LWF">LWF</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Period" required>
                                    <Input value={genChallanPeriod} onChange={(e) => setGenChallanPeriod(e.target.value)} className="h-10 text-sm font-medium" placeholder="e.g. Mar 2026" />
                                </FormField>
                            </div>
                            {/* Preview */}
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preview</p>
                                {(() => {
                                    let estAmount = 0
                                    let estEmployees = 0
                                    if (genChallanType === "PF") {
                                        const recs = pfRecords.filter((r) => r.month === genChallanPeriod)
                                        estAmount = recs.reduce((s, r) => s + r.employeeContribution + r.employerContribution, 0)
                                        estEmployees = recs.length
                                    } else if (genChallanType === "ESI") {
                                        const recs = esiRecords.filter((r) => r.month === genChallanPeriod)
                                        estAmount = recs.reduce((s, r) => s + r.esiEmployee + r.esiEmployer, 0)
                                        estEmployees = recs.length
                                    } else if (genChallanType === "PT") {
                                        const recs = ptRecords.filter((r) => r.month === genChallanPeriod)
                                        estAmount = recs.reduce((s, r) => s + r.ptDeduction, 0)
                                        estEmployees = recs.length
                                    } else if (genChallanType === "LWF") {
                                        const recs = lwfRecords.filter((r) => r.period === genChallanPeriod)
                                        estAmount = recs.reduce((s, r) => s + r.employeeContribution + r.employerContribution, 0)
                                        estEmployees = recs.length
                                    }
                                    return (
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <div>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Amount</p>
                                                <p className="text-base font-bold text-slate-900 tabular-nums">{estAmount > 0 ? formatINR(estAmount) : "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase">Employees</p>
                                                <p className="text-base font-bold text-slate-900 tabular-nums">{estEmployees || "—"}</p>
                                            </div>
                                            {estAmount === 0 && (
                                                <p className="col-span-2 text-[11px] font-medium text-amber-600">
                                                    No matching records — amount will be auto-estimated.
                                                </p>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setGenChallanOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleGenerateChallan} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Generate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Mark Challan Paid Dialog */}
                <Dialog open={!!paidChallanDialog} onOpenChange={(o) => { if (!o) { setPaidChallanDialog(null); setPaidBankRef("") } }}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                                <Banknote size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Mark challan paid</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Record the bank transaction reference and today's date.
                            </DialogDescription>
                        </DialogHeader>
                        {paidChallanDialog && (
                            <div className="mt-4 space-y-3">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{paidChallanDialog.type} · {paidChallanDialog.period}</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1 font-mono">{paidChallanDialog.challanNumber}</p>
                                    <p className="text-xl font-bold text-slate-900 tabular-nums mt-1">{formatINR(paidChallanDialog.amount)}</p>
                                </div>
                                <FormField label="Bank reference">
                                    <Input value={paidBankRef} onChange={(e) => setPaidBankRef(e.target.value)} className="h-10 text-sm font-medium" placeholder="e.g. HDFC-TXN-5A6B7C" />
                                </FormField>
                                <FormField label="Paid date">
                                    <Input disabled value={new Date().toISOString().split("T")[0]} className="h-10 text-sm font-medium bg-slate-50" />
                                </FormField>
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => { setPaidChallanDialog(null); setPaidBankRef("") }} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmMarkPaid} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Confirm payment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reconcile Result Dialog */}
                <Dialog open={!!reconResult} onOpenChange={(o) => { if (!o) setReconResult(null) }}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center mb-2",
                                reconResult?.matched ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                <ScanLine size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Reconciliation result</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {reconResult?.matched ? "Bank amount matches expected amount." : "Variance detected — review below."}
                            </DialogDescription>
                        </DialogHeader>
                        {reconResult && (
                            <div className="mt-4 space-y-3">
                                <div className={cn(
                                    "p-3 rounded-xl border",
                                    reconResult.matched ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
                                )}>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</p>
                                        <Badge className={cn(
                                            "text-[10px] font-bold border-none",
                                            reconResult.matched ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                        )}>
                                            {reconResult.matched ? "MATCHED" : "VARIANCE"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-mono font-bold text-slate-900 mt-2">{reconResult.challan.challanNumber}</p>
                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Amount</p>
                                            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatINR(reconResult.challan.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Variance</p>
                                            <p className={cn(
                                                "text-sm font-bold tabular-nums",
                                                reconResult.matched ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {reconResult.variance >= 0 ? "+" : ""}{formatINR(reconResult.variance)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <FormField label="Reconciliation notes">
                                    <Textarea
                                        value={reconResult.notes}
                                        onChange={(e) => setReconResult({ ...reconResult, notes: e.target.value })}
                                        className="min-h-[70px] text-xs font-medium"
                                        placeholder="Optional notes explaining the variance or approvals."
                                    />
                                </FormField>
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setReconResult(null)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveReconNotes} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Save notes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Reconcile Summary Dialog */}
                <Dialog open={!!bulkReconSummary} onOpenChange={(o) => { if (!o) setBulkReconSummary(null) }}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2">
                                <ScanLine size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Bulk reconcile summary</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                All unreconciled challans have been processed.
                            </DialogDescription>
                        </DialogHeader>
                        {bulkReconSummary && (
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Processed</p>
                                    <p className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{bulkReconSummary.total}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                                    <p className="text-[10px] font-bold text-emerald-700 uppercase">Matched</p>
                                    <p className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">{bulkReconSummary.matched}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                                    <p className="text-[10px] font-bold text-rose-700 uppercase">Variance</p>
                                    <p className="text-2xl font-bold text-rose-700 tabular-nums mt-1">{bulkReconSummary.variance}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkReconSummary(null)} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {children}
    </div>
)

export default StatutoryDashboard
