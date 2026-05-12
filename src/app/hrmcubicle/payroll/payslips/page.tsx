"use client"

import React, { useState, useMemo, useRef } from "react"
import {
    FileText,
    Download,
    Mail,
    Eye,
    Layout,
    Search,
    CheckCircle2,
    MoreHorizontal,
    Printer,
    Lock,
    RotateCcw,
    Send,
    Trash2,
    Calendar,
    Users,
    X,
    Plus,
    Zap,
    AlertCircle,
    Edit,
    Settings,
    Filter,
    Wallet,
    ChevronDown,
    Building2,
    KeyRound,
    Shield,
    Sparkles,
    GitCompareArrows,
    XCircle,
    Check,
    Palette,
    Inbox,
    CircleCheckBig,
    TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Label } from "@/shared/components/ui/label"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { usePayrollStore, type Payslip, type PayslipTemplate, type PayslipTemplateDesign, type PayslipEmailStatus } from "@/shared/data/payroll-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt?: number) => `₹${Math.round(amt ?? 0).toLocaleString("en-IN")}`

const emptyPayslipForm: Omit<Payslip, "id"> = {
    empCode: "",
    employeeName: "",
    employeeId: "",
    dept: "",
    designation: "",
    month: "",
    basic: 0,
    hra: 0,
    specialAllowance: 0,
    conveyance: 0,
    medicalAllowance: 0,
    variable: 0,
    lopDays: 0,
    otHours: 0,
    otAmount: 0,
    lopDeduction: 0,
    grossEarnings: 0,
    pf: 0,
    esi: 0,
    pt: 0,
    tds: 0,
    otherDeductions: 0,
    totalDeductions: 0,
    netAmount: 0,
    bankAccount: "",
    ifsc: "",
    email: "",
    status: "Pending",
    notes: "",
}

const PayslipsPage = () => {
    const {
        payRuns,
        payslips,
        payrollEmployees,
        payslipTemplate,
        addPayslip,
        updatePayslip,
        updatePayslipStatus,
        deletePayslip,
        bulkUpdatePayslipStatus,
        bulkDeletePayslips,
        generatePayslipsFromRun,
        regeneratePayslip,
        updatePayslipTemplate,
        // Round 2
        sendPayslipEmail,
        bulkSendPayslipEmails,
        setPayslipTemplateDesign,
        setPayslipPasswordProtection,
        bulkSetPayslipTemplateDesign,
        recomputePayslipYtd,
    } = usePayrollStore()
    const { toast } = useToast()

    // ── Pay run selection ──────────────────────────────────
    const defaultRun = useMemo(
        () => payRuns.find((r) => r.status === "Draft" || r.status === "Processing") || payRuns[0],
        [payRuns]
    )
    const [selectedRunId, setSelectedRunId] = useState<string>(defaultRun?.id || "")
    const activeRun = payRuns.find((r) => r.id === selectedRunId) || defaultRun
    const activeMonth = activeRun?.month ?? ""

    // ── UI state ───────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [deptFilter, setDeptFilter] = useState<string>("all")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // ── Dialog state ───────────────────────────────────────
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [emailOpen, setEmailOpen] = useState(false)
    const [templateOpen, setTemplateOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

    const [currentPayslip, setCurrentPayslip] = useState<Payslip | null>(null)
    const [newPayslipForm, setNewPayslipForm] = useState<Omit<Payslip, "id">>(emptyPayslipForm)
    const [editForm, setEditForm] = useState<Payslip | null>(null)
    const [templateForm, setTemplateForm] = useState<PayslipTemplate>(payslipTemplate)

    const printFrameRef = useRef<HTMLIFrameElement>(null)

    // ─ Round 2 state ─
    const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false)
    const [bulkEmailResult, setBulkEmailResult] = useState<{ sent: number; failed: number } | null>(null)
    const [emailStatusDialogOpen, setEmailStatusDialogOpen] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [passwordTarget, setPasswordTarget] = useState<Payslip | null>(null)
    const [passwordEnabled, setPasswordEnabled] = useState(false)
    const [passwordHint, setPasswordHint] = useState("PAN number")
    const [bulkTemplateDialogOpen, setBulkTemplateDialogOpen] = useState(false)
    const [bulkTemplateDesign, setBulkTemplateDesign] = useState<PayslipTemplateDesign>("modern")
    const [compareOpen, setCompareOpen] = useState(false)
    const [comparePayslipId, setComparePayslipId] = useState<string>("")

    // ── Derived data ───────────────────────────────────────
    const monthPayslips = useMemo(
        () => payslips.filter((p) => p.month === activeMonth),
        [payslips, activeMonth]
    )

    const filteredPayslips = useMemo(() => {
        return monthPayslips.filter((p) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                if (!p.employeeName.toLowerCase().includes(q) &&
                    !(p.employeeId ?? "").toLowerCase().includes(q) &&
                    !(p.empCode ?? "").toLowerCase().includes(q) &&
                    !(p.dept ?? "").toLowerCase().includes(q)) return false
            }
            if (statusFilter !== "all" && p.status !== statusFilter) return false
            if (deptFilter !== "all" && p.dept !== deptFilter) return false
            return true
        })
    }, [monthPayslips, searchQuery, statusFilter, deptFilter])

    const stats = useMemo(() => {
        return {
            total: monthPayslips.length,
            generated: monthPayslips.filter((p) => p.status === "Generated").length,
            distributed: monthPayslips.filter((p) => p.status === "Distributed").length,
            pending: monthPayslips.filter((p) => p.status === "Pending").length,
            totalAmount: monthPayslips.reduce((s, p) => s + (p.netAmount || 0), 0),
        }
    }, [monthPayslips])

    const availableDepts = useMemo(
        () => Array.from(new Set(monthPayslips.map((p) => p.dept).filter(Boolean) as string[])),
        [monthPayslips]
    )

    const runEmpsNotYetPayslipped = useMemo(() => {
        if (!activeRun) return 0
        const existingKeys = new Set(
            payslips.filter((p) => p.payRunId === activeRun.id).map((p) => p.empCode ?? p.employeeId)
        )
        return payrollEmployees.filter(
            (e) => e.payRunId === activeRun.id && e.included && !existingKeys.has(e.empCode)
        ).length
    }, [payrollEmployees, payslips, activeRun])

    // ── Handlers ───────────────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visible = filteredPayslips.map((p) => p.id)
        const allSel = visible.every((id) => selectedIds.includes(id))
        if (allSel) {
            setSelectedIds((prev) => prev.filter((id) => !visible.includes(id)))
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...visible])))
        }
    }

    const handleGenerateFromRun = () => {
        if (!activeRun) return
        const count = generatePayslipsFromRun(activeRun.id)
        if (count === 0) {
            toast({
                title: "Nothing to generate",
                description: "All eligible employees already have payslips for this cycle.",
            })
            return
        }
        toast({
            title: `Generated ${count} payslip${count > 1 ? "s" : ""}`,
            description: `Pulled from ${activeRun.month} pay run data.`,
        })
    }

    const handleAddManual = () => {
        if (!newPayslipForm.employeeName || !newPayslipForm.employeeId || !newPayslipForm.month) {
            toast({
                title: "Missing fields",
                description: "Employee name, ID, and month are required.",
                variant: "destructive",
            })
            return
        }
        const gross = (newPayslipForm.basic ?? 0) + (newPayslipForm.hra ?? 0) + (newPayslipForm.specialAllowance ?? 0) +
            (newPayslipForm.conveyance ?? 0) + (newPayslipForm.medicalAllowance ?? 0) + (newPayslipForm.variable ?? 0) +
            (newPayslipForm.otAmount ?? 0) - (newPayslipForm.lopDeduction ?? 0)
        const deductions = (newPayslipForm.pf ?? 0) + (newPayslipForm.esi ?? 0) + (newPayslipForm.pt ?? 0) +
            (newPayslipForm.tds ?? 0) + (newPayslipForm.otherDeductions ?? 0)
        addPayslip({
            ...newPayslipForm,
            grossEarnings: Math.round(gross),
            totalDeductions: Math.round(deductions),
            netAmount: Math.round(gross - deductions),
            payRunId: activeRun?.id,
        })
        toast({ title: "Payslip added", description: `${newPayslipForm.employeeName} added for ${newPayslipForm.month}.` })
        setNewPayslipForm({ ...emptyPayslipForm, month: activeMonth })
        setAddDialogOpen(false)
    }

    const handleSaveEdit = () => {
        if (!editForm) return
        const gross = (editForm.basic ?? 0) + (editForm.hra ?? 0) + (editForm.specialAllowance ?? 0) +
            (editForm.conveyance ?? 0) + (editForm.medicalAllowance ?? 0) + (editForm.variable ?? 0) +
            (editForm.otAmount ?? 0) - (editForm.lopDeduction ?? 0)
        const deductions = (editForm.pf ?? 0) + (editForm.esi ?? 0) + (editForm.pt ?? 0) +
            (editForm.tds ?? 0) + (editForm.otherDeductions ?? 0)
        updatePayslip(editForm.id, {
            ...editForm,
            grossEarnings: Math.round(gross),
            totalDeductions: Math.round(deductions),
            netAmount: Math.round(gross - deductions),
        })
        toast({ title: "Saved", description: `${editForm.employeeName}'s payslip updated.` })
        setEditDialogOpen(false)
        setEditForm(null)
    }

    const handleBulkGenerate = () => {
        if (!selectedIds.length) return
        bulkUpdatePayslipStatus(selectedIds, "Generated")
        toast({
            title: `Generated ${selectedIds.length} payslip${selectedIds.length > 1 ? "s" : ""}`,
            description: "Status updated in store.",
        })
        setSelectedIds([])
    }

    const handleBulkDistribute = () => {
        if (!selectedIds.length) return
        bulkUpdatePayslipStatus(selectedIds, "Distributed")
        toast({
            title: `Distributed ${selectedIds.length} payslip${selectedIds.length > 1 ? "s" : ""}`,
            description: "Email sent to employees.",
        })
        setSelectedIds([])
    }

    const handleBulkRegenerate = () => {
        if (!selectedIds.length) return
        selectedIds.forEach((id) => regeneratePayslip(id))
        toast({
            title: `Regenerated ${selectedIds.length}`,
            description: "Pulled fresh data from pay run.",
        })
        setSelectedIds([])
    }

    // ─── Round 2 handlers ────────────────────────────────
    const handleSendEmailSingle = (ps: Payslip) => {
        const result = sendPayslipEmail(ps.id)
        if (result.success) {
            toast({ title: "Email sent", description: `${ps.employeeName} received payslip via ${ps.email}` })
        } else {
            toast({ title: "Email failed", description: result.reason ?? "Unknown error", variant: "destructive" })
        }
    }

    const handleBulkSendEmail = () => {
        if (!selectedIds.length) return
        const result = bulkSendPayslipEmails(selectedIds)
        setBulkEmailResult(result)
        setBulkEmailDialogOpen(true)
        setSelectedIds([])
    }

    const openPasswordDialog = (ps: Payslip) => {
        setPasswordTarget(ps)
        setPasswordEnabled(ps.passwordProtected ?? false)
        setPasswordHint(ps.passwordHint ?? "PAN number")
        setPasswordDialogOpen(true)
    }

    const handleSavePassword = () => {
        if (!passwordTarget) return
        setPayslipPasswordProtection(passwordTarget.id, passwordEnabled, passwordEnabled ? passwordHint : undefined)
        toast({
            title: passwordEnabled ? "Password protection enabled" : "Password protection removed",
            description: passwordEnabled ? `Hint: ${passwordHint}` : undefined,
        })
        setPasswordDialogOpen(false)
        setPasswordTarget(null)
    }

    const handleSetTemplate = (ps: Payslip, design: PayslipTemplateDesign) => {
        setPayslipTemplateDesign(ps.id, design)
        toast({ title: `Template set to ${design}`, description: ps.employeeName })
    }

    const handleBulkSetTemplate = () => {
        if (!selectedIds.length) return
        bulkSetPayslipTemplateDesign(selectedIds, bulkTemplateDesign)
        toast({
            title: `Template applied to ${selectedIds.length}`,
            description: `All switched to ${bulkTemplateDesign}`,
        })
        setBulkTemplateDialogOpen(false)
        setSelectedIds([])
    }

    const handleRecomputeYtd = (ps: Payslip) => {
        recomputePayslipYtd(ps.id)
        toast({ title: "YTD recomputed", description: `${ps.employeeName} cumulative figures refreshed.` })
    }

    const openCompareDialog = (ps: Payslip) => {
        setCurrentPayslip(ps)
        // Default compare with previous month
        const prevSlip = payslips
            .filter((p) => p.employeeId === ps.employeeId && p.id !== ps.id)
            .sort((a, b) => (b.generatedDate ?? "").localeCompare(a.generatedDate ?? ""))[0]
        setComparePayslipId(prevSlip?.id ?? "")
        setCompareOpen(true)
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        bulkDeletePayslips(selectedIds)
        toast({
            title: `Deleted ${selectedIds.length} payslip${selectedIds.length > 1 ? "s" : ""}`,
            variant: "destructive",
        })
        setSelectedIds([])
        setDeleteConfirmOpen(false)
    }

    const handleSaveTemplate = () => {
        updatePayslipTemplate(templateForm)
        toast({
            title: "Template saved",
            description: "Payslip template updated for all future generations.",
        })
        setTemplateOpen(false)
    }

    const handleDownloadPayslip = (ps: Payslip) => {
        const html = buildPayslipHtml(ps, payslipTemplate)
        const blob = new Blob([html], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `Payslip_${ps.empCode ?? ps.employeeId}_${ps.month.replace(/\s+/g, "_")}.html`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Downloaded", description: "Open in browser and Print → Save as PDF." })
    }

    const handlePrintPayslip = (ps: Payslip) => {
        const html = buildPayslipHtml(ps, payslipTemplate)
        const iframe = printFrameRef.current
        if (!iframe) return
        iframe.srcdoc = html
        iframe.onload = () => {
            iframe.contentWindow?.focus()
            iframe.contentWindow?.print()
        }
    }

    const handleExportAllCsv = () => {
        if (!monthPayslips.length) {
            toast({ title: "Nothing to export", description: "No payslips for this month yet.", variant: "destructive" })
            return
        }
        const headers = [
            "Emp Code", "Name", "Department", "Designation", "Month",
            "Basic", "HRA", "Special Allowance", "Conveyance", "Medical", "Variable", "OT Amount", "LOP Deduction",
            "Gross", "PF", "ESI", "PT", "TDS", "Other", "Total Deductions", "Net Amount",
            "Bank Account", "IFSC", "Status", "Generated Date", "Distributed Date",
        ]
        const rows = monthPayslips.map((p) => [
            p.empCode ?? p.employeeId,
            `"${p.employeeName}"`,
            p.dept ?? "",
            p.designation ?? "",
            p.month,
            p.basic ?? 0, p.hra ?? 0, p.specialAllowance ?? 0, p.conveyance ?? 0, p.medicalAllowance ?? 0, p.variable ?? 0, p.otAmount ?? 0, p.lopDeduction ?? 0,
            p.grossEarnings ?? 0, p.pf ?? 0, p.esi ?? 0, p.pt ?? 0, p.tds ?? 0, p.otherDeductions ?? 0, p.totalDeductions ?? 0, p.netAmount,
            p.bankAccount ?? "", p.ifsc ?? "", p.status, p.generatedDate ?? "", p.distributedDate ?? "",
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `payslips_${activeMonth.replace(/\s+/g, "_")}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${monthPayslips.length} payslips as CSV.` })
    }

    // ── Render ─────────────────────────────────────────────
    if (!activeRun) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] p-8 font-sans">
                <div className="h-16 w-16 bg-[#EC4899]/10 rounded-2xl flex items-center justify-center text-[#EC4899] mb-4">
                    <FileText size={28} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">No pay run available</h2>
                <p className="text-sm text-slate-500">Create a pay run first to generate payslips.</p>
            </div>
        )
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Hidden print iframe */}
                <iframe ref={printFrameRef} className="hidden" title="Print payslip" />

                {/* ── Header ─────────────────────────── */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#EC4899]/10 rounded-xl flex items-center justify-center text-[#EC4899] shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Payslips</h1>
                            <p className="text-xs font-medium text-slate-500">Generation & distribution hub</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-700">
                                    <Calendar size={14} />
                                    <span className="truncate max-w-[140px]">{activeMonth}</span>
                                    <ChevronDown size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="text-xs font-bold text-slate-500">Select cycle</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {payRuns.map((r) => (
                                    <DropdownMenuItem
                                        key={r.id}
                                        onClick={() => setSelectedRunId(r.id)}
                                        className="flex items-center justify-between cursor-pointer text-xs font-semibold"
                                    >
                                        <span>{r.month}</span>
                                        {r.id === selectedRunId && <CheckCircle2 size={12} className="text-[#EC4899]" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="outline"
                            onClick={() => { setTemplateForm(payslipTemplate); setTemplateOpen(true) }}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Layout size={14} /> <span className="hidden md:inline">Template</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExportAllCsv}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export CSV</span>
                        </Button>

                        <Button
                            onClick={handleGenerateFromRun}
                            disabled={runEmpsNotYetPayslipped === 0}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2 disabled:opacity-50"
                        >
                            <Zap size={14} />
                            <span className="hidden md:inline">Generate from run</span>
                            {runEmpsNotYetPayslipped > 0 && (
                                <Badge className="bg-white text-[#8B5CF6] border-none text-[9px] font-bold h-4 px-1.5">
                                    {runEmpsNotYetPayslipped}
                                </Badge>
                            )}
                        </Button>

                        <Button
                            onClick={() => { setNewPayslipForm({ ...emptyPayslipForm, month: activeMonth }); setAddDialogOpen(true) }}
                            className="bg-[#EC4899] hover:bg-[#db2777] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            <Plus size={14} /> <span className="hidden md:inline">Manual add</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* ── Stats ─────────────────────── */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Total" value={String(stats.total)} caption={activeMonth} icon={FileText} color="#8B5CF6" />
                            <StatCard label="Generated" value={String(stats.generated)} caption="Ready to distribute" icon={CheckCircle2} color="#F59E0B" />
                            <StatCard label="Distributed" value={String(stats.distributed)} caption="Sent to employees" icon={Send} color="#10B981" />
                            <StatCard label="Total payout" value={formatINR(stats.totalAmount)} caption="Net disbursement" icon={Wallet} color="#EC4899" />
                        </div>

                        {/* ── Main Card ──────────────────── */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">Statement ledger</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        {filteredPayslips.length} of {monthPayslips.length} • {stats.pending} pending
                                    </CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative flex-1 min-w-[200px] lg:w-56 lg:flex-none">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Search name, code, dept..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 h-9 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                        />
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn("h-9 rounded-lg font-semibold text-xs gap-2",
                                                    (statusFilter !== "all" || deptFilter !== "all")
                                                        ? "border-[#EC4899] text-[#EC4899] bg-[#EC4899]/5"
                                                        : "border-slate-200 text-slate-600")}
                                            >
                                                <Filter size={14} /> Filters
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-64 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-900">Filter</h4>
                                                {(statusFilter !== "all" || deptFilter !== "all") && (
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        onClick={() => { setStatusFilter("all"); setDeptFilter("all") }}
                                                        className="h-7 text-xs font-semibold text-rose-500 hover:text-rose-600 px-2"
                                                    >
                                                        <RotateCcw size={12} className="mr-1" /> Reset
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Status</Label>
                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All statuses</SelectItem>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                        <SelectItem value="Generated">Generated</SelectItem>
                                                        <SelectItem value="Distributed">Distributed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Department</Label>
                                                <Select value={deptFilter} onValueChange={setDeptFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All departments</SelectItem>
                                                        {availableDepts.map((d) => (
                                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <AnimatePresence>
                                    {selectedIds.length > 0 && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="bg-[#EC4899]/5 border-b border-[#EC4899]/10 px-6 py-3 flex flex-wrap items-center justify-between gap-2"
                                        >
                                            <div className="flex items-center flex-wrap gap-2">
                                                <span className="text-xs font-bold text-[#EC4899]">{selectedIds.length} selected</span>
                                                <span className="h-4 w-px bg-slate-200 mx-1" />
                                                <Button size="sm" onClick={handleBulkGenerate} className="h-7 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white text-[11px] font-semibold px-3 rounded-md border-none">
                                                    <Zap size={12} className="mr-1" /> Generate
                                                </Button>
                                                <Button size="sm" onClick={handleBulkDistribute} className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold px-3 rounded-md border-none">
                                                    <Send size={12} className="mr-1" /> Distribute
                                                </Button>
                                                <Button size="sm" onClick={handleBulkRegenerate} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-slate-200 text-slate-700">
                                                    <RotateCcw size={12} className="mr-1" /> Regenerate
                                                </Button>
                                                <Button size="sm" onClick={handleBulkSendEmail} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-blue-200 text-blue-700 hover:bg-blue-50">
                                                    <Mail size={12} className="mr-1" /> Bulk email
                                                </Button>
                                                <Button size="sm" onClick={() => setBulkTemplateDialogOpen(true)} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/5">
                                                    <Layout size={12} className="mr-1" /> Set template
                                                </Button>
                                                <Button size="sm" onClick={() => setDeleteConfirmOpen(true)} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-rose-200 text-rose-600 hover:bg-rose-50">
                                                    <Trash2 size={12} className="mr-1" /> Delete
                                                </Button>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="h-7 text-[11px] font-semibold text-slate-500 hover:text-rose-500">
                                                Clear
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50/70">
                                            <TableRow className="border-slate-100 hover:bg-transparent">
                                                <TableHead className="pl-6 w-10">
                                                    <Checkbox
                                                        checked={filteredPayslips.length > 0 && filteredPayslips.every((p) => selectedIds.includes(p.id))}
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={filteredPayslips.length === 0}
                                                        className="border-slate-300 data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                                                    />
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Cycle</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Net amount</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Generated</TableHead>
                                                <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPayslips.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                        {monthPayslips.length === 0
                                                            ? "No payslips for this cycle. Click 'Generate from run' to create from approved employees."
                                                            : "No payslips match the current filters."}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredPayslips.map((ps) => (
                                                    <TableRow
                                                        key={ps.id}
                                                        onClick={() => { setCurrentPayslip(ps); setPreviewOpen(true); }}
                                                        className={cn("group border-slate-50 cursor-pointer", selectedIds.includes(ps.id) ? "bg-[#EC4899]/5 hover:bg-[#EC4899]/10" : "hover:bg-slate-50/70")}
                                                    >
                                                        <TableCell className="pl-6 py-3" onClick={(e) => e.stopPropagation()}>
                                                            <Checkbox
                                                                checked={selectedIds.includes(ps.id)}
                                                                onCheckedChange={() => toggleSelect(ps.id)}
                                                                className="border-slate-300 data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                    {ps.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-sm font-semibold text-slate-900 truncate">{ps.employeeName}</div>
                                                                    <div className="text-[11px] font-medium text-slate-500 truncate">
                                                                        {ps.empCode ?? ps.employeeId}{ps.dept ? ` • ${ps.dept}` : ""}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 text-xs font-semibold text-slate-600">{ps.month}</TableCell>
                                                        <TableCell className="py-3 text-sm font-bold text-slate-900 tabular-nums">{formatINR(ps.netAmount)}</TableCell>
                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <Badge className={cn("border-none text-[10px] font-semibold px-2 py-0.5",
                                                                    ps.status === "Distributed" ? "bg-emerald-50 text-emerald-600" :
                                                                        ps.status === "Generated" ? "bg-amber-50 text-amber-600" :
                                                                            "bg-slate-100 text-slate-500")}>
                                                                    {ps.status}
                                                                </Badge>
                                                                {ps.passwordProtected && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <KeyRound size={12} className="text-amber-500" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Password protected</TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                                {ps.emailStatus && ps.emailStatus !== "Not Sent" && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Badge className={cn("border-none text-[9px] font-bold px-1.5 gap-0.5",
                                                                                ps.emailStatus === "Sent" || ps.emailStatus === "Delivered" ? "bg-emerald-50 text-emerald-600" :
                                                                                    ps.emailStatus === "Failed" || ps.emailStatus === "Bounced" ? "bg-rose-50 text-rose-600" :
                                                                                        "bg-amber-50 text-amber-600")}>
                                                                                <Mail size={9} /> {ps.emailStatus}
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            {ps.emailStatus === "Failed" ? ps.emailFailReason ?? "Failed" : `${ps.emailSentDate ? `Sent ${new Date(ps.emailSentDate).toLocaleDateString()}` : ""} • ${ps.emailAttempts} attempt${(ps.emailAttempts ?? 0) > 1 ? "s" : ""}`}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )}
                                                                {ps.templateDesign && (
                                                                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[9px] font-bold px-1.5">
                                                                        {ps.templateDesign}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 text-[11px] font-medium text-slate-500">{ps.generatedDate ?? "—"}</TableCell>
                                                        <TableCell className="text-right pr-6 py-3" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex justify-end gap-1">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => { setCurrentPayslip(ps); setPreviewOpen(true) }}
                                                                            className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#EC4899] hover:bg-slate-100"
                                                                        >
                                                                            <Eye size={14} />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Preview</TooltipContent>
                                                                </Tooltip>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#EC4899] hover:bg-slate-100">
                                                                            <MoreHorizontal size={15} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-48">
                                                                        {ps.status === "Pending" && (
                                                                            <DropdownMenuItem onClick={() => { updatePayslipStatus(ps.id, "Generated"); toast({ title: "Generated", description: `${ps.employeeName}'s payslip is ready.` }) }} className="cursor-pointer text-xs font-medium">
                                                                                <Zap size={13} className="mr-2" /> Generate
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {(ps.status === "Generated" || ps.status === "Pending") && (
                                                                            <DropdownMenuItem onClick={() => { setCurrentPayslip(ps); setEmailOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                                <Mail size={13} className="mr-2" /> Preview email
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        {ps.status === "Generated" && (
                                                                            <DropdownMenuItem onClick={() => { updatePayslipStatus(ps.id, "Distributed"); toast({ title: "Distributed", description: `${ps.employeeName} notified.` }) }} className="cursor-pointer text-xs font-medium">
                                                                                <Send size={13} className="mr-2" /> Dispatch
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem onClick={() => handleDownloadPayslip(ps)} className="cursor-pointer text-xs font-medium">
                                                                            <Download size={13} className="mr-2" /> Download
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handlePrintPayslip(ps)} className="cursor-pointer text-xs font-medium">
                                                                            <Printer size={13} className="mr-2" /> Print
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => { regeneratePayslip(ps.id); toast({ title: "Regenerated", description: "Fresh data from pay run." }) }} className="cursor-pointer text-xs font-medium">
                                                                            <RotateCcw size={13} className="mr-2" /> Regenerate
                                                                        </DropdownMenuItem>
                                                                        {/* ─ Round 2 ─ */}
                                                                        <DropdownMenuItem onClick={() => handleSendEmailSingle(ps)} className="cursor-pointer text-xs font-medium text-blue-600">
                                                                            <Mail size={13} className="mr-2" /> Send email {ps.emailAttempts ? `(#${(ps.emailAttempts ?? 0) + 1})` : ""}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => openPasswordDialog(ps)} className="cursor-pointer text-xs font-medium">
                                                                            <KeyRound size={13} className="mr-2" /> {ps.passwordProtected ? "Change password settings" : "Protect with password"}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleRecomputeYtd(ps)} className="cursor-pointer text-xs font-medium">
                                                                            <TrendingUp size={13} className="mr-2" /> Recompute YTD
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => openCompareDialog(ps)} className="cursor-pointer text-xs font-medium">
                                                                            <GitCompareArrows size={13} className="mr-2" /> Compare with previous
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Template</DropdownMenuLabel>
                                                                        <DropdownMenuItem onClick={() => handleSetTemplate(ps, "modern")} className={cn("cursor-pointer text-xs font-medium", ps.templateDesign === "modern" && "bg-[#8B5CF6]/5 text-[#8B5CF6]")}>
                                                                            <Palette size={13} className="mr-2" /> Modern {ps.templateDesign === "modern" && <Check size={10} className="ml-auto" />}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleSetTemplate(ps, "classic")} className={cn("cursor-pointer text-xs font-medium", ps.templateDesign === "classic" && "bg-[#8B5CF6]/5 text-[#8B5CF6]")}>
                                                                            <Palette size={13} className="mr-2" /> Classic {ps.templateDesign === "classic" && <Check size={10} className="ml-auto" />}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleSetTemplate(ps, "minimal")} className={cn("cursor-pointer text-xs font-medium", ps.templateDesign === "minimal" && "bg-[#8B5CF6]/5 text-[#8B5CF6]")}>
                                                                            <Palette size={13} className="mr-2" /> Minimal {ps.templateDesign === "minimal" && <Check size={10} className="ml-auto" />}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem onClick={() => { setEditForm(ps); setEditDialogOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                            <Edit size={13} className="mr-2" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem onClick={() => { deletePayslip(ps.id); toast({ title: "Deleted", variant: "destructive" }) }} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
                                                                            <Trash2 size={13} className="mr-2" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ── Preview Dialog ─────────────────────── */}
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 font-sans max-h-[92vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Payslip preview</h3>
                                <p className="text-xs font-medium text-slate-500">{currentPayslip?.employeeName} • {currentPayslip?.month}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => currentPayslip && handleDownloadPayslip(currentPayslip)} className="h-9 px-3 rounded-lg font-semibold text-xs gap-2 border-slate-200">
                                    <Download size={14} /> Download
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => currentPayslip && handlePrintPayslip(currentPayslip)} className="h-9 px-3 rounded-lg font-semibold text-xs gap-2 border-slate-200">
                                    <Printer size={14} /> Print
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)} className="h-9 w-9 p-0 rounded-lg">
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className="flex-1 bg-slate-100 p-4 lg:p-6">
                            {currentPayslip && <PayslipView payslip={currentPayslip} template={payslipTemplate} />}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                {/* Email Preview Sheet */}
                <SideFormSheet
                    open={emailOpen}
                    onOpenChange={setEmailOpen}
                    title="Email preview"
                    description={currentPayslip ? `Review before sending to ${currentPayslip.employeeName}` : undefined}
                    icon={<Mail size={20} />}
                    accentColor="#059669"
                    width="lg"
                    submitLabel="Send email"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (currentPayslip) {
                            updatePayslipStatus(currentPayslip.id, "Distributed")
                            toast({ title: "Email sent", description: `Payslip emailed to ${currentPayslip.employeeName}.` })
                        }
                        setEmailOpen(false)
                    }}
                >
                    <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">To</p>
                            <p className="text-sm font-semibold text-slate-800 mt-1">
                                {currentPayslip?.employeeName} <span className="text-slate-400 font-normal">&lt;{currentPayslip?.email ?? `${currentPayslip?.employeeId?.toLowerCase()}@fixl.com`}&gt;</span>
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject</p>
                            <p className="text-sm font-semibold text-slate-800 mt-1">Your payslip for {currentPayslip?.month} — {payslipTemplate.companyName}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Dear {currentPayslip?.employeeName},<br /><br />
                                Please find attached your payslip for <strong>{currentPayslip?.month}</strong>. Your net salary of
                                {" "}<span className="font-bold text-emerald-600">{formatINR(currentPayslip?.netAmount)}</span>{" "}
                                has been credited to your registered bank account {currentPayslip?.bankAccount ? `(${currentPayslip.bankAccount})` : ""}.<br /><br />
                                For any queries, please contact HR.<br /><br />
                                Regards,<br />
                                <strong>{payslipTemplate.companyName} — HR Team</strong>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <FileText size={16} className="text-blue-600" />
                            <span className="text-xs font-semibold text-blue-900">
                                Payslip_{currentPayslip?.empCode ?? currentPayslip?.employeeId}_{currentPayslip?.month.replace(/\s+/g, "_")}.html
                            </span>
                        </div>
                    </div>
                </SideFormSheet>

                {/* ── Template Sheet ─────────────────────── */}
                <Sheet open={templateOpen} onOpenChange={setTemplateOpen}>
                    <SheetContent className="sm:max-w-md p-0 font-sans">
                        <div className="h-full flex flex-col bg-white">
                            <SheetHeader className="bg-slate-950 p-6 text-white space-y-1">
                                <Badge className="bg-[#8B5CF6] text-white border-none font-semibold text-[10px] px-2 py-0.5 w-fit mb-2">
                                    Template settings
                                </Badge>
                                <SheetTitle className="text-xl font-bold text-white tracking-tight">Payslip template</SheetTitle>
                                <SheetDescription className="text-slate-400 font-medium text-[11px]">
                                    Customise branding for all generated payslips.
                                </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-5">
                                    <section className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company</h4>
                                        <div className="space-y-3">
                                            <FormField label="Company name">
                                                <Input value={templateForm.companyName} onChange={(e) => setTemplateForm({ ...templateForm, companyName: e.target.value })} className="h-10 text-sm font-medium" />
                                            </FormField>
                                            <FormField label="Address">
                                                <Textarea value={templateForm.companyAddress} onChange={(e) => setTemplateForm({ ...templateForm, companyAddress: e.target.value })} className="min-h-[70px] text-sm font-medium" />
                                            </FormField>
                                            <div className="grid grid-cols-2 gap-3">
                                                <FormField label="GSTIN">
                                                    <Input value={templateForm.companyGstin ?? ""} onChange={(e) => setTemplateForm({ ...templateForm, companyGstin: e.target.value })} className="h-10 text-sm font-medium" />
                                                </FormField>
                                                <FormField label="PAN">
                                                    <Input value={templateForm.companyPan ?? ""} onChange={(e) => setTemplateForm({ ...templateForm, companyPan: e.target.value })} className="h-10 text-sm font-medium" />
                                                </FormField>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branding</h4>
                                        <div className="space-y-3">
                                            <FormField label="Logo text (2-3 chars)">
                                                <Input value={templateForm.logoText} onChange={(e) => setTemplateForm({ ...templateForm, logoText: e.target.value.slice(0, 3) })} placeholder="FS" className="h-10 text-sm font-bold" />
                                            </FormField>
                                            <FormField label="Primary colour">
                                                <div className="flex gap-2 items-center">
                                                    <Input type="color" value={templateForm.primaryColor} onChange={(e) => setTemplateForm({ ...templateForm, primaryColor: e.target.value })} className="h-10 w-14 p-1 cursor-pointer" />
                                                    <Input value={templateForm.primaryColor} onChange={(e) => setTemplateForm({ ...templateForm, primaryColor: e.target.value })} className="h-10 text-sm font-medium font-mono" />
                                                </div>
                                            </FormField>
                                            <FormField label="Footer text">
                                                <Textarea value={templateForm.footerText} onChange={(e) => setTemplateForm({ ...templateForm, footerText: e.target.value })} className="min-h-[60px] text-sm font-medium" />
                                            </FormField>
                                        </div>
                                    </section>

                                    <section className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</h4>
                                        <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
                                            <div
                                                className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                                                style={{ backgroundColor: templateForm.primaryColor }}
                                            >
                                                {templateForm.logoText || "—"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{templateForm.companyName}</div>
                                                <div className="text-[11px] font-medium text-slate-500 truncate max-w-[220px]">
                                                    {templateForm.companyAddress}
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </ScrollArea>
                            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                                <Button variant="ghost" onClick={() => setTemplateOpen(false)} className="flex-1 h-10 text-slate-500 font-semibold text-xs">
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveTemplate} className="flex-[2] h-10 bg-slate-950 hover:bg-slate-800 text-white rounded-lg font-bold text-xs border-none">
                                    <Settings size={13} className="mr-1.5" /> Save template
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Add Manual Payslip Sheet */}
                <SideFormSheet
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    title="Create manual payslip"
                    description="Use for adjustments or off-cycle payments. Prefer &quot;Generate from run&quot; for normal runs."
                    icon={<Plus size={20} />}
                    accentColor="#4f46e5"
                    width="xl"
                    submitLabel="Create payslip"
                    onSubmit={(e) => { e.preventDefault(); handleAddManual(); }}
                >
                    <PayslipFormFields form={newPayslipForm} onChange={setNewPayslipForm as any} />
                </SideFormSheet>

                {/* Edit Payslip Sheet */}
                <SideFormSheet
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    title="Edit payslip"
                    description={editForm ? `${editForm.employeeName} • ${editForm.month}` : undefined}
                    icon={<Edit size={20} />}
                    accentColor="#7c3aed"
                    width="xl"
                    submitLabel="Save changes"
                    onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}
                >
                    {editForm && (
                        <PayslipFormFields form={editForm} onChange={(v) => setEditForm({ ...editForm, ...v } as Payslip)} />
                    )}
                </SideFormSheet>

                {/* ── Delete Confirm ───────────────────── */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete {selectedIds.length} payslip{selectedIds.length > 1 ? "s" : ""}?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This action cannot be undone. Download copies first if needed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleBulkDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ──────────── Round 2 Dialogs ──────────── */}

                {/* ── Bulk Email Result ───── */}
                <Dialog open={bulkEmailDialogOpen} onOpenChange={setBulkEmailDialogOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <Mail size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Bulk email complete</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Delivery simulated — ~90% success rate. Failed ones are retryable.
                            </DialogDescription>
                        </DialogHeader>
                        {bulkEmailResult && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CircleCheckBig size={14} className="text-emerald-600" />
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sent</span>
                                    </div>
                                    <div className="text-2xl font-bold text-emerald-700 tabular-nums">{bulkEmailResult.sent}</div>
                                    <div className="text-[10px] font-medium text-emerald-600 mt-0.5">Email status updated</div>
                                </div>
                                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <XCircle size={14} className="text-rose-600" />
                                        <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Failed</span>
                                    </div>
                                    <div className="text-2xl font-bold text-rose-700 tabular-nums">{bulkEmailResult.failed}</div>
                                    <div className="text-[10px] font-medium text-rose-600 mt-0.5">SMTP / missing email</div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setBulkEmailDialogOpen(false)} className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none">
                                Done
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Password Sheet */}
                <SideFormSheet
                    open={passwordDialogOpen}
                    onOpenChange={setPasswordDialogOpen}
                    title="Password protection"
                    description={passwordTarget ? `Protect ${passwordTarget.employeeName}'s payslip PDF. Password hint is shown in the email.` : undefined}
                    icon={<KeyRound size={20} />}
                    accentColor="#d97706"
                    width="md"
                    submitLabel={passwordEnabled ? "Enable protection" : "Remove protection"}
                    onSubmit={(e) => { e.preventDefault(); handleSavePassword(); }}
                >
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <Label className="text-xs font-bold text-slate-700">Enable password</Label>
                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Employee must enter password to open</p>
                            </div>
                            <Switch checked={passwordEnabled} onCheckedChange={setPasswordEnabled} className="data-[state=checked]:bg-[#8B5CF6]" />
                        </div>
                        {passwordEnabled && (
                            <Field label="Password hint" hint="Actual password is derived from employee data — hint is what appears in the email.">
                                <Select value={passwordHint} onValueChange={setPasswordHint}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PAN number">PAN number (all uppercase)</SelectItem>
                                        <SelectItem value="DOB">Date of birth (DDMMYYYY)</SelectItem>
                                        <SelectItem value="Employee code">Employee code</SelectItem>
                                        <SelectItem value="First 4 PAN + DOB">First 4 PAN + DOB</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    </div>
                </SideFormSheet>

                {/* Bulk Template Sheet */}
                <SideFormSheet
                    open={bulkTemplateDialogOpen}
                    onOpenChange={setBulkTemplateDialogOpen}
                    title={`Apply template to ${selectedIds.length}`}
                    description="All selected payslips will switch to this design when downloaded/printed."
                    icon={<Palette size={20} />}
                    accentColor="#4f46e5"
                    width="md"
                    submitLabel={`Apply to ${selectedIds.length}`}
                    onSubmit={(e) => { e.preventDefault(); handleBulkSetTemplate(); }}
                >
                    <div className="space-y-2">
                        {(["modern", "classic", "minimal"] as const).map((design) => (
                            <button
                                key={design}
                                type="button"
                                onClick={() => setBulkTemplateDesign(design)}
                                className={cn("w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                                    bulkTemplateDesign === design ? "border-[#8B5CF6] bg-[#8B5CF6]/5" : "border-slate-200 bg-white hover:border-slate-300")}
                            >
                                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                                    design === "modern" ? "bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white" :
                                        design === "classic" ? "bg-slate-800 text-white" :
                                            "bg-slate-100 text-slate-600")}>
                                    <Palette size={16} />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="text-sm font-bold text-slate-900 capitalize">{design}</div>
                                    <div className="text-[11px] font-medium text-slate-500">
                                        {design === "modern" ? "Colorful gradient header with emphasis on net pay" :
                                            design === "classic" ? "Traditional dark header, formal layout" :
                                                "Minimal grayscale, easy to read"}
                                    </div>
                                </div>
                                {bulkTemplateDesign === design && <Check size={16} className="text-[#8B5CF6] shrink-0" />}
                            </button>
                        ))}
                    </div>
                </SideFormSheet>

                {/* ── Compare Dialog ───── */}
                <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <GitCompareArrows size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Payslip comparison — {currentPayslip?.employeeName}</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Side-by-side view to spot variances between cycles.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <Label className="text-[11px] font-semibold text-slate-600">Compare with</Label>
                            <Select value={comparePayslipId} onValueChange={setComparePayslipId}>
                                <SelectTrigger className="h-10 text-sm mt-1"><SelectValue placeholder="Pick another payslip" /></SelectTrigger>
                                <SelectContent>
                                    {payslips.filter(p => p.employeeId === currentPayslip?.employeeId && p.id !== currentPayslip?.id).map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.month} • {formatINR(p.netAmount)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                            {currentPayslip && (() => {
                                const other = payslips.find(p => p.id === comparePayslipId)
                                if (!other) return <p className="text-sm text-slate-400 italic text-center py-12">Select a payslip to compare.</p>
                                const rows: { label: string; a?: number; b?: number }[] = [
                                    { label: "Basic", a: currentPayslip.basic, b: other.basic },
                                    { label: "HRA", a: currentPayslip.hra, b: other.hra },
                                    { label: "Special Allowance", a: currentPayslip.specialAllowance, b: other.specialAllowance },
                                    { label: "Variable", a: currentPayslip.variable, b: other.variable },
                                    { label: "Gross Earnings", a: currentPayslip.grossEarnings, b: other.grossEarnings },
                                    { label: "PF", a: currentPayslip.pf, b: other.pf },
                                    { label: "TDS", a: currentPayslip.tds, b: other.tds },
                                    { label: "Total Deductions", a: currentPayslip.totalDeductions, b: other.totalDeductions },
                                    { label: "Net Amount", a: currentPayslip.netAmount, b: other.netAmount },
                                ]
                                return (
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-4 gap-2 py-2 border-b-2 border-slate-200">
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Component</div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">{currentPayslip.month}</div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">{other.month}</div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Δ Change</div>
                                        </div>
                                        {rows.map((r) => {
                                            const a = r.a ?? 0, b = r.b ?? 0
                                            const delta = a - b
                                            const pct = b ? (delta / b) * 100 : 0
                                            return (
                                                <div key={r.label} className={cn("grid grid-cols-4 gap-2 py-2.5 border-b border-slate-100 text-sm",
                                                    r.label === "Net Amount" && "bg-[#8B5CF6]/5 font-bold mt-2 rounded-lg px-2 border-none")}>
                                                    <span className="font-semibold text-slate-700">{r.label}</span>
                                                    <span className="text-right tabular-nums text-slate-900">{formatINR(a)}</span>
                                                    <span className="text-right tabular-nums text-slate-500">{formatINR(b)}</span>
                                                    <span className={cn("text-right tabular-nums font-bold",
                                                        delta > 0 ? "text-emerald-600" : delta < 0 ? "text-rose-600" : "text-slate-400")}>
                                                        {delta === 0 ? "—" : `${delta > 0 ? "+" : ""}${formatINR(delta)} (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)`}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600">
                                            {currentPayslip.ytdGross !== undefined && (
                                                <>
                                                    <div className="font-bold mb-1">YTD snapshots</div>
                                                    <div>{currentPayslip.month}: Gross {formatINR(currentPayslip.ytdGross ?? 0)} • Net {formatINR(currentPayslip.ytdNet ?? 0)} • Tax {formatINR(currentPayslip.ytdTax ?? 0)}</div>
                                                    <div>{other.month}: Gross {formatINR(other.ytdGross ?? 0)} • Net {formatINR(other.ytdNet ?? 0)} • Tax {formatINR(other.ytdTax ?? 0)}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })()}
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button variant="ghost" onClick={() => setCompareOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// ──────────────────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, caption, icon: Icon, color }: { label: string; value: string; caption: string; icon: any; color: string }) => (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight tabular-nums truncate">{value}</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">{caption}</p>
                </div>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}14`, color }}>
                    <Icon size={18} />
                </div>
            </div>
        </CardContent>
    </Card>
)

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">{label}</Label>
        {children}
    </div>
)

const PayslipFormFields = ({ form, onChange }: { form: any; onChange: (v: any) => void }) => {
    const set = (key: string, v: any) => onChange({ ...form, [key]: v })
    return (
        <div className="space-y-5">
            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identity</h4>
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Employee code">
                        <Input value={form.empCode ?? ""} onChange={(e) => set("empCode", e.target.value)} className="h-10 text-sm font-medium" placeholder="EMP001" />
                    </FormField>
                    <FormField label="Employee name">
                        <Input value={form.employeeName ?? ""} onChange={(e) => set("employeeName", e.target.value)} className="h-10 text-sm font-medium" />
                    </FormField>
                    <FormField label="Employee ID">
                        <Input value={form.employeeId ?? ""} onChange={(e) => set("employeeId", e.target.value)} className="h-10 text-sm font-medium" />
                    </FormField>
                    <FormField label="Month/Cycle">
                        <Input value={form.month ?? ""} onChange={(e) => set("month", e.target.value)} className="h-10 text-sm font-medium" placeholder="January 2026" />
                    </FormField>
                    <FormField label="Department">
                        <Input value={form.dept ?? ""} onChange={(e) => set("dept", e.target.value)} className="h-10 text-sm font-medium" />
                    </FormField>
                    <FormField label="Designation">
                        <Input value={form.designation ?? ""} onChange={(e) => set("designation", e.target.value)} className="h-10 text-sm font-medium" />
                    </FormField>
                    <FormField label="Bank account">
                        <Input value={form.bankAccount ?? ""} onChange={(e) => set("bankAccount", e.target.value)} className="h-10 text-sm font-medium" />
                    </FormField>
                    <FormField label="IFSC">
                        <Input value={form.ifsc ?? ""} onChange={(e) => set("ifsc", e.target.value)} className="h-10 text-sm font-medium" />
                    </FormField>
                </div>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Earnings</h4>
                <div className="grid grid-cols-2 gap-3">
                    <NumField label="Basic" value={form.basic ?? 0} onChange={(v) => set("basic", v)} />
                    <NumField label="HRA" value={form.hra ?? 0} onChange={(v) => set("hra", v)} />
                    <NumField label="Special allowance" value={form.specialAllowance ?? 0} onChange={(v) => set("specialAllowance", v)} />
                    <NumField label="Conveyance" value={form.conveyance ?? 0} onChange={(v) => set("conveyance", v)} />
                    <NumField label="Medical allowance" value={form.medicalAllowance ?? 0} onChange={(v) => set("medicalAllowance", v)} />
                    <NumField label="Variable/Bonus" value={form.variable ?? 0} onChange={(v) => set("variable", v)} />
                </div>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adjustments</h4>
                <div className="grid grid-cols-2 gap-3">
                    <NumField label="LOP deduction (₹)" value={form.lopDeduction ?? 0} onChange={(v) => set("lopDeduction", v)} />
                    <NumField label="OT amount (₹)" value={form.otAmount ?? 0} onChange={(v) => set("otAmount", v)} />
                </div>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deductions</h4>
                <div className="grid grid-cols-2 gap-3">
                    <NumField label="PF" value={form.pf ?? 0} onChange={(v) => set("pf", v)} />
                    <NumField label="ESI" value={form.esi ?? 0} onChange={(v) => set("esi", v)} />
                    <NumField label="Professional tax" value={form.pt ?? 0} onChange={(v) => set("pt", v)} />
                    <NumField label="TDS" value={form.tds ?? 0} onChange={(v) => set("tds", v)} />
                    <NumField label="Other deductions" value={form.otherDeductions ?? 0} onChange={(v) => set("otherDeductions", v)} />
                </div>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</h4>
                <Textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Optional notes displayed on payslip" className="min-h-[60px] text-xs font-medium" />
            </section>
        </div>
    )
}

const NumField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <FormField label={label}>
        <Input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
    </FormField>
)

// ── Payslip view (in-dialog) ─────────────────────────────
const PayslipView = ({ payslip, template }: { payslip: Payslip; template: PayslipTemplate }) => {
    const rowCls = "flex justify-between py-2 text-sm"
    const earnings = [
        { label: "Basic", v: payslip.basic },
        { label: "HRA", v: payslip.hra },
        { label: "Special allowance", v: payslip.specialAllowance },
        { label: "Conveyance", v: payslip.conveyance },
        { label: "Medical allowance", v: payslip.medicalAllowance },
        { label: "Variable / Bonus", v: payslip.variable },
        { label: "OT amount", v: payslip.otAmount },
    ].filter((r) => (r.v ?? 0) > 0)
    const deductions = [
        { label: "LOP deduction", v: payslip.lopDeduction },
        { label: "PF (Employee)", v: payslip.pf },
        { label: "ESI", v: payslip.esi },
        { label: "Professional tax", v: payslip.pt },
        { label: "TDS", v: payslip.tds },
        { label: "Other deductions", v: payslip.otherDeductions },
    ].filter((r) => (r.v ?? 0) > 0)

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 lg:p-10 border border-slate-200 font-sans text-slate-900">
            {/* Header */}
            <div className="flex justify-between items-start pb-5 border-b-2" style={{ borderColor: template.primaryColor }}>
                <div className="flex items-center gap-3">
                    <div
                        className="h-14 w-14 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm"
                        style={{ backgroundColor: template.primaryColor }}
                    >
                        {template.logoText}
                    </div>
                    <div>
                        <div className="text-base font-bold text-slate-900">{template.companyName}</div>
                        <div className="text-[11px] font-medium text-slate-500 max-w-[350px]">{template.companyAddress}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {template.companyGstin && <>GSTIN: {template.companyGstin} </>}
                            {template.companyPan && <>• PAN: {template.companyPan}</>}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold tracking-tight" style={{ color: template.primaryColor }}>PAYSLIP</div>
                    <div className="text-xs font-semibold text-slate-500">{payslip.month}</div>
                </div>
            </div>

            {/* Employee details */}
            <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-100">
                <div className="space-y-2">
                    <KV label="Employee name" value={payslip.employeeName} />
                    <KV label="Employee code" value={payslip.empCode ?? payslip.employeeId} />
                    <KV label="Department" value={payslip.dept ?? "—"} />
                    <KV label="Designation" value={payslip.designation ?? "—"} />
                </div>
                <div className="space-y-2">
                    <KV label="Bank account" value={payslip.bankAccount ?? "Not provided"} />
                    <KV label="IFSC" value={payslip.ifsc ?? "Not provided"} />
                    <KV label="LOP days" value={String(payslip.lopDays ?? 0)} />
                    <KV label="OT hours" value={String(payslip.otHours ?? 0)} />
                </div>
            </div>

            {/* Earnings / Deductions */}
            <div className="grid grid-cols-2 gap-6 py-5">
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3" style={{ color: template.primaryColor }}>Earnings</div>
                    {earnings.length === 0 && <p className="text-xs text-slate-400 italic">No earnings logged.</p>}
                    {earnings.map((r) => (
                        <div key={r.label} className={rowCls}>
                            <span className="text-slate-600">{r.label}</span>
                            <span className="font-semibold text-slate-900 tabular-nums">{formatINR(r.v)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 mt-2 border-t border-slate-200 text-sm">
                        <span className="font-bold text-slate-900">Gross earnings</span>
                        <span className="font-bold text-slate-900 tabular-nums">{formatINR(payslip.grossEarnings)}</span>
                    </div>
                </div>
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">Deductions</div>
                    {deductions.length === 0 && <p className="text-xs text-slate-400 italic">No deductions.</p>}
                    {deductions.map((r) => (
                        <div key={r.label} className={rowCls}>
                            <span className="text-slate-600">{r.label}</span>
                            <span className="font-semibold text-rose-600 tabular-nums">−{formatINR(r.v)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between py-3 mt-2 border-t border-slate-200 text-sm">
                        <span className="font-bold text-slate-900">Total deductions</span>
                        <span className="font-bold text-rose-600 tabular-nums">−{formatINR(payslip.totalDeductions)}</span>
                    </div>
                </div>
            </div>

            {/* Net payable */}
            <div
                className="p-5 rounded-xl flex justify-between items-center"
                style={{ backgroundColor: `${template.primaryColor}14`, borderLeft: `4px solid ${template.primaryColor}` }}
            >
                <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net payable</div>
                    <div className="text-[11px] font-medium text-slate-400 mt-0.5">Amount credited to bank account</div>
                </div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: template.primaryColor }}>
                    {formatINR(payslip.netAmount)}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[10px] text-slate-400 italic max-w-[60%]">{template.footerText}</p>
                <p className="text-[10px] text-slate-400">Generated on {payslip.generatedDate ?? "—"}</p>
            </div>
        </div>
    )
}

const KV = ({ label, value }: { label: string; value: string }) => (
    <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="text-sm font-semibold text-slate-800 truncate">{value}</div>
    </div>
)

// ── Printable HTML ─────────────────────────────────────────
const buildPayslipHtml = (p: Payslip, t: PayslipTemplate): string => {
    const format = (n?: number) => `₹${Math.round(n ?? 0).toLocaleString("en-IN")}`
    const earnings = [
        ["Basic", p.basic], ["HRA", p.hra], ["Special allowance", p.specialAllowance],
        ["Conveyance", p.conveyance], ["Medical allowance", p.medicalAllowance],
        ["Variable / Bonus", p.variable], ["OT amount", p.otAmount],
    ].filter(([, v]) => ((v ?? 0) as number) > 0)
    const deductions = [
        ["LOP deduction", p.lopDeduction], ["PF (Employee)", p.pf], ["ESI", p.esi],
        ["Professional tax", p.pt], ["TDS", p.tds], ["Other deductions", p.otherDeductions],
    ].filter(([, v]) => ((v ?? 0) as number) > 0)

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>Payslip — ${p.employeeName} — ${p.month}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Segoe UI', 'Inter', Arial, sans-serif; color: #0f172a; background: #f1f5f9; margin: 0; padding: 24px; }
  .wrap { max-width: 780px; margin: 0 auto; background: white; padding: 36px 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .head { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 2px solid ${t.primaryColor}; }
  .logo { width: 56px; height: 56px; border-radius: 12px; background: ${t.primaryColor}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
  .co-name { font-weight: 700; font-size: 16px; }
  .co-addr { font-size: 11px; color: #64748b; max-width: 360px; line-height: 1.4; }
  .co-meta { font-size: 10px; color: #94a3b8; margin-top: 2px; }
  .title { font-size: 18px; font-weight: 700; color: ${t.primaryColor}; }
  .cycle { font-size: 12px; color: #64748b; font-weight: 600; }
  .section { padding: 18px 0; border-bottom: 1px solid #f1f5f9; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .kv { margin-bottom: 8px; }
  .kv .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 600; }
  .kv .val { font-size: 13px; font-weight: 600; color: #1e293b; }
  .col-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .col-earn { color: ${t.primaryColor}; }
  .col-ded { color: #f43f5e; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .row .l { color: #475569; }
  .row .v { font-weight: 600; color: #0f172a; }
  .row.ded .v { color: #f43f5e; }
  .total { display: flex; justify-content: space-between; padding: 10px 0; margin-top: 8px; border-top: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; }
  .net { margin-top: 16px; padding: 18px; background: ${t.primaryColor}14; border-left: 4px solid ${t.primaryColor}; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; }
  .net-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; }
  .net-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .net-amount { font-size: 24px; font-weight: 700; color: ${t.primaryColor}; }
  .foot { margin-top: 20px; padding-top: 14px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
  @media print { body { padding: 0; background: white; } .wrap { box-shadow: none; border-radius: 0; padding: 24px; } }
</style></head><body><div class="wrap">
  <div class="head">
    <div style="display:flex;gap:14px;align-items:center;">
      <div class="logo">${t.logoText}</div>
      <div>
        <div class="co-name">${t.companyName}</div>
        <div class="co-addr">${t.companyAddress}</div>
        <div class="co-meta">${t.companyGstin ? `GSTIN: ${t.companyGstin}` : ""} ${t.companyPan ? `• PAN: ${t.companyPan}` : ""}</div>
      </div>
    </div>
    <div style="text-align:right;"><div class="title">PAYSLIP</div><div class="cycle">${p.month}</div></div>
  </div>

  <div class="section grid">
    <div>
      <div class="kv"><div class="label">Employee name</div><div class="val">${p.employeeName}</div></div>
      <div class="kv"><div class="label">Employee code</div><div class="val">${p.empCode ?? p.employeeId}</div></div>
      <div class="kv"><div class="label">Department</div><div class="val">${p.dept ?? "—"}</div></div>
      <div class="kv"><div class="label">Designation</div><div class="val">${p.designation ?? "—"}</div></div>
    </div>
    <div>
      <div class="kv"><div class="label">Bank account</div><div class="val">${p.bankAccount ?? "Not provided"}</div></div>
      <div class="kv"><div class="label">IFSC</div><div class="val">${p.ifsc ?? "Not provided"}</div></div>
      <div class="kv"><div class="label">LOP days</div><div class="val">${p.lopDays ?? 0}</div></div>
      <div class="kv"><div class="label">OT hours</div><div class="val">${p.otHours ?? 0}</div></div>
    </div>
  </div>

  <div class="section grid">
    <div>
      <div class="col-title col-earn">Earnings</div>
      ${earnings.map(([k, v]) => `<div class="row"><span class="l">${k}</span><span class="v">${format(v as number)}</span></div>`).join("")}
      <div class="total"><span>Gross earnings</span><span>${format(p.grossEarnings)}</span></div>
    </div>
    <div>
      <div class="col-title col-ded">Deductions</div>
      ${deductions.map(([k, v]) => `<div class="row ded"><span class="l">${k}</span><span class="v">−${format(v as number)}</span></div>`).join("")}
      <div class="total" style="color:#f43f5e;"><span style="color:#0f172a;">Total deductions</span><span>−${format(p.totalDeductions)}</span></div>
    </div>
  </div>

  <div class="net">
    <div><div class="net-title">Net payable</div><div class="net-sub">Amount credited to bank account</div></div>
    <div class="net-amount">${format(p.netAmount)}</div>
  </div>

  <div class="foot"><span>${t.footerText}</span><span>Generated on ${p.generatedDate ?? "—"}</span></div>
</div></body></html>`
}

export default PayslipsPage
