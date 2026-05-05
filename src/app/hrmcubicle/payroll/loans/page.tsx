"use client"

import React, { useState, useMemo } from "react"
import {
    Landmark,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Download,
    Clock,
    Percent,
    CheckCircle2,
    XCircle,
    CreditCard,
    Wallet,
    Filter,
    MoreHorizontal,
    RotateCcw,
    ChevronDown,
    Calculator,
    AlertCircle,
    Banknote,
    X,
    TrendingDown,
    TrendingUp,
    Gauge,
    Zap,
    FileText,
    RefreshCw,
    ListChecks,
    ArrowRight,
    Sparkles,
    HandCoins,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useSalaryStore, type Loan, type EMI, type LoanPrepayment } from "@/shared/data/salary-store"
import { motion, AnimatePresence } from "framer-motion"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const LOAN_TYPES: Loan["loanType"][] = ["Salary Advance", "Personal Loan", "Emergency"]

const emptyLoanForm = {
    employeeId: "",
    employeeName: "",
    loanType: "Personal Loan" as Loan["loanType"],
    principal: 0,
    interestRate: 8,
    tenure: 12,
    disbursedDate: new Date().toISOString().split("T")[0],
}

const computeEmiSchedule = (principal: number, ratePct: number, tenure: number, startDate: string): EMI[] => {
    if (principal <= 0 || tenure <= 0) return []
    const r = ratePct / 100 / 12
    let emi: number
    if (r === 0) emi = Math.round(principal / tenure)
    else emi = Math.round((principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1))

    const emis: EMI[] = []
    let outstanding = principal
    const start = new Date(startDate)
    for (let i = 0; i < tenure; i++) {
        const month = new Date(start)
        month.setMonth(month.getMonth() + i + 1)
        const interest = r === 0 ? 0 : Math.round(outstanding * r)
        const principalPart = Math.max(0, emi - interest)
        outstanding = Math.max(0, outstanding - principalPart)
        emis.push({
            month: month.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            amount: emi,
            principal: principalPart,
            interest,
            status: "Pending",
        })
    }
    return emis
}

const LoansPage = () => {
    const { toast } = useToast()
    const {
        loans,
        addLoan,
        updateLoan,
        deleteLoan,
        bulkUpdateLoanStatus,
        bulkDeleteLoans,
        markEmiPaid,
        bulkMarkEmiPaid,
        recordPrepayment,
        computeLoanEligibility,
        regenerateEmiSchedule,
    } = useSalaryStore()

    // ── UI state ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "closed" | "advances">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Dialogs
    const [formOpen, setFormOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)

    const [editingLoan, setEditingLoan] = useState<Loan | null>(null)
    const [viewingLoan, setViewingLoan] = useState<Loan | null>(null)
    const [closeTargetId, setCloseTargetId] = useState<string | null>(null)
    const [form, setForm] = useState(emptyLoanForm)

    // ── Round 2 UI state ───────────────────────────────────
    const [eligibilityOpen, setEligibilityOpen] = useState(false)
    const [eligibilityLoan, setEligibilityLoan] = useState<Loan | null>(null)
    const [eligibilityForm, setEligibilityForm] = useState({
        employeeId: "",
        employeeName: "",
        requestedAmount: 100000,
        tenure: 12,
        monthlyGross: 50000,
        existingObligations: 0,
    })

    const [prepaymentOpen, setPrepaymentOpen] = useState(false)
    const [prepaymentLoan, setPrepaymentLoan] = useState<Loan | null>(null)
    const [prepaymentForm, setPrepaymentForm] = useState<{ type: "Partial" | "Full"; amount: number; notes: string }>({
        type: "Partial",
        amount: 0,
        notes: "",
    })

    const [bulkEmiOpen, setBulkEmiOpen] = useState(false)
    const [bulkEmiMonth, setBulkEmiMonth] = useState("")

    const [emiPreviewOpen, setEmiPreviewOpen] = useState(false)
    const [emiPreviewLoan, setEmiPreviewLoan] = useState<Loan | null>(null)

    // ── Derived data ───────────────────────────────────────
    const calculatedEMI = useMemo(() => {
        if (form.principal <= 0 || form.tenure <= 0) return 0
        const r = form.interestRate / 100 / 12
        if (r === 0) return Math.round(form.principal / form.tenure)
        return Math.round((form.principal * r * Math.pow(1 + r, form.tenure)) / (Math.pow(1 + r, form.tenure) - 1))
    }, [form.principal, form.interestRate, form.tenure])

    const totalInterestForForm = useMemo(() => {
        return Math.max(0, calculatedEMI * form.tenure - form.principal)
    }, [calculatedEMI, form.tenure, form.principal])

    const stats = useMemo(() => {
        const active = loans.filter((l) => l.status === "Active")
        const totalOutstanding = active.reduce((s, l) => s + l.remainingBalance, 0)
        const totalDisbursed = loans.filter((l) => l.status !== "Pending").reduce((s, l) => s + l.principal, 0)
        const emisDueThisMonth = active.reduce((sum, l) => sum + l.emis.filter((e) => e.status === "Pending").length, 0)
        const avgRate = active.length > 0 ? (active.reduce((s, l) => s + l.interestRate, 0) / active.length).toFixed(1) : "0"
        return {
            activeCount: active.length,
            pendingCount: loans.filter((l) => l.status === "Pending").length,
            closedCount: loans.filter((l) => l.status === "Closed").length,
            totalOutstanding,
            totalDisbursed,
            emisDueThisMonth,
            avgRate,
        }
    }, [loans])

    const filteredLoans = useMemo(() => {
        return loans
            .filter((l) => {
                if (activeTab === "active" && l.status !== "Active") return false
                if (activeTab === "pending" && l.status !== "Pending") return false
                if (activeTab === "closed" && l.status !== "Closed") return false
                if (activeTab === "advances" && l.loanType !== "Salary Advance") return false
                if (typeFilter !== "all" && l.loanType !== typeFilter) return false
                if (searchTerm) {
                    const q = searchTerm.toLowerCase()
                    if (
                        !l.employeeName.toLowerCase().includes(q) &&
                        !l.employeeId.toLowerCase().includes(q) &&
                        !l.loanType.toLowerCase().includes(q)
                    ) return false
                }
                return true
            })
    }, [loans, activeTab, typeFilter, searchTerm])

    const hasActiveFilters = typeFilter !== "all"

    // ── Selection ──────────────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visible = filteredLoans.map((l) => l.id)
        const allSel = visible.every((id) => selectedIds.includes(id))
        if (allSel) setSelectedIds((prev) => prev.filter((id) => !visible.includes(id)))
        else setSelectedIds((prev) => Array.from(new Set([...prev, ...visible])))
    }

    // ── Handlers ───────────────────────────────────────────
    const resetForm = () => setForm(emptyLoanForm)

    const openAddForm = () => {
        setEditingLoan(null)
        resetForm()
        setFormOpen(true)
    }

    const openEditForm = (l: Loan) => {
        setEditingLoan(l)
        setForm({
            employeeId: l.employeeId,
            employeeName: l.employeeName,
            loanType: l.loanType,
            principal: l.principal,
            interestRate: l.interestRate,
            tenure: l.tenure,
            disbursedDate: l.disbursedDate,
        })
        setFormOpen(true)
    }

    const handleSaveLoan = () => {
        if (!form.employeeName.trim() || form.principal <= 0) {
            toast({ title: "Validation error", description: "Employee name and principal are required.", variant: "destructive" })
            return
        }
        if (form.tenure <= 0 || form.tenure > 120) {
            toast({ title: "Invalid tenure", description: "Tenure must be between 1 and 120 months.", variant: "destructive" })
            return
        }
        const emis = computeEmiSchedule(form.principal, form.interestRate, form.tenure, form.disbursedDate)
        if (editingLoan) {
            // Preserve paid EMIs if tenure/amount didn't change
            const keepPaid = editingLoan.principal === form.principal && editingLoan.tenure === form.tenure
            const finalEmis = keepPaid
                ? emis.map((e, i) => editingLoan.emis[i]?.status === "Paid" ? editingLoan.emis[i] : e)
                : emis
            updateLoan(editingLoan.id, {
                ...form,
                emiAmount: calculatedEMI,
                emis: finalEmis,
                remainingBalance: finalEmis.filter((e) => e.status !== "Paid").reduce((s, e) => s + e.principal, 0),
            })
            toast({ title: "Loan updated", description: `${form.employeeName}'s loan saved.` })
        } else {
            addLoan({
                ...form,
                emiAmount: calculatedEMI,
                status: "Pending",
                remainingBalance: form.principal,
                emis,
            })
            toast({ title: "Loan submitted", description: `${form.loanType} of ${formatINR(form.principal)} pending approval.` })
        }
        setFormOpen(false)
        setEditingLoan(null)
        resetForm()
    }

    const handleApprove = (id: string) => {
        const loan = loans.find((l) => l.id === id)
        updateLoan(id, { status: "Active", disbursedDate: new Date().toISOString().split("T")[0] })
        toast({ title: "Loan approved", description: `${loan?.employeeName ?? "Loan"} disbursed.` })
    }

    const handleClose = () => {
        if (!closeTargetId) return
        const loan = loans.find((l) => l.id === closeTargetId)
        updateLoan(closeTargetId, {
            status: "Closed",
            remainingBalance: 0,
            emis: loan?.emis.map((e) => e.status === "Pending" ? { ...e, status: "Paid" } : e) ?? [],
        })
        toast({ title: "Loan closed", description: `${loan?.employeeName ?? "Loan"} prepaid in full.` })
        setCloseConfirmOpen(false)
        setCloseTargetId(null)
    }

    const handleDelete = (id: string) => {
        const loan = loans.find((l) => l.id === id)
        deleteLoan(id)
        toast({ title: "Loan deleted", description: `${loan?.employeeName ?? "Record"} removed.`, variant: "destructive" })
        setSelectedIds((prev) => prev.filter((i) => i !== id))
    }

    const handleBulkApprove = () => {
        if (!selectedIds.length) return
        const eligible = selectedIds.filter((id) => loans.find((l) => l.id === id)?.status === "Pending")
        if (!eligible.length) {
            toast({ title: "Nothing to approve", description: "Only pending loans can be approved.", variant: "destructive" })
            return
        }
        bulkUpdateLoanStatus(eligible, "Active")
        toast({ title: `Approved ${eligible.length}`, description: "Loans disbursed in bulk." })
        setSelectedIds([])
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        bulkDeleteLoans(selectedIds)
        toast({ title: `Deleted ${selectedIds.length}`, variant: "destructive" })
        setSelectedIds([])
        setDeleteConfirmOpen(false)
    }

    const handleMarkEmiPaid = (loanId: string, month: string) => {
        markEmiPaid(loanId, month)
        // Sync viewing loan
        setTimeout(() => {
            const updated = useSalaryStore.getState().loans.find((l) => l.id === loanId)
            if (updated) setViewingLoan(updated)
        }, 0)
        toast({ title: "EMI marked paid", description: month })
    }

    // ── Round 2 handlers ──────────────────────────────────
    const openEligibilityFromHeader = () => {
        setEligibilityLoan(null)
        setEligibilityForm({
            employeeId: "",
            employeeName: "",
            requestedAmount: 100000,
            tenure: 12,
            monthlyGross: 50000,
            existingObligations: 0,
        })
        setEligibilityOpen(true)
    }

    const openEligibilityForLoan = (l: Loan) => {
        setEligibilityLoan(l)
        setEligibilityForm({
            employeeId: l.employeeId,
            employeeName: l.employeeName,
            requestedAmount: l.principal,
            tenure: l.tenure,
            monthlyGross: l.monthlyGross ?? 50000,
            existingObligations: l.existingObligations ?? 0,
        })
        setEligibilityOpen(true)
    }

    const eligibilityResult = useMemo(() => {
        return computeLoanEligibility(
            eligibilityForm.employeeId || "__NEW__",
            eligibilityForm.requestedAmount,
            eligibilityForm.tenure,
            eligibilityForm.monthlyGross,
            eligibilityForm.existingObligations,
        )
    }, [eligibilityForm, computeLoanEligibility])

    const handleSaveEligibilityToLoan = () => {
        if (!eligibilityLoan) return
        updateLoan(eligibilityLoan.id, {
            monthlyGross: eligibilityForm.monthlyGross,
            existingObligations: eligibilityForm.existingObligations,
            eligibilityScore: eligibilityResult.score,
            eligibilityNotes: eligibilityResult.notes,
        })
        toast({ title: "Eligibility saved", description: `${eligibilityLoan.employeeName} · score ${eligibilityResult.score}` })
        setEligibilityOpen(false)
    }

    const openPrepaymentForLoan = (l: Loan) => {
        setPrepaymentLoan(l)
        setPrepaymentForm({ type: "Partial", amount: 0, notes: "" })
        setPrepaymentOpen(true)
    }

    const prepaymentPreview = useMemo(() => {
        if (!prepaymentLoan) return { newBalance: 0, emisRemaining: 0 }
        if (prepaymentForm.type === "Full") {
            return { newBalance: 0, emisRemaining: 0 }
        }
        const newBalance = Math.max(0, prepaymentLoan.remainingBalance - (prepaymentForm.amount || 0))
        const pending = prepaymentLoan.emis.filter((e) => e.status !== "Paid").length
        const emisRemaining = newBalance === 0 ? 0 : pending
        return { newBalance, emisRemaining }
    }, [prepaymentLoan, prepaymentForm])

    const handleConfirmPrepayment = () => {
        if (!prepaymentLoan) return
        const amount = prepaymentForm.type === "Full" ? prepaymentLoan.remainingBalance : prepaymentForm.amount
        if (prepaymentForm.type === "Partial" && (!amount || amount <= 0)) {
            toast({ title: "Invalid amount", description: "Enter a positive prepayment amount.", variant: "destructive" })
            return
        }
        const res = recordPrepayment(prepaymentLoan.id, amount, prepaymentForm.type, prepaymentForm.notes || undefined)
        toast({ title: "Prepayment recorded", description: `New balance: ${formatINR(res.newBalance)} · ${res.emisRemaining} EMI${res.emisRemaining === 1 ? "" : "s"} remaining` })
        // Sync viewing loan if open
        setTimeout(() => {
            const updated = useSalaryStore.getState().loans.find((l) => l.id === prepaymentLoan.id)
            if (updated && viewingLoan?.id === updated.id) setViewingLoan(updated)
        }, 0)
        setPrepaymentOpen(false)
        setPrepaymentLoan(null)
    }

    const handleRegenerateSchedule = (l: Loan) => {
        regenerateEmiSchedule(l.id)
        toast({ title: "Schedule regenerated", description: `${l.employeeName}'s EMI schedule rebuilt with current rate.` })
        setTimeout(() => {
            const updated = useSalaryStore.getState().loans.find((ln) => ln.id === l.id)
            if (updated && viewingLoan?.id === updated.id) setViewingLoan(updated)
        }, 0)
    }

    const openEmiPreview = (l: Loan) => {
        setEmiPreviewLoan(l)
        setEmiPreviewOpen(true)
    }

    const bulkEmiMonths = useMemo(() => {
        const months = new Set<string>()
        loans
            .filter((l) => selectedIds.includes(l.id))
            .forEach((l) => l.emis.filter((e) => e.status !== "Paid").forEach((e) => months.add(e.month)))
        return Array.from(months)
    }, [loans, selectedIds])

    const openBulkEmiDialog = () => {
        if (!bulkEmiMonths.length) {
            toast({ title: "No pending EMIs", description: "Selected loans have no pending EMIs to mark.", variant: "destructive" })
            return
        }
        setBulkEmiMonth(bulkEmiMonths[0])
        setBulkEmiOpen(true)
    }

    const handleConfirmBulkEmi = () => {
        if (!bulkEmiMonth) return
        const res = bulkMarkEmiPaid(selectedIds, bulkEmiMonth)
        toast({ title: `Marked ${res.updated} EMI${res.updated === 1 ? "" : "s"} paid`, description: `Month: ${bulkEmiMonth}` })
        setBulkEmiOpen(false)
        setSelectedIds([])
    }

    const handleExport = () => {
        if (!loans.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Employee", "Code", "Type", "Principal", "Rate (%)", "Tenure (m)", "EMI", "Outstanding", "Status", "Disbursed"]
        const rows = loans.map((l) => [
            `"${l.employeeName}"`,
            l.employeeId,
            l.loanType,
            l.principal,
            l.interestRate,
            l.tenure,
            l.emiAmount,
            l.remainingBalance,
            l.status,
            l.disbursedDate,
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `loan_register_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${loans.length} loans downloaded.` })
    }

    const handleExportEmiSchedule = (l: Loan) => {
        const headers = ["Month", "EMI", "Principal", "Interest", "Status"]
        const rows = l.emis.map((e) => [e.month, e.amount, e.principal, e.interest, e.status].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `emi_schedule_${l.employeeId}_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "EMI schedule exported", description: l.employeeName })
    }

    // ── Render ─────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Landmark size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Loans & Advances</h1>
                            <p className="text-xs font-medium text-slate-500">
                                Loan book with EMI tracking and auto-amortisation
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={openEligibilityFromHeader}
                            className="h-9 rounded-lg border-violet-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-violet-50 text-violet-600"
                        >
                            <Gauge size={14} /> <span className="hidden md:inline">Eligibility check</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export register</span>
                        </Button>
                        <Button
                            onClick={openAddForm}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            <Plus size={14} /> <span className="hidden md:inline">New loan</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Active loans" value={String(stats.activeCount)} caption={`${stats.pendingCount} pending`} icon={CreditCard} color="#8B5CF6" />
                            <StatCard label="Total outstanding" value={formatINR(stats.totalOutstanding)} caption="Across active loans" icon={Wallet} color="#F59E0B" />
                            <StatCard label="EMIs due" value={String(stats.emisDueThisMonth)} caption="This cycle" icon={Clock} color="#0EA5E9" />
                            <StatCard label="Avg interest" value={`${stats.avgRate}%`} caption="Active portfolio" icon={Percent} color="#10B981" />
                        </div>

                        {/* Table */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                                <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                    <div className="space-y-2">
                                        <CardTitle className="text-base font-bold text-slate-900">Loan ledger</CardTitle>
                                        <TabsList className="bg-slate-100 p-1 rounded-lg h-9">
                                            {[
                                                { id: "all", label: `All (${loans.length})` },
                                                { id: "active", label: `Active (${stats.activeCount})` },
                                                { id: "pending", label: `Pending (${stats.pendingCount})` },
                                                { id: "closed", label: `Closed (${stats.closedCount})` },
                                                { id: "advances", label: "Advances" },
                                            ].map((t) => (
                                                <TabsTrigger
                                                    key={t.id}
                                                    value={t.id}
                                                    className="rounded-md px-3 h-7 font-semibold text-[11px] data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm"
                                                >
                                                    {t.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="relative flex-1 min-w-[200px] lg:w-56 lg:flex-none">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                placeholder="Search by name, code, type..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-9 h-9 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                            />
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn("h-9 rounded-lg font-semibold text-xs gap-2",
                                                        hasActiveFilters ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5" : "border-slate-200 text-slate-600")}
                                                >
                                                    <Filter size={14} /> Filter
                                                    {hasActiveFilters && (
                                                        <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold h-4 px-1.5">1</Badge>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="end" className="w-60 p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-bold text-slate-900">Filter</h4>
                                                    {hasActiveFilters && (
                                                        <Button variant="ghost" size="sm" onClick={() => setTypeFilter("all")} className="h-7 text-xs font-semibold text-rose-500 hover:text-rose-600 px-2">
                                                            <RotateCcw size={12} className="mr-1" /> Reset
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[11px] font-semibold text-slate-600">Type</Label>
                                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All types</SelectItem>
                                                            {LOAN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                                                className="bg-[#8B5CF6]/5 border-b border-[#8B5CF6]/10 px-6 py-3 flex flex-wrap items-center justify-between gap-2"
                                            >
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <span className="text-xs font-bold text-[#8B5CF6]">{selectedIds.length} selected</span>
                                                    <span className="h-4 w-px bg-slate-200 mx-1" />
                                                    <Button size="sm" onClick={handleBulkApprove} className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold px-3 rounded-md border-none">
                                                        <CheckCircle2 size={12} className="mr-1" /> Approve
                                                    </Button>
                                                    <Button size="sm" onClick={openBulkEmiDialog} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10">
                                                        <ListChecks size={12} className="mr-1" /> Mark EMI paid (month)
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

                                    <TabsContent value={activeTab} className="m-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 w-10">
                                                            <Checkbox
                                                                checked={filteredLoans.length > 0 && filteredLoans.every((l) => selectedIds.includes(l.id))}
                                                                onCheckedChange={toggleSelectAll}
                                                                disabled={filteredLoans.length === 0}
                                                                className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                            />
                                                        </TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Principal</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Rate / Tenure</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">EMI</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Outstanding</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredLoans.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={9} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                No loans found for this view.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredLoans.map((l) => {
                                                            const paidEmis = l.emis.filter((e) => e.status === "Paid").length
                                                            const completionPct = l.emis.length > 0 ? (paidEmis / l.emis.length) * 100 : 0
                                                            return (
                                                                <TableRow key={l.id} className={cn("group border-slate-50", selectedIds.includes(l.id) ? "bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10" : "hover:bg-slate-50/70")}>
                                                                    <TableCell className="pl-6 py-3">
                                                                        <Checkbox
                                                                            checked={selectedIds.includes(l.id)}
                                                                            onCheckedChange={() => toggleSelect(l.id)}
                                                                            className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                                {l.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                            </div>
                                                                            <div className="min-w-0">
                                                                                <div className="text-sm font-semibold text-slate-900 truncate">{l.employeeName}</div>
                                                                                <div className="text-[11px] font-medium text-slate-500 truncate">{l.employeeId}</div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-semibold",
                                                                            l.loanType === "Personal Loan" ? "bg-blue-50 text-blue-600" :
                                                                                l.loanType === "Salary Advance" ? "bg-amber-50 text-amber-600" :
                                                                                    "bg-rose-50 text-rose-600")}>
                                                                            {l.loanType}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-sm font-bold text-slate-900 tabular-nums">{formatINR(l.principal)}</TableCell>
                                                                    <TableCell className="py-3 text-xs font-semibold text-slate-700">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span>{l.interestRate}%</span>
                                                                            <span className="text-slate-300">•</span>
                                                                            <span>{l.tenure}m</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-sm font-bold text-[#8B5CF6] tabular-nums">{formatINR(l.emiAmount)}</TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="space-y-1 min-w-[110px]">
                                                                            <div className="text-sm font-bold text-amber-600 tabular-nums">{formatINR(l.remainingBalance)}</div>
                                                                            {l.status === "Active" && (
                                                                                <div className="space-y-1">
                                                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                                        <motion.div
                                                                                            className="h-full bg-emerald-500 rounded-full"
                                                                                            initial={{ width: 0 }}
                                                                                            animate={{ width: `${completionPct}%` }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="text-[10px] font-medium text-slate-400">{paidEmis}/{l.emis.length} EMIs paid</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <div className="flex flex-wrap items-center gap-1">
                                                                            <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                                l.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                                                                                    l.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                                                        "bg-slate-100 text-slate-500")}>
                                                                                {l.status}
                                                                            </Badge>
                                                                            {(l.prepayments?.length ?? 0) > 0 && (
                                                                                <Badge className="border-none text-[10px] font-semibold px-2 bg-emerald-50 text-emerald-600">
                                                                                    <Sparkles size={9} className="mr-0.5" /> Prepaid
                                                                                </Badge>
                                                                            )}
                                                                            {typeof l.eligibilityScore === "number" && (
                                                                                <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                                    l.eligibilityScore >= 70 ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600")}>
                                                                                    Score {l.eligibilityScore}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => { setViewingLoan(l); setDetailOpen(true) }}
                                                                                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100"
                                                                                    >
                                                                                        <Eye size={14} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>View EMI schedule</TooltipContent>
                                                                            </Tooltip>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                        <MoreHorizontal size={15} />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end" className="w-52">
                                                                                    {l.status === "Pending" && (
                                                                                        <DropdownMenuItem onClick={() => handleApprove(l.id)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                            <CheckCircle2 size={13} className="mr-2" /> Approve & disburse
                                                                                        </DropdownMenuItem>
                                                                                    )}
                                                                                    {l.status === "Active" && (
                                                                                        <>
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => openPrepaymentForLoan(l)}
                                                                                                className="cursor-pointer text-xs font-medium text-[#8B5CF6]"
                                                                                            >
                                                                                                <HandCoins size={13} className="mr-2" /> Prepayment
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => handleRegenerateSchedule(l)}
                                                                                                className="cursor-pointer text-xs font-medium text-blue-600"
                                                                                            >
                                                                                                <RefreshCw size={13} className="mr-2" /> Regenerate schedule
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => openEmiPreview(l)}
                                                                                                className="cursor-pointer text-xs font-medium text-slate-700"
                                                                                            >
                                                                                                <Zap size={13} className="mr-2" /> EMI preview
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => { setCloseTargetId(l.id); setCloseConfirmOpen(true) }}
                                                                                                className="cursor-pointer text-xs font-medium text-amber-600"
                                                                                            >
                                                                                                <XCircle size={13} className="mr-2" /> Close / prepay
                                                                                            </DropdownMenuItem>
                                                                                        </>
                                                                                    )}
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => openEligibilityForLoan(l)}
                                                                                        className="cursor-pointer text-xs font-medium text-violet-600"
                                                                                    >
                                                                                        <Gauge size={13} className="mr-2" /> Check eligibility
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem onClick={() => openEditForm(l)} className="cursor-pointer text-xs font-medium">
                                                                                        <Edit size={13} className="mr-2" /> Edit
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => handleExportEmiSchedule(l)} className="cursor-pointer text-xs font-medium">
                                                                                        <Download size={13} className="mr-2" /> Export schedule
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem onClick={() => handleDelete(l.id)} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
                                                                                        <Trash2 size={13} className="mr-2" /> Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </TabsContent>
                                </CardContent>
                            </Tabs>
                        </Card>
                    </div>
                </div>

                {/* ── Create / Edit Dialog ───────────── */}
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogContent className="max-w-xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingLoan ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingLoan ? "Edit loan" : "New loan request"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                EMI and amortisation are auto-computed. Tenure up to 120 months.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Employee name" required>
                                    <Input value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Rajesh Kumar" />
                                </FormField>
                                <FormField label="Employee ID">
                                    <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="h-10 text-sm font-medium" placeholder="EMP001" />
                                </FormField>
                                <FormField label="Loan type" required>
                                    <Select value={form.loanType} onValueChange={(v) => setForm({ ...form, loanType: v as Loan["loanType"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {LOAN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Disbursement date">
                                    <Input type="date" value={form.disbursedDate} onChange={(e) => setForm({ ...form, disbursedDate: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <FormField label="Principal (₹)" required>
                                    <Input type="number" value={form.principal || ""} onChange={(e) => setForm({ ...form, principal: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                                <FormField label="Interest rate (%)" required>
                                    <Input type="number" step="0.1" value={form.interestRate || ""} onChange={(e) => setForm({ ...form, interestRate: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                                <FormField label="Tenure (months)" required>
                                    <Input type="number" value={form.tenure || ""} onChange={(e) => setForm({ ...form, tenure: parseInt(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 border border-[#8B5CF6]/10 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Calculator size={14} className="text-[#8B5CF6]" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live calculation</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <PreviewStat label="Monthly EMI" value={formatINR(calculatedEMI)} color="text-[#8B5CF6]" />
                                    <PreviewStat label="Total interest" value={formatINR(totalInterestForForm)} color="text-rose-600" />
                                    <PreviewStat label="Total payable" value={formatINR(calculatedEMI * form.tenure)} color="text-slate-900" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveLoan} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingLoan ? "Save changes" : "Submit request"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── EMI Schedule Sheet ──────────────── */}
                <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                    <SheetContent className="sm:max-w-xl p-0 font-sans">
                        {viewingLoan && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-50 p-6 border-b border-slate-100 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Badge className={cn("border-none text-[10px] font-semibold px-2 py-0.5 mb-2 w-fit",
                                                viewingLoan.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                                                    viewingLoan.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                        "bg-slate-100 text-slate-500")}>
                                                {viewingLoan.loanType} • {viewingLoan.status}
                                            </Badge>
                                            <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">{viewingLoan.employeeName}</SheetTitle>
                                            <SheetDescription className="text-[11px] font-medium text-slate-500 truncate">
                                                {viewingLoan.employeeId} • Disbursed {viewingLoan.disbursedDate}
                                            </SheetDescription>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Monthly EMI</div>
                                            <div className="text-xl font-bold text-[#8B5CF6] tabular-nums">{formatINR(viewingLoan.emiAmount)}</div>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-5">
                                        <section className="grid grid-cols-3 gap-3">
                                            <MetricCard label="Principal" value={formatINR(viewingLoan.principal)} />
                                            <MetricCard label="Interest rate" value={`${viewingLoan.interestRate}%`} />
                                            <MetricCard label="Tenure" value={`${viewingLoan.tenure} months`} />
                                            <MetricCard label="Outstanding" value={formatINR(viewingLoan.remainingBalance)} color="text-amber-600" />
                                            <MetricCard label="Paid so far" value={formatINR(viewingLoan.principal - viewingLoan.remainingBalance)} color="text-emerald-600" />
                                            <MetricCard label="EMIs paid" value={`${viewingLoan.emis.filter((e) => e.status === "Paid").length}/${viewingLoan.emis.length}`} />
                                        </section>

                                        <section>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">EMI schedule</h4>
                                                <Button variant="outline" size="sm" onClick={() => handleExportEmiSchedule(viewingLoan)} className="h-8 text-[11px] font-semibold gap-1 border-slate-200 px-2">
                                                    <Download size={12} /> Export
                                                </Button>
                                            </div>
                                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                                <Table>
                                                    <TableHeader className="bg-slate-50">
                                                        <TableRow className="border-slate-100 hover:bg-transparent">
                                                            <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-4 h-9">Month</TableHead>
                                                            <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Principal</TableHead>
                                                            <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Interest</TableHead>
                                                            <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">EMI</TableHead>
                                                            <TableHead className="text-right pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {viewingLoan.emis.map((e, i) => (
                                                            <TableRow key={i} className="border-slate-50 hover:bg-slate-50/70">
                                                                <TableCell className="pl-4 py-2 text-xs font-semibold text-slate-700">{e.month}</TableCell>
                                                                <TableCell className="text-right text-xs font-semibold text-slate-800 tabular-nums">{formatINR(e.principal)}</TableCell>
                                                                <TableCell className="text-right text-xs font-semibold text-rose-600 tabular-nums">{formatINR(e.interest)}</TableCell>
                                                                <TableCell className="text-right text-xs font-bold text-slate-900 tabular-nums">{formatINR(e.amount)}</TableCell>
                                                                <TableCell className="text-right pr-4 py-2">
                                                                    <div className="flex items-center justify-end gap-1.5">
                                                                        <Badge className={cn("border-none text-[9px] font-semibold",
                                                                            e.status === "Paid" ? "bg-emerald-50 text-emerald-600" :
                                                                                e.status === "Overdue" ? "bg-rose-50 text-rose-600" :
                                                                                    "bg-slate-100 text-slate-500")}>
                                                                            {e.status}
                                                                        </Badge>
                                                                        {e.status === "Pending" && viewingLoan.status === "Active" && (
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        onClick={() => handleMarkEmiPaid(viewingLoan.id, e.month)}
                                                                                        className="h-6 w-6 p-0 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                                                                                    >
                                                                                        <CheckCircle2 size={12} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Mark EMI paid</TooltipContent>
                                                                            </Tooltip>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Summary</div>
                                            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <PolicyRow label="Total payable (principal + interest)" value={formatINR(viewingLoan.emiAmount * viewingLoan.tenure)} />
                                                <PolicyRow label="Interest component" value={formatINR(Math.max(0, viewingLoan.emiAmount * viewingLoan.tenure - viewingLoan.principal))} valueColor="text-rose-600" />
                                                <PolicyRow label="Paid principal" value={formatINR(viewingLoan.principal - viewingLoan.remainingBalance)} valueColor="text-emerald-600" />
                                                <PolicyRow label="Remaining balance" value={formatINR(viewingLoan.remainingBalance)} valueColor="text-amber-600" />
                                            </div>
                                        </section>

                                        {(viewingLoan.prepayments?.length ?? 0) > 0 && (
                                            <section>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <HandCoins size={12} className="text-emerald-600" />
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prepayment history</div>
                                                    <Badge className="border-none text-[9px] font-semibold bg-emerald-50 text-emerald-600">
                                                        {viewingLoan.prepayments!.length}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {viewingLoan.prepayments!.map((p: LoanPrepayment) => (
                                                        <div key={p.id} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Badge className={cn("border-none text-[9px] font-semibold",
                                                                        p.type === "Full" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                                                                        {p.type}
                                                                    </Badge>
                                                                    <span className="text-[10px] font-medium text-slate-500">{p.date}</span>
                                                                    {p.processedBy && <span className="text-[10px] font-medium text-slate-400">· {p.processedBy}</span>}
                                                                </div>
                                                                {p.notes && <div className="text-[11px] text-slate-600 font-medium truncate">{p.notes}</div>}
                                                            </div>
                                                            <div className="text-sm font-bold tabular-nums text-emerald-700 shrink-0">{formatINR(p.amount)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {(typeof viewingLoan.eligibilityScore === "number" || viewingLoan.eligibilityNotes) && (
                                            <section>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Gauge size={12} className="text-violet-600" />
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Eligibility snapshot</div>
                                                </div>
                                                <div className="p-3 bg-violet-50/40 border border-violet-100 rounded-xl space-y-2">
                                                    {typeof viewingLoan.eligibilityScore === "number" && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-semibold text-slate-600">Score</span>
                                                            <Badge className={cn("border-none text-[10px] font-bold",
                                                                viewingLoan.eligibilityScore >= 70 ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600")}>
                                                                {viewingLoan.eligibilityScore}/100
                                                            </Badge>
                                                        </div>
                                                    )}
                                                    {viewingLoan.eligibilityNotes && (
                                                        <div className="text-[11px] font-medium text-slate-600">{viewingLoan.eligibilityNotes}</div>
                                                    )}
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </ScrollArea>

                                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2 flex-wrap">
                                    {viewingLoan.status === "Pending" && (
                                        <Button
                                            onClick={() => { handleApprove(viewingLoan.id); setDetailOpen(false) }}
                                            className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none"
                                        >
                                            <CheckCircle2 size={13} className="mr-1.5" /> Approve & disburse
                                        </Button>
                                    )}
                                    {viewingLoan.status === "Active" && (
                                        <>
                                            <Button
                                                onClick={() => openPrepaymentForLoan(viewingLoan)}
                                                className="flex-1 h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none"
                                            >
                                                <HandCoins size={13} className="mr-1.5" /> Prepayment
                                            </Button>
                                            <Button
                                                onClick={() => { setCloseTargetId(viewingLoan.id); setCloseConfirmOpen(true) }}
                                                variant="outline"
                                                className="h-10 px-4 text-amber-600 border-amber-200 font-bold text-xs hover:bg-amber-50"
                                            >
                                                <XCircle size={13} className="mr-1.5" /> Close
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        onClick={() => { openEditForm(viewingLoan); setDetailOpen(false) }}
                                        variant="outline"
                                        className="h-10 px-4 font-semibold text-xs border-slate-200"
                                    >
                                        <Edit size={13} className="mr-1.5" /> Edit
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* ── Close Confirm ─────────────────── */}
                <Dialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                                <XCircle size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Close loan?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will mark all pending EMIs as paid and set the loan status to Closed. Cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCloseConfirmOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleClose} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <XCircle size={13} className="mr-1.5" /> Close loan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Eligibility Calculator ────────── */}
                <Dialog open={eligibilityOpen} onOpenChange={setEligibilityOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-2">
                                <Gauge size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Loan eligibility calculator</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                50% FOIR cap. Score drops for low income, multiple active loans, or long tenure.
                                {eligibilityLoan && (
                                    <span className="ml-1 text-violet-600 font-semibold">· {eligibilityLoan.employeeName}</span>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-3">
                                {!eligibilityLoan && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Employee name">
                                            <Input
                                                value={eligibilityForm.employeeName}
                                                onChange={(e) => setEligibilityForm({ ...eligibilityForm, employeeName: e.target.value })}
                                                className="h-10 text-sm font-medium"
                                                placeholder="e.g. Rajesh Kumar"
                                            />
                                        </FormField>
                                        <FormField label="Employee ID">
                                            <Input
                                                value={eligibilityForm.employeeId}
                                                onChange={(e) => setEligibilityForm({ ...eligibilityForm, employeeId: e.target.value })}
                                                className="h-10 text-sm font-medium"
                                                placeholder="EMP001"
                                            />
                                        </FormField>
                                    </div>
                                )}
                                <FormField label="Requested amount (₹)" required>
                                    <Input
                                        type="number"
                                        value={eligibilityForm.requestedAmount || ""}
                                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, requestedAmount: parseFloat(e.target.value) || 0 })}
                                        className="h-10 text-sm font-semibold tabular-nums"
                                    />
                                </FormField>
                                <FormField label="Tenure (months)" required>
                                    <Input
                                        type="number"
                                        value={eligibilityForm.tenure || ""}
                                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, tenure: parseInt(e.target.value) || 0 })}
                                        className="h-10 text-sm font-semibold tabular-nums"
                                    />
                                </FormField>
                                <FormField label="Monthly gross (₹)" required>
                                    <Input
                                        type="number"
                                        value={eligibilityForm.monthlyGross || ""}
                                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, monthlyGross: parseFloat(e.target.value) || 0 })}
                                        className="h-10 text-sm font-semibold tabular-nums"
                                    />
                                </FormField>
                                <FormField label="Existing EMI obligations (₹/mo)">
                                    <Input
                                        type="number"
                                        value={eligibilityForm.existingObligations || ""}
                                        onChange={(e) => setEligibilityForm({ ...eligibilityForm, existingObligations: parseFloat(e.target.value) || 0 })}
                                        className="h-10 text-sm font-semibold tabular-nums"
                                    />
                                </FormField>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-violet-600" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live result</span>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[11px] font-semibold text-slate-600">Eligibility score</span>
                                        <span className={cn("text-lg font-bold tabular-nums",
                                            eligibilityResult.score >= 70 ? "text-blue-600" : eligibilityResult.score >= 40 ? "text-amber-600" : "text-rose-600")}>
                                            {eligibilityResult.score}/100
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                                        <motion.div
                                            className={cn("h-full rounded-full",
                                                eligibilityResult.score >= 70 ? "bg-blue-500" : eligibilityResult.score >= 40 ? "bg-amber-500" : "bg-rose-500")}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${eligibilityResult.score}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <PreviewStat label="Max EMI" value={formatINR(eligibilityResult.maxEmi)} color="text-violet-600" />
                                    <PreviewStat label="Eligible amount" value={formatINR(eligibilityResult.eligibleAmount)} color="text-emerald-600" />
                                </div>
                                <div className="p-3 bg-white rounded-lg border border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Notes</div>
                                    <div className="text-[11px] font-medium text-slate-600 leading-relaxed">{eligibilityResult.notes}</div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setEligibilityOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            {eligibilityLoan && (
                                <Button onClick={handleSaveEligibilityToLoan} className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                    <CheckCircle2 size={13} className="mr-1.5" /> Save to loan
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Prepayment Dialog ─────────────── */}
                <Dialog open={prepaymentOpen} onOpenChange={setPrepaymentOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <HandCoins size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Record prepayment</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {prepaymentLoan && (
                                    <>
                                        {prepaymentLoan.employeeName} · current balance {formatINR(prepaymentLoan.remainingBalance)}
                                    </>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPrepaymentForm({ ...prepaymentForm, type: "Partial" })}
                                    className={cn("p-3 rounded-xl border-2 text-left transition-all",
                                        prepaymentForm.type === "Partial"
                                            ? "border-[#8B5CF6] bg-[#8B5CF6]/5"
                                            : "border-slate-200 bg-white hover:border-slate-300")}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center",
                                            prepaymentForm.type === "Partial" ? "border-[#8B5CF6]" : "border-slate-300")}>
                                            {prepaymentForm.type === "Partial" && <div className="h-2 w-2 rounded-full bg-[#8B5CF6]" />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">Partial</span>
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-500">Reduces balance, recomputes pending EMIs</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPrepaymentForm({ ...prepaymentForm, type: "Full" })}
                                    className={cn("p-3 rounded-xl border-2 text-left transition-all",
                                        prepaymentForm.type === "Full"
                                            ? "border-rose-400 bg-rose-50"
                                            : "border-slate-200 bg-white hover:border-slate-300")}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center",
                                            prepaymentForm.type === "Full" ? "border-rose-500" : "border-slate-300")}>
                                            {prepaymentForm.type === "Full" && <div className="h-2 w-2 rounded-full bg-rose-500" />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">Full</span>
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-500">Closes loan, marks pending EMIs paid</div>
                                </button>
                            </div>

                            {prepaymentForm.type === "Partial" && (
                                <FormField label="Prepayment amount (₹)" required>
                                    <Input
                                        type="number"
                                        value={prepaymentForm.amount || ""}
                                        onChange={(e) => setPrepaymentForm({ ...prepaymentForm, amount: parseFloat(e.target.value) || 0 })}
                                        className="h-10 text-sm font-semibold tabular-nums"
                                        placeholder="e.g. 25000"
                                    />
                                </FormField>
                            )}

                            <FormField label="Notes (optional)">
                                <Textarea
                                    value={prepaymentForm.notes}
                                    onChange={(e) => setPrepaymentForm({ ...prepaymentForm, notes: e.target.value })}
                                    rows={2}
                                    className="text-xs font-medium resize-none"
                                    placeholder="Reason, payment reference…"
                                />
                            </FormField>

                            <div className="p-3 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-xl grid grid-cols-2 gap-2">
                                <PreviewStat label="New balance" value={formatINR(prepaymentPreview.newBalance)} color="text-emerald-600" />
                                <PreviewStat label="EMIs remaining" value={String(prepaymentPreview.emisRemaining)} color="text-slate-900" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPrepaymentOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmPrepayment} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <HandCoins size={13} className="mr-1.5" /> Record prepayment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bulk EMI Mark Paid ────────────── */}
                <Dialog open={bulkEmiOpen} onOpenChange={setBulkEmiOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                                <ListChecks size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Bulk mark EMI paid</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Marks the chosen month's EMI as paid across {selectedIds.length} selected loan{selectedIds.length === 1 ? "" : "s"}. Only loans with that pending month are affected.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Month" required>
                                <Select value={bulkEmiMonth} onValueChange={setBulkEmiMonth}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Pick a month" /></SelectTrigger>
                                    <SelectContent>
                                        {bulkEmiMonths.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormField>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setBulkEmiOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmBulkEmi} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                <CheckCircle2 size={13} className="mr-1.5" /> Mark paid
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── EMI Preview Dialog ────────────── */}
                <Dialog open={emiPreviewOpen} onOpenChange={setEmiPreviewOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <Zap size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Upcoming EMI preview</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {emiPreviewLoan && (<>Next 3 pending EMIs for {emiPreviewLoan.employeeName}.</>)}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            {emiPreviewLoan && (() => {
                                const upcoming = emiPreviewLoan.emis.filter((e) => e.status !== "Paid").slice(0, 3)
                                if (!upcoming.length) {
                                    return <div className="text-center py-8 text-slate-400 text-sm font-medium">No pending EMIs.</div>
                                }
                                return (
                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow className="border-slate-100 hover:bg-transparent">
                                                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-4 h-9">Month</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Amount</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Principal</TableHead>
                                                    <TableHead className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Interest</TableHead>
                                                    <TableHead className="text-right pr-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider h-9">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {upcoming.map((e, i) => (
                                                    <TableRow key={i} className="border-slate-50 hover:bg-slate-50/70">
                                                        <TableCell className="pl-4 py-2 text-xs font-semibold text-slate-700">{e.month}</TableCell>
                                                        <TableCell className="text-right text-xs font-bold text-slate-900 tabular-nums">{formatINR(e.amount)}</TableCell>
                                                        <TableCell className="text-right text-xs font-semibold text-slate-700 tabular-nums">{formatINR(e.principal)}</TableCell>
                                                        <TableCell className="text-right text-xs font-semibold text-rose-600 tabular-nums">{formatINR(e.interest)}</TableCell>
                                                        <TableCell className="text-right pr-4 py-2">
                                                            <Badge className={cn("border-none text-[9px] font-semibold",
                                                                e.status === "Overdue" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500")}>
                                                                {e.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )
                            })()}
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setEmiPreviewOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            {emiPreviewLoan && (
                                <Button
                                    onClick={() => { setEmiPreviewOpen(false); setViewingLoan(emiPreviewLoan); setDetailOpen(true) }}
                                    variant="outline"
                                    className="h-10 px-4 font-semibold text-xs border-slate-200"
                                >
                                    <ArrowRight size={13} className="mr-1.5" /> Full schedule
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Delete Confirm ────────────────── */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete {selectedIds.length} loan{selectedIds.length > 1 ? "s" : ""}?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Permanent removal of records and EMI schedules.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleBulkDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// Subcomponents
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

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {children}
    </div>
)

const MetricCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={cn("text-sm font-bold tabular-nums mt-0.5", color ?? "text-slate-900")}>{value}</div>
    </div>
)

const PreviewStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={cn("text-sm font-bold tabular-nums mt-0.5", color)}>{value}</div>
    </div>
)

const PolicyRow = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={cn("text-xs font-semibold", valueColor ?? "text-slate-800")}>{value}</span>
    </div>
)

export default LoansPage
