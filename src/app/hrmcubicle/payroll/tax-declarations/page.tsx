"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Search,
    Filter,
    AlertTriangle,
    Scale,
    MoreHorizontal,
    Eye,
    X,
    Bookmark,
    Download,
    Bell,
    Trash2,
    Plus,
    Edit,
    ChevronDown,
    RotateCcw,
    TrendingDown,
    FileCheck,
    Calculator,
    Link2,
    Lock,
    Unlock,
    Sparkles,
    TrendingUp,
    ArrowLeftRight,
    Target,
    Wand2,
    PiggyBank,
    Zap,
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
import { ScrollArea } from "@/shared/components/ui/scroll-area"
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
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { usePayrollStore, type TaxDeclaration } from "@/shared/data/payroll-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const FISCAL_YEARS = ["2025-26", "2024-25", "2023-24"]

const INVESTMENT_CATEGORIES = [
    { code: "80C", name: "80C — Investments", max: 150000, subTypes: ["LIC Premium", "PPF", "ELSS Mutual Fund", "EPF", "NSC", "Tax Saver FD", "Tuition Fees", "Principal (Home Loan)"] },
    { code: "80CCD(1B)", name: "80CCD(1B) — NPS", max: 50000, subTypes: ["NPS Contribution"] },
    { code: "80D", name: "80D — Health Insurance", max: 100000, subTypes: ["Health Insurance (Self+Family)", "Parents Health Insurance", "Preventive Health Check-up"] },
    { code: "80E", name: "80E — Education Loan Interest", max: -1, subTypes: ["Education Loan Interest"] },
    { code: "80G", name: "80G — Donations", max: -1, subTypes: ["Donations"] },
    { code: "HRA", name: "HRA — House Rent", max: -1, subTypes: ["Rent Paid"] },
    { code: "Sec 24", name: "Sec 24 — Home Loan Interest", max: 200000, subTypes: ["Home Loan Interest"] },
    { code: "80TTA", name: "80TTA — Savings Interest", max: 10000, subTypes: ["Savings Bank Interest"] },
]

const REJECTION_TAGS = ["Missing Documents", "Invalid Proof", "Amount Mismatch", "Outside FY", "Policy Gap"]

const emptyDeclarationForm: Omit<TaxDeclaration, "id"> = {
    empCode: "",
    employeeId: "",
    employeeName: "",
    dept: "",
    pan: "",
    fiscalYear: "2025-26",
    regime: "New",
    status: "Pending",
    grossSalary: 0,
    basicSalary: 0,
    totalSavings: 0,
    estimatedTax: 0,
    taxableIncome: 0,
    declarations: [],
    submittedDate: new Date().toISOString().split("T")[0],
}

// Rough tax calculator (FY 2025-26 simplified slabs)
const calculateTax = (taxableIncome: number, regime: "Old" | "New"): number => {
    if (taxableIncome <= 0) return 0
    let tax = 0
    if (regime === "New") {
        // FY 2025-26 new regime slabs (rough)
        const slabs = [
            { upto: 300000, rate: 0 },
            { upto: 700000, rate: 0.05 },
            { upto: 1000000, rate: 0.10 },
            { upto: 1200000, rate: 0.15 },
            { upto: 1500000, rate: 0.20 },
            { upto: Infinity, rate: 0.30 },
        ]
        let prev = 0
        for (const s of slabs) {
            if (taxableIncome > prev) {
                const slice = Math.min(taxableIncome, s.upto) - prev
                tax += slice * s.rate
                prev = s.upto
            }
        }
    } else {
        // Old regime slabs
        const slabs = [
            { upto: 250000, rate: 0 },
            { upto: 500000, rate: 0.05 },
            { upto: 1000000, rate: 0.20 },
            { upto: Infinity, rate: 0.30 },
        ]
        let prev = 0
        for (const s of slabs) {
            if (taxableIncome > prev) {
                const slice = Math.min(taxableIncome, s.upto) - prev
                tax += slice * s.rate
                prev = s.upto
            }
        }
    }
    // 4% cess
    return Math.round(tax * 1.04)
}

const TaxDeclarationsPage = () => {
    const router = useRouter()
    const {
        declarations,
        proofs,
        addDeclaration,
        updateDeclaration,
        deleteDeclaration,
        approveDeclaration,
        rejectDeclaration,
        bulkUpdateDeclarationStatus,
        bulkDeleteDeclarations,
        // Round 2
        lockDeclaration,
        unlockDeclaration,
        recommendRegime,
        recommendAllRegimes,
        bulkFlipRegime,
        runGapAnalysis,
    } = usePayrollStore()
    const { toast } = useToast()

    // ── State ──────────────────────────────────────────────
    const [fyFilter, setFyFilter] = useState<string>("2025-26")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [regimeFilter, setRegimeFilter] = useState<string>("all")
    const [deptFilter, setDeptFilter] = useState<string>("all")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const [formOpen, setFormOpen] = useState(false)
    const [detailOpen, setDetailOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [regimeCompareOpen, setRegimeCompareOpen] = useState(false)

    // ─ Round 2 state ─
    const [lockDialogOpen, setLockDialogOpen] = useState(false)
    const [lockTarget, setLockTarget] = useState<TaxDeclaration | null>(null)
    const [lockUntilDate, setLockUntilDate] = useState("")
    const [lockReasonInput, setLockReasonInput] = useState("")
    const [plannerOpen, setPlannerOpen] = useState(false)
    const [plannerTarget, setPlannerTarget] = useState<TaxDeclaration | null>(null)
    const [plannerSec80C, setPlannerSec80C] = useState(0)
    const [plannerSec80D, setPlannerSec80D] = useState(0)
    const [plannerHRA, setPlannerHRA] = useState(0)
    const [plannerSec24, setPlannerSec24] = useState(0)
    const [plannerNPS, setPlannerNPS] = useState(0)
    const [bulkFlipOpen, setBulkFlipOpen] = useState(false)
    const [bulkFlipTarget, setBulkFlipTarget] = useState<"Old" | "New">("New")
    const [recommendResult, setRecommendResult] = useState<{ analyzed: number; switched: number } | null>(null)
    const [gapOpen, setGapOpen] = useState(false)
    const [gapTarget, setGapTarget] = useState<TaxDeclaration | null>(null)

    const [editingDec, setEditingDec] = useState<TaxDeclaration | null>(null)
    const [selectedDec, setSelectedDec] = useState<TaxDeclaration | null>(null)
    const [formData, setFormData] = useState<Omit<TaxDeclaration, "id">>(emptyDeclarationForm)
    const [rejectTargetId, setRejectTargetId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    // Declaration line item form (inside add/edit dialog)
    const [newLineCategory, setNewLineCategory] = useState<string>("80C")
    const [newLineSubCategory, setNewLineSubCategory] = useState<string>("")
    const [newLineAmount, setNewLineAmount] = useState<string>("")

    // ── Derived data ───────────────────────────────────────
    const fyDeclarations = useMemo(
        () => declarations.filter((d) => d.fiscalYear === fyFilter),
        [declarations, fyFilter]
    )

    const filteredDeclarations = useMemo(() => {
        return fyDeclarations.filter((d) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                if (
                    !d.employeeName.toLowerCase().includes(q) &&
                    !d.employeeId.toLowerCase().includes(q) &&
                    !(d.empCode ?? "").toLowerCase().includes(q) &&
                    !(d.dept ?? "").toLowerCase().includes(q) &&
                    !(d.pan ?? "").toLowerCase().includes(q)
                ) return false
            }
            if (statusFilter !== "all" && d.status !== statusFilter) return false
            if (regimeFilter !== "all" && d.regime !== regimeFilter) return false
            if (deptFilter !== "all" && d.dept !== deptFilter) return false
            return true
        })
    }, [fyDeclarations, searchQuery, statusFilter, regimeFilter, deptFilter])

    const stats = useMemo(() => {
        const verified = fyDeclarations.filter((d) => d.status === "Verified")
        const pending = fyDeclarations.filter((d) => d.status === "Pending")
        const submitted = fyDeclarations.filter((d) => d.status === "Submitted")
        const rejected = fyDeclarations.filter((d) => d.status === "Rejected")
        const totalTax = fyDeclarations.reduce((s, d) => s + (d.estimatedTax || 0), 0)
        const totalSavings = fyDeclarations.reduce((s, d) => s + (d.totalSavings || 0), 0)
        return {
            total: fyDeclarations.length,
            verified: verified.length,
            pending: pending.length,
            submitted: submitted.length,
            rejected: rejected.length,
            totalTax,
            totalSavings,
            oldCount: fyDeclarations.filter((d) => d.regime === "Old").length,
            newCount: fyDeclarations.filter((d) => d.regime === "New").length,
        }
    }, [fyDeclarations])

    const availableDepts = useMemo(
        () => Array.from(new Set(fyDeclarations.map((d) => d.dept).filter(Boolean) as string[])),
        [fyDeclarations]
    )

    const hasActiveFilters = statusFilter !== "all" || regimeFilter !== "all" || deptFilter !== "all"
    const clearFilters = () => { setStatusFilter("all"); setRegimeFilter("all"); setDeptFilter("all"); setSearchQuery("") }

    // ── Selection ──────────────────────────────────────────
    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

    const toggleSelectAll = () => {
        const visible = filteredDeclarations.map((d) => d.id)
        const allSel = visible.every((id) => selectedIds.includes(id))
        if (allSel) setSelectedIds((prev) => prev.filter((id) => !visible.includes(id)))
        else setSelectedIds((prev) => Array.from(new Set([...prev, ...visible])))
    }

    // ── Form helpers ───────────────────────────────────────
    const openAddForm = () => {
        setEditingDec(null)
        setFormData({ ...emptyDeclarationForm, fiscalYear: fyFilter })
        setNewLineCategory("80C")
        setNewLineSubCategory("")
        setNewLineAmount("")
        setFormOpen(true)
    }

    const openEditForm = (dec: TaxDeclaration) => {
        setEditingDec(dec)
        setFormData({
            empCode: dec.empCode,
            employeeId: dec.employeeId,
            employeeName: dec.employeeName,
            dept: dec.dept,
            pan: dec.pan,
            fiscalYear: dec.fiscalYear,
            regime: dec.regime,
            status: dec.status,
            grossSalary: dec.grossSalary,
            basicSalary: dec.basicSalary,
            totalSavings: dec.totalSavings,
            estimatedTax: dec.estimatedTax,
            taxableIncome: dec.taxableIncome,
            declarations: [...dec.declarations],
            submittedDate: dec.submittedDate,
            verifiedDate: dec.verifiedDate,
            verifiedBy: dec.verifiedBy,
            rejectedDate: dec.rejectedDate,
            rejectionReason: dec.rejectionReason,
            notes: dec.notes,
        })
        setFormOpen(true)
    }

    // Live-computed totals for the form
    const formTotals = useMemo(() => {
        const savings = formData.declarations.reduce((s, d) => s + (d.amount || 0), 0)
        const taxableIncome = Math.max(0, (formData.grossSalary || 0) - (formData.regime === "Old" ? savings : 0))
        const tax = calculateTax(taxableIncome, formData.regime)
        return { savings, taxableIncome, tax }
    }, [formData])

    const addLineItem = () => {
        const amount = parseFloat(newLineAmount) || 0
        if (amount <= 0) {
            toast({ title: "Invalid amount", description: "Enter a positive amount.", variant: "destructive" })
            return
        }
        const cat = INVESTMENT_CATEGORIES.find((c) => c.code === newLineCategory)
        if (cat && cat.max > 0) {
            const existing = formData.declarations.filter((d) => d.category === newLineCategory).reduce((s, d) => s + d.amount, 0)
            if (existing + amount > cat.max) {
                toast({
                    title: "Exceeds cap",
                    description: `${cat.name} cap is ${formatINR(cat.max)}. Current total: ${formatINR(existing + amount)}.`,
                    variant: "destructive",
                })
                return
            }
        }
        setFormData({
            ...formData,
            declarations: [
                ...formData.declarations,
                {
                    id: `ln-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                    category: newLineCategory,
                    subCategory: newLineSubCategory || undefined,
                    amount,
                },
            ],
        })
        setNewLineSubCategory("")
        setNewLineAmount("")
    }

    const removeLineItem = (idx: number) => {
        setFormData({
            ...formData,
            declarations: formData.declarations.filter((_, i) => i !== idx),
        })
    }

    const handleSubmitForm = () => {
        if (!formData.employeeName || !formData.employeeId || !formData.fiscalYear) {
            toast({ title: "Missing fields", description: "Employee name, ID and fiscal year are required.", variant: "destructive" })
            return
        }
        const payload: Omit<TaxDeclaration, "id"> = {
            ...formData,
            totalSavings: formTotals.savings,
            taxableIncome: formTotals.taxableIncome,
            estimatedTax: formTotals.tax,
            submittedDate: formData.submittedDate || new Date().toISOString().split("T")[0],
        }
        if (editingDec) {
            updateDeclaration(editingDec.id, payload)
            toast({ title: "Declaration updated", description: `${formData.employeeName} — ${formData.fiscalYear}.` })
        } else {
            addDeclaration(payload)
            toast({ title: "Declaration added", description: `${formData.employeeName} — ${formData.fiscalYear}.` })
        }
        setFormOpen(false)
        setEditingDec(null)
    }

    const handleApprove = (dec: TaxDeclaration) => {
        approveDeclaration(dec.id, "HR Manager")
        toast({ title: "Verified", description: `${dec.employeeName}'s declaration verified.` })
    }

    const openRejectDialog = (id: string) => {
        setRejectTargetId(id)
        setRejectReason("")
        setRejectOpen(true)
    }

    const handleConfirmReject = () => {
        if (!rejectTargetId) return
        if (!rejectReason.trim()) {
            toast({ title: "Reason required", description: "Explain what's wrong.", variant: "destructive" })
            return
        }
        rejectDeclaration(rejectTargetId, rejectReason)
        toast({ title: "Declaration rejected", description: "Employee will be notified.", variant: "destructive" })
        setRejectOpen(false)
        setRejectReason("")
        setRejectTargetId(null)
    }

    const handleDelete = (id: string) => {
        const dec = declarations.find((d) => d.id === id)
        deleteDeclaration(id)
        toast({ title: "Declaration removed", description: `${dec?.employeeName ?? "Record"} deleted.`, variant: "destructive" })
        setSelectedIds((prev) => prev.filter((i) => i !== id))
    }

    const handleBulkVerify = () => {
        if (!selectedIds.length) return
        bulkUpdateDeclarationStatus(selectedIds, "Verified")
        toast({ title: `Verified ${selectedIds.length}`, description: "Bulk verification complete." })
        setSelectedIds([])
    }

    // ─── Round 2 handlers ────────────────────────────────
    const openLockDialog = (dec: TaxDeclaration) => {
        setLockTarget(dec)
        setLockUntilDate(dec.lockedUntil ?? "")
        setLockReasonInput(dec.lockReason ?? "")
        setLockDialogOpen(true)
    }

    const handleConfirmLock = () => {
        if (!lockTarget) return
        if (!lockUntilDate) {
            toast({ title: "Lock date required", variant: "destructive" })
            return
        }
        lockDeclaration(lockTarget.id, lockUntilDate, "HR Admin", lockReasonInput || undefined)
        toast({
            title: "Declaration locked",
            description: `${lockTarget.employeeName} can't edit until ${lockUntilDate}`,
        })
        setLockDialogOpen(false)
        setLockTarget(null)
    }

    const handleUnlock = (dec: TaxDeclaration) => {
        unlockDeclaration(dec.id)
        toast({ title: "Unlocked", description: `${dec.employeeName} can edit again.` })
    }

    const handleRecommendSingle = (dec: TaxDeclaration) => {
        recommendRegime(dec.id)
        const updated = usePayrollStore.getState().declarations.find(d => d.id === dec.id)
        if (updated?.recommendedRegime && updated.recommendedRegime !== updated.regime) {
            toast({
                title: `Switch to ${updated.recommendedRegime} regime`,
                description: `Would save ${formatINR(updated.recommendedSavings ?? 0)} annually`,
            })
        } else {
            toast({ title: "Current regime is optimal", description: "No switch needed." })
        }
    }

    const handleRecommendAll = () => {
        const result = recommendAllRegimes()
        setRecommendResult(result)
        toast({
            title: `Analyzed ${result.analyzed} declarations`,
            description: `${result.switched} would benefit from switching regime.`,
        })
    }

    const handleRunGap = (dec: TaxDeclaration) => {
        runGapAnalysis(dec.id)
        const updated = usePayrollStore.getState().declarations.find(d => d.id === dec.id)
        if (updated) {
            setGapTarget(updated)
            setGapOpen(true)
        }
    }

    const openBulkFlip = () => {
        if (!selectedIds.length) {
            toast({ title: "Select declarations first", variant: "destructive" })
            return
        }
        setBulkFlipTarget("New")
        setBulkFlipOpen(true)
    }

    const handleConfirmBulkFlip = () => {
        bulkFlipRegime(selectedIds, bulkFlipTarget)
        toast({
            title: `Flipped ${selectedIds.length} to ${bulkFlipTarget} regime`,
            description: "Tax recomputation is instant.",
        })
        setBulkFlipOpen(false)
        setSelectedIds([])
    }

    const openPlanner = (dec: TaxDeclaration) => {
        setPlannerTarget(dec)
        // Initialize with current category totals
        const byCategory = new Map<string, number>()
        dec.declarations.forEach(line => {
            byCategory.set(line.category, (byCategory.get(line.category) ?? 0) + line.amount)
        })
        setPlannerSec80C(byCategory.get("80C") ?? 0)
        setPlannerSec80D(byCategory.get("80D") ?? 0)
        setPlannerHRA(byCategory.get("HRA") ?? 0)
        setPlannerSec24(byCategory.get("Sec 24") ?? 0)
        setPlannerNPS(byCategory.get("80CCD(1B)") ?? 0)
        setPlannerOpen(true)
    }

    const handleBulkDelete = () => {
        if (!selectedIds.length) return
        bulkDeleteDeclarations(selectedIds)
        toast({ title: `Deleted ${selectedIds.length}`, variant: "destructive" })
        setSelectedIds([])
        setDeleteConfirmOpen(false)
    }

    const handleRemindPending = () => {
        const pendingEmps = fyDeclarations.filter((d) => d.status === "Pending")
        if (!pendingEmps.length) {
            toast({ title: "No one to remind", description: "All declarations are submitted." })
            return
        }
        toast({
            title: "Reminders sent",
            description: `Notification queued for ${pendingEmps.length} employee${pendingEmps.length > 1 ? "s" : ""} with pending declarations.`,
        })
    }

    const handleExport = () => {
        const source = filteredDeclarations.length ? filteredDeclarations : fyDeclarations
        if (!source.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = [
            "Emp Code", "Name", "Department", "PAN", "Fiscal Year", "Regime",
            "Gross Salary", "Basic", "Taxable Income", "Total Savings", "Estimated Tax",
            "Status", "Submitted", "Verified By", "Declaration Items",
        ]
        const rows = source.map((d) => {
            const items = d.declarations.map((x) => `${x.category}:${x.amount}`).join("; ")
            return [
                d.empCode ?? d.employeeId,
                `"${d.employeeName}"`,
                d.dept ?? "",
                d.pan ?? "",
                d.fiscalYear,
                d.regime,
                d.grossSalary ?? 0,
                d.basicSalary ?? 0,
                d.taxableIncome ?? 0,
                d.totalSavings,
                d.estimatedTax,
                d.status,
                d.submittedDate ?? "",
                d.verifiedBy ?? "",
                `"${items}"`,
            ].join(",")
        })
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `tax_declarations_${fyFilter}_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${source.length} rows downloaded.` })
    }

    const linkedProofs = (decId: string) => proofs.filter((p) => p.linkedDeclarationId === decId)

    // ── Render ─────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Scale size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Tax Declarations</h1>
                            <p className="text-xs font-medium text-slate-500">Investment declarations & TDS projection</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={fyFilter} onValueChange={setFyFilter}>
                            <SelectTrigger className="h-9 w-36 rounded-lg border-slate-200 bg-white font-semibold text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FISCAL_YEARS.map((fy) => (
                                    <SelectItem key={fy} value={fy}>FY {fy}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={() => setRegimeCompareOpen(true)}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Calculator size={14} /> <span className="hidden md:inline">Regime calc</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRecommendAll}
                            className="h-9 rounded-lg border-[#8B5CF6]/30 bg-[#8B5CF6]/5 font-semibold text-xs gap-2 px-3 hover:bg-[#8B5CF6]/10 text-[#8B5CF6]"
                        >
                            <Wand2 size={14} /> <span className="hidden md:inline">Auto-recommend all</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRemindPending}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Bell size={14} /> <span className="hidden md:inline">Remind pending</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export CSV</span>
                        </Button>
                        <Button
                            onClick={openAddForm}
                            className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2"
                        >
                            <Plus size={14} /> <span className="hidden md:inline">New declaration</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            <StatCard label="Total" value={String(stats.total)} caption={`FY ${fyFilter}`} icon={Bookmark} color="#8B5CF6" />
                            <StatCard label="Verified" value={String(stats.verified)} caption={`${stats.total ? Math.round((stats.verified / stats.total) * 100) : 0}% complete`} icon={ShieldCheck} color="#10B981" />
                            <StatCard label="Pending/Submitted" value={String(stats.pending + stats.submitted)} caption="Awaiting verification" icon={Clock} color="#F59E0B" />
                            <StatCard label="Rejected" value={String(stats.rejected)} caption="Needs resubmit" icon={AlertTriangle} color="#F43F5E" />
                            <StatCard label="TDS liability" value={formatINR(stats.totalTax)} caption={`Savings ${formatINR(stats.totalSavings)}`} icon={TrendingDown} color="#EC4899" />
                        </div>

                        {/* Regime distribution */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">Regime distribution</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">How employees have split across Old vs New for FY {fyFilter}.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 lg:p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <RegimeBar label="New Regime" count={stats.newCount} total={stats.total} color="#8B5CF6" />
                                    <RegimeBar label="Old Regime" count={stats.oldCount} total={stats.total} color="#EC4899" />
                                </div>
                                {stats.total > 0 && stats.pending + stats.submitted > 0 && (
                                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                                        <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] font-semibold text-amber-800">
                                            {stats.pending + stats.submitted} declarations still awaiting HR verification.
                                            Consider sending reminders before the FY closes.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Declarations table */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">Declaration ledger</CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                        {filteredDeclarations.length} of {fyDeclarations.length} declarations
                                    </CardDescription>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative flex-1 min-w-[200px] lg:w-60 lg:flex-none">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Search name, code, PAN..."
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
                                                    hasActiveFilters ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5" : "border-slate-200 text-slate-600")}
                                            >
                                                <Filter size={14} /> Filters
                                                {hasActiveFilters && (
                                                    <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold h-4 px-1.5">
                                                        {[statusFilter !== "all", regimeFilter !== "all", deptFilter !== "all"].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-64 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-900">Filters</h4>
                                                {hasActiveFilters && (
                                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs font-semibold text-rose-500 hover:text-rose-600 px-2">
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
                                                        <SelectItem value="Submitted">Submitted</SelectItem>
                                                        <SelectItem value="Verified">Verified</SelectItem>
                                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Regime</Label>
                                                <Select value={regimeFilter} onValueChange={setRegimeFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">Both regimes</SelectItem>
                                                        <SelectItem value="New">New</SelectItem>
                                                        <SelectItem value="Old">Old</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Department</Label>
                                                <Select value={deptFilter} onValueChange={setDeptFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All departments</SelectItem>
                                                        {availableDepts.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
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
                                                <Button size="sm" onClick={handleBulkVerify} className="h-7 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold px-3 rounded-md border-none">
                                                    <CheckCircle2 size={12} className="mr-1" /> Verify
                                                </Button>
                                                <Button size="sm" onClick={openBulkFlip} variant="outline" className="h-7 text-[11px] font-semibold px-3 rounded-md border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/5">
                                                    <ArrowLeftRight size={12} className="mr-1" /> Flip regime
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
                                                        checked={filteredDeclarations.length > 0 && filteredDeclarations.every((d) => selectedIds.includes(d.id))}
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={filteredDeclarations.length === 0}
                                                        className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                    />
                                                </TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Regime</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Savings</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Est. TDS</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Proofs</TableHead>
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredDeclarations.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                        {fyDeclarations.length === 0 ? `No declarations for FY ${fyFilter}.` : "No declarations match the current filters."}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredDeclarations.map((dec) => {
                                                    const proofCount = linkedProofs(dec.id).length
                                                    return (
                                                        <TableRow key={dec.id} className={cn("group border-slate-50", selectedIds.includes(dec.id) ? "bg-[#8B5CF6]/5 hover:bg-[#8B5CF6]/10" : "hover:bg-slate-50/70")}>
                                                            <TableCell className="pl-6 py-3">
                                                                <Checkbox
                                                                    checked={selectedIds.includes(dec.id)}
                                                                    onCheckedChange={() => toggleSelect(dec.id)}
                                                                    className="border-slate-300 data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0">
                                                                        {dec.employeeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-sm font-semibold text-slate-900 truncate">{dec.employeeName}</div>
                                                                        <div className="text-[11px] font-medium text-slate-500 truncate">
                                                                            {dec.empCode ?? dec.employeeId}{dec.dept ? ` • ${dec.dept}` : ""}{dec.pan ? ` • ${dec.pan}` : ""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <Badge
                                                                    className="border-none text-[10px] font-semibold px-2 py-0.5"
                                                                    style={{
                                                                        backgroundColor: dec.regime === "New" ? "#8B5CF620" : "#EC489920",
                                                                        color: dec.regime === "New" ? "#8B5CF6" : "#EC4899",
                                                                    }}
                                                                >
                                                                    {dec.regime}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-3 text-sm font-semibold text-slate-800 tabular-nums">{formatINR(dec.totalSavings)}</TableCell>
                                                            <TableCell className="py-3 text-sm font-bold text-rose-600 tabular-nums">{formatINR(dec.estimatedTax)}</TableCell>
                                                            <TableCell className="py-3">
                                                                {proofCount > 0 ? (
                                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-semibold px-2">
                                                                        {proofCount} linked
                                                                    </Badge>
                                                                ) : (
                                                                    <span className="text-[11px] font-medium text-slate-400">—</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-3">
                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                    <Badge className={cn("border-none text-[10px] font-semibold px-2 py-0.5",
                                                                        dec.status === "Verified" ? "bg-emerald-50 text-emerald-600" :
                                                                            dec.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                                                dec.status === "Submitted" ? "bg-blue-50 text-blue-600" :
                                                                                    "bg-amber-50 text-amber-600")}>
                                                                        {dec.status}
                                                                    </Badge>
                                                                    {dec.lockedUntil && new Date(dec.lockedUntil) > new Date() && (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Lock size={12} className="text-amber-500" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Locked until {dec.lockedUntil}</TooltipContent>
                                                                        </Tooltip>
                                                                    )}
                                                                    {dec.recommendedRegime && dec.recommendedRegime !== dec.regime && (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[9px] font-bold gap-0.5 px-1.5">
                                                                                    <Wand2 size={9} /> → {dec.recommendedRegime}
                                                                                </Badge>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                Save ~{formatINR(dec.recommendedSavings ?? 0)}/yr by switching
                                                                            </TooltipContent>
                                                                        </Tooltip>
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
                                                                                onClick={() => { setSelectedDec(dec); setDetailOpen(true) }}
                                                                                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100"
                                                                            >
                                                                                <Eye size={14} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>View details</TooltipContent>
                                                                    </Tooltip>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                <MoreHorizontal size={15} />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-48">
                                                                            {dec.status !== "Verified" && (
                                                                                <DropdownMenuItem onClick={() => handleApprove(dec)} className="cursor-pointer text-xs font-medium text-emerald-600">
                                                                                    <CheckCircle2 size={13} className="mr-2" /> Verify
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            {dec.status !== "Rejected" && (
                                                                                <DropdownMenuItem onClick={() => openRejectDialog(dec.id)} className="cursor-pointer text-xs font-medium text-rose-600">
                                                                                    <XCircle size={13} className="mr-2" /> Reject
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuItem onClick={() => openEditForm(dec)} disabled={!!dec.lockedUntil && new Date(dec.lockedUntil) > new Date()} className="cursor-pointer text-xs font-medium">
                                                                                <Edit size={13} className="mr-2" /> Edit
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => router.push(`/hrmcubicle/payroll/proof-submission?employeeId=${dec.employeeId}`)}
                                                                                className="cursor-pointer text-xs font-medium"
                                                                            >
                                                                                <Link2 size={13} className="mr-2" /> View proofs
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            {/* ─ Round 2 ─ */}
                                                                            <DropdownMenuItem onClick={() => handleRecommendSingle(dec)} className="cursor-pointer text-xs font-medium text-[#8B5CF6]">
                                                                                <Wand2 size={13} className="mr-2" /> Recommend regime
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => openPlanner(dec)} className="cursor-pointer text-xs font-medium">
                                                                                <PiggyBank size={13} className="mr-2" /> Investment planner
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleRunGap(dec)} className="cursor-pointer text-xs font-medium">
                                                                                <Target size={13} className="mr-2" /> Gap analysis
                                                                            </DropdownMenuItem>
                                                                            {dec.lockedUntil && new Date(dec.lockedUntil) > new Date() ? (
                                                                                <DropdownMenuItem onClick={() => handleUnlock(dec)} className="cursor-pointer text-xs font-medium text-amber-600">
                                                                                    <Unlock size={13} className="mr-2" /> Unlock window
                                                                                </DropdownMenuItem>
                                                                            ) : (
                                                                                <DropdownMenuItem onClick={() => openLockDialog(dec)} className="cursor-pointer text-xs font-medium text-amber-600">
                                                                                    <Lock size={13} className="mr-2" /> Lock window
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem onClick={() => handleDelete(dec.id)} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
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
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add/Edit Tax Declaration Sheet */}
                <SideFormSheet
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    title={editingDec ? "Edit declaration" : "New tax declaration"}
                    description="Enter employee info + investment declarations. Tax auto-calculates from slabs (rough)."
                    icon={editingDec ? <Edit size={20} /> : <ShieldCheck size={20} />}
                    accentColor={editingDec ? "#7c3aed" : "#4f46e5"}
                    width="xl"
                    submitLabel={editingDec ? "Save changes" : "Add declaration"}
                    onSubmit={(e) => { e.preventDefault(); handleSubmitForm(); }}
                >
                    <div className="space-y-5">
                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormField label="Employee code">
                                            <Input value={formData.empCode ?? ""} onChange={(e) => setFormData({ ...formData, empCode: e.target.value })} placeholder="EMP001" className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Employee name" required>
                                            <Input value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Employee ID" required>
                                            <Input value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="PAN">
                                            <Input value={formData.pan ?? ""} onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className="h-10 text-sm font-medium font-mono" maxLength={10} />
                                        </FormField>
                                        <FormField label="Department">
                                            <Input value={formData.dept ?? ""} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} className="h-10 text-sm font-medium" />
                                        </FormField>
                                        <FormField label="Fiscal year" required>
                                            <Select value={formData.fiscalYear} onValueChange={(v) => setFormData({ ...formData, fiscalYear: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {FISCAL_YEARS.map((fy) => (<SelectItem key={fy} value={fy}>FY {fy}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Income & regime</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <FormField label="Gross salary (₹/yr)">
                                            <Input type="number" value={formData.grossSalary ?? 0} onChange={(e) => setFormData({ ...formData, grossSalary: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                        </FormField>
                                        <FormField label="Basic salary (₹/yr)">
                                            <Input type="number" value={formData.basicSalary ?? 0} onChange={(e) => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                        </FormField>
                                        <FormField label="Regime">
                                            <Select value={formData.regime} onValueChange={(v: "Old" | "New") => setFormData({ ...formData, regime: v })}>
                                                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="New">New (default)</SelectItem>
                                                    <SelectItem value="Old">Old (with deductions)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Declaration line items</h4>
                                        {formData.regime === "New" && (
                                            <Badge className="bg-amber-50 text-amber-700 border-none text-[10px] font-semibold">
                                                Deductions ignored in New regime
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Add line item */}
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                                            <div className="md:col-span-4">
                                                <Select value={newLineCategory} onValueChange={setNewLineCategory}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {INVESTMENT_CATEGORIES.map((c) => (
                                                            <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="md:col-span-4">
                                                <Select value={newLineSubCategory} onValueChange={setNewLineSubCategory}>
                                                    <SelectTrigger className="h-9 text-xs">
                                                        <SelectValue placeholder="Sub-type (optional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(INVESTMENT_CATEGORIES.find((c) => c.code === newLineCategory)?.subTypes ?? []).map((st) => (
                                                            <SelectItem key={st} value={st}>{st}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="md:col-span-3">
                                                <Input type="number" placeholder="Amount" value={newLineAmount} onChange={(e) => setNewLineAmount(e.target.value)} className="h-9 text-xs font-semibold tabular-nums" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <Button onClick={addLineItem} size="sm" className="h-9 w-full bg-[#8B5CF6] hover:bg-[#7c4dff] text-white font-semibold text-xs">
                                                    <Plus size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                        {INVESTMENT_CATEGORIES.find((c) => c.code === newLineCategory)?.max !== -1 && (
                                            <p className="text-[11px] font-medium text-slate-500">
                                                Cap: {formatINR(INVESTMENT_CATEGORIES.find((c) => c.code === newLineCategory)?.max ?? 0)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Line items list */}
                                    {formData.declarations.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic text-center py-4">No declarations yet. Add line items above.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {formData.declarations.map((d, i) => (
                                                <div key={d.id ?? i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                                    <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-bold shrink-0">{d.category}</Badge>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-slate-800 truncate">{d.subCategory ?? d.category}</div>
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-900 tabular-nums">{formatINR(d.amount)}</div>
                                                    <Button variant="ghost" size="sm" onClick={() => removeLineItem(i)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500">
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                <section className="p-4 bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 rounded-xl border border-[#8B5CF6]/10">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Projected tax</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total savings</div>
                                            <div className="text-lg font-bold text-emerald-600 tabular-nums">{formatINR(formTotals.savings)}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Taxable income</div>
                                            <div className="text-lg font-bold text-slate-800 tabular-nums">{formatINR(formTotals.taxableIncome)}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Est. annual TDS</div>
                                            <div className="text-lg font-bold text-rose-600 tabular-nums">{formatINR(formTotals.tax)}</div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500 mt-2 italic">
                                        * Rough projection based on simplified slabs. Actual TDS may vary.
                                    </p>
                                </section>
                    </div>
                </SideFormSheet>

                {/* ── Detail Sheet ───────────────────── */}
                <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
                    <SheetContent className="sm:max-w-xl p-0 font-sans">
                        {selectedDec && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-50 p-6 border-b border-slate-100 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <Badge
                                                className="border-none text-[10px] font-semibold px-2 py-0.5 mb-2 w-fit"
                                                style={{
                                                    backgroundColor: selectedDec.regime === "New" ? "#8B5CF620" : "#EC489920",
                                                    color: selectedDec.regime === "New" ? "#8B5CF6" : "#EC4899",
                                                }}
                                            >
                                                {selectedDec.regime} Regime • FY {selectedDec.fiscalYear}
                                            </Badge>
                                            <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">{selectedDec.employeeName}</SheetTitle>
                                            <SheetDescription className="text-[11px] font-medium text-slate-500 truncate">
                                                {selectedDec.empCode ?? selectedDec.employeeId} • {selectedDec.dept ?? "—"}{selectedDec.pan ? ` • PAN ${selectedDec.pan}` : ""}
                                            </SheetDescription>
                                        </div>
                                        <Badge className={cn("border-none text-[10px] font-semibold px-2 shrink-0",
                                            selectedDec.status === "Verified" ? "bg-emerald-50 text-emerald-600" :
                                                selectedDec.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                    selectedDec.status === "Submitted" ? "bg-blue-50 text-blue-600" :
                                                        "bg-amber-50 text-amber-600")}>
                                            {selectedDec.status}
                                        </Badge>
                                    </div>
                                </SheetHeader>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-5">
                                        <section className="grid grid-cols-2 gap-3">
                                            <MetricCard label="Gross salary" value={formatINR(selectedDec.grossSalary ?? 0)} />
                                            <MetricCard label="Basic salary" value={formatINR(selectedDec.basicSalary ?? 0)} />
                                            <MetricCard label="Total savings" value={formatINR(selectedDec.totalSavings)} color="text-emerald-600" />
                                            <MetricCard label="Taxable income" value={formatINR(selectedDec.taxableIncome ?? 0)} />
                                            <MetricCard label="Est. annual TDS" value={formatINR(selectedDec.estimatedTax)} color="text-rose-600" />
                                            <MetricCard label="Monthly TDS" value={formatINR(selectedDec.estimatedTax / 12)} color="text-rose-600" />
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Declaration breakdown ({selectedDec.declarations.length})
                                            </div>
                                            {selectedDec.declarations.length === 0 ? (
                                                <p className="text-xs text-slate-400 italic">No line items declared.</p>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    {selectedDec.declarations.map((d, i) => (
                                                        <div key={d.id ?? i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                                                            <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[10px] font-bold shrink-0 w-20 justify-center">{d.category}</Badge>
                                                            <span className="text-xs font-medium text-slate-700 flex-1 truncate">{d.subCategory ?? "—"}</span>
                                                            <span className="text-sm font-bold text-slate-900 tabular-nums">{formatINR(d.amount)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Linked proofs ({linkedProofs(selectedDec.id).length})
                                            </div>
                                            {linkedProofs(selectedDec.id).length === 0 ? (
                                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                                                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] font-semibold text-amber-800">
                                                        No proofs attached yet. Employee must submit documents before verification.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    {linkedProofs(selectedDec.id).map((p) => (
                                                        <div key={p.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                                                            <FileText size={14} className="text-[#8B5CF6] shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-semibold text-slate-800 truncate">{p.documentName ?? p.type}</div>
                                                                <div className="text-[10px] font-medium text-slate-500">{p.type} • {formatINR(p.amount)}</div>
                                                            </div>
                                                            <Badge className={cn("border-none text-[9px] font-bold px-1.5",
                                                                p.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                                    p.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                                        "bg-amber-50 text-amber-600")}>{p.status}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <Button
                                                onClick={() => router.push(`/hrmcubicle/payroll/proof-submission?employeeId=${selectedDec.employeeId}`)}
                                                variant="outline"
                                                className="w-full mt-3 h-9 border-slate-200 text-slate-600 font-semibold text-xs gap-2"
                                            >
                                                <Link2 size={13} /> Go to proof submissions
                                            </Button>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timeline</div>
                                            <div className="space-y-1.5">
                                                <TimelineRow label="Submitted" value={selectedDec.submittedDate ?? "—"} />
                                                {selectedDec.verifiedDate && <TimelineRow label="Verified" value={`${selectedDec.verifiedDate}${selectedDec.verifiedBy ? ` by ${selectedDec.verifiedBy}` : ""}`} valueColor="text-emerald-600" />}
                                                {selectedDec.rejectedDate && <TimelineRow label="Rejected" value={selectedDec.rejectedDate} valueColor="text-rose-600" />}
                                            </div>
                                        </section>

                                        {selectedDec.rejectionReason && (
                                            <section>
                                                <div className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Rejection reason</div>
                                                <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                                                    <p className="text-xs font-semibold text-rose-800">{selectedDec.rejectionReason}</p>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                </ScrollArea>

                                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2 flex-wrap">
                                    {selectedDec.status !== "Verified" && (
                                        <Button
                                            onClick={() => { handleApprove(selectedDec); setDetailOpen(false) }}
                                            className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none"
                                        >
                                            <CheckCircle2 size={13} className="mr-1.5" /> Verify
                                        </Button>
                                    )}
                                    {selectedDec.status !== "Rejected" && (
                                        <Button
                                            onClick={() => { openRejectDialog(selectedDec.id); setDetailOpen(false) }}
                                            variant="outline"
                                            className="flex-1 h-10 text-rose-500 border-rose-200 font-bold text-xs hover:bg-rose-50"
                                        >
                                            <XCircle size={13} className="mr-1.5" /> Reject
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => { openEditForm(selectedDec); setDetailOpen(false) }}
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

                {/* Reject Sheet */}
                <SideFormSheet
                    open={rejectOpen}
                    onOpenChange={setRejectOpen}
                    title="Reject declaration"
                    description="Explain what's wrong so the employee can resubmit."
                    icon={<XCircle size={20} />}
                    accentColor="#e11d48"
                    width="md"
                    submitLabel="Confirm reject"
                    onSubmit={(e) => { e.preventDefault(); handleConfirmReject(); }}
                >
                    <Field label="Reason" required>
                        <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g., Missing proofs, PAN mismatch..." />
                    </Field>
                </SideFormSheet>

                {/* ── Bulk Delete Confirm ─────────── */}
                <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete {selectedIds.length} declaration{selectedIds.length > 1 ? "s" : ""}?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleBulkDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Regime Compare ───────────────── */}
                <RegimeCompareDialog open={regimeCompareOpen} onOpenChange={setRegimeCompareOpen} />

                {/* ──────────── Round 2 Dialogs ──────────── */}

                {/* Lock Window Sheet */}
                <SideFormSheet
                    open={lockDialogOpen}
                    onOpenChange={setLockDialogOpen}
                    title="Lock declaration"
                    description={lockTarget ? `Employee won't be able to edit ${lockTarget.employeeName}'s declaration until the unlock date.` : undefined}
                    icon={<Lock size={20} />}
                    accentColor="#d97706"
                    width="md"
                    submitLabel="Lock"
                    onSubmit={(e) => { e.preventDefault(); handleConfirmLock(); }}
                >
                    <div className="space-y-4">
                        <Field label="Locked until" hint="Commonly the tax filing window closure (e.g. last day of January).">
                            <Input type="date" value={lockUntilDate} onChange={(e) => setLockUntilDate(e.target.value)} />
                        </Field>
                        <Field label="Reason (optional)">
                            <Textarea value={lockReasonInput} onChange={(e) => setLockReasonInput(e.target.value)} placeholder="e.g. FY window closed, awaiting proofs..." />
                        </Field>
                    </div>
                </SideFormSheet>

                {/* Bulk Flip Sheet */}
                <SideFormSheet
                    open={bulkFlipOpen}
                    onOpenChange={setBulkFlipOpen}
                    title="Bulk flip regime"
                    description={`Change regime for ${selectedIds.length} declarations. Tax computations update instantly.`}
                    icon={<ArrowLeftRight size={20} />}
                    accentColor="#4f46e5"
                    width="md"
                    submitLabel={`Flip ${selectedIds.length} to ${bulkFlipTarget}`}
                    onSubmit={(e) => { e.preventDefault(); handleConfirmBulkFlip(); }}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setBulkFlipTarget("Old")}
                            className={cn("p-3 rounded-xl border-2 text-left",
                                bulkFlipTarget === "Old" ? "border-[#EC4899] bg-[#EC4899]/5" : "border-slate-200 bg-white")}
                        >
                            <div className="text-sm font-bold text-slate-900">Old Regime</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">Higher rates, but deductions allowed</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setBulkFlipTarget("New")}
                            className={cn("p-3 rounded-xl border-2 text-left",
                                bulkFlipTarget === "New" ? "border-[#8B5CF6] bg-[#8B5CF6]/5" : "border-slate-200 bg-white")}
                        >
                            <div className="text-sm font-bold text-slate-900">New Regime</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">Lower rates, no deductions</div>
                        </button>
                    </div>
                </SideFormSheet>

                {/* ── Investment Planner ───── */}
                <Dialog open={plannerOpen} onOpenChange={setPlannerOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-auto">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                                <PiggyBank size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Investment planner — {plannerTarget?.employeeName}</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Simulate tax savings by adjusting investments. Numbers update live.
                            </DialogDescription>
                        </DialogHeader>
                        {plannerTarget && (() => {
                            const gross = plannerTarget.grossSalary ?? 0
                            const totalSim = plannerSec80C + plannerSec80D + plannerHRA + plannerSec24 + plannerNPS
                            // Recompute tax with simulated deductions
                            const taxOld = Math.max(0, (() => {
                                const taxable = Math.max(0, gross - totalSim)
                                let t = 0, prev = 0
                                const slabs = [{ upto: 250000, rate: 0 }, { upto: 500000, rate: 0.05 }, { upto: 1000000, rate: 0.20 }, { upto: Infinity, rate: 0.30 }]
                                for (const s of slabs) {
                                    if (taxable > prev) { t += (Math.min(taxable, s.upto) - prev) * s.rate; prev = s.upto }
                                }
                                return Math.round(t * 1.04)
                            })())
                            const taxNew = Math.max(0, (() => {
                                const taxable = gross
                                let t = 0, prev = 0
                                const slabs = [{ upto: 300000, rate: 0 }, { upto: 700000, rate: 0.05 }, { upto: 1000000, rate: 0.10 }, { upto: 1200000, rate: 0.15 }, { upto: 1500000, rate: 0.20 }, { upto: Infinity, rate: 0.30 }]
                                for (const s of slabs) {
                                    if (taxable > prev) { t += (Math.min(taxable, s.upto) - prev) * s.rate; prev = s.upto }
                                }
                                return Math.round(t * 1.04)
                            })())
                            const currentTax = plannerTarget.regime === "Old" ? taxOld : taxNew
                            const currentTaxBaseline = plannerTarget.estimatedTax
                            const savedVsBaseline = currentTaxBaseline - currentTax
                            return (
                                <div className="mt-4 space-y-4">
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                                        Gross salary: <strong>{formatINR(gross)}</strong> • Current regime: <strong>{plannerTarget.regime}</strong> • Baseline tax: <strong>{formatINR(plannerTarget.estimatedTax)}</strong>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <PlannerInput label="80C (LIC/PPF/ELSS)" max={150000} value={plannerSec80C} onChange={setPlannerSec80C} />
                                        <PlannerInput label="80D (Health Insurance)" max={100000} value={plannerSec80D} onChange={setPlannerSec80D} />
                                        <PlannerInput label="80CCD(1B) NPS" max={50000} value={plannerNPS} onChange={setPlannerNPS} />
                                        <PlannerInput label="HRA" max={(plannerTarget.basicSalary ?? 0) * 0.5} value={plannerHRA} onChange={setPlannerHRA} />
                                        <PlannerInput label="Sec 24 (Home Loan)" max={200000} value={plannerSec24} onChange={setPlannerSec24} />
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 border border-[#8B5CF6]/10 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={cn("p-3 rounded-lg border-2",
                                                taxOld < taxNew ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white")}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-bold text-slate-700">Old regime tax</span>
                                                    {taxOld < taxNew && <Badge className="bg-emerald-500 text-white border-none text-[9px] font-bold">Better</Badge>}
                                                </div>
                                                <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(taxOld)}</div>
                                            </div>
                                            <div className={cn("p-3 rounded-lg border-2",
                                                taxNew < taxOld ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white")}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-bold text-slate-700">New regime tax</span>
                                                    {taxNew < taxOld && <Badge className="bg-emerald-500 text-white border-none text-[9px] font-bold">Better</Badge>}
                                                </div>
                                                <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(taxNew)}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total simulated deductions</div>
                                                <div className="text-lg font-bold text-emerald-600 tabular-nums mt-0.5">{formatINR(totalSim)}</div>
                                            </div>
                                            <div className={cn("p-2.5 rounded-lg border",
                                                savedVsBaseline > 0 ? "bg-emerald-50 border-emerald-200" :
                                                    savedVsBaseline < 0 ? "bg-rose-50 border-rose-200" :
                                                        "bg-slate-50 border-slate-200")}>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Savings vs baseline</div>
                                                <div className={cn("text-lg font-bold tabular-nums mt-0.5",
                                                    savedVsBaseline > 0 ? "text-emerald-600" : savedVsBaseline < 0 ? "text-rose-600" : "text-slate-700")}>
                                                    {savedVsBaseline > 0 ? "+" : ""}{formatINR(savedVsBaseline)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setPlannerOpen(false)} className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs border-none">
                                Done
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Gap Analysis Dialog ───── */}
                <Dialog open={gapOpen} onOpenChange={setGapOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Target size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Gap analysis — {gapTarget?.employeeName}</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                How close the employee is to maximum possible tax-saving.
                            </DialogDescription>
                        </DialogHeader>
                        {gapTarget && (
                            <div className="mt-4 space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Declared</div>
                                        <div className="text-base font-bold text-slate-900 tabular-nums mt-0.5">{formatINR(gapTarget.totalSavings)}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Max possible</div>
                                        <div className="text-base font-bold text-emerald-700 tabular-nums mt-0.5">{formatINR(gapTarget.maxPossibleSavings ?? 0)}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                        <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Unused</div>
                                        <div className="text-base font-bold text-amber-700 tabular-nums mt-0.5">{formatINR(gapTarget.gapFromMax ?? 0)}</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <Sparkles size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                        <div className="text-xs text-blue-900 font-medium leading-relaxed">
                                            This employee has <strong>{formatINR(gapTarget.gapFromMax ?? 0)}</strong> of unused deduction headroom.
                                            Encouraging more 80C / 80D / NPS investment could save them up to <strong>~{formatINR((gapTarget.gapFromMax ?? 0) * 0.3)}</strong> more in tax (30% slab).
                                        </div>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (gapTarget.totalSavings / (gapTarget.maxPossibleSavings ?? 1)) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-[10px] font-medium text-slate-500 text-center">
                                    {((gapTarget.totalSavings / (gapTarget.maxPossibleSavings ?? 1)) * 100).toFixed(0)}% of maximum deduction utilized
                                </p>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setGapOpen(false)} className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Recommend All Result ─── */}
                <Dialog open={!!recommendResult} onOpenChange={(open) => !open && setRecommendResult(null)}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Wand2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Regime analysis complete</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Ran the regime optimiser across all declarations.
                            </DialogDescription>
                        </DialogHeader>
                        {recommendResult && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Analyzed</div>
                                    <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{recommendResult.analyzed}</div>
                                </div>
                                <div className={cn("p-4 rounded-xl border",
                                    recommendResult.switched > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200")}>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Should switch</div>
                                    <div className={cn("text-2xl font-bold tabular-nums mt-1",
                                        recommendResult.switched > 0 ? "text-amber-700" : "text-emerald-700")}>
                                        {recommendResult.switched}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setRecommendResult(null)} className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none">Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

const PlannerInput = ({ label, max, value, onChange }: { label: string; max: number; value: number; onChange: (v: number) => void }) => (
    <div className="space-y-1">
        <div className="flex items-center justify-between">
            <Label className="text-[11px] font-semibold text-slate-600">{label}</Label>
            {max > 0 && <span className="text-[9px] font-bold text-slate-400">max ₹{max.toLocaleString()}</span>}
        </div>
        <Input
            type="number"
            value={value}
            onChange={(e) => {
                const v = parseFloat(e.target.value) || 0
                onChange(max > 0 ? Math.min(max, v) : v)
            }}
            className="h-9 text-xs font-semibold tabular-nums"
        />
    </div>
)

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

const MetricCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={cn("text-sm font-bold tabular-nums mt-0.5", color ?? "text-slate-900")}>{value}</div>
    </div>
)

const RegimeBar = ({ label, count, total, color }: { label: string; count: number; total: number; color: string }) => {
    const pct = total ? (count / total) * 100 : 0
    return (
        <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-700">{label}</span>
                <span className="text-xs font-bold tabular-nums" style={{ color }}>
                    {count} <span className="text-slate-400 text-[10px]">({Math.round(pct)}%)</span>
                </span>
            </div>
            <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    )
}

const TimelineRow = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
    <div className="flex justify-between items-center py-1 text-xs">
        <span className="font-medium text-slate-500">{label}</span>
        <span className={cn("font-semibold", valueColor ?? "text-slate-800")}>{value}</span>
    </div>
)

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {children}
    </div>
)

// Regime comparison calculator
const RegimeCompareDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
    const [gross, setGross] = useState(1000000)
    const [deductions, setDeductions] = useState(150000)
    const oldTax = calculateTax(Math.max(0, gross - deductions), "Old")
    const newTax = calculateTax(gross, "New")
    const better = oldTax < newTax ? "Old" : "New"
    const savings = Math.abs(oldTax - newTax)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                <DialogHeader className="space-y-1">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                        <Calculator size={20} />
                    </div>
                    <DialogTitle className="text-lg font-bold text-slate-900">Tax regime calculator</DialogTitle>
                    <DialogDescription className="text-xs font-medium text-slate-500">
                        Quick comparison of Old vs New regime for FY 2025-26. Simplified slabs — actual may vary.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                    <FormField label="Gross annual income (₹)">
                        <Input type="number" value={gross} onChange={(e) => setGross(parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>
                    <FormField label="Total deductions (80C, HRA, 80D, etc.) (₹)">
                        <Input type="number" value={deductions} onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)} className="h-10 text-sm font-semibold tabular-nums" />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className={cn("p-4 rounded-xl border-2", better === "Old" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50")}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700">Old regime</span>
                                {better === "Old" && <Badge className="bg-emerald-500 text-white border-none text-[9px] font-bold">Better</Badge>}
                            </div>
                            <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(oldTax)}</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">After ₹{deductions.toLocaleString()} deductions</div>
                        </div>
                        <div className={cn("p-4 rounded-xl border-2", better === "New" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50")}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700">New regime</span>
                                {better === "New" && <Badge className="bg-emerald-500 text-white border-none text-[9px] font-bold">Better</Badge>}
                            </div>
                            <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(newTax)}</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">No deductions allowed</div>
                        </div>
                    </div>

                    {savings > 0 && (
                        <div className="p-3 bg-[#8B5CF6]/5 rounded-lg border border-[#8B5CF6]/10 flex items-center gap-2">
                            <Calculator size={16} className="text-[#8B5CF6] shrink-0" />
                            <p className="text-xs font-semibold text-slate-700">
                                <span className="text-[#8B5CF6] font-bold">{better} regime</span> saves approx{" "}
                                <span className="text-[#8B5CF6] font-bold tabular-nums">{formatINR(savings)}</span> annually.
                            </p>
                        </div>
                    )}
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={() => onOpenChange(false)} className="w-full h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none">
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TaxDeclarationsPage
